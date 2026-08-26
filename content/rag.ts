import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — RAG Fundamentals (fully written as the reference)
// ---------------------------------------------------------------------------
const ragFundamentalsLesson: Lesson = {
  slug: "rag-fundamentals",
  trackSlug: "rag",
  order: 1,
  minutes: 20,
  title: "RAG Fundamentals",
  subtitle:
    "Retrieval-Augmented Generation — give any LLM access to your own documents, databases, or knowledge base.",
  tags: ["RAG", "Retrieval", "LLM", "First principles"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "LLMs are trained on a fixed dataset with a cutoff date. They can't answer questions about:\n\n- Your company's internal documents\n- Data published after their training cutoff\n- Private information they were never trained on\n- Real-time information that changes frequently\n\nYou could fine-tune the LLM on your data, but that's expensive, slow, and doesn't handle updates well. **RAG** solves this by retrieving relevant information at inference time and passing it to the LLM as context.",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "RAG = Retrieval-Augmented Generation. Instead of asking the LLM to know everything, you give it the ability to look up what it needs.",
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
            "RAG is the most practical way to build AI applications that work with your data:\n\n- **Chat with documents** — PDFs, Word docs, internal wikis\n- **Customer support bots** — answer from your help center articles\n- **Code assistants** — retrieve from your codebase before answering\n- **Legal/medical AI** — ground answers in verified sources\n- **Research assistants** — synthesize information across hundreds of papers\n\nRAG is cheaper than fine-tuning, updates instantly when your data changes, and provides citations so you can verify the LLM's answers.",
        },
      ],
    },
    {
      step: 3,
      title: "How RAG works: The pipeline",
      blocks: [
        {
          type: "text",
          content:
            "RAG has two phases: **indexing** (offline) and **retrieval + generation** (online).",
        },
        {
          type: "diagram",
          label: "RAG pipeline",
          chart: `flowchart TB
    subgraph Indexing["📚 Indexing (Offline)"]
        DOC[Documents] --> CHUNK[Chunk]
        CHUNK --> EMBED[Embed]
        EMBED --> STORE[Store in Vector DB]
    end

    subgraph Query["🔍 Retrieval + Generation (Online)"]
        Q[User Query] --> QEMBED[Embed Query]
        QEMBED --> SEARCH[Search Vector DB]
        STORE -.-> SEARCH
        SEARCH --> RETRIEVE[Top-K Docs]
        RETRIEVE --> PROMPT[Build Prompt]
        PROMPT --> LLM[LLM]
        LLM --> ANSWER[Answer]
    end

    style DOC fill:#e1f5ff
    style Q fill:#fff4e1
    style LLM fill:#f0f0f0
    style ANSWER fill:#e8f5e9`,
        },
        {
          type: "text",
          content:
            "**Indexing (do this once):**\n\n1. **Load** your documents (PDFs, HTML, databases, etc.)\n2. **Chunk** them into retrievable pieces (paragraphs, 500-token chunks, etc.)\n3. **Embed** each chunk with an embedding model\n4. **Store** embeddings in a vector database\n\n**Retrieval + Generation (every query):**\n\n1. **Embed** the user's query\n2. **Search** the vector DB for the most similar chunks\n3. **Retrieve** the top K chunks (typically 3-10)\n4. **Build a prompt** with the query + retrieved context\n5. **Send to LLM** to generate an answer",
        },
      ],
    },
    {
      step: 4,
      title: "Step 1: Document loading and chunking",
      blocks: [
        {
          type: "text",
          content:
            "First, load your documents and split them into chunks. Why chunk? Embedding models have token limits (512-8192), and retrieving smaller chunks gives more precise results.",
        },
        {
          type: "code",
          language: "python",
          label: "Load and chunk documents",
          code: `# Install once: pip install langchain pypdf chromadb sentence-transformers
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load a PDF
loader = PyPDFLoader("company_handbook.pdf")
documents = loader.load()

print(f"Loaded {len(documents)} pages")

# Split into chunks (500 chars with 50 overlap)
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    length_function=len,
)

chunks = text_splitter.split_documents(documents)
print(f"Split into {len(chunks)} chunks")

# Each chunk is a Document object with page_content and metadata
print(f"Example chunk: {chunks[0].page_content[:200]}...")
print(f"Metadata: {chunks[0].metadata}")`,
        },
        {
          type: "text",
          content:
            "**Chunk size matters:**\n\n- **Too small** (50-100 tokens) — lacks context, retrieves many irrelevant pieces\n- **Too large** (2000+ tokens) — dilutes relevance, wastes LLM context\n- **Sweet spot** (300-800 tokens) — enough context, precise retrieval\n\nChunk overlap (50-100 tokens) ensures sentences aren't cut mid-thought.",
        },
      ],
    },
    {
      step: 5,
      title: "Step 2: Embed and store in a vector database",
      blocks: [
        {
          type: "text",
          content:
            "Embed each chunk and store it in a vector database. Here's a complete example with Chroma (local, embedded DB):",
        },
        {
          type: "code",
          language: "python",
          label: "Embed and store chunks",
          code: `from langchain.embeddings import SentenceTransformerEmbeddings
from langchain.vectorstores import Chroma

# Initialize embedding model (runs locally, free)
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Create vector store and embed all chunks
# This happens once - Chroma persists to disk
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

print(f"Stored {vectorstore._collection.count()} chunks in Chroma")

# Now you can search
query = "What is the vacation policy?"
results = vectorstore.similarity_search(query, k=3)

for i, doc in enumerate(results):
    print(f"\\n--- Result {i+1} ---")
    print(doc.page_content[:200])`,
        },
        {
          type: "text",
          content:
            "This creates a local vector database in `./chroma_db`. The next time you run the code, Chroma loads from disk — no need to re-embed.",
        },
      ],
    },
    {
      step: 6,
      title: "Step 3: Retrieval — find relevant chunks",
      blocks: [
        {
          type: "text",
          content:
            "When a user asks a question, retrieve the most relevant chunks from the vector database:",
        },
        {
          type: "code",
          language: "python",
          label: "Retrieve relevant context",
          code: `# Load existing vector store
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

# Create a retriever (wrapper around similarity search)
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}  # Return top 5 chunks
)

# Retrieve for a query
query = "How many vacation days do I get?"
docs = retriever.get_relevant_documents(query)

print(f"Retrieved {len(docs)} chunks:")
for i, doc in enumerate(docs):
    print(f"\\n[{i+1}] (score: {doc.metadata.get('score', 'N/A')})")
    print(doc.page_content[:150])`,
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "K (number of results) is a hyperparameter. Start with k=3-5. Too few and you miss relevant info. Too many and you waste LLM context on noise.",
        },
      ],
    },
    {
      step: 7,
      title: "Step 4: Generation — send context to LLM",
      blocks: [
        {
          type: "text",
          content:
            "Now combine the retrieved chunks with the user's query and send to an LLM:",
        },
        {
          type: "code",
          language: "python",
          label: "Complete RAG pipeline",
          code: `from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI

# Initialize LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Create RAG chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",  # "stuff" = put all context in one prompt
    retriever=retriever,
    return_source_documents=True,  # Return which chunks were used
)

# Ask a question
query = "What is the vacation policy for new employees?"
result = qa_chain({"query": query})

print("Answer:", result["result"])
print("\\nSources:")
for i, doc in enumerate(result["source_documents"]):
    print(f"  [{i+1}] Page {doc.metadata.get('page', '?')}")`,
        },
        {
          type: "text",
          content:
            "Under the hood, LangChain builds a prompt like this:\n\n```\nUse the following pieces of context to answer the question.\n\nContext:\n[chunk 1 content]\n[chunk 2 content]\n[chunk 3 content]\n\nQuestion: What is the vacation policy for new employees?\nAnswer:\n```",
        },
      ],
    },
    {
      step: 8,
      title: "RAG without LangChain (from scratch)",
      blocks: [
        {
          type: "text",
          content:
            "Here's the same pipeline without LangChain, so you understand exactly what's happening:",
        },
        {
          type: "code",
          language: "python",
          label: "RAG from scratch",
          code: `from sentence_transformers import SentenceTransformer
from openai import OpenAI
import chromadb

# 1. Initialize components
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
openai_client = OpenAI()
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_collection("my_documents")

# 2. User query
query = "What is the vacation policy?"

# 3. Embed query
query_embedding = embedding_model.encode(query).tolist()

# 4. Search vector DB
results = collection.query(
    query_embeddings=[query_embedding],
    n_results=3
)

# 5. Build prompt with retrieved context
context = "\\n\\n".join(results["documents"][0])
prompt = f"""Use the following context to answer the question.

Context:
{context}

Question: {query}

Answer:"""

# 6. Send to LLM
response = openai_client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": prompt}],
    temperature=0
)

print(response.choices[0].message.content)`,
        },
        {
          type: "text",
          content:
            "This is RAG in ~30 lines. LangChain just wraps these steps for convenience.",
        },
      ],
    },
    {
      step: 9,
      title: "When RAG fails: common pitfalls",
      blocks: [
        {
          type: "list",
          style: "bullet",
          items: [
            "**Wrong chunks retrieved** — embedding model doesn't understand your domain. Try a domain-specific model or fine-tune embeddings.",
            "**Relevant chunks ranked low** — similarity search alone is noisy. Add a reranker (cross-encoder) to improve precision.",
            "**Context too long** — retrieved 10 chunks = 5000 tokens. LLM runs out of context. Reduce k or use context compression.",
            "**LLM ignores context** — context is buried in the middle of a long prompt. Put it at the beginning or end (recency bias).",
            "**Hallucination** — LLM makes up facts not in the context. Add 'only answer from the context' in the prompt, or use a judge model to verify groundedness.",
            "**No relevant docs exist** — user asked about something not in your corpus. Detect this (e.g., low similarity scores) and return 'I don't know' instead of hallucinating.",
          ],
        },
      ],
    },
    {
      step: 10,
      title: "Improving RAG: the path forward",
      blocks: [
        {
          type: "text",
          content:
            "Naive RAG (this lesson) gets you 70-80% of the way. To reach production quality:",
        },
        {
          type: "list",
          style: "number",
          items: [
            "**Better chunking** — semantic chunking, parent-child retrieval (retrieve small, return large)",
            "**Hybrid search** — combine keyword search (BM25) with vector search",
            "**Query rewriting** — rephrase the user's question into a better retrieval query",
            "**Multi-query retrieval** — generate 3-5 query variations, retrieve for all, merge results",
            "**Reranking** — use a cross-encoder to re-score the top K results",
            "**Context compression** — extract only the relevant sentences from each chunk",
            "**Agentic RAG** — let the LLM decide when to retrieve, what to retrieve, and when to stop",
          ],
        },
        {
          type: "text",
          content:
            "The rest of this track covers each of these advanced patterns in depth.",
        },
      ],
    },
    {
      step: 11,
      title: "RAG vs fine-tuning: when to use each",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "Use RAG when", value: "Your data changes frequently, you need citations, or you have thousands of documents to reference." },
            { key: "Use fine-tuning when", value: "You need the model to learn a new style, tone, or format — not just memorize facts." },
            { key: "Use both when", value: "Fine-tune for domain language/style, RAG for up-to-date factual retrieval. Example: a legal assistant fine-tuned on legal writing, with RAG over case law." },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "Default to RAG. Only fine-tune if RAG + good prompting doesn't solve your problem.",
        },
      ],
    },
    {
      step: 12,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question: "What is the main advantage of RAG over fine-tuning an LLM on your documents?",
          options: [
            "RAG updates instantly when documents change and provides source citations",
            "RAG is always more accurate than fine-tuning",
            "RAG doesn't require any embedding models",
            "RAG is cheaper to run at inference time",
          ],
          correct: 0,
          explanation:
            "RAG retrieves fresh information at query time, so it stays up-to-date without retraining. It also returns source documents, letting you verify the LLM's answer. Fine-tuning bakes knowledge into weights — harder to update and impossible to cite.",
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
    trackSlug: "rag",
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

// Lesson 2 - 4 (will be added next)
const advancedChunkingLesson: Lesson = {
  slug: "advanced-chunking",
  trackSlug: "rag",
  order: 2,
  minutes: 16,
  title: "Advanced Chunking Strategies",
  subtitle:
    "Move beyond fixed-size chunks — semantic chunking, parent-child, and sliding windows that preserve context.",
  tags: ["Chunking", "Semantic split", "Parent-child"],
  sections: [
    {
      step: 1,
      title: "Why fixed-size chunking fails",
      blocks: [
        {
          type: "text",
          content:
            "Fixed-size chunking (split every 500 tokens) is simple but breaks context:\n\n- **Mid-sentence splits** — 'The CEO announced...' lands in chunk 1, '...a new product launch' lands in chunk 2\n- **Topic mixing** — a 500-token chunk might contain 3 unrelated paragraphs\n- **Missing co-references** — 'He' or 'This approach' loses its referent when the chunk boundary cuts the preceding sentence\n\nFor RAG to work well, chunks must be **semantic units** — complete thoughts that make sense on their own.",
        },
      ],
    },
    {
      step: 2,
      title: "Semantic chunking",
      blocks: [
        {
          type: "text",
          content:
            "Semantic chunking splits text when the topic shifts. How? Embed each sentence, measure similarity between adjacent sentences, and split when similarity drops below a threshold.",
        },
        {
          type: "code",
          language: "python",
          label: "Semantic chunking implementation",
          code: `from sentence_transformers import SentenceTransformer, util
import nltk

def semantic_chunking(text: str, threshold: float = 0.5) -> list[str]:
    # Split into sentences
    sentences = nltk.sent_tokenize(text)
    if len(sentences) < 2:
        return [text]

    # Embed all sentences
    model = SentenceTransformer('all-MiniLM-L6-v2')
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

# Example
text = """Python is great. It's easy to learn.
Now let's talk about cars. Cars are fast. They need fuel."""

chunks = semantic_chunking(text, threshold=0.3)
for i, chunk in enumerate(chunks):
    print(f"Chunk {i+1}: {chunk}")
# Output:
# Chunk 1: Python is great. It's easy to learn.
# Chunk 2: Now let's talk about cars. Cars are fast. They need fuel.`,
        },
        {
          type: "text",
          content:
            "Threshold tuning:\n\n- **0.3-0.5** — aggressive splitting (smaller chunks, many topic shifts)\n- **0.6-0.7** — moderate (good default)\n- **0.8+** — conservative (only split on major topic changes)",
        },
      ],
    },
    {
      step: 3,
      title: "Parent-child retrieval",
      blocks: [
        {
          type: "text",
          content:
            "**Problem:** Small chunks (1-2 sentences) rank precisely but lack context when passed to the LLM.\n\n**Solution:** Store **child chunks** (small, for ranking) in the vector DB, but return the **parent chunk** (large, for context) to the LLM.",
        },
        {
          type: "diagram",
          label: "Parent-child structure",
          chart: `graph TB
    P1[Parent: Full paragraph<br/>500 tokens] --> C1[Child 1: Sentence 1<br/>50 tokens]
    P1 --> C2[Child 2: Sentence 2<br/>50 tokens]
    P1 --> C3[Child 3: Sentence 3<br/>50 tokens]

    P2[Parent: Next paragraph<br/>600 tokens] --> C4[Child 4: Sentence 1<br/>60 tokens]
    P2 --> C5[Child 5: Sentence 2<br/>60 tokens]

    Q[Query] --> S[Search]
    S --> C2
    C2 -.retrieve child 2.-> C2
    C2 -.return parent.-> P1

    style Q fill:#fff4e1
    style C2 fill:#e6ffe6
    style P1 fill:#e6f3ff`,
        },
        {
          type: "code",
          language: "python",
          label: "Implement parent-child retrieval",
          code: `from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import SentenceTransformerEmbeddings

# Load document
text = open("document.txt").read()

# Create parent chunks (500 chars)
parent_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
parents = parent_splitter.split_text(text)

# For each parent, create child chunks (100 chars)
child_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=0)
all_children = []

for parent_id, parent_text in enumerate(parents):
    children = child_splitter.split_text(parent_text)

    for child_text in children:
        all_children.append({
            "text": child_text,
            "parent_id": parent_id,
            "parent_text": parent_text,
        })

# Store children in vector DB (with parent metadata)
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
from langchain.schema import Document

docs = [
    Document(page_content=c["text"], metadata={"parent": c["parent_text"]})
    for c in all_children
]

vectorstore = Chroma.from_documents(docs, embeddings)

# Retrieve: search children, return parents
def parent_child_retrieval(query: str, k: int = 3) -> list[str]:
    # Search for children
    results = vectorstore.similarity_search(query, k=k)

    # Return unique parents
    parents = list({doc.metadata["parent"] for doc in results})
    return parents

# Usage
query = "What is Python?"
parents = parent_child_retrieval(query, k=3)
print(f"Retrieved {len(parents)} parent chunks")`,
        },
      ],
    },
    {
      step: 4,
      title: "Sliding window chunks",
      blocks: [
        {
          type: "text",
          content:
            "Fixed-size + overlap is a sliding window, but you can make it smarter:\n\n- **Sentence-aligned** — never split mid-sentence\n- **Large overlap** — 50% overlap ensures every sentence appears in 2 chunks\n- **Adaptive window** — smaller chunks for dense information (tables, lists), larger for narrative",
        },
        {
          type: "code",
          language: "python",
          label: "Sentence-aligned sliding window",
          code: `import nltk

def sliding_window_sentences(text: str, window_size: int = 5, step: int = 3) -> list[str]:
    """
    window_size: number of sentences per chunk
    step: how many sentences to advance (step < window_size = overlap)
    """
    sentences = nltk.sent_tokenize(text)
    chunks = []

    for i in range(0, len(sentences), step):
        chunk_sentences = sentences[i:i + window_size]
        if chunk_sentences:
            chunks.append(" ".join(chunk_sentences))

    return chunks

# Example: 5 sentences per chunk, advance by 3 (40% overlap)
chunks = sliding_window_sentences(text, window_size=5, step=3)
print(f"Created {len(chunks)} chunks with 40% overlap")`,
        },
      ],
    },
    {
      step: 5,
      title: "Choosing a chunking strategy",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "General docs", value: "Semantic chunking (topic-aware)" },
            { key: "Technical manuals", value: "Parent-child (small for precision, large for context)" },
            { key: "Narrative text", value: "Sliding window with sentence alignment" },
            { key: "Code", value: "Function/class-level chunking" },
            { key: "Tables/structured", value: "Row-level or keep entire table together" },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "Start with sentence-aligned sliding windows (simple, effective). Upgrade to parent-child or semantic if retrieval quality is poor.",
        },
      ],
    },
    {
      step: 6,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question: "What is the main advantage of parent-child retrieval?",
          options: [
            "Small children rank precisely, large parents provide context to the LLM",
            "It's faster than regular chunking",
            "It uses less memory",
            "It doesn't require embeddings",
          ],
          correct: 0,
          explanation:
            "Parent-child retrieval stores small child chunks (e.g., single sentences) for precise matching, but returns the full parent chunk (e.g., entire paragraph) so the LLM has enough context to understand and answer correctly.",
        },
      ],
    },
  ],
};

export const ragLessons: Lesson[] = [
  ragFundamentalsLesson,
  advancedChunkingLesson,
  {
    slug: "query-transformation",
    trackSlug: "rag",
    order: 3,
    minutes: 14,
    title: "Query Rewriting and Expansion",
    subtitle:
      "The user's raw question is rarely the best retrieval query — rewrite, expand, and decompose it first.",
    tags: ["Query rewriting", "Multi-query", "HyDE"],
    sections: [
      {
        step: 1,
        title: "The query-document mismatch",
        blocks: [
          {
            type: "text",
            content:
              "Users ask: **'How do I reset my password?'**\n\nBut your docs say: **'Account Recovery Process'**\n\nVector search embeds both and they're somewhat similar, but not close enough to rank first. The problem: **vocabulary mismatch** — users and documentation use different words for the same concept.",
          },
          {
            type: "text",
            content:
              "Solution: Transform the query before retrieval:\n\n- **Query rewriting** — rephrase it into better keywords\n- **Multi-query** — generate multiple variations\n- **Query decomposition** — break complex questions into sub-queries\n- **HyDE** — generate a hypothetical answer, embed it, search for similar docs",
          },
        ],
      },
      {
        step: 2,
        title: "Query rewriting with an LLM",
        blocks: [
          {
            type: "text",
            content:
              "Use an LLM to rewrite the user's question into a better retrieval query:",
          },
          {
            type: "code",
            language: "python",
            label: "Query rewriting",
            code: `from openai import OpenAI

client = OpenAI()

def rewrite_query(user_query: str) -> str:
    prompt = f"""You are a search query optimizer. Rewrite the following user question into a concise search query with better keywords for semantic search.

User question: {user_query}

Optimized search query:"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return response.choices[0].message.content.strip()

# Example
original = "How do I reset my password?"
rewritten = rewrite_query(original)
print(f"Original: {original}")
print(f"Rewritten: {rewritten}")
# Output: "Rewritten: password reset account recovery"`,
          },
        ],
      },
      {
        step: 3,
        title: "Multi-query: generate variations",
        blocks: [
          {
            type: "text",
            content:
              "Generate 3-5 query variations, retrieve for each, and merge results:",
          },
          {
            type: "code",
            language: "python",
            label: "Multi-query retrieval",
            code: `def generate_query_variations(query: str, n: int = 3) -> list[str]:
    prompt = f"""Generate {n} different variations of the following search query. Each variation should use different keywords but mean the same thing.

Original query: {query}

Variations (one per line):"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    variations = response.choices[0].message.content.strip().split("\\n")
    return [v.strip("- ") for v in variations if v.strip()]

# Example
query = "How to install Python?"
variations = generate_query_variations(query, n=3)
print(variations)
# Output: ['Python installation guide', 'Setting up Python', 'Install Python on computer']

# Retrieve for all variations and merge
from langchain.vectorstores import Chroma

def multi_query_retrieval(query: str, vectorstore: Chroma, k: int = 3):
    variations = generate_query_variations(query, n=3)
    all_docs = []

    for var in variations:
        docs = vectorstore.similarity_search(var, k=k)
        all_docs.extend(docs)

    # Deduplicate by content
    unique_docs = []
    seen = set()
    for doc in all_docs:
        if doc.page_content not in seen:
            unique_docs.append(doc)
            seen.add(doc.page_content)

    return unique_docs[:k]  # Return top k unique docs`,
          },
        ],
      },
      {
        step: 4,
        title: "HyDE: Hypothetical Document Embeddings",
        blocks: [
          {
            type: "text",
            content:
              "HyDE (Hypothetical Document Embeddings) is a clever trick:\n\n1. Ask the LLM to **write a fake answer** to the question\n2. Embed the fake answer\n3. Search for documents similar to that answer\n\nWhy? The fake answer uses document-style vocabulary, not question-style. This bridges the vocabulary gap.",
          },
          {
            type: "code",
            language: "python",
            label: "HyDE implementation",
            code: `def hyde_retrieval(query: str, vectorstore: Chroma, k: int = 3):
    # Step 1: Generate a hypothetical answer
    prompt = f"""Write a detailed answer to the following question, as if you were explaining it in a document. Be specific and use technical terms.

Question: {query}

Answer:"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    hypothetical_answer = response.choices[0].message.content

    # Step 2: Embed the hypothetical answer and search
    docs = vectorstore.similarity_search(hypothetical_answer, k=k)

    return docs

# Example
query = "What is a neural network?"
docs = hyde_retrieval(query, vectorstore, k=3)
print(f"HyDE retrieved {len(docs)} docs")`,
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "HyDE works best when the query and documents have different styles (Q&A vs technical docs). It doesn't help much if your corpus is already Q&A-style.",
          },
        ],
      },
      {
        step: 5,
        title: "Query decomposition for complex questions",
        blocks: [
          {
            type: "text",
            content:
              "Complex questions need multiple retrievals:\n\n**'Who wrote X and what else did they write?'**\n\nDecompose into:\n1. 'Who wrote X?'\n2. 'What else did [author] write?'",
          },
          {
            type: "code",
            language: "python",
            label: "Query decomposition",
            code: `def decompose_query(query: str) -> list[str]:
    prompt = f"""Break down the following complex question into 2-3 simpler sub-questions that can be answered independently.

Question: {query}

Sub-questions:"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    sub_queries = response.choices[0].message.content.strip().split("\\n")
    return [q.strip("- ") for q in sub_queries if q.strip()]

# Example
query = "Who discovered relativity and what were their other contributions?"
sub_queries = decompose_query(query)
print(sub_queries)
# Output: ['Who discovered relativity?', 'What were Einstein's other contributions?']

# Retrieve for each sub-query
for sq in sub_queries:
    docs = vectorstore.similarity_search(sq, k=2)
    print(f"Retrieved {len(docs)} docs for: {sq}")`,
          },
        ],
      },
      {
        step: 6,
        title: "When to use each technique",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "Query rewriting", value: "Always — cheap and effective" },
              { key: "Multi-query", value: "When vocabulary mismatch is common (diverse corpus, many synonyms)" },
              { key: "HyDE", value: "When queries are questions but docs are explanations" },
              { key: "Decomposition", value: "Multi-hop or complex questions" },
            ],
          },
        ],
      },
      {
        step: 7,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why does HyDE work?",
          options: [
            "It generates a hypothetical answer that uses document-style vocabulary, bridging the query-document gap",
            "It makes queries longer",
            "It's faster than regular retrieval",
            "It doesn't need a vector database",
          ],
          correct: 0,
          explanation:
            "HyDE asks an LLM to write a fake answer using document-style language. Embedding this answer and searching for similar docs often works better than embedding the raw question, because the fake answer vocabulary matches real document vocabulary.",
        },
      ],
    },
  ],
},
  // Lessons 4-14 expanded inline
  {
    slug: "hybrid-retrieval",
    trackSlug: "rag",
    order: 4,
    minutes: 18,
    title: "Hybrid Retrieval: BM25 + Vector Search",
    subtitle: "Combine keyword search and semantic search — when one misses, the other catches.",
    tags: ["Hybrid search", "BM25", "Fusion", "Ensemble"],
    sections: [
      { step: 1, title: "Why hybrid retrieval?", blocks: [{ type: "text", content: "Vector search: great for semantic similarity, misses exact matches (product IDs, names, acronyms).\\n\\nKeyword search (BM25): great for exact matches, misses semantic similarity.\\n\\n**Hybrid retrieval** runs both and merges results — when one fails, the other catches it. Typical improvement: 15-25% better recall." }] },
      { step: 2, title: "BM25 and RRF", blocks: [{ type: "code", language: "python", label: "Hybrid retrieval with RRF", code: `from rank_bm25 import BM25Okapi\\nimport numpy as np\\n\\ndef reciprocal_rank_fusion(vector_results, bm25_results, k=60):\\n    scores = {}\\n    for rank, doc_id in enumerate(vector_results, start=1):\\n        scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)\\n    for rank, doc_id in enumerate(bm25_results, start=1):\\n        scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)\\n    return sorted(scores.keys(), key=lambda x: scores[x], reverse=True)\\n\\n# Example\\nvector_top = ["doc1", "doc2", "doc3"]\\nbm25_top = ["doc3", "doc4", "doc1"]\\nmerged = reciprocal_rank_fusion(vector_top, bm25_top)\\nprint(merged)` }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "Why does hybrid search often outperform pure vector search?", options: ["It catches exact keyword matches that vector search might miss", "It's always faster", "It uses less memory", "It doesn't need embeddings"], correct: 0, explanation: "Vector search can miss exact keyword matches (product codes, names, acronyms). BM25 catches these, so hybrid search gets the best of both." }] },
    ],
  },
  {
    slug: "reranking",
    trackSlug: "rag",
    order: 5,
    minutes: 16,
    title: "Reranking with Cross-Encoders",
    subtitle: "After fast retrieval, rerank the top candidates with a slow, accurate model — the two-stage trick.",
    tags: ["Reranking", "Cross-encoder", "Two-stage"],
    sections: [
      { step: 1, title: "Two-stage retrieval", blocks: [{ type: "text", content: "**Stage 1 (fast):** Retrieve 100 candidates with bi-encoder/vector search (10ms)\\n\\n**Stage 2 (slow):** Rerank top 100 with cross-encoder (100ms)\\n\\nCross-encoders are 10-20% more accurate but 100x slower. Two-stage gives you both speed and accuracy." }] },
      { step: 2, title: "Cross-encoder reranking", blocks: [{ type: "code", language: "python", label: "Rerank with cross-encoder", code: `from sentence_transformers import CrossEncoder\\n\\nreranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')\\ncandidates = ["Python programming", "ML with Python", "GPT-4 guide"]\\nquery = "Python tutorial"\\n\\nscores = reranker.predict([(query, doc) for doc in candidates])\\nranked_idx = scores.argsort()[::-1]\\nreranked = [candidates[i] for i in ranked_idx]\\n\\nfor i, doc in enumerate(reranked[:3]):\\n    print(f"{i+1}. [{scores[ranked_idx[i]]:.3f}] {doc}")` }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "Why are cross-encoders more accurate than bi-encoders?", options: ["They encode query and document together, capturing interactions", "They use larger models", "They're trained on more data", "They're faster"], correct: 0, explanation: "Cross-encoders see the query and document as one input, capturing interactions. Bi-encoders encode separately and miss these interactions." }] },
    ],
  },
  {
    slug: "metadata-filtering",
    trackSlug: "rag",
    order: 6,
    minutes: 12,
    title: "Metadata Filtering and Structured Queries",
    subtitle: "Filter by date, source, author, or tags before or after vector search — combine semantic + structured.",
    tags: ["Metadata", "Filtering", "Structured search"],
    sections: [
      { step: 1, title: "Why metadata matters", blocks: [{ type: "text", content: "Users want: **'Documents about AI from 2024 by Alice'**\\n\\nPure vector search can't filter by date, author, or source. You need **metadata filtering**." }] },
      { step: 2, title: "Filtering in Qdrant", blocks: [{ type: "code", language: "python", label: "Filter by metadata", code: `from qdrant_client.models import Filter, FieldCondition, Range, MatchValue\\n\\nresults = client.search(\\n    collection_name="docs",\\n    query_vector=query_embedding,\\n    query_filter=Filter(\\n        must=[\\n            FieldCondition(key="year", range=Range(gte=2024)),\\n            FieldCondition(key="premium", match=MatchValue(value=True)),\\n        ]\\n    ),\\n    limit=10\\n)` }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "When is pre-filtering faster than post-filtering?", options: ["When the filter significantly narrows the search space", "When the filter matches most vectors", "Pre-filtering is always faster", "Never"], correct: 0, explanation: "Pre-filtering is faster when it eliminates most vectors. If the filter matches 99% of vectors, post-filtering is faster." }] },
    ],
  },
  {
    slug: "parent-child-retrieval",
    trackSlug: "rag",
    order: 7,
    minutes: 14,
    title: "Parent-Child and Hierarchical Retrieval",
    subtitle: "Retrieve small chunks for precision, but return their parent paragraphs for context — best of both worlds.",
    tags: ["Parent-child", "Hierarchical", "Context"],
    sections: [
      { step: 1, title: "The context-precision trade-off", blocks: [{ type: "text", content: "**Small chunks** (1-2 sentences): Precise but lack context\\n\\n**Large chunks** (whole pages): Context but diluted relevance\\n\\n**Parent-child:** Store small children for ranking, return large parents for context" }] },
      { step: 2, title: "Implementation", blocks: [{ type: "code", language: "python", label: "Parent-child retrieval", code: `# Create parents (500 chars) and children (100 chars)\\nparent_splitter = RecursiveCharacterTextSplitter(chunk_size=500)\\nparents = parent_splitter.split_text(text)\\n\\nchild_splitter = RecursiveCharacterTextSplitter(chunk_size=100)\\nall_children = []\\n\\nfor parent_id, parent_text in enumerate(parents):\\n    children = child_splitter.split_text(parent_text)\\n    for child_text in children:\\n        all_children.append({\\n            "text": child_text,\\n            "parent_id": parent_id,\\n            "parent_text": parent_text,\\n        })\\n\\n# Store children, retrieve parents\\ndocs = [Document(page_content=c["text"], metadata={"parent": c["parent_text"]}) for c in all_children]\\nvectorstore = Chroma.from_documents(docs, embeddings)\\n\\ndef retrieve_parents(query, k=3):\\n    results = vectorstore.similarity_search(query, k=k)\\n    parents = list({doc.metadata["parent"] for doc in results})\\n    return parents` }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "What is the main advantage of parent-child retrieval?", options: ["Small children rank precisely, large parents provide context", "It's faster", "It uses less memory", "It doesn't need embeddings"], correct: 0, explanation: "Parent-child stores small chunks for precise matching but returns the full parent so the LLM has enough context." }] },
    ],
  },
  {
    slug: "context-compression",
    trackSlug: "rag",
    order: 8,
    minutes: 16,
    title: "Context Compression and Filtering",
    subtitle: "Retrieved 10 chunks but only 3 sentences are relevant — extract just those sentences to save tokens.",
    tags: ["Compression", "Context pruning", "Token optimization"],
    sections: [
      { step: 1, title: "Why compress?", blocks: [{ type: "text", content: "10 chunks × 500 tokens = 5000 tokens. But only 10% is relevant.\\n\\n**Context compression** extracts only relevant sentences, saving 60-80% tokens while keeping answer quality." }] },
      { step: 2, title: "Implementation", blocks: [{ type: "code", language: "python", label: "Compress context", code: `from sentence_transformers import SentenceTransformer, util\\nimport nltk\\n\\ndef compress_context(query, context, threshold=0.5):\\n    model = SentenceTransformer('all-MiniLM-L6-v2')\\n    query_emb = model.encode(query)\\n    sentences = nltk.sent_tokenize(context)\\n    sent_embs = model.encode(sentences)\\n    similarities = util.cos_sim(query_emb, sent_embs)[0]\\n    relevant = [s for s, sim in zip(sentences, similarities) if sim > threshold]\\n    return " ".join(relevant)` }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "What is the main benefit of context compression?", options: ["Reduces tokens sent to LLM, saving cost while keeping answer quality", "Makes retrieval faster", "Improves embedding quality", "Removes need for chunking"], correct: 0, explanation: "Context compression cuts tokens by 60-80%, lowering LLM API cost, while keeping the information needed to answer." }] },
    ],
  },
  {
    slug: "agentic-rag",
    trackSlug: "rag",
    order: 9,
    minutes: 20,
    title: "Agentic RAG: Let the LLM Decide",
    subtitle: "Stop retrieving blindly — let the LLM decide when to retrieve, what to retrieve, and whether to retrieve again.",
    tags: ["Agentic RAG", "Tool use", "Iterative retrieval"],
    sections: [
      { step: 1, title: "Beyond naive RAG", blocks: [{ type: "text", content: "Naive RAG: retrieve once → generate answer\\n\\n**Agentic RAG:** LLM decides when/what to retrieve, can retrieve multiple times for multi-hop questions" }] },
      { step: 2, title: "Agent loop", blocks: [{ type: "code", language: "python", label: "Agentic RAG with function calling", code: `from openai import OpenAI\\n\\nclient = OpenAI()\\n\\ntools = [{\\n    "type": "function",\\n    "function": {\\n        "name": "retrieve",\\n        "description": "Search knowledge base",\\n        "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}\\n    }\\n}]\\n\\ndef agentic_rag(user_query, max_turns=5):\\n    messages = [{"role": "user", "content": user_query}]\\n    for turn in range(max_turns):\\n        response = client.chat.completions.create(model="gpt-4o", messages=messages, tools=tools)\\n        if response.choices[0].finish_reason == "tool_calls":\\n            tool_call = response.choices[0].message.tool_calls[0]\\n            query = eval(tool_call.function.arguments)["query"]\\n            result = retrieve(query)\\n            messages.append(response.choices[0].message)\\n            messages.append({"role": "tool", "tool_call_id": tool_call.id, "content": result})\\n        else:\\n            return response.choices[0].message.content` }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "Why does agentic RAG outperform naive RAG on multi-hop questions?", options: ["The LLM can retrieve multiple times, once for each sub-question", "It's faster", "It uses less memory", "It doesn't need embeddings"], correct: 0, explanation: "Agentic RAG lets the LLM retrieve iteratively for multi-hop questions. Naive RAG retrieves once and often misses information." }] },
    ],
  },
  {
    slug: "corrective-and-self-rag",
    trackSlug: "rag",
    order: 10,
    minutes: 18,
    title: "Corrective RAG and Self-RAG",
    subtitle: "Critique the retrieved context — is it relevant? Is the answer grounded? Retry if not.",
    tags: ["Self-RAG", "Corrective RAG", "Verification"],
    sections: [
      { step: 1, title: "Check relevance and groundedness", blocks: [{ type: "text", content: "**Corrective RAG:** Check if retrieved context is relevant. If no, rewrite query and retry.\\n\\n**Self-RAG:** After generating answer, check if it's grounded in context. If no, retrieve more or admit uncertainty." }] },
      { step: 2, title: "Relevance check", blocks: [{ type: "code", language: "python", label: "Corrective RAG", code: `def is_relevant(query, context):\\n    prompt = f"Is the context relevant to the query?\\nQuery: {query}\\nContext: {context}\\nYES or NO:"\\n    response = client.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}], temperature=0)\\n    return "YES" in response.choices[0].message.content.upper()\\n\\ndef corrective_rag(query, max_retries=3):\\n    for attempt in range(max_retries):\\n        docs = vectorstore.similarity_search(query, k=3)\\n        context = "\\n\\n".join([d.page_content for d in docs])\\n        if is_relevant(query, context):\\n            return llm_generate(query, context)\\n        else:\\n            query = rewrite_query(query)\\n    return "Could not find relevant information."` }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "What does Corrective RAG do when retrieved context is irrelevant?", options: ["It rewrites the query and retrieves again", "It gives up immediately", "It generates an answer anyway", "It uses a larger model"], correct: 0, explanation: "Corrective RAG checks relevance. If not relevant, it rewrites the query and retrieves again, up to max retries." }] },
    ],
  },
  {
    slug: "graph-rag",
    trackSlug: "rag",
    order: 11,
    minutes: 20,
    title: "Graph RAG",
    subtitle: "Build a knowledge graph from documents and traverse it during retrieval — entities, relationships, multi-hop.",
    tags: ["Graph RAG", "Knowledge graph", "Entity linking"],
    sections: [
      { step: 1, title: "When vector search isn't enough", blocks: [{ type: "text", content: "**'Who did Alice work with at Company X?'** needs relationships, not just similar text.\\n\\n**Graph RAG** extracts entities and relationships, builds a knowledge graph, and traverses it." }] },
      { step: 2, title: "Extract triples", blocks: [{ type: "code", language: "python", label: "Entity extraction", code: `def extract_triples(text):\\n    prompt = f"Extract (subject, predicate, object) triples:\\n{text}\\nTriples:"\\n    response = client.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}], temperature=0)\\n    lines = response.choices[0].message.content.strip().split("\\n")\\n    triples = []\\n    for line in lines:\\n        if "," in line:\\n            parts = [p.strip() for p in line.split(",")]\\n            if len(parts) == 3: triples.append(tuple(parts))\\n    return triples` }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "Why does Graph RAG excel at multi-hop questions?", options: ["It stores relationships explicitly, so you can traverse connections", "It's faster than vector search", "It uses less memory", "It doesn't need embeddings"], correct: 0, explanation: "Graph RAG stores (subject, predicate, object) triples. You can traverse: Alice → worked_with → Bob, then Bob → studied_at → University. Vector search can't follow connections easily." }] },
    ],
  },
  {
    slug: "rag-evaluation",
    trackSlug: "rag",
    order: 12,
    minutes: 16,
    title: "Evaluating RAG Systems",
    subtitle: "How do you know your RAG works? Measure retrieval quality, answer accuracy, and groundedness.",
    tags: ["Evaluation", "Metrics", "Testing"],
    sections: [
      { step: 1, title: "Metrics to measure", blocks: [{ type: "text", content: "**Retrieval:** Context Precision, Context Recall\\n**Generation:** Faithfulness, Answer Relevance, Answer Correctness" }] },
      { step: 2, title: "Context recall", blocks: [{ type: "code", language: "python", label: "Compute recall", code: `def context_recall(retrieved, relevant):\\n    retrieved_set = set(retrieved)\\n    relevant_set = set(relevant)\\n    return len(retrieved_set & relevant_set) / len(relevant_set)\\n\\n# Example\\nretrieved = ["chunk1", "chunk2", "chunk5"]\\nrelevant = ["chunk1", "chunk2", "chunk3"]\\nrecall = context_recall(retrieved, relevant)\\nprint(f"Recall: {recall:.2%}")  # 66.67%` }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "What does Context Recall measure?", options: ["The percentage of relevant chunks that were actually retrieved", "How fast retrieval is", "How many chunks were retrieved", "The LLM's answer quality"], correct: 0, explanation: "Context Recall = (relevant chunks retrieved) / (total relevant chunks). High recall means you didn't miss important information." }] },
    ],
  },
  {
    slug: "rag-in-production",
    trackSlug: "rag",
    order: 13,
    minutes: 18,
    title: "RAG in Production",
    subtitle: "Caching, monitoring, versioning, cost — the operational playbook for RAG at scale.",
    tags: ["Production", "Caching", "Monitoring", "Cost"],
    sections: [
      { step: 1, title: "Production challenges", blocks: [{ type: "text", content: "RAG in production: cost, latency, quality drift, concurrency, versioning" }] },
      { step: 2, title: "Cache responses", blocks: [{ type: "code", language: "python", label: "Response caching", code: `import hashlib, redis\\nredis_client = redis.Redis()\\n\\ndef cached_rag(query):\\n    key = f"rag:{hashlib.sha256(query.encode()).hexdigest()}"\\n    cached = redis_client.get(key)\\n    if cached: return cached.decode()\\n    answer = run_rag(query)\\n    redis_client.setex(key, 3600, answer)\\n    return answer` }] },
      { step: 3, title: "Test yourself", blocks: [{ type: "quiz", question: "Why cache RAG responses?", options: ["Many queries repeat — caching saves 90% of LLM calls and cost", "Caching improves answer quality", "Caching makes embeddings better", "Caching isn't useful"], correct: 0, explanation: "Many users ask the same questions. Caching saves 90% of LLM API cost." }] },
    ],
  },
  {
    slug: "chat-with-pdf-project",
    trackSlug: "rag",
    order: 14,
    minutes: 30,
    title: "Project: Chat with PDF",
    subtitle: "Build a full RAG app — upload a PDF, chunk, embed, store, and chat with it via a web UI.",
    tags: ["Project", "PDF", "Full stack"],
    sections: [
      { step: 1, title: "Project overview", blocks: [{ type: "text", content: "Build a chat-with-PDF app: upload PDF → extract text → chunk → embed → store in Chroma → chat API → web UI" }] },
      { step: 2, title: "What you'll learn", blocks: [{ type: "text", content: "PDF extraction, chunking, vector DB setup, RAG API design, frontend integration, Docker deployment" }] },
      { step: 3, title: "Coming soon", blocks: [{ type: "callout", kind: "tip", content: "Full project spec, starter code, and instructions coming soon. Portfolio-ready RAG application." }] },
    ],
  },
];
