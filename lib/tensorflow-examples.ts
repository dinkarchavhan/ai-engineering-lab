import type { Block } from "@/lib/content";

type TensorFlowExample = { title: string; note: string; code: string };

const trackExamples: Record<string, TensorFlowExample> = {
  "deep-learning": {
    title: "Keras neural-network equivalent",
    note: "This mirrors the standard Dense → activation → output pattern used throughout the Deep Learning lessons.",
    code: `# Install once inside your virtual environment:\n# python -m pip install tensorflow\n\nimport tensorflow as tf\n\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Input(shape=(8,)),\n    tf.keras.layers.Dense(32, activation=\"relu\"),\n    tf.keras.layers.Dropout(0.2),\n    tf.keras.layers.Dense(3),  # raw logits\n])\nmodel.compile(optimizer=tf.keras.optimizers.AdamW(3e-4),\n              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),\n              metrics=[\"accuracy\"])`,
  },
  "computer-vision": {
    title: "Keras computer-vision equivalent",
    note: "TensorFlow/Keras uses NHWC image tensors: batch, height, width, channels—unlike PyTorch's NCHW convention.",
    code: `# Install once: python -m pip install tensorflow\nimport tensorflow as tf\n\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Input(shape=(224, 224, 3)),\n    tf.keras.layers.Conv2D(16, 3, padding=\"same\", activation=\"relu\"),\n    tf.keras.layers.MaxPool2D(),\n    tf.keras.layers.Conv2D(32, 3, padding=\"same\", activation=\"relu\"),\n    tf.keras.layers.GlobalAveragePooling2D(),\n    tf.keras.layers.Dense(num_classes),\n])\n# model.compile(optimizer=\"adam\", loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True))`,
  },
  "nlp": {
    title: "Keras NLP equivalent",
    note: "Use TextVectorization for a small, local vocabulary; use a matched pretrained tokenizer for production Transformer checkpoints.",
    code: `# Install once: python -m pip install tensorflow\nimport tensorflow as tf\n\nvectorize = tf.keras.layers.TextVectorization(max_tokens=10_000, output_mode=\"int\", output_sequence_length=128)\nvectorize.adapt(train_texts)  # training text only\n\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Input(shape=(1,), dtype=tf.string),\n    vectorize,\n    tf.keras.layers.Embedding(10_000, 64, mask_zero=True),\n    tf.keras.layers.Bidirectional(tf.keras.layers.GRU(64)),\n    tf.keras.layers.Dense(num_classes),\n])`,
  },
  "transformers": {
    title: "Keras Transformer-attention equivalent",
    note: "Keras MultiHeadAttention provides the same Q/K/V attention operation; add residual paths, normalization, and an MLP to form a complete block.",
    code: `# Install once: python -m pip install tensorflow\nimport tensorflow as tf\n\nx = tf.keras.Input(shape=(None, 64))\nattn = tf.keras.layers.MultiHeadAttention(num_heads=4, key_dim=16)(x, x)\nx = tf.keras.layers.LayerNormalization()(x + attn)\nmlp = tf.keras.Sequential([tf.keras.layers.Dense(256, activation=\"gelu\"), tf.keras.layers.Dense(64)])(x)\nout = tf.keras.layers.LayerNormalization()(x + mlp)\nmodel = tf.keras.Model(inputs=x, outputs=out)`,
  },
  "generative-ai": {
    title: "Keras autoencoder equivalent",
    note: "This compact autoencoder is a safe starting point for the encoder/latent/decoder concept before trying VAEs, GANs, or diffusion training.",
    code: `# Install once: python -m pip install tensorflow\nimport tensorflow as tf\n\ninputs = tf.keras.Input(shape=(28, 28, 1))\nx = tf.keras.layers.Flatten()(inputs)\nz = tf.keras.layers.Dense(32, activation=\"relu\", name=\"latent\")(x)\nx = tf.keras.layers.Dense(28 * 28, activation=\"sigmoid\")(z)\noutputs = tf.keras.layers.Reshape((28, 28, 1))(x)\nautoencoder = tf.keras.Model(inputs, outputs)\nautoencoder.compile(optimizer=\"adam\", loss=\"mse\")\n# autoencoder.fit(images, images)`,
  },
  "llm-from-scratch": {
    title: "Keras causal-attention equivalent",
    note: "Keras can express the Tiny GPT building blocks too. `use_causal_mask=True` is the no-peeking rule needed for next-token prediction.",
    code: `# Install once: python -m pip install tensorflow\nimport tensorflow as tf\n\nids = tf.keras.Input(shape=(128,), dtype=\"int32\")\ntokens = tf.keras.layers.Embedding(vocab_size, 64)(ids)\npositions = tf.keras.layers.Embedding(128, 64)(tf.range(128))\nx = tokens + positions\nattn = tf.keras.layers.MultiHeadAttention(num_heads=4, key_dim=16)(x, x, use_causal_mask=True)\nx = tf.keras.layers.LayerNormalization()(x + attn)\nlogits = tf.keras.layers.Dense(vocab_size)(x)\ntiny_gpt = tf.keras.Model(ids, logits)`,
  },
  "embeddings-vector-db": {
    title: "TensorFlow Hub embeddings",
    note: "TensorFlow Hub provides pretrained sentence embeddings. Universal Sentence Encoder is production-ready for semantic similarity tasks.",
    code: `# Install once: python -m pip install tensorflow tensorflow-hub\nimport tensorflow as tf\nimport tensorflow_hub as hub\n\n# Load pretrained sentence encoder\nencoder = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")\n\n# Generate embeddings\nsentences = ["Machine learning is fascinating", "AI is transforming the world"]\nembeddings = encoder(sentences)\n\n# Compute cosine similarity\nsimilarity = tf.matmul(embeddings, embeddings, transpose_b=True)\nprint(f"Similarity: {similarity[0][1].numpy():.3f}")`,
  },
  "fine-tuning": {
    title: "Keras fine-tuning with LoRA-style approach",
    note: "While Keras doesn't have built-in LoRA, you can freeze base layers and add trainable adapter layers—the same core principle.",
    code: `# Install once: python -m pip install tensorflow transformers\nimport tensorflow as tf\nfrom transformers import TFAutoModel, AutoTokenizer\n\n# Load pretrained model and freeze it\nbase_model = TFAutoModel.from_pretrained("distilbert-base-uncased")\nbase_model.trainable = False\n\n# Add trainable classification head\ninputs = tf.keras.Input(shape=(128,), dtype=tf.int32)\nx = base_model(inputs).last_hidden_state[:, 0, :]  # [CLS] token\nx = tf.keras.layers.Dense(128, activation="relu")(x)  # adapter layer\noutputs = tf.keras.layers.Dense(num_classes)(x)\nmodel = tf.keras.Model(inputs, outputs)\n\nmodel.compile(optimizer=tf.keras.optimizers.Adam(3e-5),\n              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True))`,
  },
  "multimodal": {
    title: "TensorFlow multimodal fusion",
    note: "Combine image and text features by concatenating their representations before the final classification layer.",
    code: `# Install once: python -m pip install tensorflow\nimport tensorflow as tf\n\n# Image branch (CNN)\nimage_input = tf.keras.Input(shape=(224, 224, 3), name="image")\nx_img = tf.keras.applications.MobileNetV2(include_top=False, pooling="avg")(image_input)\nx_img = tf.keras.layers.Dense(256, activation="relu")(x_img)\n\n# Text branch (embedding + RNN)\ntext_input = tf.keras.Input(shape=(100,), dtype=tf.int32, name="text")\nx_txt = tf.keras.layers.Embedding(10_000, 128)(text_input)\nx_txt = tf.keras.layers.GlobalAveragePooling1D()(x_txt)\nx_txt = tf.keras.layers.Dense(256, activation="relu")(x_txt)\n\n# Fusion and classification\nfused = tf.keras.layers.Concatenate()([x_img, x_txt])\noutputs = tf.keras.layers.Dense(num_classes)(fused)\nmodel = tf.keras.Model([image_input, text_input], outputs)`,
  },
  "ai-infrastructure": {
    title: "TensorFlow Serving deployment",
    note: "TensorFlow Serving is production-grade infrastructure for serving models at scale with batching and version management.",
    code: `# Save model in SavedModel format for TF Serving\nimport tensorflow as tf\n\n# Your trained model\nmodel = tf.keras.Sequential([...])\nmodel.compile(...)\nmodel.fit(...)\n\n# Export for serving\nmodel.save("./model/1")  # version 1\n\n# Serve with Docker:\n# docker run -p 8501:8501 \\\n#   --mount type=bind,source=$(pwd)/model,target=/models/my_model \\\n#   -e MODEL_NAME=my_model -t tensorflow/serving\n\n# Client inference request:\n# curl -X POST http://localhost:8501/v1/models/my_model:predict \\\n#   -d '{"instances": [[1.0, 2.0, 3.0]]}'`,
  },
};

export function getTensorFlowBlocks(trackSlug: string): Block[] | undefined {
  const example = trackExamples[trackSlug];
  if (!example) return undefined;
  return [
    { type: "callout", kind: "tip", title: example.title, content: example.note },
    { type: "code", language: "python", label: "TensorFlow / Keras example", code: example.code },
  ];
}
