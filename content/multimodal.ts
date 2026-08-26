import type { Lesson } from "@/lib/content";

// ---------------------------------------------------------------------------
// Track 20: Multimodal AI
// Vision, audio, and video joined to language
// ---------------------------------------------------------------------------

export const multimodalLessons: Lesson[] = [
  {
    slug: "multimodal-fundamentals",
    trackSlug: "multimodal",
    order: 1,
    minutes: 26,
    title: "Introduction to Multimodal AI",
    subtitle:
      "Understanding how vision, audio, and text work together in modern AI systems.",
    tags: ["Multimodal", "Vision", "Audio", "Foundations"],
    sections: [
      {
        step: 1,
        title: "What is Multimodal AI?",
        blocks: [
          {
            type: "text",
            content:
              "**Multimodal AI** processes multiple types of data (text, images, audio, video) together, not separately. Unlike traditional systems that handle one modality, multimodal models understand relationships across modalities: a photo shows what text describes, audio conveys what transcripts spell out, video combines motion with sound.",
          },
          {
            type: "text",
            content:
              "**Why multimodal matters:**\n• **Real-world is multimodal** — humans see, hear, and read simultaneously\n• **Richer understanding** — image + caption together tell more than either alone\n• **New applications** — document AI, meeting assistants, visual search\n• **Better accuracy** — combining modalities reduces ambiguity (audio clarifies unclear text, images verify descriptions)",
          },
          {
            type: "callout",
            kind: "insight",
            content:
              "The breakthrough: models like GPT-4V and Claude 3 can **natively** process images and text together in one forward pass, not as separate preprocessing steps. This enables reasoning across modalities.",
          },
        ],
      },
      {
        step: 2,
        title: "Multimodal Architectures",
        blocks: [
          {
            type: "text",
            content: "**Three main approaches to multimodal AI:**",
          },
          {
            type: "diagram",
            chart: `graph TD
    A[Multimodal Approaches] --> B[Early Fusion]
    A --> C[Late Fusion]
    A --> D[Joint Embeddings]

    B --> B1[Concatenate<br/>raw inputs]
    B --> B2[Single model<br/>processes all]

    C --> C1[Separate models<br/>per modality]
    C --> C2[Combine<br/>outputs]

    D --> D1[Shared<br/>embedding space]
    D --> D2[Text/image<br/>vectors nearby]

    style A fill:#e1f5ff
    style D fill:#d4edda`,
          },
          {
            type: "text",
            content:
              "**1. Early Fusion (GPT-4V approach):**\n• Combine all modalities early (token level)\n• Single transformer processes text + image tokens together\n• Pros: Maximum interaction, best reasoning\n• Cons: Expensive, complex training\n\n**2. Late Fusion:**\n• Process each modality separately\n• Combine final outputs (ensemble)\n• Pros: Simpler, modular\n• Cons: Limited cross-modal reasoning\n\n**3. Joint Embeddings (CLIP approach):**\n• Map text and images to shared vector space\n• Similar concepts have nearby embeddings\n• Pros: Fast retrieval, zero-shot\n• Cons: Limited reasoning, mainly for matching",
          },
        ],
      },
      {
        step: 3,
        title: "Key Multimodal Models",
        blocks: [
          {
            type: "text",
            content: "**Production-ready multimodal models (2024-2026):**",
          },
          {
            type: "text",
            content:
              "**Vision-Language Models:**\n• **GPT-4V (OpenAI)** — Best reasoning, handles complex scenes\n• **Claude 3.5 Sonnet (Anthropic)** — Great for documents, diagrams\n• **Gemini Pro Vision (Google)** — Fast, good for video\n• **LLaVA (open-source)** — 13B-34B params, runs locally\n\n**Audio Models:**\n• **Whisper (OpenAI)** — Best speech-to-text, 99 languages\n• **Wav2Vec 2.0 (Meta)** — Self-supervised audio understanding\n• **Bark (Suno)** — Text-to-speech with emotion\n\n**Cross-Modal Models:**\n• **CLIP (OpenAI)** — Text-image similarity, 400M pairs trained\n• **ImageBind (Meta)** — 6 modalities in one space\n• **Flamingo (DeepMind)** — Few-shot visual QA",
          },
        ],
      },
      {
        step: 4,
        title: "First Multimodal Example",
        blocks: [
          {
            type: "text",
            content: "**Use GPT-4V to analyze an image:**",
          },
          {
            type: "code",
            language: "python",
            code: `# Install: pip install openai pillow
from openai import OpenAI
import base64
from pathlib import Path

client = OpenAI()

def encode_image(image_path: str) -> str:
    """Convert image to base64"""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def analyze_image(image_path: str, question: str) -> str:
    """Ask GPT-4V about an image"""
    base64_image = encode_image(image_path)

    response = client.chat.completions.create(
        model="gpt-4o",  # or "gpt-4-vision-preview"
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": question},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                            "detail": "high"  # or "low" for faster/cheaper
                        }
                    }
                ]
            }
        ],
        max_tokens=500
    )

    return response.choices[0].message.content

# Example usage
result = analyze_image(
    "invoice.jpg",
    "Extract the total amount, date, and vendor name from this invoice."
)
print(result)

# Output:
# Total Amount: $1,234.56
# Date: March 15, 2024
# Vendor: Acme Corporation`,
          },
          {
            type: "text",
            content:
              "**Key parameters:**\n• `detail: 'high'` — Full resolution, better accuracy, higher cost (765 tokens)\n• `detail: 'low'` — Downscaled, faster, cheaper (85 tokens)\n• Use high for documents/diagrams, low for basic object detection",
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why is early fusion better than late fusion for multimodal AI?",
            options: [
              "Early fusion allows cross-modal reasoning at token level (model sees image-text relationships)",
              "Early fusion is faster",
              "Early fusion is cheaper",
              "Early fusion requires less data",
            ],
            correct: 0,
            explanation:
              "Early fusion (like GPT-4V) processes image and text tokens together in the same transformer, allowing the model to reason about relationships between modalities. Example: 'Is the red car on the left?' requires understanding spatial relationships AND color AND object identity simultaneously — early fusion handles this in one pass. Late fusion processes image and text separately, then combines outputs, missing these interactions. Early fusion is actually slower and more expensive (more computation), but produces better reasoning. The key advantage is CROSS-MODAL REASONING, not speed or cost.",
          },
        ],
      },
    ],
  },
  {
    slug: "vision-language-models",
    trackSlug: "multimodal",
    order: 2,
    minutes: 28,
    title: "Vision-Language Models (VLMs)",
    subtitle:
      "Deep dive into GPT-4V, Claude Vision, and how they process images.",
    tags: ["Vision", "VLM", "GPT-4V", "Claude"],
    sections: [
      {
        step: 1,
        title: "How VLMs Work",
        blocks: [
          {
            type: "text",
            content:
              "**Vision-Language Models combine a vision encoder (ViT) with a language model (GPT/Claude):**",
          },
          {
            type: "diagram",
            chart: `graph LR
    Image[Input Image] --> ViT[Vision Transformer<br/>ViT encodes patches]
    ViT --> Tokens[Visual tokens<br/>grid of embeddings]
    Text[Input Text] --> TextTokens[Text tokens]
    Tokens --> Transformer[Unified Transformer<br/>processes all tokens]
    TextTokens --> Transformer
    Transformer --> Output[Generated text<br/>describing image]

    style ViT fill:#e1f5ff
    style Transformer fill:#d4edda`,
          },
          {
            type: "text",
            content:
              "**Vision Transformer (ViT) process:**\n1. Split image into patches (16×16 or 14×14 pixels)\n2. Flatten each patch to a vector\n3. Add positional embeddings (patch location)\n4. Pass through transformer layers\n5. Output: grid of visual tokens (like text tokens, but for image regions)\n\n**Integration with LLM:**\n• Visual tokens treated like text tokens\n• Attention mechanism sees both modalities\n• Model learns correlations (this patch = 'red car', that patch = 'tree')",
          },
        ],
      },
      {
        step: 2,
        title: "Using GPT-4V for Complex Tasks",
        blocks: [
          {
            type: "text",
            content: "**GPT-4V excels at:**\n• Document understanding (invoices, receipts, forms)\n• Diagram interpretation (flowcharts, architecture)\n• Scene understanding (what's happening?)\n• Visual question answering\n• OCR with context (not just text extraction)",
          },
          {
            type: "code",
            language: "python",
            code: `from openai import OpenAI
import base64

client = OpenAI()

def understand_diagram(image_path: str) -> dict:
    """Extract structured info from a flowchart"""
    with open(image_path, "rb") as f:
        base64_image = base64.b64encode(f.read()).decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Analyze this flowchart. Extract:
1. All nodes (shapes) and their text
2. All connections (arrows) between nodes
3. Decision points (diamond shapes)
4. Start and end points
Return as structured JSON."""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                            "detail": "high"
                        }
                    }
                ]
            }
        ],
        response_format={"type": "json_object"}
    )

    import json
    return json.loads(response.choices[0].message.content)

# Example output:
# {
#   "nodes": [
#     {"id": 1, "type": "start", "text": "Begin"},
#     {"id": 2, "type": "process", "text": "Validate input"},
#     {"id": 3, "type": "decision", "text": "Valid?"},
#     {"id": 4, "type": "process", "text": "Process data"},
#     {"id": 5, "type": "end", "text": "End"}
#   ],
#   "connections": [
#     {"from": 1, "to": 2},
#     {"from": 2, "to": 3},
#     {"from": 3, "to": 4, "label": "Yes"},
#     {"from": 3, "to": 5, "label": "No"},
#     {"from": 4, "to": 5}
#   ]
# }`,
          },
        ],
      },
      {
        step: 3,
        title: "Claude Vision for Documents",
        blocks: [
          {
            type: "text",
            content:
              "**Claude 3.5 Sonnet is excellent for document-heavy tasks:**\n• Long documents (100+ pages)\n• Complex PDFs with tables/charts\n• Multi-page invoice processing\n• Research paper analysis",
          },
          {
            type: "code",
            language: "python",
            code: `# Install: pip install anthropic
import anthropic
import base64

client = anthropic.Anthropic()

def analyze_document(image_path: str) -> str:
    """Use Claude Vision for document analysis"""
    with open(image_path, "rb") as f:
        image_data = base64.standard_b64encode(f.read()).decode("utf-8")

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2000,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Extract all data from this invoice in JSON format."
                    }
                ],
            }
        ],
    )

    return message.content[0].text

# Claude excels at:
# - Maintaining table structure
# - Understanding form layouts
# - Handling handwriting (better than GPT-4V)
# - Multi-page documents (100+ pages)`,
          },
        ],
      },
      {
        step: 4,
        title: "Cost Optimization",
        blocks: [
          {
            type: "text",
            content: "**VLM pricing (approximate, 2024):**",
          },
          {
            type: "text",
            content:
              "**GPT-4V:**\n• Low detail: $0.01 per image (85 tokens)\n• High detail: $0.03 per image (765 tokens)\n• Use low for: simple images, thumbnails, UI screenshots\n• Use high for: documents, diagrams, detailed scenes\n\n**Claude Vision:**\n• Images count as tokens: ~1600 tokens per image\n• $3/million input tokens = $0.0048 per image\n• Cheaper than GPT-4V high detail\n• Better for document-heavy workflows\n\n**Optimization strategies:**\n1. Resize images before upload (don't send 4K for simple tasks)\n2. Use low detail when possible\n3. Batch process multiple images in one request\n4. Cache image embeddings if reprocessing same images",
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question:
              "When should you use GPT-4V 'high detail' vs 'low detail'?",
            options: [
              "High detail for documents/diagrams with small text, low detail for basic object detection",
              "Always use high detail for best results",
              "High detail is faster",
              "Low detail is more accurate",
            ],
            correct: 0,
            explanation:
              "Use HIGH DETAIL (765 tokens, $0.03) when image contains important small text, fine details, or complex structure: invoices, receipts, diagrams, charts, code screenshots. Model processes full resolution (2048×2048 or 4096×4096). Use LOW DETAIL (85 tokens, $0.01) for simple tasks: object detection ('is there a car?'), scene classification ('indoor/outdoor?'), basic image understanding. Model downscales to 512×512. High detail is 9x more expensive and slower, not more accurate for simple tasks — it's about WHAT DETAILS MATTER, not blanket quality. Wrong to always use high (wastes money on simple images) or think low is faster but less accurate (low IS accurate for its use case).",
          },
        ],
      },
    ],
  },
  {
    slug: "image-understanding",
    trackSlug: "multimodal",
    order: 3,
    minutes: 24,
    title: "Image Understanding at Scale",
    subtitle:
      "Object detection, image classification, and visual search in production.",
    tags: ["Computer Vision", "Classification", "Detection", "Search"],
    sections: [
      {
        step: 1,
        title: "Image Classification vs Detection vs Segmentation",
        blocks: [
          {
            type: "text",
            content: "**Three levels of image understanding:**",
          },
          {
            type: "diagram",
            chart: `graph TD
    A[Image Understanding Tasks] --> B[Classification]
    A --> C[Object Detection]
    A --> D[Segmentation]

    B --> B1["What's in image?<br/>(one label)"]
    C --> C1["Where are objects?<br/>(boxes + labels)"]
    D --> D1["Pixel-level masks<br/>(exact boundaries)"]

    B --> B2["Example: Cat"]
    C --> C2["Example: 3 cats<br/>at x,y,w,h"]
    D --> D2["Example: Cat pixels<br/>colored red"]

    style B fill:#e1f5ff
    style C fill:#fff3cd
    style D fill:#f8d7da`,
          },
          {
            type: "text",
            content:
              "**When to use each:**\n• **Classification** — Single label per image (\"cat\", \"dog\", \"car\")\n  - Use for: Content moderation, image tagging, sorting\n  - Fast, cheap, simple\n\n• **Object Detection** — Multiple objects with bounding boxes\n  - Use for: Counting items, locating objects, autonomous vehicles\n  - Medium speed/cost\n\n• **Segmentation** — Pixel-perfect masks\n  - Use for: Medical imaging, photo editing, AR effects\n  - Slow, expensive, precise",
          },
        ],
      },
      {
        step: 2,
        title: "Using CLIP for Zero-Shot Classification",
        blocks: [
          {
            type: "text",
            content:
              "**CLIP (Contrastive Language-Image Pretraining) maps images and text to same space. Zero-shot: classify images without training a custom model.**",
          },
          {
            type: "code",
            language: "python",
            code: `# Install: pip install transformers pillow torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

# Load CLIP model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def zero_shot_classify(image_path: str, labels: list[str]) -> dict:
    """Classify image into one of the given labels"""
    image = Image.open(image_path)

    # Process image and text
    inputs = processor(
        text=labels,
        images=image,
        return_tensors="pt",
        padding=True
    )

    # Get similarity scores
    outputs = model(**inputs)
    logits_per_image = outputs.logits_per_image  # Image-text similarity
    probs = logits_per_image.softmax(dim=1)[0]  # Convert to probabilities

    # Return sorted results
    results = {label: prob.item() for label, prob in zip(labels, probs)}
    return dict(sorted(results.items(), key=lambda x: x[1], reverse=True))

# Example usage
labels = ["a cat", "a dog", "a car", "a house", "a person"]
scores = zero_shot_classify("image.jpg", labels)

print(scores)
# Output: {'a cat': 0.92, 'a dog': 0.05, 'a person': 0.02, ...}`,
          },
          {
            type: "text",
            content:
              "**CLIP benefits:**\n• No training needed (zero-shot)\n• Works for any labels you define\n• Fast inference (100ms per image)\n• Good for ~1000 categories\n\n**CLIP limitations:**\n• Struggles with fine-grained distinctions (\"golden retriever\" vs \"labrador\")\n• Cannot detect multiple objects (single label per image)\n• No bounding boxes (just classification)",
          },
        ],
      },
      {
        step: 3,
        title: "Visual Search with Embeddings",
        blocks: [
          {
            type: "text",
            content: "**Build image search: find similar images by embedding similarity.**",
          },
          {
            type: "code",
            language: "python",
            code: `import torch
from transformers import CLIPModel, CLIPProcessor
from PIL import Image
import numpy as np
from pathlib import Path

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def get_image_embedding(image_path: str) -> np.ndarray:
    """Get CLIP embedding for an image"""
    image = Image.open(image_path)
    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        image_features = model.get_image_features(**inputs)

    # Normalize for cosine similarity
    embedding = image_features[0].numpy()
    embedding = embedding / np.linalg.norm(embedding)
    return embedding

def index_images(image_dir: str) -> dict:
    """Create embedding index for all images"""
    index = {}
    for img_path in Path(image_dir).glob("*.jpg"):
        embedding = get_image_embedding(str(img_path))
        index[str(img_path)] = embedding
    return index

def search_similar(query_image: str, index: dict, top_k: int = 5) -> list:
    """Find most similar images"""
    query_emb = get_image_embedding(query_image)

    # Compute cosine similarity with all indexed images
    similarities = {}
    for path, emb in index.items():
        similarity = np.dot(query_emb, emb)  # Cosine sim (normalized)
        similarities[path] = similarity

    # Sort by similarity
    sorted_results = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
    return sorted_results[:top_k]

# Example usage
# index = index_images("product_photos/")
# similar = search_similar("query.jpg", index, top_k=5)
# for path, score in similar:
#     print(f"{path}: {score:.3f}")`,
          },
          {
            type: "text",
            content:
              "**Production visual search:**\n• Index 1M+ images with FAISS/Pinecone\n• Sub-100ms search latency\n• Use cases: E-commerce (find similar products), content moderation (find duplicate images), photo organization",
          },
        ],
      },
      {
        step: 4,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why is CLIP called 'zero-shot'?",
            options: [
              "It can classify images into labels it wasn't explicitly trained on (no examples needed)",
              "It requires zero training data",
              "It costs zero dollars",
              "It has zero errors",
            ],
            correct: 0,
            explanation:
              "CLIP is zero-shot because it can classify images into ANY text labels without being explicitly trained on those labels. Training: CLIP learned on 400M (image, caption) pairs to align image and text embeddings. At inference: you can use ANY labels ('cat', 'golden retriever', 'vintage car') even if CLIP never saw examples during training — it compares image embedding with text embedding in the shared space. This is zero-shot: zero training examples for your specific labels. Not zero data overall (CLIP training used 400M pairs), not zero cost (inference costs compute), not zero errors (accuracy depends on label specificity). Key insight: shared embedding space enables generalization to unseen labels.",
          },
        ],
      },
    ],
  },
  {
    slug: "document-ai-ocr",
    trackSlug: "multimodal",
    order: 4,
    minutes: 26,
    title: "Document AI and OCR",
    subtitle:
      "Extract structured data from invoices, receipts, and forms with vision models.",
    tags: ["OCR", "Documents", "Extraction", "Production"],
    sections: [
      {
        step: 1,
        title: "Document AI vs Traditional OCR",
        blocks: [
          {
            type: "text",
            content:
              "**Traditional OCR (Tesseract):**\n• Extracts text pixel-by-pixel\n• No understanding of structure\n• Output: raw text dump\n• Requires preprocessing (rotation, noise removal)\n• Fails on complex layouts\n\n**Modern Document AI (GPT-4V/Claude):**\n• Understands document structure (tables, forms, headers)\n• Context-aware extraction (knows 'Total' comes after line items)\n• Handles poor quality, handwriting, mixed layouts\n• Output: structured JSON\n• No preprocessing needed",
          },
        ],
      },
      {
        step: 2,
        title: "Invoice Extraction with GPT-4V",
        blocks: [
          {
            type: "code",
            language: "python",
            code: `from openai import OpenAI
import base64
from pydantic import BaseModel
from typing import Optional

client = OpenAI()

class InvoiceLineItem(BaseModel):
    description: str
    quantity: float
    unit_price: float
    total: float

class Invoice(BaseModel):
    invoice_number: str
    date: str
    vendor_name: str
    vendor_address: Optional[str]
    total_amount: float
    tax: Optional[float]
    line_items: list[InvoiceLineItem]

def extract_invoice(image_path: str) -> Invoice:
    """Extract structured data from invoice image"""
    with open(image_path, "rb") as f:
        base64_image = base64.b64encode(f.read()).decode("utf-8")

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Extract all data from this invoice."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        response_format=Invoice
    )

    return response.choices[0].message.parsed

# Usage
invoice = extract_invoice("invoice.jpg")
print(f"Vendor: {invoice.vendor_name}")
print(f"Total: $\{invoice.total_amount}")
for item in invoice.line_items:
    print(f"  {item.description}: {item.quantity} × $\{item.unit_price}")`,
          },
        ],
      },
      {
        step: 3,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why is GPT-4V better than Tesseract OCR for invoices?",
            options: [
              "GPT-4V understands document structure and context (knows totals, line items, relationships)",
              "GPT-4V is faster",
              "GPT-4V is cheaper",
              "GPT-4V works offline",
            ],
            correct: 0,
            explanation:
              "GPT-4V understands STRUCTURE and CONTEXT. Example: invoice has 'Subtotal: $100', 'Tax: $10', 'Total: $110'. Tesseract extracts three numbers and three labels but doesn't understand relationships. GPT-4V knows: (1) Total = Subtotal + Tax, (2) line items appear before subtotal, (3) vendor info is at top. This semantic understanding produces structured output. Tesseract just dumps text. GPT-4V is actually slower (2-5s vs 200ms) and more expensive ($0.03 vs free), and requires API (no offline). The tradeoff: speed/cost for understanding/structure.",
          },
        ],
      },
    ],
  },
  {
    slug: "speech-to-text",
    trackSlug: "multimodal",
    order: 5,
    minutes: 22,
    title: "Speech-to-Text with Whisper",
    subtitle:
      "Transcribe audio accurately with OpenAI Whisper, 99 languages supported.",
    tags: ["Audio", "Whisper", "Transcription", "Speech"],
    sections: [
      {
        step: 1,
        title: "Whisper Fundamentals",
        blocks: [
          {
            type: "text",
            content:
              "**Whisper (OpenAI)** is the best production speech-to-text model:\n• 99 languages\n• Punctuation and capitalization\n• Speaker diarization (experimental)\n• Handles noise, accents, technical terms\n• Multiple model sizes: tiny (39M) to large (1.5B)",
          },
          {
            type: "code",
            language: "python",
            code: `from openai import OpenAI

client = OpenAI()

def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio file"""
    with open(audio_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="text"  # or "json", "srt", "vtt"
        )
    return transcript

# Supports: mp3, mp4, mpeg, mpga, m4a, wav, webm
transcript = transcribe_audio("meeting.mp3")
print(transcript)`,
          },
        ],
      },
      {
        step: 2,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What makes Whisper better than older speech-to-text models?",
            options: [
              "Trained on 680k hours multilingual data, handles noise/accents, includes punctuation",
              "Whisper is faster",
              "Whisper is free",
              "Whisper works on any hardware",
            ],
            correct: 0,
            explanation:
              "Whisper's advantage is TRAINING DATA and ROBUSTNESS: 680,000 hours of labeled audio across 99 languages (vs <10k hours for older models). This enables: (1) multilingual (switches languages mid-sentence), (2) noise-robust (background music, crowd noise), (3) accent-robust (handles regional accents), (4) punctuation included (older models just dump words). Speed/cost similar to competitors. Free for local inference (download model) but OpenAI API charges $0.006/minute. Hardware requirements vary by model size (tiny runs on CPU, large needs GPU).",
          },
        ],
      },
    ],
  },
  {
    slug: "text-to-speech",
    trackSlug: "multimodal",
    order: 6,
    minutes: 20,
    title: "Text-to-Speech",
    subtitle:
      "Generate natural-sounding speech from text with emotion and style control.",
    tags: ["TTS", "Audio", "Voice", "Synthesis"],
    sections: [
      {
        step: 1,
        title: "Modern TTS with OpenAI",
        blocks: [
          {
            type: "code",
            language: "python",
            code: `from openai import OpenAI
from pathlib import Path

client = OpenAI()

def text_to_speech(text: str, output_path: str, voice: str = "alloy"):
    """Generate speech from text"""
    response = client.audio.speech.create(
        model="tts-1",  # or "tts-1-hd" for higher quality
        voice=voice,  # alloy, echo, fable, onyx, nova, shimmer
        input=text
    )

    response.stream_to_file(output_path)

# Example
text_to_speech(
    "Hello! This is a test of OpenAI's text-to-speech API.",
    "output.mp3",
    voice="nova"
)`,
          },
        ],
      },
      {
        step: 2,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "When should you use tts-1 vs tts-1-hd?",
            options: [
              "tts-1 for real-time applications (lower latency), tts-1-hd for offline content (better quality)",
              "tts-1-hd is always better",
              "tts-1 is free, tts-1-hd costs money",
              "They sound identical",
            ],
            correct: 0,
            explanation:
              "tts-1: optimized for latency (~300ms), good quality, use for real-time (voice assistants, live translation). tts-1-hd: optimized for quality (~1-2s latency), better prosody and naturalness, use for content creation (audiobooks, videos, podcasts). Both cost the same ($15/million characters). Choice is latency vs quality tradeoff, not cost.",
          },
        ],
      },
    ],
  },
  {
    slug: "audio-understanding",
    trackSlug: "multimodal",
    order: 7,
    minutes: 24,
    title: "Audio Understanding",
    subtitle:
      "Classify sounds, detect events, and analyze audio beyond speech.",
    tags: ["Audio", "Classification", "Events", "Analysis"],
    sections: [
      {
        step: 1,
        title: "Audio Classification",
        blocks: [
          {
            type: "text",
            content:
              "**Audio understanding beyond speech:**\n• Sound classification (dog bark, car horn, music)\n• Event detection (glass breaking, alarm)\n• Music analysis (genre, mood, tempo)\n• Environmental audio (nature, urban, industrial)",
          },
          {
            type: "code",
            language: "python",
            code: `# Install: pip install transformers torch torchaudio
from transformers import pipeline

# Audio classification with Wav2Vec2
classifier = pipeline(
    "audio-classification",
    model="MIT/ast-finetuned-audioset-10-10-0.4593"
)

def classify_audio(audio_path: str) -> list:
    """Classify audio into categories"""
    results = classifier(audio_path)
    return results

# Example
predictions = classify_audio("sound.wav")
for pred in predictions[:3]:
    print(f"{pred['label']}: {pred['score']:.2f}")

# Output:
# Dog: 0.92
# Animal: 0.05
# Domestic: 0.02`,
          },
        ],
      },
      {
        step: 2,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "What's the difference between speech-to-text and audio classification?",
            options: [
              "Speech-to-text transcribes words, audio classification identifies sound types/events",
              "They're the same thing",
              "Audio classification is more accurate",
              "Speech-to-text works on music",
            ],
            correct: 0,
            explanation:
              "Speech-to-text (Whisper) converts spoken words to text ('hello world'). Audio classification identifies sound TYPES without transcription (dog bark, music, alarm). Different tasks: transcription vs categorization. Speech-to-text won't classify a dog bark (no words to transcribe). Audio classifier won't transcribe speech (outputs 'Speech' label, not words). Use both: classify audio first (is it speech?), then transcribe if yes.",
          },
        ],
      },
    ],
  },
  {
    slug: "video-understanding",
    trackSlug: "multimodal",
    order: 8,
    minutes: 26,
    title: "Video Understanding",
    subtitle:
      "Process video with frame sampling, temporal understanding, and action recognition.",
    tags: ["Video", "Temporal", "Action", "Frames"],
    sections: [
      {
        step: 1,
        title: "Video as Sequence of Frames",
        blocks: [
          {
            type: "text",
            content:
              "**Video = Images + Time.** Process video by:\n1. Sample frames (1 FPS = 1 frame per second)\n2. Analyze each frame with VLM\n3. Aggregate across time\n\n**Frame sampling strategies:**\n• Uniform (every Nth frame)\n• Keyframe detection (scene changes)\n• Event-based (motion detected)",
          },
          {
            type: "code",
            language: "python",
            code: `# Install: pip install opencv-python
import cv2
from pathlib import Path

def extract_frames(video_path: str, fps: int = 1) -> list[str]:
    """Extract frames from video at given FPS"""
    cap = cv2.VideoCapture(video_path)
    video_fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(video_fps / fps)

    frames = []
    frame_count = 0
    saved_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            frame_path = f"frame_{saved_count:04d}.jpg"
            cv2.imwrite(frame_path, frame)
            frames.append(frame_path)
            saved_count += 1

        frame_count += 1

    cap.release()
    return frames

# Extract 1 frame per second
frames = extract_frames("video.mp4", fps=1)
print(f"Extracted {len(frames)} frames")`,
          },
        ],
      },
      {
        step: 2,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why sample frames at 1 FPS instead of analyzing every frame?",
            options: [
              "Cost/speed: 30 FPS video = 30x more API calls, but most frames are redundant",
              "1 FPS is more accurate",
              "APIs only accept 1 FPS",
              "Higher FPS causes errors",
            ],
            correct: 0,
            explanation:
              "30 FPS video has 30 frames per second. Analyzing all = 30× API calls, 30× cost, 30× latency. But consecutive frames in video are nearly identical (person in same position for 0.1s). Sampling 1 FPS captures scene changes without redundancy. Example: 10-minute meeting = 18,000 frames at 30 FPS vs 600 frames at 1 FPS. Quality barely drops (still captures actions), cost drops 30×. Higher sampling (5-10 FPS) for fast action (sports), lower (0.5 FPS) for static content (presentations).",
          },
        ],
      },
    ],
  },
  {
    slug: "multimodal-rag",
    trackSlug: "multimodal",
    order: 9,
    minutes: 28,
    title: "Multimodal RAG",
    subtitle:
      "Build RAG systems that retrieve images, documents, and text together.",
    tags: ["RAG", "Retrieval", "Multimodal", "Search"],
    sections: [
      {
        step: 1,
        title: "Multimodal Embeddings for RAG",
        blocks: [
          {
            type: "text",
            content:
              "**Standard RAG** retrieves text chunks. **Multimodal RAG** retrieves text + images + documents in the same query.",
          },
          {
            type: "code",
            language: "python",
            code: `from openai import OpenAI
import base64

client = OpenAI()

def create_multimodal_index(documents: list[dict]):
    """Index text and images together"""
    index = []

    for doc in documents:
        # Text embedding
        if doc["type"] == "text":
            emb_response = client.embeddings.create(
                model="text-embedding-3-small",
                input=doc["content"]
            )
            embedding = emb_response.data[0].embedding

        # Image embedding via CLIP description
        elif doc["type"] == "image":
            # Get image description from GPT-4V
            with open(doc["path"], "rb") as f:
                b64_image = base64.b64encode(f.read()).decode()

            desc_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Describe this image in detail."},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"}}
                    ]
                }]
            )
            description = desc_response.choices[0].message.content

            # Embed description
            emb_response = client.embeddings.create(
                model="text-embedding-3-small",
                input=description
            )
            embedding = emb_response.data[0].embedding

        index.append({
            "id": doc["id"],
            "type": doc["type"],
            "embedding": embedding,
            "metadata": doc
        })

    return index`,
          },
        ],
      },
      {
        step: 2,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "How do you embed images for RAG retrieval?",
            options: [
              "Generate text description with VLM, then embed the description",
              "Directly embed image pixels",
              "Images can't be embedded",
              "Use a separate image database",
            ],
            correct: 0,
            explanation:
              "Standard embedding models (text-embedding-3) only accept text. To retrieve images: (1) generate description with GPT-4V ('red car on highway'), (2) embed description, (3) store embedding + image path. At query time: embed query text, find similar embeddings, return corresponding images. Alternative: use CLIP embeddings (natively multimodal) but OpenAI RAG uses text embeddings. You CAN directly embed pixels with CLIP, but that's a different architecture. Separate database works but loses unified retrieval (can't search text and images together).",
          },
        ],
      },
    ],
  },
  {
    slug: "production-document-ai",
    trackSlug: "multimodal",
    order: 10,
    minutes: 30,
    title: "Building Production Document AI",
    subtitle:
      "Scale document processing with queues, validation, and error handling.",
    tags: ["Production", "Documents", "Scale", "Pipeline"],
    sections: [
      {
        step: 1,
        title: "Document Processing Pipeline",
        blocks: [
          {
            type: "diagram",
            chart: `graph LR
    Upload[User uploads<br/>document] --> Queue[Task Queue<br/>Celery/Redis]
    Queue --> Validate[Validate<br/>file type/size]
    Validate --> Extract[Extract data<br/>GPT-4V]
    Extract --> Verify[Verify<br/>Pydantic schema]
    Verify --> Store[Store<br/>database]
    Store --> Notify[Notify user]

    Validate -->|Invalid| Error[Error handler]
    Extract -->|Failed| Retry[Retry 3x]
    Verify -->|Invalid| Manual[Manual review queue]

    style Queue fill:#e1f5ff
    style Extract fill:#fff3cd`,
          },
        ],
      },
      {
        step: 2,
        title: "Production Implementation",
        blocks: [
          {
            type: "code",
            language: "python",
            code: `from celery import Celery
from openai import OpenAI
from pydantic import BaseModel, ValidationError
import base64

app = Celery('document_processor', broker='redis://localhost:6379')
client = OpenAI()

class Invoice(BaseModel):
    invoice_number: str
    total: float
    vendor: str

@app.task(bind=True, max_retries=3)
def process_document(self, file_path: str):
    """Process document with retry logic"""
    try:
        # Extract data
        with open(file_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode()

        response = client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": "Extract invoice data."},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}}
                ]
            }],
            response_format=Invoice
        )

        invoice = response.choices[0].message.parsed

        # Validate
        if invoice.total <= 0:
            raise ValueError("Invalid total")

        # Store to database
        save_to_db(invoice)

        return {"status": "success", "invoice_id": invoice.invoice_number}

    except ValidationError as e:
        # Send to manual review
        queue_for_review(file_path, error=str(e))
        return {"status": "manual_review"}

    except Exception as e:
        # Retry with exponential backoff
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))`,
          },
        ],
      },
      {
        step: 3,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why use Celery for document processing?",
            options: [
              "Async processing prevents web requests from timing out, enables retry logic and horizontal scaling",
              "Celery is faster than direct API calls",
              "Celery is required by OpenAI",
              "Celery reduces API costs",
            ],
            correct: 0,
            explanation:
              "Document processing takes 2-5s per image. If user uploads document during web request, request times out (30s limit). Celery: (1) returns immediately ('processing...'), (2) processes async in background worker, (3) notifies when done. Also enables: retry (failed extraction → retry 3x with backoff), horizontal scaling (add workers for throughput), error handling (validation fails → manual review queue). Not faster (same API latency) or cheaper (same API cost), not required (can call directly). Benefit is RELIABILITY and SCALE, not speed/cost.",
          },
        ],
      },
    ],
  },
  {
    slug: "meeting-assistant",
    trackSlug: "multimodal",
    order: 11,
    minutes: 32,
    title: "Building a Meeting Assistant",
    subtitle:
      "Transcribe meetings, generate summaries, extract action items with Whisper + GPT.",
    tags: ["Audio", "Meetings", "Summaries", "Actions"],
    sections: [
      {
        step: 1,
        title: "Meeting Assistant Architecture",
        blocks: [
          {
            type: "diagram",
            chart: `graph TD
    Record[Record meeting<br/>audio] --> Whisper[Transcribe<br/>Whisper API]
    Whisper --> Chunk[Chunk by speaker<br/>or time]
    Chunk --> Summarize[Summarize<br/>GPT-4o]
    Chunk --> Actions[Extract actions<br/>structured output]
    Chunk --> Questions[Extract questions<br/>track open items]
    Summarize --> Combine[Combine all outputs]
    Actions --> Combine
    Questions --> Combine
    Combine --> Email[Email summary<br/>to attendees]

    style Whisper fill:#e1f5ff
    style Summarize fill:#fff3cd`,
          },
        ],
      },
      {
        step: 2,
        title: "Implementation",
        blocks: [
          {
            type: "code",
            language: "python",
            code: `from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()

class ActionItem(BaseModel):
    task: str
    owner: str
    deadline: str

class MeetingSummary(BaseModel):
    key_points: list[str]
    decisions: list[str]
    action_items: list[ActionItem]
    questions: list[str]

def process_meeting(audio_path: str) -> MeetingSummary:
    """End-to-end meeting processing"""
    # Step 1: Transcribe
    with open(audio_path, "rb") as audio:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio,
            response_format="text"
        )

    # Step 2: Extract structured summary
    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Extract meeting summary."},
            {"role": "user", "content": f"Transcript:\\n{transcript}"}
        ],
        response_format=MeetingSummary
    )

    return response.choices[0].message.parsed

# Usage
summary = process_meeting("meeting.mp3")
print("KEY POINTS:")
for point in summary.key_points:
    print(f"  - {point}")

print("\\nACTION ITEMS:")
for action in summary.action_items:
    print(f"  - {action.task} (Owner: {action.owner}, Due: {action.deadline})")`,
          },
        ],
      },
      {
        step: 3,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why transcribe first, then extract actions (instead of extracting directly from audio)?",
            options: [
              "Current LLMs process text better than audio; transcription is mature, audio understanding is emerging",
              "It's cheaper to process text",
              "Audio files are too large",
              "Whisper can't extract actions",
            ],
            correct: 0,
            explanation:
              "Two-stage (transcribe → extract) because: (1) LLMs are TEXT-NATIVE: GPT-4 was trained on text, excellent at extraction/summarization. Audio understanding is newer, less capable. (2) Whisper ONLY transcribes, doesn't extract meaning (it's speech-to-text, not speech-to-summary). (3) Transcript is reusable (run multiple extractions: actions, questions, decisions without re-transcribing). Cost similar (Whisper $0.006/min, GPT-4 processes transcript ~$0.01). File size irrelevant (both APIs accept large files). Future: native audio LLMs may skip transcription, but 2-stage is current best practice.",
          },
        ],
      },
    ],
  },
  {
    slug: "project-invoice-processor",
    trackSlug: "multimodal",
    order: 12,
    minutes: 36,
    title: "Final Project: AI Invoice Processor",
    subtitle:
      "Build end-to-end invoice processing: upload, extract, validate, export.",
    tags: ["Project", "Invoice", "Full-stack", "Production"],
    sections: [
      {
        step: 1,
        title: "Project Overview",
        blocks: [
          {
            type: "text",
            content:
              "**Build a complete invoice processing system:**\n• Web UI for upload (drag-and-drop)\n• Backend API (FastAPI)\n• Document extraction (GPT-4V)\n• Validation and error handling\n• Database storage (SQLite/Postgres)\n• Export to CSV/JSON\n• Cost tracking and monitoring",
          },
          {
            type: "diagram",
            chart: `graph TD
    UI[Web UI<br/>React upload] --> API[FastAPI<br/>backend]
    API --> Celery[Celery worker<br/>async processing]
    Celery --> GPT4V[GPT-4V<br/>extraction]
    GPT4V --> Validate[Pydantic<br/>validation]
    Validate --> DB[(PostgreSQL<br/>storage)]
    DB --> Export[Export<br/>CSV/JSON]
    Validate -->|Error| Manual[Manual review<br/>queue]

    style API fill:#e1f5ff
    style GPT4V fill:#fff3cd
    style DB fill:#d4edda`,
          },
        ],
      },
      {
        step: 2,
        title: "Backend Implementation",
        blocks: [
          {
            type: "code",
            language: "python",
            code: `# FastAPI backend
from fastapi import FastAPI, UploadFile, File
from celery import Celery
from pydantic import BaseModel
from openai import OpenAI
import base64

app = FastAPI()
celery_app = Celery('invoice', broker='redis://localhost')
client = OpenAI()

class Invoice(BaseModel):
    invoice_number: str
    vendor: str
    date: str
    total: float
    line_items: list[dict]

@app.post("/upload")
async def upload_invoice(file: UploadFile = File(...)):
    """Upload invoice for processing"""
    # Save file
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Queue for processing
    task = process_invoice.delay(file_path)

    return {"task_id": task.id, "status": "processing"}

@celery_app.task
def process_invoice(file_path: str):
    """Process invoice async"""
    # Extract with GPT-4V
    with open(file_path, "rb") as f:
        b64_image = base64.b64encode(f.read()).decode()

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "Extract invoice data."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"}}
            ]
        }],
        response_format=Invoice
    )

    invoice = response.choices[0].message.parsed

    # Save to database
    save_to_db(invoice)

    return {"status": "complete", "invoice": invoice.dict()}

@app.get("/status/{task_id}")
async def check_status(task_id: str):
    """Check processing status"""
    task = celery_app.AsyncResult(task_id)
    return {
        "status": task.state,
        "result": task.result if task.ready() else None
    }`,
          },
        ],
      },
      {
        step: 3,
        title: "Frontend Upload UI",
        blocks: [
          {
            type: "code",
            language: "typescript",
            code: `// React component for invoice upload
import { useState } from 'react';

export function InvoiceUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // Upload
    const uploadRes = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    const { task_id } = await uploadRes.json();

    setStatus('Processing...');

    // Poll for status
    const interval = setInterval(async () => {
      const statusRes = await fetch(\`/status/\${task_id}\`);
      const data = await statusRes.json();

      if (data.status === 'SUCCESS') {
        setStatus('Complete!');
        clearInterval(interval);
        console.log('Invoice:', data.result.invoice);
      }
    }, 2000);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload}>Upload Invoice</button>
      <p>{status}</p>
    </div>
  );
}`,
          },
        ],
      },
      {
        step: 4,
        title: "Cost Tracking",
        blocks: [
          {
            type: "text",
            content:
              "**Track costs per invoice:**\n• GPT-4V high detail: $0.03 per image\n• Whisper (if processing receipts with audio): $0.006/minute\n• Store cost metadata with each invoice\n• Monitor total spend daily\n• Set budget alerts ($100/day limit)",
          },
        ],
      },
      {
        step: 5,
        title: "Test yourself",
        blocks: [
          {
            type: "quiz",
            question: "Why use Celery for invoice processing instead of processing synchronously?",
            options: [
              "Invoices take 2-5s to process; async prevents web request timeout and enables retry/scale",
              "Celery is required by GPT-4V",
              "Celery is faster",
              "Celery is free",
            ],
            correct: 0,
            explanation:
              "Processing takes 2-5 seconds (GPT-4V API call). If done synchronously in web request: (1) user waits 2-5s staring at loading spinner (bad UX), (2) request might timeout (30s limit), (3) if fails, user must re-upload and wait again. With Celery: (1) /upload returns immediately ('processing'), (2) worker processes in background, (3) frontend polls /status every 2s, (4) retry automatically if fails, (5) scale workers to process 100 invoices concurrently. Not about speed (same GPT-4V latency) or cost (Celery adds Redis but trivial cost). Benefit: reliability + scale + UX.",
          },
        ],
      },
    ],
  },
];
