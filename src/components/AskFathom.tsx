"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, MessageSquareText, SendHorizontal, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const PRESET_PROMPTS = [
  "What were the key decisions?",
  "Draft a follow-up email",
  "List unresolved questions",
  "Summarize action items",
] as const;

type AskFathomProps = {
  open: boolean;
  onClose: () => void;
  meetingId: string;
  className?: string;
};

function messageText(
  message: { parts: Array<{ type: string; text?: string }> },
): string {
  return message.parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text as string)
    .join("");
}

export function AskFathom({ open, onClose, meetingId, className }: AskFathomProps) {
  const [input, setInput] = useState("");
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { meetingId },
      }),
    [meetingId],
  );
  const { messages, sendMessage, status, error, setMessages } = useChat({
    id: `ask-fathom-${meetingId}`,
    transport,
  });

  const isBusy = status === "submitted" || status === "streaming";

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    setInput("");
    await sendMessage({ text: trimmed });
  }

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-l border-zinc-800 bg-[#0f1419] text-zinc-100 transition-all",
        open ? "opacity-100" : "pointer-events-none opacity-0",
        className,
      )}
      aria-hidden={!open}
    >
      <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">Ask Fathom</p>
            <p className="text-[11px] text-zinc-500">Meeting-aware AI assistant</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="Close Ask Fathom"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700/80 bg-zinc-900/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-teal-400">
              <MessageSquareText className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Try asking
              </span>
            </div>
            <p className="mb-3 text-sm text-zinc-400">
              Ask anything about this recording. Answers are grounded in the
              transcript, decisions, and action items.
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={isBusy}
                  onClick={() => void submit(prompt)}
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-left text-xs text-zinc-200 transition hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-100 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const text = messageText(message);
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={cn("flex", isUser ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                    isUser
                      ? "bg-teal-600 text-white"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-200",
                  )}
                >
                  {!isUser && (
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-teal-400/90">
                      Ask Fathom
                    </p>
                  )}
                  {text || (isBusy && !isUser ? "…" : "")}
                </div>
              </div>
            );
          })
        )}

        {isBusy && messages.at(-1)?.role === "user" && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Thinking…
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error.message}
          </p>
        )}
      </div>

      {messages.length > 0 && (
        <div className="border-t border-zinc-800 px-4 py-2">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {PRESET_PROMPTS.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={isBusy}
                onClick={() => void submit(prompt)}
                className="rounded-full border border-zinc-800 px-2.5 py-1 text-[11px] text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setMessages([])}
              className="ml-auto text-[11px] text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <form
        className="border-t border-zinc-800 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          void submit(input);
        }}
      >
        <div className="flex items-end gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-2.5 py-2 focus-within:border-teal-500/60">
          <textarea
            rows={2}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit(input);
              }
            }}
            placeholder="Ask about this meeting…"
            className="max-h-28 min-h-[2.5rem] flex-1 resize-none bg-transparent px-1 py-1 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={isBusy || !input.trim()}
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            aria-label="Send message"
          >
            {isBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </aside>
  );
}
