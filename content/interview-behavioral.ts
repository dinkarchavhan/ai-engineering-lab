import type { BehavioralQuestion } from '@/lib/interview'

export const behavioralQuestions: BehavioralQuestion[] = [
  {
    id: 'beh-01',
    topic: 'Project Leadership & Challenges',
    question:
      'Describe the most challenging AI project you led. What was the biggest technical obstacle and how did you overcome it?',
    strongAnswerCriteria: [
      'Uses STAR format (Situation, Task, Action, Result) with concrete metrics.',
      'Demonstrates technical depth—describes the specific ML/AI challenge, not just the project.',
      'Shows ownership and decision-making: "I decided to..." not "we tried..."',
      'Quantifies the outcome: improved latency by X%, reduced error rate by Y%.',
      'Reflects on lessons learned—what would they do differently?',
      'Shows leadership: how they motivated the team through technical uncertainty.',
    ],
  },
  {
    id: 'beh-02',
    topic: 'Production Failures',
    question:
      'Tell me about a time an ML model failed in production. How did you detect it, and what was your incident response?',
    strongAnswerCriteria: [
      'Describes a specific, real failure—not a generic "models can drift" answer.',
      'Explains the detection mechanism: monitoring alert, user complaint, or SLO breach.',
      'Shows systematic debugging process: isolates data issue vs. model issue vs. infrastructure issue.',
      'Demonstrates blameless post-mortem culture—focused on process improvement, not blame.',
      'Describes concrete remediations: rollback strategy, hotfix, retraining pipeline.',
      'Explains what monitoring or guardrails were added post-incident to prevent recurrence.',
    ],
  },
  {
    id: 'beh-03',
    topic: 'Staying Current',
    question:
      'AI moves extremely fast—new models, papers, and techniques appear weekly. How do you stay current without getting overwhelmed?',
    strongAnswerCriteria: [
      'Has a structured approach—not just "I read Twitter/X"—specific sources and cadence.',
      'Distinguishes signal from noise: names criteria for deciding what to implement vs. follow from afar.',
      'Describes how they evaluate new techniques critically (benchmarks, ablations) before adopting.',
      'Mentions practical implementation: "I built a small prototype to test..." shows hands-on learning.',
      'Shares knowledge with the team: blog posts, internal talks, Slack summaries.',
      'Acknowledges they cannot follow everything and explicitly prioritizes based on current project needs.',
    ],
  },
  {
    id: 'beh-04',
    topic: 'Stakeholder Communication',
    question:
      'Describe a time you had to explain a complex AI concept or failure to a non-technical executive or business stakeholder. How did you handle it?',
    strongAnswerCriteria: [
      'Identifies the stakeholder\'s mental model and meets them there—not a generic "use simple terms" answer.',
      'Uses analogies and business framing—translates "model precision" to business impact.',
      'Proactively surfaces uncertainty and limitations rather than overselling capabilities.',
      'Describes how they managed stakeholder expectations when the model underperformed.',
      'Showed they understood the difference between what the stakeholder needed to know vs. everything true.',
      'Resulted in aligned expectations and a concrete business decision.',
    ],
  },
  {
    id: 'beh-05',
    topic: 'Decision Making Under Uncertainty',
    question:
      'Tell me about a time you had to make a critical AI system architecture decision with incomplete information or conflicting data. What was your process?',
    strongAnswerCriteria: [
      'Describes specific uncertainty: "we did not know if X would scale / be accurate enough / be cost-feasible."',
      'Structured decision process: identifies what information was needed, what could be gathered quickly.',
      'Builds low-cost experiments to resolve critical uncertainties before committing.',
      'Documents the decision and its rationale—not just the outcome.',
      'Shows intellectual honesty: acknowledges they were not 100% certain and made a calculated bet.',
      'Reflects on what happened—was the decision right? What did they learn?',
    ],
  },
  {
    id: 'beh-06',
    topic: 'Technical Disagreements',
    question:
      'How have you handled significant disagreements about model architecture or technical approach with a senior engineer or manager?',
    strongAnswerCriteria: [
      'Describes a specific disagreement with real technical substance—not a vague "we had different opinions."',
      'Shows they engaged with the merits of the other position, not just defended their own.',
      'Used data and experiments to resolve disagreements, not just seniority or persistence.',
      'Remained professional and collaborative even when they strongly believed they were right.',
      'Willing to change their position when evidence supported it—not dogmatic.',
      'Describes how the team made a final decision and how they committed to it even if it was not their preference.',
    ],
  },
  {
    id: 'beh-07',
    topic: 'AI Ethics & Responsible AI',
    question:
      'Describe a situation where you identified an ethical concern or potential harm in an AI system you were building. How did you handle it?',
    strongAnswerCriteria: [
      'Names a specific concern—bias, privacy, safety, misuse potential—not a generic ethics statement.',
      'Shows they proactively raised the concern rather than waiting for someone else to.',
      'Describes concrete technical mitigations they implemented or proposed.',
      'Engaged appropriate stakeholders: legal, policy, leadership—not just solved it alone.',
      'Understands the tradeoffs: model utility vs. safety, and how they reasoned about them.',
      'Demonstrates that responsible AI is not just compliance but a core engineering value they hold.',
    ],
  },
  {
    id: 'beh-08',
    topic: 'Performance Improvement',
    question:
      'Tell me about a time you significantly improved the performance of a production ML model or AI system. What was your methodology?',
    strongAnswerCriteria: [
      'Describes the starting point with baseline metrics and the specific performance gap.',
      'Used a systematic methodology: profiling first, hypothesis-driven experiments, not random search.',
      'Distinguishes between data improvements, feature improvements, architecture improvements, and training improvements.',
      'Quantifies the final improvement with before/after metrics and business impact.',
      'Discusses what did NOT work and why—shows intellectual honesty and methodical approach.',
      'Describes how they ensured the improvement generalized to production and did not just overfit the validation set.',
    ],
  },
  {
    id: 'beh-09',
    topic: 'Explainability & Auditability',
    question:
      'How do you approach building AI systems that need to be explainable or auditable for regulatory or business reasons?',
    strongAnswerCriteria: [
      'Distinguishes between global explanations (model behavior) and local explanations (per-prediction).',
      'Mentions specific tools: SHAP, LIME, attention visualization, counterfactual explanations.',
      'Understands that some regulatory contexts (GDPR Article 22, FCRA) require specific types of explanations.',
      'Discusses the accuracy-interpretability tradeoff and how they navigate it in practice.',
      'Describes logging and auditability infrastructure: model versioning, prediction logs, data lineage.',
      'Has worked with legal or compliance teams—shows they do not work in isolation from governance.',
    ],
  },
  {
    id: 'beh-10',
    topic: 'Knowledge Sharing',
    question:
      'Describe how you have contributed to AI knowledge sharing in your team or organization. What impact did it have?',
    strongAnswerCriteria: [
      'Goes beyond "I answered Slack questions"—describes structured knowledge sharing: docs, talks, workshops.',
      'Shows initiative: started something that did not exist rather than contributing to an existing forum.',
      'Measures impact: "X engineers adopted the pattern," "Y engineers attended the workshop."',
      'Demonstrates teaching ability—can explain complex concepts accessibly without dumbing them down.',
      'Shares failures and learnings, not just successes—creates psychological safety for the team.',
      'Built something reusable: a template, a library, a process—not just one-time knowledge transfer.',
    ],
  },
]
