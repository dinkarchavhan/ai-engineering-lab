// Minimal markdown-ish renderer for lesson prose.
// Supports: paragraphs (blank-line separated), **bold**, *italic*, `code`, and
// [link](url). Deliberately small — lessons are structured content, not raw MD.

import React from "react";

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let remaining = text;
  let n = 0;

  // Precedence: `code` first, then **bold**, then *italic*, then [link](url).
  const patterns: {
    re: RegExp;
    render: (match: RegExpMatchArray, key: string) => React.ReactNode;
  }[] = [
    {
      re: /`([^`]+)`/,
      render: (m, key) => (
        <code
          key={key}
          className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[0.9em] text-ink-800 dark:bg-ink-800 dark:text-ink-100"
        >
          {m[1]}
        </code>
      ),
    },
    {
      re: /\*\*([^*]+)\*\*/,
      render: (m, key) => (
        <strong key={key} className="font-semibold text-ink-900 dark:text-ink-50">
          {m[1]}
        </strong>
      ),
    },
    {
      re: /\*([^*]+)\*/,
      render: (m, key) => <em key={key}>{m[1]}</em>,
    },
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      render: (m, key) => (
        <a
          key={key}
          href={m[2]}
          className="text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
        >
          {m[1]}
        </a>
      ),
    },
  ];

  while (remaining.length > 0) {
    let earliestIdx = -1;
    let earliestMatch: RegExpMatchArray | null = null;
    let earliestRender: ((m: RegExpMatchArray, key: string) => React.ReactNode) | null = null;

    for (const p of patterns) {
      const m = remaining.match(p.re);
      if (m && m.index !== undefined && (earliestIdx === -1 || m.index < earliestIdx)) {
        earliestIdx = m.index;
        earliestMatch = m;
        earliestRender = p.render;
      }
    }

    if (!earliestMatch || earliestIdx === -1) {
      out.push(remaining);
      break;
    }

    if (earliestIdx > 0) out.push(remaining.slice(0, earliestIdx));
    out.push(earliestRender!(earliestMatch, `${keyPrefix}-${n++}`));
    remaining = remaining.slice(earliestIdx + earliestMatch[0].length);
  }

  return out;
}

export default function Prose({ content }: { content: string }) {
  const paragraphs = content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="space-y-4 text-[17px] leading-[1.75] text-ink-700 dark:text-ink-200">
      {paragraphs.map((p, i) => (
        <p key={i}>{inline(p, `p${i}`)}</p>
      ))}
    </div>
  );
}
