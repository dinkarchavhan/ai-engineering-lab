import type { ProjectGuide } from "@/lib/content";

export const nlpProjects: ProjectGuide[] = [
  {
    slug: "text-classifier",
    trackSlug: "nlp",
    title: "Text classifier",
    description: "Build a sentiment classifier that starts with an interpretable TF-IDF baseline and finishes with a TensorFlow/Keras sequence model. The key outcome is a reproducible comparison, not merely a high accuracy score.",
    techStack: ["Python", "TensorFlow", "Keras", "scikit-learn", "Kaggle API", "TensorBoard"],
    difficulty: "beginner",
    estimatedHours: 6,
    sections: [
      { step: 1, title: "Dataset and success criteria", blocks: [
        { type: "kv", items: [
          { key: "Dataset", value: "Sentiment140 — 1.6M distantly-labelled tweets with negative/positive labels." },
          { key: "Kaggle source", value: "kaggle.com/datasets/kazanova/sentiment140" },
          { key: "Task", value: "Tweet text → negative or positive sentiment." },
          { key: "Metrics", value: "F1, precision, recall, and a confusion matrix on an untouched test split." },
        ] },
        { type: "diagram", label: "Classifier comparison", chart: "flowchart LR\n  D[Tweets + labels] --> S[Train/validation/test split]\n  S --> B[TF-IDF + Logistic Regression]\n  S --> K[TextVectorization + Keras model]\n  B --> C[Metrics and error slices]\n  K --> C" },
        { type: "callout", kind: "warning", title: "Treat labels as noisy", content: "Sentiment140 uses distant supervision. Manually inspect a small evaluation sample and report sarcasm, negation, and domain-shift failures instead of claiming every label is ground truth." },
      ] },
      { step: 2, title: "Load, clean, and split", blocks: [
        { type: "code", language: "bash", label: "Kaggle download", code: "pip install kaggle\n# Configure kaggle.json from Kaggle → Settings → API.\nkaggle datasets download -d kazanova/sentiment140 -p data\n# Extract the archive and identify the raw CSV encoding before reading it." },
        { type: "code", language: "python", label: "Minimal preparation", code: "import pandas as pd\nfrom sklearn.model_selection import train_test_split\n\ncols = [\"target\", \"id\", \"date\", \"flag\", \"user\", \"text\"]\ndf = pd.read_csv(\"data/training.1600000.processed.noemoticon.csv\", encoding=\"latin-1\", names=cols)\ndf = df[df.target.isin([0, 4])].assign(label=lambda d: (d.target == 4).astype(\"int32\"))\ntrain_text, test_text, y_train, y_test = train_test_split(df.text, df.label, test_size=0.1, random_state=42, stratify=df.label)" },
      ] },
      { step: 3, title: "Establish the classical baseline", blocks: [
        { type: "code", language: "python", label: "TF-IDF is a real baseline", code: "from sklearn.pipeline import make_pipeline\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\n\nbaseline = make_pipeline(\n    TfidfVectorizer(ngram_range=(1, 2), min_df=3, max_features=100_000, sublinear_tf=True),\n    LogisticRegression(max_iter=1_000, n_jobs=None),\n)\nbaseline.fit(train_text, y_train)\nprint(\"Baseline accuracy:\", baseline.score(test_text, y_test))" },
        { type: "callout", kind: "insight", title: "Why keep this model?", content: "It is fast, debuggable, and exposes influential n-grams. A neural model needs to earn its extra complexity by improving the chosen metric or deployment constraint." },
      ] },
      { step: 4, title: "Train the TensorFlow/Keras sequence model", blocks: [
        { type: "code", language: "python", label: "Keras text classifier", code: "import tensorflow as tf\nfrom tensorflow import keras\n\nvectorize = keras.layers.TextVectorization(max_tokens=30_000, output_mode=\"int\", output_sequence_length=80)\nvectorize.adapt(tf.data.Dataset.from_tensor_slices(train_text.to_numpy()).batch(1024))\nmodel = keras.Sequential([\n    keras.Input(shape=(1,), dtype=tf.string), vectorize,\n    keras.layers.Embedding(30_000, 128, mask_zero=True),\n    keras.layers.Bidirectional(keras.layers.GRU(64)),\n    keras.layers.Dropout(0.25), keras.layers.Dense(1, activation=\"sigmoid\"),\n])\nmodel.compile(optimizer=keras.optimizers.Adam(1e-3), loss=\"binary_crossentropy\", metrics=[\"accuracy\", keras.metrics.AUC(name=\"auc\")])\nmodel.fit(train_text.to_numpy(), y_train.to_numpy(), validation_split=0.1, batch_size=256, epochs=8, callbacks=[keras.callbacks.EarlyStopping(patience=2, restore_best_weights=True)])" },
        { type: "callout", kind: "gotcha", title: "Adapt text only on training data", content: "Calling `vectorize.adapt` on the full dataset leaks validation/test vocabulary statistics. Fit every learned preprocessing object exclusively on the training split." },
      ] },
      { step: 5, title: "Evaluate and ship", blocks: [
        { type: "code", language: "python", label: "Threshold-aware evaluation", code: "from sklearn.metrics import classification_report, ConfusionMatrixDisplay\nimport matplotlib.pyplot as plt\n\np = model.predict(test_text.to_numpy(), verbose=0).ravel()\npred = (p >= 0.5).astype(int)\nprint(classification_report(y_test, pred))\nConfusionMatrixDisplay.from_predictions(y_test, pred); plt.show()\nmodel.save(\"sentiment.keras\")" },
        { type: "list", style: "bullet", items: ["Compare Keras and TF-IDF scores, latency, and examples where they disagree.", "Build a Streamlit form that shows probability plus a clear note that sentiment is uncertain/noisy.", "Add tests for URL handling, empty text, Unicode emoji, and model input shape." ] },
      ] },
    ],
  },
  {
    slug: "semantic-similarity-engine",
    trackSlug: "nlp",
    title: "Semantic similarity engine",
    description: "Create a duplicate-question and semantic-search engine. It begins with TF-IDF cosine similarity, then learns a TensorFlow Siamese encoder that scores the similarity of two questions.",
    techStack: ["Python", "TensorFlow", "Keras", "scikit-learn", "Pandas", "Kaggle API"],
    difficulty: "intermediate",
    estimatedHours: 7,
    sections: [
      { step: 1, title: "Dataset and design", blocks: [
        { type: "kv", items: [
          { key: "Dataset", value: "Quora Question Pairs — labelled duplicate and non-duplicate question pairs." },
          { key: "Kaggle source", value: "kaggle.com/datasets/quora/question-pairs-dataset" },
          { key: "Task", value: "Question A + Question B → probability they express the same intent." },
          { key: "Metrics", value: "ROC-AUC and F1 after threshold selection on validation data." },
        ] },
        { type: "diagram", label: "Siamese similarity architecture", chart: "flowchart LR\n  A[Question A] --> E[Shared text encoder]\n  B[Question B] --> E\n  E --> VA[Embedding A]\n  E --> VB[Embedding B]\n  VA --> S[Similarity features]\n  VB --> S\n  S --> P[Duplicate probability]" },
        { type: "callout", kind: "warning", title: "Prevent question leakage", content: "A random row split can put the same question in training and validation through different pairs. For a more honest result, group/split by question ID when practical and state the protocol in the README." },
      ] },
      { step: 2, title: "Create a retrieval baseline", blocks: [
        { type: "code", language: "python", label: "TF-IDF cosine score", code: "from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.metrics.pairwise import cosine_similarity\n\nvectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=2)\nvectorizer.fit(train.question1.fillna(\"\").tolist() + train.question2.fillna(\"\").tolist())\nq1 = vectorizer.transform(valid.question1.fillna(\"\"))\nq2 = vectorizer.transform(valid.question2.fillna(\"\"))\nscore = cosine_similarity(q1, q2).diagonal()\n# Choose a threshold on validation data, never test data." },
      ] },
      { step: 3, title: "Build the TensorFlow Siamese model", blocks: [
        { type: "code", language: "python", label: "Shared Keras encoder", code: "import tensorflow as tf\nfrom tensorflow import keras\n\nvectorize = keras.layers.TextVectorization(max_tokens=40_000, output_mode=\"int\", output_sequence_length=40)\nvectorize.adapt(train.question1.fillna(\"\").to_numpy())  # include both columns in a real run\nencoder_input = keras.Input((1,), dtype=tf.string)\nx = vectorize(encoder_input)\nx = keras.layers.Embedding(40_000, 128, mask_zero=True)(x)\nx = keras.layers.Bidirectional(keras.layers.GRU(64))(x)\nencoder = keras.Model(encoder_input, x, name=\"question_encoder\")\n\nq1, q2 = keras.Input((1,), dtype=tf.string, name=\"q1\"), keras.Input((1,), dtype=tf.string, name=\"q2\")\na, b = encoder(q1), encoder(q2)\nfeatures = keras.layers.Concatenate()([keras.layers.Subtract()([a, b]), keras.layers.Multiply()([a, b])])\nout = keras.layers.Dense(1, activation=\"sigmoid\")(features)\nsiamese = keras.Model([q1, q2], out)\nsiamese.compile(optimizer=keras.optimizers.Adam(1e-3), loss=\"binary_crossentropy\", metrics=[keras.metrics.AUC(name=\"auc\")])" },
        { type: "callout", kind: "tip", title: "Use the same encoder weights", content: "The same `encoder` object is called for both questions. Two separate encoders would learn incompatible vector spaces and defeat the point of a Siamese design." },
      ] },
      { step: 4, title: "Score, retrieve, and document", blocks: [
        { type: "code", language: "python", label: "Threshold and inspect results", code: "from sklearn.metrics import f1_score, roc_auc_score\n\np = siamese.predict({\"q1\": valid.question1.fillna(\"\").to_numpy(), \"q2\": valid.question2.fillna(\"\").to_numpy()}, verbose=0).ravel()\nprint(\"Validation ROC-AUC:\", roc_auc_score(valid.is_duplicate, p))\nfor threshold in [0.3, 0.5, 0.7]:\n    print(threshold, f1_score(valid.is_duplicate, p >= threshold))\nencoder.save(\"question_encoder.keras\")" },
        { type: "list", style: "bullet", items: ["Index corpus embeddings and return top-k similar questions with the score and source text.", "Review false duplicate and missed duplicate examples for spelling, negation, and topic bias.", "Respect the dataset’s stated non-commercial terms when sharing a demo or derivative data." ] },
      ] },
    ],
  },
  {
    slug: "simple-translator",
    trackSlug: "nlp",
    title: "Simple translator",
    description: "Train a small English-to-Spanish sequence-to-sequence translator in TensorFlow/Keras. It is a learning project: measure against held-out pairs, expose uncertain outputs, and do not present it as a replacement for professional translation services.",
    techStack: ["Python", "TensorFlow", "Keras", "TensorFlow Datasets", "BLEU", "Streamlit"],
    difficulty: "advanced",
    estimatedHours: 10,
    sections: [
      { step: 1, title: "Data and experiment contract", blocks: [
        { type: "kv", items: [
          { key: "Dataset", value: "English–Spanish parallel sentence pairs (`spa-eng`); begin with a small cleaned subset." },
          { key: "Source", value: "storage.googleapis.com/download.tensorflow.org/data/spa-eng.zip" },
          { key: "Task", value: "English sentence → Spanish sequence, including start/end tokens." },
          { key: "Metrics", value: "BLEU on held-out sentence pairs plus human inspection for fluency and adequacy." },
        ] },
        { type: "diagram", label: "Seq2seq translation", chart: "flowchart LR\n  E[English tokens] --> EN[Encoder GRU]\n  EN --> H[Context state]\n  H --> DE[Decoder GRU]\n  S[Previous Spanish token] --> DE\n  DE --> P[Next-token distribution]\n  P --> S" },
        { type: "callout", kind: "warning", title: "Translation quality is contextual", content: "BLEU is only one signal. Check names, negation, gender, tense, and out-of-domain sentences. Never use a toy model for safety-critical or legal translation." },
      ] },
      { step: 2, title: "Download and vectorize parallel text", blocks: [
        { type: "code", language: "python", label: "Acquire and parse pairs", code: "import io, zipfile, requests\n\nurl = \"https://storage.googleapis.com/download.tensorflow.org/data/spa-eng.zip\"\narchive = zipfile.ZipFile(io.BytesIO(requests.get(url, timeout=60).content))\nlines = archive.read(\"spa-eng/spa.txt\").decode(\"utf-8\").splitlines()\npairs = [line.split(\"\\t\")[:2] for line in lines if \"\\t\" in line]\nenglish = [a for a, _ in pairs]; spanish = [\"[start] \" + b + \" [end]\" for _, b in pairs]\n# Split pairs before adapting vocabulary layers." },
        { type: "code", language: "python", label: "Training-only vocabularies", code: "from tensorflow import keras\n\nsrc_vec = keras.layers.TextVectorization(max_tokens=20_000, output_mode=\"int\", output_sequence_length=24)\ntgt_vec = keras.layers.TextVectorization(max_tokens=20_000, output_mode=\"int\", output_sequence_length=25, standardize=None)\nsrc_vec.adapt(train_english)\ntgt_vec.adapt(train_spanish)" },
      ] },
      { step: 3, title: "Train a TensorFlow encoder-decoder baseline", blocks: [
        { type: "code", language: "python", label: "Keras seq2seq model", code: "import tensorflow as tf\nfrom tensorflow import keras\n\nvocab_size, embed_dim, units = 20_000, 256, 256\nsource = keras.Input((24,), dtype=\"int32\")\nencoder_x = keras.layers.Embedding(vocab_size, embed_dim, mask_zero=True)(source)\n_, state = keras.layers.GRU(units, return_state=True)(encoder_x)\ntarget_in = keras.Input((24,), dtype=\"int32\")\ndecoder_x = keras.layers.Embedding(vocab_size, embed_dim, mask_zero=True)(target_in)\ndecoder_x = keras.layers.GRU(units, return_sequences=True)(decoder_x, initial_state=state)\nlogits = keras.layers.Dense(vocab_size)(decoder_x)\ntranslator = keras.Model([source, target_in], logits)\ntranslator.compile(optimizer=keras.optimizers.Adam(1e-3), loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=[\"accuracy\"])\n# Fit with decoder inputs target[:, :-1] and labels target[:, 1:] (teacher forcing)." },
        { type: "callout", kind: "gotcha", title: "Shift targets by one token", content: "The decoder sees previous target tokens and learns to predict the next one. Feeding the unshifted target as both input and label lets it copy its answer and invalidates the learning objective." },
      ] },
      { step: 4, title: "Decode and evaluate", blocks: [
        { type: "code", language: "python", label: "Greedy decoding contract", code: "# At inference, start with [start], repeatedly predict one token, append it,\n# and stop at [end] or a maximum length. Use the same source/target vocabularies\n# saved with the model. Evaluate only on held-out sentence pairs.\ntranslator.save(\"english_spanish_translator.keras\")\n# Add beam search only after the greedy baseline is correct and tested." },
        { type: "list", style: "bullet", items: ["Report BLEU together with several source / reference / prediction triples.", "Add attention after the GRU baseline and compare long-sentence errors.", "Build a small demo that labels results as experimental and retains no user text by default." ] },
      ] },
    ],
  },
];
