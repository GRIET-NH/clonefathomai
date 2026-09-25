import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import {
  buildMeetingSystemPrompt,
  buildSimulatedReply,
  resolveMeeting,
} from "@/lib/meetingContext";
import type { Meeting } from "@/data/mockMeeting";

export const maxDuration = 60;

function hasAiCredentials(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
}

function extractLastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== "user") continue;
    const text = message.parts
      .filter((part): part is { type: "text"; text: string } => part.type === "text")
      .map((part) => part.text)
      .join("\n")
      .trim();
    if (text) return text;
  }
  return "";
}

async function simulatedStreamResponse(
  userText: string,
  meeting: Meeting,
): Promise<Response> {
  const reply = buildSimulatedReply(userText, meeting);
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = "ask-fathom-sim";
      writer.write({ type: "text-start", id });

      const chunkSize = 12;
      for (let i = 0; i < reply.length; i += chunkSize) {
        writer.write({
          type: "text-delta",
          id,
          delta: reply.slice(i, i + chunkSize),
        });
        await new Promise((resolve) => setTimeout(resolve, 12));
      }

      writer.write({ type: "text-end", id });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function POST(req: Request) {
  const {
    messages,
    meetingId,
  }: { messages: UIMessage[]; meetingId?: string } = await req.json();

  const meeting = resolveMeeting(meetingId);
  const system = buildMeetingSystemPrompt(meeting);

  if (!hasAiCredentials()) {
    return simulatedStreamResponse(extractLastUserText(messages), meeting);
  }

  try {
    const result = streamText({
      model: "openai/gpt-5.4",
      system,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Ask Fathom model stream failed, using simulated reply:", error);
    return simulatedStreamResponse(extractLastUserText(messages), meeting);
  }
}
