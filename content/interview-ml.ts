import type { MLQuestion } from '@/lib/interview'

export const mlQuestions: MLQuestion[] = [
  {
    id: 'ml-01',
    topic: 'Fraud Detection & Class Imbalance',
    difficulty: 'Hard',
    tags: ['imbalance', 'fraud', 'anomaly-detection', 'threshold-tuning'],
    question:
      'You are building a fraud detection model with extreme class imbalance (0.1% fraud). Walk me through your complete approach.',
    expectedAnswer:
      'First, I reframe the problem—at 0.1%, this is anomaly detection territory. I start with baseline: a cost-sensitive logistic regression with class_weight="balanced" to establish minimum performance. Then I explore: (1) Threshold-free: train an XGBoost with scale_pos_weight=999 (ratio of negatives to positives), optimize at inference by choosing threshold that maximizes F2-score (fraud recall is more valuable than precision). (2) Data: SMOTE on the training split only—never before splitting; consider undersampling majority class. (3) Features: transaction velocity features (last 5 min, last 1 hr), device fingerprint, behavioral embeddings, graph features from transaction network. (4) Evaluation: PR-AUC, not ROC-AUC—ROC is misleadingly optimistic with extreme imbalance. (5) Production: deploy as a scoring service, use cost-based threshold (cost of fraud vs. cost of false positive), retrain monthly to handle concept drift.',
    followUpQuestions: [
      'How would you handle concept drift where fraud patterns change monthly?',
      'How do you ensure your SMOTE oversampling does not leak into the test set?',
      'How do you explain a fraud model decision to a compliance officer?',
      'What online learning strategies would you use to update the model in real time?',
    ],
  },
  {
    id: 'ml-02',
    topic: 'Gradient Boosting',
    difficulty: 'Hard',
    tags: ['XGBoost', 'gradient-boosting', 'random-forest', 'ensemble'],
    question:
      'Explain XGBoost\'s algorithm in depth. How is it fundamentally different from Random Forest?',
    expectedAnswer:
      'XGBoost is a regularized gradient boosting framework. It builds trees sequentially: each tree fits the negative gradient of the loss function (the pseudo-residuals from prior trees). Key innovations: (1) Second-order Taylor expansion of the loss function for more accurate gradient estimates; (2) Regularization terms (L1/L2 on leaf weights, tree complexity) built into the objective—preventing overfitting inherently; (3) Weighted quantile sketch for approximate tree splitting, enabling parallelization; (4) Sparsity-aware split finding for missing values and sparse features; (5) Column subsampling like Random Forest. Random Forest trains trees independently in parallel via bagging—each tree sees a random bootstrap of data and random feature subsets. XGBoost trains sequentially, correcting errors from prior trees. RF reduces variance; XGBoost reduces both bias and variance. XGBoost typically wins on tabular benchmarks but is more sensitive to hyperparameters and more prone to overfitting noisy data.',
    followUpQuestions: [
      'When would you choose LightGBM over XGBoost?',
      'How does CatBoost handle categorical features differently?',
      'What are the key hyperparameters to tune in XGBoost and how do they interact?',
      'How do you parallelize XGBoost training across a cluster?',
    ],
  },
  {
    id: 'ml-03',
    topic: 'Feature Selection',
    difficulty: 'Medium',
    tags: ['feature-selection', 'high-dimensional', 'SHAP', 'mutual-information'],
    question:
      'How would you perform feature selection for a high-dimensional dataset with 10,000 features?',
    expectedAnswer:
      'I apply a staged approach: (1) Filter methods first (fast, model-agnostic): remove near-zero variance features, high-correlation pairs (Spearman > 0.95), then rank by mutual information or chi-squared score to cut the space to ~1,000 candidates; (2) Wrapper methods: Recursive Feature Elimination with cross-validation on a fast model (logistic regression, LightGBM) to find the optimal subset; (3) Embedded methods: train a tree-based model and use SHAP values to identify features with near-zero impact—more reliable than raw feature importance which can be misleading with correlated features. For very high dimensions (text, genomics), I use dimensionality reduction (PCA, UMAP) as preprocessing or rely on the model\'s built-in sparsity (L1 regularization in logistic regression). Critical: always perform feature selection within each cross-validation fold to prevent information leakage.',
    followUpQuestions: [
      'How do you handle feature selection when features are highly correlated?',
      'What is the difference between filter, wrapper, and embedded methods?',
      'How does SHAP differ from permutation feature importance?',
    ],
  },
  {
    id: 'ml-04',
    topic: 'SVMs & Kernel Methods',
    difficulty: 'Hard',
    tags: ['SVM', 'kernel-trick', 'high-dimensional', 'non-linear'],
    question:
      'Explain the kernel trick in SVMs. Why is it mathematically powerful?',
    expectedAnswer:
      'The kernel trick allows SVMs to learn non-linear decision boundaries without explicitly computing the high- (or infinite-) dimensional feature transformation. A kernel function k(x, x\') computes the dot product in a transformed feature space ⟨φ(x), φ(x\')⟩ without ever computing φ(x) itself. For example, the RBF kernel k(x,x\') = exp(-γ||x-x\'||²) implicitly maps inputs to an infinite-dimensional space. The SVM dual formulation depends only on dot products between training examples, so substituting k(x,x\') for these dot products seamlessly operates in the transformed space. This is powerful because: computing in the original space is O(d) but the transformed space may be O(d²) or infinite, making the explicit approach infeasible. In production, SVMs with RBF kernels have been largely replaced by neural networks for most tasks, but are still relevant for small-to-medium datasets, anomaly detection (One-Class SVM), and structured prediction.',
    followUpQuestions: [
      'What is the difference between hard-margin and soft-margin SVM?',
      'How does the C parameter in SVM affect the bias-variance tradeoff?',
      'Why have SVMs been largely replaced by deep learning for large-scale tasks?',
    ],
  },
  {
    id: 'ml-05',
    topic: 'Missing Data',
    difficulty: 'Medium',
    tags: ['missing-data', 'imputation', 'MCAR', 'MAR', 'production'],
    question:
      'How do you handle missing data in production ML pipelines? What are the different types and strategies?',
    expectedAnswer:
      'First, I diagnose the missingness mechanism: MCAR (Missing Completely At Random)—safe to impute; MAR (Missing At Random, conditional on observed variables)—impute carefully; MNAR (Missing Not At Random)—missingness itself carries signal and must be modeled. Strategies: (1) Indicator variable: add a binary "was_missing" feature before imputation—this preserves the information that missingness occurred; (2) Simple imputation: median/mode (robust, avoid mean for skewed data) for MCAR; (3) Model-based: KNN imputation for MAR with moderate dimensionality, IterativeImputer (MICE) for complex dependencies; (4) For tree-based models: XGBoost/LightGBM natively handle missing values via learned default split directions—often the best approach. In production, I fit imputers on training data only and apply to test/serving data, versioning the imputer alongside the model to prevent train-serve skew.',
    followUpQuestions: [
      'How do you handle missing values in time series data?',
      'What happens if the missing data pattern in production differs from training?',
    ],
  },
  {
    id: 'ml-06',
    topic: 'Model Interpretability',
    difficulty: 'Medium',
    tags: ['SHAP', 'LIME', 'interpretability', 'explainability'],
    question:
      'What is SHAP and how does it improve model interpretability? How do SHAP values relate to cooperative game theory?',
    expectedAnswer:
      'SHAP (SHapley Additive exPlanations) assigns each feature a value representing its marginal contribution to a specific prediction, grounded in Shapley values from cooperative game theory. The Shapley value for feature i is the average marginal contribution of feature i across all possible orderings (coalitions) of features. It satisfies: Efficiency (contributions sum to prediction − base value), Symmetry (equal-contribution features get equal values), Dummy (zero-contribution features get zero), and Additivity. TreeSHAP computes exact Shapley values for tree-based models in O(TLD²) time (T trees, L leaves, D depth). SHAP is superior to LIME (local linear approximations, unstable) and permutation importance (misleading with correlated features) because it is theoretically consistent and locally faithful. In production, I use SHAP for: debugging model failures, regulatory explanations (GDPR Article 22), feature audit, and detecting spurious correlations that inflate test accuracy.',
    followUpQuestions: [
      'What are the computational limitations of SHAP for deep learning models?',
      'How do you explain a model prediction to a business stakeholder using SHAP?',
    ],
  },
  {
    id: 'ml-07',
    topic: 'Data Drift',
    difficulty: 'Hard',
    tags: ['data-drift', 'concept-drift', 'monitoring', 'production-ml'],
    question:
      'How would you detect and handle data drift in a production ML model?',
    expectedAnswer:
      'I distinguish three types: data drift (input distribution P(X) changes), concept drift (relationship P(Y|X) changes), and label drift (output distribution changes). Detection: (1) Statistical tests on input features—Population Stability Index (PSI > 0.2 = significant drift), Kolmogorov-Smirnov test, or Jensen-Shannon divergence; (2) Model monitoring—track prediction distribution, confidence scores, and performance metrics (with delayed labels); (3) Embedding drift for high-dimensional inputs—monitor centroid distance or covariance shift. Handling: (1) Retrain on recent data (sliding window); (2) Continual learning with catastrophic forgetting prevention; (3) Domain adaptation techniques; (4) Ensemble with a drift-specific model for the new distribution. In practice, I build a monitoring pipeline (Evidently AI, Arize, WhyLabs) and set automated retraining triggers when PSI exceeds threshold. The hardest part is delayed labels—you often cannot detect concept drift until days later.',
    followUpQuestions: [
      'How do you handle drift when labels arrive with a 7-day delay?',
      'What is the difference between sudden, gradual, and recurring drift?',
      'How do you set alerting thresholds for drift in production?',
    ],
  },
  {
    id: 'ml-08',
    topic: 'Evaluation Metrics',
    difficulty: 'Easy',
    tags: ['precision', 'recall', 'F1', 'AUROC', 'business-metrics'],
    question:
      'Explain precision, recall, and F1. In what business scenarios would you prioritize each?',
    expectedAnswer:
      'Precision = TP/(TP+FP): of all positive predictions, how many are actually positive. Recall = TP/(TP+FN): of all actual positives, how many did we find. F1 = harmonic mean of precision and recall. Prioritize recall when the cost of a false negative is high: cancer screening (missing a cancer is worse than a false alarm), fraud detection (missing fraud costs more than investigating a false positive), security threat detection. Prioritize precision when false positives are costly: spam filtering (legitimate email in spam folder is unacceptable), recommendation systems (poor recommendations damage user trust), content moderation with human review queues. F1 when both matter equally. In practice, I never optimize for a single threshold-dependent metric—I use PR-AUC to compare models, then tune the threshold post-training to match the specific business cost matrix.',
    followUpQuestions: [
      'What is the difference between micro, macro, and weighted averaging for multiclass F1?',
      'When would you use Matthews Correlation Coefficient over F1?',
    ],
  },
  {
    id: 'ml-09',
    topic: 'Hyperparameter Optimization',
    difficulty: 'Medium',
    tags: ['hyperparameter-tuning', 'Optuna', 'Bayesian-optimization', 'AutoML'],
    question:
      'How do you approach hyperparameter tuning at scale? Walk me through your tooling and strategy.',
    expectedAnswer:
      'My approach: (1) Manual baseline first—understand which hyperparameters matter most (learning rate is usually #1 for deep learning; tree depth and n_estimators for XGBoost); (2) Grid search only for 2-3 hyperparameters with small ranges—otherwise exponential cost; (3) Random search is 2x more efficient than grid search for high-dimensional spaces (Bergstra & Bengio 2012); (4) Bayesian optimization via Optuna or Hyperopt for expensive models—uses a surrogate model (TPE in Optuna) to guide search toward promising regions; (5) Successive Halving (HyperBand, Optuna\'s CmaEsSampler) for early stopping of poor configurations. In production: parallelize across multiple GPUs/CPUs, use a persistent study database (Optuna + PostgreSQL), and always perform HPO inside cross-validation to avoid selecting hyperparameters that overfit the validation split. For LLM fine-tuning, the most impactful hyperparameters are learning rate, warmup steps, and batch size.',
    followUpQuestions: [
      'What is the difference between Bayesian optimization and random search theoretically?',
      'How does ASHA (Asynchronous Successive Halving Algorithm) improve on HyperBand?',
    ],
  },
  {
    id: 'ml-10',
    topic: 'Online vs Offline Learning',
    difficulty: 'Medium',
    tags: ['online-learning', 'streaming', 'batch-learning', 'continual-learning'],
    question:
      'What is the difference between online and offline learning? When would you use each in a production system?',
    expectedAnswer:
      'Offline (batch) learning trains a model on a fixed dataset, deploys it, and retrains periodically when performance degrades. It is simpler, more reproducible, and allows full cross-validation. Online learning updates the model incrementally with each new example (or mini-batch), making it suitable for non-stationary environments where the data distribution evolves continuously. Use online learning for: real-time personalization (news feed ranking), fraud detection with rapidly evolving fraud patterns, financial time series with heavy non-stationarity. Challenges of online learning: catastrophic forgetting, hyperparameter stability over time, difficulty reproducing model state for debugging. In practice, I use a hybrid: a strong offline base model retrained weekly, with an online component (e.g., factorization machine or embedding update) that adapts in real time. For LLMs, this maps to: periodic fine-tuning + retrieval-augmented grounding for fresh information.',
    followUpQuestions: [
      'How do you prevent catastrophic forgetting in continual learning?',
      'What algorithms are specifically designed for online learning (Perceptron, Passive-Aggressive)?',
    ],
  },
  {
    id: 'ml-11',
    topic: 'Recommendation Systems',
    difficulty: 'Hard',
    tags: ['recommendation', 'collaborative-filtering', 'matrix-factorization', 'two-tower'],
    question:
      'How would you build a recommendation system from scratch for a platform with 10M users and 1M items?',
    expectedAnswer:
      'I would build a two-stage system: (1) Candidate Generation: use a two-tower model (user embedding tower + item embedding tower, trained with contrastive loss on click/purchase data) to produce a 128-dim embedding per user and item. Index item embeddings in FAISS for ANN retrieval—retrieve top-500 candidates per user in <10ms. For cold-start users: use item-based collaborative filtering from session history. (2) Ranking: train a DCN (Deep & Cross Network) or gradient boosted model on the 500 candidates with rich features: user demographics, item metadata, contextual features (time of day, device), and interaction history (last viewed, dwell time). Optimize for a multi-objective reward (clicks + purchase + dwell time). (3) Post-ranking: diversity and freshness constraints, business rules (promoted items, safety filtering). Training: negative sampling is critical—mix random negatives with hard in-batch negatives. Evaluation: offline (NDCG@10, MRR, coverage) and online A/B test (CTR, revenue lift).',
    followUpQuestions: [
      'How do you handle the cold-start problem for new users and new items?',
      'How do you debias recommendations from popularity bias?',
      'How do you implement real-time feature computation for ranking?',
    ],
  },
  {
    id: 'ml-12',
    topic: 'Dimensionality Reduction',
    difficulty: 'Medium',
    tags: ['PCA', 'UMAP', 't-SNE', 'dimensionality-reduction'],
    question:
      'Compare PCA, t-SNE, and UMAP. When would you use each?',
    expectedAnswer:
      'PCA is a linear method that finds orthogonal directions of maximum variance. It is deterministic, fast (O(nd²)), invertible, and preserves global structure. Use for: preprocessing (remove correlated features), decorrelating inputs, speeding up downstream algorithms. t-SNE is a nonlinear, probabilistic method that minimizes KL divergence between pairwise similarities in high-dim and low-dim space—preserves local neighborhoods beautifully but distorts global structure, is O(n²) and non-parametric (cannot generalize to new points), and has hyperparameter-sensitive results (perplexity). Use only for visualization, never as features. UMAP is a manifold learning method based on Riemannian geometry—faster than t-SNE (O(n log n)), preserves both local and global structure better, is parametric (can transform new points), and produces embeddings that are actually useful as features. I use UMAP for: feature engineering from image/text embeddings, visualization, and clustering preprocessing. In 2024, UMAP has largely replaced t-SNE for production use.',
    followUpQuestions: [
      'What is the mathematical intuition behind t-SNE\'s crowding problem?',
      'How would you use PCA to speed up a neural network\'s input layer?',
    ],
  },
  {
    id: 'ml-13',
    topic: 'Time Series Validation',
    difficulty: 'Hard',
    tags: ['time-series', 'validation', 'temporal-split', 'forecasting'],
    question:
      'How do you validate a time series ML model? What are the pitfalls of standard cross-validation?',
    expectedAnswer:
      'Standard k-fold cross-validation violates temporal order—training on future data to predict the past creates data leakage and produces optimistically biased estimates. Time series validation strategies: (1) Walk-forward (expanding window): train on [t0..t1], validate on [t1..t2], expand and repeat—mimics production deployment; (2) Sliding window: fixed-size training window slides forward—appropriate when older data is irrelevant (concept drift); (3) Blocked CV: gaps between train and validation folds prevent autocorrelation leakage. Feature engineering pitfalls: computing rolling statistics must use only data available at prediction time (no future leakage in rolling mean); target encoding must be computed from the training window only. Evaluation: use metrics appropriate to the forecast horizon and business (MAPE, SMAPE for percentage errors; MASE for scale-independent comparison across series). For multi-step forecasting, measure at each horizon step separately rather than aggregating.',
    followUpQuestions: [
      'How do you handle seasonality in time series feature engineering?',
      'What is the difference between direct multi-step and recursive multi-step forecasting?',
    ],
  },
  {
    id: 'ml-14',
    topic: 'Clustering Evaluation',
    difficulty: 'Medium',
    tags: ['clustering', 'k-means', 'evaluation', 'silhouette'],
    question:
      'What metrics would you use to evaluate a clustering algorithm, and what are the limitations of each?',
    expectedAnswer:
      'Internal metrics (no ground truth needed): (1) Silhouette score: measures how similar a point is to its own cluster vs. nearest cluster (-1 to 1, higher is better)—penalizes poorly separated clusters but favors convex clusters, misleading for non-convex shapes; (2) Davies-Bouldin index: ratio of within-cluster scatter to between-cluster separation (lower is better)—assumes convex clusters; (3) Elbow method / inertia (k-means): plot within-cluster sum of squares vs. k, pick the "elbow"—subjective and only meaningful for k-means. External metrics (with ground truth): (4) Adjusted Rand Index: measures agreement between predicted and true labels adjusted for chance; (5) Normalized Mutual Information: information-theoretic agreement. In practice, I triangulate: use silhouette + visual inspection via UMAP, business validation (do the clusters correspond to meaningful customer segments?), and stability analysis (re-run with different seeds—unstable clusters indicate poor structure).',
    followUpQuestions: [
      'How do you choose the number of clusters in practice?',
      'What clustering algorithms work well for high-dimensional, non-convex data?',
    ],
  },
  {
    id: 'ml-15',
    topic: 'MLOps & Production',
    difficulty: 'Hard',
    tags: ['MLOps', 'model-deployment', 'CI/CD', 'feature-store'],
    question:
      'What does a mature MLOps pipeline look like? Walk me through the components you would build for an enterprise ML system.',
    expectedAnswer:
      'A mature MLOps pipeline has: (1) Data layer: feature store (Feast, Tecton) for consistent train/serve features—eliminates the #1 source of train-serve skew; data versioning (DVC, Delta Lake); (2) Training layer: experiment tracking (MLflow, W&B) for reproducibility; hyperparameter optimization; distributed training orchestration (Ray, Kubeflow); (3) Model registry: versioned model artifacts with metadata, lineage, and approval workflows; (4) Deployment: A/B testing framework with shadow mode rollout, canary deployment, automatic rollback triggers; model serving (Triton, TorchServe, vLLM for LLMs) with SLO monitoring; (5) Monitoring: data drift detection, model performance tracking, alerting pipelines; (6) Governance: model cards, fairness audits, compliance logging. The key insight from 5 years of experience: invest heavily in the feature store and monitoring—most production failures are not model quality issues but data pipeline and drift issues.',
    followUpQuestions: [
      'How do you handle model versioning when the feature schema changes?',
      'What are the tradeoffs between real-time and batch feature computation?',
    ],
  },
]
