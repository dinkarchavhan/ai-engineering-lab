import TracksClient from "@/components/TracksClient";
import { tracks, totalHours } from "@/lib/tracks";

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
          {tracks.length} tracks · {totalHours()} hours of learning · 60+ portfolio projects.
        </p>
      </header>
      <TracksClient tracks={tracks} />
    </div>
  );
}
