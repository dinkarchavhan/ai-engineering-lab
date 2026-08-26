"use client";
import { useEffect, useState } from "react";

const DISMISSED_KEY = "ai_lab_support_dismissed";
const COMPLETED_KEY = "ai_lab_completed";
const GITHUB_REPO = "https://github.com/dinkarchavhan/ai-engineering-lab";
const GITHUB_SPONSORS = "https://github.com/sponsors/dinkarchavhan";

function totalCompleted(): number {
  try {
    const data: Record<string, string[]> = JSON.parse(
      localStorage.getItem(COMPLETED_KEY) ?? "{}"
    );
    return Object.values(data).reduce((acc, arr) => acc + arr.length, 0);
  } catch {
    return 0;
  }
}

export default function SupportBanner() {
  const [show, setShow] = useState(false);

  const check = () => {
    try {
      if (localStorage.getItem(DISMISSED_KEY)) return;
      if (totalCompleted() >= 1) setShow(true);
    } catch {}
  };

  useEffect(() => {
    check();
    window.addEventListener("lesson-completed", check);
    return () => window.removeEventListener("lesson-completed", check);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
    setShow(false);
  };

  return (
    <div className="mt-10 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-accent-50 p-5 dark:border-brand-500/30 dark:from-brand-500/5 dark:to-accent-500/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-ink-900 dark:text-ink-50">
            Enjoying AI Engineering Lab?
          </p>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">
            All content is free and open-source. A star or a coffee keeps it going.
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex-none rounded-lg p-1 text-ink-400 hover:text-ink-600 dark:text-ink-500 dark:hover:text-ink-300"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-700 dark:bg-ink-100 dark:text-ink-900 dark:hover:bg-white"
        >
          {/* GitHub icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .3a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.57v-2c-3.34.73-4.04-1.61-4.04-1.61-.54-1.37-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58A12 12 0 0012 .3z" />
          </svg>
          ⭐ Star on GitHub
        </a>
        <a
          href={GITHUB_SPONSORS}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-pink-300 bg-white px-4 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-50 dark:border-pink-500/40 dark:bg-transparent dark:text-pink-400 dark:hover:bg-pink-500/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.593c-.525.468-1.083.922-1.646 1.38-.437.354-.926.539-1.354.539-.396 0-.861-.161-1.335-.534C4.532 20.16 1 16.348 1 12.065c0-3.759 2.964-6.565 6.5-6.565 1.834 0 3.545.815 4.5 2.094C12.955 6.315 14.666 5.5 16.5 5.5 20.036 5.5 23 8.306 23 12.065c0 4.283-3.532 8.095-6.665 10.913-.474.373-.939.534-1.335.534-.428 0-.917-.185-1.354-.54-.563-.457-1.121-.911-1.646-1.379z" />
          </svg>
          Sponsor
        </a>
      </div>
    </div>
  );
}
