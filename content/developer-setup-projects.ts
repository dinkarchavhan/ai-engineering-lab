import type { ProjectGuide } from "@/lib/content";

export const developerSetupProjects: ProjectGuide[] = [
  {
    slug: "local-ai-dev-env",
    trackSlug: "developer-setup",
    title: "Local AI Development Environment (React + FastAPI + Ollama)",
    description:
      "Build a fully containerized local AI chat application from scratch. A React frontend sends messages to a FastAPI backend, which streams token-by-token responses from an Ollama-powered LLM — all running on your machine, no API keys, no cloud costs, no rate limits.",
    techStack: ["React", "TypeScript", "Vite", "FastAPI", "Python", "Ollama", "Docker", "Docker Compose", "Nginx"],
    difficulty: "beginner",
    estimatedHours: 4,
    sections: [
      // ─── Phase 1: What you're building ──────────────────────────────────
      {
        step: 1,
        title: "What you're building",
        blocks: [
          {
            type: "text",
            content:
              "You're going to build a **local AI chat application** that runs entirely on your machine. A **React + Vite** frontend sends messages to a **FastAPI** backend, which proxies them to an **Ollama** server that runs the LLM. **Docker Compose** ties all three services together so the whole stack starts with a single command.",
          },
          {
            type: "diagram",
            chart: `graph LR
    U([Browser :5173]) -->|POST /chat| B[FastAPI Backend :8000]
    B -->|POST /api/generate| O[Ollama :11434]
    O -->|streams tokens| B
    B -->|Server-Sent Events| U
    style U fill:#6366f1,color:#fff,stroke:#4f46e5
    style B fill:#10b981,color:#fff,stroke:#059669
    style O fill:#f59e0b,color:#fff,stroke:#d97706`,
            label: "Request flow — browser → FastAPI → Ollama → streamed back",
          },
          {
            type: "kv",
            items: [
              {
                key: "React + Vite",
                value:
                  "Frontend chat UI. Renders streaming tokens in real time using the Fetch API's ReadableStream.",
              },
              {
                key: "FastAPI",
                value:
                  "Python backend. Validates requests, handles CORS, and proxies the token stream from Ollama back to the browser as Server-Sent Events.",
              },
              {
                key: "Ollama",
                value:
                  "Local LLM runtime. Runs Llama 3.2, Gemma 2, Mistral, Phi-3, and more. Exposes a simple REST API on port 11434.",
              },
              {
                key: "Docker Compose",
                value:
                  "Orchestrates the frontend (Nginx) and backend containers. Ollama runs natively so it can access your GPU without driver passthrough complexity.",
              },
            ],
          },
          {
            type: "callout",
            kind: "insight",
            title: "Why build this?",
            content:
              "This project touches every layer of a real AI product: a UI that streams text, a backend that talks to a model API, and infrastructure that ships as a single artifact. It's the minimal but complete version of what every AI startup is running — and it fits on a laptop.",
          },
        ],
      },

      // ─── Phase 2: Prerequisites ──────────────────────────────────────────
      {
        step: 2,
        title: "Prerequisites",
        blocks: [
          {
            type: "text",
            content:
              "Before you start, make sure the following tools are installed. Each one is covered in the Developer Setup track lessons.",
          },
          {
            type: "list",
            style: "bullet",
            items: [
              "**Docker Desktop v24+** — download from [docker.com/products/docker-desktop](https://docker.com/products/docker-desktop). Docker Compose v2 ships with it (run `docker compose version` to confirm).",
              "**Node.js 20 LTS** — download from [nodejs.org](https://nodejs.org). Used to scaffold and develop the React app.",
              "**Python 3.11 or 3.12** — needed to run FastAPI locally during development (optional if you only use Docker).",
              "**Ollama** — download the native installer from [ollama.com](https://ollama.com). Run it natively so it can reach your GPU without Docker driver complexity.",
              "**VS Code** — with the Python, ESLint, and Prettier extensions installed.",
              "**Git** — to version-control your project from the start.",
            ],
          },
          {
            type: "callout",
            kind: "tip",
            title: "Verify your tools before starting",
            content:
              "Run these one-liners to confirm everything is installed:\n\n`node -v` → should print v20.x.x\n\n`python --version` → should print 3.11.x or 3.12.x\n\n`docker compose version` → should print v2.x.x\n\n`ollama --version` → should print a version number",
          },
          {
            type: "callout",
            kind: "warning",
            title: "Windows users: enable WSL 2",
            content:
              "Docker Desktop on Windows requires WSL 2. Open PowerShell as Administrator and run `wsl --install` if you haven't already. Then open Docker Desktop → Settings → Resources → WSL Integration and enable it for your Linux distro.",
          },
        ],
      },

      // ─── Phase 3: Project structure ──────────────────────────────────────
      {
        step: 3,
        title: "Project structure",
        blocks: [
          {
            type: "text",
            content:
              "Create a root folder called `local-ai-env/`. Inside it you'll have three sub-directories — one per service — plus a `docker-compose.yml` at the root.",
          },
          {
            type: "code",
            language: "bash",
            label: "Create the skeleton (run in your terminal)",
            code: `mkdir local-ai-env
cd local-ai-env
mkdir backend frontend
git init

# Add a root .gitignore
cat > .gitignore << 'EOF'
node_modules/
__pycache__/
*.pyc
.env
.env.local
dist/
EOF`,
          },
          {
            type: "text",
            content: "Your final project tree will look like this:",
          },
          {
            type: "code",
            language: "text",
            label: "Final project layout",
            code: `local-ai-env/
├── docker-compose.yml
├── .env                        # API keys or config — gitignored
├── .gitignore
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        └── index.css`,
          },
        ],
      },

      // ─── Phase 4: Ollama ─────────────────────────────────────────────────
      {
        step: 4,
        title: "Ollama: install and pull your first model",
        blocks: [
          {
            type: "text",
            content:
              "Ollama runs as a local HTTP server on port **11434**. Install it natively (not in Docker), then pull a model — the model weights download once and live on disk at `~/.ollama/models`.",
          },
          {
            type: "code",
            language: "bash",
            label: "Install Ollama",
            code: `# macOS (Homebrew)
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download and run the installer from https://ollama.com`,
          },
          {
            type: "code",
            language: "bash",
            label: "Start the Ollama server and pull a model",
            code: `# Start the Ollama server (runs in the background on port 11434)
ollama serve &

# Pull Llama 3.2 3B — good balance of quality vs speed, ~2 GB download
ollama pull llama3.2

# Verify the model downloaded
ollama list
# NAME              ID              SIZE    MODIFIED
# llama3.2:latest   a80c4f17acd5    2.0 GB  Just now`,
          },
          {
            type: "callout",
            kind: "insight",
            title: "Which model should I use?",
            content:
              "**llama3.2** (3B params) is the best starting point — it fits in ~4 GB RAM, responds in under 2 seconds on a modern CPU, and understands code well. If you have a GPU with 8+ GB VRAM, try **llama3.2:7b** or **gemma2:9b** for noticeably better output quality. Run `ollama list` to see what you've downloaded.",
          },
          {
            type: "text",
            content:
              "**Test Ollama before writing any code.** This confirms the server is running and the model responds correctly.",
          },
          {
            type: "code",
            language: "bash",
            label: "Test Ollama directly via curl",
            code: `curl http://localhost:11434/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{"model":"llama3.2","prompt":"Say hello in one sentence.","stream":false}'

# Expected output (truncated):
# {"model":"llama3.2","response":"Hello! I'm Llama 3.2, a large language...","done":true}`,
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Connection refused?",
            content:
              "If `curl` says `connection refused`, Ollama isn't running yet. Run `ollama serve` in a separate terminal window and try again. On macOS, Ollama also appears in your menu bar after installation — click it and choose \"Start\".",
          },
        ],
      },

      // ─── Phase 5: FastAPI backend ─────────────────────────────────────────
      {
        step: 5,
        title: "FastAPI backend",
        blocks: [
          {
            type: "text",
            content:
              "The backend has one job: receive a chat message from the React frontend, forward it to Ollama, and stream the response back as **Server-Sent Events (SSE)**. This keeps the UI responsive — tokens appear one by one as the model generates them, exactly like ChatGPT.",
          },
          {
            type: "code",
            language: "text",
            label: "backend/requirements.txt",
            code: `fastapi==0.115.0
uvicorn[standard]==0.30.6
httpx==0.27.2
python-dotenv==1.0.1`,
          },
          {
            type: "code",
            language: "python",
            label: "backend/main.py — full source",
            code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import json
import os

app = FastAPI(title="Local AI Backend", version="1.0.0")

# Allow the React dev server and production Nginx to call this API.
# Adjust origins if you deploy somewhere other than localhost.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",          # production (Nginx on port 80)
        "http://localhost:5173",     # Vite dev server
        "http://localhost:3000",
    ],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


class ChatRequest(BaseModel):
    message: str
    model: str = DEFAULT_MODEL


@app.get("/health")
def health():
    """Quick liveness check — useful in Docker Compose health checks."""
    return {"status": "ok", "ollama_url": OLLAMA_URL, "model": DEFAULT_MODEL}


@app.post("/chat")
async def chat(req: ChatRequest):
    """
    Stream an Ollama response back to the browser as Server-Sent Events.

    Each SSE line looks like:
      data: {"token": "Hello", "done": false}
    The final line:
      data: {"token": "", "done": true}
    """

    async def token_stream():
        payload = {
            "model": req.model,
            "prompt": req.message,
            "stream": True,
        }
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream(
                "POST", f"{OLLAMA_URL}/api/generate", json=payload
            ) as resp:
                async for line in resp.aiter_lines():
                    if not line.strip():
                        continue
                    try:
                        data = json.loads(line)
                        token = data.get("response", "")
                        done = data.get("done", False)
                        yield f"data: {json.dumps({'token': token, 'done': done})}\\n\\n"
                        if done:
                            break
                    except json.JSONDecodeError:
                        continue

    return StreamingResponse(
        token_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # disable Nginx buffering for SSE
        },
    )`,
          },
          {
            type: "callout",
            kind: "tip",
            title: "Run the backend locally first — before touching Docker",
            content:
              "Always test each piece in isolation before combining them. Install dependencies and start the server:\n\n`cd backend`\n`pip install -r requirements.txt`\n`uvicorn main:app --reload`\n\nThen open `http://localhost:8000/health` — you should see `{\"status\": \"ok\"}`. If you do, the backend is working.",
          },
          {
            type: "code",
            language: "bash",
            label: "Test the /chat streaming endpoint with curl",
            code: `curl -N -X POST http://localhost:8000/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What is FastAPI in one sentence?"}' \\
  --no-buffer

# You should see lines streaming in like:
# data: {"token":"FastAPI","done":false}
# data: {"token":" is","done":false}
# data: {"token":" a","done":false}
# ...
# data: {"token":"","done":true}`,
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Empty response or timeout from /chat?",
            content:
              "Most likely Ollama isn't reachable. Confirm `curl http://localhost:11434/api/tags` returns a list of models. If not, start Ollama first (`ollama serve`). If the `OLLAMA_URL` env var is set to a Docker hostname but you're running the backend locally, unset it so it defaults to `http://localhost:11434`.",
          },
        ],
      },

      // ─── Phase 6: React frontend ──────────────────────────────────────────
      {
        step: 6,
        title: "React frontend",
        blocks: [
          {
            type: "text",
            content:
              "Scaffold the React app with Vite, then replace the default `App.tsx` with a real-time chat interface. It reads the SSE stream from the backend and appends each token to the last assistant message as it arrives.",
          },
          {
            type: "code",
            language: "bash",
            label: "Scaffold the React + TypeScript app inside frontend/",
            code: `# Run this from the project root (local-ai-env/)
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# Test that it starts
npm run dev
# Open http://localhost:5173 — you should see the Vite welcome page`,
          },
          {
            type: "code",
            language: "typescript",
            label: "frontend/src/App.tsx — full chat UI",
            code: `import { useState, useRef, FormEvent } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    setStreaming(true);

    // Append the user's message immediately so the UI feels responsive.
    setMessages((prev) => [...prev, { role: "user", text }]);

    // Create an empty assistant message that we'll fill token by token.
    setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

    try {
      const res = await fetch(\`\${API_BASE}/chat\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok || !res.body) {
        throw new Error(\`Backend error: \${res.status}\`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        for (const line of chunk.split("\\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const { token, done: streamDone } = JSON.parse(line.slice(6));
            if (streamDone) break;
            // Append this token to the last (assistant) message.
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              copy[copy.length - 1] = { ...last, text: last.text + token };
              return copy;
            });
          } catch {
            // Partial JSON line — skip
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          text: \`Error: \${(err as Error).message}\`,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "system-ui, sans-serif", background: "#f9fafb" }}>
      {/* Header */}
      <header style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
        <h1 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>🦙 Local AI Chat</h1>
        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
          Powered by Ollama — running 100% locally
        </p>
      </header>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {messages.length === 0 && (
          <p style={{ textAlign: "center", color: "#9ca3af", marginTop: "5rem" }}>
            Send a message to start chatting with your local LLM.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "72%",
              padding: "0.625rem 1rem",
              borderRadius: "1rem",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              background: m.role === "user" ? "#4f46e5" : "#fff",
              color: m.role === "user" ? "#fff" : "#1f2937",
              boxShadow: m.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              whiteSpace: "pre-wrap",
            }}>
              {m.text || (streaming && i === messages.length - 1 ? "▌" : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", background: "#fff", display: "flex", gap: "0.75rem" }}>
        <input
          style={{ flex: 1, padding: "0.625rem 1rem", border: "1px solid #d1d5db", borderRadius: "0.75rem", fontSize: "0.9rem", outline: "none" }}
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming}
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          style={{ padding: "0.625rem 1.25rem", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "0.75rem", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", opacity: streaming || !input.trim() ? 0.5 : 1 }}
        >
          {streaming ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}`,
          },
          {
            type: "code",
            language: "typescript",
            label: "frontend/vite.config.ts — proxy API calls in dev so CORS is not an issue",
            code: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy /chat and /health to FastAPI during development.
      // In production, Nginx handles this routing.
      "/chat": "http://localhost:8000",
      "/health": "http://localhost:8000",
    },
  },
});`,
          },
          {
            type: "callout",
            kind: "tip",
            title: "Test the full stack locally before Docker",
            content:
              "With Ollama running and the FastAPI server running (`uvicorn main:app --reload`), start the React dev server (`npm run dev`) and open `http://localhost:5173`. Type a message and watch the response stream in. Confirm it works end-to-end before moving to Docker.",
          },
        ],
      },

      // ─── Phase 7: Dockerize ───────────────────────────────────────────────
      {
        step: 7,
        title: "Dockerize: Dockerfiles + Compose",
        blocks: [
          {
            type: "text",
            content:
              "Add a `Dockerfile` to each service, then wire them with `docker-compose.yml`. After this step the entire stack starts with `docker compose up`.",
          },
          {
            type: "code",
            language: "dockerfile",
            label: "backend/Dockerfile",
            code: `FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (cached unless requirements.txt changes)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
          },
          {
            type: "code",
            language: "dockerfile",
            label: "frontend/Dockerfile — multi-stage build",
            code: `# ── Stage 1: build the React app ───────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
# Outputs to /app/dist

# ── Stage 2: serve with Nginx ───────────────────────────────────────────
FROM nginx:1.27-alpine

# Copy the built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace the default Nginx config with ours (handles SPA + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80`,
          },
          {
            type: "code",
            language: "nginx",
            label: "frontend/nginx.conf — SPA routing + API proxy",
            code: `server {
    listen 80;
    server_name _;

    # Serve the React SPA
    location / {
        root /usr/share/nginx/html;
        index index.html;
        # Required for React Router — always serve index.html for unknown routes
        try_files $uri $uri/ /index.html;
    }

    # Proxy /chat to FastAPI — forward as a stream (no buffering)
    location /chat {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # Critical for Server-Sent Events: disable buffering
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding on;
    }

    # Proxy health check
    location /health {
        proxy_pass http://backend:8000;
    }
}`,
          },
          {
            type: "code",
            language: "yaml",
            label: "docker-compose.yml — project root",
            code: `version: "3.9"

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      # Reach Ollama running on the host machine
      OLLAMA_URL: "http://host.docker.internal:11434"
      OLLAMA_MODEL: "llama3.2"
    extra_hosts:
      # Linux only — macOS and Windows have host.docker.internal built-in
      - "host.docker.internal:host-gateway"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped`,
          },
          {
            type: "callout",
            kind: "insight",
            title: "Why is Ollama outside Docker?",
            content:
              "Ollama communicates with your GPU through native OS drivers. Running it inside a container requires GPU passthrough (NVIDIA Container Toolkit on Linux, specific flags on macOS/Windows) that adds significant complexity. The simplest production-ready approach — and the one teams actually use — is to run Ollama natively and let Docker containers reach it via `host.docker.internal`. This hostname resolves to the host machine's IP from inside any container.",
          },
        ],
      },

      // ─── Phase 8: Run end-to-end ──────────────────────────────────────────
      {
        step: 8,
        title: "Run the full stack end-to-end",
        blocks: [
          {
            type: "text",
            content:
              "Make sure Ollama is running and the model is pulled, then build and start the Docker stack.",
          },
          {
            type: "code",
            language: "bash",
            label: "Start the entire stack",
            code: `# 1. Confirm Ollama is running (start it if not)
ollama serve &                      # start in background
ollama pull llama3.2                # skip if already downloaded
curl http://localhost:11434/api/tags  # should return {"models":[...]}

# 2. From the project root, build and start all containers
docker compose up --build

# First build takes 2-5 minutes (downloads base images, installs deps).
# Subsequent starts take ~5 seconds.

# 3. Open in your browser
#    Chat interface (production build): http://localhost
#    Backend API / health check:        http://localhost:8000/health`,
          },
          {
            type: "code",
            language: "bash",
            label: "Useful commands while debugging",
            code: `# Stream logs from all services
docker compose logs -f

# Logs from a single service
docker compose logs -f backend
docker compose logs -f frontend

# Rebuild only the backend (after changing main.py or requirements.txt)
docker compose up --build backend

# Stop and remove containers (keeps your images)
docker compose down

# Stop, remove containers AND images (clean slate)
docker compose down --rmi all`,
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Frontend loads but chat returns an error?",
            content:
              "Work through this checklist:\n\n1. `http://localhost:8000/health` returns `{\"status\":\"ok\"}` — if not, the backend isn't up.\n2. `curl http://localhost:11434/api/tags` returns models — if not, Ollama isn't running on the host.\n3. Check `docker compose logs backend` for a `Connection refused` or `timeout` connecting to `host.docker.internal:11434`.\n4. On Linux: confirm `extra_hosts: host.docker.internal:host-gateway` is in `docker-compose.yml`.\n5. Rebuild after any config change: `docker compose down && docker compose up --build`.",
          },
          {
            type: "callout",
            kind: "tip",
            title: "Run without Docker during development",
            content:
              "Use Docker for the final build and demos, but develop locally for faster iteration:\n\n**Terminal 1** — Ollama: `ollama serve`\n\n**Terminal 2** — FastAPI: `cd backend && uvicorn main:app --reload`\n\n**Terminal 3** — React: `cd frontend && npm run dev`\n\nOpen `http://localhost:5173`. Hot reload works instantly on every save.",
          },
        ],
      },

      // ─── Phase 9: Extend the project ──────────────────────────────────────
      {
        step: 9,
        title: "What to build next",
        blocks: [
          {
            type: "text",
            content:
              "You now have a working end-to-end local AI application. Here are the natural next enhancements — each one adds a concrete talking point for portfolio discussions or interviews:",
          },
          {
            type: "list",
            style: "number",
            items: [
              "**Multi-turn conversations** — keep a `messages: [{role, content}]` array in state and send the full history to Ollama's `/api/chat` endpoint (it accepts a `messages` array instead of a single `prompt`). This is how real chatbots maintain context.",
              "**Model picker dropdown** — call `GET http://localhost:11434/api/tags` from the backend, expose it as `GET /models`, and render a `<select>` in the React UI. Users can switch between llama3.2, gemma2, mistral, etc. without restarting anything.",
              "**System prompt editor** — add a collapsible side panel where users set a persona (e.g., \"You are a Python tutor. Be concise.\") before starting a chat. Prepend it as a system message in the Ollama request.",
              "**Conversation history with SQLite** — use SQLAlchemy + SQLite to persist conversations. Add `GET /history` (list all chats) and `GET /history/{id}` (load a chat). Display a sidebar of past conversations in the React UI.",
              "**Markdown rendering** — install `react-markdown` and `remark-gfm`. Wrap the assistant message text in `<ReactMarkdown>`. Code blocks, bold text, and bullet points will render properly — this matters a lot when asking the model to write code.",
              "**Streaming markdown** — combine the token stream with a markdown parser so code blocks format in real time as the model types them (more complex but impressive in demos).",
              "**Deploy to a VPS** — run `docker compose up -d` on a DigitalOcean Droplet or Hetzner box. Use Caddy as a reverse proxy for automatic HTTPS. Add an `ALLOWED_API_KEY` env var in FastAPI middleware so only your frontend can call the backend.",
            ],
          },
          {
            type: "callout",
            kind: "tip",
            title: "Polish this for your GitHub portfolio",
            content:
              "Write a README with: a screenshot of the running app, a one-paragraph description, the tech stack as badges, and three-line quick-start instructions (`git clone` → `ollama pull llama3.2` → `docker compose up`). Recruiters read the README before the code — make the first 10 lines immediately clear what this project is and why it's interesting. Pin the repo on your GitHub profile.",
          },
        ],
      },
    ],
  },
];
