import Link from 'next/link'
import { CATEGORY_META } from '@/lib/interview'

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-950/30',   border: 'border-blue-200 dark:border-blue-800',   text: 'text-blue-700 dark:text-blue-300',   badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' },
  green:  { bg: 'bg-green-50 dark:bg-green-950/30',  border: 'border-green-200 dark:border-green-800',  text: 'text-green-700 dark:text-green-300',  badge: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-300', badge: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300', badge: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' },
  red:    { bg: 'bg-red-50 dark:bg-red-950/30',     border: 'border-red-200 dark:border-red-800',     text: 'text-red-700 dark:text-red-300',     badge: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' },
  pink:   { bg: 'bg-pink-50 dark:bg-pink-950/30',   border: 'border-pink-200 dark:border-pink-800',   text: 'text-pink-700 dark:text-pink-300',   badge: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300' },
  teal:   { bg: 'bg-teal-50 dark:bg-teal-950/30',   border: 'border-teal-200 dark:border-teal-800',   text: 'text-teal-700 dark:text-teal-300',   badge: 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300' },
}

const totalQuestions = CATEGORY_META.reduce((sum, c) => sum + c.questionCount, 0)
const totalMinutes = CATEGORY_META.reduce((sum, c) => sum + c.estimatedMinutes, 0)

export default function InterviewPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🎯</span>
            <span className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Interview Prep</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
            AI Engineer Interview<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Question Bank
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
            Senior-level questions curated for engineers with 5+ years of experience. Covers all tracks —
            from ML fundamentals to LLM system design, prompt engineering, and behavioral interviews.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalQuestions}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Questions</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 self-center" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">8</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Categories</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 self-center" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(totalMinutes / 60)}h</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Est. prep time</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 self-center" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">5+</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Yrs experience level</span>
            </div>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex gap-8 flex-wrap text-sm">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <span className="text-lg">👆</span>
              <span>Click a question to reveal the expected answer</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <span className="text-lg">🎚️</span>
              <span>Filter by difficulty: Easy / Medium / Hard</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <span className="text-lg">📊</span>
              <span>Use the Evaluation Matrix to score yourself</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Choose a Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CATEGORY_META.map((cat) => {
            const colors = colorMap[cat.color] ?? colorMap.blue
            return (
              <Link
                key={cat.slug}
                href={`/interview/${cat.slug}`}
                className={`group block rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
                    {cat.questionCount} Q&A
                  </span>
                </div>
                <h3 className={`text-lg font-bold mb-1.5 ${colors.text}`}>{cat.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    ~{cat.estimatedMinutes} min prep
                  </span>
                  <span className={`text-sm font-semibold group-hover:underline ${colors.text}`}>
                    Start →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quick tip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">💡 Prep Strategy for Senior Roles</h3>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
            <li>Start with <strong className="text-gray-800 dark:text-gray-200">Generative AI & LLMs</strong> — it carries the highest weight (25%) and is most commonly tested first.</li>
            <li>Practice <strong className="text-gray-800 dark:text-gray-200">AI System Design</strong> problems out loud — timing yourself at 30 minutes per problem.</li>
            <li>Prepare 5 STAR stories for <strong className="text-gray-800 dark:text-gray-200">Behavioral</strong> questions — one per key area (leadership, failure, stakeholders, ethics, performance).</li>
            <li>Use the <strong className="text-gray-800 dark:text-gray-200">Evaluation Matrix</strong> to score yourself honestly and identify gaps.</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
