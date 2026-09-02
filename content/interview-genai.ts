import type { GenAIQuestion } from '@/lib/interview'

export const genAIQuestions: GenAIQuestion[] = [
  {
    id: 'genai-01',
    topic: 'Transformer Architecture',
    difficulty: 'Hard',
    tags: ['transformer', 'self-attention', 'multi-head-attention', 'positional-encoding'],
    question: 'Explain the transformer architecture in detail. What are the key innovations over RNNs?',
    expectedAnswer:
      'The transformer consists of stacked encoder and decoder blocks (or decoder-only for GPT-style). Each block has: (1) Multi-head self-attention: projects Q, K, V into h parallel heads, computes scaled dot-product attention in each, then concatenates—multiple heads let the model attend to different representation subspaces simultaneously; (2) Position-wise feed-forward network (FFN): two linear layers with a nonlinearity, applied independently to each position; (3) Layer normalization and residual connections throughout. Key innovations over RNNs: (a) Parallelization—all positions processed simultaneously vs. sequential RNN steps; (b) Constant path length between any two positions—RNNs have O(n) path length, leading to vanishing gradients for long-range dependencies; (c) No recurrence means no hidden state bottleneck. Positional encoding (sinusoidal or learned RoPE) is added to inject sequence order since self-attention is permutation-invariant. Encoder-decoder: encoder builds contextual representations, decoder uses cross-attention to attend to encoder outputs during generation.',
    realWorldScenarios: [
      'Building a document Q&A system: encoder-based BERT for retrieval, decoder-based GPT for generation.',
      'Code completion: decoder-only model (Codex/GPT) with long context for repository-level completeness.',
      'Machine translation: encoder-decoder transformer (original architecture) for sequence-to-sequence tasks.',
    ],
  },
  {
    id: 'genai-02',
    topic: 'RLHF',
    difficulty: 'Hard',
    tags: ['RLHF', 'reward-model', 'PPO', 'alignment', 'DPO'],
    question:
      'What is RLHF and how does it improve LLM behavior? What are the practical challenges?',
    expectedAnswer:
      'RLHF (Reinforcement Learning from Human Feedback) aligns LLMs with human preferences through three stages: (1) Supervised Fine-Tuning (SFT): fine-tune the base LLM on high-quality demonstrations; (2) Reward Model Training: humans rank model outputs pairwise; train a reward model (often the SFT model with a regression head) to predict human preference scores; (3) RL Optimization: use PPO to optimize the LLM to maximize reward model scores, with a KL divergence penalty against the SFT policy to prevent reward hacking. Practical challenges: reward hacking (model finds outputs that score high but are not actually good), training instability with PPO, expensive human annotation, mode collapse, and the reward model itself being imperfect. DPO (Direct Preference Optimization) bypasses the explicit RL stage—it reformulates the RLHF objective as a classification loss directly on the preference data, making training stable and simpler while achieving comparable alignment. At 5 years experience, I prefer DPO for its simplicity and stability unless I need fine-grained reward shaping.',
    realWorldScenarios: [
      'ChatGPT-style assistant: SFT on curated conversations, RLHF to align with helpful/harmless/honest criteria.',
      'Code assistant: DPO with preference data from accepted vs. rejected code completions.',
      'Content moderation: reward model trained on human safety judgments, deployed as a standalone classifier.',
    ],
  },
  {
    id: 'genai-03',
    topic: 'RAG vs Fine-tuning',
    difficulty: 'Hard',
    tags: ['RAG', 'fine-tuning', 'knowledge', 'retrieval', 'grounding'],
    question:
      'Explain the difference between RAG and fine-tuning. When would you use each, and when would you combine them?',
    expectedAnswer:
      'Fine-tuning updates model weights to internalize new knowledge or behavior—it is expensive, requires significant training data, and the knowledge is "baked in" (cannot be updated without retraining). RAG (Retrieval-Augmented Generation) keeps the model frozen and provides relevant documents as context at inference time—cheap to update (just update the document store), transparent (you can see what was retrieved), and naturally grounded. Use fine-tuning for: teaching new tasks/formats/behaviors (not just knowledge), improving response style, domain-specific terminology that confuses the base model, or when latency is critical (no retrieval step). Use RAG for: factual question answering over a private knowledge base, keeping information up-to-date (news, docs), reducing hallucination on specific facts, and providing citations. Combine them: fine-tune for task format + RAG for knowledge grounding—this is the production-grade approach for enterprise AI assistants. The worst strategy: fine-tuning to memorize facts—it does not reliably work and creates stale knowledge.',
    realWorldScenarios: [
      'Enterprise knowledge base Q&A: RAG over internal documents with no fine-tuning needed.',
      'Customer support bot: fine-tune for tone + RAG for product-specific knowledge.',
      'Medical coding assistant: fine-tune on clinical note style + RAG over ICD-10 codebook.',
    ],
  },
  {
    id: 'genai-04',
    topic: 'Hallucination',
    difficulty: 'Hard',
    tags: ['hallucination', 'grounding', 'factuality', 'RAG', 'calibration'],
    question:
      'What causes hallucination in LLMs and what are your mitigation strategies in a production system?',
    expectedAnswer:
      'Hallucination has multiple causes: (1) Training objective—next-token prediction trains the model to produce fluent text, not factually accurate text; the model learns correlations, not ground truth; (2) Knowledge cutoff—the model has no information about events after training; (3) Over-confident generation in low-probability regions—the model generates confidently about topics with sparse training data; (4) Prompt-following pressure—RLHF models are trained to always produce helpful answers, suppressing "I don\'t know" responses. Mitigation strategies: (1) RAG—provide authoritative source documents in context; (2) Self-consistency: sample multiple outputs, check for agreement; (3) Retrieval verification: after generation, retrieve evidence for key claims and fact-check; (4) Temperature tuning: lower temperature reduces hallucination but also creativity; (5) Prompting: "cite your sources," "say I don\'t know if uncertain," explicit instructions; (6) LLM-as-judge: a second LLM reviews the output for factual consistency; (7) Fine-tuning on calibrated outputs that include uncertainty expressions. In production, combine RAG + retrieval verification + LLM judge for high-stakes applications.',
    realWorldScenarios: [
      'Legal document summarization: RAG over case law, mandatory citation extraction, human review for high-stakes output.',
      'Medical Q&A: RAG over clinical guidelines, confidence scoring, escalation to human expert below threshold.',
      'Financial analysis: structured output with mandatory evidence citations, automated fact-checking against market data.',
    ],
  },
  {
    id: 'genai-05',
    topic: 'Tokenization',
    difficulty: 'Medium',
    tags: ['tokenization', 'BPE', 'SentencePiece', 'vocabulary'],
    question:
      'Explain tokenization. How does Byte-Pair Encoding (BPE) work and why does tokenization matter for model performance?',
    expectedAnswer:
      'Tokenization converts raw text into discrete tokens the model processes. BPE works via: (1) Initialize vocabulary with all individual characters (bytes); (2) Count all adjacent pair frequencies in the corpus; (3) Merge the most frequent pair into a new token, add to vocabulary; (4) Repeat until vocabulary size is reached (typically 30k-100k tokens). This produces a vocabulary where common words are single tokens and rare words are split into subword units—balancing vocabulary efficiency with coverage. Why tokenization matters: (1) "1 token ≈ 0.75 words"—token count determines context length and cost; (2) Some languages are tokenized less efficiently (non-Latin scripts may use 3-5x more tokens per word); (3) Numbers are often split character-by-character, hurting arithmetic reasoning; (4) Tokenization artifacts can cause unexpected model behavior (famous "SolidGoldMagikarp" bug where rare tokens caused erratic outputs). GPT-4 uses cl100k_base with 100k tokens; optimizing prompts for token efficiency directly impacts latency and cost.',
    realWorldScenarios: [
      'Multilingual application: Japanese/Chinese tokenize 3-4x worse than English—budget accordingly.',
      'Code generation: specialized tokenizers (CodeLlama) optimize for common programming patterns.',
      'Cost optimization: token counting before sending to API to avoid budget overruns.',
    ],
  },
  {
    id: 'genai-06',
    topic: 'Architecture Variants',
    difficulty: 'Medium',
    tags: ['GPT', 'BERT', 'encoder-decoder', 'causal-LM', 'masked-LM'],
    question:
      'What is the difference between GPT-style (decoder-only) and BERT-style (encoder-only) models? When do you use each?',
    expectedAnswer:
      'BERT (encoder-only) uses bidirectional self-attention with a Masked Language Model (MLM) objective—each token can attend to all positions simultaneously, making representations rich and context-aware in both directions. Best for: classification, NER, semantic similarity, retrieval (generating embeddings)—tasks where you need to understand a full input. GPT (decoder-only) uses causal (left-to-right) self-attention with a next-token prediction objective—each token can only attend to previous tokens. Best for: text generation, completion, conversational AI—tasks where you produce sequential output. Encoder-decoder (T5, BART): encoder processes input bidirectionally, decoder generates output autoregressively with cross-attention. Best for: seq2seq tasks—translation, summarization, question answering with long outputs. In 2024, decoder-only models (GPT-4, Claude, Llama) have largely superseded encoder-only for most tasks due to scale, but encoder-based models (E5, GTE, Nomic) remain dominant for embedding/retrieval due to bidirectional context.',
    realWorldScenarios: [
      'Semantic search: E5/Nomic encoder for query and document embeddings, then ANN retrieval.',
      'Chatbot: GPT-style decoder for conversational generation.',
      'Text classification: BERT fine-tuned for low-latency, high-accuracy classification.',
    ],
  },
  {
    id: 'genai-07',
    topic: 'RAG & Vector Search',
    difficulty: 'Medium',
    tags: ['RAG', 'vector-database', 'FAISS', 'embedding', 'ANN'],
    question:
      'How does vector similarity search power RAG systems? Walk me through the retrieval pipeline.',
    expectedAnswer:
      'RAG retrieval pipeline: (1) Ingestion: split documents into chunks (512-1024 tokens with overlap), embed each chunk using an embedding model (E5-large, OpenAI text-embedding-3-large), store vectors in a vector database (Pinecone, Weaviate, pgvector, FAISS); (2) Query: embed the user query with the same model, execute approximate nearest-neighbor (ANN) search using HNSW (Hierarchical Navigable Small World graphs)—O(log n) retrieval latency vs. O(n) brute force; (3) Augmentation: insert retrieved chunks into LLM context as grounding documents; (4) Generation: LLM answers based on retrieved context. Key design decisions: chunk size vs. retrieval granularity tradeoff; hybrid search (dense ANN + BM25 sparse retrieval for keywords, merged via RRF—Reciprocal Rank Fusion); reranking retrieved results with a cross-encoder before sending to LLM (ColBERT, BGE Reranker); metadata filtering for multi-tenant or date-filtered retrieval. Pitfall: embedding models have their own context limits—long chunks may degrade embedding quality.',
    realWorldScenarios: [
      'Legal research platform: hybrid BM25 + dense retrieval over 10M case documents with metadata filters.',
      'Customer support: RAG over product docs with reranking, fallback to human agent if confidence low.',
      'Developer tool: code search using code-specific embeddings (CodeBERT) for semantic code retrieval.',
    ],
  },
  {
    id: 'genai-08',
    topic: 'LoRA & PEFT',
    difficulty: 'Hard',
    tags: ['LoRA', 'PEFT', 'fine-tuning', 'QLoRA', 'adapter'],
    question:
      'Explain LoRA fine-tuning. Why is it parameter-efficient and what are its tradeoffs?',
    expectedAnswer:
      'LoRA (Low-Rank Adaptation) fine-tunes LLMs by injecting trainable low-rank matrices alongside frozen pretrained weight matrices. For a weight matrix W ∈ ℝ^(d×k), LoRA adds ΔW = AB where A ∈ ℝ^(d×r) and B ∈ ℝ^(r×k) with rank r ≪ min(d,k). Only A and B are trained—typically 0.1-1% of total parameters. Intuition: the "intrinsic dimensionality" of the fine-tuning update is low—the model does not need to move far from its pretrained state to adapt to a new task. Advantages: dramatically reduced GPU memory (can fine-tune 70B models on a single A100 with QLoRA+4-bit quantization), no inference latency overhead (A and B can be merged into W after training), multi-LoRA serving (swap adapters per-request). Tradeoffs: rank is a hyperparameter—too low loses expressiveness, too high approaches full fine-tuning cost; LoRA may not capture large distribution shifts that require updating more of the model. QLoRA extends LoRA with 4-bit NormalFloat quantization of the base model, enabling fine-tuning 65B models on 48GB GPU with near-full-FT quality.',
    realWorldScenarios: [
      'Domain adaptation: LoRA fine-tune Llama-3 on medical notes to improve clinical terminology handling.',
      'Multi-tenant serving: serve a shared base model with per-customer LoRA adapters loaded dynamically.',
      'Edge deployment: QLoRA-fine-tuned 7B model deployed on consumer GPU for on-premises privacy.',
    ],
  },
  {
    id: 'genai-09',
    topic: 'Context Window & RoPE',
    difficulty: 'Hard',
    tags: ['context-window', 'RoPE', 'positional-encoding', 'long-context'],
    question:
      'What is the context window and how do strategies like RoPE extend it beyond pretraining length?',
    expectedAnswer:
      'The context window is the maximum number of tokens a transformer can process in a single forward pass—limited by the O(n²) memory of self-attention and positional encoding generalization. RoPE (Rotary Position Embedding) encodes position by rotating Q and K vectors by an angle proportional to position, making attention scores depend on relative position differences (unlike absolute sinusoidal). RoPE enables context extension via: (1) Positional Interpolation (PI): scale positions to fit within the trained range, then fine-tune briefly—extends context 2-8x; (2) YaRN (Yet another RoPE extensioN): uses different scaling for different frequency components—high frequencies (local attention) kept unchanged, low frequencies (long-range) scaled. In production, long-context trade-offs: (a) "Lost in the middle" phenomenon—models attend better to beginning and end of long contexts; (b) Quadratic compute cost; (c) Retrieval accuracy degrades with extreme length. For most RAG applications, targeted retrieval + 8k context outperforms stuffing everything into 128k context.',
    realWorldScenarios: [
      'Long document analysis: use hierarchical summarization or sliding window RAG rather than naively extending context.',
      'Repository-level code generation: retrieval of relevant files rather than passing entire codebase as context.',
      'Legal contract review: use long-context model (Claude-3) for full document, then structured extraction.',
    ],
  },
  {
    id: 'genai-10',
    topic: 'LLM Evaluation',
    difficulty: 'Medium',
    tags: ['evaluation', 'LLM-judge', 'RAGAS', 'hallucination-detection', 'benchmarks'],
    question:
      'How would you evaluate the quality of an LLM-based application in production?',
    expectedAnswer:
      'Evaluation at multiple levels: (1) Component-level: retrieval quality (Recall@K, MRR, NDCG for RAG); generation quality (BLEU/ROUGE for reference-based tasks, BERTScore for semantic similarity, perplexity for language model quality); (2) End-to-end: LLM-as-judge (GPT-4 as evaluator—cheap, scalable, correlates well with human judgment); human evaluation for ground truth; RAGAS framework (answer relevancy, faithfulness, context precision, context recall for RAG pipelines); (3) Safety & behavior: red-teaming, adversarial testing, jailbreak resilience benchmarks; (4) Production: user feedback signals (thumbs up/down, regeneration rate), latency/cost metrics, A/B test on downstream business metrics. My evaluation pipeline: automated RAGAS on a golden dataset (200-300 curated Q&A pairs) runs on every code merge; weekly human evaluation batch for quality trend tracking; LLM-judge for continuous monitoring on production traffic samples.',
    realWorldScenarios: [
      'Enterprise RAG: RAGAS faithfulness score weekly; alert when < 0.85.',
      'Code assistant: pass@k on HumanEval + internal test suite for domain-specific code quality.',
      'Customer support: CSAT correlation with LLM judge score to validate automated evaluation.',
    ],
  },
  {
    id: 'genai-11',
    topic: 'Constitutional AI',
    difficulty: 'Hard',
    tags: ['Constitutional-AI', 'RLAIF', 'safety', 'alignment', 'Claude'],
    question:
      'What is Constitutional AI and how does it differ from RLHF?',
    expectedAnswer:
      'Constitutional AI (CAI) from Anthropic trains models to be helpful, harmless, and honest using AI-generated feedback rather than (only) human feedback. Process: (1) SL-CAI: the model critiques and revises its own harmful outputs according to a written "constitution" (set of principles); (2) RL-CAI (RLAIF): train a preference model using AI-generated comparisons (model evaluates which of two responses is more constitutional), then run PPO against this AI-generated reward model. Key differences from RLHF: no human labeling of harmful outputs required (scales better), the constitution is explicit and auditable (not implicit in human rater preferences), and the model learns to reason about harm rather than just pattern-matching from feedback. In practice: Anthropic uses CAI for Claude; it scales better than human RLHF for safety—humans cannot label millions of harmful outputs, but an AI constitutional evaluator can. Limitation: the constitution must be well-designed; a poorly written constitution can introduce biases or miss edge cases.',
    realWorldScenarios: [
      'Safe enterprise assistant: CAI principles ensure model refuses to generate competitor disparagement or legal risk content.',
      'Automated red-teaming: use CAI-style self-critique to discover safety failures before deployment.',
    ],
  },
  {
    id: 'genai-12',
    topic: 'Multimodal Models',
    difficulty: 'Hard',
    tags: ['multimodal', 'CLIP', 'vision-language', 'cross-modal'],
    question:
      'Explain multimodal models like CLIP. How do they bridge text and images, and what enables zero-shot transfer?',
    expectedAnswer:
      'CLIP (Contrastive Language-Image Pretraining) trains a vision encoder (ViT or ResNet) and a text encoder (transformer) jointly using a contrastive objective over 400M image-text pairs from the web. Training: for a batch of (image, text) pairs, compute similarity matrix between all image and text embeddings; maximize similarity of matching pairs and minimize similarity of non-matching pairs (InfoNCE loss). This aligns the embedding spaces so that semantically similar images and text have similar representations. Zero-shot transfer: given a new classification task, encode all class names as text (e.g., "a photo of a dog"), encode the query image, and classify by nearest-neighbor in the shared embedding space—no task-specific training needed. Extensions: DALL-E uses CLIP embeddings as conditioning for image generation; BLIP2 adds a lightweight Q-Former to connect frozen vision and language models; LLaVA projects image patch embeddings directly into an LLM\'s token space. In production, I use CLIP for semantic image search, zero-shot content moderation, and as the vision backbone in multimodal RAG.',
    realWorldScenarios: [
      'E-commerce visual search: CLIP embeddings for "find visually similar products to this image."',
      'Content moderation: zero-shot detection of policy-violating image categories without per-class training.',
      'Multimodal RAG: embed both PDF text and page images, retrieve relevant document pages.',
    ],
  },
  {
    id: 'genai-13',
    topic: 'LLM Deployment at Scale',
    difficulty: 'Hard',
    tags: ['inference', 'KV-cache', 'batching', 'quantization', 'vLLM'],
    question:
      'What are the key challenges in deploying LLMs at scale and how do you address them?',
    expectedAnswer:
      'Key challenges: (1) Memory: a 70B FP16 model needs ~140GB GPU memory for weights alone, before KV cache. Mitigation: quantization (INT8, INT4, GPTQ, AWQ—typically < 1% quality loss), model sharding across GPUs (tensor parallelism), and speculative decoding. (2) Throughput vs. latency: each token is generated sequentially (autoregressive)—you cannot parallelize generation within a sequence. Mitigation: continuous batching (vLLM PagedAttention—dynamically batch across requests, increasing GPU utilization from ~20% to >50%); KV cache management to avoid eviction. (3) KV cache: grows linearly with sequence length—a major memory bottleneck for long contexts. PagedAttention (vLLM) manages KV cache in non-contiguous memory pages, enabling larger effective batch sizes. (4) Cold start latency: model loading is slow. Mitigation: always-warm replicas, model on GPU memory pre-warmed. (5) Cost: LLM inference is 10-100x more expensive than traditional ML inference. In production, I use vLLM for open-source LLMs, LiteLLM for routing across providers, and implement prompt caching (Anthropic/OpenAI prefix caching) to reduce costs on repeated context.',
    realWorldScenarios: [
      'High-QPS chatbot: vLLM with continuous batching on 4xA100, target 50 req/s at P95 < 3s TTFT.',
      'Long-context document analysis: quantized model + sparse attention to process 100k-token documents.',
      'Multi-tenant SaaS: per-tenant LoRA adapters with vLLM adapter hot-swapping.',
    ],
  },
  {
    id: 'genai-14',
    topic: 'In-Context Learning',
    difficulty: 'Medium',
    tags: ['zero-shot', 'few-shot', 'in-context-learning', 'prompting'],
    question:
      'Explain the difference between zero-shot, few-shot, and in-context learning. Why does few-shot work without updating weights?',
    expectedAnswer:
      'Zero-shot: provide only instructions, no examples—relies entirely on knowledge from pretraining. Few-shot (in-context learning): provide k demonstrations (input-output pairs) in the prompt—the model infers the pattern without any gradient updates. Why it works: the model has implicitly learned a "meta-learning" capability during pretraining—it has seen so many tasks that it can recognize the pattern from examples and perform the task in context. The demonstrations serve as implicit specification of the task format, label space, and distribution. Key insights: (1) The actual label values in few-shot examples may matter less than the format and distribution—wrong labels can still improve performance; (2) Example selection matters enormously—diverse, representative examples outperform random selection; (3) Order sensitivity—models can be sensitive to example ordering (recency bias). Scaling law: larger models benefit more from few-shot examples. In production, I maintain a library of few-shot example sets per task, optimized via automatic prompt optimization tools (DSPy, APE).',
    realWorldScenarios: [
      'Information extraction: 3-5 labeled examples in prompt achieve near-fine-tuned quality with zero training cost.',
      'Multi-language support: few-shot examples in target language for language-specific formatting.',
    ],
  },
  {
    id: 'genai-15',
    topic: 'Speculative Decoding',
    difficulty: 'Hard',
    tags: ['speculative-decoding', 'inference-optimization', 'draft-model', 'latency'],
    question:
      'What is speculative decoding and how does it speed up LLM inference without changing output distribution?',
    expectedAnswer:
      'Speculative decoding uses a small, fast draft model to generate k candidate tokens, then verifies all k tokens in parallel with the large target model in a single forward pass. Acceptance: for each draft token, compute the ratio of target and draft probabilities; accept with probability min(1, p_target/p_draft). Rejected tokens are resampled from an adjusted distribution. Mathematical guarantee: the output distribution is identical to the target model alone—the draft model cannot change the quality, only the speed. Speedup: when the draft model\'s predictions are accepted ~60-80% of the time, you process multiple tokens per target forward pass—2-3x speedup on average. Best suited for: tasks with predictable patterns (code generation, structured output, summarization). Variants: self-speculative decoding (early exit layers as draft), Medusa (multiple prediction heads on the same model), and prompt lookup decoding (use input tokens as draft for extractive tasks like summarization). In production, speculative decoding + quantization can achieve 3-4x throughput improvement over vanilla autoregressive decoding.',
    realWorldScenarios: [
      'Code completion: draft model (1B) predicts syntactically predictable token sequences, target model (70B) verifies—high acceptance rate.',
      'Batch summarization: prompt lookup decoding copies phrases from source documents, high acceptance for extractive content.',
    ],
  },
]
