import type { BasicAIQuestion } from '@/lib/interview'

export const basicAIQuestions: BasicAIQuestion[] = [
  {
    id: 'basic-01',
    topic: 'Bias-Variance Tradeoff',
    difficulty: 'Medium',
    tags: ['fundamentals', 'model-selection', 'regularization'],
    question: 'Explain the bias-variance tradeoff and how you manage it in production ML systems.',
    expectedAnswer:
      'Bias is error from overly simplistic assumptions (underfitting); variance is error from sensitivity to small fluctuations in training data (overfitting). High-bias models underfit and miss relevant patterns; high-variance models overfit and capture noise. In production, I manage this through cross-validation to detect overfitting early, regularization (L1/L2/dropout) to reduce variance, ensemble methods (bagging reduces variance, boosting reduces bias), and monitoring train vs. validation loss curves. The sweet spot depends on dataset size—larger datasets tolerate higher-complexity models—and on business tolerance for false positives vs. false negatives.',
  },
  {
    id: 'basic-02',
    topic: 'Learning Paradigms',
    difficulty: 'Easy',
    tags: ['supervised', 'unsupervised', 'self-supervised'],
    question:
      'Explain the difference between supervised, unsupervised, and self-supervised learning. Give examples of when you would use each.',
    expectedAnswer:
      'Supervised learning uses labeled input-output pairs (e.g., classification, regression)—ideal when labeled data is available and the task is well-defined. Unsupervised learning finds patterns in unlabeled data (clustering, anomaly detection, dimensionality reduction)—useful when labels are expensive or unavailable. Self-supervised learning generates labels from the data itself (GPT predicts next token, BERT masks tokens)—critical for pretraining large models on massive unlabeled corpora where manual labeling is infeasible. For a 5-year AI engineer, a practical example: supervised for churn prediction, unsupervised for customer segmentation, self-supervised for building a domain-specific language model foundation.',
  },
  {
    id: 'basic-03',
    topic: 'Regularization',
    difficulty: 'Medium',
    tags: ['L1', 'L2', 'regularization', 'sparsity'],
    question:
      'What are the key differences between L1 and L2 regularization? When would you prefer one over the other?',
    expectedAnswer:
      'L1 (Lasso) adds the sum of absolute weights to the loss, producing sparse solutions—some weights become exactly zero, performing implicit feature selection. L2 (Ridge) adds the sum of squared weights, shrinking all weights toward zero but rarely to exactly zero, distributing the penalty. I prefer L1 when I have many irrelevant features and want an interpretable, sparse model (e.g., text classification with 100k features). L2 works better when most features contribute something and I want stable, smooth parameter updates—it is also easier to optimize since it is differentiable everywhere. ElasticNet combines both when I need partial sparsity with stability.',
  },
  {
    id: 'basic-04',
    topic: 'Optimization',
    difficulty: 'Medium',
    tags: ['gradient-descent', 'Adam', 'SGD', 'optimization'],
    question:
      'Explain gradient descent and its variants—SGD, Momentum, Adam, RMSprop. What are the tradeoffs?',
    expectedAnswer:
      'Vanilla gradient descent computes the gradient over the full dataset—accurate but expensive for large datasets. SGD uses a single sample per step, introducing noise that can escape local minima but causes unstable convergence. Momentum accumulates a velocity vector to accelerate movement in consistent directions, reducing oscillation. RMSprop adapts per-parameter learning rates by dividing by a running average of squared gradients, handling sparse gradients well. Adam combines momentum and RMSprop—adaptive, fast, and the de-facto default for LLM training. In practice: Adam for most deep learning, SGD+momentum for image models where it often finds flatter minima with better generalization, and AdamW (Adam with decoupled weight decay) for transformer pretraining.',
  },
  {
    id: 'basic-05',
    topic: 'Dimensionality',
    difficulty: 'Medium',
    tags: ['curse-of-dimensionality', 'high-dimensional', 'embeddings'],
    question:
      "What is the curse of dimensionality and how does it affect ML models in practice?",
    expectedAnswer:
      'As the number of dimensions grows, data becomes increasingly sparse—the volume of the space grows exponentially, so the same number of points covers an ever-smaller fraction of the input space. This means distance-based algorithms (KNN, SVM with RBF kernel) degrade because all points become equidistant. It also increases the risk of overfitting since there are exponentially more possible patterns to memorize. In practice, I address it through dimensionality reduction (PCA, UMAP, autoencoders), feature selection, or using models with strong inductive biases (CNNs, transformers) that exploit structural assumptions about the data rather than relying on raw distance metrics.',
  },
  {
    id: 'basic-06',
    topic: 'Evaluation',
    difficulty: 'Easy',
    tags: ['cross-validation', 'evaluation', 'train-test-split'],
    question:
      'Explain cross-validation. Why is it important and what are its limitations?',
    expectedAnswer:
      'Cross-validation (CV) estimates a model\'s generalization performance by training and evaluating on multiple train/validation splits of the same dataset. k-fold CV splits data into k folds, trains on k-1 and validates on the remaining one, cycling k times. It is important because a single train/test split may produce misleadingly optimistic or pessimistic estimates depending on the random split. Limitations: it is computationally expensive for large datasets or slow models; it can still leak information if preprocessing (e.g., scaling, SMOTE) is applied before splitting; and for time series data, standard k-fold violates temporal order—you must use TimeSeriesSplit instead.',
  },
  {
    id: 'basic-07',
    topic: 'Overfitting',
    difficulty: 'Easy',
    tags: ['overfitting', 'regularization', 'generalization'],
    question:
      'What is overfitting and what techniques can you use to prevent it?',
    expectedAnswer:
      'Overfitting occurs when a model memorizes the training data including noise, achieving high training accuracy but poor generalization to unseen data. The model has learned spurious correlations that do not hold in production. Prevention techniques: regularization (L1/L2/dropout); early stopping based on validation loss; data augmentation to artificially increase training diversity; reducing model capacity; cross-validation to detect overfitting before deployment; ensemble methods (bagging); and collecting more training data. In LLMs specifically, dropout during pretraining, weight decay, and controlling context length all help. The key diagnostic is a large gap between training and validation metrics.',
  },
  {
    id: 'basic-08',
    topic: 'Ensemble Methods',
    difficulty: 'Medium',
    tags: ['bagging', 'boosting', 'random-forest', 'xgboost'],
    question:
      'Explain the difference between bagging and boosting. When would you use each?',
    expectedAnswer:
      'Bagging (Bootstrap Aggregating) trains multiple independent models on random subsamples of the data and averages predictions—Random Forest is the canonical example. It primarily reduces variance without much effect on bias, making it effective against overfitting. Boosting trains models sequentially, with each model correcting the errors of the previous one (e.g., XGBoost, LightGBM, AdaBoost). It primarily reduces bias, making it powerful for structured/tabular data. In practice: use Random Forest when you need fast training, robustness to hyperparameters, and good default performance; use XGBoost/LightGBM when squeezing maximum accuracy on tabular data and you are prepared to tune learning rate, depth, and regularization. Boosting is more prone to overfitting on noisy data.',
  },
  {
    id: 'basic-09',
    topic: 'Transfer Learning',
    difficulty: 'Medium',
    tags: ['transfer-learning', 'fine-tuning', 'pretrained-models'],
    question:
      'What is transfer learning and why is it so effective in deep learning?',
    expectedAnswer:
      'Transfer learning leverages knowledge learned on one task (or large dataset) to accelerate learning on a different but related task. A pretrained model has already learned general feature representations—low-level edges and textures in vision, syntactic and semantic patterns in language—that are broadly useful. Fine-tuning these representations on a smaller, task-specific dataset typically outperforms training from scratch, especially when labeled data is scarce. Effectiveness comes from: (1) feature reuse—early layers capture universally useful patterns; (2) reduced data requirements—the model already understands the input domain; (3) faster convergence. In LLMs, BERT and GPT-style pretraining on vast corpora encode world knowledge that then transfers to downstream NLP tasks with minimal labeled examples.',
  },
  {
    id: 'basic-10',
    topic: 'Attention Mechanism',
    difficulty: 'Hard',
    tags: ['attention', 'transformers', 'self-attention', 'NLP'],
    question:
      'Explain the attention mechanism. Why was it a breakthrough, and what is the complexity concern at scale?',
    expectedAnswer:
      'Attention allows a model to weigh the relevance of all positions in an input sequence when producing each output. In scaled dot-product attention: Q (query), K (key), V (value) are linear projections of the input. Scores are computed as softmax(QK^T / √d_k)V, where √d_k prevents gradient vanishing with large dimensions. Self-attention lets every token attend to every other token in O(n²) time and memory with respect to sequence length—the key scaling bottleneck. It was a breakthrough because it replaced recurrence (RNNs/LSTMs) which processed tokens sequentially and struggled with long-range dependencies. Attention captures arbitrary long-range relationships in a single step and parallelizes across the sequence. At scale, solutions include Flash Attention (memory-efficient kernel), sparse attention, and sliding window attention (Longformer).',
  },
  {
    id: 'basic-11',
    topic: 'Embeddings',
    difficulty: 'Medium',
    tags: ['embeddings', 'representations', 'semantic-search', 'word2vec'],
    question:
      'What are embeddings and why are they fundamental to modern AI?',
    expectedAnswer:
      'Embeddings are dense, low-dimensional vector representations of high-dimensional or discrete objects (words, sentences, images, users, products) where geometric proximity encodes semantic or functional similarity. They convert symbolic data into a continuous space amenable to gradient-based optimization and similarity computation. They are fundamental because: neural networks require continuous inputs; learned embeddings capture rich relationships (king − man + woman ≈ queen in Word2Vec); they enable cross-modal alignment (CLIP aligns text and image embeddings); and they power semantic search and RAG systems where approximate nearest-neighbor search over embedding spaces enables retrieval at scale. At 5 years experience, I use them in semantic search, recommendation systems, anomaly detection, and as the retrieval backbone in LLM-augmented applications.',
  },
  {
    id: 'basic-12',
    topic: 'Batch Normalization',
    difficulty: 'Medium',
    tags: ['batch-norm', 'training', 'deep-learning', 'layer-norm'],
    question:
      'Explain batch normalization. What problem does it solve and what are its limitations in production?',
    expectedAnswer:
      'Batch normalization normalizes activations within a mini-batch to have zero mean and unit variance, then applies learned scale (γ) and shift (β) parameters. It solves internal covariate shift—the problem where the distribution of each layer\'s inputs changes during training as weights of prior layers update—allowing higher learning rates and faster convergence. Limitations: (1) behavior differs between training (batch statistics) and inference (running statistics)—a common source of production bugs; (2) it performs poorly with small batch sizes (e.g., batch size 1 in detection models)—Layer Norm is preferred for transformers; (3) it breaks with non-IID batches (e.g., sorting by length). In production, I always verify train/inference statistics are consistent and prefer Layer Norm for sequence models.',
  },
  {
    id: 'basic-13',
    topic: 'Model Types',
    difficulty: 'Medium',
    tags: ['discriminative', 'generative', 'VAE', 'GAN'],
    question:
      'What is the difference between discriminative and generative models? When would you use each?',
    expectedAnswer:
      'Discriminative models learn P(y|x)—the conditional probability of a label given input—and focus on finding decision boundaries (logistic regression, SVM, neural classifiers). Generative models learn the joint distribution P(x, y) or P(x) and can synthesize new samples as well as classify. Generative models include GANs (adversarial training for image synthesis), VAEs (latent variable models with ELBO objective), and autoregressive models like GPT. Use discriminative models when you only need predictions and have labeled data—they are typically more accurate for classification. Use generative models when you need to synthesize data (augmentation, simulation), model uncertainty, or build LLM-style next-token prediction. For 5-year experience: discriminative for production classifiers, generative for data augmentation and LLM development.',
  },
  {
    id: 'basic-14',
    topic: 'Class Imbalance',
    difficulty: 'Medium',
    tags: ['class-imbalance', 'SMOTE', 'resampling', 'class-weights'],
    question:
      'How would you handle class imbalance in a dataset? Walk me through your decision process.',
    expectedAnswer:
      'My approach depends on the imbalance ratio and domain. First, I reframe the metric—accuracy is meaningless; I use precision-recall AUC, F1, or Matthews Correlation Coefficient. Then: (1) Algorithm-level: use class_weight="balanced" in sklearn models or adjust the positive weight in PyTorch BCEWithLogitsLoss; (2) Data-level: oversample minority class (SMOTE, ADASYN) or undersample majority class (RandomUnderSampler), always after the train split to prevent leakage; (3) Threshold tuning: shift the decision threshold post-training to optimize the business objective (e.g., maximize recall for fraud); (4) Ensemble methods like BalancedBagging. For extreme imbalance (0.01%), I treat it as anomaly detection (Isolation Forest, autoencoder reconstruction error) rather than binary classification. Always validate with stratified k-fold.',
  },
  {
    id: 'basic-15',
    topic: 'Evaluation Metrics',
    difficulty: 'Easy',
    tags: ['metrics', 'precision', 'recall', 'AUROC', 'RMSE'],
    question:
      'What evaluation metrics would you use for different ML tasks and how do you choose between them?',
    expectedAnswer:
      'Classification: Accuracy for balanced classes; Precision/Recall/F1 for imbalanced; AUROC for ranking quality independent of threshold; LogLoss when calibrated probabilities matter. Regression: RMSE penalizes large errors heavily (good for outlier-sensitive tasks); MAE is robust to outliers; MAPE for percentage-based business interpretation; R² for explained variance. Ranking/Retrieval: NDCG, MRR, MAP for recommendation and search. Generation (LLMs): BLEU/ROUGE for reference-based; BERTScore for semantic similarity; human evaluation or LLM-as-judge for open-ended quality. Business-level: always tie the ML metric to a business KPI. A model with 0.95 AUROC that does not improve revenue or reduce costs is irrelevant. I always present metrics alongside confidence intervals and report them on held-out test sets, not validation.',
  },
]
