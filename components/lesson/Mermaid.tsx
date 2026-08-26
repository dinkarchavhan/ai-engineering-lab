"use client";
import { useEffect, useRef, useState } from "react";

let mermaidLoader: Promise<typeof import("mermaid").default> | null = null;
function loadMermaid() {
  if (!mermaidLoader) {
    mermaidLoader = import("mermaid").then((m) => m.default);
  }
  return mermaidLoader;
}

// Monotonic counter — unique per render call, avoids Mermaid v11's
// "duplicate id" error when the same component re-renders (theme toggle, HMR).
let renderCounter = 0;

function isDarkMode() {
  if (typeof document === "undefined") return false;
  const el = document.documentElement;
  return el.classList.contains("dark") || el.getAttribute("data-theme") === "dark";
}

export default function Mermaid({ chart, label }: { chart: string; label?: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Watch for theme changes — but ONLY re-render on actual dark-mode flip,
  // not on every class mutation.
  useEffect(() => {
    setIsDark(isDarkMode());
    const obs = new MutationObserver(() => {
      const next = isDarkMode();
      setIsDark((prev) => (prev === next ? prev : next));
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setSvg(null);
    setErr(null);

    (async () => {
      try {
        const mermaid = await loadMermaid();
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
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

        // Fresh unique id per render — Mermaid leaves temp DOM nodes behind
        // and re-using an id throws.
        const id = `m-${++renderCounter}-${Date.now().toString(36)}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(svg);
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === "string"
              ? e
              : (() => {
                  try {
                    return JSON.stringify(e);
                  } catch {
                    return "Unknown Mermaid error";
                  }
                })();
        console.error("[Mermaid] render failed:", e, "\nchart:\n" + chart);
        if (!cancelled) setErr(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, isDark]);

  return (
    <figure className="my-6">
      <div className="mermaid-frame flex justify-center overflow-x-auto rounded-2xl border border-ink-200 bg-ink-50/60 p-6 dark:border-ink-700 dark:bg-ink-900/50">
        {svg ? (
          <div className="w-full" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : err ? (
          <pre className="whitespace-pre-wrap text-xs text-rose-500">
            Diagram failed to render:{"\n"}
            {err}
          </pre>
        ) : (
          <div className="text-sm text-ink-400 dark:text-ink-500">Rendering diagram…</div>
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
