"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ai_lab_completed";

function getTrackCompleted(trackSlug: string): string[] {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return data[trackSlug] ?? [];
  } catch {
    return [];
  }
}

interface LessonMeta {
  slug: string;
  title: string;
  subtitle: string;
  minutes: number;
}

export default function TrackLessonList({
  trackSlug,
  lessons,
}: {
  trackSlug: string;
  lessons: LessonMeta[];
}) {
  const [completed, setCompleted] = useState<string[]>([]);

  const refresh = () => setCompleted(getTrackCompleted(trackSlug));

  useEffect(() => {
    refresh();
    window.addEventListener("lesson-completed", refresh);
    return () => window.removeEventListener("lesson-completed", refresh);
  }, [trackSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = lessons.length;
  const done = completed.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      {/* Progress bar — only visible after at least one lesson is done */}
      {done > 0 && (
        <div className="mb-6 rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-800">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-ink-900 dark:text-ink-50">Your progress</span>
            <span className="text-ink-500 dark:text-ink-400">
              {done} / {total} lessons
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {done === total && (
            <p className="mt-2 text-xs font-semibold text-brand-600 dark:text-brand-300">
              🎉 Track complete!
            </p>
          )}
        </div>
      )}

      {/* Lesson list */}
      <div className="space-y-2">
        {lessons.map((l, i) => {
          const isDone = completed.includes(l.slug);
          return (
            <Link
              key={l.slug}
              href={`/tracks/${trackSlug}/${l.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-ink-200 bg-white p-4 transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500"
            >
              <span
                className={`grid h-10 w-10 flex-none place-items-center rounded-lg shadow-card ${
                  isDone
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                    : "bg-gradient-to-br from-brand-500 to-accent-500 font-mono text-xs font-bold text-white"
                }`}
              >
                {isDone ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className={`font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-300 ${
                    isDone ? "text-ink-400 dark:text-ink-500" : "text-ink-900 dark:text-ink-50"
                  }`}
                >
                  {l.title}
                </div>
                <div className="mt-0.5 truncate text-sm text-ink-600 dark:text-ink-300">
                  {l.subtitle}
                </div>
              </div>
              <div className="hidden text-xs text-ink-500 sm:block dark:text-ink-400">
                {l.minutes} min
              </div>
              <span className="text-ink-400 group-hover:text-brand-600 dark:text-ink-500 dark:group-hover:text-brand-300">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
