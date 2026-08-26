import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — AI Agents Fundamentals (fully written as the reference)
// ---------------------------------------------------------------------------
const aiAgentsFundamentalsLesson: Lesson = {
  slug: "ai-agents-fundamentals",
  trackSlug: "ai-agents",
  order: 1,
  minutes: 22,
  title: "AI Agents Fundamentals",
  subtitle:
    "From static prompts to autonomous systems — how agents reason, act, and achieve goals through tool use and iterative decision-making.",
  tags: ["Agents", "Tool use", "ReAct", "First principles"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Traditional LLM applications are **stateless and single-turn**: you send a prompt, get a response, done. This works for Q&A, summarization, classification. But what about tasks that require:\n\n- **Multiple steps** — search Google, read results, synthesize answer\n- **Tool use** — call APIs, query databases, execute code\n- **Dynamic planning** — decide next action based on previous results\n- **Error recovery** — retry if a tool call fails, adjust strategy\n- **Long-running workflows** — multi-day research, iterative debugging\n\nThe problem: how do you build an LLM system that can **autonomously pursue a goal** across many steps, not just respond to a single query?",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "An **agent** is an LLM in a loop: observe → reason → act → observe. The LLM decides what to do next based on what happened last.",
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
            "Agents unlock a new category of AI applications:",
        },
        {
          type: "kv",
          items: [
            { key: "Personal assistants", value: "Book flights, manage calendar, draft emails — multi-step tasks that require tool use and state management." },
            { key: "Research & analysis", value: "Gather data from multiple sources, synthesize findings, generate reports — hours of work compressed into minutes." },
            { key: "Code automation", value: "Debug errors, write tests, refactor code — iterative problem-solving that mirrors human workflows." },
            { key: "Customer support", value: "Look up order status, process refunds, escalate to human — dynamic workflows based on user intent." },
            { key: "Data pipelines", value: "Extract, transform, load — orchestrate tools and handle errors autonomously." },
          ],
        },
        {
          type: "text",
          content:
            "The shift from **tool** to **agent** is like the shift from calculator to computer. A calculator performs one operation. A computer runs programs that orchestrate many operations. Agents are programs for LLMs.",
        },
      ],
    },
    {
      step: 3,
      title: "Anatomy of an agent",
      blocks: [
        {
          type: "text",
          content:
            "Every agent has four core components:",
        },
        {
          type: "kv",
          items: [
            { key: "1. Brain (LLM)", value: "The decision-maker. Observes state, reasons about next action, generates tool calls or final answer." },
            { key: "2. Tools", value: "Actions the agent can take — search, calculator, database query, API call, file write, code execution." },
            { key: "3. Memory", value: "Conversation history, observations, tool results. The agent's working context." },
            { key: "4. Control loop", value: "Orchestrates: call LLM → parse decision → execute tool → update memory → repeat until done." },
          ],
        },
        {
          type: "diagram",
          label: "Agent control loop",
          chart: `graph LR
    A[User Goal] --> B[LLM: Reason & Plan]
    B --> C{Tool Call or Answer?}
    C -->|Tool Call| D[Execute Tool]
    C -->|Final Answer| H[Done]
    D --> E[Observe Result]
    E --> F[Update Memory]
    F --> B

    style A fill:#e1f5ff
    style H fill:#d4edda
    style B fill:#fff3cd
    style D fill:#f8d7da`,
        },
        {
          type: "text",
          content:
            "The loop continues until the LLM decides it has enough information to answer the user's query. This is **agentic behavior** — iterative, goal-directed, autonomous.",
        },
      ],
    },
    {
      step: 4,
      title: "The ReAct pattern: Reason + Act",
      blocks: [
        {
          type: "text",
          content:
            "**ReAct** (Reasoning and Acting) is the foundational agent pattern. At each step, the agent:",
        },
        {
          type: "list",
          style: "number",
          items: [
            "**Thought** — reasons about what to do next (internal monologue)",
            "**Action** — chooses a tool and parameters to call",
            "**Observation** — receives the tool's result",
            "Repeat until it has the final answer",
          ],
        },
        {
          type: "text",
          content:
            "**Example:** User asks \"What's the weather in the capital of France?\"\n\nThe agent doesn't know the capital or the weather. It must:\n1. **Thought**: I need to find the capital of France\n2. **Action**: search(\"capital of France\")\n3. **Observation**: \"Paris\"\n4. **Thought**: Now I need the weather in Paris\n5. **Action**: weather_api(\"Paris\")\n6. **Observation**: \"Sunny, 22°C\"\n7. **Thought**: I have the answer\n8. **Final Answer**: \"The weather in Paris is sunny, 22°C.\"",
        },
        {
          type: "code",
          language: "python",
          label: "ReAct prompt template",
          code: `# The prompt structure for ReAct agents
REACT_PROMPT = """You are an AI agent that can use tools to answer questions.

Available tools:
- search(query: str) -> str: Search Google
- calculator(expression: str) -> float: Evaluate math
- weather(city: str) -> str: Get current weather

Use this format:
Thought: [your reasoning about what to do next]
Action: [tool_name(arguments)]
Observation: [result from tool - this will be provided]
... (repeat Thought/Action/Observation as needed)
Thought: I now know the final answer
Final Answer: [your response to the user]

Question: {question}
{history}
"""`,
        },
      ],
    },
    {
      step: 5,
      title: "Building a simple agent from scratch",
      blocks: [
        {
          type: "text",
          content:
            "Let's build a minimal ReAct agent in 60 lines of Python:",
        },
        {
          type: "code",
          language: "python",
          label: "Minimal ReAct agent implementation",
          code: `import re
from openai import OpenAI

client = OpenAI()

# Define tools
def search(query: str) -> str:
    """Fake search - in production, call Google/Bing API"""
    results = {
        "capital of France": "Paris",
        "population of Paris": "2.2 million",
    }
    return results.get(query, "No results found")

def calculator(expression: str) -> str:
    """Evaluate math expression"""
    try:
        return str(eval(expression))
    except:
        return "Invalid expression"

TOOLS = {
    "search": search,
    "calculator": calculator,
}

def run_agent(question: str, max_steps: int = 10):
    """ReAct agent loop"""
    prompt = f"""You can use these tools: search(query), calculator(expr).

Format:
Thought: [reasoning]
Action: tool_name(arguments)
Observation: [will be provided]
...
Final Answer: [response]

Question: {question}
"""

    history = prompt

    for step in range(max_steps):
        # LLM decides next action
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": history}],
            temperature=0
        )

        output = response.choices[0].message.content
        history += output + "\\n"

        print(f"\\n--- Step {step + 1} ---")
        print(output)

        # Check if done
        if "Final Answer:" in output:
            final = output.split("Final Answer:")[1].strip()
            return final

        # Parse and execute action
        action_match = re.search(r'Action: (\\w+)\\(([^)]+)\\)', output)
        if action_match:
            tool_name = action_match.group(1)
            args = action_match.group(2).strip('\\"').strip("'")

            if tool_name in TOOLS:
                result = TOOLS[tool_name](args)
                observation = f"Observation: {result}\\n"
                history += observation
                print(observation)
            else:
                history += "Observation: Tool not found\\n"
        else:
            # LLM didn't follow format, prompt it
            history += "Observation: Invalid format. Use Action: tool(args)\\n"

    return "Max steps reached without answer"

# Test it
answer = run_agent("What's 15% of 200, and what's the capital of France?")
print(f"\\n=== Final Answer ===\\n{answer}")`,
        },
        {
          type: "text",
          content:
            "**This 60-line agent can:**\n- Reason about which tool to use\n- Call multiple tools in sequence\n- Combine results from different tools\n- Recover from errors (tool not found, invalid format)\n\nThis is the **core pattern** that powers LangChain agents, AutoGPT, and production agent frameworks.",
        },
      ],
    },
    {
      step: 6,
      title: "Tool calling: the modern agent interface",
      blocks: [
        {
          type: "text",
          content:
            "The ReAct pattern requires the LLM to generate structured text (Action: tool(args)). This is fragile — the LLM might use the wrong format, misspell tool names, or mess up arguments.\n\n**Tool calling** (formerly 'function calling') is a native API feature in GPT-4, Claude, Gemini. The LLM returns structured JSON for tool calls:",
        },
        {
          type: "code",
          language: "python",
          label: "Modern agent with tool calling",
          code: `from openai import OpenAI

client = OpenAI()

# Define tools in OpenAI's schema
tools = [
    {
        "type": "function",
        "function": {
            "name": "search",
            "description": "Search Google for information",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": "Evaluate a mathematical expression",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "Math expression"}
                },
                "required": ["expression"]
            }
        }
    }
]

def run_agent_with_tools(question: str, max_steps: int = 10):
    """Agent using native tool calling"""
    messages = [{"role": "user", "content": question}]

    for step in range(max_steps):
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
            tool_choice="auto"  # Let model decide when to use tools
        )

        message = response.choices[0].message

        # Check if done (no tool calls)
        if not message.tool_calls:
            return message.content

        # Execute tool calls
        messages.append(message)  # Add assistant's response

        for tool_call in message.tool_calls:
            tool_name = tool_call.function.name
            args = eval(tool_call.function.arguments)

            # Execute tool (same as before)
            if tool_name == "search":
                result = search(args["query"])
            elif tool_name == "calculator":
                result = calculator(args["expression"])
            else:
                result = "Tool not found"

            # Add tool result to messages
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result
            })

    return "Max steps reached"

# Test
answer = run_agent_with_tools("What's 15% of 200?")
print(answer)`,
        },
        {
          type: "text",
          content:
            "**Benefits of tool calling:**\n- No prompt engineering to get structured output\n- Type checking on arguments (LLM must provide required params)\n- Parallel tool calls (LLM can call multiple tools at once)\n- Better reliability (less likely to break with edge cases)",
        },
      ],
    },
    {
      step: 7,
      title: "Memory: short-term vs long-term",
      blocks: [
        {
          type: "text",
          content:
            "Agents need memory to maintain context across turns:",
        },
        {
          type: "kv",
          items: [
            { key: "Short-term (working memory)", value: "Conversation history, tool results. Lives in the prompt context window. Cleared when conversation ends." },
            { key: "Long-term (episodic memory)", value: "Facts, user preferences, past conversations. Stored in vector DB or database. Retrieved when relevant." },
          ],
        },
        {
          type: "text",
          content:
            "**Short-term memory** is the messages array you send to the LLM:\n\n```python\nmessages = [\n  {\"role\": \"user\", \"content\": \"Book a flight to Paris\"},\n  {\"role\": \"assistant\", \"content\": \"When would you like to travel?\"},\n  {\"role\": \"user\", \"content\": \"Next Friday\"},\n  # LLM sees all previous messages\n]\n```\n\n**Long-term memory** requires retrieval:\n\n```python\n# User asks: \"What restaurants did I like in Paris?\"\n# Retrieve from vector DB\nsimilar_memories = memory_db.search(\"Paris restaurants I liked\")\n# Add to prompt context\nmessages.append({\"role\": \"system\", \"content\": f\"Relevant memories: {similar_memories}\"})\n```",
        },
      ],
    },
    {
      step: 8,
      title: "Agent frameworks: LangChain and LangGraph",
      blocks: [
        {
          type: "text",
          content:
            "Building agents from scratch is educational but tedious. Production systems use frameworks:",
        },
        {
          type: "kv",
          items: [
            { key: "LangChain", value: "High-level abstractions for chains, agents, tools, memory. Great for prototyping. Can be too magical for debugging." },
            { key: "LangGraph", value: "Graph-based agent workflows. Explicit control flow (cycles, conditionals, parallel execution). More verbose but debuggable." },
            { key: "Anthropic SDK", value: "Native tool use with Claude. Lightweight, no framework needed. Good for simple agents." },
            { key: "OpenAI Assistants API", value: "Managed agents with built-in code interpreter, retrieval, tools. Less control but zero infra." },
          ],
        },
        {
          type: "code",
          language: "python",
          label: "LangChain agent (high-level)",
          code: `from langchain_openai import ChatOpenAI
from langchain.agents import Tool, initialize_agent, AgentType
from langchain.tools import DuckDuckGoSearchRun

# Define tools
search = DuckDuckGoSearchRun()
tools = [
    Tool(
        name="Search",
        func=search.run,
        description="Search the web for current information"
    )
]

# Create agent
llm = ChatOpenAI(model="gpt-4o", temperature=0)
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,  # Uses tool calling
    verbose=True
)

# Run
result = agent.run("What's the latest news on GPT-5?")
print(result)`,
        },
        {
          type: "text",
          content:
            "**When to use a framework:**\n- Multi-tool agents (5+ tools)\n- Complex workflows (parallel execution, error handling, retries)\n- Memory and state management\n- Integration with existing tools (SQL, APIs, file systems)\n\n**When to build from scratch:**\n- Learning agent internals (do this first!)\n- Simple single-tool agents\n- Performance-critical systems (frameworks add overhead)\n- Custom control flow that frameworks don't support",
        },
      ],
    },
    {
      step: 9,
      title: "Multi-agent systems",
      blocks: [
        {
          type: "text",
          content:
            "One agent is good. Multiple specialized agents can be better:",
        },
        {
          type: "diagram",
          label: "Multi-agent architecture",
          chart: `graph TD
    A[User Query] --> B[Router Agent]
    B -->|Code question| C[Code Agent]
    B -->|Research question| D[Research Agent]
    B -->|Math question| E[Math Agent]

    C --> F[Code Executor Tool]
    C --> G[GitHub Tool]

    D --> H[Search Tool]
    D --> I[Wikipedia Tool]

    E --> J[Calculator Tool]
    E --> K[Wolfram Alpha Tool]

    C --> L[Synthesizer Agent]
    D --> L
    E --> L
    L --> M[Final Answer]

    style A fill:#e1f5ff
    style B fill:#fff3cd
    style L fill:#fff3cd
    style M fill:#d4edda`,
        },
        {
          type: "text",
          content:
            "**Common patterns:**\n\n- **Delegation** — router agent assigns tasks to specialist agents\n- **Collaboration** — agents work in parallel, results are merged\n- **Debate** — agents propose different solutions, strongest wins\n- **Hierarchical** — manager agent coordinates worker agents\n\n**Example: code review system**\n- Agent 1: checks for bugs\n- Agent 2: checks for security issues\n- Agent 3: checks for style violations\n- Synthesizer: combines all findings into report",
        },
        {
          type: "callout",
          kind: "warning",
          content:
            "Multi-agent systems are powerful but expensive. Each agent call costs money and adds latency. Start with a single agent, split only when you see clear benefits.",
        },
      ],
    },
    {
      step: 10,
      title: "Planning and reasoning strategies",
      blocks: [
        {
          type: "text",
          content:
            "Simple ReAct agents reason step-by-step. Advanced agents use explicit planning:",
        },
        {
          type: "kv",
          items: [
            { key: "Plan-and-execute", value: "Generate full plan upfront, then execute steps. Fast but inflexible if plan is wrong." },
            { key: "ReAct (reactive)", value: "Plan one step at a time based on observations. Slower but adapts to new info." },
            { key: "Tree-of-thought", value: "Explore multiple reasoning paths, backtrack if stuck. Most expensive but handles complex problems." },
            { key: "Reflection", value: "Agent critiques its own output, iterates until satisfied. Good for quality but 2-3x cost." },
          ],
        },
        {
          type: "code",
          language: "python",
          label: "Plan-and-execute pattern",
          code: `def plan_and_execute(question: str):
    """Generate plan, then execute steps"""

    # Step 1: Generate plan
    plan_prompt = f"""Break this task into steps:
{question}

Return a numbered list of steps."""

    plan_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": plan_prompt}]
    )
    plan = plan_response.choices[0].message.content
    print(f"Plan:\\n{plan}\\n")

    # Step 2: Execute each step
    results = []
    for i, step in enumerate(plan.split("\\n")):
        if step.strip() and step[0].isdigit():
            print(f"Executing: {step}")
            result = run_agent_with_tools(step)  # Use our tool-calling agent
            results.append(result)
            print(f"Result: {result}\\n")

    # Step 3: Synthesize
    synthesis_prompt = f"""Given these results:
{chr(10).join(results)}

Answer the original question: {question}"""

    final = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": synthesis_prompt}]
    )

    return final.choices[0].message.content

# Test
answer = plan_and_execute("Research the top 3 AI companies by funding, then calculate their average funding.")
print(answer)`,
        },
      ],
    },
    {
      step: 11,
      title: "Common agent failure modes",
      blocks: [
        {
          type: "text",
          content:
            "Agents fail in ways single-turn LLMs don't:",
        },
        {
          type: "list",
          style: "bullet",
          items: [
            "**Infinite loops** — agent keeps calling the same tool without making progress. Solution: max step limit, loop detection.",
            "**Context overflow** — memory grows until it exceeds context window. Solution: summarize old messages, keep only recent N turns.",
            "**Tool misuse** — agent calls the wrong tool or uses incorrect arguments. Solution: better tool descriptions, few-shot examples.",
            "**Hallucinated tools** — agent invents tools that don't exist. Solution: strict parsing, return error if tool not found.",
            "**Cost explosion** — agent makes hundreds of LLM calls. Solution: budgets, cost tracking, cheaper models for tool selection.",
            "**Stuck reasoning** — agent can't decide what to do next. Solution: provide hints, fallback to human, timeout.",
          ],
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "Always set a max_steps limit. A runaway agent can drain your API budget in minutes. Start with 10 steps, increase only if needed.",
        },
      ],
    },
    {
      step: 12,
      title: "Evaluation and debugging",
      blocks: [
        {
          type: "text",
          content:
            "Debugging agents is harder than debugging single-turn systems. You need to trace the full execution:",
        },
        {
          type: "list",
          style: "number",
          items: [
            "**Log everything** — every LLM call, tool invocation, observation. Use structured logging.",
            "**Trace viewer** — visualize the agent's reasoning path (LangSmith, Phoenix, custom UI).",
            "**Unit test tools** — test each tool independently before giving it to the agent.",
            "**Agent evals** — build test cases with expected tool sequences (e.g., for \"weather in Paris\", expect search → weather_api).",
            "**Cost tracking** — log tokens and cost per agent run. Set alerts for anomalies.",
          ],
        },
        {
          type: "code",
          language: "python",
          label: "Simple agent tracer",
          code: `import json
import time

class AgentTracer:
    def __init__(self):
        self.trace = []

    def log_step(self, step_type, data):
        """Log a step in the agent's execution"""
        self.trace.append({
            "timestamp": time.time(),
            "type": step_type,  # "thought", "tool_call", "observation", "answer"
            "data": data
        })

    def save(self, filename):
        with open(filename, "w") as f:
            json.dump(self.trace, f, indent=2)

    def summary(self):
        """Print execution summary"""
        print(f"Total steps: {len(self.trace)}")
        tool_calls = [s for s in self.trace if s["type"] == "tool_call"]
        print(f"Tool calls: {len(tool_calls)}")
        for tc in tool_calls:
            print(f"  - {tc['data']['tool']}({tc['data']['args']})")

# Usage in agent loop
tracer = AgentTracer()

def run_agent_with_tracing(question: str):
    tracer.log_step("user_query", {"question": question})
    # ... agent loop ...
    for step in range(max_steps):
        # Log LLM call
        tracer.log_step("llm_call", {"model": "gpt-4o", "prompt": prompt})
        # Log tool call
        if tool_call:
            tracer.log_step("tool_call", {"tool": tool_name, "args": args})
        # Log observation
        tracer.log_step("observation", {"result": result})

    tracer.save("agent_trace.json")
    tracer.summary()`,
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
            "In the hands-on project, you'll build a multi-tool research agent from scratch. It will search the web, scrape content, use a calculator, query Wikipedia, and synthesize findings into a report. You'll implement the ReAct loop, add tool calling, handle errors, implement tracing, and compare performance against LangChain. You'll also stress-test it with adversarial queries (infinite loops, hallucinated tools) and implement safeguards.",
        },
      ],
    },
    {
      step: 14,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question: "What's the difference between ReAct and plan-and-execute agent patterns?",
          options: [
            "ReAct plans one step at a time based on observations; plan-and-execute generates a full plan upfront then executes it",
            "ReAct is faster but less accurate",
            "Plan-and-execute requires multiple agents, ReAct uses one",
            "They are the same thing with different names",
          ],
          correct: 0,
          explanation:
            "ReAct (Reasoning and Acting) is a reactive pattern where the agent decides the next action after each observation — more flexible but slower. Plan-and-execute generates a complete plan before execution — faster but can't adapt if early steps reveal the plan is wrong. ReAct is better for open-ended tasks, plan-and-execute for well-defined workflows.",
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
    trackSlug: "ai-agents",
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

export const aiAgentsLessons: Lesson[] = [
  aiAgentsFundamentalsLesson,
  {
    slug: "tool-use-deep-dive",
    trackSlug: "ai-agents",
    order: 2,
    minutes: 18,
    title: "Tool Use and Function Calling",
    subtitle: "Master tool schemas, parameter validation, parallel tool calls, error handling, and custom tool design.",
    tags: ["Tool calling", "Function calling", "APIs", "Integration"],
    sections: [
      {
        step: 1,
        title: "The problem we're solving",
        blocks: [
          {
            type: "text",
            content:
              "LLMs are trained on text and can only output text. But real-world tasks require **actions**: search the web, query databases, call APIs, execute code, read files, send emails.\n\nThe problem: **How do you give an LLM the ability to perform actions in the real world?**\n\nThe answer is **tool calling** (formerly called 'function calling'). The LLM doesn't execute tools directly — it generates a **structured request** to call a tool, and your code executes it.",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "Tool calling turns an LLM from a text generator into an **orchestration engine**. It decides WHAT to do and with WHAT parameters. You handle the actual execution.",
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
              "Without tool calling, LLMs are limited to knowledge from their training data. With tool calling, they can:",
          },
          {
            type: "list",
            items: [
              "**Access real-time data** — current weather, stock prices, news",
              "**Interact with systems** — create tickets, update databases, send messages",
              "**Perform computations** — math, data analysis, code execution",
              "**Retrieve private data** — company docs, user profiles, order history",
              "**Chain complex workflows** — search → analyze → summarize → report",
            ],
          },
          {
            type: "text",
            content:
              "Tool calling is the foundation of every AI agent, chatbot, and assistant in production. Master it, and you can build LLM systems that actually do things.",
          },
        ],
      },
      {
        step: 3,
        title: "How tool calling works",
        blocks: [
          {
            type: "text",
            content:
              "The workflow is a loop:",
          },
          {
            type: "list",
            style: "number",
            items: [
              "**Define tools** — give the LLM a list of available tools (name, description, parameters)",
              "**LLM decides** — based on the user query, the LLM chooses a tool and generates parameters",
              "**You execute** — your code calls the actual function/API with the LLM's parameters",
              "**Return result** — you send the tool's output back to the LLM",
              "**LLM responds** — the LLM uses the tool result to answer the user",
            ],
          },
          {
            type: "diagram",
            label: "Tool calling flow",
            chart: `graph LR
    A[User: What's weather in Paris?] --> B[LLM: Needs weather tool]
    B --> C[LLM: Call weather_api city=Paris]
    C --> D[Your code: Execute weather_api]
    D --> E[API returns: Sunny, 22°C]
    E --> F[LLM: The weather is sunny, 22°C]

    style A fill:#e1f5ff
    style C fill:#fff3cd
    style D fill:#f8d7da
    style F fill:#d4edda`,
          },
        ],
      },
      {
        step: 4,
        title: "Tool schemas: teaching the LLM what tools exist",
        blocks: [
          {
            type: "text",
            content:
              "The LLM needs to know what tools are available and how to use them. You provide this via a **tool schema** — a JSON object describing each tool:",
          },
          {
            type: "code",
            language: "python",
            label: "Tool schema example (OpenAI format)",
            code: `tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "City name, e.g. 'Paris'"
                    },
                    "units": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Temperature units"
                    }
                },
                "required": ["city"]
            }
        }
    }
]`,
          },
          {
            type: "text",
            content:
              "**Key fields:**",
          },
          {
            type: "kv",
            items: [
              { key: "name", value: "Identifier for the tool (used in LLM's response)" },
              { key: "description", value: "When to use this tool (this is how the LLM decides)" },
              { key: "parameters", value: "JSON Schema defining expected arguments" },
              { key: "required", value: "Which parameters are mandatory" },
            ],
          },
          {
            type: "callout",
            kind: "tip",
            content:
              "The **description** is critical. A vague description like 'get weather' leads to misuse. Be specific: 'Get current weather for a specific city. Use this when user asks about current conditions.'",
          },
        ],
      },
      {
        step: 5,
        title: "Build a tool-calling agent from scratch",
        blocks: [
          {
            type: "text",
            content:
              "Let's implement a complete tool-calling agent in ~80 lines:",
          },
          {
            type: "code",
            language: "python",
            label: "Complete tool-calling agent",
            code: `from openai import OpenAI
import json

client = OpenAI()

# Step 1: Define actual tool functions
def get_weather(city: str, units: str = "celsius") -> str:
    """Simulate weather API call"""
    # In production: call real weather API
    weather_data = {
        "Paris": {"temp": 22, "condition": "Sunny"},
        "London": {"temp": 15, "condition": "Cloudy"},
        "Tokyo": {"temp": 28, "condition": "Rainy"}
    }
    data = weather_data.get(city, {"temp": 20, "condition": "Unknown"})
    unit_symbol = "°C" if units == "celsius" else "°F"
    return f"{data['condition']}, {data['temp']}{unit_symbol}"

def calculate(expression: str) -> str:
    """Safe calculator"""
    try:
        result = eval(expression, {"__builtins__": {}})
        return str(result)
    except Exception as e:
        return f"Error: {e}"

# Step 2: Define tool schemas
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name"},
                    "units": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Evaluate a mathematical expression",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "Math expression"}
                },
                "required": ["expression"]
            }
        }
    }
]

# Step 3: Tool registry (maps names to functions)
TOOL_MAP = {
    "get_weather": get_weather,
    "calculate": calculate
}

# Step 4: Agent loop
def run_agent(user_query: str, max_turns: int = 5):
    """Run agent with tool calling"""
    messages = [{"role": "user", "content": user_query}]

    for turn in range(max_turns):
        print(f"\\n--- Turn {turn + 1} ---")

        # Call LLM
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
            tool_choice="auto"  # Let LLM decide when to use tools
        )

        message = response.choices[0].message
        messages.append(message)

        # Check if LLM wants to call tools
        if not message.tool_calls:
            # No tools needed, return final answer
            return message.content

        # Execute each tool call
        for tool_call in message.tool_calls:
            tool_name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)

            print(f"Calling: {tool_name}({args})")

            # Execute tool
            if tool_name in TOOL_MAP:
                result = TOOL_MAP[tool_name](**args)
            else:
                result = f"Error: Tool '{tool_name}' not found"

            print(f"Result: {result}")

            # Add tool result to messages
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result
            })

    return "Max turns reached"

# Test it
answer = run_agent("What's the weather in Paris, and what's 15% of 200?")
print(f"\\n=== Final Answer ===\\n{answer}")`,
          },
        ],
      },
      {
        step: 6,
        title: "Run it and observe the flow",
        blocks: [
          {
            type: "code",
            language: "text",
            label: "Example output",
            code: `--- Turn 1 ---
Calling: get_weather({'city': 'Paris'})
Result: Sunny, 22°C
Calling: calculate({'expression': '0.15 * 200'})
Result: 30.0

--- Turn 2 ---

=== Final Answer ===
The weather in Paris is sunny with a temperature of 22°C. 15% of 200 is 30.`,
          },
          {
            type: "text",
            content:
              "**What happened:**\n1. LLM saw two questions: weather + math\n2. LLM called **both tools in parallel** (Turn 1)\n3. Your code executed both tools\n4. LLM used both results to answer (Turn 2)\n\nThis is **parallel tool calling** — one of the most powerful features.",
          },
        ],
      },
      {
        step: 7,
        title: "Parallel tool calling",
        blocks: [
          {
            type: "text",
            content:
              "Modern LLMs (GPT-4, Claude 3+) can call multiple tools simultaneously. This reduces latency dramatically:",
          },
          {
            type: "kv",
            items: [
              { key: "Sequential (old way)", value: "Call weather → wait → call calculator → wait → answer. 2 LLM calls." },
              { key: "Parallel (new way)", value: "Call both tools at once → wait → answer. 1 LLM call. 50% faster." },
            ],
          },
          {
            type: "text",
            content:
              "The agent loop automatically handles this. If `message.tool_calls` has multiple items, execute them all before sending results back to the LLM.",
          },
          {
            type: "callout",
            kind: "gotcha",
            content:
              "If tools have dependencies (tool B needs output of tool A), the LLM will call them sequentially across multiple turns. Design independent tools for parallel execution.",
          },
        ],
      },
      {
        step: 8,
        title: "Error handling and retries",
        blocks: [
          {
            type: "text",
            content:
              "Tools fail: APIs timeout, invalid arguments, network errors. Your agent must handle failures gracefully:",
          },
          {
            type: "code",
            language: "python",
            label: "Robust tool execution with retries",
            code: `import time
from typing import Callable

def execute_tool_with_retry(
    tool_func: Callable,
    args: dict,
    max_retries: int = 3
) -> str:
    """Execute tool with exponential backoff retry"""
    for attempt in range(max_retries):
        try:
            result = tool_func(**args)
            return result
        except TimeoutError:
            if attempt < max_retries - 1:
                wait = 2 ** attempt  # 1s, 2s, 4s
                print(f"Timeout, retrying in {wait}s...")
                time.sleep(wait)
            else:
                return "Error: Tool timed out after 3 attempts"
        except Exception as e:
            # Don't retry on invalid arguments
            return f"Error: {str(e)}"

    return "Error: Max retries exceeded"

# Use in agent loop
result = execute_tool_with_retry(TOOL_MAP[tool_name], args)`,
          },
          {
            type: "text",
            content:
              "**Error handling strategy:**",
          },
          {
            type: "list",
            items: [
              "**Transient errors** (timeout, rate limit) → retry with exponential backoff",
              "**Invalid arguments** → return error message to LLM, let it correct",
              "**Tool not found** → return error, LLM may try different tool",
              "**All retries failed** → return error, agent may ask user for help",
            ],
          },
        ],
      },
      {
        step: 9,
        title: "Designing good tools",
        blocks: [
          {
            type: "text",
            content:
              "Tool design affects agent reliability. Follow these principles:",
          },
          {
            type: "kv",
            items: [
              { key: "1. Clear descriptions", value: "Explain WHEN to use the tool, not just WHAT it does. Bad: 'Search function'. Good: 'Search Google when user asks about current events or real-time info'." },
              { key: "2. Few parameters", value: "Tools with 5+ params confuse LLMs. Split complex tools into multiple simple ones." },
              { key: "3. Idempotent when possible", value: "Calling the same tool twice with same args should be safe (no duplicate emails, charges, etc)." },
              { key: "4. Return strings", value: "LLMs consume text. Return structured text, not complex objects. Use JSON strings for structured data." },
              { key: "5. Validation", value: "Validate arguments before execution. Return clear error messages for invalid inputs." },
            ],
          },
          {
            type: "callout",
            kind: "tip",
            content:
              "**Example:** Instead of one tool `manage_email(action, to, subject, body)`, create three tools: `search_emails(query)`, `send_email(to, body)`, `delete_email(id)`. Simpler tools → fewer errors.",
          },
        ],
      },
      {
        step: 10,
        title: "Anthropic Claude tool use",
        blocks: [
          {
            type: "text",
            content:
              "Claude uses a slightly different schema than OpenAI, but the pattern is the same:",
          },
          {
            type: "code",
            language: "python",
            label: "Tool calling with Claude",
            code: `import anthropic

client = anthropic.Anthropic()

# Claude tool schema
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"}
            },
            "required": ["city"]
        }
    }
]

# Agent loop
messages = [{"role": "user", "content": "What's the weather in Paris?"}]

while True:
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )

    # Check for tool use
    tool_use_blocks = [b for b in response.content if b.type == "tool_use"]

    if not tool_use_blocks:
        # No tools, return final answer
        text = next(b.text for b in response.content if b.type == "text")
        print(text)
        break

    # Execute tools
    messages.append({"role": "assistant", "content": response.content})

    for tool_block in tool_use_blocks:
        result = get_weather(**tool_block.input)
        messages.append({
            "role": "user",
            "content": [{
                "type": "tool_result",
                "tool_use_id": tool_block.id,
                "content": result
            }]
        })`,
          },
        ],
      },
      {
        step: 11,
        title: "Common mistakes and debugging",
        blocks: [
          {
            type: "callout",
            kind: "gotcha",
            title: "LLM invents non-existent tools",
            content:
              "If tool descriptions are vague, LLMs hallucinate tools that sound plausible. Solution: Return explicit error 'Tool not found', or use `tool_choice='required'` to force the LLM to pick from your list.",
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Incorrect arguments",
            content:
              "LLM generates invalid JSON or wrong types. Solution: Validate arguments before execution, return clear error message. The LLM often self-corrects on the next turn.",
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Infinite tool loops",
            content:
              "Agent keeps calling the same tool without progress. Solution: Set `max_turns` limit, detect repeated tool calls (same tool + args twice in a row → break loop).",
          },
        ],
      },
      {
        step: 12,
        title: "When to use tool calling vs RAG",
        blocks: [
          {
            type: "text",
            content:
              "Tool calling and RAG solve different problems:",
          },
          {
            type: "kv",
            items: [
              { key: "Tool calling", value: "For ACTIONS. Search the web, call APIs, execute code, update databases, send messages." },
              { key: "RAG", value: "For KNOWLEDGE. Retrieve relevant docs from your knowledge base, augment LLM's context." },
            ],
          },
          {
            type: "text",
            content:
              "**Many agents use both:** RAG retrieves relevant context, then tool calling performs actions based on that context.\n\nExample: Customer support agent uses RAG to find relevant help docs, then uses tool calling to create a ticket or process a refund.",
          },
        ],
      },
      {
        step: 13,
        title: "Production considerations",
        blocks: [
          {
            type: "text",
            content:
              "Deploying tool-calling agents at scale requires:",
          },
          {
            type: "list",
            items: [
              "**Rate limiting** — enforce per-user tool call limits to prevent abuse",
              "**Cost tracking** — log every tool call, measure cost (API fees + compute)",
              "**Audit logging** — record who called what tool with what args (compliance, debugging)",
              "**Sandboxing** — code execution tools must run in isolated containers",
              "**Human-in-the-loop** — high-risk tools (delete data, charge money) require approval",
              "**Timeouts** — set max execution time per tool (prevent hung API calls)",
            ],
          },
        ],
      },
      {
        step: 14,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why is parallel tool calling faster than sequential?",
            options: [
              "It reduces the number of LLM API calls by calling multiple tools in one turn",
              "It uses a faster model for tool selection",
              "It caches tool results automatically",
              "It skips the tool execution step",
            ],
            correct: 0,
            explanation:
              "Parallel tool calling lets the LLM request multiple tool calls in a single response. You execute all tools, send all results back, and the LLM synthesizes one final answer. This cuts the number of LLM round-trips in half or more. Sequential calling requires: Call LLM → execute tool A → call LLM → execute tool B → call LLM → answer. Parallel: Call LLM → execute A+B together → call LLM → answer.",
          },
        ],
      },
      {
        step: 15,
        title: "What's next",
        blocks: [
          {
            type: "text",
            content:
              "Now that you understand tool calling, the next lesson **ReAct: Reasoning and Acting** shows how agents use tools iteratively — reasoning about which tool to call next based on previous observations. You'll learn the ReAct pattern, handle failures, and build agents that explore complex problems step-by-step.",
          },
        ],
      },
    ],
  },
  {
    slug: "react-pattern",
    trackSlug: "ai-agents",
    order: 3,
    minutes: 16,
    title: "ReAct: Reasoning and Acting",
    subtitle: "Deep dive into the ReAct pattern — thought traces, self-correction, when it works and when it fails.",
    tags: ["ReAct", "Reasoning", "Chain-of-thought", "Prompting"],
    sections: [
      {
        step: 1,
        title: "The problem we're solving",
        blocks: [
          {
            type: "text",
            content:
              "Tool-calling agents can perform actions, but they don't explain their reasoning. When an agent fails, you see the final answer but not the thought process that led there.\n\nThe problem: **How do you make agents' reasoning transparent and debuggable?**\n\nThe solution is **ReAct** (Reasoning and Acting) — a pattern where the agent explicitly states its reasoning before each action.",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "ReAct adds a **Thought** step before each **Action**. The agent reasons out loud: 'I need to do X because Y'. This makes debugging easier and improves decision quality.",
          },
        ],
      },
      {
        step: 2,
        title: "The ReAct loop: Thought → Action → Observation",
        blocks: [
          {
            type: "text",
            content:
              "Every ReAct agent follows this cycle:",
          },
          {
            type: "diagram",
            label: "ReAct cycle",
            chart: `graph LR
    A[Question] --> B[Thought: What do I need?]
    B --> C[Action: Call a tool]
    C --> D[Observation: Tool result]
    D --> E{Have answer?}
    E -->|No| B
    E -->|Yes| F[Final Answer]

    style A fill:#e1f5ff
    style B fill:#fff9e6
    style C fill:#f8d7da
    style D fill:#e7f3ff
    style F fill:#d4edda`,
          },
          {
            type: "text",
            content:
              "**Example: 'What's the weather in the capital of France?'**\n\n```\nThought: I don't know the capital of France. I need to search for it.\nAction: search('capital of France')\nObservation: Paris\n\nThought: Now I know the capital is Paris. I need the current weather there.\nAction: get_weather('Paris')\nObservation: Sunny, 22°C\n\nThought: I have all the information needed.\nFinal Answer: The weather in Paris (capital of France) is sunny, 22°C.\n```\n\nThe **Thought** step forces the agent to plan before acting, reducing errors.",
          },
        ],
      },
      {
        step: 3,
        title: "ReAct prompt template",
        blocks: [
          {
            type: "text",
            content:
              "ReAct requires a specific prompt structure:",
          },
          {
            type: "code",
            language: "python",
            label: "ReAct prompt template",
            code: `REACT_SYSTEM_PROMPT = """You are an AI agent that solves tasks step-by-step.

Available tools:
- search(query: str) -> str: Search Google for information
- get_weather(city: str) -> str: Get current weather for a city
- calculator(expression: str) -> float: Evaluate a math expression

For each step, use this format:

Thought: [Reason about what you need to do next]
Action: tool_name(arguments)
Observation: [The result will be provided here]

... (repeat Thought/Action/Observation as needed)

Thought: I now have enough information to answer
Final Answer: [Your complete answer to the original question]

IMPORTANT:
- Always start with a Thought before taking an Action
- After each Observation, think about what to do next
- Only provide the Final Answer when you're certain
- If you're stuck, explain what's blocking you in a Thought

Question: {question}
{scratchpad}
"""

# The scratchpad accumulates the agent's history:
# Thought: ...
# Action: ...
# Observation: ...
# Thought: ...
# etc.`,
          },
        ],
      },
      {
        step: 4,
        title: "Implementing a ReAct agent",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Complete ReAct agent implementation",
            code: `import re
from openai import OpenAI

client = OpenAI()

# Tools
def search(query: str) -> str:
    """Fake search results"""
    db = {
        "capital of France": "Paris",
        "population of Paris": "2.2 million",
        "GDP of France": "$2.8 trillion"
    }
    return db.get(query, "No results found")

def get_weather(city: str) -> str:
    db = {"Paris": "Sunny, 22°C", "London": "Rainy, 15°C"}
    return db.get(city, "Weather data not available")

def calculator(expression: str) -> str:
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except:
        return "Invalid expression"

TOOLS = {
    "search": search,
    "get_weather": get_weather,
    "calculator": calculator
}

REACT_PROMPT = """You are a ReAct agent. Use this format:

Thought: [your reasoning]
Action: tool_name(arguments)
Observation: [result will be provided]
...
Final Answer: [your answer]

Available tools: search(query), get_weather(city), calculator(expr)

Question: {question}
{scratchpad}"""

def run_react_agent(question: str, max_steps: int = 10):
    """ReAct agent loop"""
    scratchpad = ""

    for step in range(max_steps):
        # Build prompt
        prompt = REACT_PROMPT.format(
            question=question,
            scratchpad=scratchpad
        )

        # Get LLM response
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        output = response.choices[0].message.content
        scratchpad += output + "\\n"

        print(f"\\n--- Step {step + 1} ---")
        print(output)

        # Check if done
        if "Final Answer:" in output:
            answer = output.split("Final Answer:")[1].strip()
            return answer

        # Parse action
        action_match = re.search(
            r'Action:\\s*(\\w+)\\(([^)]*)\\)',
            output
        )

        if action_match:
            tool_name = action_match.group(1)
            args_str = action_match.group(2).strip().strip("'\\""")

            # Execute tool
            if tool_name in TOOLS:
                result = TOOLS[tool_name](args_str)
                observation = f"Observation: {result}\\n"
                scratchpad += observation
                print(observation)
            else:
                scratchpad += f"Observation: Error - Tool '{tool_name}' not found\\n"
        else:
            # LLM didn't follow format
            scratchpad += "Observation: Please use format 'Action: tool(args)'\\n"

    return "Max steps reached without answer"

# Test
answer = run_react_agent(
    "What's the weather in the capital of France?"
)
print(f"\\n=== Final Answer ===\\n{answer}")`,
          },
        ],
      },
      {
        step: 5,
        title: "ReAct output example",
        blocks: [
          {
            type: "code",
            language: "text",
            label: "ReAct execution trace",
            code: `--- Step 1 ---
Thought: I need to find out what the capital of France is before I can check the weather.
Action: search(capital of France)

Observation: Paris

--- Step 2 ---
Thought: Now I know the capital is Paris. I need to get the current weather for Paris.
Action: get_weather(Paris)

Observation: Sunny, 22°C

--- Step 3 ---
Thought: I now have all the information needed to answer the question.
Final Answer: The weather in Paris, the capital of France, is sunny with a temperature of 22°C.

=== Final Answer ===
The weather in Paris, the capital of France, is sunny with a temperature of 22°C.`,
          },
          {
            type: "text",
            content:
              "Notice how the **Thought** steps create a narrative. If this agent failed, you'd see exactly where the reasoning went wrong.",
          },
        ],
      },
      {
        step: 6,
        title: "Why ReAct improves performance",
        blocks: [
          {
            type: "text",
            content:
              "ReAct isn't just for debugging — it actually improves agent success rates:",
          },
          {
            type: "kv",
            items: [
              { key: "Self-correction", value: "The agent catches its own mistakes. 'Wait, I already searched for this. Let me try a different query.'" },
              { key: "Better planning", value: "Explicit reasoning reduces impulsive tool calls. The agent thinks before acting." },
              { key: "Transparency", value: "Humans can audit decisions. Critical for production systems." },
              { key: "Failure diagnosis", value: "When the agent fails, the thought trace shows why (wrong tool choice, misinterpreted result, etc)." },
            ],
          },
          {
            type: "text",
            content:
              "**Research shows:** ReAct agents outperform tool-only agents by 10-20% on multi-step reasoning tasks (HotPotQA, FEVER datasets).",
          },
        ],
      },
      {
        step: 7,
        title: "Common ReAct failure modes",
        blocks: [
          {
            type: "text",
            content:
              "ReAct agents fail in predictable ways:",
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Infinite loops",
            content:
              "Agent keeps calling the same tool without progress. Example:\n```\nThought: I need weather data\nAction: search(weather Paris)\nObservation: No results\nThought: I need weather data\nAction: search(weather Paris)\n...\n```\n**Fix:** Detect repeated (tool, args) pairs. If seen twice, force different action or return error.",
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Stuck reasoning",
            content:
              "Agent can't decide what to do next. Generates vague thoughts like 'I need more information' without specifying what.\n\n**Fix:** Add to prompt: 'If stuck, explain exactly what information is missing and which tool might provide it. If no tool can help, say so.'",
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Premature final answer",
            content:
              "Agent gives up too early with incomplete information.\n\n**Fix:** Add examples showing agents that persist through 3-4 steps. Set a minimum step count before allowing Final Answer.",
          },
        ],
      },
      {
        step: 8,
        title: "ReAct vs Plan-and-Execute",
        blocks: [
          {
            type: "text",
            content:
              "ReAct is **reactive** — it plans one step at a time. Plan-and-Execute is **proactive** — it generates a full plan upfront.",
          },
          {
            type: "kv",
            items: [
              { key: "ReAct wins when", value: "Environment is unknown, early steps reveal new info, flexibility matters. Example: research (you don't know what you'll find)." },
              { key: "Plan-and-Execute wins when", value: "Task structure is known, latency matters, cost matters. Example: booking a flight (steps are fixed: search → select → pay)." },
            ],
          },
          {
            type: "diagram",
            label: "ReAct vs Plan-and-Execute",
            chart: `graph LR
    subgraph ReAct
    A1[Step 1] --> A2[Observe]
    A2 --> A3[Step 2]
    A3 --> A4[Observe]
    A4 --> A5[Step 3]
    end

    subgraph Plan-Execute
    B1[Plan all steps] --> B2[Execute 1]
    B2 --> B3[Execute 2]
    B3 --> B4[Execute 3]
    end

    style A2 fill:#fff3cd
    style A4 fill:#fff3cd
    style B1 fill:#e7f3ff`,
          },
          {
            type: "text",
            content:
              "**Hybrid approach:** Use Plan-and-Execute for the high-level plan, ReAct for each step's execution. Best of both worlds.",
          },
        ],
      },
      {
        step: 9,
        title: "Improving ReAct with few-shot examples",
        blocks: [
          {
            type: "text",
            content:
              "Zero-shot ReAct works, but few-shot examples dramatically improve reasoning quality:",
          },
          {
            type: "code",
            language: "python",
            label: "ReAct prompt with few-shot examples",
            code: `FEW_SHOT_EXAMPLES = """
Example 1:
Question: What's 15% of the population of Paris?

Thought: I need to find the population of Paris first.
Action: search(population of Paris)
Observation: 2.2 million

Thought: Now I need to calculate 15% of 2.2 million.
Action: calculator(0.15 * 2200000)
Observation: 330000

Thought: I have the answer.
Final Answer: 15% of Paris's population (2.2 million) is 330,000 people.

Example 2:
Question: Is it warmer in Paris or London right now?

Thought: I need weather data for both cities.
Action: get_weather(Paris)
Observation: Sunny, 22°C

Thought: Now I need London's weather.
Action: get_weather(London)
Observation: Rainy, 15°C

Thought: I can compare the temperatures now.
Final Answer: Paris is warmer (22°C) than London (15°C) right now.

---

Now solve this:
Question: {question}
{scratchpad}
"""

# Add to your prompt template`,
          },
          {
            type: "text",
            content:
              "Few-shot examples teach the agent:\n- How to chain tools correctly\n- When to stop (don't over-search)\n- How to handle multi-part questions\n- What good reasoning looks like",
          },
        ],
      },
      {
        step: 10,
        title: "Measuring ReAct quality",
        blocks: [
          {
            type: "text",
            content:
              "How do you know if a ReAct agent is good? Measure these:",
          },
          {
            type: "kv",
            items: [
              { key: "Success rate", value: "% of questions answered correctly. Goal: >90% on your test set." },
              { key: "Average steps", value: "Fewer is better (cost, latency). Ideal: 2-4 steps for simple tasks." },
              { key: "Reasoning quality", value: "Do thoughts logically lead to actions? Manual review or LLM-as-judge." },
              { key: "Tool efficiency", value: "Are tool calls necessary? Track 'wasted' calls (same tool+args twice, irrelevant tools)." },
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Simple ReAct evaluator",
            code: `def evaluate_react_agent(test_cases):
    """Evaluate ReAct agent on test cases"""
    results = []

    for question, expected_answer in test_cases:
        # Run agent and capture trace
        answer = run_react_agent(question)
        steps = scratchpad.count("Thought:")

        # Check correctness
        correct = is_correct(answer, expected_answer)

        results.append({
            "question": question,
            "correct": correct,
            "steps": steps,
            "answer": answer
        })

    # Metrics
    success_rate = sum(r["correct"] for r in results) / len(results)
    avg_steps = sum(r["steps"] for r in results) / len(results)

    print(f"Success rate: {success_rate:.1%}")
    print(f"Average steps: {avg_steps:.1f}")

    return results

# Test set
test_cases = [
    ("What's the weather in Paris?", "22°C"),
    ("What's 10% of 200?", "20"),
    # ... more cases
]

evaluate_react_agent(test_cases)`,
          },
        ],
      },
      {
        step: 11,
        title: "ReAct in production frameworks",
        blocks: [
          {
            type: "text",
            content:
              "LangChain and LangGraph implement ReAct out-of-the-box:",
          },
          {
            type: "code",
            language: "python",
            label: "LangChain ReAct agent",
            code: `from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, AgentType, Tool

# Define tools
tools = [
    Tool(
        name="Search",
        func=search,
        description="Search for information"
    ),
    Tool(
        name="Weather",
        func=get_weather,
        description="Get current weather for a city"
    )
]

# Create ReAct agent
llm = ChatOpenAI(model="gpt-4o", temperature=0)
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,  # Shows thought traces
    max_iterations=10
)

# Run
result = agent.run("What's the weather in the capital of France?")
print(result)`,
          },
          {
            type: "text",
            content:
              "LangChain handles the scratchpad, parsing, and loop detection automatically. But understanding the underlying ReAct pattern helps you debug when it fails.",
          },
        ],
      },
      {
        step: 12,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the main benefit of the explicit 'Thought' step in ReAct?",
            options: [
              "It forces the agent to reason before acting, improving decision quality and making failures debuggable",
              "It makes the agent faster by caching thoughts",
              "It reduces API costs by skipping unnecessary tool calls",
              "It's only useful for logging, doesn't affect performance",
            ],
            correct: 0,
            explanation:
              "The 'Thought' step makes reasoning explicit, which serves two purposes: (1) It improves decision quality by forcing deliberation before action (fewer impulsive mistakes), and (2) it creates an audit trail showing exactly where and why the agent made each decision. This makes failures debuggable. Research shows ReAct agents have 10-20% higher success rates than tool-only agents on multi-step tasks.",
          },
        ],
      },
      {
        step: 13,
        title: "What's next",
        blocks: [
          {
            type: "text",
            content:
              "You've mastered ReAct — the most widely-used agent pattern. Next up: **Agent Memory Systems** teaches how to give agents persistent memory across sessions. You'll learn short-term vs long-term memory, memory retrieval strategies, and how to build memory systems that scale to millions of facts.",
          },
        ],
      },
    ],
  },
  {
    slug: "memory-systems",
    trackSlug: "ai-agents",
    order: 4,
    minutes: 20,
    title: "Agent Memory Systems",
    subtitle: "Design memory for agents — conversation history, episodic memory, semantic memory, memory retrieval strategies.",
    tags: ["Memory", "State management", "Vector DB", "Persistence"],
    sections: [
      {
        step: 1,
        title: "The problem we're solving",
        blocks: [
          {
            type: "text",
            content:
              "Stateless agents forget everything after each conversation. They can't remember:\n\n- **Previous conversations** — 'What did we discuss last week?'\n- **User preferences** — 'Remember I prefer window seats'\n- **Past actions** — 'Did I already book that flight?'\n- **Learned facts** — 'The user's meeting is every Tuesday at 2pm'\n\nThe problem: **How do you give agents persistent memory that survives across sessions and grows over time?**",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "Agent memory has two layers: **short-term** (current conversation) and **long-term** (persistent across sessions). Most agents need both.",
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
              "Memory transforms agents from tools into assistants:",
          },
          {
            type: "kv",
            items: [
              { key: "Personalization", value: "Remember user preferences, communication style, past decisions" },
              { key: "Context continuity", value: "Pick up where you left off, reference previous conversations" },
              { key: "Learning", value: "Agent improves over time by remembering what worked and what didn't" },
              { key: "Efficiency", value: "Don't re-ask questions the agent already knows the answer to" },
              { key: "Complex workflows", value: "Multi-day projects require memory of intermediate results" },
            ],
          },
          {
            type: "text",
            content:
              "**Example:** A customer support agent with memory knows 'This user has called 3 times about the same issue' and can escalate appropriately. Without memory, every call starts from zero.",
          },
        ],
      },
      {
        step: 3,
        title: "Short-term memory: the conversation buffer",
        blocks: [
          {
            type: "text",
            content:
              "Short-term memory is the conversation history sent with each LLM call. It lives in the context window:",
          },
          {
            type: "code",
            language: "python",
            label: "Basic conversation buffer",
            code: `from openai import OpenAI

client = OpenAI()

class ConversationBuffer:
    def __init__(self):
        self.messages = []

    def add_user_message(self, content: str):
        self.messages.append({"role": "user", "content": content})

    def add_assistant_message(self, content: str):
        self.messages.append({"role": "assistant", "content": content})

    def get_messages(self):
        return self.messages

# Usage
buffer = ConversationBuffer()
buffer.add_user_message("My name is Alice")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=buffer.get_messages()
)

buffer.add_assistant_message(response.choices[0].message.content)

# Later in the conversation
buffer.add_user_message("What's my name?")
# LLM sees full history and can answer "Alice"`,
          },
          {
            type: "text",
            content:
              "This works until the conversation grows too large for the context window.",
          },
        ],
      },
      {
        step: 4,
        title: "Context window management",
        blocks: [
          {
            type: "text",
            content:
              "LLMs have finite context windows (8k-200k tokens). Long conversations overflow. You have three strategies:",
          },
          {
            type: "kv",
            items: [
              { key: "1. Sliding window", value: "Keep only the last N messages. Simple but loses old context." },
              { key: "2. Summarization", value: "Periodically summarize old messages, keep summary + recent messages." },
              { key: "3. Selective retrieval", value: "Move old messages to vector DB, retrieve relevant ones per query." },
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Sliding window buffer",
            code: `class SlidingWindowBuffer:
    def __init__(self, max_messages: int = 20):
        self.messages = []
        self.max_messages = max_messages

    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})

        # Keep only last N messages
        if len(self.messages) > self.max_messages:
            # Keep system message if present
            system_msgs = [m for m in self.messages if m["role"] == "system"]
            recent_msgs = self.messages[-self.max_messages:]
            self.messages = system_msgs + recent_msgs

    def get_messages(self):
        return self.messages`,
          },
          {
            type: "code",
            language: "python",
            label: "Summarization buffer",
            code: `class SummarizationBuffer:
    def __init__(self, summarize_after: int = 10):
        self.messages = []
        self.summary = ""
        self.summarize_after = summarize_after

    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})

        # Summarize old messages periodically
        if len(self.messages) > self.summarize_after:
            self._summarize_and_compress()

    def _summarize_and_compress(self):
        # Summarize first half of messages
        to_summarize = self.messages[:len(self.messages)//2]
        summary_prompt = f"Summarize this conversation:\\n{to_summarize}"

        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Cheaper model for summaries
            messages=[{"role": "user", "content": summary_prompt}]
        )

        self.summary = response.choices[0].message.content
        # Keep only recent messages
        self.messages = self.messages[len(self.messages)//2:]

    def get_messages(self):
        # Prepend summary as system message
        if self.summary:
            return [
                {"role": "system", "content": f"Previous context: {self.summary}"}
            ] + self.messages
        return self.messages`,
          },
        ],
      },
      {
        step: 5,
        title: "Long-term memory: persistent storage",
        blocks: [
          {
            type: "text",
            content:
              "Long-term memory persists across sessions. Store it in a database and retrieve when needed:",
          },
          {
            type: "kv",
            items: [
              { key: "Episodic memory", value: "Events and actions: 'User booked flight to Paris on March 5', 'User complained about slow checkout'" },
              { key: "Semantic memory", value: "Facts and preferences: 'User prefers window seats', 'User's timezone is PST'" },
              { key: "Procedural memory", value: "How to do tasks: 'When user asks for reports, query the analytics DB then generate PDF'" },
            ],
          },
          {
            type: "text",
            content:
              "**Storage options:**",
          },
          {
            type: "list",
            items: [
              "**Vector DB** (Chroma, Pinecone, Weaviate) — for semantic search over memories",
              "**SQL database** — for structured facts (user preferences, transaction history)",
              "**Hybrid** — vector DB for unstructured memories, SQL for structured data",
            ],
          },
        ],
      },
      {
        step: 6,
        title: "Building a vector-based memory system",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Long-term memory with ChromaDB",
            code: `import chromadb
from chromadb.utils import embedding_functions
from datetime import datetime

class LongTermMemory:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(
            name=f"memories_{user_id}",
            embedding_function=embedding_functions.OpenAIEmbeddingFunction(
                api_key="your-key"
            )
        )

    def store_memory(self, content: str, memory_type: str = "episodic"):
        """Store a new memory"""
        self.collection.add(
            documents=[content],
            metadatas=[{
                "type": memory_type,
                "timestamp": datetime.now().isoformat(),
                "user_id": self.user_id
            }],
            ids=[f"{self.user_id}_{datetime.now().timestamp()}"]
        )

    def retrieve_relevant_memories(
        self,
        query: str,
        n_results: int = 5
    ) -> list[str]:
        """Retrieve memories relevant to current query"""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )

        return results["documents"][0] if results["documents"] else []

    def get_recent_memories(self, n: int = 10) -> list[str]:
        """Get N most recent memories"""
        # ChromaDB doesn't have built-in time-based queries,
        # so we retrieve all and sort by timestamp
        all_results = self.collection.get()

        if not all_results["metadatas"]:
            return []

        # Sort by timestamp
        memories_with_time = [
            (doc, meta["timestamp"])
            for doc, meta in zip(
                all_results["documents"],
                all_results["metadatas"]
            )
        ]
        memories_with_time.sort(key=lambda x: x[1], reverse=True)

        return [mem[0] for mem in memories_with_time[:n]]

# Usage
memory = LongTermMemory(user_id="alice_123")

# Store memories over time
memory.store_memory("User prefers window seats on flights", "semantic")
memory.store_memory("User booked flight to Paris on 2024-03-05", "episodic")
memory.store_memory("User complained about slow checkout process", "episodic")

# Later, retrieve relevant context
query = "What are the user's travel preferences?"
relevant_memories = memory.retrieve_relevant_memories(query, n_results=3)
print(relevant_memories)
# ["User prefers window seats on flights", ...]`,
          },
        ],
      },
      {
        step: 7,
        title: "Memory retrieval strategies",
        blocks: [
          {
            type: "text",
            content:
              "When should you retrieve memories? You have three strategies:",
          },
          {
            type: "kv",
            items: [
              { key: "Always retrieve", value: "Fetch top-k relevant memories for every query. Simple but expensive (extra latency, more tokens)." },
              { key: "Retrieve on demand", value: "Only fetch memories when agent explicitly needs them (agent calls a 'retrieve_memory' tool). More efficient." },
              { key: "Hybrid", value: "Always include recent memories (last session), retrieve older memories only when relevant." },
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Hybrid retrieval strategy",
            code: `def get_context_with_memory(user_query: str, memory: LongTermMemory):
    """Combine short-term and long-term memory"""

    # Always include recent memories (last session)
    recent = memory.get_recent_memories(n=5)

    # Retrieve semantically relevant older memories
    relevant = memory.retrieve_relevant_memories(user_query, n_results=3)

    # Combine and deduplicate
    all_memories = list(set(recent + relevant))

    # Build context
    context = "Relevant memories:\\n" + "\\n".join(f"- {m}" for m in all_memories)

    return context

# In agent loop
context = get_context_with_memory("Book me a flight to Paris", memory)

messages = [
    {"role": "system", "content": context},
    {"role": "user", "content": "Book me a flight to Paris"}
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages
)
# LLM sees: "User prefers window seats" and can book accordingly`,
          },
        ],
      },
      {
        step: 8,
        title: "Memory as a tool",
        blocks: [
          {
            type: "text",
            content:
              "Instead of always retrieving memories, give the agent a **memory tool** it can call when needed:",
          },
          {
            type: "code",
            language: "python",
            label: "Memory as an agent tool",
            code: `# Define memory tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "retrieve_memory",
            "description": "Search user's memory for relevant information",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "What to search for"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "store_memory",
            "description": "Store important information for future reference",
            "parameters": {
                "type": "object",
                "properties": {
                    "content": {"type": "string", "description": "Information to remember"},
                    "type": {"type": "string", "enum": ["episodic", "semantic"]}
                },
                "required": ["content"]
            }
        }
    }
]

# Agent decides when to use memory
# User: "Book me a flight to Paris"
# Agent: Calls retrieve_memory("user travel preferences")
# Agent: Sees "User prefers window seats"
# Agent: Books flight with window seat`,
          },
          {
            type: "text",
            content:
              "This approach:\n- Reduces costs (only retrieve when needed)\n- Lets agent learn when memory is useful\n- Makes memory usage explicit (easier to debug)",
          },
        ],
      },
      {
        step: 9,
        title: "Structured vs unstructured memory",
        blocks: [
          {
            type: "text",
            content:
              "Not all memories should go in a vector DB. Use the right storage for each type:",
          },
          {
            type: "diagram",
            label: "Memory storage architecture",
            chart: `graph TD
    A[New Information] --> B{Structured or Unstructured?}
    B -->|Structured| C[SQL Database]
    B -->|Unstructured| D[Vector DB]

    C --> E[User Profile]
    C --> F[Transaction History]
    C --> G[Preferences]

    D --> H[Conversation History]
    D --> I[Observations]
    D --> J[Learned Facts]

    K[Agent Query] --> L{Type of Query?}
    L -->|Lookup| C
    L -->|Search| D

    style C fill:#e7f3ff
    style D fill:#fff3cd`,
          },
          {
            type: "kv",
            items: [
              { key: "SQL for", value: "User preferences (seat type: window/aisle), transaction history, structured facts" },
              { key: "Vector DB for", value: "Conversation snippets, observations, unstructured notes" },
            ],
          },
        ],
      },
      {
        step: 10,
        title: "Memory architectures: MemGPT approach",
        blocks: [
          {
            type: "text",
            content:
              "**MemGPT** introduced a hierarchical memory system inspired by operating systems:",
          },
          {
            type: "kv",
            items: [
              { key: "Main context", value: "Current conversation (like RAM) — always in prompt" },
              { key: "Archival memory", value: "Long-term storage (like disk) — retrieved when needed" },
              { key: "Recall memory", value: "Past conversations — searchable by semantic similarity" },
            ],
          },
          {
            type: "text",
            content:
              "MemGPT agents have explicit memory management tools:\n- `core_memory_append` — add to main context\n- `core_memory_replace` — update facts in context\n- `archival_memory_search` — search long-term storage\n- `conversation_search` — find past conversations\n\nThe agent decides what to keep in main context vs archive, just like an OS manages RAM vs disk.",
          },
        ],
      },
      {
        step: 11,
        title: "Memory quality and debugging",
        blocks: [
          {
            type: "text",
            content:
              "How do you know if memory retrieval is working?",
          },
          {
            type: "kv",
            items: [
              { key: "Precision", value: "Are retrieved memories actually relevant? Measure with LLM-as-judge or manual review." },
              { key: "Recall", value: "Are important memories being retrieved? Test: store known facts, check if agent uses them." },
              { key: "Recency bias", value: "Does agent over-weight recent memories? Balance recency vs relevance in retrieval." },
              { key: "Memory pollution", value: "Are wrong facts being stored? Implement validation before storing." },
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Memory retrieval quality check",
            code: `def evaluate_memory_retrieval(test_cases, memory: LongTermMemory):
    """Test if relevant memories are retrieved"""
    results = []

    for query, expected_memories in test_cases:
        retrieved = memory.retrieve_relevant_memories(query, n_results=5)

        # Check if expected memories are in retrieved
        found = sum(
            1 for exp in expected_memories
            if any(exp.lower() in ret.lower() for ret in retrieved)
        )

        precision = found / len(retrieved) if retrieved else 0
        recall = found / len(expected_memories)

        results.append({
            "query": query,
            "precision": precision,
            "recall": recall
        })

    avg_precision = sum(r["precision"] for r in results) / len(results)
    avg_recall = sum(r["recall"] for r in results) / len(results)

    print(f"Avg Precision: {avg_precision:.2f}")
    print(f"Avg Recall: {avg_recall:.2f}")

    return results

# Test
test_cases = [
    ("What are my travel preferences?", ["window seats", "direct flights"]),
    ("When did I last fly?", ["booked flight to Paris on 2024-03-05"]),
]

evaluate_memory_retrieval(test_cases, memory)`,
          },
        ],
      },
      {
        step: 12,
        title: "Privacy and memory management",
        blocks: [
          {
            type: "text",
            content:
              "Memory systems raise privacy concerns:",
          },
          {
            type: "list",
            items: [
              "**PII storage** — never store SSN, credit cards, passwords in plain text",
              "**Right to be forgotten** — implement memory deletion on user request",
              "**Memory expiration** — automatically delete old episodic memories (configurable TTL)",
              "**Access control** — memories are per-user, isolated (one user can't access another's)",
              "**Audit logs** — track what memories were stored/retrieved/deleted",
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Memory with expiration and deletion",
            code: `from datetime import datetime, timedelta

class PrivacyAwareMemory(LongTermMemory):
    def store_memory(
        self,
        content: str,
        memory_type: str = "episodic",
        ttl_days: int = None
    ):
        """Store memory with optional expiration"""
        metadata = {
            "type": memory_type,
            "timestamp": datetime.now().isoformat(),
            "user_id": self.user_id
        }

        if ttl_days:
            expire_at = datetime.now() + timedelta(days=ttl_days)
            metadata["expires_at"] = expire_at.isoformat()

        self.collection.add(
            documents=[content],
            metadatas=[metadata],
            ids=[f"{self.user_id}_{datetime.now().timestamp()}"]
        )

    def cleanup_expired(self):
        """Delete expired memories"""
        all_results = self.collection.get()

        if not all_results["metadatas"]:
            return

        now = datetime.now()
        expired_ids = []

        for mem_id, meta in zip(all_results["ids"], all_results["metadatas"]):
            if "expires_at" in meta:
                expire_time = datetime.fromisoformat(meta["expires_at"])
                if now > expire_time:
                    expired_ids.append(mem_id)

        if expired_ids:
            self.collection.delete(ids=expired_ids)
            print(f"Deleted {len(expired_ids)} expired memories")

    def delete_all_memories(self):
        """Right to be forgotten - delete all user memories"""
        self.client.delete_collection(f"memories_{self.user_id}")
        print(f"Deleted all memories for user {self.user_id}")`,
          },
        ],
      },
      {
        step: 13,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the difference between short-term and long-term memory in agents?",
            options: [
              "Short-term is the current conversation in the prompt; long-term is persistent storage across sessions",
              "Short-term is faster; long-term is slower",
              "Short-term uses SQL; long-term uses vector DB",
              "They are the same thing with different names",
            ],
            correct: 0,
            explanation:
              "Short-term memory is the conversation history included in each LLM call (lives in context window, cleared when session ends). Long-term memory is stored persistently in databases (vector DB, SQL) and retrieved when needed across sessions. Both are needed: short-term for immediate context, long-term for facts and preferences that should persist over days/weeks/months.",
          },
        ],
      },
      {
        step: 14,
        title: "What's next",
        blocks: [
          {
            type: "text",
            content:
              "You've learned how to give agents memory. Next up: **Planning and Task Decomposition** teaches how agents break complex goals into executable steps. You'll learn plan-and-execute patterns, replanning strategies, and how to build agents that can pursue multi-step goals autonomously.",
          },
        ],
      },
    ],
  },
  {
    slug: "planning-strategies",
    trackSlug: "ai-agents",
    order: 5,
    minutes: 18,
    title: "Planning and Task Decomposition",
    subtitle: "Teach agents to plan — task decomposition, plan-and-execute, replanning, hierarchical planning.",
    tags: ["Planning", "Decomposition", "Strategy", "Reasoning"],
    sections: [
      {
        step: 1,
        title: "The problem we're solving",
        blocks: [
          {
            type: "text",
            content:
              "ReAct agents plan one step at a time. This works for simple tasks but struggles with complex multi-step goals:\n\n- **Complex workflows** — 'Plan a 3-day conference' requires coordinating venue, speakers, catering, marketing\n- **Dependencies** — Some tasks must complete before others can start\n- **Resource constraints** — Limited budget, time, or API rate limits\n- **Optimization** — Multiple ways to achieve a goal, which is best?\n\nThe problem: **How do you build agents that can decompose complex goals into executable plans?**",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "Planning agents think before they act. They generate a **full plan upfront**, then execute it step-by-step. This is the opposite of ReAct's 'act-then-think' approach.",
          },
        ],
      },
      {
        step: 2,
        title: "Task decomposition: breaking goals into steps",
        blocks: [
          {
            type: "text",
            content:
              "Task decomposition is the foundational planning skill. Given a high-level goal, break it into concrete subtasks:",
          },
          {
            type: "diagram",
            label: "Task decomposition example",
            chart: `graph TD
    A[Book a vacation to Paris] --> B[Find flights]
    A --> C[Book hotel]
    A --> D[Reserve activities]
    A --> E[Arrange transportation]

    B --> B1[Search flight options]
    B --> B2[Compare prices]
    B --> B3[Purchase tickets]

    C --> C1[Search hotels near attractions]
    C --> C2[Check availability]
    C --> C3[Make reservation]

    style A fill:#e1f5ff
    style B fill:#fff3cd
    style C fill:#fff3cd
    style D fill:#fff3cd
    style E fill:#fff3cd`,
          },
          {
            type: "text",
            content:
              "**Good decomposition:**\n- Each subtask is concrete and executable\n- Subtasks are ordered (handle dependencies)\n- Subtasks are independent where possible (enables parallelization)\n- Each subtask has a clear success criterion",
          },
        ],
      },
      {
        step: 3,
        title: "The plan-and-execute pattern",
        blocks: [
          {
            type: "text",
            content:
              "Plan-and-execute is a two-phase pattern:",
          },
          {
            type: "list",
            style: "number",
            items: [
              "**Planning phase** — Generate a complete plan (ordered list of steps)",
              "**Execution phase** — Execute each step sequentially",
              "**Synthesis phase** — Combine results into final answer",
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Plan-and-execute agent",
            code: `from openai import OpenAI

client = OpenAI()

def plan_and_execute(goal: str, tools: dict):
    """Plan-and-execute agent pattern"""

    # Phase 1: Generate plan
    planning_prompt = f"""Break this goal into a numbered list of concrete steps:

Goal: {goal}

Available tools: {', '.join(tools.keys())}

Return ONLY a numbered list of steps. Each step should specify:
1. What to do
2. Which tool to use (if any)

Example:
1. Search for "Python data science libraries"
2. Extract top 5 results
3. For each library, get documentation
4. Summarize key features
"""

    plan_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": planning_prompt}],
        temperature=0
    )

    plan = plan_response.choices[0].message.content
    print("=== PLAN ===")
    print(plan)
    print()

    # Phase 2: Execute each step
    steps = [line for line in plan.split('\\n') if line.strip() and line[0].isdigit()]
    results = []

    for i, step in enumerate(steps):
        print(f"\\n--- Executing Step {i+1} ---")
        print(step)

        # Use ReAct or tool calling to execute this step
        step_result = execute_step(step, tools)
        results.append(step_result)

        print(f"Result: {step_result}")

    # Phase 3: Synthesize
    synthesis_prompt = f"""Given these step results:

{chr(10).join(f"{i+1}. {r}" for i, r in enumerate(results))}

Synthesize a final answer to the original goal: {goal}
"""

    final_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": synthesis_prompt}]
    )

    return final_response.choices[0].message.content

def execute_step(step: str, tools: dict) -> str:
    """Execute a single step using available tools"""
    # This could be a mini-agent (ReAct) or direct tool call
    # For simplicity, using a single LLM call
    execution_prompt = f"""Execute this step using the available tools:

Step: {step}
Tools: {list(tools.keys())}

Return the result.
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": execution_prompt}],
        tools=format_tools_for_openai(tools),
        tool_choice="auto"
    )

    # Execute tool calls and return result
    # (Tool execution code omitted for brevity - see lesson 2)
    return "Step executed successfully"

# Test
goal = "Find the top 3 Python data science libraries and summarize each"
tools = {"search": search, "scrape_url": scrape_url}

result = plan_and_execute(goal, tools)
print("\\n=== FINAL ANSWER ===")
print(result)`,
          },
        ],
      },
      {
        step: 4,
        title: "When plan-and-execute beats ReAct",
        blocks: [
          {
            type: "text",
            content:
              "Plan-and-execute has clear advantages in certain scenarios:",
          },
          {
            type: "kv",
            items: [
              { key: "Known task structure", value: "Booking a flight has fixed steps (search → select → pay). Planning is faster than ReAct's step-by-step exploration." },
              { key: "Parallel execution", value: "Plan reveals independent subtasks. Execute them in parallel (search multiple sources simultaneously)." },
              { key: "Cost optimization", value: "Generate plan with cheap model (GPT-4o-mini), execute with expensive model only when needed." },
              { key: "Human review", value: "Show plan to user before execution. User can approve, modify, or reject." },
              { key: "Progress tracking", value: "Plan is a checklist. Track progress: 'Step 3/7 complete'." },
            ],
          },
          {
            type: "text",
            content:
              "**ReAct wins when:**\n- Task structure is unknown (exploratory research)\n- Early steps reveal information that changes the plan\n- Environment is dynamic (APIs fail, data is missing)\n\n**Best of both worlds:** Use plan-and-execute for structure, ReAct for each step's execution.",
          },
        ],
      },
      {
        step: 5,
        title: "Replanning: when plans fail",
        blocks: [
          {
            type: "text",
            content:
              "Plans fail. Tools timeout, APIs return errors, assumptions are wrong. Agents need to **replan** when execution deviates from the plan:",
          },
          {
            type: "code",
            language: "python",
            label: "Plan-and-execute with replanning",
            code: `def plan_execute_replan(goal: str, tools: dict, max_replans: int = 2):
    """Plan-and-execute with automatic replanning"""

    plan = generate_plan(goal, tools)
    replan_count = 0

    while replan_count <= max_replans:
        print(f"\\n=== Attempt {replan_count + 1} ===")
        print(f"Plan: {plan}")

        # Execute plan
        results, failed_step = execute_plan(plan, tools)

        if failed_step is None:
            # Success! Synthesize and return
            return synthesize_results(goal, results)

        # Plan failed, replan
        print(f"\\n!!! Step {failed_step} failed !!!")

        if replan_count >= max_replans:
            return f"Failed after {max_replans} replan attempts"

        # Generate alternative plan considering the failure
        plan = replan(goal, plan, failed_step, results[:failed_step], tools)
        replan_count += 1

    return "Max replans exceeded"

def replan(
    goal: str,
    original_plan: str,
    failed_step: int,
    completed_results: list,
    tools: dict
) -> str:
    """Generate alternative plan after failure"""

    replan_prompt = f"""The original plan failed at step {failed_step}.

Original goal: {goal}
Original plan:
{original_plan}

Completed steps (before failure):
{chr(10).join(f"{i+1}. {r}" for i, r in enumerate(completed_results))}

Generate an ALTERNATIVE plan that:
1. Uses the results from completed steps
2. Takes a different approach for the failed step
3. Still achieves the original goal

Available tools: {', '.join(tools.keys())}
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": replan_prompt}]
    )

    return response.choices[0].message.content`,
          },
          {
            type: "text",
            content:
              "Replanning is critical for robustness. Without it, one failed API call kills the entire workflow.",
          },
        ],
      },
      {
        step: 6,
        title: "Hierarchical planning",
        blocks: [
          {
            type: "text",
            content:
              "Complex goals require hierarchical planning — high-level plan → detailed sub-plans:",
          },
          {
            type: "diagram",
            label: "Hierarchical planning",
            chart: `graph TD
    A[Plan company conference] --> B[Logistics]
    A --> C[Content]
    A --> D[Marketing]

    B --> B1[Book venue]
    B --> B2[Arrange catering]
    B --> B3[Setup AV equipment]

    C --> C1[Recruit speakers]
    C --> C2[Design agenda]
    C --> C3[Prepare materials]

    D --> D1[Create website]
    D --> D2[Email campaign]
    D --> D3[Social media]

    B1 --> B1a[Research venues]
    B1 --> B1b[Compare prices]
    B1 --> B1c[Sign contract]

    style A fill:#e1f5ff
    style B fill:#fff3cd
    style C fill:#fff3cd
    style D fill:#fff3cd`,
          },
          {
            type: "text",
            content:
              "**Implementation:**\n1. Generate high-level plan (3-7 major phases)\n2. For each phase, generate detailed sub-plan\n3. Execute each sub-plan\n4. Synthesize results and move to next phase",
          },
          {
            type: "code",
            language: "python",
            label: "Hierarchical planner",
            code: `def hierarchical_plan_and_execute(goal: str, tools: dict):
    """Two-level hierarchical planning"""

    # Level 1: High-level plan
    high_level_plan = generate_high_level_plan(goal)
    print("=== HIGH-LEVEL PLAN ===")
    print(high_level_plan)

    phase_results = []

    # For each phase, generate and execute detailed plan
    for phase in parse_phases(high_level_plan):
        print(f"\\n=== PHASE: {phase} ===")

        # Level 2: Detailed plan for this phase
        detailed_plan = generate_detailed_plan(phase, tools)
        print(f"Detailed plan: {detailed_plan}")

        # Execute detailed plan
        phase_result = execute_plan(detailed_plan, tools)
        phase_results.append({
            "phase": phase,
            "result": phase_result
        })

    # Synthesize across all phases
    return synthesize_hierarchical_results(goal, phase_results)

def generate_high_level_plan(goal: str) -> str:
    """Generate 3-7 major phases"""
    prompt = f"""Break this goal into 3-7 major phases (high-level only):

Goal: {goal}

Return a numbered list of phases. Each phase should be a major milestone, not detailed steps.
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content`,
          },
        ],
      },
      {
        step: 7,
        title: "Planning with constraints",
        blocks: [
          {
            type: "text",
            content:
              "Real-world planning has constraints: budget, time, dependencies, API rate limits. Teach the planner about them:",
          },
          {
            type: "code",
            language: "python",
            label: "Constraint-aware planning",
            code: `def plan_with_constraints(
    goal: str,
    tools: dict,
    constraints: dict
):
    """Generate plan that respects constraints"""

    planning_prompt = f"""Generate a plan for this goal:

Goal: $\{goal}

CONSTRAINTS:
- Max budget: $$\{constraints.get('max_budget', 'unlimited')}
- Max time: $\{constraints.get('max_time_minutes', 'unlimited')} minutes
- API rate limits: $\{constraints.get('api_limits', 'none')}
- Must complete by: $\{constraints.get('deadline', 'no deadline')}

Available tools: $\{', '.join(tools.keys())}

Generate a plan that:
1. Respects all constraints
2. Prioritizes high-value steps if budget/time is limited
3. Batches API calls to respect rate limits
4. Includes fallback options if primary approach exceeds constraints

Return numbered steps with estimated cost and time for each.
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": planning_prompt}]
    )

    return response.choices[0].message.content

# Usage
constraints = {
    "max_budget": 50,  # $50 max API spend
    "max_time_minutes": 15,  # Must complete in 15 min
    "api_limits": "Search: 100/day, GPT-4: 10K tokens/min"
}

plan = plan_with_constraints(
    "Analyze sentiment of 1000 customer reviews",
    tools={"search": search, "sentiment_analysis": analyze_sentiment},
    constraints=constraints
)`,
          },
        ],
      },
      {
        step: 8,
        title: "Measuring plan quality",
        blocks: [
          {
            type: "text",
            content:
              "How do you evaluate a planning agent?",
          },
          {
            type: "kv",
            items: [
              { key: "Success rate", value: "Did the plan achieve the goal? Measure on test cases." },
              { key: "Plan efficiency", value: "How many steps? Fewer is better (cost, latency). Compare to ReAct baseline." },
              { key: "Replan frequency", value: "How often does the agent need to replan? Lower is better (indicates good initial plans)." },
              { key: "Constraint adherence", value: "Did the agent stay within budget/time/rate limits?" },
              { key: "Plan correctness", value: "Are steps ordered correctly (dependencies respected)? Are steps actually executable?" },
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Plan quality evaluation",
            code: `def evaluate_planner(test_cases, planner_func):
    """Evaluate planning agent quality"""
    results = []

    for goal, ground_truth_steps, constraints in test_cases:
        # Generate and execute plan
        plan = planner_func(goal, constraints)
        success, steps_taken, replans = execute_and_track(plan)

        # Measure quality
        results.append({
            "goal": goal,
            "success": success,
            "steps": steps_taken,
            "replans": replans,
            "efficiency": len(ground_truth_steps) / steps_taken,
            "constraints_met": check_constraints(plan, constraints)
        })

    # Aggregate metrics
    success_rate = sum(r["success"] for r in results) / len(results)
    avg_steps = sum(r["steps"] for r in results) / len(results)
    avg_replans = sum(r["replans"] for r in results) / len(results)
    avg_efficiency = sum(r["efficiency"] for r in results) / len(results)

    print(f"Success rate: {success_rate:.1%}")
    print(f"Avg steps: {avg_steps:.1f}")
    print(f"Avg replans: {avg_replans:.1f}")
    print(f"Efficiency vs optimal: {avg_efficiency:.2f}")

    return results`,
          },
        ],
      },
      {
        step: 9,
        title: "Hybrid: ReAct + Planning",
        blocks: [
          {
            type: "text",
            content:
              "The best agents combine both patterns:",
          },
          {
            type: "kv",
            items: [
              { key: "Plan the structure", value: "Use plan-and-execute to generate high-level workflow" },
              { key: "ReAct the execution", value: "Use ReAct to execute each step (handles dynamic environment)" },
              { key: "Replan when needed", value: "If ReAct execution reveals plan is wrong, replan" },
            ],
          },
          {
            type: "diagram",
            label: "Hybrid architecture",
            chart: `graph LR
    A[Goal] --> B[Generate Plan]
    B --> C[Step 1]
    C --> D[ReAct execution]
    D --> E{Success?}
    E -->|Yes| F[Step 2]
    E -->|No| G[Replan]
    G --> B
    F --> H[ReAct execution]
    H --> I[Done]

    style B fill:#fff3cd
    style D fill:#e7f3ff
    style H fill:#e7f3ff
    style G fill:#f8d7da`,
          },
          {
            type: "text",
            content:
              "This hybrid approach:\n- Reduces wasted exploration (plan provides structure)\n- Handles dynamic environments (ReAct adapts to failures)\n- Optimizes cost (plan with cheap model, execute with expensive)\n- Maximizes success rate (best of both worlds)",
          },
        ],
      },
      {
        step: 10,
        title: "Common planning failures",
        blocks: [
          {
            type: "callout",
            kind: "gotcha",
            title: "Over-detailed plans",
            content:
              "Agent generates 30-step plan for a simple task. Too brittle — any step failure cascades.\n\n**Fix:** Prompt for 3-7 high-level steps max. Use hierarchical planning for complex goals.",
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Ignoring dependencies",
            content:
              "Plan tries to 'book hotel' before 'search for hotels'. Steps out of order.\n\n**Fix:** Explicitly prompt: 'Order steps so dependencies are satisfied. If step B needs output of step A, put A first.'",
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "No fallback plans",
            content:
              "Primary plan fails, agent gives up. No alternative explored.\n\n**Fix:** Implement replanning (see step 5). Or prompt for 'Plan A and Plan B' upfront.",
          },
        ],
      },
      {
        step: 11,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "When should you use plan-and-execute instead of ReAct?",
            options: [
              "When the task structure is known and steps are mostly independent (enables parallel execution and progress tracking)",
              "Always — planning is always better than reactive execution",
              "Never — ReAct is universally superior",
              "Only for tasks with fewer than 3 steps",
            ],
            correct: 0,
            explanation:
              "Plan-and-execute works best when: (1) task structure is knowable upfront (booking a flight has fixed steps), (2) subtasks are independent (can execute in parallel), (3) you want progress tracking ('Step 3/7 done'), or (4) you need human-in-the-loop approval before execution. ReAct wins for exploratory tasks where early steps reveal info that changes the approach. The hybrid approach (plan structure, ReAct execution) often performs best.",
          },
        ],
      },
      {
        step: 12,
        title: "What's next",
        blocks: [
          {
            type: "text",
            content:
              "You've mastered the core agent patterns: tool use, ReAct, memory, and planning. The remaining lessons cover advanced topics: multi-agent systems (agents working together), LangChain/LangGraph frameworks (production agent libraries), and building complete agent projects. You now have the foundation to build production-grade AI agents.",
          },
        ],
      },
    ],
  },
  stub(
    "multi-agent-systems",
    6,
    20,
    "Multi-Agent Collaboration",
    "Build systems where multiple agents work together — delegation, debate, collaboration, hierarchical agents.",
    ["Multi-agent", "Collaboration", "Orchestration", "Architecture"],
    "Multiple specialized agents can outperform a single generalist. This lesson covers delegation pattern (router assigns tasks to specialists: code agent, research agent, math agent), collaboration pattern (agents work in parallel, results are merged), debate pattern (agents propose solutions, critique each other, consensus emerges), hierarchical pattern (manager coordinates workers, workers report back), and communication protocols (shared memory, message passing, blackboard architecture). You'll build a multi-agent research system (one agent gathers data, one analyzes, one writes report), measure coordination overhead (how much extra latency/cost?), and learn when multi-agent is worth it (task has clear specialization, subtasks are independent, quality > cost).",
  ),
  stub(
    "langchain-agents",
    7,
    16,
    "Building Agents with LangChain",
    "Use LangChain's agent abstractions — AgentExecutor, tool loading, memory integration, custom agents.",
    ["LangChain", "Framework", "Integration", "Production"],
    "LangChain provides high-level agent abstractions. This lesson covers AgentExecutor (the orchestration engine), agent types (OpenAI Functions, ReAct, Conversational), loading tools (built-in tools like DuckDuckGo, custom tools from Python functions), memory integration (ConversationBufferMemory, VectorStoreRetrieverMemory), callbacks (logging, tracing, cost tracking), and custom agents (subclass BaseSingleActionAgent for custom logic). You'll build a LangChain agent, add custom tools, integrate with a vector DB for memory, and compare to building from scratch (pros: fast prototyping, cons: harder to debug, more abstraction layers).",
  ),
  stub(
    "langgraph-workflows",
    8,
    20,
    "Agent Workflows with LangGraph",
    "Build complex agent workflows as graphs — cycles, conditionals, parallel execution, state management.",
    ["LangGraph", "Workflows", "State machines", "Control flow"],
    "LangGraph models agents as graphs instead of linear chains. This lesson covers graph nodes (each node is a function: LLM call, tool call, decision), edges (conditional routing based on node output), cycles (loop until condition met, e.g., retry on error), parallel execution (fan-out to multiple nodes, fan-in to merge results), state management (shared state across nodes, state updates), and debugging (graph visualization, step-by-step execution). You'll build a customer support agent as a graph (classify intent → route to specialist → fallback to human if unsolved), compare to LangChain's linear chains (graphs handle complex control flow better), and learn when graphs are overkill (simple linear workflows don't need graph complexity).",
  ),
  stub(
    "autonomous-agents",
    9,
    18,
    "Autonomous Agents: AutoGPT and BabyAGI",
    "Study autonomous agent architectures — long-running, self-directed, goal-seeking agents.",
    ["AutoGPT", "BabyAGI", "Autonomy", "Long-running"],
    "Autonomous agents pursue goals over hours or days with minimal human guidance. This lesson covers AutoGPT architecture (continuously loops: set goal → plan → execute → self-reflect → adjust), BabyAGI pattern (task list, prioritization, execution, new tasks created dynamically), challenges (cost explosion, infinite loops, goal drift, hallucinated progress), safety mechanisms (cost budgets, human-in-the-loop checkpoints, sandboxing), and real-world uses (long-running research, competitive analysis, automated testing). You'll build a mini AutoGPT (50 lines: goal → generate tasks → execute → reflect → iterate), stress-test it (adversarial goals that trigger loops), and learn why full autonomy is hard (agents optimize for the proxy metric, not the true goal).",
  ),
  stub(
    "agent-evaluation",
    10,
    16,
    "Evaluating Agent Performance",
    "Measure agent quality — success rate, tool efficiency, reasoning quality, cost, latency.",
    ["Evaluation", "Metrics", "Testing", "Benchmarks"],
    "Agents are harder to evaluate than static LLMs. This lesson covers success rate (did the agent achieve the goal?), trajectory efficiency (how many steps did it take?), tool usage metrics (correct tool selection rate, unnecessary tool calls), reasoning quality (is the thought trace logical?), cost per task (total LLM + tool API costs), latency (time to first answer, total time), and agent benchmarks (HotPotQA for multi-hop reasoning, WebShop for decision-making, MINT for tool use). You'll build an agent eval suite (20 test cases with expected tool sequences), measure success rate and efficiency, identify failure modes (stuck reasoning, tool misuse), and learn when to compare agents (new prompt, new model, new tool set).",
  ),
  stub(
    "production-agents",
    11,
    18,
    "Agents in Production",
    "Deploy agents at scale — rate limiting, error handling, observability, cost control, human-in-the-loop.",
    ["Production", "Deployment", "Observability", "Scale"],
    "Production agents require infrastructure. This lesson covers rate limiting (OpenAI/Anthropic API limits, exponential backoff), error handling (tool timeouts, API errors, partial failures), observability (tracing with LangSmith/Phoenix, logging tool calls, alerting on anomalies), cost control (budgets per user, cheaper models for simple tasks, caching tool results), human-in-the-loop (escalate to human when stuck, approval gates for high-risk actions), and safety (sandboxing code execution, input validation, output filtering). You'll deploy an agent behind an API, implement tracing and cost tracking, add human approval for certain tools, and learn production failure modes (runaway loops in prod, cost spikes, latency outliers).",
  ),
  stub(
    "project-research-agent",
    12,
    30,
    "Project: Multi-Tool Research Agent",
    "Build an end-to-end research agent — search, scrape, analyze, synthesize, with tracing and error handling.",
    ["Project", "Full stack", "Research", "Tools"],
    "Build a production-ready research agent from scratch. Your agent will: (1) take a research question, (2) search Google, (3) scrape top results, (4) extract key facts, (5) query Wikipedia for background, (6) use calculator for any math, (7) synthesize findings into a report. You'll implement: ReAct loop, tool calling with OpenAI API, error handling (retry on failure, fallback to search if scrape fails), tracing (log every step to JSON), cost tracking, max steps limit, and unit tests for each tool. You'll compare your agent to LangChain's built-in research agents (yours is faster, theirs has more features), measure success rate on 20 research questions, and optimize for cost (cache search results, use cheaper models for synthesis). This is a portfolio-ready project showing end-to-end agent development.",
  ),
];
