"use client";

import { useState } from "react";
import type { ProjectGuide } from "@/lib/content";
import Blocks from "@/components/lesson/Blocks";

interface Props {
  projects: string[];
  guides: ProjectGuide[];
}

const difficultyLabel: Record<ProjectGuide["difficulty"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const difficultyColor: Record<ProjectGuide["difficulty"], string> = {
  beginner:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  intermediate:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  advanced:
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};

export default function PortfolioProjectList({ projects, guides }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {projects.map((title, i) => {
        const guide = guides[i];
        const isOpen = expanded.has(i);

        return (
          <div
            key={i}
            className="rounded-xl border border-ink-200 bg-gradient-to-br from-white to-ink-50 dark:border-ink-700 dark:from-ink-800 dark:to-ink-900"
          >
            {/* ── Card header — always visible ─────────────────────────── */}
            <div
              className={`flex items-start gap-3 p-4 ${guide ? "cursor-pointer select-none" : ""}`}
              onClick={() => guide && toggle(i)}
              role={guide ? "button" : undefined}
              aria-expanded={guide ? isOpen : undefined}
            >
              {/* Project number badge */}
              <div className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink-800 dark:text-ink-100">
                  {title}
                </div>

                {/* Tech stack chips + metadata — only when a guide exists */}
                {guide && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {guide.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                      >
                        {tech}
                      </span>
                    ))}
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] text-ink-500 dark:bg-ink-700 dark:text-ink-400">
                      {guide.estimatedHours}h
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${difficultyColor[guide.difficulty]}`}
                    >
                      {difficultyLabel[guide.difficulty]}
                    </span>
                    <span className="ml-auto text-[10px] text-brand-600 dark:text-brand-400">
                      {isOpen ? "▴ Collapse" : "▾ View project"}
                    </span>
                  </div>
                )}
              </div>

              {/* Chevron — only when no chips row (guide without tech stack) */}
              {guide && guide.techStack.length === 0 && (
                <span
                  className={`mt-1 flex-none text-ink-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              )}
            </div>

            {/* ── Expanded guide content ────────────────────────────────── */}
            {guide && isOpen && (
              <div className="border-t border-ink-200 dark:border-ink-700">
                {/* Guide intro */}
                <div className="px-6 pt-5 pb-2">
                  <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                    {guide.description}
                  </p>
                </div>

                {/* Phase-by-phase sections */}
                {guide.sections.map((section) => (
                  <div key={section.step} className="border-t border-ink-100 px-6 py-6 dark:border-ink-800">
                    {/* Section header */}
                    <div className="mb-5 flex items-center gap-3">
                      <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-[11px] font-bold text-white">
                        {section.step}
                      </span>
                      <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">
                        {section.title}
                      </h3>
                    </div>

                    {/* Block content — reuses the same renderer as lessons */}
                    <div className="ml-10">
                      <Blocks blocks={section.blocks} />
                    </div>
                  </div>
                ))}

                {/* Collapse footer */}
                <div className="flex justify-center border-t border-ink-100 py-3 dark:border-ink-800">
                  <button
                    onClick={() => toggle(i)}
                    className="text-xs text-ink-400 hover:text-ink-600 dark:text-ink-500 dark:hover:text-ink-300"
                  >
                    ▴ Collapse project guide
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
