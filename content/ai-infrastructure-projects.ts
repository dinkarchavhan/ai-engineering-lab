import type { ProjectGuide, Section } from "@/lib/content";

type AiInfraSpec = {
  slug: string; title: string; description: string; stack: string; pipeline: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: AiInfraSpec): Section[] {
  return [
    { step: 1, title: "Architecture, stack, and production requirements", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "Production LLM serving architecture", chart: "flowchart LR\n  C[Client] -->|HTTP / SSE| G[API Gateway\\n rate limit + auth]\n  G --> Q[Request queue]\n  Q --> B[Dynamic batcher]\n  B --> W[vLLM / TGI workers]\n  W --> KV[KV cache]\n  W -->|stream tokens| G\n  G -->|stream| C\n  W --> M[Metrics: latency\\n throughput / GPU util]\n  M --> D[Grafana dashboard]\n  AS[Autoscaler] -->|scale workers| W" },
      { type: "kv", items: [
        { key: "Stack", value: p.stack },
        { key: "Pipeline", value: p.pipeline },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Measure before you optimize", content: "GPU memory, KV cache size, batch size, and quantization precision all interact. Benchmark a baseline first — single request latency, throughput at 10/50/100 concurrent users — before changing any knob. Optimizing without a baseline produces unmeasurable improvements." },
    ] },
    { step: 2, title: "Serve a model with vLLM and streaming", blocks: [
      { type: "code", language: "bash", label: "Install and launch a vLLM server", code: "# Install vLLM (requires CUDA-compatible GPU)\npip install vllm\n\n# Launch an OpenAI-compatible server with continuous batching\npython -m vllm.entrypoints.openai.api_server \\\n  --model mistralai/Mistral-7B-Instruct-v0.3 \\\n  --dtype float16 \\\n  --max-model-len 4096 \\\n  --gpu-memory-utilization 0.90 \\\n  --enable-chunked-prefill \\\n  --port 8000\n\n# For CPU-only dev, use Ollama instead:\n# ollama serve && ollama pull mistral" },
      { type: "code", language: "python", label: "Streaming client with token-by-token output", code: "import httpx\nimport json\n\ndef stream_completion(prompt: str, base_url: str = 'http://localhost:8000') -> None:\n    payload = {\n        'model': 'mistralai/Mistral-7B-Instruct-v0.3',\n        'messages': [{'role': 'user', 'content': prompt}],\n        'stream': True,\n        'max_tokens': 512,\n        'temperature': 0.7,\n    }\n    with httpx.stream('POST', f'{base_url}/v1/chat/completions',\n                      json=payload, timeout=60) as resp:\n        for line in resp.iter_lines():\n            if not line or line == 'data: [DONE]':\n                continue\n            if line.startswith('data: '):\n                chunk = json.loads(line[6:])\n                delta = chunk['choices'][0]['delta'].get('content', '')\n                print(delta, end='', flush=True)\n    print()\n\nstream_completion('Explain KV caching in one paragraph.')" },
      { type: "callout", kind: "insight", title: "Continuous batching is why vLLM is fast", content: "Traditional batching waits for a full batch before starting. Continuous batching inserts new requests into the running batch as soon as a slot frees up — cutting average latency by 2–5x at real concurrency. It is on by default in vLLM; never disable it without a measured reason." },
    ] },
    { step: 3, title: "Wrap in FastAPI with auth, rate limiting, and request queuing", blocks: [
      { type: "code", language: "python", label: "FastAPI gateway with auth and rate limiting", code: "from fastapi import FastAPI, HTTPException, Depends, Request\nfrom fastapi.responses import StreamingResponse\nfrom pydantic import BaseModel\nimport asyncio, time, httpx, os\nfrom collections import defaultdict\n\napp = FastAPI(title='LLM API Gateway')\nVLLM_URL = os.getenv('VLLM_URL', 'http://localhost:8000')\nAPI_KEYS = set(os.getenv('API_KEYS', 'dev-key').split(','))\n\n# Simple in-memory rate limiter — use Redis in production\n_rate: dict[str, list[float]] = defaultdict(list)\nRATE_LIMIT = 20   # requests per minute\n\ndef check_auth(request: Request) -> str:\n    key = request.headers.get('X-API-Key', '')\n    if key not in API_KEYS:\n        raise HTTPException(status_code=401, detail='Invalid API key')\n    return key\n\ndef check_rate(key: str = Depends(check_auth)) -> str:\n    now = time.time()\n    _rate[key] = [t for t in _rate[key] if now - t < 60]\n    if len(_rate[key]) >= RATE_LIMIT:\n        raise HTTPException(status_code=429, detail='Rate limit exceeded')\n    _rate[key].append(now)\n    return key\n\nclass ChatRequest(BaseModel):\n    prompt: str\n    max_tokens: int = 512\n    stream: bool = True\n\n@app.post('/v1/chat')\nasync def chat(req: ChatRequest, key: str = Depends(check_rate)):\n    payload = {\n        'model': 'mistralai/Mistral-7B-Instruct-v0.3',\n        'messages': [{'role': 'user', 'content': req.prompt}],\n        'max_tokens': req.max_tokens,\n        'stream': req.stream,\n    }\n    async def generate():\n        async with httpx.AsyncClient(timeout=120) as client:\n            async with client.stream('POST', f'{VLLM_URL}/v1/chat/completions', json=payload) as r:\n                async for chunk in r.aiter_text():\n                    yield chunk\n    if req.stream:\n        return StreamingResponse(generate(), media_type='text/event-stream')\n    async with httpx.AsyncClient(timeout=120) as client:\n        r = await client.post(f'{VLLM_URL}/v1/chat/completions', json={**payload, 'stream': False})\n        return r.json()" },
      { type: "callout", kind: "gotcha", title: "In-memory rate limiting does not work across replicas", content: "A dict-based rate limiter resets on every process restart and is blind to sibling replicas. For production, move the rate-limit counter to Redis with an atomic INCR + EXPIRE pattern so all gateway instances share one consistent limit." },
    ] },
    { step: 4, title: "Containerize with Docker and add observability", blocks: [
      { type: "code", language: "bash", label: "Dockerfile for the gateway", code: "# Dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 9000\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"9000\", \"--workers\", \"2\"]" },
      { type: "code", language: "yaml", label: "docker-compose with vLLM, gateway, and Prometheus", code: "# docker-compose.yml\nversion: '3.9'\nservices:\n  vllm:\n    image: vllm/vllm-openai:latest\n    runtime: nvidia\n    environment:\n      - NVIDIA_VISIBLE_DEVICES=all\n    command: --model mistralai/Mistral-7B-Instruct-v0.3 --port 8000\n    ports: ['8000:8000']\n\n  gateway:\n    build: .\n    ports: ['9000:9000']\n    environment:\n      - VLLM_URL=http://vllm:8000\n      - API_KEYS=prod-key-1,prod-key-2\n    depends_on: [vllm]\n\n  prometheus:\n    image: prom/prometheus\n    volumes: ['./prometheus.yml:/etc/prometheus/prometheus.yml']\n    ports: ['9090:9090']\n\n  grafana:\n    image: grafana/grafana\n    ports: ['3001:3000']\n    depends_on: [prometheus]" },
      { type: "code", language: "python", label: "Prometheus metrics middleware", code: "from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST\nfrom fastapi import Response\nimport time\n\nREQ_COUNT  = Counter('llm_requests_total', 'Total requests', ['status'])\nREQ_LAT    = Histogram('llm_request_latency_seconds', 'Request latency', buckets=[.1,.25,.5,1,2,5,10,30])\nTOKEN_COUNT = Counter('llm_tokens_total', 'Tokens generated')\n\n@app.middleware('http')\nasync def metrics_middleware(request: Request, call_next):\n    start = time.time()\n    response = await call_next(request)\n    REQ_LAT.observe(time.time() - start)\n    REQ_COUNT.labels(status=response.status_code).inc()\n    return response\n\n@app.get('/metrics')\ndef metrics():\n    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)" },
      { type: "callout", kind: "tip", title: "Track p50, p95, and p99 latency — not just averages", content: "Average latency hides tail latency problems. A p99 of 30 s means 1 in 100 users waits half a minute. Use Histogram buckets at .1, .25, .5, 1, 2, 5, 10, 30 seconds and alert on p95 > 5 s before users complain." },
    ] },
    { step: 5, title: "Load test, quantize, and optimize throughput", blocks: [
      { type: "code", language: "python", label: "Async load test with concurrency ramp", code: "import asyncio, httpx, time, statistics\n\nasync def single_request(client: httpx.AsyncClient, url: str, key: str) -> float:\n    start = time.perf_counter()\n    async with client.stream('POST', url,\n        headers={'X-API-Key': key},\n        json={'prompt': 'Explain gradient descent in two sentences.', 'max_tokens': 100},\n        timeout=60,\n    ) as r:\n        async for _ in r.aiter_text():\n            pass\n    return time.perf_counter() - start\n\nasync def load_test(url: str, key: str, concurrency: int, n: int = 50):\n    async with httpx.AsyncClient() as client:\n        latencies = await asyncio.gather(*[\n            single_request(client, url, key) for _ in range(n)\n        ])\n    latencies = sorted(latencies)\n    print(f'Concurrency={concurrency}  n={n}')\n    print(f'  p50={statistics.median(latencies):.2f}s  p95={latencies[int(.95*n)]:.2f}s  p99={latencies[int(.99*n)]:.2f}s')\n    print(f'  throughput={n/sum(latencies)*concurrency:.1f} req/s')\n\nfor c in [1, 5, 10, 20]:\n    asyncio.run(load_test('http://localhost:9000/v1/chat', 'dev-key', c))" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Publish your architecture diagram, Dockerfile and docker-compose, a Grafana dashboard screenshot, load-test results (p50/p95/p99 at 1/5/10/20 concurrency), and before/after throughput numbers from at least one optimization (quantization, batch size, or KV cache tuning)." },
    ] },
  ];
}

const specs: AiInfraSpec[] = [
  {
    slug: "llm-api-production",
    title: "Deploy an LLM API with Autoscaling, Batching, and Streaming",
    hours: 14,
    description: "Build and deploy a production-grade LLM inference service: vLLM for continuous batching and KV caching, a FastAPI gateway for auth and rate limiting, Prometheus and Grafana for observability, Docker Compose for local orchestration, and a load-test harness to measure p50/p95/p99 latency and throughput at real concurrency.",
    stack: "vLLM (inference), FastAPI (gateway), Docker Compose (orchestration), Prometheus + Grafana (observability). GPU optional — Ollama for CPU fallback.",
    pipeline: "Client → FastAPI gateway (auth + rate limit) → request queue → vLLM continuous batcher → GPU workers → streaming SSE response → Prometheus metrics → Grafana dashboard.",
    risk: "Never expose the vLLM server directly to the internet — always proxy through the gateway. Rotate API keys regularly. Set a max_tokens hard cap server-side so a single request cannot monopolize GPU memory.",
    extensions: [
      "Add INT4 quantization with AWQ or GPTQ and benchmark the throughput gain versus quality loss",
      "Implement a Redis-backed request queue with priority lanes for paid vs free tier users",
      "Add Kubernetes HPA autoscaling: scale vLLM worker replicas based on GPU utilization or queue depth",
      "Implement model fallback: route to a cheaper smaller model when the primary model's queue exceeds a latency threshold",
      "Add request-level cost tracking: count input and output tokens per API key and expose a /usage endpoint",
    ],
  },
];

export const aiInfrastructureProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "ai-infrastructure",
  title: p.title,
  description: p.description,
  techStack: ["Python", "vLLM", "FastAPI", "Docker", "Prometheus", "Grafana", "httpx", "Pydantic"],
  difficulty: "advanced",
  estimatedHours: p.hours,
  sections: sections(p),
}));
