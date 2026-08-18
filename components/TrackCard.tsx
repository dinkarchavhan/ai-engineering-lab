import Link from "next/link";
import type { Track } from "@/lib/tracks";

const levelStyles: Record<string, string> = {
  Foundations: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  "AI Core": "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/20",
  "AI Engineering": "bg-accent-500/10 text-accent-600 border-accent-500/20 dark:text-accent-400",
  Advanced: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
};

export default function TrackCard({ track }: { track: Track }) {
  return (
    <Link href={`/tracks/${track.slug}`} className="track-card group block">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{track.emoji}</div>
          <div>
            <div className="text-xs font-mono text-ink-500 dark:text-ink-400">TRACK {track.number}</div>
            <h3 className="mt-0.5 text-base font-semibold text-ink-900 dark:text-ink-50">{track.title}</h3>
          </div>
        </div>
        <span className={`chip !border ${levelStyles[track.level]}`}>{track.level}</span>
      </div>

      <p className="mt-4 text-sm text-ink-600 dark:text-ink-300">{track.tagline}</p>

      <div className="mt-5 flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
        <div className="flex items-center gap-3">
          <span>{track.topics.length} topics</span>
          <span>·</span>
          <span>{track.projects.length} projects</span>
          <span>·</span>
          <span>{track.hours}h</span>
        </div>
        <span className="text-brand-600 opacity-0 transition group-hover:opacity-100 dark:text-brand-300">
          Explore →
        </span>
      </div>
    </Link>
  );
}
