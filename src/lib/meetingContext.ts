import { getMeetingById, mockMeeting, type Meeting } from "@/data/mockMeeting";

export function resolveMeeting(meetingId?: string): Meeting {
  if (!meetingId) return mockMeeting;
  return getMeetingById(meetingId) ?? mockMeeting;
}

export function buildMeetingSystemPrompt(meeting: Meeting = mockMeeting): string {
  const speakers = Object.fromEntries(
    meeting.attendees.map((a) => [a.id, a.name]),
  );

  const transcript = meeting.transcript
    .map((s) => {
      const name = speakers[s.speakerId] ?? "Speaker";
      const mins = Math.floor(s.start / 60);
      const secs = Math.floor(s.start % 60)
        .toString()
        .padStart(2, "0");
      return `[${mins}:${secs}] ${name}: ${s.text}`;
    })
    .join("\n");

  const actions = meeting.actionItems
    .map((a) => {
      const owner =
        meeting.attendees.find((x) => x.id === a.assigneeId)?.name ?? "Unassigned";
      return `- ${a.text} (owner: ${owner}, due: ${a.dueLabel})`;
    })
    .join("\n");

  return `You are Ask Fathom, an AI meeting assistant embedded in a Fathom-style meeting viewer.
Answer only using the meeting context below. Be concise, specific, and cite speakers when helpful.
If something is not in the meeting, say you don't see it in this recording.

MEETING
Title: ${meeting.title}
When: ${meeting.dateLabel}
Duration: ${meeting.durationLabel}
Attendees: ${meeting.attendees.map((a) => `${a.name} (${a.role})`).join(", ")}

SUMMARY
${meeting.summary}

KEY DECISIONS
${meeting.keyDecisions.map((d) => `- ${d}`).join("\n")}

OPEN QUESTIONS
${meeting.openQuestions.map((q) => `- ${q}`).join("\n")}

ACTION ITEMS
${actions}

TRANSCRIPT
${transcript}`;
}

/** Heuristic reply used when no AI Gateway / provider key is configured. */
export function buildSimulatedReply(
  userText: string,
  meeting: Meeting = mockMeeting,
): string {
  const q = userText.toLowerCase();
  const byId = Object.fromEntries(meeting.attendees.map((a) => [a.id, a.name]));

  if (
    q.includes("key decision") ||
    q.includes("decisions") ||
    q.includes("what did we decide")
  ) {
    return [
      `Here are the key decisions from **${meeting.title}**:`,
      "",
      ...meeting.keyDecisions.map((d, i) => `${i + 1}. ${d}`),
      "",
      "Maya Chen explicitly locked this scope near the 1:48 mark.",
    ].join("\n");
  }

  if (q.includes("follow-up") || q.includes("email") || q.includes("draft")) {
    const owners = meeting.actionItems
      .map((a) => `- ${a.text} — ${byId[a.assigneeId] ?? "TBD"} (${a.dueLabel})`)
      .join("\n");

    return [
      "Subject: Follow-up — Q4 Launch Readiness Sync",
      "",
      "Hi team,",
      "",
      `Thanks for joining today's sync on **${meeting.title}**. Quick recap:`,
      "",
      meeting.summary,
      "",
      "Action items:",
      owners,
      "",
      "Open questions still pending:",
      ...meeting.openQuestions.map((item) => `- ${item}`),
      "",
      "Reply-all if I missed anything.",
      "",
      "— Ask Fathom",
    ].join("\n");
  }

  if (
    q.includes("unresolved") ||
    q.includes("open question") ||
    q.includes("outstanding")
  ) {
    return [
      "Unresolved questions from the call:",
      "",
      ...meeting.openQuestions.map((item, i) => `${i + 1}. ${item}`),
      "",
      "Alex raised SSO vs magic-link and walkthrough ownership; Maya will decide on SSO by Monday.",
    ].join("\n");
  }

  if (q.includes("action") || q.includes("todo") || q.includes("next step")) {
    return [
      "Action items captured in this meeting:",
      "",
      ...meeting.actionItems.map((a) => {
        const owner = byId[a.assigneeId] ?? "Unassigned";
        return `- **${owner}** — ${a.text} (due ${a.dueLabel})`;
      }),
    ].join("\n");
  }

  if (q.includes("summar") || q.includes("recap") || q.includes("overview")) {
    return [
      `**${meeting.title}** (${meeting.dateLabel})`,
      "",
      meeting.summary,
      "",
      "Topics covered:",
      ...meeting.topics.map((t) => `- ${t.title}: ${t.summary}`),
    ].join("\n");
  }

  return [
    `Based on **${meeting.title}**, here's what I can pull from the recording:`,
    "",
    meeting.summary,
    "",
    "You can also try:",
    "- What were the key decisions?",
    "- Draft a follow-up email",
    "- List unresolved questions",
    "- Summarize action items",
  ].join("\n");
}
