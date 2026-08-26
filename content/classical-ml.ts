import type { Lesson, Section } from "@/lib/content";

type LessonSpec = {
  slug: string;
  title: string;
  subtitle: string;
  minutes: number;
  tags: string[];
  problem: string;
  intuition: string;
  math: string;
  scratch: string;
  sklearn: string;
  experiment: string;
  mistake: string;
  quiz: string;
  options: string[];
  correct: number;
  explanation: string;
  next: string;
};

const specs: LessonSpec[] = [
  {
    slug: "ml-workflow-train-test-baseline", title: "The ML Workflow: Data, Splits, and Baselines",
    subtitle: "Build a trustworthy experiment before choosing a clever model.", minutes: 18,
    tags: ["Workflow", "Train/test split", "Baseline", "scikit-learn"],
    problem: "A model can look excellent in a notebook and fail on new customers. The usual cause is evaluating it on data it has already seen, directly or indirectly.",
    intuition: "Treat the test set as a sealed final exam. You learn patterns from training data, make choices using validation data, and open the test set once for an honest final score.",
    math: "For a regression baseline, predict the training-set mean y-hat = mean(y_train). Its MAE is the average absolute residual: (1/n) sum |y - y-hat|.",
    scratch: "import numpy as np\ny = np.array([120, 150, 130, 180])\nbaseline = y[:3].mean()\nmae = np.abs(y[3:] - baseline).mean()\nprint(baseline, mae)",
    sklearn: "from sklearn.model_selection import train_test_split\nfrom sklearn.dummy import DummyRegressor\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nmodel = DummyRegressor(strategy=\"mean\").fit(X_train, y_train)\nprint(model.score(X_test, y_test))",
    experiment: "Train a baseline, then a simple model, and record both scores in a table. If the model does not beat the baseline, investigate data and features before tuning.",
    mistake: "Fitting a scaler, imputer, or feature selector on the full dataset leaks information from the test rows. Put preprocessing inside a Pipeline so it is fit only on training folds.",
    quiz: "Why is a test set kept separate until the end?", options: ["It provides an unbiased estimate of performance on unseen data.", "It makes training faster.", "It contains only the hardest rows.", "It removes missing values."], correct: 0,
    explanation: "Every decision informed by test performance slightly overfits to that test set. A sealed test set is your closest simulation of future data.",
    next: "With a reliable experiment loop, start with the most useful tabular baseline: linear regression.",
  },
  {
    slug: "linear-polynomial-regression", title: "Linear and Polynomial Regression",
    subtitle: "Predict a number, understand residuals, and know when a line is enough.", minutes: 24,
    tags: ["Regression", "Linear regression", "Regularization", "MAE"],
    problem: "Estimate a continuous value such as house price, delivery time, demand, or energy use from known features.",
    intuition: "Linear regression assigns each feature a weight. A square metre may add value, while distance from a station may subtract value. The prediction is their weighted sum plus an intercept.",
    math: "The model is y-hat = Xw + b. Ordinary least squares chooses w and b that minimize MSE = (1/n) sum (y - y-hat)^2. Ridge adds lambda times the squared size of w to discourage unstable weights.",
    scratch: "import numpy as np\nX = np.c_[np.ones(len(x)), x]  # intercept column\nw = np.linalg.pinv(X.T @ X) @ X.T @ y\npredictions = X @ w\nprint(w)",
    sklearn: "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.linear_model import Ridge\n\nmodel = make_pipeline(PolynomialFeatures(degree=2), Ridge(alpha=1.0))\nmodel.fit(X_train, y_train)\nprint(model.predict(X_test[:3]))",
    experiment: "Compare degree 1, 2, and 5 polynomials with cross-validation. Watch training error fall as degree rises; choose the degree with the best validation error, not the lowest training error.",
    mistake: "Do not report only R-squared. A high R-squared can still mean unacceptable dollar or hour errors. Report MAE or RMSE in the target's real units too.",
    quiz: "What does Ridge regularization primarily discourage?", options: ["Very large coefficients that can make predictions unstable.", "Any use of multiple features.", "All prediction error on training data.", "A non-zero intercept."], correct: 0,
    explanation: "Ridge penalizes large weights. It trades a small amount of bias for lower variance, particularly when features are correlated.",
    next: "Many business questions are yes/no rather than numeric. Logistic regression handles those probabilities.",
  },
  {
    slug: "logistic-regression-classification", title: "Logistic Regression and Classification",
    subtitle: "Turn features into calibrated probabilities and useful decisions.", minutes: 24,
    tags: ["Classification", "Logistic regression", "Probability", "Thresholds"],
    problem: "Classify events: will a customer churn, is a transaction fraudulent, or is a medical result positive? The output should communicate uncertainty, not just a label.",
    intuition: "A linear score can range from negative infinity to infinity. The sigmoid squashes it into a number between 0 and 1, which we interpret as a probability.",
    math: "p(y=1|x) = 1 / (1 + exp(-(w dot x + b))). Binary cross-entropy is -mean[y log p + (1-y) log(1-p)]. A threshold converts p into a class label.",
    scratch: "import numpy as np\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))\np = sigmoid(np.array([-2.0, 0.0, 2.0]))\nprint(p)  # about .12, .50, .88",
    sklearn: "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nmodel = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000, class_weight=\"balanced\"))\nmodel.fit(X_train, y_train)\nprobability = model.predict_proba(X_test)[:, 1]",
    experiment: "Sweep thresholds from 0.05 to 0.95. Select one based on the cost of false positives versus false negatives, then document that business decision.",
    mistake: "Accuracy is misleading for rare events. A fraud model that predicts 'not fraud' for every transaction can be 99% accurate and completely useless.",
    quiz: "Changing the classification threshold from 0.5 to 0.2 usually does what?", options: ["Increases predicted positives and recall, often reducing precision.", "Makes the model retrain itself.", "Changes every learned coefficient.", "Always improves ROC-AUC."], correct: 0,
    explanation: "The underlying scores do not change; only the decision rule changes. A lower threshold catches more positives but also creates more false alarms.",
    next: "Next, learn the metrics and validation methods that tell you whether this trade-off is good.",
  },
  {
    slug: "evaluation-cross-validation", title: "Evaluation, Cross-Validation, and Model Selection",
    subtitle: "Measure the right failure mode before optimizing it.", minutes: 26,
    tags: ["Metrics", "Cross-validation", "ROC-AUC", "Imbalanced data"],
    problem: "A single train/test split is noisy, and one metric rarely represents the harm a model can cause. You need repeatable comparisons tied to the actual task.",
    intuition: "Cross-validation rotates which slice of data plays examiner. It lets every training example contribute to both learning and validation, producing a distribution of scores instead of one lucky number.",
    math: "Precision = TP/(TP+FP); recall = TP/(TP+FN); F1 is 2PR/(P+R). ROC-AUC measures ranking across all thresholds. For regression, MAE weights errors linearly while RMSE penalizes large errors more heavily.",
    scratch: "tp, fp, fn = 32, 8, 10\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nf1 = 2 * precision * recall / (precision + recall)\nprint(precision, recall, f1)",
    sklearn: "from sklearn.model_selection import StratifiedKFold, cross_validate\nfrom sklearn.metrics import make_scorer, f1_score\n\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nscores = cross_validate(model, X, y, cv=cv, scoring=[\"roc_auc\", \"f1\"])\nprint(scores[\"test_roc_auc\"].mean())",
    experiment: "Compare three models with the same folds and report mean plus standard deviation. Prefer a robust improvement, not a tenth of a point that is within fold-to-fold noise.",
    mistake: "Use StratifiedKFold for imbalanced classification; otherwise a fold may accidentally contain too few positive cases. For time series, split by time instead of shuffling.",
    quiz: "Which metric is most appropriate when missing a positive case is very costly?", options: ["Recall, alongside a precision/cost constraint.", "Training accuracy only.", "R-squared.", "Number of model parameters."], correct: 0,
    explanation: "Recall directly measures the fraction of actual positives found. You still track precision because indiscriminately flagging everything is not useful.",
    next: "Decision trees offer a different kind of model: rules that split a dataset into increasingly focused groups.",
  },
  {
    slug: "decision-trees", title: "Decision Trees: Learning Useful Rules",
    subtitle: "Split data into readable decisions without assuming a straight line.", minutes: 24,
    tags: ["Decision trees", "Gini impurity", "Interpretability", "Overfitting"],
    problem: "Linear boundaries miss interactions such as 'high income AND short tenure.' Trees discover conditional rules and handle nonlinear relationships naturally.",
    intuition: "At each node, a tree asks the question that makes child groups most pure. It keeps splitting until stopping rules say that another rule is not worth the complexity.",
    math: "For classification, Gini impurity is 1 - sum(p_k^2). A split is chosen for its weighted impurity decrease. For regression, trees commonly minimize squared error within each leaf.",
    scratch: "def gini(labels):\n    _, counts = np.unique(labels, return_counts=True)\n    p = counts / counts.sum()\n    return 1 - np.sum(p ** 2)\n\nprint(gini(np.array([0, 0, 1, 1])))",
    sklearn: "from sklearn.tree import DecisionTreeClassifier, export_text\n\ntree = DecisionTreeClassifier(max_depth=4, min_samples_leaf=20, random_state=42)\ntree.fit(X_train, y_train)\nprint(export_text(tree, feature_names=list(X_train.columns)))",
    experiment: "Plot training and validation score as max_depth grows. A deep tree often reaches perfect training accuracy while validation performance falls: textbook overfitting.",
    mistake: "Raw tree feature importance can favor high-cardinality columns (such as an ID). Validate any story with permutation importance and domain knowledge.",
    quiz: "What is the usual effect of increasing max_depth?", options: ["Lower bias but higher risk of variance and overfitting.", "It guarantees better test performance.", "It removes the need for validation.", "It makes a tree linear."], correct: 0,
    explanation: "Deeper trees can represent more patterns, including noise. Depth, minimum leaf size, and pruning are regularization controls.",
    next: "One tree is easy to explain but unstable. Ensembles combine many trees for stronger predictions.",
  },
  {
    slug: "random-forests-gradient-boosting", title: "Random Forests and Gradient Boosting",
    subtitle: "Combine weak, diverse trees into powerful tabular models.", minutes: 28,
    tags: ["Random forest", "Gradient boosting", "XGBoost", "LightGBM"],
    problem: "A decision tree changes drastically when the training data changes a little. Ensemble methods reduce that instability or iteratively correct errors.",
    intuition: "A random forest asks many independently randomized trees to vote. Gradient boosting trains small trees in sequence, each concentrating on the residual mistakes left by the current ensemble.",
    math: "A forest averages M trees: y-hat = (1/M) sum T_m(x). A boosted model adds learners: F_m(x) = F_(m-1)(x) + eta h_m(x), where eta is the learning rate.",
    scratch: "# A simple residual-boosting idea\npred = np.full_like(y, y.mean(), dtype=float)\nresidual = y - pred\n# fit the next weak learner to residual, then add a small step\n# pred += learning_rate * weak_learner.predict(X)",
    sklearn: "from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier\n\nforest = RandomForestClassifier(n_estimators=400, min_samples_leaf=5, n_jobs=-1, random_state=42)\nboosted = HistGradientBoostingClassifier(learning_rate=0.05, max_leaf_nodes=15, random_state=42)\nforest.fit(X_train, y_train)\nboosted.fit(X_train, y_train)",
    experiment: "Tune one control at a time: first number of trees, then leaf size/depth, then learning rate. Compare cross-validation scores and fit time, not only the best score.",
    mistake: "Boosting can overfit when trees are too deep or the learning rate is too high. More estimators is safe only when paired with a small learning rate and validation monitoring.",
    quiz: "What is the key difference between random forests and gradient boosting?", options: ["Forests train randomized trees independently; boosting trains trees sequentially to reduce prior errors.", "Forests only work for regression.", "Boosting has no hyperparameters.", "They use exactly the same training procedure."], correct: 0,
    explanation: "Bagging (forests) reduces variance through averaging. Boosting reduces bias by adding corrective learners, but must be regularized carefully.",
    next: "Great models still need good inputs. Next: disciplined feature engineering and preprocessing.",
  },
  {
    slug: "feature-engineering-pipelines", title: "Feature Engineering and Reproducible Pipelines",
    subtitle: "Transform messy tables into model-ready features without data leakage.", minutes: 28,
    tags: ["Features", "Pipelines", "Encoding", "Imputation"],
    problem: "Real tables contain missing values, categories, skewed numbers, timestamps, and accidental identifiers. The data representation often matters more than swapping algorithms.",
    intuition: "A pipeline is a production assembly line: each column receives the appropriate transformation, then the estimator sees the finished feature matrix. The same line runs in training and inference.",
    math: "Standardization maps x to (x - mean)/standard deviation. One-hot encoding maps a category to indicator columns. Fit each transformation only on training data so its learned statistics cannot leak future information.",
    scratch: "import numpy as np\nx = np.array([10., 12., 18.])\nz = (x - x.mean()) / x.std()\nprint(z)\n# Train mean/std must be reused when transforming test rows.",
    sklearn: "from sklearn.compose import ColumnTransformer\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import OneHotEncoder, StandardScaler\nfrom sklearn.pipeline import Pipeline\n\npreprocess = ColumnTransformer([(\"num\", Pipeline([(\"impute\", SimpleImputer(strategy=\"median\")), (\"scale\", StandardScaler())]), numeric_cols), (\"cat\", Pipeline([(\"impute\", SimpleImputer(strategy=\"most_frequent\")), (\"onehot\", OneHotEncoder(handle_unknown=\"ignore\"))]), categorical_cols)])\nmodel = Pipeline([(\"prep\", preprocess), (\"model\", LogisticRegression(max_iter=1000))])",
    experiment: "Add one feature hypothesis at a time: a rate, a log transform, a date part, or an interaction. Keep it only if cross-validation improves and the feature is available at prediction time.",
    mistake: "Never use a post-outcome field. For churn, a 'cancellation date' is perfect leakage: it is known only after the customer already churned.",
    quiz: "Why use OneHotEncoder(handle_unknown='ignore') in a deployed pipeline?", options: ["A new category at prediction time will not crash the model.", "It makes categories continuous.", "It prevents all overfitting.", "It automatically removes IDs."], correct: 0,
    explanation: "Production always produces surprises. Ignoring an unseen category maps it to all-zero indicator columns rather than failing the request.",
    next: "When labels are unavailable, clustering helps find structure and useful groups in the data.",
  },
  {
    slug: "clustering-unsupervised-learning", title: "Clustering: Finding Structure Without Labels",
    subtitle: "Group customers or observations responsibly when no answer column exists.", minutes: 24,
    tags: ["K-Means", "DBSCAN", "Clustering", "Unsupervised learning"],
    problem: "You may have thousands of customers but no pre-labelled segments. Clustering proposes groups that can guide investigation, personalisation, or anomaly review.",
    intuition: "K-Means alternates two actions: assign every point to its nearest centre, then move each centre to the mean of its assigned points. DBSCAN instead finds dense regions and labels sparse points as noise.",
    math: "K-Means minimizes inertia: sum over points of squared distance to their assigned centroid. Because distance drives the result, scaling numerical features is essential.",
    scratch: "centroids = X[[0, 3]].astype(float)\ndistances = ((X[:, None, :] - centroids[None, :, :]) ** 2).sum(axis=2)\nlabels = distances.argmin(axis=1)\ncentroids = np.vstack([X[labels == k].mean(axis=0) for k in range(2)])",
    sklearn: "from sklearn.cluster import KMeans, DBSCAN\nfrom sklearn.preprocessing import StandardScaler\n\nX_scaled = StandardScaler().fit_transform(X)\nkmeans = KMeans(n_clusters=4, n_init=20, random_state=42).fit(X_scaled)\ndbscan = DBSCAN(eps=0.5, min_samples=10).fit(X_scaled)",
    experiment: "Try several K values and inspect both silhouette score and cluster profiles: median spend, frequency, region, and size. A mathematically neat cluster with no actionable interpretation is not a useful segment.",
    mistake: "Clusters are hypotheses, not ground truth. Names like 'premium loyalists' should follow a profile review, not be inferred from a colored scatter plot alone.",
    quiz: "Why is scaling important before K-Means?", options: ["Large-unit features can dominate Euclidean distance.", "K-Means requires labels.", "Scaling chooses K automatically.", "It guarantees spherical real-world groups."], correct: 0,
    explanation: "A feature measured in thousands, such as income, can overwhelm a feature measured from 0 to 10, such as visits, even if both are equally meaningful.",
    next: "PCA makes high-dimensional data easier to inspect, compress, and model.",
  },
  {
    slug: "pca-dimensionality-reduction", title: "PCA and Dimensionality Reduction",
    subtitle: "Compress correlated features while preserving the variation that matters.", minutes: 24,
    tags: ["PCA", "Dimensionality reduction", "Visualization", "Variance"],
    problem: "Wide datasets can be slow, noisy, and impossible to visualize. Many columns are correlated views of the same underlying signal.",
    intuition: "PCA rotates the coordinate system so its first axis follows the direction of greatest variation. The next axis captures the most remaining variation while staying perpendicular to the first.",
    math: "After centering X, PCA finds eigenvectors of its covariance matrix. The explained variance ratio for a component is its eigenvalue divided by the sum of all eigenvalues.",
    scratch: "X_centered = X - X.mean(axis=0)\ncov = np.cov(X_centered, rowvar=False)\neigenvalues, eigenvectors = np.linalg.eigh(cov)\nfirst_component = eigenvectors[:, np.argmax(eigenvalues)]\nprojected = X_centered @ first_component",
    sklearn: "from sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\n\nX_scaled = StandardScaler().fit_transform(X)\npca = PCA(n_components=0.95, random_state=42)\nX_small = pca.fit_transform(X_scaled)\nprint(pca.n_components_, pca.explained_variance_ratio_.sum())",
    experiment: "Fit PCA inside a cross-validation pipeline, comparing model performance with and without it. PCA may reduce noise, but it can also discard small-variance features with strong predictive value.",
    mistake: "Do not use PCA solely because a 2D plot looks separated. Visual separation does not prove that the projected space improves downstream decisions.",
    quiz: "What does n_components=0.95 ask PCA to do in scikit-learn?", options: ["Keep the fewest components explaining at least 95% of variance.", "Create exactly 95 components.", "Reach 95% classification accuracy.", "Discard 95% of the rows."], correct: 0,
    explanation: "The value is a retained-variance target. The resulting number of components depends on the dataset.",
    next: "Finish the track by applying the whole workflow to a production-shaped churn prediction project.",
  },
  {
    slug: "customer-churn-capstone", title: "Capstone: Customer Churn Predictor",
    subtitle: "Frame, train, evaluate, explain, and package a model that a team can use.", minutes: 32,
    tags: ["Capstone", "Churn", "Model comparison", "Explainability"],
    problem: "A retention team needs a ranked list of customers likely to leave soon, with enough explanation to decide whether an intervention is worthwhile.",
    intuition: "The capstone is not 'find the highest score.' It is an evidence trail: define the prediction moment, prevent leakage, compare baselines, select a threshold with the business, and save one reproducible pipeline.",
    math: "Expected value can guide threshold choice: value = TP * retained_value - FP * offer_cost - FN * missed_value. Optimize this on validation data, then report final results on the untouched test set.",
    scratch: "# Treat model selection as a scorecard, not a single number\nresults = {\n    \"baseline\": {\"recall\": 0.00, \"precision\": 0.00},\n    \"logistic\": {\"recall\": 0.71, \"precision\": 0.42},\n    \"boosted\": {\"recall\": 0.76, \"precision\": 0.48},\n}\nprint(results)",
    sklearn: "from sklearn.inspection import permutation_importance\nimport joblib\n\nfinal_model.fit(X_train, y_train)\nimportance = permutation_importance(final_model, X_valid, y_valid, scoring=\"roc_auc\", n_repeats=10, random_state=42)\njoblib.dump(final_model, \"churn_pipeline.joblib\")\n# Reload the same pipeline for batch or API inference.",
    experiment: "Create a short model card: target definition, prediction timestamp, data range, split strategy, metrics, threshold, top limitations, and monitoring plan. This is part of shipping the model.",
    mistake: "Do not deploy a model without a feedback loop. Track feature drift, prediction rates, real churn outcomes, and whether retention actions actually changed customer behavior.",
    quiz: "What is the best artifact to save for inference?", options: ["The complete fitted preprocessing-and-model Pipeline.", "Only a CSV of predictions.", "Only the classifier coefficients.", "The training test set."], correct: 0,
    explanation: "A complete pipeline preserves imputers, encoders, scalers, feature order, and the model together. Saving only the estimator commonly causes training-serving skew.",
    next: "You can now build credible tabular ML systems. The next track, ML From Scratch, opens these algorithms so none of them feel like a black box.",
  },
];

function sections(spec: LessonSpec): Section[] {
  return [
    { step: 1, title: "The problem", blocks: [{ type: "text", content: spec.problem }] },
    { step: 2, title: "The intuition", blocks: [{ type: "text", content: spec.intuition }, { type: "callout", kind: "insight", content: "Start with a simple, measurable baseline. A complex model is useful only when it delivers a reliable improvement on future-like data." }] },
    { step: 3, title: "The core mathematics", blocks: [{ type: "text", content: spec.math }] },
    { step: 4, title: "Build the key idea from scratch", blocks: [{ type: "code", language: "python", label: "A small NumPy implementation", code: spec.scratch }] },
    { step: 5, title: "Use scikit-learn", blocks: [{ type: "code", language: "python", label: "Production-shaped starting point", code: spec.sklearn }, { type: "callout", kind: "tip", title: "Reproducibility", content: "Set random_state whenever an estimator or split is stochastic. It makes experiments comparable and bugs repeatable." }] },
    { step: 6, title: "Run an experiment", blocks: [{ type: "text", content: spec.experiment }] },
    { step: 7, title: "Inspect the output", blocks: [{ type: "list", items: ["Compare against a naive baseline.", "Inspect errors, not just one aggregate score.", "Check whether performance changes across important groups.", "Write down the data version, split, metrics, and assumptions."], style: "bullet" }] },
    { step: 8, title: "Common mistake", blocks: [{ type: "callout", kind: "gotcha", content: spec.mistake }] },
    { step: 9, title: "Mini challenge", blocks: [{ type: "text", content: "Change one assumption, rerun the same evaluation, and explain the difference. Examples: alter a threshold, remove a feature family, or change regularization. Keep a short experiment log." }] },
    { step: 10, title: "Test yourself", blocks: [{ type: "quiz", question: spec.quiz, options: spec.options, correct: spec.correct, explanation: spec.explanation }] },
    { step: 11, title: "What is next", blocks: [{ type: "text", content: spec.next }] },
  ];
}

export const classicalMlLessons: Lesson[] = specs.map((spec, index) => ({
  slug: spec.slug,
  trackSlug: "classical-ml",
  order: index + 1,
  minutes: spec.minutes,
  title: spec.title,
  subtitle: spec.subtitle,
  tags: spec.tags,
  sections: sections(spec),
}));
