import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CATEGORY_META, type InterviewCategory } from '@/lib/interview'
import { basicAIQuestions } from '@/content/interview-basic'
import { mlQuestions } from '@/content/interview-ml'
import { genAIQuestions } from '@/content/interview-genai'
import { promptEngQuestions } from '@/content/interview-prompt'
import { systemDesignProblems } from '@/content/interview-system-design'
import { practicalQuestions } from '@/content/interview-practical'
import { behavioralQuestions } from '@/content/interview-behavioral'
import {
  StandardInterviewClient,
  SystemDesignClient,
  PracticalClient,
  BehavioralClient,
  EvaluationMatrixClient,
} from '@/components/interview/InterviewClient'

export async function generateStaticParams() {
  return CATEGORY_META.map((c) => ({ category: c.slug }))
}

export default function InterviewCategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const meta = CATEGORY_META.find((c) => c.slug === params.category)
  if (!meta) notFound()

  const slug = params.category as InterviewCategory

  const colorBorderMap: Record<string, string> = {
    blue:   'border-blue-400',
    purple: 'border-purple-400',
    green:  'border-green-400',
    yellow: 'border-yellow-400',
    orange: 'border-orange-400',
    red:    'border-red-400',
    pink:   'border-pink-400',
    teal:   'border-teal-400',
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/interview"
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-4 inline-flex items-center gap-1.5"
          >
            ← Back to Interview Prep
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-4xl">{meta.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{meta.title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{meta.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{meta.questionCount} questions</span>
            <span>·</span>
            <span>~{meta.estimatedMinutes} min prep</span>
            <span>·</span>
            <span>5+ years experience level</span>
          </div>
          {/* color bar */}
          <div className={`mt-4 h-1 w-16 rounded-full border-2 ${colorBorderMap[meta.color] ?? 'border-blue-400'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {slug === 'basic-ai' && (
          <StandardInterviewClient questions={basicAIQuestions} />
        )}
        {slug === 'machine-learning' && (
          <StandardInterviewClient questions={mlQuestions as any} />
        )}
        {slug === 'generative-ai' && (
          <StandardInterviewClient questions={genAIQuestions as any} />
        )}
        {slug === 'prompt-engineering' && (
          <StandardInterviewClient questions={promptEngQuestions as any} />
        )}
        {slug === 'system-design' && (
          <SystemDesignClient problems={systemDesignProblems} />
        )}
        {slug === 'practical' && (
          <PracticalClient questions={practicalQuestions} />
        )}
        {slug === 'behavioral' && (
          <BehavioralClient questions={behavioralQuestions} />
        )}
        {slug === 'evaluation' && (
          <EvaluationMatrixClient />
        )}
      </div>

      {/* Footer nav */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <Link href="/interview" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ← All categories
          </Link>
          {(() => {
            const currentIdx = CATEGORY_META.findIndex((c) => c.slug === slug)
            const next = CATEGORY_META[currentIdx + 1]
            return next ? (
              <Link
                href={`/interview/${next.slug}`}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Next: {next.title} →
              </Link>
            ) : null
          })()}
        </div>
      </div>
    </main>
  )
}
