import Link from "next/link";
import { levels, tracksByLevel } from "@/lib/tracks";

export const metadata = {
  title: "Learning Roadmap — AI Engineering Lab",
  description: "The full path from Python and math to production AI systems.",
};

const roadmapPhases = [
  {
    phase: "Phase 1",
    title: "Foundations",
    focus: "Python, math, dev tooling",
    level: "Foundations" as const,
    color: "from-emerald-500 to-emerald-400",
    weeks: "1–3",
  },
  {
    phase: "Phase 2",
    title: "AI Core",
    focus: "Classical ML, deep learning, PyTorch, CV, NLP",
    level: "AI Core" as const,
    color: "from-brand-500 to-brand-400",
    weeks: "4–10",
  },
  {
    phase: "Phase 3",
    title: "AI Engineering",
    focus: "Transformers, LLMs, RAG, fine-tuning, evaluation",
    level: "AI Engineering" as const,
    color: "from-accent-500 to-brand-500",
    weeks: "11–18",
  },
  {
    phase: "Phase 4",
    title: "Advanced",
    focus: "Agents, MCP, multi-agent, production, system design",
    level: "Advanced" as const,
    color: "from-rose-500 to-accent-500",
    weeks: "19–28",
  },
];

const personas = [
  {
    role: "Frontend / backend developer",
    path: ["00", "01", "02", "04", "08", "11", "12", "13", "16", "24"],
    skip: [],
  },
  {
    role: "Data / ML engineer",
    path: ["04", "05", "08", "10", "11", "12", "13", "14", "16", "22", "24"],
    skip: ["00", "01", "02", "03"],
  },
  {
    role: "Senior engineer, new to AI",
    path: ["01", "02", "04", "08", "11", "12", "13", "16", "17", "19", "24", "25"],
    skip: ["00"],
  },
  {
    role: "Student",
    path: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "10", "11", "12", "13", "16"],
    skip: [],
  },
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <header className="mb-14 max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Roadmap
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-5xl">
          Your path to AI Engineer
        </h1>
        <p className="mt-3 text-ink-600 dark:text-ink-300">
          Four phases, twenty-seven tracks. Roughly six months at 8 hours/week — faster if you skip what
          you already know. Every phase ends with a portfolio project.
        </p>
      </header>

      {/* Phases */}
      <section className="mb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {roadmapPhases.map((p, i) => {
            const items = tracksByLevel(p.level);
            return (
              <div
                key={p.phase}
                className="relative overflow-hidden rounded-2xl border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-800"
              >
                <div className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br ${p.color} opacity-10 blur-2xl`} />
                <div className="text-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  {p.phase} · Weeks {p.weeks}
                </div>
                <div className="mt-1 text-xl font-bold text-ink-900 dark:text-ink-50">{p.title}</div>
                <div className="mt-2 text-sm text-ink-600 dark:text-ink-300">{p.focus}</div>
                <div className="mt-4 text-xs text-ink-500 dark:text-ink-400">
                  {items.length} tracks · {items.reduce((s, t) => s + t.hours, 0)}h
                </div>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {items.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/tracks/${t.slug}`}
                        className="flex items-center gap-2 text-ink-700 hover:text-brand-600 dark:text-ink-200 dark:hover:text-brand-300"
                      >
                        <span>{t.emoji}</span>
                        <span className="truncate">{t.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full linear roadmap */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-ink-900 dark:text-ink-50">The complete order</h2>
        <ol className="relative border-l-2 border-brand-200 pl-6 dark:border-brand-500/30">
          {levels.map((level) =>
            tracksByLevel(level).map((t) => (
              <li key={t.slug} className="mb-6 last:mb-0">
                <span className="absolute -left-[9px] mt-1 grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-[8px] font-bold text-white">
                  {t.number}
                </span>
                <Link
                  href={`/tracks/${t.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-ink-200 bg-white p-4 transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{t.emoji}</span>
                    <div>
                      <div className="font-semibold text-ink-900 dark:text-ink-50">{t.title}</div>
                      <div className="text-sm text-ink-500 dark:text-ink-400">{t.tagline}</div>
                    </div>
                  </div>
                  <div className="hidden text-xs text-ink-500 sm:block dark:text-ink-400">{t.hours}h</div>
                </Link>
              </li>
            )),
          )}
        </ol>
      </section>

      {/* Personas */}
      <section>
        <h2 className="mb-2 text-2xl font-bold text-ink-900 dark:text-ink-50">Suggested paths by background</h2>
        <p className="mb-8 text-ink-600 dark:text-ink-300">
          You&apos;re not starting from zero. Skip what you already know.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {personas.map((p) => (
            <div
              key={p.role}
              className="rounded-2xl border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-800"
            >
              <div className="text-lg font-semibold text-ink-900 dark:text-ink-50">{p.role}</div>
              {p.skip.length > 0 && (
                <div className="mt-2 text-xs text-ink-500 dark:text-ink-400">
                  Skip: {p.skip.join(", ")}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.path.map((n) => (
                  <span
                    key={n}
                    className="rounded-md bg-brand-50 px-2 py-1 font-mono text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
