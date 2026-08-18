import Link from "next/link";

export const metadata = {
  title: "About — AI Engineering Lab",
  description: "The philosophy, principles, and stack behind AI Engineering Lab.",
};

const principles = [
  "First principles before frameworks.",
  "Explain why before explaining how.",
  "Every theory concept gets a practical example.",
  "Every major concept has runnable code.",
  "Compare from-scratch with production libraries.",
  "Visualizations for hard concepts.",
  "Let learners experiment with parameters.",
  "Teach debugging and failure modes.",
  "Include interview questions and challenges.",
  "End every track with a portfolio-ready project.",
  "Teach production engineering, security, evaluation, observability.",
  "Keep the curriculum modular and content-driven.",
  "Personalized learning paths.",
  "Stay close to real software engineering.",
  "Reachable for experienced devs without a math PhD.",
];

const stack = {
  Frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Monaco Editor", "Mermaid", "React Flow", "D3.js"],
  Backend: ["Python", "FastAPI"],
  Data: ["PostgreSQL", "pgvector", "Redis"],
  AI: ["Ollama", "OpenAI-compatible APIs", "Hugging Face", "PyTorch", "scikit-learn", "LangChain", "LangGraph"],
  "Code execution": ["Isolated sandbox containers"],
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
      <header className="mb-14">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          About
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-5xl">
          Learn it. See it. Code it. Break it. Fix it. Build it. Ship it.
        </h1>
        <p className="mt-4 text-lg text-ink-600 dark:text-ink-300">
          AI Engineering Lab is a learning platform where every concept is taught through intuition,
          visuals, mathematics, code, experiments, real examples, real projects, and production
          implementations.
        </p>
      </header>

      <section id="philosophy" className="mb-16">
        <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Principles</h2>
        <p className="mt-2 text-ink-600 dark:text-ink-300">Fifteen non-negotiable design rules.</p>
        <ol className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
          {principles.map((p, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-ink-200 bg-white p-3 dark:border-ink-700 dark:bg-ink-800"
            >
              <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-ink-800 dark:text-ink-100">{p}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="stack" className="mb-16">
        <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Recommended stack</h2>
        <p className="mt-2 text-ink-600 dark:text-ink-300">
          What we build the platform on, and what we teach.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Object.entries(stack).map(([group, items]) => (
            <div
              key={group}
              className="rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-800"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
                {group}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700 dark:bg-ink-900/60 dark:text-ink-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-10 text-white shadow-card sm:p-14">
        <h2 className="text-2xl font-bold sm:text-3xl">The end goal</h2>
        <p className="mt-4 text-white/90">
          Not: &quot;I completed an AI course.&quot;
        </p>
        <p className="mt-2 text-white/90">
          But: &quot;I understand how AI works, I can implement the core concepts, I can use production AI
          frameworks, I can build RAG and agentic systems, I can design production AI architectures, and
          I have working projects to prove it.&quot;
        </p>
        <div className="mt-8">
          <Link
            href="/tracks"
            className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-card transition hover:bg-ink-100"
          >
            Start with track 00 →
          </Link>
        </div>
      </section>
    </div>
  );
}
