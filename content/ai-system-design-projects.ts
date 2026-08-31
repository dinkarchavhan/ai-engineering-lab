import type { ProjectGuide, Section } from "@/lib/content";

type SystemDesignSpec = {
  slug: string; title: string; description: string; scale: string; constraints: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: SystemDesignSpec): Section[] {
  return [
    { step: 1, title: "Requirements, scale targets, and constraints", blocks: [
      { type: "text", content: p.description },
      { type: "kv", items: [
        { key: "Scale", value: p.scale },
        { key: "Constraints", value: p.constraints },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Requirements drive architecture — not the other way round", content: "Before drawing a single box, write down the top 3 functional requirements, the top 3 non-functional requirements (latency, throughput, availability), and the single hardest constraint. Every architectural decision you make should be traceable back to one of these. A system designed without them will be over-engineered in the wrong places." },
    ] },
    { step: 2, title: "High-level architecture and component breakdown", blocks: [
      { type: "code", language: "text", label: "Requirements worksheet (fill before drawing)", code: "## Functional Requirements\n1. [Core feature 1 — what the system must DO]\n2. [Core feature 2]\n3. [Core feature 3]\n\n## Non-Functional Requirements\n- Latency:      p99 < ___ ms for ___ operation\n- Throughput:   ___ requests/second at peak\n- Availability: ___.__ % uptime (___h downtime/year)\n- Consistency:  strong / eventual — justify your choice\n- Cost budget:  $___/month at target scale\n\n## Out of Scope (v1)\n- [Feature you are explicitly NOT building yet]\n- [Scale you are NOT targeting yet]\n\n## Key Assumptions\n- [Assumption 1 — if this changes, the architecture changes]\n- [Assumption 2]" },
      { type: "diagram", label: "High-level system architecture", chart: "flowchart TD\n  U[Users / Clients] --> LB[Load Balancer]\n  LB --> API[API Layer]\n  API --> Q[Request Queue]\n  Q --> LLM[LLM Service]\n  API --> DB[(Primary DB)]\n  API --> CA[Cache Layer]\n  LLM --> VEC[(Vector DB)]\n  LLM --> OB[Observability]\n  OB --> DS[Dashboards / Alerts]" },
      { type: "callout", kind: "insight", title: "Draw the data flow, not just the service boxes", content: "The most revealing diagram is a data-flow diagram: where does data enter, what transforms it, where is it stored, and what reads it? Services without data flows are just boxes. Add arrows with data types and you will immediately spot the bottlenecks." },
    ] },
    { step: 3, title: "Deep dive: the hardest component", blocks: [
      { type: "code", language: "text", label: "Component deep-dive template", code: "## Component: [Name of the hardest / most interesting component]\n\n### Why it is hard\n[One paragraph on what makes this component the system's critical path]\n\n### Interface\nInput:  [what comes in — data type, rate, size]\nOutput: [what goes out — data type, latency SLA]\n\n### Internal design\n[Sub-components, data structures, algorithms, storage format]\n\n### Failure modes and mitigations\n| Failure              | Impact        | Mitigation                      |\n|----------------------|---------------|---------------------------------|\n| [failure 1]          | [impact]      | [what you do about it]          |\n| [failure 2]          | [impact]      | [mitigation]                    |\n\n### Scaling strategy\n[How does this component scale from 100 → 10,000 → 1,000,000 requests/day?]\n\n### Build vs buy decision\n[Which parts do you build? Which do you use managed services for? Justify each.]" },
      { type: "code", language: "text", label: "API contract skeleton", code: "## Core API Endpoints\n\nPOST /v1/[primary-action]\nRequest:\n  {\n    \"[param1]\": \"string\",\n    \"[param2]\": integer,\n    \"stream\": boolean\n  }\nResponse (200):\n  {\n    \"[result_field]\": \"string\",\n    \"usage\": { \"input_tokens\": int, \"output_tokens\": int },\n    \"latency_ms\": float\n  }\nErrors:\n  400 — invalid input\n  401 — unauthorized\n  429 — rate limit exceeded\n  503 — LLM unavailable (circuit open)\n\nGET /v1/[resource]/{id}\n  [describe the read path]\n\nGET /health   — liveness probe\nGET /metrics  — Prometheus scrape endpoint" },
      { type: "callout", kind: "gotcha", title: "The API contract is a public promise — design it to last", content: "Once clients depend on your API shape, changing it is painful. Version from day one (/v1/), use explicit field names not positional, return errors as structured JSON not plain text, and never change the meaning of an existing field — add a new one instead." },
    ] },
    { step: 4, title: "Scaling, cost estimation, and failure scenarios", blocks: [
      { type: "code", language: "text", label: "Back-of-envelope cost estimate", code: "## Cost Estimation at Target Scale\n\n### Traffic assumptions\n- DAU: ___\n- Requests/user/day: ___\n- Peak QPS: ___ (assume 3× average)\n- Average input tokens/request: ___\n- Average output tokens/request: ___\n\n### LLM cost\n- Input tokens/day:  DAU × req/user × input_tokens = ___\n- Output tokens/day: DAU × req/user × output_tokens = ___\n- Cost @ $___/1M input + $___/1M output = $___/day → $___/month\n\n### Infrastructure cost\n- API servers (2 × 4 vCPU):   $___/month\n- Vector DB (managed):        $___/month\n- Cache (Redis):              $___/month\n- Object storage:             $___/month\n- Observability stack:        $___/month\n\n### Total estimated monthly cost: $___\n### Cost per request: $___" },
      { type: "code", language: "text", label: "Failure scenarios and recovery playbook", code: "## Failure Scenarios\n\n### Scenario 1: Primary LLM API unavailable\nDetection: circuit breaker opens after 5 consecutive 5xx responses\nImpact:     all generation requests fail until fallback activates\nMitigation: route to fallback model (cheaper / local)\nRecovery:   circuit breaker half-opens after 60 s; probe with one request\nRTO: < 30 s  RPO: 0 (stateless generation)\n\n### Scenario 2: Vector DB overloaded\nDetection: p99 query latency > 500 ms alert fires\nImpact:     RAG retrieval degrades; answers use stale context\nMitigation: read replica, query result cache (TTL 5 min), graceful degradation\nRecovery:   scale read replicas horizontally\n\n### Scenario 3: Cache layer (Redis) fails\nDetection: Redis connection errors in logs\nImpact:     cache-miss rate spikes to 100 %; LLM cost increases\nMitigation: fail open — bypass cache, serve from LLM directly\nRecovery:   Redis restarts; cache warms over next 60 min\n\n### Scenario 4: Runaway cost (prompt injection / bug)\nDetection: daily spend alert threshold exceeded\nImpact:     unexpected bill\nMitigation: hard per-request token cap server-side; per-key daily spend limit\nRecovery:   disable affected API key; audit logs to find root cause" },
      { type: "callout", kind: "tip", title: "Estimate cost before you commit to architecture", content: "A design that costs $50 k/month at 100 k DAU is not a viable product. Run the back-of-envelope before the deep dive, not after. If the numbers don't work, change the architecture — add more aggressive caching, use a smaller model for cheap requests, or re-scope the feature." },
    ] },
    { step: 5, title: "Architecture decision records and portfolio write-up", blocks: [
      { type: "code", language: "text", label: "Architecture Decision Record (ADR) template", code: "## ADR-001: [Short decision title]\n\n### Status\nAccepted | Superseded by ADR-XXX\n\n### Context\n[What is the situation that requires a decision? What forces are at play?]\n\n### Decision\n[What have you decided to do?]\n\n### Rationale\n[Why this option over the alternatives? What trade-offs did you accept?]\n\n### Alternatives considered\n| Option       | Pro                  | Con                        |\n|--------------|----------------------|----------------------------|\n| [option A]   | [advantage]          | [disadvantage]             |\n| [option B]   | [advantage]          | [disadvantage]             |\n\n### Consequences\n- Positive: [what gets better]\n- Negative: [what gets harder or costs more]\n- Risks:    [what could go wrong if this decision turns out to be wrong]" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Publish: (1) filled requirements worksheet; (2) high-level architecture diagram; (3) deep-dive on the hardest component; (4) API contract; (5) cost estimate with assumptions; (6) failure scenarios table; (7) at least 2 ADRs. Present it as a system-design document, not a tutorial — write as if you are handing it to an engineering team that will build it." },
    ] },
  ];
}

const specs: SystemDesignSpec[] = [
  {
    slug: "design-chatgpt-like-system",
    title: "Design a ChatGPT-Like System",
    hours: 8,
    description: "Design a conversational AI platform at ChatGPT scale: multi-turn chat, streaming responses, conversation history, user accounts, usage billing, content moderation, and a plugin/tool ecosystem — from a single-server MVP to a globally distributed production system.",
    scale: "MVP: 1 k DAU, 10 QPS. Production: 1 M DAU, 10 k QPS peak. Streaming p99 first-token < 500 ms. 99.9 % availability.",
    constraints: "Stateless LLM calls but stateful conversation history. Context window management for long conversations. Cost scales linearly with tokens — caching and compression are critical.",
    risk: "Content moderation must run before responses reach users. PII in conversation history requires encryption at rest and strict retention policies. Never store API keys or model weights in the conversation DB.",
    extensions: [
      "Design the context compression strategy: how do you keep conversations alive past the model's context window without losing critical history?",
      "Design the plugin/tool execution sandbox: how do you let the LLM call third-party tools without exposing user data or the platform to SSRF?",
      "Design the billing system: how do you track token usage per user, enforce quotas, and prevent bill shock from runaway agents?",
      "Design the content moderation pipeline: pre-moderation, post-moderation, and human review escalation at 10 k QPS",
    ],
  },
  {
    slug: "design-rag-platform",
    title: "Design a RAG Platform",
    hours: 8,
    description: "Design a multi-tenant RAG platform: document ingestion pipelines, chunking and embedding at scale, a vector database with metadata filtering and hybrid search, query routing, reranking, and a retrieval-quality monitoring system.",
    scale: "10 M documents, 100 GB corpus, 1 k QPS query load. Ingestion: 100 k documents/day. Retrieval p99 < 200 ms. Per-tenant data isolation.",
    constraints: "Multi-tenant data isolation — no cross-tenant retrieval leakage. Embedding models change over time — re-embedding 10 M documents must be possible without downtime. Deletions must propagate within minutes.",
    risk: "A misconfigured tenant filter is a data breach. Test isolation with adversarial cross-tenant queries in CI. Document deletion must remove vectors immediately — GDPR right-to-erasure applies.",
    extensions: [
      "Design the re-embedding migration strategy: how do you upgrade embedding models across 10 M documents with zero downtime?",
      "Design the retrieval quality monitoring loop: how do you detect when retrieval is silently degrading without human-labelled queries?",
      "Design the document freshness system: how do you detect when a source document changes and trigger selective re-indexing?",
      "Design the hybrid search ranking: how do you merge BM25 keyword scores with dense vector scores in a way that is tunable per tenant?",
    ],
  },
  {
    slug: "design-ai-customer-support",
    title: "Design an AI Customer Support System",
    hours: 7,
    description: "Design an AI customer support platform: intent classification, KB retrieval, autonomous resolution for common issues, human escalation with full context handoff, CSAT collection, and a quality-review loop that feeds agent improvement.",
    scale: "10 k tickets/day, 500 concurrent sessions. Autonomous resolution target: 60 %. Human escalation SLA: < 2 min handoff. 99.5 % availability.",
    constraints: "Account actions (refunds, cancellations) require human approval. PII in tickets must be masked before LLM calls. Escalation must preserve full conversation context. Compliance audit log required.",
    risk: "A hallucinated refund confirmation is a real financial liability. All account-modifying actions must go through a human approval queue. Log every autonomous decision with the evidence that justified it.",
    extensions: [
      "Design the intent routing system: how do you route tickets to the right specialist agent (billing, technical, returns) at sub-50 ms latency?",
      "Design the CSAT feedback loop: how do you use resolution ratings to identify which KB articles need updating and which agent prompts are underperforming?",
      "Design the escalation handoff: what context do you pack for the human agent, and how do you ensure they can reconstruct the full conversation without reading every message?",
      "Design the compliance audit trail: what do you log, how do you protect it from tampering, and how do you query it during a dispute?",
    ],
  },
  {
    slug: "design-ai-coding-assistant",
    title: "Design an AI Coding Assistant",
    hours: 8,
    description: "Design a GitHub Copilot-style coding assistant: IDE integration, real-time code completion, codebase-aware context retrieval, multi-file editing, test generation, code review, and a safe code execution sandbox.",
    scale: "50 k DAU developers, 100 k completions/day. Completion latency p99 < 800 ms. Codebase index: up to 500 k files per org. 99.9 % availability during business hours.",
    constraints: "Proprietary code must never leave the org boundary without encryption. Context window limits force smart retrieval — the full codebase cannot fit in one prompt. IDE plugin must work offline for completions when the API is unavailable.",
    risk: "Generated code that introduces security vulnerabilities (SQL injection, hardcoded secrets, path traversal) reaches production if not caught. Run a static-analysis pass on all generated code before surfacing it. Never index .env files or secrets.",
    extensions: [
      "Design the codebase indexing pipeline: how do you keep a 500 k file index fresh as developers push commits throughout the day?",
      "Design the context retrieval strategy: given an open file and cursor position, which other files, symbols, and docs are most relevant?",
      "Design the code execution sandbox: how do you let the assistant run generated tests safely without access to production data or the internet?",
      "Design the secret-detection layer: how do you prevent the assistant from generating or suggesting code that contains hardcoded credentials?",
    ],
  },
  {
    slug: "design-enterprise-ai-platform",
    title: "Design an Enterprise AI Platform",
    hours: 10,
    description: "Design a full enterprise AI platform: a unified LLM gateway with model routing and cost controls, a RAG layer with per-department data isolation, an agent orchestration engine, SSO and RBAC, audit logging for compliance, and a self-service portal for non-technical teams to build AI workflows.",
    scale: "5 k internal users, 20 departments, 50 k LLM calls/day. Multi-model routing across 3+ providers. 99.9 % availability. SOC 2 Type II compliance required.",
    constraints: "Data sovereignty: some departments require models deployed on-premises. Cost chargeback: each department's LLM spend must be tracked and reported separately. Zero-trust security model across all components.",
    risk: "A misconfigured RBAC rule can expose HR or finance data to unauthorized employees. Audit logs must be tamper-evident and retained for 7 years for compliance. Model outputs must be logged for hallucination review on request.",
    extensions: [
      "Design the model routing engine: how do you select the cheapest model capable of handling each request based on complexity, department policy, and cost budget?",
      "Design the self-service workflow builder: how do non-technical users compose agents, RAG pipelines, and approval flows without writing code?",
      "Design the cross-department data isolation: how do you ensure the HR RAG index is never retrievable from a Sales agent query?",
      "Design the compliance reporting system: how do you produce an auditable record of every LLM call, tool invocation, and data access for a SOC 2 audit?",
    ],
  },
];

export const aiSystemDesignProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "ai-system-design",
  title: p.title,
  description: p.description,
  techStack: ["System Design", "Architecture Diagrams", "ADRs", "Back-of-envelope estimation", "API Design"],
  difficulty: p.slug === "design-enterprise-ai-platform" ? "advanced" : "intermediate",
  estimatedHours: p.hours,
  sections: sections(p),
}));
