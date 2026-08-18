import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero-grid relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> AI Engineering, from first principles to production
        </div>

        <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-ink-900 sm:text-6xl dark:text-ink-50">
          Don&apos;t just <span className="text-ink-400 dark:text-ink-500">learn</span> AI.{" "}
          <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
            Understand it, build it, ship it.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-ink-600 dark:text-ink-300">
          Twenty-seven tracks that take you from Python and gradient descent all the way to multi-agent
          systems, MCP, and production LLM infrastructure. Every concept has intuition, visuals, math,
          from-scratch code, a production library, and a real project.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/tracks"
            className="rounded-lg bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100"
          >
            Explore the 27 tracks →
          </Link>
          <Link
            href="/roadmap"
            className="rounded-lg border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 dark:hover:bg-ink-700"
          >
            See the roadmap
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: "27", v: "learning tracks" },
            { k: "400+", v: "topics covered" },
            { k: "60+", v: "portfolio projects" },
            { k: "1 goal", v: "AI Engineer" },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-2xl border border-ink-200 bg-white/70 p-5 backdrop-blur dark:border-ink-700 dark:bg-ink-800/60"
            >
              <div className="text-2xl font-bold text-ink-900 dark:text-ink-50">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
