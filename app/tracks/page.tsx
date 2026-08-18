import TrackCard from "@/components/TrackCard";
import { levels, tracks, tracksByLevel, totalHours } from "@/lib/tracks";

export const metadata = {
  title: "All 27 Tracks — AI Engineering Lab",
  description: "The complete AI Engineering curriculum, grouped into four levels.",
};

export default function TracksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <header className="mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Curriculum
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-5xl">
          Twenty-seven tracks
        </h1>
        <p className="mt-3 max-w-3xl text-ink-600 dark:text-ink-300">
          {tracks.length} tracks · {totalHours()} hours of learning · 60+ portfolio projects. Every track is
          built on the same nine-step lesson template: real problem → intuition → visual → math → from
          scratch → production library → interactive lab → real project → deploy.
        </p>
      </header>

      {levels.map((level) => {
        const items = tracksByLevel(level);
        return (
          <section key={level} className="mt-12 first:mt-0">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-50">{level}</h2>
              <div className="text-sm text-ink-500 dark:text-ink-400">
                {items.length} tracks · {items.reduce((s, t) => s + t.hours, 0)}h
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <TrackCard key={t.slug} track={t} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
