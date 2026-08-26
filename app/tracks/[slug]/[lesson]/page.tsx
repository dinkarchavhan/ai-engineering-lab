import Link from "next/link";
import { notFound } from "next/navigation";
import { tracks, getTrack } from "@/lib/tracks";
import { getLesson, getLessonsForTrack } from "@/lib/content";
import { getTensorFlowBlocks } from "@/lib/tensorflow-examples";
import Blocks from "@/components/lesson/Blocks";
import CompleteButton from "@/components/lesson/CompleteButton";
import SupportBanner from "@/components/SupportBanner";

export function generateStaticParams() {
  const out: { slug: string; lesson: string }[] = [];
  for (const t of tracks) {
    for (const l of getLessonsForTrack(t.slug)) {
      out.push({ slug: t.slug, lesson: l.slug });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
  const { slug, lesson } = await params;
  const l = getLesson(slug, lesson);
  if (!l) return { title: "Lesson not found" };
  return { title: `${l.title} — AI Engineering Lab`, description: l.subtitle };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
  const { slug, lesson } = await params;
  const track = getTrack(slug);
  const l = getLesson(slug, lesson);
  if (!track || !l) notFound();

  const lessons = getLessonsForTrack(slug);
  const idx = lessons.findIndex((x) => x.slug === lesson);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;
  const tensorFlowBlocks = getTensorFlowBlocks(slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm">
        <Link href={`/tracks/${slug}`} className="text-ink-500 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-300">
          ← {track!.title}
        </Link>
        <span className="text-ink-300 dark:text-ink-600">/</span>
        <span className="text-ink-700 dark:text-ink-200">Lesson {String(l!.order).padStart(2, "0")}</span>
      </div>

      {/* Header */}
      <header className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          {track!.emoji} Track {track!.number} · {track!.title}
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-5xl">
          {l!.title}
        </h1>
        <p className="mt-3 text-lg text-ink-600 dark:text-ink-300">{l!.subtitle}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
          <span className="chip">{l!.minutes} min read</span>
          {l!.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </header>

      {/* Table of contents */}
      <details className="mb-10 rounded-2xl border border-ink-200 bg-ink-50 p-4 dark:border-ink-700 dark:bg-ink-900/40">
        <summary className="cursor-pointer text-sm font-semibold text-ink-800 dark:text-ink-100">
          Contents ({l!.sections.length} sections)
        </summary>
        <ol className="mt-3 grid gap-1.5 pl-1 text-sm sm:grid-cols-2">
          {l!.sections.map((s, i) => (
            <li key={i}>
              <a
                href={`#step-${s.step}`}
                className="flex items-center gap-2 rounded px-2 py-1 text-ink-600 hover:bg-white hover:text-brand-600 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-brand-300"
              >
                <span className="w-6 font-mono text-[10px] text-ink-400">
                  {String(s.step).padStart(2, "0")}
                </span>
                <span className="truncate">{s.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>

      {/* Sections */}
      {l!.sections.map((s, i) => (
        <section key={i} id={`step-${s.step}`} className="mb-14 scroll-mt-24">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white shadow-card">
              {String(s.step).padStart(2, "0")}
            </span>
            <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-50">{s.title}</h2>
          </div>
          <Blocks blocks={s.blocks} />
        </section>
      ))}

      {tensorFlowBlocks && (
        <section className="mb-14 rounded-2xl border border-orange-200 bg-orange-50/60 p-6 dark:border-orange-500/30 dark:bg-orange-500/5">
          <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-50">TensorFlow / Keras alternative</h2>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
            A comparable implementation for this track&apos;s concepts. The dedicated PyTorch course remains PyTorch-first.
          </p>
          <Blocks blocks={tensorFlowBlocks} />
        </section>
      )}

      {/* Complete + Support */}
      <div className="mt-14 flex flex-col gap-4">
        <CompleteButton trackSlug={slug} lessonSlug={lesson} />
        <SupportBanner />
      </div>

      {/* Prev / Next */}
      <nav className="mt-8 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/tracks/${slug}/${prev.slug}`}
            className="rounded-xl border border-ink-200 bg-white p-4 transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500"
          >
            <div className="text-xs text-ink-500 dark:text-ink-400">← Previous</div>
            <div className="mt-1 font-semibold text-ink-900 dark:text-ink-50">{prev.title}</div>
          </Link>
        ) : (
          <Link
            href={`/tracks/${slug}`}
            className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-800"
          >
            <div className="text-xs text-ink-500 dark:text-ink-400">← Back to track</div>
            <div className="mt-1 font-semibold text-ink-900 dark:text-ink-50">{track!.title}</div>
          </Link>
        )}
        {next ? (
          <Link
            href={`/tracks/${slug}/${next.slug}`}
            className="rounded-xl border border-ink-200 bg-white p-4 text-right transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500"
          >
            <div className="text-xs text-ink-500 dark:text-ink-400">Next →</div>
            <div className="mt-1 font-semibold text-ink-900 dark:text-ink-50">{next.title}</div>
          </Link>
        ) : (
          <Link
            href={`/tracks/${slug}`}
            className="rounded-xl border border-ink-200 bg-brand-50 p-4 text-right transition hover:border-brand-300 dark:border-ink-700 dark:bg-brand-500/10"
          >
            <div className="text-xs text-brand-600 dark:text-brand-300">Finished the track →</div>
            <div className="mt-1 font-semibold text-ink-900 dark:text-ink-50">Back to overview</div>
          </Link>
        )}
      </nav>
    </article>
  );
}
