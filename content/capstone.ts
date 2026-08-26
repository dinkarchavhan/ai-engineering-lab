import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — Capstone Framework (fully written as the reference)
// ---------------------------------------------------------------------------
const frameworkLesson: Lesson = {
  slug: "capstone-framework",
  trackSlug: "capstone",
  order: 1,
  minutes: 18,
  title: "The Capstone Framework",
  subtitle:
    "How to scope, build, document, and present a portfolio project that demonstrates real engineering — not just that you completed a tutorial.",
  tags: ["Capstone", "Portfolio", "Framework", "Project management"],
  sections: [
    {
      step: 1,
      title: "What makes a capstone project worth having",
      blocks: [
        {
          type: "text",
          content:
            "A portfolio project that impresses a hiring manager or client is not the most technically complex thing you can build. It's the most **clearly explained** thing you can build.\n\nThe difference between a project that gets you a job and one that doesn't is almost never the code. It's the README that explains *what problem you solved*, the demo that shows it *actually working*, and the write-up that shows you understand *why you made each key decision*.",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "A senior engineer reviewing your portfolio is asking one question: 'Does this person think like someone I'd trust to ship a production system?' A clear README and a working demo answer yes. A repo with no description and no demo does not.",
        },
      ],
    },
    {
      step: 2,
      title: "The 7-phase capstone process",
      blocks: [
        {
          type: "list",
          style: "number",
          items: [
            "**Scope** — define the problem, the user, and the minimum viable version in writing before touching code.",
            "**Architecture** — sketch the system design, choose the stack, and document the key decisions and trade-offs.",
            "**Iterative delivery** — build in vertical slices: each slice is a working, demonstrable piece of the product.",
            "**Evaluation** — define what 'good' looks like and measure it. Automated evals, user testing, or both.",
            "**Deployment** — ship it publicly. A project with a live URL is worth 5× a project that only runs locally.",
            "**Documentation** — write the README as if a new engineer must understand and run the project in 15 minutes.",
            "**Demo and write-up** — record a 2-minute demo video and write a technical blog post or case study.",
          ],
        },
      ],
    },
    {
      step: 3,
      title: "Phase 1: Scoping",
      blocks: [
        {
          type: "text",
          content:
            "The most common capstone mistake is a scope that's either too large (never finished) or too small (nothing to show). Good scoping answers three questions before you write any code:",
        },
        {
          type: "kv",
          items: [
            {
              key: "What problem does this solve?",
              value:
                "One sentence. If you can't explain the problem in one sentence, the scope is too broad. Example: 'Engineers spend 30 minutes writing release notes — this automates it from git history in under 10 seconds.'",
            },
            {
              key: "Who is the user?",
              value:
                "A specific person in a specific context. 'Developers' is too broad. 'A backend engineer who needs to summarize a PR for a non-technical stakeholder' is concrete.",
            },
            {
              key: "What is the minimum viable version?",
              value:
                "The smallest thing that demonstrates the core value. List 3 features maximum. Everything else is 'nice to have' that you add after the MVP works.",
            },
          ],
        },
        {
          type: "code",
          language: "text",
          label: "Scope document template",
          code: `Project: [Name]
Problem: [One sentence — what pain does this solve?]
User: [Specific person in a specific context]

MVP features (must ship):
1.
2.
3.

Nice-to-have (only after MVP works):
-
-

Out of scope:
-
-

Success criteria: [How will you know the MVP works?]
Timeline: [Realistic estimate with 1.5× buffer]`,
        },
      ],
    },
    {
      step: 4,
      title: "Phase 2: Architecture",
      blocks: [
        {
          type: "text",
          content:
            "Before writing code, write down the architecture. You don't need a formal spec — a markdown file with a component diagram and a list of key decisions is enough.",
        },
        {
          type: "code",
          language: "text",
          label: "architecture.md template",
          code: `# Architecture

## Overview
[2-3 sentences describing the system]

## Component diagram
[ASCII or Mermaid diagram showing components and data flow]

## Stack
- Frontend: [choice + reason]
- Backend: [choice + reason]
- LLM: [model + provider + reason]
- Database: [choice + reason]
- Deployment: [platform + reason]

## Key decisions
| Decision | Options considered | Choice | Reason |
|---|---|---|---|
| LLM provider | Anthropic, OpenAI, local | Anthropic Claude | ... |
| Database | PostgreSQL, SQLite, Supabase | ... | ... |

## What I'd do differently at 10× scale
[1-2 sentences — shows you understand the limits]`,
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "The 'what I'd do differently at 10× scale' section is the most impressive part of any architecture document. It shows you shipped pragmatically while understanding the trade-offs. Include it in your README.",
        },
      ],
    },
    {
      step: 5,
      title: "Phase 3: Iterative delivery",
      blocks: [
        {
          type: "text",
          content:
            "Build in vertical slices, not horizontal layers. A vertical slice is end-to-end functionality — it touches every layer of the stack but only for one feature. Horizontal layers (all the models, then all the APIs, then all the UI) produce a project where nothing works until the very end.",
        },
        {
          type: "list",
          style: "number",
          items: [
            "**Slice 1 — Happy path, hardcoded.** Make the core interaction work with hardcoded data. Don't touch auth, DB, or error handling yet. Proves the idea works.",
            "**Slice 2 — Real data, real LLM.** Swap hardcoded values for real API calls and real data. Still no auth or polish.",
            "**Slice 3 — Error handling and edge cases.** What happens when the LLM returns garbage? When the user sends an empty message? When the API is down?",
            "**Slice 4 — Auth, persistence, deployment.** Add user accounts (or API keys), persist data, deploy to a public URL.",
            "**Slice 5+ — Nice-to-haves.** Only if you have time after the above works and is deployed.",
          ],
        },
      ],
    },
    {
      step: 6,
      title: "Phase 4: Evaluation",
      blocks: [
        {
          type: "text",
          content:
            "Evaluation is how you prove your project works. For AI projects, 'it works' is not obvious — LLM outputs are variable, and a demo can cherry-pick the good responses.",
        },
        {
          type: "kv",
          items: [
            {
              key: "Define success criteria first",
              value:
                "Before building, write down what a good response looks like for 5 representative inputs. This becomes your test set.",
            },
            {
              key: "Automated evaluation",
              value:
                "Use LLM-as-judge: a second LLM call that scores your output on a rubric. Run it on your test set before every deployment.",
            },
            {
              key: "Human evaluation",
              value:
                "For the demo, ask 3 people who don't know your project to use it. Note where they get confused. Fix those things.",
            },
            {
              key: "Include eval results in the README",
              value:
                "'Our LLM-as-judge eval shows 87% of responses meet the quality criteria on the test set' is far more convincing than 'it works great'.",
            },
          ],
        },
      ],
    },
    {
      step: 7,
      title: "Phases 5–7: Deploy, document, and demo",
      blocks: [
        {
          type: "list",
          style: "number",
          items: [
            "**Deploy publicly.** Vercel + Railway + Supabase is the fastest free-tier stack for a full-stack AI app. A live URL is required for the project to count as 'done'.",
            "**Write the README.** Problem (1 paragraph), demo GIF or screenshot, quick start (5 commands or fewer), architecture overview, key decisions. If it takes more than 15 minutes for a developer to run locally, fix the README.",
            "**Record a 2-minute demo.** Screen record the happy path. No voiceover required — captions work. Upload to YouTube (unlisted) and link from the README.",
            "**Write a technical post.** 500–800 words: the problem, what you built, one interesting technical challenge and how you solved it, what you'd do differently. Post on your blog, Dev.to, or LinkedIn.",
          ],
        },
        {
          type: "callout",
          kind: "gotcha",
          content:
            "A project with no live URL, no README, and no demo video is a local experiment — not a portfolio piece. Deployment and documentation are not optional extras. They're what transform code into a portfolio.",
        },
      ],
    },
    {
      step: 8,
      title: "The capstone project ladder",
      blocks: [
        {
          type: "text",
          content:
            "The six capstone projects in this track form a ladder — each one builds on concepts from previous tracks and demonstrates a new level of engineering capability:",
        },
        {
          type: "kv",
          items: [
            {
              key: "Beginner — AI Chatbot",
              value: "Proves: can build a functional LLM-powered app and deploy it. Stack: Next.js + Anthropic SDK.",
            },
            {
              key: "Intermediate — PDF RAG Assistant",
              value: "Proves: can build a retrieval pipeline and handle real documents. Stack: FastAPI + pgvector + Anthropic.",
            },
            {
              key: "Advanced — Enterprise Knowledge Assistant",
              value: "Proves: can build a multi-source RAG system with auth, eval, and production ops. Stack: full production stack.",
            },
            {
              key: "Expert — Multi-Agent Research System",
              value: "Proves: can orchestrate autonomous agents, handle tool use, and manage agent failures.",
            },
            {
              key: "Senior — AI Software Development Platform",
              value: "Proves: can build an AI product with real users, billing, and SLA. End-to-end ownership.",
            },
            {
              key: "Architect — Enterprise Agentic AI Platform",
              value: "Proves: can design and lead the implementation of a complex, multi-team AI system.",
            },
          ],
        },
      ],
    },
    {
      step: 9,
      title: "Choosing the right capstone",
      blocks: [
        {
          type: "text",
          content:
            "Pick the project that's **one level above your current comfort zone** — not two. A project you can complete in 4–6 weeks and ship demonstrates far more than a project you spend 6 months on and never finish.",
        },
        {
          type: "list",
          style: "bullet",
          items: [
            "**If you've never built an LLM app**: start with the AI Chatbot.",
            "**If you've built a chatbot but not a RAG system**: do the PDF RAG Assistant.",
            "**If you've built RAG but not a production system**: do the Enterprise Knowledge Assistant.",
            "**If you're aiming for a senior AI engineer role**: do the Multi-Agent Research System or the AI Software Development Platform.",
            "**If you're targeting architect or staff engineer roles**: do the Enterprise Agentic AI Platform.",
          ],
        },
      ],
    },
    {
      step: 10,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You finish building your capstone project locally. It works on your machine but you haven't deployed it or written a README. What is the most important next step?",
          options: [
            "Deploy it to a public URL and write the README — a project without a live demo and documentation is not a portfolio piece.",
            "Add more features to make it more impressive before showing anyone.",
            "Refactor the code to make it cleaner before deploying.",
            "Share the GitHub repo link — engineers can clone and run it.",
          ],
          correct: 0,
          explanation:
            "A live URL and README transform local code into a portfolio piece. Requiring someone to clone and run your repo to evaluate your project is a high bar that most reviewers won't clear — they'll move on. More features don't help if the project isn't accessible. Code quality matters less than demonstrating it works.",
        },
      ],
    },
    {
      step: 11,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "The next six lessons each walk through one capstone project: requirements, architecture, implementation guide, evaluation strategy, deployment, and the write-up. Start with the lesson for the project at your level. Each lesson ends with a checklist — your project is done when every item is checked.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lessons 2–13 — methodology + project stubs
// ---------------------------------------------------------------------------

function stub(
  slug: string,
  order: number,
  minutes: number,
  title: string,
  subtitle: string,
  tags: string[],
  teaser: string,
): Lesson {
  return {
    slug,
    trackSlug: "capstone",
    order,
    minutes,
    title,
    subtitle,
    tags,
    sections: [
      {
        step: 1,
        title: "Lesson overview",
        blocks: [
          { type: "text", content: teaser },
          {
            type: "callout",
            kind: "tip",
            title: "How to use this lesson",
            content:
              "Don't just read — do. Every section ends with a concrete action for your own project. By the end of this lesson you should have a real artifact: a scope document, an architecture diagram, a deployed app, or a published write-up. Reading without building produces knowledge without evidence.",
          },
        ],
      },
      {
        step: 2,
        title: "Phase in the capstone process",
        blocks: [
          {
            type: "diagram",
            label: "The 7-phase capstone process",
            chart: `flowchart LR
  SC[Scope] --> AR[Architecture]
  AR --> ID[Iterative delivery]
  ID --> EV[Evaluation]
  EV --> DP[Deployment]
  DP --> DO[Documentation]
  DO --> DM[Demo & write-up]
  C[${title}] -. this lesson .-> ID
  style C fill:#d9edff,stroke:#8ecdff`,
          },
        ],
      },
      {
        step: 3,
        title: "Core technique and implementation",
        blocks: [
          {
            type: "callout",
            kind: "insight",
            content:
              "The goal of every capstone phase is a concrete, shareable artifact — not just understanding. A scope document, a deployed URL, a demo video, a published blog post. If the phase doesn't produce an artifact, it isn't done.",
          },
          {
            type: "code",
            language: "text",
            label: "Phase checklist",
            code: `${title} — done when:
[ ] Artifact created (document / URL / recording / post)
[ ] Reviewed by at least one other person
[ ] Linked from the project README
[ ] Ready to show to a hiring manager or client`,
          },
        ],
      },
      {
        step: 4,
        title: "Common mistakes and how to avoid them",
        blocks: [
          {
            type: "list",
            style: "bullet",
            items: [
              "Skipping this phase because 'I'll do it later' — later never comes once the next feature is calling.",
              "Treating this phase as done when it 'feels' done rather than when the checklist is complete.",
              "Spending too long perfecting this phase instead of moving forward — done is better than perfect.",
              "Not getting external feedback before moving on — you're too close to your own work to see its gaps.",
            ],
          },
          {
            type: "callout",
            kind: "gotcha",
            content:
              "The phases that are easiest to skip — documentation, evaluation, demo — are the ones that most distinguish a portfolio piece from a local experiment. Resist the urge to skip them.",
          },
        ],
      },
      {
        step: 5,
        title: "Tools and templates",
        blocks: [
          {
            type: "list",
            style: "bullet",
            items: [
              "Use the templates provided in each phase lesson — they exist so you don't have to design the artifact from scratch.",
              "Keep all artifacts in the project repo, not in personal notes — so reviewers can find them.",
              "Version-control your scope document and architecture notes — the evolution of your thinking is interesting to reviewers.",
              "Time-box each phase: scope (2 hours), architecture (3 hours), MVP (2 weeks), evaluation (1 day), deployment (4 hours), documentation (4 hours), demo (2 hours).",
            ],
          },
        ],
      },
      {
        step: 6,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: `What is the artifact that proves you've completed the ${title} phase of your capstone?`,
            options: [
              "A concrete, shareable document, URL, recording, or published post — not just a feeling that it's done.",
              "A passing test suite for the code you wrote in this phase.",
              "A manager's or mentor's verbal confirmation that the phase looks good.",
              "Moving on to the next phase.",
            ],
            correct: 0,
            explanation:
              "Each capstone phase must produce an artifact — something concrete and shareable. Verbal confirmation and 'feeling done' leave no evidence for portfolio reviewers. A test suite verifies code, not phases like scoping or documentation. Moving on without the artifact just defers the work.",
          },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Project stubs — one per capstone project on the ladder
// ---------------------------------------------------------------------------

function projectStub(
  slug: string,
  order: number,
  minutes: number,
  title: string,
  subtitle: string,
  tags: string[],
  level: string,
  stack: string,
  teaser: string,
): Lesson {
  return {
    slug,
    trackSlug: "capstone",
    order,
    minutes,
    title,
    subtitle,
    tags,
    sections: [
      {
        step: 1,
        title: "Project overview",
        blocks: [
          {
            type: "callout",
            kind: "insight",
            title: `${level} capstone`,
            content: teaser,
          },
          {
            type: "kv",
            items: [
              { key: "Level", value: level },
              { key: "Stack", value: stack },
              { key: "Estimated build time", value: "3–5 weeks" },
              { key: "Demonstrates", value: subtitle },
            ],
          },
        ],
      },
      {
        step: 2,
        title: "Scope and requirements",
        blocks: [
          {
            type: "text",
            content:
              "Complete the scope document before writing any code. Use the template from the Capstone Framework lesson. Define the user, the core problem, the MVP features (3 maximum), and the success criteria.",
          },
          {
            type: "code",
            language: "text",
            label: "Scope document — fill this in before starting",
            code: `Project: ${title}
Problem: [One sentence]
User: [Specific person in a specific context]

MVP features (must ship):
1.
2.
3.

Success criteria:
- [ ] Core feature works end-to-end
- [ ] Deployed to a public URL
- [ ] README explains the project in under 5 minutes
- [ ] Demo video recorded and linked`,
          },
        ],
      },
      {
        step: 3,
        title: "Architecture",
        blocks: [
          {
            type: "diagram",
            label: `${title} — high-level architecture`,
            chart: `flowchart LR
  U[User] --> FE[Frontend]
  FE --> API[Backend API]
  API --> LLM[LLM Provider]
  API --> DB[(Database)]
  API --> VS[(Vector Store)]
  style LLM fill:#d9edff,stroke:#8ecdff`,
          },
          {
            type: "text",
            content:
              "Document your stack choices in architecture.md before building. Include why you chose each component over the alternatives. This becomes the most valuable part of your portfolio write-up.",
          },
        ],
      },
      {
        step: 4,
        title: "Implementation guide",
        blocks: [
          {
            type: "list",
            style: "number",
            items: [
              "**Slice 1 (days 1–3)**: Build the happy path end-to-end with hardcoded data. Prove the core interaction works.",
              "**Slice 2 (days 4–7)**: Integrate the real LLM and real data. Add basic error handling.",
              "**Slice 3 (days 8–14)**: Auth, persistence, and deployment. Get it to a public URL.",
              "**Slice 4 (week 3)**: Evaluation, polish, documentation, and demo recording.",
              "**Slice 5+ (optional)**: Nice-to-have features only after the above is shipped and working.",
            ],
          },
          {
            type: "callout",
            kind: "gotcha",
            content:
              "Do not add features after slice 3 until the project is deployed and the README is written. A deployed MVP beats an undeployed feature-rich project every time.",
          },
        ],
      },
      {
        step: 5,
        title: "Evaluation and deployment checklist",
        blocks: [
          {
            type: "list",
            style: "bullet",
            items: [
              "[ ] Core feature tested on 10 real inputs — not just the happy path.",
              "[ ] LLM-as-judge evaluation run on a representative test set.",
              "[ ] Deployed to a public URL (Vercel / Railway / Fly.io).",
              "[ ] README: problem, demo GIF/screenshot, quick start, architecture, key decisions.",
              "[ ] Demo video: 2 minutes, shows the happy path and one interesting edge case.",
              "[ ] Technical write-up: 500–800 words, problem + solution + one interesting challenge.",
            ],
          },
        ],
      },
      {
        step: 6,
        title: "Completion quiz",
        blocks: [
          {
            type: "quiz",
            question: `Your ${title} is running locally and all features work. What must you complete before this capstone counts as done?`,
            options: [
              "Deploy to a public URL, write the README, record the demo video, and publish the technical write-up.",
              "Commit all code to GitHub with clean commit messages.",
              "Add comprehensive test coverage for all components.",
              "Refactor the code for maximum readability.",
            ],
            correct: 0,
            explanation:
              "A project is done when it's deployed, documented, and demoed — not just when the code works locally. GitHub alone is not a portfolio piece. Tests and clean code are valuable but secondary to the artifact being publicly accessible and clearly explained.",
          },
        ],
      },
    ],
  };
}

export const capstoneLessons: Lesson[] = [
  frameworkLesson,

  // Methodology lessons
  stub(
    "requirements-and-scoping",
    2,
    14,
    "Requirements and Scoping",
    "Define the problem, the user, and the MVP before touching code.",
    ["Scoping", "Requirements", "MVP", "Problem definition"],
    "The scope document is the most important artifact you'll produce for your capstone. It forces you to define the problem in one sentence, identify the specific user, list only the MVP features, and set measurable success criteria. This lesson walks through the scoping process for all six capstone projects, shows examples of good vs. bad scope documents, and gives you a template you can complete in under two hours.",
  ),
  stub(
    "architecture-design",
    3,
    16,
    "Architecture Design",
    "Document your stack, components, and key decisions before writing the first line of code.",
    ["Architecture", "System design", "Stack choice", "Decision log"],
    "An architecture document written before building saves more time than any refactor after building. This lesson covers what to include in a capstone architecture document — component diagram, stack choices with rationale, key decisions and their trade-offs, and the 'what I'd do differently at 10× scale' section that demonstrates production thinking. You'll produce a complete architecture.md for your chosen capstone project.",
  ),
  stub(
    "iterative-delivery",
    4,
    14,
    "Iterative Delivery",
    "Build in vertical slices — each slice is a working demo, not a layer of the stack.",
    ["Iterative", "Vertical slices", "Agile", "MVP"],
    "Most capstone projects stall because they're built horizontally — all models, then all APIs, then all UI. Nothing works until the end, and when the deadline arrives, nothing is demonstrable. Vertical slices fix this: each slice is end-to-end functionality that you can demo the day it's built. This lesson maps the five slices for each capstone project and shows how to resist the urge to polish before the core works.",
  ),
  stub(
    "evaluation-and-testing",
    5,
    14,
    "Evaluation and Testing",
    "Define success criteria, build a test set, and run LLM-as-judge evals before every deployment.",
    ["Evaluation", "LLM-as-judge", "Testing", "Quality"],
    "Showing a project to an interviewer and cherry-picking the best response is not evaluation. A real evaluation defines success criteria before building, assembles a representative test set (10–20 inputs covering the happy path and edge cases), and runs an automated LLM-as-judge rubric that produces a score you can report: 'Our eval shows 87% of responses meet the quality bar.' This lesson builds the evaluation infrastructure for each capstone project.",
  ),
  stub(
    "deployment",
    6,
    12,
    "Deployment",
    "Ship to a public URL — Vercel, Railway, Fly.io — so reviewers don't have to clone and run.",
    ["Deployment", "Vercel", "Railway", "Fly.io", "Production"],
    "A project that only runs locally is not done. This lesson covers the fastest paths from code to public URL for each capstone project: Vercel for Next.js frontends, Railway for FastAPI backends with a database, Fly.io for containerized apps, and Supabase for managed PostgreSQL + pgvector. Includes environment variable management, secrets handling, and the minimal CI/CD pipeline that redeploys on push to main.",
  ),
  stub(
    "documentation",
    7,
    12,
    "Documentation",
    "Write a README that explains your project to a reviewer in under 5 minutes.",
    ["Documentation", "README", "Technical writing", "Portfolio"],
    "The README is the first thing a hiring manager, client, or collaborator sees. It has about 30 seconds to answer three questions: what does this do, does it work, and can I try it? This lesson writes the README template for each capstone project — problem statement, demo GIF, quick-start (5 commands maximum), architecture overview with diagram, key decisions and trade-offs, and the 'what I'd do differently' section. Includes before/after examples of weak and strong READMEs.",
  ),
  stub(
    "demo-and-writeup",
    8,
    12,
    "Demo and Write-up",
    "Record a 2-minute demo and write the technical post that gets your project read.",
    ["Demo", "Write-up", "Blog post", "Video", "Communication"],
    "The demo and write-up transform your project from a private accomplishment into a public artifact that builds your reputation. This lesson covers the 2-minute demo format (what to show, how to show errors honestly, how to caption instead of narrate), and the 500–800 word technical write-up structure (problem, solution, one interesting challenge, what you'd do differently). Includes a script template for the demo and an outline for the blog post.",
  ),

  // Project lessons
  projectStub(
    "beginner-ai-chatbot",
    9,
    16,
    "Beginner: AI Chatbot",
    "Build and deploy a streaming multi-turn chatbot with a clean UI — your first complete AI product.",
    ["Chatbot", "Beginner", "Next.js", "Streaming", "Multi-turn"],
    "Beginner",
    "Next.js + Anthropic SDK + Vercel",
    "The AI Chatbot is the foundational capstone: a streaming, multi-turn chat interface backed by Claude. It proves you can build a working LLM-powered product end-to-end — not just call an API in a script. The challenge is not the API call; it's the conversation state management, the streaming UI, and the deployment. By the end you'll have a live URL you can share with anyone.",
  ),
  projectStub(
    "intermediate-pdf-rag-assistant",
    10,
    20,
    "Intermediate: PDF RAG Assistant",
    "Upload PDFs, chunk them, embed them, and answer questions with cited sources.",
    ["RAG", "PDF", "Embeddings", "pgvector", "Intermediate"],
    "Intermediate",
    "FastAPI + pgvector + Anthropic + Next.js + Railway",
    "The PDF RAG Assistant proves you can build a retrieval pipeline: upload PDFs, extract and chunk text, embed chunks, store in pgvector, retrieve relevant chunks at query time, and pass them to Claude with a prompt that produces cited answers. The interesting challenges are chunking strategy (fixed-size vs. semantic), retrieval quality (how do you know the right chunks are being returned?), and citation formatting.",
  ),
  projectStub(
    "advanced-enterprise-knowledge-assistant",
    11,
    24,
    "Advanced: Enterprise Knowledge Assistant",
    "Multi-source RAG with auth, evaluation pipeline, and production observability.",
    ["RAG", "Multi-source", "Auth", "Evaluation", "Advanced"],
    "Advanced",
    "FastAPI + PostgreSQL + pgvector + Anthropic + Next.js + Railway + Prometheus",
    "The Enterprise Knowledge Assistant extends the RAG foundation to production quality: multiple document sources (PDFs, web pages, Notion), user authentication and per-user document isolation, an automated evaluation pipeline that scores answer quality on a test set, and an observability dashboard showing token spend, latency, and cache hit rate. This project demonstrates the full stack of a production AI feature — not just that it works, but that you can measure and improve it.",
  ),
  projectStub(
    "expert-multi-agent-research-system",
    12,
    28,
    "Expert: Multi-Agent Research System",
    "Orchestrate autonomous agents that search the web, read documents, and synthesize research reports.",
    ["Multi-agent", "Tool use", "Research", "Orchestration", "Expert"],
    "Expert",
    "FastAPI + Anthropic tool use + web search API + Redis + Next.js",
    "The Multi-Agent Research System orchestrates autonomous agents: a planner that decomposes a research question, specialist agents that search the web and read documents, and a synthesizer that assembles a cited research report. The engineering challenges are agent reliability (what happens when a sub-agent fails?), loop termination (how do you prevent infinite agent loops?), and result quality (how do you evaluate a research report automatically?). This project demonstrates senior-level agent engineering.",
  ),
  projectStub(
    "senior-ai-software-development-platform",
    13,
    32,
    "Senior: AI Software Development Platform",
    "A code review, documentation, and PR summary tool used by a real team — with billing and SLA.",
    ["Code review", "Developer tools", "Billing", "SLA", "Senior"],
    "Senior",
    "Full-stack: FastAPI + Anthropic + GitHub API + Stripe + PostgreSQL + Kubernetes",
    "The AI Software Development Platform is built to be used by a real team: it integrates with GitHub to automate code review comments, generate PR summaries for non-technical stakeholders, and produce documentation from code. The engineering scope includes the GitHub webhook integration, multi-tenant billing with Stripe, SLA monitoring, and the evaluation framework that measures review quality against human reviewers. This project demonstrates full product ownership — not just engineering, but shipping.",
  ),
];
