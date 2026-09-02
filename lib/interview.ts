export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type InterviewCategory =
  | 'basic-ai'
  | 'machine-learning'
  | 'generative-ai'
  | 'prompt-engineering'
  | 'system-design'
  | 'practical'
  | 'behavioral'
  | 'evaluation'

export interface BasicAIQuestion {
  id: string
  question: string
  expectedAnswer: string
  difficulty: Difficulty
  topic: string
  tags: string[]
}

export interface MLQuestion {
  id: string
  question: string
  expectedAnswer: string
  followUpQuestions: string[]
  topic: string
  difficulty: Difficulty
  tags: string[]
}

export interface GenAIQuestion {
  id: string
  question: string
  expectedAnswer: string
  realWorldScenarios: string[]
  topic: string
  difficulty: Difficulty
  tags: string[]
}

export interface PromptEngQuestion {
  id: string
  question: string
  expectedAnswer: string
  commonMistakes: string[]
  topic: string
  difficulty: Difficulty
}

export interface SystemDesignProblem {
  id: string
  designProblem: string
  evaluationCriteria: string[]
  sampleSolutionApproach: string
  topic: string
  difficulty: Difficulty
}

export interface ScoringCriteria {
  criteria: string
  points: number
  description: string
}

export interface PracticalQuestion {
  id: string
  problemStatement: string
  solutionExplanation: string
  scoringRubric: ScoringCriteria[]
  topic: string
  difficulty: Difficulty
}

export interface BehavioralQuestion {
  id: string
  question: string
  strongAnswerCriteria: string[]
  topic: string
}

export interface ScoreGuide {
  score: number
  label: string
  description: string
}

export interface EvaluationCategory {
  id: string
  category: string
  weight: number
  description: string
  criteria: string[]
  scoringGuide: ScoreGuide[]
}

export interface CategoryMeta {
  slug: InterviewCategory
  title: string
  description: string
  icon: string
  questionCount: number
  estimatedMinutes: number
  color: string
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    slug: 'basic-ai',
    title: 'Basic AI Concepts',
    description: 'Fundamentals of AI, ML theory, and core mathematical concepts tested in senior interviews.',
    icon: '🧠',
    questionCount: 15,
    estimatedMinutes: 30,
    color: 'blue',
  },
  {
    slug: 'machine-learning',
    title: 'Machine Learning',
    description: 'Algorithms, model selection, feature engineering, and production ML system questions.',
    icon: '⚙️',
    questionCount: 15,
    estimatedMinutes: 35,
    color: 'purple',
  },
  {
    slug: 'generative-ai',
    title: 'Generative AI & LLMs',
    description: 'Transformers, fine-tuning, RAG, RLHF, hallucination, and LLM deployment.',
    icon: '🤖',
    questionCount: 15,
    estimatedMinutes: 40,
    color: 'green',
  },
  {
    slug: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Chain-of-thought, few-shot, structured outputs, prompt injection defense.',
    icon: '✍️',
    questionCount: 10,
    estimatedMinutes: 20,
    color: 'yellow',
  },
  {
    slug: 'system-design',
    title: 'AI System Design',
    description: 'End-to-end design problems for RAG systems, inference platforms, and multi-agent pipelines.',
    icon: '🏗️',
    questionCount: 8,
    estimatedMinutes: 50,
    color: 'orange',
  },
  {
    slug: 'practical',
    title: 'Hands-on Practical',
    description: 'Code problems: implement attention, fine-tune models, build evaluation harnesses.',
    icon: '💻',
    questionCount: 8,
    estimatedMinutes: 60,
    color: 'red',
  },
  {
    slug: 'behavioral',
    title: 'Behavioral Questions',
    description: 'STAR-format questions about AI project leadership, failures, and stakeholder communication.',
    icon: '🗣️',
    questionCount: 10,
    estimatedMinutes: 25,
    color: 'pink',
  },
  {
    slug: 'evaluation',
    title: 'Candidate Evaluation Matrix',
    description: 'Weighted scoring rubric across all dimensions for structured hiring decisions.',
    icon: '📊',
    questionCount: 5,
    estimatedMinutes: 10,
    color: 'teal',
  },
]
