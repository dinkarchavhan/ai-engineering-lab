const steps = [
  { label: "Real problem", emoji: "❓" },
  { label: "Simple intuition", emoji: "💡" },
  { label: "Visual", emoji: "📊" },
  { label: "Mathematics", emoji: "∑" },
  { label: "From scratch", emoji: "🧪" },
  { label: "Production library", emoji: "📦" },
  { label: "Interactive lab", emoji: "🧫" },
  { label: "Real project", emoji: "🛠️" },
  { label: "Deployment", emoji: "🚀" },
];

export default function PhilosophyFlow() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-200 bg-white p-6 shadow-card dark:border-ink-700 dark:bg-ink-800 sm:p-8">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            Learning philosophy
          </div>
          <h3 className="mt-1 text-2xl font-semibold text-ink-900 dark:text-ink-50">
            Every concept, nine ways
          </h3>
        </div>
        <p className="max-w-md text-sm text-ink-600 dark:text-ink-300">
          You don&apos;t truly understand a concept until you can explain it, draw it, code it,
          break it, and ship it. So every lesson does all nine.
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {steps.map((s, i) => (
          <li
            key={s.label}
            className="group relative flex flex-col items-center rounded-xl border border-ink-200 bg-ink-50 p-3 text-center transition hover:border-brand-300 dark:border-ink-700 dark:bg-ink-900/60 dark:hover:border-brand-500"
          >
            <div className="text-2xl">{s.emoji}</div>
            <div className="mt-2 text-[11px] font-medium leading-tight text-ink-700 dark:text-ink-200">
              {s.label}
            </div>
            <div className="absolute -top-2 left-2 rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {String(i + 1).padStart(2, "0")}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
