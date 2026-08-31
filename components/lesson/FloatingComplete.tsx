"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ai_lab_completed";

function readCompleted(): Record<string, string[]> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; }
}
function writeCompleted(data: Record<string, string[]>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); window.dispatchEvent(new Event("lesson-completed")); } catch {}
}

export default function FloatingComplete({ trackSlug, lessonSlug }: { trackSlug: string; lessonSlug: string }) {
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const c = readCompleted();
    setDone((c[trackSlug] ?? []).includes(lessonSlug));
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [trackSlug, lessonSlug]);

  const toggle = () => {
    const c = readCompleted();
    const lessons = c[trackSlug] ?? [];
    c[trackSlug] = done ? lessons.filter((s) => s !== lessonSlug) : [...new Set([...lessons, lessonSlug])];
    writeCompleted(c);
    setDone(!done);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-4 z-40 sm:hidden">
      <button
        onClick={toggle}
        className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition ${
          done
            ? "bg-green-500 text-white"
            : "bg-brand-600 text-white hover:bg-brand-700"
        }`}
      >
        {done ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            Done
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
            Mark complete
          </>
        )}
      </button>
    </div>
  );
}
