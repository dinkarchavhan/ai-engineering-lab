import type { ProjectGuide, Section } from "@/lib/content";

type McpSpec = {
  slug: string; title: string; description: string; transport: string; capabilities: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: McpSpec): Section[] {
  return [
    { step: 1, title: "Server scope, capabilities, and security model", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "MCP client-server architecture", chart: "flowchart LR\n  C[MCP Client\\n Claude / your agent] -->|initialize| S[MCP Server]\n  S -->|capabilities| C\n  C -->|tools/call| S\n  S -->|tool result| C\n  C -->|resources/read| S\n  S -->|resource content| C\n  S --> B[Backend\\n API / DB / FS]" },
      { type: "kv", items: [
        { key: "Transport", value: p.transport },
        { key: "Capabilities", value: p.capabilities },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Treat every tool argument as untrusted input", content: "The LLM constructs tool arguments — validate every parameter against a strict schema before passing it to a backend. Path traversal, SQL injection, and command injection are all possible through MCP tool calls if arguments are used unsanitized." },
    ] },
    { step: 2, title: "Scaffold the MCP server", blocks: [
      { type: "code", language: "bash", label: "Install the MCP Python SDK", code: "python -m pip install mcp httpx pydantic" },
      { type: "code", language: "python", label: "Minimal MCP server with stdio transport", code: "import asyncio\nfrom mcp.server import Server\nfrom mcp.server.stdio import stdio_server\nfrom mcp import types\n\napp = Server('my-mcp-server')\n\n@app.list_tools()\nasync def list_tools() -> list[types.Tool]:\n    return [\n        types.Tool(\n            name='example_tool',\n            description='Describe exactly what this tool does and when to use it.',\n            inputSchema={\n                'type': 'object',\n                'properties': {\n                    'param': {'type': 'string', 'description': 'What this param controls'},\n                },\n                'required': ['param'],\n            },\n        ),\n    ]\n\n@app.call_tool()\nasync def call_tool(name: str, arguments: dict) -> list[types.TextContent]:\n    if name == 'example_tool':\n        result = f\"Result for: {arguments['param']}\"\n        return [types.TextContent(type='text', text=result)]\n    raise ValueError(f'Unknown tool: {name}')\n\nasync def main():\n    async with stdio_server() as (read, write):\n        await app.run(read, write, app.create_initialization_options())\n\nif __name__ == '__main__':\n    asyncio.run(main())" },
      { type: "callout", kind: "insight", title: "Tool descriptions are the interface contract", content: "The client LLM reads tool names and descriptions to decide when and how to call them. Write descriptions as precise imperative sentences with explicit scope limits. 'Search weather data for a city — do NOT use for historical climate analysis' is better than 'Get weather'." },
    ] },
    { step: 3, title: "Implement tools, resources, and prompts", blocks: [
      { type: "code", language: "python", label: "Resources and prompt templates", code: "from mcp import types\n\n# Resources expose read-only data the LLM can reference\n@app.list_resources()\nasync def list_resources() -> list[types.Resource]:\n    return [\n        types.Resource(\n            uri='myserver://config',\n            name='Server configuration',\n            description='Current server settings and available data sources',\n            mimeType='application/json',\n        ),\n    ]\n\n@app.read_resource()\nasync def read_resource(uri: str) -> str:\n    if uri == 'myserver://config':\n        return '{\"version\": \"1.0\", \"sources\": [\"example\"]}'\n    raise ValueError(f'Unknown resource: {uri}')\n\n# Prompt templates the client can invoke by name\n@app.list_prompts()\nasync def list_prompts() -> list[types.Prompt]:\n    return [\n        types.Prompt(\n            name='summarize',\n            description='Summarize the result of a tool call in plain language',\n            arguments=[types.PromptArgument(name='data', description='Raw tool output', required=True)],\n        ),\n    ]\n\n@app.get_prompt()\nasync def get_prompt(name: str, arguments: dict) -> types.GetPromptResult:\n    if name == 'summarize':\n        return types.GetPromptResult(\n            messages=[types.PromptMessage(\n                role='user',\n                content=types.TextContent(type='text', text=f\"Summarize this data concisely:\\n{arguments['data']}\"),\n            )]\n        )\n    raise ValueError(f'Unknown prompt: {name}')" },
      { type: "callout", kind: "gotcha", title: "Resources are read-only — tools mutate state", content: "Resources expose data for the LLM to read as context. Tools perform actions. Never use a resource handler to trigger a side effect — if the operation mutates anything, it must be a tool with explicit arguments and a confirmation path." },
    ] },
    { step: 4, title: "Add authentication and input validation", blocks: [
      { type: "code", language: "python", label: "Input validation and auth pattern", code: "import os\nfrom pydantic import BaseModel, validator\n\nAPI_KEY = os.environ.get('MCP_API_KEY', '')   # never hardcode secrets\n\nclass ToolInput(BaseModel):\n    \"\"\"Validate every tool argument before touching the backend.\"\"\"\n    query: str\n\n    @validator('query')\n    def no_injection(cls, v: str) -> str:\n        # Reject strings that look like path traversal or SQL keywords\n        forbidden = ['../', ';', '--', 'DROP', 'DELETE', 'INSERT']\n        for pattern in forbidden:\n            if pattern.lower() in v.lower():\n                raise ValueError(f'Rejected unsafe pattern: {pattern}')\n        if len(v) > 500:\n            raise ValueError('Query too long')\n        return v.strip()\n\n@app.call_tool()\nasync def call_tool(name: str, arguments: dict) -> list[types.TextContent]:\n    # Validate auth header if using SSE transport\n    # For stdio, trust comes from the process boundary\n    try:\n        validated = ToolInput(**arguments)\n    except Exception as e:\n        return [types.TextContent(type='text', text=f'Invalid input: {e}')]\n    # proceed with validated.query\n    return [types.TextContent(type='text', text='OK')]" },
      { type: "callout", kind: "tip", title: "Use environment variables for all secrets", content: "API keys, database URLs, and tokens must come from environment variables, never from tool arguments or resource URIs. Document which env vars the server requires in the README so operators can configure them without reading the source." },
    ] },
    { step: 5, title: "Test with Claude Desktop and ship", blocks: [
      { type: "code", language: "json", label: "Claude Desktop claude_desktop_config.json entry", code: "{\n  \"mcpServers\": {\n    \"my-server\": {\n      \"command\": \"python\",\n      \"args\": [\"/absolute/path/to/server.py\"],\n      \"env\": {\n        \"MY_API_KEY\": \"your-key-here\"\n      }\n    }\n  }\n}" },
      { type: "code", language: "python", label: "Automated tool integration test", code: "import asyncio\nfrom mcp import ClientSession, StdioServerParameters\nfrom mcp.client.stdio import stdio_client\n\nasync def test_server():\n    params = StdioServerParameters(command='python', args=['server.py'])\n    async with stdio_client(params) as (read, write):\n        async with ClientSession(read, write) as session:\n            await session.initialize()\n            tools = await session.list_tools()\n            assert tools.tools, 'Server must expose at least one tool'\n            print(f'Tools available: {[t.name for t in tools.tools]}')\n            # Call a tool and assert the response shape\n            result = await session.call_tool('example_tool', {'param': 'test'})\n            assert result.content, 'Tool must return content'\n            print('Integration test passed')\n\nasyncio.run(test_server())" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Record a short screen capture showing Claude Desktop using your MCP server to complete a real task. Publish the tool schemas, an architecture diagram, your validation logic, and at least one adversarial test case showing that injection attempts are rejected." },
    ] },
  ];
}

const specs: McpSpec[] = [
  {
    slug: "weather-mcp",
    title: "Weather MCP",
    hours: 5,
    description: "Build an MCP server that exposes current conditions, hourly and 7-day forecasts, and severe-weather alerts as tools — so any MCP-compatible client can answer weather questions without a custom integration.",
    transport: "stdio (local dev) — upgrade to SSE for remote access.",
    capabilities: "Tools: get_current_weather, get_forecast, get_alerts. Resources: supported_locations list.",
    risk: "Cache responses to avoid hammering the weather API. Return clearly labelled units (°C/°F, km/h/mph). Never fabricate data if the API is unavailable — return an explicit error.",
    extensions: [
      "Add an SSE transport so the server runs remotely and multiple clients share one instance",
      "Implement a get_historical_weather tool backed by an archive API endpoint",
      "Add a weather-summary prompt template that formats conditions into a human-friendly briefing",
      "Cache responses with a configurable TTL so repeated queries don't hit the upstream API",
    ],
  },
  {
    slug: "database-mcp",
    title: "Database MCP",
    hours: 8,
    description: "Create an MCP server that exposes a relational database to any AI client through schema-inspection, safe query execution, and row-level access control — without exposing raw SQL execution to the LLM.",
    transport: "stdio for local use; SSE with token auth for shared team access.",
    capabilities: "Tools: list_tables, describe_table, run_query (read-only by default), run_write_query (requires approval flag). Resources: schema overview.",
    risk: "Enforce read-only mode by default. Validate all generated SQL before execution. Limit result rows. Never expose connection strings or credentials through tool results or resources.",
    extensions: [
      "Add query-cost estimation (EXPLAIN) before execution and reject queries above a configurable cost threshold",
      "Implement row-level permissions: filter every query result by the authenticated user's data access policy",
      "Add a query-history resource that exposes recent queries for audit review",
      "Support multiple databases: route queries to the correct connection based on a database name argument",
    ],
  },
  {
    slug: "file-system-mcp",
    title: "File System MCP",
    hours: 6,
    description: "Build an MCP server that gives AI clients controlled read and write access to a sandboxed directory — listing files, reading content, writing edits, and searching — without exposing the rest of the host filesystem.",
    transport: "stdio — the process boundary is the primary isolation layer.",
    capabilities: "Tools: list_files, read_file, write_file, search_files, create_directory. Resources: workspace root metadata.",
    risk: "Enforce a strict root directory — reject any path that resolves outside it (path traversal). Validate MIME types before reading binary files. Require explicit confirmation before overwriting existing files.",
    extensions: [
      "Add a diff tool that shows what changed between the current and previous version of a file",
      "Implement a git integration: expose git status, diff, and commit as additional tools",
      "Add file-type filtering so the LLM can only read and write approved extensions",
      "Log every write operation with a timestamp and the calling client ID for audit",
    ],
  },
  {
    slug: "github-mcp",
    title: "GitHub MCP",
    hours: 8,
    description: "Create an MCP server that wraps the GitHub REST API — enabling AI clients to read repositories, issues, and pull requests; create issues and comments; and review diffs — all through a typed tool interface.",
    transport: "stdio with a GitHub personal access token in the environment.",
    capabilities: "Tools: list_repos, get_issue, create_issue, list_pull_requests, get_pr_diff, add_comment. Resources: authenticated user profile.",
    risk: "Scope the GitHub token to the minimum required permissions. Never write to repos without an explicit confirmation argument in the tool call. Rate-limit requests and surface the remaining quota in tool results.",
    extensions: [
      "Add a search_code tool backed by GitHub code search for finding symbols across a repository",
      "Implement a create_pull_request tool with branch, base, title, and body arguments",
      "Add a repo-summary resource that caches the README and top-level file tree for quick context",
      "Support GitHub Actions: expose workflow run status and logs through a get_workflow_run tool",
    ],
  },
  {
    slug: "internal-company-mcp",
    title: "Internal Company MCP",
    hours: 10,
    description: "Design and build a production-ready MCP server that exposes your company's internal tools — HR policies, project trackers, internal wikis, or CRM data — to AI assistants through role-based access control and audit logging.",
    transport: "SSE with OAuth 2.0 or API-key authentication for multi-user remote access.",
    capabilities: "Tools: search_wiki, get_policy, query_crm, create_ticket, lookup_employee. Resources: department index. Prompts: policy-answer, ticket-draft.",
    risk: "Enforce role-based access control on every tool and resource. Log every request with user identity, tool name, arguments, and timestamp. Redact PII from logs. Never expose data the requesting user is not authorized to see.",
    extensions: [
      "Add SSO integration: verify JWTs from your identity provider and map claims to MCP permissions",
      "Implement a data-classification layer: tag tool results as PUBLIC / INTERNAL / CONFIDENTIAL and enforce downstream handling rules",
      "Add an audit dashboard: aggregate tool-call logs and surface anomalous access patterns",
      "Support multi-tenant isolation: route each organization to its own data partition with no cross-tenant leakage",
    ],
  },
];

export const modelContextProtocolProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "mcp",
  title: p.title,
  description: p.description,
  techStack: ["Python", "MCP SDK", "Pydantic", "httpx", "Claude Desktop"],
  difficulty: p.slug === "internal-company-mcp" ? "advanced" : "intermediate",
  estimatedHours: p.hours,
  sections: sections(p),
}));
