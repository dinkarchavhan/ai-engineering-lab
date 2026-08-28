import type { ProjectGuide } from "@/lib/content";

export const generativeAiProjects: ProjectGuide[] = [
  {
    slug: "tiny-text-generator",
    trackSlug: "generative-ai",
    title: "Tiny Text Generator",
    description: "Train a compact character-level Transformer language model in TensorFlow/Keras, then generate text with temperature and top-k sampling. The project makes the full autoregressive loop visible without pretending a tiny model has reliable knowledge.",
    techStack: ["Python", "TensorFlow", "Keras", "TensorBoard", "Streamlit"],
    difficulty: "intermediate",
    estimatedHours: 7,
    sections: [
      { step: 1, title: "Data, objective, and guardrails", blocks: [
        { type: "kv", items: [
          { key: "Dataset", value: "Tiny Shakespeare corpus, supplied through TensorFlow’s public download endpoint." },
          { key: "Source", value: "storage.googleapis.com/download.tensorflow.org/data/shakespeare.txt" },
          { key: "Objective", value: "Given a prefix of characters, predict the next character at every position." },
          { key: "Evaluation", value: "Validation cross-entropy/perplexity plus qualitative samples across fixed prompts and seeds." },
        ] },
        { type: "diagram", label: "Autoregressive text generation", chart: "flowchart LR\n  C[Corpus] --> V[Character IDs]\n  V --> B[Input/target shifted batches]\n  B --> T[Causal Keras Transformer]\n  T --> L[Next-character cross-entropy]\n  L --> G[Temperature / top-k sampling]\n  G --> O[Generated continuation]" },
        { type: "callout", kind: "warning", title: "Keep expectations realistic", content: "This model learns surface patterns from a small corpus. It will not reason, retrieve facts, or produce dependable claims. State that clearly in any demo." },
      ] },
      { step: 2, title: "Create shifted language-model batches", blocks: [
        { type: "code", language: "python", label: "Download and tokenize", code: "import tensorflow as tf\n\npath = tf.keras.utils.get_file(\"shakespeare.txt\", \"https://storage.googleapis.com/download.tensorflow.org/data/shakespeare.txt\")\ntext = open(path, encoding=\"utf-8\").read()\nvocab = sorted(set(text))\nchar_to_id = {c: i for i, c in enumerate(vocab)}\nid_to_char = tf.constant(vocab)\nids = tf.constant([char_to_id[c] for c in text], dtype=tf.int32)\n\nseq_len = 128\nds = tf.data.Dataset.from_tensor_slices(ids).batch(seq_len + 1, drop_remainder=True)\nds = ds.map(lambda chunk: (chunk[:-1], chunk[1:])).shuffle(10_000).batch(64).prefetch(tf.data.AUTOTUNE)\nprint(len(vocab), len(text))" },
        { type: "callout", kind: "insight", title: "Why the shift matters", content: "At each position, the input is the characters seen so far and the target is the character one step to the right. That alignment is the language-model training objective." },
      ] },
      { step: 3, title: "Build a causal Keras Transformer", blocks: [
        { type: "code", language: "python", label: "Tiny GPT-style model", code: "from tensorflow import keras\nimport tensorflow as tf\n\nclass CausalBlock(keras.layers.Layer):\n    def __init__(self, d_model=128, heads=4, dropout=0.1):\n        super().__init__()\n        self.attn = keras.layers.MultiHeadAttention(heads, d_model // heads, dropout=dropout)\n        self.ffn = keras.Sequential([keras.layers.Dense(4*d_model, activation=\"gelu\"), keras.layers.Dense(d_model)])\n        self.n1, self.n2 = keras.layers.LayerNormalization(), keras.layers.LayerNormalization()\n    def call(self, x, training=False):\n        a = self.attn(x, x, use_causal_mask=True, training=training)\n        x = self.n1(x + a)\n        return self.n2(x + self.ffn(x, training=training))\n\ninputs = keras.Input((seq_len,), dtype=\"int32\")\npos = tf.range(seq_len)[None, :]\nx = keras.layers.Embedding(len(vocab), 128)(inputs) + keras.layers.Embedding(seq_len, 128)(pos)\nx = CausalBlock()(x); x = CausalBlock()(x)\nlogits = keras.layers.Dense(len(vocab))(x)\nmodel = keras.Model(inputs, logits)\nmodel.compile(optimizer=keras.optimizers.AdamW(3e-4, weight_decay=1e-4), loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=[\"accuracy\"])\nmodel.fit(ds, epochs=20, callbacks=[keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True), keras.callbacks.TensorBoard(\"runs/text\")])" },
        { type: "callout", kind: "gotcha", title: "Causal masking is non-negotiable", content: "Without `use_causal_mask=True`, the network can read future target characters during training. Loss may look excellent while generation fails because the inference condition is different." },
      ] },
      { step: 4, title: "Sample, evaluate, and publish", blocks: [
        { type: "code", language: "python", label: "Temperature and top-k sampling", code: "def generate(prompt, steps=300, temperature=0.8, top_k=8):\n    output = [char_to_id[c] for c in prompt]\n    for _ in range(steps):\n        x = tf.constant([output[-seq_len:] + [0] * max(0, seq_len - len(output))])[:, :seq_len]\n        next_logits = model(x, training=False)[0, min(len(output), seq_len) - 1] / temperature\n        values, indices = tf.math.top_k(next_logits, k=top_k)\n        next_id = int(indices[tf.random.categorical(values[None, :], 1)[0, 0]])\n        output.append(next_id)\n    return \"\".join(id_to_char.numpy()[i].decode() for i in output)\n\nprint(generate(\"ROMEO: \", temperature=0.7))\nmodel.save(\"tiny_text_generator.keras\")" },
        { type: "list", style: "bullet", items: ["Generate from the same prompts at several temperatures and record repetition/coherence trade-offs.", "Chart validation loss and report the chosen seed, corpus version, model size, and sampling settings.", "Add a Streamlit demo with an explicit experimental-model notice and no claim of factual accuracy." ] },
      ] },
    ],
  },
  {
    slug: "simple-image-generation-pipeline",
    trackSlug: "generative-ai",
    title: "Simple Image Generation Pipeline",
    description: "Train a TensorFlow/Keras variational autoencoder (VAE) on Fashion-MNIST, sample its latent space, and serve a compact image-generation demo. The project prioritizes stable, explainable training before attempting adversarial or diffusion models.",
    techStack: ["Python", "TensorFlow", "Keras", "Fashion-MNIST", "Matplotlib", "Streamlit"],
    difficulty: "intermediate",
    estimatedHours: 8,
    sections: [
      { step: 1, title: "Dataset and generation contract", blocks: [
        { type: "kv", items: [
          { key: "Dataset", value: "Fashion-MNIST: 28×28 grayscale clothing images, available from `tf.keras.datasets`." },
          { key: "Alternative", value: "Kaggle Fashion-MNIST mirrors can be used if you need a local CSV workflow." },
          { key: "Task", value: "Image → latent distribution → reconstruction; sample new latent vectors → generated clothing-like images." },
          { key: "Evaluation", value: "Reconstruction loss, generated sample grids, latent traversals, and disclosure that outputs are synthetic approximations." },
        ] },
        { type: "diagram", label: "VAE generation pipeline", chart: "flowchart LR\n  X[Fashion image] --> E[Encoder]\n  E --> M[Mean + log variance]\n  M --> Z[Reparameterized latent]\n  Z --> D[Decoder]\n  D --> R[Reconstruction]\n  N[Random normal latent] --> D\n  D --> G[New sample]" },
        { type: "callout", kind: "insight", title: "Why begin with a VAE?", content: "A VAE has a single stable objective—reconstruction plus latent regularization—and provides a structured latent space to explore. GANs and diffusion are worthwhile later extensions, not prerequisites." },
      ] },
      { step: 2, title: "Load and normalize images", blocks: [
        { type: "code", language: "python", label: "Fashion-MNIST pipeline", code: "import tensorflow as tf\n\n(x_train, _), (x_test, _) = tf.keras.datasets.fashion_mnist.load_data()\nx_train = (x_train.astype(\"float32\") / 255.0)[..., None]\nx_test = (x_test.astype(\"float32\") / 255.0)[..., None]\ntrain_ds = tf.data.Dataset.from_tensor_slices(x_train).shuffle(20_000).batch(128).prefetch(tf.data.AUTOTUNE)\ntest_ds = tf.data.Dataset.from_tensor_slices(x_test).batch(128).prefetch(tf.data.AUTOTUNE)" },
        { type: "callout", kind: "gotcha", title: "Match output activation to pixel scale", content: "The decoder below ends in sigmoid, so images must be in `[0, 1]`. If you normalize to `[-1, 1]`, use an appropriate output activation and reconstruction loss instead." },
      ] },
      { step: 3, title: "Implement the TensorFlow/Keras VAE", blocks: [
        { type: "code", language: "python", label: "Encoder, decoder, and custom train step", code: "from tensorflow import keras\nimport tensorflow as tf\n\nlatent_dim = 16\nencoder_inputs = keras.Input((28, 28, 1))\nx = keras.layers.Flatten()(encoder_inputs); x = keras.layers.Dense(256, activation=\"relu\")(x)\nz_mean, z_log_var = keras.layers.Dense(latent_dim)(x), keras.layers.Dense(latent_dim)(x)\nencoder = keras.Model(encoder_inputs, [z_mean, z_log_var])\n\nz = keras.Input((latent_dim,))\nx = keras.layers.Dense(256, activation=\"relu\")(z); x = keras.layers.Dense(28 * 28, activation=\"sigmoid\")(x)\ndecoder = keras.Model(z, keras.layers.Reshape((28, 28, 1))(x))\n\nclass VAE(keras.Model):\n    def train_step(self, data):\n        with tf.GradientTape() as tape:\n            mean, log_var = encoder(data)\n            eps = tf.random.normal(tf.shape(mean)); z = mean + tf.exp(0.5 * log_var) * eps\n            reconstruction = decoder(z)\n            recon_loss = tf.reduce_mean(tf.reduce_sum(keras.losses.binary_crossentropy(data, reconstruction), axis=(1, 2)))\n            kl_loss = -0.5 * tf.reduce_mean(tf.reduce_sum(1 + log_var - tf.square(mean) - tf.exp(log_var), axis=1))\n            loss = recon_loss + kl_loss\n        grads = tape.gradient(loss, encoder.trainable_weights + decoder.trainable_weights)\n        self.optimizer.apply_gradients(zip(grads, encoder.trainable_weights + decoder.trainable_weights))\n        return {\"loss\": loss, \"reconstruction_loss\": recon_loss, \"kl_loss\": kl_loss}\n\nvae = VAE(); vae.compile(optimizer=keras.optimizers.Adam(1e-3))\nvae.fit(train_ds, validation_data=test_ds, epochs=30)" },
        { type: "callout", kind: "gotcha", title: "Do not omit KL loss", content: "A reconstruction-only autoencoder may produce a latent space with holes that cannot be sampled reliably. The KL term nudges encodings toward a sampleable normal distribution." },
      ] },
      { step: 4, title: "Sample, inspect, and package", blocks: [
        { type: "code", language: "python", label: "Generate and visualize samples", code: "import matplotlib.pyplot as plt\n\nz = tf.random.normal((25, latent_dim), seed=42)\nsamples = decoder(z).numpy()\nfig, axes = plt.subplots(5, 5, figsize=(7, 7))\nfor ax, image in zip(axes.flat, samples):\n    ax.imshow(image.squeeze(), cmap=\"gray\"); ax.axis(\"off\")\nplt.tight_layout(); plt.show()\nencoder.save(\"fashion_encoder.keras\"); decoder.save(\"fashion_decoder.keras\")" },
        { type: "list", style: "bullet", items: ["Interpolate linearly between two encoded test images and render every latent step.", "Compare a standard autoencoder and VAE on reconstructions versus random latent samples.", "Add a Streamlit slider for a few latent dimensions, but label output as a low-resolution Fashion-MNIST sample—not a real product image.", "Extend with a DCGAN, then compare sample diversity, collapse risk, and training stability against the VAE." ] },
      ] },
    ],
  },
];
