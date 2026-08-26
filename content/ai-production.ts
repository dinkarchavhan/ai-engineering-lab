import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — Production AI Architecture (fully written as the reference)
// ---------------------------------------------------------------------------
const architectureLesson: Lesson = {
  slug: "production-ai-architecture",
  trackSlug: "ai-production",
  order: 1,
  minutes: 20,
  title: "Production AI Architecture",
  subtitle:
    "The blueprint every production AI API is built on — request lifecycle, component roles, and the failure modes that wake you up at 3 a.m.",
  tags: ["Architecture", "Production", "System design", "Reliability"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "A prototype AI feature that works in a notebook is not a production AI feature. Production means: it handles traffic spikes, recovers from failures, costs money you can predict, and doesn't wake the on-call engineer unless something is actually broken.\n\nThe gap between prototype and production is not code quality — it's **architecture**. This lesson maps that gap.",
        },
        {
          type: "text",
          content:
            "We'll walk through the full production AI API blueprint: what components exist, what each one does, and where each category of failure originates.",
        },
      ],
    },
    {
      step: 2,
      title: "Why architecture matters before anything else",
      blocks: [
        {
          type: "callout",
          kind: "insight",
          content:
            "Most production AI outages are not model failures — they're infrastructure failures. The LLM is often the most reliable part of the stack. The queue fills up, the cache runs out of memory, the retry loop creates a thundering herd. Get the architecture right and you spend your time shipping features, not fighting fires.",
        },
      ],
    },
    {
      step: 3,
      title: "The full production blueprint",
      blocks: [
        {
          type: "diagram",
          label: "Production AI API — component map",
          chart: `flowchart TD
    C[Client] --> GW[API Gateway<br/>auth · rate limit · routing]
    GW --> W[Web Server<br/>FastAPI / Express]
    W --> CA[Cache Layer<br/>Redis — semantic + exact]
    CA -- miss --> Q[Task Queue<br/>Celery / BullMQ / SQS]
    Q --> WK[Worker Pool<br/>LLM calls · tools · agents]
    WK --> LLM[LLM Provider<br/>Anthropic / OpenAI / vLLM]
    WK --> DB[(Database<br/>results · history)]
    WK --> OB[Observability<br/>logs · metrics · traces]
    GW --> OB
    style LLM fill:#d9edff,stroke:#8ecdff
    style OB fill:#f6f7f9,stroke:#d3d7e0
    style CA fill:#eef7ff,stroke:#8ecdff`,
        },
        {
          type: "text",
          content:
            "This is the skeleton of every serious production AI API. You may not need every component on day one — but you need to know where each one slots in so you can add it without a rewrite.",
        },
      ],
    },
    {
      step: 4,
      title: "Component roles at a glance",
      blocks: [
        {
          type: "kv",
          items: [
            {
              key: "API Gateway",
              value:
                "First line of defense. Handles TLS termination, authentication, rate limiting per user/tier, request routing. Use AWS API Gateway, Nginx, or Kong.",
            },
            {
              key: "Web Server",
              value:
                "Thin HTTP layer. Validates requests, checks the cache, enqueues tasks, returns results. Should do almost no business logic. FastAPI (Python) or Express (Node) are typical.",
            },
            {
              key: "Cache Layer",
              value:
                "Redis for exact-match cache (same prompt → same response) and semantic cache (similar prompt → reuse prior result). Can cut 30–60% of LLM API spend on repetitive workloads.",
            },
            {
              key: "Task Queue",
              value:
                "Decouples HTTP from LLM latency. Client gets a job ID immediately; worker runs the LLM call async. Celery + Redis, BullMQ + Redis, or SQS + Lambda. Critical for long-running calls.",
            },
            {
              key: "Worker Pool",
              value:
                "The engine room. Workers pull from the queue, call the LLM (with retry/fallback logic), run tool calls, write results to the database, emit traces.",
            },
            {
              key: "Observability Stack",
              value:
                "Logs, metrics, and distributed traces. Prometheus + Grafana for metrics, OpenTelemetry for traces. Without it you're flying blind.",
            },
          ],
        },
      ],
    },
    {
      step: 5,
      title: "The minimal production starting point",
      blocks: [
        {
          type: "text",
          content:
            "You don't ship all of this on day one. Here's the minimum viable production stack and when to add each layer.",
        },
        {
          type: "list",
          style: "number",
          items: [
            "**Day 1 — Sync API with structured errors.** FastAPI endpoint that calls the LLM, handles errors, returns a consistent JSON shape. Add request/response logging immediately.",
            "**Week 1 — Rate limiting and auth.** API keys or JWT. Per-user rate limits. Reject bad requests before they reach the LLM.",
            "**Week 2 — Retry logic and model fallback.** Exponential backoff on 429/500. A fallback model if the primary is down.",
            "**Month 1 — Cache layer.** Exact-match cache for repeated prompts. Semantic cache if your workload has similar (not identical) queries.",
            "**Month 2 — Async queue.** Move long calls (>3 s) to a queue. Return a job ID; let clients poll or use webhooks.",
            "**Month 3 — Full observability.** Structured logs with trace IDs, Prometheus metrics, distributed traces. Dashboards for token spend, latency p95, and error rate.",
          ],
        },
      ],
    },
    {
      step: 6,
      title: "The minimal FastAPI skeleton",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "app.py — production-shaped from the start",
          code: `from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import anthropic, time, uuid, logging

logger = logging.getLogger(__name__)
client = anthropic.Anthropic()
app = FastAPI()

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 1024

class GenerateResponse(BaseModel):
    request_id: str
    text: str
    input_tokens: int
    output_tokens: int
    latency_ms: float

@app.post("/v1/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    request_id = str(uuid.uuid4())
    start = time.monotonic()

    try:
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=req.max_tokens,
            messages=[{"role": "user", "content": req.prompt}],
        )
    except anthropic.RateLimitError as e:
        logger.warning("rate_limit request_id=%s", request_id)
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    except anthropic.APIError as e:
        logger.error("api_error request_id=%s error=%s", request_id, e)
        raise HTTPException(status_code=502, detail="Upstream error")

    latency_ms = (time.monotonic() - start) * 1000
    logger.info(
        "generate request_id=%s input=%d output=%d latency_ms=%.0f",
        request_id,
        response.usage.input_tokens,
        response.usage.output_tokens,
        latency_ms,
    )
    return GenerateResponse(
        request_id=request_id,
        text=response.content[0].text,
        input_tokens=response.usage.input_tokens,
        output_tokens=response.usage.output_tokens,
        latency_ms=latency_ms,
    )`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "Every response includes a `request_id`. This is the single most important production discipline — it links the client's report of 'request X failed' to the log line, the trace, and the database record. Add it on day one.",
        },
      ],
    },
    {
      step: 7,
      title: "Failure mode taxonomy",
      blocks: [
        {
          type: "text",
          content:
            "Production AI systems fail in predictable patterns. Map them before you build so you design the mitigations in, not bolted on.",
        },
        {
          type: "kv",
          items: [
            {
              key: "Provider rate limits (429)",
              value:
                "Tier limits on tokens-per-minute or requests-per-minute. Mitigation: exponential backoff, per-model token budgets, model fallback.",
            },
            {
              key: "Provider outage (5xx)",
              value:
                "The upstream LLM API is unavailable. Mitigation: fallback to a secondary provider or model, circuit breaker to fail fast.",
            },
            {
              key: "Context window overflow",
              value:
                "Prompt + history exceeds the model's max context. Mitigation: sliding window truncation, summarization of older turns.",
            },
            {
              key: "Runaway token spend",
              value:
                "A prompt loop or chatty agent generates 10× the expected tokens. Mitigation: per-request and per-user token budgets, max_tokens enforcement.",
            },
            {
              key: "Queue saturation",
              value:
                "Workers can't keep up; the queue depth grows unbounded. Mitigation: autoscaling, request shedding, per-user queue limits.",
            },
            {
              key: "Cache stampede",
              value:
                "Cache expires for a popular key; thousands of requests hit the LLM simultaneously. Mitigation: probabilistic early expiry, lock-based recompute.",
            },
          ],
        },
      ],
    },
    {
      step: 8,
      title: "The three numbers you must monitor",
      blocks: [
        {
          type: "text",
          content:
            "If you can only instrument three things, instrument these:",
        },
        {
          type: "list",
          style: "number",
          items: [
            "**p95 latency** — the latency your 95th-percentile user experiences. Averages hide pain. If p95 is 8 seconds, 1 in 20 users is suffering.",
            "**Error rate** — the fraction of requests returning 4xx/5xx. Anything above 0.1% warrants investigation. Above 1% is an incident.",
            "**Token spend per request** — your cost is denominated in tokens. A sudden spike in tokens/request means something changed in your prompts or usage patterns.",
          ],
        },
        {
          type: "code",
          language: "python",
          label: "Expose Prometheus metrics",
          code: `from prometheus_client import Counter, Histogram, start_http_server

request_count = Counter("ai_requests_total", "Total requests", ["status"])
token_counter = Counter("ai_tokens_total", "Total tokens", ["type"])
latency_hist = Histogram(
    "ai_request_latency_seconds",
    "Request latency",
    buckets=[0.5, 1, 2, 5, 10, 30],
)

# In your endpoint handler:
request_count.labels(status="success").inc()
token_counter.labels(type="input").inc(response.usage.input_tokens)
token_counter.labels(type="output").inc(response.usage.output_tokens)
latency_hist.observe(latency_ms / 1000)

# Start metrics server on port 9090
start_http_server(9090)`,
        },
      ],
    },
    {
      step: 9,
      title: "Structuring your logs",
      blocks: [
        {
          type: "text",
          content:
            "Unstructured logs are for reading. Structured logs are for querying. In production you need to query: 'show me all requests from user X that returned an error in the last hour'. That requires structured fields.",
        },
        {
          type: "code",
          language: "python",
          label: "Structured JSON logging setup",
          code: `import logging, json, sys

class JsonFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps({
            "ts": self.formatTime(record),
            "level": record.levelname,
            "msg": record.getMessage(),
            **{k: v for k, v in record.__dict__.items()
               if k not in logging.LogRecord.__dict__},
        })

handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(JsonFormatter())
logging.basicConfig(handlers=[handler], level=logging.INFO)

# Usage — every field is queryable in your log aggregator
logger.info("generate",
    extra={"request_id": request_id, "user_id": user_id,
           "model": "claude-sonnet-4-5", "input_tokens": 412,
           "output_tokens": 88, "latency_ms": 1230})`,
        },
      ],
    },
    {
      step: 10,
      title: "Retry and fallback skeleton",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "Retry with exponential backoff and model fallback",
          code: `import time
from anthropic import RateLimitError, APIStatusError

MODELS = ["claude-sonnet-4-5", "claude-haiku-4-5-20251001"]   # primary, fallback

def call_with_retry(messages: list, max_tokens: int = 1024, retries: int = 3):
    for model in MODELS:
        for attempt in range(retries):
            try:
                return client.messages.create(
                    model=model,
                    max_tokens=max_tokens,
                    messages=messages,
                )
            except RateLimitError:
                wait = 2 ** attempt
                logger.warning("rate_limit model=%s attempt=%d wait=%ds",
                               model, attempt, wait)
                time.sleep(wait)
            except APIStatusError as e:
                if e.status_code < 500:
                    raise          # 4xx: caller's fault, don't retry
                logger.error("server_error model=%s status=%d attempt=%d",
                             model, e.status_code, attempt)
                time.sleep(2 ** attempt)
        logger.warning("exhausted_retries model=%s switching_to_fallback", model)
    raise RuntimeError("All models exhausted")`,
        },
      ],
    },
    {
      step: 11,
      title: "Common production mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "No request IDs",
          content:
            "Without a request ID on every log line, tracing a failed request through gateway → web server → worker → LLM provider is impossible. Add it on day one — retrofitting it is painful.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Synchronous LLM calls on web workers",
          content:
            "A 10-second LLM call on a synchronous web worker blocks that worker for 10 seconds. Under load, your server exhausts its worker pool and every request queues. Move long calls to an async queue from the start.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Unbounded token spend",
          content:
            "Never let the LLM decide how many tokens to generate. Always set `max_tokens`. Add a per-user monthly token budget enforced in middleware — you'll thank yourself when a single user's loop generates $500 of tokens overnight.",
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
            "Why should you use an async task queue for LLM calls instead of handling them synchronously in the HTTP request? *(LLM calls can take 10–30 seconds. Holding an HTTP connection open that long exhausts web workers under load. A queue decouples the HTTP response — client gets a job ID immediately — from the LLM call duration.)*",
            "What is a cache stampede and how do you prevent it in an AI API? *(When a cached response expires, many concurrent requests all miss simultaneously and all call the LLM at once — a thundering herd. Prevention: probabilistic early expiry (re-cache slightly before expiry), or a lock that lets only one request recompute while others wait.)*",
            "You deploy a new system prompt and p95 latency spikes from 2 s to 8 s. What do you check first? *(Token counts — the new prompt may be significantly longer, increasing prefill time. Also check if the new prompt is causing the model to generate much longer responses.)*",
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
            "Your AI API is handling 200 requests/minute. The LLM provider has a rate limit of 100,000 tokens/minute. A new feature doubles average prompt length from 500 to 1,000 tokens. What happens and how do you fix it?",
          options: [
            "At 200 req/min × 1,000 tokens = 200,000 tokens/min, you exceed the limit. Fix: add token-budget middleware that queues or rejects requests when projected spend approaches the limit.",
            "Nothing changes — the rate limit is on requests, not tokens.",
            "The LLM automatically shortens responses to stay under the limit.",
            "Double the number of API keys to double the rate limit.",
          ],
          correct: 0,
          explanation:
            "Provider rate limits are usually denominated in tokens-per-minute, not requests-per-minute. Doubling prompt length doubles token spend at the same request rate, potentially exceeding the limit. Token-budget middleware that tracks spend per rolling minute and queues excess requests is the correct fix. Using multiple API keys may violate provider ToS and doesn't solve the underlying token budget problem.",
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
            "You now have the architectural skeleton. The next lesson, **API Design**, digs into the HTTP contract itself: request/response shapes, streaming endpoints, versioning strategy, error codes, and the OpenAPI spec that becomes your team's source of truth.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lessons 2–14 — structured stubs with 6-step skeleton
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
    trackSlug: "ai-production",
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
              "Don't just read — deploy. Run the examples against a real app, measure before and after, and keep a lab notebook of what changed. Production engineering is an empirical discipline: the numbers are the truth, not the theory.",
          },
        ],
      },
      {
        step: 2,
        title: "Where it fits in the stack",
        blocks: [
          {
            type: "diagram",
            label: `${title} in the production AI stack`,
            chart: `flowchart LR
  Client --> GW[API Gateway]
  GW --> W[Web Server]
  W --> C[${title}]
  C --> LLM[LLM Provider]
  C --> OB[Observability]
  style C fill:#d9edff,stroke:#8ecdff`,
          },
        ],
      },
      {
        step: 3,
        title: "Core implementation",
        blocks: [
          {
            type: "callout",
            kind: "insight",
            content:
              "In production, every component must be observable, configurable without a deploy, and fail gracefully when its dependencies are unavailable. Design for failure from the first line.",
          },
          {
            type: "code",
            language: "python",
            label: "Minimal implementation",
            code: `# Implement ${title} and verify it works under load.
# Key steps:
# 1. Add the component to your FastAPI app
# 2. Write a smoke test that confirms the happy path
# 3. Write a failure test that confirms graceful degradation
# 4. Add a Prometheus metric to measure its effect
print("Implementing: ${title}")`,
          },
        ],
      },
      {
        step: 4,
        title: "Configuration and tuning",
        blocks: [
          {
            type: "list",
            style: "number",
            items: [
              "Start with conservative settings and measure — don't guess at optimal values.",
              "Expose configuration via environment variables so you can tune without a redeploy.",
              "Add a health-check endpoint that reports this component's current state.",
              "Set up an alert that fires when this component's key metric goes outside normal bounds.",
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Environment-driven configuration",
            code: `import os

# Never hardcode production settings
config = {
    "enabled": os.getenv("FEATURE_ENABLED", "true").lower() == "true",
    "timeout_seconds": float(os.getenv("FEATURE_TIMEOUT", "30")),
    "max_retries": int(os.getenv("FEATURE_MAX_RETRIES", "3")),
}`,
          },
        ],
      },
      {
        step: 5,
        title: "Observing it in production",
        blocks: [
          {
            type: "list",
            style: "bullet",
            items: [
              "Log every non-trivial decision this component makes, with a request_id and timestamp.",
              "Emit a Prometheus counter for hits, misses, errors, and timeouts — whatever the component can do.",
              "Build a Grafana panel that shows this component's health at a glance.",
              "Set an alert threshold: if the error rate for this component exceeds 1% over 5 minutes, page on-call.",
            ],
          },
          {
            type: "callout",
            kind: "gotcha",
            content:
              "A component with no metrics is a black box. When it fails at 2 a.m., you'll have no data to triage from. Instrument first, optimize second.",
          },
        ],
      },
      {
        step: 6,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: `Which practice most reduces the operational risk of deploying a new ${title} configuration?`,
            options: [
              "Deploy behind a feature flag, gradually roll out to 1% → 10% → 100% of traffic while monitoring p95 latency and error rate.",
              "Deploy to production immediately — you can roll back if it breaks.",
              "Test in a notebook before deploying; production should match.",
              "Ask the team to review the configuration in a PR.",
            ],
            correct: 0,
            explanation:
              "A gradual rollout with live metrics lets you catch regressions before they affect all users. Immediate deployment makes rollback the only recovery path. Notebook testing misses load effects. PR review catches logic errors but not production behavior under real traffic.",
          },
        ],
      },
    ],
  };
}

export const aiProductionLessons: Lesson[] = [
  architectureLesson,
  stub(
    "api-design",
    2,
    16,
    "API Design",
    "Request shapes, error codes, streaming endpoints, and the OpenAPI spec that becomes your contract.",
    ["API design", "OpenAPI", "REST", "Streaming", "Versioning"],
    "A well-designed API is a contract your clients can trust. A poorly designed one is a source of bugs, breaking changes, and support tickets. This lesson covers the HTTP contract for AI APIs: consistent request/response shapes, error codes that distinguish retryable from non-retryable failures, streaming endpoints (SSE vs WebSocket), versioning strategy (URI versioning vs header versioning), and generating an OpenAPI spec that becomes your team's source of truth and auto-generates client SDKs.",
  ),
  stub(
    "async-processing-and-queues",
    3,
    18,
    "Async Processing and Queues",
    "Celery, BullMQ, and SQS — decouple HTTP from LLM latency and handle traffic spikes without dropped requests.",
    ["Async", "Celery", "Redis", "SQS", "Task queue", "Workers"],
    "A synchronous API that calls an LLM is a liability under load — one slow request blocks a worker. Async processing decouples the HTTP response from the LLM call: the client gets a job ID immediately, a worker processes the LLM call in the background, and the result is stored for the client to retrieve. This lesson implements an async AI pipeline with Celery + Redis, shows how to handle job status polling and webhooks, and covers the operational concerns: worker autoscaling, dead-letter queues, and job retries.",
  ),
  stub(
    "caching",
    4,
    16,
    "Caching",
    "Exact-match cache, semantic cache, and prompt caching — cut 30–60% of your LLM API spend on repetitive workloads.",
    ["Caching", "Redis", "Semantic cache", "Prompt caching", "Cost"],
    "LLM API calls are expensive and often redundant — the same question gets asked hundreds of times a day. Caching is the highest-leverage cost lever available. This lesson covers three layers: exact-match caching (identical prompt → cached response, implemented with Redis), semantic caching (similar prompt → reuse prior result, using embedding similarity), and provider-side prompt caching (Anthropic and OpenAI both offer prefix caching that reduces input token costs by 80–90% for shared prefixes). You'll measure the cache hit rate and cost savings on a realistic workload.",
  ),
  stub(
    "observability",
    5,
    18,
    "Observability",
    "Logs, metrics, and traces — the three pillars that let you understand a running AI system.",
    ["Observability", "OpenTelemetry", "Prometheus", "Grafana", "Tracing"],
    "Observability is the property of a system that lets you answer questions about its state from its outputs — without deploying new code. For AI systems, that means structured logs (what happened), Prometheus metrics (how often and how fast), and distributed traces (which component took how long on which request). This lesson implements all three using OpenTelemetry, builds a Grafana dashboard for the three golden signals (latency, traffic, errors), and shows how to correlate a user-reported slow request to its trace, log lines, and token usage.",
  ),
  stub(
    "logging-and-metrics",
    6,
    14,
    "Logging and Metrics",
    "Structured JSON logs, Prometheus counters and histograms, and the alerting rules that page you before users complain.",
    ["Logging", "Metrics", "Prometheus", "Alerting", "JSON logs"],
    "Good logging and metrics are the difference between 'the system is down' and 'the cache miss rate on this endpoint spiked 5 minutes ago, which caused a 10× increase in LLM calls, which hit the rate limit'. This lesson builds a complete logging setup (structured JSON, request IDs, sensitive data masking), a Prometheus metrics layer (counters, histograms, gauges), and alerting rules in Alertmanager that fire on the right signals — not every anomaly, but the ones that indicate real user impact.",
  ),
  stub(
    "distributed-tracing",
    7,
    16,
    "Distributed Tracing",
    "OpenTelemetry traces across API gateway, web server, queue, and LLM call — find the slow span in seconds.",
    ["Tracing", "OpenTelemetry", "Jaeger", "Spans", "Distributed systems"],
    "A production AI system is a distributed system. A single user request touches the API gateway, web server, Redis cache, task queue, worker, and LLM provider. When something is slow, you need to know *which* component added the latency. Distributed tracing records a span for each component and links them into a trace tree. This lesson instruments a FastAPI + Celery + Redis + Anthropic stack with OpenTelemetry, ships traces to Jaeger, and walks through the workflow of tracing a slow request to its root cause.",
  ),
  stub(
    "cost-and-token-monitoring",
    8,
    14,
    "Cost and Token Monitoring",
    "Track token spend per user, per feature, and per model — and build the budget guardrails that prevent $10,000 surprises.",
    ["Cost", "Token monitoring", "Budget", "Spend tracking"],
    "LLM API costs are pay-per-token and can spike unexpectedly. A single runaway loop or a feature with a badly-crafted prompt can generate thousands of dollars of spend overnight. This lesson builds a token monitoring system: per-request token logging, per-user and per-feature aggregation in a time-series database, cost dashboards (daily spend, cost per request, cost per user), and budget guardrails that reject or throttle requests when spend exceeds a threshold — before you get the invoice.",
  ),
  stub(
    "rate-limiting-and-retries",
    9,
    16,
    "Rate Limiting and Retries",
    "Token bucket, sliding window, and exponential backoff — protect your infrastructure and respect provider limits.",
    ["Rate limiting", "Retries", "Backoff", "Token bucket", "429"],
    "Rate limiting has two sides: the limits your provider imposes on you (tokens-per-minute, requests-per-minute), and the limits you impose on your users (prevent abuse, ensure fair access). This lesson implements both: a token-bucket rate limiter in Redis for per-user limits, and an exponential backoff retry strategy for provider 429s. You'll also handle the 'thundering herd' problem — when a rate limit expires and all waiting requests fire simultaneously — with jitter.",
  ),
  stub(
    "circuit-breakers",
    10,
    14,
    "Circuit Breakers",
    "Fail fast when your LLM provider is down — and recover gracefully when it comes back.",
    ["Circuit breaker", "Resilience", "Fallback", "Fault tolerance"],
    "A circuit breaker is a stateful switch that opens (stops sending requests) when an upstream service is failing, and closes again (resumes) after a probe succeeds. Without one, a slow or failing LLM provider causes your web workers to pile up waiting for timeouts, eventually exhausting the thread pool and taking down your entire API. This lesson implements a circuit breaker with three states (closed, open, half-open), integrates it into the FastAPI + Anthropic stack, and measures how it reduces cascading failure compared to naive retries.",
  ),
  stub(
    "model-fallback",
    11,
    14,
    "Model Fallback",
    "Route to a cheaper or different model when the primary is unavailable or too slow.",
    ["Fallback", "Model routing", "Reliability", "Multi-model"],
    "No LLM provider has 100% uptime. A production system that depends on a single model is a single point of failure. Model fallback routes requests to a secondary model when the primary is rate-limited, timing out, or returning errors. This lesson builds a fallback chain (e.g. claude-sonnet → claude-haiku → a self-hosted vLLM instance), implements the routing logic with the circuit breaker from the previous lesson, and measures the quality degradation of falling back to a smaller model on your actual workload.",
  ),
  stub(
    "versioning",
    12,
    12,
    "Versioning",
    "Version your prompts, models, and API contracts so you can roll back anything in under five minutes.",
    ["Versioning", "Prompt versioning", "Rollback", "Deployment"],
    "Changing a prompt is a deployment. If it breaks, you need to roll back — but 'the prompt is in the code' means that rollback is a code deploy, which takes minutes or hours. This lesson implements prompt versioning with a configuration store (database or feature flags), model versioning (track which model version handled each request), and API versioning (URI versioning so you can evolve the contract without breaking existing clients). You'll run a prompt A/B test and roll back the losing variant in under a minute.",
  ),
  stub(
    "ci-cd-for-ai",
    13,
    16,
    "CI/CD for AI",
    "Automated testing, evaluation gates, and deployment pipelines for LLM-powered features.",
    ["CI/CD", "Evaluation", "Testing", "Deployment pipeline", "GitHub Actions"],
    "Traditional CI/CD runs tests and deploys if they pass. AI CI/CD must also run LLM evaluations — automated checks that the model still behaves correctly with the new prompt or configuration. This lesson builds a GitHub Actions pipeline that runs unit tests, integration tests against a mock LLM, and an LLM evaluation suite (using LLM-as-judge) as a deployment gate. A prompt change that degrades quality by more than 5% on the evaluation set blocks the deploy and notifies the author.",
  ),
  stub(
    "testing-ai-systems",
    14,
    18,
    "Testing AI Systems",
    "Unit tests, integration tests, LLM evaluation suites, and load tests — a complete testing strategy for AI features.",
    ["Testing", "LLM evaluation", "Load testing", "Mocking", "Quality gates"],
    "Testing AI systems is harder than testing deterministic software — the same prompt can produce different outputs, and 'correct' is often subjective. This lesson builds a complete testing strategy: unit tests with mocked LLM responses (for testing logic around the model), integration tests against a real LLM (for testing prompt behavior), an LLM-as-judge evaluation suite (for measuring quality at scale), and a load test (for validating the system holds up at production traffic). Each layer catches different failure modes; none of them is sufficient alone.",
  ),
];
