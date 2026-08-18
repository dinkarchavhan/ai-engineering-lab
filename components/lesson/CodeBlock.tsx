"use client";
import { useState } from "react";

const langLabels: Record<string, string> = {
  python: "Python",
  javascript: "JavaScript",
  typescript: "TypeScript",
  bash: "Bash",
  json: "JSON",
  yaml: "YAML",
  sql: "SQL",
  math: "Math",
  text: "Output",
};

export default function CodeBlock({
  code,
  language,
  label,
}: {
  code: string;
  language: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-ink-200 bg-ink-900 shadow-card dark:border-ink-700">
      <div className="flex items-center justify-between bg-ink-800 px-4 py-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-rose-400/70" />
          <span className="h-2 w-2 rounded-full bg-amber-400/70" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
          <span className="ml-3 font-mono text-ink-300">
            {label ?? langLabels[language] ?? language}
          </span>
        </div>
        <button
          onClick={copy}
          className="rounded px-2 py-1 text-xs font-medium text-ink-300 hover:bg-ink-700 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed">
        <code className="font-mono text-ink-100">{code}</code>
      </pre>
    </figure>
  );
}
