import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — Serving Your First LLM (fully written as the reference)
// ---------------------------------------------------------------------------
const servingLesson: Lesson = {
  slug: "serving-your-first-llm",
  trackSlug: "ai-infrastructure",
  order: 1,
  minutes: 18,
  title: "Serving Your First LLM",
  subtitle:
    "From a downloaded model to a live HTTP endpoint — using vLLM and FastAPI, the stack that powers most production LLM APIs today.",
  tags: ["vLLM", "FastAPI", "Ollama", "TGI", "Model serving"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "You have a model. Now what?\n\nA model sitting in a file isn't useful to anyone. You need to **serve** it: wrap it in a process that listens for HTTP requests, runs the model, and streams tokens back. That's the job of a model server.\n\nThe tricky part: doing this well — with low latency, high throughput, and efficient GPU use — is a non-trivial engineering problem that has spawned an entire category of software.",
        },
        {
          type: "text",
          content:
            "This lesson covers the landscape of model-serving tools (vLLM, TGI, Ollama, FastAPI) and gets you to a working local server in under 10 minutes.",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "Model serving is the gate between a working model and a working product. A naive server might handle 1 request per second. A well-configured vLLM server might handle 50–200 on the same hardware — by continuously batching, reusing cached attention, and keeping the GPU busy.",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "The gap between a naive serving loop and a production server is often **100× throughput** on the same GPU. Infrastructure is leverage.",
        },
      ],
    },
    {
      step: 3,
      title: "The four tools you need to know",
      blocks: [
        {
          type: "kv",
          items: [
            {
              key: "vLLM",
              value:
                "Open-source inference engine with PagedAttention — the highest-throughput option for GPU servers. OpenAI-compatible API out of the box.",
            },
            {
              key: "TGI (Text Generation Inference)",
              value:
                "Hugging Face's serving solution. Deep HF Hub integration, support for many model families, good for hosted Hugging Face endpoints.",
            },
            {
              key: "Ollama",
              value:
                "One-command local serving on Mac, Linux, or Windows. Great for development. Not optimized for high-throughput multi-user production.",
            },
            {
              key: "FastAPI",
              value:
                "Python web framework. Use it when you need custom logic (auth, routing, preprocessing) around the inference call. Often wraps vLLM or another engine.",
            },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "For local dev: **Ollama**. For GPU production: **vLLM**. For HuggingFace-integrated pipelines: **TGI**. For custom API logic: **FastAPI** wrapping one of the above.",
        },
      ],
    },
    {
      step: 4,
      title: "The anatomy of a model server",
      blocks: [
        {
          type: "diagram",
          label: "Request lifecycle in a model server",
          chart: `flowchart LR
    C[Client] -- HTTP POST /v1/chat/completions --> Q[Request queue]
    Q --> S[Scheduler / continuous batching]
    S --> K[KV cache manager]
    K --> G[GPU kernel]
    G -- token stream --> C
    style Q fill:#eef7ff,stroke:#8ecdff
    style S fill:#d9edff,stroke:#8ecdff
    style K fill:#eef7ff,stroke:#8ecdff`,
        },
        {
          type: "text",
          content:
            "Every production server shares this shape: a queue to hold incoming requests, a scheduler that groups them into batches, a KV cache manager that reuses prior computations, and the GPU kernel that generates tokens. The magic is in the scheduler and cache — that's what separates vLLM from a naive loop.",
        },
      ],
    },
    {
      step: 5,
      title: "Option A: Serve locally with Ollama",
      blocks: [
        {
          type: "text",
          content:
            "Ollama is the fastest path from zero to a running model. One install, one pull, one run.",
        },
        {
          type: "code",
          language: "bash",
          label: "Install and serve a model with Ollama",
          code: `# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Pull a small model (3.8 B params, fits on most machines)
ollama pull phi3

# Start the server (also starts automatically after install)
ollama serve

# In another terminal: send a request
curl http://localhost:11434/api/generate -d '{
  "model": "phi3",
  "prompt": "What is KV caching?",
  "stream": false
}'`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "Ollama also exposes an OpenAI-compatible endpoint at `http://localhost:11434/v1`. Any OpenAI SDK client works against it unchanged — swap the `base_url` and `api_key='ollama'`.",
        },
      ],
    },
    {
      step: 6,
      title: "Option B: Serve with vLLM (GPU required)",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "Install and launch vLLM",
          code: `pip install vllm

# Serve Mistral-7B with an OpenAI-compatible API
python -m vllm.entrypoints.openai.api_server \\
  --model mistralai/Mistral-7B-Instruct-v0.2 \\
  --port 8000 \\
  --dtype auto \\
  --max-model-len 4096`,
        },
        {
          type: "code",
          language: "python",
          label: "Query the vLLM server using the OpenAI SDK",
          code: `from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed",   # vLLM ignores this by default
)

response = client.chat.completions.create(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    messages=[{"role": "user", "content": "Explain KV caching in one paragraph."}],
    max_tokens=256,
)
print(response.choices[0].message.content)`,
        },
      ],
    },
    {
      step: 7,
      title: "Option C: Build a custom endpoint with FastAPI",
      blocks: [
        {
          type: "text",
          content:
            "Sometimes you need logic that a standalone server can't provide: request authentication, preprocessing, multi-model routing, or a non-standard response shape. FastAPI lets you put that logic in front of any inference engine.",
        },
        {
          type: "code",
          language: "python",
          label: "minimal_server.py — FastAPI wrapping vLLM",
          code: `from fastapi import FastAPI
from pydantic import BaseModel
from vllm import LLM, SamplingParams

app = FastAPI()
llm = LLM(model="microsoft/phi-2")   # loads on startup

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 256

@app.post("/generate")
def generate(req: GenerateRequest):
    params = SamplingParams(max_tokens=req.max_tokens, temperature=0.7)
    outputs = llm.generate([req.prompt], params)
    return {"text": outputs[0].outputs[0].text}`,
        },
        {
          type: "code",
          language: "bash",
          label: "Run it",
          code: `uvicorn minimal_server:app --port 8080 --host 0.0.0.0`,
        },
      ],
    },
    {
      step: 8,
      title: "Streaming tokens",
      blocks: [
        {
          type: "text",
          content:
            "Generating 200 tokens takes several seconds. If you wait for the full response before sending anything back, the user stares at a blank screen. **Streaming** sends each token as it's generated — the UI can start rendering immediately.",
        },
        {
          type: "code",
          language: "python",
          label: "Server-sent events with FastAPI + vLLM",
          code: `from fastapi.responses import StreamingResponse
from vllm import AsyncLLMEngine, AsyncEngineArgs, SamplingParams
import asyncio

engine = AsyncLLMEngine.from_engine_args(
    AsyncEngineArgs(model="microsoft/phi-2")
)

@app.post("/stream")
async def stream(req: GenerateRequest):
    params = SamplingParams(max_tokens=req.max_tokens)

    async def token_stream():
        async for output in engine.generate(req.prompt, params, request_id="req-1"):
            token = output.outputs[0].text
            yield f"data: {token}\\n\\n"

    return StreamingResponse(token_stream(), media_type="text/event-stream")`,
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Use AsyncLLMEngine for streaming",
          content:
            "The synchronous `LLM` class blocks the entire event loop while generating. Switch to `AsyncLLMEngine` the moment you need streaming or concurrent requests — otherwise every request queues behind the one in flight.",
        },
      ],
    },
    {
      step: 9,
      title: "Testing your server",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "Quick smoke test",
          code: `import httpx, json

BASE = "http://localhost:8080"

# Non-streaming
r = httpx.post(f"{BASE}/generate", json={"prompt": "Hello", "max_tokens": 50})
assert r.status_code == 200
print(r.json()["text"])

# Streaming (server-sent events)
with httpx.stream("POST", f"{BASE}/stream", json={"prompt": "Count to 5", "max_tokens": 80}) as r:
    for chunk in r.iter_text():
        if chunk.startswith("data:"):
            print(chunk[5:], end="", flush=True)`,
        },
      ],
    },
    {
      step: 10,
      title: "What 'continuous batching' actually means",
      blocks: [
        {
          type: "text",
          content:
            "Static batching waits until a batch of N requests is full, then runs them all. If request #1 takes 200 tokens and request #2 takes 20, the GPU idles after request #2 finishes while waiting for #1.\n\n**Continuous batching** (the key vLLM innovation) inserts new requests into the batch mid-generation, filling that idle capacity. The result: the GPU stays busy, and tail latency drops dramatically.",
        },
        {
          type: "diagram",
          label: "Static vs continuous batching",
          chart: `gantt
    dateFormat X
    axisFormat %s
    section Static batch
    Request A (200 tok)  :0, 200
    Request B (20 tok)   :0, 200
    section Continuous batch
    Request A (200 tok)  :0, 200
    Request B (20 tok)   :0, 20
    Request C (60 tok)   :20, 80
    Request D (40 tok)   :80, 120`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "Continuous batching is why vLLM achieves 20–30× higher throughput than a naive Python loop for multi-user workloads. It's the single most important infrastructure technique for LLM serving.",
        },
      ],
    },
    {
      step: 11,
      title: "Common mistakes and how to fix them",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "OOM on startup",
          content:
            "vLLM pre-allocates GPU memory for KV cache. If the model + cache exceed VRAM, you'll get an OOM before a single request runs. Fix: pass `--gpu-memory-utilization 0.85` (or lower) to leave headroom, or reduce `--max-model-len`.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "High time-to-first-token",
          content:
            "Long prompts with many tokens must be prefilled before the first output token. The prefill phase is compute-bound and can't be parallelized. Fix: keep system prompts short, and use prefix caching (`--enable-prefix-caching`) for repeated preambles.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Serving a model that's too big",
          content:
            "A 70B model requires ~140 GB in fp16. A single A100 80 GB won't hold it. Fix: use quantization (4-bit GPTQ or AWQ reduces it to ~35 GB) or tensor parallelism across two GPUs.",
        },
      ],
    },
    {
      step: 12,
      title: "Quick comparison: which tool when",
      blocks: [
        {
          type: "kv",
          items: [
            {
              key: "Laptop / Mac (CPU or Apple Silicon)",
              value: "Ollama. Handles GGUF quantized models efficiently via llama.cpp under the hood.",
            },
            {
              key: "Single GPU, production, high throughput",
              value: "vLLM with continuous batching enabled (default). OpenAI-compatible endpoint.",
            },
            {
              key: "Multi-GPU or tensor parallelism needed",
              value: "vLLM with `--tensor-parallel-size N`. Or TGI with `--num-shard N`.",
            },
            {
              key: "Hugging Face Hub model, HF Inference Endpoints",
              value: "TGI. Native HF tokenizer and model hub integration.",
            },
            {
              key: "Custom logic (auth, rate limiting, routing)",
              value: "FastAPI + vLLM (or Ollama). Add middleware for whatever the inference engine won't do.",
            },
          ],
        },
      ],
    },
    {
      step: 13,
      title: "Interview questions",
      blocks: [
        {
          type: "list",
          style: "number",
          items: [
            "What is continuous batching and how does it improve GPU utilization compared to static batching? *(Continuous batching inserts new requests mid-generation, keeping the GPU busy rather than waiting for the slowest request in a static batch.)*",
            "What does PagedAttention solve? *(Memory fragmentation in the KV cache — by paging KV entries like virtual memory, vLLM can serve far more concurrent requests before running out of VRAM.)*",
            "When would you choose TGI over vLLM? *(TGI has deeper HuggingFace integration, is the default on HF Inference Endpoints, and supports some model architectures before vLLM does.)*",
          ],
        },
      ],
    },
    {
      step: 14,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You need to serve a 7B model to 50 concurrent users on a single A10G (24 GB VRAM). Which approach is most likely to succeed at reasonable throughput?",
          options: [
            "vLLM with continuous batching and 4-bit GPTQ quantization to fit within VRAM",
            "A plain FastAPI loop that calls model.generate() synchronously for each request",
            "Ollama, since it's the easiest to set up",
            "Static batching with batch size 50 to amortize GPU startup cost",
          ],
          correct: 0,
          explanation:
            "A 7B model in fp16 is ~14 GB, leaving ~10 GB for KV cache on a 24 GB GPU. With quantization it fits more comfortably. vLLM's continuous batching handles 50 concurrent users efficiently. A synchronous FastAPI loop serializes all 50 requests. Ollama is optimized for single-user dev, not high concurrency. Static batching of 50 simultaneously is inflexible and wastes GPU on short requests.",
        },
      ],
    },
    {
      step: 15,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can now serve a model over HTTP. The next lesson, **Model Serving and Streaming**, goes deeper into the internals: how token streaming works at the protocol level, how to implement SSE and WebSocket streaming in production, and how to measure latency metrics (TTFT, TPOT, ITL) that actually matter for user experience.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lessons 2–9 — structured stubs with 6-step skeleton
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
    trackSlug: "ai-infrastructure",
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
              "Set up the infrastructure component locally first, then benchmark it under load. Change one knob at a time (batch size, quantization level, GPU memory fraction) and measure the effect on throughput, latency, and VRAM. Observe before optimizing.",
          },
        ],
      },
      {
        step: 2,
        title: "Visual explanation",
        blocks: [
          {
            type: "diagram",
            label: "Where this component fits in the serving stack",
            chart: `flowchart LR
  Client -- request --> Server[Model Server]
  Server --> C[${title}]
  C --> GPU[GPU / Hardware]
  GPU -- tokens --> Server
  Server -- response --> Client
  style C fill:#d9edff,stroke:#8ecdff`,
          },
        ],
      },
      {
        step: 3,
        title: "Core concepts and commands",
        blocks: [
          {
            type: "callout",
            kind: "math",
            content:
              "Throughput = tokens_generated / wall_clock_seconds. Latency = time_to_first_token + (tokens_generated × time_per_output_token). The goal of every infrastructure optimization is to push throughput up and latency down without increasing hardware cost. **${title}** influences one or both of these.",
          },
          {
            type: "code",
            language: "bash",
            label: "Benchmark baseline before changing anything",
            code: `# Measure your baseline with a simple load test
# then compare after applying the ${title} technique
python -m vllm.entrypoints.openai.api_server --model <your-model> &

# Use locust or a simple loop to measure tokens/s and TTFT`,
          },
        ],
      },
      {
        step: 4,
        title: "Production configuration",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Apply and verify the configuration",
            code: `# Configure ${title} in your serving setup
# Print key metrics before and after to confirm the effect
import time, httpx

def measure_ttft(prompt: str, base_url: str) -> float:
    """Time to first token in seconds."""
    start = time.perf_counter()
    with httpx.stream("POST", f"{base_url}/v1/completions",
                      json={"model": "your-model", "prompt": prompt,
                            "stream": True, "max_tokens": 1}) as r:
        for _ in r.iter_text():
            break
    return time.perf_counter() - start`,
          },
        ],
      },
      {
        step: 5,
        title: "Debugging and operations",
        blocks: [
          {
            type: "list",
            style: "bullet",
            items: [
              "Always measure **before** and **after** a configuration change — assume nothing.",
              "Monitor GPU utilization (`nvidia-smi dmon -s u`) and memory (`nvidia-smi dmon -s m`) in a side terminal.",
              "Check server logs for OOM errors, timeouts, or queuing delays before tuning further.",
              "Load test with realistic concurrency — single-request benchmarks hide batching behavior.",
            ],
          },
          {
            type: "callout",
            kind: "gotcha",
            content:
              "A configuration that improves throughput can hurt tail latency for interactive users. Always check p50, p95, and p99 latencies — not just average throughput.",
          },
        ],
      },
      {
        step: 6,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: `What is the best way to validate that a ${title} change actually improved your serving stack?`,
            options: [
              "Run a load test with realistic concurrency before and after, measuring throughput and p95 latency.",
              "Check only that the server starts without errors.",
              "Rely on the framework's default settings and assume they are optimal.",
              "Measure only average latency on a single request.",
            ],
            correct: 0,
            explanation:
              "A load test under realistic concurrency reveals batching behavior and tail latency — the metrics that actually affect users. Single-request tests and startup checks miss the behavior that matters in production.",
          },
        ],
      },
    ],
  };
}

export const aiInfrastructureLessons: Lesson[] = [
  servingLesson,
  stub(
    "model-serving-and-streaming",
    2,
    16,
    "Model Serving and Streaming",
    "SSE, WebSockets, and the latency metrics that actually predict user satisfaction.",
    ["Streaming", "SSE", "TTFT", "TPOT", "Latency"],
    "Streaming is the difference between a chatbot that feels alive and one that feels broken. This lesson covers the two streaming protocols (SSE and WebSockets), how to implement each with FastAPI and vLLM, and the three metrics — time to first token (TTFT), time per output token (TPOT), and inter-token latency (ITL) — that actually correlate with user satisfaction in production systems.",
  ),
  stub(
    "docker-and-kubernetes",
    3,
    18,
    "Docker and Kubernetes",
    "Containerize a model server and orchestrate it at scale — from a single pod to auto-scaled deployments.",
    ["Docker", "Kubernetes", "Helm", "Autoscaling"],
    "A model server on your laptop is a demo. A model server in a Docker container, deployed via Kubernetes, with resource limits and horizontal pod autoscaling — that's production. This lesson containerizes a vLLM server, writes the Kubernetes manifests for it, and wires up the Horizontal Pod Autoscaler to scale with GPU demand. You'll also see the NVIDIA device plugin that exposes GPUs to Kubernetes pods.",
  ),
  stub(
    "gpu-and-cuda",
    4,
    20,
    "GPU and CUDA",
    "What a GPU actually does, why matrix multiplies map so naturally onto it, and what CUDA exposes to Python.",
    ["GPU", "CUDA", "VRAM", "Tensor cores", "Memory bandwidth"],
    "You're spending $2–8 per GPU-hour. You should understand what you're paying for. This lesson explains how GPU architecture differs from CPU (thousands of simple cores vs. few complex ones), why matrix multiplications and attention computations map perfectly to it, what CUDA is and what PyTorch's CUDA interface exposes, and the two bottlenecks — compute and memory bandwidth — that determine whether your workload is fast or slow.",
  ),
  stub(
    "cloud-platforms",
    5,
    14,
    "Cloud Platforms: AWS, Azure, and GCP",
    "The GPU instance families, managed inference services, and cost levers across the three major clouds.",
    ["AWS", "Azure", "GCP", "EC2", "Vertex AI", "Azure ML"],
    "Each major cloud has its own GPU instance families, managed inference products, and spot/preemptible pricing models. This lesson maps the landscape: AWS (p4/p5 instances, Bedrock, SageMaker), Azure (NC/ND series, Azure ML, Azure OpenAI), GCP (a2/a3 instances, Vertex AI). You'll also learn the cost levers — spot instances, committed use discounts, and right-sizing — that can cut your inference bill by 50–70%.",
  ),
  stub(
    "batching",
    6,
    16,
    "Batching",
    "Static batching, continuous batching, and dynamic batching — the GPU scheduling techniques that determine throughput.",
    ["Batching", "Continuous batching", "Throughput", "GPU utilization"],
    "A GPU processes a batch of requests far more efficiently than it processes them one at a time. But naively waiting to fill a batch adds latency. This lesson covers static batching (simple, high-latency), continuous batching (the vLLM approach — requests join mid-generation), and dynamic batching (Triton Inference Server's method). You'll implement a simple continuous batcher and measure how batch size affects throughput, latency, and GPU utilization.",
  ),
  stub(
    "caching-and-kv-cache",
    7,
    18,
    "Caching and KV Cache",
    "PagedAttention, prefix caching, and semantic caching — reuse computation instead of rerunning it.",
    ["KV cache", "PagedAttention", "Prefix caching", "Semantic cache"],
    "Attention is quadratic in sequence length — running the same system prompt through the model on every request is pure waste. The KV cache stores computed key/value matrices so the model can skip them on subsequent tokens. PagedAttention (vLLM's key innovation) manages this cache like virtual memory, eliminating fragmentation. Prefix caching reuses it across requests. This lesson explains all three, shows how to enable them, and quantifies the throughput and TTFT improvements.",
  ),
  stub(
    "quantization",
    8,
    18,
    "Quantization",
    "GPTQ, AWQ, GGUF, and fp8 — shrink a 70B model to fit on one GPU without losing much quality.",
    ["Quantization", "GPTQ", "AWQ", "GGUF", "fp8", "int4"],
    "A 70B model in fp16 is 140 GB. In 4-bit, it's ~35 GB. Quantization is the technique of reducing the precision of model weights and (sometimes) activations, trading a small quality loss for a large reduction in VRAM and an often surprising improvement in throughput. This lesson covers the main formats (GPTQ, AWQ, GGUF, fp8), when each is appropriate, how to quantize a model with AutoGPTQ or llm-compressor, and how to benchmark the quality-cost tradeoff.",
  ),
  stub(
    "model-and-data-parallelism",
    9,
    20,
    "Model and Data Parallelism",
    "Tensor parallelism, pipeline parallelism, and data parallelism — how to split a model or workload across multiple GPUs.",
    ["Tensor parallelism", "Pipeline parallelism", "Data parallelism", "Multi-GPU"],
    "Some models are too large for a single GPU. Some workloads are too heavy for a single server. Parallelism is the toolkit for both. Tensor parallelism splits a single layer across GPUs (fast, high communication overhead). Pipeline parallelism splits layers across GPUs (good for very deep models). Data parallelism replicates the full model and splits the batch (best for throughput scaling). This lesson explains when to use each, how vLLM and DeepSpeed implement them, and the communication patterns (all-reduce, pipeline bubbles) that determine efficiency.",
  ),
];
