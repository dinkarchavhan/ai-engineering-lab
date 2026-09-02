import type { PracticalQuestion } from '@/lib/interview'

export const practicalQuestions: PracticalQuestion[] = [
  {
    id: 'prac-01',
    topic: 'Attention Mechanism',
    difficulty: 'Hard',
    problemStatement:
      'Implement scaled dot-product attention and multi-head attention from scratch in Python using only NumPy. Your implementation should match the transformer paper formula and handle batched inputs.',
    solutionExplanation: `
import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q, K, V: (batch, heads, seq_len, d_k)
    Returns: output (batch, heads, seq_len, d_v), attention_weights
    """
    d_k = Q.shape[-1]
    # Scaled scores: (batch, heads, seq_len, seq_len)
    scores = np.matmul(Q, K.transpose(0, 1, 3, 2)) / np.sqrt(d_k)
    if mask is not None:
        scores = scores + (mask * -1e9)  # Large negative = ~zero after softmax
    # Numerically stable softmax
    scores -= scores.max(axis=-1, keepdims=True)
    weights = np.exp(scores)
    weights /= weights.sum(axis=-1, keepdims=True)
    return np.matmul(weights, V), weights

class MultiHeadAttention:
    def __init__(self, d_model, num_heads):
        assert d_model % num_heads == 0
        self.d_k = d_model // num_heads
        self.h = num_heads
        # Weight matrices: W_Q, W_K, W_V, W_O
        scale = np.sqrt(2.0 / d_model)
        self.W_Q = np.random.randn(d_model, d_model) * scale
        self.W_K = np.random.randn(d_model, d_model) * scale
        self.W_V = np.random.randn(d_model, d_model) * scale
        self.W_O = np.random.randn(d_model, d_model) * scale

    def split_heads(self, X, batch):
        # (batch, seq, d_model) -> (batch, heads, seq, d_k)
        X = X.reshape(batch, -1, self.h, self.d_k)
        return X.transpose(0, 2, 1, 3)

    def forward(self, Q, K, V, mask=None):
        batch = Q.shape[0]
        Q = self.split_heads(Q @ self.W_Q, batch)
        K = self.split_heads(K @ self.W_K, batch)
        V = self.split_heads(V @ self.W_V, batch)
        out, _ = scaled_dot_product_attention(Q, K, V, mask)
        # (batch, heads, seq, d_k) -> (batch, seq, d_model)
        out = out.transpose(0, 2, 1, 3).reshape(batch, -1, self.h * self.d_k)
        return out @ self.W_O
    `,
    scoringRubric: [
      { criteria: 'Correct scaling by √d_k', points: 15, description: 'Divides dot products by sqrt(d_k) before softmax' },
      { criteria: 'Numerically stable softmax', points: 15, description: 'Subtracts max before exp to prevent overflow' },
      { criteria: 'Correct causal mask application', points: 15, description: 'Applies mask with large negative value before softmax' },
      { criteria: 'Multi-head split/merge correctly', points: 25, description: 'Correct reshape and transpose operations for heads' },
      { criteria: 'Batched computation', points: 15, description: 'Handles batch dimension throughout' },
      { criteria: 'Code clarity and correctness', points: 15, description: 'No off-by-one errors, correct matrix multiply axes' },
    ],
  },
  {
    id: 'prac-02',
    topic: 'RAG Pipeline Debugging',
    difficulty: 'Hard',
    problemStatement:
      'You have a RAG pipeline that returns poor answers. The retrieval step is returning the top-5 chunks by cosine similarity, but the LLM generates answers that contradict the retrieved documents or claim "the document doesn\'t contain this information" when it does. Diagnose and fix the pipeline.',
    solutionExplanation: `
# Systematic debugging approach:

# STEP 1: Measure retrieval quality independently
from sentence_transformers import SentenceTransformer
import numpy as np

def evaluate_retrieval(queries, relevant_doc_ids, retriever, k=5):
    hits = 0
    for q, rel_ids in zip(queries, relevant_doc_ids):
        results = retriever.search(q, k=k)
        if any(r.id in rel_ids for r in results):
            hits += 1
    return hits / len(queries)  # Recall@k

# STEP 2: Check embedding model mismatch
# Query and documents MUST use the same embedding model
# Common bug: indexing with model A, querying with model B

# STEP 3: Check chunk size vs query type
# Short factual queries need small chunks (256 tokens)
# Complex reasoning needs larger chunks (512-1024 tokens)
# Fix: use parent-child chunking - index small chunks, return parent chunk to LLM

# STEP 4: Check context insertion format
def build_context_prompt(retrieved_chunks):
    # BAD: just concatenating chunks
    # bad_context = " ".join([c.text for c in retrieved_chunks])

    # GOOD: structured with document IDs
    context = ""
    for i, chunk in enumerate(retrieved_chunks):
        context += f"<document id='{i+1}' source='{chunk.source}'>\\n"
        context += chunk.text + "\\n"
        context += "</document>\\n\\n"
    return context

# STEP 5: Reranking to improve precision
from sentence_transformers import CrossEncoder
reranker = CrossEncoder('BAAI/bge-reranker-large')

def rerank(query, candidates, top_k=3):
    pairs = [(query, c.text) for c in candidates]
    scores = reranker.predict(pairs)
    ranked = sorted(zip(scores, candidates), reverse=True)
    return [c for _, c in ranked[:top_k]]

# STEP 6: Add faithfulness check post-generation
def check_faithfulness(answer, context, llm):
    prompt = f"""
    Context: {context}
    Answer: {answer}
    Is every claim in the answer directly supported by the context?
    Respond with JSON: {{"faithful": true/false, "unsupported_claims": []}}
    """
    return llm.json(prompt)
    `,
    scoringRubric: [
      { criteria: 'Identifies retrieval vs generation failure mode', points: 20, description: 'Correctly isolates whether the problem is in retrieval or LLM' },
      { criteria: 'Implements Recall@k evaluation', points: 15, description: 'Measures retrieval quality independently' },
      { criteria: 'Identifies embedding model mismatch as a cause', points: 20, description: 'Checks that query and doc encoders match' },
      { criteria: 'Implements reranking', points: 20, description: 'Adds cross-encoder reranker after ANN retrieval' },
      { criteria: 'Structured context formatting', points: 15, description: 'Uses document IDs and delimiters in context' },
      { criteria: 'Faithfulness verification', points: 10, description: 'Post-generation faithfulness check' },
    ],
  },
  {
    id: 'prac-03',
    topic: 'PyTorch Training Loop',
    difficulty: 'Medium',
    problemStatement:
      'Write a production-quality PyTorch training loop for a text classification model. It should include: gradient clipping, mixed precision training, learning rate scheduling with warmup, early stopping, and checkpoint saving.',
    solutionExplanation: `
import torch
import torch.nn as nn
from torch.cuda.amp import GradScaler, autocast
from torch.optim import AdamW
from torch.optim.lr_scheduler import OneCycleLR

def train(model, train_loader, val_loader, config):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)

    optimizer = AdamW(
        model.parameters(),
        lr=config.lr,
        weight_decay=config.weight_decay
    )
    scheduler = OneCycleLR(
        optimizer,
        max_lr=config.lr,
        total_steps=len(train_loader) * config.epochs,
        pct_start=0.1  # 10% warmup
    )
    scaler = GradScaler()  # Mixed precision
    criterion = nn.CrossEntropyLoss()

    best_val_loss = float('inf')
    patience_counter = 0

    for epoch in range(config.epochs):
        # --- Training ---
        model.train()
        train_loss = 0
        for batch in train_loader:
            inputs, labels = batch['input_ids'].to(device), batch['labels'].to(device)
            optimizer.zero_grad()

            with autocast():  # FP16 forward pass
                logits = model(inputs)
                loss = criterion(logits, labels)

            scaler.scale(loss).backward()
            scaler.unscale_(optimizer)
            torch.nn.utils.clip_grad_norm_(model.parameters(), config.max_grad_norm)
            scaler.step(optimizer)
            scaler.update()
            scheduler.step()

            train_loss += loss.item()

        # --- Validation ---
        model.eval()
        val_loss, correct, total = 0, 0, 0
        with torch.no_grad():
            for batch in val_loader:
                inputs, labels = batch['input_ids'].to(device), batch['labels'].to(device)
                with autocast():
                    logits = model(inputs)
                    val_loss += criterion(logits, labels).item()
                correct += (logits.argmax(1) == labels).sum().item()
                total += labels.size(0)

        avg_val_loss = val_loss / len(val_loader)
        accuracy = correct / total
        print(f"Epoch {epoch}: val_loss={avg_val_loss:.4f}, acc={accuracy:.4f}")

        # Early stopping + checkpointing
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            patience_counter = 0
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'val_loss': best_val_loss,
            }, 'best_checkpoint.pt')
        else:
            patience_counter += 1
            if patience_counter >= config.patience:
                print(f"Early stopping at epoch {epoch}")
                break
    `,
    scoringRubric: [
      { criteria: 'Mixed precision with GradScaler', points: 20, description: 'Correctly uses autocast + GradScaler for AMP' },
      { criteria: 'Gradient clipping', points: 15, description: 'Clips gradients after unscaling but before optimizer step' },
      { criteria: 'LR warmup schedule', points: 15, description: 'Uses OneCycleLR or linear warmup' },
      { criteria: 'Early stopping', points: 20, description: 'Tracks patience counter and stops correctly' },
      { criteria: 'Checkpoint saving with full state', points: 15, description: 'Saves model + optimizer + epoch + metric' },
      { criteria: 'No gradient leakage in eval', points: 15, description: 'Uses torch.no_grad() in validation loop' },
    ],
  },
  {
    id: 'prac-04',
    topic: 'LLM Evaluation Metrics',
    difficulty: 'Medium',
    problemStatement:
      'Implement an LLM evaluation harness that computes: ROUGE-L, BERTScore, exact match, and an LLM-as-judge score. The harness should handle batch evaluation efficiently and output a structured report.',
    solutionExplanation: `
from rouge_score import rouge_scorer
from bert_score import score as bert_score
import anthropic
import json
from dataclasses import dataclass, asdict
from typing import Optional
import numpy as np

@dataclass
class EvalResult:
    rouge_l: float
    bert_score_f1: float
    exact_match: float
    llm_judge_score: Optional[float]
    sample_count: int

def compute_rouge_l(predictions, references):
    scorer = rouge_scorer.RougeScorer(['rougeL'], use_stemmer=True)
    scores = [scorer.score(ref, pred)['rougeL'].fmeasure
              for pred, ref in zip(predictions, references)]
    return np.mean(scores)

def compute_bert_score(predictions, references, batch_size=32):
    P, R, F1 = bert_score(
        predictions, references,
        model_type='microsoft/deberta-xlarge-mnli',
        batch_size=batch_size,
        verbose=False
    )
    return F1.mean().item()

def compute_exact_match(predictions, references):
    return np.mean([
        pred.strip().lower() == ref.strip().lower()
        for pred, ref in zip(predictions, references)
    ])

def llm_judge_batch(predictions, references, questions, client, batch_size=10):
    scores = []
    for i in range(0, len(predictions), batch_size):
        batch_preds = predictions[i:i+batch_size]
        batch_refs = references[i:i+batch_size]
        batch_qs = questions[i:i+batch_size]

        prompt = "\\n\\n".join([
            f"Q: {q}\\nReference: {r}\\nPrediction: {p}\\n"
            f"Score 1-5 for factual accuracy and completeness (1=wrong, 5=perfect)."
            for q, r, p in zip(batch_qs, batch_refs, batch_preds)
        ])
        prompt += "\\nRespond ONLY with JSON array of scores: [score1, score2, ...]"

        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}]
        )
        batch_scores = json.loads(response.content[0].text)
        scores.extend(batch_scores)
    return np.mean(scores) / 5.0  # Normalize to 0-1

def evaluate(predictions, references, questions=None, use_llm_judge=False):
    results = EvalResult(
        rouge_l=compute_rouge_l(predictions, references),
        bert_score_f1=compute_bert_score(predictions, references),
        exact_match=compute_exact_match(predictions, references),
        llm_judge_score=None,
        sample_count=len(predictions)
    )
    if use_llm_judge and questions:
        client = anthropic.Anthropic()
        results.llm_judge_score = llm_judge_batch(predictions, references, questions, client)
    return results
    `,
    scoringRubric: [
      { criteria: 'Correct ROUGE-L computation', points: 20, description: 'Uses rouge_score library, averages across samples' },
      { criteria: 'BERTScore with appropriate model', points: 20, description: 'Uses a semantic similarity model, not token overlap' },
      { criteria: 'LLM judge with structured output', points: 25, description: 'Batches requests, parses JSON scores, normalizes' },
      { criteria: 'Efficient batching', points: 15, description: 'Processes in batches rather than one at a time' },
      { criteria: 'Clean result structure', points: 10, description: 'Typed dataclass or dict with all metrics' },
      { criteria: 'Error handling', points: 10, description: 'Handles API errors, JSON parse failures gracefully' },
    ],
  },
  {
    id: 'prac-05',
    topic: 'Cosine Similarity at Scale',
    difficulty: 'Medium',
    problemStatement:
      'Implement an efficient semantic search function that finds the top-k most similar documents to a query using cosine similarity. It should handle 1M vectors without loading all into memory at once, and should be faster than O(n) brute force.',
    solutionExplanation: `
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from pathlib import Path
import h5py

class SemanticSearch:
    def __init__(self, embed_model='BAAI/bge-large-en-v1.5', dim=1024):
        self.model = SentenceTransformer(embed_model)
        self.dim = dim
        # HNSW index: O(log n) search, no memory explosion
        self.index = faiss.IndexHNSWFlat(dim, 32)  # 32 neighbors per layer
        self.index.hnsw.efSearch = 64  # Recall vs speed tradeoff
        self.id_to_doc = {}

    def add_documents(self, docs, batch_size=256, index_path=None):
        """Add documents in batches, avoiding full memory load."""
        all_embeddings = []
        for i in range(0, len(docs), batch_size):
            batch = docs[i:i+batch_size]
            embs = self.model.encode(
                [d['text'] for d in batch],
                normalize_embeddings=True,  # L2 normalize for cosine sim
                show_progress_bar=False
            )
            all_embeddings.append(embs.astype(np.float32))
            for j, doc in enumerate(batch):
                self.id_to_doc[i + j] = doc

        all_embs = np.vstack(all_embeddings)
        self.index.add(all_embs)

        if index_path:
            faiss.write_index(self.index, str(index_path))

    def search(self, query, k=5):
        query_emb = self.model.encode(
            [query], normalize_embeddings=True
        ).astype(np.float32)

        # HNSW search: O(log n) vs O(n) brute force
        distances, indices = self.index.search(query_emb, k)

        return [
            {
                'doc': self.id_to_doc[idx],
                'score': float(dist),  # Inner product = cosine sim (after L2 norm)
                'rank': rank + 1
            }
            for rank, (dist, idx) in enumerate(zip(distances[0], indices[0]))
            if idx != -1  # HNSW returns -1 for unfilled slots
        ]

    @classmethod
    def load(cls, index_path, docs_path):
        searcher = cls()
        searcher.index = faiss.read_index(str(index_path))
        with h5py.File(docs_path, 'r') as f:
            for k in f.keys():
                searcher.id_to_doc[int(k)] = {
                    'text': f[k]['text'][()].decode(),
                    'metadata': dict(f[k]['metadata'].attrs)
                }
        return searcher
    `,
    scoringRubric: [
      { criteria: 'Uses HNSW or IVF index (not brute force)', points: 30, description: 'FAISS HNSW for O(log n) approximate search' },
      { criteria: 'L2 normalization for cosine similarity', points: 20, description: 'Normalizes embeddings so dot product = cosine sim' },
      { criteria: 'Batch embedding computation', points: 20, description: 'Encodes documents in batches, not one by one' },
      { criteria: 'Index persistence (save/load)', points: 15, description: 'Saves and loads FAISS index from disk' },
      { criteria: 'Handles HNSW edge cases', points: 15, description: 'Filters -1 indices, handles empty results' },
    ],
  },
  {
    id: 'prac-06',
    topic: 'LoRA Fine-tuning',
    difficulty: 'Hard',
    problemStatement:
      'Write the code to fine-tune a Llama-3 model using LoRA (without any fine-tuning framework, just PyTorch + PEFT). Include dataset preparation, training config, and basic evaluation. Target task: sentiment classification.',
    solutionExplanation: `
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from datasets import Dataset
from trl import SFTTrainer
import torch

# 1. Load model with quantization for memory efficiency
model_name = "meta-llama/Meta-Llama-3-8B"
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,  # bf16 for A100, fp16 for others
    device_map="auto",
    load_in_4bit=True,            # QLoRA: 4-bit base model
)

# 2. LoRA configuration
lora_config = LoraConfig(
    r=16,                          # Rank - higher = more capacity
    lora_alpha=32,                 # Scale = alpha/r = 2.0
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],  # Attention layers
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: 6,815,744 || all params: 8,036,352,000 || 0.085%

# 3. Dataset preparation - Alpaca format
def format_prompt(example):
    return {
        "text": f"""<|begin_of_text|><|start_header_id|>user<|end_header_id|>
Classify the sentiment of this review as POSITIVE, NEGATIVE, or NEUTRAL.
Review: {example['text']}
<|eot_id|><|start_header_id|>assistant<|end_header_id|>
{example['label']}<|eot_id|>"""
    }

train_dataset = Dataset.from_dict({...}).map(format_prompt)

# 4. Training with SFTTrainer
training_args = TrainingArguments(
    output_dir="./lora-sentiment",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,  # Effective batch = 16
    warmup_ratio=0.1,
    learning_rate=2e-4,             # Higher LR OK for LoRA
    fp16=True,
    logging_steps=10,
    save_strategy="epoch",
    evaluation_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss",
)

trainer = SFTTrainer(
    model=model,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    dataset_text_field="text",
    max_seq_length=512,
    args=training_args,
)
trainer.train()

# 5. Save only LoRA adapter (not full model)
model.save_pretrained("./lora-adapter-only")
# Merge for production serving
merged = model.merge_and_unload()
merged.save_pretrained("./merged-model")
    `,
    scoringRubric: [
      { criteria: 'Correct LoRA config with appropriate rank', points: 20, description: 'Sets r, alpha, target_modules correctly' },
      { criteria: 'QLoRA 4-bit quantization', points: 15, description: 'Uses load_in_4bit for memory efficiency' },
      { criteria: 'Correct instruction format for Llama-3', points: 15, description: 'Uses proper chat template tokens' },
      { criteria: 'Gradient accumulation for effective batch size', points: 15, description: 'Multiplies micro-batch × accumulation steps' },
      { criteria: 'Saves adapter separately from base model', points: 20, description: 'Saves PEFT adapter, knows how to merge' },
      { criteria: 'Warmup + appropriate LR for LoRA', points: 15, description: 'Uses higher LR for LoRA (2e-4) with warmup' },
    ],
  },
  {
    id: 'prac-07',
    topic: 'Streaming LLM Response',
    difficulty: 'Medium',
    problemStatement:
      'Implement a production-ready streaming endpoint using FastAPI and the Anthropic SDK that streams LLM responses token by token to the client. Include proper error handling, timeout management, and logging.',
    solutionExplanation: `
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import anthropic
import asyncio
import logging
import time
import json

app = FastAPI()
client = anthropic.AsyncAnthropic()
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    message: str
    system: str = "You are a helpful AI assistant."
    max_tokens: int = 1024

async def stream_anthropic_response(request: ChatRequest):
    start_time = time.time()
    token_count = 0

    try:
        async with client.messages.stream(
            model="claude-3-5-sonnet-20241022",
            max_tokens=request.max_tokens,
            system=request.system,
            messages=[{"role": "user", "content": request.message}],
        ) as stream:
            async for text in stream.text_stream:
                token_count += 1
                # SSE format: data: <json>\\n\\n
                yield f"data: {json.dumps({'text': text, 'done': False})}\\n\\n"

            # Final message with usage stats
            final_message = await stream.get_final_message()
            yield f"data: {json.dumps({'done': True, 'usage': {'input_tokens': final_message.usage.input_tokens, 'output_tokens': final_message.usage.output_tokens}})}\\n\\n"

            logger.info(
                "stream_complete",
                extra={"duration_ms": (time.time()-start_time)*1000, "tokens": token_count}
            )
    except anthropic.APIStatusError as e:
        logger.error(f"API error: {e.status_code} - {e.message}")
        yield f"data: {json.dumps({'error': str(e.message), 'done': True})}\\n\\n"
    except asyncio.TimeoutError:
        logger.error("Stream timeout")
        yield f"data: {json.dumps({'error': 'Request timed out', 'done': True})}\\n\\n"

@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    if len(request.message) > 10000:
        raise HTTPException(status_code=400, detail="Message too long")
    return StreamingResponse(
        stream_anthropic_response(request),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
    `,
    scoringRubric: [
      { criteria: 'Correct SSE format (data: ...\\n\\n)', points: 20, description: 'Uses proper Server-Sent Events formatting' },
      { criteria: 'AsyncAnthropic with async generator', points: 25, description: 'Uses async client and async for iteration' },
      { criteria: 'Error handling with SSE error events', points: 20, description: 'Sends error as SSE event rather than crashing stream' },
      { criteria: 'Final message with usage stats', points: 15, description: 'Extracts and sends token usage in final event' },
      { criteria: 'Cache-Control headers for streaming', points: 10, description: 'Prevents proxy buffering with no-cache headers' },
      { criteria: 'Input validation', points: 10, description: 'Validates input length before calling API' },
    ],
  },
  {
    id: 'prac-08',
    topic: 'Catastrophic Forgetting Detection',
    difficulty: 'Hard',
    problemStatement:
      'You fine-tuned a general-purpose LLM on medical data. After fine-tuning, users report the model performs poorly on general tasks it previously handled well. Implement a diagnostic tool to detect and measure catastrophic forgetting.',
    solutionExplanation: `
import anthropic
import json
import numpy as np
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class ForgetEval:
    task: str
    baseline_score: float
    finetuned_score: float
    forgetting_pct: float

# Benchmark tasks for general capability
GENERAL_BENCHMARKS = {
    "math": [
        {"q": "What is 15% of 240?", "a": "36"},
        {"q": "Solve: 2x + 5 = 13", "a": "x = 4"},
    ],
    "reasoning": [
        {"q": "If all cats are animals and some animals are pets, can we conclude some cats are pets?",
         "a": "Not necessarily"},
    ],
    "coding": [
        {"q": "Write a Python one-liner to flatten [[1,2],[3,4]]",
         "a": "[x for sublist in [[1,2],[3,4]] for x in sublist]"},
    ],
    "language": [
        {"q": "What is the plural of 'criterion'?", "a": "criteria"},
    ]
}

def evaluate_model(model_id: str, client: anthropic.Anthropic) -> Dict[str, float]:
    task_scores = {}
    for task_name, examples in GENERAL_BENCHMARKS.items():
        correct = 0
        for ex in examples:
            response = client.messages.create(
                model=model_id,
                max_tokens=100,
                messages=[{"role": "user", "content": ex["q"]}]
            )
            answer = response.content[0].text.strip()
            # Fuzzy match for numeric/short answers
            correct += int(ex["a"].lower() in answer.lower())
        task_scores[task_name] = correct / len(examples)
    return task_scores

def measure_forgetting(baseline_model: str, finetuned_model: str) -> List[ForgetEval]:
    client = anthropic.Anthropic()

    baseline_scores = evaluate_model(baseline_model, client)
    finetuned_scores = evaluate_model(finetuned_model, client)

    results = []
    for task in baseline_scores:
        b = baseline_scores[task]
        f = finetuned_scores.get(task, 0)
        forgetting = max(0, (b - f) / b * 100) if b > 0 else 0
        results.append(ForgetEval(task, b, f, forgetting))

    # Flag tasks with > 15% forgetting
    critical = [r for r in results if r.forgetting_pct > 15]
    if critical:
        print(f"CRITICAL FORGETTING DETECTED in: {[r.task for r in critical]}")
        print("Recommendation: use EWC, LoRA, or data replay to mitigate")

    return results

# Mitigation: replay general data during fine-tuning
def create_replay_dataset(domain_data, general_data, replay_ratio=0.1):
    n_replay = int(len(domain_data) * replay_ratio)
    replay_samples = np.random.choice(general_data, n_replay, replace=False)
    return list(domain_data) + list(replay_samples)
    `,
    scoringRubric: [
      { criteria: 'Identifies catastrophic forgetting as the root cause', points: 15, description: 'Correctly names and explains the phenomenon' },
      { criteria: 'Implements evaluation across multiple capability dimensions', points: 25, description: 'Tests math, reasoning, coding, language—not just one domain' },
      { criteria: 'Computes forgetting percentage correctly', points: 20, description: 'Relative degradation, not absolute difference' },
      { criteria: 'Flags critical forgetting above threshold', points: 15, description: 'Alerts when forgetting exceeds meaningful threshold' },
      { criteria: 'Proposes data replay mitigation', points: 15, description: 'Implements or describes replay buffer approach' },
      { criteria: 'Mentions EWC or LoRA as alternatives', points: 10, description: 'Aware of more advanced catastrophic forgetting mitigations' },
    ],
  },
]
