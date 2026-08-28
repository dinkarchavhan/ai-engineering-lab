import type { ProjectGuide } from "@/lib/content";

export const transformerProjects: ProjectGuide[] = [
  {
    slug: "attention-visualizer",
    trackSlug: "transformers",
    title: "Attention visualizer",
    description: "Build an interactive TensorFlow/Keras tool that trains a tiny Transformer classifier and displays per-head self-attention maps for a chosen sentence. The aim is to make Q/K/V, masks, heads, and token positions inspectable—not to claim that attention alone explains a model decision.",
    techStack: ["Python", "TensorFlow", "Keras", "Streamlit", "Matplotlib", "TensorBoard"],
    difficulty: "intermediate",
    estimatedHours: 7,
    sections: [
      { step: 1, title: "Choose a small, inspectable task", blocks: [
        { type: "kv", items: [
          { key: "Dataset", value: "A compact labelled text dataset such as IMDB Reviews from TensorFlow Datasets; start with a balanced subset." },
          { key: "Alternative", value: "Use your own small, consented sentence-label CSV for a fully local visualizer." },
          { key: "Task", value: "Sentence → binary label, while retaining token-level attention scores." },
          { key: "Success criteria", value: "A trained model, input token display, selectable attention head, and an honest error/limitation panel." },
        ] },
        { type: "diagram", label: "Inspectable Transformer classifier", chart: "flowchart LR\n  T[Raw sentence] --> V[TextVectorization]\n  V --> E[Token + position embeddings]\n  E --> A[Custom MultiHeadAttention]\n  A --> M[Attention scores]\n  A --> H[Classifier head]\n  M --> UI[Token-by-token heatmap]\n  H --> UI" },
        { type: "callout", kind: "warning", title: "Interpret with care", content: "Attention maps show how one layer routes information. They do not prove that highlighted words caused the prediction. Pair them with error examples and, if needed, perturbation tests." },
      ] },
      { step: 2, title: "Prepare data and tokenization", blocks: [
        { type: "code", language: "bash", label: "Install", code: "python -m pip install tensorflow tensorflow-datasets streamlit matplotlib" },
        { type: "code", language: "python", label: "Train-only vocabulary", code: "import tensorflow as tf\nimport tensorflow_datasets as tfds\nfrom tensorflow import keras\n\ntrain_ds, test_ds = tfds.load(\"imdb_reviews\", split=[\"train[:80%]\", \"test\"], as_supervised=True)\nvectorize = keras.layers.TextVectorization(max_tokens=20_000, output_mode=\"int\", output_sequence_length=128)\nvectorize.adapt(train_ds.map(lambda text, label: text).batch(512))\ntrain_ds = train_ds.batch(64).prefetch(tf.data.AUTOTUNE)\ntest_ds = test_ds.batch(64).prefetch(tf.data.AUTOTUNE)" },
        { type: "callout", kind: "gotcha", title: "Avoid vocabulary leakage", content: "Adapt `TextVectorization` only on the training split. The held-out set should remain unseen by every learned preprocessing step, not only the model weights." },
      ] },
      { step: 3, title: "Return attention scores from a custom Keras model", blocks: [
        { type: "code", language: "python", label: "Model with score output", code: "import tensorflow as tf\nfrom tensorflow import keras\n\nclass AttentionClassifier(keras.Model):\n    def __init__(self, vocab_size, length=128, d_model=96, heads=4):\n        super().__init__()\n        self.tokens = keras.layers.Embedding(vocab_size, d_model, mask_zero=True)\n        self.positions = keras.layers.Embedding(length, d_model)\n        self.attn = keras.layers.MultiHeadAttention(num_heads=heads, key_dim=d_model // heads)\n        self.norm1, self.norm2 = keras.layers.LayerNormalization(), keras.layers.LayerNormalization()\n        self.ffn = keras.Sequential([keras.layers.Dense(4 * d_model, activation=\"gelu\"), keras.layers.Dense(d_model)])\n        self.pool, self.out = keras.layers.GlobalAveragePooling1D(), keras.layers.Dense(1, activation=\"sigmoid\")\n    def call(self, ids, training=False, return_scores=False):\n        pos = tf.range(tf.shape(ids)[1])[None, :]\n        x = self.tokens(ids) + self.positions(pos)\n        attended, scores = self.attn(x, x, return_attention_scores=True, training=training)\n        x = self.norm1(x + attended); x = self.norm2(x + self.ffn(x, training=training))\n        probability = self.out(self.pool(x))\n        return (probability, scores) if return_scores else probability\n\nmodel = AttentionClassifier(vocab_size=len(vectorize.get_vocabulary()))\nmodel.compile(optimizer=keras.optimizers.AdamW(1e-3), loss=\"binary_crossentropy\", metrics=[\"accuracy\"] )\nmodel.fit(train_ds.map(lambda text, y: (vectorize(text), y)), epochs=4)" },
        { type: "callout", kind: "insight", title: "What the score tensor means", content: "For self-attention, scores have one axis for heads and two token axes: query position × key position. Each query row should sum to approximately one over valid, unmasked tokens." },
      ] },
      { step: 4, title: "Render an attention heatmap", blocks: [
        { type: "code", language: "python", label: "Streamlit view", code: "import streamlit as st\nimport matplotlib.pyplot as plt\n\ntext = st.text_area(\"Sentence\", \"This movie was unexpectedly moving and beautifully acted.\")\nhead = st.slider(\"Attention head\", 0, 3, 0)\nids = vectorize(tf.constant([text]))\nprobability, scores = model(ids, return_scores=True)\ntokens = [vectorize.get_vocabulary()[i] for i in ids.numpy()[0] if i != 0]\nweights = scores.numpy()[0, head, :len(tokens), :len(tokens)]\nfig, ax = plt.subplots(figsize=(9, 7))\nax.imshow(weights, cmap=\"magma\"); ax.set_xticks(range(len(tokens)), tokens, rotation=70); ax.set_yticks(range(len(tokens)), tokens)\nst.metric(\"Positive probability\", f\"{float(probability[0, 0]):.1%}\"); st.pyplot(fig)\n# Run: streamlit run app.py" },
        { type: "list", style: "bullet", items: ["Add a query-token selector that displays only its attention distribution.", "Verify masking by padding a sentence and confirming visible-token scores do not change.", "Publish sample successes and failures; do not use the visualization as a sole model-explanation method." ] },
      ] },
    ],
  },
  {
    slug: "toy-encoder-decoder",
    trackSlug: "transformers",
    title: "Toy encoder-decoder built in PyTorch",
    description: "Train an English-to-Spanish toy Transformer translator. The main implementation uses TensorFlow/Keras so encoder self-attention, decoder causal masking, and cross-attention are explicit; a compact PyTorch equivalent is included to connect the project to the track title.",
    techStack: ["Python", "TensorFlow", "Keras", "PyTorch", "BLEU", "Streamlit"],
    difficulty: "advanced",
    estimatedHours: 10,
    sections: [
      { step: 1, title: "Dataset and split", blocks: [
        { type: "kv", items: [
          { key: "Dataset", value: "English–Spanish parallel text from TensorFlow’s `spa-eng` archive." },
          { key: "Source", value: "storage.googleapis.com/download.tensorflow.org/data/spa-eng.zip" },
          { key: "Task", value: "English token sequence → Spanish token sequence using teacher forcing during training." },
          { key: "Metrics", value: "BLEU on held-out pairs plus qualitative review of short, long, and unseen phrases." },
        ] },
        { type: "diagram", label: "Encoder-decoder Transformer", chart: "flowchart LR\n  S[English IDs] --> E[Encoder blocks]\n  E --> M[Source memory]\n  P[Spanish prefix] --> D[Masked decoder self-attention]\n  M --> X[Decoder cross-attention]\n  D --> X\n  X --> L[Next Spanish token logits]" },
        { type: "callout", kind: "warning", title: "Keep this scoped", content: "A small educational model trained on limited parallel text will make translation errors. Label any demo as experimental and do not use it for high-stakes, legal, medical, or safety content." },
      ] },
      { step: 2, title: "Build paired integer sequences", blocks: [
        { type: "code", language: "python", label: "Download and prepare pairs", code: "import io, zipfile, requests\nfrom tensorflow import keras\n\ncontent = requests.get(\"https://storage.googleapis.com/download.tensorflow.org/data/spa-eng.zip\", timeout=60).content\narchive = zipfile.ZipFile(io.BytesIO(content))\nlines = archive.read(\"spa-eng/spa.txt\").decode(\"utf-8\").splitlines()\npairs = [line.split(\"\\t\")[:2] for line in lines if \"\\t\" in line]\nsrc_text = [en for en, es in pairs]\ntgt_text = [\"[start] \" + es + \" [end]\" for en, es in pairs]\n# Split pairs first, then adapt source and target TextVectorization layers on train only." },
        { type: "code", language: "python", label: "Shift decoder targets", code: "source_ids = source_vectorizer(train_src)\ntarget_ids = target_vectorizer(train_tgt)\ndecoder_in = target_ids[:, :-1]\ndecoder_out = target_ids[:, 1:]\n# The model sees prior Spanish tokens and predicts the next token at each position." },
      ] },
      { step: 3, title: "Implement Transformer blocks with Keras", blocks: [
        { type: "code", language: "python", label: "Keras encoder/decoder skeleton", code: "import tensorflow as tf\nfrom tensorflow import keras\n\ndef causal_mask(length):\n    return tf.linalg.band_part(tf.ones((length, length), dtype=tf.bool), -1, 0)\n\nclass DecoderBlock(keras.layers.Layer):\n    def __init__(self, d_model=128, heads=4):\n        super().__init__()\n        self.self_attn = keras.layers.MultiHeadAttention(heads, d_model // heads)\n        self.cross_attn = keras.layers.MultiHeadAttention(heads, d_model // heads)\n        self.ffn = keras.Sequential([keras.layers.Dense(4*d_model, activation=\"gelu\"), keras.layers.Dense(d_model)])\n        self.n1, self.n2, self.n3 = keras.layers.LayerNormalization(), keras.layers.LayerNormalization(), keras.layers.LayerNormalization()\n    def call(self, x, memory, training=False):\n        mask = causal_mask(tf.shape(x)[1])\n        x = self.n1(x + self.self_attn(x, x, attention_mask=mask, training=training))\n        x = self.n2(x + self.cross_attn(x, memory, training=training))\n        return self.n3(x + self.ffn(x, training=training))\n# Combine token+position embeddings, encoder stack, DecoderBlock, and Dense(target_vocab) logits.\n# Compile with SparseCategoricalCrossentropy(from_logits=True), masking padded target labels." },
        { type: "callout", kind: "gotcha", title: "Two different masks", content: "The decoder must hide future target tokens with a causal mask and hide padding tokens with an attention/loss mask. Encoder padding must also be excluded from decoder cross-attention." },
      ] },
      { step: 4, title: "Decode and assess", blocks: [
        { type: "code", language: "python", label: "Autoregressive decoding contract", code: "# Start target_ids with the [start] ID.\n# Re-run the decoder, append argmax or sampled next ID, and stop on [end].\n# Never feed the reference translation at inference time.\n# Save vectorizers together with the model so IDs remain interpretable.\ntranslator.save(\"toy_translator.keras\")" },
        { type: "code", language: "python", label: "PyTorch framework comparison", code: "import torch.nn as nn\n# PyTorch exposes the same topology as a module:\nlayer = nn.TransformerDecoderLayer(d_model=128, nhead=4, batch_first=True)\ndecoder = nn.TransformerDecoder(layer, num_layers=2)\n# Pass a lower-triangular target mask and encoder memory; keep the data split and\n# evaluation identical before comparing TensorFlow and PyTorch results." },
        { type: "list", style: "bullet", items: ["Report BLEU only on held-out pairs and show source/reference/prediction examples.", "Add a cross-attention heatmap for one generated token, noting it is not a causal explanation.", "Compare greedy decoding against beam search after the baseline is correct." ] },
      ] },
    ],
  },
];
