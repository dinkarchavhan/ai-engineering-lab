import type { EvaluationCategory } from '@/lib/interview'

export const evaluationMatrix: EvaluationCategory[] = [
  {
    id: 'eval-fundamentals',
    category: 'AI Fundamentals',
    weight: 20,
    description:
      'Core understanding of ML theory, mathematics, and foundational concepts. A senior AI engineer must have solid theoretical foundations to debug complex model failures and make principled design decisions.',
    criteria: [
      'Can explain bias-variance tradeoff with production examples',
      'Understands gradient descent variants and when to use each',
      'Explains attention mechanism and transformer architecture accurately',
      'Demonstrates knowledge of regularization, overfitting, evaluation metrics',
      'Can reason about optimization landscapes and model convergence',
      'Understands the mathematical foundations of common ML algorithms',
    ],
    scoringGuide: [
      {
        score: 5,
        label: 'Exceptional',
        description:
          'Deep, nuanced understanding. Connects theory to practice, explains tradeoffs clearly, gives concrete production examples. Can derive formulas from first principles if asked.',
      },
      {
        score: 4,
        label: 'Strong',
        description:
          'Solid understanding of all core concepts with minor gaps. Can explain why, not just what. Examples are relevant but may lack depth on edge cases.',
      },
      {
        score: 3,
        label: 'Adequate',
        description:
          'Knows the major concepts but struggles with nuance or edge cases. Can apply concepts mechanically but may not explain the underlying intuition. Needs prompting on tradeoffs.',
      },
      {
        score: 2,
        label: 'Developing',
        description:
          'Partial knowledge with significant gaps. Confuses related concepts, cannot explain tradeoffs, gives memorized definitions without understanding.',
      },
      {
        score: 1,
        label: 'Insufficient',
        description:
          'Limited foundational knowledge. Cannot explain basic concepts, makes factually incorrect statements, or relies entirely on black-box usage without understanding.',
      },
    ],
  },
  {
    id: 'eval-machine-learning',
    category: 'Machine Learning',
    weight: 20,
    description:
      'Practical ML skills: model selection, feature engineering, production ML systems, and data science methodology. Evaluates ability to build robust, production-quality ML pipelines.',
    criteria: [
      'Demonstrates systematic approach to model selection and hyperparameter tuning',
      'Handles challenging data issues: imbalance, drift, missing values',
      'Explains ensemble methods and when to apply them',
      'Designs proper evaluation pipelines (no data leakage, correct CV strategy)',
      'MLOps knowledge: monitoring, drift detection, retraining pipelines',
      'Experience with production ML systems and real-world challenges',
    ],
    scoringGuide: [
      {
        score: 5,
        label: 'Exceptional',
        description:
          'Has built and operated production ML systems at scale. Anticipates failure modes before they are asked. Deep knowledge of both algorithms and infrastructure. Has opinions grounded in real experience.',
      },
      {
        score: 4,
        label: 'Strong',
        description:
          'Strong practical skills with clear production experience. Systematically approaches problems. Knows the gotchas (data leakage, train-serve skew, class imbalance). Some gaps in breadth.',
      },
      {
        score: 3,
        label: 'Adequate',
        description:
          'Can build ML pipelines but may miss production concerns. Knows the standard approaches but follows recipes rather than reasoning from first principles. Limited MLOps experience.',
      },
      {
        score: 2,
        label: 'Developing',
        description:
          'Academic knowledge without significant production experience. Can train models in notebooks but struggles with production deployment, monitoring, and scale considerations.',
      },
      {
        score: 1,
        label: 'Insufficient',
        description:
          'Cannot design a complete ML pipeline. Unaware of data leakage, evaluation pitfalls, or production considerations. Only familiar with toy datasets and tutorials.',
      },
    ],
  },
  {
    id: 'eval-generative-ai',
    category: 'Generative AI & LLMs',
    weight: 25,
    description:
      'The most heavily weighted dimension for an AI Engineer role in 2024+. Evaluates depth of knowledge in LLMs, RAG, fine-tuning, deployment, and practical GenAI system design.',
    criteria: [
      'Deep understanding of transformer architecture and LLM training process',
      'Can explain RAG, fine-tuning, and RLHF/DPO accurately and knows when to use each',
      'Experience deploying LLMs in production (latency, cost, safety)',
      'Understanding of hallucination causes and mitigation strategies',
      'Knowledge of prompt engineering as an engineering discipline',
      'Awareness of latest techniques: LoRA, speculative decoding, long context, multimodal',
      'Can design and implement LLM evaluation frameworks',
    ],
    scoringGuide: [
      {
        score: 5,
        label: 'Exceptional',
        description:
          'Has shipped multiple LLM-powered features to production. Can speak to specific failure modes encountered and how they were resolved. Current on recent research (past 6 months). Deep architectural understanding.',
      },
      {
        score: 4,
        label: 'Strong',
        description:
          'Strong theoretical and practical LLM knowledge. Has built RAG systems or fine-tuned models. Understands tradeoffs between approaches. Some gaps in very recent developments or specialized topics.',
      },
      {
        score: 3,
        label: 'Adequate',
        description:
          'Understands the major concepts but has limited production LLM experience. Can use LLM APIs effectively but limited experience with custom fine-tuning, evaluation, or optimization.',
      },
      {
        score: 2,
        label: 'Developing',
        description:
          'Basic LLM knowledge mostly from tutorials and documentation. Limited hands-on experience. Cannot explain architectural details or discuss deployment challenges meaningfully.',
      },
      {
        score: 1,
        label: 'Insufficient',
        description:
          'Only surface-level awareness. Cannot explain how transformers work, has not deployed any LLM-powered system, or confuses foundational concepts.',
      },
    ],
  },
  {
    id: 'eval-problem-solving',
    category: 'Problem Solving',
    weight: 20,
    description:
      'Evaluates analytical thinking, system design capability, and practical engineering judgment. A senior AI engineer must decompose complex problems and make good architectural tradeoffs.',
    criteria: [
      'Systematically decomposes ambiguous problems into tractable components',
      'Makes principled tradeoffs between accuracy, latency, cost, and maintainability',
      'Considers edge cases and failure modes proactively',
      'Designs for observability, debugging, and operability',
      'Estimates scale and capacity requirements accurately',
      'Knows when NOT to use AI (simpler solutions preferred when effective)',
      'Shows iterative thinking: MVP → measure → iterate',
    ],
    scoringGuide: [
      {
        score: 5,
        label: 'Exceptional',
        description:
          'Immediately identifies the key constraints and unknowns. Structures a solution that is correct AND practical. Proactively questions assumptions. Shows 10x thinking while remaining grounded. Would add significant technical leadership value.',
      },
      {
        score: 4,
        label: 'Strong',
        description:
          'Good systematic approach. Considers multiple options with tradeoffs. May need prompting for some edge cases or production concerns. Solutions are practical and reasonably complete.',
      },
      {
        score: 3,
        label: 'Adequate',
        description:
          'Can solve well-defined problems but struggles with ambiguity. May jump to a solution without fully exploring the problem space. Misses some tradeoffs or production concerns without prompting.',
      },
      {
        score: 2,
        label: 'Developing',
        description:
          'Struggles to structure complex problems. Solutions are technically feasible but overlook important constraints. Needs significant guidance to reach a complete solution.',
      },
      {
        score: 1,
        label: 'Insufficient',
        description:
          'Cannot decompose complex problems. Solutions are incomplete, impractical, or technically incorrect. Does not consider production requirements or scale.',
      },
    ],
  },
  {
    id: 'eval-communication',
    category: 'Communication',
    weight: 15,
    description:
      'Evaluates ability to communicate technical concepts clearly, collaborate effectively, and demonstrate intellectual integrity. Critical for senior engineers who must influence without authority.',
    criteria: [
      'Explains complex concepts at the appropriate level for the audience',
      'Asks clarifying questions rather than making assumptions',
      'Acknowledges uncertainty and knowledge gaps honestly',
      'Listens actively and engages with interviewer feedback',
      'Demonstrates intellectual humility: willing to change position with evidence',
      'Structures responses clearly: context → approach → result',
      'Shows enthusiasm for AI and genuine curiosity about the craft',
    ],
    scoringGuide: [
      {
        score: 5,
        label: 'Exceptional',
        description:
          'Exceptional communicator. Makes complex ideas feel intuitive. Proactively frames tradeoffs before being asked. Shows genuine curiosity, asks insightful questions about our systems. Would be outstanding in design reviews and cross-functional meetings.',
      },
      {
        score: 4,
        label: 'Strong',
        description:
          'Clear and structured communication. Can explain technical concepts to different audiences. Acknowledges uncertainty appropriately. Good listener who engages with follow-up questions thoughtfully.',
      },
      {
        score: 3,
        label: 'Adequate',
        description:
          'Communicates adequately but may be overly verbose or occasionally unclear. Can explain concepts to technical audiences but struggles with abstraction for non-technical stakeholders. Mostly talks without checking for understanding.',
      },
      {
        score: 2,
        label: 'Developing',
        description:
          'Communication is often unclear or disorganized. Struggles to explain concepts without jargon. Does not check for understanding. May appear evasive when knowledge gaps appear.',
      },
      {
        score: 1,
        label: 'Insufficient',
        description:
          'Significant communication barriers. Explanations are confusing or inaccurate. Does not engage with questions. Defensive or dismissive of feedback. Would struggle in collaborative engineering roles.',
      },
    ],
  },
]

export function computeWeightedScore(scores: Record<string, number>): number {
  return evaluationMatrix.reduce((total, category) => {
    const score = scores[category.id] ?? 0
    return total + (score / 5) * category.weight
  }, 0)
}

export function getHiringRecommendation(weightedScore: number): {
  recommendation: string
  label: string
  color: string
} {
  if (weightedScore >= 85) return { recommendation: 'Strong Hire', label: 'Exceptional candidate. Fast-track offer.', color: 'green' }
  if (weightedScore >= 70) return { recommendation: 'Hire', label: 'Solid candidate. Meets or exceeds bar.', color: 'blue' }
  if (weightedScore >= 55) return { recommendation: 'Lean Hire', label: 'Good potential. Discuss with team.', color: 'yellow' }
  if (weightedScore >= 40) return { recommendation: 'No Hire', label: 'Below bar. Significant gaps remain.', color: 'orange' }
  return { recommendation: 'Strong No Hire', label: 'Does not meet minimum requirements.', color: 'red' }
}
