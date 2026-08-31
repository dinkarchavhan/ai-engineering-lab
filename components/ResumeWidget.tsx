"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { tracks } from "@/lib/tracks";

const STORAGE_KEY = "ai_lab_completed";

type Progress = { track: typeof tracks[0]; done: number; total: number; lastLesson: string };

export default function ResumeWidget() {
  const [inProgress, setInProgress] = useState<Progress[]>([]);

  useEffect(() => {
    try {
      const completed: Record<string, string[]> = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
      const results: Progress[] = [];
      for (const [slug, lessons] of Object.entries(completed)) {
        if (!lessons.length) continue;
        const track = tracks.find((t) => t.slug === slug);
        if (!track) continue;
        results.push({ track, done: lessons.length, total: track.topics.length, lastLesson: lessons[lessons.length - 1] });
      }
      setInProgress(results);
    } catch {}
  }, []);

  if (!inProgress.length) return null;

  return (
    <section className="section mx-auto max-w-6xl px-4">
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            Continue learning
          </div>
          <h2 className="mt-1 text-2xl font-bold text-ink-900 dark:text-ink-50">
            Pick up where you left off
          </h2>
        </div>
        <Link href="/dashboard" className="text-sm text-brand-600 hover:underline dark:text-brand-300">
          Full dashboard →
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {inProgress.slice(0, 3).map(({ track, done, total }) => {
          const pct = Math.round((done / Math.max(total, 1)) * 100);
          return (
            <Link
              key={track.slug}
              href={`/tracks/${track.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{track.emoji}</span>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-ink-900 dark:text-ink-50">{track.title}</div>
                  <div className="text-xs text-ink-500 dark:text-ink-400">{done} lesson{done !== 1 ? "s" : ""} completed</div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-ink-500 dark:text-ink-400">
                  <span>Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-300">
                Continue →
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
