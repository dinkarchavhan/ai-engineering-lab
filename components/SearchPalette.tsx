"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { tracks } from "@/lib/tracks";

type Result = { type: "track" | "topic"; label: string; sub: string; href: string; emoji?: string };

function buildIndex(): Result[] {
  const out: Result[] = [];
  for (const t of tracks) {
    out.push({ type: "track", label: t.title, sub: t.tagline, href: `/tracks/${t.slug}`, emoji: t.emoji });
    for (const topic of t.topics) {
      out.push({ type: "topic", label: topic, sub: `in ${t.title}`, href: `/tracks/${t.slug}`, emoji: t.emoji });
    }
  }
  return out;
}

const INDEX = buildIndex();

function score(item: Result, q: string): number {
  const lower = q.toLowerCase();
  const label = item.label.toLowerCase();
  const sub = item.sub.toLowerCase();
  if (label === lower) return 3;
  if (label.startsWith(lower)) return 2;
  if (label.includes(lower)) return 1.5;
  if (sub.includes(lower)) return 0.5;
  return 0;
}

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim()
    ? INDEX.map((item) => ({ item, s: score(item, query.trim()) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 10)
        .map((x) => x.item)
    : tracks.slice(0, 6).map((t) => ({ type: "track" as const, label: t.title, sub: t.tagline, href: `/tracks/${t.slug}`, emoji: t.emoji }));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { if (open) { setQuery(""); setCursor(0); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);
  useEffect(() => { setCursor(0); }, [query]);

  const navigate = (href: string) => { setOpen(false); router.push(href); };

  const keyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === "Enter" && results[cursor]) navigate(results[cursor].href);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl dark:border-ink-700 dark:bg-ink-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-ink-200 px-4 dark:border-ink-700">
          <svg className="h-4 w-4 flex-none text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={keyDown}
            placeholder="Search tracks and topics…"
            className="flex-1 bg-transparent py-4 text-sm text-ink-900 placeholder-ink-400 outline-none dark:text-ink-50"
          />
          <kbd className="hidden rounded border border-ink-200 px-1.5 py-0.5 text-[10px] text-ink-400 sm:block dark:border-ink-700">Esc</kbd>
        </div>

        {/* Results */}
        <ul className="max-h-72 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-ink-400">No results for &ldquo;{query}&rdquo;</li>
          ) : (
            results.map((r, i) => (
              <li key={`${r.href}-${r.label}`}>
                <button
                  onClick={() => navigate(r.href)}
                  onMouseEnter={() => setCursor(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                    i === cursor ? "bg-brand-50 dark:bg-brand-500/10" : "hover:bg-ink-50 dark:hover:bg-ink-800"
                  }`}
                >
                  <span className="w-6 text-center text-base">{r.emoji ?? "📌"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink-900 dark:text-ink-50 truncate">{r.label}</div>
                    <div className="text-xs text-ink-500 dark:text-ink-400 truncate">{r.sub}</div>
                  </div>
                  <span className={`text-[10px] rounded px-1.5 py-0.5 font-mono ${
                    r.type === "track"
                      ? "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300"
                      : "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-400"
                  }`}>
                    {r.type}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="border-t border-ink-100 px-4 py-2 dark:border-ink-800">
          <div className="flex gap-4 text-[10px] text-ink-400">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> open</span>
            <span><kbd className="font-mono">Esc</kbd> close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
