import Hero from "@/components/Hero";
import PhilosophyFlow from "@/components/PhilosophyFlow";
import TrackCard from "@/components/TrackCard";
import ResumeWidget from "@/components/ResumeWidget";
import Link from "next/link";
import { levels, tracks, tracksByLevel } from "@/lib/tracks";

const audiences = [
  { title: "Software engineers", detail: "Frontend, backend, Java, Python — move into AI Engineering." },
  { title: "Data / ML engineers", detail: "Level up from pipelines and models into LLMs and agents." },
  { title: "AI engineers", detail: "Deepen into agents, MCP, evaluation, production, and system design." },
  { title: "Students", detail: "Get a real, project-heavy foundation, not just theory." },
];

const killerFeatures = [
  {
    title: "Explain → Experiment → Build",
    body: "Every concept has a theory panel, an interactive visualization, and runnable code. Change parameters and see what breaks.",
    emoji: "🧫",
  },
  {
    title: "From-scratch AND production",
    body: "Build linear regression, backprop, and a tiny GPT by hand. Then use the same idea via scikit-learn, PyTorch, and LangGraph.",
    emoji: "🧬",
  },
  {
    title: "Portfolio, not certificate",
    body: "Every track ships a real artifact — a semantic search engine, a chat-with-PDF, a research agent, a production RAG API.",
    emoji: "🏆",
  },
  {
    title: "AI tutor built in",
    body: "Ask the tutor why your gradient went negative or your retriever missed. It knows the current lesson.",
    emoji: "🤖",
  },
  {
    title: "Real production track",
    body: "Observability, cost, retries, fallback, security, and system design — the parts most courses skip.",
    emoji: "🚀",
  },
  {
    title: "Personalized paths",
    body: "Skip what you know. Start where you are — beginner, senior, or crossing over from data engineering.",
    emoji: "🧭",
  },
];

export default function Home() {
  const featured = tracks.filter((t) =>
    ["transformers", "rag", "ai-agents", "multi-agent", "llm-from-scratch", "ai-production"].includes(t.slug),
  );

  return (
    <>
      <Hero />

      {/* Resume widget — only renders if user has progress */}
      <ResumeWidget />

      {/* Philosophy */}
      <section className="section mx-auto max-w-6xl px-4">
        <PhilosophyFlow />
      </section>

      {/* Killer features */}
      <section className="section mx-auto max-w-6xl px-4">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            What makes it different
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">
            A learning platform for people who ship
          </h2>
          <p className="mt-3 text-ink-600 dark:text-ink-300">
            Course + interactive lab + AI tutor + coding platform + project platform + portfolio builder + system
            design lab + interview prep. One place.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {killerFeatures.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card dark:border-ink-700 dark:bg-ink-800"
            >
              <div className="text-2xl">{f.emoji}</div>
              <h3 className="mt-3 text-lg font-semibold text-ink-900 dark:text-ink-50">{f.title}</h3>
              <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-300">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured tracks */}
      <section className="section mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
              Featured tracks
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">
              Six of the twenty-seven
            </h2>
          </div>
          <Link
            href="/tracks"
            className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-800 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 dark:hover:bg-ink-700"
          >
            All 27 tracks →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => (
            <TrackCard key={t.slug} track={t} />
          ))}
        </div>
      </section>

      {/* By level */}
      <section className="section mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            Your path
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">
            Grouped into four levels
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {levels.map((l) => {
            const items = tracksByLevel(l);
            return (
              <div
                key={l}
                className="rounded-2xl border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-800"
              >
                <div className="text-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  Level
                </div>
                <div className="mt-1 text-lg font-semibold text-ink-900 dark:text-ink-50">{l}</div>
                <div className="mt-2 text-xs text-ink-500 dark:text-ink-400">
                  {items.length} tracks · {items.reduce((s, t) => s + t.hours, 0)}h
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {items.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/tracks/${t.slug}`}
                        className="flex items-center gap-2 text-ink-700 hover:text-brand-600 dark:text-ink-200 dark:hover:text-brand-300"
                      >
                        <span className="text-base">{t.emoji}</span>
                        <span>{t.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Audience */}
      <section className="section mx-auto max-w-6xl px-4">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            Who it&apos;s for
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">
            Built for working engineers
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-800"
            >
              <div className="text-lg font-semibold text-ink-900 dark:text-ink-50">{a.title}</div>
              <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{a.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-10 text-white shadow-card sm:p-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Learn it. See it. Code it. Break it. Fix it. Build it. Ship it.
            </h2>
            <p className="mt-4 text-white/90">
              End goal isn&apos;t &quot;I completed a course.&quot; It&apos;s: I understand how AI works, I can implement
              the core concepts, I use production frameworks, and I have working projects to prove it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tracks"
                className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-card transition hover:bg-ink-100"
              >
                Start with track 00 →
              </Link>
              <Link
                href="/skill-tree"
                className="rounded-lg border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                See the skill tree
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
