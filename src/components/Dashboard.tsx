"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  mockMeetings,
  type Meeting,
  type MeetingCategory,
} from "@/data/mockMeeting";
import { cn } from "@/lib/utils";

export type DashboardFilter = "All" | MeetingCategory;

const FILTERS: DashboardFilter[] = ["All", "Engineering", "Sales", "1-on-1"];

const CATEGORY_STYLES: Record<DashboardFilter, { pill: string }> = {
  All: { pill: "bg-teal-600 text-white shadow-lg shadow-teal-900/40" },
  Engineering: { pill: "bg-blue-600/90 text-white shadow-lg shadow-blue-900/40" },
  Sales: { pill: "bg-orange-600/90 text-white shadow-lg shadow-orange-900/40" },
  "1-on-1": { pill: "bg-violet-600/90 text-white shadow-lg shadow-violet-900/40" },
};

const CATEGORY_BADGE_STYLES: Record<MeetingCategory, string> = {
  Engineering: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  Sales: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  "1-on-1": "border-violet-500/30 bg-violet-500/10 text-violet-300",
};

const CATEGORY_CARD_ACCENT: Record<MeetingCategory, string> = {
  Engineering: "from-blue-500/8 to-transparent",
  Sales: "from-orange-500/8 to-transparent",
  "1-on-1": "from-violet-500/8 to-transparent",
};

type DashboardProps = {
  meetings?: Meeting[];
  onSelectMeeting: (meeting: Meeting) => void;
};

function matchesFilter(meeting: Meeting, filter: DashboardFilter): boolean {
  if (filter === "All") return true;
  if (filter === "1-on-1") {
    return meeting.category === "1-on-1" || meeting.attendees.length <= 2;
  }
  return meeting.category === filter;
}

function matchesQuery(meeting: Meeting, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (meeting.title.toLowerCase().includes(q)) return true;
  if (meeting.summary.toLowerCase().includes(q)) return true;
  if (meeting.category.toLowerCase().includes(q)) return true;
  if (meeting.attendees.some((a) => a.name.toLowerCase().includes(q))) return true;
  if (meeting.topics.some((t) => t.title.toLowerCase().includes(q))) return true;
  if (meeting.transcript.some((s) => s.text.toLowerCase().includes(q))) return true;
  return false;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const q = query.trim();
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-teal-500/25 px-0.5 text-teal-200">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

// ─── Meeting Card ─────────────────────────────────────────────────────────────

function MeetingCard({
  meeting,
  query,
  onSelect,
  index,
}: {
  meeting: Meeting;
  query: string;
  onSelect: () => void;
  index: number;
}) {
  const accentGradient = CATEGORY_CARD_ACCENT[meeting.category];
  const badgeStyle = CATEGORY_BADGE_STYLES[meeting.category];
  const doneCount = meeting.actionItems.filter((a) => a.done).length;
  const keyDecision = meeting.keyDecisions[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.22, delay: index * 0.06, ease: "easeOut" }}
      layout
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 text-left",
          "transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl",
        )}
      >
        {/* Subtle category-tinted gradient overlay on hover */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            accentGradient,
          )}
        />

        {/* Top row: badge + duration */}
        <div className="relative mb-3.5 flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
              badgeStyle,
            )}
          >
            {meeting.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-500">
            <Clock className="h-3 w-3" />
            {meeting.durationLabel}
          </span>
        </div>

        {/* Title */}
        <h2 className="relative mb-1 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-zinc-50 transition-colors duration-150 group-hover:text-white">
          {highlightText(meeting.title, query)}
        </h2>

        {/* Date */}
        <p className="relative mb-3.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <Calendar className="h-3 w-3" />
          {meeting.dateLabel}
        </p>

        {/* Attendee avatars */}
        <div className="relative mb-3.5 flex items-center gap-2">
          <div className="flex -space-x-2">
            {meeting.attendees.slice(0, 5).map((person) => (
              <span
                key={person.id}
                title={`${person.name} · ${person.role}`}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#111318] text-[9px] font-bold text-white transition-transform duration-150 group-hover:scale-105"
                style={{ backgroundColor: person.avatarColor }}
              >
                {person.initials}
              </span>
            ))}
            {meeting.attendees.length > 5 && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#111318] bg-zinc-700 text-[9px] font-bold text-zinc-300">
                +{meeting.attendees.length - 5}
              </span>
            )}
          </div>
          <span className="ml-auto flex items-center gap-1 text-[11px] text-zinc-500">
            <Users className="h-3 w-3" />
            {meeting.attendees.length}{" "}
            {meeting.attendees.length === 1 ? "person" : "people"}
          </span>
        </div>

        {/* Topic tags */}
        <div className="relative mb-3.5 flex flex-wrap gap-1.5">
          {meeting.topics.slice(0, 3).map((topic) => (
            <span
              key={topic.id}
              className="rounded-md bg-zinc-800/70 px-2 py-0.5 text-[11px] text-zinc-400 transition-colors duration-150 group-hover:bg-zinc-700/70 group-hover:text-zinc-300"
            >
              {highlightText(topic.title, query)}
            </span>
          ))}
        </div>

        {/* Key decision preview */}
        {keyDecision && (
          <div className="relative mb-3.5 rounded-lg border border-zinc-800/60 bg-zinc-800/30 px-3 py-2 transition-colors duration-150 group-hover:border-zinc-700/60">
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Key Decision
            </p>
            <p className="line-clamp-2 text-[12px] leading-relaxed text-zinc-400 transition-colors duration-150 group-hover:text-zinc-300">
              {highlightText(keyDecision, query)}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="relative flex items-center justify-between border-t border-zinc-800/50 pt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <CheckCircle2 className="h-3 w-3 text-teal-500/70" />
            {meeting.actionItems.length} action item
            {meeting.actionItems.length !== 1 ? "s" : ""}
            {doneCount > 0 && (
              <span className="text-teal-500/70">· {doneCount} done</span>
            )}
          </span>
          <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-teal-400/0 ring-1 ring-teal-500/0 transition-all duration-200 group-hover:bg-teal-500/10 group-hover:text-teal-300 group-hover:ring-teal-500/30">
            <Sparkles className="h-3 w-3" />
            Open
          </span>
        </div>
      </button>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  query,
  filter,
}: {
  query: string;
  filter: DashboardFilter;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 px-8 py-20 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/60">
        <Search className="h-6 w-6 text-zinc-600" />
      </div>
      <p className="text-sm font-semibold text-zinc-200">No meetings found</p>
      <p className="mt-1.5 max-w-xs text-sm text-zinc-500">
        {query.trim()
          ? `No results for "${query.trim()}"${filter !== "All" ? ` in ${filter}` : ""}. Try a different keyword or clear the filter.`
          : `No ${filter} meetings yet.`}
      </p>
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function Dashboard({
  meetings = mockMeetings,
  onSelectMeeting,
}: DashboardProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DashboardFilter>("All");
  const searchRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(
    () =>
      meetings.filter(
        (meeting) =>
          matchesFilter(meeting, filter) && matchesQuery(meeting, query),
      ),
    [meetings, filter, query],
  );

  return (
    <div className="min-h-dvh bg-[#0b0f14] text-zinc-100">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-[#0b0f14]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-6 md:px-6">
          {/* Branding row */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-400">
                Fathom Clone
              </p>
              <h1 className="mt-0.5 text-2xl font-bold tracking-tight md:text-[28px]">
                Meetings
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Search across titles, people, and transcripts
              </p>
            </div>

            {/* Stats pill */}
            <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 sm:flex">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.7)]" />
              <span className="text-xs text-zinc-400">
                <span className="font-semibold text-zinc-200">
                  {meetings.length}
                </span>{" "}
                meetings
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div
            className="group relative mb-4 max-w-2xl cursor-text"
            onClick={() => searchRef.current?.focus()}
          >
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors duration-150 group-focus-within:text-teal-400" />
            <input
              ref={searchRef}
              id="dashboard-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search meetings, attendees, keywords…"
              className={cn(
                "w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-3 pr-10 pl-10 text-sm outline-none",
                "placeholder:text-zinc-600 transition-all duration-200",
                "focus:border-teal-500/50 focus:bg-zinc-900 focus:shadow-[0_0_0_3px_rgba(20,184,166,0.12)]",
              )}
            />
            {query && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuery("");
                }}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-zinc-500 transition hover:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => {
              const active = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200",
                    active
                      ? CATEGORY_STYLES[item].pill
                      : "border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Main Grid ── */}
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {/* Result count + clear */}
        <div className="mb-5 flex items-center gap-2">
          <p className="text-xs text-zinc-500">
            <span className="font-semibold text-zinc-300">{visible.length}</span>{" "}
            meeting{visible.length !== 1 ? "s" : ""}
            {query.trim() && (
              <span>
                {" "}
                matching{" "}
                <span className="font-medium text-zinc-300">
                  "{query.trim()}"
                </span>
              </span>
            )}
          </p>
          {(query.trim() || filter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("All");
              }}
              className="ml-1 flex items-center gap-1 rounded-full border border-zinc-800 px-2 py-0.5 text-[11px] text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.length === 0 ? (
              <EmptyState key="empty" query={query} filter={filter} />
            ) : (
              visible.map((meeting, i) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  query={query}
                  onSelect={() => onSelectMeeting(meeting)}
                  index={i}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
