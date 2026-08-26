"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ai_lab_completed";

function readCompleted(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeCompleted(data: Record<string, string[]>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("lesson-completed"));
  } catch {}
}

export default function CompleteButton({
  trackSlug,
  lessonSlug,
}: {
  trackSlug: string;
  lessonSlug: string;
}) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const c = readCompleted();
    setDone((c[trackSlug] ?? []).includes(lessonSlug));
  }, [trackSlug, lessonSlug]);

  const toggle = () => {
    const c = readCompleted();
    const lessons = c[trackSlug] ?? [];
    if (done) {
      c[trackSlug] = lessons.filter((s) => s !== lessonSlug);
    } else {
      c[trackSlug] = [...new Set([...lessons, lessonSlug])];
    }
    writeCompleted(c);
    setDone(!done);
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
        done
          ? "border-green-300 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300"
          : "border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
      }`}
    >
      {done ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Completed
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          Mark as complete
        </>
      )}
    </button>
  );
}
