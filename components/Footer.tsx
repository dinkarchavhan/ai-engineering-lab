import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white/50 dark:border-ink-700 dark:bg-ink-900/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-card">
              AI
            </span>
            <span className="text-ink-900 dark:text-ink-50">AI Engineering Lab</span>
          </Link>
          <p className="mt-3 max-w-md text-sm text-ink-600 dark:text-ink-300">
            Learn it. See it. Code it. Break it. Fix it. Build it. Ship it.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">Learn</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/tracks" className="text-ink-600 hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-300">All tracks</Link></li>
            <li><Link href="/roadmap" className="text-ink-600 hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-300">Roadmap</Link></li>
            <li><Link href="/skill-tree" className="text-ink-600 hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-300">Skill tree</Link></li>
            <li><Link href="/projects" className="text-ink-600 hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-300">Portfolio projects</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">Platform</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about" className="text-ink-600 hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-300">About</Link></li>
            <li><Link href="/about#philosophy" className="text-ink-600 hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-300">Philosophy</Link></li>
            <li><Link href="/about#stack" className="text-ink-600 hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-300">Tech stack</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-200 py-6 text-center text-xs text-ink-500 dark:border-ink-700 dark:text-ink-400">
        © {new Date().getFullYear()} AI Engineering Lab. Built with Next.js.
      </div>
    </footer>
  );
}
