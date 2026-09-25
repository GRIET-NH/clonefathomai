"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AskFathom } from "@/components/AskFathom";
import {
  getAttendee,
  mockMeeting,
  type Meeting,
} from "@/data/mockMeeting";
import { cn, formatTimestamp } from "@/lib/utils";

type TabId = "summary" | "transcript" | "actions";

const TABS: { id: TabId; label: string }[] = [
  { id: "summary", label: "AI Summary" },
  { id: "transcript", label: "Transcript" },
  { id: "actions", label: "Action Items" },
];

export function MeetingViewer({ meeting = mockMeeting }: { meeting?: Meeting }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeCueRef = useRef<HTMLButtonElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [tab, setTab] = useState<TabId>("summary");
  const [query, setQuery] = useState("");
  const [askOpen, setAskOpen] = useState(true);

  const activeSegmentId = useMemo(() => {
    const hit = meeting.transcript.find(
      (s) => currentTime >= s.start && currentTime < s.end,
    );
    return hit?.id ?? null;
  }, [currentTime, meeting.transcript]);

  const filteredTranscript = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return meeting.transcript;
    return meeting.transcript.filter((s) => {
      const speaker = getAttendee(meeting, s.speakerId).name.toLowerCase();
      return s.text.toLowerCase().includes(q) || speaker.includes(q);
    });
  }, [meeting, query]);

  useEffect(() => {
    if (!activeCueRef.current) return;
    activeCueRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeSegmentId]);

  function seekTo(seconds: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seconds;
    void video.play();
    setCurrentTime(seconds);
  }

  return (
    <div className="flex h-dvh flex-col bg-[#0b0f14] text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3 md:px-6">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-teal-400/90">
            Fathom Clone
          </p>
          <h1 className="truncate text-base font-semibold tracking-tight md:text-lg">
            {meeting.title}
          </h1>
          <p className="text-xs text-zinc-500">
            {meeting.dateLabel} · {meeting.durationLabel}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center -space-x-2 sm:flex">
            {meeting.attendees.map((person) => (
              <span
                key={person.id}
                title={`${person.name} · ${person.role}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0b0f14] text-[10px] font-semibold text-white"
                style={{ backgroundColor: person.avatarColor }}
              >
                {person.initials}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAskOpen((v) => !v)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
              askOpen
                ? "bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/40"
                : "bg-teal-600 text-white hover:bg-teal-500",
            )}
          >
            <Sparkles className="h-4 w-4" />
            Ask Fathom
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
          <section className="flex min-h-0 flex-1 flex-col border-b border-zinc-800 lg:border-b-0 lg:border-r">
            <div className="relative bg-black">
              <video
                ref={videoRef}
                className="aspect-video w-full bg-black"
                src={meeting.videoUrl}
                controls
                playsInline
                onTimeUpdate={(event) =>
                  setCurrentTime(event.currentTarget.currentTime)
                }
              />
            </div>

            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2 text-xs text-zinc-400">
              <Users className="h-3.5 w-3.5" />
              <span>
                {meeting.attendees.map((a) => a.name).join(" · ")}
              </span>
            </div>

            <div className="flex gap-1 px-3 pt-3">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm transition",
                    tab === item.id
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {tab === "summary" && (
                <div className="space-y-5">
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {meeting.summary}
                  </p>

                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Key decisions
                    </h3>
                    <ul className="space-y-2">
                      {meeting.keyDecisions.map((decision) => (
                        <li
                          key={decision}
                          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200"
                        >
                          {decision}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Topics
                    </h3>
                    <div className="space-y-2">
                      {meeting.topics.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => seekTo(topic.start)}
                          className="w-full rounded-lg border border-zinc-800 px-3 py-2 text-left transition hover:border-teal-500/40 hover:bg-teal-500/5"
                        >
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-zinc-100">
                              {topic.title}
                            </span>
                            <span className="font-mono text-[11px] text-teal-400">
                              {formatTimestamp(topic.start)}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-zinc-400">
                            {topic.summary}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "transcript" && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-zinc-500" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search transcript…"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-3 pl-9 text-sm outline-none placeholder:text-zinc-500 focus:border-teal-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredTranscript.map((segment) => {
                      const speaker = getAttendee(meeting, segment.speakerId);
                      const active = segment.id === activeSegmentId;
                      return (
                        <button
                          key={segment.id}
                          ref={active ? activeCueRef : undefined}
                          type="button"
                          onClick={() => seekTo(segment.start)}
                          className={cn(
                            "w-full rounded-xl border px-3 py-2.5 text-left transition",
                            active
                              ? "border-teal-500/50 bg-teal-500/10"
                              : "border-transparent hover:border-zinc-800 hover:bg-zinc-900/60",
                          )}
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <span
                              className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                              style={{ backgroundColor: speaker.avatarColor }}
                            >
                              {speaker.initials}
                            </span>
                            <span className="text-xs font-medium text-zinc-200">
                              {speaker.name}
                            </span>
                            <span className="ml-auto font-mono text-[11px] text-teal-400/90">
                              {formatTimestamp(segment.start)}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-zinc-300">
                            {segment.text}
                          </p>
                        </button>
                      );
                    })}
                    {filteredTranscript.length === 0 && (
                      <p className="py-8 text-center text-sm text-zinc-500">
                        No transcript matches for “{query}”.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {tab === "actions" && (
                <ul className="space-y-2">
                  {meeting.actionItems.map((item) => {
                    const owner = getAttendee(meeting, item.assigneeId);
                    return (
                      <li
                        key={item.id}
                        className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-3"
                      >
                        {item.done ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                        ) : (
                          <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-zinc-100">{item.text}</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {owner.name} · due {item.dueLabel}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>

        <AnimatePresence initial={false}>
          {askOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="hidden h-full shrink-0 overflow-hidden md:block"
            >
              <AskFathom
                open={askOpen}
                onClose={() => setAskOpen(false)}
                className="w-[380px]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {askOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-40 h-[70dvh] overflow-hidden rounded-t-2xl border border-zinc-800 shadow-2xl md:hidden"
          >
            <AskFathom open={askOpen} onClose={() => setAskOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
