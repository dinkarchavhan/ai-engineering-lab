import type { ProjectGuide } from "@/lib/content";

export const llmFromScratchProjects: ProjectGuide[] = [
  {
    slug: "tiny-gpt-from-scratch",
    trackSlug: "llm-from-scratch",
    title: "Tiny GPT — a working language model you built line-by-line",
    description: "Implement a compact GPT from the data stream to sampled output. TensorFlow/Keras is used for the training machinery, but tokenization, shifted targets, causal attention, Transformer blocks, validation, sampling, and checkpoint metadata remain explicit and inspectable.",
    techStack: ["Python", "TensorFlow", "Keras", "TensorBoard", "pytest", "Kaggle API"],
    difficulty: "advanced",
    estimatedHours: 12,
    sections: [
      { step: 1, title: "Define the training contract", blocks: [
        { type: "kv", items: [
          { key: "Starter corpus", value: "Tiny Shakespeare, downloaded through TensorFlow’s public endpoint; use only permitted text." },
          { key: "Kaggle alternative", value: "A public-domain books or TinyStories mirror, after checking its license and provenance." },
          { key: "Objective", value: "Given token IDs x₀…xₜ, predict the next ID at every position." },
          { key: "Primary metric", value: "Held-out cross-entropy; perplexity is exp(cross-entropy) when using natural logs." },
          { key: "First milestone", value: "Overfit a tiny data slice before starting a longer run." },
        ] },
        { type: "diagram", label: "Tiny GPT from data to sampling", chart: "flowchart LR\n  C[Permitted corpus] --> T[Tokenizer + vocabulary]\n  T --> I[Token ID stream]\n  I --> B[Shifted fixed-length batches]\n  B --> G[Token + position embeddings]\n  G --> X[Causal Transformer blocks]\n  X --> L[Vocabulary logits + loss]\n  L --> S[Temperature / top-k sampling]" },
        { type: "callout", kind: "warning", title: "Data governance is part of the project", content: "Do not train on private, scraped, or unlicensed text. Record corpus source, filtering, language, split method, and known bias/coverage gaps in a model card." },
      ] },
      { step: 2, title: "Build the token stream and batch loader", blocks: [
        { type: "code", language: "python", label: "Character-level teaching tokenizer", code: "import tensorflow as tf\n\nurl = \"https://storage.googleapis.com/download.tensorflow.org/data/shakespeare.txt\"\npath = tf.keras.utils.get_file(\"shakespeare.txt\", url)\ntext = open(path, encoding=\"utf-8\").read()\nvocab = sorted(set(text))\nchar_to_id = {c: i for i, c in enumerate(vocab)}\nid_to_char = tf.constant(vocab)\nids = tf.constant([char_to_id[c] for c in text], dtype=tf.int32)\n\nblock_size = 128\n# Deterministic corpus split: do not let chunks cross validation boundary.\ncut = int(0.9 * len(ids)); train_ids, val_ids = ids[:cut], ids[cut:]\ndef make_ds(stream, shuffle=False):\n    ds = tf.data.Dataset.from_tensor_slices(stream).batch(block_size + 1, drop_remainder=True)\n    ds = ds.map(lambda chunk: (chunk[:-1], chunk[1:]), num_parallel_calls=tf.data.AUTOTUNE)\n    if shuffle: ds = ds.shuffle(10_000, seed=42)\n    return ds.batch(64).prefetch(tf.data.AUTOTUNE)\ntrain_ds, val_ds = make_ds(train_ids, True), make_ds(val_ids)" },
        { type: "callout", kind: "insight", title: "Character first, BPE next", content: "A character tokenizer keeps every moving part visible. Once the pipeline is correct, replace it with a trained byte-pair tokenizer, save its vocabulary/merges beside the checkpoint, and keep the model input/output contract unchanged: integer IDs." },
        { type: "code", language: "python", label: "High-value shifted-target test", code: "chunk = tf.constant([1, 2, 3, 4, 5, 6])\nx, y = chunk[:-1], chunk[1:]\n# Every target except the final token must be input shifted left by one.\nassert tf.reduce_all(x[1:] == y[:-1])" },
      ] },
      { step: 3, title: "Implement the causal Transformer", blocks: [
        { type: "code", language: "python", label: "GPT block and model", code: "from tensorflow import keras\nimport tensorflow as tf\n\nclass GPTBlock(keras.layers.Layer):\n    def __init__(self, d_model, heads, dropout=0.1):\n        super().__init__()\n        self.n1, self.n2 = keras.layers.LayerNormalization(), keras.layers.LayerNormalization()\n        self.attn = keras.layers.MultiHeadAttention(num_heads=heads, key_dim=d_model // heads, dropout=dropout)\n        self.mlp = keras.Sequential([keras.layers.Dense(4*d_model, activation=\"gelu\"), keras.layers.Dropout(dropout), keras.layers.Dense(d_model)])\n    def call(self, x, training=False):\n        a = self.attn(self.n1(x), self.n1(x), use_causal_mask=True, training=training)\n        x = x + a\n        return x + self.mlp(self.n2(x), training=training)\n\ndef build_gpt(vocab_size, block_size, d_model=192, heads=4, layers=4):\n    ids = keras.Input((block_size,), dtype=\"int32\")\n    positions = tf.range(block_size)[None, :]\n    x = keras.layers.Embedding(vocab_size, d_model, name=\"token_embedding\")(ids)\n    x += keras.layers.Embedding(block_size, d_model, name=\"position_embedding\")(positions)\n    for _ in range(layers): x = GPTBlock(d_model, heads)(x)\n    x = keras.layers.LayerNormalization()(x)\n    return keras.Model(ids, keras.layers.Dense(vocab_size, name=\"logits\")(x))\n\nmodel = build_gpt(len(vocab), block_size)\nmodel.compile(optimizer=keras.optimizers.AdamW(learning_rate=3e-4, weight_decay=1e-4), loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=[\"accuracy\"])\nmodel.summary()" },
        { type: "callout", kind: "gotcha", title: "Test no-peeking directly", content: "Create two inputs that match through position t and differ only after t. The logits through t must be identical in evaluation mode. This catches a missing or inverted causal mask before costly training." },
      ] },
      { step: 4, title: "Train, validate, and checkpoint", blocks: [
        { type: "code", language: "python", label: "Disciplined training run", code: "callbacks = [\n    keras.callbacks.EarlyStopping(monitor=\"val_loss\", patience=4, restore_best_weights=True),\n    keras.callbacks.ModelCheckpoint(\"checkpoints/tiny_gpt.keras\", monitor=\"val_loss\", save_best_only=True),\n    keras.callbacks.TensorBoard(\"runs/tiny_gpt\"),\n]\n# First run on 1–2 batches until loss nearly reaches zero. Then train normally.\nhistory = model.fit(train_ds, validation_data=val_ds, epochs=30, callbacks=callbacks)\nprint(\"Best validation loss:\", min(history.history[\"val_loss\"]))\n\nimport json\nwith open(\"checkpoints/tokenizer_config.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump({\"type\": \"character\", \"vocab\": vocab, \"block_size\": block_size}, f)" },
        { type: "callout", kind: "tip", title: "Monitor the right things", content: "Record train loss, validation loss, tokens processed, model parameter count, seed, data version, and hardware. Generated samples are useful diagnostics, but validation loss is the trustworthy training signal." },
      ] },
      { step: 5, title: "Sample from logits", blocks: [
        { type: "code", language: "python", label: "Temperature + top-k generation", code: "def sample_next(logits, temperature=0.8, top_k=10):\n    logits = logits / temperature\n    values, indices = tf.math.top_k(logits, k=top_k)\n    selected = tf.random.categorical(values[None, :], 1)[0, 0]\n    return int(indices[selected])\n\ndef generate(prompt, max_new_tokens=300, temperature=0.8, top_k=10):\n    output = [char_to_id[c] for c in prompt]\n    for _ in range(max_new_tokens):\n        context = output[-block_size:]\n        padded = context + [0] * (block_size - len(context))\n        logits = model(tf.constant([padded]), training=False)[0, len(context) - 1]\n        output.append(sample_next(logits, temperature, top_k))\n    return \"\".join(id_to_char.numpy()[i].decode() for i in output)\n\nprint(generate(\"ROMEO: \", temperature=0.7, top_k=8))" },
        { type: "callout", kind: "gotcha", title: "Separate training from sampling", content: "During sampling, use `training=False` so dropout is disabled. Sampling settings change variety, not capability or factuality; save them with every showcase output." },
      ] },
      { step: 6, title: "Ship the project", blocks: [
        { type: "list", style: "bullet", items: [
          "Publish model code, tokenizer code/configuration, requirements, checkpoint loading instructions, and tests for batch shifts and causal masking.",
          "Include a model card: data provenance/license, parameter count, split, final validation loss, sample settings, limitations, and intended use.",
          "Create a small Streamlit demo that exposes prompt, temperature, and top-k; cap output length and label it as an educational, ungrounded model.",
          "Extension: replace characters with a BPE tokenizer, use a larger permitted corpus, and compare validation loss at the same parameter budget." 
        ] },
      ] },
    ],
  },
];
