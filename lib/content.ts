// Structured lesson content model. Every lesson is a list of Sections.
// Each Section has a step number (1-20 from the blueprint template) and one or
// more Blocks. Blocks are rendered by components/lesson/blocks.tsx.

export type Block =
  | { type: "text"; content: string }
  | { type: "code"; language: string; code: string; label?: string }
  | { type: "diagram"; chart: string; label?: string }
  | {
      type: "callout";
      kind: "insight" | "warning" | "tip" | "gotcha" | "math";
      title?: string;
      content: string;
    }
  | { type: "list"; items: string[]; style?: "bullet" | "number" }
  | { type: "kv"; items: { key: string; value: string }[] }
  | {
      type: "quiz";
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    };

export interface Section {
  step: number;
  title: string;
  blocks: Block[];
}

export interface Lesson {
  slug: string;
  trackSlug: string;
  title: string;
  subtitle: string;
  order: number;
  minutes: number;
  tags: string[];
  sections: Section[];
}

// Registry: track slug → ordered lesson slugs (for prev/next nav on the track page).
import { deepLearningLessons } from "@/content/deep-learning";

const lessonRegistry: Record<string, Lesson[]> = {
  "deep-learning": deepLearningLessons,
};

export function getLessonsForTrack(trackSlug: string): Lesson[] {
  return lessonRegistry[trackSlug] ?? [];
}

export function getLesson(trackSlug: string, lessonSlug: string): Lesson | undefined {
  return getLessonsForTrack(trackSlug).find((l) => l.slug === lessonSlug);
}

export function allLessons(): Lesson[] {
  return Object.values(lessonRegistry).flat();
}
