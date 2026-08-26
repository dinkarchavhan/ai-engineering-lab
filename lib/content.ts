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
import { developerSetupLessons } from "@/content/developer-setup";
import { deepLearningLessons } from "@/content/deep-learning";
import { mathForAiLessons } from "@/content/math-for-ai";
import { classicalMlLessons } from "@/content/classical-ml";
import { mlFromScratchLessons } from "@/content/ml-from-scratch";
import { pytorchLessons } from "@/content/pytorch";
import { computerVisionLessons } from "@/content/computer-vision";
import { nlpLessons } from "@/content/nlp";
import { transformerLessons } from "@/content/transformers";
import { generativeAiLessons } from "@/content/generative-ai";
import { llmFromScratchLessons } from "@/content/llm-from-scratch";
import { llmEngineeringLessons } from "@/content/llm-engineering";
import { embeddingsVectorDbLessons } from "@/content/embeddings-vector-db";
import { ragLessons } from "@/content/rag";
import { fineTuningLessons } from "@/content/fine-tuning";
import { llmEvaluationLessons } from "@/content/llm-evaluation";
import { aiAgentsLessons } from "@/content/ai-agents";
import { langchainLanggraphLessons } from "@/content/langchain-langgraph";
import { modelContextProtocolLessons } from "@/content/model-context-protocol";
import { multiAgentLessons } from "@/content/multi-agent";
import { multimodalLessons } from "@/content/multimodal";
import { aiAndDatabasesLessons } from "@/content/ai-and-databases";
import { aiInfrastructureLessons } from "@/content/ai-infrastructure";
import { aiSecurityLessons } from "@/content/ai-security";
import { aiProductionLessons } from "@/content/ai-production";
import { aiSystemDesignLessons } from "@/content/ai-system-design";
import { capstoneLessons } from "@/content/capstone";

const lessonRegistry: Record<string, Lesson[]> = {
  "developer-setup": developerSetupLessons,
  "deep-learning": deepLearningLessons,
  "math-for-ai": mathForAiLessons,
  "classical-ml": classicalMlLessons,
  "ml-from-scratch": mlFromScratchLessons,
  pytorch: pytorchLessons,
  "computer-vision": computerVisionLessons,
  nlp: nlpLessons,
  transformers: transformerLessons,
  "generative-ai": generativeAiLessons,
  "llm-from-scratch": llmFromScratchLessons,
  "llm-engineering": llmEngineeringLessons,
  "embeddings-vector-db": embeddingsVectorDbLessons,
  rag: ragLessons,
  "fine-tuning": fineTuningLessons,
  "llm-evaluation": llmEvaluationLessons,
  "ai-agents": aiAgentsLessons,
  "langchain-langgraph": langchainLanggraphLessons,
  mcp: modelContextProtocolLessons,
  "multi-agent": multiAgentLessons,
  multimodal: multimodalLessons,
  "ai-and-databases": aiAndDatabasesLessons,
  "ai-infrastructure": aiInfrastructureLessons,
  "ai-security": aiSecurityLessons,
  "ai-production": aiProductionLessons,
  "ai-system-design": aiSystemDesignLessons,
  capstone: capstoneLessons,
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
