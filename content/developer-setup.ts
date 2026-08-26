import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Track 00 — Developer Setup
// 10 lessons walking a total beginner from "I have a laptop" to "I am running
// a local LLM and talking to it from a FastAPI backend."
// ---------------------------------------------------------------------------

const installPython: Lesson = {
  slug: "install-python",
  trackSlug: "developer-setup",
  order: 1,
  minutes: 10,
  title: "Install Python and Write Your First Script",
  subtitle:
    "Python is the language every AI library speaks. Install it once, verify it, and run your first program.",
  tags: ["Python", "Install", "Beginner"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Every AI framework you'll touch — PyTorch, TensorFlow, scikit-learn, LangChain, Hugging Face — is a Python library. Before you can use any of them, you need a working Python installation on your machine and a way to run `.py` files.",
        },
        {
          type: "text",
          content:
            "The goal of this lesson: install a modern Python (3.11 or 3.12), verify it works from the terminal, and run a script that prints `Hello, AI`.",
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
            "Getting Python installed correctly saves hours later. Wrong version, wrong PATH, wrong `python` vs `python3` alias — these are the #1 reason beginners quit before they've started. Do this once, do it right, and you never think about it again.",
        },
      ],
    },
    {
      step: 3,
      title: "Which Python version?",
      blocks: [
        {
          type: "text",
          content:
            "Use **Python 3.11 or 3.12**. As of 2026, this is the sweet spot: fast, stable, and every AI library supports it.",
        },
        {
          type: "callout",
          kind: "warning",
          title: "Avoid Python 3.13+ (for now)",
          content:
            "PyTorch, TensorFlow, and many other libraries lag by a few months on the newest Python. If you install 3.13, expect `pip install torch` to fail. Stick to 3.12 unless you know what you're doing.",
        },
      ],
    },
    {
      step: 4,
      title: "Install it",
      blocks: [
        {
          type: "text",
          content:
            "Pick the section for your OS. Each block installs the interpreter, adds it to your PATH, and lets you run `python` from any terminal.",
        },
        {
          type: "code",
          language: "bash",
          label: "Windows (via winget)",
          code: `# Open PowerShell and run:
winget install Python.Python.3.12

# Or download the installer from python.org and CHECK
# "Add python.exe to PATH" during setup.`,
        },
        {
          type: "code",
          language: "bash",
          label: "macOS (via Homebrew)",
          code: `# Install Homebrew first if you don't have it:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install python@3.12`,
        },
        {
          type: "code",
          language: "bash",
          label: "Linux (Ubuntu/Debian)",
          code: `sudo apt update
sudo apt install python3.12 python3.12-venv python3-pip`,
        },
      ],
    },
    {
      step: 5,
      title: "Verify it works",
      blocks: [
        {
          type: "text",
          content:
            "Close and re-open your terminal (so PATH changes take effect), then run:",
        },
        {
          type: "code",
          language: "bash",
          label: "Terminal",
          code: `python --version
# Expected: Python 3.12.x

# On some Linux/macOS setups you may need:
python3 --version`,
        },
        {
          type: "callout",
          kind: "insight",
          title: "python vs python3",
          content:
            "On macOS and Linux, `python` sometimes points to the ancient Python 2. If `python --version` shows `2.7.x`, use `python3` everywhere in this course.",
        },
      ],
    },
    {
      step: 6,
      title: "Your first script",
      blocks: [
        {
          type: "text",
          content:
            "Create a file called `hello.py` anywhere on your machine — desktop is fine for now — with these two lines:",
        },
        {
          type: "code",
          language: "python",
          label: "hello.py",
          code: `print("Hello, AI")
print(f"Python is running: 2 + 2 = {2 + 2}")`,
        },
        {
          type: "code",
          language: "bash",
          label: "Run it",
          code: `python hello.py
# Hello, AI
# Python is running: 2 + 2 = 4`,
        },
      ],
    },
    {
      step: 7,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "\"python is not recognized\"",
          content:
            "You forgot to check *Add Python to PATH* during install. Fix: re-run the installer, choose **Modify**, and enable it. Or on Windows, add `C:\\Users\\<you>\\AppData\\Local\\Programs\\Python\\Python312` to your PATH manually.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Two Pythons installed, wrong one runs",
          content:
            "Common on macOS/Windows after upgrades. Check with `where python` (Windows) or `which -a python` (macOS/Linux). Uninstall the old one or reorder PATH.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Editing with Word or Notepad",
          content:
            "These add invisible characters that Python chokes on. Use VS Code (next lesson) or any real text editor.",
        },
      ],
    },
    {
      step: 8,
      title: "Where you'll see this",
      blocks: [
        {
          type: "list",
          items: [
            "Every AI library — `pip install torch`, `pip install transformers`, `pip install langchain` — assumes a working Python.",
            "Jupyter notebooks (next lessons) are just a browser UI wrapped around this same Python interpreter.",
            "Docker images for AI (`nvidia/cuda`, `python:3.12`) are pre-installed Pythons, but you still need to know how the runtime works.",
          ],
        },
      ],
    },
    {
      step: 9,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You run `python --version` and it prints `Python 2.7.18`. What should you do?",
          options: [
            "Use `python3 --version` from now on, or reinstall Python 3.12 and fix your PATH.",
            "Upgrade with `pip install python --upgrade`.",
            "Nothing — Python 2 works fine for AI in 2026.",
            "Delete /usr/bin/python and reinstall the OS.",
          ],
          correct: 0,
          explanation:
            "Python 2 was retired in 2020 and no modern AI library supports it. On macOS/Linux, the safe move is to use `python3` explicitly; the drastic move is to reinstall and fix PATH so `python` points to 3.12.",
        },
      ],
    },
    {
      step: 10,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You now have Python. Next: **virtual environments** — the way every real Python developer isolates one project's libraries from another so a dependency for project A never breaks project B.",
        },
      ],
    },
  ],
};

const virtualenvs: Lesson = {
  slug: "virtual-environments",
  trackSlug: "developer-setup",
  order: 2,
  minutes: 12,
  title: "Virtual Environments (venv and uv)",
  subtitle:
    "One Python install, many isolated projects. Never let one library upgrade break another project again.",
  tags: ["venv", "uv", "pip", "Dependencies"],
  sections: [
    {
      step: 1,
      title: "The problem",
      blocks: [
        {
          type: "text",
          content:
            "You start project A with `pip install numpy==1.23`. Six months later you start project B, which needs `numpy==2.0`. You install it — and project A silently breaks because there's only *one* system-wide `numpy` on your machine.",
        },
        {
          type: "text",
          content:
            "A **virtual environment** solves this. It's a private folder containing its own Python and its own libraries, separate from the system Python and separate from every other project.",
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
            "Every real-world Python project — every serious tutorial, every GitHub repo, every production app — uses a virtual environment. Skipping this is the #2 way beginners get stuck (right after PATH problems).",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition",
      blocks: [
        {
          type: "text",
          content:
            "A virtual environment is just a folder — traditionally called `venv` or `.venv` — that contains a copy of the Python interpreter and its own private `site-packages` directory for installed libraries. When you *activate* the env, your shell temporarily prepends that folder to your PATH.",
        },
        {
          type: "diagram",
          label: "System Python vs venv",
          chart: `flowchart TB
    S[System Python 3.12] --> LA[Global site-packages<br/>numpy 1.23]
    S --> V1[project-a/venv]
    S --> V2[project-b/venv]
    V1 --> LP1[numpy 1.23<br/>pandas 2.0]
    V2 --> LP2[numpy 2.0<br/>torch 2.3]
    style V1 fill:#d9edff,stroke:#8ecdff
    style V2 fill:#d9edff,stroke:#8ecdff`,
        },
      ],
    },
    {
      step: 4,
      title: "The old way: venv + pip",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "Create and activate a venv",
          code: `# Inside your project folder:
python -m venv .venv

# Activate it — this changes your shell
# macOS / Linux:
source .venv/bin/activate

# Windows PowerShell:
.venv\\Scripts\\Activate.ps1

# You'll see (.venv) in your prompt. Now every 'pip install'
# lands INSIDE this folder, not on your system.

pip install numpy pandas
python -c "import numpy; print(numpy.__version__)"

# When you're done:
deactivate`,
        },
      ],
    },
    {
      step: 5,
      title: "The modern way: uv",
      blocks: [
        {
          type: "text",
          content:
            "`uv` is a much faster Python package manager written in Rust — 10–100× faster than pip, and it manages the virtual environment for you. This is what most 2026 AI projects use.",
        },
        {
          type: "code",
          language: "bash",
          label: "Install uv (one time)",
          code: `# macOS / Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows PowerShell:
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`,
        },
        {
          type: "code",
          language: "bash",
          label: "Use uv on a new project",
          code: `mkdir my-ai-project && cd my-ai-project

# Creates .venv and a pyproject.toml
uv init

# Add dependencies (fast!)
uv add numpy pandas torch

# Run scripts inside the env — no manual activation
uv run python -c "import torch; print(torch.__version__)"`,
        },
      ],
    },
    {
      step: 6,
      title: "requirements.txt vs pyproject.toml",
      blocks: [
        {
          type: "kv",
          items: [
            {
              key: "requirements.txt",
              value:
                "Old format. A plain list of `name==version` lines. Generated with `pip freeze > requirements.txt`. Still supported everywhere.",
            },
            {
              key: "pyproject.toml",
              value:
                "Modern format. A structured TOML file that describes the project *and* its dependencies. What `uv` and every new tool uses.",
            },
          ],
        },
        {
          type: "code",
          language: "yaml",
          label: "Example pyproject.toml",
          code: `[project]
name = "my-ai-project"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "numpy>=1.26",
    "pandas>=2.0",
    "torch>=2.3",
]`,
        },
      ],
    },
    {
      step: 7,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Forgetting to activate",
          content:
            "You created a venv, then ran `pip install` — but forgot to activate first. The install went to system Python. Fix: `deactivate` (if you're in a different env), then `source .venv/bin/activate`, then reinstall.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Committing .venv/",
          content:
            "The `.venv/` folder can be hundreds of MB. Never commit it. Put `.venv/` in your `.gitignore` (both `.venv` and `venv` for safety).",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Mixing pip and uv in the same project",
          content:
            "Pick one. Mixing them can leave `pyproject.toml` and installed packages out of sync. `uv` also reads `requirements.txt` so migration is easy.",
        },
      ],
    },
    {
      step: 8,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You clone a repo that has a `pyproject.toml` and a `.python-version` file. What's the fastest way to set it up with uv?",
          options: [
            "`uv sync` — reads pyproject.toml, creates .venv, and installs all deps.",
            "`pip install -r pyproject.toml`.",
            "Copy pyproject.toml into a new venv manually.",
            "Delete pyproject.toml and start over with pip.",
          ],
          correct: 0,
          explanation:
            "`uv sync` is the one-shot command: it picks the right Python version, creates the venv, and installs every dependency listed in pyproject.toml. `pip` cannot read pyproject.toml directly.",
        },
      ],
    },
    {
      step: 9,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can now spin up any Python project in isolation. Next: **Jupyter notebooks** — an interactive UI on top of your venv where every AI course, paper, and tutorial lives.",
        },
      ],
    },
  ],
};

const jupyter: Lesson = {
  slug: "jupyter",
  trackSlug: "developer-setup",
  order: 3,
  minutes: 10,
  title: "Jupyter Notebooks",
  subtitle:
    "Explore data cell-by-cell. The notebook is where every AI paper, course, and prototype lives.",
  tags: ["Jupyter", "Notebook", "Exploration"],
  sections: [
    {
      step: 1,
      title: "The problem",
      blocks: [
        {
          type: "text",
          content:
            "AI work is exploratory. You load a CSV, look at 5 rows, plot a histogram, notice something weird, try a fix, replot. A traditional `.py` script that runs top-to-bottom is the wrong shape for this — you'd re-run the whole thing every time.",
        },
        {
          type: "text",
          content:
            "**Jupyter notebooks** solve this. They let you run one cell at a time, inspect variables between cells, and mix code with markdown and inline plots. Every ML tutorial and Kaggle notebook uses this format.",
        },
      ],
    },
    {
      step: 2,
      title: "Install and launch",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "Add Jupyter to your project",
          code: `# Inside your venv (or via uv):
uv add jupyter

# Launch:
uv run jupyter lab
# Opens http://localhost:8888 in your browser.`,
        },
        {
          type: "callout",
          kind: "tip",
          title: "Prefer VS Code",
          content:
            "You can also open any `.ipynb` file directly in VS Code — it has full notebook support. Most professionals now use notebooks inside VS Code instead of the standalone Jupyter Lab UI.",
        },
      ],
    },
    {
      step: 3,
      title: "The two cell types",
      blocks: [
        {
          type: "list",
          items: [
            "**Code cells** — run Python. Output shows below the cell.",
            "**Markdown cells** — text, headings, math (LaTeX with `$…$`), images. This is how you narrate your work.",
          ],
        },
        {
          type: "callout",
          kind: "insight",
          title: "The kernel",
          content:
            "A notebook is powered by a *kernel* — a persistent Python process. Variables defined in cell 1 are still alive in cell 20. Restarting the kernel clears everything.",
        },
      ],
    },
    {
      step: 4,
      title: "A minimal example",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "Cell 1",
          code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)
y = np.sin(x)`,
        },
        {
          type: "code",
          language: "python",
          label: "Cell 2 (re-run without recomputing cell 1)",
          code: `plt.plot(x, y)
plt.title("sin(x)")
plt.show()`,
        },
      ],
    },
    {
      step: 5,
      title: "Magic commands",
      blocks: [
        {
          type: "text",
          content:
            "Lines starting with `%` are *magics* — Jupyter-only commands. The most useful:",
        },
        {
          type: "kv",
          items: [
            { key: "%matplotlib inline", value: "Render plots directly in the notebook (usually default)." },
            { key: "%timeit expr", value: "Benchmark an expression — runs it many times, reports mean/std." },
            { key: "%%time", value: "Time the whole cell." },
            { key: "!command", value: "Run a shell command. `!pip install requests` or `!ls`." },
            { key: "?obj / obj??", value: "Show docstring / source code for an object." },
          ],
        },
      ],
    },
    {
      step: 6,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Running cells out of order",
          content:
            "Because state is persistent, running cell 5 before cell 2 can leave variables in an impossible state. Rule: before you share a notebook, hit **Restart & Run All**. If it doesn't work top-to-bottom, it doesn't work.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Huge cells",
          content:
            "A 100-line cell defeats the purpose. Break it up — one idea per cell.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Notebook diffs in Git",
          content:
            "`.ipynb` files are JSON and diff badly. Either clear outputs before committing (`jupyter nbconvert --clear-output`) or use `jupytext` to sync to a paired `.py` file.",
        },
      ],
    },
    {
      step: 7,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "In cell 3 you define `df = pd.read_csv('data.csv')`. In cell 5 you accidentally overwrite `df` with a different DataFrame. What's the safest way to recover?",
          options: [
            "Re-run cell 3, then continue from cell 6.",
            "Restart the kernel and run everything again.",
            "Undo in the editor.",
            "Both A and B work — A is faster if cell 3 is cheap, B is safer if you're not sure what else got polluted.",
          ],
          correct: 3,
          explanation:
            "Both restore the state, but they trade off speed vs. certainty. For expensive cells (large data loads, model training), re-running just that cell is fine. When state is confusing, a full restart is the fastest way to a known-good starting point.",
        },
      ],
    },
    {
      step: 8,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You have Python, venvs, and notebooks. Next: **VS Code setup** — the editor that gives you real navigation, linting, and integrated notebook support.",
        },
      ],
    },
  ],
};

const vscode: Lesson = {
  slug: "vscode",
  trackSlug: "developer-setup",
  order: 4,
  minutes: 8,
  title: "VS Code for AI Development",
  subtitle:
    "Free, cross-platform, and the default editor of every AI team. Configure it once, use it forever.",
  tags: ["VS Code", "Editor", "IDE"],
  sections: [
    {
      step: 1,
      title: "Why VS Code",
      blocks: [
        {
          type: "text",
          content:
            "VS Code is what >70% of developers use as of 2026. For AI work it has: first-class Python support, built-in Jupyter notebooks, a great terminal, and extensions for every framework you'll touch.",
        },
      ],
    },
    {
      step: 2,
      title: "Install and open your project",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "Install (any OS)",
          code: `# Windows:  winget install Microsoft.VisualStudioCode
# macOS:    brew install --cask visual-studio-code
# Linux:    sudo snap install code --classic`,
        },
        {
          type: "text",
          content:
            "Open a project folder (not just a file) with `File → Open Folder`. VS Code will treat that folder as the workspace root — where the venv, pyproject.toml, and .gitignore live.",
        },
      ],
    },
    {
      step: 3,
      title: "The must-have extensions",
      blocks: [
        {
          type: "list",
          items: [
            "**Python** (Microsoft) — Python language support, debugging, testing.",
            "**Pylance** — the fast type-checker that powers Python IntelliSense.",
            "**Jupyter** (Microsoft) — open, edit, run `.ipynb` files inside VS Code.",
            "**Ruff** — the fastest Python linter and formatter, replaces flake8+black.",
            "**GitLens** — supercharges the built-in Git panel with blame and history.",
          ],
        },
      ],
    },
    {
      step: 4,
      title: "Point VS Code at your venv",
      blocks: [
        {
          type: "text",
          content:
            "This is the single most important setting for AI work. VS Code needs to know which Python interpreter — your venv, not system Python.",
        },
        {
          type: "list",
          style: "number",
          items: [
            "Open the command palette: `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS).",
            "Type **Python: Select Interpreter**.",
            "Choose the one that starts with `./.venv/bin/python` (or `.\\.venv\\Scripts\\python.exe` on Windows).",
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "Once selected, VS Code auto-activates the venv in every integrated terminal you open. No more forgetting to `source .venv/bin/activate`.",
        },
      ],
    },
    {
      step: 5,
      title: "Useful keyboard shortcuts",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "Ctrl+P", value: "Quick-open any file by name." },
            { key: "Ctrl+Shift+P", value: "Command palette — anything VS Code can do." },
            { key: "F12", value: "Go to definition of the symbol under cursor." },
            { key: "Shift+F12", value: "Find all references." },
            { key: "Ctrl+`", value: "Toggle the integrated terminal." },
            { key: "Ctrl+/", value: "Comment / uncomment current line." },
            { key: "Alt+↑ / Alt+↓", value: "Move current line up / down." },
          ],
        },
      ],
    },
    {
      step: 6,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Wrong interpreter",
          content:
            "If autocomplete says `numpy` is unknown even though you `pip install`ed it, VS Code is pointed at system Python, not your venv. Fix with **Python: Select Interpreter**.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Open File instead of Open Folder",
          content:
            "If you open just one `.py` file, VS Code has no workspace — no venv detection, no linting config, no Git integration. Always open the *folder*.",
        },
      ],
    },
    {
      step: 7,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You have a real editor. Next: **Git and GitHub** — how to version your code and back it up before you break something you can't recover.",
        },
      ],
    },
  ],
};

const gitGithub: Lesson = {
  slug: "git-github",
  trackSlug: "developer-setup",
  order: 5,
  minutes: 15,
  title: "Git and GitHub Essentials",
  subtitle:
    "Time travel for code. Every commit is a snapshot; every branch is an alternate universe.",
  tags: ["Git", "GitHub", "Version control"],
  sections: [
    {
      step: 1,
      title: "The problem",
      blocks: [
        {
          type: "text",
          content:
            "You changed 50 files, three of them broke everything, and you don't remember what you changed. Without version control, you're stuck. Git is the industry-standard time-machine for source code — every AI codebase you'll ever contribute to lives inside a Git repo.",
        },
      ],
    },
    {
      step: 2,
      title: "The mental model",
      blocks: [
        {
          type: "diagram",
          label: "Working directory → staging → repository",
          chart: `flowchart LR
    W[Working Directory<br/>your files] -- "git add" --> S[Staging Area<br/>what to commit]
    S -- "git commit" --> R[Local Repository<br/>history of snapshots]
    R -- "git push" --> G[GitHub / Remote<br/>backup + collaboration]
    G -- "git pull" --> R
    style S fill:#eef7ff,stroke:#8ecdff
    style R fill:#d9edff,stroke:#8ecdff
    style G fill:#f6f7f9,stroke:#d3d7e0`,
        },
        {
          type: "text",
          content:
            "Three key spots: your **working directory** (what you see and edit), the **staging area** (what you've marked as \"ready to commit\"), and the **repository** (the permanent history). GitHub is just a place to store a copy of the repository online.",
        },
      ],
    },
    {
      step: 3,
      title: "One-time setup",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "Configure your identity",
          code: `git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Use main as the default branch name
git config --global init.defaultBranch main

# Save credentials so you don't retype passwords
git config --global credential.helper cache`,
        },
      ],
    },
    {
      step: 4,
      title: "The core loop",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "Start a project and make your first commit",
          code: `# In your project folder:
git init

# Create a .gitignore to skip venv, cache, secrets
echo ".venv/" > .gitignore
echo "__pycache__/" >> .gitignore
echo ".env" >> .gitignore

# Stage everything
git add .

# See what will be committed
git status

# Save the snapshot
git commit -m "Initial commit: project skeleton"

# See the history
git log --oneline`,
        },
      ],
    },
    {
      step: 5,
      title: "Branching",
      blocks: [
        {
          type: "text",
          content:
            "A branch is a separate line of history. You use one to work on a new feature without touching your stable code.",
        },
        {
          type: "code",
          language: "bash",
          label: "Feature branch workflow",
          code: `# Create and switch to a new branch
git switch -c add-quiz-feature

# ...edit files, then...
git add .
git commit -m "Add quiz component"

# Switch back to main
git switch main

# Merge the feature in
git merge add-quiz-feature

# Delete the branch — its history is preserved
git branch -d add-quiz-feature`,
        },
      ],
    },
    {
      step: 6,
      title: "Push to GitHub",
      blocks: [
        {
          type: "list",
          style: "number",
          items: [
            "Create a GitHub account and a new repo (`+ → New repository`). Skip the README/gitignore — you already have one.",
            "Copy the HTTPS URL, e.g. `https://github.com/you/my-project.git`.",
            "In your terminal, connect and push:",
          ],
        },
        {
          type: "code",
          language: "bash",
          code: `git remote add origin https://github.com/you/my-project.git
git branch -M main
git push -u origin main`,
        },
      ],
    },
    {
      step: 7,
      title: "Fixing common problems",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "\"Please commit your changes or stash them before you switch branches\"",
          content:
            "You've got uncommitted work. Options: `git stash` (save aside), then switch. `git stash pop` to bring it back.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "\"Merge conflict\"",
          content:
            "Two branches changed the same lines. Open the file — Git wrote `<<<<<<< HEAD ... ======= ... >>>>>>>` markers. Pick which version you want (or blend), delete the markers, `git add`, then `git commit`.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Committed a secret by accident",
          content:
            "Rotate the secret *immediately* (assume it's public). Then remove it from history with `git filter-repo` or the BFG cleaner. `git rm` alone leaves it in the history.",
        },
      ],
    },
    {
      step: 8,
      title: "The 10 commands you use 95% of the time",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "git status", value: "What's changed and what's staged." },
            { key: "git add <file>", value: "Stage a specific file." },
            { key: "git add .", value: "Stage everything (careful — check status first)." },
            { key: "git commit -m \"msg\"", value: "Snapshot the staged changes." },
            { key: "git log --oneline", value: "Compact history view." },
            { key: "git diff", value: "See unstaged changes." },
            { key: "git switch <branch>", value: "Change branches." },
            { key: "git switch -c <branch>", value: "Create a new branch and switch to it." },
            { key: "git pull", value: "Fetch and merge remote changes into current branch." },
            { key: "git push", value: "Send local commits to the remote." },
          ],
        },
      ],
    },
    {
      step: 9,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You ran `git commit -m \"typo\"` and immediately realized the message is meaningless. Nothing has been pushed yet. What's the safe fix?",
          options: [
            "`git commit --amend -m \"Fix bug in loss function\"` — rewrites the last local commit.",
            "`git reset --hard HEAD~1` — discards the commit entirely.",
            "`git revert HEAD` — adds a new commit that undoes it.",
            "You can't change a commit message once made.",
          ],
          correct: 0,
          explanation:
            "`--amend` rewrites the most recent commit's message (and can also include additional staged changes). Safe as long as you haven't pushed yet — after pushing, amending rewrites public history and needs a force-push, which can hurt collaborators.",
        },
      ],
    },
    {
      step: 10,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can now save, restore, and share code. Next: the **command line** — the tool underneath everything you just did.",
        },
      ],
    },
  ],
};

const commandLine: Lesson = {
  slug: "command-line",
  trackSlug: "developer-setup",
  order: 6,
  minutes: 10,
  title: "Command Line Essentials",
  subtitle:
    "The terminal is the AI engineer's cockpit. Navigate, pipe, and script — the same twenty commands cover 99% of the work.",
  tags: ["CLI", "Terminal", "Bash"],
  sections: [
    {
      step: 1,
      title: "Why the CLI",
      blocks: [
        {
          type: "text",
          content:
            "Every AI workflow — cloning a repo, launching a training job, watching GPU utilization, sending a curl request to your model — runs faster and reproducibly through the terminal. It's also how you'll interact with remote servers, Docker containers, and CI/CD pipelines.",
        },
      ],
    },
    {
      step: 2,
      title: "Navigation",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "pwd", value: "Print working directory — where am I?" },
            { key: "ls", value: "List files. `ls -la` shows hidden files and details." },
            { key: "cd path", value: "Change directory. `cd ..` goes up one level. `cd ~` goes home." },
            { key: "clear", value: "Clear the terminal screen." },
          ],
        },
      ],
    },
    {
      step: 3,
      title: "Files and folders",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "mkdir new-folder", value: "Create a folder." },
            { key: "touch file.txt", value: "Create an empty file." },
            { key: "cp src dest", value: "Copy. Add `-r` for folders." },
            { key: "mv old new", value: "Move or rename." },
            { key: "rm file", value: "Delete a file. `rm -r` for folder (no undo!)." },
            { key: "cat file", value: "Print a file to the terminal." },
            { key: "head -n 20 file", value: "First 20 lines." },
            { key: "tail -n 20 file", value: "Last 20 lines. `-f` to follow live." },
          ],
        },
      ],
    },
    {
      step: 4,
      title: "Search and pipes",
      blocks: [
        {
          type: "text",
          content:
            "The magic of the CLI is *composition* — one command's output becomes the next command's input via a pipe (`|`).",
        },
        {
          type: "code",
          language: "bash",
          label: "Real examples",
          code: `# Find every .py file that mentions 'torch':
grep -r "torch" --include="*.py" .

# Count how many Python files are in this project:
find . -name "*.py" | wc -l

# Show the top 5 largest files in the current folder:
du -h * | sort -h | tail -5

# Watch a training log live:
tail -f train.log | grep -i "loss"`,
        },
      ],
    },
    {
      step: 5,
      title: "Environment variables in the shell",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "Setting and reading env vars",
          code: `# Set for this shell only:
export OPENAI_API_KEY="sk-abc123"

# Read:
echo $OPENAI_API_KEY

# Pass to a script for one run:
API_KEY=xyz python train.py

# Persist by adding the export to ~/.bashrc or ~/.zshrc`,
        },
      ],
    },
    {
      step: 6,
      title: "PowerShell equivalents (Windows)",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "ls / Get-ChildItem", value: "Same idea; `ls` is aliased." },
            { key: "cd", value: "Works the same." },
            { key: "cat / Get-Content", value: "Read a file." },
            { key: "$env:NAME = \"value\"", value: "Set environment variable." },
            { key: "$env:NAME", value: "Read one." },
            { key: "Select-String \"pattern\" file", value: "Rough grep equivalent." },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "WSL",
          content:
            "On Windows, install **WSL2** (Windows Subsystem for Linux) with `wsl --install`. You get a real Ubuntu terminal — every bash example in this course just works.",
        },
      ],
    },
    {
      step: 7,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "rm -rf on the wrong path",
          content:
            "There's no trash bin. Before deleting recursively, run the command as `ls` first to confirm what you're about to nuke.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Forgetting to quote paths with spaces",
          content:
            "`cd My Project` fails; `cd \"My Project\"` works. Use quotes anywhere a path might have a space.",
        },
      ],
    },
    {
      step: 8,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can drive the terminal. Next: **Docker** — how to package your Python + models + system libraries into one portable container that runs anywhere.",
        },
      ],
    },
  ],
};

const docker: Lesson = {
  slug: "docker",
  trackSlug: "developer-setup",
  order: 7,
  minutes: 15,
  title: "Docker for AI",
  subtitle:
    "Package your app plus every library and system dependency into one image. Runs the same on your laptop, a server, or a cloud GPU.",
  tags: ["Docker", "Containers", "Deployment"],
  sections: [
    {
      step: 1,
      title: "The problem",
      blocks: [
        {
          type: "text",
          content:
            "Your app runs on your laptop. You send it to a colleague — different OS, different Python, different CUDA — and it breaks. Docker solves this by bundling your app **and its entire environment** into a single portable image.",
        },
      ],
    },
    {
      step: 2,
      title: "Image vs container",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "Image", value: "A read-only template — the recipe for a container. Built once from a Dockerfile." },
            { key: "Container", value: "A running instance of an image. You can have many containers from one image." },
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "Analogy: image = class, container = instance. Or image = OS install ISO, container = the running computer.",
        },
      ],
    },
    {
      step: 3,
      title: "Install Docker",
      blocks: [
        {
          type: "list",
          items: [
            "**Windows / macOS**: install [Docker Desktop](https://www.docker.com/products/docker-desktop). Includes the Docker daemon, CLI, and a small UI.",
            "**Linux**: `sudo apt install docker.io` (Ubuntu/Debian). Add yourself to the `docker` group so you don't need `sudo`.",
          ],
        },
        {
          type: "code",
          language: "bash",
          label: "Verify",
          code: `docker --version
docker run hello-world`,
        },
      ],
    },
    {
      step: 4,
      title: "Your first Dockerfile",
      blocks: [
        {
          type: "code",
          language: "yaml",
          label: "Dockerfile",
          code: `# Base image — official slim Python
FROM python:3.12-slim

# Working directory inside the container
WORKDIR /app

# Copy dependency file first (cache-friendly)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# What runs when the container starts
CMD ["python", "app.py"]`,
        },
        {
          type: "code",
          language: "bash",
          label: "Build and run",
          code: `# Build an image tagged 'my-app'
docker build -t my-app .

# Run it — remove container when it exits (--rm)
docker run --rm my-app

# Run interactively with a shell (for debugging)
docker run --rm -it my-app /bin/bash`,
        },
      ],
    },
    {
      step: 5,
      title: "Ports and volumes",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "Expose an API on port 8000",
          code: `# -p host:container maps ports
docker run --rm -p 8000:8000 my-app

# Mount your local folder inside the container (live editing)
docker run --rm -v $(pwd):/app my-app`,
        },
        {
          type: "kv",
          items: [
            { key: "-p 8000:8000", value: "Container's 8000 → your machine's 8000." },
            { key: "-v /host:/container", value: "Mount a folder — changes visible on both sides." },
            { key: "-e KEY=value", value: "Pass an environment variable." },
            { key: "--gpus all", value: "Give the container access to all GPUs (requires NVIDIA Container Toolkit)." },
          ],
        },
      ],
    },
    {
      step: 6,
      title: "docker compose for multi-service apps",
      blocks: [
        {
          type: "text",
          content:
            "For AI apps you often want *frontend + backend + vector DB + LLM* all running together. `docker-compose.yml` defines the whole stack in one file.",
        },
        {
          type: "code",
          language: "yaml",
          label: "docker-compose.yml",
          code: `version: "3.9"
services:
  api:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      OLLAMA_URL: http://ollama:11434
    depends_on:
      - ollama
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
volumes:
  ollama_data:`,
        },
        {
          type: "code",
          language: "bash",
          code: `docker compose up      # start everything
docker compose down    # stop and remove containers`,
        },
      ],
    },
    {
      step: 7,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "COPY before RUN pip install",
          content:
            "If you `COPY .` before `RUN pip install`, every code change invalidates the pip cache. Copy `requirements.txt` first, install deps, THEN copy source. Massive rebuild-speed win.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Huge images",
          content:
            "`FROM python:3.12` is 1GB+. `FROM python:3.12-slim` is 150MB. `FROM python:3.12-alpine` is smaller still, but many wheels don't compile against Alpine's musl libc. **slim** is the safe default.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Storing state inside the container",
          content:
            "Containers are ephemeral — data written inside is lost when it stops. Use volumes (`-v`) or an external DB for anything that needs to survive.",
        },
      ],
    },
    {
      step: 8,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "Your team runs your AI app in a Docker container but the model loads freshly on every restart, taking 90 seconds each time. What's the quickest fix?",
          options: [
            "Mount a volume for the model cache directory and set the cache path env var so the model persists across restarts.",
            "Copy the model into the image at build time so it's baked in — larger image but instant startup.",
            "Both A and B work; pick A for iteration, B for immutable production images.",
            "Increase container CPU limits.",
          ],
          correct: 2,
          explanation:
            "Both are valid patterns and both are used in production. A (mount a volume) keeps the image small and lets you swap models without rebuilding. B (bake it in) trades image size for reproducibility and faster cold-starts — the standard choice for immutable production deployments.",
        },
      ],
    },
    {
      step: 9,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can package anything. Next: **REST APIs, HTTP, and JSON** — how your frontend, backend, and models actually talk to each other.",
        },
      ],
    },
  ],
};

const restApis: Lesson = {
  slug: "rest-apis-http-json",
  trackSlug: "developer-setup",
  order: 8,
  minutes: 14,
  title: "REST APIs, HTTP, and JSON",
  subtitle:
    "The language every AI service speaks. Once you understand a request-response cycle, every LLM API is the same shape.",
  tags: ["HTTP", "REST", "JSON", "FastAPI"],
  sections: [
    {
      step: 1,
      title: "The problem",
      blocks: [
        {
          type: "text",
          content:
            "AI models live behind APIs. OpenAI, Anthropic, your own FastAPI server, an Ollama daemon — they all speak the same protocol: **HTTP**. Send a request, receive a response, both usually carrying **JSON** payloads.",
        },
      ],
    },
    {
      step: 2,
      title: "The request/response cycle",
      blocks: [
        {
          type: "diagram",
          label: "How a client talks to an API",
          chart: `sequenceDiagram
    Client->>Server: POST /chat (JSON body)
    Server-->>Client: 200 OK + JSON response
    Client->>Server: GET /status
    Server-->>Client: 200 OK + JSON response`,
        },
      ],
    },
    {
      step: 3,
      title: "HTTP methods (verbs)",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "GET", value: "Read something. Should never modify state." },
            { key: "POST", value: "Create or trigger something. LLM chat calls are POST." },
            { key: "PUT / PATCH", value: "Update. PUT replaces, PATCH updates part." },
            { key: "DELETE", value: "Remove." },
          ],
        },
      ],
    },
    {
      step: 4,
      title: "Status codes",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "2xx (200, 201)", value: "Success." },
            { key: "4xx (400, 401, 404, 429)", value: "Client's fault. Bad request, unauthorized, not found, rate-limited." },
            { key: "5xx (500, 502, 503)", value: "Server's fault. Retry with backoff." },
          ],
        },
      ],
    },
    {
      step: 5,
      title: "JSON — the payload format",
      blocks: [
        {
          type: "text",
          content:
            "JSON is a language-independent way to serialize structured data. Python `dict` in, JSON string out — over the wire — Python `dict` on the other side.",
        },
        {
          type: "code",
          language: "json",
          label: "Example: chat request body",
          code: `{
  "model": "llama3",
  "messages": [
    {"role": "user", "content": "What is a neuron?"}
  ],
  "temperature": 0.7
}`,
        },
      ],
    },
    {
      step: 6,
      title: "curl — call any API from the terminal",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "GET",
          code: `curl https://httpbin.org/get`,
        },
        {
          type: "code",
          language: "bash",
          label: "POST with JSON",
          code: `curl -X POST http://localhost:11434/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"model": "llama3", "messages": [{"role": "user", "content": "Hi"}]}'`,
        },
      ],
    },
    {
      step: 7,
      title: "Python: the requests library",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "client.py",
          code: `import requests

url = "http://localhost:11434/api/chat"
payload = {
    "model": "llama3",
    "messages": [{"role": "user", "content": "What is a neuron?"}],
    "stream": False,
}

resp = requests.post(url, json=payload, timeout=60)
resp.raise_for_status()          # raises on 4xx / 5xx
data = resp.json()               # decoded dict
print(data["message"]["content"])`,
        },
      ],
    },
    {
      step: 8,
      title: "FastAPI: build your own API in 20 lines",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "main.py",
          code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    return {"reply": f"Echoing: {req.message}"}`,
        },
        {
          type: "code",
          language: "bash",
          label: "Run",
          code: `uv add fastapi uvicorn
uv run uvicorn main:app --reload

# Auto-generated interactive docs at:
# http://127.0.0.1:8000/docs`,
        },
      ],
    },
    {
      step: 9,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Forgetting Content-Type",
          content:
            "curl without `-H \"Content-Type: application/json\"` sends the body as form-encoded — most APIs return 400. In Python `requests`, passing `json=payload` handles it for you.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Not setting a timeout",
          content:
            "`requests.post(url, json=...)` with no timeout will hang forever if the server stalls. Always pass `timeout=60` (or whatever fits).",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Blocking on a streaming endpoint",
          content:
            "LLMs often stream tokens. If the API returns `Transfer-Encoding: chunked`, use `requests.post(url, json=..., stream=True)` and iterate `resp.iter_lines()`.",
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
            "Your API returns `401 Unauthorized`. What's the most likely cause?",
          options: [
            "You forgot to include the API key in the `Authorization` header, or the key is invalid.",
            "The API is down.",
            "The JSON body is malformed.",
            "The request timed out.",
          ],
          correct: 0,
          explanation:
            "401 specifically means *authentication* failed. 400 would be a malformed body, 5xx is a server outage, and a timeout throws before you get a status code at all. Check the API key first.",
        },
      ],
    },
    {
      step: 11,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can talk to any API. Next: **environment variables and API keys** — the right way to store credentials so you don't ship them to GitHub by accident.",
        },
      ],
    },
  ],
};

const envVars: Lesson = {
  slug: "env-vars-api-keys",
  trackSlug: "developer-setup",
  order: 9,
  minutes: 8,
  title: "Environment Variables and API Keys",
  subtitle:
    "How to store secrets so your code stays public but your keys stay private.",
  tags: [".env", "Secrets", "python-dotenv"],
  sections: [
    {
      step: 1,
      title: "The problem",
      blocks: [
        {
          type: "text",
          content:
            "Your code needs an OpenAI or Anthropic API key. Hard-coding `api_key = \"sk-abc123\"` in a Python file is a disaster — the first `git push` sends it to GitHub, someone's scraper finds it in minutes, and you get a bill for someone else's models.",
        },
        {
          type: "callout",
          kind: "warning",
          title: "This happens constantly",
          content:
            "GitHub scans every push for leaked secrets and revokes obvious ones. But by the time it's caught, the key may already have been used. Every AI service will bill for the abuse until you notice.",
        },
      ],
    },
    {
      step: 2,
      title: "The pattern: environment variables",
      blocks: [
        {
          type: "text",
          content:
            "Store secrets *outside* your code, in your shell environment. Your code reads them at runtime.",
        },
        {
          type: "code",
          language: "python",
          label: "In your code",
          code: `import os

api_key = os.environ["OPENAI_API_KEY"]
# or with a fallback:
api_key = os.environ.get("OPENAI_API_KEY", "")`,
        },
        {
          type: "code",
          language: "bash",
          label: "In your shell",
          code: `# macOS / Linux:
export OPENAI_API_KEY="sk-..."

# Windows PowerShell:
$env:OPENAI_API_KEY = "sk-..."`,
        },
      ],
    },
    {
      step: 3,
      title: "The .env file",
      blocks: [
        {
          type: "text",
          content:
            "Typing exports every time is painful. Convention: put them in a `.env` file at your project root, and load it with a library.",
        },
        {
          type: "code",
          language: "text",
          label: ".env",
          code: `OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgres://localhost/mydb
DEBUG=true`,
        },
        {
          type: "code",
          language: "python",
          label: "Load it in Python",
          code: `# uv add python-dotenv
from dotenv import load_dotenv
import os

load_dotenv()                              # reads .env into os.environ
api_key = os.environ["OPENAI_API_KEY"]`,
        },
      ],
    },
    {
      step: 4,
      title: "NEVER commit .env",
      blocks: [
        {
          type: "code",
          language: "text",
          label: ".gitignore",
          code: `.env
.env.local
.env.*.local`,
        },
        {
          type: "callout",
          kind: "tip",
          title: "Ship .env.example instead",
          content:
            "Commit a *template* file that shows required variable names with empty or dummy values. Teammates copy it to `.env` and fill in their own keys.",
        },
        {
          type: "code",
          language: "text",
          label: ".env.example (safe to commit)",
          code: `OPENAI_API_KEY=your-key-here
ANTHROPIC_API_KEY=your-key-here
DATABASE_URL=postgres://localhost/mydb`,
        },
      ],
    },
    {
      step: 5,
      title: "In production: GitHub Secrets / cloud secret managers",
      blocks: [
        {
          type: "text",
          content:
            "`.env` is fine for local dev. In production, use the platform's secret store — GitHub Actions Secrets for CI, AWS Secrets Manager / Google Secret Manager / Vault for running services. Same code (`os.environ`), different source.",
        },
      ],
    },
    {
      step: 6,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Committing .env once, then adding it to .gitignore",
          content:
            "The file is already in Git history. Rotate the secret immediately. Then remove it from history with `git filter-repo` — `git rm` alone is not enough.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Printing the key in error logs",
          content:
            "`print(f\"Trying key {api_key}\")` leaks the secret to any log aggregator. Print prefixes only: `key[:6] + \"…\"`.",
        },
      ],
    },
    {
      step: 7,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You accidentally pushed `.env` with a live OpenAI key to a public repo. What's the correct response order?",
          options: [
            "Rotate the key on OpenAI first, then remove the file from Git history, then update your local .env with the new key.",
            "Remove the file with `git rm --cached .env`, then push.",
            "Make the repo private.",
            "Delete the repo.",
          ],
          correct: 0,
          explanation:
            "Rotate first — the moment it hits GitHub it's compromised. Making the repo private doesn't help (bots have already scraped). Removing with `git rm` alone leaves the key in history. Order matters: **rotate → scrub history → update local**.",
        },
      ],
    },
    {
      step: 8,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You know how to keep secrets safe. Next: **GPUs, CUDA, and running your first local LLM with Ollama** — putting the whole toolkit together.",
        },
      ],
    },
  ],
};

const ollamaGpu: Lesson = {
  slug: "gpu-cuda-ollama",
  trackSlug: "developer-setup",
  order: 10,
  minutes: 14,
  title: "GPUs, CUDA, and Running a Local LLM with Ollama",
  subtitle:
    "Take everything you've installed and put it together — run your first LLM on your own machine, then hit it from a Python client.",
  tags: ["GPU", "CUDA", "Ollama", "LLM"],
  sections: [
    {
      step: 1,
      title: "Why a GPU",
      blocks: [
        {
          type: "text",
          content:
            "A CPU has ~10 cores optimized for sequential work. A modern GPU has ~10,000 tiny cores optimized for doing the same operation on huge arrays in parallel — exactly what neural networks need. That's why GPU-trained models are 10–100× faster than CPU.",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "For inference (running a pretrained model), even a modest 8GB GPU can run 7B-parameter LLMs. For training, you want 24GB+ (RTX 4090, A100, H100). No GPU? CPU still works for small models — just slower.",
        },
      ],
    },
    {
      step: 2,
      title: "CUDA — the NVIDIA driver stack",
      blocks: [
        {
          type: "text",
          content:
            "CUDA is NVIDIA's proprietary API that lets code run on their GPUs. PyTorch, TensorFlow, and Ollama all speak CUDA under the hood. On Windows/Linux with an NVIDIA card, install the CUDA drivers from nvidia.com or via your OS package manager.",
        },
        {
          type: "kv",
          items: [
            { key: "NVIDIA GPU", value: "Use CUDA (the default and best-supported path)." },
            { key: "Apple Silicon (M1/M2/M3)", value: "Use PyTorch with the `mps` backend. Ollama runs natively on Metal." },
            { key: "AMD GPU", value: "Use ROCm on Linux (patchier support). Ollama has AMD support too." },
            { key: "No GPU", value: "PyTorch and Ollama fall back to CPU automatically." },
          ],
        },
      ],
    },
    {
      step: 3,
      title: "Check what you have",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "nvidia-smi (NVIDIA only)",
          code: `nvidia-smi
# Shows GPU model, VRAM, driver version, running processes.`,
        },
        {
          type: "code",
          language: "python",
          label: "Ask PyTorch",
          code: `import torch

print("CUDA available:", torch.cuda.is_available())
print("Device count:",   torch.cuda.device_count())
print("Device name:",    torch.cuda.get_device_name(0) if torch.cuda.is_available() else "cpu")

# Apple Silicon:
print("MPS available:",  torch.backends.mps.is_available())`,
        },
      ],
    },
    {
      step: 4,
      title: "Install Ollama",
      blocks: [
        {
          type: "text",
          content:
            "**Ollama** is a one-line install that runs open-source LLMs on your machine — Llama 3, Mistral, Qwen, Gemma, and more. It exposes an HTTP API on port 11434 that any client can hit.",
        },
        {
          type: "code",
          language: "bash",
          label: "Install",
          code: `# macOS:
brew install ollama

# Linux:
curl -fsSL https://ollama.com/install.sh | sh

# Windows: download the installer from ollama.com`,
        },
      ],
    },
    {
      step: 5,
      title: "Pull and chat with your first model",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "Terminal chat",
          code: `# Downloads the model the first time (few GB)
ollama pull llama3

# Interactive chat in the terminal
ollama run llama3
> What is a neural network?
# (type /bye to exit)`,
        },
        {
          type: "callout",
          kind: "tip",
          title: "Try smaller models first",
          content:
            "`llama3` is 8B params (~5GB). If it's too slow, try `phi3` (~2.3GB) or `qwen2:0.5b` (~400MB). Bigger = smarter, slower, more VRAM.",
        },
      ],
    },
    {
      step: 6,
      title: "Call Ollama from Python",
      blocks: [
        {
          type: "text",
          content:
            "Ollama is running a REST API at `http://localhost:11434`. Everything you learned about HTTP + JSON applies:",
        },
        {
          type: "code",
          language: "python",
          label: "call_ollama.py",
          code: `import requests

resp = requests.post(
    "http://localhost:11434/api/chat",
    json={
        "model": "llama3",
        "messages": [{"role": "user", "content": "Explain a neuron in 1 sentence."}],
        "stream": False,
    },
    timeout=120,
)
resp.raise_for_status()
print(resp.json()["message"]["content"])`,
        },
      ],
    },
    {
      step: 7,
      title: "Streaming responses",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "Stream tokens as they arrive",
          code: `import json, requests

resp = requests.post(
    "http://localhost:11434/api/chat",
    json={"model": "llama3", "messages": [{"role": "user", "content": "Count 1 to 5"}], "stream": True},
    stream=True, timeout=120,
)
for line in resp.iter_lines():
    if line:
        chunk = json.loads(line)
        print(chunk["message"]["content"], end="", flush=True)
print()`,
        },
      ],
    },
    {
      step: 8,
      title: "Wire it into FastAPI",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "main.py — a real local AI backend",
          code: `from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class Req(BaseModel):
    message: str

@app.post("/chat")
def chat(req: Req):
    r = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "llama3",
            "messages": [{"role": "user", "content": req.message}],
            "stream": False,
        },
        timeout=120,
    )
    r.raise_for_status()
    return {"reply": r.json()["message"]["content"]}`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "You now have: local LLM + Python venv + FastAPI + REST API + curl-testable endpoint. That's a complete, private, free-to-run AI stack.",
        },
      ],
    },
    {
      step: 9,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "\"connection refused\" from Python",
          content:
            "Ollama's daemon isn't running. On macOS/Windows, open the Ollama app. On Linux, `ollama serve &` starts it in the background.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Model too big for VRAM",
          content:
            "Trying to run llama3:70b on 8GB VRAM will fall back to CPU (painfully slow) or OOM. Match model size to your hardware — check `nvidia-smi` while it's running.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "First response is slow, subsequent are fast",
          content:
            "The model is loaded into VRAM on first call. Keep the daemon running to skip warm-up. Ollama unloads after a few minutes of idle by default.",
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
            "You call Ollama from Python and get a timeout after 60 seconds — but the same prompt works in the terminal. Most likely cause?",
          options: [
            "The default `requests.post` timeout is too short for a cold-start; the model is still loading into VRAM. Increase the timeout or warm the model first.",
            "Ollama doesn't support Python.",
            "You're missing an API key.",
            "The wrong port.",
          ],
          correct: 0,
          explanation:
            "Cold-loading a 7B model can take 30–90s depending on disk speed. The terminal command waits patiently; a Python request with a short timeout gives up. Bump `timeout=300` on the first call, or issue a lightweight warm-up prompt at startup.",
        },
      ],
    },
    {
      step: 11,
      title: "What's next — track finished",
      blocks: [
        {
          type: "text",
          content:
            "You now have every ingredient of a modern AI project: **Python, venvs, notebooks, VS Code, Git, the CLI, Docker, HTTP APIs, secret management, and a local LLM**. Every remaining track in this course builds on this foundation.",
        },
        {
          type: "text",
          content:
            "Next up: **Mathematics for AI** — vectors, matrices, gradients, and probability, taught through code.",
        },
      ],
    },
  ],
};

export const developerSetupLessons: Lesson[] = [
  installPython,
  virtualenvs,
  jupyter,
  vscode,
  gitGithub,
  commandLine,
  docker,
  restApis,
  envVars,
  ollamaGpu,
];
