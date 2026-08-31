import type { ProjectGuide, Section } from "@/lib/content";

type AgentSpec = {
  slug: string; title: string; description: string; tools: string; loop: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: AgentSpec): Section[] {
  return [
    { step: 1, title: "Agent scope, tools, and safety boundaries", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "ReAct agent loop", chart: "flowchart LR\n  U[User goal] --> T[Think: plan next action]\n  T --> A[Act: call tool]\n  A --> O[Observe: tool result]\n  O --> T\n  T --> F[Finish: return final answer]\n  T --> H[Human-in-the-loop gate]" },
      { type: "kv", items: [
        { key: "Tools", value: p.tools },
        { key: "Agent loop", value: p.loop },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Never give an agent irreversible tools without a confirmation gate", content: "Deleting records, sending emails, or executing shell commands cannot be undone. Add a human-in-the-loop approval step for any action that modifies external state, and test the abort path before the happy path." },
    ] },
    { step: 2, title: "Define tools and the tool registry", blocks: [
      { type: "code", language: "bash", label: "Install agent dependencies", code: "python -m pip install anthropic openai pydantic httpx rich" },
      { type: "code", language: "python", label: "Tool definition pattern with Pydantic validation", code: "from pydantic import BaseModel, Field\nfrom typing import Any, Callable\nimport inspect\n\nclass ToolResult(BaseModel):\n    tool_name: str\n    success: bool\n    output: Any\n    error: str = ''\n\nclass Tool(BaseModel):\n    name: str\n    description: str\n    parameters: dict                      # JSON Schema passed to the LLM\n    fn: Callable = Field(exclude=True)\n\n    def run(self, **kwargs) -> ToolResult:\n        try:\n            result = self.fn(**kwargs)\n            return ToolResult(tool_name=self.name, success=True, output=result)\n        except Exception as e:\n            return ToolResult(tool_name=self.name, success=False, output=None, error=str(e))\n\n# Always validate tool inputs against a schema before execution.\n# Reject any argument that the LLM invented outside the defined parameters." },
      { type: "callout", kind: "insight", title: "Tool descriptions are part of the prompt", content: "The LLM chooses tools based on their name and description. Vague descriptions cause wrong tool selection. Write descriptions as imperatives with clear scope: 'Search the web for recent news articles — do NOT use for internal documents.'" },
    ] },
    { step: 3, title: "Implement the ReAct agent loop", blocks: [
      { type: "code", language: "python", label: "Provider-agnostic ReAct loop", code: "import json\nfrom typing import Any\n\nMAX_STEPS = 10          # hard cap — never let the loop run unbounded\n\ndef run_agent(goal: str, tools: list[Tool], llm_fn, verbose: bool = True) -> str:\n    tool_map = {t.name: t for t in tools}\n    tool_schemas = [{'name': t.name, 'description': t.description, 'parameters': t.parameters} for t in tools]\n    messages = [{'role': 'user', 'content': goal}]\n\n    for step in range(MAX_STEPS):\n        response = llm_fn(messages=messages, tools=tool_schemas)\n\n        if response.stop_reason == 'end_turn':\n            return response.text\n\n        tool_calls = response.tool_calls\n        if not tool_calls:\n            return response.text\n\n        messages.append({'role': 'assistant', 'content': response.raw})\n\n        for call in tool_calls:\n            if verbose:\n                print(f'[step {step+1}] {call.name}({call.arguments})')\n            tool = tool_map.get(call.name)\n            if not tool:\n                result = ToolResult(tool_name=call.name, success=False, output=None, error='Unknown tool')\n            else:\n                result = tool.run(**call.arguments)\n            messages.append({'role': 'tool', 'tool_call_id': call.id, 'content': json.dumps(result.dict())})\n\n    return 'Agent reached maximum steps without finishing. Please refine the goal or increase MAX_STEPS.'" },
      { type: "callout", kind: "gotcha", title: "Agents can loop — always set a step cap", content: "Without a MAX_STEPS guard, a confused agent will call tools indefinitely and rack up API costs. Log every tool call, detect repeated identical calls (a sign of being stuck), and surface the step count to users in the UI." },
    ] },
    { step: 4, title: "Add memory, reflection, and self-correction", blocks: [
      { type: "code", language: "python", label: "Scratchpad memory and self-correction", code: "SYSTEM_PROMPT = \"\"\"You are a {role}. Think step by step before acting.\n\nRules:\n1. Use tools only when necessary — do not call a tool you already called with the same arguments.\n2. If a tool returns an error, diagnose the cause and try a different approach.\n3. Before finishing, check: does the answer fully address the user's goal?\n4. If you are uncertain, say so explicitly rather than guessing.\n\nScratchpad (your working memory):\n{scratchpad}\"\"\"\n\nclass AgentMemory:\n    def __init__(self):\n        self.steps: list[str] = []\n\n    def record(self, tool_name: str, args: dict, result: str):\n        self.steps.append(f'Called {tool_name}({args}) → {result[:200]}')\n\n    def as_text(self) -> str:\n        return '\\n'.join(self.steps[-10:]) if self.steps else 'No actions yet.'\n\n# Pass memory.as_text() into the SYSTEM_PROMPT scratchpad field each step.\n# This gives the agent a lightweight working memory without full message history." },
      { type: "callout", kind: "tip", title: "Reflection beats retrying blindly", content: "After a tool error, prompt the agent to reason about what went wrong before trying again: 'The last tool call failed. Think about why and describe a different approach.' This single instruction eliminates most infinite retry loops." },
    ] },
    { step: 5, title: "Evaluate, harden, and ship", blocks: [
      { type: "code", language: "python", label: "Agent evaluation harness", code: "from dataclasses import dataclass\n\n@dataclass\nclass AgentEvalCase:\n    id: str\n    goal: str\n    expected_keywords: list[str]          # keywords the final answer must contain\n    must_call_tools: list[str] = None     # tools that must be invoked\n    max_steps: int = 10\n\ndef evaluate_agent(cases: list[AgentEvalCase], run_fn) -> dict:\n    passed = 0\n    for case in cases:\n        answer, steps_log = run_fn(case.goal)\n        keyword_pass = all(kw.lower() in answer.lower() for kw in case.expected_keywords)\n        tool_pass = True\n        if case.must_call_tools:\n            called = {s.split('(')[0].strip() for s in steps_log}\n            tool_pass = all(t in called for t in case.must_call_tools)\n        if keyword_pass and tool_pass:\n            passed += 1\n    return {'pass_rate': passed / len(cases), 'n': len(cases)}" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Record a screen capture of the agent completing a real goal end-to-end. Publish tool definitions, system prompt, step logs for 3+ example runs, eval pass rate, and the guard rails you added. Show at least one failed run and how you fixed it." },
    ] },
  ];
}

const specs: AgentSpec[] = [
  {
    slug: "research-agent",
    title: "Research Agent",
    hours: 8,
    description: "Build an autonomous research agent that takes a research question, searches the web and/or a document corpus, synthesizes findings across multiple sources, and produces a structured report with citations.",
    tools: "web_search, fetch_page, summarize_text, write_section",
    loop: "ReAct: plan search strategy → search → fetch relevant pages → summarize → synthesize → write report",
    risk: "Cite every claim with its source URL. Do not present synthesized conclusions as established facts. Include a confidence indicator when sources conflict.",
    extensions: [
      "Add a source-credibility scorer that ranks .gov/.edu sources above anonymous blogs",
      "Implement multi-query search: generate 3 query variations and union results to improve recall",
      "Add a fact-cross-check step: verify each key claim against a second independent source",
      "Stream the intermediate steps to a UI so the user can see the agent thinking in real time",
    ],
  },
  {
    slug: "sql-agent",
    title: "SQL Agent",
    hours: 8,
    description: "Create a natural-language-to-SQL agent that introspects a database schema, generates a validated SQL query, executes it safely, and explains the results in plain English with an optional chart.",
    tools: "get_schema, generate_sql, validate_sql, execute_query, explain_results",
    loop: "ReAct: understand question → retrieve schema → generate SQL → validate → execute → explain → optionally retry on error",
    risk: "Never execute un-validated SQL. Enforce read-only mode by default. Parameterize all user inputs to prevent SQL injection. Limit result set size to prevent runaway queries.",
    extensions: [
      "Add query cost estimation before execution and warn for full-table scans",
      "Implement row-level access control: filter results by the authenticated user's permissions",
      "Support multi-step queries: break a complex question into sub-queries and join the results",
      "Return a rendered chart (bar/line/pie) alongside the tabular results using a charting tool",
    ],
  },
  {
    slug: "customer-support-agent",
    title: "Customer Support Agent",
    hours: 7,
    description: "Build a customer support agent that retrieves knowledge-base articles, checks order/account status via API, resolves common issues autonomously, and escalates complex or sensitive cases to a human with a full context handoff.",
    tools: "search_knowledge_base, get_order_status, create_ticket, send_email, escalate_to_human",
    loop: "ReAct: classify intent → retrieve KB articles → check account data if needed → resolve or escalate → confirm with user",
    risk: "Never take account actions (refunds, cancellations, password resets) without explicit user confirmation. Log every action for audit. Escalate immediately for billing disputes, legal threats, or safety concerns.",
    extensions: [
      "Add intent classification to route to specialist sub-agents (billing, technical, returns)",
      "Implement a satisfaction scorer: ask the user to rate the resolution and log the score",
      "Add a human-in-the-loop approval step before any account modification action",
      "Build a red-team eval set: prompt injection attempts, policy conflicts, and out-of-scope requests",
    ],
  },
  {
    slug: "report-generation-agent",
    title: "Report Generation Agent",
    hours: 9,
    description: "Create an agent that accepts a reporting brief, gathers data from multiple sources (APIs, databases, files), structures findings into sections with charts and tables, and produces a polished Markdown or PDF report.",
    tools: "fetch_data_api, query_database, read_file, generate_chart, write_section, compile_report",
    loop: "ReAct: parse brief → identify data sources → fetch each source in parallel → generate charts → write sections → review completeness → compile final report",
    risk: "Validate all data sources before including them. Mark sections with missing or stale data rather than omitting them silently. Never fabricate numbers — abstain and flag if a data source is unavailable.",
    extensions: [
      "Add a review step where the agent critiques its own draft and rewrites weak sections",
      "Support scheduled runs: trigger the agent on a cron schedule and email the report",
      "Add a data freshness checker: warn if any source data is older than a configurable threshold",
      "Generate an executive summary automatically from the full report using a final summarization pass",
    ],
  },
];

export const aiAgentsProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "ai-agents",
  title: p.title,
  description: p.description,
  techStack: ["Python", "Anthropic / OpenAI SDK", "Pydantic", "httpx", "Rich"],
  difficulty: "advanced",
  estimatedHours: p.hours,
  sections: sections(p),
}));
