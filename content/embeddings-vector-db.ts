import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — Understanding Embeddings (fully written as the reference)
// ---------------------------------------------------------------------------
const understandingEmbeddingsLesson: Lesson = {
  slug: "understanding-embeddings",
  trackSlug: "embeddings-vector-db",
  order: 1,
  minutes: 18,
  title: "Understanding Embeddings",
  subtitle:
    "How to turn text, images, or any data into vectors that capture semantic meaning — the foundation of modern search and RAG.",
  tags: ["Embeddings", "Vectors", "Semantic meaning", "First principles"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Computers don't understand words. They understand numbers. The problem: how do you represent 'machine learning' and 'artificial intelligence' as numbers in a way that captures the fact that they're related?\n\nKeyword search fails here. It only matches exact strings. If your document says 'AI' but the user searches for 'artificial intelligence', keyword search returns nothing.",
        },
        {
          type: "text",
          content:
            "The solution: **embeddings**. Transform each piece of text into a vector (a list of numbers) where similar meanings are close together in space. Now 'AI' and 'artificial intelligence' have vectors that are near each other, even though the strings are different.",
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
            "Embeddings are the foundation of:\n\n- **Semantic search** — find documents by meaning, not just keywords\n- **RAG** — retrieve the right context for an LLM to answer questions\n- **Recommendation systems** — find similar products, movies, or articles\n- **Clustering** — group similar items automatically\n- **Classification** — use embedding similarity as features\n\nEvery modern AI system that deals with unstructured data uses embeddings somewhere.",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "Embeddings turn the fuzzy concept of 'semantic similarity' into a concrete mathematical operation: distance between vectors.",
        },
      ],
    },
    {
      step: 3,
      title: "What is an embedding?",
      blocks: [
        {
          type: "text",
          content:
            "An **embedding** is a dense vector representation of data. For text:\n\n- Each piece of text (word, sentence, paragraph, document) becomes a vector\n- The vector has hundreds or thousands of dimensions (typically 384, 768, 1536, or more)\n- Similar meanings → similar vectors (measured by cosine similarity or Euclidean distance)\n- The model that creates embeddings is called an **embedding model**",
        },
        {
          type: "text",
          content:
            "Example: The sentence 'The cat sat on the mat' might become a 384-dimensional vector like `[0.23, -0.45, 0.12, ..., 0.67]`. The exact numbers don't matter — what matters is that 'The dog sat on the rug' produces a vector **close** to it.",
        },
      ],
    },
    {
      step: 4,
      title: "Visualizing embeddings",
      blocks: [
        {
          type: "text",
          content:
            "Embeddings are high-dimensional (hundreds of dimensions), but we can visualize the intuition in 2D:",
        },
        {
          type: "diagram",
          label: "Semantic space visualization",
          chart: `graph TB
    subgraph "Semantic Space"
        ML["machine learning<br/>[0.8, 0.6]"]
        AI["artificial intelligence<br/>[0.75, 0.65]"]
        DL["deep learning<br/>[0.85, 0.55]"]

        CAT["cat<br/>[0.2, 0.7]"]
        DOG["dog<br/>[0.25, 0.75]"]

        APPLE["apple (fruit)<br/>[-0.3, 0.4]"]
        APPLE2["Apple (company)<br/>[0.5, 0.3]"]
    end

    ML -.similar.-> AI
    ML -.similar.-> DL
    AI -.similar.-> DL

    CAT -.similar.-> DOG

    style ML fill:#e1f5ff
    style AI fill:#e1f5ff
    style DL fill:#e1f5ff
    style CAT fill:#fff4e1
    style DOG fill:#fff4e1
    style APPLE fill:#f0f0f0
    style APPLE2 fill:#f0f0f0`,
        },
        {
          type: "text",
          content:
            "Notice:\n\n- ML/AI/DL cluster together (tech concepts)\n- Cat/Dog cluster together (animals)\n- The two 'apple' meanings are in different regions (homonyms)\n- Distance = semantic similarity",
        },
      ],
    },
    {
      step: 5,
      title: "How embeddings are created",
      blocks: [
        {
          type: "text",
          content:
            "Embedding models are neural networks trained on massive text corpora to learn semantic relationships. The training process:\n\n1. **Contrastive learning** — similar texts should have similar embeddings, dissimilar texts should be far apart\n2. **Large corpus** — trained on billions of sentences from books, web pages, Q&A pairs\n3. **Fixed output size** — every input, no matter how long, becomes the same size vector\n\nPopular embedding models: OpenAI `text-embedding-3-small`, Cohere `embed-english-v3.0`, `sentence-transformers/all-MiniLM-L6-v2`, Voyage AI, Google `textembedding-gecko`.",
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "You don't train embedding models yourself. You use pretrained models via API or download open-source models from Hugging Face.",
        },
      ],
    },
    {
      step: 6,
      title: "Creating embeddings with code",
      blocks: [
        {
          type: "text",
          content:
            "Let's create embeddings using sentence-transformers (open source, runs locally):",
        },
        {
          type: "code",
          language: "python",
          label: "Generate embeddings locally",
          code: `# Install once: pip install sentence-transformers
from sentence_transformers import SentenceTransformer

# Load a pretrained model (downloads ~80MB on first run)
model = SentenceTransformer('all-MiniLM-L6-v2')

# Generate embeddings
sentences = [
    "Machine learning is a subset of AI",
    "Artificial intelligence includes ML and DL",
    "The cat sat on the mat",
]

embeddings = model.encode(sentences)

print(f"Shape: {embeddings.shape}")  # (3, 384) - 3 sentences, 384 dimensions
print(f"First embedding: {embeddings[0][:5]}...")  # First 5 dimensions

# Each embedding is a numpy array of 384 floats
print(f"Type: {type(embeddings[0])}, dtype: {embeddings.dtype}")`,
        },
        {
          type: "text",
          content:
            "Using OpenAI's API (hosted, requires API key):",
        },
        {
          type: "code",
          language: "python",
          label: "Generate embeddings via OpenAI API",
          code: `# Install once: pip install openai
from openai import OpenAI

client = OpenAI()  # Reads OPENAI_API_KEY from environment

texts = [
    "Machine learning is a subset of AI",
    "The cat sat on the mat",
]

response = client.embeddings.create(
    model="text-embedding-3-small",  # 1536 dimensions, $0.02/1M tokens
    input=texts
)

# Extract embeddings
embeddings = [item.embedding for item in response.data]

print(f"Dimensions: {len(embeddings[0])}")  # 1536
print(f"First 5: {embeddings[0][:5]}")`,
        },
      ],
    },
    {
      step: 7,
      title: "Measuring similarity",
      blocks: [
        {
          type: "text",
          content:
            "Once you have embeddings, similarity is just a distance calculation. The standard metric: **cosine similarity**.",
        },
        {
          type: "code",
          language: "python",
          label: "Compute cosine similarity",
          code: `import numpy as np
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

# Generate embeddings
sentences = [
    "Machine learning is a subset of AI",
    "Artificial intelligence includes ML",
    "The cat sat on the mat",
]
embeddings = model.encode(sentences)

# Compute cosine similarity between all pairs
similarities = util.cos_sim(embeddings, embeddings)

print("Similarity matrix:")
print(similarities)
# Output (simplified):
# [[1.00, 0.82, 0.15],   <- sentence 0 vs all
#  [0.82, 1.00, 0.18],   <- sentence 1 vs all
#  [0.15, 0.18, 1.00]]   <- sentence 2 vs all

# Sentence 0 and 1 are similar (0.82)
# Sentence 2 is different (0.15, 0.18)`,
        },
        {
          type: "text",
          content:
            "Cosine similarity ranges from -1 to 1:\n\n- **1.0** = identical vectors (same meaning)\n- **0.8-0.95** = very similar (semantically related)\n- **0.5-0.8** = moderately similar\n- **< 0.5** = different topics\n- **0** = orthogonal (no relationship)\n- **-1** = opposite meanings (rare in practice)",
        },
      ],
    },
    {
      step: 8,
      title: "Embedding granularity: words vs sentences vs documents",
      blocks: [
        {
          type: "text",
          content:
            "You can embed at different levels:",
        },
        {
          type: "list",
          style: "bullet",
          items: [
            "**Word embeddings** (Word2Vec, GloVe) — one vector per word. Fast but loses sentence context.",
            "**Sentence embeddings** (sentence-transformers, OpenAI) — one vector per sentence. Best for search and RAG.",
            "**Document embeddings** — one vector for an entire document. Use when you want to compare full documents.",
          ],
        },
        {
          type: "text",
          content:
            "For RAG and semantic search, **sentence or paragraph embeddings** are the sweet spot. They capture enough context without losing granularity.",
        },
        {
          type: "callout",
          kind: "gotcha",
          content:
            "Most embedding models have a max length (512 tokens for many). If your text is longer, chunk it first or use a model with a longer context window.",
        },
      ],
    },
    {
      step: 9,
      title: "Choosing an embedding model",
      blocks: [
        {
          type: "text",
          content:
            "Key factors:",
        },
        {
          type: "kv",
          items: [
            { key: "Quality", value: "Larger models (1536D) are more accurate but slower and more expensive than smaller models (384D)." },
            { key: "Speed", value: "Smaller models are faster. For local deployment, 'all-MiniLM-L6-v2' (384D) is a good baseline." },
            { key: "Cost", value: "API models charge per token. OpenAI: $0.02-0.13/1M tokens. Local models are free after download." },
            { key: "Domain", value: "Some models are fine-tuned for specific domains (code, legal, medical). Use domain-specific if available." },
            { key: "Multilingual", value: "Models like 'paraphrase-multilingual-MiniLM-L12-v2' support 50+ languages." },
          ],
        },
        {
          type: "text",
          content:
            "**Recommendation for starting out:** Use `all-MiniLM-L6-v2` (open source, 384D) for prototyping. Upgrade to OpenAI's `text-embedding-3-large` (1536D) or Cohere's `embed-english-v3.0` (1024D) for production.",
        },
      ],
    },
    {
      step: 10,
      title: "Real-world use case: semantic search",
      blocks: [
        {
          type: "text",
          content:
            "Here's a complete example: embed a set of documents, then search them by meaning:",
        },
        {
          type: "code",
          language: "python",
          label: "Simple semantic search",
          code: `from sentence_transformers import SentenceTransformer, util

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Your document corpus
documents = [
    "Python is a high-level programming language",
    "Machine learning models require large datasets",
    "The Eiffel Tower is located in Paris",
    "Neural networks are inspired by the human brain",
    "Pandas is a data manipulation library for Python",
]

# Embed all documents (do this once, store the embeddings)
doc_embeddings = model.encode(documents)

# User's search query
query = "programming languages"
query_embedding = model.encode(query)

# Compute similarity scores
scores = util.cos_sim(query_embedding, doc_embeddings)[0]

# Rank documents by similarity
results = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)

print(f"Search results for: '{query}'\\n")
for idx, score in results[:3]:
    print(f"[{score:.3f}] {documents[idx]}")

# Output:
# [0.627] Python is a high-level programming language
# [0.412] Pandas is a data manipulation library for Python
# [0.289] Machine learning models require large datasets`,
        },
        {
          type: "text",
          content:
            "Notice: even though the query 'programming languages' doesn't appear verbatim in any document, the most relevant result ranks first. That's semantic search.",
        },
      ],
    },
    {
      step: 11,
      title: "What you'll build",
      blocks: [
        {
          type: "text",
          content:
            "In the hands-on project, you'll build a semantic search engine over your own documents (PDFs, text files, web pages). You'll chunk documents, generate embeddings, store them in a vector database, and build a search API that returns the most relevant passages for any query.",
        },
      ],
    },
    {
      step: 12,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question: "Why are embeddings better than keyword search for semantic retrieval?",
          options: [
            "Embeddings capture meaning, so similar concepts are close even if words differ",
            "Embeddings are always faster than keyword search",
            "Embeddings don't require a model",
            "Embeddings work without any training",
          ],
          correct: 0,
          explanation:
            "Embeddings transform text into vectors where semantic similarity = vector proximity. This lets you find 'AI' when searching for 'artificial intelligence', something keyword search cannot do.",
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
    trackSlug: "embeddings-vector-db",
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

// ---------------------------------------------------------------------------
// Lesson 2 — Vector Search Fundamentals
// ---------------------------------------------------------------------------
const vectorSearchFundamentalsLesson: Lesson = {
  slug: "vector-search-fundamentals",
  trackSlug: "embeddings-vector-db",
  order: 2,
  minutes: 16,
  title: "Vector Search Fundamentals",
  subtitle:
    "How to find the nearest neighbors among millions of vectors — brute force, HNSW, IVF, and when each one wins.",
  tags: ["Vector search", "KNN", "ANN", "HNSW"],
  sections: [
    {
      step: 1,
      title: "The problem: search at scale",
      blocks: [
        {
          type: "text",
          content:
            "You have 1 million document embeddings (each is a 384-dimensional vector). A user submits a query. You need to find the 10 most similar documents.\n\nThe naive solution: compute the distance from the query to every single embedding, then take the top 10. This is called **brute force** or **exhaustive search**.",
        },
        {
          type: "text",
          content:
            "Brute force works for small datasets (< 10,000 vectors) but becomes unusably slow at scale:\n\n- 1 million vectors × 384 dimensions × cosine similarity = ~150 million floating-point operations per query\n- At 1ms per query on a single CPU, you can handle ~1,000 queries/second... but only if you have 150 CPU cores running in parallel\n\nWe need faster algorithms.",
        },
      ],
    },
    {
      step: 2,
      title: "Approximate Nearest Neighbors (ANN)",
      blocks: [
        {
          type: "text",
          content:
            "The solution: **Approximate Nearest Neighbor (ANN)** algorithms. They sacrifice a tiny bit of accuracy (you might miss the true #10 result) for massive speed gains (100-1000x faster than brute force).",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "ANN algorithms build an index (a data structure) that lets you skip most vectors during search. You only compute distance to a small subset of candidates.",
        },
        {
          type: "text",
          content:
            "Popular ANN algorithms:\n\n- **HNSW** (Hierarchical Navigable Small World) — graph-based, extremely fast, high recall\n- **IVF** (Inverted File Index) — partitions vectors into clusters, searches a subset\n- **Product Quantization** — compresses vectors to reduce memory and compute\n- **Annoy** (Spotify's algorithm) — tree-based, good for static datasets\n\nMost vector databases use HNSW because it offers the best speed/accuracy trade-off.",
        },
      ],
    },
    {
      step: 3,
      title: "How HNSW works",
      blocks: [
        {
          type: "text",
          content:
            "HNSW builds a multi-layer graph where each node is a vector:\n\n1. **Layer 0** (bottom) contains all vectors, densely connected to nearby neighbors\n2. **Higher layers** contain a sparse subset, acting as 'highways' for long-distance jumps\n3. **Search** starts at the top layer, greedily moves toward the query, then drops down and refines\n\nThis structure lets you traverse millions of vectors by visiting only a few hundred.",
        },
        {
          type: "diagram",
          label: "HNSW multi-layer structure",
          chart: `graph TB
    subgraph "Layer 2 (sparse, long jumps)"
        L2A((A)) --- L2C((C))
    end
    subgraph "Layer 1 (medium density)"
        L1A((A)) --- L1B((B))
        L1B --- L1C((C))
        L1C --- L1D((D))
    end
    subgraph "Layer 0 (all vectors, dense)"
        L0A((A)) --- L0B((B))
        L0B --- L0C((C))
        L0C --- L0D((D))
        L0D --- L0E((E))
        L0E --- L0F((F))
        L0A --- L0C
        L0B --- L0D
    end

    Q[Query] -.start here.-> L2A
    L2A -.jump.-> L2C
    L2C -.drop down.-> L1C
    L1C -.refine.-> L0C
    L0C -.final.-> L0D

    style Q fill:#ffe6e6
    style L0D fill:#e6ffe6`,
        },
        {
          type: "text",
          content:
            "Key parameters:\n\n- **ef_construction** — how many candidates to consider when building the index (higher = better quality, slower build)\n- **M** — number of connections per node (higher = more memory, better recall)\n- **ef_search** — how many candidates to explore during search (higher = better recall, slower query)\n\nTypical values: M=16, ef_construction=200, ef_search=50.",
        },
      ],
    },
    {
      step: 4,
      title: "HNSW in code",
      blocks: [
        {
          type: "text",
          content:
            "Let's use the `hnswlib` library to build an HNSW index:",
        },
        {
          type: "code",
          language: "python",
          label: "Build and query HNSW index",
          code: `# Install: pip install hnswlib numpy
import hnswlib
import numpy as np

# Generate fake embeddings (in practice, use real ones)
num_vectors = 100000
dim = 384
data = np.random.rand(num_vectors, dim).astype('float32')

# Create HNSW index
index = hnswlib.Index(space='cosine', dim=dim)
index.init_index(max_elements=num_vectors, ef_construction=200, M=16)

# Add vectors to index
index.add_items(data)

# Set query-time parameter
index.set_ef(50)  # ef_search: higher = better recall, slower

# Query
query = np.random.rand(dim).astype('float32')
labels, distances = index.knn_query(query, k=10)

print(f"Top 10 nearest neighbors: {labels[0]}")
print(f"Distances: {distances[0]}")

# Benchmark
import time
start = time.time()
for _ in range(1000):
    index.knn_query(query, k=10)
end = time.time()
print(f"1000 queries in {end - start:.2f}s = {1000 / (end - start):.0f} QPS")`,
        },
        {
          type: "text",
          content:
            "On a typical laptop, HNSW achieves **5,000-10,000 queries per second** on 100k vectors with 95%+ recall. Brute force would be 10-100x slower.",
        },
      ],
    },
    {
      step: 5,
      title: "IVF: clustering for search",
      blocks: [
        {
          type: "text",
          content:
            "IVF (Inverted File Index) partitions vectors into clusters using k-means:\n\n1. Cluster all vectors into N groups (e.g., N=1000)\n2. At search time, find the K nearest clusters to the query (e.g., K=10)\n3. Search only within those K clusters (ignore the other 990)\n\nThis reduces the search space by 100x if you search 10 out of 1000 clusters.",
        },
        {
          type: "text",
          content:
            "Trade-offs:\n\n- **Faster than brute force** — you only search a fraction of the data\n- **Slower than HNSW** — still computes distance to all vectors in selected clusters\n- **Better memory efficiency** — doesn't need a graph structure\n- **Risk of missing results** — if the best match is in a cluster you didn't search\n\nIVF is good for very large datasets (100M+ vectors) where HNSW's graph becomes too big to fit in RAM.",
        },
        {
          type: "code",
          language: "python",
          label: "IVF with FAISS",
          code: `# Install: pip install faiss-cpu
import faiss
import numpy as np

dim = 384
num_vectors = 100000
data = np.random.rand(num_vectors, dim).astype('float32')

# Train k-means centroids (1000 clusters)
nlist = 1000
quantizer = faiss.IndexFlatL2(dim)
index = faiss.IndexIVFFlat(quantizer, dim, nlist)

# Train the index
index.train(data)
index.add(data)

# Search: probe 10 nearest clusters
index.nprobe = 10
query = np.random.rand(1, dim).astype('float32')
distances, labels = index.search(query, k=10)

print(f"Top 10 nearest neighbors: {labels[0]}")
print(f"Distances: {distances[0]}")`,
        },
      ],
    },
    {
      step: 6,
      title: "Product Quantization: compress vectors",
      blocks: [
        {
          type: "text",
          content:
            "Product Quantization (PQ) compresses vectors to reduce memory and speed up distance calculations:\n\n- Split each 384D vector into 8 sub-vectors of 48D each\n- Quantize each sub-vector to 256 codes (1 byte per sub-vector)\n- Store only the codes, not the full floats\n\nResult: 384 floats (1536 bytes) → 8 bytes (192x compression!).",
        },
        {
          type: "callout",
          kind: "gotcha",
          content:
            "PQ loses accuracy. You're approximating vectors with a finite codebook. Use it when memory is the bottleneck and you can tolerate 5-10% lower recall.",
        },
        {
          type: "text",
          content:
            "PQ is often combined with IVF: IVF reduces the search space, PQ reduces memory. This is called **IVFPQ** and is the workhorse for billion-scale vector search.",
        },
      ],
    },
    {
      step: 7,
      title: "Benchmarking ANN algorithms",
      blocks: [
        {
          type: "text",
          content:
            "How do you choose? Benchmark on your data. Key metrics:",
        },
        {
          type: "kv",
          items: [
            { key: "Recall@10", value: "What % of the true top-10 results did you find? (95%+ is good)" },
            { key: "QPS (queries/sec)", value: "How many queries can you handle per second?" },
            { key: "Index build time", value: "How long to build the index? (one-time cost)" },
            { key: "Memory usage", value: "How much RAM does the index consume?" },
          ],
        },
        {
          type: "text",
          content:
            "Typical results on 1M vectors (384D):",
        },
        {
          type: "list",
          style: "bullet",
          items: [
            "**Brute force**: 100% recall, 10 QPS, 0 build time, 1.5GB RAM",
            "**HNSW**: 95-99% recall, 5000 QPS, 5 min build, 2GB RAM",
            "**IVF (nprobe=10)**: 90-95% recall, 500 QPS, 2 min build, 1.5GB RAM",
            "**IVFPQ**: 85-90% recall, 1000 QPS, 3 min build, 200MB RAM",
          ],
        },
        {
          type: "text",
          content:
            "**Rule of thumb:** Use HNSW unless memory is tight (then IVFPQ) or the dataset is static and you want simplicity (then Annoy).",
        },
      ],
    },
    {
      step: 8,
      title: "Recall vs speed trade-off",
      blocks: [
        {
          type: "text",
          content:
            "All ANN algorithms have tunable parameters that control the recall/speed trade-off:",
        },
        {
          type: "code",
          language: "python",
          label: "Tuning HNSW recall vs speed",
          code: `import hnswlib
import numpy as np

dim = 384
data = np.random.rand(10000, dim).astype('float32')

index = hnswlib.Index(space='cosine', dim=dim)
index.init_index(max_elements=10000, ef_construction=200, M=16)
index.add_items(data)

# Test different ef_search values
for ef in [10, 20, 50, 100, 200]:
    index.set_ef(ef)

    # Measure query time
    import time
    query = np.random.rand(dim).astype('float32')
    start = time.time()
    for _ in range(100):
        index.knn_query(query, k=10)
    elapsed = time.time() - start

    print(f"ef={ef}: {100 / elapsed:.0f} QPS")

# Output (typical):
# ef=10: 20000 QPS (lower recall)
# ef=20: 15000 QPS
# ef=50: 8000 QPS
# ef=100: 5000 QPS
# ef=200: 3000 QPS (highest recall)`,
        },
        {
          type: "text",
          content:
            "Start with default parameters (ef_search=50). If recall is too low, increase ef_search. If queries are too slow, decrease it or use a smaller M value.",
        },
      ],
    },
    {
      step: 9,
      title: "What you'll build",
      blocks: [
        {
          type: "text",
          content:
            "In the hands-on project, you'll implement a vector search system that compares brute force vs HNSW vs IVF on a real dataset. You'll measure recall@10, QPS, and memory usage, then tune parameters to hit 95% recall at 5000+ QPS. You'll also visualize the speed/recall curve to see where the sweet spot is.",
        },
      ],
    },
    {
      step: 10,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question: "Why is HNSW faster than brute force?",
          options: [
            "It builds a multi-layer graph that skips most vectors during search",
            "It compresses vectors to use less memory",
            "It uses GPU acceleration",
            "It pre-computes all distances at index build time",
          ],
          correct: 0,
          explanation:
            "HNSW builds a hierarchical graph with 'highway' layers that let you jump across the search space, visiting only hundreds of vectors instead of millions. This gives 100x speedup with minimal accuracy loss.",
        },
      ],
    },
  ],
};

export const embeddingsVectorDbLessons: Lesson[] = [
  understandingEmbeddingsLesson,
  vectorSearchFundamentalsLesson,
  {
    slug: "vector-databases",
    trackSlug: "embeddings-vector-db",
    order: 3,
    minutes: 18,
    title: "Vector Databases",
    subtitle:
      "Chroma, Qdrant, Weaviate, Pinecone, pgvector — how to pick, deploy, and query a vector database.",
    tags: ["Vector DB", "Chroma", "Qdrant", "Pinecone"],
    sections: [
      {
        step: 1,
        title: "Why use a vector database?",
        blocks: [
          {
            type: "text",
            content:
              "You could store embeddings in a regular database (Postgres, MySQL) or even as numpy arrays on disk. So why use a specialized vector database?\n\n**Vector databases are optimized for:**\n\n- **Fast similarity search** — HNSW, IVF indexes built-in\n- **Metadata filtering** — combine semantic search with structured queries\n- **Horizontal scaling** — shard across multiple machines\n- **Production features** — persistence, backups, monitoring, APIs\n- **Hybrid search** — combine vector + keyword search in one query",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "A vector database is to embeddings what Elasticsearch is to full-text search: a specialized tool that handles the indexing, querying, and scaling for you.",
          },
        ],
      },
      {
        step: 2,
        title: "Landscape of vector databases",
        blocks: [
          {
            type: "text",
            content:
              "The vector database space is crowded. Here's a breakdown by use case:",
          },
          {
            type: "kv",
            items: [
              { key: "Chroma", value: "Embedded, Python-first, great for prototypes. Stores data locally or in S3." },
              { key: "Qdrant", value: "Fast (Rust-based), self-hosted or cloud. Best for latency-critical apps." },
              { key: "Weaviate", value: "GraphQL API, built-in vectorization, hybrid search. Good for content platforms." },
              { key: "Pinecone", value: "Fully managed SaaS. Zero ops, pay-per-query. Best for teams that want no infra." },
              { key: "Milvus", value: "Distributed, enterprise-scale. Use for 100M+ vectors across clusters." },
              { key: "pgvector", value: "Postgres extension. Use if you already have Postgres and want to add vector search." },
              { key: "Vespa", value: "Hybrid search + ML serving. Overkill for simple use cases, powerful for complex systems." },
            ],
          },
          {
            type: "text",
            content:
              "**Recommendation:** Start with Chroma (local dev) or Qdrant (production). Upgrade to Pinecone if you want zero ops, or pgvector if you're already on Postgres.",
          },
        ],
      },
      {
        step: 3,
        title: "Chroma: embedded vector DB",
        blocks: [
          {
            type: "text",
            content:
              "Chroma is the simplest vector database. It runs embedded (no separate server) and stores data locally. Perfect for prototypes and small-scale apps.",
          },
          {
            type: "code",
            language: "python",
            label: "Chroma quickstart",
            code: `# Install: pip install chromadb
import chromadb
from chromadb.utils import embedding_functions

# Create a client (stores data in ./chroma_data/)
client = chromadb.PersistentClient(path="./chroma_data")

# Create a collection (like a table)
collection = client.create_collection(
    name="my_docs",
    embedding_function=embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
)

# Add documents (Chroma auto-generates embeddings)
collection.add(
    documents=[
        "Python is a high-level programming language",
        "Machine learning requires large datasets",
        "Neural networks are inspired by the brain",
    ],
    metadatas=[
        {"source": "wikipedia", "year": 2023},
        {"source": "textbook", "year": 2022},
        {"source": "wikipedia", "year": 2023},
    ],
    ids=["doc1", "doc2", "doc3"]
)

# Query (auto-embeds the query text)
results = collection.query(
    query_texts=["programming languages"],
    n_results=2
)

print(results["documents"])  # [["Python is a high-level...", ...]]
print(results["metadatas"])  # [[{"source": "wikipedia", ...}]]`,
          },
          {
            type: "text",
            content:
              "Notice: Chroma auto-generates embeddings if you provide an embedding_function. You can also provide pre-computed embeddings via `embeddings=[...]`.",
          },
        ],
      },
      {
        step: 4,
        title: "Qdrant: production-ready vector search",
        blocks: [
          {
            type: "text",
            content:
              "Qdrant is fast, self-hosted, and production-ready. Written in Rust, it handles millions of vectors with low latency.",
          },
          {
            type: "code",
            language: "python",
            label: "Qdrant setup and query",
            code: `# Install: pip install qdrant-client
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import numpy as np

# Connect to Qdrant (runs via Docker: docker run -p 6333:6333 qdrant/qdrant)
client = QdrantClient(host="localhost", port=6333)

# Create a collection
client.create_collection(
    collection_name="documents",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
)

# Insert vectors (you provide embeddings)
embeddings = np.random.rand(3, 384).tolist()  # In practice, use real embeddings
client.upsert(
    collection_name="documents",
    points=[
        PointStruct(
            id=1,
            vector=embeddings[0],
            payload={"text": "Python programming", "category": "tech"}
        ),
        PointStruct(
            id=2,
            vector=embeddings[1],
            payload={"text": "Machine learning basics", "category": "AI"}
        ),
        PointStruct(
            id=3,
            vector=embeddings[2],
            payload={"text": "Cooking recipes", "category": "food"}
        ),
    ]
)

# Search
query_vector = np.random.rand(384).tolist()
results = client.search(
    collection_name="documents",
    query_vector=query_vector,
    limit=2
)

for hit in results:
    print(f"[{hit.score:.3f}] {hit.payload['text']}")`,
          },
          {
            type: "text",
            content:
              "Qdrant requires you to provide embeddings (it doesn't auto-generate them). This gives you full control over the embedding model and lets you batch embedding generation separately.",
          },
        ],
      },
      {
        step: 5,
        title: "Metadata filtering",
        blocks: [
          {
            type: "text",
            content:
              "All vector databases let you attach metadata (JSON) to each vector and filter during search:",
          },
          {
            type: "code",
            language: "python",
            label: "Filter by metadata in Qdrant",
            code: `from qdrant_client.models import Filter, FieldCondition, MatchValue

# Search with a filter: only return results where category="AI"
results = client.search(
    collection_name="documents",
    query_vector=query_vector,
    query_filter=Filter(
        must=[
            FieldCondition(
                key="category",
                match=MatchValue(value="AI")
            )
        ]
    ),
    limit=2
)

for hit in results:
    print(f"[{hit.score:.3f}] {hit.payload['text']} (category: {hit.payload['category']})")`,
          },
          {
            type: "text",
            content:
              "Metadata filtering is essential for multi-tenant apps (filter by user_id), time-based search (filter by date), or scoped search (filter by category/source).",
          },
        ],
      },
      {
        step: 6,
        title: "pgvector: Postgres extension",
        blocks: [
          {
            type: "text",
            content:
              "If you already use Postgres, pgvector adds vector search as an extension. No new database to learn.",
          },
          {
            type: "code",
            language: "sql",
            label: "pgvector in Postgres",
            code: `-- Install extension
CREATE EXTENSION vector;

-- Create a table with a vector column
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    text TEXT,
    embedding vector(384)
);

-- Insert vectors
INSERT INTO documents (text, embedding) VALUES
  ('Python programming', '[0.1, 0.2, ..., 0.9]'),
  ('Machine learning', '[0.15, 0.25, ..., 0.85]');

-- Create an index (IVFFlat or HNSW)
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

-- Query for nearest neighbors
SELECT text, 1 - (embedding <=> '[0.1, 0.2, ..., 0.8]') AS similarity
FROM documents
ORDER BY embedding <=> '[0.1, 0.2, ..., 0.8]'
LIMIT 5;`,
          },
          {
            type: "text",
            content:
              "pgvector is great if you want to keep everything in Postgres (vectors + relational data). However, it's slower than specialized vector DBs for large datasets (1M+ vectors).",
          },
        ],
      },
      {
        step: 7,
        title: "Choosing a vector database",
        blocks: [
          {
            type: "text",
            content:
              "Decision matrix:",
          },
          {
            type: "list",
            style: "bullet",
            items: [
              "**Prototyping?** → Chroma (zero setup, Python-native)",
              "**Self-hosted production?** → Qdrant (fast, battle-tested)",
              "**Zero ops, SaaS?** → Pinecone (fully managed, pay-per-query)",
              "**Already on Postgres?** → pgvector (one less system to manage)",
              "**100M+ vectors, distributed?** → Milvus (horizontal scaling)",
              "**Complex hybrid search + ML?** → Weaviate or Vespa",
            ],
          },
          {
            type: "callout",
            kind: "tip",
            content:
              "Start simple: Chroma for dev, Qdrant or Pinecone for production. Don't over-engineer early.",
          },
        ],
      },
      {
        step: 8,
        title: "Benchmarking vector databases",
        blocks: [
          {
            type: "text",
            content:
              "When comparing vector databases, measure:",
          },
          {
            type: "kv",
            items: [
              { key: "Query latency (p50, p99)", value: "How fast are queries? Aim for < 50ms p99." },
              { key: "Throughput (QPS)", value: "How many queries/sec can it handle?" },
              { key: "Recall@10", value: "Does it return the true top-10 results?" },
              { key: "Memory usage", value: "How much RAM per 1M vectors?" },
              { key: "Index build time", value: "How long to build the index?" },
            ],
          },
          {
            type: "text",
            content:
              "Use the ann-benchmarks.com dataset (SIFT1M, GIST1M) to compare fairly. Most vector DBs publish benchmark results.",
          },
        ],
      },
      {
        step: 9,
        title: "What you'll build",
        blocks: [
          {
            type: "text",
            content:
              "In the hands-on project, you'll set up Qdrant locally, insert 10k document embeddings with metadata, build an HNSW index, and implement filtered search (e.g., 'find documents about AI published after 2022'). You'll measure query latency and compare it to brute force search.",
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "When should you use pgvector instead of a specialized vector database?",
            options: [
              "When you already have Postgres and want to keep everything in one system",
              "When you need the fastest possible vector search",
              "When you have 100M+ vectors",
              "When you need hybrid search",
            ],
            correct: 0,
            explanation:
              "pgvector is best for teams already using Postgres who want to avoid adding another database. It's not the fastest option (specialized vector DBs are faster), but it reduces operational complexity.",
          },
        ],
      },
    ],
  },
  {
    slug: "chunking-strategies",
    trackSlug: "embeddings-vector-db",
    order: 4,
    minutes: 14,
    title: "Chunking Strategies",
    subtitle:
      "How to split documents into embeddable pieces without destroying meaning — fixed-size, sentence-based, semantic chunking.",
    tags: ["Chunking", "Text splitting", "Semantic units"],
    sections: [
      {
        step: 1,
        title: "The chunking problem",
        blocks: [
          {
            type: "text",
            content:
              "Embedding models have token limits:\n\n- sentence-transformers (BERT-based): 512 tokens\n- OpenAI text-embedding-3: 8192 tokens\n- Cohere embed-english-v3: 512 tokens\n\nIf your document is 10,000 words, you can't embed it all at once. You must **chunk** it into smaller pieces.",
          },
          {
            type: "text",
            content:
              "But chunking has a trade-off:\n\n- **Too small** → you lose context (a single sentence might be meaningless without surrounding paragraphs)\n- **Too large** → you retrieve irrelevant content (the entire page matches when only one paragraph is relevant)\n\nThe right chunk size depends on your data and queries.",
          },
        ],
      },
      {
        step: 2,
        title: "Fixed-size chunking with overlap",
        blocks: [
          {
            type: "text",
            content:
              "The simplest strategy: split text every N tokens, with an overlap of M tokens:",
          },
          {
            type: "code",
            language: "python",
            label: "Fixed-size chunking",
            code: `def chunk_text_fixed(text: str, chunk_size: int = 512, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    return chunks

document = "Long document text here..." * 100
chunks = chunk_text_fixed(document, chunk_size=200, overlap=50)
print(f"Split into {len(chunks)} chunks")
print(f"First chunk: {chunks[0][:100]}...")`,
          },
          {
            type: "text",
            content:
              "Overlap ensures that sentences spanning chunk boundaries don't get split awkwardly. Typical values: chunk_size=500, overlap=50.",
          },
          {
            type: "callout",
            kind: "gotcha",
            content:
              "Fixed-size chunking can split mid-sentence or mid-thought. It works for general text but fails for structured documents (code, tables, lists).",
          },
        ],
      },
      {
        step: 3,
        title: "Sentence-based chunking",
        blocks: [
          {
            type: "text",
            content:
              "Better: split on sentence boundaries using a sentence tokenizer:",
          },
          {
            type: "code",
            language: "python",
            label: "Sentence-based chunking",
            code: `# Install: pip install nltk
import nltk
nltk.download('punkt')

def chunk_by_sentences(text: str, max_sentences: int = 5) -> list[str]:
    sentences = nltk.sent_tokenize(text)
    chunks = []

    for i in range(0, len(sentences), max_sentences):
        chunk = " ".join(sentences[i:i + max_sentences])
        chunks.append(chunk)

    return chunks

document = "First sentence. Second sentence. Third sentence. Fourth sentence. Fifth sentence. Sixth sentence."
chunks = chunk_by_sentences(document, max_sentences=2)
print(chunks)
# Output: ['First sentence. Second sentence.', 'Third sentence. Fourth sentence.', ...]`,
          },
          {
            type: "text",
            content:
              "This respects sentence boundaries, avoiding mid-sentence splits. You can also set a max_tokens limit instead of max_sentences.",
          },
        ],
      },
      {
        step: 4,
        title: "Paragraph-based chunking",
        blocks: [
          {
            type: "text",
            content:
              "For long-form documents (articles, reports), paragraphs are natural semantic units:",
          },
          {
            type: "code",
            language: "python",
            label: "Paragraph-based chunking",
            code: `def chunk_by_paragraphs(text: str) -> list[str]:
    # Split on double newlines (paragraph breaks)
    paragraphs = text.split("\\n\\n")

    # Filter out empty paragraphs
    chunks = [p.strip() for p in paragraphs if p.strip()]

    return chunks

document = """Paragraph one.

Paragraph two.

Paragraph three."""
chunks = chunk_by_paragraphs(document)
print(chunks)
# Output: ['Paragraph one.', 'Paragraph two.', 'Paragraph three.']`,
          },
          {
            type: "text",
            content:
              "If paragraphs are too long (> 512 tokens), combine this with sentence-based chunking: split each paragraph into sentences, then group sentences until you hit the token limit.",
          },
        ],
      },
      {
        step: 5,
        title: "Semantic chunking",
        blocks: [
          {
            type: "text",
            content:
              "The most advanced strategy: split when the topic shifts. This requires measuring semantic similarity between adjacent sentences:",
          },
          {
            type: "code",
            language: "python",
            label: "Semantic chunking",
            code: `from sentence_transformers import SentenceTransformer, util
import nltk

def semantic_chunking(text: str, threshold: float = 0.7) -> list[str]:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    sentences = nltk.sent_tokenize(text)

    if len(sentences) < 2:
        return [text]

    # Embed all sentences
    embeddings = model.encode(sentences)

    # Find topic boundaries (low similarity between adjacent sentences)
    chunks = []
    current_chunk = [sentences[0]]

    for i in range(1, len(sentences)):
        similarity = util.cos_sim(embeddings[i-1], embeddings[i]).item()

        if similarity < threshold:
            # Topic shift detected, start new chunk
            chunks.append(" ".join(current_chunk))
            current_chunk = [sentences[i]]
        else:
            current_chunk.append(sentences[i])

    chunks.append(" ".join(current_chunk))
    return chunks

document = "Python is great. It's easy to learn. Now let's talk about cars. Cars are fast."
chunks = semantic_chunking(document, threshold=0.5)
print(chunks)
# Output: ['Python is great. It's easy to learn.', "Now let's talk about cars. Cars are fast."]`,
          },
          {
            type: "text",
            content:
              "Semantic chunking produces the cleanest chunks but is slow (requires embedding every sentence). Use it for high-quality applications where retrieval accuracy is critical.",
          },
        ],
      },
      {
        step: 6,
        title: "Chunking with metadata",
        blocks: [
          {
            type: "text",
            content:
              "Always attach metadata to chunks so you can filter during search:",
          },
          {
            type: "code",
            language: "python",
            label: "Add metadata to chunks",
            code: `def chunk_with_metadata(document: dict, chunk_size: int = 500) -> list[dict]:
    text = document["content"]
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk_text = " ".join(words[i:i + chunk_size])
        chunks.append({
            "text": chunk_text,
            "source": document["source"],
            "chunk_index": len(chunks),
            "total_chunks": None,  # Fill in after loop
        })

    # Update total_chunks
    for chunk in chunks:
        chunk["total_chunks"] = len(chunks)

    return chunks

doc = {"content": "Very long document...", "source": "https://example.com/article"}
chunks = chunk_with_metadata(doc, chunk_size=200)
print(chunks[0])
# Output: {'text': '...', 'source': 'https://example.com/article', 'chunk_index': 0, 'total_chunks': 5}`,
          },
          {
            type: "text",
            content:
              "Metadata like source, author, date, chunk_index helps you:\n\n- Filter results ('only chunks from source X')\n- Reconstruct the original document\n- Debug retrieval quality",
          },
        ],
      },
      {
        step: 7,
        title: "Choosing a chunking strategy",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "General text", value: "Sentence-based (5-10 sentences per chunk)" },
              { key: "Long articles", value: "Paragraph-based or semantic chunking" },
              { key: "Code", value: "Function-level chunking (split by function definitions)" },
              { key: "Structured data", value: "Table row chunking or JSON object chunking" },
              { key: "Chat logs", value: "Message-based chunking (group by speaker or time)" },
            ],
          },
          {
            type: "callout",
            kind: "tip",
            content:
              "Start with sentence-based chunking (simple, fast, good results). Only use semantic chunking if retrieval quality is poor.",
          },
        ],
      },
      {
        step: 8,
        title: "What you'll build",
        blocks: [
          {
            type: "text",
            content:
              "In the hands-on project, you'll implement all three chunking strategies (fixed-size, sentence-based, semantic) and compare their retrieval quality on a real dataset. You'll measure recall@10 and see which strategy works best for your data.",
          },
        ],
      },
      {
        step: 9,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why is overlap important in fixed-size chunking?",
            options: [
              "It prevents sentences at chunk boundaries from losing context",
              "It makes chunks larger",
              "It speeds up embedding generation",
              "It reduces memory usage",
            ],
            correct: 0,
            explanation:
              "Overlap ensures that sentences spanning chunk boundaries appear in both chunks, so they don't lose surrounding context. Without overlap, a key sentence might be split across chunks and become harder to retrieve.",
          },
        ],
      },
    ],
  },
  {
    slug: "metadata-filtering",
    trackSlug: "embeddings-vector-db",
    order: 5,
    minutes: 12,
    title: "Metadata and Filtering",
    subtitle:
      "Store structured attributes alongside vectors — dates, authors, tags — and combine semantic + structured queries.",
    tags: ["Metadata", "Filtering", "Hybrid queries"],
    sections: [
      {
        step: 1,
        title: "Why metadata matters",
        blocks: [
          {
            type: "text",
            content:
              "Pure vector search finds semantically similar documents. But what if you want:\n\n- 'Documents about AI published after 2023'\n- 'Articles by Alice or Bob'\n- 'Support tickets from premium users'\n\nVector search can't handle these constraints. You need **metadata filtering**.",
          },
          {
            type: "text",
            content:
              "Metadata is structured data (JSON) attached to each vector. Vector databases let you filter by metadata before or after computing similarity.",
          },
        ],
      },
      {
        step: 2,
        title: "Pre-filtering vs post-filtering",
        blocks: [
          {
            type: "text",
            content:
              "Two strategies:",
          },
          {
            type: "kv",
            items: [
              { key: "Pre-filtering", value: "Filter BEFORE vector search. Only search among vectors that match the filter. Faster if the filter narrows the space significantly." },
              { key: "Post-filtering", value: "Search FIRST, then filter results. Faster if the filter matches most vectors or if the filter is expensive to evaluate." },
            ],
          },
          {
            type: "text",
            content:
              "Example: If you have 1M vectors and filter by 'year=2024' (10k matches), pre-filtering searches only 10k vectors. If you filter by 'premium_user=true' (990k matches), post-filtering is faster.",
          },
          {
            type: "callout",
            kind: "tip",
            content:
              "Most vector databases automatically choose pre or post-filtering based on the selectivity of your filter.",
          },
        ],
      },
      {
        step: 3,
        title: "Adding metadata in Qdrant",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Store metadata with vectors",
            code: `from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct

client = QdrantClient(host="localhost", port=6333)

# Insert vectors with metadata
client.upsert(
    collection_name="articles",
    points=[
        PointStruct(
            id=1,
            vector=[0.1, 0.2, ...],  # 384D embedding
            payload={
                "title": "Intro to Neural Networks",
                "author": "Alice",
                "year": 2024,
                "tags": ["AI", "deep learning"],
                "premium": True,
            }
        ),
        PointStruct(
            id=2,
            vector=[0.15, 0.25, ...],
            payload={
                "title": "Cooking with Python",
                "author": "Bob",
                "year": 2023,
                "tags": ["programming", "tutorial"],
                "premium": False,
            }
        ),
    ]
)`,
          },
        ],
      },
      {
        step: 4,
        title: "Filtering during search",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Filter by metadata",
            code: `from qdrant_client.models import Filter, FieldCondition, MatchValue, Range

# Query: "Find articles about AI published after 2023 by premium users"
results = client.search(
    collection_name="articles",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[
            FieldCondition(key="year", range=Range(gt=2023)),
            FieldCondition(key="premium", match=MatchValue(value=True)),
        ]
    ),
    limit=10
)

for hit in results:
    print(f"[{hit.score:.3f}] {hit.payload['title']} by {hit.payload['author']}")`,
          },
          {
            type: "text",
            content:
              "Supported filter operators:\n\n- **match** — exact match (category='AI')\n- **range** — gt, gte, lt, lte (year > 2023)\n- **geo** — within radius (location near [lat, lon])\n- **must / should / must_not** — boolean logic (AND, OR, NOT)",
          },
        ],
      },
      {
        step: 5,
        title: "Structuring metadata for fast queries",
        blocks: [
          {
            type: "text",
            content:
              "Design metadata for common query patterns:",
          },
          {
            type: "list",
            style: "bullet",
            items: [
              "**Time-based queries** — store date as Unix timestamp (int) for fast range queries",
              "**Multi-tenant apps** — always include `user_id` or `tenant_id` for scoped search",
              "**Faceted search** — store tags/categories as arrays: `['AI', 'ML', 'DL']`",
              "**Full-text fallback** — store a text field for keyword search if hybrid search isn't available",
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Well-structured metadata",
            code: `payload = {
    "text": "Full document text (for fallback keyword search)",
    "title": "Neural Networks",
    "author_id": "alice_123",
    "created_at": 1704067200,  # Unix timestamp, easy to range-query
    "tags": ["AI", "deep learning", "tutorial"],  # Array for multi-select
    "word_count": 1500,
    "language": "en",
    "source": "https://example.com/article",
}`,
          },
        ],
      },
      {
        step: 6,
        title: "Common filtering patterns",
        blocks: [
          {
            type: "text",
            content:
              "Patterns you'll use often:",
          },
          {
            type: "code",
            language: "python",
            label: "Filter recipes",
            code: `# 1. Time range (last 30 days)
import time
now = int(time.time())
thirty_days_ago = now - (30 * 24 * 60 * 60)

Filter(must=[
    FieldCondition(key="created_at", range=Range(gte=thirty_days_ago))
])

# 2. Multi-select (tags contain 'AI' OR 'ML')
Filter(should=[
    FieldCondition(key="tags", match=MatchValue(value="AI")),
    FieldCondition(key="tags", match=MatchValue(value="ML")),
])

# 3. Exclude (NOT deleted)
Filter(must_not=[
    FieldCondition(key="deleted", match=MatchValue(value=True))
])

# 4. Combine (AI articles from last 30 days, not deleted)
Filter(
    must=[
        FieldCondition(key="created_at", range=Range(gte=thirty_days_ago)),
        FieldCondition(key="tags", match=MatchValue(value="AI")),
    ],
    must_not=[
        FieldCondition(key="deleted", match=MatchValue(value=True))
    ]
)`,
          },
        ],
      },
      {
        step: 7,
        title: "What you'll build",
        blocks: [
          {
            type: "text",
            content:
              "In the hands-on project, you'll build a filtered search API that supports queries like 'find documents about X published by author Y after date Z'. You'll measure the performance impact of pre vs post-filtering and optimize metadata structure for common queries.",
          },
        ],
      },
      {
        step: 8,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "When is pre-filtering faster than post-filtering?",
            options: [
              "When the filter significantly narrows the search space (e.g., 10k out of 1M vectors match)",
              "When the filter matches most vectors",
              "When you want exact results",
              "Pre-filtering is always faster",
            ],
            correct: 0,
            explanation:
              "Pre-filtering is faster when the filter eliminates most vectors, so you search a small subset. If the filter matches 99% of vectors, you're better off searching all vectors and filtering the results afterward.",
          },
        ],
      },
    ],
  },
  {
    slug: "hybrid-search",
    trackSlug: "embeddings-vector-db",
    order: 6,
    minutes: 16,
    title: "Hybrid Search",
    subtitle:
      "Combine keyword search (BM25) with vector search for better recall — when one fails, the other catches it.",
    tags: ["Hybrid search", "BM25", "Reranking"],
    sections: [
      {
        step: 1,
        title: "The limits of vector search",
        blocks: [
          {
            type: "text",
            content:
              "Vector search is great for semantic similarity, but it has blind spots:\n\n- **Exact keyword matches** — searching for 'GPT-4' might not match 'GPT-4' if the embedding conflates it with 'GPT-3' or 'LLM'\n- **Rare terms** — embedding models may not have learned good representations for domain-specific jargon\n- **Numbers and codes** — 'order #12345' is hard to match semantically\n\nKeyword search (BM25) excels at these but fails at semantic similarity.",
          },
          {
            type: "text",
            content:
              "**Hybrid search** runs both in parallel and merges results, getting the best of both worlds.",
          },
        ],
      },
      {
        step: 2,
        title: "How BM25 works",
        blocks: [
          {
            type: "text",
            content:
              "BM25 (Best Match 25) is a probabilistic keyword search algorithm. It scores documents based on:\n\n- **Term frequency (TF)** — how often the query terms appear in the document\n- **Inverse document frequency (IDF)** — rare terms score higher than common terms\n- **Document length** — shorter documents are penalized less\n\nBM25 is the algorithm behind Elasticsearch and most full-text search engines.",
          },
          {
            type: "code",
            language: "python",
            label: "BM25 with rank_bm25 library",
            code: `# Install: pip install rank-bm25
from rank_bm25 import BM25Okapi

corpus = [
    "Python is a programming language",
    "Machine learning with Python",
    "GPT-4 is a large language model",
]

# Tokenize and build BM25 index
tokenized_corpus = [doc.lower().split() for doc in corpus]
bm25 = BM25Okapi(tokenized_corpus)

# Query
query = "GPT-4"
tokenized_query = query.lower().split()
scores = bm25.get_scores(tokenized_query)

print(scores)  # [0.0, 0.0, 1.42] — only doc 2 matches

# Get top-k
import numpy as np
top_k = np.argsort(scores)[::-1][:2]
for idx in top_k:
    print(f"[{scores[idx]:.2f}] {corpus[idx]}")`,
          },
        ],
      },
      {
        step: 3,
        title: "Reciprocal Rank Fusion (RRF)",
        blocks: [
          {
            type: "text",
            content:
              "How do you combine results from vector search and BM25?\n\nThe simplest method: **Reciprocal Rank Fusion (RRF)**. Instead of combining scores (which have different scales), combine ranks:",
          },
          {
            type: "code",
            language: "python",
            label: "Reciprocal Rank Fusion",
            code: `def reciprocal_rank_fusion(
    vector_results: list[str],
    bm25_results: list[str],
    k: int = 60
) -> list[str]:
    """
    Combine two ranked lists using RRF.
    k is a constant (typically 60) that smooths the ranks.
    """
    scores = {}

    # Add vector search ranks
    for rank, doc_id in enumerate(vector_results, start=1):
        scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)

    # Add BM25 ranks
    for rank, doc_id in enumerate(bm25_results, start=1):
        scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)

    # Sort by combined score
    return sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

# Example
vector_results = ["doc1", "doc2", "doc3"]  # Ranked by cosine similarity
bm25_results = ["doc3", "doc4", "doc1"]    # Ranked by BM25 score

merged = reciprocal_rank_fusion(vector_results, bm25_results)
print(merged)  # ['doc1', 'doc3', 'doc2', 'doc4']`,
          },
          {
            type: "text",
            content:
              "RRF is simple, effective, and doesn't require normalizing scores across different search systems.",
          },
        ],
      },
      {
        step: 4,
        title: "Hybrid search in practice",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Full hybrid search system",
            code: `from sentence_transformers import SentenceTransformer
from rank_bm25 import BM25Okapi

class HybridSearch:
    def __init__(self, documents: list[str]):
        self.documents = documents

        # Build vector index
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.embeddings = self.model.encode(documents)

        # Build BM25 index
        tokenized = [doc.lower().split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized)

    def search(self, query: str, top_k: int = 10) -> list[str]:
        # Vector search
        query_emb = self.model.encode(query)
        from sentence_transformers import util
        vector_scores = util.cos_sim(query_emb, self.embeddings)[0]
        vector_results = vector_scores.argsort(descending=True)[:top_k].tolist()

        # BM25 search
        tokenized_query = query.lower().split()
        bm25_scores = self.bm25.get_scores(tokenized_query)
        import numpy as np
        bm25_results = np.argsort(bm25_scores)[::-1][:top_k].tolist()

        # Fuse
        merged_ids = reciprocal_rank_fusion(vector_results, bm25_results)
        return [self.documents[i] for i in merged_ids[:top_k]]

# Usage
docs = ["Python programming", "Machine learning with GPT-4", "GPT-4 tutorial"]
search = HybridSearch(docs)
results = search.search("GPT-4", top_k=2)
print(results)`,
          },
        ],
      },
      {
        step: 5,
        title: "Weighted hybrid search",
        blocks: [
          {
            type: "text",
            content:
              "Sometimes you want to favor one search method over the other. Use weights:",
          },
          {
            type: "code",
            language: "python",
            label: "Weighted RRF",
            code: `def weighted_rrf(
    vector_results: list[str],
    bm25_results: list[str],
    vector_weight: float = 0.7,
    bm25_weight: float = 0.3,
    k: int = 60
) -> list[str]:
    scores = {}

    for rank, doc_id in enumerate(vector_results, start=1):
        scores[doc_id] = scores.get(doc_id, 0) + vector_weight / (k + rank)

    for rank, doc_id in enumerate(bm25_results, start=1):
        scores[doc_id] = scores.get(doc_id, 0) + bm25_weight / (k + rank)

    return sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

# Favor vector search (70%) over BM25 (30%)
merged = weighted_rrf(vector_results, bm25_results, vector_weight=0.7, bm25_weight=0.3)`,
          },
          {
            type: "text",
            content:
              "Tune weights based on your data:\n\n- **High semantic similarity** → weight vector search higher\n- **Exact keyword matches important** → weight BM25 higher\n- **Balanced** → 0.5 / 0.5",
          },
        ],
      },
      {
        step: 6,
        title: "Benchmarking hybrid vs pure search",
        blocks: [
          {
            type: "text",
            content:
              "Measure recall@10 on a test set:",
          },
          {
            type: "code",
            language: "python",
            label: "Evaluate hybrid search",
            code: `def evaluate_recall(search_fn, test_queries, ground_truth, k=10):
    total_recall = 0

    for query, true_docs in zip(test_queries, ground_truth):
        results = search_fn(query, top_k=k)
        true_set = set(true_docs[:k])
        result_set = set(results[:k])
        recall = len(true_set & result_set) / len(true_set)
        total_recall += recall

    return total_recall / len(test_queries)

# Test
test_queries = ["GPT-4 tutorial", "Python programming basics"]
ground_truth = [["doc2", "doc3"], ["doc0", "doc1"]]

recall_vector = evaluate_recall(vector_search, test_queries, ground_truth)
recall_bm25 = evaluate_recall(bm25_search, test_queries, ground_truth)
recall_hybrid = evaluate_recall(hybrid_search, test_queries, ground_truth)

print(f"Vector: {recall_vector:.2%}, BM25: {recall_bm25:.2%}, Hybrid: {recall_hybrid:.2%}")
# Typical: Vector: 75%, BM25: 68%, Hybrid: 88%`,
          },
          {
            type: "text",
            content:
              "Hybrid search typically improves recall by 10-20% over pure vector or pure keyword search.",
          },
        ],
      },
      {
        step: 7,
        title: "What you'll build",
        blocks: [
          {
            type: "text",
            content:
              "In the hands-on project, you'll implement a hybrid search system from scratch, benchmark it against pure vector and pure BM25 on a real dataset, and tune the weights to maximize recall@10.",
          },
        ],
      },
      {
        step: 8,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why does hybrid search often outperform pure vector search?",
            options: [
              "It catches exact keyword matches that vector search might miss",
              "It's always faster",
              "It requires less memory",
              "It doesn't need an embedding model",
            ],
            correct: 0,
            explanation:
              "Vector search can miss exact keyword matches (like 'GPT-4' or 'order #12345') because embeddings capture semantic similarity, not exact strings. BM25 catches these, so hybrid search combines the strengths of both.",
          },
        ],
      },
    ],
  },
  {
    slug: "reranking",
    trackSlug: "embeddings-vector-db",
    order: 7,
    minutes: 14,
    title: "Reranking with Cross-Encoders",
    subtitle:
      "After retrieving candidates with fast vector search, rerank with a slow, accurate cross-encoder model.",
    tags: ["Reranking", "Cross-encoder", "Two-stage retrieval"],
    sections: [
      {
        step: 1,
        title: "The retrieval vs reranking trade-off",
        blocks: [
          {
            type: "text",
            content:
              "Vector search uses **bi-encoders** — they encode the query and document separately, then compute similarity:\n\n```\nquery_emb = encode(query)\ndoc_emb = encode(document)\nsimilarity = cosine(query_emb, doc_emb)\n```\n\nThis is fast (you pre-compute doc embeddings), but the model never sees the query and document together. It can miss subtle interactions.",
          },
          {
            type: "text",
            content:
              "**Cross-encoders** encode the query and document jointly:\n\n```\nscore = model(query + [SEP] + document)\n```\n\nThis is far more accurate (10-20% better ranking) but 100x slower — you must run the model for every query-document pair.",
          },
        ],
      },
      {
        step: 2,
        title: "Two-stage retrieval",
        blocks: [
          {
            type: "text",
            content:
              "The solution: **two-stage retrieval**:\n\n1. **Retrieve** — Use bi-encoder (vector search) to find the top 100 candidates (fast, 10ms)\n2. **Rerank** — Use cross-encoder to re-score those 100 candidates (slow but accurate, 100ms)\n\nYou get the speed of bi-encoders for the broad search, and the accuracy of cross-encoders for the final ranking.",
          },
          {
            type: "diagram",
            label: "Two-stage retrieval pipeline",
            chart: `graph LR
    Q[Query] --> R1[Retrieve top 100<br/>Bi-encoder/Vector Search<br/>10ms]
    R1 --> R2[Rerank top 100<br/>Cross-encoder<br/>100ms]
    R2 --> F[Final top 10]

    style Q fill:#ffe6e6
    style R1 fill:#e6f3ff
    style R2 fill:#fff4e6
    style F fill:#e6ffe6`,
          },
        ],
      },
      {
        step: 3,
        title: "Using a cross-encoder",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Rerank with cross-encoder",
            code: `# Install: pip install sentence-transformers
from sentence_transformers import CrossEncoder

# Load a cross-encoder model
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

# Assume you have top 100 candidates from vector search
candidates = [
    "Python is a programming language",
    "Machine learning with Python",
    "GPT-4 tutorial",
]

query = "Python programming"

# Score each query-document pair
scores = reranker.predict([
    (query, doc) for doc in candidates
])

# Rerank by score
ranked_indices = scores.argsort()[::-1]
reranked = [candidates[i] for i in ranked_indices]

print("Reranked results:")
for i, doc in enumerate(reranked):
    print(f"{i+1}. [{scores[ranked_indices[i]]:.3f}] {doc}")`,
          },
          {
            type: "text",
            content:
              "The cross-encoder outputs a raw score (not bounded 0-1). Higher scores = more relevant.",
          },
        ],
      },
      {
        step: 4,
        title: "Batching for speed",
        blocks: [
          {
            type: "text",
            content:
              "Cross-encoders are slow. Speed them up with batching:",
          },
          {
            type: "code",
            language: "python",
            label: "Batch reranking",
            code: `# Rerank 100 candidates at once (batched inference)
query = "Python programming"
candidates = ["doc1", "doc2", ...] * 100  # 100 docs

# Batch size 32 (adjust based on GPU memory)
scores = reranker.predict(
    [(query, doc) for doc in candidates],
    batch_size=32,
    show_progress_bar=False
)

# On CPU: ~200ms for 100 docs
# On GPU: ~20ms for 100 docs`,
          },
          {
            type: "text",
            content:
              "Batching gives 5-10x speedup. On a GPU, reranking 100 candidates takes ~20ms.",
          },
        ],
      },
      {
        step: 5,
        title: "When to use reranking",
        blocks: [
          {
            type: "text",
            content:
              "Reranking makes sense when:",
          },
          {
            type: "list",
            style: "bullet",
            items: [
              "**Accuracy matters more than latency** — legal search, medical search, research assistants",
              "**You retrieve a small number of candidates** — reranking 100 is fast, reranking 10k is not",
              "**The bi-encoder ranking is noisy** — you see relevant results at rank 20-50 instead of top 10",
              "**You have GPU resources** — CPU reranking adds 100-200ms latency, GPU adds 10-20ms",
            ],
          },
          {
            type: "callout",
            kind: "gotcha",
            content:
              "Don't rerank if your vector search already returns great results. The latency cost may not be worth a 2-3% accuracy boost.",
          },
        ],
      },
      {
        step: 6,
        title: "Benchmarking reranking",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Measure reranking impact",
            code: `from sentence_transformers import SentenceTransformer, CrossEncoder, util

# Models
bi_encoder = SentenceTransformer('all-MiniLM-L6-v2')
cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

# Corpus
docs = ["Python programming", "ML with Python", "GPT-4 guide", ...]
doc_embeddings = bi_encoder.encode(docs)

# Query
query = "Python tutorial"
query_emb = bi_encoder.encode(query)

# Stage 1: Retrieve top 100
scores = util.cos_sim(query_emb, doc_embeddings)[0]
top_100 = scores.argsort(descending=True)[:100]

# Stage 2: Rerank
candidates = [docs[i] for i in top_100]
rerank_scores = cross_encoder.predict([(query, doc) for doc in candidates])
reranked = rerank_scores.argsort()[::-1][:10]

print("Top 10 after reranking:")
for i in reranked:
    print(f"  {candidates[i]}")

# Measure: Did reranking change the top 10?
original_top_10 = top_100[:10].tolist()
reranked_top_10 = [top_100[i].item() for i in reranked]
changed = len(set(original_top_10) - set(reranked_top_10))
print(f"Reranking changed {changed}/10 results")`,
          },
        ],
      },
      {
        step: 7,
        title: "Popular reranking models",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "ms-marco-MiniLM-L-6-v2", value: "Fast, good quality, trained on MS MARCO (web search)" },
              { key: "ms-marco-MiniLM-L-12-v2", value: "Slower, higher quality (12 layers vs 6)" },
              { key: "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1", value: "Multilingual version" },
              { key: "Cohere Rerank", value: "API-based, very high quality (paid)" },
            ],
          },
          {
            type: "text",
            content:
              "**Recommendation:** Start with `ms-marco-MiniLM-L-6-v2` (open source, fast). Upgrade to Cohere Rerank if you need maximum accuracy and can afford the API cost.",
          },
        ],
      },
      {
        step: 8,
        title: "What you'll build",
        blocks: [
          {
            type: "text",
            content:
              "In the hands-on project, you'll implement two-stage retrieval: retrieve 100 candidates with vector search, then rerank with a cross-encoder. You'll measure the accuracy boost (NDCG@10) and latency cost, then decide if reranking is worth it for your use case.",
          },
        ],
      },
      {
        step: 9,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why are cross-encoders more accurate than bi-encoders?",
            options: [
              "They encode the query and document together, capturing interactions between them",
              "They use larger models",
              "They are trained on more data",
              "They are faster",
            ],
            correct: 0,
            explanation:
              "Cross-encoders see the query and document as one input, so they can capture interactions like 'the query term appears in the document title'. Bi-encoders encode them separately, so they can't see these interactions.",
          },
        ],
      },
    ],
  },
  {
    slug: "embeddings-in-production",
    trackSlug: "embeddings-vector-db",
    order: 8,
    minutes: 20,
    title: "Embeddings in Production",
    subtitle:
      "Caching, batching, incremental updates, monitoring — the operational playbook for embeddings at scale.",
    tags: ["Production", "Caching", "Monitoring", "Scale"],
    sections: [
      {
        step: 1,
        title: "The cost of embeddings",
        blocks: [
          {
            type: "text",
            content:
              "Generating embeddings is expensive:\n\n- **API cost** — OpenAI: $0.02-0.13 per 1M tokens, Cohere: $0.10 per 1M tokens\n- **Latency** — 100-500ms per batch\n- **GPU cost** — if self-hosting, $0.50-1.00 per GPU-hour\n\nStoring embeddings is cheap:\n\n- **Memory** — 384D float32 = 1.5KB per vector\n- **Disk** — 1M vectors = 1.5GB\n\nThe lesson: **compute embeddings once, cache them forever**.",
          },
        ],
      },
      {
        step: 2,
        title: "Caching embeddings",
        blocks: [
          {
            type: "text",
            content:
              "Cache embeddings keyed by the hash of the text:",
          },
          {
            type: "code",
            language: "python",
            label: "Embedding cache with Redis",
            code: `import hashlib
import json
import redis
import numpy as np
from sentence_transformers import SentenceTransformer

class EmbeddingCache:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.redis = redis.Redis(host='localhost', port=6379, db=0)

    def _hash(self, text: str) -> str:
        return hashlib.sha256(text.encode()).hexdigest()

    def get_embedding(self, text: str) -> np.ndarray:
        key = f"emb:{self._hash(text)}"

        # Check cache
        cached = self.redis.get(key)
        if cached:
            return np.array(json.loads(cached))

        # Generate embedding
        embedding = self.model.encode(text)

        # Store in cache (expires after 30 days)
        self.redis.setex(key, 30 * 24 * 60 * 60, json.dumps(embedding.tolist()))

        return embedding

# Usage
cache = EmbeddingCache()
emb1 = cache.get_embedding("Python programming")  # Cache miss, generates embedding
emb2 = cache.get_embedding("Python programming")  # Cache hit, instant
print(f"Same embedding: {np.allclose(emb1, emb2)}")`,
          },
          {
            type: "text",
            content:
              "Cache hit rate should be > 90% in production (most queries are repeats). This saves 90% of embedding API calls.",
          },
        ],
      },
      {
        step: 3,
        title: "Batching API calls",
        blocks: [
          {
            type: "text",
            content:
              "Don't call the embedding API once per document. Batch requests:",
          },
          {
            type: "code",
            language: "python",
            label: "Batch embedding generation",
            code: `from openai import OpenAI

client = OpenAI()

# Bad: one API call per document (slow, expensive)
docs = ["doc1", "doc2", ...] * 1000
embeddings = []
for doc in docs:
    response = client.embeddings.create(model="text-embedding-3-small", input=doc)
    embeddings.append(response.data[0].embedding)
# Total: 1000 API calls, 10-20 seconds

# Good: batch 100 docs per call
batch_size = 100
embeddings = []
for i in range(0, len(docs), batch_size):
    batch = docs[i:i + batch_size]
    response = client.embeddings.create(model="text-embedding-3-small", input=batch)
    embeddings.extend([item.embedding for item in response.data])
# Total: 10 API calls, 1-2 seconds`,
          },
          {
            type: "text",
            content:
              "OpenAI allows up to 2048 inputs per batch. Batch size 100-500 is a good balance (reduces API calls without hitting rate limits).",
          },
        ],
      },
      {
        step: 4,
        title: "Incremental updates",
        blocks: [
          {
            type: "text",
            content:
              "New documents arrive every day. Don't re-embed everything — track which documents are already embedded:",
          },
          {
            type: "code",
            language: "python",
            label: "Incremental embedding",
            code: `import json
from pathlib import Path

class IncrementalEmbedder:
    def __init__(self, state_file: str = "embedded_docs.json"):
        self.state_file = Path(state_file)
        self.embedded = self._load_state()

    def _load_state(self) -> set:
        if self.state_file.exists():
            return set(json.loads(self.state_file.read_text()))
        return set()

    def _save_state(self):
        self.state_file.write_text(json.dumps(list(self.embedded)))

    def embed_new_docs(self, docs: list[dict]) -> list[dict]:
        """Only embed docs that haven't been embedded yet."""
        new_docs = [doc for doc in docs if doc["id"] not in self.embedded]

        if not new_docs:
            print("No new documents to embed")
            return []

        print(f"Embedding {len(new_docs)} new documents...")
        embeddings = batch_embed([doc["text"] for doc in new_docs])

        for doc, emb in zip(new_docs, embeddings):
            doc["embedding"] = emb
            self.embedded.add(doc["id"])

        self._save_state()
        return new_docs

# Usage
embedder = IncrementalEmbedder()
new_docs = [{"id": "doc1", "text": "..."}, {"id": "doc2", "text": "..."}]
embedded = embedder.embed_new_docs(new_docs)`,
          },
        ],
      },
      {
        step: 5,
        title: "Monitoring embedding drift",
        blocks: [
          {
            type: "text",
            content:
              "Over time, your data distribution may shift (new topics, new vocabulary). This is called **embedding drift**. Monitor it:",
          },
          {
            type: "code",
            language: "python",
            label: "Detect embedding drift",
            code: `import numpy as np
from datetime import datetime

class EmbeddingMonitor:
    def __init__(self):
        self.baseline_centroid = None

    def set_baseline(self, embeddings: np.ndarray):
        """Set the baseline centroid (mean of all embeddings)."""
        self.baseline_centroid = np.mean(embeddings, axis=0)

    def check_drift(self, new_embeddings: np.ndarray, threshold: float = 0.1):
        """Check if new embeddings have drifted from baseline."""
        new_centroid = np.mean(new_embeddings, axis=0)

        from sentence_transformers import util
        similarity = util.cos_sim(self.baseline_centroid, new_centroid).item()

        if similarity < 1 - threshold:
            print(f"⚠️  Drift detected! Similarity: {similarity:.3f}")
            return True

        print(f"✓ No drift. Similarity: {similarity:.3f}")
        return False

# Usage
monitor = EmbeddingMonitor()
monitor.set_baseline(old_embeddings)  # Baseline from Jan 2024
monitor.check_drift(new_embeddings)   # New docs from Aug 2024`,
          },
          {
            type: "text",
            content:
              "If drift is detected, consider:\n\n- Re-embedding all documents with a newer model\n- Fine-tuning the embedding model on your recent data\n- Checking if retrieval quality has degraded",
          },
        ],
      },
      {
        step: 6,
        title: "Measuring retrieval quality",
        blocks: [
          {
            type: "text",
            content:
              "Track retrieval quality in production with an offline eval set:",
          },
          {
            type: "code",
            language: "python",
            label: "Monitor recall@10 over time",
            code: `def evaluate_recall(search_fn, test_set: list[dict], k: int = 10) -> float:
    """
    test_set: [{"query": "...", "relevant_docs": ["doc1", "doc2"]}]
    """
    total_recall = 0

    for item in test_set:
        results = search_fn(item["query"], top_k=k)
        relevant = set(item["relevant_docs"])
        retrieved = set(results[:k])
        recall = len(relevant & retrieved) / len(relevant) if relevant else 0
        total_recall += recall

    return total_recall / len(test_set)

# Run daily
recall = evaluate_recall(search_function, test_set)
print(f"Recall@10: {recall:.2%}")

# Log to monitoring system (Datadog, Prometheus, etc.)
import statsd
statsd_client = statsd.StatsClient('localhost', 8125)
statsd_client.gauge('search.recall_at_10', recall)`,
          },
          {
            type: "text",
            content:
              "If recall drops below a threshold (e.g., 85%), investigate:\n\n- Has the data distribution changed?\n- Are new queries failing?\n- Did a code change break something?",
          },
        ],
      },
      {
        step: 7,
        title: "Scaling to 100M+ vectors",
        blocks: [
          {
            type: "text",
            content:
              "At 100M+ vectors, single-machine search becomes too slow. Use:",
          },
          {
            type: "list",
            style: "bullet",
            items: [
              "**Sharding** — Split vectors across multiple machines (Milvus, Weaviate support this)",
              "**Quantization** — Compress vectors (IVFPQ) to fit more in memory",
              "**GPU acceleration** — Use FAISS-GPU for 10x faster search",
              "**Pre-filtering** — Use metadata to narrow the search space before vector search",
            ],
          },
          {
            type: "callout",
            kind: "tip",
            content:
              "Most teams don't need 100M+ scale. If you have < 10M vectors, a single Qdrant instance on a beefy machine (32GB RAM, 8 cores) handles 1000s of QPS.",
          },
        ],
      },
      {
        step: 8,
        title: "Cost optimization checklist",
        blocks: [
          {
            type: "list",
            style: "bullet",
            items: [
              "✓ Cache embeddings (90%+ hit rate)",
              "✓ Batch API calls (100-500 inputs per request)",
              "✓ Use smaller models for prototypes (384D) before scaling to larger (1536D)",
              "✓ Incremental updates (only embed new documents)",
              "✓ Monitor embedding API spend (set budget alerts)",
              "✓ Consider self-hosting if > 100M tokens/month (cheaper than APIs)",
            ],
          },
        ],
      },
      {
        step: 9,
        title: "What you'll build",
        blocks: [
          {
            type: "text",
            content:
              "In the hands-on project, you'll build a production embedding pipeline: caching layer with Redis, batch embedding job, incremental update system, and monitoring dashboard that tracks recall@10 and embedding drift over time.",
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why should you cache embeddings instead of generating them on every search?",
            options: [
              "Generating embeddings is expensive (API cost, latency), while storing them is cheap",
              "Cached embeddings are more accurate",
              "Caching makes embeddings smaller",
              "You can't query without caching",
            ],
            correct: 0,
            explanation:
              "Embedding generation costs $0.02-0.13 per 1M tokens and adds 100-500ms latency. Storing embeddings costs almost nothing (1.5KB per vector). With caching, you compute once and reuse forever.",
          },
        ],
      },
    ],
  },
  {
    slug: "semantic-search-project",
    trackSlug: "embeddings-vector-db",
    order: 9,
    minutes: 30,
    title: "Project: Semantic Search Engine",
    subtitle:
      "Build a production-ready search system: ingest docs, chunk, embed, store in a vector DB, and serve a search API.",
    tags: ["Project", "Full stack", "End-to-end"],
    sections: [
      {
        step: 1,
        title: "Project overview",
        blocks: [
          {
            type: "text",
            content:
              "You'll build a complete semantic search engine from scratch:\n\n1. **Ingest** — Load documents from a corpus (PDFs, text files, or web scraping)\n2. **Chunk** — Split documents intelligently\n3. **Embed** — Generate embeddings with sentence-transformers or OpenAI\n4. **Store** — Insert embeddings + metadata into Qdrant or Chroma\n5. **Search API** — FastAPI endpoint that accepts queries and returns ranked results\n6. **Deploy** — Dockerize and deploy\n\nBonus: Add a simple web frontend for search.",
          },
        ],
      },
      {
        step: 2,
        title: "What you'll learn",
        blocks: [
          {
            type: "list",
            style: "bullet",
            items: [
              "End-to-end pipeline design",
              "Production embedding patterns (caching, batching)",
              "Vector database operations (indexing, querying, filtering)",
              "API design for search systems",
              "Deployment with Docker",
            ],
          },
        ],
      },
      {
        step: 3,
        title: "Coming soon",
        blocks: [
          {
            type: "callout",
            kind: "tip",
            content:
              "Full project specification, starter code, and step-by-step instructions coming soon. This will be a portfolio-ready capstone project.",
          },
        ],
      },
    ],
  },
];
