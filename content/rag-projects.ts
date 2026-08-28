import type { ProjectGuide, Section } from "@/lib/content";

type RagSpec = {
  slug: string; title: string; description: string; corpus: string; source: string; risk: string; evaluation: string; extensions: string[]; hours: number;
};

function sections(p: RagSpec): Section[] {
  return [
    { step: 1, title: "Scope, corpus, and safeguards", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "Grounded RAG pipeline", chart: "flowchart LR\n  D[Authorized documents] --> C[Extract + chunk + metadata]\n  C --> E[TensorFlow embeddings]\n  E --> V[Vector / hybrid index]\n  Q[Question] --> R[Retrieve + filter + rerank]\n  V --> R\n  R --> G[LLM answer using only context]\n  G --> A[Answer + citations / abstain]" },
      { type: "kv", items: [
        { key: "Corpus", value: p.corpus }, { key: "Data source", value: p.source },
        { key: "Evaluation", value: p.evaluation }, { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Retrieval authorization is mandatory", content: "Only index content the intended users are permitted to access. Apply document-level access filters before retrieval, preserve source/version metadata, and implement deletion/re-indexing for removed documents." },
    ] },
    { step: 2, title: "Ingest and chunk with parent metadata", blocks: [
      { type: "code", language: "bash", label: "Install core components", code: "python -m pip install tensorflow tensorflow-hub hnswlib pypdf fastapi pydantic" },
      { type: "code", language: "python", label: "Keep chunk and parent links", code: "from pathlib import Path\nfrom pypdf import PdfReader\n\ndef load_pdf(path: str):\n    reader = PdfReader(path)\n    return [{\"parent_id\": Path(path).stem, \"page\": i + 1, \"text\": page.extract_text() or \"\", \"source\": path}\n            for i, page in enumerate(reader.pages)]\n\ndef chunk_pages(pages, size=900, overlap=150):\n    chunks = []\n    for page in pages:\n        text = \" \".join(page[\"text\"].split())\n        for start in range(0, len(text), size - overlap):\n            part = text[start:start + size]\n            if part: chunks.append({**page, \"chunk_id\": f\"{page['parent_id']}:{page['page']}:{start}\", \"text\": part})\n    return chunks\n# Add ACL/category/effective_date fields here; never infer permissions from prompt text." },
      { type: "callout", kind: "gotcha", title: "PDF extraction is not OCR", content: "Scanned PDFs often have no text layer. Detect extraction failures, route them through an OCR workflow, and retain page/box provenance so a user can inspect the original source." },
    ] },
    { step: 3, title: "Embed and retrieve with TensorFlow", blocks: [
      { type: "code", language: "python", label: "TensorFlow embeddings + HNSW", code: "import numpy as np\nimport hnswlib\nimport tensorflow_hub as hub\n\nencoder = hub.load(\"https://tfhub.dev/google/universal-sentence-encoder/4\")\nchunks = chunk_pages(load_pdf(\"data/example.pdf\"))\nvectors = encoder([c[\"text\"] for c in chunks]).numpy().astype(np.float32)\nvectors /= np.linalg.norm(vectors, axis=1, keepdims=True).clip(min=1e-12)\nindex = hnswlib.Index(space=\"cosine\", dim=vectors.shape[1])\nindex.init_index(max_elements=len(chunks), ef_construction=200, M=16)\nindex.add_items(vectors, np.arange(len(chunks))); index.set_ef(64)\n\ndef retrieve(query, k=5, allowed_parent_ids=None):\n    q = encoder([query]).numpy().astype(np.float32)\n    q /= np.linalg.norm(q, axis=1, keepdims=True).clip(min=1e-12)\n    labels, distances = index.knn_query(q, k=min(k * 4, len(chunks)))\n    candidates = [{**chunks[int(i)], \"score\": 1 - float(d)} for i, d in zip(labels[0], distances[0])]\n    if allowed_parent_ids is not None:\n        candidates = [c for c in candidates if c[\"parent_id\"] in allowed_parent_ids]\n    return candidates[:k]" },
      { type: "callout", kind: "insight", title: "Retrieval is a separate measurable system", content: "Before asking any LLM to answer, inspect the retrieved chunks. If the source is absent from top-k, generation prompts cannot repair the failure—fix chunking, embeddings, filters, query rewrite, or reranking first." },
    ] },
    { step: 4, title: "Generate only from retrieved evidence", blocks: [
      { type: "code", language: "python", label: "Provider-agnostic grounded prompt", code: "def build_grounded_prompt(question, retrieved):\n    context = \"\\n\\n\".join(\n        f\"[source={c['source']} page={c['page']} chunk={c['chunk_id']}]\\n{c['text']}\"\n        for c in retrieved\n    )\n    return f\"\"\"Answer only from the supplied sources. If the sources do not answer the question, say: I don't have enough information in the indexed documents. Cite every factual claim with its source tag.\\n\\nSOURCES:\\n{context}\\n\\nQUESTION: {question}\"\"\"\n\n# Send this prompt to your approved LLM provider, then verify every returned citation\n# refers to a retrieved source tag before displaying the answer." },
      { type: "code", language: "python", label: "Abstention gate", code: "def should_abstain(retrieved, min_score=0.45):\n    return not retrieved or retrieved[0][\"score\"] < min_score\n\nresults = retrieve(\"your question\")\nif should_abstain(results):\n    response = \"I don't have enough information in the indexed documents.\"\nelse:\n    response = call_your_llm(build_grounded_prompt(\"your question\", results))" },
      { type: "callout", kind: "warning", title: "Do not silently fill gaps", content: "Groundedness requires an abstention path. A fluent, unsupported answer is worse than a clear ‘not found’ result for a document assistant." },
    ] },
    { step: 5, title: "Evaluate and ship", blocks: [
      { type: "code", language: "python", label: "Retrieval evaluation harness", code: "EVAL = [\n  {\"question\": \"example question\", \"relevant_parent_ids\": {\"example\"}},\n]\ndef recall_at_k(k=5):\n    hits = 0\n    for item in EVAL:\n        found = {r[\"parent_id\"] for r in retrieve(item[\"question\"], k=k)}\n        hits += bool(found & item[\"relevant_parent_ids\"])\n    return hits / len(EVAL)\nprint(f\"Retrieval Recall@5: {recall_at_k():.1%}\")\n# Also label faithfulness: is every answer claim supported by a cited chunk?" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Publish architecture, data permissions, chunk settings, embedding/index version, labelled retrieval set, Recall@k, answer-faithfulness results, limitations, and a screenshot showing answer citations. Do not publish private documents or access tokens." },
    ] },
  ];
}

const specs: RagSpec[] = [
  { slug: "chat-with-pdf", title: "Chat with PDF", hours: 6,
    description: "Create a PDF question-answering assistant that cites page-level evidence and abstains when a question is not supported. Start with public documentation or a PDF you own.",
    corpus: "Public technical papers, manuals, or your own authorized PDFs.", source: "Your permitted PDF collection; record title, URL/path, version, and license.", evaluation: "Page-level retrieval Recall@k and citation faithfulness on 20–50 manually labelled questions.", risk: "Do not imply the assistant read scanned/unindexed pages; show citations and a not-found state.", extensions: ["Add parent-child retrieval: rank short chunks, display surrounding page context", "Add OCR fallback with page image review", "Add document/version filters and re-index on replacement"] },
  { slug: "chat-with-company-policies", title: "Chat with Company Policies", hours: 8,
    description: "Build a policy assistant that answers employee questions with policy section citations, effective dates, and role-aware access controls. Use fictional/sample policies unless you have explicit approval for company content.",
    corpus: "Approved HR, travel, security, and benefits policies, each with owner and effective date.", source: "Fictional policy set or explicitly authorized internal documents.", evaluation: "Retrieval Recall@k by policy/version, citation correctness, and abstention accuracy on missing-policy questions.", risk: "Policy answers are informational; route exceptions, conflicting versions, and personal cases to the policy owner.", extensions: ["Filter by employee role, region, and policy effective date before retrieval", "Add version-diff summaries with human approval", "Log feedback without retaining sensitive employee questions"] },
  { slug: "chat-with-source-code", title: "Chat with Source Code", hours: 9,
    description: "Make a source-code assistant that locates relevant symbols, files, and tests before drafting an explanation. Preserve repository revision and file paths so every response can be verified in the codebase.",
    corpus: "A repository you own or are authorized to index, chunked by function/class/module instead of arbitrary character windows.", source: "Local permitted Git repository at a pinned commit SHA.", evaluation: "Symbol/file Recall@k, citation path/line correctness, and developer review of proposed explanations.", risk: "Never execute generated commands automatically; treat code answers as suggestions requiring normal review and tests.", extensions: ["Use AST-aware chunking and store imports, symbols, and commit SHA as metadata", "Hybrid BM25 + embedding search for exact identifiers", "Retrieve associated tests and documentation alongside implementation files"] },
  { slug: "customer-support-assistant", title: "Customer Support Assistant", hours: 8,
    description: "Create a support assistant that retrieves approved help-center content, cites it, and hands off uncertain or account-specific requests rather than fabricating an answer.",
    corpus: "Approved FAQ, product documentation, troubleshooting articles, and anonymized support macros.", source: "Your authorized help-center export; a synthetic FAQ is suitable for a public demo.", evaluation: "Answer resolution rate, retrieval Recall@k, faithfulness, escalation precision, and latency.", risk: "Do not expose account data or make refunds, cancellations, or security changes through retrieval alone.", extensions: ["Add intent/urgency classification and a human handoff queue", "Use metadata filters for product, plan, locale, and article freshness", "Create a red-team set for prompt injection, policy conflict, and unsupported requests"] },
  { slug: "legal-document-assistant", title: "Legal Document Assistant", hours: 10,
    description: "Build a legal-document navigator that retrieves clauses, definitions, and source pages from authorized contracts. It is a research/navigation tool, not legal advice or an autonomous reviewer.",
    corpus: "Public sample contracts or contracts processed with explicit legal and organizational approval.", source: "Public contract datasets/sample agreements or strictly authorized document sets.", evaluation: "Clause retrieval Recall@k, exact citation/page accuracy, and expert review of abstentions and summaries.", risk: "Prominently label outputs as informational. Do not provide legal advice, accept terms, or make compliance conclusions without qualified review.", extensions: ["Chunk by clause/section and retain defined-term links", "Add jurisdiction, contract type, and execution-date metadata filters", "Require human approval for any summary, redline, or risk label"] },
];

export const ragProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug, trackSlug: "rag", title: p.title, description: p.description,
  techStack: ["Python", "TensorFlow", "TensorFlow Hub", "hnswlib", "FastAPI", "LLM API"],
  difficulty: p.slug === "legal-document-assistant" ? "advanced" : "intermediate",
  estimatedHours: p.hours, sections: sections(p),
}));
