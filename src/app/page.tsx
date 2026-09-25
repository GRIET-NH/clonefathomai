"use client";

import { useCallback, useEffect, useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { MeetingViewer } from "@/components/MeetingViewer";
import { getMeetingById, type Meeting } from "@/data/mockMeeting";

function syncMeetingUrl(meeting: Meeting | null, keepClipParams = false) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);

  if (!meeting) {
    url.search = "";
    window.history.replaceState({}, "", url.pathname);
    return;
  }

  url.searchParams.set("meetingId", meeting.id);
  if (!keepClipParams) {
    url.searchParams.delete("t");
    url.searchParams.delete("end");
  }
  window.history.replaceState({}, "", `${url.pathname}${url.search}`);
}

export default function Home() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const meetingId = params.get("meetingId");
    if (meetingId) {
      const meeting = getMeetingById(meetingId);
      if (meeting) setSelectedMeeting(meeting);
    }
    setHydrated(true);
  }, []);

  const openMeeting = useCallback((meeting: Meeting) => {
    setSelectedMeeting(meeting);
    syncMeetingUrl(meeting, false);
  }, []);

  const backToDashboard = useCallback(() => {
    setSelectedMeeting(null);
    syncMeetingUrl(null);
  }, []);

  if (!hydrated) {
    return <div className="min-h-dvh bg-[#0b0f14]" />;
  }

  if (selectedMeeting) {
    return (
      <MeetingViewer meeting={selectedMeeting} onBack={backToDashboard} />
    );
  }

  return <Dashboard onSelectMeeting={openMeeting} />;
}
