"use client";

import { Check, Copy, Link2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  buildClipShareUrl,
  cn,
  formatTimestamp,
  parseTimestampInput,
} from "@/lib/utils";

type ShareClipModalProps = {
  open: boolean;
  meetingId: string;
  meetingTitle: string;
  currentTime: number;
  onClose: () => void;
};

export function ShareClipModal({
  open,
  meetingId,
  meetingTitle,
  currentTime,
  onClose,
}: ShareClipModalProps) {
  const [startInput, setStartInput] = useState(formatTimestamp(currentTime));
  const [endInput, setEndInput] = useState(
    formatTimestamp(Math.max(currentTime + 30, currentTime + 1)),
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const start = Math.floor(currentTime);
    setStartInput(formatTimestamp(start));
    setEndInput(formatTimestamp(start + 30));
    setCopied(false);
  }, [open, currentTime]);

  const startSeconds = parseTimestampInput(startInput);
  const endSeconds = parseTimestampInput(endInput);

  const validationError = useMemo(() => {
    if (startSeconds == null) return "Start time must be seconds or m:ss";
    if (endSeconds == null) return "End time must be seconds or m:ss";
    if (endSeconds <= startSeconds) return "End time must be after start time";
    return null;
  }, [startSeconds, endSeconds]);

  const shareUrl = useMemo(() => {
    if (startSeconds == null || validationError) return "";
    return buildClipShareUrl({
      meetingId,
      startSeconds,
      endSeconds: endSeconds ?? undefined,
    });
  }, [meetingId, startSeconds, endSeconds, validationError]);

  async function copyLink() {
    if (!shareUrl || validationError) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / denied permissions
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close share modal backdrop"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-clip-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-700 bg-[#12181f] p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-teal-400">
              <Link2 className="h-4 w-4" />
              <span className="text-[11px] font-semibold tracking-wide uppercase">
                Share clip
              </span>
            </div>
            <h2 id="share-clip-title" className="text-lg font-semibold text-zinc-50">
              Create a timestamp link
            </h2>
            <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{meetingTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs text-zinc-400">
            Start
            <input
              value={startInput}
              onChange={(event) => setStartInput(event.target.value)}
              placeholder="0:12"
              className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-teal-500/60"
            />
          </label>
          <label className="block text-xs text-zinc-400">
            End
            <input
              value={endInput}
              onChange={(event) => setEndInput(event.target.value)}
              placeholder="0:42"
              className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-teal-500/60"
            />
          </label>
        </div>
        <p className="mt-2 text-[11px] text-zinc-500">
          Use seconds or <span className="font-mono">m:ss</span>. Start defaults to
          the current playback time.
        </p>

        {validationError ? (
          <p className="mt-3 text-xs text-amber-400">{validationError}</p>
        ) : (
          <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2">
            <p className="mb-1 text-[10px] font-medium tracking-wide text-zinc-500 uppercase">
              Shareable URL
            </p>
            <p className="break-all font-mono text-[11px] leading-relaxed text-teal-300/90">
              {shareUrl}
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void copyLink()}
            disabled={Boolean(validationError) || !shareUrl}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
              copied
                ? "bg-emerald-600 text-white"
                : "bg-teal-600 text-white hover:bg-teal-500",
            )}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
