import type { ProjectGuide, Section } from "@/lib/content";

type LangGraphSpec = {
  slug: string; title: string; description: string; graph: string; state: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: LangGraphSpec): Section[] {
  return [
    { step: 1, title: "Graph design, state schema, and safety boundaries", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "LangGraph stateful agent", chart: "flowchart LR\n  S[START] --> P[Plan node]\n  P --> T[Tool node]\n  T --> R{Router}\n  R -->|needs more| T\n  R -->|needs human| H[Human approval node]\n  H --> T\n  R -->|done| W[Write output node]\n  W --> E[END]" },
      { type: "kv", items: [
        { key: "Graph shape", value: p.graph },
        { key: "State fields", value: p.state },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Draw the graph before you write a single node", content: "LangGraph's power is explicit control flow. Sketch every node, edge, and conditional branch on paper first. Undefined branching logic turns into infinite loops at runtime — the graph diagram IS the spec." },
    ] },
    { step: 2, title: "Define state and build core nodes", blocks: [
      { type: "code", language: "bash", label: "Install LangChain and LangGraph", code: "python -m pip install langchain langgraph langchain-anthropic langchain-openai langchain-community pydantic" },
      { type: "code", language: "python", label: "TypedDict state and node pattern", code: "from typing import Annotated, TypedDict\nfrom langgraph.graph import StateGraph, START, END\nfrom langgraph.graph.message import add_messages\nfrom langchain_core.messages import BaseMessage, HumanMessage, AIMessage\n\nclass AgentState(TypedDict):\n    messages: Annotated[list[BaseMessage], add_messages]  # append-only message list\n    plan: str\n    tool_calls_remaining: int\n    final_answer: str\n\ndef plan_node(state: AgentState) -> dict:\n    \"\"\"Break the user goal into a step-by-step plan.\"\"\"\n    # call your LLM here and return updated state fields\n    return {'plan': 'Generated plan...', 'tool_calls_remaining': 5}\n\ndef should_continue(state: AgentState) -> str:\n    \"\"\"Routing function — returns the name of the next node.\"\"\"\n    if state['tool_calls_remaining'] <= 0:\n        return 'write_output'\n    last = state['messages'][-1]\n    if hasattr(last, 'tool_calls') and last.tool_calls:\n        return 'tool_node'\n    return 'write_output'" },
      { type: "callout", kind: "insight", title: "State is the source of truth — not memory variables", content: "Every node receives the full state and returns only the fields it changed. Never store intermediate results in Python variables across nodes — they vanish on resume. Put everything the graph needs in the state TypedDict." },
    ] },
    { step: 3, title: "Wire tools, edges, and the tool node", blocks: [
      { type: "code", language: "python", label: "ToolNode and conditional routing", code: "from langchain_core.tools import tool\nfrom langgraph.prebuilt import ToolNode\nfrom langchain_anthropic import ChatAnthropic\n\n@tool\ndef web_search(query: str) -> str:\n    \"\"\"Search the web for recent information on a topic.\"\"\"\n    # implement with your search API of choice\n    return f'Search results for: {query}'\n\n@tool\ndef read_document(url: str) -> str:\n    \"\"\"Fetch and return the text content of a URL.\"\"\"\n    # implement with httpx or requests\n    return f'Content of: {url}'\n\ntools = [web_search, read_document]\ntool_node = ToolNode(tools)\n\nllm = ChatAnthropic(model='claude-sonnet-4-6').bind_tools(tools)\n\ndef agent_node(state: AgentState) -> dict:\n    response = llm.invoke(state['messages'])\n    return {'messages': [response]}\n\n# Wire the graph\ngraph_builder = StateGraph(AgentState)\ngraph_builder.add_node('agent', agent_node)\ngraph_builder.add_node('tools', tool_node)\ngraph_builder.add_edge(START, 'agent')\ngraph_builder.add_conditional_edges('agent', should_continue, {'tools': 'tools', 'write_output': END})\ngraph_builder.add_edge('tools', 'agent')" },
      { type: "callout", kind: "gotcha", title: "add_conditional_edges needs an explicit mapping", content: "Pass a dict as the third argument to map return values to node names. If you omit it and the router returns an unexpected string, LangGraph raises a KeyError at runtime rather than a clear error at build time." },
    ] },
    { step: 4, title: "Add persistence, retries, and human-in-the-loop", blocks: [
      { type: "code", language: "python", label: "Checkpointing and human approval node", code: "from langgraph.checkpoint.memory import MemorySaver\nfrom langgraph.types import interrupt\n\ncheckpointer = MemorySaver()   # swap for SqliteSaver or PostgresSaver in production\n\ndef human_approval_node(state: AgentState) -> dict:\n    \"\"\"Pause execution and wait for a human to approve the next action.\"\"\"\n    pending_action = state['messages'][-1].content\n    # interrupt() suspends the graph and surfaces state to the caller\n    approval = interrupt({'pending_action': pending_action, 'instructions': 'Approve or reject this action.'})\n    if approval.get('approved'):\n        return {}  # continue unchanged\n    return {'messages': [HumanMessage(content='Action rejected by human reviewer. Stop.')]}\n\ngraph = graph_builder.compile(checkpointer=checkpointer)\n\n# Resume a paused graph after human approval:\nconfig = {'configurable': {'thread_id': 'session-123'}}\ngraph.invoke({'messages': [HumanMessage(content='Research quantum computing trends')]}, config)" },
      { type: "callout", kind: "tip", title: "Use thread_id for multi-turn persistence", content: "Every invoke with the same thread_id picks up where the last one left off. Store thread_id per user session so conversations persist across browser refreshes. Use a UUID — never a predictable value." },
    ] },
    { step: 5, title: "Evaluate, debug with LangSmith, and ship", blocks: [
      { type: "code", language: "python", label: "Trace with LangSmith and run eval", code: "import os\nos.environ['LANGCHAIN_TRACING_V2'] = 'true'\nos.environ['LANGCHAIN_PROJECT'] = 'my-agent'\n# Set LANGCHAIN_API_KEY in your .env — all runs now appear in LangSmith\n\nfrom langsmith import Client\nclient = Client()\n\ndef eval_agent(test_cases: list[dict]) -> dict:\n    passed = 0\n    for case in test_cases:\n        result = graph.invoke({'messages': [HumanMessage(content=case['input'])]}, config)\n        answer = result['messages'][-1].content\n        if all(kw.lower() in answer.lower() for kw in case['expected_keywords']):\n            passed += 1\n    return {'pass_rate': passed / len(test_cases), 'n': len(test_cases)}\n\nprint(eval_agent([\n    {'input': 'What is LangGraph?', 'expected_keywords': ['stateful', 'graph', 'nodes']},\n]))" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Export a graph visualization with graph.get_graph().draw_mermaid() and include it in your README. Publish example traces from LangSmith (anonymized), step counts for 5 representative runs, eval pass rate, and the human-in-the-loop scenario demo." },
    ] },
  ];
}

const specs: LangGraphSpec[] = [
  {
    slug: "langgraph-research-agent",
    title: "Research Agent",
    hours: 8,
    description: "Build a stateful multi-step research agent in LangGraph that searches the web, fetches pages, synthesizes findings across sources, and streams a cited report — with full conversation persistence and retry logic on tool failures.",
    graph: "START → plan → agent ↔ tools (loop) → write_report → END. Conditional edge exits loop when plan is complete or step cap reached.",
    state: "messages, plan, sources_visited, report_sections, steps_taken",
    risk: "Cite every claim with a source URL. Cap web fetches per run to prevent runaway API costs. Never present synthesized conclusions as verified facts.",
    extensions: [
      "Add a sub-graph that parallelizes fetching multiple URLs using Send() for concurrent execution",
      "Implement a critique node: after drafting, the agent reviews its own report and rewrites weak sections",
      "Add source-credibility scoring as a metadata filter before including a page in the synthesis",
      "Persist graph state to SQLite or Postgres so research sessions survive process restarts",
    ],
  },
  {
    slug: "langgraph-sql-agent",
    title: "SQL Agent",
    hours: 8,
    description: "Create a LangGraph SQL agent with explicit schema-retrieval, query-generation, validation, and execution nodes — plus a human-in-the-loop approval gate for any write operations and automatic retry on syntax errors.",
    graph: "START → understand → get_schema → generate_sql → validate_sql → human_gate (writes only) → execute → explain → END. Retry edge from validate back to generate on error.",
    state: "messages, schema_context, generated_sql, validation_errors, query_results, retries",
    risk: "Enforce read-only mode by default. Validate SQL before execution. Parameterize inputs. Require human approval for INSERT/UPDATE/DELETE. Limit result rows to prevent runaway scans.",
    extensions: [
      "Add a query-cost estimation node using EXPLAIN ANALYZE before execution",
      "Implement a chart-generation node that visualizes numeric results with a charting tool",
      "Support multi-hop queries: decompose a complex question into sub-queries and join results in a merge node",
      "Add row-level permission filtering so each user only sees authorized data",
    ],
  },
  {
    slug: "langgraph-customer-support-agent",
    title: "Customer Support Agent",
    hours: 7,
    description: "Build a customer support agent as a LangGraph state machine that classifies intent, retrieves knowledge-base articles via a LangChain retriever, checks account status through tools, resolves issues autonomously, and escalates with a full context handoff.",
    graph: "START → classify_intent → router → kb_retrieval / account_lookup / escalate → respond → satisfaction_check → END or re-open.",
    state: "messages, intent, kb_results, account_data, resolution_status, escalation_reason",
    risk: "Never modify account data without explicit user confirmation via a human-approval node. Escalate billing disputes, legal mentions, and safety concerns immediately. Log every action for audit.",
    extensions: [
      "Add specialist sub-graphs for billing, technical support, and returns — route to each by intent",
      "Implement a satisfaction score node that asks the user to rate the resolution and stores it",
      "Build a red-team eval set: prompt injection, policy conflicts, and out-of-scope requests",
      "Add LangSmith tracing so support supervisors can replay any conversation step by step",
    ],
  },
  {
    slug: "langgraph-report-generation-agent",
    title: "Report Generation Agent",
    hours: 9,
    description: "Design a LangGraph report-generation pipeline that parses a reporting brief, gathers data from multiple sources in parallel using Send(), drafts sections concurrently, runs a review pass, and compiles a polished Markdown report with charts.",
    graph: "START → parse_brief → fan_out (Send per data source) → gather_data (parallel) → draft_sections → review → revise → compile → END.",
    state: "messages, brief, data_sources, gathered_data, sections, review_notes, final_report",
    risk: "Mark sections with missing or stale data explicitly. Never fabricate data — abstain and flag if a source is unavailable. Validate all external API responses before including numbers in the report.",
    extensions: [
      "Add a data-freshness checker node that warns when any source data exceeds a configurable age threshold",
      "Implement scheduled execution: trigger the graph on a cron schedule and deliver via email tool",
      "Add an executive-summary node that condenses the full report into a 3-bullet brief",
      "Export to PDF using a document-rendering tool node at the end of the pipeline",
    ],
  },
];

export const langchainLanggraphProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "langchain-langgraph",
  title: p.title,
  description: p.description,
  techStack: ["Python", "LangChain", "LangGraph", "LangSmith", "Anthropic / OpenAI SDK", "Pydantic"],
  difficulty: "advanced",
  estimatedHours: p.hours,
  sections: sections(p),
}));
