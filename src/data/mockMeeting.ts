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

export type MeetingCategory = "Engineering" | "Sales" | "1-on-1";

export type Meeting = {
  id: string;
  title: string;
  dateLabel: string;
  durationLabel: string;
  category: MeetingCategory;
  videoUrl: string;
  attendees: Attendee[];
  summary: string;
  keyDecisions: string[];
  openQuestions: string[];
  topics: TopicSection[];
  actionItems: ActionItem[];
  transcript: TranscriptSegment[];
};

const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
] as const;

export const mockMeetings: Meeting[] = [
  {
    id: "mtg_eng_roadmap_q3",
    title: "Q3 Engineering Roadmap & Fathom Architecture",
    dateLabel: "Sep 22, 2026 · 11:00 AM",
    durationLabel: "41 min",
    category: "Engineering",
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    attendees: [
      {
        id: "u_jordan",
        name: "Jordan Blake",
        role: "Staff Engineer",
        avatarColor: "#2563eb",
        initials: "JB",
      },
      {
        id: "u_sam",
        name: "Sam Ortiz",
        role: "Platform",
        avatarColor: "#0891b2",
        initials: "SO",
      },
      {
        id: "u_riley",
        name: "Riley Nguyen",
        role: "Frontend",
        avatarColor: "#4f46e5",
        initials: "RN",
      },
      {
        id: "u_devon",
        name: "Devon Park",
        role: "Infra",
        avatarColor: "#0f766e",
        initials: "DP",
      },
    ],
    summary:
      "Engineering locked the Q3 architecture for Ask Fathom: App Router + AI SDK streaming on Vercel, Neon for meeting metadata later, and a simulated stream fallback for demos without gateway keys. Platform will harden rate limits; Frontend owns the transcript seek UX.",
    keyDecisions: [
      "Standardize on Vercel AI SDK + AI Gateway for all Ask Fathom traffic.",
      "Keep simulated streaming as an offline demo fallback through Q3.",
      "Defer Neon Postgres wiring until after the meeting viewer ships.",
    ],
    openQuestions: [
      "Do we need Redis for chat session resume across refreshes?",
      "Who owns load testing for 8-person concurrent Ask Fathom sessions?",
    ],
    topics: [
      {
        id: "e-t1",
        title: "Q3 roadmap priorities",
        start: 0,
        summary:
          "Jordan outlined viewer, Ask Fathom, dashboard search, then clip sharing as stretch.",
      },
      {
        id: "e-t2",
        title: "Streaming architecture",
        start: 480,
        summary:
          "Sam proposed route handlers with createUIMessageStream and gateway failover.",
      },
      {
        id: "e-t3",
        title: "Frontend & infra split",
        start: 1200,
        summary:
          "Riley took transcript sync; Devon scoped edge caching and rate limits.",
      },
    ],
    actionItems: [
      {
        id: "e-a1",
        text: "Ship Ask Fathom API with gateway + simulated fallback",
        assigneeId: "u_sam",
        dueLabel: "Wed",
        done: false,
      },
      {
        id: "e-a2",
        text: "Polish transcript click-to-seek and active highlight",
        assigneeId: "u_riley",
        dueLabel: "Thu",
        done: false,
      },
      {
        id: "e-a3",
        text: "Draft rate-limit plan for chat route",
        assigneeId: "u_devon",
        dueLabel: "Fri",
        done: false,
      },
    ],
    transcript: [
      {
        id: "e-s1",
        speakerId: "u_jordan",
        start: 10,
        end: 35,
        text: "Q3 focus is Fathom architecture: solid meeting viewer, Ask Fathom streaming, then dashboard search across meetings.",
      },
      {
        id: "e-s2",
        speakerId: "u_sam",
        start: 38,
        end: 70,
        text: "I'll own the chat route. AI Gateway when we have credentials, otherwise simulated token streaming so demos never blank out.",
      },
      {
        id: "e-s3",
        speakerId: "u_riley",
        start: 72,
        end: 100,
        text: "Transcript should auto-scroll and jump the video on click. I'll keep that synced with the active cue.",
      },
      {
        id: "e-s4",
        speakerId: "u_devon",
        start: 105,
        end: 140,
        text: "Infra-wise we can skip Neon for now. I want rate limits on /api/chat before we show this to the pilot cohort.",
      },
      {
        id: "e-s5",
        speakerId: "u_jordan",
        start: 145,
        end: 180,
        text: "Decision: AI SDK + Gateway is the standard. Simulated fallback stays through Q3. Postgres waits until viewer is stable.",
      },
      {
        id: "e-s6",
        speakerId: "u_sam",
        start: 185,
        end: 220,
        text: "Open question — do we need Redis to resume streams after refresh, or is restarting the chat fine for the assignment?",
      },
    ],
  },
  {
    id: "mtg_product_scale_8",
    title: "8-Person Product Strategy & Scale Sync",
    dateLabel: "Sep 23, 2026 · 2:30 PM",
    durationLabel: "54 min",
    category: "Engineering",
    videoUrl: SAMPLE_VIDEOS[1],
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
      {
        id: "u_casey",
        name: "Casey Brooks",
        role: "Customer Success",
        avatarColor: "#db2777",
        initials: "CB",
      },
      {
        id: "u_noah",
        name: "Noah Kim",
        role: "Data",
        avatarColor: "#ca8a04",
        initials: "NK",
      },
      {
        id: "u_iris",
        name: "Iris Patel",
        role: "Marketing",
        avatarColor: "#e11d48",
        initials: "IP",
      },
      {
        id: "u_leo",
        name: "Leo Grant",
        role: "Ops",
        avatarColor: "#64748b",
        initials: "LG",
      },
    ],
    summary:
      "Cross-functional sync on scaling the Fathom clone for multi-meeting search, template selectors, and an 8-person call experience. Product locked dashboard as next ship; Marketing will frame the walkthrough narrative; Ops owns submission checklist timing.",
    keyDecisions: [
      "Dashboard with multi-meeting search ships immediately after Ask Fathom.",
      "Seed demos with an 8-person strategy call to prove attendee density UX.",
      "Walkthrough video must show Dashboard → Meeting → Ask Fathom in under 5 minutes.",
    ],
    openQuestions: [
      "Should template selectors (Sales Demo, 1-on-1, Engineering Sync) filter dashboard cards or create meetings?",
      "What's the cut-off time for the Vercel production deploy before recording?",
    ],
    topics: [
      {
        id: "p-t1",
        title: "Scale goals",
        start: 0,
        summary: "Maya set the bar: search across titles, people, and transcript keywords.",
      },
      {
        id: "p-t2",
        title: "8-person UX",
        start: 600,
        summary: "Priya reviewed avatar stacking and dense transcript readability.",
      },
      {
        id: "p-t3",
        title: "GTM & submission",
        start: 1500,
        summary: "Iris and Leo aligned on narrative beats and deploy checklist.",
      },
    ],
    actionItems: [
      {
        id: "p-a1",
        text: "Build dashboard search across title, attendees, transcript",
        assigneeId: "u_jordan",
        dueLabel: "Today",
        done: false,
      },
      {
        id: "p-a2",
        text: "Design category pills and meeting card layout",
        assigneeId: "u_priya",
        dueLabel: "Today",
        done: false,
      },
      {
        id: "p-a3",
        text: "Outline 5-minute walkthrough script",
        assigneeId: "u_iris",
        dueLabel: "Thu",
        done: false,
      },
      {
        id: "p-a4",
        text: "Track Vercel deploy + agent-logs commit checklist",
        assigneeId: "u_leo",
        dueLabel: "Fri",
        done: false,
      },
    ],
    transcript: [
      {
        id: "p-s1",
        speakerId: "u_maya",
        start: 12,
        end: 40,
        text: "Thanks everyone — eight of us today. Goal is product strategy for scale: dashboard, search, and proving the 8-person call UI.",
      },
      {
        id: "p-s2",
        speakerId: "u_priya",
        start: 45,
        end: 75,
        text: "Avatar stacks need to stay readable at eight people. Cards should show topic tags and a one-line takeaway.",
      },
      {
        id: "p-s3",
        speakerId: "u_jordan",
        start: 80,
        end: 110,
        text: "Search must hit title, attendee names, and transcript keywords. Category pills for Engineering, Sales, and 1-on-1.",
      },
      {
        id: "p-s4",
        speakerId: "u_alex",
        start: 115,
        end: 145,
        text: "Sales needs a discovery meeting in the seed data so demos feel real when we filter to Sales.",
      },
      {
        id: "p-s5",
        speakerId: "u_casey",
        start: 150,
        end: 175,
        text: "Customers keep asking for follow-up emails from Ask Fathom — that path has to stay obvious from every meeting.",
      },
      {
        id: "p-s6",
        speakerId: "u_noah",
        start: 180,
        end: 205,
        text: "I can tag transcripts with topic keywords so search quality stays high without a real vector index yet.",
      },
      {
        id: "p-s7",
        speakerId: "u_iris",
        start: 210,
        end: 245,
        text: "Walkthrough story: land on dashboard, open the 8-person meeting, ask Fathom for key decisions, jump back. Under five minutes.",
      },
      {
        id: "p-s8",
        speakerId: "u_leo",
        start: 250,
        end: 285,
        text: "I'll own the submission checklist — Vercel URL, agent-logs committed, camera-on recording.",
      },
      {
        id: "p-s9",
        speakerId: "u_maya",
        start: 290,
        end: 320,
        text: "Decision: dashboard ships next. Seed the 8-person call. Walkthrough must cover Dashboard to Ask Fathom.",
      },
    ],
  },
  {
    id: "mtg_sales_discovery",
    title: "Sales Discovery & Customer Feedback",
    dateLabel: "Sep 24, 2026 · 9:15 AM",
    durationLabel: "28 min",
    category: "Sales",
    videoUrl: SAMPLE_VIDEOS[2],
    attendees: [
      {
        id: "u_alex",
        name: "Alex Rivera",
        role: "Account Executive",
        avatarColor: "#ea580c",
        initials: "AR",
      },
      {
        id: "u_taylor",
        name: "Taylor Brooks",
        role: "Prospect — RevOps Lead",
        avatarColor: "#0284c7",
        initials: "TB",
      },
    ],
    summary:
      "Discovery call with Taylor at Northstar RevOps. Pain points: manual note-taking, slow follow-ups, and no searchable meeting history. Strong interest in Ask Fathom email drafts and multi-meeting search. Next step is a technical pilot with two recorded calls.",
    keyDecisions: [
      "Propose a 2-week pilot using Sales Demo template meetings.",
      "Lead with Ask Fathom follow-up email as the primary value prop.",
      "Schedule a technical deep-dive with their RevOps engineer next week.",
    ],
    openQuestions: [
      "Will Northstar require SSO before the pilot starts?",
      "Can they provide two real Zoom recordings for the pilot corpus?",
    ],
    topics: [
      {
        id: "s-t1",
        title: "Current workflow pain",
        start: 0,
        summary: "Taylor described copy-pasting Zoom AI notes into Salesforce by hand.",
      },
      {
        id: "s-t2",
        title: "Fathom value demo",
        start: 420,
        summary: "Alex walked through Ask Fathom draft email and searchable meetings.",
      },
      {
        id: "s-t3",
        title: "Pilot next steps",
        start: 1100,
        summary: "Aligned on a 2-week pilot and a technical follow-up.",
      },
    ],
    actionItems: [
      {
        id: "s-a1",
        text: "Send pilot proposal with Ask Fathom email examples",
        assigneeId: "u_alex",
        dueLabel: "Today",
        done: false,
      },
      {
        id: "s-a2",
        text: "Confirm SSO requirements with Northstar IT",
        assigneeId: "u_taylor",
        dueLabel: "Mon",
        done: false,
      },
    ],
    transcript: [
      {
        id: "s-s1",
        speakerId: "u_alex",
        start: 8,
        end: 30,
        text: "Taylor, thanks for the time. I want to understand how your team handles discovery notes and follow-ups today.",
      },
      {
        id: "s-s2",
        speakerId: "u_taylor",
        start: 32,
        end: 70,
        text: "Honestly it's messy — Zoom AI summaries get copy-pasted into Salesforce. We lose customer feedback across calls because nothing is searchable.",
      },
      {
        id: "s-s3",
        speakerId: "u_alex",
        start: 75,
        end: 110,
        text: "That's exactly where Fathom helps. Ask Fathom can draft the follow-up email from the transcript, and the dashboard searches titles, people, and keywords.",
      },
      {
        id: "s-s4",
        speakerId: "u_taylor",
        start: 115,
        end: 150,
        text: "The email draft would save my reps hours. Multi-meeting search is the second must-have for RevOps reviews.",
      },
      {
        id: "s-s5",
        speakerId: "u_alex",
        start: 155,
        end: 195,
        text: "Great — I propose a two-week pilot on the Sales Demo template. We'll need two recorded calls and a quick technical deep-dive next week.",
      },
      {
        id: "s-s6",
        speakerId: "u_taylor",
        start: 200,
        end: 235,
        text: "I can get the recordings. Question on our side: does the pilot need SSO, or is magic-link enough to start?",
      },
      {
        id: "s-s7",
        speakerId: "u_alex",
        start: 240,
        end: 270,
        text: "I'll confirm SSO with our team and include it in the proposal. I'll send examples of Ask Fathom follow-up emails today.",
      },
    ],
  },
];

/** @deprecated Prefer mockMeetings[0] — kept for existing imports */
export const mockMeeting: Meeting = mockMeetings[0];

export function getMeetingById(id: string): Meeting | undefined {
  return mockMeetings.find((meeting) => meeting.id === id);
}

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
