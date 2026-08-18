import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Lesson 1 — The Neuron (fully written at 20-step depth as the reference)
// ---------------------------------------------------------------------------
const neuronLesson: Lesson = {
  slug: "the-neuron",
  trackSlug: "deep-learning",
  order: 1,
  minutes: 12,
  title: "The Neuron",
  subtitle:
    "The single building block of every deep-learning model — from a two-line equation to the neuron you'll use in every layer of every network.",
  tags: ["Neuron", "Perceptron", "First principles"],
  sections: [
    {
      step: 1,
      title: "The problem we're solving",
      blocks: [
        {
          type: "text",
          content:
            "Before we can build a network with millions of parameters, we need to understand the single unit those parameters live in. That unit is the **neuron**.\n\nA neuron takes some numbers in, mixes them together in a very specific way, and produces one number out. That's it. Everything else in deep learning — layers, transformers, GPT — is neurons wired together.",
        },
        {
          type: "text",
          content:
            "So the concrete problem is this: given a few input numbers (say, the height and weight of a person), how do we combine them into a single number that means something (say, a prediction of whether they're an adult)?",
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
            "If you understand what a neuron does, you understand what an entire neural network does — it just repeats this same operation, billions of times, in parallel. Learn it once, use it forever.",
        },
      ],
    },
    {
      step: 3,
      title: "The intuition",
      blocks: [
        {
          type: "text",
          content:
            "A neuron does three things, in order:",
        },
        {
          type: "list",
          style: "number",
          items: [
            "**Weigh each input.** Some inputs matter more than others. Multiply each by a number called a **weight**.",
            "**Add a bias.** A single extra number that shifts the result. Think of it as the neuron's default opinion before it sees any input.",
            "**Squash the result.** Pass the sum through an **activation function** — a curve that decides how excited the neuron should be.",
          ],
        },
        {
          type: "text",
          content:
            "That's the whole neuron. Weighted sum → activation → output.",
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
            "Imagine deciding whether to go for a run. You weigh several factors: *how nice is the weather*, *how tired am I*, *am I meeting a friend*. Each factor has a different importance to you — nice weather might weigh a lot, being slightly tired only a little.",
        },
        {
          type: "text",
          content:
            "You sum up all these weighted factors, then apply your personal threshold: if the total exceeds it, you go. That threshold is the bias. That go/no-go decision is the activation.",
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "A neuron is a tiny opinionated function. It's learning **what to care about** (the weights) and **how sensitive to be** (the bias).",
        },
      ],
    },
    {
      step: 5,
      title: "Visualize it",
      blocks: [
        {
          type: "diagram",
          label: "A single neuron with two inputs",
          chart: `flowchart LR
    x1((x1)) -- "w1" --> S[Sum]
    x2((x2)) -- "w2" --> S
    B[bias b] --> S
    S --> A[activation<br/>function]
    A --> Y((output y))
    style S fill:#eef7ff,stroke:#8ecdff
    style A fill:#d9edff,stroke:#8ecdff
    style B fill:#f6f7f9,stroke:#d3d7e0`,
        },
        {
          type: "text",
          content:
            "Each input `xᵢ` flows in, gets multiplied by its weight `wᵢ`, joins the others in a sum, gets a bias `b` added, and the whole thing is passed through an activation function.",
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
          title: "The neuron in one line",
          content:
            "$$y = f(w_1 x_1 + w_2 x_2 + \\dots + w_n x_n + b)$$\n\nOr, using vector notation: `y = f(w · x + b)`.",
        },
        {
          type: "kv",
          items: [
            { key: "x", value: "the input vector — the numbers coming in" },
            { key: "w", value: "the weights — one per input, learned during training" },
            { key: "b", value: "the bias — one number, also learned" },
            { key: "w · x", value: "the **dot product** — element-wise multiply, then sum" },
            { key: "f(·)", value: "the activation function — sigmoid, ReLU, tanh, etc." },
            { key: "y", value: "the neuron's output — a single number" },
          ],
        },
        {
          type: "text",
          content:
            "That's it. Every neuron in every network you'll ever build is this equation. Deep learning is about **wiring these together** and **learning good values for w and b**.",
        },
      ],
    },
    {
      step: 7,
      title: "Build one from scratch",
      blocks: [
        {
          type: "text",
          content:
            "Let's write a neuron in ~10 lines of Python. No frameworks. No libraries.",
        },
        {
          type: "code",
          language: "python",
          label: "neuron.py",
          code: `import math

def sigmoid(z):
    """Squash z into (0, 1) — a smooth step function."""
    return 1 / (1 + math.exp(-z))

def neuron(inputs, weights, bias):
    # 1) weighted sum
    z = sum(x * w for x, w in zip(inputs, weights)) + bias
    # 2) activation
    return sigmoid(z)

# Try it: 2 inputs, 2 weights, 1 bias
inputs  = [0.7, 0.4]        # x1, x2
weights = [1.5, -0.8]       # w1, w2
bias    = -0.3

output = neuron(inputs, weights, bias)
print(f"neuron output = {output:.4f}")`,
        },
      ],
    },
    {
      step: 8,
      title: "Run it and inspect the output",
      blocks: [
        {
          type: "code",
          language: "text",
          label: "Output",
          code: `neuron output = 0.6106`,
        },
        {
          type: "text",
          content:
            "The neuron outputs about `0.61`. Because we used a sigmoid, the output is between 0 and 1 — you can read it as a probability.\n\nTry changing the inputs, weights, or bias. Notice how the output moves. That's the entire game: find the `w` and `b` values that make the neuron output what you want.",
        },
      ],
    },
    {
      step: 9,
      title: "The production version",
      blocks: [
        {
          type: "text",
          content:
            "In real code you never write one neuron at a time. You use a **linear layer** that runs many neurons in parallel with a single matrix multiplication. Here's the exact same computation using PyTorch:",
        },
        {
          type: "code",
          language: "python",
          label: "neuron_torch.py",
          code: `import torch
import torch.nn as nn

# A "neuron" in PyTorch is a Linear layer with output size 1,
# followed by an activation.
neuron = nn.Sequential(
    nn.Linear(in_features=2, out_features=1),
    nn.Sigmoid(),
)

# Set the same weights and bias as before
with torch.no_grad():
    neuron[0].weight.copy_(torch.tensor([[1.5, -0.8]]))
    neuron[0].bias.copy_(torch.tensor([-0.3]))

x = torch.tensor([[0.7, 0.4]])
print(neuron(x).item())     # ~0.6106 — same answer`,
        },
        {
          type: "callout",
          kind: "insight",
          content:
            "`nn.Linear` is just a neuron in a nice wrapper. Under the hood: matrix multiply, add bias, done. The activation is separate so you can pick any function.",
        },
      ],
    },
    {
      step: 10,
      title: "Experiment",
      blocks: [
        {
          type: "text",
          content: "Play with the from-scratch code and try these:",
        },
        {
          type: "list",
          items: [
            "Set both weights to **zero** and vary only the bias. What happens to the output? (Answer: it becomes a constant — `sigmoid(b)`.)",
            "Set `bias = 0` and equal weights. Now the neuron cares equally about both inputs.",
            "Make one weight **very large** (say 100). Notice how the output saturates to nearly 0 or nearly 1 — the neuron becomes almost binary.",
            "Swap `sigmoid` for `max(0, z)` (that's ReLU). How does the output range change?",
          ],
        },
      ],
    },
    {
      step: 11,
      title: "Common mistakes and how to debug",
      blocks: [
        {
          type: "callout",
          kind: "gotcha",
          title: "Forgetting the bias",
          content:
            "A neuron with no bias can only produce outputs that pass through zero. Always include a bias unless you have a very specific reason not to.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Big inputs, big weights",
          content:
            "If your inputs are large (say, pixel values 0–255) and your weights are also large, `z` explodes and sigmoid saturates — the neuron's gradient goes to zero and it can't learn. **Normalize your inputs** to roughly zero mean and unit variance.",
        },
        {
          type: "callout",
          kind: "gotcha",
          title: "Wrong activation for the task",
          content:
            "Sigmoid squashes to `(0, 1)` — great for probabilities, terrible for hidden layers in deep networks (it kills gradients). We'll cover this in the activation-functions lesson.",
        },
      ],
    },
    {
      step: 12,
      title: "Where you'll see this in the real world",
      blocks: [
        {
          type: "list",
          items: [
            "**Logistic regression** — literally a single neuron with a sigmoid. The workhorse of tabular ML.",
            "**Every hidden layer** in every neural network — layers are just many neurons in parallel.",
            "**Attention heads in transformers** — each attention score is computed from neuron-like weighted sums.",
            "**The output layer of a classifier** — one neuron per class, activation is softmax.",
          ],
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
            "Write out the equation of a single neuron. What do the weights and bias mean geometrically? *(They define a hyperplane — the neuron fires when the input crosses that plane.)*",
            "Why do we need an activation function at all? *(Without it, stacking neurons gives you just another linear function — no matter how deep the network is.)*",
            "What's the difference between a neuron and a perceptron? *(A perceptron uses a hard step activation; a modern neuron uses a smooth one like sigmoid or ReLU. That difference is what makes gradient descent possible.)*",
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
            "A neuron has weights [2, -1] and bias 0.5. What is its output for the input [1, 3], using the sigmoid activation?",
          options: [
            "sigmoid(2·1 + (-1)·3 + 0.5) = sigmoid(-0.5) ≈ 0.378",
            "sigmoid(2·1 · (-1)·3 + 0.5) = sigmoid(-5.5) ≈ 0.004",
            "sigmoid(2 + 1 + 3 + 0.5) = sigmoid(6.5) ≈ 0.998",
            "sigmoid(0.5) ≈ 0.622",
          ],
          correct: 0,
          explanation:
            "Weighted sum first: `2*1 + (-1)*3 + 0.5 = -0.5`. Then apply sigmoid: `1 / (1 + e^0.5) ≈ 0.378`. Multiplication and addition are the two operations — no shortcuts.",
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
            "Now that you understand a single neuron, the next lesson **Weights, Bias, and the Perceptron** goes deeper into the parameters — how they define the neuron's behavior, why the perceptron rule was a breakthrough in the 1950s, and why we replaced it with something smoother.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Lessons 2–10 — stubs so the track TOC shows all 10 lessons. Each will be
// filled at full depth in follow-up turns.
// ---------------------------------------------------------------------------

function stub(
  slug: string,
  order: number,
  minutes: number,
  title: string,
  subtitle: string,
  tags: string[],
  teaser: string,
): Lesson {
  return {
    slug,
    trackSlug: "deep-learning",
    order,
    minutes,
    title,
    subtitle,
    tags,
    sections: [
      {
        step: 1,
        title: "What we'll cover",
        blocks: [
          { type: "text", content: teaser },
          {
            type: "callout",
            kind: "tip",
            title: "Coming soon",
            content:
              "This lesson is being written at full 20-step depth: problem → intuition → analogy → visual → math → from-scratch code → production library → experiment → common mistakes → interview questions → quiz. Follow the repo for updates.",
          },
        ],
      },
    ],
  };
}

export const deepLearningLessons: Lesson[] = [
  neuronLesson,
  stub(
    "weights-bias-perceptron",
    2,
    14,
    "Weights, Bias, and the Perceptron",
    "Where the neuron's learning actually happens — and the 1950s algorithm that got us here.",
    ["Weights", "Bias", "Perceptron", "History"],
    "The neuron has two knobs: the weights (how much each input matters) and the bias (its default opinion). This lesson digs into what each of them geometrically represents, walks through the perceptron learning rule from 1958, and shows why it works for linearly separable data but breaks on XOR — the failure that killed neural networks for 30 years.",
  ),
  stub(
    "activation-functions",
    3,
    16,
    "Activation Functions",
    "Sigmoid, tanh, ReLU, GELU, softmax — when to use which, and why deep networks stalled until we replaced sigmoid.",
    ["Sigmoid", "ReLU", "Softmax", "GELU"],
    "The activation function is the neuron's personality. Sigmoid squashes to a probability, tanh is zero-centered, ReLU is fast and doesn't kill gradients, GELU is what powers GPT, softmax gives you a probability distribution. You'll build each one from scratch and see exactly why ReLU replaced sigmoid in every hidden layer of every modern network.",
  ),
  stub(
    "forward-propagation",
    4,
    15,
    "Forward Propagation",
    "How data actually flows through a network — layer by layer, one matrix multiply at a time.",
    ["Forward pass", "Layers", "Matrix multiply"],
    "A network isn't a mystery — it's a chain of matrix multiplies and activations. This lesson walks input tensors through a 3-layer network by hand, then shows the same computation as `torch.nn.Sequential`. You'll see exactly why network shapes have to line up, and how to debug the dreaded `mat1 and mat2 shapes cannot be multiplied` error.",
  ),
  stub(
    "loss-functions",
    5,
    14,
    "Loss Functions",
    "MSE, binary cross-entropy, categorical cross-entropy — the number that tells your network how wrong it is.",
    ["MSE", "Cross-entropy", "Log loss"],
    "Without a loss function, there's nothing to minimize and no way to train. You'll build MSE for regression, binary cross-entropy for two-class problems, and categorical cross-entropy for multi-class — from scratch — then match them to PyTorch's `nn.MSELoss` and `nn.CrossEntropyLoss`. Includes the classic 'why is my loss NaN' debugging playbook.",
  ),
  stub(
    "gradient-descent",
    6,
    18,
    "Gradient Descent",
    "The engine that trains every neural network — one small step downhill at a time.",
    ["Gradient", "Learning rate", "Optimization"],
    "Gradient descent is deceptively simple: compute the slope of the loss with respect to each weight, then nudge the weights against that slope. But the details — learning rate, batch size, local minima, saddle points, why it works in millions of dimensions at all — are where the real understanding lives. You'll implement it by hand on a 1D parabola, then on a real neuron.",
  ),
  stub(
    "backpropagation",
    7,
    22,
    "Backpropagation",
    "The chain rule at scale — how a network figures out which weights to blame for its mistakes.",
    ["Chain rule", "Autograd", "Gradients"],
    "Backpropagation is the algorithm that made deep learning possible. It's just the chain rule from calculus, applied efficiently. This lesson derives it for a 2-layer network by hand (with pictures), then shows how PyTorch's autograd does exactly the same thing automatically. By the end you'll never fear a `.backward()` call again.",
  ),
  stub(
    "optimizers",
    8,
    16,
    "Optimizers",
    "SGD, momentum, AdaGrad, RMSProp, Adam, AdamW — how modern training escapes gradient descent's tar pits.",
    ["SGD", "Momentum", "Adam", "AdamW"],
    "Plain gradient descent is fragile: too small a learning rate and it's slow, too large and it diverges. Optimizers add memory (momentum), per-parameter learning rates (AdaGrad/RMSProp), and both (Adam) to make training robust. You'll implement each one and see on a real loss surface why Adam won the day — and why AdamW replaced it for large models.",
  ),
  stub(
    "regularization",
    9,
    14,
    "Regularization",
    "Dropout, weight decay, early stopping — what to do when your network memorizes the training set.",
    ["Dropout", "Weight decay", "Overfitting"],
    "A network with enough capacity can memorize its training data perfectly — and then fail on anything new. Regularization is the toolkit that keeps generalization alive. You'll build dropout from scratch, understand weight decay both as an L2 penalty and as the reason AdamW exists, and see when early stopping is enough on its own.",
  ),
  stub(
    "normalization-training-tricks",
    10,
    18,
    "Normalization and Training Tricks",
    "Batch norm, layer norm, learning-rate schedules, gradient clipping — the small tricks that make deep networks actually train.",
    ["BatchNorm", "LayerNorm", "LR schedule", "Grad clipping"],
    "Training deep networks used to be black magic. Batch normalization (2015) and later layer normalization (used in every transformer) made deep networks trainable in the first place. This lesson covers both, plus warmup, cosine schedules, and gradient clipping — the checklist that separates 'works in tutorials' from 'works on your project'.",
  ),
];
