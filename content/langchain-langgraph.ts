import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — LangChain Fundamentals (fully written as the reference)
// ---------------------------------------------------------------------------
const langchainFundamentalsLesson: Lesson = {
  slug: "langchain-fundamentals",
  trackSlug: "langchain-langgraph",
  order: 1,
  minutes: 24,
  title: "LangChain Fundamentals",
  subtitle:
    "From raw OpenAI calls to composable chains — build LLM applications faster with LangChain's abstractions.",
  tags: ["LangChain", "Chains", "Prompts", "First principles"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Building LLM applications from scratch is repetitive. Every project needs:\n\n- **Prompt templates** — format user input into prompts\n- **Output parsing** — extract structured data from LLM responses\n- **Chains** — combine multiple LLM calls (e.g., summarize → translate → critique)\n- **Memory** — maintain conversation context across turns\n- **Tool integration** — connect LLMs to APIs, databases, search\n- **Error handling** — retry on API failures, validate outputs\n\nThe problem: you end up rewriting the same boilerplate in every project. LangChain provides battle-tested abstractions so you focus on application logic, not plumbing.",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "LangChain is to LLM apps what React is to web apps — a framework that handles common patterns so you don't reinvent the wheel.",
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
            "LangChain accelerates LLM development:",
        },
        {
          type: "kv",
          items: [
            { key: "Faster prototyping", value: "Build a RAG pipeline in 20 lines instead of 200. Go from idea to working demo in hours, not days." },
            { key: "Battle-tested patterns", value: "Memory management, retries, streaming, error handling — all solved problems with LangChain." },
            { key: "Swappable components", value: "Switch from OpenAI to Anthropic to local Llama with one line. Try different embeddings, vector DBs, tools without rewriting." },
            { key: "Community ecosystem", value: "1000+ integrations: Pinecone, Chroma, Wikipedia, ArXiv, SQL, Pandas, Zapier — ready to use." },
            { key: "Observability built-in", value: "LangSmith tracing shows every LLM call, tool invocation, latency, cost — essential for debugging." },
          ],
        },
        {
          type: "text",
          content:
            "The trade-off: abstraction layers add complexity. LangChain is great for prototyping and standard workflows. For performance-critical or highly custom systems, you may eventually drop down to raw API calls. But even then, you'll have learned the patterns from LangChain.",
        },
      ],
    },
    {
      step: 3,
      title: "Core concepts: LLMs, prompts, chains",
      blocks: [
        {
          type: "text",
          content:
            "LangChain has three foundational abstractions:",
        },
        {
          type: "kv",
          items: [
            { key: "LLMs / Chat Models", value: "Wrappers around OpenAI, Anthropic, etc. Unified interface so switching providers is one line." },
            { key: "PromptTemplates", value: "Parameterized prompts. Insert variables, few-shot examples, system messages without string concatenation." },
            { key: "Chains", value: "Combine LLM calls, prompts, and logic. A chain is a pipeline: input → steps → output." },
          ],
        },
        {
          type: "code",
          language: "python",
          label: "Hello World: LLM + Prompt + Chain",
          code: `# pip install langchain langchain-openai
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

# 1. LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 2. Prompt template
prompt = ChatPromptTemplate.from_template(
    "Translate this to {language}: {text}"
)

# 3. Chain: prompt → LLM → parse output
chain = prompt | llm | StrOutputParser()

# 4. Run
result = chain.invoke({
    "language": "French",
    "text": "Hello, how are you?"
})

print(result)  # "Bonjour, comment allez-vous?"`,
        },
        {
          type: "text",
          content:
            "The **pipe operator** `|` chains components. Data flows left to right:\n- `prompt` formats input into messages\n- `llm` sends to OpenAI\n- `StrOutputParser()` extracts the string response\n\nThis is the core LangChain pattern: compose reusable components into pipelines.",
        },
      ],
    },
    {
      step: 4,
      title: "Prompt templates: from strings to structured prompts",
      blocks: [
        {
          type: "text",
          content:
            "Raw string formatting is fragile. LangChain prompts are robust:",
        },
        {
          type: "code",
          language: "python",
          label: "Different prompt types",
          code: `from langchain.prompts import (
    PromptTemplate,           # Simple string template
    ChatPromptTemplate,       # Chat messages (system, user, assistant)
    FewShotPromptTemplate,    # Few-shot examples
    MessagesPlaceholder       # Dynamic message insertion
)

# 1. Simple template
simple = PromptTemplate.from_template(
    "What is {company}'s main product?"
)
print(simple.format(company="Apple"))

# 2. Chat template (system + user)
chat = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("user", "Tell me about {topic}")
])
messages = chat.format_messages(topic="Python")

# 3. Few-shot template
examples = [
    {"input": "happy", "output": "sad"},
    {"input": "tall", "output": "short"},
]

few_shot = FewShotPromptTemplate(
    examples=examples,
    example_prompt=PromptTemplate.from_template(
        "Input: {input}\\nOutput: {output}"
    ),
    prefix="Give the antonym:",
    suffix="Input: {word}\\nOutput:",
    input_variables=["word"]
)

print(few_shot.format(word="hot"))
# Output:
# Give the antonym:
# Input: happy
# Output: sad
# Input: tall
# Output: short
# Input: hot
# Output:`,
        },
        {
          type: "text",
          content:
            "**Why templates matter:**\n- **Reusable** — define once, call with different variables\n- **Composable** — insert examples, system messages, context dynamically\n- **Version controlled** — prompts are code, not magic strings scattered everywhere\n- **Testable** — unit test prompt formatting separately from LLM calls",
        },
      ],
    },
    {
      step: 5,
      title: "Output parsers: structured data from text",
      blocks: [
        {
          type: "text",
          content:
            "LLMs return unstructured text. Output parsers extract structured data:",
        },
        {
          type: "code",
          language: "python",
          label: "Parsing structured outputs",
          code: `from langchain.output_parsers import (
    StrOutputParser,      # Plain string
    JsonOutputParser,     # JSON object
    PydanticOutputParser  # Validated Python objects
)
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 1. String output (default)
chain = ChatPromptTemplate.from_template("What is {company}?") | llm | StrOutputParser()
result = chain.invoke({"company": "Apple"})  # Returns string

# 2. JSON output
json_parser = JsonOutputParser()
json_prompt = ChatPromptTemplate.from_template(
    "Return a JSON object with 'company' and 'product' for: {name}"
)
json_chain = json_prompt | llm | json_parser
result = json_chain.invoke({"name": "Tesla"})
# Returns: {"company": "Tesla", "product": "Electric vehicles"}

# 3. Pydantic output (validated schema)
class Company(BaseModel):
    name: str = Field(description="Company name")
    founded: int = Field(description="Year founded")
    industry: str = Field(description="Primary industry")

pydantic_parser = PydanticOutputParser(pydantic_object=Company)

pydantic_prompt = ChatPromptTemplate.from_template(
    """Extract company info.

{format_instructions}

Company: {company}
"""
)

pydantic_chain = pydantic_prompt | llm | pydantic_parser

result = pydantic_chain.invoke({
    "company": "Apple",
    "format_instructions": pydantic_parser.get_format_instructions()
})

print(result)  # Company(name="Apple", founded=1976, industry="Technology")
print(result.founded)  # 1976 (typed!)`,
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "Use PydanticOutputParser for production. It auto-generates schema instructions, validates output, and gives you typed objects. Catching parse errors at the boundary prevents bugs downstream.",
        },
      ],
    },
    {
      step: 6,
      title: "Chains: simple, sequential, and custom",
      blocks: [
        {
          type: "text",
          content:
            "Chains combine multiple steps into a pipeline:",
        },
        {
          type: "diagram",
          label: "Chain types",
          chart: `graph LR
    A[Input] --> B[Simple Chain: prompt → LLM]
    A --> C[Sequential Chain: step1 → step2 → step3]
    A --> D[Router Chain: route to specialist]
    A --> E[Custom Chain: Python logic + LLM]

    style A fill:#e1f5ff
    style B fill:#fff3cd
    style C fill:#fff3cd
    style D fill:#fff3cd
    style E fill:#fff3cd`,
        },
        {
          type: "code",
          language: "python",
          label: "Sequential chain: multi-step pipeline",
          code: `from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# Step 1: Write a poem
poem_prompt = ChatPromptTemplate.from_template(
    "Write a 4-line poem about {topic}"
)
poem_chain = poem_prompt | llm | StrOutputParser()

# Step 2: Translate the poem
translate_prompt = ChatPromptTemplate.from_template(
    "Translate this poem to {language}:\\n\\n{poem}"
)
translate_chain = translate_prompt | llm | StrOutputParser()

# Step 3: Critique the translation
critique_prompt = ChatPromptTemplate.from_template(
    "Critique this translation (1 sentence):\\n\\n{translation}"
)
critique_chain = critique_prompt | llm | StrOutputParser()

# Combine into sequential pipeline
def sequential_pipeline(topic: str, language: str):
    # Step 1
    poem = poem_chain.invoke({"topic": topic})
    print(f"Poem:\\n{poem}\\n")

    # Step 2
    translation = translate_chain.invoke({"poem": poem, "language": language})
    print(f"Translation:\\n{translation}\\n")

    # Step 3
    critique = critique_chain.invoke({"translation": translation})
    print(f"Critique:\\n{critique}")

    return critique

result = sequential_pipeline("mountains", "Spanish")`,
        },
        {
          type: "text",
          content:
            "**Modern LangChain** favors the **pipe operator** over legacy `LLMChain` and `SequentialChain` classes. The pipe is simpler, more Pythonic, and easier to debug.",
        },
      ],
    },
    {
      step: 7,
      title: "Runnable interface: the universal protocol",
      blocks: [
        {
          type: "text",
          content:
            "Every LangChain component implements the **Runnable** interface:",
        },
        {
          type: "kv",
          items: [
            { key: "invoke(input)", value: "Run synchronously, return output" },
            { key: "batch(inputs)", value: "Run on list of inputs, return list of outputs" },
            { key: "stream(input)", value: "Stream output token-by-token (for chat)" },
            { key: "ainvoke/abatch/astream", value: "Async versions for concurrent calls" },
          ],
        },
        {
          type: "code",
          language: "python",
          label: "Using the Runnable interface",
          code: `from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser

llm = ChatOpenAI(model="gpt-4o")
chain = ChatPromptTemplate.from_template("What is {topic}?") | llm | StrOutputParser()

# 1. Invoke (single input)
result = chain.invoke({"topic": "quantum computing"})

# 2. Batch (multiple inputs in parallel)
results = chain.batch([
    {"topic": "AI"},
    {"topic": "blockchain"},
    {"topic": "IoT"}
])

# 3. Stream (token-by-token output)
for chunk in chain.stream({"topic": "machine learning"}):
    print(chunk, end="", flush=True)

# 4. Async (concurrent invocation)
import asyncio

async def run_concurrent():
    tasks = [
        chain.ainvoke({"topic": "Python"}),
        chain.ainvoke({"topic": "JavaScript"}),
    ]
    results = await asyncio.gather(*tasks)
    return results

results = asyncio.run(run_concurrent())`,
        },
        {
          type: "text",
          content:
            "**Why this matters:** Every component speaks the same language. You can chain anything: prompts, LLMs, parsers, custom Python functions, retrieval, tools. If it's a Runnable, it can go in the pipe.",
        },
      ],
    },
    {
      step: 8,
      title: "Memory: conversational context",
      blocks: [
        {
          type: "text",
          content:
            "Chains are stateless by default. To maintain conversation history, add memory:",
        },
        {
          type: "code",
          language: "python",
          label: "Conversational chain with memory",
          code: `from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema.runnable import RunnablePassthrough

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# Memory stores conversation history
memory = ConversationBufferMemory(return_messages=True, memory_key="history")

# Prompt with history placeholder
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder(variable_name="history"),  # Conversation history goes here
    ("user", "{input}")
])

# Conversational chain
def conversational_chain(user_input: str):
    # Load memory
    history = memory.load_memory_variables({})["history"]

    # Run chain
    chain = prompt | llm
    response = chain.invoke({"input": user_input, "history": history})

    # Save to memory
    memory.save_context({"input": user_input}, {"output": response.content})

    return response.content

# Multi-turn conversation
print(conversational_chain("My name is Alice"))
# "Nice to meet you, Alice!"

print(conversational_chain("What's my name?"))
# "Your name is Alice."

print(conversational_chain("What did we talk about?"))
# "We talked about your name, which is Alice."`,
        },
        {
          type: "text",
          content:
            "**Memory types in LangChain:**\n- `ConversationBufferMemory` — stores full history (simple but context grows unbounded)\n- `ConversationBufferWindowMemory` — keeps last N messages only\n- `ConversationSummaryMemory` — summarizes old messages to save tokens\n- `ConversationTokenBufferMemory` — keeps messages until token limit\n- `VectorStoreRetrieverMemory` — retrieval-based memory (semantic search over past conversations)",
        },
      ],
    },
    {
      step: 9,
      title: "RAG with LangChain: retrieval in 20 lines",
      blocks: [
        {
          type: "text",
          content:
            "LangChain makes RAG trivial. Load documents → chunk → embed → retrieve → generate:",
        },
        {
          type: "code",
          language: "python",
          label: "RAG pipeline in LangChain",
          code: `# pip install langchain langchain-openai chromadb
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser

# 1. Load documents
loader = TextLoader("company_docs.txt")
documents = loader.load()

# 2. Split into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(documents)

# 3. Embed and store in vector DB
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 4. RAG chain
llm = ChatOpenAI(model="gpt-4o", temperature=0)

prompt = ChatPromptTemplate.from_template("""Answer using only this context:

{context}

Question: {question}
Answer:""")

rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 5. Query
answer = rag_chain.invoke("What is our refund policy?")
print(answer)`,
        },
        {
          type: "text",
          content:
            "**What just happened:**\n1. `retriever` fetches relevant chunks (automatic — LangChain calls it behind the scenes)\n2. `context` and `question` are injected into the prompt\n3. LLM generates answer grounded in context\n4. Parser extracts string\n\nThis is **production-ready RAG** in 20 lines. No manual embedding, no vector DB boilerplate, no prompt engineering.",
        },
      ],
    },
    {
      step: 10,
      title: "Tools and agents: LLMs that act",
      blocks: [
        {
          type: "text",
          content:
            "LangChain agents use tools to interact with the world:",
        },
        {
          type: "code",
          language: "python",
          label: "Agent with tools",
          code: `from langchain_openai import ChatOpenAI
from langchain.agents import Tool, initialize_agent, AgentType
from langchain.tools import DuckDuckGoSearchRun

# Define tools
search = DuckDuckGoSearchRun()

def calculator(expression: str) -> str:
    """Evaluate math expression"""
    try:
        return str(eval(expression))
    except:
        return "Invalid expression"

tools = [
    Tool(
        name="Search",
        func=search.run,
        description="Search the web for current information"
    ),
    Tool(
        name="Calculator",
        func=calculator,
        description="Evaluate mathematical expressions like '15 * 20 / 3'"
    )
]

# Create agent
llm = ChatOpenAI(model="gpt-4o", temperature=0)

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,  # Uses OpenAI's tool calling
    verbose=True  # Show reasoning trace
)

# Run
result = agent.run("What's 15% of the population of Tokyo?")
print(result)

# Agent will:
# 1. Search("population of Tokyo") → "14 million"
# 2. Calculator("14000000 * 0.15") → "2100000"
# 3. Answer: "2.1 million"`,
        },
        {
          type: "text",
          content:
            "**Agent execution trace** (with `verbose=True`):\n```\n> Entering new AgentExecutor chain...\n> Thought: I need to find Tokyo's population\n> Action: Search\n> Action Input: population of Tokyo\n> Observation: 14 million\n> Thought: Now calculate 15%\n> Action: Calculator\n> Action Input: 14000000 * 0.15\n> Observation: 2100000.0\n> Thought: I have the answer\n> Final Answer: 2.1 million\n```\n\nThis is the **ReAct pattern** (covered in AI Agents track) implemented in LangChain.",
        },
      ],
    },
    {
      step: 11,
      title: "LangSmith: observability for LLM apps",
      blocks: [
        {
          type: "text",
          content:
            "Debugging LangChain apps is hard without visibility. LangSmith traces every step:",
        },
        {
          type: "code",
          language: "python",
          label: "Enable LangSmith tracing",
          code: `import os

# Set environment variables (get free API key at smith.langchain.com)
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-langsmith-api-key"
os.environ["LANGCHAIN_PROJECT"] = "my-project"  # Optional: organize traces

# Now run any LangChain code — traces auto-appear in LangSmith
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

chain = ChatPromptTemplate.from_template("What is {topic}?") | ChatOpenAI()
result = chain.invoke({"topic": "Python"})

# View trace at: https://smith.langchain.com/`,
        },
        {
          type: "text",
          content:
            "**What LangSmith shows:**\n- Every LLM call (prompt, response, tokens, latency, cost)\n- Every tool invocation (inputs, outputs, errors)\n- Chain execution tree (which steps ran, in what order)\n- Performance bottlenecks (slow retrievers, expensive LLM calls)\n- Error stack traces (where did it fail?)\n\nThis is **essential for production**. Without tracing, debugging multi-step chains is guesswork.",
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "Enable LangSmith tracing in development. It's free for 5K traces/month and saves hours of print-statement debugging.",
        },
      ],
    },
    {
      step: 12,
      title: "When to use LangChain vs raw APIs",
      blocks: [
        {
          type: "text",
          content:
            "LangChain isn't always the answer. When to use it, when to skip it:",
        },
        {
          type: "kv",
          items: [
            { key: "✅ Use LangChain for", value: "Prototyping, RAG, multi-tool agents, when you need integrations (100+ vector DBs, APIs, tools), when learning LLM patterns (chains, memory, agents)." },
            { key: "❌ Skip LangChain for", value: "Single LLM call (raw OpenAI API is simpler), performance-critical paths (framework overhead adds 10-50ms), highly custom logic (fighting abstractions is slower than building from scratch), production systems with strict latency SLAs (unless you profile first)." },
          ],
        },
        {
          type: "text",
          content:
            "**The pragmatic approach:**\n1. **Start with LangChain** — prototype fast, learn patterns\n2. **Profile** — identify bottlenecks (retrieval? LLM calls? parsing?)\n3. **Optimize hot paths** — replace slow LangChain components with custom code\n4. **Keep integrations** — LangChain's vector DB / tool connectors are still useful\n\nMany production systems are **hybrid**: LangChain for orchestration, raw API calls for critical paths.",
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
            "In the hands-on project, you'll build a multi-document Q&A system with LangChain. It will load 10+ PDFs, chunk them, embed into Chroma, implement a conversational RAG chain with memory (remembers past questions), add source citations (which document did the answer come from?), and trace everything with LangSmith. You'll compare LangChain RAG to a from-scratch implementation (yours is 200 lines, LangChain is 50), measure latency/cost, and optimize the slow retrieval step.",
        },
      ],
    },
    {
      step: 14,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question: "What's the main benefit of the Runnable interface in LangChain?",
          options: [
            "Every component (prompt, LLM, parser, retriever) has the same invoke/batch/stream methods, so they compose easily",
            "It makes LangChain faster than raw API calls",
            "It automatically caches LLM responses",
            "It enables multi-threading for parallel chains",
          ],
          correct: 0,
          explanation:
            "The Runnable interface provides a universal protocol: every component implements invoke(), batch(), stream(), and async variants. This means you can chain any Runnable with the pipe operator (|) — prompts, LLMs, parsers, retrievers, custom functions — and they all just work. It's about composability, not performance (though batch() and async do help with throughput).",
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
    trackSlug: "langchain-langgraph",
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

export const langchainLanggraphLessons: Lesson[] = [
  langchainFundamentalsLesson,
  {
    slug: "advanced-prompting",
    trackSlug: "langchain-langgraph",
    order: 2,
    minutes: 16,
    title: "Advanced Prompting Techniques",
    subtitle: "Few-shot prompts, chat templates, prompt composition, dynamic examples, and prompt optimization.",
    tags: ["Prompts", "Templates", "Few-shot", "Optimization"],
    sections: [
      {
        step: 1,
        title: "The problem we're solving",
        blocks: [
          {
            type: "text",
            content:
              "Simple prompts work for simple tasks. But production LLM applications need:\n\n- **Consistent formatting** — extract data in the exact structure every time\n- **Domain expertise** — teach the LLM your company's terminology and style\n- **Few-shot learning** — show examples to guide behavior without fine-tuning\n- **Dynamic context** — insert relevant examples based on the specific input\n- **Prompt reusability** — compose prompts from reusable building blocks\n\nThe problem: **How do you design prompts that are reliable, maintainable, and adaptable to different inputs?**",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "Advanced prompting is prompt engineering + software engineering. Templates make prompts reusable, few-shot examples make them reliable, composition makes them maintainable.",
          },
        ],
      },
      {
        step: 2,
        title: "Few-shot prompting: learning from examples",
        blocks: [
          {
            type: "text",
            content:
              "Few-shot prompting provides examples in the prompt. The LLM learns the pattern and applies it to new inputs:",
          },
          {
            type: "code",
            language: "python",
            label: "Few-shot sentiment classifier",
            code: `from langchain.prompts import FewShotPromptTemplate, PromptTemplate

# Define examples
examples = [
    {"text": "I love this product!", "sentiment": "positive"},
    {"text": "Terrible experience, very disappointed", "sentiment": "negative"},
    {"text": "It's okay, nothing special", "sentiment": "neutral"},
    {"text": "Best purchase I've made this year!", "sentiment": "positive"},
    {"text": "Complete waste of money", "sentiment": "negative"},
]

# Define how each example is formatted
example_prompt = PromptTemplate(
    input_variables=["text", "sentiment"],
    template="Text: {text}\\nSentiment: {sentiment}"
)

# Create few-shot template
few_shot_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="Classify the sentiment as positive, negative, or neutral:\\n",
    suffix="\\nText: {input}\\nSentiment:",
    input_variables=["input"]
)

# Use it
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0)
chain = few_shot_prompt | llm

result = chain.invoke({"input": "This exceeded my expectations"})
print(result.content)  # "positive"`,
          },
          {
            type: "text",
            content:
              "**Why few-shot works:**\n- Shows LLM the exact format you want\n- Teaches domain-specific patterns (your sentiment categories, not generic ones)\n- No fine-tuning needed (examples are in every request)\n- Can change examples without retraining",
          },
        ],
      },
      {
        step: 3,
        title: "Dynamic example selection",
        blocks: [
          {
            type: "text",
            content:
              "Static examples work, but **dynamic selection** is better. Retrieve the most relevant examples for each input:",
          },
          {
            type: "code",
            language: "python",
            label: "Example selector with semantic similarity",
            code: `from langchain.prompts import FewShotPromptTemplate, PromptTemplate
from langchain.prompts.example_selector import SemanticSimilarityExampleSelector
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# Example pool (100+ examples)
examples = [
    {"text": "Amazing quality, highly recommend!", "sentiment": "positive"},
    {"text": "Broke after one week, terrible", "sentiment": "negative"},
    {"text": "Average product, nothing special", "sentiment": "neutral"},
    # ... 97 more examples
]

# Create example selector
example_selector = SemanticSimilarityExampleSelector.from_examples(
    examples,
    OpenAIEmbeddings(),
    Chroma,
    k=3  # Select 3 most similar examples
)

# Test it
query = "This is the worst product I've ever bought"
selected = example_selector.select_examples({"text": query})
print(f"Selected {len(selected)} examples")
for ex in selected:
    print(f"- {ex['text']} → {ex['sentiment']}")

# Output:
# Selected 3 examples
# - Broke after one week, terrible → negative
# - Complete waste of money → negative
# - Terrible experience, very disappointed → negative

# Use in few-shot prompt
dynamic_prompt = FewShotPromptTemplate(
    example_selector=example_selector,
    example_prompt=PromptTemplate(
        input_variables=["text", "sentiment"],
        template="Text: {text}\\nSentiment: {sentiment}"
    ),
    prefix="Classify sentiment:\\n",
    suffix="\\nText: {input}\\nSentiment:",
    input_variables=["input"]
)`,
          },
          {
            type: "text",
            content:
              "**Benefits:**\n- Relevant examples improve accuracy (similar inputs → better patterns)\n- Efficient token usage (only include helpful examples, not all 100)\n- Automatic adaptation (new examples added to pool without code changes)",
          },
        ],
      },
      {
        step: 4,
        title: "Chat message templates",
        blocks: [
          {
            type: "text",
            content:
              "Chat models expect messages with roles (system, user, assistant). LangChain templates handle this:",
          },
          {
            type: "code",
            language: "python",
            label: "Structured chat templates",
            code: `from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate, SystemMessagePromptTemplate

# Method 1: Simple tuple format
simple = ChatPromptTemplate.from_messages([
    ("system", "You are an expert {role}."),
    ("user", "Explain {topic} in simple terms")
])

# Method 2: Explicit message types
explicit = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template(
        "You are a helpful assistant specializing in {domain}"
    ),
    HumanMessagePromptTemplate.from_template(
        "Question: {question}"
    )
])

# Method 3: With placeholders (dynamic message insertion)
with_history = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant"),
    MessagesPlaceholder(variable_name="history"),  # Conversation history goes here
    ("user", "{input}")
])

# Usage
messages = with_history.format_messages(
    history=[
        ("user", "My name is Alice"),
        ("assistant", "Nice to meet you, Alice!"),
    ],
    input="What's my name?"
)

# Result:
# [
#   SystemMessage(content="You are a helpful assistant"),
#   HumanMessage(content="My name is Alice"),
#   AIMessage(content="Nice to meet you, Alice!"),
#   HumanMessage(content="What's my name?")
# ]`,
          },
        ],
      },
      {
        step: 5,
        title: "Prompt composition: building blocks",
        blocks: [
          {
            type: "text",
            content:
              "Complex prompts are easier to maintain when built from reusable pieces:",
          },
          {
            type: "code",
            language: "python",
            label: "Composing prompts from parts",
            code: `from langchain.prompts import ChatPromptTemplate

# Reusable prompt parts
SYSTEM_BASE = "You are an AI assistant."

TONE_PROFESSIONAL = "Use professional, formal language."
TONE_CASUAL = "Use casual, friendly language."

FORMAT_JSON = "Return your answer as JSON with these keys: {keys}"
FORMAT_MARKDOWN = "Return your answer as a Markdown document."

# Compose dynamically
def build_prompt(tone: str = "professional", format_type: str = "markdown"):
    tone_instruction = TONE_PROFESSIONAL if tone == "professional" else TONE_CASUAL

    if format_type == "json":
        format_instruction = FORMAT_JSON
    else:
        format_instruction = FORMAT_MARKDOWN

    template = f"""{SYSTEM_BASE}

{tone_instruction}

{format_instruction}

Question: {{question}}
Answer:"""

    return ChatPromptTemplate.from_template(template)

# Use it
formal_json = build_prompt(tone="professional", format_type="json")
casual_md = build_prompt(tone="casual", format_type="markdown")

# Now you can swap formats without rewriting the entire prompt
result = (formal_json | llm).invoke({
    "question": "What is Python?",
    "keys": "definition, use_cases, popularity"
})`,
          },
        ],
      },
      {
        step: 6,
        title: "Partial prompts: pre-filling variables",
        blocks: [
          {
            type: "text",
            content:
              "Sometimes you know some variables upfront but not others. Partial prompts let you fill incrementally:",
          },
          {
            type: "code",
            language: "python",
            label: "Partial prompt templates",
            code: `from langchain.prompts import PromptTemplate

# Define prompt with multiple variables
prompt = PromptTemplate(
    input_variables=["company", "role", "question"],
    template="You are a {role} at {company}. Answer: {question}"
)

# Scenario: company and role are known at app startup, question comes later
# Create partial prompt
partial_prompt = prompt.partial(company="Anthropic", role="AI researcher")

# Now partial_prompt only needs "question"
chain = partial_prompt | llm

# Use it multiple times with different questions
answer1 = chain.invoke({"question": "What is Claude?"})
answer2 = chain.invoke({"question": "What are AI safety risks?"})

# Both use company="Anthropic", role="AI researcher" automatically`,
          },
          {
            type: "text",
            content:
              "**Use cases:**\n- Configuration values known at startup\n- User profile data (name, preferences) filled once per session\n- System prompts that rarely change but questions vary",
          },
        ],
      },
      {
        step: 7,
        title: "Prompt pipelines: multi-stage prompting",
        blocks: [
          {
            type: "text",
            content:
              "Chain prompts together: output of prompt 1 becomes input to prompt 2:",
          },
          {
            type: "code",
            language: "python",
            label: "Multi-stage prompt pipeline",
            code: `from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# Stage 1: Extract key points
extract_prompt = ChatPromptTemplate.from_template(
    "Extract 3 key points from this text:\\n\\n{text}\\n\\nKey points:"
)

# Stage 2: Summarize those points
summarize_prompt = ChatPromptTemplate.from_template(
    "Summarize these key points in one sentence:\\n\\n{key_points}\\n\\nSummary:"
)

# Stage 3: Translate
translate_prompt = ChatPromptTemplate.from_template(
    "Translate to {language}:\\n\\n{summary}\\n\\nTranslation:"
)

# Build pipeline
def process_document(text: str, language: str):
    # Stage 1
    key_points = (extract_prompt | llm | StrOutputParser()).invoke({"text": text})
    print(f"Key points: {key_points}\\n")

    # Stage 2
    summary = (summarize_prompt | llm | StrOutputParser()).invoke({"key_points": key_points})
    print(f"Summary: {summary}\\n")

    # Stage 3
    translation = (translate_prompt | llm | StrOutputParser()).invoke({
        "summary": summary,
        "language": language
    })

    return translation

result = process_document(
    "Long document text here...",
    "Spanish"
)`,
          },
        ],
      },
      {
        step: 8,
        title: "Prompt optimization: A/B testing prompts",
        blocks: [
          {
            type: "text",
            content:
              "Not all prompts are equal. Test variations and measure which performs better:",
          },
          {
            type: "code",
            language: "python",
            label: "A/B test prompt variants",
            code: `from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# Variant A: Direct instruction
prompt_a = ChatPromptTemplate.from_template(
    "Classify sentiment (positive/negative/neutral): {text}"
)

# Variant B: With reasoning
prompt_b = ChatPromptTemplate.from_template(
    """Analyze the sentiment of this text.

First, identify emotional words.
Then, determine overall sentiment.

Text: {text}

Sentiment:"""
)

# Test set
test_cases = [
    {"text": "I love this!", "expected": "positive"},
    {"text": "Terrible experience", "expected": "negative"},
    {"text": "It's okay", "expected": "neutral"},
    # ... 100 more test cases
]

def evaluate_prompt(prompt):
    """Measure accuracy on test set"""
    correct = 0
    for case in test_cases:
        chain = prompt | llm
        result = chain.invoke({"text": case["text"]})

        if case["expected"].lower() in result.content.lower():
            correct += 1

    return correct / len(test_cases)

accuracy_a = evaluate_prompt(prompt_a)
accuracy_b = evaluate_prompt(prompt_b)

print(f"Prompt A accuracy: {accuracy_a:.1%}")
print(f"Prompt B accuracy: {accuracy_b:.1%}")
print(f"Winner: {'B' if accuracy_b > accuracy_a else 'A'}")`,
          },
          {
            type: "text",
            content:
              "**Metrics to track:**\n- Accuracy (does it match expected output?)\n- Token usage (shorter prompts = cheaper)\n- Latency (fewer LLM calls = faster)\n- Robustness (does it handle edge cases?)",
          },
        ],
      },
      {
        step: 9,
        title: "When few-shot beats zero-shot",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "✅ Use few-shot for", value: "Complex formatting (extract to specific JSON schema), domain-specific tasks (legal document analysis, medical coding), consistent style (your company's tone), edge cases (show how to handle tricky inputs)" },
              { key: "❌ Use zero-shot for", value: "Simple tasks (sentiment: positive/negative), general knowledge (what is Python?), when you don't have examples yet (prototyping phase)" },
            ],
          },
          {
            type: "text",
            content:
              "**Rule of thumb:** Start zero-shot. Add examples when you see inconsistent output. Dynamic selection when you have 20+ examples.",
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the main advantage of dynamic example selection over static few-shot prompts?",
            options: [
              "It retrieves the most relevant examples for each input, improving accuracy while using fewer tokens",
              "It's faster because it caches examples",
              "It doesn't require a vector database",
              "It works with any LLM, not just OpenAI",
            ],
            correct: 0,
            explanation:
              "Dynamic example selection uses semantic similarity to retrieve the k most relevant examples for each specific input. This improves accuracy (similar examples teach better patterns) while being token-efficient (only include helpful examples, not all 100). It does require a vector database and embeddings, which adds setup complexity, but the quality improvement is usually worth it for production systems.",
          },
        ],
      },
    ],
  },
  {
    slug: "output-parsing",
    trackSlug: "langchain-langgraph",
    order: 3,
    minutes: 14,
    title: "Output Parsing and Validation",
    subtitle: "Extract structured data from LLM responses — JSON, Pydantic, custom parsers, error handling.",
    tags: ["Parsing", "Validation", "Structured output", "Pydantic"],
    sections: [
      {
        step: 1,
        title: "The problem we're solving",
        blocks: [
          {
            type: "text",
            content:
              "LLMs return unstructured text. But applications need:\n\n- **Typed data** — Python dictionaries, not strings\n- **Validation** — ensure required fields are present\n- **Error handling** — what if the LLM returns malformed JSON?\n- **Type safety** — `user.email` should be a string, not 'check your result'\n\nThe problem: **How do you reliably extract structured data from LLM responses?**",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "Output parsers are the boundary between LLM (text) and your app (data). Get this right and downstream code is clean. Get it wrong and you'll have type errors and validation bugs everywhere.",
          },
        ],
      },
      {
        step: 2,
        title: "Basic parsers: string, JSON, lists",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Built-in output parsers",
            code: `from langchain.output_parsers import (
    StrOutputParser,
    JsonOutputParser,
    CommaSeparatedListOutputParser
)
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 1. String output (default, simplest)
str_chain = (
    ChatPromptTemplate.from_template("What is {topic}?")
    | llm
    | StrOutputParser()
)
result = str_chain.invoke({"topic": "Python"})
# Returns: "Python is a high-level programming language..."

# 2. JSON output
json_parser = JsonOutputParser()
json_chain = (
    ChatPromptTemplate.from_template(
        "Return a JSON object with 'name' and 'age' for: {person}"
    )
    | llm
    | json_parser
)
result = json_chain.invoke({"person": "Alice, 30 years old"})
# Returns: {"name": "Alice", "age": 30}

# 3. Comma-separated list
list_parser = CommaSeparatedListOutputParser()
list_chain = (
    ChatPromptTemplate.from_template(
        "List 3 {category}. Format as comma-separated."
    )
    | llm
    | list_parser
)
result = list_chain.invoke({"category": "programming languages"})
# Returns: ["Python", "JavaScript", "Java"]`,
          },
        ],
      },
      {
        step: 3,
        title: "Pydantic parsers: validated schemas",
        blocks: [
          {
            type: "text",
            content:
              "PydanticOutputParser gives you **typed, validated** Python objects:",
          },
          {
            type: "code",
            language: "python",
            label: "Pydantic output parser",
            code: `from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field, validator

# 1. Define schema with validation
class Person(BaseModel):
    name: str = Field(description="Person's full name")
    age: int = Field(description="Person's age in years", gt=0, lt=150)
    email: str = Field(description="Email address")
    interests: list[str] = Field(description="List of interests/hobbies")

    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v

# 2. Create parser
parser = PydanticOutputParser(pydantic_object=Person)

# 3. Auto-generate format instructions
format_instructions = parser.get_format_instructions()
print(format_instructions)
# Output:
# The output should be formatted as a JSON instance that conforms to
# the JSON schema below...

# 4. Build prompt with instructions
prompt = ChatPromptTemplate.from_template(
    """Extract person info from this text.

{format_instructions}

Text: {text}
"""
)

llm = ChatOpenAI(model="gpt-4o", temperature=0)
chain = prompt | llm | parser

# 5. Parse!
text = "John Smith is 25 years old. Email: john@example.com. He enjoys hiking and photography."

result = chain.invoke({
    "text": text,
    "format_instructions": format_instructions
})

print(type(result))  # <class '__main__.Person'>
print(result.name)   # "John Smith"
print(result.age)    # 25
print(result.email)  # "john@example.com"
print(result.interests)  # ["hiking", "photography"]

# Type-safe access!
age_next_year = result.age + 1  # Works because age is int`,
          },
          {
            type: "text",
            content:
              "**Benefits:**\n- Type safety (IDE autocomplete, type checking)\n- Validation (age > 0, email contains @)\n- Clear errors (ValidationError if schema violated)\n- Self-documenting (schema is code, not comments)",
          },
        ],
      },
      {
        step: 4,
        title: "Handling parse failures",
        blocks: [
          {
            type: "text",
            content:
              "LLMs don't always return valid JSON. Handle failures gracefully:",
          },
          {
            type: "code",
            language: "python",
            label: "Error handling for parsers",
            code: `from langchain.output_parsers import PydanticOutputParser, OutputFixingParser
from pydantic import BaseModel, Field
import json

class Product(BaseModel):
    name: str
    price: float
    in_stock: bool

# Standard parser (will fail on malformed output)
standard_parser = PydanticOutputParser(pydantic_object=Product)

# Strategy 1: Try-catch with fallback
def parse_with_fallback(text: str):
    try:
        return standard_parser.parse(text)
    except Exception as e:
        print(f"Parse error: {e}")
        # Return default or retry
        return Product(name="Unknown", price=0.0, in_stock=False)

# Strategy 2: OutputFixingParser (LLM fixes its own output)
fixing_parser = OutputFixingParser.from_llm(
    parser=standard_parser,
    llm=ChatOpenAI(model="gpt-4o")
)

# Test with malformed JSON
malformed = '{"name": "Widget", "price": "19.99", in_stock: true}'
# Missing quotes around "price" value, missing quotes around key

try:
    standard_result = standard_parser.parse(malformed)
except Exception:
    print("Standard parser failed")

# But fixing parser succeeds!
fixed_result = fixing_parser.parse(malformed)
print(fixed_result)
# Product(name="Widget", price=19.99, in_stock=True)

# How it works:
# 1. Standard parser fails
# 2. OutputFixingParser sends error + original output to LLM
# 3. LLM fixes the JSON and returns corrected version
# 4. Parser tries again with fixed output`,
          },
          {
            type: "callout",
            kind: "warning",
            content:
              "OutputFixingParser adds an extra LLM call (cost + latency). Use for critical parsing. For high-volume, consider function calling instead (next section).",
          },
        ],
      },
      {
        step: 5,
        title: "Structured output vs output parsing",
        blocks: [
          {
            type: "text",
            content:
              "Modern LLMs support **structured output** natively (GPT-4o, Claude 3.5). This is more reliable than parsing:",
          },
          {
            type: "code",
            language: "python",
            label: "OpenAI structured output (native)",
            code: `from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()

class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]

# Use structured output (GPT-4o+)
completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {"role": "system", "content": "Extract calendar event info."},
        {"role": "user", "content": "Team meeting on Friday with Alice, Bob, and Charlie"}
    ],
    response_format=CalendarEvent
)

event = completion.choices[0].message.parsed
print(event.name)         # "Team meeting"
print(event.date)         # "Friday"
print(event.participants) # ["Alice", "Bob", "Charlie"]

# LangChain equivalent with native structured output
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-2024-08-06")

# Use with_structured_output (LangChain wrapper)
structured_llm = llm.with_structured_output(CalendarEvent)

result = structured_llm.invoke("Team meeting on Friday with Alice, Bob, and Charlie")
print(type(result))  # <class '__main__.CalendarEvent'>`,
          },
          {
            type: "kv",
            items: [
              { key: "Output parsing", value: "Parse text after generation. Works with any LLM. Can fail on malformed JSON. Requires format instructions in prompt." },
              { key: "Structured output", value: "Generate structured data directly. Only works with specific models (GPT-4o+, Claude 3.5+). Never fails (enforced by API). No format instructions needed." },
            ],
          },
          {
            type: "text",
            content:
              "**Use structured output when available** — it's more reliable. Fall back to output parsing for older models or fine-tuned models.",
          },
        ],
      },
      {
        step: 6,
        title: "Custom parsers",
        blocks: [
          {
            type: "text",
            content:
              "For custom formats, implement your own parser:",
          },
          {
            type: "code",
            language: "python",
            label: "Custom output parser",
            code: `from langchain.schema import BaseOutputParser

class KeyValueParser(BaseOutputParser[dict]):
    """Parse 'key: value' format into dictionary"""

    def parse(self, text: str) -> dict:
        """Parse LLM output"""
        result = {}
        for line in text.strip().split('\\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                result[key.strip()] = value.strip()
        return result

    @property
    def _type(self) -> str:
        return "key_value"

# Use it
parser = KeyValueParser()

llm_output = """
name: Alice Smith
role: Engineer
department: AI Research
years: 3
"""

parsed = parser.parse(llm_output)
print(parsed)
# {'name': 'Alice Smith', 'role': 'Engineer', 'department': 'AI Research', 'years': '3'}

# In a chain
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template(
    "Extract person info in 'key: value' format:\\n\\n{text}"
)

chain = prompt | ChatOpenAI() | KeyValueParser()

result = chain.invoke({"text": "John is a 25-year-old developer"})
print(result)  # {'name': 'John', 'age': '25', 'role': 'developer'}`,
          },
        ],
      },
      {
        step: 7,
        title: "Best practices",
        blocks: [
          {
            type: "list",
            items: [
              "**Use structured output for production** — more reliable than parsing",
              "**Add validation to Pydantic models** — catch bad data at the boundary",
              "**Handle parse failures** — LLMs will occasionally return malformed output",
              "**Keep schemas simple** — complex nested objects are harder to extract reliably",
              "**Test with edge cases** — missing fields, wrong types, unexpected formats",
              "**Log parse failures** — track failure rate, improve prompts if high",
            ],
          },
        ],
      },
      {
        step: 8,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "When should you use Pydantic output parsing instead of native structured output?",
            options: [
              "When using older LLM models that don't support native structured output (pre-GPT-4o, older fine-tuned models)",
              "Always — Pydantic parsing is more reliable",
              "Never — structured output is always better",
              "Only when you need validation",
            ],
            correct: 0,
            explanation:
              "Native structured output (GPT-4o+, Claude 3.5+) is more reliable because it's enforced by the API — you never get malformed JSON. Use Pydantic parsing when: (1) your model doesn't support structured output, (2) you're using a fine-tuned model, or (3) you need custom validation logic beyond what the API provides. Both approaches support Pydantic validation, but structured output is simpler and more reliable when available.",
          },
        ],
      },
    ],
  },
  {
    slug: "retrieval-and-rag",
    trackSlug: "langchain-langgraph",
    order: 4,
    minutes: 20,
    title: "Retrieval and RAG Patterns",
    subtitle: "Build RAG systems with LangChain — document loaders, text splitters, vector stores, retrievers, advanced patterns.",
    tags: ["RAG", "Retrieval", "Vector stores", "Document loading"],
    sections: [
      {
        step: 1,
        title: "The problem we're solving",
        blocks: [
          {
            type: "text",
            content:
              "LLMs have fixed knowledge cutoffs and limited context windows. They can't answer questions about:\n\n- **Your private data** — company docs, customer records, internal wikis\n- **Recent events** — news after the training cutoff\n- **Long documents** — 1000-page PDFs that exceed context limits\n- **Specialized domains** — medical records, legal contracts, technical specs\n\nThe problem: **How do you give LLMs access to external knowledge without fine-tuning?**\n\nThe answer is **RAG** (Retrieval-Augmented Generation): retrieve relevant context, augment the prompt, generate answer.",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "RAG is to LLMs what Google Search is to humans. You don't memorize the internet — you retrieve what you need when you need it. LLMs + RAG = knowledge on demand.",
          },
        ],
      },
      {
        step: 2,
        title: "Document loaders: ingesting data",
        blocks: [
          {
            type: "text",
            content:
              "LangChain has 100+ document loaders. Load from any source:",
          },
          {
            type: "code",
            language: "python",
            label: "Document loaders for different sources",
            code: `from langchain_community.document_loaders import (
    TextLoader,
    PDFLoader,
    CSVLoader,
    UnstructuredHTMLLoader,
    NotionDirectoryLoader,
    GoogleDriveLoader,
    WebBaseLoader,
    DirectoryLoader
)

# 1. Single text file
loader = TextLoader("company_policy.txt")
docs = loader.load()

# 2. PDF
from langchain_community.document_loaders import PyPDFLoader
loader = PyPDFLoader("report.pdf")
docs = loader.load()  # One Document per page

# 3. Directory of files (recursive)
loader = DirectoryLoader(
    "docs/",
    glob="**/*.md",  # All markdown files
    loader_cls=TextLoader
)
docs = loader.load()

# 4. CSV
loader = CSVLoader("customers.csv")
docs = loader.load()  # One Document per row

# 5. Web page
loader = WebBaseLoader("https://example.com/article")
docs = loader.load()

# 6. Multiple URLs
loader = WebBaseLoader([
    "https://blog.com/post1",
    "https://blog.com/post2",
])
docs = loader.load()

# Each loader returns list of Document objects
print(docs[0].page_content)  # The text
print(docs[0].metadata)      # Source, page number, etc.`,
          },
          {
            type: "text",
            content:
              "**Document structure:**\n```python\nclass Document:\n    page_content: str  # The actual text\n    metadata: dict     # Source, page, author, date, etc.\n```\n\nMetadata is critical for filtering, source attribution, and debugging.",
          },
        ],
      },
      {
        step: 3,
        title: "Text splitters: chunking for retrieval",
        blocks: [
          {
            type: "text",
            content:
              "Documents are too long to embed whole. Split into chunks:",
          },
          {
            type: "code",
            language: "python",
            label: "Text splitting strategies",
            code: `from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    CharacterTextSplitter,
    TokenTextSplitter
)

# 1. RecursiveCharacterTextSplitter (recommended)
# Tries to split on paragraphs, then sentences, then words
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,        # Target chunk size
    chunk_overlap=50,      # Overlap between chunks (preserves context)
    separators=["\\n\\n", "\\n", ". ", " ", ""]  # Try in order
)

# Load and split
from langchain_community.document_loaders import TextLoader
docs = TextLoader("long_document.txt").load()
chunks = splitter.split_documents(docs)

print(f"Split {len(docs)} documents into {len(chunks)} chunks")
print(f"First chunk: {chunks[0].page_content[:100]}...")

# 2. Token-based splitting (for LLM context limits)
token_splitter = TokenTextSplitter(
    chunk_size=100,  # 100 tokens per chunk
    chunk_overlap=10
)

# 3. Semantic splitting (experimental)
# from langchain_experimental.text_splitter import SemanticChunker
# Splits based on semantic similarity (keeps related content together)

# Best practices for chunk_size:
# - 200-500 chars: Good for Q&A, specific facts
# - 500-1000 chars: Balanced (most common)
# - 1000-2000 chars: Longer context, better for summaries

# Best practices for chunk_overlap:
# - 10-20%: Preserves context across chunk boundaries
# - 0%: No overlap, but may split sentences awkwardly
# - 50%+: Redundant, wastes embedding cost`,
          },
          {
            type: "callout",
            kind: "tip",
            content:
              "Start with chunk_size=500, chunk_overlap=50. Tune based on your use case: smaller chunks for precise facts, larger chunks for context-heavy questions.",
          },
        ],
      },
      {
        step: 4,
        title: "Vector stores: storing embeddings",
        blocks: [
          {
            type: "text",
            content:
              "LangChain supports 50+ vector databases with a unified interface:",
          },
          {
            type: "code",
            language: "python",
            label: "Vector store examples",
            code: `from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma, FAISS, Pinecone

embeddings = OpenAIEmbeddings()

# 1. Chroma (local, persistent)
from langchain_community.vectorstores import Chroma

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"  # Persists to disk
)

# 2. FAISS (in-memory, fast)
from langchain_community.vectorstores import FAISS

vectorstore = FAISS.from_documents(
    documents=chunks,
    embedding=embeddings
)

# Save/load FAISS
vectorstore.save_local("faiss_index")
vectorstore = FAISS.load_local("faiss_index", embeddings)

# 3. Pinecone (cloud, production-scale)
import pinecone
from langchain_community.vectorstores import Pinecone

# Initialize Pinecone
pinecone.init(api_key="your-key", environment="us-west1-gcp")

vectorstore = Pinecone.from_documents(
    documents=chunks,
    embedding=embeddings,
    index_name="my-index"
)

# All vector stores have the same interface:
results = vectorstore.similarity_search("What is our refund policy?", k=3)
for doc in results:
    print(doc.page_content)
    print(doc.metadata)
    print("---")`,
          },
          {
            type: "kv",
            items: [
              { key: "Chroma", value: "Local, persistent, easy setup. Great for development and small projects." },
              { key: "FAISS", value: "In-memory, very fast. Good for demos, experiments, or when data fits in RAM." },
              { key: "Pinecone", value: "Cloud-hosted, scalable, managed. Use in production for millions of documents." },
              { key: "Qdrant", value: "Self-hosted or cloud. Good middle ground: production-ready, you control infrastructure." },
            ],
          },
        ],
      },
      {
        step: 5,
        title: "Retrievers: similarity search and beyond",
        blocks: [
          {
            type: "text",
            content:
              "A retriever is a wrapper around a vector store. It has additional search strategies:",
          },
          {
            type: "code",
            language: "python",
            label: "Retriever types",
            code: `from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

vectorstore = Chroma.from_documents(chunks, OpenAIEmbeddings())

# 1. Basic similarity retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# Usage
docs = retriever.get_relevant_documents("What is Python?")

# 2. MMR (Maximum Marginal Relevance) - diversity
# Returns relevant AND diverse results (avoids redundant chunks)
mmr_retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 5, "fetch_k": 20}  # Fetch 20, return 5 diverse
)

# 3. Similarity with score threshold
threshold_retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"score_threshold": 0.7, "k": 5}  # Only return if score > 0.7
)

# 4. Contextual compression (advanced)
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# Retrieve chunks, then compress to only relevant sentences
compressor = LLMChainExtractor.from_llm(llm)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=retriever
)

# Returns only the sentences relevant to query, not full chunks
compressed_docs = compression_retriever.get_relevant_documents(
    "What is our return policy?"
)`,
          },
        ],
      },
      {
        step: 6,
        title: "Building a complete RAG chain",
        blocks: [
          {
            type: "text",
            content:
              "Combine everything into a RAG pipeline:",
          },
          {
            type: "code",
            language: "python",
            label: "Production RAG chain",
            code: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser

# 1. Load documents
loader = DirectoryLoader("docs/", glob="**/*.md")
documents = loader.load()
print(f"Loaded {len(documents)} documents")

# 2. Split into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(documents)
print(f"Created {len(chunks)} chunks")

# 3. Embed and store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 4. Create retriever
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 3}
)

# 5. Build RAG chain
llm = ChatOpenAI(model="gpt-4o", temperature=0)

prompt = ChatPromptTemplate.from_template("""Answer the question based only on this context:

{context}

Question: {question}

Answer:""")

def format_docs(docs):
    return "\\n\\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 6. Query
answer = rag_chain.invoke("What is our refund policy?")
print(answer)`,
          },
          {
            type: "text",
            content:
              "**What happens:**\n1. Query goes to retriever\n2. Retriever searches vector store, returns top-k chunks\n3. Chunks formatted as context\n4. Context + question inserted into prompt\n5. LLM generates answer grounded in context\n6. Parser extracts string\n\nThis is production-ready RAG in ~40 lines.",
          },
        ],
      },
      {
        step: 7,
        title: "Advanced RAG: hybrid retrieval",
        blocks: [
          {
            type: "text",
            content:
              "Semantic search misses exact keyword matches. Hybrid retrieval combines both:",
          },
          {
            type: "code",
            language: "python",
            label: "Hybrid retrieval (semantic + keyword)",
            code: `from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

# 1. Semantic retriever (vector search)
semantic_retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# 2. Keyword retriever (BM25)
bm25_retriever = BM25Retriever.from_documents(chunks)
bm25_retriever.k = 5

# 3. Ensemble retriever (combines both)
ensemble_retriever = EnsembleRetriever(
    retrievers=[semantic_retriever, bm25_retriever],
    weights=[0.5, 0.5]  # Equal weight to both
)

# Use in RAG chain
hybrid_rag_chain = (
    {"context": ensemble_retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# Test query with specific product codes
answer = hybrid_rag_chain.invoke("What is product SKU-12345?")
# Semantic search might miss exact SKU, but keyword search finds it`,
          },
          {
            type: "text",
            content:
              "**When to use hybrid:**\n- Technical docs with specific codes, IDs, abbreviations\n- Legal contracts with exact clause numbers\n- Medical records with drug names, dosages\n- Any domain where exact matches matter",
          },
        ],
      },
      {
        step: 8,
        title: "Metadata filtering",
        blocks: [
          {
            type: "text",
            content:
              "Filter retrieval by metadata (date, author, category):",
          },
          {
            type: "code",
            language: "python",
            label: "Metadata filtering",
            code: `from datetime import datetime, timedelta

# Add metadata when loading
from langchain_community.document_loaders import DirectoryLoader

loader = DirectoryLoader(
    "docs/",
    glob="**/*.md",
    loader_kwargs={
        "metadata": {
            "source": "company_docs",
            "department": "engineering",
            "date": "2024-01-15"
        }
    }
)

# Or add metadata after loading
for doc in chunks:
    doc.metadata["date"] = "2024-01-15"
    doc.metadata["category"] = "policy"

# Create vector store with metadata
vectorstore = Chroma.from_documents(chunks, embeddings)

# Filter by metadata
recent_cutoff = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")

retriever = vectorstore.as_retriever(
    search_kwargs={
        "k": 5,
        "filter": {
            "date": {"$gte": recent_cutoff}  # Only docs from last 30 days
        }
    }
)

# Or multiple filters
retriever = vectorstore.as_retriever(
    search_kwargs={
        "k": 5,
        "filter": {
            "category": "policy",
            "department": "engineering"
        }
    }
)`,
          },
        ],
      },
      {
        step: 9,
        title: "Source attribution",
        blocks: [
          {
            type: "text",
            content:
              "Production RAG needs source citations. Show users where answers came from:",
          },
          {
            type: "code",
            language: "python",
            label: "RAG with source citations",
            code: `from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser

def rag_with_sources(question: str):
    # 1. Retrieve
    docs = retriever.get_relevant_documents(question)

    # 2. Format context with source markers
    context_parts = []
    for i, doc in enumerate(docs):
        source = doc.metadata.get('source', 'Unknown')
        context_parts.append(f"[Source {i+1}: {source}]\\n{doc.page_content}")

    context = "\\n\\n".join(context_parts)

    # 3. Generate answer
    prompt = ChatPromptTemplate.from_template("""Answer based on this context.
Cite sources using [Source N] notation.

{context}

Question: {question}

Answer:""")

    chain = prompt | ChatOpenAI(model="gpt-4o") | StrOutputParser()
    answer = chain.invoke({"context": context, "question": question})

    # 4. Return answer + sources
    sources = [
        {
            "content": doc.page_content[:200] + "...",
            "source": doc.metadata.get('source'),
            "page": doc.metadata.get('page')
        }
        for doc in docs
    ]

    return {"answer": answer, "sources": sources}

# Use it
result = rag_with_sources("What is our refund policy?")
print(result["answer"])
print("\\nSources:")
for src in result["sources"]:
    print(f"- {src['source']} (page {src['page']})")`,
          },
        ],
      },
      {
        step: 10,
        title: "Measuring retrieval quality",
        blocks: [
          {
            type: "text",
            content:
              "How do you know if retrieval is working?",
          },
          {
            type: "code",
            language: "python",
            label: "Evaluate retrieval quality",
            code: `def evaluate_retrieval(test_cases, retriever, k=3):
    """Measure retrieval precision and recall"""
    results = []

    for question, expected_doc_ids in test_cases:
        # Retrieve
        retrieved = retriever.get_relevant_documents(question)
        retrieved_ids = [doc.metadata.get('id') for doc in retrieved[:k]]

        # Precision: what fraction of retrieved docs are relevant?
        relevant_retrieved = set(retrieved_ids) & set(expected_doc_ids)
        precision = len(relevant_retrieved) / k if k > 0 else 0

        # Recall: what fraction of relevant docs were retrieved?
        recall = len(relevant_retrieved) / len(expected_doc_ids) if expected_doc_ids else 0

        results.append({
            "question": question,
            "precision": precision,
            "recall": recall
        })

    # Aggregate
    avg_precision = sum(r["precision"] for r in results) / len(results)
    avg_recall = sum(r["recall"] for r in results) / len(results)

    print(f"Precision@{k}: {avg_precision:.2%}")
    print(f"Recall@{k}: {avg_recall:.2%}")

    return results

# Test set
test_cases = [
    ("What is our refund policy?", ["doc_42", "doc_87"]),
    ("How do I reset my password?", ["doc_15"]),
    # ... more test cases
]

evaluate_retrieval(test_cases, retriever, k=3)`,
          },
          {
            type: "text",
            content:
              "**Metrics:**\n- **Precision@k** — are retrieved docs relevant?\n- **Recall@k** — did we retrieve all relevant docs?\n- **MRR** (Mean Reciprocal Rank) — how high is the first relevant doc?\n- **End-to-end** — ask humans 'was the answer good?'",
          },
        ],
      },
      {
        step: 11,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why use chunk overlap in text splitting?",
            options: [
              "It preserves context across chunk boundaries, preventing information loss when a key fact spans two chunks",
              "It makes chunks larger, improving retrieval accuracy",
              "It reduces the number of embeddings needed",
              "It's required by vector databases",
            ],
            correct: 0,
            explanation:
              "Chunk overlap (typically 10-20% of chunk_size) ensures that important information at chunk boundaries isn't lost. Without overlap, a sentence or paragraph split across two chunks might lose context. With 50-token overlap, the end of chunk N overlaps with the start of chunk N+1, so key facts remain intact in at least one chunk. The trade-off is slightly more embeddings (cost), but the retrieval quality improvement is usually worth it.",
          },
        ],
      },
    ],
  },
  {
    slug: "memory-and-state",
    trackSlug: "langchain-langgraph",
    order: 5,
    minutes: 16,
    title: "Memory and State Management",
    subtitle: "Manage conversation history, summarization, entity memory, and long-term context.",
    tags: ["Memory", "State", "Conversation", "Context"],
    sections: [
      {
        step: 1,
        title: "The problem we're solving",
        blocks: [
          {
            type: "text",
            content:
              "LangChain chains are stateless by default. Each invocation is independent:\n\n```python\nchain.invoke('My name is Alice')  # LLM: 'Nice to meet you!'\nchain.invoke('What is my name?')  # LLM: 'I don't know' ❌\n```\n\nThe problem: **How do you maintain conversation context across multiple turns?**\n\nThe solution is **memory** — store conversation history and inject it into each prompt.",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "Memory turns stateless chains into stateful conversations. Every chatbot, assistant, and agent needs memory to be useful.",
          },
        ],
      },
      {
        step: 2,
        title: "Conversation buffer memory",
        blocks: [
          {
            type: "text",
            content:
              "The simplest memory: store full conversation history:",
          },
          {
            type: "code",
            language: "python",
            label: "Basic conversation memory",
            code: `from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain.schema.runnable import RunnablePassthrough

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 1. Create memory
memory = ConversationBufferMemory(
    return_messages=True,  # Return as Message objects, not strings
    memory_key="history"   # Key for accessing history in prompt
)

# 2. Prompt with history placeholder
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder(variable_name="history"),  # Conversation history
    ("user", "{input}")
])

# 3. Conversational function
def chat(user_input: str) -> str:
    # Load conversation history
    history = memory.load_memory_variables({})["history"]

    # Build and invoke chain
    messages = prompt.format_messages(input=user_input, history=history)
    response = llm.invoke(messages)

    # Save to memory
    memory.save_context(
        {"input": user_input},
        {"output": response.content}
    )

    return response.content

# Test multi-turn conversation
print(chat("My name is Alice"))
# "Nice to meet you, Alice!"

print(chat("What's my name?"))
# "Your name is Alice."

print(chat("What did we just talk about?"))
# "We talked about your name, which is Alice."

# Inspect memory
print(memory.load_memory_variables({}))
# {'history': [HumanMessage(content='My name is Alice'), ...]}`,
          },
        ],
      },
      {
        step: 3,
        title: "Memory types: buffer, window, summary",
        blocks: [
          {
            type: "text",
            content:
              "Different memory strategies for different needs:",
          },
          {
            type: "code",
            language: "python",
            label: "Memory type comparison",
            code: `from langchain.memory import (
    ConversationBufferMemory,
    ConversationBufferWindowMemory,
    ConversationSummaryMemory,
    ConversationSummaryBufferMemory
)
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")

# 1. Buffer Memory (stores everything)
buffer_memory = ConversationBufferMemory(return_messages=True)
# Pros: Full context, no information loss
# Cons: Unbounded growth, will overflow context window

# 2. Window Memory (keeps last N turns)
window_memory = ConversationBufferWindowMemory(
    k=5,  # Keep last 5 message pairs
    return_messages=True
)
# Pros: Bounded size, recent context preserved
# Cons: Forgets old conversation

# 3. Summary Memory (summarizes old messages)
summary_memory = ConversationSummaryMemory(
    llm=llm,
    return_messages=True
)
# Pros: Compresses old context, scales to long conversations
# Cons: Loses details, extra LLM call for summarization

# 4. Summary Buffer (hybrid: recent messages + summary of old)
summary_buffer_memory = ConversationSummaryBufferMemory(
    llm=llm,
    max_token_limit=500,  # When to start summarizing
    return_messages=True
)
# Pros: Best of both (recent details + old summary)
# Cons: Complex, requires careful tuning

# Compare memory sizes after 10 turns
for i in range(10):
    buffer_memory.save_context({"input": f"Message {i}"}, {"output": f"Response {i}"})
    window_memory.save_context({"input": f"Message {i}"}, {"output": f"Response {i}"})
    summary_memory.save_context({"input": f"Message {i}"}, {"output": f"Response {i}"})

print("Buffer messages:", len(buffer_memory.load_memory_variables({})["history"]))
# 20 (10 user + 10 assistant)

print("Window messages:", len(window_memory.load_memory_variables({})["history"]))
# 10 (last 5 pairs)

print("Summary:", summary_memory.load_memory_variables({})["history"][0])
# Summary of messages 1-8, plus message 9-10 in full`,
          },
        ],
      },
      {
        step: 4,
        title: "Token-based memory",
        blocks: [
          {
            type: "text",
            content:
              "Manage memory by token count (more precise than message count):",
          },
          {
            type: "code",
            language: "python",
            label: "Token-aware memory",
            code: `from langchain.memory import ConversationTokenBufferMemory
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")

# Keep conversation under 500 tokens
token_memory = ConversationTokenBufferMemory(
    llm=llm,
    max_token_limit=500,
    return_messages=True
)

# Use same as buffer memory
for i in range(20):
    user_msg = f"This is message number {i}. " * 10  # ~100 tokens each
    assistant_msg = f"Response {i}."

    token_memory.save_context(
        {"input": user_msg},
        {"output": assistant_msg}
    )

# Check token count
history = token_memory.load_memory_variables({})["history"]
total_tokens = sum(len(m.content.split()) * 1.3 for m in history)  # Rough estimate
print(f"History has ~{int(total_tokens)} tokens")
# Will be close to 500 (oldest messages dropped)`,
          },
          {
            type: "text",
            content:
              "**Use token memory when:**\n- You have strict context limits (e.g., GPT-3.5 with 4k context)\n- Cost matters (fewer tokens = cheaper)\n- You know the exact token budget per turn",
          },
        ],
      },
      {
        step: 5,
        title: "Entity memory: tracking facts",
        blocks: [
          {
            type: "text",
            content:
              "Entity memory tracks facts about specific entities (people, places, products):",
          },
          {
            type: "code",
            language: "python",
            label: "Entity memory",
            code: `from langchain.memory import ConversationEntityMemory
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")

entity_memory = ConversationEntityMemory(
    llm=llm,
    return_messages=True
)

# Conversation with multiple entities
conversations = [
    ("Alice prefers window seats on flights", "I've noted Alice's preference."),
    ("Bob is allergic to peanuts", "I'll remember Bob's allergy."),
    ("Alice's meeting is every Tuesday at 2pm", "Got it, Alice has recurring meetings."),
    ("What do you know about Alice?", "Alice prefers window seats and has meetings on Tuesdays at 2pm.")
]

for user, assistant in conversations:
    entity_memory.save_context({"input": user}, {"output": assistant})

# Entity memory extracts and stores facts
entities = entity_memory.entity_store.store
print("Tracked entities:", entities.keys())  # ['Alice', 'Bob']
print("Alice facts:", entities['Alice'])
# "Prefers window seats. Has meetings every Tuesday at 2pm."`,
          },
          {
            type: "text",
            content:
              "**Use cases:**\n- Customer support (track customer preferences, past issues)\n- Personal assistants (remember user's schedule, contacts, preferences)\n- Multi-entity conversations (track facts about multiple people/products)",
          },
        ],
      },
      {
        step: 6,
        title: "Memory with RAG",
        blocks: [
          {
            type: "text",
            content:
              "Combine conversation memory with document retrieval:",
          },
          {
            type: "code",
            language: "python",
            label: "Conversational RAG with memory",
            code: `from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser

# Setup (from previous lesson)
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

llm = ChatOpenAI(model="gpt-4o", temperature=0)
memory = ConversationBufferWindowMemory(
    k=5,  # Keep last 5 turns
    return_messages=True,
    memory_key="history"
)

# Prompt with both retrieval context AND conversation history
prompt = ChatPromptTemplate.from_messages([
    ("system", """Answer based on this context:

{context}

Use the conversation history to understand follow-up questions."""),
    MessagesPlaceholder(variable_name="history"),
    ("user", "{question}")
])

def format_docs(docs):
    return "\\n\\n".join(doc.page_content for doc in docs)

def conversational_rag(question: str) -> str:
    # Load memory
    history = memory.load_memory_variables({})["history"]

    # Retrieve context
    context_docs = retriever.get_relevant_documents(question)
    context = format_docs(context_docs)

    # Generate answer
    messages = prompt.format_messages(
        context=context,
        history=history,
        question=question
    )
    response = llm.invoke(messages)

    # Save to memory
    memory.save_context(
        {"question": question},
        {"output": response.content}
    )

    return response.content

# Test conversational RAG
print(conversational_rag("What is our refund policy?"))
# Retrieves policy doc, answers

print(conversational_rag("What about for international orders?"))
# Uses memory: understands "for international orders" refers to refund policy`,
          },
        ],
      },
      {
        step: 7,
        title: "Custom memory backends",
        blocks: [
          {
            type: "text",
            content:
              "Store memory in external databases for persistence:",
          },
          {
            type: "code",
            language: "python",
            label: "Memory with Redis backend",
            code: `from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_message_histories import RedisChatMessageHistory

# Redis backend (persists across sessions)
message_history = RedisChatMessageHistory(
    url="redis://localhost:6379",
    session_id="user_123"  # Unique per user
)

memory = ConversationBufferMemory(
    chat_memory=message_history,
    return_messages=True
)

# Now memory survives server restarts
# User can close browser, come back tomorrow, and continue conversation

# Other backends:
# - PostgresChatMessageHistory (SQL database)
# - DynamoDBChatMessageHistory (AWS DynamoDB)
# - FileChatMessageHistory (local files)
# - Custom: implement BaseChatMessageHistory`,
          },
        ],
      },
      {
        step: 8,
        title: "Memory in production",
        blocks: [
          {
            type: "text",
            content:
              "Production considerations for memory:",
          },
          {
            type: "kv",
            items: [
              { key: "Per-user isolation", value: "Each user's memory is separate. Use session_id or user_id as key." },
              { key: "Expiration", value: "Set TTL on memories. Delete after 30 days of inactivity to comply with privacy laws." },
              { key: "Privacy", value: "Never store PII in plaintext. Encrypt sensitive memories." },
              { key: "Cost", value: "Conversation history adds tokens. Monitor token usage per session." },
              { key: "Context limits", value: "Even with summary, very long conversations overflow. Reset after N turns." },
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Production memory with expiration",
            code: `import redis
from datetime import timedelta

# Redis with TTL
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

def save_conversation(user_id: str, messages: list):
    """Save with 30-day expiration"""
    key = f"chat_history:{user_id}"
    r.setex(
        name=key,
        time=timedelta(days=30),  # Auto-delete after 30 days
        value=json.dumps(messages)
    )

def load_conversation(user_id: str) -> list:
    """Load conversation (returns [] if expired)"""
    key = f"chat_history:{user_id}"
    data = r.get(key)
    return json.loads(data) if data else []`,
          },
        ],
      },
      {
        step: 9,
        title: "Choosing the right memory type",
        blocks: [
          {
            type: "diagram",
            label: "Memory type decision tree",
            chart: `graph TD
    A[Need memory?] -->|Yes| B{Conversation length?}
    A -->|No| Z[No memory]

    B -->|Short < 10 turns| C[ConversationBufferMemory]
    B -->|Medium 10-50 turns| D[ConversationBufferWindowMemory]
    B -->|Long 50+ turns| E[ConversationSummaryBufferMemory]

    D --> F{Track entities?}
    E --> F

    F -->|Yes| G[Add ConversationEntityMemory]
    F -->|No| H{Need persistence?}

    H -->|Yes| I[Use Redis/SQL backend]
    H -->|No| J[In-memory is fine]

    style A fill:#e1f5ff
    style C fill:#d4edda
    style D fill:#fff3cd
    style E fill:#f8d7da`,
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "When should you use ConversationSummaryBufferMemory instead of ConversationBufferMemory?",
            options: [
              "For long conversations (50+ turns) where you need both recent details and compressed old context without overflow",
              "Always — summary is more efficient",
              "Never — buffer memory is simpler",
              "Only when using Redis backend",
            ],
            correct: 0,
            explanation:
              "ConversationSummaryBufferMemory is ideal for long conversations because it keeps recent messages in full (preserves details for immediate context) while summarizing older messages (saves tokens, prevents overflow). Simple ConversationBufferMemory works for short conversations but will overflow context on long ones. ConversationSummaryMemory alone loses too many details. The hybrid approach (summary buffer) gives you the best of both: detailed recent context + compressed old context.",
          },
        ],
      },
    ],
  },
  {
    slug: "agents-and-tools",
    trackSlug: "langchain-langgraph",
    order: 6,
    minutes: 18,
    title: "Agents and Tool Integration",
    subtitle: "Build LangChain agents — tool creation, agent types, custom tools, error handling.",
    tags: ["Agents", "Tools", "ReAct", "Integration"],
    sections: [
      {
        step: 1,
        title: "The problem we're solving",
        blocks: [
          {
            type: "text",
            content:
              "Chains execute fixed sequences. But real tasks require **dynamic decision-making**:\n\n- **Multi-step reasoning** — 'What's 15% of Tokyo's population?' needs search → calculator\n- **Tool selection** — which tool to use for which task?\n- **Error recovery** — if tool fails, try different approach\n- **Unknown paths** — can't predict steps upfront\n\nThe problem: **How do you build LLM systems that decide what to do next based on results?**\n\nThe answer is **agents** — LLMs that reason about tool use and execute iteratively.",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "Agents = LLM + Tools + Loop. The LLM decides which tool to call, you execute it, the LLM sees the result and decides what's next. This is the ReAct pattern implemented in LangChain.",
          },
        ],
      },
      {
        step: 2,
        title: "Creating tools from functions",
        blocks: [
          {
            type: "text",
            content:
              "Any Python function can become a tool:",
          },
          {
            type: "code",
            language: "python",
            label: "Tool creation basics",
            code: `from langchain.agents import Tool
from langchain.tools import tool

# Method 1: Tool class (explicit)
def search_web(query: str) -> str:
    """Search the web for information"""
    # In production: call Google/Bing API
    return f"Search results for: {query}"

search_tool = Tool(
    name="Search",
    func=search_web,
    description="Search the web for current information. Use when you need facts, news, or real-time data."
)

# Method 2: @tool decorator (recommended)
@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression like '15 * 20 / 3'"""
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except Exception as e:
        return f"Error: {e}"

# Method 3: Tool with structured input (Pydantic)
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: str = Field(description="The search query")
    num_results: int = Field(default=5, description="Number of results")

@tool(args_schema=SearchInput)
def advanced_search(query: str, num_results: int = 5) -> str:
    """Search with configurable result count"""
    return f"Top {num_results} results for: {query}"

# Tool attributes
print(search_tool.name)         # "Search"
print(search_tool.description)  # "Search the web..."
print(search_tool.func("Python"))  # "Search results for: Python"`,
          },
          {
            type: "text",
            content:
              "**Tool description is critical** — the LLM uses it to decide when to call the tool. Be specific: 'Search for current information' is better than 'Search'.",
          },
        ],
      },
      {
        step: 3,
        title: "Agent types: ReAct, OpenAI Functions, Conversational",
        blocks: [
          {
            type: "text",
            content:
              "LangChain provides several agent types:",
          },
          {
            type: "code",
            language: "python",
            label: "Different agent types",
            code: `from langchain.agents import initialize_agent, AgentType, Tool
from langchain_openai import ChatOpenAI
from langchain.tools import DuckDuckGoSearchRun

# Define tools
search = DuckDuckGoSearchRun()
tools = [
    Tool(
        name="Search",
        func=search.run,
        description="Search for current information"
    ),
    calculator  # from previous example
]

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 1. OpenAI Functions Agent (recommended for GPT-4)
# Uses OpenAI's native function calling
functions_agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True  # Show reasoning trace
)

# 2. ReAct Agent (works with any LLM)
# Uses text-based reasoning (Thought/Action/Observation)
react_agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# 3. Conversational Agent (with memory)
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

conversational_agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

# Use agent
result = functions_agent.run("What's 15% of 200, and what's the capital of France?")
print(result)`,
          },
          {
            type: "kv",
            items: [
              { key: "OpenAI Functions", value: "Uses native tool calling. Most reliable. Only works with GPT-3.5+, GPT-4." },
              { key: "ReAct", value: "Text-based reasoning. Works with any LLM (Claude, Llama, etc). Slightly less reliable." },
              { key: "Conversational", value: "Adds memory to ReAct. Use for multi-turn agent conversations." },
            ],
          },
        ],
      },
      {
        step: 4,
        title: "Building a complete agent",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Research agent with multiple tools",
            code: `from langchain.agents import initialize_agent, AgentType, Tool
from langchain_openai import ChatOpenAI
from langchain.tools import DuckDuckGoSearchRun, WikipediaQueryRun
from langchain.utilities import WikipediaAPIWrapper

# Tool 1: Web search
search = DuckDuckGoSearchRun()

# Tool 2: Wikipedia
wikipedia = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())

# Tool 3: Calculator
@tool
def calculator(expression: str) -> str:
    """Evaluate math expressions"""
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except:
        return "Invalid expression"

# Tool 4: File reader
@tool
def read_file(filepath: str) -> str:
    """Read contents of a text file"""
    try:
        with open(filepath, 'r') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {e}"

# Tool 5: URL scraper
@tool
def scrape_url(url: str) -> str:
    """Scrape text content from a URL"""
    import requests
    from bs4 import BeautifulSoup

    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        # Extract main text
        paragraphs = soup.find_all('p')
        return '\\n'.join(p.get_text() for p in paragraphs[:5])
    except Exception as e:
        return f"Error scraping: {e}"

# Assemble agent
tools = [
    Tool(name="Search", func=search.run, description="Search web for current info"),
    Tool(name="Wikipedia", func=wikipedia.run, description="Get Wikipedia articles"),
    calculator,
    read_file,
    scrape_url
]

llm = ChatOpenAI(model="gpt-4o", temperature=0)

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True,
    max_iterations=10,  # Prevent infinite loops
    handle_parsing_errors=True  # Auto-retry on format errors
)

# Test multi-step task
result = agent.run("""
Research the top 3 programming languages in 2024.
For each language, find its creator and year created.
Calculate the average age of these languages.
""")

print(result)`,
          },
        ],
      },
      {
        step: 5,
        title: "Agent execution trace",
        blocks: [
          {
            type: "text",
            content:
              "With `verbose=True`, you see the agent's reasoning:",
          },
          {
            type: "code",
            language: "text",
            label: "Example agent trace",
            code: `> Entering new AgentExecutor chain...

Thought: I need to find current information about top programming languages
Action: Search
Action Input: "top programming languages 2024"
Observation: Python, JavaScript, and Java are the top 3 languages...

Thought: Now I need to find creators and years for each language
Action: Wikipedia
Action Input: "Python programming language"
Observation: Python was created by Guido van Rossum in 1991...

Action: Wikipedia
Action Input: "JavaScript"
Observation: JavaScript was created by Brendan Eich in 1995...

Action: Wikipedia
Action Input: "Java programming language"
Observation: Java was created by James Gosling in 1995...

Thought: Now I need to calculate the average age
Action: Calculator
Action Input: "(2024-1991 + 2024-1995 + 2024-1995) / 3"
Observation: 29.33

Thought: I have all the information needed
Final Answer: The top 3 programming languages in 2024 are Python (created by Guido van Rossum in 1991), JavaScript (Brendan Eich, 1995), and Java (James Gosling, 1995). The average age of these languages is approximately 29 years.

> Finished chain.`,
          },
        ],
      },
      {
        step: 6,
        title: "Error handling in agents",
        blocks: [
          {
            type: "text",
            content:
              "Agents need robust error handling:",
          },
          {
            type: "code",
            language: "python",
            label: "Agent error handling",
            code: `from langchain.agents import initialize_agent, AgentType
from langchain_openai import ChatOpenAI

# 1. Handle tool errors gracefully
@tool
def risky_tool(input: str) -> str:
    """A tool that might fail"""
    try:
        # Risky operation
        result = perform_operation(input)
        return result
    except Exception as e:
        # Return error message, not crash
        return f"Tool failed: {str(e)}. Try a different approach."

# 2. Set max iterations (prevent infinite loops)
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    max_iterations=10,  # Stop after 10 steps
    early_stopping_method="generate"  # Return partial result if max reached
)

# 3. Handle parsing errors automatically
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    handle_parsing_errors=True  # LLM retries on malformed tool calls
)

# 4. Catch agent failures
from langchain.schema import OutputParserException

try:
    result = agent.run("Complex query...")
except OutputParserException as e:
    print(f"Agent failed to parse output: {e}")
    # Fallback logic
except Exception as e:
    print(f"Agent error: {e}")
    # Log and alert`,
          },
        ],
      },
      {
        step: 7,
        title: "Toolkits: pre-built tool collections",
        blocks: [
          {
            type: "text",
            content:
              "LangChain provides toolkits for common tasks:",
          },
          {
            type: "code",
            language: "python",
            label: "Using toolkits",
            code: `from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain_openai import ChatOpenAI

# 1. SQL Toolkit
db = SQLDatabase.from_uri("sqlite:///company.db")
toolkit = SQLDatabaseToolkit(db=db, llm=ChatOpenAI())

sql_agent = create_sql_agent(
    llm=ChatOpenAI(model="gpt-4o"),
    toolkit=toolkit,
    verbose=True
)

# Agent can now query database in natural language
result = sql_agent.run("How many customers do we have in California?")

# 2. Pandas Toolkit (analyze dataframes)
from langchain.agents.agent_toolkits import create_pandas_dataframe_agent
import pandas as pd

df = pd.read_csv("sales_data.csv")

pandas_agent = create_pandas_dataframe_agent(
    ChatOpenAI(model="gpt-4o"),
    df,
    verbose=True
)

result = pandas_agent.run("What are the top 5 products by revenue?")

# 3. Zapier Toolkit (connect to 5000+ apps)
# from langchain.agents.agent_toolkits import ZapierToolkit
# from langchain.utilities.zapier import ZapierNLAWrapper

# zapier = ZapierNLAWrapper()
# toolkit = ZapierToolkit.from_zapier_nla_wrapper(zapier)`,
          },
        ],
      },
      {
        step: 8,
        title: "Custom tools with state",
        blocks: [
          {
            type: "text",
            content:
              "Tools can maintain state across calls:",
          },
          {
            type: "code",
            language: "python",
            label: "Stateful tool",
            code: `from langchain.tools import BaseTool
from typing import Optional
from pydantic import BaseModel

class MemoryToolInput(BaseModel):
    operation: str  # "store" or "recall"
    key: str
    value: Optional[str] = None

class MemoryTool(BaseTool):
    name = "memory"
    description = "Store and recall information. Operations: 'store' or 'recall'"
    args_schema = MemoryToolInput

    # State persists across invocations
    memory: dict = {}

    def _run(self, operation: str, key: str, value: Optional[str] = None) -> str:
        """Execute the tool"""
        if operation == "store":
            if value is None:
                return "Error: value required for store operation"
            self.memory[key] = value
            return f"Stored '{value}' under key '{key}'"

        elif operation == "recall":
            if key in self.memory:
                return f"Retrieved: {self.memory[key]}"
            else:
                return f"No value found for key '{key}'"

        else:
            return "Error: operation must be 'store' or 'recall'"

    async def _arun(self, *args, **kwargs):
        """Async version"""
        return self._run(*args, **kwargs)

# Use stateful tool
memory_tool = MemoryTool()
tools = [memory_tool, calculator, search]

agent = initialize_agent(tools, llm, agent=AgentType.OPENAI_FUNCTIONS)

# Agent can now remember facts across the conversation
agent.run("Store that Alice's favorite color is blue")
agent.run("What is Alice's favorite color?")  # Agent recalls from memory`,
          },
        ],
      },
      {
        step: 9,
        title: "When to use agents vs chains",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "✅ Use agents for", value: "Multi-step reasoning with unknown path, tool selection (LLM decides which tool), error recovery (try different tools on failure), open-ended tasks (research, analysis)" },
              { key: "❌ Use chains for", value: "Fixed workflows (always: retrieve → generate), single tool (no decision needed), latency-critical (agents add LLM round-trips), simple tasks (sentiment analysis, classification)" },
            ],
          },
          {
            type: "text",
            content:
              "**Rule of thumb:** If you can draw the workflow as a flowchart upfront, use a chain. If the path depends on intermediate results, use an agent.",
          },
        ],
      },
      {
        step: 10,
        title: "Agent performance tips",
        blocks: [
          {
            type: "list",
            items: [
              "**Good tool descriptions** — be specific: 'Search for current news' not 'Search'",
              "**Limit tools** — 5-7 tools max. More tools confuse the LLM.",
              "**Set max_iterations** — prevent infinite loops (default 15, use 10 for cost control)",
              "**Cache tool results** — if agent calls same tool twice, return cached result",
              "**Use faster models for tool selection** — GPT-4o-mini for deciding, GPT-4o for complex reasoning",
              "**Monitor cost** — each agent step = LLM call. Track tokens per task.",
            ],
          },
        ],
      },
      {
        step: 11,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the main difference between OpenAI Functions agent and ReAct agent?",
            options: [
              "OpenAI Functions uses native tool calling API (more reliable), ReAct uses text-based reasoning (works with any LLM)",
              "OpenAI Functions is faster",
              "ReAct requires fewer tools",
              "They are the same thing with different names",
            ],
            correct: 0,
            explanation:
              "OpenAI Functions agent uses OpenAI's native function calling API, which returns structured tool calls (JSON) that never malform. It only works with GPT-3.5+ and GPT-4. ReAct agent uses text-based reasoning (Thought: ... Action: ... Observation: ...) which works with any LLM (Claude, Llama, local models) but is slightly less reliable because the LLM might generate malformed Action strings. For production with OpenAI, use Functions agent. For other LLMs, use ReAct.",
          },
        ],
      },
    ],
  },
  {
    slug: "langgraph-intro",
    trackSlug: "langchain-langgraph",
    order: 7,
    minutes: 20,
    title: "Introduction to LangGraph",
    subtitle: "From linear chains to stateful graphs — nodes, edges, state, cycles, and control flow.",
    tags: ["LangGraph", "Graphs", "State machines", "Control flow"],
    sections: [
      {
        step: 1,
        title: "The problem we're solving",
        blocks: [
          {
            type: "text",
            content:
              "LangChain chains are **linear**: A → B → C. But real workflows need:\n\n- **Branching** — route to different paths based on conditions\n- **Cycles** — retry until condition met, loop over items\n- **Parallel execution** — run multiple steps concurrently\n- **Human-in-the-loop** — pause, wait for approval, resume\n- **Error recovery** — catch failures, route to fallback\n\nThe problem: **How do you model complex, non-linear workflows?**\n\nThe answer is **LangGraph** — build workflows as directed graphs with explicit control flow.",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "LangGraph is to LangChain what state machines are to if/else statements. You model workflows explicitly: nodes (what to do) + edges (when to transition) + state (shared context).",
          },
        ],
      },
      {
        step: 2,
        title: "Core concepts: nodes, edges, state",
        blocks: [
          {
            type: "diagram",
            label: "LangGraph architecture",
            chart: `graph LR
    A[Input] --> B[Node 1: Function]
    B --> C{Conditional Edge}
    C -->|Path A| D[Node 2]
    C -->|Path B| E[Node 3]
    D --> F[Node 4]
    E --> F
    F --> G[Output]

    S[State: Shared Context] -.-> B
    S -.-> D
    S -.-> E
    S -.-> F

    style A fill:#e1f5ff
    style C fill:#fff3cd
    style S fill:#f8d7da
    style G fill:#d4edda`,
          },
          {
            type: "kv",
            items: [
              { key: "Nodes", value: "Functions that process state. Can call LLMs, tools, or run any Python code." },
              { key: "Edges", value: "Transitions between nodes. Can be fixed (always go to X) or conditional (route based on state)." },
              { key: "State", value: "Shared context that flows through the graph. Typed dictionary that nodes can read/update." },
            ],
          },
        ],
      },
      {
        step: 3,
        title: "Your first LangGraph",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Hello World graph",
            code: `# pip install langgraph
from langgraph.graph import StateGraph, END
from typing import TypedDict
from langchain_openai import ChatOpenAI

# 1. Define state schema
class GraphState(TypedDict):
    question: str
    answer: str

# 2. Define nodes (functions that process state)
def node_1(state: GraphState) -> GraphState:
    """Process the question"""
    print(f"Node 1: Processing '{state['question']}'")
    # Update state
    return {"answer": "Processing..."}

def node_2(state: GraphState) -> GraphState:
    """Generate answer"""
    llm = ChatOpenAI(model="gpt-4o")
    response = llm.invoke(state["question"])

    return {"answer": response.content}

# 3. Build graph
workflow = StateGraph(GraphState)

# Add nodes
workflow.add_node("process", node_1)
workflow.add_node("generate", node_2)

# Add edges (define flow)
workflow.set_entry_point("process")  # Start here
workflow.add_edge("process", "generate")  # process → generate
workflow.add_edge("generate", END)  # generate → done

# 4. Compile graph
app = workflow.compile()

# 5. Run graph
result = app.invoke({"question": "What is Python?"})
print(result["answer"])`,
          },
          {
            type: "text",
            content:
              "**What happened:**\n1. State flows into 'process' node\n2. Node updates state, returns new values\n3. Updated state flows to 'generate' node\n4. Node generates answer, updates state\n5. Graph reaches END, returns final state",
          },
        ],
      },
      {
        step: 4,
        title: "Conditional edges: branching logic",
        blocks: [
          {
            type: "text",
            content:
              "Route to different nodes based on state:",
          },
          {
            type: "code",
            language: "python",
            label: "Graph with conditional routing",
            code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, Literal

class State(TypedDict):
    query: str
    intent: str
    response: str

# Nodes
def classify_intent(state: State) -> State:
    """Classify user intent"""
    query = state["query"].lower()

    if "weather" in query:
        intent = "weather"
    elif "math" in query or "calculate" in query:
        intent = "math"
    else:
        intent = "general"

    return {"intent": intent}

def handle_weather(state: State) -> State:
    """Handle weather queries"""
    return {"response": "Weather info: Sunny, 22°C"}

def handle_math(state: State) -> State:
    """Handle math queries"""
    # Use calculator tool
    return {"response": "Math result: 42"}

def handle_general(state: State) -> State:
    """Handle general queries"""
    llm = ChatOpenAI(model="gpt-4o")
    response = llm.invoke(state["query"])
    return {"response": response.content}

# Router function (decides which node to go to)
def route_query(state: State) -> Literal["weather", "math", "general"]:
    """Route based on intent"""
    return state["intent"]

# Build graph with conditional routing
workflow = StateGraph(State)

# Add nodes
workflow.add_node("classify", classify_intent)
workflow.add_node("weather", handle_weather)
workflow.add_node("math", handle_math)
workflow.add_node("general", handle_general)

# Flow
workflow.set_entry_point("classify")

# Conditional edge: route based on intent
workflow.add_conditional_edges(
    "classify",  # From this node
    route_query,  # Use this function to decide
    {
        "weather": "weather",  # If returns "weather", go to weather node
        "math": "math",
        "general": "general"
    }
)

# All paths lead to END
workflow.add_edge("weather", END)
workflow.add_edge("math", END)
workflow.add_edge("general", END)

app = workflow.compile()

# Test routing
result = app.invoke({"query": "What's the weather like?"})
print(result["response"])  # Weather info

result = app.invoke({"query": "What is 15 * 20?"})
print(result["response"])  # Math result`,
          },
        ],
      },
      {
        step: 5,
        title: "Cycles: looping until condition met",
        blocks: [
          {
            type: "text",
            content:
              "LangGraph supports cycles — keep looping until a condition is satisfied:",
          },
          {
            type: "code",
            language: "python",
            label: "Graph with retry loop",
            code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class RetryState(TypedDict):
    question: str
    answer: str
    confidence: float
    attempts: int

def generate_answer(state: RetryState) -> RetryState:
    """Generate answer and confidence score"""
    llm = ChatOpenAI(model="gpt-4o", temperature=0.7)

    response = llm.invoke(state["question"])

    # Simulate confidence scoring
    import random
    confidence = random.uniform(0.5, 1.0)

    return {
        "answer": response.content,
        "confidence": confidence,
        "attempts": state.get("attempts", 0) + 1
    }

def check_quality(state: RetryState) -> Literal["retry", "done"]:
    """Decide: retry or accept answer"""
    if state["confidence"] < 0.8 and state["attempts"] < 3:
        return "retry"
    return "done"

# Build graph with cycle
workflow = StateGraph(RetryState)

workflow.add_node("generate", generate_answer)

workflow.set_entry_point("generate")

# Conditional edge creates a cycle
workflow.add_conditional_edges(
    "generate",
    check_quality,
    {
        "retry": "generate",  # Loop back to generate
        "done": END           # Exit loop
    }
)

app = workflow.compile()

# Run (will retry until confidence > 0.8 or 3 attempts)
result = app.invoke({"question": "Explain quantum computing"})
print(f"Answer: {result['answer']}")
print(f"Confidence: {result['confidence']:.2f}")
print(f"Attempts: {result['attempts']}")`,
          },
        ],
      },
      {
        step: 6,
        title: "State updates and reducers",
        blocks: [
          {
            type: "text",
            content:
              "By default, nodes return partial state updates (like dict.update()). Use reducers for custom merge logic:",
          },
          {
            type: "code",
            language: "python",
            label: "State with reducers",
            code: `from langgraph.graph import StateGraph
from typing import TypedDict, Annotated
from operator import add

class MessagesState(TypedDict):
    messages: Annotated[list[str], add]  # Append, don't replace
    count: int  # Replace (default behavior)

def node_a(state: MessagesState) -> MessagesState:
    return {
        "messages": ["Message from A"],
        "count": 1
    }

def node_b(state: MessagesState) -> MessagesState:
    return {
        "messages": ["Message from B"],
        "count": 2
    }

# Build graph
workflow = StateGraph(MessagesState)
workflow.add_node("a", node_a)
workflow.add_node("b", node_b)

workflow.set_entry_point("a")
workflow.add_edge("a", "b")
workflow.add_edge("b", END)

app = workflow.compile()

result = app.invoke({"messages": [], "count": 0})

print(result["messages"])  # ["Message from A", "Message from B"] (appended!)
print(result["count"])     # 2 (replaced)

# The 'add' reducer appended messages instead of replacing`,
          },
        ],
      },
      {
        step: 7,
        title: "Visualizing graphs",
        blocks: [
          {
            type: "text",
            content:
              "LangGraph can generate Mermaid diagrams of your workflow:",
          },
          {
            type: "code",
            language: "python",
            label: "Graph visualization",
            code: `from IPython.display import Image, display

# Get Mermaid diagram
try:
    display(Image(app.get_graph().draw_mermaid_png()))
except Exception:
    # If graphviz not installed, print Mermaid text
    print(app.get_graph().draw_mermaid())

# Output (Mermaid text):
# graph TD
#     __start__ --> classify
#     classify --> weather
#     classify --> math
#     classify --> general
#     weather --> __end__
#     math --> __end__
#     general --> __end__

# Useful for:
# - Documentation (show workflow visually)
# - Debugging (verify edges are correct)
# - Communication (explain system to stakeholders)`,
          },
        ],
      },
      {
        step: 8,
        title: "Streaming graph execution",
        blocks: [
          {
            type: "text",
            content:
              "Stream state updates as the graph executes:",
          },
          {
            type: "code",
            language: "python",
            label: "Streaming execution",
            code: `# Stream mode shows state after each node
for state in app.stream({"query": "What's the weather?"}):
    print(state)
    print("---")

# Output:
# {'classify': {'query': 'What's the weather?', 'intent': 'weather'}}
# ---
# {'weather': {'query': 'What's the weather?', 'intent': 'weather', 'response': 'Sunny, 22°C'}}
# ---

# Stream with specific keys
for state in app.stream({"query": "Calculate 15 * 20"}, stream_mode="values"):
    # Shows full state after each node
    print(f"Intent: {state.get('intent')}")
    print(f"Response: {state.get('response')}")
    print("---")`,
          },
        ],
      },
      {
        step: 9,
        title: "When to use LangGraph vs LangChain",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "✅ Use LangGraph for", value: "Complex control flow (branching, loops, conditionals), human-in-the-loop (pause/resume), error recovery (catch failures, retry), multi-agent coordination, when you need to visualize workflow" },
              { key: "✅ Use LangChain for", value: "Linear workflows (RAG: retrieve → generate), simple chains (prompt → LLM → parse), quick prototypes, when control flow is straightforward" },
            ],
          },
          {
            type: "text",
            content:
              "**Rule of thumb:** If your workflow has more than 2 conditional branches or any loops, use LangGraph. Otherwise, chains are simpler.",
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the main advantage of LangGraph over LangChain chains?",
            options: [
              "LangGraph supports complex control flow (branching, loops, conditionals) with explicit state management",
              "LangGraph is faster than chains",
              "LangGraph requires less code",
              "LangGraph works with more LLMs",
            ],
            correct: 0,
            explanation:
              "LangGraph's main advantage is modeling complex workflows as graphs with explicit control flow. You can have conditional routing (go to node A or B based on state), cycles (loop until condition met), parallel execution, and human-in-the-loop pauses. LangChain chains are linear (A → B → C) and can't easily express these patterns. LangGraph isn't necessarily faster or simpler — it's more powerful for complex workflows. Both work with the same LLMs.",
          },
        ],
      },
    ],
  },
  {
    slug: "langgraph-state",
    trackSlug: "langchain-langgraph",
    order: 8,
    minutes: 22,
    title: "LangGraph State Management",
    subtitle: "Deep dive into state schemas, reducers, checkpoints, persistence, and time-travel debugging.",
    tags: ["State", "Persistence", "Checkpoints", "Reducers"],
    sections: [
      {
        step: 1,
        title: "Why state management matters",
        blocks: [
          {
            type: "text",
            content:
              "In LangGraph, **state** is the shared context that flows through your graph. Every node reads and updates state.\n\nChallenges:\n- **How do updates merge?** Node returns `{\"score\": 5}`, state has `{\"score\": 3}` — replace or add?\n- **How to persist state?** Graph crashes mid-execution — can you resume?\n- **How to debug?** State changed unexpectedly — what happened at step 3?\n- **How to add human review?** Pause after node, wait for approval, resume from exact state\n\nThis lesson: advanced state patterns that unlock production-ready LangGraph applications.",
          },
        ],
      },
      {
        step: 2,
        title: "State schemas with validation",
        blocks: [
          {
            type: "text",
            content:
              "Define state with Pydantic for validation:",
          },
          {
            type: "code",
            language: "python",
            label: "Pydantic state schema",
            code: `from typing import Annotated, Literal
from pydantic import BaseModel, Field, validator
from langgraph.graph import StateGraph

class ResearchState(BaseModel):
    """Type-safe state with validation"""

    # Required fields
    query: str = Field(..., min_length=3)

    # Optional with defaults
    research_results: list[str] = Field(default_factory=list)
    draft: str = ""

    # Enum for status
    status: Literal["researching", "drafting", "reviewing", "done"] = "researching"

    # Validated field
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)  # 0-1 range

    @validator("query")
    def query_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Query cannot be empty")
        return v.strip()

# Use with LangGraph
def research_node(state: ResearchState) -> dict:
    """Node receives typed state"""
    print(f"Researching: {state.query}")

    # Return partial update (validated on merge)
    return {
        "research_results": ["Result 1", "Result 2"],
        "status": "drafting"
    }

# Build graph with Pydantic state
workflow = StateGraph(ResearchState)
workflow.add_node("research", research_node)
workflow.set_entry_point("research")
workflow.add_edge("research", END)

app = workflow.compile()

# Invalid input caught at entry
try:
    app.invoke({"query": "", "confidence": 1.5})  # Empty query + invalid confidence
except Exception as e:
    print(f"Validation error: {e}")`,
          },
          {
            type: "text",
            content:
              "Benefits: Runtime validation, IDE autocomplete, clear schema documentation.",
          },
        ],
      },
      {
        step: 3,
        title: "Reducers: custom merge logic",
        blocks: [
          {
            type: "text",
            content:
              "By default, state updates use dict.update() (replace). Use reducers for custom merge:",
          },
          {
            type: "code",
            language: "python",
            label: "Common reducer patterns",
            code: `from typing import Annotated
from operator import add
from langgraph.graph import StateGraph

def max_reducer(existing, new):
    """Keep maximum value"""
    return max(existing, new) if existing and new else (existing or new)

def merge_dicts_reducer(existing, new):
    """Merge dictionaries"""
    result = (existing or {}).copy()
    result.update(new or {})
    return result

class State(TypedDict):
    # Default: replace
    query: str

    # Append to list (operator.add)
    messages: Annotated[list[str], add]

    # Keep max value
    confidence: Annotated[float, max_reducer]

    # Merge dictionaries
    metadata: Annotated[dict, merge_dicts_reducer]

# Example nodes
def node_a(state: State) -> State:
    return {
        "messages": ["Message A"],
        "confidence": 0.7,
        "metadata": {"source": "node_a", "timestamp": "10:00"}
    }

def node_b(state: State) -> State:
    return {
        "messages": ["Message B"],
        "confidence": 0.9,  # Higher, so this wins
        "metadata": {"status": "processed"}  # Merged with existing
    }

# Build graph
workflow = StateGraph(State)
workflow.add_node("a", node_a)
workflow.add_node("b", node_b)
workflow.set_entry_point("a")
workflow.add_edge("a", "b")
workflow.add_edge("b", END)

app = workflow.compile()

result = app.invoke({"query": "test", "messages": [], "confidence": 0.0, "metadata": {}})

print(result["messages"])    # ["Message A", "Message B"] (appended)
print(result["confidence"])  # 0.9 (max)
print(result["metadata"])    # {"source": "node_a", "timestamp": "10:00", "status": "processed"} (merged)`,
          },
        ],
      },
      {
        step: 4,
        title: "Checkpointing: save and resume",
        blocks: [
          {
            type: "text",
            content:
              "Checkpoints save state after each node. Benefits:\n- **Resume** — crash mid-execution, resume from last checkpoint\n- **Human-in-the-loop** — pause, wait for approval, resume\n- **Time-travel debugging** — inspect state at any step",
          },
          {
            type: "code",
            language: "python",
            label: "In-memory checkpointing",
            code: `from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, END

class State(TypedDict):
    step: int
    result: str

def step_1(state: State) -> State:
    return {"step": 1, "result": "Step 1 done"}

def step_2(state: State) -> State:
    return {"step": 2, "result": "Step 2 done"}

def step_3(state: State) -> State:
    # Simulate crash
    if state["step"] == 2:
        raise Exception("Crash at step 3!")
    return {"step": 3, "result": "Step 3 done"}

# Build graph with checkpointing
workflow = StateGraph(State)
workflow.add_node("s1", step_1)
workflow.add_node("s2", step_2)
workflow.add_node("s3", step_3)

workflow.set_entry_point("s1")
workflow.add_edge("s1", "s2")
workflow.add_edge("s2", "s3")
workflow.add_edge("s3", END)

# Add checkpointer
checkpointer = MemorySaver()
app = workflow.compile(checkpointer=checkpointer)

# Run with thread ID (groups related runs)
config = {"configurable": {"thread_id": "run-123"}}

try:
    result = app.invoke({"step": 0, "result": ""}, config)
except Exception as e:
    print(f"Crashed: {e}")

# Inspect checkpoint history
state_history = app.get_state_history(config)
for state in state_history:
    print(f"Step {state.values['step']}: {state.values['result']}")

# Output:
# Step 2: Step 2 done  <- Last successful checkpoint
# Step 1: Step 1 done
# Step 0:              <- Initial state

# Resume from last checkpoint (fix step_3 first!)`,
          },
        ],
      },
      {
        step: 5,
        title: "Persistent checkpointing (SQLite)",
        blocks: [
          {
            type: "text",
            content:
              "Use SQLite/Postgres for durable checkpoints that survive restarts:",
          },
          {
            type: "code",
            language: "python",
            label: "SQLite checkpointer",
            code: `# pip install langgraph-checkpoint-sqlite
from langgraph.checkpoint.sqlite import SqliteSaver

# Create persistent checkpointer
checkpointer = SqliteSaver.from_conn_string("checkpoints.db")

app = workflow.compile(checkpointer=checkpointer)

# Run long workflow
config = {"configurable": {"thread_id": "long-run-456"}}
result = app.invoke({"query": "Research AI agents"}, config)

# Later (even after process restart):
# Resume from checkpoint
checkpointer_new = SqliteSaver.from_conn_string("checkpoints.db")
app_new = workflow.compile(checkpointer=checkpointer_new)

# Get last state
config = {"configurable": {"thread_id": "long-run-456"}}
last_state = app_new.get_state(config)
print(f"Last checkpoint: {last_state.values}")

# Continue from there
next_result = app_new.invoke(None, config)  # None = resume

# Use cases:
# - Long-running workflows (hours/days)
# - Human-in-the-loop (pause overnight, resume tomorrow)
# - Crash recovery (process dies, resume from last checkpoint)
# - Multi-tenant (one thread_id per user session)`,
          },
        ],
      },
      {
        step: 6,
        title: "Human-in-the-loop with interrupts",
        blocks: [
          {
            type: "text",
            content:
              "Pause graph execution, wait for human input, then resume:",
          },
          {
            type: "code",
            language: "python",
            label: "Graph with human approval",
            code: `from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

class DraftState(TypedDict):
    topic: str
    draft: str
    approved: bool

def research(state: DraftState) -> DraftState:
    return {"draft": f"Draft about {state['topic']}..."}

def revise(state: DraftState) -> DraftState:
    return {"draft": state["draft"] + " (revised)"}

def publish(state: DraftState) -> DraftState:
    print(f"Publishing: {state['draft']}")
    return {}

# Router: wait for approval
def check_approval(state: DraftState) -> Literal["revise", "publish"]:
    return "publish" if state.get("approved") else "revise"

# Build graph
workflow = StateGraph(DraftState)
workflow.add_node("research", research)
workflow.add_node("revise", revise)
workflow.add_node("publish", publish)

workflow.set_entry_point("research")
workflow.add_conditional_edges(
    "research",
    check_approval,
    {"revise": "revise", "publish": "publish"}
)
workflow.add_edge("revise", END)  # Pause here for approval
workflow.add_edge("publish", END)

# Enable checkpointing + interrupts
checkpointer = MemorySaver()
app = workflow.compile(
    checkpointer=checkpointer,
    interrupt_before=["publish"]  # Pause before publish node
)

config = {"configurable": {"thread_id": "draft-789"}}

# Run until interrupt
result = app.invoke({"topic": "LangGraph", "approved": False}, config)
print(f"Draft: {result['draft']}")
print("Waiting for approval...")

# Human reviews and approves
# Update state and resume
app.update_state(config, {"approved": True})
final = app.invoke(None, config)  # Resume

# Output: Publishing: Draft about LangGraph... (revised)`,
          },
        ],
      },
      {
        step: 7,
        title: "Time-travel debugging",
        blocks: [
          {
            type: "text",
            content:
              "Inspect and replay from any checkpoint:",
          },
          {
            type: "code",
            language: "python",
            label: "Replay from checkpoint",
            code: `# Get checkpoint history
config = {"configurable": {"thread_id": "debug-run"}}
history = list(app.get_state_history(config))

print(f"Found {len(history)} checkpoints")

# Inspect each checkpoint
for i, state in enumerate(history):
    print(f"\\nCheckpoint {i}:")
    print(f"  Step: {state.values.get('step')}")
    print(f"  Result: {state.values.get('result')}")
    print(f"  Next nodes: {state.next}")

# Replay from specific checkpoint
# Get checkpoint ID from history[2]
target_checkpoint = history[2]

# Resume from that exact state
config_with_checkpoint = {
    "configurable": {
        "thread_id": "debug-run",
        "checkpoint_id": target_checkpoint.config["configurable"]["checkpoint_id"]
    }
}

# Continue from checkpoint 2
replayed = app.invoke(None, config_with_checkpoint)

# Use case: "State was correct at step 3, wrong at step 5 — what happened?"
# → Replay from step 3, add logging, identify bug`,
          },
        ],
      },
      {
        step: 8,
        title: "State branching and versioning",
        blocks: [
          {
            type: "text",
            content:
              "Create state branches — explore multiple paths without losing original:",
          },
          {
            type: "code",
            language: "python",
            label: "Branch state for experiments",
            code: `from uuid import uuid4

# Original run
config = {"configurable": {"thread_id": "main"}}
result = app.invoke({"query": "AI agents"}, config)

# Get current state
current_state = app.get_state(config)

# Branch 1: Try aggressive strategy
branch_1_config = {"configurable": {"thread_id": f"branch-{uuid4()}"}}
app.update_state(branch_1_config, current_state.values)
app.update_state(branch_1_config, {"strategy": "aggressive"})
branch_1_result = app.invoke(None, branch_1_config)

# Branch 2: Try conservative strategy
branch_2_config = {"configurable": {"thread_id": f"branch-{uuid4()}"}}
app.update_state(branch_2_config, current_state.values)
app.update_state(branch_2_config, {"strategy": "conservative"})
branch_2_result = app.invoke(None, branch_2_config)

# Compare results, pick winner
if branch_1_result["score"] > branch_2_result["score"]:
    print("Aggressive strategy wins")
    # Continue from branch_1
    final_result = app.invoke(None, branch_1_config)
else:
    print("Conservative strategy wins")
    final_result = app.invoke(None, branch_2_config)

# Original state unaffected — still at checkpoint before branch`,
          },
        ],
      },
      {
        step: 9,
        title: "Production state patterns",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "Immutable state", value: "Nodes never mutate state directly. Always return new values. Prevents hidden side effects." },
              { key: "Namespaced state", value: "Prefix keys by node: 'research_results', 'draft_content'. Avoids key collisions across nodes." },
              { key: "State snapshots", value: "Checkpoint after expensive nodes (API calls, model inference). Cheap to resume, saves retry cost." },
              { key: "State cleanup", value: "Remove intermediate data in final node. Don't leak temp state to caller." },
              { key: "State versioning", value: "Add 'state_version' field. Handle old versions gracefully when schema changes." },
            ],
          },
          {
            type: "code",
            language: "python",
            label: "State cleanup pattern",
            code: `def final_node(state: State) -> State:
    """Clean up intermediate state before returning"""

    # Keep only what caller needs
    return {
        "result": state["result"],
        "confidence": state["confidence"],

        # Remove internal state
        "intermediate_results": None,  # Or use state.pop()
        "temp_data": None,
        "debug_info": None
    }`,
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the main benefit of checkpointing in LangGraph?",
            options: [
              "Saves state after each node, enabling resume from failures, human-in-the-loop pauses, and time-travel debugging",
              "Makes graphs run faster",
              "Reduces memory usage",
              "Enables parallel execution",
            ],
            correct: 0,
            explanation:
              "Checkpointing saves the graph state after each node executes. This enables: (1) Resume from failures — if the graph crashes at step 5, resume from step 4's checkpoint instead of restarting; (2) Human-in-the-loop — pause after a node (e.g. draft), wait for human approval, then resume; (3) Time-travel debugging — inspect state at any checkpoint to understand what changed. Checkpoints don't make graphs faster (they add overhead), don't reduce memory (they store more state), and don't enable parallelism (that's done via parallel execution patterns).",
          },
        ],
      },
    ],
  },
  {
    slug: "langgraph-patterns",
    trackSlug: "langchain-langgraph",
    order: 9,
    minutes: 24,
    title: "Advanced LangGraph Patterns",
    subtitle: "Human-in-the-loop, subgraphs, parallel execution, error handling, and streaming.",
    tags: ["Patterns", "HITL", "Subgraphs", "Streaming"],
    sections: [
      {
        step: 1,
        title: "Pattern overview",
        blocks: [
          {
            type: "text",
            content:
              "This lesson covers production patterns that unlock real-world LangGraph applications:\n\n- **Human-in-the-loop** — pause for approval, escalate on uncertainty\n- **Parallel execution** — fan-out, process concurrently, fan-in to merge\n- **Subgraphs** — compose graphs like functions, reusable components\n- **Error handling** — catch failures, retry, route to fallback\n- **Streaming** — stream state updates in real-time\n- **Dynamic routing** — route based on runtime conditions",
          },
          {
            type: "diagram",
            label: "Pattern landscape",
            chart: `graph TD
    A[Complex Workflow] --> B{Pattern}
    B -->|Need Approval| C[HITL]
    B -->|Independent Tasks| D[Parallel]
    B -->|Reusable Logic| E[Subgraph]
    B -->|Handle Failures| F[Error Recovery]
    B -->|Real-time Updates| G[Streaming]

    style C fill:#e1f5ff
    style D fill:#fff3cd
    style E fill:#d4edda
    style F fill:#f8d7da`,
          },
        ],
      },
      {
        step: 2,
        title: "Human-in-the-loop (HITL)",
        blocks: [
          {
            type: "text",
            content:
              "Pause execution, wait for human input, resume with updated state:",
          },
          {
            type: "code",
            language: "python",
            label: "HITL approval workflow",
            code: `from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

class CodeChangeState(TypedDict):
    file: str
    proposed_changes: str
    approved: bool
    feedback: str

def analyze_code(state: CodeChangeState) -> CodeChangeState:
    """Agent analyzes code and proposes changes"""
    return {
        "proposed_changes": "Replace deprecated API calls with new API"
    }

def apply_changes(state: CodeChangeState) -> CodeChangeState:
    """Apply approved changes"""
    print(f"Applying changes to {state['file']}")
    # Actually modify the file
    return {}

# Build graph with HITL interrupt
workflow = StateGraph(CodeChangeState)
workflow.add_node("analyze", analyze_code)
workflow.add_node("apply", apply_changes)

workflow.set_entry_point("analyze")
workflow.add_edge("analyze", "apply")
workflow.add_edge("apply", END)

# Compile with checkpoint + interrupt before apply
checkpointer = MemorySaver()
app = workflow.compile(
    checkpointer=checkpointer,
    interrupt_before=["apply"]  # Pause here for approval
)

config = {"configurable": {"thread_id": "code-review-1"}}

# Step 1: Run until interrupt
result = app.invoke({"file": "api.py", "approved": False}, config)
print(f"Proposed: {result['proposed_changes']}")
print("Waiting for human review...")

# Step 2: Human reviews in UI/CLI
# If approved:
app.update_state(config, {"approved": True, "feedback": "LGTM"})
final = app.invoke(None, config)  # Resume

# If rejected:
# app.update_state(config, {"approved": False, "feedback": "Too risky"})
# (Workflow ends without applying)`,
          },
        ],
      },
      {
        step: 3,
        title: "Parallel execution: map-reduce",
        blocks: [
          {
            type: "text",
            content:
              "Fan-out to multiple nodes, process concurrently, fan-in to merge results:",
          },
          {
            type: "code",
            language: "python",
            label: "Parallel code analysis",
            code: `from typing import Annotated
from operator import add
from langgraph.graph import StateGraph, END

class AnalysisState(TypedDict):
    code: str
    # Each analyzer appends to findings
    findings: Annotated[list[dict], add]

def security_check(state: AnalysisState) -> AnalysisState:
    """Security analysis (slow)"""
    import time
    time.sleep(2)  # Simulate API call
    return {
        "findings": [{"type": "security", "issue": "SQL injection risk"}]
    }

def style_check(state: AnalysisState) -> AnalysisState:
    """Style analysis (fast)"""
    return {
        "findings": [{"type": "style", "issue": "Missing docstring"}]
    }

def performance_check(state: AnalysisState) -> AnalysisState:
    """Performance analysis (medium)"""
    import time
    time.sleep(1)
    return {
        "findings": [{"type": "perf", "issue": "Inefficient loop"}]
    }

def merge_findings(state: AnalysisState) -> AnalysisState:
    """Aggregate results"""
    critical = [f for f in state["findings"] if f["type"] == "security"]
    print(f"Found {len(state['findings'])} issues, {len(critical)} critical")
    return {}

# Build parallel workflow
workflow = StateGraph(AnalysisState)

# Add parallel analyzers
workflow.add_node("security", security_check)
workflow.add_node("style", style_check)
workflow.add_node("perf", performance_check)
workflow.add_node("merge", merge_findings)

# Fan-out from START to all analyzers
workflow.set_entry_point("security")
workflow.set_entry_point("style")
workflow.set_entry_point("perf")

# Fan-in: all analyzers -> merge
workflow.add_edge("security", "merge")
workflow.add_edge("style", "merge")
workflow.add_edge("perf", "merge")
workflow.add_edge("merge", END)

app = workflow.compile()

# Run (3 analyzers run concurrently!)
import time
start = time.time()
result = app.invoke({"code": "...", "findings": []})
elapsed = time.time() - start

print(f"Completed in {elapsed:.1f}s")  # ~2s (not 2+1+1=4s!)
print(f"Findings: {result['findings']}")`,
          },
          {
            type: "text",
            content:
              "**Key insight:** LangGraph automatically runs independent nodes in parallel. Total time = slowest node (2s), not sum (4s).",
          },
        ],
      },
      {
        step: 4,
        title: "Subgraphs: composable workflows",
        blocks: [
          {
            type: "text",
            content:
              "Build graphs from other graphs — like functions:",
          },
          {
            type: "code",
            language: "python",
            label: "Subgraph pattern",
            code: `from langgraph.graph import StateGraph, END

# Subgraph: research workflow
def build_research_graph():
    class ResearchState(TypedDict):
        query: str
        results: list[str]

    def search(state: ResearchState) -> ResearchState:
        return {"results": [f"Result for {state['query']}"]}

    def summarize(state: ResearchState) -> ResearchState:
        summary = f"Summary of {len(state['results'])} results"
        return {"results": [summary]}

    workflow = StateGraph(ResearchState)
    workflow.add_node("search", search)
    workflow.add_node("summarize", summarize)
    workflow.set_entry_point("search")
    workflow.add_edge("search", "summarize")
    workflow.add_edge("summarize", END)

    return workflow.compile()

# Main graph uses subgraph
class MainState(TypedDict):
    topic: str
    research: str
    draft: str

def do_research(state: MainState) -> MainState:
    """Call research subgraph"""
    research_graph = build_research_graph()

    result = research_graph.invoke({"query": state["topic"], "results": []})
    return {"research": result["results"][0]}

def write_draft(state: MainState) -> MainState:
    draft = f"Draft about {state['topic']} based on: {state['research']}"
    return {"draft": draft}

# Main workflow
main_workflow = StateGraph(MainState)
main_workflow.add_node("research", do_research)
main_workflow.add_node("write", write_draft)
main_workflow.set_entry_point("research")
main_workflow.add_edge("research", "write")
main_workflow.add_edge("write", END)

app = main_workflow.compile()

result = app.invoke({"topic": "LangGraph"})
print(result["draft"])

# Benefits: Reusable research graph, testable in isolation, clear abstraction`,
          },
        ],
      },
      {
        step: 5,
        title: "Error handling: try/catch pattern",
        blocks: [
          {
            type: "text",
            content:
              "Catch node failures, retry or route to fallback:",
          },
          {
            type: "code",
            language: "python",
            label: "Error recovery pattern",
            code: `from langgraph.graph import StateGraph, END

class TaskState(TypedDict):
    task: str
    result: str
    error: str
    retry_count: int

def risky_operation(state: TaskState) -> TaskState:
    """May fail"""
    import random
    if random.random() < 0.5:  # 50% failure rate
        raise Exception("API timeout")

    return {"result": "Success"}

def error_handler(state: TaskState) -> TaskState:
    """Catch and log error"""
    return {"error": str(state.get("__exception__", "Unknown error"))}

def should_retry(state: TaskState) -> Literal["retry", "fallback", "done"]:
    """Decide: retry or give up"""
    if state.get("error"):
        retry_count = state.get("retry_count", 0)
        if retry_count < 3:
            return "retry"
        return "fallback"
    return "done"

def fallback_operation(state: TaskState) -> TaskState:
    """Fallback when retries exhausted"""
    return {"result": "Fallback: Used cached data"}

# Build graph with error handling
workflow = StateGraph(TaskState)

workflow.add_node("risky", risky_operation)
workflow.add_node("handle_error", error_handler)
workflow.add_node("fallback", fallback_operation)

workflow.set_entry_point("risky")

# If risky succeeds → done
# If risky fails → handle_error → retry or fallback
workflow.add_conditional_edges(
    "risky",
    should_retry,
    {
        "done": END,
        "retry": "risky",  # Loop back
        "fallback": "fallback"
    }
)

workflow.add_edge("fallback", END)

# Configure error handling
app = workflow.compile()

# Run with error recovery
result = app.invoke({"task": "Fetch data", "retry_count": 0})
print(result.get("result"))  # Either "Success" or "Fallback: Used cached data"`,
          },
        ],
      },
      {
        step: 6,
        title: "Streaming state updates",
        blocks: [
          {
            type: "text",
            content:
              "Stream state changes in real-time (useful for long-running workflows):",
          },
          {
            type: "code",
            language: "python",
            label: "Streaming execution",
            code: `from langgraph.graph import StateGraph, END

class StreamState(TypedDict):
    step: int
    status: str
    result: str

def step_1(state: StreamState) -> StreamState:
    import time
    time.sleep(1)
    return {"step": 1, "status": "Downloaded data"}

def step_2(state: StreamState) -> StreamState:
    import time
    time.sleep(2)
    return {"step": 2, "status": "Processed data"}

def step_3(state: StreamState) -> StreamState:
    import time
    time.sleep(1)
    return {"step": 3, "status": "Uploaded results"}

workflow = StateGraph(StreamState)
workflow.add_node("s1", step_1)
workflow.add_node("s2", step_2)
workflow.add_node("s3", step_3)

workflow.set_entry_point("s1")
workflow.add_edge("s1", "s2")
workflow.add_edge("s2", "s3")
workflow.add_edge("s3", END)

app = workflow.compile()

# Stream updates (shows progress in real-time)
for event in app.stream({"step": 0, "status": "Starting..."}):
    node_name = list(event.keys())[0]
    state = event[node_name]
    print(f"[{state['step']}] {state['status']}")

# Output:
# [1] Downloaded data
# [2] Processed data
# [3] Uploaded results

# Use cases:
# - Show progress bar in UI
# - Log intermediate results
# - Stream to websocket for real-time updates`,
          },
        ],
      },
      {
        step: 7,
        title: "Dynamic routing based on state",
        blocks: [
          {
            type: "text",
            content:
              "Route to different nodes based on runtime state (not just fixed logic):",
          },
          {
            type: "code",
            language: "python",
            label: "Dynamic router",
            code: `from langgraph.graph import StateGraph, END

class SmartRoutingState(TypedDict):
    query: str
    complexity: str  # "simple" | "medium" | "complex"
    result: str

def classify_complexity(state: SmartRoutingState) -> SmartRoutingState:
    """Determine query complexity"""
    query = state["query"]

    if len(query.split()) < 5:
        complexity = "simple"
    elif "analyze" in query or "compare" in query:
        complexity = "complex"
    else:
        complexity = "medium"

    return {"complexity": complexity}

# Different handlers for different complexity levels
def simple_handler(state: SmartRoutingState) -> SmartRoutingState:
    return {"result": f"Quick answer to: {state['query']}"}

def medium_handler(state: SmartRoutingState) -> SmartRoutingState:
    return {"result": f"Standard answer with research"}

def complex_handler(state: SmartRoutingState) -> SmartRoutingState:
    return {"result": f"Deep analysis with multiple sources"}

# Dynamic router function
def route_by_complexity(state: SmartRoutingState) -> str:
    """Route based on state"""
    return state["complexity"]

# Build graph
workflow = StateGraph(SmartRoutingState)

workflow.add_node("classify", classify_complexity)
workflow.add_node("simple", simple_handler)
workflow.add_node("medium", medium_handler)
workflow.add_node("complex", complex_handler)

workflow.set_entry_point("classify")

# Route based on complexity
workflow.add_conditional_edges(
    "classify",
    route_by_complexity,
    {
        "simple": "simple",
        "medium": "medium",
        "complex": "complex"
    }
)

workflow.add_edge("simple", END)
workflow.add_edge("medium", END)
workflow.add_edge("complex", END)

app = workflow.compile()

# Test routing
print(app.invoke({"query": "What is Python?"})["result"])
# -> Simple handler

print(app.invoke({"query": "Analyze the trade-offs between microservices and monoliths"})["result"])
# -> Complex handler`,
          },
        ],
      },
      {
        step: 8,
        title: "Conditional interrupts",
        blocks: [
          {
            type: "text",
            content:
              "Interrupt only when certain conditions are met:",
          },
          {
            type: "code",
            language: "python",
            label: "Conditional HITL",
            code: `from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

class DecisionState(TypedDict):
    amount: float
    approved: bool
    requires_approval: bool

def check_amount(state: DecisionState) -> DecisionState:
    """Determine if approval needed"""
    requires_approval = state["amount"] > 10000  # High-value threshold
    return {"requires_approval": requires_approval}

def process_payment(state: DecisionState) -> DecisionState:
    print(f"Processing $$\{state['amount']}")
    return {}

def route_approval(state: DecisionState) -> Literal["process", "wait_approval"]:
    """Route based on amount"""
    return "wait_approval" if state["requires_approval"] else "process"

# Build graph
workflow = StateGraph(DecisionState)
workflow.add_node("check", check_amount)
workflow.add_node("wait_approval", lambda s: s)  # Pause point
workflow.add_node("process", process_payment)

workflow.set_entry_point("check")
workflow.add_conditional_edges(
    "check",
    route_approval,
    {"process": "process", "wait_approval": "wait_approval"}
)
workflow.add_edge("wait_approval", "process")  # After approval
workflow.add_edge("process", END)

checkpointer = MemorySaver()
app = workflow.compile(
    checkpointer=checkpointer,
    interrupt_before=["wait_approval"]  # Only interrupt here
)

# Small amount (no interrupt)
config1 = {"configurable": {"thread_id": "txn-1"}}
result = app.invoke({"amount": 100.0}, config1)
print("Small payment: auto-approved")

# Large amount (interrupts)
config2 = {"configurable": {"thread_id": "txn-2"}}
result = app.invoke({"amount": 50000.0}, config2)
print("Large payment: waiting for approval...")

# Human approves
app.update_state(config2, {"approved": True})
final = app.invoke(None, config2)`,
          },
        ],
      },
      {
        step: 9,
        title: "Pattern composition",
        blocks: [
          {
            type: "text",
            content:
              "Combine patterns for production workflows:",
          },
          {
            type: "code",
            language: "python",
            label: "Full pattern composition",
            code: `# Real-world example: Code review system
# Combines: HITL + Parallel + Error handling + Streaming

class CodeReviewState(TypedDict):
    pr_number: int
    files: list[str]
    security_issues: Annotated[list, add]
    style_issues: Annotated[list, add]
    approved: bool
    error: str

# Parallel analyzers (with error handling)
def security_scan(state: CodeReviewState) -> CodeReviewState:
    try:
        # Run security tools
        return {"security_issues": ["Issue 1", "Issue 2"]}
    except Exception as e:
        return {"error": f"Security scan failed: {e}"}

def style_scan(state: CodeReviewState) -> CodeReviewState:
    try:
        return {"style_issues": ["Style issue 1"]}
    except Exception as e:
        return {"error": f"Style scan failed: {e}"}

# Merge + decide if approval needed
def review_results(state: CodeReviewState) -> CodeReviewState:
    critical = len(state.get("security_issues", []))
    requires_approval = critical > 0
    return {"requires_approval": requires_approval}

def apply_fixes(state: CodeReviewState) -> CodeReviewState:
    print(f"Auto-fixing {len(state['style_issues'])} style issues")
    return {}

# Build composed workflow
workflow = StateGraph(CodeReviewState)

# Parallel scan
workflow.add_node("security", security_scan)
workflow.add_node("style", style_scan)
workflow.add_node("review", review_results)
workflow.add_node("fix", apply_fixes)

workflow.set_entry_point("security")
workflow.set_entry_point("style")

workflow.add_edge("security", "review")
workflow.add_edge("style", "review")

workflow.add_conditional_edges(
    "review",
    lambda s: "wait" if s.get("requires_approval") else "fix",
    {"wait": END, "fix": "fix"}  # HITL: pause if critical issues
)
workflow.add_edge("fix", END)

checkpointer = MemorySaver()
app = workflow.compile(checkpointer=checkpointer, interrupt_before=["fix"])

# Stream execution
for event in app.stream({"pr_number": 123, "files": ["app.py"]}):
    print(event)  # Real-time progress`,
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the main benefit of parallel execution in LangGraph?",
            options: [
              "Independent nodes run concurrently, reducing total wall-clock time (limited by slowest node, not sum of all nodes)",
              "Parallel execution uses less memory",
              "Parallel execution is easier to debug",
              "Parallel execution requires less code",
            ],
            correct: 0,
            explanation:
              "Parallel execution's main benefit is speed: independent nodes run concurrently, so total time equals the slowest node, not the sum of all nodes. If 3 analyzers take 2s, 1s, 1s, sequential execution takes 4s (2+1+1), but parallel takes 2s (max of 2, 1, 1). This doesn't reduce memory (all nodes load simultaneously), doesn't make debugging easier (race conditions are harder), and doesn't reduce code (you still write all nodes). The win is pure wall-clock performance when nodes are independent.",
          },
        ],
      },
    ],
  },
  {
    slug: "multi-agent-langgraph",
    trackSlug: "langchain-langgraph",
    order: 10,
    minutes: 26,
    title: "Multi-Agent Systems with LangGraph",
    subtitle: "Coordinate multiple agents — supervisor pattern, collaboration, handoffs, and communication.",
    tags: ["Multi-agent", "Collaboration", "Orchestration", "Handoffs"],
    sections: [
      {
        step: 1,
        title: "Why multiple agents?",
        blocks: [
          {
            type: "text",
            content:
              "A single agent with many tools becomes a generalist — good at nothing, overwhelmed by choices.\n\n**Multi-agent advantages:**\n- **Specialization** — each agent has focused tools and prompts\n- **Parallelism** — agents work concurrently on independent tasks\n- **Modularity** — swap/upgrade agents without rewriting system\n- **Scalability** — add new agents for new capabilities\n\n**Trade-offs:**\n- **Coordination overhead** — routing, communication, state management\n- **Cost** — multiple LLM calls vs one\n- **Complexity** — harder to debug, more moving parts",
          },
          {
            type: "diagram",
            label: "Single vs multi-agent",
            chart: `graph LR
    subgraph "Single Agent"
    U1[User] --> A1[Agent with 20 tools]
    A1 --> R1[Result]
    end

    subgraph "Multi-Agent"
    U2[User] --> S[Supervisor]
    S --> A2[Research Agent]
    S --> A3[Code Agent]
    S --> A4[Writing Agent]
    A2 --> M[Merge]
    A3 --> M
    A4 --> M
    M --> R2[Result]
    end

    style A1 fill:#f8d7da
    style S fill:#d4edda
    style A2 fill:#e1f5ff
    style A3 fill:#e1f5ff
    style A4 fill:#e1f5ff`,
          },
        ],
      },
      {
        step: 2,
        title: "Pattern 1: Supervisor pattern",
        blocks: [
          {
            type: "text",
            content:
              "One supervisor agent coordinates worker agents:",
          },
          {
            type: "code",
            language: "python",
            label: "Supervisor orchestration",
            code: `from typing import Annotated, Literal
from operator import add
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

class SupervisorState(TypedDict):
    task: str
    plan: list[str]
    results: Annotated[list[dict], add]
    final_answer: str

# Supervisor: plans and routes
def supervisor(state: SupervisorState) -> SupervisorState:
    """Break down task and assign to workers"""
    llm = ChatOpenAI(model="gpt-4o")

    prompt = f"""You are a supervisor coordinating a team.
Task: {state['task']}

Available workers:
- research_agent: Search web, gather data
- code_agent: Write and execute code
- analysis_agent: Analyze data, create insights

Create a plan: which workers to call and in what order?
Return as list of worker names."""

    response = llm.invoke(prompt)

    # Parse plan (simplified)
    plan = ["research_agent", "analysis_agent"]  # Mock parsing

    return {"plan": plan}

# Worker agents
def research_agent(state: SupervisorState) -> SupervisorState:
    """Specialized for web research"""
    llm = ChatOpenAI(model="gpt-4o-mini")  # Cheaper model for workers

    result = llm.invoke(f"Research: {state['task']}")

    return {"results": [{"agent": "research", "output": result.content}]}

def analysis_agent(state: SupervisorState) -> SupervisorState:
    """Specialized for data analysis"""
    llm = ChatOpenAI(model="gpt-4o-mini")

    # Get previous results
    research_data = [r["output"] for r in state["results"] if r["agent"] == "research"]

    result = llm.invoke(f"Analyze this data: {research_data}")

    return {"results": [{"agent": "analysis", "output": result.content}]}

def synthesize(state: SupervisorState) -> SupervisorState:
    """Supervisor synthesizes final answer"""
    llm = ChatOpenAI(model="gpt-4o")

    all_results = "\\n".join([f"{r['agent']}: {r['output']}" for r in state["results"]])

    final = llm.invoke(f"Synthesize these results into final answer:\\n{all_results}")

    return {"final_answer": final.content}

# Router: which worker to call next?
def route_to_worker(state: SupervisorState) -> str:
    """Route based on plan"""
    if not state.get("plan"):
        return "synthesize"

    next_worker = state["plan"][0]
    state["plan"] = state["plan"][1:]  # Remove from plan

    return next_worker

# Build graph
workflow = StateGraph(SupervisorState)

workflow.add_node("supervisor", supervisor)
workflow.add_node("research_agent", research_agent)
workflow.add_node("analysis_agent", analysis_agent)
workflow.add_node("synthesize", synthesize)

workflow.set_entry_point("supervisor")

workflow.add_conditional_edges(
    "supervisor",
    route_to_worker,
    {
        "research_agent": "research_agent",
        "analysis_agent": "analysis_agent",
        "synthesize": "synthesize"
    }
)

# Workers return to supervisor
workflow.add_edge("research_agent", "supervisor")
workflow.add_edge("analysis_agent", "supervisor")
workflow.add_edge("synthesize", END)

app = workflow.compile()

result = app.invoke({"task": "What are the top AI trends in 2026?", "results": []})
print(result["final_answer"])`,
          },
        ],
      },
      {
        step: 3,
        title: "Pattern 2: Collaboration (parallel agents)",
        blocks: [
          {
            type: "text",
            content:
              "Agents work in parallel, merge results:",
          },
          {
            type: "code",
            language: "python",
            label: "Parallel collaboration",
            code: `from langgraph.graph import StateGraph, END

class CollabState(TypedDict):
    topic: str
    perspectives: Annotated[list[dict], add]
    synthesis: str

# Each agent contributes a perspective
def technical_agent(state: CollabState) -> CollabState:
    """Technical perspective"""
    llm = ChatOpenAI(model="gpt-4o-mini")
    result = llm.invoke(f"Technical analysis of: {state['topic']}")

    return {"perspectives": [{"agent": "technical", "view": result.content}]}

def business_agent(state: CollabState) -> CollabState:
    """Business perspective"""
    llm = ChatOpenAI(model="gpt-4o-mini")
    result = llm.invoke(f"Business impact of: {state['topic']}")

    return {"perspectives": [{"agent": "business", "view": result.content}]}

def user_agent(state: CollabState) -> CollabState:
    """User perspective"""
    llm = ChatOpenAI(model="gpt-4o-mini")
    result = llm.invoke(f"User experience perspective on: {state['topic']}")

    return {"perspectives": [{"agent": "user", "view": result.content}]}

def merge_perspectives(state: CollabState) -> CollabState:
    """Merge all perspectives"""
    llm = ChatOpenAI(model="gpt-4o")

    all_views = "\\n\\n".join([f"**{p['agent'].upper()}**: {p['view']}" for p in state["perspectives"]])

    synthesis = llm.invoke(f"""You have 3 perspectives on {state['topic']}.
Create a holistic synthesis:

{all_views}

Synthesis:""")

    return {"synthesis": synthesis.content}

# Build parallel workflow
workflow = StateGraph(CollabState)

workflow.add_node("technical", technical_agent)
workflow.add_node("business", business_agent)
workflow.add_node("user", user_agent)
workflow.add_node("merge", merge_perspectives)

# Parallel entry points (all run at once!)
workflow.set_entry_point("technical")
workflow.set_entry_point("business")
workflow.set_entry_point("user")

# All converge to merge
workflow.add_edge("technical", "merge")
workflow.add_edge("business", "merge")
workflow.add_edge("user", "merge")
workflow.add_edge("merge", END)

app = workflow.compile()

result = app.invoke({"topic": "AI code assistants", "perspectives": []})
print(result["synthesis"])`,
          },
        ],
      },
      {
        step: 4,
        title: "Pattern 3: Sequential handoff",
        blocks: [
          {
            type: "text",
            content:
              "Agent A completes its task, hands off to Agent B:",
          },
          {
            type: "code",
            language: "python",
            label: "Sequential handoff chain",
            code: `from langgraph.graph import StateGraph, END

class HandoffState(TypedDict):
    topic: str
    outline: str
    draft: str
    final: str

def outliner_agent(state: HandoffState) -> HandoffState:
    """Agent 1: Create outline"""
    llm = ChatOpenAI(model="gpt-4o-mini")

    outline = llm.invoke(f"Create a detailed outline for an article about: {state['topic']}")

    return {"outline": outline.content}

def writer_agent(state: HandoffState) -> HandoffState:
    """Agent 2: Write draft from outline"""
    llm = ChatOpenAI(model="gpt-4o-mini")

    draft = llm.invoke(f"""Write a draft article based on this outline:

{state['outline']}

Draft:""")

    return {"draft": draft.content}

def editor_agent(state: HandoffState) -> HandoffState:
    """Agent 3: Edit and polish"""
    llm = ChatOpenAI(model="gpt-4o")

    final = llm.invoke(f"""Edit this draft for clarity and style:

{state['draft']}

Final version:""")

    return {"final": final.content}

# Build handoff chain
workflow = StateGraph(HandoffState)

workflow.add_node("outline", outliner_agent)
workflow.add_node("write", writer_agent)
workflow.add_node("edit", editor_agent)

workflow.set_entry_point("outline")
workflow.add_edge("outline", "write")
workflow.add_edge("write", "edit")
workflow.add_edge("edit", END)

app = workflow.compile()

result = app.invoke({"topic": "Future of AI agents"})
print(result["final"])

# Each agent specializes in one stage of the pipeline`,
          },
        ],
      },
      {
        step: 5,
        title: "Agent communication: shared state vs messages",
        blocks: [
          {
            type: "text",
            content:
              "Two ways for agents to communicate:",
          },
          {
            type: "kv",
            items: [
              { key: "Shared State (LangGraph default)", value: "All agents read/write to global state. Simple, but can have conflicts. Use when: state is structured, agents need full context." },
              { key: "Message Passing", value: "Agents send explicit messages. More isolated, clearer dependencies. Use when: agents are independent, clear handoffs needed." },
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Message-passing pattern",
            code: `from typing import Annotated
from operator import add

class MessageState(TypedDict):
    input: str
    messages: Annotated[list[dict], add]  # Message queue
    output: str

def agent_a(state: MessageState) -> MessageState:
    """Agent A sends message to B"""
    result = "Agent A processed input"

    # Send message to Agent B
    return {
        "messages": [{
            "from": "agent_a",
            "to": "agent_b",
            "content": result
        }]
    }

def agent_b(state: MessageState) -> MessageState:
    """Agent B receives and processes message"""
    # Read messages for me
    my_messages = [m for m in state["messages"] if m["to"] == "agent_b"]

    if my_messages:
        received = my_messages[-1]["content"]
        result = f"Agent B processed: {received}"

        return {
            "messages": [{
                "from": "agent_b",
                "to": "coordinator",
                "content": result
            }]
        }

    return {}

def coordinator(state: MessageState) -> MessageState:
    """Coordinator collects final result"""
    final_msg = [m for m in state["messages"] if m["to"] == "coordinator"]

    if final_msg:
        return {"output": final_msg[-1]["content"]}

    return {}

# Build message-passing workflow
workflow = StateGraph(MessageState)
workflow.add_node("a", agent_a)
workflow.add_node("b", agent_b)
workflow.add_node("coord", coordinator)

workflow.set_entry_point("a")
workflow.add_edge("a", "b")
workflow.add_edge("b", "coord")
workflow.add_edge("coord", END)

app = workflow.compile()

result = app.invoke({"input": "Task", "messages": []})
print(result["output"])`,
          },
        ],
      },
      {
        step: 6,
        title: "Dynamic agent routing",
        blocks: [
          {
            type: "text",
            content:
              "Route to different agents based on task type:",
          },
          {
            type: "code",
            language: "python",
            label: "Dynamic agent selection",
            code: `from langgraph.graph import StateGraph, END

class RoutingState(TypedDict):
    query: str
    query_type: str
    result: str

def classifier(state: RoutingState) -> RoutingState:
    """Classify query to determine which agent to use"""
    llm = ChatOpenAI(model="gpt-4o-mini")

    response = llm.invoke(f"""Classify this query into one category:
- code: Questions about programming, debugging, writing code
- research: Questions requiring web search or data gathering
- creative: Questions about writing, brainstorming, storytelling

Query: {state['query']}
Category:""")

    query_type = response.content.strip().lower()
    return {"query_type": query_type}

# Specialized agents
def code_agent(state: RoutingState) -> RoutingState:
    """Code specialist with code tools"""
    llm = ChatOpenAI(model="gpt-4o")
    result = llm.invoke(f"[Code expert mode] {state['query']}")
    return {"result": result.content}

def research_agent(state: RoutingState) -> RoutingState:
    """Research specialist with search tools"""
    llm = ChatOpenAI(model="gpt-4o")
    result = llm.invoke(f"[Research mode] {state['query']}")
    return {"result": result.content}

def creative_agent(state: RoutingState) -> RoutingState:
    """Creative specialist"""
    llm = ChatOpenAI(model="gpt-4o", temperature=0.9)  # Higher creativity
    result = llm.invoke(f"[Creative mode] {state['query']}")
    return {"result": result.content}

# Router function
def route_to_specialist(state: RoutingState) -> str:
    """Route based on classification"""
    type_map = {
        "code": "code_agent",
        "research": "research_agent",
        "creative": "creative_agent"
    }
    return type_map.get(state["query_type"], "creative_agent")

# Build routing workflow
workflow = StateGraph(RoutingState)

workflow.add_node("classify", classifier)
workflow.add_node("code_agent", code_agent)
workflow.add_node("research_agent", research_agent)
workflow.add_node("creative_agent", creative_agent)

workflow.set_entry_point("classify")

workflow.add_conditional_edges(
    "classify",
    route_to_specialist,
    {
        "code_agent": "code_agent",
        "research_agent": "research_agent",
        "creative_agent": "creative_agent"
    }
)

workflow.add_edge("code_agent", END)
workflow.add_edge("research_agent", END)
workflow.add_edge("creative_agent", END)

app = workflow.compile()

# Test routing
print(app.invoke({"query": "How do I sort a list in Python?"})["result"])
# -> Routes to code_agent

print(app.invoke({"query": "What are the latest AI research papers?"})["result"])
# -> Routes to research_agent`,
          },
        ],
      },
      {
        step: 7,
        title: "Building a complete multi-agent system",
        blocks: [
          {
            type: "text",
            content:
              "Full example: Research report generator with 4 specialized agents:",
          },
          {
            type: "code",
            language: "python",
            label: "Complete multi-agent system",
            code: `from typing import Annotated, Literal
from operator import add
from langgraph.graph import StateGraph, END

class ResearchSystemState(TypedDict):
    topic: str
    research_plan: str
    raw_data: Annotated[list[str], add]
    analysis: str
    report: str
    status: str

# Agent 1: Planner
def planner_agent(state: ResearchSystemState) -> ResearchSystemState:
    """Creates research plan"""
    llm = ChatOpenAI(model="gpt-4o")

    plan = llm.invoke(f"""Create a research plan for: {state['topic']}

What questions should we answer?
What sources should we check?
Return structured plan.""")

    return {"research_plan": plan.content, "status": "plan_ready"}

# Agent 2: Researcher (parallel instances)
def researcher_agent(state: ResearchSystemState) -> ResearchSystemState:
    """Gathers data from web"""
    llm = ChatOpenAI(model="gpt-4o-mini")

    # Use search tool (mock)
    data = llm.invoke(f"Research based on plan: {state['research_plan']}")

    return {"raw_data": [data.content], "status": "research_done"}

# Agent 3: Analyst
def analyst_agent(state: ResearchSystemState) -> ResearchSystemState:
    """Analyzes gathered data"""
    llm = ChatOpenAI(model="gpt-4o")

    all_data = "\\n".join(state["raw_data"])

    analysis = llm.invoke(f"""Analyze this research data:

{all_data}

Key insights:""")

    return {"analysis": analysis.content, "status": "analysis_done"}

# Agent 4: Writer
def writer_agent(state: ResearchSystemState) -> ResearchSystemState:
    """Writes final report"""
    llm = ChatOpenAI(model="gpt-4o")

    report = llm.invoke(f"""Write a research report:

Topic: {state['topic']}
Analysis: {state['analysis']}

Report:""")

    return {"report": report.content, "status": "complete"}

# Build multi-agent workflow
workflow = StateGraph(ResearchSystemState)

workflow.add_node("planner", planner_agent)
workflow.add_node("researcher", researcher_agent)
workflow.add_node("analyst", analyst_agent)
workflow.add_node("writer", writer_agent)

workflow.set_entry_point("planner")
workflow.add_edge("planner", "researcher")
workflow.add_edge("researcher", "analyst")
workflow.add_edge("analyst", "writer")
workflow.add_edge("writer", END)

app = workflow.compile()

# Run complete system
result = app.invoke({"topic": "Impact of AI agents on software development", "raw_data": []})

print(f"Status: {result['status']}")
print(f"Report:\\n{result['report']}")`,
          },
        ],
      },
      {
        step: 8,
        title: "Measuring multi-agent overhead",
        blocks: [
          {
            type: "text",
            content:
              "Multi-agent systems have costs. Measure to decide if it's worth it:",
          },
          {
            type: "code",
            language: "python",
            label: "Performance measurement",
            code: `import time
from langchain.callbacks import get_openai_callback

# Single agent baseline
def single_agent_baseline(query: str):
    """One agent does everything"""
    llm = ChatOpenAI(model="gpt-4o")

    start = time.time()
    with get_openai_callback() as cb:
        result = llm.invoke(f"Answer this comprehensively: {query}")
        elapsed = time.time() - start

        return {
            "result": result.content,
            "time": elapsed,
            "tokens": cb.total_tokens,
            "cost": cb.total_cost
        }

# Multi-agent system
def multi_agent_system(query: str):
    """3 specialized agents"""
    start = time.time()
    with get_openai_callback() as cb:
        result = app.invoke({"topic": query, "raw_data": []})
        elapsed = time.time() - start

        return {
            "result": result["report"],
            "time": elapsed,
            "tokens": cb.total_tokens,
            "cost": cb.total_cost
        }

# Compare
query = "Explain quantum computing"

single = single_agent_baseline(query)
multi = multi_agent_system(query)

print("SINGLE AGENT:")
print(f"  Time: $\{single['time']:.2f}s")
print(f"  Tokens: $\{single['tokens']}")
print(f"  Cost: $$\{single['cost']:.4f}")

print("\\nMULTI-AGENT:")
print(f"  Time: $\{multi['time']:.2f}s")
print(f"  Tokens: $\{multi['tokens']}")
print(f"  Cost: $$\{multi['cost']:.4f}")

print("\\nOVERHEAD:")
print(f"  Time: +$\{(multi['time']/single['time']-1)*100:.1f}%")
print(f"  Cost: +$\{(multi['cost']/single['cost']-1)*100:.1f}%")

# Conclusion:
# Multi-agent worth it IF:
# - Quality gain > cost/latency overhead
# - Modularity/maintainability benefits are significant
# - Parallel execution offsets sequential overhead`,
          },
        ],
      },
      {
        step: 9,
        title: "When to use multi-agent",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "✅ Use multi-agent when", value: "Task needs diverse expertise (code + research + writing), agents can work in parallel (independent subtasks), clear handoffs exist (research → analyze → write), system will evolve (add new agents over time)" },
              { key: "❌ Avoid multi-agent when", value: "Task is simple (single LLM call suffices), coordination overhead > benefits, latency/cost is critical, debugging complexity not worth it" },
            ],
          },
          {
            type: "text",
            content:
              "**Rule of thumb:** If you can't clearly define 3+ specialized roles with distinct tools/prompts, use a single agent.",
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the main advantage of the supervisor pattern in multi-agent systems?",
            options: [
              "Centralized coordination — one agent plans, routes tasks to workers, and synthesizes results, maintaining clear control flow",
              "Supervisor pattern is always faster than other patterns",
              "Supervisor pattern uses less memory",
              "Supervisor pattern requires fewer LLM calls",
            ],
            correct: 0,
            explanation:
              "The supervisor pattern's main advantage is centralized coordination: one supervisor agent plans the work, routes tasks to specialized worker agents, and synthesizes their results into a final answer. This maintains clear control flow and makes the system easier to reason about — you always know which agent is in charge. It's NOT necessarily faster (supervisor adds coordination overhead), doesn't use less memory (all agents load), and doesn't reduce LLM calls (supervisor itself makes calls). The value is in the clear organizational structure and ability to coordinate complex multi-step workflows.",
          },
        ],
      },
    ],
  },
  {
    slug: "production-deployment",
    trackSlug: "langchain-langgraph",
    order: 11,
    minutes: 20,
    title: "Deploying LangChain/LangGraph to Production",
    subtitle: "API deployment, LangServe, observability, error handling, rate limiting, and cost control.",
    tags: ["Production", "Deployment", "LangServe", "Observability"],
    sections: [
      {
        step: 1,
        title: "Production requirements",
        blocks: [
          {
            type: "text",
            content:
              "Your LangChain prototype works locally. To deploy it to production:\n\n- **API endpoint** — expose as HTTP API for frontend/mobile\n- **Observability** — trace requests, measure latency, catch errors\n- **Error handling** — retry transient failures, graceful degradation\n- **Rate limiting** — prevent abuse, control costs\n- **Caching** — reduce redundant LLM calls\n- **Security** — validate inputs, sanitize outputs, prevent injection\n- **Cost monitoring** — track spend per user/request",
          },
        ],
      },
      {
        step: 2,
        title: "LangServe: chains → REST APIs",
        blocks: [
          {
            type: "text",
            content:
              "LangServe turns any LangChain chain into a production API:",
          },
          {
            type: "code",
            language: "python",
            label: "LangServe deployment",
            code: `# pip install "langserve[all]"
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langserve import add_routes

# Define your chain
prompt = ChatPromptTemplate.from_template("Tell me a joke about {topic}")
llm = ChatOpenAI(model="gpt-4o-mini")
chain = prompt | llm

# Create FastAPI app
app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="A simple API server using LangChain's Runnable interfaces",
)

# Add chain as route (one line!)
add_routes(
    app,
    chain,
    path="/joke",
)

# Run: uvicorn app:app --host 0.0.0.0 --port 8000

# Endpoints automatically created:
# POST /joke/invoke - Single request
# POST /joke/batch - Batch requests
# POST /joke/stream - Streaming response
# GET /joke/playground - Interactive UI

# Test with curl:
# curl -X POST "http://localhost:8000/joke/invoke" \\
#   -H "Content-Type: application/json" \\
#   -d '{"input": {"topic": "chickens"}}'`,
          },
        ],
      },
      {
        step: 3,
        title: "Deploying LangGraph applications",
        blocks: [
          {
            type: "text",
            content:
              "Deploy LangGraph apps the same way:",
          },
          {
            type: "code",
            language: "python",
            label: "LangGraph API deployment",
            code: `from fastapi import FastAPI
from langgraph.graph import StateGraph, END
from langserve import add_routes

# Your LangGraph workflow
class State(TypedDict):
    query: str
    result: str

def process(state: State) -> State:
    llm = ChatOpenAI(model="gpt-4o-mini")
    result = llm.invoke(state["query"])
    return {"result": result.content}

workflow = StateGraph(State)
workflow.add_node("process", process)
workflow.set_entry_point("process")
workflow.add_edge("process", END)

graph_app = workflow.compile()

# Deploy as API
app = FastAPI(title="LangGraph API")

add_routes(
    app,
    graph_app,
    path="/agent",
)

# Stream execution:
# curl -X POST "http://localhost:8000/agent/stream" \\
#   -H "Content-Type: application/json" \\
#   -d '{"input": {"query": "What is LangGraph?"}}'`,
          },
        ],
      },
      {
        step: 4,
        title: "Observability with LangSmith",
        blocks: [
          {
            type: "text",
            content:
              "LangSmith provides production tracing, monitoring, and debugging:",
          },
          {
            type: "code",
            language: "python",
            label: "LangSmith tracing",
            code: `import os

# Set LangSmith credentials
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "ls_..."  # From langsmith.com
os.environ["LANGCHAIN_PROJECT"] = "production-rag"  # Project name

# That's it! All LangChain/LangGraph calls now traced automatically

# Run your app
result = chain.invoke({"topic": "AI"})

# View in LangSmith dashboard:
# - Full trace tree (LLM calls, tool calls, timings)
# - Input/output for each step
# - Token usage and cost per request
# - Error stack traces

# Add custom metadata
from langsmith import traceable

@traceable(name="custom_function", metadata={"version": "1.0"})
def my_function(input_data):
    # Your code
    return result

# Query traces programmatically
from langsmith import Client

client = Client()

# Get all traces from last hour with errors
traces = client.list_runs(
    project_name="production-rag",
    error=True,
    start_time="2026-08-26T06:00:00Z"
)

for trace in traces:
    print(f"Error: {trace.error}, Input: {trace.inputs}")`,
          },
        ],
      },
      {
        step: 5,
        title: "Error handling and retries",
        blocks: [
          {
            type: "text",
            content:
              "Handle transient failures gracefully:",
          },
          {
            type: "code",
            language: "python",
            label: "Retry with exponential backoff",
            code: `from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from openai import RateLimitError, APITimeoutError

# Retry on specific errors
@retry(
    retry=retry_if_exception_type((RateLimitError, APITimeoutError)),
    wait=wait_exponential(multiplier=1, min=2, max=60),  # 2s, 4s, 8s, 16s, 32s, 60s
    stop=stop_after_attempt(5)
)
def call_llm_with_retry(prompt: str):
    """Retry on rate limits and timeouts"""
    llm = ChatOpenAI(model="gpt-4o-mini", timeout=30)
    return llm.invoke(prompt)

# Circuit breaker pattern
from datetime import datetime, timedelta

class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failures = 0
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half-open

    def call(self, func, *args, **kwargs):
        if self.state == "open":
            # Check if timeout passed
            if datetime.now() - self.last_failure_time > timedelta(seconds=self.timeout):
                self.state = "half-open"
            else:
                raise Exception("Circuit breaker open - service unavailable")

        try:
            result = func(*args, **kwargs)
            # Success: reset
            if self.state == "half-open":
                self.state = "closed"
                self.failures = 0
            return result

        except Exception as e:
            self.failures += 1
            self.last_failure_time = datetime.now()

            if self.failures >= self.failure_threshold:
                self.state = "open"

            raise e

# Usage
breaker = CircuitBreaker()

def make_request():
    return breaker.call(call_llm_with_retry, "Hello")`,
          },
        ],
      },
      {
        step: 6,
        title: "Rate limiting",
        blocks: [
          {
            type: "text",
            content:
              "Prevent abuse and control costs with rate limiting:",
          },
          {
            type: "code",
            language: "python",
            label: "Rate limiting with FastAPI",
            code: `# pip install slowapi
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI, Request

# Create limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply rate limit to endpoint
@app.post("/joke/invoke")
@limiter.limit("10/minute")  # Max 10 requests per minute per IP
async def invoke_joke(request: Request, data: dict):
    result = chain.invoke(data["input"])
    return {"output": result.content}

# Per-user rate limiting (requires auth)
def get_user_id(request: Request):
    # Extract from JWT token or API key
    return request.headers.get("X-User-ID", "anonymous")

limiter_user = Limiter(key_func=get_user_id)

@app.post("/premium/invoke")
@limiter_user.limit("100/hour")  # Higher limit for authenticated users
async def premium_invoke(request: Request, data: dict):
    result = chain.invoke(data["input"])
    return {"output": result.content}

# Token budget per request
MAX_TOKENS_PER_REQUEST = 4000

@app.post("/limited/invoke")
async def limited_invoke(request: Request, data: dict):
    # Estimate input tokens (rough)
    input_tokens = len(str(data["input"])) // 4

    if input_tokens > MAX_TOKENS_PER_REQUEST:
        return {"error": "Input too large"}, 400

    result = chain.invoke(data["input"])
    return {"output": result.content}`,
          },
        ],
      },
      {
        step: 7,
        title: "Caching for cost reduction",
        blocks: [
          {
            type: "text",
            content:
              "Cache LLM responses to avoid redundant expensive calls:",
          },
          {
            type: "code",
            language: "python",
            label: "LLM response caching",
            code: `from langchain.cache import InMemoryCache, RedisCache, SQLiteCache
from langchain.globals import set_llm_cache
import langchain

# Option 1: In-memory cache (dev/testing)
set_llm_cache(InMemoryCache())

# Option 2: Redis cache (production, distributed)
from redis import Redis
set_llm_cache(RedisCache(redis_=Redis(host="localhost", port=6379)))

# Option 3: SQLite cache (simple persistent)
set_llm_cache(SQLiteCache(database_path=".langchain.db"))

# Now all LLM calls automatically cache
llm = ChatOpenAI(model="gpt-4o-mini")

# First call: hits LLM
response1 = llm.invoke("What is Python?")  # 2s, costs $0.001

# Identical call: returns cached
response2 = llm.invoke("What is Python?")  # <10ms, free!

# Semantic caching (cache similar queries)
from langchain.cache import RedisSemanticCache
from langchain_openai import OpenAIEmbeddings

set_llm_cache(
    RedisSemanticCache(
        redis_url="redis://localhost:6379",
        embedding=OpenAIEmbeddings(),
        score_threshold=0.9  # Similarity threshold
    )
)

# These are semantically similar, second one hits cache
llm.invoke("What is Python?")
llm.invoke("Tell me about the Python programming language")  # Cache hit!`,
          },
        ],
      },
      {
        step: 8,
        title: "Security: input validation and sanitization",
        blocks: [
          {
            type: "text",
            content:
              "Protect against prompt injection and malicious inputs:",
          },
          {
            type: "code",
            language: "python",
            label: "Input/output security",
            code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
import re

class QueryInput(BaseModel):
    query: str = Field(..., max_length=2000)  # Limit length

    @validator("query")
    def validate_query(cls, v):
        # Block obvious injection attempts
        dangerous_patterns = [
            r"ignore (previous|above|all) (instructions|rules)",
            r"you are now",
            r"system:",
            r"<script>",
        ]

        for pattern in dangerous_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError("Invalid input detected")

        return v.strip()

app = FastAPI()

@app.post("/query")
async def query_endpoint(input_data: QueryInput):
    """Validated endpoint"""

    # Additional check: rate limit tokens
    if len(input_data.query.split()) > 500:
        raise HTTPException(status_code=400, detail="Query too long")

    # Sanitize output (remove sensitive info)
    result = chain.invoke({"query": input_data.query})

    # Filter output
    output = sanitize_output(result.content)

    return {"result": output}

def sanitize_output(text: str) -> str:
    """Remove potentially sensitive patterns"""
    # Remove what look like API keys
    text = re.sub(r'sk-[a-zA-Z0-9]{32,}', '[REDACTED]', text)

    # Remove email addresses (if sensitive)
    text = re.sub(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', '[EMAIL]', text)

    return text`,
          },
        ],
      },
      {
        step: 9,
        title: "Cost monitoring and alerts",
        blocks: [
          {
            type: "text",
            content:
              "Track costs in production and alert when thresholds exceeded:",
          },
          {
            type: "code",
            language: "python",
            label: "Cost tracking",
            code: `from langchain.callbacks import get_openai_callback
from datetime import datetime
import sqlite3

# Track costs per request
def track_cost(user_id: str, endpoint: str, tokens: int, cost: float):
    """Log cost to database"""
    conn = sqlite3.connect("costs.db")
    conn.execute("""
        INSERT INTO costs (user_id, endpoint, tokens, cost, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, endpoint, tokens, cost, datetime.now()))
    conn.commit()
    conn.close()

# Middleware to track all requests
@app.post("/tracked/invoke")
async def tracked_invoke(request: Request, data: dict):
    user_id = request.headers.get("X-User-ID", "anonymous")

    with get_openai_callback() as cb:
        result = chain.invoke(data["input"])

        # Log cost
        track_cost(user_id, "/tracked/invoke", cb.total_tokens, cb.total_cost)

        # Alert if high cost
        if cb.total_cost > 0.10:  # $0.10 threshold
            send_alert(f"High cost request: $$\{cb.total_cost:.4f} by $\{user_id}")

        return {"output": result.content, "cost": cb.total_cost}

# Daily cost report
def daily_cost_report():
    """Generate daily cost summary"""
    conn = sqlite3.connect("costs.db")
    cursor = conn.execute("""
        SELECT user_id, SUM(cost), SUM(tokens)
        FROM costs
        WHERE date(timestamp) = date('now')
        GROUP BY user_id
        ORDER BY SUM(cost) DESC
    """)

    print("Daily Cost Report:")
    for row in cursor:
        print(f"  User $\{row[0]}: $$\{row[1]:.4f} ($\{row[2]} tokens)")

    conn.close()

def send_alert(message: str):
    """Send alert to Slack/email"""
    # Integration with alerting service
    print(f"ALERT: {message}")`,
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the main benefit of LangServe for production deployment?",
            options: [
              "Automatically converts any LangChain chain or LangGraph workflow into a production REST API with streaming, batch, and playground endpoints",
              "LangServe makes LLMs faster",
              "LangServe reduces costs",
              "LangServe improves model accuracy",
            ],
            correct: 0,
            explanation:
              "LangServe's main benefit is automatically converting LangChain chains and LangGraph workflows into production-ready REST APIs. With one line (add_routes), you get: POST /invoke (single request), POST /batch (batch processing), POST /stream (streaming response), and GET /playground (interactive UI). This eliminates boilerplate API code and standardizes your deployment. LangServe doesn't make LLMs faster (that's about model choice and caching), doesn't reduce costs (that's about prompt optimization and caching), and doesn't improve accuracy (that's about prompt engineering and fine-tuning).",
          },
        ],
      },
    ],
  },
  {
    slug: "project-conversational-rag",
    trackSlug: "langchain-langgraph",
    order: 12,
    minutes: 35,
    title: "Project: Conversational RAG with LangGraph",
    subtitle: "Build a stateful RAG system with memory, conversation history, source tracking, and human-in-the-loop.",
    tags: ["Project", "RAG", "LangGraph", "Full stack"],
    sections: [
      {
        step: 1,
        title: "Project overview",
        blocks: [
          {
            type: "text",
            content:
              "Build a **production-ready conversational RAG system** that:\n\n✅ **Remembers conversation context** — 'what about costs?' becomes 'costs for the refund policy'\n✅ **Cites sources** — every answer includes document references\n✅ **Detects uncertainty** — escalates to human when confidence is low\n✅ **Handles follow-ups** — understands pronouns and references\n✅ **Deployed as API** — ready for frontend integration\n\n**Tech stack:** LangGraph, LangChain, Chroma, LangSmith, FastAPI, OpenAI",
          },
          {
            type: "diagram",
            label: "System architecture",
            chart: `graph TD
    U[User Query] --> C[Context Builder]
    C --> |Rewrite with history| R[Retriever]
    R --> |Top K docs| G[Generator]
    G --> |Answer + confidence| Q{Confidence Check}
    Q --> |High| F[Format Response]
    Q --> |Low| H[Human Escalation]
    H --> F
    F --> O[Output with Sources]

    M[Memory] -.-> C
    M -.-> G

    style Q fill:#fff3cd
    style H fill:#f8d7da
    style F fill:#d4edda`,
          },
        ],
      },
      {
        step: 2,
        title: "Step 1: Document ingestion and indexing",
        blocks: [
          {
            type: "text",
            content:
              "Load documents, chunk them, and index into vector database:",
          },
          {
            type: "code",
            language: "python",
            label: "Document ingestion pipeline",
            code: `# pip install langchain chromadb pypdf beautifulsoup4
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# 1. Load documents from multiple sources
def load_documents():
    """Load PDFs and web pages"""
    documents = []

    # Load PDFs
    pdf_paths = ["docs/policy.pdf", "docs/faq.pdf"]
    for path in pdf_paths:
        loader = PyPDFLoader(path)
        documents.extend(loader.load())

    # Load web pages
    urls = [
        "https://example.com/docs/getting-started",
        "https://example.com/docs/api-reference"
    ]
    web_loader = WebBaseLoader(urls)
    documents.extend(web_loader.load())

    print(f"Loaded {len(documents)} documents")
    return documents

# 2. Chunk documents
def chunk_documents(documents):
    """Split into manageable chunks"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\\n\\n", "\\n", ". ", " ", ""]
    )

    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks")
    return chunks

# 3. Create vector store
def create_vector_store(chunks):
    """Embed and index in Chroma"""
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="./chroma_db",
        collection_name="docs"
    )

    print("Vector store created")
    return vectorstore

# Run ingestion
documents = load_documents()
chunks = chunk_documents(documents)
vectorstore = create_vector_store(chunks)`,
          },
        ],
      },
      {
        step: 3,
        title: "Step 2: Design state schema",
        blocks: [
          {
            type: "text",
            content:
              "Define the graph state that flows through nodes:",
          },
          {
            type: "code",
            language: "python",
            label: "State schema",
            code: `from typing import Annotated, Literal
from operator import add
from pydantic import BaseModel, Field

class Message(BaseModel):
    """Single conversation message"""
    role: Literal["user", "assistant"]
    content: str

class RetrievedDoc(BaseModel):
    """Retrieved document chunk"""
    content: str
    source: str
    score: float

class ConversationalRAGState(TypedDict):
    # Input
    user_query: str

    # Conversation history
    messages: Annotated[list[Message], add]

    # Query processing
    rewritten_query: str  # Context-aware rewrite

    # Retrieval
    retrieved_docs: list[RetrievedDoc]

    # Generation
    answer: str
    confidence: float
    sources: list[str]

    # Control flow
    needs_clarification: bool
    clarification_question: str`,
          },
        ],
      },
      {
        step: 4,
        title: "Step 3: Context-aware query rewriting",
        blocks: [
          {
            type: "text",
            content:
              "Rewrite user query with conversation context:",
          },
          {
            type: "code",
            language: "python",
            label: "Query rewriter node",
            code: `from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

def rewrite_query_node(state: ConversationalRAGState) -> ConversationalRAGState:
    """Rewrite query with conversation context"""

    # If no history, use query as-is
    if not state.get("messages"):
        return {"rewritten_query": state["user_query"]}

    # Build conversation context
    history = "\\n".join([
        f"{msg.role}: {msg.content}"
        for msg in state["messages"][-5:]  # Last 5 turns
    ])

    # Rewrite query
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    prompt = ChatPromptTemplate.from_template("""Given this conversation history:

{history}

The user just asked: {query}

Rewrite this query to be self-contained. Resolve pronouns and references.

Examples:
- "what about costs?" → "what about costs for the refund policy we just discussed?"
- "how do I do that?" → "how do I configure the API authentication mentioned earlier?"

Rewritten query:""")

    response = llm.invoke(prompt.format(history=history, query=state["user_query"]))

    return {"rewritten_query": response.content}`,
          },
        ],
      },
      {
        step: 5,
        title: "Step 4: Retrieval node",
        blocks: [
          {
            type: "text",
            content:
              "Retrieve relevant documents using the rewritten query:",
          },
          {
            type: "code",
            language: "python",
            label: "Retrieval node",
            code: `def retrieve_docs_node(state: ConversationalRAGState) -> ConversationalRAGState:
    """Retrieve relevant documents"""

    # Use rewritten query for retrieval
    query = state["rewritten_query"]

    # Retrieve with scores
    results = vectorstore.similarity_search_with_score(
        query,
        k=5  # Top 5 chunks
    )

    # Convert to RetrievedDoc objects
    retrieved_docs = [
        RetrievedDoc(
            content=doc.page_content,
            source=doc.metadata.get("source", "unknown"),
            score=float(score)
        )
        for doc, score in results
    ]

    return {"retrieved_docs": retrieved_docs}`,
          },
        ],
      },
      {
        step: 6,
        title: "Step 5: Answer generation with sources",
        blocks: [
          {
            type: "text",
            content:
              "Generate answer with citations:",
          },
          {
            type: "code",
            language: "python",
            label: "Generator node",
            code: `def generate_answer_node(state: ConversationalRAGState) -> ConversationalRAGState:
    """Generate answer with source citations"""

    llm = ChatOpenAI(model="gpt-4o", temperature=0)

    # Format retrieved docs
    context = "\\n\\n".join([
        f"[Source {i+1}: {doc.source}]\\n{doc.content}"
        for i, doc in enumerate(state["retrieved_docs"])
    ])

    prompt = ChatPromptTemplate.from_template("""Answer the question based ONLY on the following context.
Cite sources using [Source N] notation.
If the context doesn't contain enough information, say so and assign low confidence.

Context:
{context}

Question: {query}

Answer with citations:""")

    response = llm.invoke(prompt.format(
        context=context,
        query=state["user_query"]
    ))

    # Estimate confidence (simple heuristic)
    answer = response.content
    confidence = estimate_confidence(answer, state["retrieved_docs"])

    # Extract sources
    sources = list(set([doc.source for doc in state["retrieved_docs"]]))

    return {
        "answer": answer,
        "confidence": confidence,
        "sources": sources
    }

def estimate_confidence(answer: str, docs: list[RetrievedDoc]) -> float:
    """Estimate answer confidence"""

    # Heuristics:
    # - Contains "I don't know" or "not enough information" → low confidence
    # - Low retrieval scores → low confidence
    # - Multiple high-score docs → high confidence

    if "don't know" in answer.lower() or "not enough" in answer.lower():
        return 0.3

    avg_score = sum(d.score for d in docs) / len(docs) if docs else 0

    # Normalize score to 0-1 range (adjust based on your embedding model)
    confidence = max(0.0, min(1.0, 1.0 - avg_score / 2.0))

    return confidence`,
          },
        ],
      },
      {
        step: 7,
        title: "Step 6: Confidence check and escalation",
        blocks: [
          {
            type: "text",
            content:
              "Route to human if confidence is low:",
          },
          {
            type: "code",
            language: "python",
            label: "Confidence router",
            code: `CONFIDENCE_THRESHOLD = 0.7

def check_confidence(state: ConversationalRAGState) -> Literal["respond", "escalate"]:
    """Decide: respond or escalate to human"""

    if state["confidence"] < CONFIDENCE_THRESHOLD:
        return "escalate"

    return "respond"

def escalate_to_human_node(state: ConversationalRAGState) -> ConversationalRAGState:
    """Generate clarification question for human"""

    llm = ChatOpenAI(model="gpt-4o-mini")

    prompt = f"""The system couldn't confidently answer this question: {state['user_query']}

Current answer: {state['answer']}
Confidence: {state['confidence']:.2f}

Generate a clarification question to ask the user.

Clarification question:"""

    response = llm.invoke(prompt)

    return {
        "needs_clarification": True,
        "clarification_question": response.content
    }

def format_response_node(state: ConversationalRAGState) -> ConversationalRAGState:
    """Format final response"""

    # Add to conversation history
    messages = [
        Message(role="user", content=state["user_query"]),
        Message(role="assistant", content=state["answer"])
    ]

    return {"messages": messages}`,
          },
        ],
      },
      {
        step: 8,
        title: "Step 7: Build the complete graph",
        blocks: [
          {
            type: "text",
            content:
              "Assemble all nodes into a LangGraph workflow:",
          },
          {
            type: "code",
            language: "python",
            label: "Complete LangGraph workflow",
            code: `from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver

# Build graph
workflow = StateGraph(ConversationalRAGState)

# Add nodes
workflow.add_node("rewrite", rewrite_query_node)
workflow.add_node("retrieve", retrieve_docs_node)
workflow.add_node("generate", generate_answer_node)
workflow.add_node("escalate", escalate_to_human_node)
workflow.add_node("format", format_response_node)

# Define flow
workflow.set_entry_point("rewrite")
workflow.add_edge("rewrite", "retrieve")
workflow.add_edge("retrieve", "generate")

# Conditional: check confidence
workflow.add_conditional_edges(
    "generate",
    check_confidence,
    {
        "respond": "format",
        "escalate": "escalate"
    }
)

workflow.add_edge("format", END)
workflow.add_edge("escalate", END)

# Compile with checkpointing
checkpointer = SqliteSaver.from_conn_string("checkpoints.db")
app = workflow.compile(checkpointer=checkpointer)

# Visualize
print(app.get_graph().draw_mermaid())`,
          },
        ],
      },
      {
        step: 9,
        title: "Step 8: Deploy as API",
        blocks: [
          {
            type: "text",
            content:
              "Deploy with LangServe:",
          },
          {
            type: "code",
            language: "python",
            label: "API deployment",
            code: `from fastapi import FastAPI
from langserve import add_routes
import os

# Enable LangSmith tracing
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "ls_..."
os.environ["LANGCHAIN_PROJECT"] = "conversational-rag"

# Create API
api = FastAPI(
    title="Conversational RAG API",
    version="1.0",
    description="Stateful RAG with memory and human-in-the-loop"
)

# Add routes
add_routes(
    api,
    app,
    path="/rag",
)

# Custom endpoint with session management
from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str
    session_id: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
    confidence: float
    needs_clarification: bool
    clarification_question: str | None

@api.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Stateful chat endpoint"""

    config = {"configurable": {"thread_id": request.session_id}}

    result = app.invoke(
        {"user_query": request.query, "messages": []},
        config
    )

    return ChatResponse(
        answer=result.get("answer", ""),
        sources=result.get("sources", []),
        confidence=result.get("confidence", 0.0),
        needs_clarification=result.get("needs_clarification", False),
        clarification_question=result.get("clarification_question")
    )

# Run: uvicorn app:api --reload`,
          },
        ],
      },
      {
        step: 10,
        title: "Step 9: Test and evaluate",
        blocks: [
          {
            type: "text",
            content:
              "Test the complete system:",
          },
          {
            type: "code",
            language: "python",
            label: "End-to-end test",
            code: `# Test conversation flow
config = {"configurable": {"thread_id": "test-session-1"}}

# Turn 1
result1 = app.invoke(
    {"user_query": "What is the refund policy?", "messages": []},
    config
)
print(f"Answer: {result1['answer']}")
print(f"Sources: {result1['sources']}")
print(f"Confidence: {result1['confidence']:.2f}")

# Turn 2: Follow-up with pronoun
result2 = app.invoke(
    {"user_query": "What about costs?", "messages": []},
    config
)
# System rewrites "What about costs?" to "What about costs for the refund policy?"
print(f"\\nRewritten: {result2['rewritten_query']}")
print(f"Answer: {result2['answer']}")

# Turn 3: Ambiguous query (should escalate)
result3 = app.invoke(
    {"user_query": "Tell me about the quantum flux capacitor"},
    config
)
if result3['needs_clarification']:
    print(f"\\nEscalated: {result3['clarification_question']}")

# Evaluate quality
from langchain.evaluation import load_evaluator

# Faithfulness: is answer grounded in retrieved docs?
evaluator = load_evaluator("labeled_score_string")

score = evaluator.evaluate_strings(
    prediction=result1['answer'],
    input=result1['user_query'],
    reference="\\n".join([d.content for d in result1['retrieved_docs']])
)
print(f"\\nFaithfulness score: {score['score']}")`,
          },
        ],
      },
      {
        step: 11,
        title: "Project extensions",
        blocks: [
          {
            type: "text",
            content:
              "Extend your project with these features:\n\n🚀 **Hybrid search** — combine semantic + keyword retrieval\n🚀 **Query decomposition** — break complex questions into sub-questions\n🚀 **Multi-modal** — add image/diagram search\n🚀 **Feedback loop** — let users rate answers, fine-tune retrieval\n🚀 **Advanced memory** — entity extraction, summarization for long conversations\n🚀 **Production monitoring** — Grafana dashboards for latency/cost/quality\n🚀 **A/B testing** — compare different retrieval strategies",
          },
        ],
      },
      {
        step: 12,
        title: "Congratulations!",
        blocks: [
          {
            type: "text",
            content:
              "🎉 You've built a **production-ready conversational RAG system** with:\n\n✅ Context-aware query rewriting\n✅ Document retrieval with source citations\n✅ Confidence-based escalation\n✅ Stateful conversation memory\n✅ LangSmith tracing\n✅ REST API deployment\n\n**Next steps:**\n- Deploy to production (AWS, Modal, Vercel)\n- Add a frontend (React, Streamlit)\n- Integrate with your knowledge base\n- Measure and optimize quality\n\n**Portfolio tip:** This project demonstrates:\n- LangGraph orchestration\n- RAG implementation\n- Production best practices\n- Full-stack AI engineering\n\nAdd it to your GitHub with a README showing the architecture diagram and demo!",
          },
        ],
      },
    ],
  },
];
