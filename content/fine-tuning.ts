import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — Fine-Tuning Fundamentals (fully written as the reference)
// ---------------------------------------------------------------------------
const fineTuningFundamentalsLesson: Lesson = {
  slug: "fine-tuning-fundamentals",
  trackSlug: "fine-tuning",
  order: 1,
  minutes: 22,
  title: "Fine-Tuning Fundamentals",
  subtitle:
    "How to adapt a pretrained model to your specific task, data, or domain — and when to fine-tune vs prompt vs RAG.",
  tags: ["Fine-tuning", "Transfer learning", "SFT", "First principles"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Pretrained LLMs are generalists — they know a little about everything but aren't optimized for your specific task. You have three options to make them better for your use case:\n\n1. **Prompting** — describe the task in natural language (zero-shot/few-shot)\n2. **RAG** — retrieve relevant context at inference time\n3. **Fine-tuning** — continue training the model on your data\n\nFine-tuning is the most powerful but also the most expensive and complex. The problem: when should you fine-tune, and how do you do it without breaking the model?",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "Fine-tuning doesn't teach new facts — it teaches new behavior, style, format, or domain-specific patterns.",
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
            "Fine-tuning unlocks capabilities that prompting and RAG can't match:\n\n- **Task specialization** — turn a general model into a domain expert (medical, legal, code)\n- **Style consistency** — enforce a specific tone, format, or structure\n- **Latency reduction** — bake knowledge into weights instead of retrieving at runtime\n- **Cost reduction** — use a smaller fine-tuned model instead of a large prompted model\n- **Privacy** — keep sensitive training data on your infrastructure\n\nCompanies like Bloomberg (finance), Med-PaLM (medical), and GitHub Copilot (code) all use fine-tuned models.",
        },
      ],
    },
    {
      step: 3,
      title: "Pretraining vs fine-tuning vs transfer learning",
      blocks: [
        {
          type: "text",
          content:
            "Let's clarify the terminology:",
        },
        {
          type: "diagram",
          label: "The model training spectrum",
          chart: `flowchart LR
    PT[Pretraining<br/>Train from scratch<br/>Billions of tokens<br/>$$$$$] --> FT[Fine-tuning<br/>Adapt to task<br/>Thousands of examples<br/>$$]
    FT --> INF[Inference<br/>Use the model<br/>$]

    BASE[Base Model<br/>GPT-4, Llama 3] -.transfer learning.-> FT

    style PT fill:#ffe6e6
    style FT fill:#e6f3ff
    style INF fill:#e6ffe6
    style BASE fill:#f0f0f0`,
        },
        {
          type: "kv",
          items: [
            { key: "Pretraining", value: "Train a model from scratch on massive unlabeled data (web pages, books, code). Cost: millions of dollars, months of GPU time. Who does it: OpenAI, Google, Meta, Anthropic." },
            { key: "Transfer learning", value: "Start from a pretrained model and adapt it to a new task. Fine-tuning is the most common form of transfer learning." },
            { key: "Fine-tuning", value: "Continue training a pretrained model on task-specific labeled data. Cost: hundreds to thousands of dollars, hours to days. Who does it: you." },
          ],
        },
        {
          type: "text",
          content:
            "You don't pretrain models yourself. You fine-tune pretrained models released by labs (Llama 3, Mistral, Gemma, etc.) or via APIs (OpenAI, Cohere).",
        },
      ],
    },
    {
      step: 4,
      title: "When to fine-tune: the decision tree",
      blocks: [
        {
          type: "text",
          content:
            "Ask these questions in order:",
        },
        {
          type: "list",
          style: "number",
          items: [
            "**Can prompting solve it?** Try zero-shot, few-shot, and chain-of-thought first. If it works, stop here.",
            "**Do you need up-to-date facts?** Fine-tuning bakes in a snapshot. Use RAG for changing information.",
            "**Do you need consistent style/format?** If prompting produces inconsistent outputs, fine-tuning can enforce structure.",
            "**Do you have 500+ high-quality labeled examples?** Fine-tuning needs data. Less than 100 examples rarely works well.",
            "**Is latency or cost a blocker?** A fine-tuned 7B model can replace a prompted 70B model at 1/10 the cost.",
          ],
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "The 80/20 rule: prompting + RAG handles 80% of use cases. Fine-tuning handles the remaining 20% where quality, cost, or latency matter most.",
        },
        {
          type: "text",
          content:
            "**Use cases where fine-tuning wins:**\n\n- Customer support (tone, company-specific language)\n- Code generation (specific framework conventions)\n- Medical/legal (domain terminology, regulatory compliance)\n- Structured output (JSON, SQL, formatted reports)\n- Multilingual (improve performance on low-resource languages)",
        },
      ],
    },
    {
      step: 5,
      title: "Types of fine-tuning",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "Supervised fine-tuning (SFT)", value: "Train on input-output pairs with cross-entropy loss. The most common type." },
            { key: "Instruction tuning", value: "SFT on instruction-response pairs to improve instruction-following ability." },
            { key: "RLHF (Reinforcement Learning from Human Feedback)", value: "Train a reward model from human preferences, then use RL to optimize the LLM. Advanced, expensive." },
            { key: "Full fine-tuning", value: "Update all model parameters. Requires large GPU memory (70B model = 280GB in FP32)." },
            { key: "Parameter-efficient fine-tuning (PEFT)", value: "Update only a small subset of parameters (LoRA, adapters). Runs on consumer GPUs." },
          ],
        },
        {
          type: "text",
          content:
            "This lesson focuses on **supervised fine-tuning** with **parameter-efficient methods** (LoRA/QLoRA) — the most practical approach for practitioners.",
        },
      ],
    },
    {
      step: 6,
      title: "The fine-tuning process",
      blocks: [
        {
          type: "text",
          content:
            "Fine-tuning follows the same pattern as training any supervised model:",
        },
        {
          type: "list",
          style: "number",
          items: [
            "**Collect data** — gather input-output pairs for your task (500-10,000 examples)",
            "**Format data** — structure as instruction-response pairs or input-target pairs",
            "**Choose a base model** — Llama 3 8B, Mistral 7B, Gemma 7B are good starting points",
            "**Select a method** — LoRA/QLoRA for efficiency, full fine-tuning for maximum quality",
            "**Train** — run training loop for 1-5 epochs, monitor loss on validation set",
            "**Evaluate** — test on held-out data, compare to base model and prompting baseline",
            "**Deploy** — serve the fine-tuned model via API or local inference",
          ],
        },
        {
          type: "callout",
          kind: "warning",
          content:
            "More epochs ≠ better. Fine-tuning for too long causes overfitting — the model memorizes training data and gets worse on new inputs.",
        },
      ],
    },
    {
      step: 7,
      title: "Dataset preparation",
      blocks: [
        {
          type: "text",
          content:
            "Your dataset is the most important factor. A small, high-quality dataset beats a large, noisy one.",
        },
        {
          type: "text",
          content:
            "**Data format for instruction tuning:**",
        },
        {
          type: "code",
          language: "json",
          label: "Instruction-response pairs",
          code: `[
  {
    "instruction": "Classify the sentiment of the following review.",
    "input": "This product is amazing! Best purchase ever.",
    "output": "Positive"
  },
  {
    "instruction": "Translate the following English text to French.",
    "input": "Hello, how are you?",
    "output": "Bonjour, comment allez-vous?"
  },
  {
    "instruction": "Extract all email addresses from the text.",
    "input": "Contact us at support@example.com or sales@example.com",
    "output": "support@example.com, sales@example.com"
  }
]`,
        },
        {
          type: "text",
          content:
            "**Quality checklist:**\n\n- ✅ Diverse examples covering edge cases\n- ✅ Consistent formatting across all examples\n- ✅ Correct outputs (verify manually or with a judge model)\n- ✅ Representative of real production distribution\n- ❌ Duplicates (remove them)\n- ❌ Contradictory examples (same input, different outputs)\n- ❌ PII or sensitive data (filter it out)",
        },
        {
          type: "text",
          content:
            "**How much data do you need?**\n\n- **100-500 examples** — minimal fine-tuning, for very specific tasks\n- **500-2000 examples** — typical range for most tasks\n- **2000-10,000 examples** — high-quality domain adaptation\n- **10,000+ examples** — approaching full task coverage",
        },
      ],
    },
    {
      step: 8,
      title: "Fine-tuning with OpenAI API",
      blocks: [
        {
          type: "text",
          content:
            "The easiest way to start: fine-tune GPT-4o-mini or GPT-3.5-turbo via OpenAI's API.",
        },
        {
          type: "code",
          language: "python",
          label: "Fine-tune via OpenAI API",
          code: `# Install once: pip install openai
from openai import OpenAI
import json

client = OpenAI()

# 1. Prepare training data in JSONL format
training_data = [
    {"messages": [
        {"role": "system", "content": "You are a customer support assistant."},
        {"role": "user", "content": "How do I reset my password?"},
        {"role": "assistant", "content": "To reset your password: 1. Go to Settings, 2. Click 'Account Security', 3. Select 'Reset Password', 4. Follow the email instructions."}
    ]},
    {"messages": [
        {"role": "system", "content": "You are a customer support assistant."},
        {"role": "user", "content": "What's your refund policy?"},
        {"role": "assistant", "content": "We offer full refunds within 30 days of purchase. Contact support@company.com with your order number."}
    ]},
    # Add 100-1000 more examples...
]

# Save to JSONL
with open("training_data.jsonl", "w") as f:
    for item in training_data:
        f.write(json.dumps(item) + "\\n")

# 2. Upload training file
file = client.files.create(
    file=open("training_data.jsonl", "rb"),
    purpose="fine-tune"
)

# 3. Create fine-tuning job
job = client.fine_tuning.jobs.create(
    training_file=file.id,
    model="gpt-4o-mini-2024-07-18",
    hyperparameters={
        "n_epochs": 3  # 1-5 epochs typical
    }
)

print(f"Fine-tuning job created: {job.id}")

# 4. Monitor progress
# Takes 10 minutes to 2 hours depending on dataset size
job_status = client.fine_tuning.jobs.retrieve(job.id)
print(f"Status: {job_status.status}")

# 5. Use the fine-tuned model (after job completes)
# fine_tuned_model = job_status.fine_tuned_model
# response = client.chat.completions.create(
#     model=fine_tuned_model,
#     messages=[{"role": "user", "content": "How do I cancel my subscription?"}]
# )`,
        },
        {
          type: "text",
          content:
            "**Cost:** ~$8 per 1M training tokens. A 1000-example dataset typically costs $5-20 to fine-tune.",
        },
      ],
    },
    {
      step: 9,
      title: "Fine-tuning with LoRA (open source)",
      blocks: [
        {
          type: "text",
          content:
            "LoRA (Low-Rank Adaptation) trains small adapter matrices instead of updating all model weights. This lets you fine-tune a 7B model on a consumer GPU (16GB VRAM).",
        },
        {
          type: "code",
          language: "python",
          label: "Fine-tune with LoRA (Hugging Face)",
          code: `# Install once: pip install transformers peft datasets bitsandbytes accelerate
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer
from datasets import load_dataset

# 1. Load base model (quantized to 4-bit to fit in 16GB VRAM)
model_name = "meta-llama/Llama-3.2-3B"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    load_in_4bit=True,  # QLoRA: quantize base model
    device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# 2. Prepare model for LoRA
model = prepare_model_for_kbit_training(model)

# 3. Configure LoRA
lora_config = LoraConfig(
    r=16,  # Rank of adapter matrices (8-64 typical)
    lora_alpha=32,  # Scaling factor
    target_modules=["q_proj", "v_proj"],  # Which layers to adapt
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

model = get_peft_model(model, lora_config)
print(f"Trainable params: {model.print_trainable_parameters()}")
# Output: trainable params: 4.2M (0.5% of 7B) — only training 4M params!

# 4. Load and format dataset
dataset = load_dataset("json", data_files="training_data.jsonl")

# 5. Training arguments
training_args = TrainingArguments(
    output_dir="./llama-lora-finetuned",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    learning_rate=2e-4,
    logging_steps=10,
    save_steps=100,
)

# 6. Train
trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    tokenizer=tokenizer,
)

trainer.train()

# 7. Save adapter weights (only 10-50MB!)
model.save_pretrained("./llama-lora-adapter")`,
        },
        {
          type: "text",
          content:
            "LoRA only trains 0.1-1% of parameters. A 7B model's LoRA adapter is only 10-50MB instead of 14GB. You can store and switch between many adapters.",
        },
      ],
    },
    {
      step: 10,
      title: "Evaluating fine-tuned models",
      blocks: [
        {
          type: "text",
          content:
            "Never deploy without evaluation. Compare your fine-tuned model against baselines:",
        },
        {
          type: "list",
          style: "bullet",
          items: [
            "**Base model (no fine-tuning)** — does fine-tuning actually help?",
            "**Base model + prompting** — is fine-tuning better than just better prompts?",
            "**Base model + RAG** — could RAG solve this without fine-tuning?",
          ],
        },
        {
          type: "text",
          content:
            "**Metrics:**\n\n- **Task-specific** — accuracy, F1, BLEU, ROUGE (depends on your task)\n- **Perplexity** — lower = model is more confident (but doesn't guarantee correctness)\n- **Human eval** — the gold standard. Have annotators rate outputs on quality, relevance, safety.\n- **LLM-as-judge** — use GPT-4 to score outputs on criteria (cheaper than human eval)",
        },
        {
          type: "callout",
          kind: "gotcha",
          content:
            "A fine-tuned model can have lower validation loss but worse real-world performance. Always test on actual user queries, not just held-out training data.",
        },
      ],
    },
    {
      step: 11,
      title: "Common pitfalls",
      blocks: [
        {
          type: "list",
          style: "bullet",
          items: [
            "**Overfitting** — training for too many epochs. Stop when validation loss stops improving (early stopping).",
            "**Catastrophic forgetting** — model forgets its general capabilities. Mix in general data (5-20% of training set) to prevent this.",
            "**Data leakage** — validation set contains duplicates or variants of training examples. Results look great but don't generalize.",
            "**Wrong base model** — starting from a code model for a chat task, or vice versa. Pick a base model aligned with your task.",
            "**Too little data** — fine-tuning on 50 examples rarely works. Collect at least 500.",
            "**Imbalanced data** — 90% positive examples, 10% negative. Model learns to always predict positive. Balance your dataset.",
            "**Not comparing to baselines** — you fine-tuned for a week and it's worse than prompting. Always measure improvement.",
          ],
        },
      ],
    },
    {
      step: 12,
      title: "Fine-tuning vs prompting vs RAG: decision matrix",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "Use prompting when", value: "The base model can already do the task with good instructions. Fast to iterate, no training cost." },
            { key: "Use RAG when", value: "You need up-to-date facts, citations, or access to documents. Prompting + retrieval, no training." },
            { key: "Use fine-tuning when", value: "You need consistent style/format, low latency, or the base model can't learn the task from prompting alone." },
            { key: "Use prompting + RAG when", value: "Most production use cases. Retrieves fresh context, prompts for task. No training, updates instantly." },
            { key: "Use fine-tuning + RAG when", value: "Advanced: fine-tune for domain language/style, RAG for facts. Medical assistant: fine-tuned on clinical notes, RAG over latest research." },
          ],
        },
      ],
    },
    {
      step: 13,
      title: "What you'll build",
      blocks: [
        {
          type: "text",
          content:
            "In the hands-on project, you'll fine-tune Llama 3 8B on a customer support dataset using LoRA. You'll prepare training data, run the training loop, evaluate against baselines, and deploy the model via a FastAPI endpoint. You'll measure quality improvement and cost reduction compared to prompting GPT-4.",
        },
      ],
    },
    {
      step: 14,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question: "When should you choose fine-tuning over RAG for improving an LLM's performance?",
          options: [
            "When you need consistent output format/style and have 500+ labeled examples",
            "When you need access to the latest information and real-time data",
            "When you want to avoid training costs and iterate quickly",
            "Fine-tuning is always better than RAG for any task",
          ],
          correct: 0,
          explanation:
            "Fine-tuning is best when you need to teach the model a consistent style, format, or domain-specific behavior, and you have enough labeled data. RAG is better for factual retrieval and up-to-date information. Most use cases start with prompting + RAG and only fine-tune when those aren't sufficient.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Stub function for remaining lessons
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
    trackSlug: "fine-tuning",
    order,
    minutes,
    title,
    subtitle,
    tags,
    sections: [
      {
        step: 1,
        title: "Coming soon",
        blocks: [
          {
            type: "callout",
            kind: "tip",
            title: "Coming soon",
            content: `This lesson is under development. **What you'll learn:** ${teaser}`,
          },
        ],
      },
    ],
  };
}

export const fineTuningLessons: Lesson[] = [
  fineTuningFundamentalsLesson,
  {
    slug: "dataset-preparation",
    trackSlug: "fine-tuning",
    order: 2,
    minutes: 18,
    title: "Dataset Preparation and Quality",
    subtitle: "How to collect, clean, format, and validate training data — the most important factor in fine-tuning success.",
    tags: ["Dataset", "Data quality", "Formatting", "Validation"],
    sections: [
      { step: 1, title: "Data is everything", blocks: [{ type: "text", content: "A fine-tuned model is only as good as its training data. Perfect hyperparameters on bad data = bad model. Good data on default hyperparameters = good model.\n\n**Data quality > model size > hyperparameters**" }] },
      { step: 2, title: "Collecting data", blocks: [{ type: "text", content: "Sources:\n\n- **Production logs** (real user queries + responses)\n- **Manual labeling** (hire annotators or do it yourself)\n- **Synthetic generation** (use GPT-4 to generate examples)\n- **Data augmentation** (paraphrase, back-translate)" }, { type: "code", language: "python", label: "Generate synthetic data with GPT-4", code: `from openai import OpenAI\n\nclient = OpenAI()\n\ndef generate_training_examples(task_description: str, n: int = 100):\n    prompt = f\"\"\"Generate {n} diverse training examples for the following task:\n\nTask: {task_description}\n\nFormat each as JSON with 'input' and 'output' fields.\nExamples:\"\"\"\n\n    response = client.chat.completions.create(\n        model="gpt-4o",\n        messages=[{"role": "user", "content": prompt}],\n        temperature=0.8\n    )\n\n    return response.choices[0].message.content\n\n# Example\nexamples = generate_training_examples(\n    "Classify customer support tickets into: refund, bug_report, feature_request, or other",\n    n=50\n)\nprint(examples)` }] },
      { step: 3, title: "Formatting data", blocks: [{ type: "text", content: "Standard formats:" }, { type: "code", language: "json", label: "Instruction-response format", code: `[\n  {\n    "instruction": "Classify the sentiment",\n    "input": "This product is terrible!",\n    "output": "Negative"\n  },\n  {\n    "instruction": "Translate to French",\n    "input": "Hello world",\n    "output": "Bonjour le monde"\n  }\n]` }, { type: "code", language: "json", label: "Chat format (OpenAI)", code: `[\n  {\n    "messages": [\n      {"role": "system", "content": "You are a helpful assistant"},\n      {"role": "user", "content": "What is Python?"},\n      {"role": "assistant", "content": "Python is a programming language..."}\n    ]\n  }\n]` }] },
      { step: 4, title: "Cleaning data", blocks: [{ type: "code", language: "python", label: "Data cleaning pipeline", code: `import hashlib\nfrom collections import Counter\n\ndef clean_dataset(examples: list[dict]) -> list[dict]:\n    # 1. Remove duplicates\n    seen_hashes = set()\n    deduped = []\n    for ex in examples:\n        hash_val = hashlib.md5(str(ex).encode()).hexdigest()\n        if hash_val not in seen_hashes:\n            seen_hashes.add(hash_val)\n            deduped.append(ex)\n\n    print(f"Removed {len(examples) - len(deduped)} duplicates")\n\n    # 2. Filter short outputs (likely incomplete)\n    filtered = [ex for ex in deduped if len(ex.get("output", "")) > 10]\n    print(f"Removed {len(deduped) - len(filtered)} short outputs")\n\n    # 3. Check for PII (basic)\n    import re\n    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'\n    no_pii = []\n    for ex in filtered:\n        text = str(ex)\n        if not re.search(email_pattern, text):\n            no_pii.append(ex)\n    print(f"Removed {len(filtered) - len(no_pii)} with PII")\n\n    return no_pii` }] },
      { step: 5, title: "Validating quality", blocks: [{ type: "text", content: "Quality metrics:\n\n- **Diversity** — how many unique inputs/outputs?\n- **Consistency** — same input, same output?\n- **Correctness** — manual review or LLM-as-judge\n- **Balance** — are classes evenly distributed?" }, { type: "code", language: "python", label: "Quality checks", code: `def validate_quality(examples: list[dict]):\n    # Diversity\n    unique_inputs = len(set(ex["input"] for ex in examples))\n    unique_outputs = len(set(ex["output"] for ex in examples))\n    print(f"Unique inputs: {unique_inputs}/{len(examples)}")\n    print(f"Unique outputs: {unique_outputs}/{len(examples)}")\n\n    # Class balance (if classification)\n    if "label" in examples[0]:\n        labels = [ex["label"] for ex in examples]\n        counts = Counter(labels)\n        print(f"Class distribution: {counts}")\n        imbalance_ratio = max(counts.values()) / min(counts.values())\n        if imbalance_ratio > 10:\n            print(f"⚠️  Severe class imbalance: {imbalance_ratio:.1f}:1")\n\n    # Consistency check\n    input_to_outputs = {}\n    for ex in examples:\n        inp = ex["input"]\n        out = ex["output"]\n        if inp in input_to_outputs:\n            input_to_outputs[inp].add(out)\n        else:\n            input_to_outputs[inp] = {out}\n\n    inconsistent = {k: v for k, v in input_to_outputs.items() if len(v) > 1}\n    if inconsistent:\n        print(f"⚠️  {len(inconsistent)} inputs with multiple outputs")` }] },
      { step: 6, title: "Train/validation split", blocks: [{ type: "code", language: "python", label: "Split dataset", code: `from sklearn.model_selection import train_test_split\n\n# 80/20 split\ntrain, val = train_test_split(examples, test_size=0.2, random_state=42)\n\nprint(f"Training: {len(train)} examples")\nprint(f"Validation: {len(val)} examples")\n\n# Save\nimport json\nwith open("train.jsonl", "w") as f:\n    for ex in train:\n        f.write(json.dumps(ex) + "\\n")\n\nwith open("val.jsonl", "w") as f:\n    for ex in val:\n        f.write(json.dumps(ex) + "\\n")` }] },
      { step: 7, title: "Test yourself", blocks: [{ type: "quiz", question: "Why is data deduplication important for fine-tuning?", options: ["Duplicates cause overfitting and waste training compute", "Duplicates make training faster", "Duplicates improve model quality", "Deduplication isn't necessary"], correct: 0, explanation: "Duplicates cause the model to overfit to repeated examples and waste compute (training on the same example multiple times). Always deduplicate before training." }] },
    ],
  },
  {
    slug: "instruction-tuning",
    trackSlug: "fine-tuning",
    order: 3,
    minutes: 16,
    title: "Instruction Tuning",
    subtitle: "Turn a base model into an instruction-following assistant — the technique behind ChatGPT and Claude.",
    tags: ["Instruction tuning", "FLAN", "Supervised learning"],
    sections: [
      { step: 1, title: "Base model vs instruction model", blocks: [{ type: "text", content: "**Base model:** completes text. 'The capital of France is' → 'Paris, which is known for...'\n\n**Instruction model:** follows commands. 'What is the capital of France?' → 'The capital of France is Paris.'\n\n**Instruction tuning** teaches models to interpret and follow user instructions." }] },
      { step: 2, title: "Instruction dataset format", blocks: [{ type: "code", language: "json", label: "Instruction-response pairs", code: `[\n  {\n    "instruction": "Summarize the following text in one sentence.",\n    "input": "Long article text here...",\n    "output": "One-sentence summary."\n  },\n  {\n    "instruction": "Classify sentiment: positive, negative, or neutral.",\n    "input": "This movie was amazing!",\n    "output": "Positive"\n  }\n]` }, { type: "text", content: "Instruction tuning datasets: **Alpaca** (52k), **FLAN** (1.8M), **Dolly** (15k)" }] },
      { step: 3, title: "Training an instruction model", blocks: [{ type: "code", language: "python", label: "Instruction tuning with SFTTrainer", code: `from transformers import AutoModelForCausalLM, AutoTokenizer\nfrom trl import SFTTrainer, DataCollatorForCompletionOnlyLM\nfrom datasets import load_dataset\n\nmodel = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B")\ntokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B")\n\n# Format as instruction template\ndef format_instruction(example):\n    return f"""### Instruction:\n{example['instruction']}\n\n### Input:\n{example['input']}\n\n### Response:\n{example['output']}"""\n\ndataset = load_dataset("json", data_files="instructions.jsonl")\ndataset = dataset.map(lambda x: {"text": format_instruction(x)})\n\ntrainer = SFTTrainer(\n    model=model,\n    train_dataset=dataset["train"],\n    tokenizer=tokenizer,\n    max_seq_length=512,\n)\n\ntrainer.train()` }] },
      { step: 4, title: "Test yourself", blocks: [{ type: "quiz", question: "What does instruction tuning teach a model?", options: ["To interpret and follow user commands rather than just completing text", "To memorize more facts", "To generate longer outputs", "To be faster"], correct: 0, explanation: "Instruction tuning trains on diverse instruction-response pairs, teaching the model to understand what the user wants and respond appropriately, rather than just predicting the next token." }] },
    ],
  },
  {
    slug: "lora-and-qlora",
    trackSlug: "fine-tuning",
    order: 4,
    minutes: 20,
    title: "LoRA and QLoRA",
    subtitle: "Parameter-efficient fine-tuning — train 0.1% of parameters, get 90% of full fine-tuning quality.",
    tags: ["LoRA", "QLoRA", "PEFT", "Adapters"],
    sections: [
      { step: 1, title: "The LoRA idea", blocks: [{ type: "text", content: "**Full fine-tuning:** Update all 7B parameters. Needs 28GB+ VRAM.\n\n**LoRA:** Freeze base model, train small adapter matrices. Update 4-40M parameters. Needs 8-16GB VRAM.\n\n**Math:** Instead of updating W, train ΔW = BA where B is r×d, A is d×r, and r << d (rank 8-64)." }] },
      { step: 2, title: "LoRA configuration", blocks: [{ type: "code", language: "python", label: "LoRA config", code: `from peft import LoraConfig, get_peft_model\n\nlora_config = LoraConfig(\n    r=16,  # Rank (8-64 typical)\n    lora_alpha=32,  # Scaling factor (usually 2×r)\n    target_modules=["q_proj", "v_proj"],  # Which layers\n    lora_dropout=0.05,\n    bias="none",\n    task_type="CAUSAL_LM",\n)\n\nmodel = get_peft_model(base_model, lora_config)\nmodel.print_trainable_parameters()\n# trainable params: 4.2M (0.06% of 7B)` }, { type: "text", content: "**QLoRA:** LoRA + 4-bit quantization. Fit 70B models on one GPU." }] },
      { step: 3, title: "When LoRA works", blocks: [{ type: "text", content: "LoRA excels at:\n- Style/format adaptation\n- Domain-specific terminology\n- Task-specific patterns\n\nLoRA struggles with:\n- Fundamental capability changes\n- New languages\n- Complex reasoning improvements\n\n**Rule of thumb:** LoRA gets 85-95% of full fine-tuning quality at 1% of cost." }] },
      { step: 4, title: "Test yourself", blocks: [{ type: "quiz", question: "Why is LoRA more efficient than full fine-tuning?", options: ["It only trains low-rank adapter matrices (0.1-1% of parameters)", "It uses a smaller model", "It trains for fewer epochs", "It doesn't need a GPU"], correct: 0, explanation: "LoRA freezes the base model and only trains small adapter matrices, updating 0.1-1% of parameters instead of all billions." }] },
    ],
  },
  {
    slug: "full-fine-tuning",
    trackSlug: "fine-tuning",
    order: 5,
    minutes: 14,
    title: "Full Fine-Tuning",
    subtitle: "When to update all parameters — maximum quality at maximum cost.",
    tags: ["Full fine-tuning", "Distributed training", "DeepSpeed"],
    sections: [
      { step: 1, title: "When full fine-tuning is necessary", blocks: [{ type: "text", content: "Use full fine-tuning when:\n- LoRA quality isn't sufficient\n- Multi-task learning across many domains\n- Fundamental capability changes\n- You have 8+ GPUs available\n\n**Cost:** 10-100x more expensive than LoRA" }] },
      { step: 2, title: "Distributed training", blocks: [{ type: "code", language: "python", label: "DeepSpeed ZeRO Stage 3", code: `from transformers import Trainer, TrainingArguments\n\ntraining_args = TrainingArguments(\n    output_dir="./full-finetuned",\n    per_device_train_batch_size=1,\n    gradient_accumulation_steps=16,\n    num_train_epochs=3,\n    learning_rate=5e-6,\n    fp16=True,\n    deepspeed="ds_config_stage3.json",  # ZeRO-3\n)\n\ntrainer = Trainer(\n    model=model,\n    args=training_args,\n    train_dataset=dataset,\n)\n\ntrainer.train()` }, { type: "text", content: "**DeepSpeed ZeRO-3:** Shard optimizer states, gradients, and parameters across GPUs. Train 70B on 8×80GB GPUs." }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "When should you choose full fine-tuning over LoRA?", options: ["When LoRA quality isn't sufficient and you have the compute budget", "Always, it's always better", "Never, LoRA is always enough", "When you want faster training"], correct: 0, explanation: "Full fine-tuning gives maximum quality but costs 10-100x more. Only use it when LoRA doesn't achieve your quality bar and you can afford the compute." }] },
    ],
  },
  {
    slug: "hyperparameter-tuning",
    trackSlug: "fine-tuning",
    order: 6,
    minutes: 16,
    title: "Hyperparameter Tuning and Training",
    subtitle: "Learning rate, batch size, epochs, warmup — the knobs that determine success or failure.",
    tags: ["Hyperparameters", "Learning rate", "Training loop"],
    sections: [
      { step: 1, title: "Critical hyperparameters", blocks: [{ type: "text", content: "**Learning rate:** Most important. Too high = diverge, too low = no learning.\n\n**Sensible defaults:**\n- Full fine-tuning: 5e-6 to 5e-5\n- LoRA: 1e-4 to 3e-4\n- Start low, increase if training is too slow" }] },
      { step: 2, title: "Other hyperparameters", blocks: [{ type: "text", content: "**Epochs:** 1-5 typical. More = overfitting risk.\n\n**Batch size:** As large as fits in VRAM (1-8 per GPU typical).\n\n**Warmup steps:** 10% of total steps. Gradually increase LR.\n\n**Weight decay:** 0.01 typical. Prevents overfitting.\n\n**LoRA rank/alpha:** r=16, alpha=32 is a safe default." }] },
      { step: 3, title: "Learning rate finder", blocks: [{ type: "code", language: "python", label: "Find optimal learning rate", code: `from transformers import Trainer\nimport matplotlib.pyplot as plt\n\n# Run training with increasing LR\nlrs = [1e-6, 5e-6, 1e-5, 5e-5, 1e-4, 5e-4]\nlosses = []\n\nfor lr in lrs:\n    args = TrainingArguments(\n        output_dir=f"./lr_{lr}",\n        learning_rate=lr,\n        num_train_epochs=1,\n        max_steps=100,\n    )\n    trainer = Trainer(model=model, args=args, train_dataset=dataset)\n    result = trainer.train()\n    losses.append(result.training_loss)\n\n# Plot\nplt.plot(lrs, losses)\nplt.xscale("log")\nplt.xlabel("Learning Rate")\nplt.ylabel("Loss")\nplt.show()\n\n# Pick LR where loss decreases fastest` }] },
      { step: 4, title: "Test yourself", blocks: [{ type: "quiz", question: "What happens if the learning rate is too high?", options: ["Training diverges and loss increases", "Training is too slow", "Model forgets general knowledge", "Model overfits"], correct: 0, explanation: "Too high a learning rate causes unstable training — loss spikes or diverges to infinity. Too low causes slow learning but eventual convergence." }] },
    ],
  },
  {
    slug: "catastrophic-forgetting",
    trackSlug: "fine-tuning",
    order: 7,
    minutes: 12,
    title: "Preventing Catastrophic Forgetting",
    subtitle: "Stop your model from forgetting general knowledge while learning your task — mix in general data.",
    tags: ["Catastrophic forgetting", "Data mixing", "Replay"],
    sections: [
      { step: 1, title: "The forgetting problem", blocks: [{ type: "text", content: "Fine-tune on customer support → model forgets how to code, do math, or answer general questions.\n\n**Catastrophic forgetting:** Narrow training data erases general capabilities." }] },
      { step: 2, title: "Solution: data mixing", blocks: [{ type: "code", language: "python", label: "Mix general and task data", code: `# Load task-specific data\ntask_data = load_dataset("json", data_files="customer_support.jsonl")\n\n# Load general data (10-20% of total)\ngeneral_data = load_dataset("allenai/c4", split="train", streaming=True)\ngeneral_data = general_data.take(200)  # 10% if task_data has 2000\n\n# Combine\nfrom datasets import concatenate_datasets\nmixed_data = concatenate_datasets([task_data["train"], general_data])\n\n# Shuffle\nmixed_data = mixed_data.shuffle(seed=42)\n\n# Train on mixed data\ntrainer = SFTTrainer(model=model, train_dataset=mixed_data, ...)\ntrainer.train()` }] },
      { step: 3, title: "Measuring retention", blocks: [{ type: "text", content: "Test on MMLU (general knowledge) before and after fine-tuning:\n\n**Without mixing:** MMLU drops from 65% → 45%\n**With 15% general data:** MMLU stays at 62%\n\n**Always mix general data when fine-tuning.**" }] },
      { step: 4, title: "Test yourself", blocks: [{ type: "quiz", question: "How do you prevent catastrophic forgetting?", options: ["Mix 10-20% general data into your task-specific training set", "Train for fewer epochs", "Use a larger model", "Don't use LoRA"], correct: 0, explanation: "Mixing general data (10-20% of training set) prevents the model from forgetting general capabilities while learning your specific task." }] },
    ],
  },
  {
    slug: "evaluation-and-benchmarks",
    trackSlug: "fine-tuning",
    order: 8,
    minutes: 18,
    title: "Evaluation and Benchmarking",
    subtitle: "How to know if your fine-tuned model is actually better — task metrics, human eval, LLM-as-judge.",
    tags: ["Evaluation", "Metrics", "Benchmarks", "Human eval"],
    sections: [
      { step: 1, title: "What to measure", blocks: [{ type: "text", content: "**Task-specific metrics:**\n- Classification: Accuracy, F1, Precision, Recall\n- Generation: BLEU, ROUGE, Exact Match\n- Code: Pass@k, CodeBLEU\n\n**General capability:**\n- MMLU (57-subject knowledge)\n- HumanEval (code)\n- GSM8K (math)\n- TruthfulQA (factuality)" }] },
      { step: 2, title: "Human evaluation", blocks: [{ type: "code", language: "python", label: "Set up human eval", code: `# Generate outputs from base and fine-tuned models\ntest_queries = ["How do I reset my password?", ...]\n\nbase_outputs = [base_model.generate(q) for q in test_queries]\nfinetuned_outputs = [finetuned_model.generate(q) for q in test_queries]\n\n# Create annotation task\nimport random\nevals = []\nfor q, base, ft in zip(test_queries, base_outputs, finetuned_outputs):\n    # Randomize order (blind evaluation)\n    if random.random() < 0.5:\n        evals.append({"query": q, "output_a": base, "output_b": ft, "winner": None})\n    else:\n        evals.append({"query": q, "output_a": ft, "output_b": base, "winner": None})\n\n# Annotators rate which is better (A or B)\n# Compute win rate: % where fine-tuned wins` }] },
      { step: 3, title: "LLM-as-judge", blocks: [{ type: "code", language: "python", label: "GPT-4 as judge", code: `from openai import OpenAI\n\nclient = OpenAI()\n\ndef llm_judge(query: str, output1: str, output2: str) -> str:\n    prompt = f\"\"\"Compare these two responses. Which is better?\n\nQuery: {query}\n\nOutput A: {output1}\n\nOutput B: {output2}\n\nRate on:\n1. Correctness\n2. Helpfulness\n3. Clarity\n\nWhich is better? Respond A or B:\"\"\"\n\n    response = client.chat.completions.create(\n        model="gpt-4o",\n        messages=[{"role": "user", "content": prompt}],\n        temperature=0\n    )\n\n    return response.choices[0].message.content.strip()\n\n# Run on test set\nwins = 0\nfor q, base, ft in zip(test_queries, base_outputs, finetuned_outputs):\n    winner = llm_judge(q, base, ft)\n    if winner == "B" and ft == output2:\n        wins += 1\n\nprint(f"Fine-tuned win rate: {wins / len(test_queries):.1%}")` }] },
      { step: 4, title: "Compare baselines", blocks: [{ type: "text", content: "Always compare against:\n\n1. **Base model (no fine-tuning)**\n2. **Base model + prompting**\n3. **Base model + RAG**\n4. **Larger base model (GPT-4)**\n\nIf fine-tuned 7B loses to prompted 70B, reconsider." }] },
      { step: 5, title: "Test yourself", blocks: [{ type: "quiz", question: "Why compare fine-tuned model to prompted baseline?", options: ["To verify fine-tuning actually improves over better prompts", "To make the fine-tuned model look better", "Prompting baselines aren't necessary", "Fine-tuning always beats prompting"], correct: 0, explanation: "Sometimes better prompts achieve the same quality as fine-tuning at zero training cost. Always compare to verify fine-tuning is worth it." }] },
    ],
  },
  {
    slug: "domain-adaptation",
    trackSlug: "fine-tuning",
    order: 9,
    minutes: 16,
    title: "Domain Adaptation: Medical, Legal, Code",
    subtitle: "Fine-tune for specialized domains — medical diagnosis, legal analysis, code generation.",
    tags: ["Domain adaptation", "Medical", "Legal", "Code"],
    sections: [
      { step: 1, title: "Why domain adaptation?", blocks: [{ type: "text", content: "General models underperform in specialized domains:\n\n- **Medical:** Lack clinical terminology, diagnostic reasoning\n- **Legal:** Miss legal precedent, contract language\n- **Code:** Don't know framework-specific idioms\n\n**Domain adaptation** teaches domain-specific patterns." }] },
      { step: 2, title: "Two-stage approach", blocks: [{ type: "text", content: "**Stage 1: Continue pretraining**\nTrain on domain text (unlabeled) to learn terminology.\n\n**Stage 2: Instruction tuning**\nTrain on domain tasks (labeled) to learn applications.\n\nExample: Medical model\n1. Continue pretrain on PubMed papers\n2. Instruction tune on medical Q&A" }] },
      { step: 3, title: "Domain benchmarks", blocks: [{ type: "text", content: "**Medical:**\n- MedQA (medical board exams)\n- PubMedQA (research Q&A)\n\n**Legal:**\n- LegalBench (legal reasoning)\n- ContractNLI (contract understanding)\n\n**Code:**\n- HumanEval (Python functions)\n- MBPP (basic programming problems)\n\nMeasure improvement: General model 45% → Domain-adapted 68%" }] },
      { step: 4, title: "Test yourself", blocks: [{ type: "quiz", question: "What is the two-stage domain adaptation approach?", options: ["Continue pretrain on domain text, then instruction tune on domain tasks", "Just instruction tune twice", "Fine-tune then RAG", "Use a larger model"], correct: 0, explanation: "Stage 1 (continue pretraining) teaches domain vocabulary and patterns from unlabeled text. Stage 2 (instruction tuning) teaches domain-specific tasks from labeled examples." }] },
    ],
  },
  {
    slug: "multi-task-fine-tuning",
    trackSlug: "fine-tuning",
    order: 10,
    minutes: 14,
    title: "Multi-Task Fine-Tuning",
    subtitle: "Train one model on many tasks simultaneously — generalize better, serve more use cases.",
    tags: ["Multi-task learning", "Task mixing", "FLAN"],
    sections: [
      { step: 1, title: "Why multi-task?", blocks: [{ type: "text", content: "**Single-task:** One model per task (translation, summarization, Q&A). Expensive to maintain 10 models.\n\n**Multi-task:** One model handles all tasks. Better generalization, easier deployment." }] },
      { step: 2, title: "Task formatting", blocks: [{ type: "code", language: "json", label: "Task prefixes", code: `[\n  {\n    "instruction": "Translate to French: Hello world",\n    "output": "Bonjour le monde"\n  },\n  {\n    "instruction": "Summarize: Long article...",\n    "output": "Short summary"\n  },\n  {\n    "instruction": "Classify sentiment: This is great!",\n    "output": "Positive"\n  }\n]` }, { type: "text", content: "Task prefix helps model distinguish tasks." }] },
      { step: 3, title: "Task sampling", blocks: [{ type: "text", content: "**Uniform:** Equal samples from each task.\n\n**Proportional:** Sample proportional to dataset size (large datasets dominate).\n\n**Temperature sampling:** Balance between uniform and proportional.\n\n**Best practice:** Start with temperature sampling (T=0.7)." }] },
      { step: 4, title: "Test yourself", blocks: [{ type: "quiz", question: "What is the benefit of multi-task fine-tuning?", options: ["One model handles multiple tasks, improving generalization", "Faster training", "Lower cost", "Doesn't require data"], correct: 0, explanation: "Multi-task learning trains one model on many tasks, which improves generalization (learning from task diversity) and simplifies deployment (one model instead of many)." }] },
    ],
  },
  {
    slug: "deployment-and-serving",
    trackSlug: "fine-tuning",
    order: 11,
    minutes: 18,
    title: "Deployment and Serving Fine-Tuned Models",
    subtitle: "Put your fine-tuned model in production — vLLM, TGI, quantization, API design.",
    tags: ["Deployment", "Serving", "vLLM", "Quantization"],
    sections: [
      { step: 1, title: "Deployment options", blocks: [{ type: "text", content: "**API hosting (managed):**\n- OpenAI fine-tuned models\n- Cohere fine-tuning\n- Together AI\n\n**Self-hosting (control):**\n- vLLM (fast inference)\n- TGI (Text Generation Inference)\n- Ollama (local dev)" }] },
      { step: 2, title: "Deploy with vLLM", blocks: [{ type: "code", language: "bash", label: "Serve model with vLLM", code: `# Install\npip install vllm\n\n# Serve\npython -m vllm.entrypoints.openai.api_server \\\n  --model ./llama-finetuned \\\n  --port 8000 \\\n  --tensor-parallel-size 1\n\n# Query\ncurl http://localhost:8000/v1/completions \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "model": "./llama-finetuned",\n    "prompt": "How do I reset my password?",\n    "max_tokens": 100\n  }'` }] },
      { step: 3, title: "Quantization", blocks: [{ type: "text", content: "**Reduce memory:**\n- FP16: 14GB for 7B model\n- INT8: 7GB\n- INT4 (GPTQ): 3.5GB\n\n**Quality drop:** 1-3% on most tasks.\n\n**Use:** GPTQ for deployment, INT8 for prototyping." }] },
      { step: 4, title: "LoRA adapter swapping", blocks: [{ type: "code", language: "python", label: "Dynamic adapter loading", code: `from vllm import LLM\nfrom peft import PeftModel\n\n# Base model\nllm = LLM(model="meta-llama/Llama-3.2-3B")\n\n# Load adapter dynamically\ndef generate_with_adapter(adapter_path: str, prompt: str):\n    model = llm.model\n    adapter_model = PeftModel.from_pretrained(model, adapter_path)\n    output = adapter_model.generate(prompt)\n    return output\n\n# Switch adapters per request\ngenerate_with_adapter("./customer-support-adapter", "How do I cancel?")\ngenerate_with_adapter("./legal-adapter", "Review this contract")` }] },
      { step: 5, title: "Test yourself", blocks: [{ type: "quiz", question: "What does quantization do?", options: ["Reduces model memory by using lower precision (INT8/INT4)", "Makes training faster", "Improves accuracy", "Removes layers"], correct: 0, explanation: "Quantization converts weights from FP16 to INT8/INT4, reducing memory by 2-4x with minimal quality loss (1-3%)." }] },
    ],
  },
  {
    slug: "project-customer-support",
    trackSlug: "fine-tuning",
    order: 12,
    minutes: 30,
    title: "Project: Fine-Tune for Customer Support",
    subtitle: "End-to-end project — collect data, fine-tune, evaluate, deploy a customer support assistant.",
    tags: ["Project", "Customer support", "Full pipeline"],
    sections: [
      { step: 1, title: "Project overview", blocks: [{ type: "text", content: "Build a customer support model:\n\n1. Collect 1000+ support conversations\n2. Format as instruction-response pairs\n3. Fine-tune Llama 3 8B with LoRA\n4. Evaluate vs baselines\n5. Deploy with vLLM\n6. Build FastAPI endpoint\n\n**Goal:** Beat GPT-4 prompting at 1/10 the cost." }] },
      { step: 2, title: "What you'll learn", blocks: [{ type: "text", content: "- End-to-end fine-tuning pipeline\n- Data collection and cleaning\n- LoRA training and hyperparameter tuning\n- Evaluation (human + LLM-as-judge)\n- Production deployment\n- Cost/quality trade-offs" }] },
      { step: 3, title: "Coming soon", blocks: [{ type: "callout", kind: "tip", content: "Full project spec, starter code, and step-by-step instructions coming soon. Portfolio-ready fine-tuning project." }] },
    ],
  },
];
