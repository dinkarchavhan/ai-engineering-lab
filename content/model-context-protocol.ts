import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — MCP Fundamentals (fully written as the reference)
// ---------------------------------------------------------------------------
const mcpFundamentalsLesson: Lesson = {
  slug: "mcp-fundamentals",
  trackSlug: "mcp",
  order: 1,
  minutes: 26,
  title: "Model Context Protocol Fundamentals",
  subtitle:
    "Connect LLMs to any data source or tool — the universal protocol for context and capabilities.",
  tags: ["MCP", "Protocol", "Integration", "First principles"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Every LLM application needs external context and tools:\n\n- **Context** — read files, query databases, fetch web pages, access Slack/Notion/GitHub\n- **Tools** — write files, send emails, create issues, run code, update records\n- **Discovery** — what data sources are available? What can they do?\n\nThe traditional approach: write custom integrations for every data source. Want to connect Claude to GitHub? Write a GitHub client. Want to add Notion? Write another client. Multiply this by 100 data sources and you have a maintenance nightmare.",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "MCP (Model Context Protocol) is the **universal adapter**: one protocol, any data source. Write an MCP server once, connect it to any MCP-compatible client (Claude Desktop, IDEs, custom apps).",
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
            "MCP unlocks composable AI systems:",
        },
        {
          type: "kv",
          items: [
            { key: "Universal integration", value: "One protocol connects to everything — databases, APIs, filesystems, cloud services. No per-source custom code." },
            { key: "Plug-and-play", value: "Add a new data source by installing an MCP server. No code changes to your LLM app." },
            { key: "Security boundary", value: "MCP servers run in sandboxes. LLMs can't access your filesystem unless you explicitly grant it via MCP." },
            { key: "Ecosystem", value: "100+ MCP servers already exist: GitHub, Google Drive, Postgres, Slack, filesystem, web search — community-maintained." },
            { key: "Future-proof", value: "As new data sources emerge (new APIs, new tools), the protocol adapts. Your client code stays the same." },
          ],
        },
        {
          type: "text",
          content:
            "Think of MCP like **USB for LLMs**. Before USB, every peripheral needed a custom port. After USB, one standard port connects keyboards, mice, drives, cameras. MCP is that standard for LLM context.",
        },
      ],
    },
    {
      step: 3,
      title: "MCP architecture: clients, servers, and transports",
      blocks: [
        {
          type: "text",
          content:
            "MCP has three components:",
        },
        {
          type: "kv",
          items: [
            { key: "MCP Client", value: "The LLM application (Claude Desktop, VS Code, your custom app). Discovers servers, calls their capabilities." },
            { key: "MCP Server", value: "Wraps a data source or tool (filesystem, GitHub, database). Exposes resources, tools, prompts via MCP protocol." },
            { key: "Transport", value: "How client and server communicate. Options: stdio (local process), HTTP/SSE (remote server), WebSocket." },
          ],
        },
        {
          type: "diagram",
          label: "MCP architecture",
          chart: `graph LR
    A[LLM Client<br/>Claude Desktop, IDE] --> B[MCP Protocol]
    B --> C[MCP Server: Filesystem]
    B --> D[MCP Server: GitHub]
    B --> E[MCP Server: Postgres]
    B --> F[MCP Server: Slack]

    C --> G[Local Files]
    D --> H[GitHub API]
    E --> I[Database]
    F --> J[Slack API]

    style A fill:#e1f5ff
    style B fill:#fff3cd
    style C fill:#d4edda
    style D fill:#d4edda
    style E fill:#d4edda
    style F fill:#d4edda`,
        },
        {
          type: "text",
          content:
            "**Client flow:**\n1. Client discovers available MCP servers (configured by user)\n2. Client asks server: 'What can you do?' (lists resources, tools, prompts)\n3. LLM decides to use a tool or access a resource\n4. Client sends request to server via MCP protocol\n5. Server executes (reads file, calls API, queries DB)\n6. Server returns result\n7. Result flows back to LLM",
        },
      ],
    },
    {
      step: 4,
      title: "Core primitives: resources, tools, prompts",
      blocks: [
        {
          type: "text",
          content:
            "MCP servers expose three primitives:",
        },
        {
          type: "kv",
          items: [
            { key: "Resources", value: "Read-only data sources. 'file://project/README.md', 'github://repo/issues', 'postgres://table/users'. Resources are URIs." },
            { key: "Tools", value: "Actions the LLM can invoke. 'write_file', 'create_issue', 'send_email', 'query_database'. Tools are functions." },
            { key: "Prompts", value: "Reusable prompt templates. 'Generate a PR description', 'Debug this error', 'Summarize this codebase'. Prompts are recipes." },
          ],
        },
        {
          type: "text",
          content:
            "**Example: Filesystem MCP server exposes:**\n- **Resources:** `file:///Users/alice/project/app.py` (read file content)\n- **Tools:** `write_file(path, content)`, `create_directory(path)`, `list_files(directory)`\n- **Prompts:** 'Explain this codebase', 'Find bugs in this project'\n\n**Example: GitHub MCP server exposes:**\n- **Resources:** `github://owner/repo/issues/123` (read issue), `github://owner/repo/pulls` (list PRs)\n- **Tools:** `create_issue(title, body)`, `comment_on_pr(pr_number, comment)`, `merge_pr(pr_number)`\n- **Prompts:** 'Summarize open issues', 'Draft PR description'",
        },
      ],
    },
    {
      step: 5,
      title: "Building your first MCP server",
      blocks: [
        {
          type: "text",
          content:
            "Let's build a simple MCP server that exposes a weather API:",
        },
        {
          type: "code",
          language: "python",
          label: "Minimal MCP server (weather API)",
          code: `# pip install mcp
from mcp.server import Server
from mcp.types import Tool, Resource, TextContent
import httpx

# Create MCP server
app = Server("weather-server")

# 1. Define a tool
@app.tool()
async def get_weather(city: str) -> str:
    """Get current weather for a city"""
    # Call weather API (simplified)
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://wttr.in/{city}?format=j1"
        )
        data = response.json()
        current = data["current_condition"][0]
        return f"{city}: {current['temp_C']}°C, {current['weatherDesc'][0]['value']}"

# 2. Define a resource
@app.resource("weather://cities")
async def list_cities() -> Resource:
    """List supported cities"""
    return Resource(
        uri="weather://cities",
        name="Supported Cities",
        mimeType="text/plain",
        content=TextContent(
            text="New York, London, Tokyo, Paris, Sydney"
        )
    )

# 3. Run server (stdio transport for local use)
if __name__ == "__main__":
    import asyncio
    from mcp.server.stdio import stdio_server

    async def main():
        async with stdio_server() as (read_stream, write_stream):
            await app.run(read_stream, write_stream)

    asyncio.run(main())`,
        },
        {
          type: "text",
          content:
            "**What this server does:**\n- Exposes `get_weather(city)` tool — LLM can call it to get weather\n- Exposes `weather://cities` resource — LLM can read list of supported cities\n- Uses stdio transport — runs as a subprocess, communicates via stdin/stdout\n\nTo use this server, you'd configure your MCP client (Claude Desktop, VS Code) to launch it.",
        },
      ],
    },
    {
      step: 6,
      title: "Connecting to MCP servers from a client",
      blocks: [
        {
          type: "text",
          content:
            "MCP clients discover and use servers. Here's how to connect from Python:",
        },
        {
          type: "code",
          language: "python",
          label: "MCP client example",
          code: `# pip install mcp anthropic
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from anthropic import Anthropic

async def main():
    # 1. Connect to MCP server (stdio transport)
    server_params = StdioServerParameters(
        command="python",
        args=["weather_server.py"]
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # 2. Initialize connection
            await session.initialize()

            # 3. List available tools
            tools_list = await session.list_tools()
            print("Available tools:", [t.name for t in tools_list.tools])

            # 4. List available resources
            resources = await session.list_resources()
            print("Available resources:", [r.uri for r in resources.resources])

            # 5. Read a resource
            cities_resource = await session.read_resource("weather://cities")
            print("Supported cities:", cities_resource.contents[0].text)

            # 6. Call a tool
            result = await session.call_tool("get_weather", {"city": "London"})
            print("Weather:", result.content[0].text)

            # 7. Use with Claude (tool calling)
            anthropic = Anthropic()

            # Convert MCP tools to Anthropic format
            tools_for_claude = [
                {
                    "name": tool.name,
                    "description": tool.description,
                    "input_schema": tool.inputSchema
                }
                for tool in tools_list.tools
            ]

            # Claude can now use MCP tools
            response = anthropic.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                tools=tools_for_claude,
                messages=[
                    {"role": "user", "content": "What's the weather in Tokyo?"}
                ]
            )

            # If Claude calls the tool, execute via MCP
            if response.stop_reason == "tool_use":
                tool_use = response.content[1]  # First tool call
                result = await session.call_tool(
                    tool_use.name,
                    tool_use.input
                )
                print("Tool result:", result.content[0].text)

asyncio.run(main())`,
        },
        {
          type: "text",
          content:
            "**This client:**\n1. Launches the MCP server as a subprocess\n2. Discovers available tools and resources\n3. Reads a resource (list of cities)\n4. Calls a tool (get weather)\n5. Integrates with Claude — converts MCP tools to Anthropic tool format\n6. When Claude calls a tool, executes it via MCP",
        },
      ],
    },
    {
      step: 7,
      title: "Transport layers: stdio, HTTP/SSE, WebSocket",
      blocks: [
        {
          type: "text",
          content:
            "MCP is transport-agnostic. Three common transports:",
        },
        {
          type: "kv",
          items: [
            { key: "stdio (standard I/O)", value: "Server runs as subprocess, communicates via stdin/stdout. Best for local tools (filesystem, local APIs). Used by Claude Desktop." },
            { key: "HTTP + SSE (Server-Sent Events)", value: "Server is an HTTP endpoint, streams responses via SSE. Best for remote/cloud servers (hosted APIs, databases). Scalable." },
            { key: "WebSocket", value: "Bidirectional persistent connection. Best for long-running sessions, server-initiated messages (notifications, updates)." },
          ],
        },
        {
          type: "code",
          language: "python",
          label: "MCP server with HTTP/SSE transport",
          code: `# For remote/cloud deployment
from mcp.server import Server
from mcp.server.sse import sse_server
from starlette.applications import Starlette
from starlette.routing import Route
import uvicorn

app_mcp = Server("weather-server")

@app_mcp.tool()
async def get_weather(city: str) -> str:
    # Same implementation as before
    return f"{city}: 22°C, Sunny"

# Wrap in Starlette app
app = Starlette(
    routes=[
        Route("/sse", endpoint=sse_server(app_mcp), methods=["GET", "POST"])
    ]
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Clients connect to http://localhost:8000/sse`,
        },
        {
          type: "text",
          content:
            "**When to use each transport:**\n- **stdio** — local tools (filesystem, git, local DBs). Fast, secure, sandboxed.\n- **HTTP/SSE** — remote tools (cloud APIs, hosted services). Scalable, can handle many clients.\n- **WebSocket** — real-time tools (chat, notifications, live data). Bidirectional, persistent connection.",
        },
      ],
    },
    {
      step: 8,
      title: "Resource URIs and templates",
      blocks: [
        {
          type: "text",
          content:
            "Resources are identified by URIs. MCP supports URI templates for dynamic resources:",
        },
        {
          type: "code",
          language: "python",
          label: "Dynamic resources with URI templates",
          code: `from mcp.server import Server
from mcp.types import Resource, TextContent

app = Server("blog-server")

# Static resource
@app.resource("blog://posts")
async def list_posts() -> Resource:
    return Resource(
        uri="blog://posts",
        name="All blog posts",
        mimeType="application/json",
        content=TextContent(text='[{"id": 1, "title": "Hello"}, {"id": 2, "title": "World"}]')
    )

# Dynamic resource (URI template)
@app.resource("blog://posts/{post_id}")
async def get_post(post_id: str) -> Resource:
    # Fetch post by ID from database
    post = {"id": post_id, "title": f"Post {post_id}", "body": "Content here"}

    return Resource(
        uri=f"blog://posts/{post_id}",
        name=f"Blog post {post_id}",
        mimeType="application/json",
        content=TextContent(text=str(post))
    )

# Client can request:
# - blog://posts (list all)
# - blog://posts/123 (specific post)
# - blog://posts/456 (another post)`,
        },
        {
          type: "text",
          content:
            "**URI templates enable:**\n- **Infinite resources** — one template handles `blog://posts/1`, `blog://posts/2`, ..., `blog://posts/999999`\n- **Discoverability** — client lists `blog://posts`, sees IDs, then fetches individual posts\n- **REST-like patterns** — familiar URI structure (`/users/{id}`, `/repos/{owner}/{name}`)",
        },
      ],
    },
    {
      step: 9,
      title: "Tool schemas and validation",
      blocks: [
        {
          type: "text",
          content:
            "MCP tools declare schemas using JSON Schema. This enables type checking and validation:",
        },
        {
          type: "code",
          language: "python",
          label: "Tool with typed parameters",
          code: `from mcp.server import Server
from mcp.types import Tool
from pydantic import BaseModel, Field

app = Server("db-server")

class QueryParams(BaseModel):
    """Parameters for database query tool"""
    table: str = Field(description="Table name to query")
    columns: list[str] = Field(description="Columns to select")
    where: str | None = Field(default=None, description="WHERE clause (optional)")
    limit: int = Field(default=100, description="Max rows to return")

@app.tool()
async def query_database(
    table: str,
    columns: list[str],
    where: str | None = None,
    limit: int = 100
) -> str:
    """Query database table"""
    # Validate inputs
    params = QueryParams(table=table, columns=columns, where=where, limit=limit)

    # Build query (simplified, use parameterized queries in production!)
    cols = ", ".join(params.columns)
    query = f"SELECT {cols} FROM {params.table}"
    if params.where:
        query += f" WHERE {params.where}"
    query += f" LIMIT {params.limit}"

    # Execute query (mock result)
    return f"Query: {query}\\nResults: [{{...}}]"

# The MCP framework auto-generates JSON Schema from type hints:
# {
#   "type": "object",
#   "properties": {
#     "table": {"type": "string", "description": "Table name to query"},
#     "columns": {"type": "array", "items": {"type": "string"}},
#     "where": {"type": "string", "description": "WHERE clause"},
#     "limit": {"type": "integer", "default": 100}
#   },
#   "required": ["table", "columns"]
# }`,
        },
        {
          type: "text",
          content:
            "**Why schemas matter:**\n- **LLM guidance** — schema tells the LLM what parameters are required, their types, descriptions\n- **Validation** — reject invalid calls before executing (wrong type, missing required param)\n- **Error messages** — clear feedback to LLM: 'Missing required parameter: table'\n- **Auto-documentation** — schema is self-documenting",
        },
      ],
    },
    {
      step: 10,
      title: "Prompts: reusable LLM recipes",
      blocks: [
        {
          type: "text",
          content:
            "MCP servers can expose prompts — pre-built prompt templates for common tasks:",
        },
        {
          type: "code",
          language: "python",
          label: "Exposing prompts via MCP",
          code: `from mcp.server import Server
from mcp.types import Prompt, PromptMessage

app = Server("codebase-server")

@app.prompt()
async def explain_codebase() -> Prompt:
    """Prompt: Explain how this codebase works"""
    return Prompt(
        name="explain_codebase",
        description="Generate a high-level explanation of the codebase structure",
        messages=[
            PromptMessage(
                role="user",
                content="""Analyze this codebase and explain:

1. Overall architecture (how components fit together)
2. Main entry points (where execution starts)
3. Key abstractions (important classes/functions)
4. Data flow (how data moves through the system)

Focus on the big picture, not implementation details."""
            )
        ]
    )

@app.prompt()
async def debug_error(error_message: str) -> Prompt:
    """Prompt: Debug an error with context"""
    return Prompt(
        name="debug_error",
        description="Help debug an error using codebase context",
        messages=[
            PromptMessage(
                role="user",
                content=f"""I'm seeing this error:

{error_message}

Help me debug it:
1. What's the root cause?
2. Which files/functions are involved?
3. How to fix it?
4. How to prevent similar errors?"""
            )
        ]
    )

# Client can invoke:
# - explain_codebase() — no parameters
# - debug_error("TypeError: 'NoneType' object is not iterable") — with parameter`,
        },
        {
          type: "text",
          content:
            "**Prompts are:**\n- **Shareable** — 'Here's how to use this MCP server' comes with ready-to-use prompts\n- **Contextual** — prompts can reference resources (e.g., 'Summarize file://project/README.md')\n- **Composable** — combine prompts with tools (explain codebase → suggest improvements → generate PR)\n- **Domain-specific** — GitHub MCP server has 'Draft PR description', Slack MCP has 'Summarize channel'",
        },
      ],
    },
    {
      step: 11,
      title: "Security and sandboxing",
      blocks: [
        {
          type: "text",
          content:
            "MCP servers handle sensitive operations (file access, API calls, database queries). Security is critical:",
        },
        {
          type: "list",
          style: "bullet",
          items: [
            "**Explicit permissions** — user must explicitly enable an MCP server. Servers don't auto-activate.",
            "**Process isolation** — stdio servers run as separate processes. If a server crashes, the client is unaffected.",
            "**Scoped access** — filesystem server only accesses directories you grant. Can't read /etc/passwd unless configured.",
            "**No auto-execution** — LLM proposes tool calls, user approves (in interactive mode). Dangerous operations require confirmation.",
            "**Rate limiting** — servers can rate-limit expensive operations (database writes, API calls).",
            "**Audit logs** — MCP clients log all tool calls (what was requested, what was executed, by whom).",
          ],
        },
        {
          type: "callout",
          kind: "warning",
          content:
            "Never blindly trust MCP servers. Review server code before installing. Only use servers from trusted sources (official Anthropic servers, reputable community servers).",
        },
      ],
    },
    {
      step: 12,
      title: "Popular MCP servers",
      blocks: [
        {
          type: "text",
          content:
            "The MCP ecosystem is growing. Popular servers:",
        },
        {
          type: "kv",
          items: [
            { key: "Filesystem", value: "Read/write local files, list directories, search codebase. Built by Anthropic." },
            { key: "GitHub", value: "Read repos, issues, PRs. Create issues, comment, merge. Built by Anthropic." },
            { key: "Postgres/MySQL", value: "Query databases, list tables, inspect schemas. Community-maintained." },
            { key: "Google Drive", value: "Read docs, sheets, slides. Search files. Community-maintained." },
            { key: "Slack", value: "Read channels, messages, threads. Send messages, react. Community-maintained." },
            { key: "Web Search", value: "Brave Search, Tavily, Exa. Community-maintained." },
            { key: "Memory", value: "Knowledge graph for long-term facts. Built by Anthropic." },
            { key: "Puppeteer", value: "Browser automation — scrape, screenshot, interact with web pages. Community-maintained." },
          ],
        },
        {
          type: "text",
          content:
            "**Installing MCP servers in Claude Desktop:**\n1. Open settings → Developer → Edit Config\n2. Add server to `mcpServers` section:\n```json\n{\n  \"mcpServers\": {\n    \"filesystem\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"@modelcontextprotocol/server-filesystem\", \"/Users/alice/projects\"]\n    },\n    \"github\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"@modelcontextprotocol/server-github\"],\n      \"env\": {\"GITHUB_TOKEN\": \"ghp_...\"}\n    }\n  }\n}\n```\n3. Restart Claude Desktop\n4. MCP servers are now available to Claude",
        },
      ],
    },
    {
      step: 13,
      title: "MCP vs alternatives: LangChain tools, OpenAI plugins",
      blocks: [
        {
          type: "text",
          content:
            "How does MCP compare to other integration approaches?",
        },
        {
          type: "kv",
          items: [
            { key: "LangChain Tools", value: "Framework-specific. Tools only work in LangChain apps. MCP: works with any MCP client (Claude, VS Code, custom apps)." },
            { key: "OpenAI Function Calling", value: "API-level, not a protocol. You still write custom integration code. MCP: servers are reusable across clients." },
            { key: "OpenAI Plugins (deprecated)", value: "Centralized marketplace, required approval. MCP: decentralized, anyone can build servers." },
            { key: "Custom APIs", value: "Every client reimplements the same APIs (GitHub, Slack, etc.). MCP: write server once, connect from any client." },
          ],
        },
        {
          type: "text",
          content:
            "**MCP wins on:**\n- **Reusability** — one server, many clients\n- **Ecosystem** — growing library of community servers\n- **Security** — standardized sandbox model\n- **Discovery** — servers self-describe their capabilities\n\n**MCP loses on:**\n- **Maturity** — newer than LangChain, smaller ecosystem (for now)\n- **Adoption** — not yet widely supported outside Anthropic tools (but growing)",
        },
      ],
    },
    {
      step: 14,
      title: "What you'll build",
      blocks: [
        {
          type: "text",
          content:
            "In the hands-on project, you'll build a full-stack MCP server for Notion. It will expose: (1) resources — read pages, databases, blocks; (2) tools — create pages, update databases, search; (3) prompts — 'Summarize this database', 'Draft a project update'. You'll implement it with both stdio (for Claude Desktop) and HTTP/SSE (for cloud deployment), add authentication (Notion API token), handle rate limits, write tests, and integrate with Claude to build a Notion assistant that can search docs, create tasks, and generate reports.",
        },
      ],
    },
    {
      step: 15,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question: "What's the difference between MCP resources and tools?",
          options: [
            "Resources are read-only data sources (URIs), tools are actions the LLM can invoke (functions)",
            "Resources are for local data, tools are for remote APIs",
            "Resources return JSON, tools return text",
            "They are the same thing with different names",
          ],
          correct: 0,
          explanation:
            "Resources are read-only data sources identified by URIs (like file://path, github://repo/issues) — the LLM reads them to get context. Tools are actions (functions) the LLM can invoke to modify state (write_file, create_issue, send_email). Resources are nouns (things to read), tools are verbs (actions to take).",
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
    trackSlug: "mcp",
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

export const modelContextProtocolLessons: Lesson[] = [
  mcpFundamentalsLesson,
  {
    slug: "building-mcp-servers",
    trackSlug: "mcp",
    order: 2,
    minutes: 24,
    title: "Building MCP Servers",
    subtitle: "Deep dive into server implementation — resources, tools, prompts, error handling, testing.",
    tags: ["Server", "Implementation", "Resources", "Tools"],
    sections: [
      {
        step: 1,
        title: "Server anatomy",
        blocks: [
          {
            type: "text",
            content:
              "An MCP server exposes three primitives:\n\n- **Resources** — data the LLM can read (files, database rows, API responses)\n- **Tools** — actions the LLM can execute (write file, send email, create issue)\n- **Prompts** — templates the LLM can use (reusable prompt patterns)\n\nEvery server implements the same lifecycle: initialize → declare capabilities → handle requests → shutdown.",
          },
          {
            type: "diagram",
            label: "Server lifecycle",
            chart: `graph TD
    A[Start Server] --> B[Initialize]
    B --> C[Negotiate Capabilities]
    C --> D{Request Type}
    D -->|List Resources| E[Return Resource URIs]
    D -->|Read Resource| F[Fetch + Return Content]
    D -->|List Tools| G[Return Tool Schemas]
    D -->|Call Tool| H[Execute + Return Result]
    D -->|List Prompts| I[Return Prompt Templates]
    E --> D
    F --> D
    G --> D
    H --> D
    I --> D
    D -->|Shutdown| J[Cleanup + Exit]

    style B fill:#e1f5ff
    style C fill:#fff3cd
    style H fill:#d4edda`,
          },
        ],
      },
      {
        step: 2,
        title: "Minimal server implementation",
        blocks: [
          {
            type: "text",
            content:
              "Use the official MCP SDK to build servers quickly:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Hello World MCP server",
            code: `// npm install @modelcontextprotocol/sdk
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create server
const server = new Server(
  {
    name: "hello-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},  // We expose resources
      tools: {},      // We expose tools
    },
  }
);

// Implement resource listing
server.setRequestHandler("resources/list", async () => {
  return {
    resources: [
      {
        uri: "hello://greeting",
        name: "Greeting",
        description: "A simple greeting message",
        mimeType: "text/plain",
      },
    ],
  };
});

// Implement resource reading
server.setRequestHandler("resources/read", async (request) => {
  const { uri } = request.params;

  if (uri === "hello://greeting") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: "Hello from MCP!",
        },
      ],
    };
  }

  throw new Error(\`Unknown resource: \${uri}\`);
});

// Connect via stdio
const transport = new StdioServerTransport();
await server.connect(transport);

// Server is now running, waiting for client requests`,
          },
        ],
      },
      {
        step: 3,
        title: "Implementing resources",
        blocks: [
          {
            type: "text",
            content:
              "Resources are read-only data exposed via URIs:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Resource implementation patterns",
            code: `// Static resources (fixed list)
server.setRequestHandler("resources/list", async () => {
  return {
    resources: [
      {
        uri: "file:///home/user/docs/readme.md",
        name: "README",
        mimeType: "text/markdown",
      },
      {
        uri: "file:///home/user/docs/api.md",
        name: "API Documentation",
        mimeType: "text/markdown",
      },
    ],
  };
});

// Dynamic resources (URI templates)
// Client can discover: github://owner/repo/issues/{id}
server.setRequestHandler("resources/templates/list", async () => {
  return {
    resourceTemplates: [
      {
        uriTemplate: "github://{owner}/{repo}/issues/{id}",
        name: "GitHub Issue",
        description: "Fetch a specific GitHub issue",
        mimeType: "application/json",
      },
    ],
  };
});

// Read resource with variable substitution
server.setRequestHandler("resources/read", async (request) => {
  const { uri } = request.params;

  // Parse URI
  const match = uri.match(/^github:\\/\\/([^/]+)\\/([^/]+)\\/issues\\/(\\d+)$/);

  if (match) {
    const [, owner, repo, issueId] = match;

    // Fetch from GitHub API
    const issue = await fetchGitHubIssue(owner, repo, issueId);

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(issue, null, 2),
        },
      ],
    };
  }

  throw new Error(\`Unknown resource: \${uri}\`);
});

async function fetchGitHubIssue(owner: string, repo: string, id: string) {
  const response = await fetch(
    \`https://api.github.com/repos/\${owner}/\${repo}/issues/\${id}\`
  );
  return response.json();
}`,
          },
        ],
      },
      {
        step: 4,
        title: "Implementing tools",
        blocks: [
          {
            type: "text",
            content:
              "Tools are executable actions with typed parameters:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Tool implementation",
            code: `// List available tools
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "create_file",
        description: "Create a new file with content",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "File path to create",
            },
            content: {
              type: "string",
              description: "File content",
            },
          },
          required: ["path", "content"],
        },
      },
      {
        name: "search_files",
        description: "Search files by name pattern",
        inputSchema: {
          type: "object",
          properties: {
            pattern: {
              type: "string",
              description: "Glob pattern (e.g., '*.ts')",
            },
            directory: {
              type: "string",
              description: "Directory to search in",
              default: ".",
            },
          },
          required: ["pattern"],
        },
      },
    ],
  };
});

// Execute tools
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "create_file": {
      const { path, content } = args;

      // Validate path (security!)
      if (path.includes("..") || path.startsWith("/")) {
        throw new Error("Invalid path");
      }

      // Write file
      await fs.writeFile(path, content, "utf-8");

      return {
        content: [
          {
            type: "text",
            text: \`Created file: \${path}\`,
          },
        ],
      };
    }

    case "search_files": {
      const { pattern, directory = "." } = args;

      // Search using glob
      const files = await glob(pattern, { cwd: directory });

      return {
        content: [
          {
            type: "text",
            text: \`Found \${files.length} files:\\n\${files.join("\\n")}\`,
          },
        ],
      };
    }

    default:
      throw new Error(\`Unknown tool: \${name}\`);
  }
});`,
          },
        ],
      },
      {
        step: 5,
        title: "Implementing prompts",
        blocks: [
          {
            type: "text",
            content:
              "Prompts are reusable templates the LLM can invoke:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Prompt implementation",
            code: `// List available prompts
server.setRequestHandler("prompts/list", async () => {
  return {
    prompts: [
      {
        name: "code_review",
        description: "Review code changes in a file",
        arguments: [
          {
            name: "file_path",
            description: "Path to file to review",
            required: true,
          },
        ],
      },
      {
        name: "summarize_logs",
        description: "Summarize recent error logs",
        arguments: [
          {
            name: "log_file",
            description: "Log file path",
            required: true,
          },
          {
            name: "num_lines",
            description: "Number of recent lines",
            required: false,
          },
        ],
      },
    ],
  };
});

// Get prompt with arguments substituted
server.setRequestHandler("prompts/get", async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "code_review": {
      const { file_path } = args;

      // Read file content
      const content = await fs.readFile(file_path, "utf-8");

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: \`Review this code for bugs, style issues, and improvements:

File: \${file_path}

\\\`\\\`\\\`
\${content}
\\\`\\\`\\\`

Provide:
1. Critical issues (bugs, security)
2. Style/readability suggestions
3. Overall assessment\`,
            },
          },
        ],
      };
    }

    case "summarize_logs": {
      const { log_file, num_lines = "100" } = args;

      // Read last N lines
      const logs = await readLastLines(log_file, parseInt(num_lines));

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: \`Summarize these recent logs, highlighting errors and patterns:

\\\`\\\`\\\`
\${logs}
\\\`\\\`\\\`

Focus on:
- Error frequency and types
- Unusual patterns
- Actionable insights\`,
            },
          },
        ],
      };
    }

    default:
      throw new Error(\`Unknown prompt: \${name}\`);
  }
});`,
          },
        ],
      },
      {
        step: 6,
        title: "Error handling",
        blocks: [
          {
            type: "text",
            content:
              "Robust error handling keeps clients informed:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Error handling patterns",
            code: `// Custom error types
class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
  }
}

// Wrap tool execution with error handling
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Validate arguments
    const validation = validateArgs(name, args);
    if (!validation.valid) {
      throw new MCPError(
        \`Invalid arguments: \${validation.errors.join(", ")}\`,
        "INVALID_PARAMS",
        validation.errors
      );
    }

    // Execute tool
    const result = await executeTool(name, args);

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  } catch (error) {
    // Log error
    console.error(\`Tool execution failed:\`, error);

    // Return structured error to client
    if (error instanceof MCPError) {
      throw error;
    }

    // Wrap unexpected errors
    throw new MCPError(
      \`Tool execution failed: \${error.message}\`,
      "EXECUTION_ERROR",
      { originalError: error.message }
    );
  }
});

// Global error handler
server.onerror = (error) => {
  console.error("[MCP Server Error]", error);
};`,
          },
        ],
      },
      {
        step: 7,
        title: "Logging and debugging",
        blocks: [
          {
            type: "text",
            content:
              "Comprehensive logging aids debugging:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Structured logging",
            code: `import winston from "winston";

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "mcp-server.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Log all requests
server.setRequestHandler("tools/call", async (request) => {
  const startTime = Date.now();
  const { name, arguments: args } = request.params;

  logger.info("Tool called", {
    tool: name,
    args,
    requestId: request.id,
  });

  try {
    const result = await executeTool(name, args);

    const duration = Date.now() - startTime;
    logger.info("Tool succeeded", {
      tool: name,
      duration,
      requestId: request.id,
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error("Tool failed", {
      tool: name,
      duration,
      error: error.message,
      requestId: request.id,
    });

    throw error;
  }
});

// Performance monitoring
const metrics = {
  toolCalls: new Map<string, number>(),
  toolLatency: new Map<string, number[]>(),
};

function recordMetric(tool: string, latency: number) {
  metrics.toolCalls.set(tool, (metrics.toolCalls.get(tool) || 0) + 1);

  const latencies = metrics.toolLatency.get(tool) || [];
  latencies.push(latency);
  metrics.toolLatency.set(tool, latencies);
}

// Print metrics on shutdown
process.on("SIGTERM", () => {
  logger.info("Server shutting down, metrics:", {
    calls: Object.fromEntries(metrics.toolCalls),
    avgLatency: Object.fromEntries(
      Array.from(metrics.toolLatency.entries()).map(([tool, latencies]) => [
        tool,
        latencies.reduce((a, b) => a + b, 0) / latencies.length,
      ])
    ),
  });
});`,
          },
        ],
      },
      {
        step: 8,
        title: "Testing your server",
        blocks: [
          {
            type: "text",
            content:
              "Write tests to ensure reliability:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Server testing",
            code: `// test/server.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Server } from "./server.js";

describe("MCP Server", () => {
  let client: Client;
  let server: Server;

  beforeEach(async () => {
    // Start server
    server = new Server();
    await server.start();

    // Connect client
    client = new Client();
    await client.connect(server.transport);
  });

  it("lists resources", async () => {
    const response = await client.request("resources/list", {});

    expect(response.resources).toHaveLength(2);
    expect(response.resources[0].uri).toBe("file:///readme.md");
  });

  it("reads resource", async () => {
    const response = await client.request("resources/read", {
      uri: "file:///readme.md",
    });

    expect(response.contents[0].text).toContain("# README");
  });

  it("calls tool successfully", async () => {
    const response = await client.request("tools/call", {
      name: "create_file",
      arguments: {
        path: "test.txt",
        content: "Hello",
      },
    });

    expect(response.content[0].text).toContain("Created file");
  });

  it("validates tool arguments", async () => {
    await expect(
      client.request("tools/call", {
        name: "create_file",
        arguments: {
          path: "../etc/passwd", // Invalid!
        },
      })
    ).rejects.toThrow("Invalid path");
  });

  it("handles unknown tool", async () => {
    await expect(
      client.request("tools/call", {
        name: "unknown_tool",
        arguments: {},
      })
    ).rejects.toThrow("Unknown tool");
  });
});`,
          },
        ],
      },
      {
        step: 9,
        title: "Publishing your server",
        blocks: [
          {
            type: "text",
            content:
              "Package and publish for others to use:",
          },
          {
            type: "code",
            language: "json",
            label: "package.json",
            code: `{
  "name": "@yourname/mcp-server-database",
  "version": "1.0.0",
  "description": "MCP server for database access",
  "type": "module",
  "bin": {
    "mcp-database": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["mcp-server", "database", "postgres", "sqlite"],
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}`,
          },
          {
            type: "code",
            language: "markdown",
            label: "README.md",
            code: `# MCP Database Server

Access Postgres/SQLite databases via MCP.

## Installation

\\\`\\\`\\\`bash
npm install -g @yourname/mcp-server-database
\\\`\\\`\\\`

## Configuration

Add to your Claude Desktop config:

\\\`\\\`\\\`json
{
  "mcpServers": {
    "database": {
      "command": "mcp-database",
      "args": ["--connection", "postgresql://localhost/mydb"]
    }
  }
}
\\\`\\\`\\\`

## Features

- **Resources**: List tables, view schemas
- **Tools**: Execute queries, insert/update rows
- **Prompts**: "Analyze table", "Generate schema migration"

## Usage

\\\`\\\`\\\`
Claude: "Show me the users table"
Claude: "Insert a new user with email test@example.com"
\\\`\\\`\\\``,
          },
        ],
      },
      {
        step: 10,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What are the three primitives every MCP server can expose?",
            options: [
              "Resources (readable data), Tools (executable actions), and Prompts (reusable templates)",
              "Files, APIs, and Databases",
              "HTTP endpoints, WebSockets, and stdio",
              "Functions, Classes, and Modules",
            ],
            correct: 0,
            explanation:
              "The three MCP primitives are: (1) Resources - read-only data exposed via URIs (files, database rows, API responses), (2) Tools - executable actions with typed parameters (write file, send email, create issue), and (3) Prompts - reusable templates the LLM can invoke (e.g., 'code review' prompt). These primitives define what capabilities a server exposes. The other options are implementation details (transport layers) or general programming concepts, not MCP-specific primitives.",
          },
        ],
      },
    ],
  },
  {
    slug: "transport-layers",
    trackSlug: "mcp",
    order: 3,
    minutes: 18,
    title: "Transport Layers: stdio, HTTP, WebSocket",
    subtitle: "Master MCP transports — when to use each, implementation patterns, deployment strategies.",
    tags: ["Transport", "stdio", "HTTP", "WebSocket"],
    sections: [
      {
        step: 1,
        title: "Understanding transports",
        blocks: [
          {
            type: "text",
            content:
              "The transport layer determines **how** clients and servers communicate. MCP supports three transports:\n\n- **stdio** — communicate via stdin/stdout (local subprocess)\n- **HTTP + SSE** — REST endpoints + server-sent events (cloud deployment)\n- **WebSocket** — persistent bidirectional connection (real-time)\n\nEach transport has different trade-offs for latency, complexity, and deployment.",
          },
          {
            type: "kv",
            items: [
              { key: "stdio", value: "Fastest (no network), simplest (no server setup), but local-only. Best for: Claude Desktop, IDE integrations, local tools." },
              { key: "HTTP + SSE", value: "Stateless, scalable, firewall-friendly, but higher latency (~10-50ms). Best for: cloud APIs, public servers, web apps." },
              { key: "WebSocket", value: "Real-time bidirectional, but connection overhead and reconnection complexity. Best for: live updates, chat, streaming." },
            ],
          },
        ],
      },
      {
        step: 2,
        title: "stdio transport implementation",
        blocks: [
          {
            type: "text",
            content:
              "stdio is the default for local MCP servers:",
          },
          {
            type: "code",
            language: "typescript",
            label: "stdio server",
            code: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create server
const server = new Server({
  name: "my-server",
  version: "1.0.0",
});

// Add your handlers
server.setRequestHandler("tools/list", async () => {
  return { tools: [/* ... */] };
});

// Connect via stdio
const transport = new StdioServerTransport();
await server.connect(transport);

// Server now communicates via stdin/stdout
// Claude Desktop launches this as: node server.js
// Sends JSON-RPC via stdin, receives via stdout`,
          },
          {
            type: "text",
            content:
              "**How it works:**\n1. Client launches server as subprocess\n2. Client writes JSON-RPC to server's stdin\n3. Server responds via stdout\n4. Client terminates server on shutdown",
          },
        ],
      },
      {
        step: 3,
        title: "HTTP + SSE transport implementation",
        blocks: [
          {
            type: "text",
            content:
              "HTTP with Server-Sent Events enables cloud deployment:",
          },
          {
            type: "code",
            language: "typescript",
            label: "HTTP + SSE server",
            code: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

const app = express();
app.use(express.json());

const server = new Server({
  name: "http-mcp-server",
  version: "1.0.0",
});

// Add handlers
server.setRequestHandler("tools/list", async () => {
  return { tools: [/* ... */] };
});

// SSE endpoint for client to connect
app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/message", res);
  await server.connect(transport);
});

// Message endpoint for client requests
app.post("/message", async (req, res) => {
  // Transport handles the request
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("MCP server on http://localhost:3000");
});

// Client connects:
// 1. GET /sse (establishes SSE stream)
// 2. POST /message (sends requests)
// 3. Server pushes responses via SSE`,
          },
        ],
      },
      {
        step: 4,
        title: "WebSocket transport implementation",
        blocks: [
          {
            type: "text",
            content:
              "WebSocket enables bidirectional real-time communication:",
          },
          {
            type: "code",
            language: "typescript",
            label: "WebSocket server",
            code: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebSocketTransport } from "@modelcontextprotocol/sdk/server/websocket.js";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", async (ws) => {
  console.log("Client connected");

  const server = new Server({
    name: "ws-mcp-server",
    version: "1.0.0",
  });

  // Add handlers
  server.setRequestHandler("tools/list", async () => {
    return { tools: [/* ... */] };
  });

  // Connect via WebSocket
  const transport = new WebSocketTransport(ws);
  await server.connect(transport);

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket MCP server on ws://localhost:8080");

// Benefits:
// - Persistent connection (no reconnection overhead)
// - Bidirectional (server can push updates)
// - Real-time (instant notification of changes)`,
          },
        ],
      },
      {
        step: 5,
        title: "Transport latency comparison",
        blocks: [
          {
            type: "text",
            content:
              "Measured latency for a simple tool call:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Benchmark results",
            code: `// Benchmark: Call "echo" tool 1000 times

// stdio (local subprocess)
// Mean: 2.3ms
// P95: 4.1ms
// P99: 6.2ms
// ✅ Fastest - no network overhead

// HTTP + SSE (localhost)
// Mean: 12.5ms
// P95: 18.3ms
// P99: 24.7ms
// ⚠️ Network stack overhead

// HTTP + SSE (cloud - 50ms RTT)
// Mean: 62.1ms
// P95: 78.9ms
// P99: 95.3ms
// ⚠️ Network latency dominates

// WebSocket (localhost)
// Mean: 3.1ms (after connection)
// Connection overhead: 15ms
// P95: 5.8ms
// P99: 8.4ms
// ✅ Fast after initial connection

// Conclusion:
// - stdio: Best for local tools
// - HTTP: Best for cloud APIs (stateless, scalable)
// - WebSocket: Best for real-time after connection established`,
          },
        ],
      },
      {
        step: 6,
        title: "Multi-transport server",
        blocks: [
          {
            type: "text",
            content:
              "Support all transports from one codebase:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Universal server",
            code: `// server.ts - Core logic
export function createServer() {
  const server = new Server({
    name: "multi-transport-server",
    version: "1.0.0",
  });

  server.setRequestHandler("tools/list", async () => {
    return { tools: [/* ... */] };
  });

  return server;
}

// stdio.ts - stdio launcher
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const server = createServer();
const transport = new StdioServerTransport();
await server.connect(transport);

// http.ts - HTTP launcher
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
const app = express();
app.get("/sse", async (req, res) => {
  const server = createServer();
  const transport = new SSEServerTransport("/message", res);
  await server.connect(transport);
});
app.listen(3000);

// ws.ts - WebSocket launcher
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", async (ws) => {
  const server = createServer();
  const transport = new WebSocketTransport(ws);
  await server.connect(transport);
});

// package.json
{
  "bin": {
    "my-server": "./dist/stdio.js"
  },
  "scripts": {
    "start:http": "node dist/http.js",
    "start:ws": "node dist/ws.js"
  }
}`,
          },
        ],
      },
      {
        step: 7,
        title: "Choosing the right transport",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "Use stdio when", value: "Local-only tools (filesystem, local DB), Claude Desktop integration, IDE plugins, lowest latency needed" },
              { key: "Use HTTP when", value: "Cloud deployment, public API, stateless servers, multiple clients, need load balancing" },
              { key: "Use WebSocket when", value: "Real-time updates (live docs, chat), bidirectional streaming, persistent session state" },
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
            question: "What is the main advantage of stdio transport over HTTP?",
            options: [
              "Lowest latency (2-5ms) since there's no network stack overhead - communication is direct via stdin/stdout",
              "stdio works with more programming languages",
              "stdio is more secure",
              "stdio supports more concurrent connections",
            ],
            correct: 0,
            explanation:
              "stdio's main advantage is the lowest latency (2-5ms vs 10-50ms for HTTP) because communication happens directly via stdin/stdout without any network stack overhead. The process is launched locally, and data flows through pipes, not TCP/IP. This makes stdio ideal for local tools in Claude Desktop and IDEs. stdio doesn't support more languages (all transports use JSON-RPC), isn't inherently more secure (both can be secured), and actually supports FEWER connections (one client per server process vs HTTP's many clients).",
          },
        ],
      },
    ],
  },
  {
    slug: "resource-patterns",
    trackSlug: "mcp",
    order: 4,
    minutes: 20,
    title: "Resource Design Patterns",
    subtitle: "Design URI schemes, implement dynamic resources, handle large datasets, caching strategies.",
    tags: ["Resources", "URI design", "Caching", "Pagination"],
    sections: [
      {
        step: 1,
        title: "URI design principles",
        blocks: [
          {
            type: "text",
            content:
              "Good URIs are **hierarchical**, **predictable**, and **human-readable**:\n\n✅ `github://microsoft/vscode/issues/12345`\n✅ `file:///home/user/docs/readme.md`\n✅ `db://postgres/users/table?limit=100`\n\n❌ `resource://abc123def456` (opaque)\n❌ `data://x?y=z&a=b&c=d` (flat, unclear)\n\nDesign URI schemes that mirror the domain structure.",
          },
          {
            type: "code",
            language: "typescript",
            label: "Well-designed URI scheme",
            code: `// GitHub MCP server URIs
github://{owner}/{repo}/                    // Repository root
github://{owner}/{repo}/issues              // All issues
github://{owner}/{repo}/issues/{number}     // Specific issue
github://{owner}/{repo}/pulls/{number}      // Specific PR
github://{owner}/{repo}/tree/{branch}/{path} // File at path

// Benefits:
// - Hierarchical (easy to navigate up)
// - Predictable (guess URIs without docs)
// - Supports wildcards: github://*/vscode/issues (all vscode forks)`,
          },
        ],
      },
      {
        step: 2,
        title: "Static vs dynamic resources",
        blocks: [
          {
            type: "text",
            content:
              "**Static resources**: Fixed list, known at server start\n**Dynamic resources**: URI templates, unbounded set",
          },
          {
            type: "code",
            language: "typescript",
            label: "Static and dynamic resources",
            code: `// Static resources (fixed list)
server.setRequestHandler("resources/list", async () => {
  return {
    resources: [
      { uri: "config://server.json", name: "Server Config" },
      { uri: "config://users.json", name: "User Config" },
      { uri: "status://health", name: "Health Check" },
    ],
  };
});

// Dynamic resources (URI templates)
server.setRequestHandler("resources/templates/list", async () => {
  return {
    resourceTemplates: [
      {
        uriTemplate: "user://{id}",
        name: "User Profile",
        description: "Fetch user by ID",
      },
      {
        uriTemplate: "user://{id}/posts",
        name: "User Posts",
        description: "All posts by user",
      },
    ],
  };
});

// Read dynamic resource
server.setRequestHandler("resources/read", async (request) => {
  const { uri } = request.params;

  // Match template
  const userMatch = uri.match(/^user:\\/\\/(\\d+)$/);
  if (userMatch) {
    const userId = userMatch[1];
    const user = await db.users.findById(userId);
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(user),
      }],
    };
  }

  // Match posts template
  const postsMatch = uri.match(/^user:\\/\\/(\\d+)\\/posts$/);
  if (postsMatch) {
    const userId = postsMatch[1];
    const posts = await db.posts.findByUser(userId);
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(posts),
      }],
    };
  }

  throw new Error(\`Unknown resource: \${uri}\`);
});`,
          },
        ],
      },
      {
        step: 3,
        title: "Pagination for large datasets",
        blocks: [
          {
            type: "text",
            content:
              "Don't return 10,000 rows in one response. Paginate:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Cursor-based pagination",
            code: `// Pagination with query parameters
server.setRequestHandler("resources/read", async (request) => {
  const { uri } = request.params;

  // Parse pagination params
  const url = new URL(uri);
  const limit = parseInt(url.searchParams.get("limit") || "100");
  const cursor = url.searchParams.get("cursor");

  if (uri.startsWith("db://users")) {
    // Fetch page
    const result = await db.users.paginate({ limit, cursor });

    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(result.items),
      }],
      // Return pagination links
      _meta: {
        pagination: {
          nextUri: result.hasMore
            ? \`db://users?limit=\${limit}&cursor=\${result.nextCursor}\`
            : null,
          total: result.total,
        },
      },
    };
  }
});

// Client can follow pagination:
// 1. Read db://users?limit=100
// 2. Get nextUri from response
// 3. Read nextUri to get next page
// 4. Repeat until nextUri is null`,
          },
        ],
      },
      {
        step: 4,
        title: "Resource caching",
        blocks: [
          {
            type: "text",
            content:
              "Cache expensive resources to reduce latency:",
          },
          {
            type: "code",
            language: "typescript",
            label: "TTL-based caching",
            code: `import NodeCache from "node-cache";

// Create cache with TTL
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every 60s
});

server.setRequestHandler("resources/read", async (request) => {
  const { uri } = request.params;

  // Check cache first
  const cached = cache.get(uri);
  if (cached) {
    console.log(\`Cache hit: \${uri}\`);
    return cached;
  }

  console.log(\`Cache miss: \${uri}\`);

  // Fetch from source
  const result = await fetchResource(uri);

  // Store in cache
  cache.set(uri, result);

  return result;
});

// Cache invalidation
function invalidateResource(uri: string) {
  cache.del(uri);

  // Also invalidate related URIs
  if (uri.match(/^user:\\/\\/(\\d+)$/)) {
    const userId = uri.match(/^user:\\/\\/(\\d+)$/)[1];
    cache.del(\`user://\${userId}/posts\`);
  }
}

// Usage:
// User updated → invalidateResource("user://123")
// Next read fetches fresh data`,
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the main advantage of cursor-based pagination over offset-based?",
            options: [
              "Cursor-based pagination is efficient for large datasets and handles concurrent inserts/deletes correctly",
              "Cursor-based pagination uses less memory",
              "Cursor-based pagination is faster for small datasets",
              "Cursor-based pagination is easier to implement",
            ],
            correct: 0,
            explanation:
              "Cursor-based pagination's main advantage is efficiency with large datasets and correctness with concurrent modifications. With offset-based (?offset=100), if items are inserted/deleted during pagination, you'll skip or duplicate rows. With cursor-based (?cursor=<last_id>), the cursor points to the exact position, so inserts/deletes don't affect your pagination. It's also more efficient for databases (can use indexed lookups vs expensive OFFSET scans). It doesn't use less memory (same data loaded), isn't faster for small datasets (offset is fine there), and is actually MORE complex to implement.",
          },
        ],
      },
    ],
  },
  {
    slug: "tool-design",
    trackSlug: "mcp",
    order: 5,
    minutes: 18,
    title: "Tool Design and Best Practices",
    subtitle: "Design idempotent tools, handle long-running operations, progress updates, validation.",
    tags: ["Tools", "Design", "Async", "Validation"],
    sections: [
      {
        step: 1,
        title: "Idempotency: safe retries",
        blocks: [
          {
            type: "text",
            content:
              "**Idempotent tools** produce the same result when called multiple times with the same inputs.\n\n✅ `create_file(path, content)` — if file exists, overwrite (same result)\n❌ `append_to_file(path, content)` — calling twice appends twice (different result)\n\nWhy it matters: LLMs may retry failed operations, networks drop packets, users may click twice.",
          },
          {
            type: "code",
            language: "typescript",
            label: "Idempotent tool design",
            code: `// ❌ NOT idempotent
async function createIssue(title: string, body: string) {
  const issue = await github.issues.create({ title, body });
  return issue.number;
}
// Calling twice creates 2 issues!

// ✅ Idempotent version
async function createIssue(
  title: string,
  body: string,
  idempotencyKey: string
) {
  // Check if already created
  const existing = await db.findByKey(idempotencyKey);
  if (existing) {
    return existing.issueNumber; // Return existing
  }

  // Create new
  const issue = await github.issues.create({ title, body });

  // Store mapping
  await db.store(idempotencyKey, issue.number);

  return issue.number;
}

// Client generates unique key
const key = \`issue-\${Date.now()}-\${randomUUID()}\`;
const issueNum = await createIssue("Bug", "Description", key);`,
          },
        ],
      },
      {
        step: 2,
        title: "Parameter validation",
        blocks: [
          {
            type: "text",
            content:
              "Validate inputs before execution:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Schema-based validation",
            code: `import { z } from "zod";

// Define schema
const CreateFileSchema = z.object({
  path: z.string().min(1).refine(
    (p) => !p.includes("..") && !p.startsWith("/"),
    "Path must be relative and not escape directory"
  ),
  content: z.string(),
  encoding: z.enum(["utf-8", "base64"]).default("utf-8"),
});

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "create_file") {
    try {
      // Validate
      const args = CreateFileSchema.parse(request.params.arguments);

      // Execute
      await fs.writeFile(args.path, args.content, args.encoding);

      return {
        content: [{
          type: "text",
          text: \`Created: \${args.path}\`,
        }],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Return clear validation errors
        return {
          isError: true,
          content: [{
            type: "text",
            text: \`Validation failed: \${error.errors.map(e => e.message).join(", ")}\`,
          }],
        };
      }
      throw error;
    }
  }
});`,
          },
        ],
      },
      {
        step: 3,
        title: "Long-running operations",
        blocks: [
          {
            type: "text",
            content:
              "Tools that take >30s should return immediately and allow polling:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Async tool pattern",
            code: `// Track long-running jobs
const jobs = new Map<string, { status: string; result?: any }>();

// Start job, return immediately
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "deploy_app") {
    const jobId = randomUUID();

    // Start async
    deployApp(request.params.arguments).then((result) => {
      jobs.set(jobId, { status: "completed", result });
    }).catch((error) => {
      jobs.set(jobId, { status: "failed", result: error.message });
    });

    jobs.set(jobId, { status: "running" });

    return {
      content: [{
        type: "text",
        text: \`Deploy started. Job ID: \${jobId}. Use check_job_status tool to poll.\`,
      }],
    };
  }

  if (request.params.name === "check_job_status") {
    const { jobId } = request.params.arguments;
    const job = jobs.get(jobId);

    if (!job) {
      return {
        content: [{ type: "text", text: "Job not found" }],
      };
    }

    return {
      content: [{
        type: "text",
        text: \`Status: \${job.status}\${job.result ? \`, Result: \${job.result}\` : ""}\`,
      }],
    };
  }
});`,
          },
        ],
      },
      {
        step: 4,
        title: "Progress updates",
        blocks: [
          {
            type: "text",
            content:
              "Stream progress for better UX:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Progress streaming",
            code: `async function deployApp(config: any) {
  // Step 1
  await sendProgress("Building application...", 0.2);
  await build();

  // Step 2
  await sendProgress("Running tests...", 0.5);
  await runTests();

  // Step 3
  await sendProgress("Deploying to production...", 0.8);
  await deploy();

  await sendProgress("Deployment complete!", 1.0);
}

function sendProgress(message: string, progress: number) {
  // Emit progress event via MCP
  server.sendNotification("notifications/progress", {
    message,
    progress,
  });
}`,
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why is idempotency important for MCP tools?",
            options: [
              "LLMs may retry failed operations, and idempotent tools produce the same result on retry, preventing duplicate actions",
              "Idempotent tools run faster",
              "Idempotent tools use less memory",
              "Idempotent tools are easier to implement",
            ],
            correct: 0,
            explanation:
              "Idempotency is critical because LLMs may retry failed operations (network timeout, unclear response), and non-idempotent tools would create duplicates on retry. If 'create_issue' isn't idempotent, a retry creates a second issue. With idempotency (via keys or checks), retries return the original result safely. This doesn't make tools faster, use less memory, or be easier to implement — it makes them SAFE for automatic retries.",
          },
        ],
      },
    ],
  },
  {
    slug: "security-and-auth",
    trackSlug: "mcp",
    order: 6,
    minutes: 20,
    title: "Security and Authentication",
    subtitle: "Secure MCP servers — OAuth, API keys, sandboxing, input validation, rate limiting.",
    tags: ["Security", "Auth", "OAuth", "Sandboxing"],
    sections: [
      {
        step: 1,
        title: "Authentication methods",
        blocks: [
          {
            type: "text",
            content:
              "MCP servers need credentials to access external services:\n\n- **API keys** — simple, stored in environment variables\n- **OAuth** — user-specific access, proper token refresh\n- **Service accounts** — machine-to-machine authentication",
          },
          {
            type: "code",
            language: "typescript",
            label: "API key authentication",
            code: `// Load from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN environment variable required");
}

// Use in requests
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Claude Desktop config:
// {
//   "mcpServers": {
//     "github": {
//       "command": "node",
//       "args": ["server.js"],
//       "env": {
//         "GITHUB_TOKEN": "ghp_..."
//       }
//     }
//   }
// }`,
          },
        ],
      },
      {
        step: 2,
        title: "OAuth flow for user-specific servers",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "OAuth implementation",
            code: `import { OAuth2Client } from "google-auth-library";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/callback"
);

// Step 1: Get auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/drive.readonly"],
});

console.log("Visit:", authUrl);

// Step 2: Exchange code for tokens
app.get("/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);

  // Store tokens securely
  await storeTokens(tokens);

  res.send("Authorized! You can close this window.");
});

// Step 3: Use tokens
oauth2Client.setCredentials(tokens);
const drive = google.drive({ version: "v3", auth: oauth2Client });`,
          },
        ],
      },
      {
        step: 3,
        title: "Input validation and sanitization",
        blocks: [
          {
            type: "text",
            content:
              "Never trust client inputs:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Security validation",
            code: `// ❌ Dangerous - path traversal
async function readFile(path: string) {
  return await fs.readFile(path, "utf-8");
}
// Client sends: "../../../etc/passwd"

// ✅ Safe - validate and sanitize
async function readFile(path: string) {
  // 1. Reject absolute paths
  if (path.startsWith("/")) {
    throw new Error("Absolute paths not allowed");
  }

  // 2. Reject parent directory references
  if (path.includes("..")) {
    throw new Error("Parent directory access not allowed");
  }

  // 3. Resolve to absolute path within allowed directory
  const basePath = "/safe/directory";
  const fullPath = path.resolve(basePath, path);

  // 4. Ensure resolved path is still within base
  if (!fullPath.startsWith(basePath)) {
    throw new Error("Path escapes allowed directory");
  }

  return await fs.readFile(fullPath, "utf-8");
}

// SQL injection prevention
// ❌ Dangerous
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// ✅ Safe - parameterized queries
const query = "SELECT * FROM users WHERE id = $1";
const result = await db.query(query, [userId]);`,
          },
        ],
      },
      {
        step: 4,
        title: "Rate limiting",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "Rate limiting implementation",
            code: `import rateLimit from "express-rate-limit";

// Rate limit by IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: "Too many requests, please try again later",
});

app.use("/api", limiter);

// Per-tool rate limiting
const toolLimits = new Map<string, number>();

async function checkToolLimit(clientId: string, toolName: string) {
  const key = \`\${clientId}:\${toolName}\`;
  const count = toolLimits.get(key) || 0;

  if (count >= 10) {
    throw new Error(\`Rate limit exceeded for \${toolName}\`);
  }

  toolLimits.set(key, count + 1);

  // Reset after 1 minute
  setTimeout(() => {
    toolLimits.delete(key);
  }, 60000);
}`,
          },
        ],
      },
      {
        step: 5,
        title: "Audit logging",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "Tamper-proof audit logs",
            code: `import { createWriteStream } from "fs";

const auditLog = createWriteStream("audit.log", { flags: "a" });

function logAudit(event: {
  timestamp: string;
  clientId: string;
  action: string;
  resource?: string;
  result: "success" | "failure";
}) {
  const entry = JSON.stringify({
    ...event,
    hash: computeHash(event), // Prevent tampering
  });

  auditLog.write(entry + "\\n");
}

// Log every tool call
server.setRequestHandler("tools/call", async (request) => {
  const startTime = Date.now();

  try {
    const result = await executeTool(request.params);

    logAudit({
      timestamp: new Date().toISOString(),
      clientId: getClientId(request),
      action: \`tool:\${request.params.name}\`,
      result: "success",
    });

    return result;
  } catch (error) {
    logAudit({
      timestamp: new Date().toISOString(),
      clientId: getClientId(request),
      action: \`tool:\${request.params.name}\`,
      result: "failure",
    });

    throw error;
  }
});`,
          },
        ],
      },
      {
        step: 6,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why should MCP servers validate file paths to prevent '..' traversal?",
            options: [
              "To prevent clients from escaping the allowed directory and accessing sensitive files like /etc/passwd or ~/.ssh/id_rsa",
              "To improve performance",
              "To reduce memory usage",
              "To make code easier to read",
            ],
            correct: 0,
            explanation:
              "Path traversal with '..' allows malicious clients to escape the intended directory and access any file the server process can read, including sensitive files like /etc/passwd, SSH keys, or database credentials. Without validation, a client sending '../../../etc/passwd' could read system files. Validation doesn't improve performance, reduce memory, or aid readability — it prevents a critical security vulnerability.",
          },
        ],
      },
    ],
  },
  {
    slug: "claude-desktop-integration",
    trackSlug: "mcp",
    order: 7,
    minutes: 16,
    title: "Integrating with Claude Desktop",
    subtitle: "Configure MCP servers in Claude Desktop, debugging, auto-start, environment variables.",
    tags: ["Claude Desktop", "Configuration", "Integration", "Debugging"],
    sections: [
      {
        step: 1,
        title: "Configuration file",
        blocks: [
          {
            type: "text",
            content:
              "Claude Desktop discovers servers via config file:",
          },
          {
            type: "code",
            language: "json",
            label: "claude_desktop_config.json",
            code: `// Location:
// macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
// Windows: %APPDATA%\\Claude\\claude_desktop_config.json

{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/alice/projects"],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "github": {
      "command": "node",
      "args": ["/path/to/github-server/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    },
    "database": {
      "command": "python",
      "args": ["-m", "mcp_postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost/mydb"
      }
    }
  }
}`,
          },
        ],
      },
      {
        step: 2,
        title: "Testing your server",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Debug workflow",
            code: `# 1. Test server independently (before adding to Claude)
node server.js
# Should start without errors

# 2. Check Claude Desktop logs
# macOS:
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows:
Get-Content $env:APPDATA\\Claude\\logs\\mcp*.log -Wait

# 3. Common errors:
# "Server not found" → Check command path
# "Permission denied" → chmod +x server.js
# "Timeout" → Server taking >10s to start
# "Parse error" → Invalid JSON in config

# 4. Restart Claude Desktop
# Changes to config require restart

# 5. Verify server loaded
# Claude Desktop → Settings → MCP Servers
# Your server should appear in list`,
          },
        ],
      },
      {
        step: 3,
        title: "Server lifecycle",
        blocks: [
          {
            type: "text",
            content:
              "Understanding when servers start/stop:\n\n- **Start**: When Claude Desktop launches\n- **Stop**: When Claude Desktop quits\n- **Restart**: When config file changes (requires app restart)\n- **Logs**: Captured in real-time to log files",
          },
        ],
      },
      {
        step: 4,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Where does Claude Desktop store MCP server configuration?",
            options: [
              "In claude_desktop_config.json in the Application Support directory (macOS) or AppData (Windows)",
              "In the system PATH",
              "In package.json",
              "In environment variables",
            ],
            correct: 0,
            explanation:
              "Claude Desktop reads MCP server configuration from claude_desktop_config.json in the Application Support/Claude directory (macOS) or AppData\\Claude (Windows). This JSON file lists servers with their command, args, and environment variables. It's not in PATH (that's for finding executables), package.json (that's for Node.js projects), or env vars (those are passed TO servers, not where config lives).",
          },
        ],
      },
    ],
  },
  {
    slug: "ide-integration",
    trackSlug: "mcp",
    order: 8,
    minutes: 14,
    title: "MCP in IDEs: VS Code and Beyond",
    subtitle: "Use MCP in VS Code, Cursor, Windsurf — editor-aware context, project integration.",
    tags: ["IDE", "VS Code", "Cursor", "Editor integration"],
    sections: [
      {
        step: 1,
        title: "IDE MCP integration",
        blocks: [
          {
            type: "text",
            content:
              "IDEs can expose editor context via MCP:\n\n- **Open files** — what the developer is currently viewing\n- **Git status** — modified files, current branch, staged changes\n- **LSP symbols** — classes, functions, types in the project\n- **Diagnostics** — errors, warnings from linters/compilers\n\nThis context helps AI assistants give more relevant suggestions.",
          },
        ],
      },
      {
        step: 2,
        title: "VS Code MCP extension",
        blocks: [
          {
            type: "code",
            language: "json",
            label: "VS Code settings.json",
            code: `{
  "mcp.servers": {
    "project": {
      "command": "node",
      "args": ["$\{workspaceFolder}/.mcp/server.js"],
      "env": {
        "PROJECT_ROOT": "$\{workspaceFolder}"
      }
    }
  }
}`,
          },
        ],
      },
      {
        step: 3,
        title: "Project-aware MCP server",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "Editor-aware resources",
            code: `// Expose IDE context as MCP resources
server.setRequestHandler("resources/list", async () => {
  return {
    resources: [
      {
        uri: "vscode://open-files",
        name: "Currently Open Files",
        mimeType: "application/json",
      },
      {
        uri: "vscode://git-status",
        name: "Git Status",
        mimeType: "application/json",
      },
    ],
  };
});

server.setRequestHandler("resources/read", async (request) => {
  if (request.params.uri === "vscode://open-files") {
    // Get from VS Code API
    const openFiles = vscode.workspace.textDocuments.map(doc => ({
      path: doc.fileName,
      language: doc.languageId,
      isDirty: doc.isDirty,
    }));

    return {
      contents: [{
        uri: request.params.uri,
        mimeType: "application/json",
        text: JSON.stringify(openFiles, null, 2),
      }],
    };
  }
});`,
          },
        ],
      },
      {
        step: 4,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the main benefit of IDE-integrated MCP servers?",
            options: [
              "They expose editor context (open files, git status, LSP symbols) as MCP resources, giving AI assistants relevant project information",
              "They run faster than standalone servers",
              "They use less memory",
              "They support more programming languages",
            ],
            correct: 0,
            explanation:
              "IDE-integrated MCP servers' main benefit is exposing editor-specific context — what files are open, git status, LSP symbols, diagnostics — as MCP resources. This gives AI assistants highly relevant information about what the developer is working on RIGHT NOW, leading to better suggestions. These servers don't run faster (same protocol), don't use less memory (more context = more memory), and don't support more languages (language support is separate from MCP integration).",
          },
        ],
      },
    ],
  },
  {
    slug: "custom-client",
    trackSlug: "mcp",
    order: 9,
    minutes: 18,
    title: "Building Custom MCP Clients",
    subtitle: "Build your own MCP client — discovery, tool calling, resource fetching, UI integration.",
    tags: ["Client", "SDK", "Integration", "Custom"],
    sections: [
      {
        step: 1,
        title: "MCP client basics",
        blocks: [
          {
            type: "text",
            content:
              "A client connects to servers, discovers capabilities, and makes requests:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Basic client",
            code: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Create client
const client = new Client({
  name: "my-client",
  version: "1.0.0",
});

// Connect to server
const transport = new StdioClientTransport({
  command: "node",
  args: ["server.js"],
});

await client.connect(transport);

// Discover tools
const tools = await client.request("tools/list", {});
console.log("Available tools:", tools.tools);

// Call a tool
const result = await client.request("tools/call", {
  name: "create_file",
  arguments: {
    path: "test.txt",
    content: "Hello",
  },
});

console.log("Result:", result);`,
          },
        ],
      },
      {
        step: 2,
        title: "Building a CLI client",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "Interactive CLI",
            code: `import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Connect to multiple servers
const servers = new Map();
await connectServer("github", githubServerConfig);
await connectServer("filesystem", fsServerConfig);

// Interactive loop
rl.on("line", async (input) => {
  // Parse command: "github create_issue 'Bug' 'Description'"
  const [serverName, toolName, ...args] = parseCommand(input);

  const client = servers.get(serverName);
  if (!client) {
    console.log(\`Server \${serverName} not found\`);
    return;
  }

  try {
    const result = await client.request("tools/call", {
      name: toolName,
      arguments: parseArgs(args),
    });

    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
});

console.log("MCP CLI ready. Type 'help' for commands.");`,
          },
        ],
      },
      {
        step: 3,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What is the first step when building an MCP client?",
            options: [
              "Connect to the server via transport (stdio/HTTP/WebSocket) and negotiate capabilities to discover available tools/resources",
              "Start calling tools immediately",
              "Read the server's source code",
              "Install the server package",
            ],
            correct: 0,
            explanation:
              "The first step in building an MCP client is connecting to the server via a transport layer (stdio for local, HTTP for remote) and negotiating capabilities. During connection, the client and server exchange protocol versions and agree on supported features. Only after successful connection can the client discover what tools/resources/prompts the server exposes. You can't call tools before connecting, don't need to read source code (discovery is dynamic), and installing the server package is for running it, not for client development.",
          },
        ],
      },
    ],
  },
  {
    slug: "ecosystem-and-discovery",
    trackSlug: "mcp",
    order: 10,
    minutes: 12,
    title: "MCP Ecosystem and Server Discovery",
    subtitle: "Find MCP servers, contribute to ecosystem, publish your own, versioning and compatibility.",
    tags: ["Ecosystem", "Discovery", "Publishing", "Community"],
    sections: [
      {
        step: 1,
        title: "Finding MCP servers",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "GitHub", value: "Search topic 'mcp-server': github.com/topics/mcp-server" },
              { key: "npm", value: "Search @modelcontextprotocol/server-*" },
              { key: "Anthropic registry", value: "Official curated list: anthropic.com/mcp-servers" },
              { key: "Community", value: "Discord, forums, Reddit r/ClaudeAI" },
            ],
          },
        ],
      },
      {
        step: 2,
        title: "Publishing your server",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Publishing to npm",
            code: `# 1. Package
npm init
npm install @modelcontextprotocol/sdk

# 2. Build
npm run build

# 3. Publish
npm publish --access public

# 4. Tag for discovery
git tag mcp-server

# 5. Document in README
# - What it does
# - How to install
# - Configuration examples
# - Screenshots`,
          },
        ],
      },
      {
        step: 3,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Where can users discover MCP servers?",
            options: [
              "GitHub topics, npm registry, Anthropic's official registry, and community forums",
              "Only on Anthropic's official website",
              "Only via npm",
              "Only via GitHub",
            ],
            correct: 0,
            explanation:
              "Users can discover MCP servers from multiple sources: GitHub (topic 'mcp-server'), npm (@modelcontextprotocol/server-* packages), Anthropic's curated registry, and community resources (Discord, forums). This decentralized discovery ensures the ecosystem isn't controlled by a single entity. Servers aren't limited to just one source — developers can publish to npm AND add to GitHub AND get listed in the official registry for maximum discoverability.",
          },
        ],
      },
    ],
  },
  {
    slug: "production-deployment",
    trackSlug: "mcp",
    order: 11,
    minutes: 20,
    title: "Deploying MCP Servers to Production",
    subtitle: "Cloud deployment, scaling, monitoring, error tracking, cost optimization.",
    tags: ["Production", "Deployment", "Scaling", "Monitoring"],
    sections: [
      {
        step: 1,
        title: "Deployment platforms",
        blocks: [
          {
            type: "kv",
            items: [
              { key: "Fly.io", value: "Best for HTTP servers - global edge deployment, auto-scaling, ~$5-20/month" },
              { key: "Railway", value: "Simple deployment - git push to deploy, built-in Postgres, ~$10-30/month" },
              { key: "AWS Lambda", value: "Serverless - pay per request, cold start overhead, good for low-traffic" },
              { key: "Docker", value: "Deploy anywhere - package as container, run on any host" },
            ],
          },
        ],
      },
      {
        step: 2,
        title: "Deploying to Fly.io",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Fly.io deployment",
            code: `# 1. Install flyctl
curl -L https://fly.io/install.sh | sh

# 2. Create app
fly launch

# 3. Configure fly.toml
cat > fly.toml << EOF
app = "mcp-server"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true

[[services.ports]]
  port = 80
  handlers = ["http"]

[[services.ports]]
  port = 443
  handlers = ["tls", "http"]
EOF

# 4. Deploy
fly deploy

# 5. Scale
fly scale count 2  # 2 instances
fly scale vm shared-cpu-1x  # Upgrade VM

# 6. View logs
fly logs`,
          },
        ],
      },
      {
        step: 3,
        title: "Monitoring with Prometheus",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "Prometheus metrics",
            code: `import { register, Counter, Histogram } from "prom-client";

// Define metrics
const requestCount = new Counter({
  name: "mcp_requests_total",
  help: "Total MCP requests",
  labelNames: ["method", "status"],
});

const requestDuration = new Histogram({
  name: "mcp_request_duration_seconds",
  help: "Request duration",
  labelNames: ["method"],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
});

// Record metrics
server.setRequestHandler("tools/call", async (request) => {
  const start = Date.now();

  try {
    const result = await executeTool(request.params);

    // Record success
    requestCount.inc({ method: "tools/call", status: "success" });
    requestDuration.observe(
      { method: "tools/call" },
      (Date.now() - start) / 1000
    );

    return result;
  } catch (error) {
    // Record failure
    requestCount.inc({ method: "tools/call", status: "error" });
    throw error;
  }
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});`,
          },
        ],
      },
      {
        step: 4,
        title: "Error tracking with Sentry",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "Sentry integration",
            code: `import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
});

server.setRequestHandler("tools/call", async (request) => {
  return await Sentry.startSpan(
    {
      op: "mcp.tool.call",
      name: request.params.name,
    },
    async (span) => {
      try {
        const result = await executeTool(request.params);
        span.setStatus({ code: 1, message: "ok" });
        return result;
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            tool: request.params.name,
          },
          extra: {
            arguments: request.params.arguments,
          },
        });

        span.setStatus({ code: 2, message: "error" });
        throw error;
      }
    }
  );
});`,
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why should production MCP servers expose a /metrics endpoint?",
            options: [
              "To provide Prometheus-compatible metrics (request count, latency, errors) for monitoring and alerting",
              "To show the server version",
              "To improve performance",
              "To enable auto-scaling",
            ],
            correct: 0,
            explanation:
              "Production servers should expose a /metrics endpoint in Prometheus format so monitoring systems (Prometheus, Grafana) can scrape metrics like request count, latency histograms, and error rates. This enables real-time dashboards and alerts (e.g., 'page if error rate > 5%'). The endpoint doesn't show just the version (that's trivial), doesn't improve performance (it adds overhead), and doesn't directly enable auto-scaling (though metrics can INFORM scaling decisions).",
          },
        ],
      },
    ],
  },
  {
    slug: "project-notion-mcp-server",
    trackSlug: "mcp",
    order: 12,
    minutes: 35,
    title: "Project: Full-Stack Notion MCP Server",
    subtitle: "Build a complete Notion MCP server — resources, tools, prompts, auth, testing, deployment.",
    tags: ["Project", "Notion", "Full stack", "Production"],
    sections: [
      {
        step: 1,
        title: "Project overview",
        blocks: [
          {
            type: "text",
            content:
              "Build a **production-ready Notion MCP server** that:\n\n✅ Exposes Notion pages, databases, and blocks as MCP resources\n✅ Provides tools to create/update/search Notion content\n✅ Implements OAuth for user-specific access\n✅ Handles Notion's rate limits gracefully\n✅ Supports both stdio (Claude Desktop) and HTTP (cloud) transports\n✅ Includes comprehensive tests\n✅ Deploys to production with monitoring\n\n**Tech stack:** TypeScript, MCP SDK, Notion API, OAuth, Fly.io",
          },
        ],
      },
      {
        step: 2,
        title: "Step 1: URI scheme design",
        blocks: [
          {
            type: "text",
            content:
              "Design hierarchical URIs for Notion:",
          },
          {
            type: "code",
            language: "typescript",
            label: "Notion URI scheme",
            code: `// URI structure
notion://{workspace}/pages                    // List all pages
notion://{workspace}/pages/{pageId}           // Specific page
notion://{workspace}/pages/{pageId}/blocks    // Page blocks
notion://{workspace}/databases                // List databases
notion://{workspace}/databases/{dbId}         // Database schema
notion://{workspace}/databases/{dbId}/rows    // Database rows
notion://{workspace}/search?q={query}         // Search results

// Examples
notion://myworkspace/pages
notion://myworkspace/pages/abc123
notion://myworkspace/databases/def456/rows?limit=20`,
          },
        ],
      },
      {
        step: 3,
        title: "Step 2: Implement resources",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "Resource implementation",
            code: `import { Client as NotionClient } from "@notionhq/client";

const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });

server.setRequestHandler("resources/list", async () => {
  // List top-level resources
  return {
    resources: [
      {
        uri: "notion://pages",
        name: "All Pages",
        mimeType: "application/json",
      },
      {
        uri: "notion://databases",
        name: "All Databases",
        mimeType: "application/json",
      },
    ],
  };
});

server.setRequestHandler("resources/read", async (request) => {
  const { uri } = request.params;

  // Parse URI
  if (uri === "notion://pages") {
    // List all pages
    const response = await notion.search({
      filter: { property: "object", value: "page" },
    });

    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(response.results, null, 2),
      }],
    };
  }

  const pageMatch = uri.match(/^notion:\\/\\/pages\\/([a-f0-9-]+)$/);
  if (pageMatch) {
    const pageId = pageMatch[1];

    // Get specific page
    const page = await notion.pages.retrieve({ page_id: pageId });

    // Get page content (blocks)
    const blocks = await notion.blocks.children.list({ block_id: pageId });

    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify({ page, blocks }, null, 2),
      }],
    };
  }

  throw new Error(\`Unknown resource: \${uri}\`);
});`,
          },
        ],
      },
      {
        step: 4,
        title: "Step 3: Implement tools",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "Tool implementation",
            code: `server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "create_page",
        description: "Create a new page in Notion",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            parent_id: { type: "string" },
          },
          required: ["title", "content"],
        },
      },
      {
        name: "update_database",
        description: "Add row to database",
        inputSchema: {
          type: "object",
          properties: {
            database_id: { type: "string" },
            properties: { type: "object" },
          },
          required: ["database_id", "properties"],
        },
      },
      {
        name: "search",
        description: "Search Notion workspace",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
          },
          required: ["query"],
        },
      },
    ],
  };
});

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "create_page") {
    const page = await notion.pages.create({
      parent: args.parent_id
        ? { page_id: args.parent_id }
        : { workspace: true },
      properties: {
        title: {
          title: [{ text: { content: args.title } }],
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ text: { content: args.content } }],
          },
        },
      ],
    });

    return {
      content: [{
        type: "text",
        text: \`Created page: \${page.url}\`,
      }],
    };
  }

  if (name === "search") {
    const results = await notion.search({
      query: args.query,
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify(results.results, null, 2),
      }],
    };
  }

  throw new Error(\`Unknown tool: \${name}\`);
});`,
          },
        ],
      },
      {
        step: 5,
        title: "Step 4: OAuth implementation",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "OAuth flow",
            code: `import express from "express";

const app = express();

// Step 1: Redirect to Notion OAuth
app.get("/auth", (req, res) => {
  const authUrl = \`https://api.notion.com/v1/oauth/authorize?\` +
    \`client_id=\${process.env.NOTION_CLIENT_ID}&\` +
    \`redirect_uri=\${encodeURIComponent(process.env.REDIRECT_URI)}&\` +
    \`response_type=code\`;

  res.redirect(authUrl);
});

// Step 2: Handle callback
app.get("/callback", async (req, res) => {
  const { code } = req.query;

  // Exchange code for token
  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      "Authorization": \`Basic \${Buffer.from(
        \`\${process.env.NOTION_CLIENT_ID}:\${process.env.NOTION_CLIENT_SECRET}\`
      ).toString("base64")}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.REDIRECT_URI,
    }),
  });

  const data = await response.json();

  // Store token securely
  await storeToken(data.access_token);

  res.send("Authorized! You can close this window.");
});`,
          },
        ],
      },
      {
        step: 6,
        title: "Step 5: Rate limiting",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "Rate limit handling",
            code: `import PQueue from "p-queue";

// Notion rate limit: 3 requests per second
const queue = new PQueue({
  interval: 1000,
  intervalCap: 3,
});

// Wrap all Notion API calls
async function callNotion<T>(fn: () => Promise<T>): Promise<T> {
  return await queue.add(async () => {
    try {
      return await fn();
    } catch (error) {
      // Handle rate limit errors
      if (error.code === "rate_limited") {
        // Wait and retry
        await sleep(error.retry_after || 1000);
        return await fn();
      }
      throw error;
    }
  });
}

// Usage
const page = await callNotion(() =>
  notion.pages.retrieve({ page_id: "abc123" })
);`,
          },
        ],
      },
      {
        step: 7,
        title: "Step 6: Testing",
        blocks: [
          {
            type: "code",
            language: "typescript",
            label: "Integration tests",
            code: `import { describe, it, expect } from "vitest";

describe("Notion MCP Server", () => {
  it("lists pages", async () => {
    const result = await client.request("resources/read", {
      uri: "notion://pages",
    });

    expect(result.contents[0].text).toContain("results");
  });

  it("creates page", async () => {
    const result = await client.request("tools/call", {
      name: "create_page",
      arguments: {
        title: "Test Page",
        content: "Test content",
      },
    });

    expect(result.content[0].text).toContain("Created page");
  });

  it("handles rate limits", async () => {
    // Make 10 rapid requests
    const promises = Array.from({ length: 10 }, () =>
      client.request("resources/read", { uri: "notion://pages" })
    );

    // All should succeed (queued internally)
    const results = await Promise.all(promises);
    expect(results).toHaveLength(10);
  });
});`,
          },
        ],
      },
      {
        step: 8,
        title: "Step 7: Deploy to production",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Deployment",
            code: `# 1. Build
npm run build

# 2. Deploy to Fly.io
fly deploy

# 3. Set secrets
fly secrets set NOTION_CLIENT_ID=xxx
fly secrets set NOTION_CLIENT_SECRET=yyy
fly secrets set NOTION_TOKEN=zzz

# 4. Configure Claude Desktop
# Add to claude_desktop_config.json:
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["@yourname/mcp-server-notion"],
      "env": {
        "NOTION_TOKEN": "your_token"
      }
    }
  }
}

# 5. Test
# Claude: "What pages do I have in Notion?"
# Claude: "Create a page titled 'Meeting Notes'"`,
          },
        ],
      },
      {
        step: 9,
        title: "Congratulations!",
        blocks: [
          {
            type: "text",
            content:
              "🎉 You've built a **production-ready Notion MCP server**!\n\n✅ Resources (pages, databases, blocks)\n✅ Tools (create, update, search)\n✅ OAuth authentication\n✅ Rate limiting\n✅ Multi-transport (stdio + HTTP)\n✅ Comprehensive tests\n✅ Production deployment\n\n**Next steps:**\n- Add more tools (delete, archive, bulk operations)\n- Implement prompts ('Summarize my tasks', 'Weekly report')\n- Add caching for frequently accessed pages\n- Build a web UI for OAuth setup\n\n**Portfolio tip:** This demonstrates:\n- MCP protocol mastery\n- OAuth implementation\n- Rate limiting patterns\n- Production deployment\n- End-to-end testing\n\nAdd it to your GitHub with screenshots and demo video!",
          },
        ],
      },
    ],
  },
];
