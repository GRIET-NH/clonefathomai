import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/** Accepts `12`, `12.5`, or `m:ss` / `mm:ss`. Returns null if invalid. */
export function parseTimestampInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.includes(":")) {
    const [minsRaw, secsRaw] = trimmed.split(":");
    const mins = Number(minsRaw);
    const secs = Number(secsRaw);
    if (!Number.isFinite(mins) || !Number.isFinite(secs) || secs < 0 || secs >= 60) {
      return null;
    }
    return Math.max(0, mins * 60 + secs);
  }

  const asNumber = Number(trimmed);
  if (!Number.isFinite(asNumber) || asNumber < 0) return null;
  return asNumber;
}

export function buildClipShareUrl(options: {
  meetingId: string;
  startSeconds: number;
  endSeconds?: number;
  origin?: string;
  pathname?: string;
}): string {
  const origin =
    options.origin ??
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  const pathname =
    options.pathname ??
    (typeof window !== "undefined" ? window.location.pathname : "/");

  const url = new URL(pathname, origin);
  url.searchParams.set("meetingId", options.meetingId);
  url.searchParams.set("t", String(Math.max(0, Math.floor(options.startSeconds))));

  if (
    options.endSeconds != null &&
    Number.isFinite(options.endSeconds) &&
    options.endSeconds > options.startSeconds
  ) {
    url.searchParams.set("end", String(Math.floor(options.endSeconds)));
  }

  return url.toString();
}
