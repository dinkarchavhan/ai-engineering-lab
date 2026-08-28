import type { ProjectGuide } from "@/lib/content";

export const embeddingsVectorDbProjects: ProjectGuide[] = [
  {
    slug: "semantic-search-engine",
    trackSlug: "embeddings-vector-db",
    title: "Semantic search engine over your own documents",
    description: "Build a local semantic-search application over documents you are authorized to use. TensorFlow Hub’s Universal Sentence Encoder produces embeddings; a local HNSW index retrieves candidates; metadata filters and a keyword score make results more controllable than a plain similarity demo.",
    techStack: ["Python", "TensorFlow", "TensorFlow Hub", "hnswlib", "scikit-learn", "FastAPI", "Streamlit"],
    difficulty: "intermediate",
    estimatedHours: 8,
    sections: [
      { step: 1, title: "Define corpus, users, and evaluation", blocks: [
        { type: "kv", items: [
          { key: "Primary corpus", value: "Your own permitted PDFs/Markdown/HTML, with filename, title, date, source URL, and access metadata retained." },
          { key: "Public starter corpus", value: "scikit-learn 20 Newsgroups for a reproducible, non-private text-search experiment." },
          { key: "Task", value: "Query → ranked chunks, with source and metadata filters; no answer generation is needed for this track." },
          { key: "Metrics", value: "Recall@k and MRR over a hand-labelled query-to-relevant-chunk evaluation set." },
        ] },
        { type: "diagram", label: "Semantic search architecture", chart: "flowchart LR\n  D[Permitted documents] --> C[Clean + chunk + metadata]\n  C --> E[TensorFlow sentence embeddings]\n  E --> I[HNSW vector index]\n  Q[Query + filters] --> QE[Query embedding]\n  QE --> I\n  I --> H[Hybrid / metadata rerank]\n  H --> R[Ranked chunks + sources]" },
        { type: "callout", kind: "warning", title: "Authorization comes before indexing", content: "A vector index is another copy of sensitive content in derived form. Apply the same access controls, deletion workflow, retention rules, and logging expectations as you would to the source documents." },
      ] },
      { step: 2, title: "Load, clean, and chunk documents", blocks: [
        { type: "code", language: "python", label: "Reproducible public starter corpus", code: "from sklearn.datasets import fetch_20newsgroups\n\nraw = fetch_20newsgroups(subset=\"train\", remove=(\"headers\", \"footers\", \"quotes\"))\ndocuments = [{\"id\": str(i), \"text\": text, \"category\": raw.target_names[label], \"source\": \"20newsgroups\"}\n             for i, (text, label) in enumerate(zip(raw.data, raw.target)) if text.strip()]\nprint(len(documents))" },
        { type: "code", language: "python", label: "Chunk with stable IDs and overlap", code: "def chunk_document(doc, size=800, overlap=120):\n    text, chunks, start = doc[\"text\"].replace(\"\\n\", \" \").strip(), [], 0\n    while start < len(text):\n        end = min(start + size, len(text))\n        chunks.append({**doc, \"chunk_id\": f\"{doc['id']}:{start}\", \"text\": text[start:end], \"offset\": start})\n        start += size - overlap\n    return chunks\n\nchunks = [chunk for doc in documents for chunk in chunk_document(doc)]\nprint(len(chunks), chunks[0].keys())" },
        { type: "callout", kind: "gotcha", title: "Chunk boundaries are a retrieval decision", content: "Very small chunks lose context; very large chunks dilute similarity and waste downstream context. Start with an evaluation set, then compare size/overlap choices rather than guessing." },
      ] },
      { step: 3, title: "Embed with TensorFlow and build HNSW", blocks: [
        { type: "code", language: "bash", label: "Install", code: "python -m pip install tensorflow tensorflow-hub hnswlib scikit-learn numpy" },
        { type: "code", language: "python", label: "TensorFlow embeddings and approximate index", code: "import numpy as np\nimport tensorflow_hub as hub\nimport hnswlib\n\nencoder = hub.load(\"https://tfhub.dev/google/universal-sentence-encoder/4\")\ntexts = [chunk[\"text\"] for chunk in chunks]\nvectors = encoder(texts).numpy().astype(np.float32)\nvectors /= np.linalg.norm(vectors, axis=1, keepdims=True).clip(min=1e-12)\n\nindex = hnswlib.Index(space=\"cosine\", dim=vectors.shape[1])\nindex.init_index(max_elements=len(vectors), ef_construction=200, M=16)\nindex.add_items(vectors, np.arange(len(vectors)))\nindex.set_ef(64)\nindex.save_index(\"semantic_search.bin\")\nnp.save(\"chunk_vectors.npy\", vectors)" },
        { type: "callout", kind: "insight", title: "Why normalize?", content: "For normalized vectors, dot-product ranking is equivalent to cosine-similarity ranking. HNSW trades a small amount of exactness for fast nearest-neighbor retrieval at larger corpus sizes." },
      ] },
      { step: 4, title: "Search with filters and hybrid ranking", blocks: [
        { type: "code", language: "python", label: "Retrieval and metadata filter", code: "from sklearn.feature_extraction.text import TfidfVectorizer\n\ntfidf = TfidfVectorizer(stop_words=\"english\")\ntfidf_matrix = tfidf.fit_transform(texts)\n\ndef search(query, k=5, category=None):\n    q = encoder([query]).numpy().astype(np.float32)\n    q /= np.linalg.norm(q, axis=1, keepdims=True).clip(min=1e-12)\n    labels, distances = index.knn_query(q, k=min(k * 5, len(chunks)))\n    q_lex = tfidf.transform([query])\n    lexical = (tfidf_matrix @ q_lex.T).toarray().ravel()\n    results = []\n    for idx, distance in zip(labels[0], distances[0]):\n        item = chunks[int(idx)]\n        if category and item[\"category\"] != category: continue\n        semantic = 1 - float(distance)\n        score = 0.8 * semantic + 0.2 * float(lexical[int(idx)])\n        results.append({**item, \"score\": score, \"semantic_score\": semantic})\n    return sorted(results, key=lambda r: r[\"score\"], reverse=True)[:k]" },
        { type: "callout", kind: "tip", title: "Filter before search at scale", content: "For a large private corpus, partition indexes or use a vector database that supports server-side metadata filters. Post-filtering a small candidate list can miss relevant results in the desired category." },
      ] },
      { step: 5, title: "Evaluate, serve, and monitor", blocks: [
        { type: "code", language: "python", label: "Small retrieval evaluation", code: "# Fill these after manually judging which chunks answer each query.\nEVAL = [\n    {\"query\": \"computer graphics hardware\", \"relevant_chunk_ids\": {\"42:0\"}},\n]\n\ndef recall_at_k(k=5):\n    hits = 0\n    for item in EVAL:\n        returned = {r[\"chunk_id\"] for r in search(item[\"query\"], k=k)}\n        hits += bool(returned & item[\"relevant_chunk_ids\"])\n    return hits / len(EVAL)\nprint(f\"Recall@5: {recall_at_k():.2%}\")" },
        { type: "list", style: "bullet", items: ["Expose a FastAPI `/search` endpoint that returns chunk text, score, source, metadata, and index/model version—not just a bare answer.", "Build a Streamlit results page with query text, category filter, result source links, and a ‘relevant / not relevant’ feedback control.", "Log latency, empty-result rate, applied filters, clicks/feedback, and embedding/index versions without logging sensitive query text by default.", "Compare exact cosine search, HNSW, and hybrid ranking using the same labelled evaluation set before making performance claims." ] },
      ] },
    ],
  },
];
