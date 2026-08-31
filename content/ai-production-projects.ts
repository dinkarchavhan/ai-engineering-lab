import type { ProjectGuide, Section } from "@/lib/content";

type AiProductionSpec = {
  slug: string; title: string; description: string; stack: string; pipeline: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: AiProductionSpec): Section[] {
  return [
    { step: 1, title: "Architecture, reliability requirements, and observability plan", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "Production AI API architecture", chart: "flowchart LR\n  C[Client] --> G[FastAPI gateway]\n  G --> CA[Response cache\\n Redis]\n  CA -->|cache miss| RL[Rate limiter]\n  RL --> RT[Retry + backoff]\n  RT --> P[Primary LLM]\n  RT -->|primary down| FB[Fallback LLM]\n  P & FB --> OB[Observability\\n tokens / cost / latency]\n  OB --> PG[Prometheus + Grafana]\n  G --> Q[Async task queue\\n long jobs]\n  Q --> W[Background worker]" },
      { type: "kv", items: [
        { key: "Stack", value: p.stack },
        { key: "Pipeline", value: p.pipeline },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Define SLOs before writing any code", content: "Without target SLOs you cannot know whether your system is production-ready. Define them upfront: p99 latency < 5 s, error rate < 0.5 %, token cost < $X per 1 k requests. Every architectural decision — cache TTL, retry budget, fallback threshold — follows from these numbers." },
    ] },
    { step: 2, title: "Async API with caching and token tracking", blocks: [
      { type: "code", language: "bash", label: "Install production dependencies", code: "python -m pip install anthropic openai fastapi uvicorn redis pydantic prometheus-client structlog tenacity tiktoken rich" },
      { type: "code", language: "python", label: "Response cache and token cost tracker", code: "import hashlib, json, time\nfrom redis import Redis\nfrom pydantic import BaseModel\n\nredis = Redis(host='localhost', port=6379, decode_responses=True)\nCACHE_TTL = 3600   # seconds\n\n# Approximate token costs (update to current pricing)\nCOST_PER_1K: dict[str, dict[str, float]] = {\n    'claude-sonnet-4-6':    {'input': 0.003,  'output': 0.015},\n    'claude-haiku-4-5-20251001': {'input': 0.00025, 'output': 0.00125},\n    'gpt-4o':               {'input': 0.005,  'output': 0.015},\n    'gpt-4o-mini':          {'input': 0.00015,'output': 0.0006},\n}\n\nclass UsageRecord(BaseModel):\n    model: str\n    input_tokens: int\n    output_tokens: int\n    latency_ms: float\n    cached: bool\n    cost_usd: float\n\ndef compute_cost(model: str, input_tokens: int, output_tokens: int) -> float:\n    rates = COST_PER_1K.get(model, {'input': 0.003, 'output': 0.015})\n    return (input_tokens * rates['input'] + output_tokens * rates['output']) / 1000\n\ndef cache_key(model: str, messages: list[dict]) -> str:\n    payload = json.dumps({'model': model, 'messages': messages}, sort_keys=True)\n    return f'llm:cache:{hashlib.sha256(payload.encode()).hexdigest()}'\n\ndef get_cached(key: str) -> str | None:\n    return redis.get(key)\n\ndef set_cached(key: str, value: str) -> None:\n    redis.setex(key, CACHE_TTL, value)" },
      { type: "callout", kind: "insight", title: "Cache identical prompts — even a 10 % hit rate saves meaningful cost", content: "Many production workloads repeat the same prompts: FAQ answers, template fills, classification tasks. A Redis cache with a 1-hour TTL costs almost nothing and can eliminate 10–30 % of LLM calls in real apps. Hash the full (model, messages) payload as the cache key." },
    ] },
    { step: 3, title: "Retry logic, circuit breaker, and model fallback", blocks: [
      { type: "code", language: "python", label: "Tenacity retry with exponential backoff", code: "import anthropic, openai\nfrom tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type\nimport structlog\n\nlog = structlog.get_logger()\n\nRETRYABLE = (anthropic.RateLimitError, anthropic.InternalServerError,\n             openai.RateLimitError, openai.APIConnectionError)\n\n@retry(\n    retry=retry_if_exception_type(RETRYABLE),\n    stop=stop_after_attempt(3),\n    wait=wait_exponential(multiplier=1, min=1, max=30),\n    reraise=True,\n)\ndef call_primary(model: str, messages: list[dict], max_tokens: int = 512) -> tuple[str, int, int]:\n    client = anthropic.Anthropic()\n    r = client.messages.create(model=model, max_tokens=max_tokens, messages=messages)\n    return r.content[0].text, r.usage.input_tokens, r.usage.output_tokens" },
      { type: "code", language: "python", label: "Circuit breaker and model fallback", code: "from dataclasses import dataclass, field\nfrom threading import Lock\n\n@dataclass\nclass CircuitBreaker:\n    failure_threshold: int = 5\n    recovery_timeout: float = 60.0\n    _failures: int = 0\n    _opened_at: float = 0.0\n    _lock: Lock = field(default_factory=Lock)\n\n    def is_open(self) -> bool:\n        with self._lock:\n            if self._failures >= self.failure_threshold:\n                if time.time() - self._opened_at > self.recovery_timeout:\n                    self._failures = 0   # half-open: allow one probe\n                    return False\n                return True\n            return False\n\n    def record_failure(self) -> None:\n        with self._lock:\n            self._failures += 1\n            self._opened_at = time.time()\n\n    def record_success(self) -> None:\n        with self._lock:\n            self._failures = 0\n\nprimary_cb = CircuitBreaker()\n\ndef call_with_fallback(messages: list[dict], max_tokens: int = 512) -> tuple[str, str, int, int]:\n    primary = 'claude-sonnet-4-6'\n    fallback = 'claude-haiku-4-5-20251001'\n    if not primary_cb.is_open():\n        try:\n            text, inp, out = call_primary(primary, messages, max_tokens)\n            primary_cb.record_success()\n            return text, primary, inp, out\n        except Exception as e:\n            primary_cb.record_failure()\n            log.warning('primary_failed_falling_back', error=str(e))\n    # Fallback path\n    text, inp, out = call_primary(fallback, messages, max_tokens)\n    return text, fallback, inp, out" },
      { type: "callout", kind: "gotcha", title: "A circuit breaker that never closes is just an outage", content: "Set a recovery_timeout and implement the half-open probe. Without it the breaker stays open indefinitely after the primary recovers — your users stay on the fallback model until you restart the process. Test the recovery path explicitly in your load test." },
    ] },
    { step: 4, title: "Structured logging, metrics, and Grafana dashboard", blocks: [
      { type: "code", language: "python", label: "Structured logging and Prometheus metrics", code: "import structlog\nfrom prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST\nfrom fastapi import FastAPI, Request, Response\nfrom pydantic import BaseModel\nimport asyncio, time\n\nstructlog.configure(processors=[\n    structlog.processors.TimeStamper(fmt='iso'),\n    structlog.processors.add_log_level,\n    structlog.processors.JSONRenderer(),\n])\nlog = structlog.get_logger()\n\nREQ_COUNT    = Counter('ai_requests_total', 'Requests', ['model', 'cached', 'status'])\nREQ_LATENCY  = Histogram('ai_request_latency_seconds', 'Latency', ['model'], buckets=[.1,.5,1,2,5,10,30])\nTOKEN_IN     = Counter('ai_input_tokens_total', 'Input tokens', ['model'])\nTOKEN_OUT    = Counter('ai_output_tokens_total', 'Output tokens', ['model'])\nCOST_TOTAL   = Counter('ai_cost_usd_total', 'Cost USD', ['model'])\nCB_STATE     = Gauge('ai_circuit_breaker_failures', 'Circuit breaker failure count')\n\napp = FastAPI(title='Production AI API')\n\nclass ChatRequest(BaseModel):\n    prompt: str\n    max_tokens: int = 512\n\n@app.post('/v1/chat')\nasync def chat(req: ChatRequest):\n    messages = [{'role': 'user', 'content': req.prompt}]\n    key = cache_key('claude-sonnet-4-6', messages)\n    start = time.perf_counter()\n\n    cached = get_cached(key)\n    if cached:\n        REQ_COUNT.labels(model='cached', cached='true', status='200').inc()\n        return {'reply': cached, 'cached': True}\n\n    try:\n        text, model, inp, out = call_with_fallback(messages, req.max_tokens)\n        set_cached(key, text)\n        latency = time.perf_counter() - start\n        cost = compute_cost(model, inp, out)\n        TOKEN_IN.labels(model=model).inc(inp)\n        TOKEN_OUT.labels(model=model).inc(out)\n        COST_TOTAL.labels(model=model).inc(cost)\n        REQ_LATENCY.labels(model=model).observe(latency)\n        REQ_COUNT.labels(model=model, cached='false', status='200').inc()\n        CB_STATE.set(primary_cb._failures)\n        log.info('chat_complete', model=model, latency_ms=round(latency*1000), cost_usd=round(cost,6))\n        return {'reply': text, 'model': model, 'cached': False, 'cost_usd': cost}\n    except Exception as e:\n        REQ_COUNT.labels(model='unknown', cached='false', status='500').inc()\n        log.error('chat_failed', error=str(e))\n        raise\n\n@app.get('/metrics')\ndef metrics():\n    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)" },
      { type: "callout", kind: "tip", title: "Log cost per request from day one", content: "Token costs compound fast at scale. A single misconfigured prompt that runs 10 k times a day can cost thousands of dollars a month. Emit cost_usd on every request log line, set up a Grafana alert on daily spend, and review the top-cost endpoints weekly." },
    ] },
    { step: 5, title: "Version prompts, run CI/CD, and load test", blocks: [
      { type: "code", language: "python", label: "Prompt versioning and regression test", code: "import json\nfrom pathlib import Path\nfrom dataclasses import dataclass\n\n# Store prompts as versioned JSON — never hardcode them in application logic\nPROMPT_DIR = Path('prompts')\n\ndef load_prompt(name: str, version: str = 'latest') -> dict:\n    path = PROMPT_DIR / name / f'{version}.json'\n    if version == 'latest':\n        versions = sorted(PROMPT_DIR.joinpath(name).glob('*.json'))\n        path = versions[-1] if versions else None\n    if not path or not path.exists():\n        raise FileNotFoundError(f'Prompt {name}/{version} not found')\n    return json.loads(path.read_text())\n\n@dataclass\nclass PromptEvalCase:\n    input: str\n    expected_keywords: list[str]\n    must_not_contain: list[str] = None\n\ndef regression_test(prompt_name: str, cases: list[PromptEvalCase]) -> dict:\n    prompt = load_prompt(prompt_name)\n    passed = 0\n    for case in cases:\n        messages = [{'role': 'user', 'content': prompt['template'].format(input=case.input)}]\n        text, model, _, _ = call_with_fallback(messages, max_tokens=256)\n        kw_ok = all(k.lower() in text.lower() for k in case.expected_keywords)\n        neg_ok = all(k.lower() not in text.lower() for k in (case.must_not_contain or []))\n        if kw_ok and neg_ok:\n            passed += 1\n    return {'pass_rate': passed / len(cases), 'n': len(cases), 'prompt': prompt_name}" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Publish your architecture diagram, docker-compose file, a Grafana dashboard screenshot showing real traffic, load-test results (p50/p95/p99 at multiple concurrency levels), a cost-per-request table for primary vs fallback model, and at least one prompt regression test result showing a before/after diff." },
    ] },
  ];
}

const specs: AiProductionSpec[] = [
  {
    slug: "production-ai-api",
    title: "Production-Grade AI API with Dashboards, Retries, and Fallback",
    hours: 14,
    description: "Build a production-ready AI API service with: Redis response caching, structured logging, Prometheus metrics, Grafana dashboards, exponential-backoff retries, a circuit breaker, model fallback (primary → cheaper model on failure), async task queuing for long jobs, prompt versioning, and a CI regression test — all wired into a FastAPI service with a docker-compose deployment.",
    stack: "FastAPI, Redis, Prometheus, Grafana, Anthropic SDK, Tenacity (retries), Structlog, Docker Compose. Fallback model: claude-haiku-4-5-20251001.",
    pipeline: "Client → FastAPI → Redis cache check → rate limiter → retry + circuit breaker → primary LLM → fallback LLM on failure → structured log + Prometheus metrics → Grafana dashboard.",
    risk: "Never log full prompt content if it may contain PII — log a hash or truncated preview. Store API keys in environment variables only. Set a max_tokens hard cap to prevent runaway cost from a single request.",
    extensions: [
      "Add an async task queue with Celery + Redis: offload long-running generations to background workers and poll for results",
      "Implement prompt A/B testing: route 10 % of traffic to a new prompt version and compare quality scores automatically",
      "Add a daily cost report: aggregate Prometheus token counters and email a spend summary at midnight",
      "Build a model-router that selects the cheapest model capable of handling the request based on prompt complexity score",
      "Add distributed tracing with OpenTelemetry so every LLM call, cache hit, and retry appears as a span in Jaeger or Tempo",
    ],
  },
];

export const aiProductionProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "ai-production",
  title: p.title,
  description: p.description,
  techStack: ["Python", "FastAPI", "Redis", "Prometheus", "Grafana", "Anthropic SDK", "Tenacity", "Structlog", "Docker"],
  difficulty: "advanced",
  estimatedHours: p.hours,
  sections: sections(p),
}));
