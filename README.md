# AI Engineering Lab

Interactive AI Engineering learning platform. Twenty-seven tracks from Python and math to multi-agent systems, MCP, and production LLM infrastructure. Built with Next.js 15, TypeScript, and Tailwind CSS. Static-exported, so it deploys to GitHub Pages, Vercel, Netlify, S3 — anywhere that can serve static files.

## What's inside

- **Landing page** — hero, philosophy flow, features, featured tracks, levels, audience, CTA
- **All 27 tracks** — grouped into Foundations / AI Core / AI Engineering / Advanced
- **Individual track pages** — overview, topics, projects, outcomes, the 20-step lesson template, prev/next navigation
- **Roadmap** — four phases, personalized paths by persona
- **Skill tree** — four branches (ML, LLMs, Agents, Production AI)
- **Projects** — capstones by level, artifact-per-topic table, all 60+ projects grouped
- **About** — the 15 design principles and the recommended stack
- Dark mode, responsive, static export

## Local dev

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Production build

```bash
npm run build
# static site is emitted to ./out
```

## Deploy to GitHub Pages (recommended)

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source = "GitHub Actions"**.
3. Push to `main`. The workflow at `.github/workflows/deploy.yml` will:
   - install deps
   - build with `NEXT_PUBLIC_BASE_PATH` automatically set to `/<repo-name>` for project pages
   - upload the `out/` folder as a Pages artifact
   - deploy it
4. Your site will be live at `https://<your-user>.github.io/<repo-name>/`.

If you're deploying to a **user/org page** (`<user>.github.io`) or a **custom domain**, the base path should be empty. The workflow already handles project pages; for a user page, set `NEXT_PUBLIC_BASE_PATH=""` in the workflow env.

## Deploy elsewhere

- **Vercel** — Import the repo. It just works. No env vars needed.
- **Netlify** — Build command `npm run build`, publish dir `out`.
- **S3 / CloudFront / Cloudflare Pages** — Upload the contents of `out/` after `npm run build`.
- **Docker / VPS** — Any static file server (nginx, caddy) can serve `out/`.

## Structure

```
ai-engineering-lab/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # root layout, theme bootstrap
│   ├── page.tsx             # landing
│   ├── tracks/              # tracks index + [slug] detail
│   ├── roadmap/             # learning roadmap
│   ├── skill-tree/          # skill tree
│   ├── projects/            # portfolio artifacts
│   ├── about/               # philosophy & stack
│   ├── not-found.tsx        # 404
│   ├── icon.svg             # favicon
│   └── globals.css          # tailwind + design tokens
├── components/              # Navbar, Footer, Hero, TrackCard, PhilosophyFlow
├── lib/
│   ├── tracks.ts            # all 27 tracks as data
│   └── paths.ts             # base-path helper
├── public/                  # static assets
├── .github/workflows/       # GitHub Pages deploy
└── next.config.mjs          # static export config
```

## Editing content

All curriculum data lives in [`lib/tracks.ts`](lib/tracks.ts). Add, edit, or reorder tracks there — every page (landing, tracks, roadmap, skill tree, projects) is generated from that file.

## Roadmap for v2

- Add lesson pages rendered from Markdown/MDX under `content/`
- Add in-browser Python via Pyodide for the interactive lab
- Add quizzes and coding challenges
- Add an AI tutor endpoint (Cloudflare Worker / Vercel Function)
- Add progress tracking (localStorage first, backend later)

## License

MIT
