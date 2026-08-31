import type { ProjectGuide, Section } from "@/lib/content";

type FineTuningSpec = {
  slug: string; title: string; description: string; baseModel: string; dataset: string; evaluation: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: FineTuningSpec): Section[] {
  return [
    { step: 1, title: "Scope, base model, and data strategy", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "LoRA fine-tuning pipeline", chart: "flowchart LR\n  D[Raw customer support data] --> C[Clean + deduplicate + format]\n  C --> T[Train / val / test split]\n  T --> L[LoRA adapter training]\n  B[Base LLM frozen weights] --> L\n  L --> A[Merged adapter + base]\n  A --> E[Evaluate: ROUGE, BERTScore, human review]\n  E --> S[Serve with vLLM / Ollama]" },
      { type: "kv", items: [
        { key: "Base model", value: p.baseModel },
        { key: "Dataset", value: p.dataset },
        { key: "Evaluation", value: p.evaluation },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Fine-tuning does not add knowledge it wasn't trained on", content: "LoRA adapts style, format, and domain vocabulary — it does not reliably inject new facts. For up-to-date or private knowledge, combine fine-tuning with RAG rather than hoping the model memorizes your corpus." },
    ] },
    { step: 2, title: "Prepare and inspect the dataset", blocks: [
      { type: "code", language: "bash", label: "Install dependencies", code: "python -m pip install transformers datasets peft bitsandbytes trl accelerate evaluate bert-score" },
      { type: "code", language: "python", label: "Load, clean, and format training pairs", code: "from datasets import Dataset\nimport json, re\n\ndef clean_text(t: str) -> str:\n    t = re.sub(r'<[^>]+>', '', t)          # strip HTML tags\n    t = re.sub(r'\\s+', ' ', t).strip()\n    return t\n\ndef load_support_pairs(path: str):\n    with open(path) as f:\n        raw = json.load(f)\n    records = []\n    for item in raw:\n        q = clean_text(item.get('question', ''))\n        a = clean_text(item.get('answer', ''))\n        if len(q) < 20 or len(a) < 20:\n            continue                        # skip degenerate pairs\n        records.append({'input': q, 'output': a})\n    return Dataset.from_list(records)\n\nds = load_support_pairs('data/support_pairs.json')\nprint(ds[0])  # always inspect a sample before training" },
      { type: "callout", kind: "gotcha", title: "Data quality beats data quantity", content: "200 high-quality, consistent instruction-response pairs outperform 10,000 noisy ones. Inspect every length outlier, remove PII before training, and hold out at least 10 % as a validation split you never touch during training." },
    ] },
    { step: 3, title: "Format for instruction tuning and tokenize", blocks: [
      { type: "code", language: "python", label: "Apply chat template and tokenize", code: "from transformers import AutoTokenizer\n\ntokenizer = AutoTokenizer.from_pretrained('mistralai/Mistral-7B-Instruct-v0.3')\ntokenizer.pad_token = tokenizer.eos_token\n\nPROMPT_TEMPLATE = \"\"\"<s>[INST] You are a helpful customer support agent. Answer clearly and concisely.\n\n{input} [/INST] {output}</s>\"\"\"\n\ndef tokenize(example):\n    full = PROMPT_TEMPLATE.format(**example)\n    tok = tokenizer(full, truncation=True, max_length=512, padding='max_length')\n    # mask prompt tokens so loss only applies to the response\n    input_len = len(tokenizer(PROMPT_TEMPLATE.split('{output}')[0].format(**example))['input_ids'])\n    labels = [-100] * input_len + tok['input_ids'][input_len:]\n    tok['labels'] = labels\n    return tok\n\ntokenized = ds.map(tokenize, remove_columns=ds.column_names)" },
      { type: "callout", kind: "insight", title: "Masking prompt tokens is critical", content: "If you compute loss over the prompt as well as the response, the model learns to predict your instruction text, not just the response. Always set prompt token labels to -100 so the loss function ignores them." },
    ] },
    { step: 4, title: "Configure LoRA and run training", blocks: [
      { type: "code", language: "python", label: "QLoRA training with PEFT + TRL", code: "import torch\nfrom transformers import AutoModelForCausalLM, BitsAndBytesConfig, TrainingArguments\nfrom peft import LoraConfig\nfrom trl import SFTTrainer\n\nbnb_config = BitsAndBytesConfig(\n    load_in_4bit=True,\n    bnb_4bit_quant_type='nf4',\n    bnb_4bit_compute_dtype=torch.float16,\n)\nmodel = AutoModelForCausalLM.from_pretrained(\n    'mistralai/Mistral-7B-Instruct-v0.3',\n    quantization_config=bnb_config,\n    device_map='auto',\n)\nmodel.config.use_cache = False\n\nlora_config = LoraConfig(\n    r=16,\n    lora_alpha=32,\n    target_modules=['q_proj', 'v_proj'],\n    lora_dropout=0.05,\n    bias='none',\n    task_type='CAUSAL_LM',\n)\n\ntraining_args = TrainingArguments(\n    output_dir='./checkpoints',\n    num_train_epochs=3,\n    per_device_train_batch_size=4,\n    gradient_accumulation_steps=4,\n    warmup_steps=50,\n    learning_rate=2e-4,\n    fp16=True,\n    logging_steps=25,\n    save_strategy='epoch',\n    evaluation_strategy='epoch',\n    load_best_model_at_end=True,\n)\n\ntrainer = SFTTrainer(\n    model=model,\n    train_dataset=tokenized['train'],\n    eval_dataset=tokenized['validation'],\n    peft_config=lora_config,\n    args=training_args,\n)\ntrainer.train()" },
      { type: "callout", kind: "tip", title: "Start with r=8 or r=16", content: "Larger rank = more adapter parameters = higher risk of overfitting small datasets. Start low, check validation loss curves, and only increase rank if the model underfits after 3 epochs." },
    ] },
    { step: 5, title: "Evaluate and merge the adapter", blocks: [
      { type: "code", language: "python", label: "ROUGE + BERTScore evaluation", code: "from evaluate import load as load_metric\nfrom peft import PeftModel\nimport torch\n\nrouge = load_metric('rouge')\nbertscore = load_metric('bertscore')\n\ndef generate(model, tokenizer, prompt, max_new=200):\n    inputs = tokenizer(prompt, return_tensors='pt').to(model.device)\n    with torch.no_grad():\n        out = model.generate(**inputs, max_new_tokens=max_new, do_sample=False)\n    return tokenizer.decode(out[0][inputs.input_ids.shape[-1]:], skip_special_tokens=True)\n\n# Evaluate on held-out test split\npredictions, references = [], []\nfor ex in test_set:\n    pred = generate(model, tokenizer, ex['input'])\n    predictions.append(pred)\n    references.append(ex['output'])\n\nprint(rouge.compute(predictions=predictions, references=references))\nprint(bertscore.compute(predictions=predictions, references=references, lang='en'))" },
      { type: "code", language: "python", label: "Merge adapter and save", code: "from peft import PeftModel\nfrom transformers import AutoModelForCausalLM\n\nbase = AutoModelForCausalLM.from_pretrained('mistralai/Mistral-7B-Instruct-v0.3', torch_dtype='auto')\nmerged = PeftModel.from_pretrained(base, './checkpoints/final').merge_and_unload()\nmerged.save_pretrained('./merged-model')\ntokenizer.save_pretrained('./merged-model')\nprint('Merged model saved — ready for vLLM or Ollama')" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Publish your base model choice, LoRA rank/alpha, dataset size and cleaning steps, training curves, ROUGE/BERTScore on the test split, and at least 10 side-by-side base-vs-fine-tuned output comparisons. Never publish training data containing real customer PII." },
    ] },
  ];
}

const specs: FineTuningSpec[] = [
  {
    slug: "customer-support-fine-tune",
    title: "Fine-tune a Base Model for Customer Support",
    hours: 12,
    description: "Adapt a 7B instruction-following LLM with LoRA so it answers customer support questions in a consistent brand voice, follows escalation rules, and refuses to invent policy details.",
    baseModel: "Mistral-7B-Instruct-v0.3 (or Llama-3-8B-Instruct) — both run on a single consumer GPU with QLoRA.",
    dataset: "200–2,000 curated (question, answer) pairs scraped from a public help-centre or synthetic pairs you write. Split 80/10/10 train/val/test. Remove PII before training.",
    evaluation: "ROUGE-L, BERTScore-F1, and 50 human-reviewed outputs on a held-out test set. Compare against the zero-shot base model on the same prompts.",
    risk: "Do not include real customer data without explicit authorization and PII scrubbing. Fine-tuned models can hallucinate policies — add a RAG layer or abstention guard for high-stakes answers.",
    extensions: [
      "Add a RAG retrieval layer so the fine-tuned model grounds answers in an authoritative knowledge base",
      "Run DPO (Direct Preference Optimization) on human preference pairs to reduce hallucinations",
      "Serve the merged model with Ollama locally or vLLM for production-grade throughput",
      "Add catastrophic-forgetting checks: evaluate on a general-knowledge benchmark before and after fine-tuning",
      "Automate the eval harness and training trigger with a CI/CD pipeline on new data",
    ],
  },
];

export const fineTuningProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "fine-tuning",
  title: p.title,
  description: p.description,
  techStack: ["Python", "Hugging Face Transformers", "PEFT", "TRL", "BitsAndBytes", "Datasets", "Evaluate"],
  difficulty: "advanced",
  estimatedHours: p.hours,
  sections: sections(p),
}));
