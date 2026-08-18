import type { Block } from "@/lib/content";
import Prose from "./Prose";
import CodeBlock from "./CodeBlock";
import Mermaid from "./Mermaid";
import Quiz from "./Quiz";

const calloutStyles: Record<string, { border: string; bg: string; label: string; icon: string; text: string }> = {
  insight: {
    border: "border-brand-300 dark:border-brand-500/40",
    bg: "bg-brand-50/70 dark:bg-brand-500/10",
    label: "Insight",
    icon: "💡",
    text: "text-brand-800 dark:text-brand-200",
  },
  warning: {
    border: "border-rose-300 dark:border-rose-500/40",
    bg: "bg-rose-50/70 dark:bg-rose-500/10",
    label: "Warning",
    icon: "⚠️",
    text: "text-rose-800 dark:text-rose-200",
  },
  tip: {
    border: "border-emerald-300 dark:border-emerald-500/40",
    bg: "bg-emerald-50/70 dark:bg-emerald-500/10",
    label: "Tip",
    icon: "🌱",
    text: "text-emerald-800 dark:text-emerald-200",
  },
  gotcha: {
    border: "border-amber-300 dark:border-amber-500/40",
    bg: "bg-amber-50/70 dark:bg-amber-500/10",
    label: "Common mistake",
    icon: "🪤",
    text: "text-amber-800 dark:text-amber-200",
  },
  math: {
    border: "border-accent-500/40",
    bg: "bg-accent-500/10",
    label: "Math",
    icon: "∑",
    text: "text-accent-600 dark:text-accent-400",
  },
};

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "text":
            return <Prose key={i} content={b.content} />;
          case "code":
            return <CodeBlock key={i} code={b.code} language={b.language} label={b.label} />;
          case "diagram":
            return <Mermaid key={i} chart={b.chart} label={b.label} />;
          case "callout": {
            const s = calloutStyles[b.kind];
            return (
              <div
                key={i}
                className={`my-6 rounded-2xl border-2 ${s.border} ${s.bg} p-5`}
              >
                <div className={`mb-2 text-xs font-semibold uppercase tracking-wider ${s.text}`}>
                  <span className="mr-1.5">{s.icon}</span>
                  {b.title ?? s.label}
                </div>
                <Prose content={b.content} />
              </div>
            );
          }
          case "list":
            if (b.style === "number") {
              return (
                <ol key={i} className="my-4 list-inside list-decimal space-y-2 text-ink-700 dark:text-ink-200">
                  {b.items.map((item, j) => (
                    <li key={j} className="text-[16px] leading-relaxed">
                      <Prose content={item} />
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={i} className="my-4 space-y-2">
                {b.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-[16px] leading-relaxed text-ink-700 dark:text-ink-200">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
                    <div className="flex-1"><Prose content={item} /></div>
                  </li>
                ))}
              </ul>
            );
          case "kv":
            return (
              <div
                key={i}
                className="my-6 overflow-hidden rounded-2xl border border-ink-200 dark:border-ink-700"
              >
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-ink-200 bg-white dark:divide-ink-700 dark:bg-ink-800">
                    {b.items.map((row, j) => (
                      <tr key={j}>
                        <th className="w-1/3 bg-ink-50 px-4 py-3 text-left font-semibold text-ink-800 dark:bg-ink-900/60 dark:text-ink-100">
                          {row.key}
                        </th>
                        <td className="px-4 py-3 text-ink-700 dark:text-ink-200">
                          <Prose content={row.value} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "quiz":
            return (
              <Quiz
                key={i}
                question={b.question}
                options={b.options}
                correct={b.correct}
                explanation={b.explanation}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
