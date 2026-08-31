import type { ProjectGuide, Section } from "@/lib/content";

type LlmEvalSpec = {
  slug: string; title: string; description: string; targetSystem: string; metrics: string; evaluation: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: LlmEvalSpec): Section[] {
  return [
    { step: 1, title: "Scope, metrics, and eval strategy", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "LLM evaluation pipeline", chart: "flowchart LR\n  A[App under test] --> O[LLM outputs]\n  O --> R[Reference-based metrics]\n  O --> J[LLM-as-judge scoring]\n  O --> H[Hallucination detector]\n  O --> T[Toxicity & bias classifier]\n  R & J & H & T --> S[Scored eval dataset]\n  S --> D[Dashboard: pass / fail / regression]" },
      { type: "kv", items: [
        { key: "Target system", value: p.targetSystem },
        { key: "Metrics", value: p.metrics },
        { key: "Eval set", value: p.evaluation },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Eval sets go stale — version them like code", content: "Every time you change a prompt, model, or retrieval strategy, re-run the full eval set and diff the scores. Store eval inputs, expected outputs, and scores in version control so you can reproduce any result." },
    ] },
    { step: 2, title: "Build the eval dataset", blocks: [
      { type: "code", language: "bash", label: "Install evaluation dependencies", code: "python -m pip install openai anthropic ragas evaluate bert-score nltk pandas rich" },
      { type: "code", language: "python", label: "Eval dataset schema and loader", code: "import json\nfrom dataclasses import dataclass, field\nfrom typing import Optional\n\n@dataclass\nclass EvalCase:\n    id: str\n    question: str\n    reference_answer: str                 # gold answer for reference-based metrics\n    retrieved_contexts: list[str] = field(default_factory=list)  # RAG chunks if applicable\n    system_output: Optional[str] = None   # filled during eval run\n    metadata: dict = field(default_factory=dict)\n\ndef load_eval_set(path: str) -> list[EvalCase]:\n    with open(path) as f:\n        return [EvalCase(**item) for item in json.load(f)]\n\n# Minimum viable eval set: 50 hand-labelled cases covering\n# normal questions, edge cases, out-of-scope queries, and known failure modes.\nprint('Eval set loaded')" },
      { type: "callout", kind: "gotcha", title: "Never evaluate on training data", content: "If you fine-tuned a model or used your eval questions to improve a prompt, those questions are contaminated. Build the eval set before touching the system, or use a strict temporal split." },
    ] },
    { step: 3, title: "Reference-based metrics: ROUGE and BERTScore", blocks: [
      { type: "code", language: "python", label: "ROUGE-L and BERTScore on all cases", code: "from evaluate import load as load_metric\nfrom typing import Callable\n\nrouge = load_metric('rouge')\nbertscore = load_metric('bertscore')\n\ndef run_reference_metrics(cases: list[EvalCase], generate: Callable[[str], str]):\n    for case in cases:\n        case.system_output = generate(case.question)\n\n    predictions = [c.system_output for c in cases]\n    references  = [c.reference_answer for c in cases]\n\n    rouge_scores = rouge.compute(predictions=predictions, references=references)\n    bs = bertscore.compute(predictions=predictions, references=references, lang='en')\n\n    return {\n        'rouge_l': rouge_scores['rougeL'],\n        'bertscore_f1_mean': sum(bs['f1']) / len(bs['f1']),\n        'n': len(cases),\n    }\n\n# These metrics correlate weakly with human quality for generative tasks.\n# Use them as regression guards, not as quality oracles." },
      { type: "callout", kind: "insight", title: "ROUGE detects regressions, not quality", content: "A sudden ROUGE-L drop of 5+ points signals a prompt or model change broke something. But high ROUGE does not mean the answer is faithful or useful. Always pair reference-based metrics with an LLM judge or human review." },
    ] },
    { step: 4, title: "LLM-as-judge: faithfulness, relevance, groundedness", blocks: [
      { type: "code", language: "python", label: "LLM judge with structured scoring", code: "import json, re\n\nJUDGE_PROMPT = \"\"\"You are an objective evaluator. Score the response on three dimensions.\nReturn only valid JSON.\n\nQuestion: {question}\nRetrieved context: {context}\nResponse: {response}\n\nScore each dimension 1-5:\n- faithfulness: every claim is supported by the context (5=fully grounded, 1=fabricated)\n- relevance: the response directly answers the question (5=fully relevant, 1=off-topic)\n- groundedness: all factual statements trace to the context with no additions (5=fully grounded)\n\nJSON format: {{\"faithfulness\": <int>, \"relevance\": <int>, \"groundedness\": <int>, \"reasoning\": \"<one sentence>\"}}\"\"\"\n\ndef judge_case(case: EvalCase, judge_llm_fn) -> dict:\n    context = '\\n'.join(case.retrieved_contexts) if case.retrieved_contexts else 'No context provided.'\n    prompt = JUDGE_PROMPT.format(\n        question=case.question,\n        context=context[:3000],           # guard against token overflow\n        response=case.system_output or '',\n    )\n    raw = judge_llm_fn(prompt)\n    try:\n        return json.loads(re.search(r'\\{.*\\}', raw, re.DOTALL).group())\n    except Exception:\n        return {'faithfulness': 0, 'relevance': 0, 'groundedness': 0, 'reasoning': 'parse error'}" },
      { type: "callout", kind: "tip", title: "Use a stronger model as judge", content: "The judge model should be at least as capable as the model being evaluated. Use GPT-4o or Claude Sonnet as a judge even when evaluating smaller models. Run the same judge consistently across experiments so scores are comparable." },
    ] },
    { step: 5, title: "Hallucination detection and toxicity checks", blocks: [
      { type: "code", language: "python", label: "Hallucination detection via NLI", code: "from transformers import pipeline\n\nnli = pipeline('text-classification', model='cross-encoder/nli-deberta-v3-small')\n\ndef detect_hallucination(claim: str, context: str, threshold: float = 0.5) -> bool:\n    \"\"\"Returns True if claim is NOT entailed by context (i.e., likely hallucinated).\"\"\"\n    result = nli(f'{context} [SEP] {claim}')[0]\n    if result['label'] == 'ENTAILMENT' and result['score'] >= threshold:\n        return False\n    return True\n\n# Split the system output into sentences and check each against retrieved context.\nimport nltk; nltk.download('punkt_tab', quiet=True)\nfrom nltk.tokenize import sent_tokenize\n\ndef hallucination_rate(cases: list[EvalCase]) -> float:\n    flagged = total = 0\n    for case in cases:\n        context = ' '.join(case.retrieved_contexts)\n        for sent in sent_tokenize(case.system_output or ''):\n            total += 1\n            if detect_hallucination(sent, context):\n                flagged += 1\n    return flagged / total if total else 0.0" },
      { type: "code", language: "python", label: "Aggregate results and render report", code: "import pandas as pd\nfrom rich.table import Table\nfrom rich.console import Console\n\ndef build_report(cases: list[EvalCase], judge_scores: list[dict]) -> pd.DataFrame:\n    rows = []\n    for case, scores in zip(cases, judge_scores):\n        rows.append({\n            'id': case.id,\n            'question': case.question[:60] + '...' if len(case.question) > 60 else case.question,\n            'faithfulness': scores.get('faithfulness', 0),\n            'relevance': scores.get('relevance', 0),\n            'groundedness': scores.get('groundedness', 0),\n            'reasoning': scores.get('reasoning', ''),\n        })\n    return pd.DataFrame(rows)\n\ndef print_summary(df: pd.DataFrame):\n    console = Console()\n    table = Table(title='LLM Eval Summary')\n    for col in ['Metric', 'Mean', 'Pass Rate (>=4)']:\n        table.add_column(col)\n    for metric in ['faithfulness', 'relevance', 'groundedness']:\n        mean = df[metric].mean()\n        pass_rate = (df[metric] >= 4).mean()\n        table.add_row(metric, f'{mean:.2f}', f'{pass_rate:.0%}')\n    console.print(table)" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Publish your eval dataset (sanitized), judge prompt, all metric scores before and after at least one improvement, hallucination rate, and a screenshot of the report. Describe what changed and what the scores revealed — the reasoning matters more than the numbers." },
    ] },
  ];
}

const specs: LlmEvalSpec[] = [
  {
    slug: "llm-eval-system",
    title: "Build an LLM Evaluation System for Your Own App",
    hours: 10,
    description: "Design and implement a repeatable evaluation harness for any LLM-powered application — RAG pipeline, chatbot, or agent. Measure faithfulness, relevance, groundedness, hallucination rate, and toxicity, and produce a versioned report you can diff across prompt or model changes.",
    targetSystem: "Any LLM app you built: a RAG assistant, fine-tuned model, or chat interface. The harness is app-agnostic.",
    metrics: "ROUGE-L (regression guard), BERTScore-F1, LLM-as-judge (faithfulness / relevance / groundedness 1-5), NLI-based hallucination rate.",
    evaluation: "50–200 manually curated (question, reference-answer, retrieved-context) triples. Hold out at least 20 for a locked test set never used during prompt iteration.",
    risk: "LLM judges have their own biases. Do not rely on a single judge model. Spot-check 10–20 % of scored cases by hand and document where the judge disagrees with human reviewers.",
    extensions: [
      "Add a CI step that runs the eval harness on every PR and comments the score diff on GitHub",
      "Implement A/B prompt comparison: run both prompt variants on the same eval set and report the delta",
      "Add RAGAS metrics (context precision, context recall, answer correctness) for RAG-specific evaluation",
      "Build a disagreement detector: flag cases where the LLM judge score and the NLI hallucination flag contradict each other",
      "Add toxicity and bias scoring with a dedicated classifier (e.g. Detoxify) and report by demographic category",
    ],
  },
];

export const llmEvaluationProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "llm-evaluation",
  title: p.title,
  description: p.description,
  techStack: ["Python", "RAGAS", "Evaluate", "BERTScore", "Transformers", "Pandas", "Rich"],
  difficulty: "intermediate",
  estimatedHours: p.hours,
  sections: sections(p),
}));
