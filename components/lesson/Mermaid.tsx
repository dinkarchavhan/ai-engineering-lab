"use client";
import { useEffect, useRef, useState } from "react";

let mermaidLoader: Promise<typeof import("mermaid").default> | null = null;
function loadMermaid() {
  if (!mermaidLoader) {
    mermaidLoader = import("mermaid").then((m) => m.default);
  }
  return mermaidLoader;
}

export default function Mermaid({ chart, label }: { chart: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const idRef = useRef(`m-${Math.random().toString(36).slice(2, 10)}`);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        const mermaid = await loadMermaid();
        const isDark = document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          themeVariables: isDark
            ? {
                background: "#1b1d28",
                primaryColor: "#2b2e3c",
                primaryTextColor: "#ebedf2",
                primaryBorderColor: "#3d4152",
                lineColor: "#a8b0be",
                secondaryColor: "#155ad1",
                tertiaryColor: "#7c3aed",
              }
            : {
                background: "#ffffff",
                primaryColor: "#eef7ff",
                primaryTextColor: "#0f1017",
                primaryBorderColor: "#8ecdff",
                lineColor: "#54596b",
                secondaryColor: "#d9edff",
                tertiaryColor: "#a78bfa",
              },
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          flowchart: { htmlLabels: true, curve: "basis", padding: 12 },
        });
        const { svg } = await mermaid.render(idRef.current, chart);
        if (!cancelled) setSvg(svg);
      } catch (e) {
        if (!cancelled) setErr(String(e));
      }
    };

    render();

    const obs = new MutationObserver(() => render());
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelled = true;
      obs.disconnect();
    };
  }, [chart]);

  return (
    <figure className="my-6">
      <div
        ref={ref}
        className="mermaid-frame flex justify-center overflow-x-auto rounded-2xl border border-ink-200 bg-ink-50/60 p-6 dark:border-ink-700 dark:bg-ink-900/50"
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      >
        {!svg && !err && (
          <div className="text-sm text-ink-400 dark:text-ink-500">Rendering diagram…</div>
        )}
        {err && (
          <pre className="text-xs text-rose-500">{err}</pre>
        )}
      </div>
      {label && (
        <figcaption className="mt-2 text-center text-xs text-ink-500 dark:text-ink-400">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
