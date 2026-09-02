'use client'

import { useState, useMemo } from 'react'
import type { Difficulty } from '@/lib/interview'

/* ─── Shared difficulty badge ─── */
export function DifficultyBadge({ level }: { level: Difficulty }) {
  const map: Record<Difficulty, string> = {
    Easy:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    Hard:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[level]}`}>
      {level}
    </span>
  )
}

/* ─── Basic AI / ML / GenAI / Prompt card ─── */
interface StandardQuestion {
  id: string
  question: string
  expectedAnswer: string
  difficulty: Difficulty
  topic: string
  followUpQuestions?: string[]
  realWorldScenarios?: string[]
  commonMistakes?: string[]
  tags?: string[]
}

function QuestionCard({ q }: { q: StandardQuestion }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-3"
      >
        <span className="mt-0.5 text-gray-400 dark:text-gray-600 flex-shrink-0">
          {open ? '▼' : '▶'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <DifficultyBadge level={q.difficulty} />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{q.topic}</span>
          </div>
          <p className="text-gray-900 dark:text-white font-medium text-[15px] leading-snug">{q.question}</p>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
          {/* Expected Answer */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Expected Answer
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {q.expectedAnswer}
            </p>
          </div>

          {/* Follow-up Questions */}
          {q.followUpQuestions && q.followUpQuestions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                Follow-up Questions
              </h4>
              <ul className="space-y-1.5">
                {q.followUpQuestions.map((fq, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-blue-400 flex-shrink-0 mt-0.5">→</span>
                    {fq}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Real-world Scenarios */}
          {q.realWorldScenarios && q.realWorldScenarios.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                Real-world Scenarios
              </h4>
              <ul className="space-y-1.5">
                {q.realWorldScenarios.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-green-400 flex-shrink-0 mt-0.5">🌐</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Common Mistakes */}
          {q.commonMistakes && q.commonMistakes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                Common Mistakes to Avoid
              </h4>
              <ul className="space-y-1.5">
                {q.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {q.tags && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {q.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function StandardInterviewClient({ questions }: { questions: StandardQuestion[] }) {
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (difficulty !== 'All' && q.difficulty !== difficulty) return false
      if (search && !q.question.toLowerCase().includes(search.toLowerCase()) &&
          !q.topic.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [questions, difficulty, search])

  const shown = expanded ? filtered : filtered.slice(0, 5)

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-3.5 py-2 text-sm rounded-lg font-medium transition-colors ${
              difficulty === d
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-400 mb-4">{filtered.length} questions{difficulty !== 'All' ? ` (${difficulty})` : ''}</p>

      {/* Questions */}
      <div className="space-y-3">
        {shown.map((q) => <QuestionCard key={q.id} q={q} />)}
      </div>

      {/* Show more */}
      {filtered.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          {expanded ? `Show less` : `Show ${filtered.length - 5} more questions`}
        </button>
      )}
    </div>
  )
}

/* ─── System Design Client ─── */
interface SystemDesignProblem {
  id: string
  designProblem: string
  evaluationCriteria: string[]
  sampleSolutionApproach: string
  topic: string
  difficulty: Difficulty
}

function SystemDesignCard({ p }: { p: SystemDesignProblem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-3"
      >
        <span className="mt-0.5 text-gray-400 dark:text-gray-600 flex-shrink-0">{open ? '▼' : '▶'}</span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <DifficultyBadge level={p.difficulty} />
            <span className="text-xs text-gray-400 font-medium">{p.topic}</span>
          </div>
          <p className="text-gray-900 dark:text-white font-medium text-[15px] leading-snug line-clamp-2">
            {p.designProblem}
          </p>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-5">
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Design Problem</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{p.designProblem}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Evaluation Criteria</h4>
            <ul className="space-y-1.5">
              {p.evaluationCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-blue-400 flex-shrink-0">✓</span>{c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Sample Solution Approach</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{p.sampleSolutionApproach}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function SystemDesignClient({ problems }: { problems: SystemDesignProblem[] }) {
  return (
    <div className="space-y-3">
      {problems.map((p) => <SystemDesignCard key={p.id} p={p} />)}
    </div>
  )
}

/* ─── Practical Questions Client ─── */
interface ScoringCriteria { criteria: string; points: number; description: string }
interface PracticalQuestion {
  id: string
  problemStatement: string
  solutionExplanation: string
  scoringRubric: ScoringCriteria[]
  topic: string
  difficulty: Difficulty
}

function PracticalCard({ q }: { q: PracticalQuestion }) {
  const [open, setOpen] = useState(false)
  const totalPoints = q.scoringRubric.reduce((s, r) => s + r.points, 0)

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-3"
      >
        <span className="mt-0.5 text-gray-400 dark:text-gray-600 flex-shrink-0">{open ? '▼' : '▶'}</span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <DifficultyBadge level={q.difficulty} />
            <span className="text-xs text-gray-400 font-medium">{q.topic}</span>
            <span className="text-xs text-gray-400">· {totalPoints} pts</span>
          </div>
          <p className="text-gray-900 dark:text-white font-medium text-[15px] leading-snug line-clamp-2">
            {q.problemStatement}
          </p>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-5">
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Problem Statement</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{q.problemStatement}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Solution</h4>
            <pre className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
              {q.solutionExplanation}
            </pre>
          </div>
          <div>
            <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
              Scoring Rubric (/{totalPoints} pts)
            </h4>
            <div className="space-y-2">
              {q.scoringRubric.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400 w-8 flex-shrink-0">
                    {r.points}pt
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{r.criteria}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function PracticalClient({ questions }: { questions: PracticalQuestion[] }) {
  return (
    <div className="space-y-3">
      {questions.map((q) => <PracticalCard key={q.id} q={q} />)}
    </div>
  )
}

/* ─── Behavioral Questions Client ─── */
interface BehavioralQuestion {
  id: string
  question: string
  strongAnswerCriteria: string[]
  topic: string
}

function BehavioralCard({ q }: { q: BehavioralQuestion }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-3"
      >
        <span className="mt-0.5 text-gray-400 dark:text-gray-600 flex-shrink-0">{open ? '▼' : '▶'}</span>
        <div className="flex-1">
          <span className="text-xs text-gray-400 font-medium block mb-1">{q.topic}</span>
          <p className="text-gray-900 dark:text-white font-medium text-[15px] leading-snug">{q.question}</p>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
          <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">
            What a Strong Answer Looks Like
          </h4>
          <ul className="space-y-2">
            {q.strongAnswerCriteria.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function BehavioralClient({ questions }: { questions: BehavioralQuestion[] }) {
  return (
    <div className="space-y-3">
      {questions.map((q) => <BehavioralCard key={q.id} q={q} />)}
    </div>
  )
}

/* ─── Evaluation Matrix Client ─── */
interface ScoreGuide { score: number; label: string; description: string }
interface EvaluationCategory {
  id: string
  category: string
  weight: number
  description: string
  criteria: string[]
  scoringGuide: ScoreGuide[]
}

export function EvaluationMatrixClient({
  categories,
  computeWeightedScore,
  getHiringRecommendation,
}: {
  categories: EvaluationCategory[]
  computeWeightedScore: (scores: Record<string, number>) => number
  getHiringRecommendation: (score: number) => { recommendation: string; label: string; color: string }
}) {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [expanded, setExpanded] = useState<string | null>(null)

  const allScored = categories.every((c) => scores[c.id] !== undefined)
  const weightedScore = allScored ? computeWeightedScore(scores) : null
  const recommendation = weightedScore !== null ? getHiringRecommendation(weightedScore) : null

  const recColorMap: Record<string, string> = {
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
  }

  return (
    <div className="space-y-4">
      {/* Scoring legend */}
      <div className="flex flex-wrap gap-2 mb-2">
        {[1,2,3,4,5].map(s => (
          <span key={s} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
            {s} = {['Insufficient','Developing','Adequate','Strong','Exceptional'][s-1]}
          </span>
        ))}
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{cat.category}</h3>
                  <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                    {cat.weight}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.description}</p>
              </div>
            </div>

            {/* Score buttons */}
            <div className="flex gap-2 flex-wrap">
              {[1,2,3,4,5].map(s => (
                <button
                  key={s}
                  onClick={() => setScores(prev => ({ ...prev, [cat.id]: s }))}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                    scores[cat.id] === s
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md scale-110'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
              {scores[cat.id] && (
                <span className="self-center text-sm text-gray-500 dark:text-gray-400 ml-1">
                  → {cat.scoringGuide.find(g => g.score === scores[cat.id])?.label}
                </span>
              )}
            </div>

            {/* Criteria toggle */}
            <button
              onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
              className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {expanded === cat.id ? 'Hide' : 'Show'} scoring criteria & guide
            </button>

            {expanded === cat.id && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Evaluation Criteria</h4>
                  <ul className="space-y-1">
                    {cat.criteria.map((c, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-blue-400">•</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Scoring Guide</h4>
                  <div className="space-y-2">
                    {cat.scoringGuide.map((g) => (
                      <div key={g.score} className={`p-3 rounded-lg text-sm ${
                        scores[cat.id] === g.score
                          ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}>
                        <span className="font-bold text-gray-800 dark:text-gray-200">{g.score} — {g.label}: </span>
                        <span className="text-gray-600 dark:text-gray-400">{g.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Result */}
      {allScored && weightedScore !== null && recommendation && (
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Weighted Score</p>
          <p className="text-5xl font-bold text-gray-900 dark:text-white mb-3">{weightedScore.toFixed(1)}%</p>
          <p className={`text-2xl font-bold mb-1 ${recColorMap[recommendation.color] ?? 'text-gray-900'}`}>
            {recommendation.recommendation}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{recommendation.label}</p>
          <button
            onClick={() => setScores({})}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline"
          >
            Reset scores
          </button>
        </div>
      )}
    </div>
  )
}
