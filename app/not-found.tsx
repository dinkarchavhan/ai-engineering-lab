import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl">🧭</div>
      <h1 className="mt-4 text-3xl font-bold text-ink-900 dark:text-ink-50">Off the map</h1>
      <p className="mt-2 text-ink-600 dark:text-ink-300">
        We can&apos;t find that page. Try starting from the track list.
      </p>
      <Link
        href="/tracks"
        className="mt-6 rounded-lg bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100"
      >
        Browse tracks →
      </Link>
    </div>
  );
}
