import SkillTreeClient from "@/components/SkillTreeClient";

export const metadata = {
  title: "Skill Tree — AI Engineering Lab",
  description: "The AI Engineer skill tree — ML, LLMs, Agents, and Production AI.",
};

const branches = [
  {
    name: "Machine Learning",
    color: "from-emerald-500 to-emerald-400",
    lightBg: "bg-emerald-50 border-emerald-200",
    darkBg: "dark:bg-emerald-500/10 dark:border-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-300",
    trackSlugs: ["classical-ml", "ml-from-scratch", "deep-learning", "pytorch", "computer-vision", "nlp"],
    unlocks: ["Model training", "Evaluation", "Feature engineering", "Neural nets", "Transfer learning"],
  },
  {
    name: "LLMs",
    color: "from-brand-500 to-brand-400",
    lightBg: "bg-brand-50 border-brand-200",
    darkBg: "dark:bg-brand-500/10 dark:border-brand-500/20",
    text: "text-brand-700 dark:text-brand-300",
    trackSlugs: ["transformers", "llm-from-scratch", "llm-engineering", "embeddings-vector-db", "rag", "fine-tuning", "llm-evaluation"],
    unlocks: ["Prompt engineering", "Vector search", "RAG pipelines", "Fine-tuning", "Evaluation"],
  },
  {
    name: "Agents",
    color: "from-accent-500 to-brand-500",
    lightBg: "bg-purple-50 border-purple-200",
    darkBg: "dark:bg-purple-500/10 dark:border-purple-500/20",
    text: "text-purple-700 dark:text-purple-300",
    trackSlugs: ["ai-agents", "langchain-langgraph", "mcp", "multi-agent", "multimodal", "ai-and-databases"],
    unlocks: ["Tool calling", "ReAct loops", "State machines", "MCP servers", "Multi-agent orchestration"],
  },
  {
    name: "Production AI",
    color: "from-rose-500 to-orange-500",
    lightBg: "bg-rose-50 border-rose-200",
    darkBg: "dark:bg-rose-500/10 dark:border-rose-500/20",
    text: "text-rose-700 dark:text-rose-300",
    trackSlugs: ["ai-infrastructure", "ai-security", "ai-production", "ai-system-design", "capstone"],
    unlocks: ["Serving at scale", "Observability", "Cost control", "Security", "System design"],
  },
];

export default function SkillTreePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <header className="mb-14 max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          Skill tree
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-5xl">
          The AI Engineer skill tree
        </h1>
        <p className="mt-3 text-ink-600 dark:text-ink-300">
          Four branches, one destination. Every completed track unlocks a skill and adds an artifact to your portfolio.
        </p>
      </header>

      {/* Root */}
      <div className="mb-10 flex justify-center">
        <div className="relative rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 px-8 py-5 text-center text-white shadow-card">
          <div className="text-xs uppercase tracking-wider opacity-80">Destination</div>
          <div className="mt-1 text-2xl font-bold">AI Engineer</div>
        </div>
      </div>

      <SkillTreeClient branches={branches} />
    </div>
  );
}
