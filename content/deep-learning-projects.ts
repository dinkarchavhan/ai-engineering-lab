import type { ProjectGuide } from "@/lib/content";

export const deepLearningProjects: ProjectGuide[] = [
  {
    slug: "mnist-neural-network",
    trackSlug: "deep-learning",
    title: "Handwritten neural network trained on MNIST — no framework",
    description:
      "Build the learning mechanics once with NumPy, then train and improve the same classifier with TensorFlow/Keras. The project makes backpropagation, optimizer choice, regularization, and validation behavior visible on real image data.",
    techStack: ["Python", "NumPy", "TensorFlow", "Keras", "Matplotlib", "Kaggle API"],
    difficulty: "intermediate",
    estimatedHours: 8,
    sections: [
      {
        step: 1,
        title: "What you’re building",
        blocks: [
          { type: "text", content: "A 10-class handwritten-digit classifier. First, implement a two-layer neural network and its backpropagation manually. Then create the TensorFlow/Keras version, add callbacks and regularization, and compare their learning curves and test accuracy." },
          { type: "diagram", label: "MNIST training pipeline", chart: "flowchart LR\n  D[MNIST images] --> N[Normalize and flatten]\n  N --> S[NumPy network\nforward + backprop]\n  N --> K[TensorFlow / Keras network]\n  S --> E[Accuracy, loss, confusion matrix]\n  K --> E\n  E --> I[Inspect errors and improve model]" },
          { type: "kv", items: [
            { key: "Input", value: "28×28 grayscale image, flattened to 784 values for the dense-network baseline." },
            { key: "Target", value: "One of 10 digit classes (0–9)." },
            { key: "Primary metric", value: "Test accuracy, supported by a confusion matrix to find the digits the model confuses." },
            { key: "Goal", value: "Understand every gradient in the NumPy version; target roughly 97%+ test accuracy with the TensorFlow dense model." },
          ] },
        ],
      },
      {
        step: 2,
        title: "Get the dataset",
        blocks: [
          { type: "code", language: "python", label: "Recommended: TensorFlow’s built-in MNIST loader", code: "import tensorflow as tf\n\n(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()\nprint(x_train.shape, y_train.shape)  # (60000, 28, 28), (60000,)" },
          { type: "code", language: "bash", label: "Kaggle alternative: Digit Recognizer", code: "pip install kaggle\n# Create an API token at Kaggle → Settings → API, then configure kaggle.json.\nkaggle competitions download -c digit-recognizer -p data\n# Extract data/digit-recognizer.zip; train.csv has label plus 784 pixel columns." },
          { type: "callout", kind: "tip", title: "Why use the built-in loader?", content: "It downloads the canonical MNIST split automatically and lets you focus on training. The Kaggle Digit Recognizer is a useful extension when you want a submission workflow." },
        ],
      },
      {
        step: 3,
        title: "Prepare inputs and a validation set",
        blocks: [
          { type: "code", language: "python", label: "Reproducible preprocessing", code: "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# Float values in [0, 1] make gradients and optimization much more stable.\nX = x_train.reshape(-1, 28 * 28).astype(\"float32\") / 255.0\nX_test = x_test.reshape(-1, 28 * 28).astype(\"float32\") / 255.0\nX_train, X_val, y_train, y_val = train_test_split(\n    X, y_train, test_size=0.1, random_state=42, stratify=y_train\n)\n\ndef one_hot(y, n_classes=10):\n    return np.eye(n_classes, dtype=np.float32)[y]\n\ny_train_oh = one_hot(y_train)\ny_val_oh = one_hot(y_val)" },
          { type: "callout", kind: "gotcha", title: "Keep the test set untouched", content: "Use the validation split to choose epochs, learning rate, or network width. Evaluate the test set once after those choices are final; otherwise it becomes a tuning set." },
        ],
      },
      {
        step: 4,
        title: "Build the NumPy neural network and backpropagation",
        blocks: [
          { type: "code", language: "python", label: "Two-layer classifier from first principles", code: "import numpy as np\n\nrng = np.random.default_rng(42)\nW1 = rng.normal(0, np.sqrt(2 / 784), size=(784, 128)).astype(np.float32)\nb1 = np.zeros((1, 128), dtype=np.float32)\nW2 = rng.normal(0, np.sqrt(2 / 128), size=(128, 10)).astype(np.float32)\nb2 = np.zeros((1, 10), dtype=np.float32)\n\ndef softmax(z):\n    z = z - z.max(axis=1, keepdims=True)\n    exp = np.exp(z)\n    return exp / exp.sum(axis=1, keepdims=True)\n\ndef forward(x):\n    z1 = x @ W1 + b1\n    h1 = np.maximum(z1, 0)             # ReLU\n    probs = softmax(h1 @ W2 + b2)\n    return z1, h1, probs\n\ndef train_step(x, y_one_hot, lr=0.05):\n    global W1, b1, W2, b2\n    z1, h1, probs = forward(x)\n    n = len(x)\n    loss = -np.mean(np.sum(y_one_hot * np.log(probs + 1e-9), axis=1))\n    # softmax + cross-entropy has this compact output gradient\n    dz2 = (probs - y_one_hot) / n\n    dW2, db2 = h1.T @ dz2, dz2.sum(axis=0, keepdims=True)\n    dh1 = dz2 @ W2.T\n    dz1 = dh1 * (z1 > 0)\n    dW1, db1 = x.T @ dz1, dz1.sum(axis=0, keepdims=True)\n    W1 -= lr * dW1; b1 -= lr * db1\n    W2 -= lr * dW2; b2 -= lr * db2\n    return float(loss)" },
          { type: "code", language: "python", label: "Mini-batch training loop", code: "history = []\nfor epoch in range(30):\n    order = rng.permutation(len(X_train))\n    for start in range(0, len(order), 128):\n        idx = order[start:start + 128]\n        loss = train_step(X_train[idx], y_train_oh[idx])\n    val_probs = forward(X_val)[2]\n    val_acc = (val_probs.argmax(1) == y_val).mean()\n    history.append((loss, val_acc))\n    print(f\"epoch {epoch + 1:02d}: loss={loss:.4f}, val_acc={val_acc:.3f}\")" },
          { type: "callout", kind: "insight", title: "The key backprop result", content: "For softmax followed by categorical cross-entropy, the gradient at the output is simply `probabilities - one_hot_labels`. That cancellation is why this combination is so common." },
        ],
      },
      {
        step: 5,
        title: "Train the TensorFlow/Keras implementation",
        blocks: [
          { type: "code", language: "python", label: "A production-ready dense baseline", code: "import tensorflow as tf\nfrom tensorflow import keras\n\ntf.keras.utils.set_random_seed(42)\nmodel = keras.Sequential([\n    keras.Input(shape=(784,)),\n    keras.layers.Dense(256, activation=\"relu\", kernel_regularizer=keras.regularizers.l2(1e-4)),\n    keras.layers.BatchNormalization(),\n    keras.layers.Dropout(0.25),\n    keras.layers.Dense(128, activation=\"relu\"),\n    keras.layers.Dropout(0.15),\n    keras.layers.Dense(10)  # logits: no softmax needed in the layer\n])\nmodel.compile(\n    optimizer=keras.optimizers.AdamW(learning_rate=1e-3, weight_decay=1e-4),\n    loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),\n    metrics=[\"accuracy\"],\n)\ncallbacks = [\n    keras.callbacks.EarlyStopping(monitor=\"val_accuracy\", patience=5, mode=\"max\", restore_best_weights=True),\n    keras.callbacks.ReduceLROnPlateau(monitor=\"val_loss\", patience=2, factor=0.5),\n]\nhistory_tf = model.fit(\n    X_train, y_train, validation_data=(X_val, y_val),\n    epochs=40, batch_size=128, callbacks=callbacks, verbose=1\n)" },
          { type: "callout", kind: "gotcha", title: "Logits and loss must agree", content: "The final layer above deliberately has no softmax. `SparseCategoricalCrossentropy(from_logits=True)` applies the numerically stable equivalent internally. Do not add softmax while leaving `from_logits=True`." },
        ],
      },
      {
        step: 6,
        title: "Evaluate and inspect failures",
        blocks: [
          { type: "code", language: "python", label: "Metrics, confusion matrix, and misclassified examples", code: "import matplotlib.pyplot as plt\nfrom sklearn.metrics import ConfusionMatrixDisplay, classification_report\n\ntest_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)\npred = model.predict(X_test, verbose=0).argmax(axis=1)\nprint(f\"Test accuracy: {test_acc:.4f}\")\nprint(classification_report(y_test, pred))\nConfusionMatrixDisplay.from_predictions(y_test, pred, cmap=\"Blues\")\nplt.title(\"MNIST confusion matrix\"); plt.show()\n\nwrong = np.flatnonzero(pred != y_test)[:12]\nfig, axes = plt.subplots(3, 4, figsize=(8, 6))\nfor ax, i in zip(axes.flat, wrong):\n    ax.imshow(x_test[i], cmap=\"gray\")\n    ax.set_title(f\"true={y_test[i]}, pred={pred[i]}\")\n    ax.axis(\"off\")\nplt.tight_layout()" },
          { type: "list", style: "bullet", items: [
            "Compare NumPy and Keras validation accuracy and explain the optimizer and architecture differences.",
            "Plot both training and validation loss; a growing gap is evidence of overfitting.",
            "Inspect common confusions, such as 4/9 or 3/5, instead of assuming a single accuracy number tells the whole story.",
          ] },
        ],
      },
      {
        step: 7,
        title: "Extensions and portfolio deliverable",
        blocks: [
          { type: "list", style: "number", items: [
            "Replace flattening with a Keras `Conv2D` model and measure the accuracy gain. This previews Track 06: Computer Vision.",
            "Run an optimizer ablation: SGD+momentum, RMSprop, Adam, and AdamW under the same split and epoch budget.",
            "Add TensorBoard with `keras.callbacks.TensorBoard(log_dir=\"logs/mnist\")` and include screenshots of loss/accuracy curves in the README.",
            "Export the best model using `model.save(\"mnist_classifier.keras\")`, then write a small prediction script that accepts a 28×28 image.",
          ] },
          { type: "callout", kind: "tip", title: "What to publish", content: "Ship the NumPy implementation, Keras training script, requirements, reproducible seed/split, experiment table, confusion matrix, and an explanation of what TensorFlow automated versus what you derived yourself." },
        ],
      },
    ],
  },
];
