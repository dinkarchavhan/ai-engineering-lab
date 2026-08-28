import type { ProjectGuide } from "@/lib/content";

export const mlFromScratchProjects: ProjectGuide[] = [
  {
    slug: "numpy-ml-library",
    trackSlug: "ml-from-scratch",
    title: "NumPy-only ML library that mirrors scikit-learn's API",
    description:
      "Implement a small, tested ML library with familiar fit/predict methods, then use TensorFlow as the ground-truth autodiff and Keras baseline. You will train it on a real Kaggle dataset rather than only toy arrays.",
    techStack: ["Python", "NumPy", "TensorFlow", "Keras", "scikit-learn", "pytest", "Kaggle API"],
    difficulty: "intermediate",
    estimatedHours: 8,
    sections: [
      {
        step: 1,
        title: "Scope and project structure",
        blocks: [
          { type: "text", content: "Build three estimators: `LinearRegressionGD`, `LogisticRegressionGD`, and `KMeans`. Each must support `fit(X, y)`, `predict(X)`, and (for logistic regression) `predict_proba(X)`. Keep model parameters and loss history public so they are inspectable." },
          { type: "diagram", label: "Implementation and verification loop", chart: "flowchart LR\n  D[Real dataset] --> P[NumPy preprocessing]\n  P --> N[Your NumPy estimator]\n  P --> T[TensorFlow / Keras baseline]\n  N --> C[Compare loss, predictions, metrics]\n  T --> C\n  C --> R[Tests and README]" },
          { type: "code", language: "text", label: "Suggested layout", code: "numpy_ml/\n  __init__.py\n  linear.py\n  logistic.py\n  clustering.py\n  metrics.py\ntests/\n  test_linear.py\n  test_logistic.py\n  test_kmeans.py\nnotebooks/01_titanic_comparison.ipynb\nrequirements.txt" },
        ],
      },
      {
        step: 2,
        title: "Get a real dataset",
        blocks: [
          { type: "kv", items: [
            { key: "Primary dataset", value: "Kaggle Titanic — binary survival prediction; ideal for your logistic-regression estimator." },
            { key: "Kaggle source", value: "kaggle.com/competitions/titanic" },
            { key: "Fallback", value: "TensorFlow's `keras.datasets.fashion_mnist` for a fully built-in, no-account neural-network comparison." },
          ] },
          { type: "code", language: "bash", label: "Kaggle download", code: "pip install kaggle\n# Create an API token at Kaggle → Settings → API, then configure kaggle.json.\nkaggle competitions download -c titanic -p data\n# Extract data/titanic.zip; use data/train.csv for local validation." },
          { type: "callout", kind: "tip", title: "Avoid leaderboard leakage", content: "Split Kaggle's training CSV yourself with a fixed random seed. Do not tune using the competition test labels — they are intentionally unavailable." },
        ],
      },
      {
        step: 3,
        title: "Prepare the Titanic features",
        blocks: [
          { type: "code", language: "python", label: "A small, reproducible preprocessing pipeline", code: "import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\ndf = pd.read_csv(\"data/train.csv\")\ny = df[\"Survived\"].to_numpy(dtype=np.float64)\nX_df = df[[\"Pclass\", \"Sex\", \"Age\", \"SibSp\", \"Parch\", \"Fare\", \"Embarked\"]].copy()\nX_df[\"Age\"] = X_df[\"Age\"].fillna(X_df[\"Age\"].median())\nX_df[\"Embarked\"] = X_df[\"Embarked\"].fillna(X_df[\"Embarked\"].mode()[0])\nX_df = pd.get_dummies(X_df, dtype=float)\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X_df.to_numpy(), y, test_size=0.2, random_state=42, stratify=y\n)\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train)\nX_test = scaler.transform(X_test)" },
          { type: "callout", kind: "gotcha", title: "Fit transforms only on training data", content: "Fitting the scaler before the split leaks test-set statistics into training. It makes validation look better than the deployed model really is." },
        ],
      },
      {
        step: 4,
        title: "Implement logistic regression with NumPy",
        blocks: [
          { type: "code", language: "python", label: "numpy_ml/logistic.py", code: "import numpy as np\n\nclass LogisticRegressionGD:\n    def __init__(self, lr=0.05, epochs=2_000):\n        self.lr, self.epochs = lr, epochs\n\n    @staticmethod\n    def _sigmoid(z):\n        return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))\n\n    def fit(self, X, y):\n        X, y = np.asarray(X, float), np.asarray(y, float)\n        self.coef_ = np.zeros(X.shape[1])\n        self.intercept_ = 0.0\n        self.loss_history_ = []\n        for _ in range(self.epochs):\n            p = self._sigmoid(X @ self.coef_ + self.intercept_)\n            self.coef_ -= self.lr * (X.T @ (p - y)) / len(X)\n            self.intercept_ -= self.lr * (p - y).mean()\n            loss = -np.mean(y * np.log(p + 1e-12) + (1-y) * np.log(1-p + 1e-12))\n            self.loss_history_.append(loss)\n        return self\n\n    def predict_proba(self, X):\n        p = self._sigmoid(np.asarray(X) @ self.coef_ + self.intercept_)\n        return np.c_[1 - p, p]\n\n    def predict(self, X, threshold=0.5):\n        return (self.predict_proba(X)[:, 1] >= threshold).astype(int)" },
          { type: "code", language: "python", label: "Train and score your implementation", code: "from sklearn.metrics import accuracy_score, roc_auc_score\n\ncustom = LogisticRegressionGD(lr=0.05, epochs=2_000).fit(X_train, y_train)\np_custom = custom.predict_proba(X_test)[:, 1]\nprint(\"accuracy:\", accuracy_score(y_test, custom.predict(X_test)))\nprint(\"ROC-AUC :\", roc_auc_score(y_test, p_custom))" },
        ],
      },
      {
        step: 5,
        title: "Use TensorFlow for gradient checking and the Keras baseline",
        blocks: [
          { type: "text", content: "TensorFlow is central here: its automatic differentiation verifies that your hand-derived gradient is correct, and the one-layer Keras model is the production-framework equivalent of your NumPy classifier." },
          { type: "code", language: "python", label: "Check one analytical gradient against TensorFlow", code: "import tensorflow as tf\n\nxb = tf.constant(X_train[:32], dtype=tf.float64)\nyb = tf.constant(y_train[:32, None], dtype=tf.float64)\nw = tf.Variable(np.zeros((X_train.shape[1], 1)), dtype=tf.float64)\nb = tf.Variable(0.0, dtype=tf.float64)\nwith tf.GradientTape() as tape:\n    logits = xb @ w + b\n    loss = tf.reduce_mean(tf.nn.sigmoid_cross_entropy_with_logits(labels=yb, logits=logits))\ntf_dw, tf_db = tape.gradient(loss, [w, b])\n\np = 1 / (1 + np.exp(-(X_train[:32] @ w.numpy()).ravel() - b.numpy()))\nnp_dw = (X_train[:32].T @ (p - y_train[:32]))[:, None] / len(p)\nprint(np.allclose(np_dw, tf_dw.numpy(), atol=1e-8))  # True" },
          { type: "code", language: "python", label: "Keras equivalent and comparison", code: "from tensorflow import keras\n\ntf.random.set_seed(42)\nkeras_model = keras.Sequential([keras.Input((X_train.shape[1],)), keras.layers.Dense(1, activation=\"sigmoid\")])\nkeras_model.compile(optimizer=keras.optimizers.SGD(0.05), loss=\"binary_crossentropy\", metrics=[\"accuracy\", keras.metrics.AUC(name=\"auc\")])\nkeras_model.fit(X_train, y_train, validation_split=0.2, epochs=200, verbose=0,\n                callbacks=[keras.callbacks.EarlyStopping(patience=15, restore_best_weights=True)])\nprint(dict(zip(keras_model.metrics_names, keras_model.evaluate(X_test, y_test, verbose=0))))" },
          { type: "callout", kind: "insight", title: "Why the scores can differ", content: "Identical mathematics can still yield slightly different results because of initialization, batching, optimizer details, and stopping rules. Match learning rate, epochs, full-batch updates, and regularization before diagnosing a bug." },
        ],
      },
      {
        step: 6,
        title: "Finish the library and tests",
        blocks: [
          { type: "list", style: "number", items: [
            "Implement linear regression with MSE gradient descent; compare coefficients and RMSE with `sklearn.linear_model.LinearRegression`.",
            "Implement K-Means with a seeded centroid initialization, an empty-cluster guard, inertia, and a `predict` method; compare labels up to permutation with scikit-learn.",
            "Add `pytest` tests for output shapes, decreasing loss on a synthetic separable dataset, deterministic K-Means with the same seed, and a TensorFlow-vs-NumPy gradient check.",
            "Write a README that documents the API, equations, dataset license/source, evaluation split, results table, and known limitations.",
          ] },
          { type: "code", language: "python", label: "A compact high-value test", code: "def test_numpy_gradient_matches_tensorflow():\n    # compute np_dw and tf_dw as in the guide on a fixed mini-batch\n    assert np.allclose(np_dw, tf_dw.numpy(), atol=1e-8)\n\ndef test_training_reduces_loss():\n    model = LogisticRegressionGD(lr=0.1, epochs=200).fit(X_train, y_train)\n    assert model.loss_history_[-1] < model.loss_history_[0]" },
        ],
      },
      {
        step: 7,
        title: "Portfolio deliverable",
        blocks: [
          { type: "list", style: "bullet", items: [
            "A public repository with install instructions and `pytest` passing.",
            "A notebook comparing your NumPy model, scikit-learn, and TensorFlow/Keras on the same held-out Titanic split.",
            "A chart of train loss and a results table with accuracy, ROC-AUC, and runtime.",
            "An honest limitations section: this learning implementation is for clarity, not a replacement for mature libraries in production.",
          ] },
        ],
      },
    ],
  },
];
