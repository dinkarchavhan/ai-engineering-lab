import Link from "next/link";
import { tracks } from "@/lib/tracks";

export const metadata = {
  title: "Portfolio Projects — AI Engineering Lab",
  description: "Every track ends with a shippable, portfolio-ready project.",
};

const artifacts = [
  { topic: "Python", artifact: "CLI tool" },
  { topic: "ML", artifact: "Prediction API" },
  { topic: "Deep Learning", artifact: "Trained model" },
  { topic: "NLP", artifact: "Text classifier" },
  { topic: "Embeddings", artifact: "Semantic search engine" },
  { topic: "RAG", artifact: "PDF chatbot" },
  { topic: "Fine-tuning", artifact: "Custom model" },
  { topic: "Agents", artifact: "AI agent" },
  { topic: "LangGraph", artifact: "Workflow" },
  { topic: "MCP", artifact: "MCP server" },
  { topic: "Multimodal", artifact: "Document AI" },
  { topic: "SQL Agent", artifact: "Data analyst" },
  { topic: "Multi-Agent", artifact: "Research system" },
  { topic: "Production", artifact: "Deployed AI API" },
];

const capstones = [
  {
    level: "Beginner",
    name: "AI Chatbot",
    color: "from-emerald-500 to-emerald-400",
    features: ["Chat UI", "Streaming responses", "Conversation history", "Local or hosted LLM"],
  },
  {
    level: "Intermediate",
    name: "PDF RAG Assistant",
    color: "from-brand-500 to-brand-400",
    features: ["Upload PDFs", "Chunk + embed + store", "Hybrid retrieval", "Cited answers"],
  },
  {
    level: "Advanced",
    name: "Enterprise Knowledge Assistant",
    color: "from-accent-500 to-brand-500",
    features: ["Multi-tenant", "RBAC", "Audit logs", "Evals in CI"],
  },
  {
    level: "Expert",
    name: "Multi-Agent Research System",
    color: "from-purple-500 to-accent-500",
    features: ["Planner → workers", "Web + doc tools", "Reflection loop", "Report generation"],
  },
  {
    level: "Senior",
    name: "AI Software Development Platform",
    color: "from-rose-500 to-orange-500",
    features: ["PM / Architect / Dev / Tester agents", "Repo sandbox", "Guardrails", "Human approval nodes"],
  },
  {
    level: "Architect",
    name: "Enterprise Agentic AI Platform",
    color: "from-orange-500 to-yellow-500",
    features: ["Model gateway", "Multi-region", "Cost dashboards", "Compliance"],
  },
];

export default function ProjectsPage() {
  const allProjects = tracks.flatMap((t) =>
    t.projects.map((p) => ({ project: p, track: t })),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <header className="mb-14 max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Portfolio
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-5xl">
          Every track ships a real artifact
        </h1>
        <p className="mt-3 text-ink-600 dark:text-ink-300">
          The end goal isn&apos;t a certificate — it&apos;s a GitHub-ready portfolio. Sixty-plus projects you
          can point at in interviews.
        </p>
      </header>

      {/* Capstones */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-ink-900 dark:text-ink-50">Capstone projects, by level</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capstones.map((c) => (
            <div
              key={c.level}
              className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-white p-6 shadow-card dark:border-ink-700 dark:bg-ink-800"
            >
              <div
                className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-2xl transition group-hover:opacity-40`}
              />
              <div className="text-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
                {c.level}
              </div>
              <h3 className="mt-1 text-xl font-bold text-ink-900 dark:text-ink-50">{c.name}</h3>
              <ul className="mt-4 space-y-1.5 text-sm">
                {c.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-ink-700 dark:text-ink-200">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-brand-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Artifact table */}
      <section className="mb-16">
        <h2 className="mb-2 text-2xl font-bold text-ink-900 dark:text-ink-50">Artifact per topic</h2>
        <p className="mb-6 text-ink-600 dark:text-ink-300">
          Every major topic produces a portable, portfolio-friendly artifact.
        </p>
        <div className="overflow-hidden rounded-2xl border border-ink-200 dark:border-ink-700">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 dark:bg-ink-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-ink-900 dark:text-ink-50">Topic</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-900 dark:text-ink-50">Artifact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200 bg-white dark:divide-ink-700 dark:bg-ink-800/50">
              {artifacts.map((a) => (
                <tr key={a.topic}>
                  <td className="px-4 py-3 font-medium text-ink-800 dark:text-ink-100">{a.topic}</td>
                  <td className="px-4 py-3 text-ink-600 dark:text-ink-300">{a.artifact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* All projects, grouped */}
      <section>
        <h2 className="mb-2 text-2xl font-bold text-ink-900 dark:text-ink-50">
          All {allProjects.length} projects
        </h2>
        <p className="mb-6 text-ink-600 dark:text-ink-300">
          Grouped by track. Every one is designed to be shippable to GitHub with a README.
        </p>
        <div className="space-y-6">
          {tracks
            .filter((t) => t.projects.length > 0)
            .map((t) => (
              <div
                key={t.slug}
                className="rounded-2xl border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Link
                    href={`/tracks/${t.slug}`}
                    className="flex items-center gap-3 text-lg font-semibold text-ink-900 hover:text-brand-600 dark:text-ink-50 dark:hover:text-brand-300"
                  >
                    <span>{t.emoji}</span>
                    <span>Track {t.number} · {t.title}</span>
                  </Link>
                  <span className="text-xs text-ink-500 dark:text-ink-400">
                    {t.projects.length} project{t.projects.length !== 1 && "s"}
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {t.projects.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-ink-200 bg-ink-50 p-3 text-sm dark:border-ink-700 dark:bg-ink-900/60"
                    >
                      <span className="text-brand-500">▸</span>
                      <span className="text-ink-800 dark:text-ink-100">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
