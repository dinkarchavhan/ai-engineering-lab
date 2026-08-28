import type { ProjectGuide, Section } from "@/lib/content";

type VisionProject = {
  slug: string;
  title: string;
  description: string;
  dataset: string;
  kaggle: string;
  task: string;
  metric: string;
  preprocessing: string;
  modelCode: string;
  evaluation: string;
  extensions: string[];
  hours: number;
};

function sections(project: VisionProject): Section[] {
  return [
    {
      step: 1,
      title: "What you’re building",
      blocks: [
        { type: "text", content: project.description },
        { type: "diagram", label: "Vision project workflow", chart: "flowchart LR\n  D[Dataset and labels] --> P[Validate + preprocess]\n  P --> M[TensorFlow / Keras model]\n  M --> E[Metrics + error analysis]\n  E --> S[Saved model / demo]\n  S --> F[Feedback and retraining]" },
        { type: "kv", items: [
          { key: "Dataset", value: project.dataset },
          { key: "Task", value: project.task },
          { key: "Primary metric", value: project.metric },
          { key: "Kaggle source", value: project.kaggle },
        ] },
      ],
    },
    {
      step: 2,
      title: "Get and validate the data",
      blocks: [
        { type: "code", language: "bash", label: "Kaggle API", code: "pip install kaggle\n# Create a token at Kaggle → Settings → API, then configure kaggle.json.\n# Replace <dataset-slug> with the source listed above.\nkaggle datasets download -d <dataset-slug> -p data\n# Extract the downloaded archive and keep the original labels with the images." },
        { type: "callout", kind: "warning", title: "Check the data before training", content: "Open random images and labels, count examples per class, locate corrupt files, and check for duplicate or near-duplicate images across splits. A high score is meaningless if the same photo appears in training and validation." },
        { type: "code", language: "python", label: "TensorFlow image pipeline", code: project.preprocessing },
      ],
    },
    {
      step: 3,
      title: "Train a TensorFlow/Keras baseline",
      blocks: [
        { type: "code", language: "python", label: "Training implementation", code: project.modelCode },
        { type: "callout", kind: "insight", title: "Start with transfer learning", content: "A pretrained visual backbone is normally the right first model for a real image dataset. Freeze it until the new head stabilizes, then optionally fine-tune only upper layers at a much lower learning rate." },
      ],
    },
    {
      step: 4,
      title: "Evaluate, save, and extend",
      blocks: [
        { type: "code", language: "python", label: "Evaluation", code: project.evaluation },
        { type: "list", style: "number", items: project.extensions.map((item) => `**${item}**`) },
        { type: "callout", kind: "tip", title: "Portfolio deliverable", content: "Publish a repository with a data-card link and license, reproducible split, training command, held-out metrics, qualitative successes and failures, and a small inference demo. Never commit downloaded datasets or secret API tokens." },
      ],
    },
  ];
}

const projects: VisionProject[] = [
  {
    slug: "face-detection", title: "Face Detection", hours: 7,
    description: "Detect one or more faces in photographs, return bounding boxes, and build a small review page that visualizes confidence scores. Use a pretrained TensorFlow detector first; treat WIDER FACE as a fine-tuning and evaluation challenge rather than training a detector from zero.",
    dataset: "WIDER FACE benchmark — 32,000+ images with face bounding boxes.", kaggle: "kaggle.com/datasets/mksaad/wider-face-a-face-detection-benchmark", task: "Object detection: image → face boxes and confidence scores.", metric: "Average precision / recall at an IoU threshold, plus visual review of small and occluded faces.",
    preprocessing: "import tensorflow as tf\n\n# Keep original image dimensions and boxes together for detection.\nimage = tf.io.decode_jpeg(tf.io.read_file(\"example.jpg\"), channels=3)\nimage = tf.image.convert_image_dtype(image, tf.float32)\nprint(image.shape)  # H, W, 3 — do not resize boxes without transforming coordinates too",
    modelCode: "import tensorflow as tf\nimport tensorflow_hub as hub\n\n# Inference baseline: use a compatible TF Hub object-detection model.\ndetector = hub.load(\"https://tfhub.dev/tensorflow/centernet/hourglass_512x512_kpts/1\")\n# Serve this behind a preprocessing function that resizes to the model contract\n# and maps output boxes back to the original image size.\n\n# For fine-tuning, use the TensorFlow Object Detection API with WIDER FACE\n# converted to TFRecord; keep train/validation images disjoint by identity/event.",
    evaluation: "# After model-specific postprocessing:\n# boxes = [ymin, xmin, ymax, xmax], scores = confidence values\nkeep = scores >= 0.50\nprint(f\"faces kept: {keep.sum()}\")\n# Draw boxes over a random held-out batch and inspect tiny, profile, and occluded faces.",
    extensions: ["Privacy by design — blur detected faces by default and document consent/retention rules", "Tracking — associate face boxes across video frames with a tracker, not identity recognition", "Hard-example review — label false positives and missed small faces for the next fine-tuning run"],
  },
  {
    slug: "document-scanner", title: "Document Scanner", hours: 6,
    description: "Create a document-capture pipeline that finds a paper boundary, corrects perspective, enhances legibility, and uses a TensorFlow quality classifier to reject blurry or poorly framed scans before OCR.",
    dataset: "MIDV-500 identity-document images, or your own consented document photos with four-corner annotations.", kaggle: "Use a MIDV-500 mirror or a similarly licensed document-image dataset; verify its license before redistribution.", task: "Document corner detection + perspective correction + scan-quality classification.", metric: "Corner reprojection error; quality-classification recall for unusable scans; human review of rectified output.",
    preprocessing: "import cv2\nimport tensorflow as tf\n\nimage = cv2.imread(\"document.jpg\")\n# CV operations can make the geometric correction deterministic.\ngray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)\nedges = cv2.Canny(gray, 75, 200)\n# Find a four-point contour, order its corners, then use cv2.getPerspectiveTransform.\n# Feed the resulting rectified image to the TensorFlow quality model.",
    modelCode: "from tensorflow import keras\n\nquality_model = keras.Sequential([\n    keras.Input((224, 224, 3)),\n    keras.applications.EfficientNetB0(include_top=False, weights=\"imagenet\", pooling=\"avg\"),\n    keras.layers.Dense(1, activation=\"sigmoid\"),\n])\nquality_model.layers[0].trainable = False\nquality_model.compile(optimizer=keras.optimizers.Adam(1e-3), loss=\"binary_crossentropy\", metrics=[\"accuracy\", keras.metrics.AUC(name=\"auc\")])\n# Labels: acceptable scan=1, reject/retry=0. Fine-tune only after the head works.",
    evaluation: "# Evaluate the geometry and quality stages separately.\n# Save original, detected contour, and warped image side-by-side for each failure.\nquality_model.save(\"document_quality.keras\")\n# A scan should be rejected when blur, glare, crop, or perspective makes OCR unsafe.",
    extensions: ["Corner model — replace contour heuristics with a four-keypoint Keras regression model", "Mobile capture guide — overlay the predicted polygon and a blur warning in a web or mobile client", "OCR handoff — pass only accepted, rectified scans into your Invoice OCR project"],
  },
  {
    slug: "invoice-ocr", title: "Invoice OCR", hours: 8,
    description: "Extract invoice number, date, vendor, and total from receipt images. Build a robust pipeline: image cleanup, OCR, field candidate scoring, validation rules, and a human-review queue for low-confidence results.",
    dataset: "SROIE: scanned receipts with OCR and key-information labels.", kaggle: "kaggle.com/datasets/ryanznie/sroie-datasetv2-with-labels", task: "Document understanding: receipt image → structured fields.", metric: "Exact-match F1 per field, plus review rate at a chosen confidence threshold.",
    preprocessing: "from PIL import Image, ImageOps\n\ndef prepare(path):\n    image = Image.open(path).convert(\"L\")\n    image = ImageOps.autocontrast(image)\n    return image.resize((image.width * 2, image.height * 2))\n# Keep the source image and OCR bounding boxes; they make fields auditable.",
    modelCode: "import tensorflow as tf\nfrom tensorflow import keras\n\n# TensorFlow character-recognition baseline for cropped text lines.\n# In production, use matched line crops + character labels, not full invoices as one string.\ninputs = keras.Input((32, 256, 1))\nx = keras.layers.Conv2D(32, 3, activation=\"relu\", padding=\"same\")(inputs)\nx = keras.layers.MaxPool2D((2, 2))(x)\nx = keras.layers.Reshape((16, 128 * 32))(x)\nx = keras.layers.Bidirectional(keras.layers.LSTM(128, return_sequences=True))(x)\nchar_logits = keras.layers.Dense(vocab_size + 1)(x)\nocr_model = keras.Model(inputs, char_logits)\n# Train with CTC loss after creating a character vocabulary and padded labels.",
    evaluation: "# Score normalized field values, not raw OCR strings.\ndef normalize_total(s):\n    return s.replace(\",\", \"\").replace(\"$\", \"\").strip()\n# Require a currency/decimal pattern and cross-check totals when line items exist.\n# Route low-confidence fields, not whole documents, to human review.",
    extensions: ["Layout-aware extraction — fine-tune a document model on OCR tokens and coordinates", "Business rules — flag totals that fail arithmetic checks or date/vendor formats", "Audit trail — return each value with source box, OCR confidence, and model version"],
  },
  {
    slug: "plant-disease-detection", title: "Plant Disease Detection", hours: 7,
    description: "Fine-tune a TensorFlow image classifier that recognizes healthy and diseased plant leaves, then make its uncertainty and field-data limitations explicit in a usable prediction demo.",
    dataset: "PlantVillage — labelled healthy/diseased leaf images; controlled-background images.", kaggle: "kaggle.com/datasets/moazeldsokyx/plantvillage", task: "Multiclass image classification: leaf image → crop/disease label.", metric: "Macro F1 and per-class recall; evaluate separately on any real-field holdout you can obtain.",
    preprocessing: "import tensorflow as tf\n\ntrain_ds = tf.keras.utils.image_dataset_from_directory(\n    \"data/PlantVillage/train\", image_size=(224, 224), batch_size=32, label_mode=\"int\")\nval_ds = tf.keras.utils.image_dataset_from_directory(\n    \"data/PlantVillage/validation\", image_size=(224, 224), batch_size=32, shuffle=False)\naugment = tf.keras.Sequential([tf.keras.layers.RandomFlip(\"horizontal\"), tf.keras.layers.RandomRotation(0.08), tf.keras.layers.RandomContrast(0.12)])\ntrain_ds = train_ds.prefetch(tf.data.AUTOTUNE); val_ds = val_ds.prefetch(tf.data.AUTOTUNE)",
    modelCode: "from tensorflow import keras\n\nbackbone = keras.applications.EfficientNetB0(include_top=False, weights=\"imagenet\", input_shape=(224, 224, 3))\nbackbone.trainable = False\ninputs = keras.Input((224, 224, 3))\nx = augment(inputs)\nx = keras.applications.efficientnet.preprocess_input(x)\nx = backbone(x, training=False)\nx = keras.layers.GlobalAveragePooling2D()(x)\nx = keras.layers.Dropout(0.3)(x)\noutputs = keras.layers.Dense(num_classes)(x)\nmodel = keras.Model(inputs, outputs)\nmodel.compile(optimizer=keras.optimizers.AdamW(1e-3, weight_decay=1e-4), loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=[\"accuracy\"] )\nmodel.fit(train_ds, validation_data=val_ds, epochs=12, callbacks=[keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)])",
    evaluation: "from sklearn.metrics import classification_report\n# Get predicted class IDs on an unshuffled validation/test dataset.\n# print(classification_report(y_true, y_pred, target_names=class_names))\nmodel.save(\"plant_disease.keras\")\n# Inspect Grad-CAM maps to confirm the model focuses on leaf lesions, not background artifacts.",
    extensions: ["Fine-tune the upper EfficientNet layers at 1e-5 after the classifier head converges", "Field validation — test on photos with varied lighting/background, not only PlantVillage", "Uncertainty gate — show ‘retake photo / consult expert’ below a calibrated confidence threshold"],
  },
  {
    slug: "vehicle-detection", title: "Vehicle Detection", hours: 8,
    description: "Detect cars, buses, trucks, and motorcycles in road images or video, then report boxes and class scores. Use a pretrained TensorFlow detector for the initial system and fine-tune only when you own or have permission to use labelled local traffic data.",
    dataset: "COCO contains vehicle classes; UA-DETRAC is a road-traffic alternative for detection/tracking research.", kaggle: "Use a licensed COCO/UA-DETRAC mirror or the original source; preserve the dataset license and attribution.", task: "Object detection: road frame → vehicle boxes, labels, and scores.", metric: "mAP/recall at IoU 0.5 plus false detections per frame for the chosen score threshold.",
    preprocessing: "import tensorflow as tf\n\nframe = tf.io.decode_jpeg(tf.io.read_file(\"road.jpg\"), channels=3)\nframe = tf.image.convert_image_dtype(frame, tf.float32)\n# Resize with padding for inference; transform predicted boxes back before drawing on the source frame.\nresized = tf.image.resize_with_pad(frame, 640, 640)",
    modelCode: "import tensorflow_hub as hub\n\n# Start with a pretrained detector; select a model whose input/output contract you document.\ndetector = hub.load(\"https://tfhub.dev/tensorflow/centernet/hourglass_512x512_kpts/1\")\n# Filter detections to COCO vehicle class IDs after inspecting the model's label map.\n# Fine-tuning requires COCO-style annotations converted to TFRecord and a held-out route/camera split.",
    evaluation: "# Do not randomly split adjacent video frames: they leak nearly identical scenes.\n# Split by camera, day, or route before calculating detection metrics.\n# Overlay false positives/negatives on saved frames for threshold selection.",
    extensions: ["Tracking — add a tracker to turn per-frame detections into vehicle trajectories", "Speed estimation — only after camera calibration and a safety/accuracy review", "Edge deployment — benchmark a quantized TensorFlow Lite model on target hardware"],
  },
  {
    slug: "object-counter", title: "Object Counter", hours: 7,
    description: "Build a counter for repeated objects in images, such as products on shelves or vehicles at an entrance. Counting is derived from reliable detections, so the system must expose threshold and duplicate-suppression choices rather than silently returning a number.",
    dataset: "SKU-110K for dense retail products, or labelled COCO vehicle images for a smaller first version.", kaggle: "Use a licensed SKU-110K/retail-detection mirror or the original research dataset; confirm redistribution terms.", task: "Detection + counting: image → non-duplicate target boxes → count.", metric: "MAE in count plus precision/recall of target boxes; report both.",
    preprocessing: "import tensorflow as tf\n\n# Dense scenes need enough resolution for small objects.\nimage = tf.io.decode_jpeg(tf.io.read_file(\"shelf.jpg\"), channels=3)\nimage = tf.image.convert_image_dtype(image, tf.float32)\n# Tile large images with overlap if the detector misses small objects; deduplicate boxes afterwards.",
    modelCode: "import tensorflow as tf\n\n# Generic postprocessing skeleton after a TensorFlow detector returns boxes/scores/classes.\ndef count_targets(boxes, scores, classes, target_class, threshold=0.5):\n    keep = tf.logical_and(scores >= threshold, tf.equal(classes, target_class))\n    return int(tf.reduce_sum(tf.cast(keep, tf.int32)))\n# Apply non-maximum suppression before this count when the model output has duplicate boxes.\n# For custom fine-tuning, prepare one bounding-box annotation per target instance.",
    evaluation: "import numpy as np\n\n# Compare counts image-by-image, not only aggregated totals.\nmae = np.mean(np.abs(np.asarray(predicted_counts) - np.asarray(true_counts)))\nprint(f\"Count MAE: {mae:.2f}\")\n# Save every image where absolute count error exceeds your operational tolerance.",
    extensions: ["Density estimation — compare detection counting with a density-map model for extremely crowded scenes", "Human correction — enable a reviewer to add/remove boxes and store corrections as future labels", "Monitoring — alert on camera changes, lighting shifts, or sudden low-confidence count distributions"],
  },
];

export const computerVisionProjects: ProjectGuide[] = projects.map((project) => ({
  slug: project.slug,
  trackSlug: "computer-vision",
  title: project.title,
  description: project.description,
  techStack: ["Python", "TensorFlow", "Keras", "OpenCV", "Kaggle API"],
  difficulty: "intermediate",
  estimatedHours: project.hours,
  sections: sections(project),
}));
