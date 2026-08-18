"use client";
import { useState } from "react";
import Prose from "./Prose";

export default function Quiz({
  question,
  options,
  correct,
  explanation,
}: {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="my-6 rounded-2xl border-2 border-brand-200 bg-brand-50/60 p-6 dark:border-brand-500/30 dark:bg-brand-500/10">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
        Quiz
      </div>
      <div className="text-lg font-medium text-ink-900 dark:text-ink-50">{question}</div>

      <div className="mt-5 space-y-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === correct;
          let cls =
            "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition";
          if (picked === null) {
            cls +=
              " border-ink-200 bg-white hover:border-brand-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500";
          } else if (isPicked && isCorrect) {
            cls +=
              " border-emerald-500 bg-emerald-50 dark:border-emerald-500/50 dark:bg-emerald-500/10";
          } else if (isPicked && !isCorrect) {
            cls += " border-rose-500 bg-rose-50 dark:border-rose-500/50 dark:bg-rose-500/10";
          } else if (!isPicked && isCorrect) {
            cls += " border-emerald-300 bg-emerald-50/50 dark:border-emerald-500/30";
          } else {
            cls += " border-ink-200 bg-white opacity-60 dark:border-ink-700 dark:bg-ink-800";
          }
          return (
            <button key={i} onClick={() => picked === null && setPicked(i)} className={cls}>
              <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-current text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-ink-800 dark:text-ink-100">{opt}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-5 rounded-lg bg-white p-4 dark:bg-ink-800">
          <div
            className={`text-sm font-semibold ${
              picked === correct ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"
            }`}
          >
            {picked === correct ? "✓ Correct" : "✗ Not quite"}
          </div>
          <div className="mt-2 text-sm text-ink-700 dark:text-ink-200">
            <Prose content={explanation} />
          </div>
        </div>
      )}
    </div>
  );
}
