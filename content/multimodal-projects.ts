import type { ProjectGuide, Section } from "@/lib/content";

type MultimodalSpec = {
  slug: string; title: string; description: string; modalities: string; pipeline: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: MultimodalSpec): Section[] {
  return [
    { step: 1, title: "Modalities, pipeline design, and safety boundaries", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "Multimodal processing pipeline", chart: "flowchart LR\n  I[Raw input\\n image / audio / video] --> P[Pre-process\\n resize / denoise / chunk]\n  P --> M[Multimodal model\\n vision + language]\n  M --> E[Extract structured data]\n  E --> V[Validate + confidence score]\n  V -->|high confidence| O[Output]\n  V -->|low confidence| H[Human review queue]" },
      { type: "kv", items: [
        { key: "Modalities", value: p.modalities },
        { key: "Pipeline", value: p.pipeline },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Always validate extracted data before using it", content: "Vision models hallucinate field values, misread numbers, and invent dates on low-quality scans. Every extracted field needs a confidence score and a validation rule. Route low-confidence extractions to a human review queue rather than passing them downstream silently." },
    ] },
    { step: 2, title: "Pre-process inputs and prepare for the model", blocks: [
      { type: "code", language: "bash", label: "Install multimodal dependencies", code: "python -m pip install anthropic openai pillow pymupdf pydub openai-whisper pydantic httpx rich" },
      { type: "code", language: "python", label: "Image pre-processing and base64 encoding", code: "import base64\nfrom io import BytesIO\nfrom pathlib import Path\nfrom PIL import Image\n\ndef load_image_b64(path: str, max_size: int = 1568) -> tuple[str, str]:\n    \"\"\"Load an image, resize to fit within max_size px on the long edge, return (base64, mime_type).\"\"\"\n    img = Image.open(path).convert('RGB')\n    w, h = img.size\n    if max(w, h) > max_size:\n        scale = max_size / max(w, h)\n        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)\n    buf = BytesIO()\n    img.save(buf, format='JPEG', quality=90)\n    return base64.standard_b64encode(buf.getvalue()).decode(), 'image/jpeg'\n\ndef load_pdf_pages_b64(path: str) -> list[tuple[str, str]]:\n    \"\"\"Render each PDF page to an image and return base64 encoded pages.\"\"\"\n    import fitz  # PyMuPDF\n    doc = fitz.open(path)\n    pages = []\n    for page in doc:\n        pix = page.get_pixmap(dpi=150)\n        img = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)\n        buf = BytesIO()\n        img.save(buf, format='JPEG', quality=85)\n        pages.append((base64.standard_b64encode(buf.getvalue()).decode(), 'image/jpeg'))\n    return pages" },
      { type: "callout", kind: "gotcha", title: "Image resolution matters more than file size", content: "Too small and text becomes unreadable. Too large and you waste tokens. For document OCR, render at 150 dpi and resize so the long edge is under 1568 px — the sweet spot for Claude's vision. Always check the extracted text on a few test images before running a full batch." },
    ] },
    { step: 3, title: "Extract structured data with a vision-language model", blocks: [
      { type: "code", language: "python", label: "Vision extraction with structured output", code: "import anthropic, json, re\nfrom pydantic import BaseModel\n\nclient = anthropic.Anthropic()\n\ndef extract_with_vision(image_b64: str, mime: str, schema_description: str, output_schema: type[BaseModel]) -> BaseModel | None:\n    response = client.messages.create(\n        model='claude-opus-5',\n        max_tokens=1024,\n        messages=[{\n            'role': 'user',\n            'content': [\n                {'type': 'image', 'source': {'type': 'base64', 'media_type': mime, 'data': image_b64}},\n                {'type': 'text', 'text': f'Extract the following from this image.\\n{schema_description}\\nReturn only valid JSON matching the schema. If a field is not visible, use null.'},\n            ],\n        }],\n    )\n    text = response.content[0].text\n    try:\n        data = json.loads(re.search(r'\\{.*\\}', text, re.DOTALL).group())\n        return output_schema(**data)\n    except Exception as e:\n        print(f'Extraction failed: {e}\\nRaw: {text[:200]}')\n        return None" },
      { type: "callout", kind: "insight", title: "Prompt the model to return null for missing fields", content: "Without this instruction the model invents plausible-looking values for fields it cannot read. Explicitly instruct it to use null for any field that is not clearly visible in the image, then treat nulls as requiring human review rather than downstream processing." },
    ] },
    { step: 4, title: "Validate, score confidence, and handle failures", blocks: [
      { type: "code", language: "python", label: "Confidence scoring and human review routing", code: "from pydantic import BaseModel\nfrom typing import Any\n\nclass ExtractionResult(BaseModel):\n    data: dict[str, Any]\n    confidence: float          # 0.0 – 1.0\n    missing_fields: list[str]\n    needs_review: bool\n\ndef score_extraction(extracted: BaseModel | None, required_fields: list[str]) -> ExtractionResult:\n    if extracted is None:\n        return ExtractionResult(data={}, confidence=0.0, missing_fields=required_fields, needs_review=True)\n\n    data = extracted.model_dump()\n    present = [f for f in required_fields if data.get(f) is not None]\n    missing = [f for f in required_fields if data.get(f) is None]\n    confidence = len(present) / len(required_fields) if required_fields else 1.0\n\n    return ExtractionResult(\n        data=data,\n        confidence=confidence,\n        missing_fields=missing,\n        needs_review=confidence < 0.85 or bool(missing),\n    )\n\ndef route(result: ExtractionResult):\n    if result.needs_review:\n        print(f'[REVIEW QUEUE] confidence={result.confidence:.0%} missing={result.missing_fields}')\n    else:\n        print(f'[AUTO-PROCESS] confidence={result.confidence:.0%}')\n        return result.data" },
      { type: "callout", kind: "tip", title: "Build the human review queue before automating anything", content: "Start with a 100 % human-review rate. Measure how often the model is correct on each field. Gradually raise the auto-process threshold field by field once you have ground-truth data. Never automate a field you haven't measured." },
    ] },
    { step: 5, title: "Evaluate accuracy and ship", blocks: [
      { type: "code", language: "python", label: "Field-level accuracy evaluation", code: "from dataclasses import dataclass\n\n@dataclass\nclass EvalCase:\n    image_path: str\n    ground_truth: dict[str, str]\n\ndef evaluate_pipeline(cases: list[EvalCase], extract_fn) -> dict:\n    field_correct: dict[str, int] = {}\n    field_total: dict[str, int] = {}\n\n    for case in cases:\n        b64, mime = load_image_b64(case.image_path)\n        extracted = extract_fn(b64, mime)\n        result = score_extraction(extracted, list(case.ground_truth.keys()))\n\n        for field, expected in case.ground_truth.items():\n            field_total[field] = field_total.get(field, 0) + 1\n            got = str(result.data.get(field, '')).strip().lower()\n            if got == expected.strip().lower():\n                field_correct[field] = field_correct.get(field, 0) + 1\n\n    return {\n        field: f\"{field_correct.get(field, 0) / field_total[field]:.0%}\"\n        for field in field_total\n    }\n\n# Target: >95 % accuracy per required field before enabling auto-processing." },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Publish field-level accuracy on a 20+ image test set (real or synthetic), example input/output pairs, your confidence threshold choices and the rationale, the human review queue flow, and a short screen recording of the pipeline processing a real file end-to-end." },
    ] },
  ];
}

const specs: MultimodalSpec[] = [
  {
    slug: "ai-invoice-processor",
    title: "AI Invoice Processor",
    hours: 10,
    description: "Build a multimodal pipeline that accepts invoice images or PDFs, extracts structured fields (vendor, date, line items, totals, tax), validates the results, routes low-confidence extractions to a human review queue, and exports clean JSON ready for an accounting system.",
    modalities: "Image (JPEG/PNG) and PDF (rendered to images). Single-page and multi-page invoices.",
    pipeline: "Load → render PDF pages → resize for vision model → extract structured JSON → validate fields → confidence score → auto-process or human review queue → export.",
    risk: "Never post extracted financial data to external services without authorization. Flag currency and total mismatches for human review. Do not trust extracted totals — recompute line-item sums and compare.",
    extensions: [
      "Add a line-item reconciliation step that recomputes subtotals from extracted quantities and unit prices and flags discrepancies",
      "Support multi-currency invoices: detect the currency symbol and normalize amounts to a base currency",
      "Build a FastAPI endpoint that accepts a file upload and returns the extraction result as JSON",
      "Add a duplicate-detection step that flags invoices with the same vendor, date, and total as a previous submission",
    ],
  },
  {
    slug: "meeting-assistant",
    title: "Meeting Assistant",
    hours: 10,
    description: "Create a meeting assistant that transcribes audio recordings with Whisper, segments the transcript by speaker using diarization, generates a structured summary with key decisions and action items, and delivers a formatted report with owner and deadline for each action.",
    modalities: "Audio (MP3/WAV/M4A). Optional: video file from which audio is extracted.",
    pipeline: "Load audio → chunk into segments → transcribe with Whisper → diarize speakers → send transcript to LLM → extract decisions and action items → format and deliver report.",
    risk: "Never process meeting recordings without explicit consent from all participants. Redact or anonymize PII before sending transcripts to external LLM APIs. Store transcripts at rest with encryption.",
    extensions: [
      "Add speaker diarization using pyannote.audio to label each transcript segment with an estimated speaker ID",
      "Implement a follow-up tracker: detect action items from previous meetings and check if they appear as completed in the current one",
      "Add a real-time mode using streaming Whisper transcription so summaries appear as the meeting progresses",
      "Build a Slack or email delivery tool that posts the formatted action-item list to the relevant channel after the meeting ends",
    ],
  },
];

export const multimodalProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "multimodal",
  title: p.title,
  description: p.description,
  techStack: ["Python", "Anthropic SDK", "Pillow", "PyMuPDF", "Whisper", "Pydantic", "FastAPI"],
  difficulty: "intermediate",
  estimatedHours: p.hours,
  sections: sections(p),
}));
