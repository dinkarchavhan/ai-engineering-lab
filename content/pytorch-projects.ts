import type { ProjectGuide } from "@/lib/content";

export const pytorchProjects: ProjectGuide[] = [
  {
    slug: "mnist-hyperparameter-lab",
    trackSlug: "pytorch",
    title: "MNIST classifier with an interactive hyperparameter panel",
    description:
      "Train, evaluate, checkpoint, and explore a PyTorch digit classifier through a small Streamlit control panel. You will make hyperparameter choices observable instead of treating training as a black box.",
    techStack: ["Python", "PyTorch", "torchvision", "Streamlit", "TensorBoard", "Kaggle API"],
    difficulty: "intermediate",
    estimatedHours: 7,
    sections: [
      {
        step: 1,
        title: "What you’re building",
        blocks: [
          { type: "text", content: "A reproducible MNIST classifier with an interactive panel for learning rate, batch size, dropout, optimizer, and epochs. The app trains from a clean configuration, plots learning curves, shows a confusion matrix, saves the best checkpoint, and runs inference on a sample image." },
          { type: "diagram", label: "Training and exploration workflow", chart: "flowchart LR\n  C[Streamlit controls] --> R[Training config]\n  D[MNIST DataLoaders] --> T[PyTorch train loop]\n  R --> T\n  T --> V[Validation metrics + TensorBoard]\n  V --> K[Best checkpoint]\n  K --> A[Interactive predictions and error analysis]" },
          { type: "kv", items: [
            { key: "Dataset", value: "MNIST: 60,000 training and 10,000 test grayscale digit images." },
            { key: "Task", value: "Multiclass classification across digits 0–9." },
            { key: "Success criteria", value: "A saved best checkpoint, validation curves, a test confusion matrix, and a UI that can rerun an experiment." },
            { key: "Core lesson", value: "A PyTorch pipeline is more than a model: data, devices, training modes, metrics, checkpoints, and experiment tracking all matter." },
          ] },
        ],
      },
      {
        step: 2,
        title: "Set up the project and data",
        blocks: [
          { type: "code", language: "bash", label: "Install dependencies", code: "python -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1\npython -m pip install --upgrade pip\npython -m pip install torch torchvision streamlit tensorboard matplotlib scikit-learn\n\n# Start TensorBoard after training\ntensorboard --logdir runs" },
          { type: "code", language: "python", label: "Download MNIST through torchvision", code: "from torchvision import datasets, transforms\n\ntransform = transforms.ToTensor()  # converts pixels to float tensors in [0, 1]\ntrain_ds = datasets.MNIST(\"data\", train=True, download=True, transform=transform)\ntest_ds = datasets.MNIST(\"data\", train=False, download=True, transform=transform)\nprint(len(train_ds), len(test_ds))" },
          { type: "code", language: "bash", label: "Kaggle alternative: Digit Recognizer", code: "pip install kaggle\n# Configure kaggle.json from Kaggle → Settings → API.\nkaggle competitions download -c digit-recognizer -p data\n# The competition CSV needs a custom Dataset; torchvision MNIST is the fastest starting point." },
        ],
      },
      {
        step: 3,
        title: "Create loaders, a device-safe model, and configuration",
        blocks: [
          { type: "code", language: "python", label: "model.py", code: "from dataclasses import dataclass\nimport torch\nfrom torch import nn\n\n@dataclass\nclass Config:\n    batch_size: int = 128\n    learning_rate: float = 1e-3\n    dropout: float = 0.25\n    optimizer: str = \"AdamW\"\n    epochs: int = 10\n\nclass MNISTNet(nn.Module):\n    def __init__(self, dropout=0.25):\n        super().__init__()\n        self.features = nn.Sequential(\n            nn.Conv2d(1, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),\n            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),\n        )\n        self.head = nn.Sequential(nn.Flatten(), nn.Dropout(dropout), nn.Linear(64 * 7 * 7, 128), nn.ReLU(), nn.Dropout(dropout), nn.Linear(128, 10))\n    def forward(self, x):\n        return self.head(self.features(x))\n\ndevice = torch.device(\"cuda\" if torch.cuda.is_available() else \"cpu\")\nprint(f\"Using {device}\")" },
          { type: "code", language: "python", label: "DataLoaders with a validation split", code: "from torch.utils.data import DataLoader, random_split\n\ngenerator = torch.Generator().manual_seed(42)\ntrain_subset, val_subset = random_split(train_ds, [54_000, 6_000], generator=generator)\ntrain_loader = DataLoader(train_subset, batch_size=cfg.batch_size, shuffle=True, num_workers=0, pin_memory=device.type == \"cuda\")\nval_loader = DataLoader(val_subset, batch_size=512, shuffle=False, num_workers=0, pin_memory=device.type == \"cuda\")\ntest_loader = DataLoader(test_ds, batch_size=512, shuffle=False, num_workers=0)" },
          { type: "callout", kind: "gotcha", title: "Do not mutate the test split", content: "The control panel may rerun many experiments, but tune on validation accuracy only. Keep the test set for a final, honest report." },
        ],
      },
      {
        step: 4,
        title: "Write the training and evaluation loops",
        blocks: [
          { type: "code", language: "python", label: "train.py", code: "import torch\nfrom torch import nn\nfrom torch.utils.tensorboard import SummaryWriter\n\ndef evaluate(model, loader, device):\n    model.eval()\n    correct = total = 0\n    with torch.no_grad():\n        for xb, yb in loader:\n            logits = model(xb.to(device, non_blocking=True))\n            correct += (logits.argmax(1).cpu() == yb).sum().item()\n            total += yb.numel()\n    return correct / total\n\ndef train(cfg, train_loader, val_loader, device):\n    model = MNISTNet(cfg.dropout).to(device)\n    criterion = nn.CrossEntropyLoss()\n    optimizer = (torch.optim.AdamW if cfg.optimizer == \"AdamW\" else torch.optim.SGD)(\n        model.parameters(), lr=cfg.learning_rate, **({\"weight_decay\": 1e-4} if cfg.optimizer == \"AdamW\" else {\"momentum\": 0.9})\n    )\n    writer, best_acc = SummaryWriter(), 0.0\n    history = []\n    for epoch in range(cfg.epochs):\n        model.train()\n        loss_sum = 0.0\n        for xb, yb in train_loader:\n            xb, yb = xb.to(device, non_blocking=True), yb.to(device, non_blocking=True)\n            optimizer.zero_grad(set_to_none=True)\n            loss = criterion(model(xb), yb)\n            loss.backward()\n            optimizer.step()\n            loss_sum += loss.item() * len(yb)\n        val_acc = evaluate(model, val_loader, device)\n        train_loss = loss_sum / len(train_loader.dataset)\n        writer.add_scalar(\"loss/train\", train_loss, epoch)\n        writer.add_scalar(\"accuracy/validation\", val_acc, epoch)\n        history.append({\"epoch\": epoch + 1, \"train_loss\": train_loss, \"val_accuracy\": val_acc})\n        if val_acc > best_acc:\n            best_acc = val_acc\n            torch.save({\"model_state\": model.state_dict(), \"config\": cfg.__dict__, \"epoch\": epoch, \"val_accuracy\": val_acc}, \"best_mnist.pt\")\n    writer.close()\n    return model, history" },
          { type: "callout", kind: "insight", title: "Why the mode switch matters", content: "`model.train()` enables training behavior in Dropout; `model.eval()` disables it for stable validation predictions. Forgetting either call makes your reported metric unreliable." },
        ],
      },
      {
        step: 5,
        title: "Build the interactive Streamlit panel",
        blocks: [
          { type: "code", language: "python", label: "app.py", code: "import streamlit as st\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nst.set_page_config(page_title=\"MNIST Hyperparameter Lab\")\nst.title(\"MNIST Hyperparameter Lab\")\nwith st.sidebar:\n    cfg = Config(\n        batch_size=st.select_slider(\"Batch size\", [32, 64, 128, 256], value=128),\n        learning_rate=st.select_slider(\"Learning rate\", [1e-4, 3e-4, 1e-3, 3e-3], value=1e-3),\n        dropout=st.slider(\"Dropout\", 0.0, 0.6, 0.25, 0.05),\n        optimizer=st.selectbox(\"Optimizer\", [\"AdamW\", \"SGD\"]),\n        epochs=st.slider(\"Epochs\", 1, 25, 10),\n    )\nif st.button(\"Run experiment\", type=\"primary\"):\n    with st.spinner(\"Training…\"):\n        model, history = train(cfg, train_loader, val_loader, device)\n    frame = pd.DataFrame(history).set_index(\"epoch\")\n    st.metric(\"Best validation accuracy\", f\"{frame.val_accuracy.max():.2%}\")\n    st.line_chart(frame[[\"train_loss\", \"val_accuracy\"]])\n    st.success(\"Saved the best run to best_mnist.pt\")\n\nst.caption(\"Run locally with: streamlit run app.py\")" },
          { type: "callout", kind: "tip", title: "Keep runs comparable", content: "Show the active configuration next to each chart and seed Python/PyTorch before training. Otherwise a visually impressive comparison can be driven by a hidden configuration change or random variation." },
        ],
      },
      {
        step: 6,
        title: "Evaluate the saved checkpoint",
        blocks: [
          { type: "code", language: "python", label: "Load best model and inspect errors", code: "from sklearn.metrics import ConfusionMatrixDisplay\nimport matplotlib.pyplot as plt\n\ncheckpoint = torch.load(\"best_mnist.pt\", map_location=device, weights_only=True)\nbest_model = MNISTNet(checkpoint[\"config\"][\"dropout\"]).to(device)\nbest_model.load_state_dict(checkpoint[\"model_state\"])\nprint(f\"Checkpoint validation accuracy: {checkpoint['val_accuracy']:.4f}\")\n\nbest_model.eval(); preds, targets = [], []\nwith torch.no_grad():\n    for xb, yb in test_loader:\n        preds.extend(best_model(xb.to(device)).argmax(1).cpu().tolist())\n        targets.extend(yb.tolist())\nConfusionMatrixDisplay.from_predictions(targets, preds, cmap=\"Blues\")\nplt.title(\"MNIST test confusion matrix\"); plt.show()" },
          { type: "callout", kind: "warning", title: "Checkpoint safety", content: "Only load checkpoints you trust. For model weights, use `state_dict` checkpoints and `weights_only=True` as shown, rather than loading arbitrary serialized Python objects." },
        ],
      },
      {
        step: 7,
        title: "TensorFlow comparison and portfolio deliverable",
        blocks: [
          { type: "code", language: "python", label: "Equivalent TensorFlow/Keras model", code: "import tensorflow as tf\n\nkeras_model = tf.keras.Sequential([\n    tf.keras.Input((28, 28, 1)),\n    tf.keras.layers.Conv2D(32, 3, padding=\"same\", activation=\"relu\"), tf.keras.layers.MaxPool2D(),\n    tf.keras.layers.Conv2D(64, 3, padding=\"same\", activation=\"relu\"), tf.keras.layers.MaxPool2D(),\n    tf.keras.layers.Flatten(), tf.keras.layers.Dropout(0.25), tf.keras.layers.Dense(128, activation=\"relu\"), tf.keras.layers.Dense(10),\n])\nkeras_model.compile(optimizer=tf.keras.optimizers.AdamW(1e-3), loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=[\"accuracy\"] )\n# Keras handles the loop; PyTorch makes each loop component explicit." },
          { type: "list", style: "bullet", items: [
            "Publish the Streamlit app, training code, requirements, and a screenshot or short GIF of the controls in use.",
            "Include an experiment table comparing at least AdamW and SGD, two learning rates, and two dropout values.",
            "Commit only code and small assets — keep downloaded datasets, TensorBoard logs, and large checkpoints out of Git with `.gitignore`.",
            "Document hardware, seed, best validation metric, final test accuracy, and the exact command that reproduces the result.",
          ] },
        ],
      },
    ],
  },
];
