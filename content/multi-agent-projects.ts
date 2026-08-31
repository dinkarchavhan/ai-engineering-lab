import type { ProjectGuide, Section } from "@/lib/content";

type MultiAgentSpec = {
  slug: string; title: string; description: string; topology: string; communication: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: MultiAgentSpec): Section[] {
  return [
    { step: 1, title: "Team topology, roles, and coordination strategy", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "Multi-agent team architecture", chart: "flowchart TD\n  U[User brief] --> PM[PM Agent\\n clarify + scope]\n  PM --> AR[Architect Agent\\n design + plan]\n  AR --> DEV[Developer Agent\\n implement]\n  DEV --> TEST[Tester Agent\\n write + run tests]\n  TEST -->|tests pass| REV[Reviewer Agent\\n code review]\n  TEST -->|tests fail| DEV\n  REV -->|approved| OUT[Deliverable]\n  REV -->|changes needed| DEV" },
      { type: "kv", items: [
        { key: "Topology", value: p.topology },
        { key: "Communication", value: p.communication },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Design for failure — agents will disagree and get stuck", content: "Multi-agent systems fail in non-obvious ways: agents loop, contradict each other, or produce conflicting artefacts. Define a maximum round count per agent, a tie-breaking rule for disagreements, and a human escalation path before writing any agent code." },
    ] },
    { step: 2, title: "Define the shared state and message bus", blocks: [
      { type: "code", language: "bash", label: "Install dependencies", code: "python -m pip install anthropic pydantic rich asyncio" },
      { type: "code", language: "python", label: "Shared project state and message schema", code: "from pydantic import BaseModel, Field\nfrom typing import Literal, Any\nfrom datetime import datetime\nimport uuid\n\nAgentRole = Literal['pm', 'architect', 'developer', 'tester', 'reviewer', 'supervisor']\n\nclass Message(BaseModel):\n    id: str = Field(default_factory=lambda: str(uuid.uuid4()))\n    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())\n    from_role: AgentRole\n    to_role: AgentRole | Literal['broadcast']\n    content: str\n    artefact: dict | None = None          # structured output attached to the message\n\nclass ProjectState(BaseModel):\n    goal: str\n    requirements: list[str] = []\n    architecture: str = ''\n    implementation: dict[str, str] = {}   # filename → code\n    test_results: dict[str, Any] = {}\n    review_notes: list[str] = []\n    status: Literal['planning', 'designing', 'implementing', 'testing', 'reviewing', 'done'] = 'planning'\n    round: int = 0\n    max_rounds: int = 5                   # hard cap per agent to prevent infinite loops\n    messages: list[Message] = []" },
      { type: "callout", kind: "insight", title: "Shared state prevents context drift", content: "Each agent must work from the same canonical project state, not from its own local memory. Pass the full ProjectState into every agent call and write updates back to the shared store. Agents that maintain private state diverge from each other within 2–3 rounds." },
    ] },
    { step: 3, title: "Implement specialist agents with role prompts", blocks: [
      { type: "code", language: "python", label: "Supervisor and specialist agent pattern", code: "import anthropic, json\n\nclient = anthropic.Anthropic()\n\nROLE_PROMPTS: dict[str, str] = {\n    'pm': 'You are a Product Manager. Given a user goal, produce a numbered list of clear, testable requirements. Ask clarifying questions before finalising scope. Output JSON: {\"requirements\": [...]}',\n    'architect': 'You are a Software Architect. Given requirements, produce a concise architecture: components, data flow, file structure, and tech choices. Output JSON: {\"architecture\": \"...\", \"files\": [...]}',\n    'developer': 'You are a Senior Developer. Implement the architecture. Write complete, runnable Python code. Output JSON: {\"files\": {\"filename.py\": \"<code>\"}}',\n    'tester': 'You are a QA Engineer. Write pytest tests for the implementation and report results. Output JSON: {\"tests\": {\"test_file.py\": \"<code>\"}, \"passed\": true/false, \"failures\": [...]}',\n    'reviewer': 'You are a Code Reviewer. Review code for correctness, security, and style. Output JSON: {\"approved\": true/false, \"comments\": [...], \"must_fix\": [...]}',\n}\n\ndef call_agent(role: str, context: str, state: ProjectState) -> dict:\n    prompt = f\"{ROLE_PROMPTS[role]}\\n\\nProject state:\\n{state.model_dump_json(indent=2)}\\n\\nYour task:\\n{context}\"\n    response = client.messages.create(\n        model='claude-sonnet-4-6',\n        max_tokens=4096,\n        messages=[{'role': 'user', 'content': prompt}],\n    )\n    text = response.content[0].text\n    try:\n        return json.loads(text[text.find('{'):text.rfind('}')+1])\n    except Exception:\n        return {'raw': text}" },
      { type: "callout", kind: "gotcha", title: "Each agent must return structured JSON", content: "Free-form text outputs from one agent become ambiguous inputs for the next. Force every agent to return a typed JSON schema. Validate the schema before passing output downstream — a malformed handoff corrupts the entire pipeline." },
    ] },
    { step: 4, title: "Implement the supervisor orchestration loop", blocks: [
      { type: "code", language: "python", label: "Supervisor orchestration with debate and retry", code: "from rich.console import Console\n\nconsole = Console()\n\ndef run_team(goal: str) -> ProjectState:\n    state = ProjectState(goal=goal)\n\n    # --- PM: clarify and scope ---\n    console.print('[bold cyan]PM Agent[/] scoping requirements...')\n    pm_out = call_agent('pm', 'Clarify the goal and produce requirements.', state)\n    state.requirements = pm_out.get('requirements', [])\n    state.status = 'designing'\n\n    # --- Architect: design ---\n    console.print('[bold blue]Architect Agent[/] designing...')\n    arch_out = call_agent('architect', 'Design the architecture for these requirements.', state)\n    state.architecture = arch_out.get('architecture', '')\n    state.status = 'implementing'\n\n    # --- Dev → Test → Review loop ---\n    for round_num in range(state.max_rounds):\n        state.round = round_num + 1\n        console.print(f'[bold green]Developer Agent[/] implementing (round {state.round})...')\n        dev_out = call_agent('developer', 'Implement the architecture.', state)\n        state.implementation = dev_out.get('files', {})\n\n        console.print('[bold yellow]Tester Agent[/] testing...')\n        test_out = call_agent('tester', 'Write and evaluate tests for the implementation.', state)\n        state.test_results = test_out\n\n        if not test_out.get('passed', False):\n            console.print(f'[red]Tests failed — round {state.round}/{state.max_rounds}[/]')\n            if state.round >= state.max_rounds:\n                console.print('[red]Max rounds reached — escalating to human.[/]')\n                break\n            continue\n\n        console.print('[bold magenta]Reviewer Agent[/] reviewing...')\n        review_out = call_agent('reviewer', 'Review the implementation for correctness and quality.', state)\n        state.review_notes = review_out.get('comments', [])\n\n        if review_out.get('approved'):\n            state.status = 'done'\n            break\n        else:\n            console.print(f'[yellow]Review requested changes — round {state.round}/{state.max_rounds}[/]')\n\n    return state" },
      { type: "callout", kind: "tip", title: "Log every agent handoff for debugging", content: "Multi-agent bugs are hard to reproduce. Append every Message to state.messages with timestamps and role labels. When something goes wrong you can replay the exact sequence of agent outputs that led to the failure." },
    ] },
    { step: 5, title: "Evaluate team output and ship", blocks: [
      { type: "code", language: "python", label: "Team evaluation harness", code: "from dataclasses import dataclass\n\n@dataclass\nclass TeamEvalCase:\n    id: str\n    goal: str\n    expected_files: list[str]             # files the developer must produce\n    expected_test_pass: bool = True\n    expected_review_approved: bool = True\n\ndef evaluate_team(cases: list[TeamEvalCase]) -> dict:\n    passed = 0\n    for case in cases:\n        state = run_team(case.goal)\n        files_ok = all(f in state.implementation for f in case.expected_files)\n        tests_ok = state.test_results.get('passed', False) == case.expected_test_pass\n        review_ok = any('approved' in str(n).lower() for n in state.review_notes) == case.expected_review_approved\n        if files_ok and tests_ok and review_ok:\n            passed += 1\n        else:\n            print(f'FAIL [{case.id}]: files={files_ok} tests={tests_ok} review={review_ok}')\n    return {'pass_rate': passed / len(cases), 'n': len(cases)}\n\nif __name__ == '__main__':\n    result = run_team('Build a Python CLI tool that converts CSV files to JSON')\n    print('Status:', result.status)\n    print('Files produced:', list(result.implementation.keys()))\n    print('Review notes:', result.review_notes)" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Record the full agent message log for a real end-to-end run. Publish the role prompts, the ProjectState schema, a diagram of the topology, round counts for 3+ example goals, and the eval pass rate. Show at least one run where the tester caught a real bug and the developer fixed it." },
    ] },
  ];
}

const specs: MultiAgentSpec[] = [
  {
    slug: "ai-software-development-team",
    title: "AI Software Development Team",
    hours: 14,
    description: "Build a multi-agent software development team where a PM agent clarifies requirements, an Architect agent designs the solution, a Developer agent implements it, a Tester agent writes and runs tests, and a Reviewer agent approves or requests changes — orchestrated by a Supervisor that manages the pipeline, handles failures, and knows when to escalate to a human.",
    topology: "Hierarchical pipeline: Supervisor → PM → Architect → Developer ↔ Tester loop → Reviewer. Reviewer failure routes back to Developer for a maximum of 5 rounds before human escalation.",
    communication: "Shared ProjectState passed through every agent call. All agent outputs appended to a message log with role, timestamp, and structured JSON artefact.",
    risk: "Never execute generated code automatically in production. Sandbox all test execution. Cap rounds per agent to prevent infinite loops. Require human approval before merging any generated pull request.",
    extensions: [
      "Add a DevOps agent that writes a Dockerfile and GitHub Actions CI workflow for the generated project",
      "Implement parallel developer agents: split the architecture into modules and build each concurrently, then merge",
      "Add a debate round: have two independent reviewer agents critique the code and reach consensus before approving",
      "Build a web UI that streams the agent message log in real time so users can watch the team work",
      "Add a SecurityAuditor agent that scans the generated code for OWASP Top 10 vulnerabilities before the reviewer approves",
    ],
  },
];

export const multiAgentProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "multi-agent",
  title: p.title,
  description: p.description,
  techStack: ["Python", "Anthropic SDK", "Pydantic", "Rich", "asyncio"],
  difficulty: "advanced",
  estimatedHours: p.hours,
  sections: sections(p),
}));
