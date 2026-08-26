import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — The System Design Framework (fully written as the reference)
// ---------------------------------------------------------------------------
const frameworkLesson: Lesson = {
  slug: "system-design-framework",
  trackSlug: "ai-system-design",
  order: 1,
  minutes: 20,
  title: "The System Design Framework",
  subtitle:
    "A repeatable 8-step process for designing any AI system — from requirements to failure scenarios — that works on a whiteboard and in a real architecture review.",
  tags: ["System design", "Framework", "Architecture", "Interview"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "You're asked: *Design a ChatGPT-like system.* Where do you start?\n\nMost engineers either dive straight into components (\"we'll use Redis for caching\") before understanding requirements, or stall trying to cover everything at once. Both approaches fail — in interviews and in real architecture reviews.\n\nThis lesson gives you a **repeatable 8-step framework** that works for any AI system design question: from a simple chatbot to an enterprise agentic platform.",
        },
      ],
    },
    {
      step: 2,
      title: "Why a framework matters",
      blocks: [
        {
          type: "callout",
          kind: "insight",
          content:
            "The purpose of a framework isn't to constrain creativity — it's to ensure you never skip the step that makes everything else wrong. In AI system design, skipping requirements almost always leads to an architecture that's over-engineered for the wrong problem.",
        },
        {
          type: "text",
          content:
            "A senior engineer reviewing your design isn't just checking whether you know the right components. They're checking whether you **think like someone who ships systems** — someone who asks the hard questions before committing to an architecture.",
        },
      ],
    },
    {
      step: 3,
      title: "The 8-step framework",
      blocks: [
        {
          type: "list",
          style: "number",
          items: [
            "**Clarify requirements** — functional (what it does) and non-functional (how well it does it). Never assume.",
            "**Estimate scale** — DAU, RPS, token volume, storage. Numbers drive every architectural decision.",
            "**Define the API contract** — inputs, outputs, streaming vs. batch, latency SLAs.",
            "**Sketch the high-level architecture** — components and data flow, no implementation details yet.",
            "**Choose the data stores** — conversation history, embeddings, documents, metadata.",
            "**Place the LLM** — provider vs. self-hosted, which model, context window constraints.",
            "**Design for scale and cost** — caching, async queues, model fallback, token budgets.",
            "**Enumerate failure scenarios** — what breaks, what the user experiences, how you recover.",
          ],
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "In a 45-minute interview: spend 5 minutes on requirements, 5 on scale, 5 on API, 15 on high-level architecture + data stores + LLM placement, 10 on scaling/cost, 5 on failures. Never skip step 1.",
        },
      ],
    },
    {
      step: 4,
      title: "Step 1: Clarify requirements",
      blocks: [
        {
          type: "text",
          content:
            "The single most common system design mistake is answering the wrong question. Before drawing a single box, ask:",
        },
        {
          type: "kv",
          items: [
            {
              key: "Who are the users?",
              value: "Consumers, enterprise employees, developers via API? Each has different reliability and latency expectations.",
            },
            {
              key: "What is the core interaction?",
              value: "Single-turn Q&A, multi-turn chat, autonomous agent, batch processing? Determines architecture shape.",
            },
            {
              key: "What data does it operate on?",
              value: "Public internet, private documents, structured databases, real-time feeds? Determines the RAG or tool-use strategy.",
            },
            {
              key: "What are the output requirements?",
              value: "Free-form text, structured JSON, code, images? Determines model choice and output validation needs.",
            },
            {
              key: "What can't go wrong?",
              value: "Data privacy, hallucination rate, latency SLA, cost ceiling. These are your hard constraints.",
            },
          ],
        },
      ],
    },
    {
      step: 5,
      title: "Step 2: Estimate scale",
      blocks: [
        {
          type: "text",
          content:
            "Scale estimates drive every architectural decision. A system serving 100 users/day needs no queue. One serving 1M needs multiple.",
        },
        {
          type: "code",
          language: "text",
          label: "Scale estimation worksheet",
          code: `Daily Active Users (DAU):         e.g. 500,000
Sessions per user per day:        e.g. 3
Messages per session:             e.g. 10
─────────────────────────────────────────────
Daily messages:                   500k × 3 × 10 = 15M
Peak RPS (10× average):           15M / 86400 × 10 ≈ 1,736 RPS

Avg input tokens per message:     e.g. 800 (system prompt + history + user msg)
Avg output tokens per message:    e.g. 300
─────────────────────────────────────────────
Daily input tokens:               15M × 800 = 12B tokens
Daily output tokens:              15M × 300 = 4.5B tokens

At $3 / 1M input tokens (claude-sonnet):
Daily token cost:                 12B/1M × $3 + 4.5B/1M × $15 = $36k + $67.5k ≈ $100k/day`,
        },
        {
          type: "callout",
          kind: "gotcha",
          content:
            "Always compute the cost early. Many technically elegant architectures are business-impossible once you do the math. A $100k/day token bill forces a conversation about caching, smaller models, and prompt compression before you commit to the architecture.",
        },
      ],
    },
    {
      step: 6,
      title: "Step 3–4: API and high-level architecture",
      blocks: [
        {
          type: "text",
          content:
            "Define the API contract before the internals. What does the caller see? What does it send? What does it get back?",
        },
        {
          type: "code",
          language: "text",
          label: "API contract sketch",
          code: `POST /v1/chat
{
  "conversation_id": "uuid",        // for multi-turn history
  "user_id": "uuid",                // for rate limiting and personalization
  "message": "What is RAG?",
  "stream": true                    // SSE streaming
}

Response (stream):
data: {"delta": "RAG stands", "tokens_used": 4}
data: {"delta": " for Retrieval", "tokens_used": 8}
...
data: {"delta": "", "finish_reason": "stop", "total_tokens": 312}`,
        },
        {
          type: "diagram",
          label: "High-level architecture — AI chat system",
          chart: `flowchart TD
    C[Client] --> GW[API Gateway<br/>auth · rate limit]
    GW --> W[Chat Service<br/>FastAPI]
    W --> CA[Cache<br/>Redis]
    CA -- miss --> Q[Queue<br/>Celery]
    Q --> WK[Worker]
    WK --> CTX[Context Builder<br/>history + RAG]
    CTX --> LLM[LLM Provider]
    WK --> DB[(Conversation DB<br/>PostgreSQL)]
    WK --> VS[(Vector Store<br/>Pinecone / pgvector)]
    style LLM fill:#d9edff,stroke:#8ecdff`,
        },
      ],
    },
    {
      step: 7,
      title: "Step 5–6: Data stores and LLM placement",
      blocks: [
        {
          type: "kv",
          items: [
            {
              key: "Conversation history",
              value:
                "PostgreSQL or DynamoDB — structured, queryable, per-user. Use TTL to expire old conversations and control storage cost.",
            },
            {
              key: "Document store (RAG)",
              value:
                "S3 / GCS for raw files. pgvector or Pinecone for embeddings. Choose pgvector if you're already on Postgres and scale is under 10M vectors; Pinecone for billion-scale.",
            },
            {
              key: "Cache",
              value:
                "Redis for exact-match cache (same prompt, same response). Semantic cache (embedding similarity) for fuzzy hits. Both reduce token spend.",
            },
            {
              key: "LLM: cloud provider vs. self-hosted",
              value:
                "Cloud (Anthropic, OpenAI) for reliability and no-ops. Self-hosted (vLLM) for data-sensitive use cases, at-scale cost savings, or specific open models. Hybrid: cloud for peak, self-hosted for baseline.",
            },
          ],
        },
      ],
    },
    {
      step: 8,
      title: "Step 7: Scaling and cost",
      blocks: [
        {
          type: "list",
          style: "number",
          items: [
            "**Prompt compression** — summarize older conversation turns instead of sending full history. Cuts input tokens 40–60% on long sessions.",
            "**Semantic caching** — embed the user query, find similar past queries. Cache hit rate of 20–30% on real workloads is common.",
            "**Model tiering** — route simple queries to a cheaper fast model (Haiku), complex ones to a larger model (Sonnet/Opus). Can cut cost 50–70%.",
            "**Async for non-interactive workloads** — batch summarization, document processing, background agents don't need real-time responses. Use queues and run at off-peak hours.",
            "**Horizontal scaling** — stateless workers behind a load balancer. Add workers when queue depth exceeds threshold.",
          ],
        },
      ],
    },
    {
      step: 9,
      title: "Step 8: Failure scenarios",
      blocks: [
        {
          type: "text",
          content:
            "Every system design is incomplete without a failure analysis. For each failure, describe: what the user experiences, how you detect it, and how you recover.",
        },
        {
          type: "kv",
          items: [
            {
              key: "LLM provider outage",
              value:
                "User sees an error. Detect: circuit breaker opens on 5xx rate > 10%. Recover: failover to secondary provider or cached fallback response.",
            },
            {
              key: "Rate limit exceeded (429)",
              value:
                "Requests queued or rejected. Detect: monitor 429 rate per minute. Recover: exponential backoff, model fallback, per-user token budgets.",
            },
            {
              key: "Context window exceeded",
              value:
                "Request fails or response is cut off. Detect: count tokens before sending. Recover: sliding window truncation or summarize oldest turns.",
            },
            {
              key: "Vector store unavailable",
              value:
                "RAG retrieval fails; model responds without context. Detect: health check on vector store. Recover: degrade gracefully — respond without RAG, alert on-call.",
            },
            {
              key: "Runaway cost spike",
              value:
                "A prompt loop or mis-configured agent burns $10k overnight. Detect: per-minute token spend alert. Recover: kill the offending job, per-user and per-feature token budgets.",
            },
          ],
        },
      ],
    },
    {
      step: 10,
      title: "Worked example: applying the framework",
      blocks: [
        {
          type: "text",
          content:
            "Question: *Design a customer support AI for an e-commerce company that handles 50,000 tickets/day.*",
        },
        {
          type: "list",
          style: "number",
          items: [
            "**Requirements**: Ticket deflection (auto-answer), escalation to human when confidence is low, product catalog RAG, order history lookup via tool, response in <3 s.",
            "**Scale**: 50k/day ÷ 86,400 ≈ 0.6 RPS average, 6 RPS peak. Small — single worker, no queue needed yet.",
            "**API**: POST /v1/support-chat with customer_id, ticket_text, order_id. Returns answer + confidence + escalate flag.",
            "**Architecture**: FastAPI → Context Builder (RAG on FAQ docs + order lookup tool) → LLM → Confidence Scorer → Response or Escalation Queue.",
            "**Data**: Product FAQ in pgvector. Order history via read-only DB query tool. Conversation turns in PostgreSQL.",
            "**LLM**: claude-sonnet-4-5 for primary responses. claude-haiku-4-5 for confidence classification (cheap, fast).",
            "**Cost**: 50k × 1,200 tokens avg ≈ 60M tokens/day. At $3/1M input: ~$180/day — acceptable.",
            "**Failures**: LLM down → escalate all tickets to humans (safe degradation). Vector store down → respond without RAG context + add disclaimer.",
          ],
        },
      ],
    },
    {
      step: 11,
      title: "Common mistakes in AI system design",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Skipping scale estimation",
          content:
            "Every architecture looks fine at 1 RPS. Doing the math at 1,000 RPS reveals the single points of failure, the cost surprises, and the components that need to be async.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Treating LLM calls as fast",
          content:
            "An LLM call takes 1–15 seconds. Designing a synchronous web server that holds a connection open during that call is a mistake that doesn't show up until load testing.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "No graceful degradation",
          content:
            "Every AI system needs a defined behavior when the LLM is unavailable. 'Return an error' is acceptable. 'The entire product stops working' is not. Design the fallback before launch.",
        },
      ],
    },
    {
      step: 12,
      title: "Interview questions",
      blocks: [
        {
          type: "list",
          style: "number",
          items: [
            "Why do you estimate scale before drawing the architecture? *(Scale determines whether you need a queue, how many workers, whether self-hosting is cheaper than a provider, and whether caching is worth the complexity. Drawing components without knowing scale produces architectures that are either over- or under-engineered.)*",
            "How do you handle a context window that grows unbounded in a long conversation? *(Sliding window — drop oldest turns. Summarization — compress older turns into a summary that replaces them. Hybrid — keep the last N turns verbatim plus a summary of everything older.)*",
            "You need to cut LLM costs by 50%. What do you do first? *(Add semantic caching — 20–30% hit rates are common on real workloads. Then model tiering — route simple queries to a cheaper model. These two together often hit 50% cost reduction without architecture changes.)*",
          ],
        },
      ],
    },
    {
      step: 13,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You're designing an AI coding assistant used by 10,000 developers, each averaging 100 completions/day. The average completion is 50 input tokens + 100 output tokens. At $3/1M input and $15/1M output, what is the daily token cost?",
          options: [
            "10,000 × 100 = 1M completions. Input: 50M tokens × $3/1M = $150. Output: 100M tokens × $15/1M = $1,500. Total: ~$1,650/day.",
            "10,000 × 100 × 150 tokens = 150M tokens × $3/1M = $450/day.",
            "1M completions × $0.002 = $2,000/day.",
            "10,000 users × $0.10/day = $1,000/day.",
          ],
          correct: 0,
          explanation:
            "Separate input and output token costs — they're priced differently. 1M completions × 50 input tokens = 50M input tokens × $3/1M = $150. 1M completions × 100 output tokens = 100M output tokens × $15/1M = $1,500. Total = $1,650/day. Output tokens dominate because they're priced 5× higher than input tokens.",
        },
      ],
    },
    {
      step: 14,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "With the framework in hand, the remaining lessons apply it to specific, concrete AI systems — starting with **Requirements and Constraints**, which goes deeper on the questions you must ask before designing anything. Then each subsequent lesson covers one step of the framework in isolation so you can master it before combining them into full system designs.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lessons 2–10 — structured stubs with 6-step skeleton
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
    trackSlug: "ai-system-design",
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
              "Practice by designing out loud. After reading each section, close the lesson and sketch the component on paper. Then compare your sketch to the lesson's diagram. The gap between what you drew and what the lesson shows is exactly what you need to practice.",
          },
        ],
      },
      {
        step: 2,
        title: "Where it fits in the design framework",
        blocks: [
          {
            type: "diagram",
            label: `${title} in the 8-step system design framework`,
            chart: `flowchart LR
  R[Requirements] --> S[Scale estimate]
  S --> A[API contract]
  A --> H[High-level arch]
  H --> D[Data stores]
  D --> L[LLM placement]
  L --> SC[Scaling & cost]
  SC --> F[Failure scenarios]
  C[${title}] -. this lesson .-> H
  style C fill:#d9edff,stroke:#8ecdff`,
          },
        ],
      },
      {
        step: 3,
        title: "Key decisions and trade-offs",
        blocks: [
          {
            type: "callout",
            kind: "insight",
            content:
              "Every architectural decision is a trade-off. State the trade-off explicitly: 'We choose X over Y because X optimizes for Z at the cost of W.' An interviewer or architecture reviewer who hears this trusts that you understand the space.",
          },
          {
            type: "code",
            language: "text",
            label: "Decision framework",
            code: `For each design decision in ${title}:

1. What are the options? (list 2-3)
2. What does each optimize for? (latency, cost, consistency, simplicity)
3. What are the constraints that rule options out?
4. What is your choice and why?
5. What would change your mind?`,
          },
        ],
      },
      {
        step: 4,
        title: "Apply it to a concrete system",
        blocks: [
          {
            type: "text",
            content:
              "Apply this concept to a ChatGPT-like system — the canonical AI system design interview question. Then apply it to a RAG document assistant. Note how the same framework produces different designs for different requirements.",
          },
          {
            type: "code",
            language: "text",
            label: "Design exercise",
            code: `System A: Consumer AI chat (50M DAU, multi-turn, streaming)
System B: Enterprise document Q&A (5,000 employees, RAG, batch acceptable)

For each system, apply the ${title} step:
- What decisions does this step require?
- What is your choice for each system?
- How do the different scale and requirements change your decisions?`,
          },
        ],
      },
      {
        step: 5,
        title: "Failure modes for this component",
        blocks: [
          {
            type: "list",
            style: "bullet",
            items: [
              "What fails first under load? How do you detect it before users do?",
              "What is the graceful degradation path when this component is unavailable?",
              "What is the blast radius if this component has a bug? Can you limit it?",
              "How do you roll back a bad configuration change to this component in under 5 minutes?",
            ],
          },
          {
            type: "callout",
            kind: "gotcha",
            content:
              "A design that works perfectly at normal load but collapses at 2× load is not production-ready. Always ask: 'what is the first thing that breaks as traffic grows, and what is the cheapest fix?'",
          },
        ],
      },
      {
        step: 6,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: `When designing the ${title} component of an AI system, what should you define before choosing specific technologies?`,
            options: [
              "The requirements and constraints this component must satisfy, and the trade-offs between the options.",
              "The most popular open-source implementation of this component.",
              "The component used by the largest tech company in a similar system.",
              "The technology your team already knows best.",
            ],
            correct: 0,
            explanation:
              "Requirements and constraints drive technology choices. The most popular or most familiar technology may be wrong for your scale, latency, cost, or consistency requirements. Define what you need first, then evaluate options against those criteria.",
          },
        ],
      },
    ],
  };
}

export const aiSystemDesignLessons: Lesson[] = [
  frameworkLesson,
  stub(
    "requirements-and-constraints",
    2,
    14,
    "Requirements and Constraints",
    "The questions that prevent you from designing the wrong system — functional, non-functional, and the hard limits.",
    ["Requirements", "Constraints", "Non-functional", "SLA"],
    "Every failed architecture starts with incomplete requirements. This lesson builds a requirements-gathering checklist for AI systems: functional requirements (what the system must do), non-functional requirements (latency SLA, availability, cost ceiling, data privacy), and the AI-specific constraints that don't appear in traditional system design — hallucination tolerance, context window limits, provider-imposed rate limits, and model selection criteria. You'll practice extracting requirements from an ambiguous problem statement until the design space is well-defined.",
  ),
  stub(
    "architecture-patterns",
    3,
    16,
    "Architecture Patterns",
    "Synchronous API, async worker, RAG pipeline, and agentic loop — the four shapes every AI system takes.",
    ["Architecture", "Patterns", "RAG", "Agentic", "Async"],
    "AI systems cluster into four architecture patterns: synchronous request-response (chatbot, Q&A), async worker (batch summarization, document processing), RAG pipeline (retrieval-augmented generation with a vector store), and agentic loop (autonomous agent with tools and multi-step reasoning). This lesson describes each pattern, lists the systems it fits, shows the component diagram and data flow for each, and gives the decision criteria for choosing between them when a system could fit multiple patterns.",
  ),
  stub(
    "components-and-data-flow",
    4,
    16,
    "Components and Data Flow",
    "Map every component, every data flow, and every synchronous vs. async boundary before writing a line of code.",
    ["Components", "Data flow", "Sequence diagrams", "Async boundaries"],
    "A component diagram shows what exists. A data flow diagram shows what moves between components and when. Together they reveal the synchronous/async boundaries, the points where data is transformed, and the places where failures can cascade. This lesson teaches you to draw both for an AI system, identify the latency-critical path (the chain of synchronous calls that determines response time), and move components off that path — converting synchronous waits into async events wherever the user doesn't need an immediate result.",
  ),
  stub(
    "api-design-for-ai",
    5,
    14,
    "API Design for AI",
    "REST, streaming, and webhook patterns — designing AI API contracts that clients can build on.",
    ["API design", "Streaming", "Webhooks", "REST", "OpenAPI"],
    "An AI API is different from a CRUD API: responses stream, calls take seconds, and the same endpoint might return text, JSON, or a tool-call sequence depending on the model's output. This lesson designs the HTTP contract for a production AI API: request shapes that carry context efficiently, SSE streaming for real-time token delivery, polling vs. webhook patterns for async jobs, versioning that lets you evolve the API without breaking clients, and the OpenAPI spec that auto-generates SDKs and validates inputs.",
  ),
  stub(
    "database-choices",
    6,
    14,
    "Database Choices",
    "PostgreSQL, vector stores, Redis, object storage — what goes where in an AI system and why.",
    ["Database", "pgvector", "Pinecone", "Redis", "PostgreSQL", "S3"],
    "An AI system typically needs four kinds of storage: a relational database for structured data (user accounts, conversation metadata, billing), a vector store for embeddings (pgvector for small-to-medium scale, Pinecone or Qdrant for large scale), a cache for hot data (Redis for exact-match and session state), and object storage for raw files (S3 / GCS for documents, audio, images). This lesson maps each AI system component to the right storage tier, explains the trade-offs (consistency, latency, cost, query capability), and gives the scale thresholds where you'd migrate from one tier to another.",
  ),
  stub(
    "llm-placement",
    7,
    16,
    "LLM Placement",
    "Cloud provider, self-hosted, hybrid — where the model runs determines cost, latency, privacy, and reliability.",
    ["LLM placement", "Cloud", "Self-hosted", "vLLM", "Hybrid"],
    "Where the LLM runs is one of the highest-leverage architectural decisions: it affects cost (cloud is pay-per-token; self-hosted has fixed GPU cost), latency (provider network vs. your datacenter), data privacy (tokens leave your network vs. stay internal), and operational complexity. This lesson builds the decision framework: at what scale does self-hosting break even, how do you architect a hybrid (cloud for burst, self-hosted for baseline), and how do you abstract the LLM placement so you can switch without rewriting application code.",
  ),
  stub(
    "scaling-ai-systems",
    8,
    16,
    "Scaling AI Systems",
    "Horizontal scaling, autoscaling workers, prompt compression, and the cost-latency frontier.",
    ["Scaling", "Autoscaling", "Prompt compression", "Throughput", "Cost"],
    "Scaling an AI system is different from scaling a web app: the bottleneck is usually the LLM call (slow, expensive, rate-limited) rather than compute or database. This lesson covers the scaling levers specific to AI: prompt compression (summarize history to reduce input tokens), semantic caching (reuse responses for similar queries), model tiering (cheap model for simple queries, expensive model for complex ones), worker autoscaling triggered by queue depth, and the cost-latency frontier — the graph that shows how much latency you trade for how much cost reduction.",
  ),
  stub(
    "security-in-system-design",
    9,
    12,
    "Security in System Design",
    "Threat model, authentication, data isolation, and the OWASP LLM Top 10 integrated into architecture.",
    ["Security", "Threat model", "OWASP", "Multi-tenancy", "Data isolation"],
    "Security must be designed in, not bolted on. For AI systems, the threat model includes the standard concerns (authentication, authorization, input validation) plus AI-specific risks (prompt injection via user or retrieved content, data leakage from the LLM's context, excessive agency in agentic systems). This lesson integrates security into the system design framework: threat modeling the architecture, multi-tenant data isolation in the vector store and conversation database, input sanitization at the API boundary, audit logging for every LLM call, and the OWASP LLM Top 10 checklist as a pre-launch gate.",
  ),
  stub(
    "cost-optimization",
    10,
    14,
    "Cost Optimization",
    "Token budgets, model tiering, caching ROI, and the math that turns a $100k/day bill into $20k.",
    ["Cost", "Token budget", "Model tiering", "Caching ROI", "Optimization"],
    "LLM cost optimization is an engineering discipline, not a budgeting exercise. This lesson builds the cost model for an AI system (tokens × price, broken down by model, feature, and user tier), then applies the optimization levers in order of ROI: semantic caching (highest ROI, easiest), prompt compression (high ROI, moderate complexity), model tiering (high ROI, requires routing logic), and batching off-peak (medium ROI, requires async architecture). You'll calculate the expected cost reduction for each lever on a realistic workload and build the case for which to implement first.",
  ),
];
