# Fathom AI Clone — Engineering Assignment

## Submission Links
- **Live Production App:** https://clonefathomai.vercel.app
- **Public GitHub Repository:** https://github.com/arechaithanya/clonefathomai
- **Walkthrough Video (<5 mins, Camera ON):** [INSERT_YOUR_LOOM_LINK_HERE]

---

## 1. Architecture & Engineering Disclosures (Built vs. Stubbed)
As permitted by the assignment brief to prioritize product judgment and user experience within the 24-hour window:

- **Post-Meeting Intelligence (Built):** Real-time HTML5 video-transcript synchronization, click-to-seek timestamp navigation, active transcript line highlighting with auto-scroll, tabbed AI meeting summaries, timestamped clip creation with deep-link URL state management, and multi-meeting dashboard search.
- **AI Chat Engine (Built):** Live streaming responses via Vercel AI SDK (`@ai-sdk/openai` + `gpt-4o-mini`) using full transcript context, with a keyword-matching streaming fallback engine when no API keys are present.
- **Media Ingestion & Capture Layer (Stubbed):** Live WebRTC / Zoom / Google Meet bot recording is intentionally mocked using seeded meeting data to focus engineering time on post-meeting analysis, playback sync, and AI capabilities.

---

## 2. Product Features Walkthrough

### 1. Multi-Meeting Dashboard & Search
- Pre-seeded with realistic team calls (including an 8-person roadmap meeting).
- Instant client-side search filtering across meeting titles, attendees, topic tags, and full transcript text with visual `<mark>` highlighting.

### 2. Synchronized Video & Interactive Transcript
- Click any line in the transcript or topic under AI Summary to seek the video playerplayhead directly to that timestamp.
- Real-time `onTimeUpdate` sync that auto-highlights and auto-scrolls the active transcript cue as the video plays.

### 3. Ask Fathom AI Assistant
- Context-aware sidebar powered by `gpt-4o-mini` streaming responses.
- Preset prompt pills ("What were the key decisions?", "Draft a follow-up email", "Summarize action items").

### 4. Timestamped Share Clip Generator
- Generates shareable URL parameters (`?meetingId=X&t=75&end=115`) that seek automatically on load and pause at the specified end time.

---

## 3. Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Framer Motion + Lucide Icons
- **AI Integration:** Vercel AI SDK (`ai`, `@ai-sdk/openai`) — `gpt-4o-mini` when `OPENAI_API_KEY` is set, keyword-matching streaming fallback otherwise
- **Deployment:** Vercel
