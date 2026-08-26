import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Track 01 — Mathematics for AI
// Lesson 1 (Vectors, Matrices, Tensors) is written at full 15-step depth as
// the reference. Lessons 2–10 are stubs, each expandable in follow-up turns.
// ---------------------------------------------------------------------------

const vectorsMatricesTensors: Lesson = {
  slug: "vectors-matrices-tensors",
  trackSlug: "math-for-ai",
  order: 1,
  minutes: 14,
  title: "Vectors, Matrices, and Tensors",
  subtitle:
    "The one data structure at the bottom of every AI system — how it's shaped, how it's indexed, and how PyTorch and NumPy actually store it.",
  tags: ["Vectors", "Matrices", "Tensors", "NumPy", "PyTorch"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Every input to every AI model — a sentence, an image, an audio clip, a row of tabular data — is turned into an array of numbers before the model ever sees it. A word becomes a vector of 768 numbers. An image becomes a 3-dimensional array of pixels. A batch of both becomes a 4-dimensional tensor.",
        },
        {
          type: "text",
          content:
            "Before we can talk about neurons, gradients, or attention, we need one shared language for shaping and moving these arrays around. That language is **linear algebra**, and its unit of currency is the **tensor**.",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "Nearly every runtime bug in deep learning is a shape error. `mat1 and mat2 shapes cannot be multiplied (32x784 and 128x10)` is the first error every new practitioner hits — and once you can read tensor shapes at a glance, that error disappears. Everything downstream (dot products, matmul, broadcasting, attention) is just this lesson applied at scale.",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition — a ladder of dimensions",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "Scalar (0-D)", value: "A single number. `3.14`. Shape: `()`." },
            { key: "Vector (1-D)", value: "An ordered list of numbers. `[1, 2, 3]`. Shape: `(3,)`." },
            { key: "Matrix (2-D)", value: "A grid — rows × columns. Shape: `(rows, cols)`." },
            { key: "Tensor (n-D)", value: "The generalization. A stack of matrices is 3-D, a batch of those is 4-D, and so on." },
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "There's no magic in the word *tensor*. A tensor is just an n-dimensional array. Scalars, vectors, and matrices are the 0-, 1-, and 2-dimensional special cases.",
        },
      ],
    },
    {
      step: 4,
      title: "A real-world analogy",
      blocks: [
        {
          type: "text",
          content:
            "Think of an Excel workbook.",
        },
        {
          type: "list",
          items: [
            "One **cell** is a scalar.",
            "One **column** is a vector.",
            "One **sheet** is a matrix.",
            "The whole **workbook** — many sheets — is a 3-D tensor.",
            "A **folder full of workbooks** is a 4-D tensor. That's exactly the shape of a batch of RGB images: `(batch, channels, height, width)`.",
          ],
        },
      ],
    },
    {
      step: 5,
      title: "Visualize the shapes",
      blocks: [
        {
          type: "diagram",
          label: "From scalar to 4-D tensor",
          chart: `flowchart LR
    S["Scalar<br/>()"] --> V["Vector<br/>(n,)"]
    V --> M["Matrix<br/>(rows, cols)"]
    M --> T3["3-D Tensor<br/>(depth, rows, cols)"]
    T3 --> T4["4-D Tensor<br/>(batch, channels, H, W)"]
    style S fill:#f6f7f9,stroke:#d3d7e0
    style V fill:#eef7ff,stroke:#8ecdff
    style M fill:#d9edff,stroke:#8ecdff
    style T3 fill:#c6e2ff,stroke:#8ecdff
    style T4 fill:#a8d1ff,stroke:#8ecdff`,
        },
        {
          type: "text",
          content:
            "Reading a shape left-to-right, each number tells you the size along one axis. `(32, 3, 224, 224)` = 32 images, 3 color channels each, 224 pixels tall, 224 pixels wide.",
        },
      ],
    },
    {
      step: 6,
      title: "The math notation",
      blocks: [
        {
          type: "callout",
          kind: "math",
          title: "How papers write it",
          content:
            "A vector: $\\mathbf{x} \\in \\mathbb{R}^n$ — an ordered list of $n$ real numbers.\n\nA matrix: $\\mathbf{A} \\in \\mathbb{R}^{m \\times n}$ — $m$ rows, $n$ columns.\n\nA tensor: $\\mathbf{T} \\in \\mathbb{R}^{d_1 \\times d_2 \\times \\dots \\times d_k}$ — $k$ axes, each with its own size.",
        },
        {
          type: "kv",
          items: [
            { key: "$x_i$", value: "the i-th element of vector x — a scalar." },
            { key: "$A_{ij}$", value: "the element at row i, column j of matrix A." },
            { key: "$\\mathbf{A}^\\top$", value: "the **transpose** of A — rows become columns. Shape flips from (m, n) to (n, m)." },
            { key: "$\\mathbf{0}, \\mathbf{1}$", value: "vectors/matrices of all zeros or all ones." },
            { key: "$\\mathbf{I}$", value: "the identity matrix — 1s on the diagonal, 0s elsewhere." },
          ],
        },
      ],
    },
    {
      step: 7,
      title: "Build them from scratch",
      blocks: [
        {
          type: "text",
          content:
            "You never write your own tensor library — NumPy and PyTorch already did — but it's worth spending a minute at the plain-Python level so no library ever feels magical.",
        },
        {
          type: "code",
          language: "python",
          label: "tensors_by_hand.py",
          code: `scalar = 3.14                        # 0-D
vector = [1, 2, 3]                   # 1-D — length 3
matrix = [[1, 2, 3],                 # 2-D — 2 rows, 3 cols
          [4, 5, 6]]
tensor3 = [                          # 3-D — 2 x 2 x 3
    [[1, 2, 3], [4, 5, 6]],
    [[7, 8, 9], [10, 11, 12]],
]

def shape(x):
    """Recursively read the shape of a nested list."""
    if not isinstance(x, list):
        return ()
    return (len(x),) + shape(x[0])

print(shape(scalar))    # ()
print(shape(vector))    # (3,)
print(shape(matrix))    # (2, 3)
print(shape(tensor3))   # (2, 2, 3)`,
        },
      ],
    },
    {
      step: 8,
      title: "The production version — NumPy and PyTorch",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "numpy_and_torch.py",
          code: `import numpy as np
import torch

# NumPy
a = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.float32)
print(a.shape)      # (2, 3)
print(a.dtype)      # float32
print(a.T.shape)    # (3, 2) — transpose

# PyTorch — same idea, GPU-ready
t = torch.tensor([[1, 2, 3], [4, 5, 6]], dtype=torch.float32)
print(t.shape)      # torch.Size([2, 3])
print(t.dtype)      # torch.float32

# Move to GPU if available
if torch.cuda.is_available():
    t = t.to("cuda")

# Common constructors
zeros = torch.zeros(3, 4)              # (3, 4) of 0.0
ones  = torch.ones(2, 5)               # (2, 5) of 1.0
rand  = torch.randn(32, 3, 224, 224)   # a batch of 32 fake RGB images`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "`torch.Tensor` is the AI industry's `numpy.ndarray` with two upgrades: it can live on a GPU, and it tracks gradients. Same shape rules, same indexing rules, same broadcasting rules.",
        },
      ],
    },
    {
      step: 9,
      title: "Indexing and slicing",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "indexing.py",
          code: `import torch

# A 4-D tensor: 32 RGB images, 224x224
imgs = torch.randn(32, 3, 224, 224)

# One specific image
imgs[0].shape          # torch.Size([3, 224, 224])

# One channel of one image
imgs[0, 1].shape       # torch.Size([224, 224])

# One pixel (scalar-ish)
imgs[0, 1, 100, 50]    # tensor(-0.34...)

# Slice: first 8 images
imgs[:8].shape         # torch.Size([8, 3, 224, 224])

# Slice all axes: the red channel of every image
imgs[:, 0, :, :].shape # torch.Size([32, 224, 224])`,
        },
        {
          type: "callout",
          kind: "tip",
          content:
            "The `:` means \"all along this axis\". Reading a slice expression left-to-right tells you exactly what you kept and what you collapsed.",
        },
      ],
    },
    {
      step: 10,
      title: "Reshaping — same numbers, new shape",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "reshape.py",
          code: `import torch

t = torch.arange(24)          # tensor([ 0,  1,  2, ..., 23]), shape (24,)

t.reshape(2, 12).shape        # (2, 12)
t.reshape(4, 6).shape         # (4, 6)
t.reshape(2, 3, 4).shape      # (2, 3, 4)
t.reshape(-1, 6).shape        # (4, 6) — -1 means "figure it out"

# The total number of elements MUST match:
# 2 * 12 = 24 ✓,   3 * 8 = 24 ✓,   5 * 5 = 25 ✗ (error)

# Flatten — often used before a Linear layer
img = torch.randn(3, 224, 224)
flat = img.flatten()          # shape (150528,)`,
        },
      ],
    },
    {
      step: 11,
      title: "Broadcasting — the silent superpower",
      blocks: [
        {
          type: "text",
          content:
            "When you add tensors of *different* shapes, NumPy and PyTorch don't error — they **broadcast** the smaller one across the bigger one, without copying memory. This is why you can add a bias vector to a whole batch in one line.",
        },
        {
          type: "code",
          language: "python",
          label: "broadcasting.py",
          code: `import torch

batch = torch.randn(32, 10)     # 32 samples, 10 features
bias  = torch.randn(10)         # one bias per feature

# bias is stretched to (32, 10) — invisibly — then added
out = batch + bias
print(out.shape)                # torch.Size([32, 10])

# The rule: axes align from the RIGHT.
# (32, 10)
#     (10)   <- fits: 10 matches 10, and the missing 32-axis is filled

# This one fails — 5 doesn't match 10 and neither is 1:
# torch.randn(32, 10) + torch.randn(5)   -> RuntimeError`,
        },
        {
          type: "callout",
          kind: "insight",
          title: "The broadcasting rule in one sentence",
          content:
            "Line the shapes up on the right. Along each axis, sizes must be equal — or one of them must be 1. If yes, the size-1 axis is stretched.",
        },
      ],
    },
    {
      step: 12,
      title: "Where you'll see this",
      blocks: [
        {
          type: "list",
          items: [
            "**Every model input.** A batch of tokenized text is shape `(batch, seq_len)`. A batch of images is `(batch, channels, H, W)`. A batch of audio is `(batch, samples)`.",
            "**Every linear layer.** `nn.Linear(in, out)` multiplies its input by a matrix of shape `(out, in)` and adds a bias of shape `(out,)` — broadcasting handles the batch dimension.",
            "**Every attention op.** Query, key, and value tensors in a transformer are shape `(batch, heads, seq_len, head_dim)`. Reading that shape tells you how big the model is.",
            "**Every gradient.** `loss.backward()` fills each parameter's `.grad` attribute with a tensor of the same shape. Shape safety is invariant end-to-end.",
          ],
        },
      ],
    },
    {
      step: 13,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Forgetting the batch dimension",
          content:
            "You trained on `(batch, 784)` but call the model with `(784,)` at inference — shape mismatch. Fix: `x.unsqueeze(0)` adds a leading batch axis of size 1.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Confusing `reshape` with `transpose`",
          content:
            "`reshape(2, 3)` rearranges memory sequentially — the numbers don't move axes, they're just re-read. `transpose(0, 1)` (or `.T`) actually swaps two axes. Different results; use the right one.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Silent broadcasting bugs",
          content:
            "`(3, 1) * (1, 3)` gives you a `(3, 3)` outer-product-like result — sometimes what you wanted, sometimes not. When in doubt, print `.shape` before and after every operation.",
        },
      ],
    },
    {
      step: 14,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You have a tensor `x` of shape `(32, 3, 224, 224)` — a batch of 32 RGB images. You want a `(32, 3 * 224 * 224)` tensor to feed a `nn.Linear` layer. Which is correct?",
          options: [
            "`x.reshape(32, -1)` — keep the batch axis, flatten everything else.",
            "`x.reshape(-1, 32)` — makes the batch axis last, wrong for Linear.",
            "`x.flatten()` — collapses the batch axis too, giving one huge vector.",
            "`x.T` — transposes only the last two axes.",
          ],
          correct: 0,
          explanation:
            "`nn.Linear` expects `(batch, features)`. `x.reshape(32, -1)` keeps the 32 samples separate and lets PyTorch compute the flat feature length (3·224·224 = 150,528). Option C would merge all batches into one flat vector — a very common bug.",
        },
      ],
    },
    {
      step: 15,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can now read, shape, and index any tensor an AI paper throws at you. Next: **the dot product and matrix multiplication** — the two operations that every layer, every attention head, and every embedding lookup boils down to.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lessons 2–10 — full-depth. Same 15-step template as lesson 1.
// ---------------------------------------------------------------------------

const dotProductMatmul: Lesson = {
  slug: "dot-product-matmul",
  trackSlug: "math-for-ai",
  order: 2,
  minutes: 16,
  title: "Dot Product and Matrix Multiplication",
  subtitle:
    "Two operations. Every neural network, every attention head, every embedding lookup boils down to these — repeated at scale.",
  tags: ["Dot product", "Matmul", "Linear algebra"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "You have two vectors. You want a single number that says how *aligned* they are. You have a stack of vectors and a stack of weights. You want to combine every input with every weight, in one go, on a GPU.",
        },
        {
          type: "text",
          content:
            "Both problems are solved by the same operation, at two different scales: the **dot product** for a pair of vectors, and **matrix multiplication** for stacks of them. Learn these two and 90% of the arithmetic inside a neural network stops being mysterious.",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "A single `nn.Linear` layer is one matrix multiply. An attention head is three matrix multiplies. A transformer block is a dozen. The famous `mat1 and mat2 shapes cannot be multiplied (32x784 and 128x10)` error is the #1 runtime bug in deep learning — and it disappears the moment you can read matmul shapes on sight.",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition — the dot product",
      blocks: [
        {
          type: "text",
          content:
            "The dot product of two vectors is a single number. To compute it: multiply them element-by-element, then add the results.",
        },
        {
          type: "list",
          items: [
            "Big positive number → the vectors point in the **same** direction.",
            "Around zero → the vectors are **perpendicular** (unrelated).",
            "Big negative number → they point in **opposite** directions.",
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "The dot product is an **agreement score**. It's the reason attention can ask \"which of these tokens is most relevant to this query?\" — it just dots the query against every key.",
        },
      ],
    },
    {
      step: 4,
      title: "A real-world analogy",
      blocks: [
        {
          type: "text",
          content:
            "You rate three restaurants on Italian-ness: `[9, 2, 6]`. Your friend rates the same three on how much they'd enjoy them: `[8, 3, 7]`. The dot product is `9·8 + 2·3 + 6·7 = 72 + 6 + 42 = 120` — a single number saying how much their preferences agree with your Italian rankings.",
        },
        {
          type: "text",
          content:
            "Now imagine 100 friends and 1,000 restaurants. You want *every* friend's agreement with *every* restaurant profile. That's not 100,000 dot products written out one by one — that's one matrix multiplication.",
        },
      ],
    },
    {
      step: 5,
      title: "Visualize the shapes",
      blocks: [
        {
          type: "diagram",
          label: "Matmul is dot products in bulk",
          chart: `flowchart LR
    A["A: (m, k)<br/>m rows"] --> M["A @ B<br/>(m, n)"]
    B["B: (k, n)<br/>n cols"] --> M
    M --> R["Each cell (i, j)<br/>= dot(row i of A,<br/>col j of B)"]
    style A fill:#eef7ff,stroke:#8ecdff
    style B fill:#eef7ff,stroke:#8ecdff
    style M fill:#d9edff,stroke:#8ecdff
    style R fill:#f6f7f9,stroke:#d3d7e0`,
        },
        {
          type: "callout",
          kind: "insight",
          title: "The shape rule",
          content:
            "`A @ B` requires the **inner** dimensions of A and B to match. `(m, k) @ (k, n) → (m, n)`. The `k` in the middle disappears; the outer dimensions are what you get back.",
        },
      ],
    },
    {
      step: 6,
      title: "The math",
      blocks: [
        {
          type: "callout",
          kind: "math",
          title: "Dot product",
          content:
            "$$\\mathbf{a} \\cdot \\mathbf{b} = \\sum_{i=1}^{n} a_i b_i$$\n\nOne number in, one number out. Both vectors must have the same length `n`.",
        },
        {
          type: "callout",
          kind: "math",
          title: "Matrix multiplication",
          content:
            "$$C_{ij} = \\sum_{k=1}^{K} A_{ik} B_{kj}$$\n\nEvery cell of `C` is the dot product of one row of `A` with one column of `B`.",
        },
        {
          type: "callout",
          kind: "math",
          title: "Geometric identity for the dot product",
          content:
            "$$\\mathbf{a} \\cdot \\mathbf{b} = \\|\\mathbf{a}\\| \\, \\|\\mathbf{b}\\| \\cos\\theta$$\n\nWhere $\\theta$ is the angle between the two vectors. This is why the dot product measures alignment — it literally scales with $\\cos\\theta$.",
        },
      ],
    },
    {
      step: 7,
      title: "Build them from scratch",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "dot_and_matmul_by_hand.py",
          code: `def dot(a, b):
    """Dot product of two 1-D lists of equal length."""
    assert len(a) == len(b), "shapes must match"
    return sum(x * y for x, y in zip(a, b))

def matmul(A, B):
    """A: m x k list of lists.  B: k x n list of lists.  Returns m x n."""
    m, k = len(A), len(A[0])
    k2, n = len(B), len(B[0])
    assert k == k2, f"inner dims must match: got {k} vs {k2}"
    # Every cell C[i][j] is dot(row i of A, col j of B)
    return [
        [sum(A[i][p] * B[p][j] for p in range(k)) for j in range(n)]
        for i in range(m)
    ]

# Sanity check
a = [1, 2, 3]
b = [4, 5, 6]
print(dot(a, b))                            # 1*4 + 2*5 + 3*6 = 32

A = [[1, 2],
     [3, 4]]
B = [[5, 6],
     [7, 8]]
print(matmul(A, B))                         # [[19, 22], [43, 50]]`,
        },
      ],
    },
    {
      step: 8,
      title: "Run it — read the numbers",
      blocks: [
        {
          type: "code",
          language: "text",
          label: "Output",
          code: `32
[[19, 22], [43, 50]]`,
        },
        {
          type: "text",
          content:
            "Check by hand: the top-left cell of the result is `1·5 + 2·7 = 19`. The top-right is `1·6 + 2·8 = 22`. Row-of-A dotted with column-of-B, every time. That's the whole rule.",
        },
      ],
    },
    {
      step: 9,
      title: "The production version — NumPy and PyTorch",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "matmul_torch.py",
          code: `import numpy as np
import torch

# Dot product — 1-D vectors
a = torch.tensor([1., 2., 3.])
b = torch.tensor([4., 5., 6.])
print(torch.dot(a, b))          # tensor(32.)
print(a @ b)                    # same thing — 32.

# Matmul — 2-D matrices
A = torch.tensor([[1., 2.], [3., 4.]])
B = torch.tensor([[5., 6.], [7., 8.]])
print(A @ B)                    # tensor([[19., 22.], [43., 50.]])
print(torch.matmul(A, B))       # identical

# Batch matmul — 3-D tensors
# Shape (batch=8, m=4, k=5) @ (batch=8, k=5, n=6) -> (8, 4, 6)
Ab = torch.randn(8, 4, 5)
Bb = torch.randn(8, 5, 6)
print((Ab @ Bb).shape)          # torch.Size([8, 4, 6])`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "The `@` operator is Python's matmul operator. `a @ b` works for 1-D dot products, 2-D matmul, and batched N-D matmul. It's the single most-typed symbol in modern deep-learning code.",
        },
      ],
    },
    {
      step: 10,
      title: "Where a linear layer lives",
      blocks: [
        {
          type: "text",
          content:
            "`nn.Linear(in_features=3, out_features=2)` is literally: pick a weight matrix `W` of shape `(2, 3)` and a bias `b` of shape `(2,)`, then compute `y = x @ W.T + b`.",
        },
        {
          type: "code",
          language: "python",
          label: "linear_by_hand_vs_pytorch.py",
          code: `import torch, torch.nn as nn

x = torch.tensor([[1., 2., 3.]])        # (batch=1, in=3)
W = torch.tensor([[0.1, 0.2, 0.3],
                  [0.4, 0.5, 0.6]])     # (out=2, in=3)
b = torch.tensor([0.01, 0.02])          # (out=2,)

# From scratch
y_manual = x @ W.T + b                  # (1, 3) @ (3, 2) + (2,) -> (1, 2)
print(y_manual)                         # tensor([[1.4100, 3.2200]])

# PyTorch's version, weights forced to match
layer = nn.Linear(3, 2)
with torch.no_grad():
    layer.weight.copy_(W)
    layer.bias.copy_(b)
print(layer(x))                         # tensor([[1.4100, 3.2200]])  same`,
        },
      ],
    },
    {
      step: 11,
      title: "Where you'll see this",
      blocks: [
        {
          type: "list",
          items: [
            "**Every linear layer** in every network — one matmul plus a bias.",
            "**Attention scores** — `Q @ K.T` is a matrix of dot products between every query and every key.",
            "**Embedding lookup** is a one-hot vector matmul'd with the embedding matrix — that's why looking up a token is a matmul under the hood.",
            "**Similarity search** in a vector DB — one query vector dotted against millions of stored vectors, in one big matmul.",
            "**Convolutions** are re-arranged matmuls (\"im2col\") on GPUs, which is why NVIDIA hardware is so good at both.",
          ],
        },
      ],
    },
    {
      step: 12,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "\"mat1 and mat2 shapes cannot be multiplied\"",
          content:
            "The inner dimensions don't match. `(32, 784) @ (128, 10)` fails because 784 ≠ 128. Fix: transpose one of them, or check whether you meant `x @ W.T` instead of `x @ W`.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Row-vector vs column-vector confusion",
          content:
            "Papers usually treat inputs as column vectors: `y = W x`. Deep-learning frameworks treat batches as rows: `y = x @ W.T`. Same math, transposed layout. Pick a convention and stick to it in your own code.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Confusing element-wise `*` with `@`",
          content:
            "`a * b` in NumPy/PyTorch is **element-wise** (Hadamard) product — same shape in, same shape out. `a @ b` is the dot product / matmul. Using `*` where you meant `@` will happily run and give you numeric garbage.",
        },
      ],
    },
    {
      step: 13,
      title: "Interview questions",
      blocks: [
        {
          type: "list",
          style: "number",
          items: [
            "Given `A: (32, 784)` and `W: (784, 128)`, what is the shape of `A @ W`? *(`(32, 128)` — inner 784s cancel.)*",
            "Why is `Q @ K.T` in attention a matrix, not a vector? *(Q has one row per query token, K has one row per key token. The result is `(n_queries, n_keys)` — a full alignment table.)*",
            "How many multiplications and additions does an `m × k` times `k × n` matmul cost? *(m·n·k multiplications and roughly the same number of additions — the reason big matmul is the dominant cost of training.)*",
          ],
        },
      ],
    },
    {
      step: 14,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You want to feed a batch of 64 embeddings, each of dimension 512, through a linear layer that outputs 128 features. What are the shapes of the input, weight, and output tensors?",
          options: [
            "Input `(64, 512)`, weight `(128, 512)`, output `(64, 128)` — `x @ W.T` gives `(64, 128)`.",
            "Input `(512, 64)`, weight `(512, 128)`, output `(128, 64)`.",
            "Input `(64, 512)`, weight `(512, 128)`, output `(64, 128)` — matmul directly, no transpose.",
            "Both A and C describe valid layouts — A matches PyTorch's `nn.Linear`, C is the math-textbook form. Same operation, different weight layout.",
          ],
          correct: 3,
          explanation:
            "PyTorch stores `nn.Linear` weights as `(out, in) = (128, 512)` and computes `x @ W.T`. A plain math-first implementation stores W as `(in, out) = (512, 128)` and computes `x @ W`. Both give `(64, 128)`; both are 'right'. Confusing them is where the transpose bugs come from.",
        },
      ],
    },
    {
      step: 15,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can multiply anything by anything with the right shapes. Next: **norms, distance, and cosine similarity** — the ways to measure a vector's length and the distance between two, and why cosine similarity is the metric behind every semantic search system.",
        },
      ],
    },
  ],
};

const normsDistanceCosine: Lesson = {
  slug: "norms-distance-cosine",
  trackSlug: "math-for-ai",
  order: 3,
  minutes: 14,
  title: "Norms, Distance, and Cosine Similarity",
  subtitle:
    "How to measure the length of a vector and the distance between two — the math behind k-NN, embeddings search, and clustering.",
  tags: ["L1", "L2", "Cosine similarity", "Distance"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "You have two sentence embeddings, each a vector of 768 numbers. Are these sentences saying the same thing? You have a user's preference vector and a million products. Which twenty are most like their taste? Both questions come down to *measuring the distance between two vectors* — and there's more than one way to do it.",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "Every semantic search engine, every vector database, every k-nearest-neighbor classifier, every clustering algorithm ranks results by a distance function. Picking the wrong one — Euclidean when you should have used cosine, or vice versa — silently degrades your app. The math is easy; the choice is what matters.",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition — three ways to measure",
      blocks: [
        {
          type: "kv",
          items: [
            {
              key: "L2 (Euclidean) norm",
              value: "Straight-line length. The Pythagorean-theorem distance you already know.",
            },
            {
              key: "L1 (Manhattan / taxicab) norm",
              value: "Sum of absolute values. Distance if you can only move along grid streets.",
            },
            {
              key: "Cosine similarity",
              value: "Ignores length entirely — measures only the angle between two vectors. Two vectors pointing the same direction have cosine similarity 1.",
            },
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "For embeddings, **direction encodes meaning, length encodes intensity**. Cosine similarity strips out the intensity so you're comparing pure semantic direction. That's why every semantic search system uses it.",
        },
      ],
    },
    {
      step: 4,
      title: "A real-world analogy",
      blocks: [
        {
          type: "text",
          content:
            "You have two movie-preference vectors: `[10, 8, 2]` (loves action, romance, hates horror) and `[5, 4, 1]` (same tastes, but less intense — maybe a lighter movie-goer). The Euclidean distance between them is large — they *feel* different by magnitude. But the cosine similarity is nearly 1 — they point the same direction in taste-space. For a recommender, that's what you care about.",
        },
      ],
    },
    {
      step: 5,
      title: "Visualize it",
      blocks: [
        {
          type: "diagram",
          label: "Three distances in 2D",
          chart: `flowchart LR
    A["Point A<br/>(1, 4)"] --> E["L2: straight line<br/>sqrt(dx^2 + dy^2)"]
    A --> M["L1: grid walk<br/>|dx| + |dy|"]
    A --> C["Cosine: angle<br/>between rays from origin"]
    B["Point B<br/>(4, 2)"] --> E
    B --> M
    B --> C
    style E fill:#eef7ff,stroke:#8ecdff
    style M fill:#d9edff,stroke:#8ecdff
    style C fill:#c6e2ff,stroke:#8ecdff`,
        },
        {
          type: "text",
          content:
            "Same pair of points, three different distances. L2 is the ruler. L1 is the taxi meter. Cosine ignores where the points are and asks only *what direction do they lie in* from the origin.",
        },
      ],
    },
    {
      step: 6,
      title: "The math",
      blocks: [
        {
          type: "callout",
          kind: "math",
          title: "The p-norms",
          content:
            "$$\\|\\mathbf{x}\\|_p = \\left( \\sum_{i} |x_i|^p \\right)^{1/p}$$\n\n• $p=1$: L1 (Manhattan).  \n• $p=2$: L2 (Euclidean) — the default.  \n• $p=\\infty$: L∞ (Chebyshev) — the largest absolute component.",
        },
        {
          type: "callout",
          kind: "math",
          title: "Distances from norms",
          content:
            "Distance between two vectors is the norm of their difference:\n\n$$d(\\mathbf{a}, \\mathbf{b}) = \\|\\mathbf{a} - \\mathbf{b}\\|$$",
        },
        {
          type: "callout",
          kind: "math",
          title: "Cosine similarity and cosine distance",
          content:
            "$$\\cos(\\mathbf{a}, \\mathbf{b}) = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\|\\mathbf{a}\\|_2 \\, \\|\\mathbf{b}\\|_2}$$\n\n• Range: $[-1, 1]$ (usually $[0, 1]$ for embeddings, which tend to sit in a positive cone).  \n• Cosine **distance** is $1 - \\cos$ so that identical vectors have distance 0.",
        },
      ],
    },
    {
      step: 7,
      title: "Build them from scratch",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "norms_by_hand.py",
          code: `import math

def l1(x):        return sum(abs(v) for v in x)
def l2(x):        return math.sqrt(sum(v*v for v in x))
def linf(x):      return max(abs(v) for v in x)

def dot(a, b):    return sum(x*y for x, y in zip(a, b))

def cosine_similarity(a, b):
    denom = l2(a) * l2(b)
    if denom == 0:
        return 0.0
    return dot(a, b) / denom

# Two similar taste vectors
a = [10, 8, 2]
b = [5,  4, 1]

print("L2 distance :", l2([ai - bi for ai, bi in zip(a, b)]))  # ~5.83
print("L1 distance :", l1([ai - bi for ai, bi in zip(a, b)]))  # 10
print("Cosine sim  :", cosine_similarity(a, b))                # ~0.9997`,
        },
      ],
    },
    {
      step: 8,
      title: "Run it and read the result",
      blocks: [
        {
          type: "code",
          language: "text",
          label: "Output",
          code: `L2 distance : 5.830951894845301
L1 distance : 10
Cosine sim  : 0.9996954135095478`,
        },
        {
          type: "text",
          content:
            "L2 says these vectors are ~5.8 apart, L1 says 10. But cosine similarity is 0.9997 — they point in almost exactly the same direction. For a recommendation engine, that's what matters. For \"how much does this user like movies\", the magnitudes still count.",
        },
      ],
    },
    {
      step: 9,
      title: "The production version — NumPy and PyTorch",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "norms_torch.py",
          code: `import torch, torch.nn.functional as F

a = torch.tensor([10., 8., 2.])
b = torch.tensor([5.,  4., 1.])

# Norms
torch.linalg.norm(a - b, ord=2)   # tensor(5.8310)
torch.linalg.norm(a - b, ord=1)   # tensor(10.)

# Cosine similarity — one call, batched-friendly
F.cosine_similarity(a.unsqueeze(0), b.unsqueeze(0))  # tensor([0.9997])

# Pairwise cosine over a batch of query vs many candidates
queries    = torch.randn(4, 768)      # 4 queries
candidates = torch.randn(1000, 768)   # 1000 documents

# L2-normalize once, then dot product == cosine similarity
q = F.normalize(queries,    dim=1)
c = F.normalize(candidates, dim=1)
scores = q @ c.T                      # (4, 1000) — every pair`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "The two-liner at the bottom is exactly how a vector DB scores similarity: L2-normalize both sides once, then a single matmul gives every query-vs-every-document cosine similarity.",
        },
      ],
    },
    {
      step: 10,
      title: "Which one when?",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "Text / image embeddings", value: "**Cosine** — direction is meaning, magnitude is noise from the encoder." },
            { key: "Physical measurements (heights, prices)", value: "**L2 (Euclidean)** — magnitudes are real." },
            { key: "Sparse / high-dimensional data (bag-of-words)", value: "**L1** or cosine — robust to zero-heavy vectors." },
            { key: "Outlier-sensitive settings", value: "**L1** — one huge component doesn't dominate the way it does in L2." },
            { key: "Recommender systems", value: "**Cosine** — user rating scales differ, direction doesn't." },
          ],
        },
      ],
    },
    {
      step: 11,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Comparing cosine similarity to L2 distance",
          content:
            "Higher cosine similarity = more similar. Higher L2 distance = *less* similar. Mixing them up and sorting the wrong way is a subtle bug that only shows up as \"my search is returning random stuff\".",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Forgetting to normalize before storing embeddings",
          content:
            "If you're going to use cosine similarity, L2-normalize your vectors *once* at write time. Then cosine similarity is just a dot product — 10× faster at query time, and every vector DB does it this way.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Dividing by zero",
          content:
            "Cosine similarity divides by `‖a‖ · ‖b‖`. A zero vector — e.g. an all-zeros embedding from a filtering-out step — will blow up. Add an `eps` (like PyTorch's default `1e-8`) or return `0` on zero input.",
        },
      ],
    },
    {
      step: 12,
      title: "Where you'll see this",
      blocks: [
        {
          type: "list",
          items: [
            "**Semantic search / RAG retrieval** — cosine similarity between the query embedding and every stored chunk.",
            "**k-NN classifiers** — L2 or cosine, depending on whether magnitudes matter.",
            "**K-Means clustering** — L2 distance under the hood, which is why K-Means struggles on high-dimensional embeddings and why *spherical* K-Means (cosine) exists.",
            "**Weight decay** in optimizers is an L2 penalty on parameters, keeping them small.",
            "**Loss regularization** — L1 pushes coefficients to *exactly* zero (Lasso), L2 shrinks them smoothly (Ridge).",
          ],
        },
      ],
    },
    {
      step: 13,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You build a semantic search over product descriptions. Every stored embedding is L2-normalized. To rank a query against every product, what should you compute — and why is normalization already done a big win?",
          options: [
            "Dot product between the (also L2-normalized) query and every stored embedding. When both sides are unit vectors, the dot product IS cosine similarity — one matmul instead of a divide per candidate.",
            "L2 distance between the query and every stored embedding.",
            "L1 distance, then take the reciprocal.",
            "Cosine similarity computed from scratch each time (with the norm-of-both-vectors divide) — normalization at write time doesn't help.",
          ],
          correct: 0,
          explanation:
            "For unit vectors, `‖a‖ = ‖b‖ = 1`, so `cos(a, b) = a · b`. That means one matmul against the whole store gives you every similarity — no per-row divide. This is the standard pattern in FAISS, Chroma, Qdrant, Weaviate, and pgvector.",
        },
      ],
    },
    {
      step: 14,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can now measure how similar two vectors are. Next: **eigenvalues, eigenvectors, and PCA** — the geometry that turns a 784-dimensional MNIST image into a 2-D dot on a scatter plot, with almost no information lost.",
        },
      ],
    },
  ],
};

const eigenvaluesPca: Lesson = {
  slug: "eigenvalues-pca",
  trackSlug: "math-for-ai",
  order: 4,
  minutes: 18,
  title: "Eigenvalues, Eigenvectors, and PCA",
  subtitle:
    "The directions a matrix stretches, the amount it stretches by, and the trick that compresses 784-D MNIST to a 2-D scatter plot.",
  tags: ["Eigenvalues", "Eigenvectors", "PCA", "Dimensionality reduction"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "You've got a dataset with hundreds of features — 784 pixels per MNIST digit, 768 dimensions per BERT embedding, 40 columns per customer record. You can't plot it. You can't intuit it. And a lot of those features are correlated — they're carrying the same information twice.",
        },
        {
          type: "text",
          content:
            "**Principal Component Analysis (PCA)** rotates the data so its most-informative directions come first, letting you keep the top 2, 5, or 50 and throw the rest away. To understand *why* those directions exist and how to find them, you need one idea from linear algebra: the **eigenvector**.",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "PCA is the entry point to every dimensionality-reduction technique that came after — t-SNE, UMAP, autoencoders — and it's still the fastest way to visualize a high-dimensional dataset. Eigenvectors also power PageRank, spectral clustering, quantum mechanics, and the *entire* theory of how neural-network Jacobians behave. Two concepts, huge return.",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition — a matrix as a stretch",
      blocks: [
        {
          type: "text",
          content:
            "Think of a matrix `A` as a function that takes a vector in and gives a different vector out. Usually it both **rotates** and **stretches** the input. But for special input directions — the eigenvectors — the matrix only stretches, never rotates.",
        },
        {
          type: "list",
          items: [
            "The **eigenvector** is the direction that survives: the output points the same way as the input.",
            "The **eigenvalue** is how much longer (or shorter) the output is compared to the input.",
            "A matrix of shape `(n, n)` usually has `n` eigenvector/eigenvalue pairs — one per axis of stretch.",
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "Eigenvectors are the **natural axes** of a matrix. Rotate your coordinate system to them and the matrix becomes a simple diagonal — pure stretching, no rotation.",
        },
      ],
    },
    {
      step: 4,
      title: "A real-world analogy",
      blocks: [
        {
          type: "text",
          content:
            "Imagine standing on a trampoline while someone pushes it in one specific direction. Most points on the mat move at weird angles. But along the exact axis of the push, points just move outward or inward — no sideways drift. That axis is the eigenvector of the push, and the ratio 'how much a point moved' vs 'how far out it started' is the eigenvalue.",
        },
        {
          type: "text",
          content:
            "For a dataset, the 'push' is the **covariance matrix** — a summary of which features move together. Its eigenvectors are the directions along which your data varies the most. Those directions are the **principal components**.",
        },
      ],
    },
    {
      step: 5,
      title: "Visualize it",
      blocks: [
        {
          type: "diagram",
          label: "A matrix's action on a general vector vs an eigenvector",
          chart: `flowchart LR
    V1["General vector v"] --> M1["A · v"] --> R1["Rotated + scaled<br/>different direction"]
    V2["Eigenvector e"] --> M2["A · e"] --> R2["Same direction<br/>scaled by λ"]
    style V1 fill:#f6f7f9,stroke:#d3d7e0
    style V2 fill:#eef7ff,stroke:#8ecdff
    style R2 fill:#d9edff,stroke:#8ecdff`,
        },
        {
          type: "text",
          content:
            "General vectors get twisted. Eigenvectors are the *fixed axes* — the matrix scales them but never turns them.",
        },
      ],
    },
    {
      step: 6,
      title: "The math",
      blocks: [
        {
          type: "callout",
          kind: "math",
          title: "The defining equation",
          content:
            "$$A \\mathbf{v} = \\lambda \\mathbf{v}$$\n\nRead: applying the matrix `A` to the vector `v` gives the same direction back, scaled by `λ`. `v` is the eigenvector, `λ` is the eigenvalue.",
        },
        {
          type: "callout",
          kind: "math",
          title: "PCA in three lines",
          content:
            "Given data $X \\in \\mathbb{R}^{n \\times d}$ (n samples, d features):\n\n1. **Center**: $\\tilde{X} = X - \\bar{X}$ (subtract the mean of each column).\n2. **Covariance**: $\\Sigma = \\frac{1}{n-1} \\tilde{X}^\\top \\tilde{X}$ — a $d \\times d$ matrix.\n3. **Eigendecompose** $\\Sigma$. Sort eigenvectors by eigenvalue, biggest first. The top $k$ eigenvectors are your principal components.",
        },
        {
          type: "text",
          content:
            "Projecting the centered data onto the top `k` eigenvectors gives you a compressed `(n, k)` matrix that captures as much variance as `k` numbers can.",
        },
      ],
    },
    {
      step: 7,
      title: "Build PCA from scratch",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "pca_from_scratch.py",
          code: `import numpy as np

def pca(X, k):
    # 1. Center
    mu = X.mean(axis=0)
    Xc = X - mu

    # 2. Covariance matrix — shape (d, d)
    cov = (Xc.T @ Xc) / (len(X) - 1)

    # 3. Eigendecomposition
    eigvals, eigvecs = np.linalg.eigh(cov)     # symmetric → eigh is faster/stabler

    # Sort by eigenvalue, largest first
    order   = np.argsort(eigvals)[::-1]
    eigvals = eigvals[order]
    eigvecs = eigvecs[:, order]

    # 4. Project onto top-k eigenvectors
    components = eigvecs[:, :k]                # (d, k)
    X_reduced  = Xc @ components               # (n, k)

    explained = eigvals[:k] / eigvals.sum()
    return X_reduced, components, explained

# Toy dataset — 200 points in 3D with one dominant direction
rng = np.random.default_rng(0)
X = rng.normal(size=(200, 3)) * np.array([5, 1, 0.1])   # variance is huge on axis 0

reduced, comps, explained = pca(X, k=2)
print("reduced.shape :", reduced.shape)        # (200, 2)
print("explained     :", explained.round(3))   # ~[0.96, 0.04]`,
        },
      ],
    },
    {
      step: 8,
      title: "Run it — what does 'explained variance' mean?",
      blocks: [
        {
          type: "code",
          language: "text",
          label: "Output",
          code: `reduced.shape : (200, 2)
explained     : [0.96 0.04]`,
        },
        {
          type: "text",
          content:
            "The first principal component captures 96% of the variance in the data, the second another 4%. The third axis had almost no variance — throwing it away lost basically nothing. That's the entire premise of PCA: **most of the information sits in a handful of directions**, and PCA finds them for you.",
        },
      ],
    },
    {
      step: 9,
      title: "The production version — scikit-learn",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "pca_sklearn.py",
          code: `from sklearn.decomposition import PCA
from sklearn.datasets  import load_digits
import matplotlib.pyplot as plt

digits = load_digits()
X, y = digits.data, digits.target        # X: (1797, 64)  — 8x8 pixels

# Compress 64-D → 2-D
Z = PCA(n_components=2).fit_transform(X)

plt.scatter(Z[:, 0], Z[:, 1], c=y, cmap="tab10", s=8)
plt.title("MNIST-lite in 2 dimensions (PCA)")
plt.show()`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "You've just compressed 64-dimensional pixel data to 2 numbers per digit — and the digits still cluster by class. That's why PCA is the first thing you try when exploring a new high-dimensional dataset.",
        },
      ],
    },
    {
      step: 10,
      title: "Where you'll see this",
      blocks: [
        {
          type: "list",
          items: [
            "**Visualization** — the go-to move for looking at high-D embeddings in 2 or 3 dimensions.",
            "**Whitening / preprocessing** — PCA plus a scale-to-unit-variance step removes correlations between features before training.",
            "**Compressing embeddings** — 1536-D OpenAI embeddings often work almost as well at 256-D after PCA.",
            "**PageRank** is the eigenvector of the web's link matrix — every ranking system is a spiritual cousin.",
            "**Spectral clustering / graph analysis** — eigenvectors of a graph Laplacian find natural communities.",
          ],
        },
      ],
    },
    {
      step: 11,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Forgetting to center the data",
          content:
            "Skip the mean-subtraction and the first principal component becomes the direction from the origin to your data cloud — a meaningless axis. Always center first.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Mixing features with wildly different scales",
          content:
            "PCA is variance-hungry: a feature measured in millions will dominate one measured in fractions, even if the second is more informative. **Standardize** to zero mean and unit variance before PCA on mixed-unit features.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Keeping too many components",
          content:
            "PCA is a compression technique — the win comes from throwing dimensions away. Plot the explained-variance ratio and cut where it plateaus (the 'elbow'), or pick the smallest `k` that reaches 95% of total variance.",
        },
      ],
    },
    {
      step: 12,
      title: "Interview questions",
      blocks: [
        {
          type: "list",
          style: "number",
          items: [
            "What does an eigenvalue physically represent for the covariance matrix of your data? *(The variance of the data along the corresponding eigenvector direction.)*",
            "Why is `eigh` preferred over `eig` for PCA? *(The covariance matrix is symmetric; `eigh` exploits that for stability and speed and returns real eigenvalues.)*",
            "When does PCA fail? *(When the useful signal isn't along high-variance directions — e.g. classification where the discriminative axis is a low-variance one. That's when you switch to LDA or a supervised method.)*",
          ],
        },
      ],
    },
    {
      step: 13,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "Your explained-variance ratios for the first four components are `[0.60, 0.28, 0.08, 0.02]`. You want at least 95% of the variance retained. How many components do you keep?",
          options: [
            "3 — cumulative variance is 0.60 + 0.28 + 0.08 = 0.96, the smallest `k` that crosses 95%.",
            "1 — the largest component already dominates.",
            "4 — always keep all listed components.",
            "2 — 0.60 + 0.28 = 0.88 is close enough.",
          ],
          correct: 0,
          explanation:
            "Add components in order until the cumulative sum crosses your threshold. `0.60 + 0.28 = 0.88` (below 0.95), `0.60 + 0.28 + 0.08 = 0.96` (crosses). So `k = 3` is the smallest that hits the target.",
        },
      ],
    },
    {
      step: 14,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You now understand the geometry of high-dimensional data. Next: **embeddings, geometrically** — how words, sentences, and images live as points in that same kind of space, and why `king - man + woman ≈ queen` is just vector arithmetic once you know the math.",
        },
      ],
    },
  ],
};

const embeddingsGeometrically: Lesson = {
  slug: "embeddings-geometrically",
  trackSlug: "math-for-ai",
  order: 5,
  minutes: 14,
  title: "Embeddings, Geometrically",
  subtitle:
    "Words, sentences, and images as points in high-dimensional space — why `king - man + woman ≈ queen` isn't magic, it's geometry.",
  tags: ["Embeddings", "Word2Vec", "Semantic space"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "A neural network can't work with the word 'cat'. It can only work with numbers. So the very first step of every language model, every semantic search system, every recommender is to turn each token (word, sentence, product, image, user) into a fixed-length vector of real numbers — an **embedding**.",
        },
        {
          type: "text",
          content:
            "The hard part isn't picking a vector. Any hashing function could do that. The hard part is picking vectors so that **geometric relationships in vector space match semantic relationships in the real world.** That's what makes embeddings useful.",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "RAG, semantic search, recommendations, clustering, classification, deduplication, anomaly detection — every one of these is downstream of a good embedding. The magic isn't the embedding model itself; the magic is that *once you have the vectors, all your problems become geometry problems*, and geometry is easy.",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition — meaning as position",
      blocks: [
        {
          type: "text",
          content:
            "Imagine a giant map. Every English word is a dot. Words that mean similar things sit close together. Words that come up in similar contexts sit in the same neighborhood — 'king' near 'monarch', 'cat' near 'kitten', 'joy' near 'delight'. Different concepts fill different regions of the map.",
        },
        {
          type: "list",
          items: [
            "**Similar things → close** (small distance / high cosine similarity).",
            "**Different things → far** (large distance / low cosine).",
            "**Consistent relationships → parallel directions** — the vector from 'man' to 'king' is roughly the same as from 'woman' to 'queen'. That's what powers the famous analogy.",
          ],
        },
      ],
    },
    {
      step: 4,
      title: "A real-world analogy",
      blocks: [
        {
          type: "text",
          content:
            "Think of a city map. Museums cluster near the old town, airports live on the outskirts, industrial parks near the highways. Even without labels, if I show you a new dot on the map and it lands in the museum district, you can predict what's there. Embedding space is the same trick — cities are concepts, and neighborhoods are meanings.",
        },
      ],
    },
    {
      step: 5,
      title: "Visualize the space",
      blocks: [
        {
          type: "diagram",
          label: "Embedding neighborhoods and the analogy vector",
          chart: `flowchart LR
    K["king"] -. same offset .-> Q["queen"]
    M["man"]  -. same offset .-> W["woman"]
    K --- M
    Q --- W
    C["cat / kitten / tabby<br/>animal cluster"]
    J["joy / delight / bliss<br/>emotion cluster"]
    style K fill:#eef7ff,stroke:#8ecdff
    style Q fill:#eef7ff,stroke:#8ecdff
    style M fill:#d9edff,stroke:#8ecdff
    style W fill:#d9edff,stroke:#8ecdff
    style C fill:#f6f7f9,stroke:#d3d7e0
    style J fill:#f6f7f9,stroke:#d3d7e0`,
        },
        {
          type: "text",
          content:
            "Two things happen in a well-trained embedding space: **clustering** (similar meanings pile up) and **linear structure** (relationships become consistent directions).",
        },
      ],
    },
    {
      step: 6,
      title: "The math",
      blocks: [
        {
          type: "callout",
          kind: "math",
          title: "An embedding matrix is just a lookup",
          content:
            "For a vocabulary of size $V$ and embedding dimension $d$, the embedding matrix $E \\in \\mathbb{R}^{V \\times d}$ has one row per token. To embed token $i$, take row $i$:\n\n$$\\text{embed}(i) = E_i$$\n\nEquivalently, if $\\mathbf{o}_i$ is a one-hot vector for token $i$, then $E_i = \\mathbf{o}_i^\\top E$ — a matmul.",
        },
        {
          type: "callout",
          kind: "math",
          title: "The analogy formula",
          content:
            "For an analogy 'a is to b as c is to ?':\n\n$$\\mathbf{v} = \\mathbf{e}_b - \\mathbf{e}_a + \\mathbf{e}_c$$\n\nThen return the vocabulary word whose embedding has the highest cosine similarity to $\\mathbf{v}$ — excluding a, b, c themselves.",
        },
      ],
    },
    {
      step: 7,
      title: "Build a tiny embedding by hand",
      blocks: [
        {
          type: "text",
          content:
            "Before pretrained models existed, people built embeddings from raw co-occurrence counts and dimensionality reduction. Here's the essence in 20 lines:",
        },
        {
          type: "code",
          language: "python",
          label: "tiny_embedding.py",
          code: `import numpy as np

corpus = [
    "the king rules the kingdom",
    "the queen rules the kingdom",
    "the man walks the dog",
    "the woman walks the dog",
    "the cat sleeps",
    "the kitten sleeps",
]

# 1. Build vocabulary
words = sorted({w for line in corpus for w in line.split()})
idx   = {w: i for i, w in enumerate(words)}

# 2. Co-occurrence matrix (window = 1)
V = len(words)
C = np.zeros((V, V))
for line in corpus:
    toks = line.split()
    for i, w in enumerate(toks):
        for j in range(max(0, i-1), min(len(toks), i+2)):
            if i != j:
                C[idx[w], idx[toks[j]]] += 1

# 3. SVD to compress into a small embedding space
U, S, _ = np.linalg.svd(C, full_matrices=False)
E = U[:, :2] * S[:2]      # 2-D embedding per word

def cos(a, b):
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9)

print("king vs queen :", cos(E[idx["king"]],  E[idx["queen"]]))
print("king vs cat   :", cos(E[idx["king"]],  E[idx["cat"]]))`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "This is the ancestor of Word2Vec, GloVe, and every modern embedding model: count co-occurrences, then compress. Everything since has been better ways to do exactly those two steps.",
        },
      ],
    },
    {
      step: 8,
      title: "The production version — pretrained embeddings",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "sentence_embeddings.py",
          code: `# uv add sentence-transformers
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")   # 384-D embeddings

sents = [
    "A cat is sitting on the mat.",
    "There is a kitten on the rug.",
    "The stock market crashed today.",
]
E = model.encode(sents, normalize_embeddings=True)   # (3, 384)

def cos(a, b): return a @ b   # already normalized

print("cat vs kitten :", cos(E[0], E[1]).round(3))   # ~0.75
print("cat vs market :", cos(E[0], E[2]).round(3))   # ~0.05`,
        },
        {
          type: "text",
          content:
            "The first two sentences describe nearly the same scene with different words. Their embeddings sit close together. The third is unrelated — orthogonal-ish in embedding space. That single property is the entire foundation of semantic search.",
        },
      ],
    },
    {
      step: 9,
      title: "The king / queen analogy — in code",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "analogy.py",
          code: `# With pretrained GloVe or Word2Vec vectors loaded into 'vecs' as a dict of word -> np.ndarray:
def analogy(a, b, c, vecs, top_k=1):
    target = vecs[b] - vecs[a] + vecs[c]
    target = target / np.linalg.norm(target)

    scores = {}
    for w, v in vecs.items():
        if w in (a, b, c):
            continue
        scores[w] = target @ (v / np.linalg.norm(v))
    return sorted(scores.items(), key=lambda kv: kv[1], reverse=True)[:top_k]

# analogy("man", "king", "woman", vecs)  ->  [("queen", 0.78), ...]`,
        },
        {
          type: "text",
          content:
            "The famous result is literally that formula on Word2Vec vectors. It works because the training objective forces gender, royalty, tense, plurality, and other relationships to become consistent directions in vector space.",
        },
      ],
    },
    {
      step: 10,
      title: "Where you'll see this",
      blocks: [
        {
          type: "list",
          items: [
            "**RAG** — embed the question, find the closest document chunks, feed them into the LLM.",
            "**Semantic search** — replace keyword matching with vector similarity.",
            "**Recommendation** — embed users and items in the same space; recommend items closest to the user vector.",
            "**Classification with few labels** — embed everything, then run a simple classifier on the vectors.",
            "**Clustering / deduplication** — group by embedding proximity, dedup by nearly-identical vectors.",
            "**Multi-modal retrieval** — CLIP embeds images and text in a shared space, so 'photo of a dog' can retrieve dog pictures.",
          ],
        },
      ],
    },
    {
      step: 11,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Mixing embeddings from different models",
          content:
            "Each model has its own space. An OpenAI embedding is not comparable to a MiniLM embedding — the axes literally mean different things. Pick one model per index and stick with it.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Forgetting to normalize",
          content:
            "If you're going to compare with cosine similarity, L2-normalize at write time. Then similarity is a plain dot product — one matmul against your whole index.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Chunking that destroys meaning",
          content:
            "Embed a 500-page PDF as one vector? Useless. Split into ~200–800-token chunks with overlap, embed each, and let the retriever pick the relevant chunks. This is the single biggest lever in RAG quality.",
        },
      ],
    },
    {
      step: 12,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You've built a semantic search over a support-ticket dataset. When users search for 'refund', they get results about *refunds*, but also 'cancellation policy' and 'money back guarantee'. Why?",
          options: [
            "The embedding model learned that these phrases co-occur in similar contexts, so they cluster near each other. That's the feature, not a bug — pure keyword search would miss the last two.",
            "The embedding model is broken.",
            "You forgot to normalize your embeddings.",
            "The vector database has bad indexing.",
          ],
          correct: 0,
          explanation:
            "Semantic search retrieves by meaning, not by string. Phrases about refund-adjacent concepts share direction in embedding space, so they come back for related queries. This is exactly why you use embeddings instead of `LIKE '%refund%'` in the first place.",
        },
      ],
    },
    {
      step: 13,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You understand how AI represents meaning as geometry. That closes out the linear-algebra half of this track. Next: **derivatives, gradients, and the chain rule** — the calculus that lets a model actually *learn* the embeddings and weights in the first place.",
        },
      ],
    },
  ],
};

const derivativesChainRule: Lesson = {
  slug: "derivatives-gradients-chain-rule",
  trackSlug: "math-for-ai",
  order: 6,
  minutes: 18,
  title: "Derivatives, Gradients, and the Chain Rule",
  subtitle:
    "The slope of a function — and how to compose slopes when functions are stacked. The math that makes backprop possible.",
  tags: ["Derivatives", "Partial derivatives", "Chain rule"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "You have a loss function `L` that says how wrong your model is. It depends on millions of parameters. To train the model, you need to answer, for each parameter: **if I wiggle this one number by a tiny amount, does the loss go up or down, and by how much?**",
        },
        {
          type: "text",
          content:
            "That answer is the **derivative** with respect to that parameter. Stack the answers for all parameters into a vector, and you have the **gradient**. Chain derivatives across a deep network with the **chain rule**, and you have backpropagation.",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "Every training loop is: compute loss → compute its gradient with respect to each parameter → nudge parameters against the gradient → repeat. Autograd hides the machinery, but the moment training gets weird — vanishing gradients, exploding gradients, `nan` losses — the debugging is calculus.",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition — slope in one direction",
      blocks: [
        {
          type: "text",
          content:
            "The derivative of a function at a point is its **slope** at that point. Sign tells you which way the function moves; magnitude tells you how steeply.",
        },
        {
          type: "list",
          items: [
            "Positive derivative → the function is going *up* as `x` increases.",
            "Negative derivative → it's going *down*.",
            "Zero derivative → you're at a flat spot: a minimum, maximum, or saddle.",
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "For multi-input functions, the **partial derivative** is the slope in one direction while pretending every other input is frozen. The **gradient** is the vector of all the partials — pointing uphill fastest.",
        },
      ],
    },
    {
      step: 4,
      title: "A real-world analogy",
      blocks: [
        {
          type: "text",
          content:
            "You're a hiker in the fog. You can't see the peak, but you can feel the slope with your feet. In each direction you're facing (north, east, up-a-tree), you can tell whether the ground rises or falls. Those feels are your partial derivatives. Combined into one arrow pointing 'steepest uphill', that arrow is the gradient. Walk *against* it and you'll roll downhill — which is exactly what gradient descent does.",
        },
      ],
    },
    {
      step: 5,
      title: "Visualize the chain rule",
      blocks: [
        {
          type: "diagram",
          label: "Stacked functions → multiplied slopes",
          chart: `flowchart LR
    X((x)) -- "z = g(x)" --> Z((z))
    Z -- "y = f(z)" --> Y((y))
    Y -. "dy/dz" .-> Z
    Z -. "dz/dx" .-> X
    S["dy/dx = dy/dz * dz/dx"]
    style X fill:#f6f7f9,stroke:#d3d7e0
    style Z fill:#eef7ff,stroke:#8ecdff
    style Y fill:#d9edff,stroke:#8ecdff
    style S fill:#c6e2ff,stroke:#8ecdff`,
        },
        {
          type: "text",
          content:
            "Chain rule in one sentence: to get the derivative of a composition, **multiply the derivatives of each step**. Backprop is this rule applied layer by layer, from the loss all the way back to every weight.",
        },
      ],
    },
    {
      step: 6,
      title: "The math",
      blocks: [
        {
          type: "callout",
          kind: "math",
          title: "Derivative — single variable",
          content:
            "$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\n\nCommon derivatives you should recognize on sight:\n\n• $\\frac{d}{dx}(x^n) = n x^{n-1}$  \n• $\\frac{d}{dx}(e^x) = e^x$  \n• $\\frac{d}{dx}(\\ln x) = 1/x$  \n• $\\frac{d}{dx}(\\sigma(x)) = \\sigma(x)(1 - \\sigma(x))$ &nbsp; ← sigmoid  \n• $\\frac{d}{dx}(\\text{ReLU}(x)) = 1$ if $x > 0$, else $0$",
        },
        {
          type: "callout",
          kind: "math",
          title: "Partial derivatives and the gradient",
          content:
            "For $f(x_1, x_2, \\dots, x_n)$, the partial derivative $\\frac{\\partial f}{\\partial x_i}$ is the derivative treating every other variable as constant. Stack them:\n\n$$\\nabla f = \\left[ \\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, \\dots, \\frac{\\partial f}{\\partial x_n} \\right]$$",
        },
        {
          type: "callout",
          kind: "math",
          title: "The chain rule",
          content:
            "If $y = f(g(x))$, then\n\n$$\\frac{dy}{dx} = \\frac{dy}{dz} \\cdot \\frac{dz}{dx} \\quad \\text{where} \\quad z = g(x)$$\n\nFor a deep network with layers $L_1, L_2, \\dots, L_n$, the gradient of the loss w.r.t. an early weight is a *product* of local derivatives along the path — that's why deep networks can suffer vanishing or exploding gradients.",
        },
      ],
    },
    {
      step: 7,
      title: "Numeric derivative — the definition in code",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "numeric_gradient.py",
          code: `def numeric_derivative(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)   # centered difference — more accurate

def numeric_gradient(f, x, h=1e-5):
    """Gradient of a function f: R^n -> R at point x (a list of floats)."""
    grad = []
    for i in range(len(x)):
        x_plus, x_minus = x.copy(), x.copy()
        x_plus[i]  += h
        x_minus[i] -= h
        grad.append((f(x_plus) - f(x_minus)) / (2 * h))
    return grad

# Try it: f(x) = x^2 has derivative 2x
print(numeric_derivative(lambda x: x**2, 3.0))    # ~6.0

# f(x, y) = x^2 + 3xy + y^2  ->  gradient is [2x+3y, 3x+2y]
f = lambda v: v[0]**2 + 3*v[0]*v[1] + v[1]**2
print(numeric_gradient(f, [1.0, 2.0]))            # [~8.0, ~7.0]`,
        },
        {
          type: "callout",
          kind: "tip",
          title: "Why not just always use numeric gradients?",
          content:
            "Numeric gradients need `2n` function evaluations for `n` parameters. On a network with millions of parameters, that's millions of forward passes per training step — hopeless. Autograd computes exact gradients in **one** backward pass. That's why we bother with symbolic calculus.",
        },
      ],
    },
    {
      step: 8,
      title: "Chain rule by hand on a mini network",
      blocks: [
        {
          type: "text",
          content:
            "Consider a one-neuron model with sigmoid output and a squared-error loss on a single example. Parameters: `w`, `b`. Input: `x`. Target: `t`.",
        },
        {
          type: "callout",
          kind: "math",
          content:
            "$z = w x + b, \\quad y = \\sigma(z), \\quad L = \\tfrac{1}{2}(y - t)^2$\n\nBy the chain rule, going backwards:\n\n• $\\frac{\\partial L}{\\partial y} = y - t$  \n• $\\frac{\\partial y}{\\partial z} = y(1 - y)$  \n• $\\frac{\\partial z}{\\partial w} = x$  \n• $\\frac{\\partial z}{\\partial b} = 1$  \n\nMultiply along the path:\n\n$\\frac{\\partial L}{\\partial w} = (y - t) \\cdot y(1 - y) \\cdot x$\n\n$\\frac{\\partial L}{\\partial b} = (y - t) \\cdot y(1 - y)$",
        },
        {
          type: "text",
          content:
            "That's the exact formula PyTorch computes when you call `loss.backward()` on a one-neuron model. Every hidden layer adds another `dz/dprev` factor to the product.",
        },
      ],
    },
    {
      step: 9,
      title: "The production version — PyTorch autograd",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "autograd_demo.py",
          code: `import torch

# Parameters — track gradients
w = torch.tensor(0.5,  requires_grad=True)
b = torch.tensor(-0.2, requires_grad=True)

x, t = torch.tensor(1.5), torch.tensor(1.0)

# Forward
z = w * x + b
y = torch.sigmoid(z)
L = 0.5 * (y - t) ** 2

# Backward — fills w.grad and b.grad automatically
L.backward()

print("dL/dw =", w.grad.item())
print("dL/db =", b.grad.item())

# Compare with the hand-derived formula
hand_dw = ((y - t) * y * (1 - y) * x).item()
hand_db = ((y - t) * y * (1 - y)).item()
print("hand  =", hand_dw, hand_db)   # exactly matches`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "Autograd is nothing but the chain rule automated. Every PyTorch op records how to compute its own local derivative; `.backward()` walks the computation graph in reverse and multiplies them together.",
        },
      ],
    },
    {
      step: 10,
      title: "Where you'll see this",
      blocks: [
        {
          type: "list",
          items: [
            "**Every `.backward()` call** — the chain rule, at scale.",
            "**Vanishing gradients** — products of many small derivatives collapse to zero. That's why sigmoid + deep networks was a dead end until ReLU.",
            "**Exploding gradients** — products of derivatives > 1 blow up. Fix with gradient clipping.",
            "**Learning-rate tuning** — you're scaling the size of a gradient step. Derivative magnitude times learning rate is the effective update.",
            "**Gradient checking** — compare numeric vs. autograd gradients when implementing a custom layer. They should match to ~1e-6.",
          ],
        },
      ],
    },
    {
      step: 11,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Forgetting `optimizer.zero_grad()`",
          content:
            "PyTorch *accumulates* gradients across `.backward()` calls (a feature, for gradient accumulation). If you don't zero them each step, your gradient is the sum of the last N steps and training goes haywire.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Calling `.backward()` twice on the same graph",
          content:
            "The graph is freed after one backward pass. Second call → `RuntimeError`. Fix: `.backward(retain_graph=True)` if you really need it, but usually you don't.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Detaching where you shouldn't",
          content:
            "`.detach()`, `torch.no_grad()`, and in-place ops on leaf tensors all break the graph. If your loss won't decrease, print `param.grad` — a `None` there means the graph got cut somewhere between the parameter and the loss.",
        },
      ],
    },
    {
      step: 12,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "For $L = \\tfrac{1}{2}(y-t)^2$ with $y = \\sigma(z)$ and $z = wx + b$, what is $\\frac{\\partial L}{\\partial w}$?",
          options: [
            "$(y - t) \\cdot y(1-y) \\cdot x$ — chain rule: dL/dy · dy/dz · dz/dw.",
            "$(y - t) \\cdot x$ — that's the linear-regression gradient, no sigmoid.",
            "$(y - t)^2 \\cdot x$ — squared term stays squared.",
            "$y(1-y) \\cdot x$ — that's just the sigmoid derivative times x.",
          ],
          correct: 0,
          explanation:
            "Chain rule, three factors: dL/dy = y − t, dy/dz = y(1−y) (sigmoid derivative), dz/dw = x. Multiply them and you get the full gradient. Option B skips the sigmoid; option D skips the loss's outer derivative.",
        },
      ],
    },
    {
      step: 13,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can compute gradients. Next: **gradient descent by hand** — turning that vector into an actual training loop that walks parameters downhill and finds a minimum.",
        },
      ],
    },
  ],
};

const gradientDescentByHand: Lesson = {
  slug: "gradient-descent-by-hand",
  trackSlug: "math-for-ai",
  order: 7,
  minutes: 16,
  title: "Gradient Descent by Hand",
  subtitle:
    "One line of math, one loop of code — and every AI model on Earth learns this way.",
  tags: ["Gradient descent", "Optimization", "Learning rate"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "You have a loss function that scores how wrong your model is. You have the gradient — the direction of steepest ascent. All that's left is to walk **downhill**: nudge every parameter a small amount in the opposite direction of its gradient, then repeat until the loss stops going down.",
        },
        {
          type: "text",
          content:
            "That's gradient descent. Fifteen lines of Python. And every deep-learning model on Earth — GPT-5, Stable Diffusion, AlphaFold — was trained by a fancier version of exactly this loop.",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "Two things: (1) if you don't understand plain gradient descent, momentum, Adam, and AdamW are opaque — they're all patches to fix its failure modes. (2) 80% of the times training goes wrong, the answer is 'change the learning rate'. Debugging that requires knowing how the update rule actually behaves.",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition — a ball rolling down a bowl",
      blocks: [
        {
          type: "text",
          content:
            "Imagine the loss as a landscape: `θ` (parameters) on the ground, `L(θ)` (loss) as height. You want the lowest point. Drop a ball. It rolls in the steepest downhill direction, moves a bit, feels the new slope, moves again. Do this forever and — in a bowl-shaped landscape — you'll reach the bottom.",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "The **step size** is the learning rate. Too small and the ball creeps. Too large and it launches over the bowl and off the map. Almost every 'my model won't train' bug is a learning-rate choice.",
        },
      ],
    },
    {
      step: 4,
      title: "A real-world analogy",
      blocks: [
        {
          type: "text",
          content:
            "You're that foggy hiker again. You feel the slope with your feet. You take a step against it. New spot: new slope. New step. Eventually you settle in a valley. If your steps are too tiny you'll spend all day walking; too big and you'll leap over the valley entirely and start climbing the other side.",
        },
      ],
    },
    {
      step: 5,
      title: "Visualize the trajectory",
      blocks: [
        {
          type: "diagram",
          label: "Three learning rates on the same parabola",
          chart: `flowchart LR
    S1["Start: θ = 5"] --> A["η too small<br/>tiny steps, slow"]
    S1 --> B["η just right<br/>steady descent"]
    S1 --> C["η too large<br/>overshoots, diverges"]
    A --> Ae["ends near 4 after 100 steps"]
    B --> Be["ends near 0 after 30 steps"]
    C --> Ce["shoots off to infinity"]
    style A fill:#f6f7f9,stroke:#d3d7e0
    style B fill:#d9edff,stroke:#8ecdff
    style C fill:#ffe8e8,stroke:#e08a8a`,
        },
      ],
    },
    {
      step: 6,
      title: "The math",
      blocks: [
        {
          type: "callout",
          kind: "math",
          title: "The update rule",
          content:
            "$$\\theta_{t+1} = \\theta_t - \\eta \\, \\nabla L(\\theta_t)$$\n\n• $\\theta_t$ = the parameters at step $t$ (a vector).  \n• $\\nabla L(\\theta_t)$ = the gradient of the loss at $\\theta_t$ (a vector, same shape).  \n• $\\eta$ = the learning rate — a small positive scalar like $10^{-3}$.  \n• The minus sign is why it *descends* — we're walking against the gradient.",
        },
      ],
    },
    {
      step: 7,
      title: "Build it from scratch — 1D parabola",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "gd_1d.py",
          code: `# Minimize f(x) = (x - 3)^2  ->  the minimum is at x = 3
def f(x):       return (x - 3) ** 2
def grad(x):    return 2 * (x - 3)

x  = 0.0         # starting point
lr = 0.1         # learning rate
for step in range(30):
    g = grad(x)
    x = x - lr * g
    if step % 5 == 0:
        print(f"step {step:3d}  x = {x:7.4f}  loss = {f(x):.4f}")

print("final x =", x)     # ~3.0`,
        },
        {
          type: "code",
          language: "text",
          label: "Output",
          code: `step   0  x = 0.6000  loss = 5.7600
step   5  x = 2.2130  loss = 0.6187
step  10  x = 2.7477  loss = 0.0636
step  15  x = 2.9186  loss = 0.0066
step  20  x = 2.9740  loss = 0.0007
step  25  x = 2.9917  loss = 0.0001
final x = 2.9973...`,
        },
      ],
    },
    {
      step: 8,
      title: "What the learning rate does",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "gd_learning_rate.py",
          code: `for lr in [0.001, 0.1, 0.9, 1.01]:
    x = 0.0
    for _ in range(30):
        x = x - lr * (2 * (x - 3))
    print(f"lr = {lr:>5}  ->  x after 30 steps = {x:10.4f}")

# lr = 0.001  ->  x = 0.1712       (way too small — barely moved)
# lr = 0.1    ->  x = 2.9973       (just right)
# lr = 0.9    ->  x = 2.9700       (works, but bounces)
# lr = 1.01   ->  x = -1.35e+00... (diverges — flying off to infinity)`,
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "The critical threshold",
          content:
            "For a quadratic loss $L = a x^2$, gradient descent converges only if $\\eta < 1/a$. Bigger and each step overshoots by *more* than it corrected — the trajectory diverges. Real losses aren't quadratic, but this intuition explains why picking `lr` too high is fatal.",
        },
      ],
    },
    {
      step: 9,
      title: "Two-parameter descent — a real loss surface",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "gd_2d.py",
          code: `import numpy as np

# Loss: L(w, b) = mean squared error on y = 2x + 1 (target line)
xs = np.array([1., 2., 3., 4., 5.])
ys = 2 * xs + 1

def loss(w, b):
    return ((w*xs + b - ys) ** 2).mean()

def grad(w, b):
    err = w*xs + b - ys
    dw  = 2 * (err * xs).mean()
    db  = 2 *  err.mean()
    return dw, db

w, b = 0.0, 0.0
lr   = 0.01
for step in range(2000):
    dw, db = grad(w, b)
    w -= lr * dw
    b -= lr * db

print(f"learned w = {w:.4f}, b = {b:.4f}")   # ~2.0, ~1.0
print(f"final loss  = {loss(w, b):.6f}")`,
        },
        {
          type: "text",
          content:
            "This is the entire training loop of a one-neuron linear regressor — no PyTorch, no scikit-learn. Every subsequent complication (SGD, momentum, Adam) is just this loop with tweaks.",
        },
      ],
    },
    {
      step: 10,
      title: "The production version — torch.optim",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "gd_torch.py",
          code: `import torch

xs = torch.tensor([1., 2., 3., 4., 5.])
ys = 2 * xs + 1

w = torch.zeros(1, requires_grad=True)
b = torch.zeros(1, requires_grad=True)

opt = torch.optim.SGD([w, b], lr=0.01)

for _ in range(2000):
    opt.zero_grad()
    loss = ((w*xs + b - ys) ** 2).mean()
    loss.backward()
    opt.step()

print("w =", w.item(), " b =", b.item())      # ~2.0, ~1.0`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "`opt.step()` is literally `for p in params: p -= lr * p.grad`. That's it. Every fancier optimizer replaces that one line with something smarter — momentum keeps a running average, Adam adds per-parameter learning rates, and so on.",
        },
      ],
    },
    {
      step: 11,
      title: "Stochastic and mini-batch variants",
      blocks: [
        {
          type: "kv",
          items: [
            {
              key: "Batch gradient descent",
              value: "Use the whole dataset per step. Slow, smooth, memory-hungry.",
            },
            {
              key: "Stochastic gradient descent (SGD)",
              value: "One example per step. Noisy but fast, and the noise helps escape shallow local minima.",
            },
            {
              key: "Mini-batch gradient descent",
              value: "A batch of e.g. 32–1024 examples per step. The universal default: fast, GPU-friendly, and the batch size becomes a real hyperparameter.",
            },
          ],
        },
      ],
    },
    {
      step: 12,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Learning rate too high → loss becomes `nan`",
          content:
            "Each step overshoots more than the last. Weights explode, then produce infinite/NaN activations. Drop the learning rate by 10× and try again.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Learning rate too low → loss barely moves",
          content:
            "Log the loss every few steps. If it drops but takes forever, bump the LR by 3–10×.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Local minima and saddle points",
          content:
            "In high dimensions, true local minima are rare — the real enemy is **saddle points** (flat in some directions, sloped in others). Momentum and Adam were invented largely to escape them.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Forgetting to normalize inputs",
          content:
            "If some features are in the millions and others near zero, their gradient magnitudes wildly differ — the effective learning rate is different per feature and the trajectory zigzags. Standardize inputs first.",
        },
      ],
    },
    {
      step: 13,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You're training a model and the loss decreases smoothly for 100 steps, then suddenly explodes to `nan`. Most likely cause?",
          options: [
            "Learning rate is too high — a fluctuation in the loss surface caused a step that overshot into unstable territory. Reduce the LR (10×) or add gradient clipping.",
            "Learning rate is too low.",
            "You need more training data.",
            "The model architecture is wrong.",
          ],
          correct: 0,
          explanation:
            "A smooth decrease that suddenly explodes is the classic signature of a learning rate that's just barely too high for the local curvature. Somewhere the gradient magnitude spiked (a steep region of the loss), the step overshot, and numerical stability collapsed. Standard fixes: lower `lr`, add `torch.nn.utils.clip_grad_norm_`, or switch to a scheduler that decays LR over time.",
        },
      ],
    },
    {
      step: 14,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "That closes out the calculus half of this track. Next: **probability and Bayes' theorem** — the language every classifier, retrieval system, and A/B test speaks under the hood.",
        },
      ],
    },
  ],
};

const probabilityBayes: Lesson = {
  slug: "probability-bayes",
  trackSlug: "math-for-ai",
  order: 8,
  minutes: 14,
  title: "Probability and Bayes' Theorem",
  subtitle:
    "How to reason about uncertain evidence — the framework underneath every classifier, every LLM, and every A/B test.",
  tags: ["Probability", "Bayes", "Conditional probability"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Real-world data is uncertain. You never know for certain whether an email is spam, whether a tumor is malignant, whether the next token is 'cat' or 'dog'. You need a math for reasoning about **beliefs** and **updating** them when new evidence comes in.",
        },
        {
          type: "text",
          content:
            "That math is probability. Its most useful rule is **Bayes' theorem** — how to combine a prior belief with a new piece of evidence to get a rational updated belief.",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "Every classifier outputs probabilities. Every LLM samples the next token from a probability distribution. Every A/B test is a Bayes-inspired update. Every RAG reranker is applying Bayes over retrieval candidates. Probability is the vocabulary; Bayes is the grammar.",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition — three quantities",
      blocks: [
        {
          type: "kv",
          items: [
            { key: "P(A)", value: "**Prior** — how likely A is *before* seeing any evidence." },
            { key: "P(B | A)", value: "**Likelihood** — how likely we'd see evidence B if A were true." },
            { key: "P(A | B)", value: "**Posterior** — how likely A is *after* seeing evidence B. This is usually the answer we want." },
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "The mistake people make: assuming P(A | B) equals P(B | A). It doesn't. 'Given you're a duck, you have wings' is nearly 100%. 'Given you have wings, you're a duck' isn't — there are birds, planes, and superheroes. Bayes is what connects the two.",
        },
      ],
    },
    {
      step: 4,
      title: "A real-world analogy — the medical-test paradox",
      blocks: [
        {
          type: "text",
          content:
            "A test for a rare disease is **99% accurate**: if you have the disease, it comes back positive 99% of the time (true positive), and if you don't, it comes back negative 99% of the time (true negative). The disease affects 1 in 1,000 people. You test positive. What's the chance you actually have the disease?",
        },
        {
          type: "text",
          content:
            "Most people say '99%'. The correct answer is closer to **9%**. Why? Because the disease is so rare that even a 1% false-positive rate on the huge healthy population produces far more false positives than true positives. Bayes' theorem is the machinery that gives you the right number.",
        },
      ],
    },
    {
      step: 5,
      title: "Visualize it — a natural-frequency tree",
      blocks: [
        {
          type: "diagram",
          label: "10,000 people tested",
          chart: `flowchart LR
    Pop["10,000 people"] --> S["10 sick<br/>(0.1%)"]
    Pop --> H["9,990 healthy<br/>(99.9%)"]
    S --> STP["~10 test positive<br/>(true positives)"]
    H --> HFP["~100 test positive<br/>(false positives, 1%)"]
    STP --> Tot["Total positives ≈ 110"]
    HFP --> Tot
    Tot --> Ans["P(sick | positive) ≈ 10/110 ≈ 9%"]
    style S fill:#eef7ff,stroke:#8ecdff
    style H fill:#f6f7f9,stroke:#d3d7e0
    style Ans fill:#d9edff,stroke:#8ecdff`,
        },
        {
          type: "text",
          content:
            "Draw the counts, and the paradox evaporates. Most of the positives come from the huge healthy population, not from the tiny sick one.",
        },
      ],
    },
    {
      step: 6,
      title: "The math",
      blocks: [
        {
          type: "callout",
          kind: "math",
          title: "Bayes' theorem",
          content:
            "$$P(A \\mid B) = \\frac{P(B \\mid A) \\, P(A)}{P(B)}$$\n\nAnd $P(B)$ (the 'evidence') is computed by summing over every way B could happen:\n\n$$P(B) = P(B \\mid A) \\, P(A) + P(B \\mid \\neg A) \\, P(\\neg A)$$",
        },
        {
          type: "callout",
          kind: "math",
          title: "Two other rules you'll see everywhere",
          content:
            "• **Product rule:** $P(A, B) = P(A \\mid B) \\, P(B) = P(B \\mid A) \\, P(A)$.  \n• **Sum rule:** $P(A) = \\sum_b P(A, B = b)$ (marginalize out B).  \n• **Independence:** if A and B are independent, $P(A \\mid B) = P(A)$ and $P(A, B) = P(A) \\, P(B)$.",
        },
      ],
    },
    {
      step: 7,
      title: "Solve the medical-test problem numerically",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "bayes_medical.py",
          code: `# Priors
p_sick    = 0.001
p_healthy = 1 - p_sick

# Likelihoods
p_pos_given_sick    = 0.99   # sensitivity / true positive rate
p_pos_given_healthy = 0.01   # false positive rate

# Total probability of a positive
p_pos = p_pos_given_sick * p_sick + p_pos_given_healthy * p_healthy

# Bayes
p_sick_given_pos = p_pos_given_sick * p_sick / p_pos
print(f"P(sick | positive) = {p_sick_given_pos:.4f}")   # ~0.0902

# ...and if you test positive AGAIN? Update the prior with the previous posterior.
new_prior = p_sick_given_pos
p_pos2 = p_pos_given_sick * new_prior + p_pos_given_healthy * (1 - new_prior)
print(f"After second positive: {p_pos_given_sick * new_prior / p_pos2:.4f}")   # ~0.907`,
        },
        {
          type: "text",
          content:
            "One positive test → about 9% chance of being sick. Two independent positives, using yesterday's posterior as today's prior, jumps to about 91%. That's Bayesian updating: **evidence accumulates**.",
        },
      ],
    },
    {
      step: 8,
      title: "Where you'll see this",
      blocks: [
        {
          type: "list",
          items: [
            "**Naive Bayes classifiers** — a spam filter is Bayes' theorem applied to word probabilities.",
            "**LLMs** — the model outputs $P(\\text{next token} \\mid \\text{context})$; sampling picks from that distribution.",
            "**Retrieval reranking** — score = $P(\\text{document relevant} \\mid \\text{query, retrieved-context})$.",
            "**A/B testing (Bayesian flavor)** — updating your belief about which variant is better as data comes in.",
            "**Kalman filters, particle filters, robotics** — everything that fuses prior belief with noisy sensor data.",
            "**Calibration** — a model output of 0.8 should actually correspond to being right 80% of the time. Uncalibrated confidence is a Bayesian problem.",
          ],
        },
      ],
    },
    {
      step: 9,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Base rate neglect",
          content:
            "Ignoring the prior. If most emails aren't spam, then a 'spam-detected' signal is less informative than it seems. Bayes forces you to factor that in.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Confusing P(A | B) with P(B | A)",
          content:
            "\"99% of terrorists use encrypted messaging\" doesn't mean \"99% of encrypted-messaging users are terrorists.\" This *exact* fallacy has driven bad policy — always draw the tree.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Treating dependent events as independent",
          content:
            "Naive Bayes assumes features are independent given the class. That's often wrong (nearby pixels are correlated!), which is why 'naive' Bayes works surprisingly well on text (words are roughly independent) but poorly on images.",
        },
      ],
    },
    {
      step: 10,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "A cancer screening test has 95% sensitivity and 90% specificity. The disease affects 1% of the population. A patient tests positive. Roughly what is the probability they have the disease?",
          options: [
            "~9% — the low prior (1%) plus a 10% false-positive rate on the 99% healthy pool means most positives are false.",
            "~95% — that's the sensitivity.",
            "~90% — that's the specificity.",
            "~50% — coin flip.",
          ],
          correct: 0,
          explanation:
            "P(pos) = 0.95·0.01 + 0.10·0.99 = 0.0095 + 0.099 = 0.1085. Bayes: P(disease | pos) = 0.0095 / 0.1085 ≈ 0.088 ≈ 9%. The disease is rare, so even a moderately good test produces mostly false positives.",
        },
      ],
    },
    {
      step: 11,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You can reason about uncertainty and update beliefs. Next: **distributions, expectation, and variance** — the shapes that randomness takes, and the two summary numbers every ML paper reports.",
        },
      ],
    },
  ],
};

const distributionsExpectationVariance: Lesson = {
  slug: "distributions-expectation-variance",
  trackSlug: "math-for-ai",
  order: 9,
  minutes: 14,
  title: "Distributions, Expectation, and Variance",
  subtitle:
    "The shapes randomness takes — Bernoulli, Gaussian, categorical — and the two numbers that summarize any of them.",
  tags: ["Distributions", "Expectation", "Variance", "Gaussian"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "You have a random quantity — the next token an LLM will emit, whether a user will click, the noise in a sensor, the initial value of a neural-network weight. To reason about it, you need three things: a **distribution** (which values are possible and with what weight), an **expectation** (the typical value), and a **variance** (how spread out the values are).",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "Almost every loss function in ML is written as an expectation over a distribution. Weight initialization schemes (Xavier, He) are chosen to control variance at each layer. Dropout, noise injection, sampling from softmax, denoising in diffusion — all of it is manipulating distributions. You cannot read a modern AI paper without this vocabulary.",
        },
      ],
    },
    {
      step: 3,
      title: "The four distributions AI actually uses",
      blocks: [
        {
          type: "kv",
          items: [
            {
              key: "Bernoulli",
              value: "One yes/no event. `P(X=1) = p, P(X=0) = 1-p`. Used for binary classification labels.",
            },
            {
              key: "Categorical",
              value: "One outcome from K choices with probabilities `[p₁, …, p_K]` summing to 1. The output of a softmax layer.",
            },
            {
              key: "Gaussian (Normal)",
              value: "Continuous, bell-shaped. Two parameters: mean μ and variance σ². The go-to distribution for weight init, noise, and errors.",
            },
            {
              key: "Uniform",
              value: "Every value in a range equally likely. The default for random dropout masks and initial data shuffles.",
            },
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "You don't need dozens. About 90% of AI math uses only these four — and often just Bernoulli, Categorical, and Gaussian.",
        },
      ],
    },
    {
      step: 4,
      title: "A real-world analogy",
      blocks: [
        {
          type: "text",
          content:
            "Imagine a class of 100 students taking an exam. The **distribution** is a histogram of every possible score. The **expectation** is the class average. The **variance** is how much the scores are spread — a class where everyone got 70 has low variance; a class split between 40s and 90s has high variance. The same three concepts describe every source of randomness in AI.",
        },
      ],
    },
    {
      step: 5,
      title: "Visualize the shapes",
      blocks: [
        {
          type: "diagram",
          label: "Four distributions at a glance",
          chart: `flowchart LR
    B["Bernoulli<br/>{0, 1}"] --> Bex["e.g. click / no click"]
    C["Categorical<br/>{1, ..., K}"] --> Cex["e.g. softmax over classes"]
    G["Gaussian<br/>continuous, bell curve"] --> Gex["e.g. weight init, noise"]
    U["Uniform<br/>continuous / discrete"] --> Uex["e.g. dropout masks, random inits"]
    style B fill:#f6f7f9,stroke:#d3d7e0
    style C fill:#eef7ff,stroke:#8ecdff
    style G fill:#d9edff,stroke:#8ecdff
    style U fill:#c6e2ff,stroke:#8ecdff`,
        },
      ],
    },
    {
      step: 6,
      title: "The math",
      blocks: [
        {
          type: "callout",
          kind: "math",
          title: "Expectation",
          content:
            "**Discrete:** $\\mathbb{E}[X] = \\sum_{x} x \\, P(X = x)$.\n\n**Continuous:** $\\mathbb{E}[X] = \\int x \\, p(x) \\, dx$.\n\nIn plain English: the weighted average, where the weights are the probabilities.",
        },
        {
          type: "callout",
          kind: "math",
          title: "Variance and standard deviation",
          content:
            "$$\\text{Var}(X) = \\mathbb{E}\\!\\left[(X - \\mu)^2\\right] = \\mathbb{E}[X^2] - \\mu^2$$\n\nwhere $\\mu = \\mathbb{E}[X]$. Standard deviation is $\\sigma = \\sqrt{\\text{Var}(X)}$ — same units as $X$, easier to interpret.",
        },
        {
          type: "callout",
          kind: "math",
          title: "The Gaussian pdf",
          content:
            "$$p(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\!\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$$\n\nMean $\\mu$, variance $\\sigma^2$. This function shows up in weight init, MSE loss, VAEs, diffusion — everywhere.",
        },
      ],
    },
    {
      step: 7,
      title: "Compute expectation and variance from scratch",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "expectation_variance.py",
          code: `# A biased die with sides [1..6] and non-uniform probabilities
values = [1, 2, 3, 4, 5, 6]
probs  = [0.05, 0.10, 0.15, 0.20, 0.25, 0.25]
assert abs(sum(probs) - 1) < 1e-9

# E[X]
mu = sum(v * p for v, p in zip(values, probs))

# Var(X) = E[X^2] - (E[X])^2
ex2 = sum(v * v * p for v, p in zip(values, probs))
var = ex2 - mu ** 2
std = var ** 0.5

print(f"E[X]   = {mu:.4f}")     # 4.15
print(f"Var(X) = {var:.4f}")    # 2.0275
print(f"std    = {std:.4f}")    # 1.4239`,
        },
      ],
    },
    {
      step: 8,
      title: "The production version — NumPy and torch.distributions",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "distributions_torch.py",
          code: `import numpy as np
import torch
from torch.distributions import Bernoulli, Categorical, Normal

# Sample from a Gaussian(mean=0, std=1)
z = Normal(0., 1.).sample((1000,))
print("empirical mean:", z.mean().item(), " var:", z.var().item())

# Categorical — like sampling from a softmax
logits = torch.tensor([2.0, 1.0, 0.5])
probs  = torch.softmax(logits, dim=0)
samples = Categorical(probs=probs).sample((5,))
print(samples)                     # e.g. tensor([0, 2, 0, 1, 0])

# Bernoulli — classic yes/no
Bernoulli(probs=0.7).sample((10,)) # e.g. tensor([1., 1., 0., 1., 1., 0., 1., 1., 1., 1.])`,
        },
      ],
    },
    {
      step: 9,
      title: "Where you'll see this",
      blocks: [
        {
          type: "list",
          items: [
            "**Softmax output** = a Categorical distribution over classes. Sampling = a temperature-controlled draw.",
            "**Cross-entropy loss** = negative log-likelihood of the Categorical distribution. Same math as this lesson, with a minus sign.",
            "**Xavier / He weight init** = drawing weights from a Gaussian with variance tuned so activations don't explode or vanish across layers.",
            "**Dropout** = per-neuron Bernoulli masks with probability $p$.",
            "**Diffusion models** = literally adding Gaussian noise and learning to reverse it.",
            "**VAEs** = encode inputs into a Gaussian latent, sample, decode. The whole design is about pushing distributions around.",
          ],
        },
      ],
    },
    {
      step: 10,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Sample variance vs. population variance",
          content:
            "NumPy's `np.var(x)` divides by `n`. `np.var(x, ddof=1)` divides by `n-1` (Bessel's correction) — the correct unbiased estimator when `x` is a *sample* from a bigger population. Statistics packages default to `ddof=1`; NumPy defaults to `ddof=0`. Know which you want.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Assuming Gaussianity",
          content:
            "Real-world data — clicks, prices, response times, image pixels — is rarely Gaussian. Log-transforms sometimes make it *closer* to Gaussian. When it doesn't fit, don't force it; use a distribution that matches the data (Poisson, log-normal, categorical).",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Correlation is not causation",
          content:
            "Two variables with high covariance move together — that doesn't tell you which causes which, or whether a third variable is behind both. This is one of the most-abused ideas in every field, ML included.",
        },
      ],
    },
    {
      step: 11,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You initialize a layer's weights from a Gaussian with mean 0 and variance 4. Activations coming out of the layer are consistently blowing up as you go deeper. What's the most likely fix?",
          options: [
            "Reduce the initialization variance to something like `2 / fan_in` (He init) — variance of 4 is far too large; the sums-of-squares explode across layers.",
            "Switch to uniform init with the same variance.",
            "Turn off gradient clipping.",
            "Increase the variance further so activations 'settle'.",
          ],
          correct: 0,
          explanation:
            "Variance of activations compounds across layers. Modern inits (Xavier/He) pick variance ≈ 1/fan_in or 2/fan_in so the variance of each layer's output roughly matches its input, keeping activations stable at depth. Variance 4 with a big fan-in means each activation is a sum of many high-variance terms — instant explosion.",
        },
      ],
    },
    {
      step: 12,
      title: "What's next",
      blocks: [
        {
          type: "text",
          content:
            "You have distributions, expectations, and variances. The last lesson — **Maximum Likelihood and Hypothesis Testing** — puts them to work: deriving every loss function you use, and deciding whether an A/B test result is signal or noise.",
        },
      ],
    },
  ],
};

const mleHypothesisTesting: Lesson = {
  slug: "maximum-likelihood-hypothesis-testing",
  trackSlug: "math-for-ai",
  order: 10,
  minutes: 16,
  title: "Maximum Likelihood and Hypothesis Testing",
  subtitle:
    "Why every classifier minimizes cross-entropy, and how to decide whether an A/B test result is real or noise.",
  tags: ["Maximum likelihood", "MLE", "Hypothesis testing", "p-values"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Two questions close out the math track. First: **given some data, how do we pick the best parameters for a model?** Second: **given an experimental result, how do we decide whether it's real or just noise?**",
        },
        {
          type: "text",
          content:
            "The first is answered by **maximum likelihood estimation (MLE)** — the principle that quietly underlies every loss function you use. The second is answered by **hypothesis testing** — the p-value machinery behind every A/B test.",
        },
      ],
    },
    {
      step: 2,
      title: "Why it matters",
      blocks: [
        {
          type: "text",
          content:
            "MLE explains *why* you minimize cross-entropy for classification and MSE for regression — they're not arbitrary; they're log-likelihoods for specific distributions. Hypothesis testing lets you tell whether your fancy new prompt actually beats the old one, or whether the difference is chance. Two ideas, huge return.",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition — MLE",
      blocks: [
        {
          type: "text",
          content:
            "You have a coin that comes up heads with some unknown probability `p`. You flip it 10 times and get 7 heads. Which value of `p` best explains that data?",
        },
        {
          type: "list",
          items: [
            "`p = 0.1` predicts about 1 head out of 10 — very unlikely to see 7.",
            "`p = 0.5` predicts about 5 heads — plausible, but 7 is on the high side.",
            "`p = 0.7` predicts about 7 heads — matches perfectly.",
            "`p = 0.9` predicts about 9 heads — too many.",
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "The **maximum likelihood estimate** is the value of `p` that makes the observed data most probable. For the coin, that's `p = 0.7`. For a neural network, it's the weight vector that maximizes the probability of the training labels. That is training.",
        },
      ],
    },
    {
      step: 4,
      title: "MLE → the loss functions you already use",
      blocks: [
        {
          type: "callout",
          kind: "math",
          title: "General form",
          content:
            "Given data $D = \\{x_1, \\dots, x_n\\}$ modeled by $p(x \\mid \\theta)$, MLE picks:\n\n$$\\hat{\\theta} = \\arg\\max_\\theta \\prod_{i=1}^{n} p(x_i \\mid \\theta)$$\n\nProducts of small numbers underflow, so in practice we maximize the **log-likelihood** (or equivalently, minimize the *negative* log-likelihood):\n\n$$\\hat{\\theta} = \\arg\\min_\\theta \\; - \\sum_{i=1}^{n} \\log p(x_i \\mid \\theta)$$",
        },
        {
          type: "kv",
          items: [
            {
              key: "Regression + Gaussian noise",
              value: "Negative log-likelihood of a Gaussian collapses (after dropping constants) to **mean squared error (MSE)**.",
            },
            {
              key: "Binary classification",
              value: "Negative log-likelihood of a Bernoulli = **binary cross-entropy (BCE)**.",
            },
            {
              key: "Multi-class classification",
              value: "Negative log-likelihood of a Categorical = **cross-entropy loss** — the same formula PyTorch's `nn.CrossEntropyLoss` implements.",
            },
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "The losses aren't arbitrary. Each one is the negative log-likelihood of the distribution you're implicitly modeling. Choose the wrong loss and you've chosen the wrong distribution.",
        },
      ],
    },
    {
      step: 5,
      title: "MLE for a coin — from scratch",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "mle_coin.py",
          code: `import numpy as np

flips = np.array([1, 1, 0, 1, 1, 1, 0, 1, 0, 1])   # 7 heads out of 10

# Log-likelihood as a function of p
def log_likelihood(p):
    p = np.clip(p, 1e-9, 1 - 1e-9)
    return (flips * np.log(p) + (1 - flips) * np.log(1 - p)).sum()

# Sweep p and find the argmax
ps  = np.linspace(0.01, 0.99, 99)
lls = [log_likelihood(p) for p in ps]
p_hat = ps[int(np.argmax(lls))]

print(f"MLE for p = {p_hat:.2f}")   # 0.70 — matches heads / total = 7/10`,
        },
        {
          type: "text",
          content:
            "For the Bernoulli, the MLE has a closed form: `p̂ = (number of heads) / (number of flips)`. The most-likely coin is the one where 'heads probability' equals the observed rate. Every classifier is doing the same thing at a higher dimension.",
        },
      ],
    },
    {
      step: 6,
      title: "Hypothesis testing — the intuition",
      blocks: [
        {
          type: "text",
          content:
            "Your new prompt has a 12% success rate over 200 tries; the old prompt had 10% over 200. Is the new one actually better, or would you see a 2-point gap this often by chance?",
        },
        {
          type: "list",
          items: [
            "**Null hypothesis (H₀):** there's no difference — both prompts have the same true success rate.",
            "**Alternative (H₁):** the new prompt has a higher rate.",
            "**p-value:** assuming H₀ is true, the probability of seeing a gap *at least this big* by pure chance.",
            "Small p-value → the null explanation is implausible → reject H₀ → declare the difference real.",
          ],
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "A p-value is **not** the probability that H₀ is true. It's the probability of the data (or something more extreme) *assuming* H₀ is true. The distinction feels academic; it's the source of the most-abused number in science.",
        },
      ],
    },
    {
      step: 7,
      title: "A/B test — from scratch",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "ab_test.py",
          code: `import math
from statistics import NormalDist

# Two-sample z-test for proportions
def ab_test(successes_a, n_a, successes_b, n_b):
    p_a = successes_a / n_a
    p_b = successes_b / n_b
    p_pool = (successes_a + successes_b) / (n_a + n_b)

    # standard error under the null (same rate for both)
    se = math.sqrt(p_pool * (1 - p_pool) * (1/n_a + 1/n_b))
    z  = (p_b - p_a) / se

    # two-sided p-value
    p_value = 2 * (1 - NormalDist().cdf(abs(z)))
    return p_a, p_b, z, p_value

p_a, p_b, z, p = ab_test(20, 200, 24, 200)
print(f"A: {p_a:.3f},  B: {p_b:.3f},  z = {z:.2f},  p = {p:.3f}")`,
        },
        {
          type: "code",
          language: "text",
          label: "Output",
          code: `A: 0.100,  B: 0.120,  z = 0.68,  p = 0.494`,
        },
        {
          type: "text",
          content:
            "p ≈ 0.49 — nearly a coin flip. A 2-point gap on 200 users each is well within noise. To detect a real 2-point difference at typical thresholds you'd need thousands of users per arm.",
        },
      ],
    },
    {
      step: 8,
      title: "The production version — scipy.stats",
      blocks: [
        {
          type: "code",
          language: "python",
          label: "scipy_ttest.py",
          code: `from scipy import stats

# Two independent groups of measurements — e.g. latencies for two prompts
group_a = [0.42, 0.48, 0.51, 0.45, 0.40, 0.47]
group_b = [0.38, 0.35, 0.41, 0.37, 0.36, 0.39]

t, p = stats.ttest_ind(group_a, group_b, equal_var=False)   # Welch's t-test
print(f"t = {t:.2f},  p-value = {p:.4f}")`,
        },
        {
          type: "text",
          content:
            "For continuous outcomes (latency, revenue, embedding scores) use a t-test. For proportions (conversion rates) use a z-test. For non-normal data or small samples, use a non-parametric test (Mann-Whitney U). Scipy has all of them.",
        },
      ],
    },
    {
      step: 9,
      title: "Where you'll see this",
      blocks: [
        {
          type: "list",
          items: [
            "**Cross-entropy loss** — negative log-likelihood of the Categorical. This lesson's formula, applied at every training step.",
            "**MSE loss** — negative log-likelihood of a Gaussian with fixed variance.",
            "**Log-likelihood evaluation** for language models — perplexity is $e^{-\\text{mean log-likelihood}}$.",
            "**Prompt A/B tests** — every 'model V2 beats V1' claim needs a hypothesis test to be credible.",
            "**Model comparison** — likelihood ratios, AIC, BIC all derive from log-likelihoods.",
            "**LLM evaluation** — statistical significance testing is how you turn `12/50` vs `9/50` correct answers into a real conclusion.",
          ],
        },
      ],
    },
    {
      step: 10,
      title: "Common mistakes",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Treating p = 0.05 as sacred",
          content:
            "The 0.05 threshold is a convention, not a law. Report the actual p-value and the effect size. A p = 0.049 result on 30 samples is a lot weaker than a p = 0.001 result on 30,000.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Peeking / multiple comparisons",
          content:
            "If you run the same A/B test 20 times or check it daily, at some point you'll see a low p-value by chance. Fix: pre-register your sample size, or apply a correction (Bonferroni, Benjamini-Hochberg).",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Insufficient sample size",
          content:
            "A 'not statistically significant' result on 20 samples means nothing — you just didn't collect enough data. Run a **power calculation** upfront: what sample size do I need to detect the effect I care about?",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Confusing statistical significance with practical significance",
          content:
            "With 10 million users a 0.01% improvement can be highly statistically significant — and totally worthless in practice. Always report the effect size, not just the p-value.",
        },
      ],
    },
    {
      step: 11,
      title: "Test yourself",
      blocks: [
        {
          type: "quiz",
          question:
            "You're training a multi-class classifier. Why is `nn.CrossEntropyLoss` the correct loss, and what distribution is it implicitly modeling?",
          options: [
            "It's the negative log-likelihood of a **Categorical distribution** over the classes. Minimizing it is exactly maximum likelihood estimation for the model's predicted class probabilities.",
            "It's the L2 distance between predicted and true labels.",
            "It's a heuristic that happens to work well.",
            "It's the negative log-likelihood of a **Gaussian** — that's why the outputs are class probabilities.",
          ],
          correct: 0,
          explanation:
            "Cross-entropy is exactly `-log P(true_class | inputs)` where `P` is the Categorical distribution defined by the softmax outputs. Minimizing it maximizes the log-likelihood of the correct labels — pure MLE. That's why softmax + cross-entropy is the near-universal choice for classification.",
        },
      ],
    },
    {
      step: 12,
      title: "Track finished — where you've landed",
      blocks: [
        {
          type: "text",
          content:
            "Ten lessons in, you have every mathematical tool a modern AI engineer actually uses:",
        },
        {
          type: "list",
          items: [
            "**Linear algebra** — vectors, matrices, tensors, matmul, norms, eigenvectors, PCA, embeddings.",
            "**Calculus** — derivatives, gradients, the chain rule, gradient descent.",
            "**Probability & statistics** — Bayes, distributions, expectation, variance, maximum likelihood, hypothesis testing.",
          ],
        },
        {
          type: "text",
          content:
            "Every remaining track — classical ML, deep learning, transformers, LLMs, RAG, agents — is built on this foundation. When a paper writes `E[log p(x|θ)]` or `∇_θ L(θ)` or `‖a - b‖₂`, you now know exactly what it means and why.",
        },
        {
          type: "text",
          content:
            "Next up: **Classical Machine Learning** — linear regression, decision trees, gradient boosting, k-means, and the evaluation habits that separate 'works in the notebook' from 'works in production'.",
        },
      ],
    },
  ],
};

export const mathForAiLessons: Lesson[] = [
  vectorsMatricesTensors,
  dotProductMatmul,
  normsDistanceCosine,
  eigenvaluesPca,
  embeddingsGeometrically,
  derivativesChainRule,
  gradientDescentByHand,
  probabilityBayes,
  distributionsExpectationVariance,
  mleHypothesisTesting,
];
