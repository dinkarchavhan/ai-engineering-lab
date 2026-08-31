import type { ProjectGuide, Section } from "@/lib/content";

type AiDatabaseSpec = {
  slug: string; title: string; description: string; database: string; pipeline: string; risk: string; extensions: string[]; hours: number;
};

function sections(p: AiDatabaseSpec): Section[] {
  return [
    { step: 1, title: "System scope, database, and security model", blocks: [
      { type: "text", content: p.description },
      { type: "diagram", label: "Text-to-SQL pipeline", chart: "flowchart LR\n  U[Natural language question] --> S[Schema retrieval]\n  S --> G[SQL generation]\n  G --> V[SQL validation]\n  V -->|invalid| G\n  V -->|valid| E[Safe execution]\n  E --> R[Result interpretation]\n  R --> A[Answer + optional chart]\n  V --> P[Permission check]\n  P -->|denied| D[Access denied response]" },
      { type: "kv", items: [
        { key: "Database", value: p.database },
        { key: "Pipeline", value: p.pipeline },
        { key: "Risk boundary", value: p.risk },
      ] },
      { type: "callout", kind: "warning", title: "Never execute LLM-generated SQL without validation", content: "The LLM can generate DROP TABLE, full-table scans, or subqueries that expose rows the user is not authorized to see. Validate every query against an allowlist of safe patterns, enforce read-only mode by default, and run permission checks before execution — not after." },
    ] },
    { step: 2, title: "Schema retrieval and context injection", blocks: [
      { type: "code", language: "bash", label: "Install dependencies", code: "python -m pip install anthropic sqlalchemy pydantic rich pandas" },
      { type: "code", language: "python", label: "Schema introspection and context builder", code: "from sqlalchemy import create_engine, inspect, text\nfrom pydantic import BaseModel\n\nclass ColumnInfo(BaseModel):\n    name: str\n    type: str\n    nullable: bool\n    primary_key: bool\n    foreign_keys: list[str] = []\n\nclass TableSchema(BaseModel):\n    name: str\n    columns: list[ColumnInfo]\n    row_count: int | None = None\n    sample_rows: list[dict] = []\n\ndef get_schema(engine, tables: list[str] | None = None, sample_n: int = 3) -> list[TableSchema]:\n    insp = inspect(engine)\n    target = tables or insp.get_table_names()\n    schemas = []\n    for tname in target:\n        cols = [\n            ColumnInfo(\n                name=c['name'], type=str(c['type']),\n                nullable=c['nullable'], primary_key=c['name'] in insp.get_pk_constraint(tname)['constrained_columns'],\n                foreign_keys=[str(f) for f in insp.get_foreign_keys(tname)],\n            )\n            for c in insp.get_columns(tname)\n        ]\n        with engine.connect() as conn:\n            rows = [dict(r._mapping) for r in conn.execute(text(f'SELECT * FROM {tname} LIMIT {sample_n}'))]\n            count = conn.execute(text(f'SELECT COUNT(*) FROM {tname}')).scalar()\n        schemas.append(TableSchema(name=tname, columns=cols, row_count=count, sample_rows=rows))\n    return schemas\n\ndef schema_to_prompt(schemas: list[TableSchema]) -> str:\n    lines = []\n    for s in schemas:\n        lines.append(f'Table: {s.name} ({s.row_count} rows)')\n        for c in s.columns:\n            pk = ' [PK]' if c.primary_key else ''\n            fk = f' → {c.foreign_keys[0]}' if c.foreign_keys else ''\n            lines.append(f'  {c.name}: {c.type}{pk}{fk}')\n        if s.sample_rows:\n            lines.append(f'  Sample: {s.sample_rows[0]}')\n    return '\\n'.join(lines)" },
      { type: "callout", kind: "insight", title: "Sample rows dramatically improve SQL quality", content: "Showing the model 2–3 representative rows per table lets it infer enum values, date formats, and string patterns without hallucinating. Always include samples in the schema context — just scrub any PII before sending them to an external API." },
    ] },
    { step: 3, title: "Generate and validate SQL", blocks: [
      { type: "code", language: "python", label: "SQL generation with schema context", code: "import anthropic, re\n\nclient = anthropic.Anthropic()\n\nSQL_SYSTEM = \"\"\"You are a SQL expert. Generate a single safe SELECT query for the question.\nRules:\n- Use only the tables and columns shown in the schema.\n- Never use INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, or TRUNCATE.\n- Always add a LIMIT clause (max 500 rows).\n- Prefer JOINs over subqueries for readability.\n- Return only the SQL query — no explanation, no markdown fences.\"\"\"\n\ndef generate_sql(question: str, schema_context: str) -> str:\n    response = client.messages.create(\n        model='claude-sonnet-4-6',\n        max_tokens=512,\n        system=SQL_SYSTEM,\n        messages=[{'role': 'user', 'content': f'Schema:\\n{schema_context}\\n\\nQuestion: {question}'}],\n    )\n    return response.content[0].text.strip()" },
      { type: "code", language: "python", label: "SQL validation before execution", code: "import sqlparse\nfrom sqlparse.sql import Statement\nfrom sqlparse.tokens import Keyword, DDL, DML\n\nFORBIDDEN_KEYWORDS = {'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE', 'EXEC', 'EXECUTE'}\n\ndef validate_sql(sql: str) -> tuple[bool, str]:\n    if not sql.strip().upper().startswith('SELECT'):\n        return False, 'Only SELECT queries are permitted'\n    parsed = sqlparse.parse(sql)\n    if not parsed:\n        return False, 'Could not parse SQL'\n    for stmt in parsed:\n        for token in stmt.flatten():\n            if token.ttype in (Keyword, DDL, DML) and token.normalized.upper() in FORBIDDEN_KEYWORDS:\n                return False, f'Forbidden keyword: {token.normalized}'\n    if 'LIMIT' not in sql.upper():\n        return False, 'Query must include a LIMIT clause'\n    return True, 'OK'" },
      { type: "callout", kind: "gotcha", title: "Parse-based validation beats string matching", content: "A simple string search for 'DROP' will reject queries containing 'dropdown' or column names like 'drop_date'. Use a proper SQL parser (sqlparse or sqlglot) to inspect token types — it is more accurate and harder to bypass." },
    ] },
    { step: 4, title: "Execute safely and interpret results", blocks: [
      { type: "code", language: "python", label: "Safe execution and natural-language interpretation", code: "import pandas as pd\nfrom sqlalchemy import text\n\ndef execute_query(engine, sql: str, max_rows: int = 500) -> pd.DataFrame | str:\n    valid, reason = validate_sql(sql)\n    if not valid:\n        return f'Query rejected: {reason}'\n    try:\n        with engine.connect() as conn:\n            result = conn.execute(text(sql))\n            rows = result.fetchmany(max_rows)\n            df = pd.DataFrame(rows, columns=result.keys())\n        return df\n    except Exception as e:\n        return f'Execution error: {e}'\n\ndef interpret_results(question: str, sql: str, df: pd.DataFrame) -> str:\n    if df.empty:\n        return 'The query returned no results.'\n    preview = df.head(10).to_markdown(index=False)\n    response = client.messages.create(\n        model='claude-sonnet-4-6',\n        max_tokens=512,\n        messages=[{'role': 'user', 'content': f'Question: {question}\\nSQL: {sql}\\nResults (first 10 rows):\\n{preview}\\n\\nAnswer the question in 1–3 clear sentences. If the result has many rows, summarize the pattern.'}],\n    )\n    return response.content[0].text.strip()" },
      { type: "callout", kind: "tip", title: "Return both the answer and the SQL", content: "Always show users the generated SQL alongside the natural-language answer. This builds trust, lets them spot wrong queries, and teaches them SQL. A hidden query pipeline feels like a black box — a visible one feels like a superpower." },
    ] },
    { step: 5, title: "Evaluate accuracy and ship", blocks: [
      { type: "code", language: "python", label: "Text-to-SQL evaluation harness", code: "from dataclasses import dataclass\n\n@dataclass\nclass SqlEvalCase:\n    id: str\n    question: str\n    expected_sql_pattern: str | None       # regex pattern the generated SQL should match\n    expected_row_count: int | None         # exact expected result count\n    must_contain_tables: list[str] = None  # tables that must appear in the query\n\ndef evaluate_pipeline(cases: list[SqlEvalCase], engine, schema_context: str) -> dict:\n    passed = 0\n    for case in cases:\n        sql = generate_sql(case.question, schema_context)\n        valid, _ = validate_sql(sql)\n        if not valid:\n            print(f'FAIL [{case.id}]: invalid SQL')\n            continue\n        result = execute_query(engine, sql)\n        if isinstance(result, str):\n            print(f'FAIL [{case.id}]: execution error')\n            continue\n        row_ok = case.expected_row_count is None or len(result) == case.expected_row_count\n        table_ok = all(t.lower() in sql.lower() for t in (case.must_contain_tables or []))\n        if row_ok and table_ok:\n            passed += 1\n        else:\n            print(f'FAIL [{case.id}]: rows={len(result)} expected={case.expected_row_count} tables_ok={table_ok}')\n    return {'pass_rate': passed / len(cases), 'n': len(cases)}" },
      { type: "list", style: "bullet", items: p.extensions.map((item) => `**${item}**`) },
      { type: "callout", kind: "tip", title: "Portfolio handoff", content: "Publish your schema (anonymized or synthetic), 10+ example question→SQL→answer pairs, your validation rules, eval pass rate, and at least one adversarial test showing an injection attempt being rejected. Record a short demo of a real question being answered end-to-end." },
    ] },
  ];
}

const specs: AiDatabaseSpec[] = [
  {
    slug: "nl-database-query",
    title: "Ask Questions About a Company Database in Plain English",
    hours: 12,
    description: "Build a text-to-SQL system that lets users ask natural-language questions about a relational database, generates safe validated SQL, executes it against the real database, and returns a plain-English answer with an optional chart — without exposing raw SQL execution to the LLM or the user.",
    database: "SQLite (local dev) or PostgreSQL (production). Schema: a sample company database with tables for customers, orders, products, employees, and sales.",
    pipeline: "Question → schema retrieval with sample rows → SQL generation → parse-based validation → permission check → safe execution → result interpretation → answer + optional chart.",
    risk: "Enforce read-only mode. Validate all SQL with a parser before execution. Cap result rows at 500. Never expose the database connection string. Parameterize any user-supplied filter values to prevent injection.",
    extensions: [
      "Add a chart-generation step: detect when results are numeric time-series or category aggregates and render a bar or line chart automatically",
      "Implement row-level permissions: inject a WHERE clause for the authenticated user's data scope before executing any query",
      "Add a query-retry loop: if the first SQL fails validation or execution, send the error back to the LLM and ask it to self-correct",
      "Build a FastAPI endpoint so the system is queryable via REST with JSON input and output",
      "Add a question-suggestion feature: given the schema, generate 5 example questions the user might want to ask",
    ],
  },
];

export const aiAndDatabasesProjects: ProjectGuide[] = specs.map((p) => ({
  slug: p.slug,
  trackSlug: "ai-and-databases",
  title: p.title,
  description: p.description,
  techStack: ["Python", "Anthropic SDK", "SQLAlchemy", "sqlparse", "Pandas", "FastAPI", "Pydantic"],
  difficulty: "intermediate",
  estimatedHours: p.hours,
  sections: sections(p),
}));
