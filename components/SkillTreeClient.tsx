"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { tracks } from "@/lib/tracks";

const STORAGE_KEY = "ai_lab_completed";

type Branch = {
  name: string;
  color: string;
  lightBg: string;
  darkBg: string;
  text: string;
  trackSlugs: string[];
  unlocks: string[];
};

export default function SkillTreeClient({ branches }: { branches: Branch[] }) {
  const [completed, setCompleted] = useState<Record<string, string[]>>({});

  useEffect(() => {
    try {
      setCompleted(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"));
    } catch {}
    const handler = () => {
      try { setCompleted(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")); } catch {}
    };
    window.addEventListener("lesson-completed", handler);
    return () => window.removeEventListener("lesson-completed", handler);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {branches.map((b) => {
        const branchTracks = b.trackSlugs.map((s) => tracks.find((t) => t.slug === s)).filter(Boolean) as typeof tracks;
        const completedCount = branchTracks.filter((t) => (completed[t.slug]?.length ?? 0) > 0).length;
        const pct = branchTracks.length ? Math.round((completedCount / branchTracks.length) * 100) : 0;

        return (
          <div key={b.name} className={`rounded-2xl border-2 p-6 ${b.lightBg} ${b.darkBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-xs font-semibold uppercase tracking-wider ${b.text}`}>Branch</div>
                <h2 className="mt-1 text-2xl font-bold text-ink-900 dark:text-ink-50">{b.name}</h2>
              </div>
              <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${b.color} flex items-center justify-center text-white text-xs font-bold shadow`}>
                {pct > 0 ? `${pct}%` : ""}
                {pct === 0 && <span className="opacity-60 text-[8px]">0%</span>}
              </div>
            </div>

            {/* Progress bar */}
            {completedCount > 0 && (
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-ink-500 dark:text-ink-400">
                  <span>{completedCount}/{branchTracks.length} tracks started</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/60 dark:bg-ink-800/60">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${b.color} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">Tracks</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {b.trackSlugs.map((slug) => {
                  const t = tracks.find((x) => x.slug === slug);
                  if (!t) return null;
                  const done = (completed[slug]?.length ?? 0) > 0;
                  return (
                    <Link
                      key={slug}
                      href={`/tracks/${slug}`}
                      className={`group inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium shadow-sm transition ${
                        done
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "border-white bg-white/70 text-ink-800 hover:bg-white dark:border-ink-700 dark:bg-ink-800/60 dark:text-ink-100 dark:hover:bg-ink-800"
                      }`}
                    >
                      {done && (
                        <svg className="h-3 w-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                      <span>{t.emoji}</span>
                      <span>{t.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">Skills unlocked</div>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {b.unlocks.map((u) => (
                  <li key={u} className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
                    <span className="text-brand-500">✓</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
