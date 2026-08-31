"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ai_lab_completed";

export default function TrackProgress({ trackSlug, totalLessons, totalHours }: { trackSlug: string; totalLessons: number; totalHours: number }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const load = () => {
      try {
        const c: Record<string, string[]> = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
        setDone((c[trackSlug] ?? []).length);
      } catch {}
    };
    load();
    window.addEventListener("lesson-completed", load);
    return () => window.removeEventListener("lesson-completed", load);
  }, [trackSlug]);

  if (!totalLessons || done === 0) return null;

  const pct = Math.round((done / totalLessons) * 100);
  const hoursLeft = Math.round(totalHours * (1 - done / totalLessons));

  return (
    <div className="mt-6 rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-800">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink-900 dark:text-ink-50">{done}/{totalLessons} lessons complete</span>
        <span className="text-ink-500 dark:text-ink-400">
          {hoursLeft > 0 ? `~${hoursLeft}h remaining` : "Track complete 🎉"}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
