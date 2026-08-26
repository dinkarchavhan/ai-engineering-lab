import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopicDescription, getTrack, tracks } from "@/lib/tracks";
import { getLessonsForTrack } from "@/lib/content";
import TrackLessonList from "@/components/TrackLessonList";

export function generateStaticParams() {
  return tracks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) return { title: "Track not found" };
  return {
    title: `${track.title} — AI Engineering Lab`,
    description: track.tagline,
  };
}

const lessonSteps = [
  "What problem are we solving?",
  "Why does it matter?",
  "Simple explanation",
  "Real-world analogy",
  "Visual explanation",
  "Mathematics",
  "Build from scratch",
  "Run it",
  "Inspect the output",
  "Production implementation",
  "Framework implementation",
  "Experiment",
  "Common mistakes",
  "Debugging",
  "Interview questions",
  "Mini challenge",
  "Real-world use case",
  "Build a reusable component",
  "Quiz",
  "Next concept",
];

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  const idx = tracks.findIndex((t) => t.slug === track!.slug);
  const prev = idx > 0 ? tracks[idx - 1] : null;
  const next = idx < tracks.length - 1 ? tracks[idx + 1] : null;
  const lessons = getLessonsForTrack(slug);
  const hasLessons = lessons.length > 0;

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm">
        <Link href="/tracks" className="text-ink-500 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-300">
          ← All tracks
        </Link>
      </div>

      {/* Header */}
      <header className="rounded-3xl border border-ink-200 bg-white p-8 shadow-card dark:border-ink-700 dark:bg-ink-800">
        <div className="flex items-start gap-5">
          <div className="text-5xl">{track!.emoji}</div>
          <div className="flex-1">
            <div className="text-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Track {track!.number} · {track!.level}
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">
              {track!.title}
            </h1>
            <p className="mt-2 text-lg text-ink-600 dark:text-ink-300">{track!.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="chip">{track!.hours}h estimated</span>
              <span className="chip">{track!.topics.length} topics</span>
              <span className="chip">{track!.projects.length} projects</span>
            </div>
          </div>
        </div>
      </header>

      {/* Overview */}
      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Overview
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-700 dark:text-ink-200">{track!.overview}</p>
      </section>

      {/* Lessons (if available) or topics */}
      {hasLessons ? (
        <section className="mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            Lessons
          </h2>
          <h3 className="mt-2 text-2xl font-semibold text-ink-900 dark:text-ink-50">
            {lessons.length} full-length lessons
          </h3>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
            Each lesson follows the 20-step template: problem → intuition → analogy → math → from-scratch code → production library → experiment → common mistakes → quiz.
          </p>
          <div className="mt-6">
            <TrackLessonList
              trackSlug={track!.slug}
              lessons={lessons.map((l) => ({
                slug: l.slug,
                title: l.title,
                subtitle: l.subtitle,
                minutes: l.minutes,
              }))}
            />
          </div>
          {track!.topics.some((topic) => getTopicDescription(track!.slug, topic)) && (
            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-ink-900 dark:text-ink-50">Concept guide</h3>
              <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
                A quick definition for every concept in this track.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {track!.topics.map((topic, i) => (
                  <div key={topic} className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-800">
                    <div className="flex gap-3">
                      <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">{i + 1}</span>
                      <div>
                        <div className="font-semibold text-ink-900 dark:text-ink-50">{topic}</div>
                        <p className="mt-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                          {getTopicDescription(track!.slug, topic) ?? "A core concept covered in this track."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            Topics
          </h2>
          <h3 className="mt-2 text-2xl font-semibold text-ink-900 dark:text-ink-50">
            {track!.topics.length} concepts covered
          </h3>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
            Full lesson content is being written for this track. Follow along for updates.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {track!.topics.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-700 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200"
              >
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                  {i + 1}
                </span>
                <div>
                  <div>{t}</div>
                  {getTopicDescription(track!.slug, t) && (
                    <p className="mt-1 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
                      {getTopicDescription(track!.slug, t)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Portfolio Projects
        </h2>
        <h3 className="mt-2 text-2xl font-semibold text-ink-900 dark:text-ink-50">
          What you&apos;ll ship
        </h3>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {track!.projects.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-ink-200 bg-gradient-to-br from-white to-ink-50 p-4 dark:border-ink-700 dark:from-ink-800 dark:to-ink-900"
            >
              <div className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-sm font-medium text-ink-800 dark:text-ink-100">{p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Learning outcomes
        </h2>
        <h3 className="mt-2 text-2xl font-semibold text-ink-900 dark:text-ink-50">By the end you can</h3>
        <ul className="mt-4 space-y-2">
          {track!.outcomes.map((o, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
              <span className="text-ink-700 dark:text-ink-200">{o}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Lesson template */}
      <section className="mt-12">
        <div className="rounded-2xl border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-800">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            How each lesson is built
          </h2>
          <h3 className="mt-2 text-2xl font-semibold text-ink-900 dark:text-ink-50">
            The 20-step lesson template
          </h3>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
            Every lesson in every track follows the same structure — so you always know what you&apos;re
            getting.
          </p>
          <ol className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
            {lessonSteps.map((s, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg bg-ink-50 px-3 py-2 text-ink-700 dark:bg-ink-900/60 dark:text-ink-200"
              >
                <span className="w-6 flex-none text-right font-mono text-xs text-ink-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Prev / Next */}
      <nav className="mt-14 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/tracks/${prev.slug}`}
            className="group rounded-xl border border-ink-200 bg-white p-4 transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500"
          >
            <div className="text-xs text-ink-500 dark:text-ink-400">← Previous track</div>
            <div className="mt-1 font-semibold text-ink-900 dark:text-ink-50">{prev.emoji} {prev.title}</div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/tracks/${next.slug}`}
            className="group rounded-xl border border-ink-200 bg-white p-4 text-right transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500"
          >
            <div className="text-xs text-ink-500 dark:text-ink-400">Next track →</div>
            <div className="mt-1 font-semibold text-ink-900 dark:text-ink-50">{next.emoji} {next.title}</div>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
