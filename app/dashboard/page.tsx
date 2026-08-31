"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { tracks } from "@/lib/tracks";

const COMPLETED_KEY = "ai_lab_completed";
const QUIZ_KEY = "ai_lab_quiz_scores";

type TrackStat = { slug: string; title: string; emoji: string; done: number; total: number; hours: number };

export default function DashboardPage() {
  const [stats, setStats] = useState<TrackStat[]>([]);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

  useEffect(() => {
    try {
      const completed: Record<string, string[]> = JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? "{}");
      const quizScores: Record<string, boolean> = JSON.parse(localStorage.getItem(QUIZ_KEY) ?? "{}");
      const s = tracks
        .map((t) => ({ slug: t.slug, title: t.title, emoji: t.emoji, done: (completed[t.slug] ?? []).length, total: t.topics.length, hours: t.hours }))
        .filter((t) => t.done > 0)
        .sort((a, b) => b.done / b.total - a.done / a.total);
      setStats(s);
      const vals = Object.values(quizScores);
      setQuizCorrect(vals.filter(Boolean).length);
      setQuizTotal(vals.length);
    } catch {}
  }, []);

  const totalDone = stats.reduce((s, t) => s + t.done, 0);
  const totalLessons = tracks.reduce((s, t) => s + t.topics.length, 0);
  const hoursCompleted = stats.reduce((s, t) => s + Math.round(t.hours * (t.done / Math.max(t.total, 1))), 0);
  const overallPct = totalLessons ? Math.round((totalDone / totalLessons) * 100) : 0;
  const tracksStarted = stats.length;
  const tracksFinished = stats.filter((t) => t.done >= t.total).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:py-18">
      <header className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">My progress</div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-5xl">Dashboard</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">Your learning progress across the AI Engineering curriculum.</p>
      </header>

      {/* Summary cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Overall progress", value: `${overallPct}%`, sub: `${totalDone} / ${totalLessons} lessons` },
          { label: "Hours logged", value: `${hoursCompleted}h`, sub: "estimated" },
          { label: "Tracks started", value: String(tracksStarted), sub: `${tracksFinished} finished` },
          { label: "Quiz accuracy", value: quizTotal ? `${Math.round((quizCorrect / quizTotal) * 100)}%` : "—", sub: quizTotal ? `${quizCorrect}/${quizTotal} correct` : "No quizzes yet" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-800">
            <div className="text-xs font-medium text-ink-500 dark:text-ink-400">{c.label}</div>
            <div className="mt-1 text-3xl font-bold text-ink-900 dark:text-ink-50">{c.value}</div>
            <div className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="mb-10 rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-800">
        <div className="mb-2 flex justify-between text-sm font-medium text-ink-700 dark:text-ink-200">
          <span>Curriculum progress</span>
          <span>{overallPct}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-ink-400 dark:text-ink-500">{totalLessons - totalDone} lessons remaining across {tracks.length} tracks</div>
      </div>

      {/* Per-track breakdown */}
      {stats.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 p-12 text-center dark:border-ink-700">
          <div className="text-4xl">🎯</div>
          <div className="mt-3 text-lg font-semibold text-ink-900 dark:text-ink-50">No progress yet</div>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Complete your first lesson and it will appear here.</p>
          <Link href="/tracks" className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            Browse tracks →
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-ink-900 dark:text-ink-50">Tracks in progress</h2>
          <div className="space-y-3">
            {stats.map((t) => {
              const pct = Math.round((t.done / Math.max(t.total, 1)) * 100);
              return (
                <Link
                  key={t.slug}
                  href={`/tracks/${t.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-ink-200 bg-white p-4 transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500"
                >
                  <span className="text-2xl w-8 text-center">{t.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-ink-900 dark:text-ink-50 truncate">{t.title}</span>
                      <span className="text-xs text-ink-500 dark:text-ink-400 flex-none">{t.done}/{t.total}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
                      <div
                        className={`h-full rounded-full transition-all ${pct === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-brand-500 to-accent-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-semibold flex-none ${pct === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-ink-500 dark:text-ink-400"}`}>
                    {pct === 100 ? "✓ Done" : `${pct}%`}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Not started */}
      {tracksStarted < tracks.length && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-ink-900 dark:text-ink-50">Not started yet</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {tracks.filter((t) => !stats.find((s) => s.slug === t.slug)).slice(0, 8).map((t) => (
              <Link key={t.slug} href={`/tracks/${t.slug}`} className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500">
                <span>{t.emoji}</span>
                <span className="font-medium text-ink-800 dark:text-ink-100">{t.title}</span>
                <span className="ml-auto text-xs text-ink-400">{t.hours}h</span>
              </Link>
            ))}
          </div>
          {tracks.filter((t) => !stats.find((s) => s.slug === t.slug)).length > 8 && (
            <Link href="/tracks" className="mt-3 block text-center text-sm text-brand-600 hover:underline dark:text-brand-300">
              See all {tracks.length - tracksStarted} remaining tracks →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
