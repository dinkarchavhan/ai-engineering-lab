import type { SystemDesignProblem } from '@/lib/interview'

export const systemDesignProblems: SystemDesignProblem[] = [
  {
    id: 'sysdes-01',
    topic: 'Enterprise RAG System',
    difficulty: 'Hard',
    designProblem:
      'Design an enterprise RAG system that can answer questions over a 10M-document internal knowledge base. Requirements: <2s P95 response time, 99.9% uptime, multi-tenant with access control, supports PDF/Word/HTML/Slack messages.',
    evaluationCriteria: [
      'Document ingestion pipeline: chunking strategy, embedding model choice, batch processing design',
      'Vector database selection and indexing strategy (HNSW parameters, metadata schema)',
      'Hybrid retrieval: dense + sparse (BM25) with Reciprocal Rank Fusion',
      'Access control: per-document ACLs propagated to vector search (tenant isolation)',
      'Reranking stage: cross-encoder for top-k candidate refinement',
      'LLM prompt design: citation grounding, source attribution',
      'Monitoring: retrieval quality metrics, answer faithfulness tracking',
      'Scalability: horizontal scaling of retrieval and generation tiers independently',
    ],
    sampleSolutionApproach:
      'Ingestion pipeline: Apache Tika for document parsing → LangChain RecursiveCharacterTextSplitter (512 tokens, 64 overlap) → E5-large-v2 embeddings (1536-dim) → Weaviate with HNSW (ef=200, M=16) + BM25 hybrid. Multi-tenancy: each document tagged with tenant_id and ACL list; query-time filter in Weaviate pre-filters the ANN search. Retrieval: top-20 dense + top-20 sparse → RRF merge → BGE Reranker for top-5 → insert into Claude context with <document id> XML markers. Response: require model to cite document IDs; post-process to extract citations. Cache: Redis for repeated queries (semantic cache using embedding similarity). Monitoring: RAGAS faithfulness + context precision on 10% sample via async evaluation job. Infra: Kubernetes, HPA on retrieval pods, separate LLM inference pool with vLLM.',
  },
  {
    id: 'sysdes-02',
    topic: 'Real-time Content Moderation',
    difficulty: 'Hard',
    designProblem:
      'Design a real-time AI content moderation system for a social platform with 50M daily active users generating 500M pieces of content per day. Requirements: <100ms P99 latency for text, <500ms for images, >95% precision on hate speech with recall >90%.',
    evaluationCriteria: [
      'Tiered moderation architecture: fast heuristic → ML classifier → LLM review',
      'Modality handling: text, image, audio, and multimodal content',
      'Model selection per tier: lightweight classifier vs heavy LLM tradeoffs',
      'Asynchronous vs synchronous moderation and appeals workflow',
      'Active learning pipeline for continuous model improvement',
      'Bias and fairness considerations across demographics',
      'Rate limiting and DDoS resilience in the moderation pipeline',
      'Human review queue prioritization and capacity planning',
    ],
    sampleSolutionApproach:
      'Three-tier architecture: Tier 1 (<5ms): regex + keyword blocklist + hash-based exact match (PhotoDNA for known CSAM). Tier 2 (<50ms): distilBERT text classifier + CLIP-based image classifier running on dedicated GPU fleet—handles 95% of volume; scores above 0.9 auto-remove, below 0.1 auto-approve, 0.1-0.9 escalate. Tier 3 (<500ms): GPT-4 with chain-of-thought for ambiguous cases near the threshold. Human review queue: Tier 3 cases + user appeals, prioritized by severity score. Active learning: disagreements between model and human reviewers are sampled for retraining weekly. Multimodal: OCR text from images + image embedding → fusion model. Infrastructure: Kafka for async processing of non-blocking tiers; synchronous path for posting content blocks on Tier 1+2 confidence only. Fairness: regular audits with Aequitas across demographic slices; separate evaluation datasets per region.',
  },
  {
    id: 'sysdes-03',
    topic: 'Multi-Agent Coding Assistant',
    difficulty: 'Hard',
    designProblem:
      'Design a multi-agent AI coding assistant that can: understand a GitHub repository, plan and implement features end-to-end, write tests, and open pull requests. Must handle codebases up to 500k lines with multiple programming languages.',
    evaluationCriteria: [
      'Agent architecture: orchestrator + specialized subagents (planner, coder, reviewer, tester)',
      'Repository context management: how to provide relevant code without exceeding context limits',
      'Tool design: file read/write, code execution, search, git operations',
      'State management and memory across long coding tasks',
      'Error recovery and retry logic for failed tool calls',
      'Security: sandboxed code execution, preventing supply-chain attacks',
      'Progress tracking and user transparency during long-running tasks',
      'Evaluation: how do you measure success of autonomous coding tasks?',
    ],
    sampleSolutionApproach:
      'Orchestrator agent uses Claude-opus as planner: reads CLAUDE.md + README, builds task plan. Specialized agents: (1) Repo indexer: builds a code graph (tree-sitter AST parsing) + embedding index for symbol search; (2) Coder agent: Claude-sonnet with tools (read_file, write_file, search_symbol, run_tests); (3) Reviewer agent: independent review pass with different system prompt; (4) Test agent: generates tests from function signatures + existing test patterns. Context strategy: relevant files selected via symbol graph traversal from task description—never dump full repo. Execution sandbox: Docker container with network isolation, resource limits (2 CPU, 4GB RAM, 5min timeout); all file writes go to a worktree, not the main branch. State: task state machine persisted to Redis; each agent step logged for auditability. PR workflow: all changes in a feature branch; auto-generated PR description summarizing changes; CI must pass before merging. Success metric: SWE-bench-style task completion rate + test pass rate + human code review score.',
  },
  {
    id: 'sysdes-04',
    topic: 'LLM Inference Platform',
    difficulty: 'Hard',
    designProblem:
      'Design a distributed LLM inference platform serving 1M requests per day across 5 different open-source models (7B to 70B). Requirements: P50 TTFT < 500ms, P99 TTFT < 3s, cost-optimized, support streaming, multi-model routing.',
    evaluationCriteria: [
      'Model serving framework selection (vLLM, TGI, Triton) and configuration',
      'Intelligent request routing: model selection based on task, cost, latency SLO',
      'Batch scheduling and continuous batching optimization',
      'Auto-scaling strategy: scale to zero for low-traffic models, burst capacity',
      'Quantization strategy per model tier (INT8, INT4, GPTQ)',
      'KV cache management and memory planning',
      'Cost optimization: spot instances, GPU type selection, model caching',
      'Observability: latency attribution, cost tracking per request, error monitoring',
    ],
    sampleSolutionApproach:
      'Router layer (LiteLLM + custom routing logic): classify request complexity from prompt analysis → route to smallest sufficient model (7B for simple Q&A, 70B for complex reasoning); fallback chain on error. Serving: vLLM for all models with PagedAttention; 7B-13B on A10G (24GB, spot), 70B on A100-80GB (tensor parallel across 2 GPUs). Quantization: 7B in FP16, 13B in INT8 (BitsAndBytes), 70B in INT4 (GPTQ) to fit budget. Auto-scaling: KEDA on GPU queue depth; scale-to-zero for models with < 5 RPS sustained; warm pool of 1 replica minimum for SLO models. Streaming: SSE with token-level streaming; client heartbeat to detect dropped connections. Cost: spot instances for batch workloads, on-demand for interactive; 70B deployed only in NA-East to reduce cross-region cost. Observability: OpenTelemetry traces from router to vLLM → Grafana; per-request cost computed from token count × model price; alert on P99 TTFT > 2s.',
  },
  {
    id: 'sysdes-05',
    topic: 'AI Evaluation Framework',
    difficulty: 'Hard',
    designProblem:
      'Design an automated AI evaluation framework for a company that deploys 10+ LLM-powered features. The framework must catch quality regressions before production, provide continuous monitoring, and support A/B testing of prompt and model changes.',
    evaluationCriteria: [
      'Offline evaluation: golden dataset management, metric computation pipeline',
      'LLM-as-judge implementation with bias mitigation',
      'Online evaluation: shadow mode, A/B testing infrastructure, metric collection',
      'Regression detection: statistical tests, alerting thresholds',
      'Prompt and model change management: CI/CD integration',
      'Human evaluation workflow: when to involve humans, annotation UX',
      'Multi-dimensional evaluation: quality, safety, cost, latency',
      'Dataset management: curation, versioning, adversarial examples',
    ],
    sampleSolutionApproach:
      'Offline: per-feature golden datasets stored in S3 (versioned with DVC); evaluation runner as a GitHub Action triggered on every prompt/model change; metrics computed by a mix of deterministic functions (JSON schema compliance, latency, cost) + LLM judge (GPT-4-turbo with position-balanced comparison to mitigate verbosity bias); p-value gated promotion (Welch t-test, α=0.05, minimum detectable effect=2%). Online: shadow deployment for new prompt versions (100% traffic → both old + new, compare outputs offline); A/B tests for significant changes (50/50 split, 1-week minimum); collect user feedback signals (thumbs, regenerations, copy events) as implicit quality signals. Human evaluation: sampled 50 requests/week per feature, annotation UI in Retool, inter-annotator agreement (Cohen\'s κ) required > 0.7 before using as ground truth. Regression alerts: Slack alert if any feature drops >3% on primary metric in 7-day rolling window. Dashboard: Grafana showing per-feature quality, cost, latency trends side-by-side.',
  },
  {
    id: 'sysdes-06',
    topic: 'Fine-tuning Pipeline',
    difficulty: 'Hard',
    designProblem:
      'Design a self-serve fine-tuning platform that allows internal teams to fine-tune open-source LLMs on their domain data. Requirements: support LoRA and full fine-tuning, handle datasets up to 10GB, track experiments, and deploy fine-tuned models to production.',
    evaluationCriteria: [
      'Data ingestion and preprocessing pipeline (format standardization, deduplication, filtering)',
      'Training infrastructure: GPU scheduling, distributed training, fault tolerance',
      'Hyperparameter optimization integration',
      'Experiment tracking and model registry integration',
      'Evaluation before promotion: automatic quality gates',
      'Deployment pipeline: model packaging, serving, traffic shifting',
      'Cost management: GPU time budgeting, spot instance handling',
      'Safety: preventing models from being fine-tuned to remove safety guardrails',
    ],
    sampleSolutionApproach:
      'Data pipeline: upload → S3 → Spark preprocessing job (deduplication with MinHash LSH, PII detection/redaction with Presidio, format normalization to Alpaca/ShareGPT JSONL, train/val split). Training: Axolotl framework (supports LoRA, QLoRA, full FT) on Kubernetes with GPU operator; A100/H100 nodes from on-demand pool + spot for fault-tolerant jobs; checkpoint every 500 steps to S3; W&B for experiment tracking; auto-resume on preemption. HPO: Optuna study kicks off 3 parallel runs with different LR/LoRA rank combinations; best checkpoint selected by eval loss. Quality gates: automatic eval on domain-specific benchmark + safety eval (MT-Bench style + refusal rate test) before promotion; any model with >5% safety regression blocked. Deployment: LoRA adapters merged and pushed to model registry; blue-green deployment via vLLM with traffic shifting from 10%→50%→100% over 24hrs; auto-rollback on error rate spike. Safety: constitutional AI-style safety evaluation; red-team checklist required for models touching customer-facing features.',
  },
  {
    id: 'sysdes-07',
    topic: 'Multimodal Search Engine',
    difficulty: 'Hard',
    designProblem:
      'Design an AI-powered multimodal search engine for a media company with 500M assets (text articles, images, videos, podcasts). Users should be able to search with natural language, images, or voice queries.',
    evaluationCriteria: [
      'Cross-modal embedding alignment strategy',
      'Indexing architecture for mixed modalities at scale',
      'Query understanding: multimodal query encoding and intent classification',
      'Retrieval: ANN across modalities, score fusion, diversity',
      'Query-by-example (search by image) and voice query support',
      'Freshness: near-real-time indexing of new content',
      'Personalization: user preference learning and ranking',
      'Latency: achieving <200ms search response at scale',
    ],
    sampleSolutionApproach:
      'Embeddings: CLIP-ViT-L/14 for images/video frames; Whisper + text encoder for audio/podcast; unified text encoder (E5-large) for text articles—all projected to a shared 1024-dim embedding space via contrastive alignment training on paired media. Indexing: Milvus cluster with IVF_HNSW index per modality; metadata stored in Elasticsearch for keyword filtering; freshness via Kafka connector that processes new uploads within 60s. Query pipeline: incoming query classified as text/image/voice; voice transcribed via Whisper streaming; all modalities encoded → ANN search in Milvus → cross-modal RRF fusion → personalization re-rank (user click history embedding). Personalization: online learning of user preference vector updated per session; re-rank top-50 by inner product with user vector. Latency: query encoding (<10ms GPU), ANN retrieval (<20ms), fusion+rerank (<15ms) → P50 <50ms, P99 <200ms. Video: keyframe extracted every 5s, indexed as images; transcript chunks indexed as text—video search returns timestamp-anchored results.',
  },
  {
    id: 'sysdes-08',
    topic: 'AI-Powered Recommendation',
    difficulty: 'Hard',
    designProblem:
      'Design an AI recommendation system for an e-commerce platform with 50M users and 2M products. Must handle cold-start users, support real-time behavioral signals, and optimize for both CTR and long-term purchase value.',
    evaluationCriteria: [
      'Two-stage architecture: candidate generation and ranking',
      'Feature engineering: user, item, context, and interaction features',
      'Cold-start solution for new users and new products',
      'Real-time signal integration: clickstream, add-to-cart, purchase events',
      'Multi-objective optimization: CTR, conversion, long-term value, diversity',
      'Offline vs. online evaluation strategy',
      'Business constraints: margin, inventory, promoted products',
      'Serving latency: <50ms for full recommendation pipeline',
    ],
    sampleSolutionApproach:
      'Two-tower model: user tower (user ID embedding + demographics + behavioral history aggregation via attention over last-100 interactions) and item tower (item ID + category/brand embeddings + price/rating features). Trained with in-batch negative sampling + hard negatives from BM25 candidates. FAISS IVF index over item embeddings; top-500 candidates retrieved per user in <10ms. Ranking: DCN-v2 (Deep & Cross Network) with cross features + sequence attention over interaction history. Features: real-time via Redis (<5ms lookup), batch via feature store (Feast). Cold-start users: session-based recommendations using only last 5 actions (no user embedding, use item embeddings only); new items: content-based embedding from product description + image. Multi-objective: Pareto-optimal ranking combining CTR model + purchase probability model + diversity penalty (MMR algorithm). Business rules post-ranking: minimum 20% diversity by category, inject promoted items per campaign rules. Serving: FAISS retrieval (8ms) + ranking (15ms) + business rules (2ms) = 25ms total. A/B testing: holdout set per user cohort, primary metric = 7-day revenue per session.',
  },
]
