"use client";
import { useState } from "react";
import TrackCard from "@/components/TrackCard";
import type { Track, Level } from "@/lib/tracks";

const ALL = "All";
const levels: (Level | typeof ALL)[] = [ALL, "Foundations", "AI Core", "AI Engineering", "Advanced"];

export default function TracksClient({ tracks }: { tracks: Track[] }) {
  const [level, setLevel] = useState<Level | typeof ALL>(ALL);
  const [query, setQuery] = useState("");

  const filtered = tracks.filter((t) => {
    const matchLevel = level === ALL || t.level === level;
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.topics.some((tp) => tp.toLowerCase().includes(q));
    return matchLevel && matchQuery;
  });

  // Group by level for display, keeping level order
  const displayLevels = (level === ALL ? (["Foundations", "AI Core", "AI Engineering", "Advanced"] as Level[]) : [level]);
  const grouped = displayLevels
    .map((l) => ({ level: l, items: filtered.filter((t) => t.level === l) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      {/* Search + filter bar */}
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by keyword…"
            className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-400 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                level === l
                  ? "bg-brand-600 text-white dark:bg-brand-500"
                  : "border border-ink-200 bg-white text-ink-700 hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        {filtered.length !== tracks.length && (
          <div className="text-sm text-ink-500 dark:text-ink-400 sm:ml-auto">
            {filtered.length} track{filtered.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {grouped.length === 0 ? (
        <div className="py-16 text-center text-ink-400">No tracks match &ldquo;{query}&rdquo;</div>
      ) : (
        grouped.map(({ level: l, items }) => (
          <section key={l} className="mt-12 first:mt-0">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-50">{l}</h2>
              <div className="text-sm text-ink-500 dark:text-ink-400">
                {items.length} track{items.length !== 1 ? "s" : ""} · {items.reduce((s, t) => s + t.hours, 0)}h
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => <TrackCard key={t.slug} track={t} />)}
            </div>
          </section>
        ))
      )}
    </>
  );
}
