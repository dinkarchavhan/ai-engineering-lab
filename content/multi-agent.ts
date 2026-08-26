import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — Multi-Agent Systems Fundamentals (fully written as the reference)
// ---------------------------------------------------------------------------
const multiAgentFundamentalsLesson: Lesson = {
  slug: "multi-agent-fundamentals",
  trackSlug: "multi-agent",
  order: 1,
  minutes: 24,
  title: "Multi-Agent Systems Fundamentals",
  subtitle:
    "When one agent isn't enough — orchestrating multiple specialized agents for complex tasks through collaboration and coordination.",
  tags: ["Multi-agent", "Collaboration", "Orchestration", "First principles"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Single agents hit limits on complex tasks:\n\n- **Knowledge boundaries** — one agent can't be expert at everything (coding + research + design + writing)\n- **Context limits** — 200K tokens is finite. Large codebases, long documents, multi-day research exceed one context window\n- **Reasoning depth** — some problems need multiple perspectives, not just one reasoning path\n- **Scalability** — one agent processes tasks sequentially. Multiple agents can work in parallel\n- **Robustness** — if the single agent fails or gets stuck, the entire workflow halts\n\nThe problem: how do you coordinate multiple agents to tackle tasks that are too complex, too large, or too diverse for a single agent?",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "Multi-agent systems are like **teams**: a project manager coordinates specialists (backend engineer, frontend engineer, designer, QA tester). Each has expertise, they work in parallel, and the manager synthesizes results.",
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
            "Multi-agent systems unlock tasks that single agents can't handle:",
        },
        {
          type: "kv",
          items: [
            { key: "Parallel execution", value: "Research agent gathers data while code agent writes tests while design agent reviews UI — 3x faster than sequential." },
            { key: "Specialization", value: "Each agent optimized for its domain. Backend agent has backend tools, research agent has search/scrape, writing agent has style guides." },
            { key: "Quality through diversity", value: "Multiple agents propose solutions, debate, critique each other — better than one agent iterating alone." },
            { key: "Scale beyond context", value: "Split a 1M-line codebase across 10 agents, each analyzing 100K lines. No single agent sees everything, but the coordinator synthesizes." },
            { key: "Fault tolerance", value: "If one agent fails, others continue. Coordinator can retry failed agents or route to alternatives." },
          ],
        },
        {
          type: "text",
          content:
            "**Real-world applications:**\n- **Software development** — architect designs, backend/frontend agents implement, QA tests, tech writer documents\n- **Research synthesis** — agents search different databases, analyze papers, synthesize findings into report\n- **Code review** — security agent checks for vulnerabilities, style agent checks formatting, logic agent checks correctness\n- **Content creation** — research agent gathers facts, outline agent structures, writing agent drafts, editor agent polishes",
        },
      ],
    },
    {
      step: 3,
      title: "Core patterns: delegation, collaboration, debate",
      blocks: [
        {
          type: "text",
          content:
            "Multi-agent systems organize around three fundamental patterns:",
        },
        {
          type: "kv",
          items: [
            { key: "1. Delegation (Supervisor)", value: "One manager agent assigns subtasks to worker agents. Manager decides who does what, collects results, synthesizes." },
            { key: "2. Collaboration (Peer-to-peer)", value: "Agents work in parallel on independent subtasks, then merge results. No single coordinator — collective effort." },
            { key: "3. Debate (Adversarial)", value: "Agents propose competing solutions, critique each other, strongest survives. Diversity improves quality." },
          ],
        },
        {
          type: "diagram",
          label: "Multi-agent patterns",
          chart: `graph TD
    subgraph Delegation
    M[Manager Agent] --> W1[Worker 1: Research]
    M --> W2[Worker 2: Code]
    M --> W3[Worker 3: Test]
    W1 --> M
    W2 --> M
    W3 --> M
    M --> R1[Synthesized Result]
    end

    subgraph Collaboration
    T[Task] --> A1[Agent 1]
    T --> A2[Agent 2]
    T --> A3[Agent 3]
    A1 --> MG[Merge Results]
    A2 --> MG
    A3 --> MG
    end

    subgraph Debate
    P[Problem] --> D1[Agent 1: Solution A]
    P --> D2[Agent 2: Solution B]
    P --> D3[Agent 3: Solution C]
    D1 --> J[Judge: Pick Best]
    D2 --> J
    D3 --> J
    end

    style M fill:#fff3cd
    style W1 fill:#d4edda
    style W2 fill:#d4edda
    style W3 fill:#d4edda
    style R1 fill:#e1f5ff`,
        },
        {
          type: "text",
          content:
            "**When to use each:**\n- **Delegation** — clear hierarchy, distinct subtasks (manager knows how to split the work)\n- **Collaboration** — independent parallelizable work (each agent contributes a piece)\n- **Debate** — no clear 'right answer', want multiple perspectives (design review, strategic decisions)",
        },
      ],
    },
    {
      step: 4,
      title: "Building a delegation system: supervisor pattern",
      blocks: [
        {
          type: "text",
          content:
            "The supervisor pattern is the most common multi-agent architecture. Let's build one:",
        },
        {
          type: "code",
          language: "python",
          label: "Supervisor multi-agent system",
          code: `from openai import OpenAI
import json

client = OpenAI()

# Define specialist agents
AGENTS = {
    "researcher": {
        "name": "Research Agent",
        "system_prompt": "You are a research specialist. Search for information, analyze sources, summarize findings.",
        "tools": ["search", "scrape"]
    },
    "coder": {
        "name": "Code Agent",
        "system_prompt": "You are a coding specialist. Write, debug, and test code.",
        "tools": ["write_file", "run_code", "read_file"]
    },
    "writer": {
        "name": "Writing Agent",
        "system_prompt": "You are a writing specialist. Draft clear, polished content.",
        "tools": ["write_document"]
    }
}

# Supervisor agent
SUPERVISOR_PROMPT = """You are a project manager coordinating specialist agents.

Available agents:
- researcher: search, analyze, summarize
- coder: write and debug code
- writer: draft polished content

Task: {task}

Break this into subtasks. For each subtask:
1. Assign to the right agent
2. Provide clear instructions

Return JSON:
{{
  "plan": [
    {{"agent": "researcher", "task": "..."}},
    {{"agent": "coder", "task": "..."}},
    ...
  ]
}}
"""

def call_agent(agent_name: str, task: str) -> str:
    """Call a specialist agent"""
    agent = AGENTS[agent_name]

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": agent["system_prompt"]},
            {"role": "user", "content": task}
        ],
        temperature=0
    )

    return response.choices[0].message.content

def supervisor(task: str) -> str:
    """Supervisor orchestrates specialist agents"""
    # 1. Supervisor creates plan
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": SUPERVISOR_PROMPT.format(task=task)}
        ],
        temperature=0,
        response_format={"type": "json_object"}
    )

    plan = json.loads(response.choices[0].message.content)
    print(f"Plan: {plan}\\n")

    # 2. Execute each subtask with assigned agent
    results = []
    for subtask in plan["plan"]:
        agent_name = subtask["agent"]
        agent_task = subtask["task"]

        print(f"→ {agent_name}: {agent_task}")
        result = call_agent(agent_name, agent_task)
        print(f"✓ {agent_name} completed\\n")

        results.append({
            "agent": agent_name,
            "task": agent_task,
            "result": result
        })

    # 3. Supervisor synthesizes results
    synthesis_prompt = f"""Synthesize these results into a final answer:

Task: {task}

Results:
{json.dumps(results, indent=2)}

Provide a complete, cohesive answer.
"""

    final_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": synthesis_prompt}],
        temperature=0
    )

    return final_response.choices[0].message.content

# Test
result = supervisor(
    "Research Python best practices for async programming, "
    "write example code, and draft a tutorial blog post."
)

print("=== Final Result ===")
print(result)`,
        },
        {
          type: "text",
          content:
            "**This supervisor system:**\n1. Supervisor breaks task into subtasks (plan)\n2. Assigns each subtask to specialist agent\n3. Agents execute in sequence (could be parallel)\n4. Supervisor synthesizes results into final answer\n\nThis is the **core pattern** for multi-agent orchestration.",
        },
      ],
    },
    {
      step: 5,
      title: "Parallel execution: unlocking speed",
      blocks: [
        {
          type: "text",
          content:
            "The supervisor example ran agents sequentially. For independent tasks, run in parallel:",
        },
        {
          type: "code",
          language: "python",
          label: "Parallel agent execution",
          code: `import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def call_agent_async(agent_name: str, task: str) -> dict:
    """Call agent asynchronously"""
    agent = AGENTS[agent_name]

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": agent["system_prompt"]},
            {"role": "user", "content": task}
        ],
        temperature=0
    )

    return {
        "agent": agent_name,
        "task": task,
        "result": response.choices[0].message.content
    }

async def supervisor_parallel(task: str) -> str:
    """Supervisor with parallel execution"""
    # 1. Create plan (same as before)
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": SUPERVISOR_PROMPT.format(task=task)}
        ],
        response_format={"type": "json_object"}
    )

    plan = json.loads(response.choices[0].message.content)

    # 2. Execute all subtasks in parallel
    tasks = [
        call_agent_async(subtask["agent"], subtask["task"])
        for subtask in plan["plan"]
    ]

    results = await asyncio.gather(*tasks)

    # 3. Synthesize (same as before)
    synthesis_prompt = f"""Synthesize: {task}

Results: {json.dumps(results, indent=2)}
"""

    final_response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": synthesis_prompt}]
    )

    return final_response.choices[0].message.content

# Test
result = asyncio.run(supervisor_parallel(
    "Research Python async, write code, draft blog post"
))

# Sequential: 60 seconds (20s per agent)
# Parallel: 20 seconds (all agents run at once)
# Speedup: 3x`,
        },
        {
          type: "text",
          content:
            "**Parallel execution gains:**\n- 3 independent tasks → 3x speedup\n- 10 independent tasks → 10x speedup\n- Only works when tasks don't depend on each other (research doesn't need code result)",
        },
      ],
    },
    {
      step: 6,
      title: "Communication protocols: shared state vs message passing",
      blocks: [
        {
          type: "text",
          content:
            "Agents need to communicate. Two approaches:",
        },
        {
          type: "kv",
          items: [
            { key: "Shared state", value: "Agents read/write to shared context (conversation history, global variables). Simple but risks conflicts if agents write simultaneously." },
            { key: "Message passing", value: "Agents send explicit messages to each other. Clear communication, but requires message routing and handling." },
          ],
        },
        {
          type: "code",
          language: "python",
          label: "Message passing between agents",
          code: `class AgentMessage:
    def __init__(self, from_agent: str, to_agent: str, content: str):
        self.from_agent = from_agent
        self.to_agent = to_agent
        self.content = content

class MessageBus:
    """Routes messages between agents"""
    def __init__(self):
        self.messages = []

    def send(self, message: AgentMessage):
        self.messages.append(message)

    def get_messages_for(self, agent: str) -> list[AgentMessage]:
        """Get messages addressed to this agent"""
        msgs = [m for m in self.messages if m.to_agent == agent]
        # Remove delivered messages
        self.messages = [m for m in self.messages if m.to_agent != agent]
        return msgs

# Agents communicate through message bus
bus = MessageBus()

def researcher_agent(task: str, bus: MessageBus) -> str:
    """Research agent"""
    # Do research
    findings = "Python async uses asyncio library..."

    # Send findings to coder
    bus.send(AgentMessage(
        from_agent="researcher",
        to_agent="coder",
        content=f"Research findings: {findings}"
    ))

    return findings

def coder_agent(task: str, bus: MessageBus) -> str:
    """Coder agent"""
    # Check for messages
    messages = bus.get_messages_for("coder")

    context = ""
    if messages:
        context = "\\n".join([m.content for m in messages])

    # Write code using research context
    prompt = f"{context}\\n\\nWrite example code for: {task}"
    # ... call LLM ...

    code = "async def example(): ..."

    # Send code to writer
    bus.send(AgentMessage(
        from_agent="coder",
        to_agent="writer",
        content=f"Code example: {code}"
    ))

    return code

def writer_agent(task: str, bus: MessageBus) -> str:
    """Writer agent"""
    # Check for messages
    messages = bus.get_messages_for("writer")

    context = "\\n".join([m.content for m in messages])

    # Write blog post using research + code context
    prompt = f"{context}\\n\\nWrite blog post: {task}"
    # ... call LLM ...

    return "Blog post draft..."

# Execute in sequence, passing messages
researcher_agent("Python async best practices", bus)
coder_agent("async example", bus)
article = writer_agent("async tutorial", bus)`,
        },
        {
          type: "text",
          content:
            "**Message passing benefits:**\n- Explicit communication (no hidden dependencies)\n- Agents can request help from each other\n- Coordinator can observe all communication\n- Easier to debug (message log shows what happened)",
        },
      ],
    },
    {
      step: 7,
      title: "Debate pattern: multiple perspectives",
      blocks: [
        {
          type: "text",
          content:
            "For problems with no clear solution, have agents debate:",
        },
        {
          type: "code",
          language: "python",
          label: "Debate system for better solutions",
          code: `def generate_solutions(problem: str, num_agents: int = 3) -> list[str]:
    """Multiple agents independently propose solutions"""
    solutions = []

    for i in range(num_agents):
        # Each agent has slightly different perspective
        perspectives = [
            "Focus on simplicity and maintainability",
            "Focus on performance and scalability",
            "Focus on security and reliability"
        ]

        prompt = f"""Problem: {problem}

Perspective: {perspectives[i]}

Propose a solution focusing on your perspective.
"""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7  # Higher temp for diversity
        )

        solutions.append({
            "agent": i + 1,
            "perspective": perspectives[i],
            "solution": response.choices[0].message.content
        })

    return solutions

def critique_solutions(problem: str, solutions: list[str]) -> list[dict]:
    """Agents critique each other's solutions"""
    critiques = []

    for solution in solutions:
        # Each solution is critiqued by an adversarial agent
        prompt = f"""Problem: {problem}

Proposed solution:
{solution['solution']}

Critique this solution:
1. What are its strengths?
2. What are its weaknesses?
3. What's the biggest risk?
4. Score 1-10 for: simplicity, performance, security

Return JSON with scores and reasoning.
"""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        critique = json.loads(response.choices[0].message.content)
        critiques.append({
            "solution": solution,
            "critique": critique
        })

    return critiques

def select_best(critiques: list[dict]) -> str:
    """Judge selects best solution based on critiques"""
    # Aggregate scores
    for c in critiques:
        scores = c["critique"].get("scores", {})
        c["total_score"] = sum(scores.values())

    # Sort by score
    critiques.sort(key=lambda x: x["total_score"], reverse=True)

    # Winner
    winner = critiques[0]

    # Synthesize: take best solution, incorporate insights from others
    synthesis_prompt = f"""Best solution:
{winner['solution']['solution']}

Other insights:
{json.dumps([c['critique'] for c in critiques[1:]], indent=2)}

Improve the best solution by incorporating insights from critiques.
"""

    final = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": synthesis_prompt}]
    )

    return final.choices[0].message.content

# Full debate workflow
problem = "Design a caching layer for a high-traffic API"
solutions = generate_solutions(problem, num_agents=3)
critiques = critique_solutions(problem, solutions)
best_solution = select_best(critiques)

print("=== Best Solution (after debate) ===")
print(best_solution)`,
        },
        {
          type: "text",
          content:
            "**Debate pattern:**\n1. **Generate** — N agents propose independent solutions (diverse perspectives)\n2. **Critique** — each solution is adversarially reviewed\n3. **Select** — judge picks winner based on critiques\n4. **Synthesize** — improve winner by incorporating insights from losers\n\nThis produces **better solutions** than a single agent iterating alone.",
        },
      ],
    },
    {
      step: 8,
      title: "Coordination overhead: when multi-agent isn't worth it",
      blocks: [
        {
          type: "text",
          content:
            "Multi-agent systems have costs:",
        },
        {
          type: "kv",
          items: [
            { key: "Latency overhead", value: "Supervisor adds 1 extra LLM call. Message passing adds coordination. Can be 2-5x slower than single agent for simple tasks." },
            { key: "Cost overhead", value: "3 agents = 3x the LLM calls. Debate with 3 proposals + critiques = 6x calls. Expensive for low-value tasks." },
            { key: "Complexity overhead", value: "More code, more failure modes, harder to debug. Is it worth the maintenance burden?" },
            { key: "Coordination failures", value: "Agents misunderstand each other, duplicate work, conflict on shared state." },
          ],
        },
        {
          type: "text",
          content:
            "**When to use multi-agent:**\n- Task naturally splits into independent subtasks (research + code + write)\n- Task requires diverse expertise (security + performance + UX)\n- Task is too large for one context window (analyze 10 repos simultaneously)\n- Quality improvement justifies cost (debate for critical architectural decisions)\n\n**When NOT to use multi-agent:**\n- Simple tasks (single LLM call is faster and cheaper)\n- Sequential dependencies (agent B needs agent A's output → no parallelism)\n- Tight latency constraints (coordination overhead unacceptable)\n- Low-value tasks (cost of 3-5x LLM calls not worth it)",
        },
      ],
    },
    {
      step: 9,
      title: "Agent handoffs: passing work between specialists",
      blocks: [
        {
          type: "text",
          content:
            "Sometimes agents work sequentially, each handing off to the next:",
        },
        {
          type: "code",
          language: "python",
          label: "Handoff pattern",
          code: `class WorkflowState:
    """Shared state passed between agents"""
    def __init__(self):
        self.task = ""
        self.research = None
        self.code = None
        self.tests = None
        self.documentation = None

def workflow_with_handoffs(task: str) -> WorkflowState:
    """Sequential workflow with handoffs"""
    state = WorkflowState()
    state.task = task

    # Agent 1: Research
    print("→ Research agent")
    state.research = call_agent("researcher",
        f"Research best practices for: {task}")

    # Agent 2: Code (uses research)
    print("→ Code agent")
    state.code = call_agent("coder",
        f"Write code for: {task}\\n\\nContext: {state.research}")

    # Agent 3: Test (uses code)
    print("→ Test agent")
    state.tests = call_agent("tester",
        f"Write tests for this code:\\n{state.code}")

    # Agent 4: Documentation (uses all above)
    print("→ Doc agent")
    state.documentation = call_agent("writer",
        f"""Write documentation for:
        Task: {task}
        Code: {state.code}
        Tests: {state.tests}
        Background: {state.research}
        """)

    return state

# Run workflow
result = workflow_with_handoffs("async task queue")

print("=== Complete Workflow Output ===")
print(f"Code:\\n{result.code}")
print(f"\\nTests:\\n{result.tests}")
print(f"\\nDocs:\\n{result.documentation}")`,
        },
        {
          type: "text",
          content:
            "**Handoff benefits:**\n- Each agent builds on previous work (no duplication)\n- State object tracks progress (can resume if agent fails)\n- Clear dependencies (agent N waits for agent N-1)\n- Easy to add checkpoints (human reviews code before tests are written)",
        },
      ],
    },
    {
      step: 10,
      title: "Multi-agent with LangGraph: stateful orchestration",
      blocks: [
        {
          type: "text",
          content:
            "LangGraph models multi-agent systems as graphs. Here's a supervisor pattern in LangGraph:",
        },
        {
          type: "code",
          language: "python",
          label: "Multi-agent with LangGraph",
          code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, Sequence
from langchain_openai import ChatOpenAI

# Define state
class AgentState(TypedDict):
    task: str
    plan: list[dict]
    results: Annotated[Sequence[str], "append"]  # Append-only list
    final_answer: str

# Create graph
workflow = StateGraph(AgentState)

# Supervisor node
def supervisor_node(state: AgentState) -> AgentState:
    """Create execution plan"""
    llm = ChatOpenAI(model="gpt-4o")

    response = llm.invoke(
        f"Break into subtasks: {state['task']}\\nReturn JSON plan"
    )

    plan = parse_plan(response.content)
    return {"plan": plan}

# Worker nodes
def research_agent(state: AgentState) -> AgentState:
    """Research specialist"""
    task = next(t for t in state["plan"] if t["agent"] == "researcher")
    result = call_agent("researcher", task["task"])
    return {"results": [result]}

def code_agent(state: AgentState) -> AgentState:
    """Code specialist"""
    task = next(t for t in state["plan"] if t["agent"] == "coder")
    result = call_agent("coder", task["task"])
    return {"results": [result]}

def synthesize_node(state: AgentState) -> AgentState:
    """Combine results"""
    llm = ChatOpenAI(model="gpt-4o")

    synthesis = llm.invoke(
        f"Synthesize results for: {state['task']}\\n\\n{state['results']}"
    )

    return {"final_answer": synthesis.content}

# Build graph
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("researcher", research_agent)
workflow.add_node("coder", code_agent)
workflow.add_node("synthesize", synthesize_node)

# Define edges (workflow)
workflow.set_entry_point("supervisor")
workflow.add_edge("supervisor", "researcher")
workflow.add_edge("supervisor", "coder")  # Parallel execution
workflow.add_edge("researcher", "synthesize")
workflow.add_edge("coder", "synthesize")
workflow.add_edge("synthesize", END)

# Compile and run
app = workflow.compile()
result = app.invoke({"task": "Research Python async and write example code"})

print(result["final_answer"])`,
        },
        {
          type: "text",
          content:
            "**LangGraph benefits for multi-agent:**\n- Explicit state management (typed state schema)\n- Parallel execution (graph branches)\n- Cycles and conditionals (retry on failure, route based on confidence)\n- Visualization (auto-generate Mermaid diagram of workflow)\n- Checkpoints (resume from any node)",
        },
      ],
    },
    {
      step: 11,
      title: "Common failure modes and debugging",
      blocks: [
        {
          type: "text",
          content:
            "Multi-agent systems fail in new ways:",
        },
        {
          type: "list",
          style: "bullet",
          items: [
            "**Coordination deadlock** — agent A waits for B, B waits for A. Solution: timeout, circuit breaker.",
            "**Duplicate work** — two agents do the same task because supervisor didn't coordinate. Solution: explicit task assignment, shared state.",
            "**Conflicting updates** — agents write to same resource simultaneously. Solution: locks, message passing instead of shared state.",
            "**Lost context** — agent B doesn't have context from agent A's work. Solution: pass full state in handoffs, shared memory.",
            "**Cost explosion** — 10 agents × 20 LLM calls = 200 calls. Solution: budgets, cheaper models for simple agents.",
            "**Cascade failures** — agent A fails → agent B that depends on A also fails → whole workflow fails. Solution: fallbacks, optional dependencies.",
          ],
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "Log every agent interaction: who called whom, what was passed, what was returned. Without logs, debugging multi-agent systems is impossible.",
        },
      ],
    },
    {
      step: 12,
      title: "Measuring multi-agent performance",
      blocks: [
        {
          type: "text",
          content:
            "Key metrics for multi-agent systems:",
        },
        {
          type: "kv",
          items: [
            { key: "Latency", value: "Total time (wall-clock). Compare sequential vs parallel. Measure coordination overhead (supervisor adds how much?)." },
            { key: "Cost", value: "Total LLM calls across all agents. Measure cost per task. Is multi-agent worth 3-5x single-agent cost?" },
            { key: "Quality", value: "Is the multi-agent output better than single agent? Run evals on both, compare scores." },
            { key: "Success rate", value: "% of tasks completed without human intervention. Multi-agent should be more robust (failover)." },
            { key: "Parallelism efficiency", value: "Speedup = sequential time / parallel time. Ideal: 3 agents = 3x speedup. Reality: 2-2.5x (coordination overhead)." },
          ],
        },
        {
          type: "code",
          language: "python",
          label: "Measuring multi-agent system",
          code: `import time

def measure_multi_agent(task: str, single_agent_fn, multi_agent_fn):
    """Compare single vs multi-agent"""

    # Single agent
    start = time.time()
    single_result = single_agent_fn(task)
    single_time = time.time() - start

    # Multi-agent
    start = time.time()
    multi_result = multi_agent_fn(task)
    multi_time = time.time() - start

    print(f"Single agent: {single_time:.1f}s")
    print(f"Multi-agent: {multi_time:.1f}s")
    print(f"Speedup: {single_time / multi_time:.2f}x")

    # Quality comparison (would need LLM-as-judge or human eval)
    # quality_single = evaluate(single_result)
    # quality_multi = evaluate(multi_result)

    return {
        "single_time": single_time,
        "multi_time": multi_time,
        "speedup": single_time / multi_time
    }`,
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
            "In the hands-on project, you'll build a multi-agent software development system. It will have 5 agents: (1) architect designs system, (2) backend agent writes server code, (3) frontend agent writes UI, (4) test agent writes tests, (5) QA agent reviews everything. You'll implement three orchestration patterns (supervisor for coordination, parallel execution for backend/frontend, debate for architectural decisions), add message passing for inter-agent communication, implement failure recovery (retry failed agents, escalate to human), measure performance (compare to single-agent baseline), and deploy with LangGraph for stateful workflows.",
        },
      ],
    },
    {
      step: 14,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question: "What's the key difference between delegation and collaboration patterns in multi-agent systems?",
          options: [
            "Delegation has a supervisor coordinating workers; collaboration has peer agents working independently in parallel",
            "Delegation is faster, collaboration is more accurate",
            "Delegation uses message passing, collaboration uses shared state",
            "They are the same pattern with different names",
          ],
          correct: 0,
          explanation:
            "Delegation (supervisor pattern) has a central manager that assigns tasks to workers and synthesizes results — hierarchical structure. Collaboration (peer-to-peer) has agents working independently on subtasks in parallel, then merging results — no single coordinator. Delegation gives more control but adds coordination overhead; collaboration is faster for independent tasks but requires careful merge logic.",
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
    trackSlug: "multi-agent",
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

export const multiAgentLessons: Lesson[] = [
  multiAgentFundamentalsLesson,
  {
    slug: "orchestration-patterns",
    trackSlug: "multi-agent",
    order: 2,
    minutes: 20,
    title: "Orchestration Patterns Deep Dive",
    subtitle: "Master supervisor, peer-to-peer, hierarchical, and hybrid patterns for agent coordination.",
    tags: ["Orchestration", "Patterns", "Coordination", "Architecture"],
    sections: [
      {
        step: 1,
        title: "Pattern overview",
        blocks: [
          {
            type: "text",
            content:
              "Different tasks need different orchestration patterns:\n\n- **Supervisor** — one manager, many workers (most common)\n- **Peer-to-peer** — no manager, agents work independently\n- **Hierarchical** — managers managing managers (scales to 100+ agents)\n- **Hybrid** — supervisor at top, P2P within teams",
          },
          {
            type: "diagram",
            label: "Orchestration patterns",
            chart: `graph TD
    subgraph "Supervisor"
    S[Supervisor] --> W1[Worker 1]
    S --> W2[Worker 2]
    S --> W3[Worker 3]
    W1 --> S
    W2 --> S
    W3 --> S
    end

    subgraph "Peer-to-Peer"
    T[Task] --> P1[Agent 1]
    T --> P2[Agent 2]
    T --> P3[Agent 3]
    P1 --> M[Merge]
    P2 --> M
    P3 --> M
    end

    subgraph "Hierarchical"
    SM[Super Manager] --> M1[Manager 1]
    SM --> M2[Manager 2]
    M1 --> T1[Team 1]
    M1 --> T2[Team 2]
    M2 --> T3[Team 3]
    M2 --> T4[Team 4]
    end

    style S fill:#e1f5ff
    style SM fill:#d4edda
    style T fill:#fff3cd`,
          },
        ],
      },
      {
        step: 2,
        title: "Supervisor pattern",
        blocks: [
          {
            type: "text",
            content:
              "Most common pattern: one supervisor assigns work, collects results.",
          },
          {
            type: "code",
            language: "python",
            label: "Supervisor orchestration",
            code: `from typing import List, Dict
from langchain_openai import ChatOpenAI

class SupervisorOrchestrator:
    def __init__(self):
        self.supervisor = ChatOpenAI(model="gpt-4o")
        self.workers = {
            "researcher": ChatOpenAI(model="gpt-4o-mini"),
            "analyst": ChatOpenAI(model="gpt-4o-mini"),
            "writer": ChatOpenAI(model="gpt-4o-mini"),
        }

    async def execute(self, task: str) -> str:
        # Step 1: Supervisor breaks down task
        plan = await self.supervisor.ainvoke(
            f"Break this task into subtasks for researcher, analyst, writer: {task}"
        )

        # Step 2: Assign work to workers
        results = {}
        for worker_name, subtask in self.parse_plan(plan.content):
            worker = self.workers[worker_name]
            result = await worker.ainvoke(subtask)
            results[worker_name] = result.content

        # Step 3: Supervisor synthesizes
        final = await self.supervisor.ainvoke(
            f"Synthesize these results:\\n{results}\\nOriginal task: {task}"
        )

        return final.content

    def parse_plan(self, plan: str) -> List[tuple]:
        # Parse supervisor's plan into (worker, subtask) pairs
        # Simplified for example
        return [
            ("researcher", "Research the topic"),
            ("analyst", "Analyze the data"),
            ("writer", "Write the report"),
        ]`,
          },
        ],
      },
      {
        step: 3,
        title: "Peer-to-peer pattern",
        blocks: [
          {
            type: "text",
            content:
              "No coordinator — agents work independently, results merge at end.",
          },
          {
            type: "code",
            language: "python",
            label: "Peer-to-peer execution",
            code: `import asyncio

class PeerToPeerOrchestrator:
    def __init__(self):
        self.agents = [
            ChatOpenAI(model="gpt-4o-mini"),
            ChatOpenAI(model="gpt-4o-mini"),
            ChatOpenAI(model="gpt-4o-mini"),
        ]

    async def execute(self, task: str, items: List[str]) -> List[str]:
        # Divide work across agents
        chunks = self.divide_work(items, len(self.agents))

        # Execute in parallel
        tasks = [
            self.process_chunk(agent, task, chunk)
            for agent, chunk in zip(self.agents, chunks)
        ]

        results = await asyncio.gather(*tasks)

        # Merge results (no supervisor needed)
        return [item for sublist in results for item in sublist]

    async def process_chunk(self, agent, task: str, items: List[str]) -> List[str]:
        results = []
        for item in items:
            result = await agent.ainvoke(f"{task}: {item}")
            results.append(result.content)
        return results

    def divide_work(self, items: List[str], n_agents: int) -> List[List[str]]:
        chunk_size = len(items) // n_agents
        return [items[i:i+chunk_size] for i in range(0, len(items), chunk_size)]

# Use case: process 100 items with 3 agents
# Each agent processes ~33 items independently
# 3x speedup vs sequential`,
          },
        ],
      },
      {
        step: 4,
        title: "When to use each pattern",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "Supervisor", value: "Most tasks requiring coordination, synthesis, or complex workflows. Manager decides next steps based on worker output." },
              { key: "Peer-to-peer", value: "Map-reduce, embarrassingly parallel tasks (process 100 items independently). No coordination needed." },
              { key: "Hierarchical", value: "Large scale (50+ agents). Managers reduce communication overhead by grouping workers into teams." },
              { key: "Hybrid", value: "Complex workflows with both coordination and parallelism. Supervisor at top, teams work peer-to-peer." },
            ],
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "When is peer-to-peer orchestration better than supervisor?",
            options: [
              "When agents work on independent items with no coordination needed (embarrassingly parallel tasks like processing 100 documents)",
              "When tasks require synthesis",
              "When agents need to coordinate",
              "When quality is critical",
            ],
            correct: 0,
            explanation:
              "Peer-to-peer is better for embarrassingly parallel tasks where agents work independently on separate items (process 100 documents, analyze 50 code files). No coordination overhead since agents don't need to communicate. Supervisor adds unnecessary latency when workers don't depend on each other. Use supervisor when synthesis is needed (combining results intelligently), coordination is required (agent A's output affects B's input), or quality needs oversight (manager reviews worker output).",
          },
        ],
      },
    ],
  },
  {
    slug: "communication-protocols",
    trackSlug: "multi-agent",
    order: 3,
    minutes: 16,
    title: "Inter-Agent Communication",
    subtitle:
      "Design communication protocols — shared state, message passing, blackboard architecture.",
    tags: ["Communication", "Messages", "State", "Protocols"],
    sections: [
      {
        step: 1,
        title: "Shared State vs Message Passing",
        blocks: [
          {
            type: "text",
            content: "**Communication patterns shape system design.** Two main approaches: **shared state** (all agents read/write a common context object) and **message passing** (agents send explicit messages to each other). Shared state is simpler (everyone has access) but risky (race conditions, unclear dependencies). Message passing is explicit (clear who talks to whom) and safer (no shared memory) but adds overhead.",
          },
          {
            type: "text",
            content: "**Shared state example:**",
          },
          {
            type: "code",
            language: "python",
            code: `from typing import TypedDict

class SharedState(TypedDict):
    user_query: str
    search_results: list[str]
    summary: str

# All agents access same state
state = {"user_query": "AI trends", "search_results": [], "summary": ""}

def search_agent(state: SharedState) -> SharedState:
    state["search_results"] = ["AI adoption rising", "LLMs in production"]
    return state

def summary_agent(state: SharedState) -> SharedState:
    # Read what search_agent wrote
    state["summary"] = " | ".join(state["search_results"])
    return state

# Sequential execution - agents modify shared state
state = search_agent(state)
state = summary_agent(state)
print(state["summary"])  # "AI adoption rising | LLMs in production"`,
          },
          {
            type: "text",
            content: "**Message passing example:**",
          },
          {
            type: "code",
            language: "python",
            code: `from dataclasses import dataclass
from typing import Literal

@dataclass
class Message:
    sender: str
    recipient: str
    type: Literal["query", "response"]
    payload: dict

class Agent:
    def __init__(self, name: str):
        self.name = name
        self.inbox: list[Message] = []

    def send(self, to: "Agent", msg_type: str, payload: dict):
        msg = Message(sender=self.name, recipient=to.name, type=msg_type, payload=payload)
        to.inbox.append(msg)

    def receive(self) -> Message | None:
        return self.inbox.pop(0) if self.inbox else None

# Explicit message passing
search = Agent("search")
summary = Agent("summary")

# Search agent sends results to summary agent
search.send(summary, "response", {"results": ["AI adoption rising", "LLMs in production"]})

# Summary agent receives message
msg = summary.receive()
if msg and msg.type == "response":
    print(" | ".join(msg.payload["results"]))`,
          },
          {
            type: "text",
            content: "**Tradeoffs:**\n• **Shared state**: Simple, low overhead, but risks race conditions and unclear dependencies\n• **Message passing**: Explicit, traceable, no races, but adds 10-20% latency overhead\n• Use shared state for simple workflows (3-5 agents, sequential). Use message passing for complex coordination (10+ agents, parallel execution).",
          },
        ],
      },
      {
        step: 2,
        title: "Blackboard Architecture",
        blocks: [
          {
            type: "text",
            content: "**Blackboard pattern:** Shared workspace where agents post facts and read others' contributions. Useful for collaborative problem-solving where multiple agents contribute partial knowledge.",
          },
          {
            type: "diagram",
            chart: `graph LR
    A[Agent A: Search] -->|writes| BB[Blackboard]
    B[Agent B: Extract] -->|writes| BB
    C[Agent C: Synthesize] -->|reads all| BB
    BB -->|notify| A
    BB -->|notify| B
    BB -->|notify| C`,
          },
          {
            type: "code",
            language: "python",
            code: `from typing import Any
from datetime import datetime

class Blackboard:
    def __init__(self):
        self.facts: dict[str, Any] = {}
        self.subscribers: dict[str, list[callable]] = {}

    def write(self, key: str, value: Any, agent_name: str):
        self.facts[key] = {"value": value, "author": agent_name, "timestamp": datetime.now()}
        # Notify subscribers
        for callback in self.subscribers.get(key, []):
            callback(key, value, agent_name)

    def read(self, key: str) -> Any:
        return self.facts.get(key, {}).get("value")

    def subscribe(self, key: str, callback: callable):
        if key not in self.subscribers:
            self.subscribers[key] = []
        self.subscribers[key].append(callback)

# Example: research workflow
bb = Blackboard()

def on_search_complete(key, value, agent):
    print(f"[Notification] {agent} completed search: {len(value)} results")

bb.subscribe("search_results", on_search_complete)

# Agent A writes search results
bb.write("search_results", ["Result 1", "Result 2"], "SearchAgent")

# Agent B reads and writes summary
results = bb.read("search_results")
bb.write("summary", f"Found {len(results)} results", "SummaryAgent")

print(bb.facts)`,
          },
          {
            type: "text",
            content: "**When to use blackboard:**\n• Multiple agents contribute partial information\n• No clear execution order (agents work when dependencies ready)\n• Collaborative problem-solving (agents build on each other's work)\n• Example: Research system where search, extract, verify, synthesize agents all contribute",
          },
        ],
      },
      {
        step: 3,
        title: "Request-Response Pattern",
        blocks: [
          {
            type: "text",
            content: "**Request-response:** Agent A sends request to Agent B and waits for reply. Synchronous communication where caller blocks until response arrives. Essential for dependencies (Agent A needs Agent B's output before proceeding).",
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from typing import TypedDict
from openai import AsyncOpenAI

class MessageBus:
    def __init__(self):
        self.responses: dict[str, asyncio.Future] = {}
        self.request_id = 0

    async def request(self, from_agent: str, to_agent: str, payload: dict) -> dict:
        """Send request and wait for response"""
        req_id = f"{from_agent}-{self.request_id}"
        self.request_id += 1

        # Create future for response
        future = asyncio.Future()
        self.responses[req_id] = future

        # Simulate agent processing (in real system, route to agent)
        asyncio.create_task(self._process_request(to_agent, req_id, payload))

        # Wait for response (blocks until agent replies)
        return await future

    async def _process_request(self, agent: str, req_id: str, payload: dict):
        """Simulate agent processing request"""
        await asyncio.sleep(0.1)  # Simulate work
        result = {"agent": agent, "result": f"Processed {payload}"}
        self.respond(req_id, result)

    def respond(self, req_id: str, payload: dict):
        """Agent calls this to send response"""
        if req_id in self.responses:
            self.responses[req_id].set_result(payload)
            del self.responses[req_id]

# Example usage
async def main():
    bus = MessageBus()

    # Frontend agent requests data from backend agent
    response = await bus.request("Frontend", "Backend", {"action": "get_user", "id": 123})
    print(f"Frontend received: {response}")

    # Analysis agent requests data from search agent
    response = await bus.request("Analysis", "Search", {"query": "AI trends"})
    print(f"Analysis received: {response}")

asyncio.run(main())`,
          },
          {
            type: "text",
            content: "**Request-response overhead:**\n• Adds latency: caller waits for callee (10-50ms per hop)\n• Blocks parallelism: Agent A can't do other work while waiting\n• Use when: dependency is required (A needs B's output)\n• Alternative: Fire-and-forget (A sends request, continues work, B notifies when done)",
          },
        ],
      },
      {
        step: 4,
        title: "Pub-Sub Pattern for Event-Driven Systems",
        blocks: [
          {
            type: "text",
            content: "**Publish-Subscribe (Pub-Sub):** Agents subscribe to topics and get notified when events occur. Decouples publishers from subscribers — sender doesn't need to know who's listening.",
          },
          {
            type: "diagram",
            chart: `graph TD
    P1[Agent: Search] -->|publish: results_ready| T[Topic: results_ready]
    T -->|notify| S1[Subscriber: Summary]
    T -->|notify| S2[Subscriber: Translate]
    T -->|notify| S3[Subscriber: Store]`,
          },
          {
            type: "code",
            language: "python",
            code: `from typing import Callable
from dataclasses import dataclass

@dataclass
class Event:
    topic: str
    data: dict
    source: str

class PubSub:
    def __init__(self):
        self.subscriptions: dict[str, list[Callable]] = {}

    def subscribe(self, topic: str, handler: Callable[[Event], None]):
        if topic not in self.subscriptions:
            self.subscriptions[topic] = []
        self.subscriptions[topic].append(handler)

    def publish(self, topic: str, data: dict, source: str):
        event = Event(topic=topic, data=data, source=source)
        for handler in self.subscriptions.get(topic, []):
            handler(event)

# Example: search workflow with pub-sub
pubsub = PubSub()

# Subscribe agents to topics
def on_search_complete(event: Event):
    print(f"[Summary Agent] Received {len(event.data['results'])} results from {event.source}")

def on_translation_needed(event: Event):
    print(f"[Translate Agent] Translating {event.data['text']}")

pubsub.subscribe("search.complete", on_search_complete)
pubsub.subscribe("translate.requested", on_translation_needed)

# Publish events
pubsub.publish("search.complete", {"results": ["R1", "R2", "R3"]}, "SearchAgent")
pubsub.publish("translate.requested", {"content": "Hello", "target": "es"}, "UIAgent")`,
          },
          {
            type: "text",
            content: "**Pub-Sub benefits:**\n• **Decoupling:** Publisher doesn't know subscribers exist\n• **Scalability:** Add new subscribers without changing publisher\n• **Broadcasting:** One event notifies all subscribers\n• **Use cases:** Event-driven workflows, notification systems, logging/monitoring",
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question:
              "When should you use message passing instead of shared state?",
            options: [
              "When you need explicit communication and traceability with many agents",
              "When you want simplest implementation",
              "When you need lowest latency",
              "When you have 2-3 agents in sequence",
            ],
            correct: 0,
            explanation:
              "Message passing is better when: (1) you need explicit communication (who sent what to whom is clear from messages, not implicit state reads), (2) traceability matters (can log/replay messages for debugging), (3) many agents (shared state becomes messy with 10+ agents all reading/writing same object — race conditions, unclear dependencies). Shared state is simpler for small systems (2-5 agents, sequential execution) and has lower overhead (no message routing). Message passing adds 10-20% latency but gains safety and debuggability.",
          },
        ],
      },
    ],
  },
  {
    slug: "parallel-execution",
    trackSlug: "multi-agent",
    order: 4,
    minutes: 18,
    title: "Parallel and Concurrent Agents",
    subtitle:
      "Maximize throughput — async execution, batching, load balancing, resource management.",
    tags: ["Parallel", "Async", "Concurrency", "Performance"],
    sections: [
      {
        step: 1,
        title: "Async Execution with Worker Pools",
        blocks: [
          {
            type: "text",
            content: "**Why multi-agent?** Parallelism. Process 100 documents with 10 agents = 10× speedup (theoretically). Real-world: 7-9× due to coordination overhead. Use **asyncio** (Python) or **async/await** (JavaScript) for concurrent execution.",
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from typing import Any
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def analyze_document(doc: str, agent_id: int) -> dict:
    """Single agent analyzes one document"""
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Extract key points from document."},
            {"role": "user", "content": doc}
        ]
    )
    return {
        "agent_id": agent_id,
        "doc": doc[:30],
        "result": response.choices[0].message.content
    }

async def process_batch_sequential(documents: list[str]) -> list[dict]:
    """Sequential: one at a time (slow)"""
    results = []
    for i, doc in enumerate(documents):
        result = await analyze_document(doc, i)
        results.append(result)
    return results

async def process_batch_parallel(documents: list[str], max_workers: int = 10) -> list[dict]:
    """Parallel: up to max_workers at a time (fast)"""
    # Create tasks for all documents
    tasks = [analyze_document(doc, i) for i, doc in enumerate(documents)]

    # Run with concurrency limit
    results = []
    for i in range(0, len(tasks), max_workers):
        batch = tasks[i:i+max_workers]
        batch_results = await asyncio.gather(*batch)
        results.extend(batch_results)

    return results

# Example usage
async def main():
    docs = [f"Document {i} content..." for i in range(50)]

    import time
    start = time.time()
    await process_batch_parallel(docs, max_workers=10)
    parallel_time = time.time() - start

    print(f"Parallel (10 agents): {parallel_time:.1f}s")
    print(f"Estimated sequential: {parallel_time * 10:.1f}s")
    print(f"Speedup: {10 / (parallel_time / (parallel_time * 10)):.1f}x")

# asyncio.run(main())`,
          },
          {
            type: "text",
            content: "**Worker pool benefits:**\n• Control concurrency (don't overload API with 1000 requests)\n• Queue management (excess tasks wait for available worker)\n• Resource limits (respect rate limits, memory constraints)\n• Real speedup: 7-9× with 10 workers (not perfect 10× due to coordination overhead)",
          },
        ],
      },
      {
        step: 2,
        title: "Load Balancing and Task Distribution",
        blocks: [
          {
            type: "text",
            content: "**Problem:** Simple round-robin can create stragglers (one slow agent delays whole batch). **Solution:** Assign work to least-busy agent.",
          },
          {
            type: "diagram",
            chart: `graph TD
    Q[Task Queue<br/>100 tasks] --> LB[Load Balancer]
    LB -->|assign to least busy| A1[Agent 1: 3 active]
    LB -->|assign to least busy| A2[Agent 2: 1 active]
    LB -->|assign to least busy| A3[Agent 3: 5 active]
    A2 -.->|gets next task| LB
    style A2 fill:#90EE90`,
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from typing import Callable, Any
from dataclasses import dataclass, field
import heapq

@dataclass(order=True)
class Worker:
    active_tasks: int
    worker_id: int = field(compare=False)
    process_fn: Callable = field(compare=False)

class LoadBalancer:
    def __init__(self, num_workers: int, process_fn: Callable):
        # Min-heap: workers sorted by active_tasks (least busy first)
        self.workers = [Worker(0, i, process_fn) for i in range(num_workers)]
        heapq.heapify(self.workers)
        self.lock = asyncio.Lock()

    async def assign_task(self, task: Any) -> Any:
        """Assign task to least-busy worker"""
        async with self.lock:
            # Pop least-busy worker
            worker = heapq.heappop(self.workers)

            # Increment active tasks
            worker.active_tasks += 1

            # Push back to heap
            heapq.heappush(self.workers, worker)

        # Process task
        try:
            result = await worker.process_fn(task, worker.worker_id)
        finally:
            # Decrement active tasks
            async with self.lock:
                worker.active_tasks -= 1
                heapq.heapify(self.workers)  # Re-sort heap

        return result

    async def process_all(self, tasks: list[Any]) -> list[Any]:
        """Process all tasks with load balancing"""
        task_coroutines = [self.assign_task(task) for task in tasks]
        return await asyncio.gather(*task_coroutines)

# Example usage
async def process_doc(doc: str, worker_id: int) -> dict:
    # Simulate variable processing time
    await asyncio.sleep(0.1 + (hash(doc) % 10) / 100)
    return {"worker": worker_id, "doc": doc[:20]}

async def main():
    lb = LoadBalancer(num_workers=5, process_fn=process_doc)
    docs = [f"Document {i}" for i in range(50)]

    results = await lb.process_all(docs)

    # Count tasks per worker
    from collections import Counter
    worker_counts = Counter(r["worker"] for r in results)
    print("Tasks per worker:", dict(worker_counts))
    print(f"Load balance quality: {min(worker_counts.values()) / max(worker_counts.values()):.2f}")

# asyncio.run(main())`,
          },
          {
            type: "text",
            content: "**Load balancing improves throughput 15-20%** vs round-robin by avoiding stragglers. Least-busy assignment ensures fast workers don't sit idle while slow workers are overloaded.",
          },
        ],
      },
      {
        step: 3,
        title: "Backpressure and Queue Management",
        blocks: [
          {
            type: "text",
            content: "**Backpressure:** Slow down producer when consumers can't keep up. Without backpressure, queue grows unbounded → memory exhaustion.",
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from asyncio import Queue

class BackpressureQueue:
    def __init__(self, max_workers: int, max_queue_size: int = 100):
        self.queue = Queue(maxsize=max_queue_size)
        self.workers = max_workers
        self.results = []

    async def producer(self, tasks: list[str]):
        """Producer adds tasks to queue (blocks if queue full)"""
        for task in tasks:
            # put() blocks when queue is full (backpressure!)
            await self.queue.put(task)
            print(f"Queued: {task[:20]}... (queue size: {self.queue.qsize()})")
        # Signal completion
        for _ in range(self.workers):
            await self.queue.put(None)

    async def consumer(self, worker_id: int, process_fn: Callable):
        """Consumer processes tasks from queue"""
        while True:
            task = await self.queue.get()
            if task is None:  # Shutdown signal
                break
            result = await process_fn(task, worker_id)
            self.results.append(result)
            self.queue.task_done()

    async def process(self, tasks: list[str], process_fn: Callable):
        """Start producer and consumers"""
        # Start consumers
        consumers = [
            asyncio.create_task(self.consumer(i, process_fn))
            for i in range(self.workers)
        ]

        # Start producer
        await self.producer(tasks)

        # Wait for all tasks to complete
        await self.queue.join()

        # Wait for consumers to shutdown
        await asyncio.gather(*consumers)

        return self.results

# Example: process 1000 tasks with backpressure
async def slow_process(task: str, worker_id: int) -> dict:
    await asyncio.sleep(0.2)  # Slow processing
    return {"worker": worker_id, "task": task}

async def main():
    bq = BackpressureQueue(max_workers=5, max_queue_size=20)
    tasks = [f"Task {i}" for i in range(1000)]

    # Producer will block when queue reaches 20 items (backpressure prevents memory overflow)
    results = await bq.process(tasks, slow_process)
    print(f"Processed {len(results)} tasks")

# asyncio.run(main())`,
          },
          {
            type: "text",
            content: "**Key insight:** Without `maxsize`, producer can add 1000 tasks instantly → queue holds 1000 items in memory. With `maxsize=20`, producer blocks after 20 items → queue never exceeds 20 items → constant memory usage.",
          },
        ],
      },
      {
        step: 4,
        title: "Fan-Out/Fan-In Pattern",
        blocks: [
          {
            type: "text",
            content: "**Fan-out/Fan-in:** Split work to N agents (fan-out), merge N results (fan-in). Core pattern for parallel processing.",
          },
          {
            type: "diagram",
            chart: `graph TD
    Input[100 documents] -->|fan-out| S[Splitter]
    S -->|10 docs| A1[Agent 1]
    S -->|10 docs| A2[Agent 2]
    S -->|10 docs| A3[Agent 3]
    S -->|...| A4[...]
    S -->|10 docs| A10[Agent 10]
    A1 -->|results| M[Merger<br/>fan-in]
    A2 -->|results| M
    A3 -->|results| M
    A4 -->|results| M
    A10 -->|results| M
    M --> Output[Combined results]`,
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from typing import TypeVar, Callable
import numpy as np

T = TypeVar('T')
R = TypeVar('R')

async def fan_out_fan_in(
    items: list[T],
    process_fn: Callable[[list[T], int], list[R]],
    num_agents: int = 10,
    merge_fn: Callable[[list[list[R]]], list[R]] = lambda results: [r for batch in results for r in batch]
) -> list[R]:
    """
    Fan-out: split items into batches
    Process: each agent processes one batch
    Fan-in: merge all results
    """
    # Fan-out: split into batches
    batches = np.array_split(items, num_agents)

    # Process in parallel
    tasks = [process_fn(batch.tolist(), i) for i, batch in enumerate(batches)]
    batch_results = await asyncio.gather(*tasks)

    # Fan-in: merge results
    return merge_fn(batch_results)

# Example: sentiment analysis on 100 reviews
async def analyze_sentiment_batch(reviews: list[str], agent_id: int) -> list[dict]:
    await asyncio.sleep(0.1)  # Simulate API call
    return [{"review": r[:20], "sentiment": "positive", "agent": agent_id} for r in reviews]

async def main():
    reviews = [f"Review {i}: Great product!" for i in range(100)]

    import time
    start = time.time()

    # Process with 10 agents
    results = await fan_out_fan_in(
        reviews,
        analyze_sentiment_batch,
        num_agents=10
    )

    elapsed = time.time() - start
    print(f"Processed {len(results)} reviews in {elapsed:.2f}s with 10 agents")

    # Verify agents were balanced
    from collections import Counter
    agent_counts = Counter(r["agent"] for r in results)
    print(f"Tasks per agent: {dict(agent_counts)}")

# asyncio.run(main())`,
          },
          {
            type: "text",
            content: "**Performance math:**\n• Sequential: 100 items × 0.1s = 10s\n• Parallel (10 agents): 10 batches × 0.1s = 1s (10× speedup)\n• Real-world: 0.7-0.9× ideal speedup due to coordination overhead\n• Fan-out/fan-in is the foundation of all parallel multi-agent systems",
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question:
              "You have 100 tasks and 10 agents. Why don't you get perfect 10× speedup?",
            options: [
              "Coordination overhead (task distribution, result merging, synchronization adds 10-30% latency)",
              "Agents are slower than sequential",
              "Tasks can't be parallelized",
              "Python GIL limits parallelism",
            ],
            correct: 0,
            explanation:
              "Real parallel speedup is 0.7-0.9× the ideal (7-9× with 10 agents) due to coordination overhead: (1) task distribution takes time (splitting, queueing), (2) result merging takes time (combining N agent outputs), (3) synchronization overhead (locks, queue operations), (4) load imbalance (one slow agent delays whole batch), (5) API rate limits (can't actually send 10 requests simultaneously). Python GIL doesn't affect async I/O-bound tasks (LLM calls). Tasks ARE parallelizable (embarrassingly parallel). Perfect 10× speedup is theoretical maximum; 7-9× is excellent real-world performance.",
          },
        ],
      },
    ],
  },
  {
    slug: "debate-and-critique",
    trackSlug: "multi-agent",
    order: 5,
    minutes: 20,
    title: "Debate Systems and Adversarial Review",
    subtitle:
      "Improve quality through multiple perspectives — propose, critique, refine, synthesize.",
    tags: ["Debate", "Critique", "Adversarial", "Quality"],
    sections: [
      {
        step: 1,
        title: "Multi-Agent Debate Pattern",
        blocks: [
          {
            type: "text",
            content: "**Why debate?** Single agent has limited perspective. Debate brings multiple viewpoints → better solutions. Research shows debate improves quality 15-25% on complex problems (architecture, security, strategy) but adds 3-5× latency. **Tradeoff:** Use for high-value decisions, not simple tasks.",
          },
          {
            type: "diagram",
            chart: `graph TD
    Problem[Problem:<br/>Design API] -->|independent| A1[Agent 1:<br/>REST focus]
    Problem -->|independent| A2[Agent 2:<br/>GraphQL focus]
    Problem -->|independent| A3[Agent 3:<br/>gRPC focus]
    A1 -->|proposal| C[Critique Phase]
    A2 -->|proposal| C
    A3 -->|proposal| C
    C -->|scores| S[Scoring]
    S -->|pick best + synthesis| W[Winner + Improvements]`,
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from openai import AsyncOpenAI
from typing import Literal

client = AsyncOpenAI()

async def generate_solution(problem: str, perspective: str) -> str:
    """Generate solution from one perspective"""
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"You are an expert focused on {perspective}. Propose solution optimizing for {perspective}."},
            {"role": "user", "content": problem}
        ]
    )
    return response.choices[0].message.content

async def critique_solution(problem: str, solution: str, critique_lens: str) -> dict:
    """Critique solution from specific angle"""
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"Critique this solution focusing on {critique_lens}. Give score 1-10 and explain weaknesses."},
            {"role": "user", "content": f"Problem: {problem}\\n\\nSolution: {solution}"}
        ],
        response_format={"type": "json_object"}
    )
    import json
    return json.loads(response.choices[0].message.content)

async def debate(problem: str, perspectives: list[str]) -> dict:
    """Run multi-agent debate"""
    # Phase 1: Generate independent solutions
    print("🎯 Phase 1: Generate solutions from different perspectives")
    solutions = await asyncio.gather(*[
        generate_solution(problem, perspective) for perspective in perspectives
    ])

    # Phase 2: Critique each solution
    print("\\n📊 Phase 2: Critique all solutions")
    critiques = []
    for i, solution in enumerate(solutions):
        solution_critiques = await asyncio.gather(*[
            critique_solution(problem, solution, lens) for lens in ["feasibility", "security", "performance"]
        ])
        avg_score = sum(c.get("score", 0) for c in solution_critiques) / len(solution_critiques)
        critiques.append({"solution_idx": i, "score": avg_score, "details": solution_critiques})

    # Phase 3: Pick winner
    winner = max(critiques, key=lambda x: x["score"])
    winner_solution = solutions[winner["solution_idx"]]

    return {
        "winner": winner_solution,
        "score": winner["score"],
        "all_solutions": solutions,
        "all_critiques": critiques
    }

# Example usage
async def main():
    problem = "Design a REST API for a social media platform with 1M users. Consider authentication, rate limiting, and scalability."
    perspectives = ["security-first", "performance-first", "developer-experience-first"]

    result = await debate(problem, perspectives)
    print(f"\\n🏆 Winner (score {result['score']:.1f}/10):\\n{result['winner'][:200]}...")

# asyncio.run(main())`,
          },
          {
            type: "text",
            content: "**Debate improves quality when:**\n• Problem is complex (multiple valid approaches)\n• Stakes are high (architecture, security, production)\n• Perspectives are genuinely different (not just rephrasing)\n• **Don't use for:** Simple tasks, time-sensitive work, obviously correct solutions",
          },
        ],
      },
      {
        step: 2,
        title: "Adversarial Review: Proposer vs Adversary",
        blocks: [
          {
            type: "text",
            content: "**Adversarial review:** Agent proposes solution, adversary tries to break it, proposer defends or improves. Solution passes only if adversary can't find critical flaws. **Stronger than simple critique** because adversary is incentivized to attack (not just evaluate).",
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def adversarial_review(problem: str, max_rounds: int = 3) -> dict:
    """Adversarial review: propose → attack → defend loop"""
    # Round 1: Initial proposal
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a solutions architect. Propose a secure, scalable solution."},
            {"role": "user", "content": problem}
        ]
    )
    proposal = response.choices[0].message.content

    history = [{"round": 1, "proposal": proposal}]

    # Adversarial rounds
    for round_num in range(2, max_rounds + 1):
        # Adversary attacks
        attack_response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a security researcher. Find vulnerabilities, edge cases, and weaknesses in this solution. Be specific."},
                {"role": "user", "content": f"Solution:\\n{proposal}"}
            ]
        )
        attack = attack_response.choices[0].message.content

        # Proposer defends/improves
        defense_response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You proposed this solution. Address the attacks: fix vulnerabilities, handle edge cases, or explain why attack is invalid."},
                {"role": "user", "content": f"Your solution:\\n{proposal}\\n\\nAttacks:\\n{attack}"}
            ]
        )
        proposal = defense_response.choices[0].message.content

        history.append({"round": round_num, "attack": attack, "defense": proposal})

    # Final verdict: can adversary still attack?
    final_attack = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Final attempt: find critical flaws in this solution. If you can't find any, say 'APPROVED'."},
            {"role": "user", "content": proposal}
        ]
    )

    verdict = "APPROVED" if "APPROVED" in final_attack.choices[0].message.content else "REJECTED"

    return {
        "final_solution": proposal,
        "verdict": verdict,
        "rounds": len(history),
        "history": history
    }

# Example: adversarial review of auth system
async def main():
    problem = "Design an authentication system for a banking app. Must be secure against credential stuffing, session hijacking, and phishing."

    result = await adversarial_review(problem, max_rounds=3)

    print(f"Verdict: {result['verdict']} after {result['rounds']} rounds")
    print(f"Final solution:\\n{result['final_solution'][:300]}...")

# asyncio.run(main())`,
          },
          {
            type: "text",
            content: "**Adversarial review catches issues single-agent misses:**\n• Security vulnerabilities (attack surface, edge cases)\n• Scalability bottlenecks (what breaks at 10× load?)\n• Operational risks (what happens when X fails?)\n• **Cost:** 3-5× latency vs single-agent (3-5 LLM rounds)\n• **Benefit:** 30-40% fewer bugs in production (measured in code review studies)",
          },
        ],
      },
      {
        step: 3,
        title: "Synthesis: Combining Best Ideas",
        blocks: [
          {
            type: "text",
            content: "**Synthesis:** After debate, pick winner but graft best ideas from losers. Better than pure winner-takes-all.",
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def synthesize_solutions(problem: str, solutions: list[str]) -> str:
    """Synthesize best ideas from all solutions"""
    solutions_text = "\\n\\n---\\n\\n".join([f"Solution {i+1}:\\n{sol}" for i, sol in enumerate(solutions)])

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a synthesis expert. Review all solutions. Pick the best overall approach, then graft the best ideas from other solutions to create one superior solution."},
            {"role": "user", "content": f"Problem: {problem}\\n\\nAll solutions:\\n{solutions_text}\\n\\nCreate synthesized solution."}
        ]
    )

    return response.choices[0].message.content

# Example: debate + synthesis
async def debate_with_synthesis(problem: str) -> dict:
    perspectives = [
        "security-first: prioritize zero-trust, defense-in-depth",
        "performance-first: prioritize low latency, high throughput",
        "cost-first: prioritize minimal infrastructure, serverless"
    ]

    # Generate 3 independent solutions
    solutions = await asyncio.gather(*[
        client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"Expert perspective: {p}"},
                {"role": "user", "content": problem}
            ]
        ).then(lambda r: r.choices[0].message.content)
        for p in perspectives
    ])

    # Synthesize
    synthesized = await synthesize_solutions(problem, solutions)

    return {
        "individual_solutions": solutions,
        "synthesized_solution": synthesized
    }

async def main():
    problem = "Design a real-time analytics pipeline processing 1M events/sec with <100ms latency and <$10k/month budget."

    result = await debate_with_synthesis(problem)

    print("Synthesized solution (best of all perspectives):")
    print(result["synthesized_solution"][:400])

# asyncio.run(main())`,
          },
          {
            type: "text",
            content: "**Synthesis vs picking winner:**\n• **Picking winner:** Fast, simple, but discards good ideas from losers\n• **Synthesis:** Slower (+1 LLM call), but 10-15% better quality (combines strengths)\n• Example: Winner has best security, Loser #2 has best caching strategy → Synthesis has both",
          },
        ],
      },
      {
        step: 4,
        title: "When Debate Is Worth It",
        blocks: [
          {
            type: "text",
            content: "**Decision matrix: When to use debate vs single-agent**",
          },
          {
            type: "text",
            content: "✅ **Use debate for:**\n• Architecture decisions (monolith vs microservices, SQL vs NoSQL)\n• Security design (auth flows, encryption schemes)\n• Algorithm selection (which ML model? which data structure?)\n• High-stakes: production systems, user-facing features, compliance\n• Complex: multiple valid approaches, unclear best choice\n\n❌ **Don't use debate for:**\n• Simple tasks (format JSON, fix typo, add logging)\n• Obviously correct (security best practices, established patterns)\n• Time-sensitive (deploy hotfix, incident response)\n• Low-stakes (internal tool, prototype, experiment)",
          },
          {
            type: "code",
            language: "python",
            code: `# Heuristic: should you use debate?
def should_use_debate(problem: dict) -> bool:
    """Decision heuristic for debate vs single-agent"""
    score = 0

    # High stakes (+2)
    if problem.get("production") or problem.get("user_facing"):
        score += 2

    # Complex (+2)
    if problem.get("multiple_approaches") or problem.get("ambiguous"):
        score += 2

    # High value (+1)
    if problem.get("budget_usd", 0) > 10000 or problem.get("users", 0) > 100000:
        score += 1

    # Time available (+1)
    if problem.get("deadline_hours", 0) > 24:
        score += 1

    # Threshold: score >= 4 → use debate
    return score >= 4

# Examples
print(should_use_debate({
    "production": True,
    "multiple_approaches": True,
    "budget_usd": 50000,
    "deadline_hours": 72
}))  # True (score 5)

print(should_use_debate({
    "production": False,
    "multiple_approaches": False,
    "deadline_hours": 2
}))  # False (score 0)`,
          },
          {
            type: "text",
            content: "**Real-world results:**\n• Google's Medprompt: Multi-agent debate improved medical diagnosis accuracy from 67% → 90%\n• Meta's CICERO: Debate-based negotiation agent ranked top 10% in Diplomacy game\n• Multi-agent debate on HumanEval coding benchmark: 79% pass rate vs 65% single-agent",
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question:
              "Why does adversarial review find more bugs than simple critique?",
            options: [
              "Adversary is explicitly trying to break the solution (attack mindset), not just evaluate it",
              "Adversary uses a better model",
              "Adversary has more context",
              "Adversary runs more tests",
            ],
            correct: 0,
            explanation:
              "Adversarial review works because the adversary agent's goal is to BREAK the solution (find vulnerabilities, edge cases, failure modes) rather than just evaluate quality. Attack mindset is fundamentally different from critique mindset: critique says 'this is good/bad because...', adversary says 'what if I do THIS to break it?'. This finds corner cases single-agent misses. Both agents use same model and context. Adversary doesn't run actual tests (just conceptually attacks). Research shows adversarial review catches 30-40% more bugs than single-agent review in production code.",
          },
        ],
      },
    ],
  },
  {
    slug: "state-management",
    trackSlug: "multi-agent",
    order: 6,
    minutes: 16,
    title: "State Management and Persistence",
    subtitle:
      "Design state schemas, handle concurrent updates, checkpointing, and crash recovery.",
    tags: ["State", "Persistence", "Checkpoints", "Recovery"],
    sections: [
      {
        step: 1,
        title: "State Schema Design with Pydantic",
        blocks: [
          {
            type: "text",
            content: "**Multi-agent systems are stateful.** Agents read/write shared state as workflow progresses. Use **Pydantic** for type-safe state schemas with validation.",
          },
          {
            type: "code",
            language: "python",
            code: `from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime

class AgentWorkflowState(BaseModel):
    """Type-safe state for multi-agent workflow"""
    workflow_id: str
    status: Literal["pending", "processing", "completed", "failed"]
    input: str
    current_agent: Optional[str] = None

    # Agent outputs
    search_results: list[str] = Field(default_factory=list)
    analysis: Optional[str] = None
    summary: Optional[str] = None

    # Metadata
    started_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    error: Optional[str] = None

    class Config:
        # Make immutable (copy-on-write for safety)
        frozen = False
        # Validate on assignment
        validate_assignment = True

# Usage example
state = AgentWorkflowState(
    workflow_id="wf-123",
    status="pending",
    input="Analyze AI trends in 2024"
)

# Type-safe updates
state.status = "processing"
state.current_agent = "search"
state.search_results.append("AI adoption increased 40%")

# Validation prevents invalid states
try:
    state.status = "invalid"  # ❌ Raises ValidationError
except Exception as e:
    print(f"Caught: {e}")

print(state.model_dump_json(indent=2))`,
          },
          {
            type: "text",
            content: "**Benefits of Pydantic state:**\n• Type safety (prevents invalid states)\n• Validation (catch bugs early)\n• Serialization (easy JSON export)\n• Documentation (schema = API contract)\n• IDE autocomplete (know available fields)",
          },
        ],
      },
      {
        step: 2,
        title: "Checkpointing for Crash Recovery",
        blocks: [
          {
            type: "text",
            content: "**Checkpointing:** Save state after each agent completes. If system crashes, resume from last checkpoint. Essential for long-running workflows.",
          },
          {
            type: "code",
            language: "python",
            code: `import sqlite3
import json
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CheckpointStore:
    def __init__(self, db_path: str = "checkpoints.db"):
        self.conn = sqlite3.connect(db_path)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS checkpoints (
                workflow_id TEXT PRIMARY KEY,
                state_json TEXT NOT NULL,
                agent TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

    def save(self, workflow_id: str, state: BaseModel, agent: str):
        """Save checkpoint after agent completes"""
        self.conn.execute(
            "INSERT OR REPLACE INTO checkpoints (workflow_id, state_json, agent) VALUES (?, ?, ?)",
            (workflow_id, state.model_dump_json(), agent)
        )
        self.conn.commit()

    def load(self, workflow_id: str, state_class: type[BaseModel]) -> Optional[BaseModel]:
        """Load last checkpoint"""
        row = self.conn.execute(
            "SELECT state_json FROM checkpoints WHERE workflow_id = ?",
            (workflow_id,)
        ).fetchone()

        if row:
            return state_class.model_validate_json(row[0])
        return None

    def exists(self, workflow_id: str) -> bool:
        """Check if checkpoint exists"""
        row = self.conn.execute(
            "SELECT 1 FROM checkpoints WHERE workflow_id = ?",
            (workflow_id,)
        ).fetchone()
        return row is not None

# Usage with workflow
async def run_workflow_with_checkpoints(workflow_id: str, input: str):
    store = CheckpointStore()

    # Try to resume from checkpoint
    state = store.load(workflow_id, AgentWorkflowState)
    if state:
        print(f"↩️  Resuming from checkpoint: agent '{state.current_agent}'")
    else:
        print("🆕 Starting new workflow")
        state = AgentWorkflowState(workflow_id=workflow_id, status="pending", input=input)

    # Agent 1: Search
    if not state.search_results:
        state.current_agent = "search"
        state.search_results = ["result1", "result2"]  # Simulate
        store.save(workflow_id, state, "search")
        print("✅ Checkpoint: search complete")

    # Agent 2: Analysis
    if not state.analysis:
        state.current_agent = "analysis"
        state.analysis = "Analysis of results"  # Simulate
        store.save(workflow_id, state, "analysis")
        print("✅ Checkpoint: analysis complete")

    # Agent 3: Summary
    if not state.summary:
        state.current_agent = "summary"
        state.summary = "Final summary"  # Simulate
        store.save(workflow_id, state, "summary")
        print("✅ Checkpoint: summary complete")

    state.status = "completed"
    return state

# Test crash recovery
import asyncio
# asyncio.run(run_workflow_with_checkpoints("wf-456", "test"))
# Crash after agent 1 → re-run → resumes from agent 2`,
          },
          {
            type: "text",
            content: "**Checkpoint strategies:**\n• After every agent (safe, but slow if 100 agents)\n• After expensive agents (balance safety vs overhead)\n• On state transitions (pending → processing → completed)\n• Before risky operations (production deployment, data deletion)",
          },
        ],
      },
      {
        step: 3,
        title: "Handling Concurrent Updates",
        blocks: [
          {
            type: "text",
            content: "**Problem:** Two agents update same state field simultaneously. **Solutions:** Optimistic locking, last-write-wins, or merge strategies.",
          },
          {
            type: "code",
            language: "python",
            code: `from typing import Optional
import threading
import time

class VersionedState(BaseModel):
    """State with version for optimistic concurrency control"""
    workflow_id: str
    version: int = 0  # Increment on every update
    data: dict = {}

class OptimisticStore:
    def __init__(self):
        self.states: dict[str, VersionedState] = {}
        self.lock = threading.Lock()

    def read(self, workflow_id: str) -> Optional[VersionedState]:
        """Read current state"""
        return self.states.get(workflow_id)

    def update(self, workflow_id: str, expected_version: int, updates: dict) -> bool:
        """Update state only if version matches (optimistic lock)"""
        with self.lock:
            current = self.states.get(workflow_id)

            if not current:
                # First write
                self.states[workflow_id] = VersionedState(
                    workflow_id=workflow_id,
                    version=1,
                    data=updates
                )
                return True

            if current.version != expected_version:
                # Conflict: someone else updated since we read
                return False

            # Update successful
            current.version += 1
            current.data.update(updates)
            return True

# Example: two agents update concurrently
def agent_a(store: OptimisticStore):
    state = store.read("wf-789")
    version = state.version if state else 0

    time.sleep(0.1)  # Simulate work

    # Try to update
    success = store.update("wf-789", version, {"agent_a": "result_a"})
    print(f"Agent A: {'✅ success' if success else '❌ conflict, retry needed'}")

def agent_b(store: OptimisticStore):
    state = store.read("wf-789")
    version = state.version if state else 0

    time.sleep(0.05)  # Faster than agent_a

    success = store.update("wf-789", version, {"agent_b": "result_b"})
    print(f"Agent B: {'✅ success' if success else '❌ conflict, retry needed'}")

# Simulate concurrent updates
store = OptimisticStore()
store.states["wf-789"] = VersionedState(workflow_id="wf-789", version=1, data={})

t1 = threading.Thread(target=agent_a, args=(store,))
t2 = threading.Thread(target=agent_b, args=(store,))
t1.start(); t2.start()
t1.join(); t2.join()

# Result: Agent B succeeds (faster), Agent A conflicts (retry needed)`,
          },
          {
            type: "text",
            content: "**Concurrency strategies:**\n• **Optimistic locking:** Assume no conflicts, retry on conflict (best for rare conflicts)\n• **Pessimistic locking:** Lock before read, unlock after write (best for frequent conflicts)\n• **Last-write-wins:** No locking, last update overwrites (simple, but data loss risk)\n• **Merge strategies:** Custom logic to merge conflicting updates (complex, but no data loss)",
          },
        ],
      },
      {
        step: 4,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why use checkpoints in multi-agent workflows?",
            options: [
              "Resume from last completed agent after crash (avoid re-running expensive agents)",
              "Improve performance",
              "Reduce memory usage",
              "Enable parallelism",
            ],
            correct: 0,
            explanation:
              "Checkpoints save state after each agent completes. If workflow crashes (server restart, out-of-memory, timeout), you can resume from the last checkpoint instead of re-running from the beginning. This is critical for long-running workflows (10+ agents, 30+ minutes) where re-running is expensive. Checkpoints don't improve performance (add ~10ms overhead per save) or reduce memory (state is duplicated to disk). They don't enable parallelism (unrelated). Key benefit: crash recovery without losing progress. Example: 5-agent workflow crashes after agent 3 → without checkpoints, re-run all 5 agents; with checkpoints, resume from agent 4.",
          },
        ],
      },
    ],
  },
  {
    slug: "error-handling",
    trackSlug: "multi-agent",
    order: 7,
    minutes: 18,
    title: "Error Handling and Fault Tolerance",
    subtitle:
      "Build resilient systems — retries, fallbacks, circuit breakers, human escalation.",
    tags: ["Error handling", "Resilience", "Retry", "Fallback"],
    sections: [
      {
        step: 1,
        title: "Retry Strategies with Exponential Backoff",
        blocks: [
          {
            type: "text",
            content: "**Multi-agent systems amplify failure.** 10 agents, each with 5% failure rate → 40% chance at least one fails. **Solution:** Retry with exponential backoff (wait longer after each retry to avoid overwhelming failing service).",
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from typing import TypeVar, Callable
import random

T = TypeVar('T')

async def retry_with_backoff(
    fn: Callable[[], T],
    max_retries: int = 3,
    initial_delay: float = 1.0,
    backoff_factor: float = 2.0,
    max_delay: float = 60.0
) -> T:
    """Retry with exponential backoff"""
    delay = initial_delay

    for attempt in range(max_retries + 1):
        try:
            return await fn()
        except Exception as e:
            if attempt == max_retries:
                # Final attempt failed
                raise Exception(f"Failed after {max_retries + 1} attempts") from e

            # Calculate next delay with jitter
            jitter = random.uniform(0, 0.1 * delay)
            sleep_time = min(delay + jitter, max_delay)

            print(f"⚠️  Attempt {attempt + 1} failed: {e}. Retrying in {sleep_time:.1f}s...")
            await asyncio.sleep(sleep_time)

            # Exponential backoff
            delay *= backoff_factor

# Example: unreliable agent
call_count = 0

async def unreliable_agent_call():
    global call_count
    call_count += 1

    if call_count < 3:
        raise Exception(f"API rate limit (call {call_count})")

    return {"result": "success"}

# Test retry
async def main():
    global call_count
    call_count = 0

    result = await retry_with_backoff(unreliable_agent_call, max_retries=3)
    print(f"✅ Success: {result}")

# asyncio.run(main())
# Output:
# ⚠️ Attempt 1 failed: API rate limit (call 1). Retrying in 1.0s...
# ⚠️ Attempt 2 failed: API rate limit (call 2). Retrying in 2.1s...
# ✅ Success: {'result': 'success'}`,
          },
          {
            type: "text",
            content: "**Exponential backoff prevents thundering herd:**\n• Fixed delay (1s, 1s, 1s): All retries hit server simultaneously\n• Exponential (1s, 2s, 4s): Retries spread out over time\n• Jitter (random ±10%): Prevents synchronized retries across multiple clients\n• **Use for:** Transient failures (rate limits, network timeouts, overload)\n• **Don't retry:** Invalid inputs, authentication errors, 4xx errors",
          },
        ],
      },
      {
        step: 2,
        title: "Circuit Breaker Pattern",
        blocks: [
          {
            type: "text",
            content: "**Circuit breaker:** Stop calling failing agent after N consecutive failures. Prevents wasting time/money on known-broken agent.",
          },
          {
            type: "diagram",
            chart: `stateDiagram-v2
    [*] --> Closed: Initial
    Closed --> Open: N failures
    Open --> HalfOpen: After timeout
    HalfOpen --> Closed: Success
    HalfOpen --> Open: Failure
    Closed --> Closed: Success

    note right of Closed
        Normal operation
        Requests go through
    end note

    note right of Open
        Agent is broken
        Fast-fail all requests
    end note

    note right of HalfOpen
        Test if agent recovered
        One request allowed
    end note`,
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Callable, TypeVar

T = TypeVar('T')

@dataclass
class CircuitBreaker:
    failure_threshold: int = 3  # Open after 3 failures
    timeout_seconds: int = 60   # Try again after 60s
    success_threshold: int = 2  # Close after 2 successes in half-open

    state: str = "closed"  # closed, open, half-open
    failures: int = 0
    successes: int = 0
    last_failure_time: datetime = None

    async def call(self, fn: Callable[[], T]) -> T:
        """Execute function through circuit breaker"""
        # Check if should transition from open → half-open
        if self.state == "open":
            if datetime.now() - self.last_failure_time > timedelta(seconds=self.timeout_seconds):
                print("🔄 Circuit breaker: open → half-open (testing recovery)")
                self.state = "half-open"
                self.successes = 0
            else:
                raise Exception(f"🚫 Circuit breaker OPEN (agent failing, fast-fail until {self.last_failure_time + timedelta(seconds=self.timeout_seconds)})")

        try:
            result = await fn()

            # Success
            if self.state == "half-open":
                self.successes += 1
                if self.successes >= self.success_threshold:
                    print("✅ Circuit breaker: half-open → closed (agent recovered)")
                    self.state = "closed"
                    self.failures = 0

            elif self.state == "closed":
                self.failures = 0  # Reset on success

            return result

        except Exception as e:
            # Failure
            self.failures += 1
            self.last_failure_time = datetime.now()

            if self.state == "closed" and self.failures >= self.failure_threshold:
                print(f"⚠️ Circuit breaker: closed → open (agent failed {self.failures} times)")
                self.state = "open"

            elif self.state == "half-open":
                print("⚠️ Circuit breaker: half-open → open (agent still broken)")
                self.state = "open"

            raise e

# Example usage
circuit = CircuitBreaker(failure_threshold=3, timeout_seconds=2)

async def flaky_agent(success: bool):
    if not success:
        raise Exception("Agent error")
    return "success"

async def test_circuit():
    # First 3 calls fail → circuit opens
    for i in range(3):
        try:
            await circuit.call(lambda: flaky_agent(False))
        except: pass

    # Circuit is now open → fast-fail
    try:
        await circuit.call(lambda: flaky_agent(True))
    except Exception as e:
        print(f"Fast-fail: {e}")

    # Wait for timeout
    await asyncio.sleep(2.5)

    # Circuit → half-open, test succeeds 2 times → circuit closes
    for i in range(2):
        await circuit.call(lambda: flaky_agent(True))

# asyncio.run(test_circuit())`,
          },
          {
            type: "text",
            content: "**Circuit breaker benefits:**\n• **Fast-fail:** Stop wasting time on broken agent (save latency + cost)\n• **Prevent cascade:** Failing agent doesn't bring down whole system\n• **Auto-recovery:** Test periodically if agent recovered\n• **Production essential:** OpenAI rate limits, model outages, API downtime",
          },
        ],
      },
      {
        step: 3,
        title: "Human-in-the-Loop Escalation",
        blocks: [
          {
            type: "text",
            content: "**Human escalation:** When agents can't proceed (stuck, ambiguous, high-risk), escalate to human. Essential for production systems.",
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from typing import Optional
import json

class HumanEscalation:
    def __init__(self):
        self.pending_requests: dict[str, asyncio.Future] = {}

    async def request_human_input(
        self,
        request_id: str,
        question: str,
        context: dict,
        timeout: Optional[int] = 3600  # 1 hour default
    ) -> str:
        """Send request to human, wait for response"""
        print(f"\\n🤔 HUMAN INPUT NEEDED ({request_id})")
        print(f"Question: {question}")
        print(f"Context: {json.dumps(context, indent=2)}")
        print("Waiting for response...")

        # In production: send to Slack, email, or UI
        # self.send_slack_notification(question, context)

        # Create future for response
        future = asyncio.Future()
        self.pending_requests[request_id] = future

        # Wait for response with timeout
        try:
            response = await asyncio.wait_for(future, timeout=timeout)
            print(f"✅ Human response: {response}")
            return response
        except asyncio.TimeoutError:
            raise Exception(f"Human did not respond within {timeout}s")

    def provide_response(self, request_id: str, response: str):
        """Human provides response (called from Slack/UI)"""
        if request_id in self.pending_requests:
            self.pending_requests[request_id].set_result(response)
            del self.pending_requests[request_id]

# Example workflow with human escalation
async def multi_agent_with_escalation():
    escalation = HumanEscalation()

    # Agent 1: Detect ambiguity
    user_request = "Deploy the new feature"

    if "which environment" not in user_request.lower():
        # Ambiguous → escalate
        environment = await escalation.request_human_input(
            request_id="env-123",
            question="Which environment should I deploy to?",
            context={"request": user_request, "options": ["staging", "production"]},
            timeout=10  # Short timeout for demo
        )
    else:
        environment = "production"

    # Agent 2: Risk check
    if environment == "production":
        approval = await escalation.request_human_input(
            request_id="approval-456",
            question="Production deployment requires approval. Proceed?",
            context={"environment": environment, "risk": "high"},
            timeout=10
        )

        if approval.lower() != "yes":
            raise Exception("Deployment cancelled by human")

    print(f"🚀 Deploying to {environment}")

# Simulate human responses
async def simulate_human():
    await asyncio.sleep(2)
    escalation.provide_response("env-123", "staging")
    await asyncio.sleep(2)
    escalation.provide_response("approval-456", "yes")

# Run workflow + simulation
async def main():
    global escalation
    escalation = HumanEscalation()

    await asyncio.gather(
        multi_agent_with_escalation(),
        simulate_human()
    )

# asyncio.run(main())`,
          },
          {
            type: "text",
            content: "**When to escalate to human:**\n• Ambiguous input (unclear requirements, missing info)\n• High-risk actions (production deploy, data deletion, financial transactions)\n• Agent stuck (can't proceed, circular logic, unclear next step)\n• Confidence below threshold (agent gives answer but low confidence)\n• **Real-world:** Slack notifications, email alerts, web UI with approve/reject buttons",
          },
        ],
      },
      {
        step: 4,
        title: "Graceful Degradation and Partial Results",
        blocks: [
          {
            type: "text",
            content: "**Partial failures:** Some agents succeed, others fail. **Options:** (1) Fail whole workflow, (2) Use partial results with degraded quality.",
          },
          {
            type: "code",
            language: "python",
            code: `import asyncio
from typing import Optional

async def agent_with_fallback(agent_name: str, should_fail: bool) -> Optional[dict]:
    """Agent that might fail"""
    await asyncio.sleep(0.1)
    if should_fail:
        raise Exception(f"{agent_name} failed")
    return {"agent": agent_name, "result": "success"}

async def workflow_with_graceful_degradation():
    """Workflow that works with partial results"""
    # Run agents in parallel
    results = await asyncio.gather(
        agent_with_fallback("search", False),
        agent_with_fallback("analysis", True),   # Fails
        agent_with_fallback("summarize", False),
        return_exceptions=True  # Don't fail whole workflow
    )

    # Separate successes from failures
    successes = [r for r in results if not isinstance(r, Exception)]
    failures = [r for r in results if isinstance(r, Exception)]

    print(f"✅ {len(successes)} agents succeeded")
    print(f"❌ {len(failures)} agents failed")

    # Decide: proceed with partial results or fail?
    critical_agents = ["search"]
    critical_failed = any(
        isinstance(r, Exception) and "search" in str(r)
        for r in results
    )

    if critical_failed:
        raise Exception("Critical agent (search) failed → abort workflow")

    # Optional agent (analysis) failed → proceed with degraded quality
    return {
        "status": "completed_with_warnings",
        "successes": successes,
        "failures": [str(f) for f in failures],
        "quality": "degraded"
    }

# Test graceful degradation
async def main():
    try:
        result = await workflow_with_graceful_degradation()
        print(f"\\nWorkflow result: {result['status']}")
        print(f"Quality: {result['quality']}")
    except Exception as e:
        print(f"Workflow failed: {e}")

# asyncio.run(main())`,
          },
          {
            type: "text",
            content: "**Degradation strategies:**\n• **Strict mode:** Any failure → abort (use for critical workflows: payments, deployments)\n• **Best-effort:** Use partial results with warning (use for analysis, recommendations)\n• **Fallback:** Primary fails → use backup agent or cached result\n• **Default values:** Agent fails → use sensible default (e.g., agent fails to fetch user name → use 'Unknown User')",
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question:
              "Why does circuit breaker pattern improve multi-agent resilience?",
            options: [
              "Stops calling broken agent immediately (fast-fail) instead of wasting time retrying",
              "Fixes broken agents automatically",
              "Prevents all failures",
              "Makes agents faster",
            ],
            correct: 0,
            explanation:
              "Circuit breaker detects when an agent is consistently failing (e.g., 3 failures in a row) and immediately stops calling it (opens circuit). This is FAST-FAIL: instead of waiting for retry timeout (1s, 2s, 4s... = 7s wasted per call), circuit breaker fails instantly and saves latency + cost. After timeout (e.g., 60s), circuit tries one request (half-open) to test if agent recovered. If success, circuit closes and normal operation resumes. Circuit breaker doesn't fix agents (that's external), doesn't prevent all failures (some will still occur), and doesn't make agents faster (actually adds small overhead). Key benefit: stop wasting time on known-broken agent. Example: OpenAI API is down → after 3 failed requests, circuit opens → save 7s per subsequent request by fast-failing instead of retrying.",
          },
        ],
      },
    ],
  },
  {
    slug: "autogen-framework",
    trackSlug: "multi-agent",
    order: 8,
    minutes: 18,
    title: "Building Multi-Agent with AutoGen",
    subtitle:
      "Use Microsoft AutoGen for conversational agents, group chat, code execution.",
    tags: ["AutoGen", "Framework", "Group chat", "Code execution"],
    sections: [
      {
        step: 1,
        title: "AutoGen Conversational Agents",
        blocks: [
          {
            type: "text",
            content: "**AutoGen** (Microsoft Research) is a conversational multi-agent framework. Agents have **personas**, **memory**, and engage in **group conversations** to solve problems. Different from LangGraph (workflow-oriented) — AutoGen is chat-oriented.",
          },
          {
            type: "code",
            language: "python",
            code: `# Install: pip install pyautogen
from autogen import AssistantAgent, UserProxyAgent

# Configure LLM
llm_config = {
    "model": "gpt-4o",
    "api_key": "your-api-key",
    "temperature": 0.7
}

# Create assistant agent (AI that proposes solutions)
assistant = AssistantAgent(
    name="assistant",
    system_message="You are a helpful AI assistant skilled in Python programming.",
    llm_config=llm_config
)

# Create user proxy (represents human, can execute code)
user_proxy = UserProxyAgent(
    name="user",
    human_input_mode="NEVER",  # or "ALWAYS" for human-in-loop
    max_consecutive_auto_reply=5,
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False  # Set True for sandboxed execution
    }
)

# Start conversation
user_proxy.initiate_chat(
    assistant,
    message="Write a Python function to calculate fibonacci numbers, then test it with n=10."
)

# AutoGen handles:
# 1. Assistant writes code
# 2. User proxy executes code
# 3. Assistant sees output, iterates if needed
# 4. Terminates when solution works`,
          },
          {
            type: "text",
            content: "**Key AutoGen concepts:**\n• **AssistantAgent:** AI that proposes solutions (coding, analysis, planning)\n• **UserProxyAgent:** Represents human, can execute code and provide feedback\n• **Conversational flow:** Agents take turns speaking until task complete\n• **Code execution:** User proxy can run Python code in sandbox\n• **Human-in-loop:** Set `human_input_mode='ALWAYS'` to approve actions",
          },
        ],
      },
      {
        step: 2,
        title: "Group Chat: Multi-Agent Conversations",
        blocks: [
          {
            type: "text",
            content: "**Group chat:** Multiple agents discuss problem together. Manager agent selects which agent speaks next based on conversation context.",
          },
          {
            type: "diagram",
            chart: `graph TD
    User[User: Define problem] -->|initial message| Manager[GroupChatManager]
    Manager -->|select speaker| Engineer[Engineer Agent]
    Engineer -->|proposes code| Manager
    Manager -->|select speaker| Critic[Critic Agent]
    Critic -->|reviews code| Manager
    Manager -->|select speaker| Engineer
    Engineer -->|fixes issues| Manager
    Manager -->|task complete| Done[Solution]`,
          },
          {
            type: "code",
            language: "python",
            code: `from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager

llm_config = {"model": "gpt-4o"}

# Create specialized agents
engineer = AssistantAgent(
    name="Engineer",
    system_message="You are a software engineer. Write clean, tested Python code.",
    llm_config=llm_config
)

critic = AssistantAgent(
    name="Critic",
    system_message="You are a code reviewer. Find bugs, security issues, and suggest improvements.",
    llm_config=llm_config
)

executor = UserProxyAgent(
    name="Executor",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "workspace"}
)

# Create group chat
group_chat = GroupChat(
    agents=[engineer, critic, executor],
    messages=[],
    max_round=10  # Max conversation turns
)

# Create manager (orchestrates conversation)
manager = GroupChatManager(groupchat=group_chat, llm_config=llm_config)

# Start group conversation
executor.initiate_chat(
    manager,
    message="Build a function to scrape a website and extract all links. Include error handling and tests."
)

# Flow:
# 1. Engineer proposes solution
# 2. Critic reviews (finds issues)
# 3. Engineer fixes
# 4. Executor runs tests
# 5. Repeat until solution works`,
          },
          {
            type: "text",
            content: "**Group chat features:**\n• **Auto speaker selection:** Manager picks next speaker based on context\n• **Diverse perspectives:** Each agent has specialized role (engineer, critic, tester)\n• **Iterative refinement:** Agents iterate until consensus\n• **Termination:** Conversation ends when task complete or max rounds reached",
          },
        ],
      },
      {
        step: 3,
        title: "Code Execution in Sandbox",
        blocks: [
          {
            type: "text",
            content: "**AutoGen can execute code agents write.** UserProxyAgent runs Python code in Docker sandbox (safe) or local environment (faster but riskier).",
          },
          {
            type: "code",
            language: "python",
            code: `from autogen import AssistantAgent, UserProxyAgent

# Sandboxed code execution (Docker)
user_proxy = UserProxyAgent(
    name="executor",
    code_execution_config={
        "work_dir": "workspace",
        "use_docker": True,  # Run in Docker container
        "timeout": 60,       # Kill after 60s
        "last_n_messages": 3 # Include last 3 messages as context
    }
)

# Assistant writes code
assistant = AssistantAgent(
    name="coder",
    system_message="You are a Python expert.",
    llm_config={"model": "gpt-4o"}
)

# Conversation
user_proxy.initiate_chat(
    assistant,
    message="""
Write and run a Python script that:
1. Fetches current Bitcoin price from CoinGecko API
2. Calculates 7-day moving average
3. Prints result
"""
)

# AutoGen flow:
# 1. Assistant writes code: \`\`\`python ... \`\`\`
# 2. UserProxy extracts code, runs in Docker
# 3. UserProxy sends execution output back to assistant
# 4. If error, assistant fixes and retries
# 5. Terminates when code runs successfully`,
          },
          {
            type: "text",
            content: "**Code execution safety:**\n• **Docker sandbox:** Isolated environment, can't access host filesystem\n• **Timeout:** Kill infinite loops\n• **Approval mode:** Set `human_input_mode='ALWAYS'` to review code before execution\n• **Production:** Always use Docker in production (security)",
          },
        ],
      },
      {
        step: 4,
        title: "AutoGen vs LangGraph Comparison",
        blocks: [
          {
            type: "text",
            content: "**AutoGen vs LangGraph:** Both are multi-agent frameworks, different philosophies.",
          },
          {
            type: "text",
            content: "**AutoGen (Conversational):**\n✅ Natural conversation flow (agents discuss until consensus)\n✅ Built-in code execution\n✅ Auto speaker selection (manager picks next agent)\n✅ Great for: Collaborative problem-solving, code generation, research\n❌ Less control over execution order\n❌ Harder to debug (conversation can go off-track)\n\n**LangGraph (Workflow):**\n✅ Explicit control flow (you define graph: nodes, edges, conditions)\n✅ Deterministic execution (reproducible)\n✅ Easier debugging (visualize graph)\n✅ Great for: Production workflows, complex state management, reliability\n❌ More boilerplate (define every edge)\n❌ Less flexible (agents can't deviate from graph)",
          },
          {
            type: "text",
            content: "**When to use each:**\n• **AutoGen:** Exploratory work, research, code generation, collaborative analysis\n• **LangGraph:** Production systems, deterministic workflows, state-heavy applications\n• **Hybrid:** Use AutoGen for idea generation, LangGraph for production implementation",
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question:
              "What is the main difference between AutoGen and LangGraph?",
            options: [
              "AutoGen is conversational (agents discuss freely), LangGraph is workflow-based (explicit control flow)",
              "AutoGen is faster",
              "AutoGen uses better models",
              "AutoGen has more features",
            ],
            correct: 0,
            explanation:
              "AutoGen and LangGraph solve multi-agent problems differently: AutoGen is CONVERSATIONAL — agents engage in back-and-forth discussion (like a team meeting) where a manager selects who speaks next based on context. Agents can iterate freely until consensus. LangGraph is WORKFLOW-BASED — you explicitly define a state graph with nodes (agents/functions) and edges (transitions). Execution follows the graph deterministically. AutoGen is better for exploratory, collaborative work where conversation flow is unpredictable. LangGraph is better for production where you need deterministic, reproducible execution. Speed, models, and features are similar (both use OpenAI, both have similar capabilities). Key tradeoff: AutoGen = flexibility + natural flow vs LangGraph = control + reliability.",
          },
        ],
      },
    ],
  },
  {
    slug: "crewai-framework",
    trackSlug: "multi-agent",
    order: 9,
    minutes: 16,
    title: "Building Multi-Agent with CrewAI",
    subtitle:
      "Use CrewAI for role-based agents, sequential tasks, and crew coordination.",
    tags: ["CrewAI", "Framework", "Roles", "Tasks"],
    sections: [
      {
        step: 1,
        title: "Role-Based Agents with CrewAI",
        blocks: [
          {
            type: "text",
            content: "**CrewAI** is a high-level multi-agent framework emphasizing **roles** and **tasks**. Each agent has a role (researcher, writer, analyst), backstory, goal, and tools. Agents collaborate on sequential or parallel tasks.",
          },
          {
            type: "code",
            language: "python",
            code: `# Install: pip install crewai crewai-tools
from crewai import Agent, Task, Crew, Process

# Define agents with roles
researcher = Agent(
    role="Senior Research Analyst",
    goal="Research AI industry trends and provide comprehensive analysis",
    backstory="""You are an expert research analyst with 10 years experience
    in AI industry research. You excel at finding reliable sources and
    synthesizing complex information.""",
    verbose=True,
    allow_delegation=False
)

writer = Agent(
    role="Tech Content Writer",
    goal="Write engaging, accurate content based on research",
    backstory="""You are a skilled tech writer who excels at making complex
    topics accessible. You have published 100+ articles on AI.""",
    verbose=True,
    allow_delegation=True  # Can ask researcher for more info
)

editor = Agent(
    role="Senior Editor",
    goal="Polish content for clarity, accuracy, and engagement",
    backstory="""You are a meticulous editor with high standards.
    You catch errors others miss and improve readability.""",
    verbose=True,
    allow_delegation=False
)`,
          },
          {
            type: "text",
            content: "**CrewAI agent components:**\n• **Role:** Agent's job title and specialty\n• **Goal:** What agent is trying to achieve\n• **Backstory:** Context that shapes behavior (persona)\n• **Tools:** Functions agent can call (search, calculator, APIs)\n• **Delegation:** Can agent ask other agents for help?",
          },
        ],
      },
      {
        step: 2,
        title: "Sequential Tasks and Crew Coordination",
        blocks: [
          {
            type: "text",
            content: "**Tasks** define the work. **Crew** coordinates agents through tasks sequentially or in parallel.",
          },
          {
            type: "code",
            language: "python",
            code: `from crewai import Agent, Task, Crew, Process

# Define tasks (what to do)
research_task = Task(
    description="""Research the top 3 AI trends in 2024. Focus on:
    1. Adoption rates in enterprises
    2. New capabilities (multimodal, agents)
    3. Regulatory developments
    Provide a structured summary with sources.""",
    agent=researcher,
    expected_output="Detailed research report with sources"
)

writing_task = Task(
    description="""Using the research, write a 500-word blog post
    titled 'Top AI Trends in 2024'. Make it engaging and
    accessible to non-technical readers.""",
    agent=writer,
    expected_output="500-word blog post",
    context=[research_task]  # Depends on research output
)

editing_task = Task(
    description="""Edit the blog post for:
    1. Grammar and clarity
    2. Flow and readability
    3. Factual accuracy
    Provide final polished version.""",
    agent=editor,
    expected_output="Polished final blog post",
    context=[writing_task]  # Depends on writing output
)

# Create crew (team of agents)
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    process=Process.sequential,  # Execute tasks in order
    verbose=2
)

# Execute crew
result = crew.kickoff()
print("\\n📄 Final output:\\n", result)`,
          },
          {
            type: "text",
            content: "**CrewAI execution flow:**\n1. **Research task** runs first (researcher agent)\n2. Output passed to **writing task** (writer agent uses research)\n3. Output passed to **editing task** (editor polishes)\n4. **Crew returns final result** (polished blog post)\n\n**Process types:**\n• `Process.sequential`: Tasks run one-by-one (default)\n• `Process.hierarchical`: Manager agent coordinates (like AutoGen)\n• Custom: Define your own execution logic",
          },
        ],
      },
      {
        step: 3,
        title: "Delegation and Inter-Agent Communication",
        blocks: [
          {
            type: "text",
            content: "**Delegation:** Agent can ask another agent for help mid-task. Enables dynamic collaboration.",
          },
          {
            type: "code",
            language: "python",
            code: `from crewai import Agent, Task, Crew

# Researcher with specialized knowledge
data_analyst = Agent(
    role="Data Analyst",
    goal="Analyze data and provide statistical insights",
    backstory="Expert in statistics and data analysis",
    allow_delegation=False
)

# Writer who can delegate to analyst
report_writer = Agent(
    role="Report Writer",
    goal="Write data-driven reports",
    backstory="Technical writer who collaborates with analysts",
    allow_delegation=True  # Can ask data_analyst for help
)

# Task that might trigger delegation
analysis_task = Task(
    description="Analyze the attached CSV data for trends",
    agent=data_analyst
)

report_task = Task(
    description="""Write a business report on Q4 sales.
    If you need statistical analysis, ask the data analyst.""",
    agent=report_writer,
    context=[analysis_task]
)

crew = Crew(
    agents=[data_analyst, report_writer],
    tasks=[analysis_task, report_task],
    process=Process.sequential
)

# Execution:
# 1. Data analyst runs analysis
# 2. Report writer starts writing
# 3. If writer needs more analysis, delegates to analyst
# 4. Analyst provides additional insight
# 5. Writer completes report`,
          },
          {
            type: "text",
            content: "**Delegation benefits:**\n• Agents specialize (deep expertise in one area)\n• Dynamic collaboration (agent decides when to ask for help)\n• Reduces redundancy (don't give all agents all knowledge)\n• **Tradeoff:** Adds latency (delegation is extra LLM calls)",
          },
        ],
      },
      {
        step: 4,
        title: "Framework Comparison",
        blocks: [
          {
            type: "text",
            content: "**CrewAI vs AutoGen vs LangGraph:**",
          },
          {
            type: "text",
            content: "**CrewAI:**\n✅ Highest-level abstraction (define roles + tasks → done)\n✅ Role-based design (natural for business workflows)\n✅ Sequential tasks built-in\n✅ Great for: Content creation, research, business workflows\n❌ Less flexible than LangGraph\n❌ Limited state management\n\n**AutoGen:**\n✅ Conversational flow (agents discuss freely)\n✅ Code execution built-in\n✅ Group chat with auto speaker selection\n✅ Great for: Code generation, collaborative problem-solving\n❌ Non-deterministic (hard to predict flow)\n\n**LangGraph:**\n✅ Maximum control (explicit state graph)\n✅ Best state management (Pydantic, checkpointing)\n✅ Deterministic and debuggable\n✅ Great for: Production systems, complex workflows\n❌ Most boilerplate code",
          },
          {
            type: "text",
            content: "**Recommendation:**\n• **Quick prototype:** CrewAI (fastest to build)\n• **Conversational AI:** AutoGen (best for discussions)\n• **Production system:** LangGraph (most reliable)\n• **Hybrid:** Prototype with CrewAI, rebuild with LangGraph for production",
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What is CrewAI's main design philosophy?",
            options: [
              "Role-based agents (each agent has specialized role, backstory, tools) working on sequential tasks",
              "Graph-based workflows",
              "Conversational agents",
              "Code execution focus",
            ],
            correct: 0,
            explanation:
              "CrewAI is designed around ROLE-BASED AGENTS: each agent has a specific role (researcher, writer, analyst), backstory (persona/context), goal (what they're trying to achieve), and tools (capabilities). Agents work on TASKS that execute sequentially or in parallel. This mirrors real-world teams: you have a researcher who gathers info, a writer who creates content, an editor who polishes — each with specialized expertise. CrewAI is higher-level than LangGraph (less boilerplate) and less conversational than AutoGen (tasks are predefined, not free discussion). Code execution is possible but not the focus. Key insight: CrewAI abstracts multi-agent as 'assemble a team with roles, give them tasks' — intuitive for business workflows.",
          },
        ],
      },
    ],
  },
  {
    slug: "evaluation-and-observability",
    trackSlug: "multi-agent",
    order: 10,
    minutes: 18,
    title: "Multi-Agent Evaluation and Observability",
    subtitle:
      "Measure quality, debug workflows, trace agent interactions, optimize performance.",
    tags: ["Evaluation", "Observability", "Tracing", "Debugging"],
    sections: [
      {
        step: 1,
        title: "Tracing Multi-Agent Workflows",
        blocks: [
          {
            type: "text",
            content: "**Multi-agent systems are black boxes without tracing.** You need visibility into every agent call, state transition, and message to debug failures and optimize performance. Use **structured logging** to JSON for machine-readability.",
          },
          {
            type: "code",
            language: "python",
            code: `import json
import time
from typing import Any
from datetime import datetime

class MultiAgentTracer:
    def __init__(self, log_file: str = "trace.jsonl"):
        self.log_file = log_file
        self.workflow_id = None
        self.start_time = None

    def start_workflow(self, workflow_id: str, input_data: dict):
        self.workflow_id = workflow_id
        self.start_time = time.time()
        self._log({
            "event": "workflow_start",
            "workflow_id": workflow_id,
            "input": input_data,
            "timestamp": datetime.now().isoformat()
        })

    def log_agent_call(self, agent_name: str, duration: float, cost: float):
        self._log({
            "event": "agent_call",
            "agent": agent_name,
            "duration_ms": duration * 1000,
            "cost_usd": cost
        })

    def end_workflow(self, status: str):
        duration = time.time() - self.start_time
        self._log({
            "event": "workflow_end",
            "status": status,
            "duration_s": duration
        })

    def _log(self, event: dict):
        with open(self.log_file, "a") as f:
            f.write(json.dumps(event) + "\\n")`,
          },
        ],
      },
      {
        step: 2,
        title: "Performance Metrics",
        blocks: [
          {
            type: "text",
            content: "**Track key metrics:**\n• Latency per agent\n• Cost per workflow\n• Success rate\n• Parallelism efficiency = sum(agent_time) / wall_clock_time",
          },
        ],
      },
      {
        step: 3,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question:
              "What does parallelism efficiency of 7.8 mean?",
            options: [
              "Agents achieved 7.8x speedup vs sequential execution",
              "Agents are 78% accurate",
              "Agents cost $7.80",
              "System has 7.8 agents",
            ],
            correct: 0,
            explanation:
              "Parallelism efficiency measures achieved speedup: sum of agent times / wall-clock time. 7.8x means agents ran 7.8 times faster than sequential execution due to parallelism.",
          },
        ],
      },
    ],
  },
  {
    slug: "production-deployment",
    trackSlug: "multi-agent",
    order: 11,
    minutes: 20,
    title: "Deploying Multi-Agent Systems",
    subtitle:
      "Scale to production — queue systems, distributed agents, monitoring, cost control.",
    tags: ["Production", "Deployment", "Scale", "Monitoring"],
    sections: [
      {
        step: 1,
        title: "Task Queues with Celery",
        blocks: [
          {
            type: "text",
            content: "**Production multi-agent needs async task queues.** Use **Celery + Redis/RabbitMQ** to queue agent work, scale workers, and ensure reliability.",
          },
          {
            type: "code",
            language: "python",
            code: `# Install: pip install celery redis
from celery import Celery
from openai import OpenAI

# Create Celery app
app = Celery('multi_agent', broker='redis://localhost:6379/0')

client = OpenAI()

@app.task
def search_agent(query: str) -> list[str]:
    """Search agent as Celery task"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Search: {query}"}]
    )
    return [response.choices[0].message.content]

@app.task
def analyze_agent(results: list[str]) -> str:
    """Analyzer agent as Celery task"""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": f"Analyze: {results}"}]
    )
    return response.choices[0].message.content

# Supervisor coordinates via Celery chain
from celery import chain

def run_workflow(query: str):
    """Supervisor chains agents via Celery"""
    workflow = chain(
        search_agent.s(query),
        analyze_agent.s()
    )
    result = workflow.apply_async()
    return result.get(timeout=300)  # Wait for completion

# Start workers: celery -A tasks worker --loglevel=info --concurrency=10`,
          },
        ],
      },
      {
        step: 2,
        title: "Monitoring with Prometheus",
        blocks: [
          {
            type: "text",
            content: "**Track production metrics:**\n• Agent latency (p50, p95, p99)\n• Queue depth (backlog size)\n• Error rate per agent\n• Cost per workflow",
          },
          {
            type: "code",
            language: "python",
            code: `# Install: pip install prometheus-client
from prometheus_client import Counter, Histogram, start_http_server

# Define metrics
agent_calls = Counter('agent_calls_total', 'Total agent calls', ['agent', 'status'])
agent_duration = Histogram('agent_duration_seconds', 'Agent duration', ['agent'])
workflow_cost = Histogram('workflow_cost_usd', 'Workflow cost in USD')

# Instrument agent calls
def tracked_agent_call(agent_name: str):
    with agent_duration.labels(agent=agent_name).time():
        try:
            result = call_agent(agent_name)
            agent_calls.labels(agent=agent_name, status='success').inc()
            return result
        except Exception as e:
            agent_calls.labels(agent=agent_name, status='error').inc()
            raise

# Start metrics server
start_http_server(8000)  # Prometheus scrapes localhost:8000/metrics`,
          },
        ],
      },
      {
        step: 3,
        title: "Cost Controls",
        blocks: [
          {
            type: "text",
            content: "**Implement budget limits:**\n• Max cost per workflow ($1 limit)\n• Circuit breakers on expensive agents\n• Use cheaper models for simple tasks\n• Cache repeated queries",
          },
        ],
      },
      {
        step: 4,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why use Celery for multi-agent production?",
            options: [
              "Async task queue scales workers, persists work, handles failures",
              "Celery is faster than other frameworks",
              "Celery is required for LLM calls",
              "Celery reduces costs",
            ],
            correct: 0,
            explanation:
              "Celery provides: (1) async task queue (don't block web requests), (2) horizontal scaling (add workers as load increases), (3) persistence (queue survives crashes), (4) retry logic (failed tasks retry automatically), (5) monitoring (track queue depth, worker health). Not required for LLM calls (can call OpenAI directly) but essential for production reliability and scale.",
          },
        ],
      },
    ],
  },
  {
    slug: "project-software-dev-team",
    trackSlug: "multi-agent",
    order: 12,
    minutes: 30,
    title: "Project: Multi-Agent Software Development Team",
    subtitle:
      "Build an autonomous dev team — architect, backend, frontend, QA, coordinator — end-to-end workflow.",
    tags: ["Project", "Full stack", "Autonomous", "Software dev"],
    sections: [
      {
        step: 1,
        title: "Project Overview",
        blocks: [
          {
            type: "text",
            content: "**Build a 5-agent autonomous software development team** that can design, implement, test, and deploy a complete web application. This capstone integrates everything from previous lessons: orchestration, communication, parallelism, debate, error handling, and production deployment.",
          },
          {
            type: "diagram",
            chart: `graph TD
    User[User: Spec] --> PM[Project Manager<br/>Supervisor]
    PM --> Arch[Architect Agent]
    PM --> BE[Backend Agent]
    PM --> FE[Frontend Agent]
    PM --> Test[Test Agent]
    PM --> QA[QA Agent]

    Arch -->|design| PM
    BE -->|API code| PM
    FE -->|UI code| PM
    Test -->|test results| PM
    QA -->|approval| PM

    BE -.message.-> FE
    FE -.message.-> BE

    style PM fill:#e1f5ff
    style QA fill:#d4edda`,
          },
          {
            type: "text",
            content: "**5 specialized agents:**\n• **Architect:** Designs system architecture and API contracts\n• **Backend:** Writes server code, APIs, database schema\n• **Frontend:** Writes UI components, integrates with backend\n• **Test:** Writes and runs unit/integration tests\n• **QA:** Reviews code quality, approves or requests changes",
          },
        ],
      },
      {
        step: 2,
        title: "System Architecture with LangGraph",
        blocks: [
          {
            type: "text",
            content: "**Use LangGraph for stateful workflow orchestration:**",
          },
          {
            type: "code",
            language: "python",
            code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, Literal

class DevTeamState(TypedDict):
    spec: str
    architecture: str
    backend_code: str
    frontend_code: str
    tests: str
    test_results: str
    qa_feedback: str
    status: Literal["planning", "coding", "testing", "review", "complete"]
    iteration: int

# Define agents as nodes
def architect_agent(state: DevTeamState) -> DevTeamState:
    # Generate architecture design
    architecture = generate_architecture(state["spec"])
    state["architecture"] = architecture
    state["status"] = "coding"
    return state

def backend_agent(state: DevTeamState) -> DevTeamState:
    backend_code = generate_backend(state["architecture"])
    state["backend_code"] = backend_code
    return state

def frontend_agent(state: DevTeamState) -> DevTeamState:
    frontend_code = generate_frontend(state["architecture"])
    state["frontend_code"] = frontend_code
    return state

def test_agent(state: DevTeamState) -> DevTeamState:
    tests = generate_tests(state["backend_code"])
    results = run_tests(tests)
    state["tests"] = tests
    state["test_results"] = results
    state["status"] = "review"
    return state

def qa_agent(state: DevTeamState) -> DevTeamState:
    feedback = review_code(
        state["backend_code"],
        state["frontend_code"],
        state["test_results"]
    )
    state["qa_feedback"] = feedback
    if "APPROVED" in feedback:
        state["status"] = "complete"
    else:
        state["status"] = "coding"
        state["iteration"] += 1
    return state

# Build workflow graph
workflow = StateGraph(DevTeamState)

# Add nodes
workflow.add_node("architect", architect_agent)
workflow.add_node("backend", backend_agent)
workflow.add_node("frontend", frontend_agent)
workflow.add_node("test", test_agent)
workflow.add_node("qa", qa_agent)

# Define edges
workflow.set_entry_point("architect")
workflow.add_edge("architect", "backend")
workflow.add_edge("architect", "frontend")  # Parallel
workflow.add_edge("backend", "test")
workflow.add_edge("frontend", "test")
workflow.add_edge("test", "qa")

# Conditional: QA approves → END, else → back to coding
workflow.add_conditional_edges(
    "qa",
    lambda state: "complete" if state["status"] == "complete" else "iterate",
    {"complete": END, "iterate": "backend"}
)

app = workflow.compile()`,
          },
        ],
      },
      {
        step: 3,
        title: "Implement Debate for Architecture",
        blocks: [
          {
            type: "text",
            content: "**Use 3-agent debate to design system architecture** (lesson 5 pattern). Three architects propose designs, best wins.",
          },
          {
            type: "code",
            language: "python",
            code: `async def architect_with_debate(spec: str) -> str:
    """3 architects propose, best design wins"""
    perspectives = [
        "monolith with SQLite (simple, fast to build)",
        "microservices with Postgres (scalable, complex)",
        "serverless with DynamoDB (cost-effective, vendor lock-in)"
    ]

    # Generate 3 independent architectures
    proposals = await asyncio.gather(*[
        generate_architecture(spec, perspective)
        for perspective in perspectives
    ])

    # Score each proposal
    scores = []
    for proposal in proposals:
        score = await score_architecture(proposal, spec)
        scores.append(score)

    # Pick winner
    winner_idx = scores.index(max(scores))
    return proposals[winner_idx]`,
          },
        ],
      },
      {
        step: 4,
        title: "Parallel Backend + Frontend",
        blocks: [
          {
            type: "text",
            content: "**Backend and frontend agents work in parallel** (lesson 4 pattern) since both depend only on architecture, not on each other. **2x speedup** vs sequential.",
          },
        ],
      },
      {
        step: 5,
        title: "Message Passing for API Contract",
        blocks: [
          {
            type: "text",
            content: "**Frontend agent can ask backend agent for API details** (lesson 3 pattern) via message passing instead of parsing code.",
          },
          {
            type: "code",
            language: "python",
            code: `# Frontend agent sends message
message_bus.send(
    from_agent="frontend",
    to_agent="backend",
    payload={"query": "What is the /api/todos endpoint schema?"}
)

# Backend agent receives and responds
response = message_bus.receive("backend")
message_bus.respond(
    request_id=response["id"],
    payload={"schema": {"id": "int", "text": "string", "done": "bool"}}
)`,
          },
        ],
      },
      {
        step: 6,
        title: "Human-in-the-Loop Checkpoints",
        blocks: [
          {
            type: "text",
            content: "**Add 2 human approval gates:**\n1. After architecture → human reviews design before coding\n2. After QA → human reviews code before deployment",
          },
        ],
      },
      {
        step: 7,
        title: "Error Handling and Retry",
        blocks: [
          {
            type: "text",
            content: "**Implement retry with backoff** (lesson 7) when agents fail. After 3 retries, escalate to human.",
          },
        ],
      },
      {
        step: 8,
        title: "Test on Real Project",
        blocks: [
          {
            type: "text",
            content: "**Test your dev team on a real project:** Build a TODO app with:\n• Backend: FastAPI + SQLite\n• Frontend: React + TypeScript\n• Auth: JWT tokens\n• Tests: pytest + React Testing Library\n\nSpec: \"Build a TODO app where users can sign up, log in, create/edit/delete todos, and mark them complete.\"",
          },
        ],
      },
      {
        step: 9,
        title: "Measure Performance",
        blocks: [
          {
            type: "text",
            content: "**Compare multi-agent vs single-agent:**\n• **Time to completion:** Multi-agent should be 2-3x faster (parallelism)\n• **Cost:** Multi-agent may cost 20-30% more (coordination overhead)\n• **Quality:** Multi-agent should have fewer bugs (QA review, debate)\n• **Code coverage:** Multi-agent should have higher test coverage (dedicated test agent)",
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question:
              "Why is this dev team faster than single-agent?",
            options: [
              "Backend and frontend work in parallel (2x speedup) + specialized expertise per agent",
              "Multi-agent uses faster models",
              "Multi-agent caches more",
              "Multi-agent writes less code",
            ],
            correct: 0,
            explanation:
              "Multi-agent dev team is 2-3x faster because: (1) PARALLELISM - backend and frontend agents work simultaneously instead of sequentially (2x speedup on that phase), (2) SPECIALIZATION - each agent is expert in one domain (architect designs, backend codes APIs, frontend codes UI) vs single agent juggling all roles, (3) NO CONTEXT SWITCHING - single agent loses time switching between tasks; multi-agent stays focused. Models, caching, and code volume are similar. Key insight: parallelism + specialization = speed. This is why real software teams have specialized roles.",
          },
        ],
      },
    ],
  },
];
