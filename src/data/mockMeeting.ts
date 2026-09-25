export type Attendee = {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  initials: string;
};

export type TranscriptSegment = {
  id: string;
  speakerId: string;
  start: number;
  end: number;
  text: string;
};

export type ActionItem = {
  id: string;
  text: string;
  assigneeId: string;
  dueLabel: string;
  done: boolean;
};

export type TopicSection = {
  id: string;
  title: string;
  start: number;
  summary: string;
};

export type Meeting = {
  id: string;
  title: string;
  dateLabel: string;
  durationLabel: string;
  videoUrl: string;
  attendees: Attendee[];
  summary: string;
  keyDecisions: string[];
  openQuestions: string[];
  topics: TopicSection[];
  actionItems: ActionItem[];
  transcript: TranscriptSegment[];
};

export const mockMeeting: Meeting = {
  id: "mtg_product_sync_0924",
  title: "Product Sync — Q4 Launch Readiness",
  dateLabel: "Sep 24, 2026 · 10:00 AM",
  durationLabel: "32 min",
  videoUrl:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  attendees: [
    {
      id: "u_maya",
      name: "Maya Chen",
      role: "Product Lead",
      avatarColor: "#0d9488",
      initials: "MC",
    },
    {
      id: "u_jordan",
      name: "Jordan Blake",
      role: "Engineering",
      avatarColor: "#2563eb",
      initials: "JB",
    },
    {
      id: "u_priya",
      name: "Priya Nair",
      role: "Design",
      avatarColor: "#7c3aed",
      initials: "PN",
    },
    {
      id: "u_alex",
      name: "Alex Rivera",
      role: "Sales",
      avatarColor: "#ea580c",
      initials: "AR",
    },
  ],
  summary:
    "The team aligned on launching the Ask Fathom chat panel in the October release, deferred the multi-meeting search dashboard to a fast-follow, and confirmed clip sharing as a stretch goal. Engineering will spike streaming reliability this week; Design will ship updated empty states by Friday.",
  keyDecisions: [
    "Ship Ask Fathom chat in the October release as the primary differentiator.",
    "Defer multi-meeting dashboard search to a one-week fast-follow after launch.",
    "Treat clip creation as a stretch goal — only if streaming QA closes early.",
  ],
  openQuestions: [
    "Do we need SSO for the pilot cohort, or is email magic-link enough?",
    "Who owns the walkthrough video for the assignment submission?",
    "Should simulated AI responses stay as a fallback in production demos?",
  ],
  topics: [
    {
      id: "t1",
      title: "Launch scope lock",
      start: 0,
      summary:
        "Maya framed the 24-hour assignment constraints and proposed locking scope to the meeting viewer plus Ask Fathom.",
    },
    {
      id: "t2",
      title: "Streaming & reliability",
      start: 420,
      summary:
        "Jordan walked through Vercel AI SDK streaming, gateway auth, and a simulated fallback for offline demos.",
    },
    {
      id: "t3",
      title: "Design polish & handoff",
      start: 980,
      summary:
        "Priya shared empty states, preset prompt pills, and a collapsible Ask Fathom drawer pattern.",
    },
    {
      id: "t4",
      title: "Go-to-market & next steps",
      start: 1500,
      summary:
        "Alex asked for a draft follow-up email and confirmed pilot messaging for the sales demo template.",
    },
  ],
  actionItems: [
    {
      id: "a1",
      text: "Implement Ask Fathom panel with preset prompts and streaming replies",
      assigneeId: "u_jordan",
      dueLabel: "Today",
      done: false,
    },
    {
      id: "a2",
      text: "Deliver empty-state and prompt-pill visuals for the chat drawer",
      assigneeId: "u_priya",
      dueLabel: "Fri",
      done: false,
    },
    {
      id: "a3",
      text: "Draft pilot follow-up email using meeting summary",
      assigneeId: "u_alex",
      dueLabel: "Thu",
      done: false,
    },
    {
      id: "a4",
      text: "Confirm SSO vs magic-link for the first pilot cohort",
      assigneeId: "u_maya",
      dueLabel: "Mon",
      done: false,
    },
  ],
  transcript: [
    {
      id: "s1",
      speakerId: "u_maya",
      start: 8,
      end: 28,
      text: "Alright team — for this assignment we need a high-fidelity Fathom clone. Let's lock scope: meeting viewer first, then Ask Fathom chat.",
    },
    {
      id: "s2",
      speakerId: "u_jordan",
      start: 30,
      end: 52,
      text: "Agreed. I'll wire the AI SDK route with streaming. If there's no gateway key, we should still simulate token streaming so the demo never looks broken.",
    },
    {
      id: "s3",
      speakerId: "u_priya",
      start: 54,
      end: 78,
      text: "I'll design the right rail with Summary, Transcript, and Action Items, plus a collapsible Ask Fathom drawer with preset prompt pills.",
    },
    {
      id: "s4",
      speakerId: "u_alex",
      start: 80,
      end: 105,
      text: "From sales, the killer ask is drafting a follow-up email from the call. If Ask Fathom can do that from transcript context, we're in great shape.",
    },
    {
      id: "s5",
      speakerId: "u_maya",
      start: 108,
      end: 140,
      text: "Decision: Ask Fathom ships in October. Dashboard search slips to a fast-follow. Clip sharing is stretch only.",
    },
    {
      id: "s6",
      speakerId: "u_jordan",
      start: 145,
      end: 175,
      text: "I'll spike streaming reliability this week and keep the system prompt grounded in the meeting transcript and action items.",
    },
    {
      id: "s7",
      speakerId: "u_priya",
      start: 178,
      end: 205,
      text: "Empty states and prompt pills will be ready by Friday. Clicking a timestamp in the transcript should seek the video.",
    },
    {
      id: "s8",
      speakerId: "u_alex",
      start: 210,
      end: 240,
      text: "Open question — do pilots need SSO, or is magic-link enough for the first cohort? Also, who owns the walkthrough video?",
    },
    {
      id: "s9",
      speakerId: "u_maya",
      start: 245,
      end: 275,
      text: "I'll take the SSO decision by Monday. Jordan owns the walkthrough recording once Ask Fathom is live. Anything else?",
    },
    {
      id: "s10",
      speakerId: "u_jordan",
      start: 278,
      end: 300,
      text: "Nope — I'll start on the chat panel now and make sure preset prompts for key decisions, follow-up email, and open questions all work.",
    },
  ],
};

export function getAttendee(meeting: Meeting, id: string): Attendee {
  return (
    meeting.attendees.find((a) => a.id === id) ?? {
      id,
      name: "Unknown",
      role: "",
      avatarColor: "#71717a",
      initials: "?",
    }
  );
}
