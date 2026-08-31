import type { ProjectGuide, Section } from "@/lib/content";

type CapstoneSpec = {
  slug: string; title: string; description: string; stack: string; deliverable: string; risk: string; extensions: string[]; hours: number;
};

// ─── Beginner ────────────────────────────────────────────────────────────────
function beginnerSections(p: CapstoneSpec): Section[] {
  return [
    { step: 1, title: "Project scope and architecture", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "AI Chatbot architecture", chart: "flowchart LR\n  U[User browser] -->|message| R[React frontend]\n  R -->|POST /chat| F[FastAPI backend]\n  F -->|messages| L[LLM API]\n  L -->|stream tokens| F\n  F -->|SSE stream| R\n  R -->|render| U" },
      { type: "kv", items: [
        { key: "Stack", value: p.stack },
        { key: "Deliverable", value: p.deliverable },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "tip", title: "Ship the simplest version first", content: "Build a working single-turn chatbot before adding streaming, history, or a React frontend. Confirm the LLM call works end-to-end, then layer on features one at a time. Every intermediate state should be a deployable product." },
    ] },
    { step: 2, title: "FastAPI backend with streaming", blocks: [
      { type: "code", language: "bash", label: "Install backend dependencies", code: "python -m pip install fastapi uvicorn anthropic python-dotenv" },
      { type: "code", language: "python", label: "FastAPI streaming chat endpoint", code: "from fastapi import FastAPI\nfrom fastapi.responses import StreamingResponse\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom pydantic import BaseModel\nimport anthropic, os\n\napp = FastAPI()\napp.add_middleware(CORSMiddleware, allow_origins=['http://localhost:5173'], allow_methods=['*'], allow_headers=['*'])\nclient = anthropic.Anthropic()\n\nclass Message(BaseModel):\n    role: str\n    content: str\n\nclass ChatRequest(BaseModel):\n    messages: list[Message]\n    system: str = 'You are a helpful assistant.'\n\n@app.post('/chat')\ndef chat(req: ChatRequest):\n    def generate():\n        with client.messages.stream(\n            model='claude-sonnet-4-6',\n            max_tokens=1024,\n            system=req.system,\n            messages=[m.model_dump() for m in req.messages],\n        ) as stream:\n            for text in stream.text_stream:\n                yield f'data: {text}\\n\\n'\n        yield 'data: [DONE]\\n\\n'\n    return StreamingResponse(generate(), media_type='text/event-stream')" },
    ] },
    { step: 3, title: "React frontend with streaming UI", blocks: [
      { type: "code", language: "bash", label: "Create Vite React app", code: "npm create vite@latest chatbot -- --template react-ts\ncd chatbot && npm install" },
      { type: "code", language: "tsx", label: "App.tsx — streaming chat UI", code: "import { useState, useRef, useEffect } from 'react'\n\ntype Message = { role: 'user' | 'assistant'; content: string }\n\nexport default function App() {\n  const [messages, setMessages] = useState<Message[]>([])\n  const [input, setInput] = useState('')\n  const [streaming, setStreaming] = useState(false)\n  const bottomRef = useRef<HTMLDivElement>(null)\n\n  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])\n\n  async function send() {\n    if (!input.trim() || streaming) return\n    const userMsg: Message = { role: 'user', content: input }\n    const next = [...messages, userMsg]\n    setMessages([...next, { role: 'assistant', content: '' }])\n    setInput('')\n    setStreaming(true)\n\n    const res = await fetch('http://localhost:8000/chat', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ messages: next }),\n    })\n    const reader = res.body!.getReader()\n    const decoder = new TextDecoder()\n    let buffer = ''\n\n    while (true) {\n      const { done, value } = await reader.read()\n      if (done) break\n      buffer += decoder.decode(value, { stream: true })\n      const lines = buffer.split('\\n')\n      buffer = lines.pop() ?? ''\n      for (const line of lines) {\n        if (!line.startsWith('data: ')) continue\n        const text = line.slice(6)\n        if (text === '[DONE]') continue\n        setMessages(prev => {\n          const updated = [...prev]\n          updated[updated.length - 1] = { role: 'assistant', content: updated[updated.length - 1].content + text }\n          return updated\n        })\n      }\n    }\n    setStreaming(false)\n  }\n\n  return (\n    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>\n      <h1 style={{ fontSize: 20, marginBottom: 16 }}>AI Chatbot</h1>\n      <div style={{ height: 480, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12 }}>\n        {messages.map((m, i) => (\n          <div key={i} style={{ marginBottom: 12, textAlign: m.role === 'user' ? 'right' : 'left' }}>\n            <span style={{ display: 'inline-block', background: m.role === 'user' ? '#6366f1' : '#f3f4f6', color: m.role === 'user' ? '#fff' : '#111', borderRadius: 8, padding: '8px 12px', maxWidth: '80%' }}>\n              {m.content || (streaming && i === messages.length - 1 ? '▌' : '')}\n            </span>\n          </div>\n        ))}\n        <div ref={bottomRef} />\n      </div>\n      <div style={{ display: 'flex', gap: 8 }}>\n        <input\n          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none' }}\n          value={input} onChange={e => setInput(e.target.value)}\n          onKeyDown={e => e.key === 'Enter' && send()}\n          placeholder='Type a message…'\n          disabled={streaming}\n        />\n        <button\n          style={{ padding: '8px 20px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', cursor: streaming ? 'not-allowed' : 'pointer', opacity: streaming ? 0.6 : 1 }}\n          onClick={send} disabled={streaming}\n        >Send</button>\n      </div>\n    </div>\n  )\n}" },
      { type: "callout", kind: "insight", title: "Stream tokens directly into state — do not buffer", content: "Appending each token to the last message in real time gives users immediate feedback. Buffering until the full response arrives feels broken. The setMessages updater pattern above is safe with React's batching and avoids stale closures." },
    ] },
    { step: 4, title: "Conversation history and system prompt UI", blocks: [
      { type: "code", language: "python", label: "Add conversation persistence with SQLite", code: "from sqlalchemy import create_engine, Column, String, Text, DateTime, Integer\nfrom sqlalchemy.orm import DeclarativeBase, Session\nfrom datetime import datetime\nimport uuid\n\nengine = create_engine('sqlite:///chat.db')\n\nclass Base(DeclarativeBase): pass\n\nclass Conversation(Base):\n    __tablename__ = 'conversations'\n    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))\n    title = Column(String, default='New chat')\n    system = Column(Text, default='You are a helpful assistant.')\n    created_at = Column(DateTime, default=datetime.utcnow)\n\nclass ChatMessage(Base):\n    __tablename__ = 'messages'\n    id = Column(Integer, primary_key=True, autoincrement=True)\n    conversation_id = Column(String)\n    role = Column(String)\n    content = Column(Text)\n    created_at = Column(DateTime, default=datetime.utcnow)\n\nBase.metadata.create_all(engine)" },
    ] },
    { step: 5, title: "Deploy and publish", blocks: [
      { type: "code", language: "bash", label: "Build and run with Docker Compose", code: "# docker-compose.yml\n# services:\n#   backend:\n#     build: ./backend\n#     ports: ['8000:8000']\n#   frontend:\n#     build: ./frontend\n#     ports: ['5173:80']\n\ndocker compose up --build" },
      { type: "list", style: "bullet", items: p.extensions.map(e => `**${e}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Deploy to Railway, Render, or Vercel + Fly.io. Record a 60-second demo showing a real multi-turn conversation. Publish the GitHub repo with a clear README covering setup, architecture, and screenshots." },
    ] },
  ];
}

// ─── Intermediate ─────────────────────────────────────────────────────────────
function intermediateSections(p: CapstoneSpec): Section[] {
  return [
    { step: 1, title: "Project scope and architecture", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "PDF RAG Assistant architecture", chart: "flowchart LR\n  U[User] -->|upload PDF| R[React UI]\n  R -->|POST /upload| F[FastAPI]\n  F --> EX[Extract + chunk]\n  EX --> EM[Embed chunks]\n  EM --> VDB[(Vector DB)]\n  U -->|ask question| R\n  R -->|POST /chat| F\n  F --> RET[Retrieve top-k]\n  VDB --> RET\n  RET --> LLM[LLM + citations]\n  LLM -->|stream answer| R" },
      { type: "kv", items: [
        { key: "Stack", value: p.stack },
        { key: "Deliverable", value: p.deliverable },
        { key: "Risk boundary", value: p.risk },
      ] },
    ] },
    { step: 2, title: "PDF ingestion and vector indexing", blocks: [
      { type: "code", language: "bash", label: "Install RAG dependencies", code: "python -m pip install fastapi uvicorn anthropic pymupdf hnswlib numpy python-multipart" },
      { type: "code", language: "python", label: "PDF upload, chunk, embed, and index", code: "import fitz, numpy as np, hnswlib, anthropic\nfrom pathlib import Path\nfrom fastapi import UploadFile\n\nclient = anthropic.Anthropic()\nDIM = 1536\nindex = hnswlib.Index(space='cosine', dim=DIM)\nindex.init_index(max_elements=50000, ef_construction=200, M=16)\nindex.set_ef(64)\nchunks: list[dict] = []\n\ndef embed(texts: list[str]) -> np.ndarray:\n    resp = client.messages.create(\n        model='claude-haiku-4-5-20251001', max_tokens=1,\n        messages=[{'role': 'user', 'content': '\\n'.join(texts)}],\n    )\n    # Use your preferred embedding API here (e.g. Voyage, OpenAI)\n    raise NotImplementedError('Plug in your embedding API')\n\nasync def ingest_pdf(file: UploadFile) -> int:\n    data = await file.read()\n    doc = fitz.open(stream=data, filetype='pdf')\n    new_chunks = []\n    for i, page in enumerate(doc):\n        text = page.get_text().strip()\n        if not text: continue\n        for start in range(0, len(text), 800):\n            new_chunks.append({'text': text[start:start+900], 'page': i+1, 'source': file.filename})\n    vecs = embed([c['text'] for c in new_chunks])\n    ids = list(range(len(chunks), len(chunks) + len(new_chunks)))\n    index.add_items(vecs, ids)\n    chunks.extend(new_chunks)\n    return len(new_chunks)" },
    ] },
    { step: 3, title: "React upload and chat UI", blocks: [
      { type: "code", language: "tsx", label: "PDFChatApp.tsx", code: "import { useState } from 'react'\n\nexport default function PDFChatApp() {\n  const [indexed, setIndexed] = useState(false)\n  const [uploading, setUploading] = useState(false)\n  const [messages, setMessages] = useState<{role:string;content:string}[]>([])\n  const [input, setInput] = useState('')\n\n  async function uploadPDF(e: React.ChangeEvent<HTMLInputElement>) {\n    const file = e.target.files?.[0]\n    if (!file) return\n    setUploading(true)\n    const form = new FormData()\n    form.append('file', file)\n    await fetch('http://localhost:8000/upload', { method: 'POST', body: form })\n    setIndexed(true)\n    setUploading(false)\n  }\n\n  async function ask() {\n    if (!input.trim() || !indexed) return\n    const q = input; setInput('')\n    setMessages(prev => [...prev, { role: 'user', content: q }, { role: 'assistant', content: '' }])\n    const res = await fetch('http://localhost:8000/chat', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ question: q }),\n    })\n    const reader = res.body!.getReader()\n    const decoder = new TextDecoder()\n    let buf = ''\n    while (true) {\n      const { done, value } = await reader.read()\n      if (done) break\n      buf += decoder.decode(value, { stream: true })\n      const lines = buf.split('\\n'); buf = lines.pop() ?? ''\n      for (const line of lines) {\n        if (line.startsWith('data: ') && line.slice(6) !== '[DONE]')\n          setMessages(prev => { const u = [...prev]; u[u.length-1] = { role: 'assistant', content: u[u.length-1].content + line.slice(6) }; return u })\n      }\n    }\n  }\n\n  return (\n    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>\n      <h1>PDF RAG Assistant</h1>\n      {!indexed ? (\n        <label style={{ display: 'block', border: '2px dashed #6366f1', borderRadius: 8, padding: 32, textAlign: 'center', cursor: 'pointer' }}>\n          {uploading ? 'Indexing…' : '📄 Drop a PDF or click to upload'}\n          <input type='file' accept='.pdf' hidden onChange={uploadPDF} />\n        </label>\n      ) : (\n        <>\n          <div style={{ height: 400, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12 }}>\n            {messages.map((m, i) => (\n              <div key={i} style={{ marginBottom: 10, textAlign: m.role === 'user' ? 'right' : 'left' }}>\n                <span style={{ display: 'inline-block', background: m.role === 'user' ? '#6366f1' : '#f3f4f6', color: m.role === 'user' ? '#fff' : '#111', borderRadius: 8, padding: '8px 12px', maxWidth: '80%', whiteSpace: 'pre-wrap' }}>\n                  {m.content || '▌'}\n                </span>\n              </div>\n            ))}\n          </div>\n          <div style={{ display: 'flex', gap: 8 }}>\n            <input style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}\n              value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder='Ask about your PDF…' />\n            <button style={{ padding: '8px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }} onClick={ask}>Ask</button>\n          </div>\n        </>\n      )}\n    </div>\n  )\n}" },
    ] },
    { step: 4, title: "Grounded answers with citations", blocks: [
      { type: "code", language: "python", label: "Retrieve and generate with page citations", code: "from fastapi.responses import StreamingResponse\nfrom pydantic import BaseModel\n\nclass QuestionRequest(BaseModel):\n    question: str\n\n@app.post('/chat')\ndef chat(req: QuestionRequest):\n    q_vec = embed([req.question])\n    labels, _ = index.knn_query(q_vec, k=5)\n    ctx_chunks = [chunks[i] for i in labels[0]]\n    context = '\\n\\n'.join(f\"[page {c['page']}] {c['text']}\" for c in ctx_chunks)\n    prompt = f'Answer only from the sources below. Cite page numbers.\\n\\nSOURCES:\\n{context}\\n\\nQUESTION: {req.question}'\n    def stream():\n        with client.messages.stream(model='claude-sonnet-4-6', max_tokens=1024,\n                messages=[{'role':'user','content':prompt}]) as s:\n            for t in s.text_stream:\n                yield f'data: {t}\\n\\n'\n        yield 'data: [DONE]\\n\\n'\n    return StreamingResponse(stream(), media_type='text/event-stream')" },
    ] },
    { step: 5, title: "Deploy and publish", blocks: [
      { type: "list", style: "bullet", items: p.extensions.map(e => `**${e}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Demo with a real publicly available PDF (a paper, manual, or report you own). Show a question that requires synthesizing two pages, and one question that the assistant correctly says it cannot answer. Publish field-level accuracy on 20 test questions." },
    ] },
  ];
}

// ─── Advanced ─────────────────────────────────────────────────────────────────
function advancedSections(p: CapstoneSpec): Section[] {
  return [
    { step: 1, title: "Project scope and architecture", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "Enterprise Knowledge Assistant", chart: "flowchart LR\n  U[Users] --> R[React dashboard]\n  R --> API[FastAPI gateway]\n  API --> CA[Redis cache]\n  CA --> HYB[Hybrid retriever\\nBM25 + dense]\n  HYB --> VDB[(Vector DB)]\n  HYB --> RR[Reranker]\n  RR --> LLM[LLM + citations]\n  LLM -->|stream| R\n  API --> OB[Observability]" },
      { type: "kv", items: [
        { key: "Stack", value: p.stack },
        { key: "Deliverable", value: p.deliverable },
        { key: "Risk boundary", value: p.risk },
      ] },
    ] },
    { step: 2, title: "Multi-source ingestion and hybrid retrieval", blocks: [
      { type: "code", language: "python", label: "Hybrid BM25 + dense retrieval with reranking", code: "from rank_bm25 import BM25Okapi\nimport numpy as np\n\nclass HybridRetriever:\n    def __init__(self, chunks: list[dict], dense_index):\n        self.chunks = chunks\n        self.dense = dense_index\n        tokenized = [c['text'].lower().split() for c in chunks]\n        self.bm25 = BM25Okapi(tokenized)\n\n    def retrieve(self, query: str, k: int = 10, alpha: float = 0.5) -> list[dict]:\n        # BM25 scores\n        bm25_scores = np.array(self.bm25.get_scores(query.lower().split()))\n        bm25_norm = (bm25_scores - bm25_scores.min()) / (bm25_scores.max() - bm25_scores.min() + 1e-9)\n        # Dense scores\n        q_vec = embed([query])\n        labels, dists = self.dense.knn_query(q_vec, k=len(self.chunks))\n        dense_norm = np.zeros(len(self.chunks))\n        for rank, (idx, dist) in enumerate(zip(labels[0], dists[0])):\n            dense_norm[idx] = 1 - dist\n        # Fuse\n        combined = alpha * dense_norm + (1 - alpha) * bm25_norm\n        top_idx = np.argsort(combined)[::-1][:k]\n        return [{'chunk': self.chunks[i], 'score': float(combined[i])} for i in top_idx]" },
    ] },
    { step: 3, title: "React knowledge base dashboard", blocks: [
      { type: "code", language: "tsx", label: "KnowledgeDashboard.tsx", code: "import { useState } from 'react'\n\ntype Source = { title: string; page: number; score: number }\ntype Result = { answer: string; sources: Source[] }\n\nexport default function KnowledgeDashboard() {\n  const [query, setQuery] = useState('')\n  const [result, setResult] = useState<Result | null>(null)\n  const [loading, setLoading] = useState(false)\n  const [answer, setAnswer] = useState('')\n\n  async function search() {\n    if (!query.trim()) return\n    setLoading(true); setAnswer(''); setResult(null)\n    const res = await fetch('http://localhost:8000/query', {\n      method: 'POST', headers: {'Content-Type':'application/json'},\n      body: JSON.stringify({ question: query })\n    })\n    const reader = res.body!.getReader()\n    const dec = new TextDecoder()\n    let buf = '', full = ''\n    while (true) {\n      const { done, value } = await reader.read()\n      if (done) break\n      buf += dec.decode(value, { stream: true })\n      const lines = buf.split('\\n'); buf = lines.pop() ?? ''\n      for (const line of lines) {\n        if (!line.startsWith('data: ')) continue\n        const payload = line.slice(6)\n        if (payload === '[DONE]') continue\n        try { const j = JSON.parse(payload); if (j.sources) { setResult({ answer: full, sources: j.sources }); setLoading(false) } }\n        catch { full += payload; setAnswer(full) }\n      }\n    }\n    setLoading(false)\n  }\n\n  return (\n    <div style={{ maxWidth: 860, margin: '0 auto', padding: 28, fontFamily: 'sans-serif' }}>\n      <h1 style={{ fontSize: 22 }}>Enterprise Knowledge Assistant</h1>\n      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>\n        <input style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15 }}\n          value={query} onChange={e => setQuery(e.target.value)}\n          onKeyDown={e => e.key === 'Enter' && search()}\n          placeholder='Ask anything about your knowledge base…' />\n        <button style={{ padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}\n          onClick={search} disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>\n      </div>\n      {answer && (\n        <div style={{ background: '#f9fafb', borderRadius: 8, padding: 20, marginBottom: 16, lineHeight: 1.7 }}>\n          {answer}{loading && <span style={{ opacity: 0.5 }}>▌</span>}\n        </div>\n      )}\n      {result?.sources && (\n        <div>\n          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', marginBottom: 8 }}>Sources</div>\n          {result.sources.map((s, i) => (\n            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, marginBottom: 4 }}>\n              <span style={{ fontWeight: 500 }}>{s.title}</span>\n              <span style={{ color: '#6b7280', fontSize: 13 }}>p.{s.page} · {(s.score * 100).toFixed(0)}% match</span>\n            </div>\n          ))}\n        </div>\n      )}\n    </div>\n  )\n}" },
    ] },
    { step: 4, title: "Caching, auth, and observability", blocks: [
      { type: "code", language: "python", label: "Redis cache + JWT auth middleware", code: "from fastapi import Depends, HTTPException, Header\nfrom redis import Redis\nimport hashlib, json\n\nredis = Redis(host='localhost', port=6379, decode_responses=True)\n\ndef verify_token(authorization: str = Header(...)) -> str:\n    if not authorization.startswith('Bearer '):\n        raise HTTPException(401, 'Missing token')\n    return authorization[7:]\n\ndef cached_query(question: str, fn, ttl: int = 1800):\n    key = f'kb:{hashlib.sha256(question.encode()).hexdigest()}'\n    hit = redis.get(key)\n    if hit: return json.loads(hit)\n    result = fn(question)\n    redis.setex(key, ttl, json.dumps(result))\n    return result" },
    ] },
    { step: 5, title: "Eval, deploy, and portfolio write-up", blocks: [
      { type: "list", style: "bullet", items: p.extensions.map(e => `**${e}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Deploy on Fly.io or Railway. Publish retrieval Recall@5, answer faithfulness on 30 test questions, a Grafana screenshot, and a live demo link. Write a 500-word case study explaining the hybrid retrieval tradeoffs you made." },
    ] },
  ];
}

// ─── Expert ───────────────────────────────────────────────────────────────────
function expertSections(p: CapstoneSpec): Section[] {
  return [
    { step: 1, title: "Project scope and multi-agent architecture", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "Multi-Agent Research System", chart: "flowchart TD\n  U[User research goal] --> S[Supervisor agent]\n  S --> PA[Planner agent]\n  PA --> FA[Finder agents x3\\n parallel]\n  FA --> DA[Deduplicator]\n  DA --> VA[Verifier agents]\n  VA --> WA[Writer agent]\n  WA --> RA[Reviewer agent]\n  RA -->|revise| WA\n  RA -->|approved| R[React streaming UI]" },
      { type: "kv", items: [
        { key: "Stack", value: p.stack },
        { key: "Deliverable", value: p.deliverable },
        { key: "Risk boundary", value: p.risk },
      ] },
    ] },
    { step: 2, title: "Parallel finder agents and deduplication", blocks: [
      { type: "code", language: "python", label: "Parallel search with asyncio and deduplication", code: "import asyncio, anthropic, hashlib\nfrom pydantic import BaseModel\n\nclient = anthropic.Anthropic()\n\nclass Finding(BaseModel):\n    claim: str\n    source: str\n    confidence: float\n\nasync def finder_agent(query_variant: str) -> list[Finding]:\n    resp = client.messages.create(\n        model='claude-haiku-4-5-20251001', max_tokens=1024,\n        messages=[{'role':'user','content':f'Search for findings on: {query_variant}. Return JSON list of {{claim, source, confidence}}.'}]\n    )\n    import json, re\n    raw = resp.content[0].text\n    data = json.loads(re.search(r'\\[.*\\]', raw, re.DOTALL).group())\n    return [Finding(**d) for d in data]\n\ndef dedup(findings: list[Finding]) -> list[Finding]:\n    seen = set()\n    out = []\n    for f in findings:\n        key = hashlib.md5(f.claim.lower().encode()).hexdigest()\n        if key not in seen:\n            seen.add(key)\n            out.append(f)\n    return out\n\nasync def parallel_search(topic: str) -> list[Finding]:\n    variants = [topic, f'{topic} recent research', f'{topic} case studies']\n    results = await asyncio.gather(*[finder_agent(v) for v in variants])\n    return dedup([f for batch in results for f in batch])" },
    ] },
    { step: 3, title: "React streaming research dashboard", blocks: [
      { type: "code", language: "tsx", label: "ResearchDashboard.tsx", code: "import { useState } from 'react'\n\ntype Step = { agent: string; status: 'running' | 'done'; content: string }\n\nexport default function ResearchDashboard() {\n  const [topic, setTopic] = useState('')\n  const [steps, setSteps] = useState<Step[]>([])\n  const [report, setReport] = useState('')\n  const [running, setRunning] = useState(false)\n\n  async function research() {\n    if (!topic.trim()) return\n    setRunning(true); setSteps([]); setReport('')\n    const res = await fetch('http://localhost:8000/research', {\n      method: 'POST', headers: {'Content-Type':'application/json'},\n      body: JSON.stringify({ topic })\n    })\n    const reader = res.body!.getReader()\n    const dec = new TextDecoder()\n    let buf = ''\n    while (true) {\n      const { done, value } = await reader.read()\n      if (done) break\n      buf += dec.decode(value, { stream: true })\n      const lines = buf.split('\\n'); buf = lines.pop() ?? ''\n      for (const line of lines) {\n        if (!line.startsWith('data: ')) continue\n        try {\n          const ev = JSON.parse(line.slice(6))\n          if (ev.type === 'step') setSteps(prev => [...prev.filter(s => s.agent !== ev.agent), { agent: ev.agent, status: ev.status, content: ev.content }])\n          if (ev.type === 'report') setReport(ev.content)\n          if (ev.type === 'done') setRunning(false)\n        } catch { /* token chunk */ }\n      }\n    }\n  }\n\n  return (\n    <div style={{ maxWidth: 920, margin: '0 auto', padding: 28, fontFamily: 'sans-serif' }}>\n      <h1>Multi-Agent Research System</h1>\n      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>\n        <input style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15 }}\n          value={topic} onChange={e => setTopic(e.target.value)}\n          onKeyDown={e => e.key === 'Enter' && research()}\n          placeholder='Enter a research topic…' />\n        <button style={{ padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.6 : 1 }}\n          onClick={research} disabled={running}>{running ? 'Researching…' : 'Research'}</button>\n      </div>\n      {steps.length > 0 && (\n        <div style={{ marginBottom: 20 }}>\n          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', marginBottom: 8 }}>Agent Progress</div>\n          {steps.map((s, i) => (\n            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>\n              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.status === 'running' ? '#f59e0b' : '#10b981', flexShrink: 0 }} />\n              <span style={{ fontWeight: 500, minWidth: 140 }}>{s.agent}</span>\n              <span style={{ color: '#6b7280', fontSize: 13 }}>{s.content}</span>\n            </div>\n          ))}\n        </div>\n      )}\n      {report && (\n        <div style={{ background: '#f9fafb', borderRadius: 8, padding: 24, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{report}</div>\n      )}\n    </div>\n  )\n}" },
    ] },
    { step: 4, title: "Verify findings and write final report", blocks: [
      { type: "code", language: "python", label: "Verifier and writer agents", code: "def verify_finding(finding: Finding) -> bool:\n    resp = client.messages.create(\n        model='claude-haiku-4-5-20251001', max_tokens=128,\n        messages=[{'role':'user','content':f'Is this claim plausible and well-supported? Answer only yes or no.\\nClaim: {finding.claim}\\nSource: {finding.source}'}]\n    )\n    return 'yes' in resp.content[0].text.lower()\n\ndef write_report(topic: str, verified: list[Finding]) -> str:\n    evidence = '\\n'.join(f'- {f.claim} (source: {f.source})' for f in verified)\n    resp = client.messages.create(\n        model='claude-sonnet-4-6', max_tokens=2048,\n        messages=[{'role':'user','content':f'Write a structured research report on \"{topic}\" using only the verified findings below. Include an executive summary, key findings, and limitations.\\n\\n{evidence}'}]\n    )\n    return resp.content[0].text" },
    ] },
    { step: 5, title: "Deploy and portfolio handoff", blocks: [
      { type: "list", style: "bullet", items: p.extensions.map(e => `**${e}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Record a full research run from topic to report. Publish agent logs, deduplication stats, verification pass rate, and the final report for 2 different topics. Show the agent progress panel updating in real time in the screen capture." },
    ] },
  ];
}

// ─── Senior ───────────────────────────────────────────────────────────────────
function seniorSections(p: CapstoneSpec): Section[] {
  return [
    { step: 1, title: "Project scope and platform architecture", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "AI Software Development Platform", chart: "flowchart TD\n  U[Developer] --> R[React IDE-like UI]\n  R -->|spec| PM[PM agent]\n  PM --> AR[Architect agent]\n  AR --> DV[Dev agents\\nparallel modules]\n  DV --> TS[Test agent]\n  TS -->|fail| DV\n  TS -->|pass| RV[Review agent]\n  RV -->|approve| GH[GitHub PR]\n  R -->|stream logs| U" },
      { type: "kv", items: [
        { key: "Stack", value: p.stack },
        { key: "Deliverable", value: p.deliverable },
        { key: "Risk boundary", value: p.risk },
      ] },
    ] },
    { step: 2, title: "Agent orchestration and file generation", blocks: [
      { type: "code", language: "python", label: "Multi-agent dev pipeline with file output", code: "from pathlib import Path\nimport anthropic, json, re\n\nclient = anthropic.Anthropic()\n\ndef architect(spec: str) -> dict:\n    r = client.messages.create(model='claude-sonnet-4-6', max_tokens=2048,\n        messages=[{'role':'user','content':f'Given this spec, produce a JSON file plan: {{\"files\": [{{\"path\": \"src/...\", \"purpose\": \"...\"}}], \"tech_stack\": [...], \"structure\": \"...\"}}\\n\\nSpec: {spec}'}])\n    return json.loads(re.search(r'\\{.*\\}', r.content[0].text, re.DOTALL).group())\n\ndef developer(file_path: str, purpose: str, context: str) -> str:\n    r = client.messages.create(model='claude-sonnet-4-6', max_tokens=4096,\n        messages=[{'role':'user','content':f'Write complete production-ready code for {file_path}.\\nPurpose: {purpose}\\nContext: {context}\\nReturn only the code, no explanation.'}])\n    return r.content[0].text\n\ndef build_project(spec: str, output_dir: str = 'output') -> dict[str, str]:\n    plan = architect(spec)\n    files: dict[str, str] = {}\n    for f in plan['files']:\n        code = developer(f['path'], f['purpose'], json.dumps(plan))\n        path = Path(output_dir) / f['path']\n        path.parent.mkdir(parents=True, exist_ok=True)\n        path.write_text(code)\n        files[f['path']] = code\n    return files" },
    ] },
    { step: 3, title: "React IDE-style UI with live agent log", blocks: [
      { type: "code", language: "tsx", label: "DevPlatformUI.tsx", code: "import { useState } from 'react'\n\ntype LogEntry = { agent: string; message: string; ts: string }\ntype FileTree = Record<string, string>\n\nexport default function DevPlatformUI() {\n  const [spec, setSpec] = useState('')\n  const [logs, setLogs] = useState<LogEntry[]>([])\n  const [files, setFiles] = useState<FileTree>({})\n  const [selected, setSelected] = useState<string | null>(null)\n  const [running, setRunning] = useState(false)\n\n  async function build() {\n    if (!spec.trim()) return\n    setRunning(true); setLogs([]); setFiles({})\n    const res = await fetch('http://localhost:8000/build', {\n      method: 'POST', headers: {'Content-Type':'application/json'},\n      body: JSON.stringify({ spec })\n    })\n    const reader = res.body!.getReader()\n    const dec = new TextDecoder()\n    let buf = ''\n    while (true) {\n      const { done, value } = await reader.read()\n      if (done) break\n      buf += dec.decode(value, { stream: true })\n      const lines = buf.split('\\n'); buf = lines.pop() ?? ''\n      for (const line of lines) {\n        if (!line.startsWith('data: ')) continue\n        try {\n          const ev = JSON.parse(line.slice(6))\n          if (ev.type === 'log') setLogs(p => [...p, { agent: ev.agent, message: ev.message, ts: new Date().toLocaleTimeString() }])\n          if (ev.type === 'file') setFiles(p => ({ ...p, [ev.path]: ev.content }))\n          if (ev.type === 'done') setRunning(false)\n        } catch {}\n      }\n    }\n  }\n\n  return (\n    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: '100vh', padding: 16, fontFamily: 'monospace', fontSize: 13 }}>\n      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>\n        <textarea style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #d1d5db', resize: 'none', fontFamily: 'inherit' }}\n          value={spec} onChange={e => setSpec(e.target.value)}\n          placeholder='Describe what you want to build…' />\n        <button style={{ padding: '10px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: running ? 'not-allowed' : 'pointer' }}\n          onClick={build} disabled={running}>{running ? 'Building…' : '🚀 Build'}</button>\n        <div style={{ flex: 1, background: '#1e1e1e', color: '#d4d4d4', borderRadius: 8, padding: 12, overflowY: 'auto' }}>\n          {logs.map((l, i) => (\n            <div key={i}><span style={{ color: '#6b7280' }}>[{l.ts}]</span> <span style={{ color: '#60a5fa' }}>{l.agent}</span> {l.message}</div>\n          ))}\n        </div>\n      </div>\n      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>\n        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>\n          {Object.keys(files).map(f => (\n            <button key={f} style={{ padding: '4px 10px', background: selected === f ? '#6366f1' : '#f3f4f6', color: selected === f ? '#fff' : '#111', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}\n              onClick={() => setSelected(f)}>{f.split('/').pop()}</button>\n          ))}\n        </div>\n        <pre style={{ flex: 1, background: '#1e1e1e', color: '#d4d4d4', borderRadius: 8, padding: 16, overflowY: 'auto', overflowX: 'auto', margin: 0 }}>\n          {selected ? files[selected] : 'Select a file to view its code'}\n        </pre>\n      </div>\n    </div>\n  )\n}" },
    ] },
    { step: 4, title: "Test runner and GitHub PR creation", blocks: [
      { type: "code", language: "python", label: "Test agent and GitHub PR via API", code: "import subprocess, httpx, os\n\ndef run_tests(project_dir: str) -> tuple[bool, str]:\n    result = subprocess.run(['python', '-m', 'pytest', project_dir, '--tb=short', '-q'],\n        capture_output=True, text=True, timeout=60)\n    return result.returncode == 0, result.stdout + result.stderr\n\ndef create_github_pr(repo: str, branch: str, title: str, body: str) -> str:\n    token = os.environ['GITHUB_TOKEN']\n    r = httpx.post(f'https://api.github.com/repos/{repo}/pulls',\n        headers={'Authorization': f'Bearer {token}', 'Accept': 'application/vnd.github+json'},\n        json={'title': title, 'body': body, 'head': branch, 'base': 'main'})\n    return r.json().get('html_url', 'PR creation failed')" },
    ] },
    { step: 5, title: "Deploy and portfolio handoff", blocks: [
      { type: "list", style: "bullet", items: p.extensions.map(e => `**${e}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Record the platform generating a real small project end-to-end. Publish all generated files, the agent log, test results, and the final GitHub PR link. Describe what the PM, Architect, Dev, and Reviewer agents each contributed." },
    ] },
  ];
}

// ─── Architect ────────────────────────────────────────────────────────────────
function architectSections(p: CapstoneSpec): Section[] {
  return [
    { step: 1, title: "Platform scope and enterprise architecture", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "Enterprise Agentic AI Platform", chart: "flowchart TD\n  U[Enterprise users] --> PRT[React admin portal]\n  PRT --> GW[API gateway\\nauth + routing + cost]\n  GW --> OR[Orchestrator\\nLangGraph]\n  OR --> AG[Specialist agents]\n  AG --> MCP[MCP servers\\ntools + data]\n  AG --> RAG[RAG layer\\nper-dept isolation]\n  OR --> QB[Task queue]\n  QB --> WK[Background workers]\n  GW --> OB[Observability\\nPrometheus + Grafana]\n  GW --> AL[Audit log\\ntamper-evident]" },
      { type: "kv", items: [
        { key: "Stack", value: p.stack },
        { key: "Deliverable", value: p.deliverable },
        { key: "Risk boundary", value: p.risk },
      ] },
    ] },
    { step: 2, title: "Gateway, RBAC, and cost chargeback", blocks: [
      { type: "code", language: "python", label: "Multi-tenant gateway with cost tracking per department", code: "from fastapi import FastAPI, HTTPException, Depends, Header\nfrom pydantic import BaseModel\nfrom redis import Redis\nimport anthropic, time, os, json\n\napp = FastAPI(title='Enterprise AI Gateway')\nredis = Redis(host='localhost', port=6379, decode_responses=True)\nclient = anthropic.Anthropic()\n\nDEPT_KEYS: dict[str, str] = json.loads(os.getenv('DEPT_KEYS', '{}'))\nDEPT_BUDGETS: dict[str, float] = json.loads(os.getenv('DEPT_BUDGETS', '{}'))\n\ndef get_dept(x_api_key: str = Header(...)) -> str:\n    dept = DEPT_KEYS.get(x_api_key)\n    if not dept: raise HTTPException(401, 'Invalid API key')\n    return dept\n\ndef check_budget(dept: str, estimated_cost: float) -> None:\n    spent = float(redis.get(f'spend:{dept}') or 0)\n    budget = DEPT_BUDGETS.get(dept, 100.0)\n    if spent + estimated_cost > budget:\n        raise HTTPException(429, f'Department {dept} budget exceeded')\n\ndef record_usage(dept: str, model: str, inp: int, out: int) -> float:\n    cost = (inp * 0.003 + out * 0.015) / 1000\n    redis.incrbyfloat(f'spend:{dept}', cost)\n    redis.lpush(f'audit:{dept}', json.dumps({'ts': time.time(), 'model': model, 'input': inp, 'output': out, 'cost': cost}))\n    return cost" },
    ] },
    { step: 3, title: "React admin portal with usage dashboards", blocks: [
      { type: "code", language: "tsx", label: "AdminPortal.tsx", code: "import { useEffect, useState } from 'react'\n\ntype DeptUsage = { dept: string; spend: number; requests: number; budget: number }\n\nexport default function AdminPortal() {\n  const [usage, setUsage] = useState<DeptUsage[]>([])\n  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'agents'>('overview')\n\n  useEffect(() => {\n    fetch('http://localhost:8000/admin/usage', { headers: {'X-Admin-Key': 'admin-secret'} })\n      .then(r => r.json()).then(setUsage)\n  }, [])\n\n  return (\n    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 28, fontFamily: 'sans-serif' }}>\n      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>\n        <h1 style={{ fontSize: 22, margin: 0 }}>Enterprise AI Platform — Admin</h1>\n        <div style={{ display: 'flex', gap: 8 }}>\n          {(['overview','audit','agents'] as const).map(tab => (\n            <button key={tab} style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: activeTab === tab ? '#6366f1' : '#f3f4f6', color: activeTab === tab ? '#fff' : '#111', cursor: 'pointer', textTransform: 'capitalize' }}\n              onClick={() => setActiveTab(tab)}>{tab}</button>\n          ))}\n        </div>\n      </div>\n      {activeTab === 'overview' && (\n        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>\n          {usage.map(d => (\n            <div key={d.dept} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20 }}>\n              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>{d.dept}</div>\n              <div style={{ marginBottom: 8 }}>\n                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>\n                  <span>Spend</span><span>${d.spend.toFixed(2)} / ${d.budget}</span>\n                </div>\n                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>\n                  <div style={{ height: '100%', width: `${Math.min(d.spend/d.budget*100,100)}%`, background: d.spend/d.budget > 0.9 ? '#ef4444' : '#6366f1', borderRadius: 3 }} />\n                </div>\n              </div>\n              <div style={{ fontSize: 13, color: '#6b7280' }}>{d.requests} requests this month</div>\n            </div>\n          ))}\n        </div>\n      )}\n      {activeTab === 'audit' && (\n        <div style={{ background: '#1e1e1e', color: '#d4d4d4', borderRadius: 8, padding: 20, fontFamily: 'monospace', fontSize: 12 }}>\n          Audit log viewer — fetch from /admin/audit and render here\n        </div>\n      )}\n      {activeTab === 'agents' && (\n        <div style={{ color: '#6b7280' }}>Agent health dashboard — connect to /admin/agents for live status</div>\n      )}\n    </div>\n  )\n}" },
    ] },
    { step: 4, title: "LangGraph orchestration and MCP tool integration", blocks: [
      { type: "code", language: "python", label: "LangGraph enterprise agent with MCP tools", code: "from langgraph.graph import StateGraph, START, END\nfrom langgraph.graph.message import add_messages\nfrom typing import Annotated, TypedDict\nfrom langchain_anthropic import ChatAnthropic\nfrom langchain_core.messages import BaseMessage\nfrom langchain_core.tools import tool\n\nclass EnterpriseState(TypedDict):\n    messages: Annotated[list[BaseMessage], add_messages]\n    department: str\n    budget_remaining: float\n    audit_trail: list[dict]\n\n@tool\ndef search_knowledge_base(query: str, department: str) -> str:\n    \"\"\"Search the department-scoped knowledge base for relevant documents.\"\"\"\n    return f'[KB results for {department}]: {query}'\n\n@tool\ndef query_database(sql: str) -> str:\n    \"\"\"Execute a read-only SQL query against the company database.\"\"\"\n    return f'[DB result]: query executed'\n\ntools = [search_knowledge_base, query_database]\nllm = ChatAnthropic(model='claude-sonnet-4-6').bind_tools(tools)\n\ndef agent_node(state: EnterpriseState) -> dict:\n    return {'messages': [llm.invoke(state['messages'])]}\n\nbuilder = StateGraph(EnterpriseState)\nbuilder.add_node('agent', agent_node)\nbuilder.add_edge(START, 'agent')\nbuilder.add_edge('agent', END)\ngraph = builder.compile()" },
    ] },
    { step: 5, title: "Deploy, compliance audit, and portfolio handoff", blocks: [
      { type: "list", style: "bullet", items: p.extensions.map(e => `**${e}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "This is your flagship portfolio project. Publish the full architecture document, the admin portal screenshot showing real department usage, the audit log schema, LangGraph agent traces from LangSmith, load-test results, and a 3-minute walkthrough video. Write a 1,000-word case study covering every architectural trade-off you made." },
    ] },
  ];
}

// ─── Spec table ───────────────────────────────────────────────────────────────
const specs: CapstoneSpec[] = [
  {
    slug: "beginner-ai-chatbot",
    title: "Beginner — AI Chatbot",
    hours: 12,
    description: "Build and deploy a full-stack AI chatbot: a streaming FastAPI backend that calls an LLM, a React frontend with real-time token-by-token rendering, multi-turn conversation history stored in SQLite, and a system prompt editor so users can customize the assistant's persona.",
    stack: "Python · FastAPI · Anthropic SDK · React (Vite + TypeScript) · SQLite · Docker Compose.",
    deliverable: "A deployed chatbot with a public URL, GitHub repo, and a 60-second demo video.",
    risk: "Never log full conversation content to public logs. Store conversations in SQLite with a user ID — not in a shared global store. Cap max_tokens and apply a per-session rate limit.",
    extensions: [
      "Add a system prompt library: let users save and switch between named personas",
      "Add conversation export: download the full chat as a Markdown file",
      "Add voice input: use the Web Speech API to transcribe microphone input into the text field",
    ],
  },
  {
    slug: "intermediate-pdf-rag",
    title: "Intermediate — PDF RAG Assistant",
    hours: 16,
    description: "Build a PDF question-answering assistant: upload one or more PDFs, chunk and embed their content, retrieve relevant chunks with HNSW, generate grounded answers with page citations, and display results in a React UI with an upload drop-zone and a streaming chat interface.",
    stack: "Python · FastAPI · Anthropic SDK · PyMuPDF · hnswlib · React (Vite + TypeScript) · Docker Compose.",
    deliverable: "A deployed PDF assistant with a public URL, GitHub repo, field-level accuracy on 20 test questions, and a demo video.",
    risk: "Only index PDFs the user uploads in their own session. Do not share vector indexes across users. Show page citations for every claim — never answer without a retrieved source.",
    extensions: [
      "Add multi-document support: let users upload several PDFs and filter retrieval by document",
      "Add a confidence threshold: show a 'not enough information' response when the top retrieved chunk scores below 0.45",
      "Add an evaluation tab showing Recall@5 and answer faithfulness on a built-in test suite",
    ],
  },
  {
    slug: "advanced-enterprise-knowledge",
    title: "Advanced — Enterprise Knowledge Assistant",
    hours: 22,
    description: "Build a production-grade knowledge assistant for a multi-source corpus: ingest PDFs, Markdown docs, and web pages; hybrid BM25 + dense retrieval with reranking; Redis response caching; JWT authentication; Prometheus metrics; and a React dashboard with a search interface and source cards.",
    stack: "Python · FastAPI · Anthropic SDK · hnswlib · rank-bm25 · Redis · Prometheus · React (Vite + TypeScript) · Docker Compose.",
    deliverable: "Deployed service with Grafana dashboard screenshot, Recall@5 on 30 test questions, answer faithfulness score, and a public demo.",
    risk: "Apply document-level access controls before retrieval. Never serve a cached response to a user who lacks permission to see its source documents. Redact PII before indexing external content.",
    extensions: [
      "Add a document management UI: upload, delete, and re-index documents from the React dashboard",
      "Add per-query source filtering: let users restrict retrieval to specific document categories",
      "Add LangSmith tracing: log every retrieval call and LLM invocation for quality review",
    ],
  },
  {
    slug: "expert-multi-agent-research",
    title: "Expert — Multi-Agent Research System",
    hours: 28,
    description: "Build a multi-agent research platform: a Planner agent decomposes the topic, parallel Finder agents search from different angles, a Deduplicator removes redundancy, Verifier agents cross-check each finding, a Writer agent drafts the report, and a Reviewer agent approves or requests rewrites — all streamed to a React dashboard showing live agent progress.",
    stack: "Python · FastAPI · Anthropic SDK · asyncio · React (Vite + TypeScript) · Redis · Docker Compose.",
    deliverable: "A deployed research platform with example reports for 3 topics, agent log exports, verification pass rate, and a screen-recorded demo showing the live agent progress panel.",
    risk: "Cap the number of finder agents and search iterations to control cost. Never present synthesized conclusions as established facts — include a limitations section in every report. Log all agent calls for cost auditing.",
    extensions: [
      "Add a source-credibility scorer that weights findings from academic or government sources higher",
      "Implement a loop-until-dry pattern: keep spawning finders until two consecutive rounds return no new findings",
      "Add a report-versioning system: save every generated report and let users compare versions side by side",
    ],
  },
  {
    slug: "senior-ai-dev-platform",
    title: "Senior — AI Software Development Platform",
    hours: 34,
    description: "Build an AI-powered software development platform: a React IDE-style UI where a developer describes a project, and a multi-agent team (PM → Architect → parallel Dev agents → Test agent → Reviewer) generates the full codebase, runs tests, iterates on failures, and opens a GitHub PR — all with a live streaming agent log and file tree viewer.",
    stack: "Python · FastAPI · Anthropic SDK · asyncio · React (Vite + TypeScript) · GitHub API · Docker Compose.",
    deliverable: "Platform that successfully generates and tests at least 3 different small projects. Publish generated repos, test results, agent logs, and a full walkthrough video.",
    risk: "Never execute generated code on the host system without sandboxing. Always require human review before merging a generated PR. Cap total agent rounds to control cost and prevent infinite loops.",
    extensions: [
      "Add a Docker-based code execution sandbox so the Test agent can run generated code safely",
      "Add a SecurityAuditor agent that scans generated code for OWASP Top 10 patterns before the Reviewer approves",
      "Add diff-based iteration: when the Reviewer requests changes, show a diff of what changed between rounds in the UI",
    ],
  },
  {
    slug: "architect-enterprise-agentic-platform",
    title: "Architect — Enterprise Agentic AI Platform",
    hours: 40,
    description: "Design and build a full enterprise agentic AI platform: a React admin portal with department usage dashboards, a FastAPI gateway with RBAC and per-department cost chargeback, a LangGraph orchestration engine with specialist agents, MCP tool servers for internal systems, a per-department RAG layer with data isolation, a Redis task queue for async jobs, Prometheus + Grafana observability, and a tamper-evident audit log for compliance.",
    stack: "Python · FastAPI · LangGraph · LangChain · Anthropic SDK · MCP SDK · Redis · Prometheus · Grafana · React (Vite + TypeScript) · Docker Compose.",
    deliverable: "A fully deployed platform with admin portal, at least 2 departments configured, 3 MCP tool servers, Grafana dashboard, audit log, and a 3-minute architecture walkthrough video.",
    risk: "Enforce strict per-department data isolation in the RAG layer. Audit log must be append-only and tamper-evident. API keys must be rotatable without downtime. All LLM outputs that trigger business actions must be logged with the evidence that justified them.",
    extensions: [
      "Add SSO via OAuth 2.0 / OIDC: map identity-provider claims to department roles and budget allocations",
      "Add a self-service workflow builder: let non-technical users compose agent pipelines through a drag-and-drop React UI",
      "Add a compliance report generator: produce a monthly SOC-2-style summary of all LLM calls, tool invocations, and data accesses",
      "Add model routing: automatically select the cheapest model capable of handling each request based on a complexity classifier",
    ],
  },
];

// ─── Export ───────────────────────────────────────────────────────────────────
const sectionBuilders: Record<string, (p: CapstoneSpec) => Section[]> = {
  "beginner-ai-chatbot": beginnerSections,
  "intermediate-pdf-rag": intermediateSections,
  "advanced-enterprise-knowledge": advancedSections,
  "expert-multi-agent-research": expertSections,
  "senior-ai-dev-platform": seniorSections,
  "architect-enterprise-agentic-platform": architectSections,
};

const difficultyMap: Record<string, "beginner" | "intermediate" | "advanced"> = {
  "beginner-ai-chatbot": "beginner",
  "intermediate-pdf-rag": "intermediate",
  "advanced-enterprise-knowledge": "intermediate",
  "expert-multi-agent-research": "advanced",
  "senior-ai-dev-platform": "advanced",
  "architect-enterprise-agentic-platform": "advanced",
};

export const capstoneProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "capstone",
  title: p.title,
  description: p.description,
  techStack: p.stack.split(" · "),
  difficulty: difficultyMap[p.slug],
  estimatedHours: p.hours,
  sections: sectionBuilders[p.slug](p),
}));
