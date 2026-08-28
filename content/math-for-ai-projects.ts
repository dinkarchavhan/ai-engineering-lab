import type { ProjectGuide } from "@/lib/content";

export const mathForAiProjects: ProjectGuide[] = [
  {
    slug: "house-price-predictor",
    trackSlug: "math-for-ai",
    title: "House Price Predictor built purely from gradients",
    description:
      "Implement linear regression from scratch using only NumPy — no scikit-learn, no magic. You'll write the loss function, derive the gradients by hand, and run gradient descent yourself. By the end you'll understand exactly why neural network training works, because this is the same algorithm.",
    techStack: ["Python", "NumPy", "Matplotlib", "Pandas", "Jupyter"],
    difficulty: "beginner",
    estimatedHours: 3,
    sections: [
      // ─── Phase 1: What you're building ──────────────────────────────────
      {
        step: 1,
        title: "What you're building",
        blocks: [
          {
            type: "text",
            content:
              "You'll build a **house price predictor** that learns from data using gradient descent — the exact same algorithm that trains GPT, ResNet, and every other deep learning model. The difference is that here the model is a single straight line (linear regression), so you can see every step clearly without the complexity of millions of parameters.",
          },
          {
            type: "diagram",
            chart: `graph TD
    D[Dataset: size, bedrooms, age → price] --> F[Feature matrix X]
    F --> FW[Forward pass: ŷ = Xw + b]
    FW --> L[Loss: MSE = mean of squared errors]
    L --> G[Gradients: ∂L/∂w and ∂L/∂b]
    G --> U[Update: w = w - α·∇w]
    U --> FW
    L --> E{Loss small enough?}
    E -->|No| G
    E -->|Yes| P[Predict new house prices]
    style D fill:#6366f1,color:#fff
    style P fill:#10b981,color:#fff
    style L fill:#f59e0b,color:#fff`,
            label: "The training loop — runs hundreds of times until the model converges",
          },
          {
            type: "kv",
            items: [
              {
                key: "Input (X)",
                value:
                  "Feature matrix — each row is one house, each column is one feature (size, bedrooms, age, etc.).",
              },
              {
                key: "Parameters (w, b)",
                value:
                  "Weights and bias — the numbers the model learns. Initialized randomly, improved by gradient descent.",
              },
              {
                key: "Loss (L)",
                value:
                  "Mean Squared Error — a single number measuring how wrong the current predictions are. Lower is better.",
              },
              {
                key: "Gradients (∇)",
                value:
                  "The derivative of the loss with respect to each parameter. Tells us which direction to nudge each weight.",
              },
              {
                key: "Learning rate (α)",
                value:
                  "Controls how big each gradient step is. Too large → oscillates. Too small → too slow to converge.",
              },
            ],
          },
          {
            type: "callout",
            kind: "insight",
            title: "Why linear regression first?",
            content:
              "Every neural network uses the same training loop you're about to write: forward pass → compute loss → compute gradients → update weights. Linear regression has no hidden layers, so the math is fully visible. Once you understand it here, you understand backpropagation in principle.",
          },
        ],
      },

      // ─── Phase 2: Prerequisites ──────────────────────────────────────────
      {
        step: 2,
        title: "Prerequisites",
        blocks: [
          {
            type: "list",
            style: "bullet",
            items: [
              "**Python 3.11 or 3.12** — installed and working in your terminal.",
              "**NumPy** — the only math library you'll use. No scikit-learn.",
              "**Matplotlib** — for plotting the loss curve and predictions.",
              "**Pandas** — optional, for loading CSV data more easily.",
              "**Jupyter** — recommended so you can run cells and see plots inline.",
            ],
          },
          {
            type: "code",
            language: "bash",
            label: "Create a virtual environment and install dependencies",
            code: `# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate    # macOS / Linux
# .venv\\Scripts\\activate    # Windows

# Install dependencies
pip install numpy matplotlib pandas jupyter

# Launch Jupyter (optional — you can also run as a plain .py file)
jupyter notebook`,
          },
          {
            type: "callout",
            kind: "tip",
            title: "Prefer uv? (covered in Track 00)",
            content:
              "`uv venv && uv pip install numpy matplotlib pandas jupyter` — uv is 10–100× faster than pip for resolving packages.",
          },
        ],
      },

      // ─── Phase 3: Project setup ──────────────────────────────────────────
      {
        step: 3,
        title: "Project setup and dataset",
        blocks: [
          {
            type: "text",
            content:
              "Create a project folder and a Jupyter notebook (or plain Python file). We'll use a synthetic dataset so you can focus entirely on the math without data-cleaning distractions. You'll generate 200 houses where price depends on size plus realistic noise.",
          },
          {
            type: "code",
            language: "bash",
            label: "Create the project",
            code: `mkdir house-price-predictor
cd house-price-predictor
touch predictor.ipynb   # or predictor.py if you prefer`,
          },
          {
            type: "code",
            language: "python",
            label: "Cell 1 — Imports and reproducibility",
            code: `import numpy as np
import matplotlib.pyplot as plt

# Fix the random seed so your results match this guide exactly.
np.random.seed(42)`,
          },
          {
            type: "code",
            language: "python",
            label: "Cell 2 — Generate the dataset",
            code: `# ── Generate synthetic house data ────────────────────────────────────────
# 200 houses. Price (in $1000s) = 150 + 0.3 * size_sqft + noise.
# "True" weight = 0.3, "true" bias = 150 — gradient descent should learn these.

n_samples = 200
size_sqft = np.random.uniform(500, 3500, size=(n_samples,))   # house size
noise      = np.random.normal(0, 20, size=(n_samples,))        # measurement noise
price      = 150 + 0.3 * size_sqft + noise                    # ground truth prices

# ── Reshape to column vectors (n, 1) ─────────────────────────────────────
X = size_sqft.reshape(-1, 1)   # shape: (200, 1)
y = price.reshape(-1, 1)       # shape: (200, 1)

print(f"X shape: {X.shape}  |  y shape: {y.shape}")
print(f"Price range: \${y.min():.0f}k – \${y.max():.0f}k")`,
          },
          {
            type: "code",
            language: "python",
            label: "Cell 3 — Visualize the raw data",
            code: `plt.figure(figsize=(8, 4))
plt.scatter(X, y, alpha=0.4, color="#6366f1", s=20)
plt.xlabel("House size (sqft)")
plt.ylabel("Price ($1000s)")
plt.title("Raw data — we want to fit a line through this")
plt.tight_layout()
plt.show()`,
          },
          {
            type: "callout",
            kind: "tip",
            title: "Using a real dataset instead",
            content:
              "The California Housing dataset is a one-liner away: `from sklearn.datasets import fetch_california_housing`. Load it and use `data.data[:, 0:1]` (median income) as X and `data.target.reshape(-1,1)` as y. Everything else in this guide works unchanged — just normalize your features first (see Phase 5).",
          },
        ],
      },

      // ─── Phase 4: The math ───────────────────────────────────────────────
      {
        step: 4,
        title: "The math — from equations to code",
        blocks: [
          {
            type: "text",
            content:
              "Before writing the training loop, understand what each equation does. Everything below maps directly to one line of NumPy code.",
          },
          {
            type: "callout",
            kind: "math",
            title: "Model (forward pass)",
            content:
              "ŷ = Xw + b\n\nX is the feature matrix (n×1 for one feature), w is the weight (1×1 scalar), b is the bias (scalar). ŷ is the vector of predicted prices.",
          },
          {
            type: "callout",
            kind: "math",
            title: "Loss function — Mean Squared Error",
            content:
              "L = (1/n) · Σᵢ (ŷᵢ − yᵢ)²\n\nAverage squared difference between predictions and true prices. Squaring penalizes big errors more than small ones. Dividing by n makes it independent of dataset size.",
          },
          {
            type: "callout",
            kind: "math",
            title: "Gradients (partial derivatives)",
            content:
              "∂L/∂w = (2/n) · Xᵀ(ŷ − y)\n\n∂L/∂b = (2/n) · Σᵢ (ŷᵢ − yᵢ)\n\nThe gradient tells you: if I increase w by a tiny amount, does the loss go up or down, and by how much? To reduce the loss, step in the opposite direction.",
          },
          {
            type: "callout",
            kind: "math",
            title: "Gradient descent update rule",
            content:
              "w ← w − α · ∂L/∂w\n\nb ← b − α · ∂L/∂b\n\nα (alpha) is the learning rate — how big a step to take. This is the same update rule used in SGD, Adam, and every other optimizer. The optimizers just modify how α is applied.",
          },
          {
            type: "callout",
            kind: "insight",
            title: "Why Xᵀ in the gradient?",
            content:
              "Matrix calculus. When you differentiate L = (1/n)||Xw+b-y||² with respect to w, the chain rule gives you (2/n)·Xᵀ·(Xw+b-y). The transpose appears because we need to multiply a (n×1) error vector with a (n×1) feature vector to get a (1×1) scalar gradient for w. If X were (n×d), the gradient would be (d×1), matching the shape of w.",
          },
        ],
      },

      // ─── Phase 5: Feature normalization ─────────────────────────────────
      {
        step: 5,
        title: "Normalize features",
        blocks: [
          {
            type: "text",
            content:
              "House sizes range from 500 to 3500 sqft. Without normalization, the gradient for w is enormous and gradient descent oscillates wildly. **Standardization** (z-score normalization) rescales each feature to mean 0, standard deviation 1 — making learning stable.",
          },
          {
            type: "callout",
            kind: "math",
            title: "Standardization formula",
            content:
              "X_norm = (X − μ) / σ\n\nμ = mean of X (over training set)\nσ = standard deviation of X (over training set)\n\nCRITICAL: compute μ and σ on the TRAINING set only. Apply those same values to the test set. Never fit the scaler on test data.",
          },
          {
            type: "code",
            language: "python",
            label: "Cell 4 — Train/test split and normalization",
            code: `# ── Train / test split (80 / 20) ─────────────────────────────────────────
split = int(0.8 * n_samples)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# ── Standardize features ──────────────────────────────────────────────────
# Fit (compute μ and σ) on training set ONLY
X_mean = X_train.mean(axis=0)   # shape: (1,)
X_std  = X_train.std(axis=0)    # shape: (1,)

X_train_norm = (X_train - X_mean) / X_std
X_test_norm  = (X_test  - X_mean) / X_std   # use training stats — NOT test stats

print(f"Training set: {X_train_norm.shape}  | mean={X_train_norm.mean():.4f}, std={X_train_norm.std():.4f}")
print(f"Test set:     {X_test_norm.shape}")`,
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Data leakage — the most common ML mistake",
            content:
              "If you compute X_mean and X_std over the entire dataset (before splitting), the test set information leaks into training. Your metrics will look better than reality. Always: split first, then normalize using only training statistics.",
          },
        ],
      },

      // ─── Phase 6: Implement gradient descent ────────────────────────────
      {
        step: 6,
        title: "Implement linear regression from scratch",
        blocks: [
          {
            type: "text",
            content:
              "This is the core of the project. The `LinearRegression` class has three methods: `predict` (forward pass), `loss` (compute MSE), and `fit` (gradient descent loop). Nothing from scikit-learn.",
          },
          {
            type: "code",
            language: "python",
            label: "Cell 5 — LinearRegression class (pure NumPy)",
            code: `class LinearRegression:
    """Linear regression trained with batch gradient descent."""

    def __init__(self, learning_rate: float = 0.1, n_epochs: int = 500):
        self.lr       = learning_rate
        self.n_epochs = n_epochs
        self.w        = None   # weights — shape: (n_features, 1)
        self.b        = None   # bias    — shape: (1,)
        self.history  = []     # loss at each epoch, for plotting

    # ── Forward pass ─────────────────────────────────────────────────────
    def predict(self, X: np.ndarray) -> np.ndarray:
        """ŷ = Xw + b"""
        return X @ self.w + self.b

    # ── Loss function ─────────────────────────────────────────────────────
    def loss(self, y_pred: np.ndarray, y_true: np.ndarray) -> float:
        """Mean Squared Error: (1/n) * sum((ŷ - y)^2)"""
        n = len(y_true)
        return float(np.mean((y_pred - y_true) ** 2))

    # ── Gradient descent training loop ────────────────────────────────────
    def fit(self, X: np.ndarray, y: np.ndarray) -> "LinearRegression":
        n, n_features = X.shape

        # Initialize weights to zero (or small random values)
        self.w = np.zeros((n_features, 1))
        self.b = np.zeros((1,))

        for epoch in range(self.n_epochs):
            # 1. Forward pass
            y_pred = self.predict(X)

            # 2. Compute and record loss
            current_loss = self.loss(y_pred, y)
            self.history.append(current_loss)

            # 3. Compute gradients
            error  = y_pred - y                          # shape: (n, 1)
            dw = (2 / n) * (X.T @ error)                # shape: (n_features, 1)
            db = (2 / n) * np.sum(error)                 # scalar

            # 4. Update parameters (gradient descent step)
            self.w -= self.lr * dw
            self.b -= self.lr * db

            # Print progress every 100 epochs
            if (epoch + 1) % 100 == 0:
                print(f"Epoch {epoch+1:4d}/{self.n_epochs} | Loss: {current_loss:.2f}")

        return self`,
          },
          {
            type: "callout",
            kind: "insight",
            title: "X.T @ error — matrix multiplication as vectorized loop",
            content:
              "Without NumPy you'd write: `for i in range(n): dw += (2/n) * X[i] * error[i]`. The expression `X.T @ error` does the same thing for all features simultaneously. This is why GPUs excel at neural network training — it's all matrix multiplications running in parallel.",
          },
        ],
      },

      // ─── Phase 7: Train and visualize ────────────────────────────────────
      {
        step: 7,
        title: "Train and visualize the learning curve",
        blocks: [
          {
            type: "text",
            content:
              "Instantiate the model, train it, and watch the loss drop. Then plot the fitted line over the raw data — if gradient descent worked correctly, the line should cut right through the cloud of points.",
          },
          {
            type: "code",
            language: "python",
            label: "Cell 6 — Train the model",
            code: `model = LinearRegression(learning_rate=0.1, n_epochs=500)
model.fit(X_train_norm, y_train)

print(f"\\nLearned weight (w): {model.w[0, 0]:.4f}")
print(f"Learned bias  (b): {model.b[0]:.4f}")

# The true parameters (in normalized space) — w should be close to the
# true slope expressed in the normalized feature space.`,
          },
          {
            type: "code",
            language: "python",
            label: "Cell 7 — Plot the learning curve",
            code: `plt.figure(figsize=(8, 4))
plt.plot(model.history, color="#6366f1", linewidth=1.5)
plt.xlabel("Epoch")
plt.ylabel("MSE Loss")
plt.title("Learning curve — loss should decrease rapidly then plateau")
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print(f"Initial loss: {model.history[0]:.2f}")
print(f"Final loss:   {model.history[-1]:.2f}")
print(f"Reduction:    {(1 - model.history[-1]/model.history[0])*100:.1f}%")`,
          },
          {
            type: "callout",
            kind: "insight",
            title: "What a good learning curve looks like",
            content:
              "Loss should drop steeply in the first 50–100 epochs, then flatten to a near-horizontal plateau. If it oscillates or shoots upward, your learning rate is too high — try 0.01. If it barely moves after 500 epochs, try 0.5. This \"learning rate tuning\" is the same problem you'll face with deep networks.",
          },
          {
            type: "code",
            language: "python",
            label: "Cell 8 — Plot predictions vs raw data",
            code: `# Generate a line from the model for visualization
X_line_norm = np.linspace(X_train_norm.min(), X_train_norm.max(), 100).reshape(-1, 1)
y_line      = model.predict(X_line_norm)

# Map back to original scale for the x-axis label
X_line_orig = X_line_norm * X_std + X_mean

plt.figure(figsize=(8, 4))
plt.scatter(X_train, y_train, alpha=0.4, color="#6366f1", s=20, label="Training data")
plt.scatter(X_test,  y_test,  alpha=0.5, color="#f59e0b", s=20, label="Test data")
plt.plot(X_line_orig, y_line, color="#10b981", linewidth=2, label="Model prediction")
plt.xlabel("House size (sqft)")
plt.ylabel("Price ($1000s)")
plt.title("Linear regression fit — gradient descent learned this line")
plt.legend()
plt.tight_layout()
plt.show()`,
          },
        ],
      },

      // ─── Phase 8: Evaluation ─────────────────────────────────────────────
      {
        step: 8,
        title: "Evaluate and compare with scikit-learn",
        blocks: [
          {
            type: "text",
            content:
              "Compute standard regression metrics on the held-out test set, then compare your gradient descent solution against scikit-learn's closed-form solution. They should give nearly identical numbers — which proves your implementation is correct.",
          },
          {
            type: "kv",
            items: [
              {
                key: "MSE",
                value:
                  "Mean Squared Error — (1/n)·Σ(ŷ−y)². Same scale as loss during training. Lower is better.",
              },
              {
                key: "RMSE",
                value:
                  "Root Mean Squared Error — √MSE. Same units as y (price in $1000s). Easier to interpret: \"average error of $X thousand\".",
              },
              {
                key: "R²",
                value:
                  "Coefficient of determination. 1.0 = perfect fit. 0.0 = model is no better than predicting the mean. Negative = worse than the mean.",
              },
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Cell 9 — Compute metrics on the test set",
            code: `def rmse(y_true, y_pred):
    return float(np.sqrt(np.mean((y_pred - y_true) ** 2)))

def r_squared(y_true, y_pred):
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - y_true.mean()) ** 2)
    return float(1 - ss_res / ss_tot)

# Evaluate our gradient descent model on the test set
y_pred_test = model.predict(X_test_norm)

print("── Our gradient descent model ──")
print(f"  MSE:  {np.mean((y_pred_test - y_test)**2):.2f}")
print(f"  RMSE: {rmse(y_test, y_pred_test):.2f}  ($k average error)")
print(f"  R²:   {r_squared(y_test, y_pred_test):.4f}")`,
          },
          {
            type: "code",
            language: "python",
            label: "Cell 10 — Sanity check against scikit-learn",
            code: `from sklearn.linear_model import LinearRegression as SklearnLR

# scikit-learn uses the normal equation (closed-form solution), not gradient descent.
# Both should give identical predictions if gradient descent converged properly.
sk_model = SklearnLR()
sk_model.fit(X_train_norm, y_train)
y_pred_sk = sk_model.predict(X_test_norm)

print("── scikit-learn (closed-form) ──")
print(f"  MSE:  {np.mean((y_pred_sk - y_test)**2):.2f}")
print(f"  RMSE: {rmse(y_test, y_pred_sk):.2f}")
print(f"  R²:   {r_squared(y_test, y_pred_sk):.4f}")
print()
print(f"sklearn weight: {sk_model.coef_[0][0]:.4f}")
print(f"our weight:     {model.w[0, 0]:.4f}  ← should be nearly identical")`
          },
          {
            type: "callout",
            kind: "insight",
            title: "Why do they match?",
            content:
              "scikit-learn's LinearRegression solves the normal equation: w* = (XᵀX)⁻¹Xᵀy — a direct algebraic solution. Gradient descent iteratively approximates the same answer. With enough epochs and a well-tuned learning rate, they converge to the same w*. The normal equation is exact but O(n³) (slow for large datasets). Gradient descent is approximate but scales to millions of samples.",
          },
        ],
      },

      // ─── Phase 9: Extensions ─────────────────────────────────────────────
      {
        step: 9,
        title: "Extend the project",
        blocks: [
          {
            type: "text",
            content:
              "You've implemented the core of machine learning from scratch. Here's where to take it next — each extension reinforces a different concept from the Math for AI track:",
          },
          {
            type: "list",
            style: "number",
            items: [
              "**Multiple features** — add bedrooms, age, distance-to-city columns to X. The model works unchanged because the matrix math is already multi-dimensional. Watch R² improve as you add informative features.",
              "**Polynomial features** — add `X²`, `X³` columns for non-linear fits. `X_poly = np.column_stack([X, X**2, X**3])`. See how the fitted curve bends to follow the data — and how too many powers causes overfitting.",
              "**Mini-batch gradient descent** — instead of computing gradients over all n samples each epoch, sample a random mini-batch of 32. This is exactly how PyTorch DataLoader + optimizer works. Notice the noisy but faster convergence.",
              "**L2 regularization (Ridge)** — add `λ·||w||²` to the loss. The gradient for w becomes `dw + 2λw`. Prevents overfitting when you add many polynomial features. This is Ridge regression — and L2 penalty in neural networks.",
              "**Learning rate schedules** — implement step decay: every 100 epochs, multiply `lr *= 0.5`. Compare the learning curve against a fixed learning rate. Adaptive learning rates (Adam) automate this.",
              "**Visualize the loss surface** — for the 1-feature case, plot L(w, b) as a 3D surface using `matplotlib`. Mark the gradient descent path on the surface. This makes the intuition of \"rolling downhill\" concrete.",
              "**Wrap it in a FastAPI endpoint** — load your trained w and b, expose `POST /predict` that accepts `{size_sqft: 2000}` and returns `{price_k: 750.0}`. This is exactly Track 00's project pattern applied to a trained model.",
            ],
          },
          {
            type: "callout",
            kind: "tip",
            title: "Connect this to neural networks",
            content:
              "Replace the single linear layer with two layers and add a ReLU activation between them — you now have the simplest neural network. The training loop (forward pass → loss → gradients → update) is identical. PyTorch's `loss.backward()` automates the gradient computation you wrote by hand here.",
          },
          {
            type: "callout",
            kind: "tip",
            title: "Portfolio tip",
            content:
              "Add a notebook with clear section headers, inline plots, and a results table comparing your implementation vs scikit-learn. Upload to GitHub with a README that shows one representative plot. Interviewers who ask \"do you understand gradient descent?\" will be satisfied by a link to this repo.",
          },
        ],
      },
    ],
  },
];
