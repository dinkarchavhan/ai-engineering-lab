import type { ProjectGuide } from "@/lib/content";

export const llmEngineeringProjects: ProjectGuide[] = [
  {
    slug: "function-calling-api-agent",
    trackSlug: "llm-engineering",
    title: "LLM function-calling agent that hits real APIs",
    description: "Build a reliable assistant that turns natural-language requests into validated tool calls for weather and currency data, executes only allow-listed tools, and returns a cited, structured answer. The guide deliberately separates model planning from deterministic API execution.",
    techStack: ["Python", "Pydantic", "Requests", "FastAPI", "TensorFlow", "Keras", "pytest"],
    difficulty: "intermediate",
    estimatedHours: 8,
    sections: [
      { step: 1, title: "Architecture and safety contract", blocks: [
        { type: "diagram", label: "Safe function-calling flow", chart: "flowchart LR\n  U[User request] --> R[Optional local intent router]\n  R --> P[LLM planner: structured tool call]\n  P --> V[Pydantic schema validation]\n  V --> A[Allow-listed tool executor]\n  A --> X[Weather / currency API]\n  X --> F[Structured factual result]\n  F --> O[LLM response with source/time]\n  V --> E[Clarification or safe error]" },
        { type: "kv", items: [
          { key: "Tools", value: "Current weather by coordinates; current currency conversion by ISO currency code." },
          { key: "Weather source", value: "Open-Meteo Forecast API — coordinate-based current conditions." },
          { key: "Currency source", value: "Frankfurter exchange-rate API — latest published currency rates." },
          { key: "Success criteria", value: "Invalid calls never reach an external API; every result has source, retrieval time, and input parameters." },
        ] },
        { type: "callout", kind: "warning", title: "The model must not execute arbitrary code", content: "Treat model output as untrusted data. The only executable actions are your explicitly registered functions after schema validation, authorization, rate limiting, and timeout controls." },
      ] },
      { step: 2, title: "Define strict tool schemas", blocks: [
        { type: "code", language: "python", label: "Pydantic contracts", code: "from typing import Literal\nfrom pydantic import BaseModel, Field\n\nclass WeatherArgs(BaseModel):\n    latitude: float = Field(ge=-90, le=90)\n    longitude: float = Field(ge=-180, le=180)\n    unit: Literal[\"celsius\", \"fahrenheit\"] = \"celsius\"\n\nclass CurrencyArgs(BaseModel):\n    amount: float = Field(gt=0, le=1_000_000)\n    base: str = Field(pattern=r\"^[A-Z]{3}$\")\n    quote: str = Field(pattern=r\"^[A-Z]{3}$\")\n\nTOOLS = {\n    \"get_weather\": WeatherArgs,\n    \"convert_currency\": CurrencyArgs,\n}\n# The model may name only keys in TOOLS; reject every other action." },
        { type: "code", language: "json", label: "Model-output shape", code: "{\n  \"tool\": \"convert_currency\",\n  \"arguments\": {\"amount\": 100, \"base\": \"USD\", \"quote\": \"INR\"},\n  \"reason\": \"The user asked for a live conversion.\"\n}" },
        { type: "callout", kind: "gotcha", title: "Validation is not optional", content: "Prompt instructions cannot replace runtime validation. Verify tool name, argument type/range, user authorization, and business rules after the model responds." },
      ] },
      { step: 3, title: "Implement deterministic API tools", blocks: [
        { type: "code", language: "python", label: "Timeouts, status checks, and provenance", code: "from datetime import datetime, timezone\nimport requests\n\ndef get_weather(args: WeatherArgs) -> dict:\n    response = requests.get(\n        \"https://api.open-meteo.com/v1/forecast\",\n        params={\"latitude\": args.latitude, \"longitude\": args.longitude, \"current\": \"temperature_2m,wind_speed_10m,weather_code\", \"temperature_unit\": args.unit},\n        timeout=10,\n    )\n    response.raise_for_status()\n    return {\"source\": \"Open-Meteo\", \"retrieved_at\": datetime.now(timezone.utc).isoformat(), \"data\": response.json()[\"current\"]}\n\ndef convert_currency(args: CurrencyArgs) -> dict:\n    response = requests.get(f\"https://api.frankfurter.dev/v2/rate/{args.base}/{args.quote}\", timeout=10)\n    response.raise_for_status()\n    rate = response.json()[\"rate\"]\n    return {\"source\": \"Frankfurter\", \"retrieved_at\": datetime.now(timezone.utc).isoformat(), \"amount\": args.amount, \"base\": args.base, \"quote\": args.quote, \"rate\": rate, \"converted\": args.amount * rate}" },
        { type: "callout", kind: "tip", title: "Build graceful failure paths", content: "Return a typed `tool_unavailable` result for timeouts, invalid API responses, and rate limits. Do not allow the LLM to invent a live value when the tool fails." },
      ] },
      { step: 4, title: "Route and execute a planned call", blocks: [
        { type: "code", language: "python", label: "Provider-agnostic executor", code: "import json\nfrom pydantic import BaseModel\n\nclass PlannedCall(BaseModel):\n    tool: str\n    arguments: dict\n    reason: str\n\nIMPLEMENTATIONS = {\"get_weather\": get_weather, \"convert_currency\": convert_currency}\n\ndef execute_planned_call(model_json: str) -> dict:\n    plan = PlannedCall.model_validate_json(model_json)\n    schema = TOOLS.get(plan.tool)\n    implementation = IMPLEMENTATIONS.get(plan.tool)\n    if schema is None or implementation is None:\n        raise ValueError(\"Tool is not allow-listed\")\n    args = schema.model_validate(plan.arguments)\n    return implementation(args)\n\n# Your selected LLM client should be instructed to return JSON matching PlannedCall.\n# Parse and validate that response here; never eval it or pass it to a shell." },
        { type: "callout", kind: "insight", title: "Keep the model’s job small", content: "The LLM decides whether a tool is useful and supplies arguments. Your application decides whether that call is permitted and performs the call. This boundary is the difference between a demo and a dependable agent." },
      ] },
      { step: 5, title: "Add a TensorFlow local intent router", blocks: [
        { type: "text", content: "Use a small TensorFlow/Keras classifier as a fast local pre-router: it can send obvious weather/currency requests to the structured planner and route unrelated input to a safe fallback. It does not replace the final schema validation." },
        { type: "code", language: "python", label: "Keras intent classifier", code: "import tensorflow as tf\nfrom tensorflow import keras\n\nexamples = tf.constant([\"weather in Delhi\", \"will it rain tomorrow\", \"convert USD to INR\", \"exchange 20 euros\", \"write me a poem\"])\nlabels = tf.constant([0, 0, 1, 1, 2])  # weather, currency, other\nvectorize = keras.layers.TextVectorization(max_tokens=2_000, output_mode=\"int\", output_sequence_length=24)\nvectorize.adapt(examples)\nrouter = keras.Sequential([keras.Input((1,), dtype=tf.string), vectorize, keras.layers.Embedding(2_000, 32, mask_zero=True), keras.layers.GlobalAveragePooling1D(), keras.layers.Dense(3)])\nrouter.compile(optimizer=\"adam\", loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=[\"accuracy\"])\nrouter.fit(examples, labels, epochs=40, verbose=0)\n# Replace the tiny examples with a labelled, consented intent dataset before real use." },
        { type: "callout", kind: "warning", title: "Do not train on five examples", content: "The snippet demonstrates architecture only. A production router needs representative held-out evaluation, a confidence threshold, monitoring, and a fallback route for ambiguous requests." },
      ] },
      { step: 6, title: "Test and deliver the API", blocks: [
        { type: "code", language: "python", label: "High-value tests", code: "def test_rejects_unknown_tool():\n    bad = '{\"tool\": \"delete_everything\", \"arguments\": {}, \"reason\": \"x\"}'\n    try:\n        execute_planned_call(bad)\n        assert False, \"must not execute unknown tools\"\n    except ValueError:\n        pass\n\ndef test_currency_args_reject_bad_code():\n    from pydantic import ValidationError\n    try:\n        CurrencyArgs(amount=10, base=\"USD\", quote=\"NOT_A_CURRENCY\")\n        assert False\n    except ValidationError:\n        pass" },
        { type: "list", style: "bullet", items: ["Wrap `execute_planned_call` in a FastAPI endpoint and log a redacted request ID, chosen tool, validation outcome, tool latency, and source timestamp.", "Mock external HTTP responses in tests; do not make live API calls part of a unit-test suite.", "Maintain a prompt-and-result evaluation set covering valid requests, ambiguous requests, prompt injection attempts, malformed JSON, unsupported tools, and upstream outages.", "In the UI, distinguish live tool results from model-generated prose and disclose source/time to the user." ] },
      ] },
    ],
  },
];
