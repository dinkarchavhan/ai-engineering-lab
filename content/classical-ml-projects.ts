import type { ProjectGuide } from "@/lib/content";

export const classicalMlProjects: ProjectGuide[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // Project 1 — Customer Churn Predictor
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: "customer-churn-predictor",
    trackSlug: "classical-ml",
    title: "Customer Churn Predictor",
    description:
      "Predict which telecom customers are about to cancel using logistic regression, random forest, and gradient boosting — then replicate it with a TensorFlow binary classification network. Uses the real Telco Customer Churn dataset from Kaggle.",
    techStack: ["Python", "scikit-learn", "XGBoost", "TensorFlow", "Pandas", "Matplotlib", "Kaggle API"],
    difficulty: "beginner",
    estimatedHours: 4,
    sections: [
      {
        step: 1,
        title: "What you're building",
        blocks: [
          {
            type: "text",
            content:
              "A binary classifier that predicts **churn** (will a customer cancel in the next month?). This is one of the most common business ML problems — retaining a customer costs 5–25× less than acquiring a new one, so even a modest improvement in prediction accuracy has direct revenue impact.",
          },
          {
            type: "diagram",
            chart: `graph LR
    K[Kaggle: Telco Churn CSV] --> EDA[EDA & cleaning]
    EDA --> FE[Feature engineering]
    FE --> SK[scikit-learn models\nLogReg · RF · GBM]
    FE --> TF[TensorFlow model\nDense network]
    SK --> E[Evaluate: ROC-AUC\nPrecision · Recall · F1]
    TF --> E
    E --> I[SHAP feature importance]
    style K fill:#20beff,color:#000
    style TF fill:#ff6f00,color:#fff
    style SK fill:#10b981,color:#fff`,
            label: "End-to-end pipeline",
          },
          {
            type: "kv",
            items: [
              { key: "Dataset", value: "IBM Telco Customer Churn — 7,043 customers, 21 features (tenure, charges, contract type, services)" },
              { key: "Target", value: "Churn: Yes / No (binary classification)" },
              { key: "Key metric", value: "ROC-AUC (handles class imbalance better than accuracy)" },
              { key: "Kaggle link", value: "kaggle.com/datasets/blastchar/telco-customer-churn" },
            ],
          },
        ],
      },
      {
        step: 2,
        title: "Get the dataset",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Option A — Kaggle API (recommended)",
            code: `pip install kaggle

# Put your kaggle.json in ~/.kaggle/ (download from kaggle.com → Account → API)
mkdir -p ~/.kaggle
mv ~/Downloads/kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json

kaggle datasets download -d blastchar/telco-customer-churn
unzip telco-customer-churn.zip`,
          },
          {
            type: "code",
            language: "bash",
            label: "Option B — direct download link",
            code: `# Download WA_Fn-UseC_-Telco-Customer-Churn.csv from:
# https://www.kaggle.com/datasets/blastchar/telco-customer-churn
# (free account required — click the Download button)`,
          },
          {
            type: "callout",
            kind: "tip",
            title: "Alternative: load without Kaggle",
            content: "IBM also hosts this dataset on their GitHub. You can load it directly:\n\n`import pandas as pd`\n`url = 'https://raw.githubusercontent.com/IBM/telco-customer-churn-on-icp4d/master/data/Telco-Customer-Churn.csv'`\n`df = pd.read_csv(url)`",
          },
        ],
      },
      {
        step: 3,
        title: "EDA and preprocessing",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Load and inspect",
            code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore")

df = pd.read_csv("WA_Fn-UseC_-Telco-Customer-Churn.csv")
print(df.shape)          # (7043, 21)
print(df["Churn"].value_counts(normalize=True))
# No     0.7347
# Yes    0.2653  ← moderate class imbalance

# TotalCharges was read as object — fix it
df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
df.dropna(inplace=True)
df.drop("customerID", axis=1, inplace=True)`,
          },
          {
            type: "code",
            language: "python",
            label: "Feature engineering",
            code: `# Encode binary columns
binary_cols = ["Partner", "Dependents", "PhoneService", "PaperlessBilling", "Churn"]
for col in binary_cols:
    df[col] = (df[col] == "Yes").astype(int)

df["gender"] = (df["gender"] == "Male").astype(int)

# Useful ratio features
df["ChargesPerMonth"]  = df["TotalCharges"] / (df["tenure"] + 1)
df["HighValueCustomer"] = (df["MonthlyCharges"] > df["MonthlyCharges"].median()).astype(int)

# One-hot encode remaining categoricals
df = pd.get_dummies(df, drop_first=True)
print(df.shape)   # (7032, ~30)`,
          },
          {
            type: "code",
            language: "python",
            label: "Train / test split + scaling",
            code: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X = df.drop("Churn", axis=1).values.astype(np.float32)
y = df["Churn"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

print(f"Train: {X_train.shape}  |  Test: {X_test.shape}")`,
          },
        ],
      },
      {
        step: 4,
        title: "Classical ML models (scikit-learn)",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Train three models and compare",
            code: `from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import roc_auc_score, classification_report

models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Random Forest":       RandomForestClassifier(n_estimators=200, random_state=42),
    "Gradient Boosting":   GradientBoostingClassifier(n_estimators=200, random_state=42),
}

results = {}
for name, model in models.items():
    model.fit(X_train, y_train)
    y_prob = model.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, y_prob)
    results[name] = {"model": model, "auc": auc, "proba": y_prob}
    print(f"{name:<25} ROC-AUC: {auc:.4f}")

best_name = max(results, key=lambda k: results[k]["auc"])
best_model = results[best_name]["model"]
print(f"\\nBest model: {best_name}")
print(classification_report(y_test, best_model.predict(X_test)))`,
          },
          {
            type: "callout",
            kind: "insight",
            title: "Why ROC-AUC instead of accuracy?",
            content: "With 73% non-churn, a model that always predicts \"No churn\" gets 73% accuracy — but is completely useless. ROC-AUC measures the model's ability to rank churners above non-churners, regardless of threshold. A score of 0.5 = random, 1.0 = perfect.",
          },
        ],
      },
      {
        step: 5,
        title: "TensorFlow binary classification network",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Build and train with Keras",
            code: `import tensorflow as tf
from tensorflow import keras

tf.random.set_seed(42)

# Class weight to handle the 73/27 imbalance
neg, pos = np.bincount(y_train)
class_weight = {0: 1.0, 1: neg / pos}

def build_churn_model(input_dim: int) -> keras.Model:
    inputs = keras.Input(shape=(input_dim,))
    x = keras.layers.Dense(128, activation="relu")(inputs)
    x = keras.layers.BatchNormalization()(x)
    x = keras.layers.Dropout(0.3)(x)
    x = keras.layers.Dense(64, activation="relu")(x)
    x = keras.layers.BatchNormalization()(x)
    x = keras.layers.Dropout(0.2)(x)
    x = keras.layers.Dense(32, activation="relu")(x)
    outputs = keras.layers.Dense(1, activation="sigmoid")(x)
    return keras.Model(inputs, outputs)

model_tf = build_churn_model(X_train.shape[1])
model_tf.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-3),
    loss="binary_crossentropy",
    metrics=["AUC", "Precision", "Recall"],
)
model_tf.summary()

callbacks = [
    keras.callbacks.EarlyStopping(monitor="val_auc", patience=10, restore_best_weights=True, mode="max"),
    keras.callbacks.ReduceLROnPlateau(monitor="val_loss", patience=5, factor=0.5),
]

history = model_tf.fit(
    X_train, y_train,
    validation_split=0.2,
    epochs=100,
    batch_size=64,
    class_weight=class_weight,
    callbacks=callbacks,
    verbose=1,
)`,
          },
          {
            type: "code",
            language: "python",
            label: "Evaluate and compare all models",
            code: `# TensorFlow evaluation
y_prob_tf = model_tf.predict(X_test, verbose=0).flatten()
auc_tf = roc_auc_score(y_test, y_prob_tf)
print(f"\\n{'Model':<25} {'ROC-AUC':>8}")
print("-" * 35)
for name, r in results.items():
    print(f"{name:<25} {r['auc']:>8.4f}")
print(f"{'TensorFlow DNN':<25} {auc_tf:>8.4f}")

# Plot ROC curves
from sklearn.metrics import RocCurveDisplay
fig, ax = plt.subplots(figsize=(8, 6))
for name, r in results.items():
    RocCurveDisplay.from_predictions(y_test, r["proba"], name=name, ax=ax)
RocCurveDisplay.from_predictions(y_test, y_prob_tf, name="TensorFlow DNN", ax=ax)
ax.set_title("ROC Curves — Churn Prediction")
plt.tight_layout(); plt.show()`,
          },
          {
            type: "callout",
            kind: "insight",
            title: "When does TensorFlow beat sklearn?",
            content: "On tabular data with ~7K rows, gradient boosting usually wins or ties a DNN. TensorFlow starts to pull ahead when: (1) you have 100K+ rows, (2) you add entity embeddings for high-cardinality categoricals, or (3) you combine tabular features with unstructured data like text or images.",
          },
        ],
      },
      {
        step: 6,
        title: "Feature importance and business insight",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Top churn drivers from Random Forest",
            code: `feature_names = df.drop("Churn", axis=1).columns.tolist()
rf_model = results["Random Forest"]["model"]
importances = pd.Series(rf_model.feature_importances_, index=feature_names)
top10 = importances.nlargest(10)

plt.figure(figsize=(8, 5))
top10.sort_values().plot(kind="barh", color="#6366f1")
plt.title("Top 10 churn predictors (Random Forest)")
plt.xlabel("Feature importance")
plt.tight_layout(); plt.show()

# Expected top features: tenure, MonthlyCharges, TotalCharges,
# Contract_Two year (negative), TechSupport_Yes (negative)`,
          },
          {
            type: "list",
            style: "bullet",
            items: [
              "**tenure** — short-tenure customers churn most. Early retention programs matter most in months 1–12.",
              "**MonthlyCharges** — customers paying more are more likely to churn. Price sensitivity is real.",
              "**Contract type** — month-to-month contracts churn far more than 1/2-year contracts. Upsell incentives for longer contracts.",
              "**TechSupport** — customers with tech support churn less. Bundle it into standard plans.",
            ],
          },
        ],
      },
      {
        step: 7,
        title: "Extensions",
        blocks: [
          {
            type: "list",
            style: "number",
            items: [
              "**Threshold tuning** — `predict_proba` returns a probability. By default `predict` uses 0.5. Tune it with `precision_recall_curve`: a lower threshold catches more churners (higher recall) but with more false positives. The right threshold depends on the cost of a false positive vs false negative.",
              "**SHAP explanations** — `pip install shap`. `shap.TreeExplainer(rf_model)` gives per-prediction explanations: why is this specific customer predicted to churn? Critical for explaining model decisions to business teams.",
              "**XGBoost** — `from xgboost import XGBClassifier`. Often outperforms sklearn GBM on tabular data and trains faster. Add `scale_pos_weight=neg/pos` to handle class imbalance natively.",
              "**Hyperparameter tuning** — `from sklearn.model_selection import RandomizedSearchCV`. Tune `n_estimators`, `max_depth`, `min_samples_leaf` for Random Forest. Can lift AUC by 0.01–0.03.",
              "**Deploy as an API** — serialize the best model with `joblib.dump(model, 'churn_model.pkl')` and wrap it in a FastAPI endpoint. Return a churn probability score and the top 3 contributing features using SHAP.",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Project 2 — Loan Approval Predictor
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: "loan-approval-predictor",
    trackSlug: "classical-ml",
    title: "Loan Approval Predictor",
    description:
      "Build a model that predicts whether a loan application will be approved, handling missing values, categorical encoding, and severe class imbalance — then replicate with TensorFlow. Uses the Loan Prediction dataset from Kaggle Analytics Vidhya.",
    techStack: ["Python", "scikit-learn", "XGBoost", "TensorFlow", "Pandas", "imbalanced-learn", "Kaggle API"],
    difficulty: "beginner",
    estimatedHours: 3,
    sections: [
      {
        step: 1,
        title: "What you're building",
        blocks: [
          {
            type: "text",
            content:
              "A binary classifier that predicts **loan approval** (Y/N). This project focuses on three real-world challenges you'll encounter on almost every tabular dataset: **missing values**, **categorical encoding**, and **imbalanced classes**. It also introduces the ethical dimension of fairness in ML — do your predictions discriminate based on gender or marital status?",
          },
          {
            type: "kv",
            items: [
              { key: "Dataset", value: "Analytics Vidhya Loan Prediction — 614 rows, 13 columns (income, credit history, property area, etc.)" },
              { key: "Target", value: "Loan_Status: Y (approved) / N (rejected)" },
              { key: "Key challenge", value: "Missing values in 6 columns + 69/31 class split" },
              { key: "Kaggle link", value: "kaggle.com/datasets/altruistdelhite04/loan-prediction-problem-dataset" },
            ],
          },
        ],
      },
      {
        step: 2,
        title: "Get the dataset",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Download via Kaggle API",
            code: `kaggle datasets download -d altruistdelhite04/loan-prediction-problem-dataset
unzip loan-prediction-problem-dataset.zip`,
          },
          {
            type: "callout",
            kind: "tip",
            title: "First time with Kaggle API?",
            content: "See Project 1 (Customer Churn) for full Kaggle API setup instructions — download kaggle.json from your Kaggle account page, place it in `~/.kaggle/`, then `pip install kaggle`.",
          },
        ],
      },
      {
        step: 3,
        title: "EDA, missing values, and encoding",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Load and inspect missing values",
            code: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import matplotlib.pyplot as plt
import warnings; warnings.filterwarnings("ignore")

df = pd.read_csv("train.csv")
print(df.shape)             # (614, 13)
print(df.isnull().sum())
# Loan_ID                0
# Gender                13
# Married                3
# Dependents            15
# Education              0
# Self_Employed         32
# ApplicantIncome        0
# CoapplicantIncome      0
# LoanAmount            22
# Loan_Amount_Term      14
# Credit_History        50  ← most missing
# Property_Area          0
# Loan_Status            0`,
          },
          {
            type: "code",
            language: "python",
            label: "Impute missing values",
            code: `# Categorical: fill with mode
cat_cols = ["Gender", "Married", "Dependents", "Self_Employed", "Loan_Amount_Term", "Credit_History"]
for col in cat_cols:
    df[col].fillna(df[col].mode()[0], inplace=True)

# Numerical: fill LoanAmount with median (robust to outliers)
df["LoanAmount"].fillna(df["LoanAmount"].median(), inplace=True)

# Feature engineering
df["TotalIncome"]      = df["ApplicantIncome"] + df["CoapplicantIncome"]
df["LoanIncomeRatio"]  = df["LoanAmount"] / (df["TotalIncome"] / 1000 + 1)
df["LogLoanAmount"]    = np.log1p(df["LoanAmount"])
df["LogTotalIncome"]   = np.log1p(df["TotalIncome"])

# Encode target
df["Loan_Status"] = (df["Loan_Status"] == "Y").astype(int)

# Label encode all remaining object columns
le = LabelEncoder()
for col in df.select_dtypes("object").columns:
    if col != "Loan_ID":
        df[col] = le.fit_transform(df[col].astype(str))

df.drop("Loan_ID", axis=1, inplace=True)`,
          },
          {
            type: "callout",
            kind: "insight",
            title: "Why log-transform income and loan amount?",
            content: "Both distributions are right-skewed — a few very high earners stretch the scale. Log-transform compresses the tail, making the distribution roughly normal. This helps linear models (logistic regression) and distance-based models (KNN) that assume roughly symmetric features. Tree-based models don't need it.",
          },
          {
            type: "code",
            language: "python",
            label: "Train / test split",
            code: `X = df.drop("Loan_Status", axis=1).values.astype(np.float32)
y = df["Loan_Status"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)`,
          },
        ],
      },
      {
        step: 4,
        title: "Classical ML models",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Logistic Regression, Decision Tree, XGBoost",
            code: `from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score, accuracy_score, classification_report

models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Decision Tree":       DecisionTreeClassifier(max_depth=5, random_state=42),
    "XGBoost":             XGBClassifier(n_estimators=200, max_depth=4,
                                         use_label_encoder=False,
                                         eval_metric="logloss", random_state=42),
}
for name, m in models.items():
    m.fit(X_train, y_train)
    y_prob = m.predict_proba(X_test)[:, 1]
    print(f"{name:<22} Acc: {accuracy_score(y_test, m.predict(X_test)):.3f}  AUC: {roc_auc_score(y_test, y_prob):.4f}")`,
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Credit_History dominates — don't over-trust it",
            content: "Credit_History is a near-perfect predictor (people with no credit history are almost always rejected). In the real world this feature might not be available at prediction time (new customers), or using it might violate fair lending regulations. Build a second model without it and compare.",
          },
        ],
      },
      {
        step: 5,
        title: "TensorFlow model",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Keras binary classifier for loan approval",
            code: `import tensorflow as tf
from tensorflow import keras

tf.random.set_seed(42)
neg, pos = np.bincount(y_train)
class_weight = {0: 1.0, 1: neg / pos}

model_tf = keras.Sequential([
    keras.layers.Input(shape=(X_train.shape[1],)),
    keras.layers.Dense(64, activation="relu"),
    keras.layers.BatchNormalization(),
    keras.layers.Dropout(0.3),
    keras.layers.Dense(32, activation="relu"),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(1, activation="sigmoid"),
])
model_tf.compile(
    optimizer=keras.optimizers.Adam(1e-3),
    loss="binary_crossentropy",
    metrics=["AUC", "accuracy"],
)

history = model_tf.fit(
    X_train, y_train,
    epochs=150,
    batch_size=32,
    validation_split=0.2,
    class_weight=class_weight,
    callbacks=[keras.callbacks.EarlyStopping(monitor="val_auc", patience=15,
                                              restore_best_weights=True, mode="max")],
    verbose=0,
)

y_prob_tf = model_tf.predict(X_test, verbose=0).flatten()
print(f"TensorFlow AUC: {roc_auc_score(y_test, y_prob_tf):.4f}")`,
          },
          {
            type: "callout",
            kind: "tip",
            title: "Small dataset — cross-validation is more reliable",
            content: "With only 614 rows, a single 80/20 split gives noisy metrics. Use `StratifiedKFold(n_splits=5)` from sklearn and average the AUC across all folds. This is especially important before claiming one model is better than another.",
          },
        ],
      },
      {
        step: 6,
        title: "Extensions",
        blocks: [
          {
            type: "list",
            style: "number",
            items: [
              "**Fairness analysis** — compute approval rates segmented by Gender and Married status. Does your model discriminate? Use `df.groupby('Gender')['predicted'].mean()` to check. This is a required step in any real lending system.",
              "**SMOTE oversampling** — `pip install imbalanced-learn`. `from imblearn.over_sampling import SMOTE`. Synthetically generate minority class samples during training. Compare AUC before/after.",
              "**Calibration** — loan decisions need well-calibrated probabilities (a 0.7 score should mean 70% approval likelihood). `from sklearn.calibration import CalibratedClassifierCV` and `CalibrationDisplay` to check and fix.",
              "**Threshold optimization** — in lending, the cost of a missed good customer ≠ cost of approving a bad one. Plot the precision-recall curve and pick the threshold that minimizes the business loss function.",
              "**Larger dataset** — try the Home Credit Default Risk dataset on Kaggle (307K rows, 120+ features). Everything you built here scales directly.",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Project 3 — House Price Predictor (Advanced)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: "house-price-predictor",
    trackSlug: "classical-ml",
    title: "House Price Predictor",
    description:
      "Predict house sale prices from 79 features using Ridge regression, Random Forest, and XGBoost — then build a TensorFlow regression network. Uses the Kaggle competition dataset 'House Prices: Advanced Regression Techniques' (1,460 training rows).",
    techStack: ["Python", "scikit-learn", "XGBoost", "TensorFlow", "Pandas", "Seaborn", "Kaggle API"],
    difficulty: "intermediate",
    estimatedHours: 5,
    sections: [
      {
        step: 1,
        title: "What you're building",
        blocks: [
          {
            type: "text",
            content:
              "A regression model that predicts residential house sale prices from 79 features covering everything from square footage to basement quality to proximity to a railroad. This is a Kaggle competition — you can submit your predictions and see how you rank against thousands of other solutions.",
          },
          {
            type: "kv",
            items: [
              { key: "Dataset", value: "Kaggle House Prices: Advanced Regression Techniques — 1,460 training rows, 79 features" },
              { key: "Target", value: "SalePrice (continuous regression)" },
              { key: "Evaluation metric", value: "RMSE on log(SalePrice) — the competition metric" },
              { key: "Kaggle link", value: "kaggle.com/competitions/house-prices-advanced-regression-techniques" },
            ],
          },
        ],
      },
      {
        step: 2,
        title: "Get the dataset",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Download the competition data",
            code: `# Accept competition rules on kaggle.com first (one-time)
kaggle competitions download -c house-prices-advanced-regression-techniques
unzip house-prices-advanced-regression-techniques.zip`,
          },
        ],
      },
      {
        step: 3,
        title: "EDA and feature engineering",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Load and explore the target",
            code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings; warnings.filterwarnings("ignore")

train = pd.read_csv("train.csv")
test  = pd.read_csv("test.csv")

print(train.shape)   # (1460, 81)

# Check target distribution
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].hist(train["SalePrice"], bins=50, color="#6366f1", alpha=0.7)
axes[0].set_title("SalePrice — right skewed")
axes[1].hist(np.log1p(train["SalePrice"]), bins=50, color="#10b981", alpha=0.7)
axes[1].set_title("log(SalePrice) — approximately normal")
plt.tight_layout(); plt.show()

print(f"Skewness raw:  {stats.skew(train['SalePrice']):.2f}")
print(f"Skewness log:  {stats.skew(np.log1p(train['SalePrice'])):.2f}")`,
          },
          {
            type: "callout",
            kind: "insight",
            title: "Why predict log(price) instead of price?",
            content: "The Kaggle leaderboard uses RMSE on log(SalePrice). Training on log targets also stabilizes gradients — a $10K error on a $100K house is proportionally far worse than on a $500K house. Log scale treats them consistently.",
          },
          {
            type: "code",
            language: "python",
            label: "Missing values, encoding, and feature engineering",
            code: `# Combine train and test for consistent preprocessing
all_data = pd.concat([train.drop("SalePrice", axis=1), test], ignore_index=True)

# Missing values — many NaN mean "feature absent" (e.g., no garage → NaN GarageType)
none_fill  = ["PoolQC", "MiscFeature", "Alley", "Fence", "FireplaceQu",
               "GarageType", "GarageFinish", "GarageQual", "GarageCond",
               "BsmtQual", "BsmtCond", "BsmtExposure", "BsmtFinType1", "BsmtFinType2",
               "MasVnrType", "MSSubClass"]
zero_fill  = ["GarageYrBlt", "GarageArea", "GarageCars",
               "BsmtFinSF1", "BsmtFinSF2", "BsmtUnfSF", "TotalBsmtSF",
               "BsmtFullBath", "BsmtHalfBath", "MasVnrArea"]
mode_fill  = ["MSZoning", "Electrical", "KitchenQual", "Exterior1st",
               "Exterior2nd", "SaleType", "Functional"]

for col in none_fill:  all_data[col].fillna("None",              inplace=True)
for col in zero_fill:  all_data[col].fillna(0,                   inplace=True)
for col in mode_fill:  all_data[col].fillna(all_data[col].mode()[0], inplace=True)
all_data["LotFrontage"].fillna(all_data.groupby("Neighborhood")["LotFrontage"].transform("median"), inplace=True)

# High-value engineered features
all_data["TotalSF"]      = all_data["TotalBsmtSF"] + all_data["1stFlrSF"] + all_data["2ndFlrSF"]
all_data["TotalBath"]    = (all_data["FullBath"] + 0.5 * all_data["HalfBath"]
                             + all_data["BsmtFullBath"] + 0.5 * all_data["BsmtHalfBath"])
all_data["HouseAge"]     = all_data["YrSold"] - all_data["YearBuilt"]
all_data["RemodAge"]     = all_data["YrSold"] - all_data["YearRemodAdd"]
all_data["HasPool"]      = (all_data["PoolArea"] > 0).astype(int)
all_data["Has2ndFloor"]  = (all_data["2ndFlrSF"] > 0).astype(int)
all_data["HasGarage"]    = (all_data["GarageArea"] > 0).astype(int)

# One-hot encode all categoricals
all_data = pd.get_dummies(all_data)

# Split back into train / test
n_train = train.shape[0]
X_train_raw = all_data[:n_train].values.astype(np.float32)
X_test_raw  = all_data[n_train:].values.astype(np.float32)
y_log = np.log1p(train["SalePrice"].values).astype(np.float32)`,
          },
          {
            type: "code",
            language: "python",
            label: "Train / val split + scaling",
            code: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X_tr, X_val, y_tr, y_val = train_test_split(
    X_train_raw, y_log, test_size=0.2, random_state=42
)
scaler = StandardScaler()
X_tr_sc  = scaler.fit_transform(X_tr)
X_val_sc = scaler.transform(X_val)`,
          },
        ],
      },
      {
        step: 4,
        title: "Classical ML models",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Ridge + Random Forest + XGBoost",
            code: `from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error

def rmsle(y_true, y_pred):
    """RMSE on log-scale predictions (competition metric)."""
    return float(np.sqrt(mean_squared_error(y_true, y_pred)))

models = {
    "Ridge":         Ridge(alpha=10),
    "Random Forest": RandomForestRegressor(n_estimators=300, max_features=0.4, random_state=42),
    "XGBoost":       XGBRegressor(n_estimators=1000, learning_rate=0.05, max_depth=4,
                                   subsample=0.8, colsample_bytree=0.8,
                                   random_state=42, verbosity=0,
                                   early_stopping_rounds=50,
                                   eval_metric="rmse"),
}

for name, m in models.items():
    if name == "XGBoost":
        m.fit(X_tr_sc, y_tr, eval_set=[(X_val_sc, y_val)], verbose=False)
    else:
        m.fit(X_tr_sc, y_tr)
    y_pred_val = m.predict(X_val_sc)
    print(f"{name:<16} Val RMSLE: {rmsle(y_val, y_pred_val):.5f}")`,
          },
          {
            type: "callout",
            kind: "tip",
            title: "Blend models for better scores",
            content: "Ensemble different model types: `y_blend = 0.4*y_ridge + 0.3*y_rf + 0.3*y_xgb`. Blending uncorrelated models almost always beats any single model. This is why Kaggle winning solutions average dozens of models.",
          },
        ],
      },
      {
        step: 5,
        title: "TensorFlow regression network",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Build the regression model",
            code: `import tensorflow as tf
from tensorflow import keras

tf.random.set_seed(42)

def build_price_model(input_dim: int) -> keras.Model:
    inputs = keras.Input(shape=(input_dim,))
    x = keras.layers.Dense(512, activation="relu")(inputs)
    x = keras.layers.BatchNormalization()(x)
    x = keras.layers.Dropout(0.3)(x)
    x = keras.layers.Dense(256, activation="relu")(x)
    x = keras.layers.BatchNormalization()(x)
    x = keras.layers.Dropout(0.2)(x)
    x = keras.layers.Dense(128, activation="relu")(x)
    x = keras.layers.Dropout(0.1)(x)
    x = keras.layers.Dense(64, activation="relu")(x)
    outputs = keras.layers.Dense(1, activation="linear")(x)   # regression → linear output
    return keras.Model(inputs, outputs)

model_tf = build_price_model(X_tr_sc.shape[1])
model_tf.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-3),
    loss="mse",
    metrics=["mae"],
)

callbacks = [
    keras.callbacks.EarlyStopping(monitor="val_loss", patience=20, restore_best_weights=True),
    keras.callbacks.ReduceLROnPlateau(monitor="val_loss", patience=10, factor=0.5, min_lr=1e-6),
]

history = model_tf.fit(
    X_tr_sc, y_tr,
    validation_data=(X_val_sc, y_val),
    epochs=300,
    batch_size=32,
    callbacks=callbacks,
    verbose=0,
)

y_pred_tf = model_tf.predict(X_val_sc, verbose=0).flatten()
print(f"TensorFlow Val RMSLE: {rmsle(y_val, y_pred_tf):.5f}")`,
          },
          {
            type: "code",
            language: "python",
            label: "Predict on test set and create Kaggle submission",
            code: `X_test_sc = scaler.transform(X_test_raw)

# Use best sklearn model for submission (usually XGBoost wins on tabular)
y_test_log = models["XGBoost"].predict(X_test_sc)
y_test_price = np.expm1(y_test_log)   # reverse log1p

submission = pd.DataFrame({
    "Id": test["Id"],
    "SalePrice": y_test_price,
})
submission.to_csv("submission.csv", index=False)
print(submission.head())

# Submit to Kaggle:
# kaggle competitions submit -c house-prices-advanced-regression-techniques \\
#   -f submission.csv -m "XGBoost baseline"`,
          },
        ],
      },
      {
        step: 6,
        title: "Extensions",
        blocks: [
          {
            type: "list",
            style: "number",
            items: [
              "**Stacking** — train a meta-model on the out-of-fold predictions from your base models. `from sklearn.ensemble import StackingRegressor`. This is the most reliable way to squeeze extra performance on competition leaderboards.",
              "**Target encoding** — for high-cardinality categoricals like Neighborhood (25 values), replace each value with the mean SalePrice for that category. Use `category_encoders.TargetEncoder` with leave-one-out to avoid leakage.",
              "**Optuna hyperparameter search** — `pip install optuna`. Define a search space for XGBoost params and let Optuna minimize validation RMSLE in 50–100 trials.",
              "**TensorFlow wide & deep** — implement Google's Wide & Deep architecture: memorize feature interactions with a wide linear model, generalize with a deep DNN, and concatenate both for the final prediction.",
              "**Interactive price map** — join Neighborhood to geographic coordinates and render a `folium` chloropleth map showing predicted prices by area. Powerful for portfolio demos.",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Project 4 — Fraud Detection
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: "fraud-detection",
    trackSlug: "classical-ml",
    title: "Fraud Detection",
    description:
      "Detect fraudulent credit card transactions in a dataset where only 0.17% of transactions are fraud — the extreme class imbalance problem. Uses SMOTE, isolation forest, XGBoost, and a TensorFlow autoencoder for anomaly detection.",
    techStack: ["Python", "scikit-learn", "XGBoost", "TensorFlow", "imbalanced-learn", "Pandas", "Kaggle API"],
    difficulty: "intermediate",
    estimatedHours: 4,
    sections: [
      {
        step: 1,
        title: "What you're building",
        blocks: [
          {
            type: "text",
            content:
              "A fraud detector on real anonymized credit card transactions. The central challenge: **only 492 out of 284,807 transactions (0.17%) are fraud**. A model that predicts \"not fraud\" for everything gets 99.83% accuracy — and catches exactly zero fraudsters. This project teaches you to work with extreme imbalance using SMOTE, proper metrics, and anomaly detection.",
          },
          {
            type: "kv",
            items: [
              { key: "Dataset", value: "ULB Credit Card Fraud — 284,807 transactions, 30 features (PCA-transformed for anonymity), 492 fraud cases" },
              { key: "Target", value: "Class: 0 (legitimate) / 1 (fraud)" },
              { key: "Key metric", value: "Average Precision (area under PR curve) — not accuracy, not even ROC-AUC" },
              { key: "Kaggle link", value: "kaggle.com/datasets/mlg-ulb/creditcardfraud" },
            ],
          },
          {
            type: "callout",
            kind: "insight",
            title: "Average Precision vs ROC-AUC for imbalanced data",
            content: "With 99.83% negatives, ROC-AUC can look impressive (0.97+) even when precision at any reasonable recall threshold is terrible. Average Precision (AP) is the area under the Precision-Recall curve — it directly measures \"of all transactions flagged as fraud, what fraction are actually fraud?\" Use AP when the positive class is rare.",
          },
        ],
      },
      {
        step: 2,
        title: "Get the dataset",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Download (284 MB)",
            code: `kaggle datasets download -d mlg-ulb/creditcardfraud
unzip creditcardfraud.zip`,
          },
        ],
      },
      {
        step: 3,
        title: "EDA and preprocessing",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Load and inspect the imbalance",
            code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import warnings; warnings.filterwarnings("ignore")

df = pd.read_csv("creditcard.csv")
print(df.shape)                           # (284807, 31)
print(df["Class"].value_counts())
# 0    284315   (99.83%)
# 1       492   (0.17%)

# V1-V28 are PCA features — already scaled. Scale only Time and Amount.
df["Amount_scaled"] = StandardScaler().fit_transform(df[["Amount"]])
df["Time_scaled"]   = StandardScaler().fit_transform(df[["Time"]])
df.drop(["Amount", "Time"], axis=1, inplace=True)`,
          },
          {
            type: "code",
            language: "python",
            label: "Stratified split — keep fraud ratio in both sets",
            code: `X = df.drop("Class", axis=1).values.astype(np.float32)
y = df["Class"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"Train fraud: {y_train.sum()} / {len(y_train)}")
print(f"Test  fraud: {y_test.sum()}  / {len(y_test)}")`,
          },
        ],
      },
      {
        step: 4,
        title: "Baseline + SMOTE oversampling",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Baseline XGBoost with class_weight, then SMOTE",
            code: `from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
from sklearn.metrics import average_precision_score, classification_report

# Scale pos weight = num_negative / num_positive
scale = (y_train == 0).sum() / (y_train == 1).sum()

xgb_base = XGBClassifier(
    n_estimators=300, max_depth=4, learning_rate=0.1,
    scale_pos_weight=scale, eval_metric="aucpr",
    random_state=42, verbosity=0,
)
xgb_base.fit(X_train, y_train)
y_prob_base = xgb_base.predict_proba(X_test)[:, 1]
print(f"Baseline XGBoost  AP: {average_precision_score(y_test, y_prob_base):.4f}")

# SMOTE — generate synthetic minority class samples
sm = SMOTE(random_state=42)
X_sm, y_sm = sm.fit_resample(X_train, y_train)
print(f"After SMOTE: {y_sm.value_counts().to_dict()}")

xgb_smote = XGBClassifier(
    n_estimators=300, max_depth=4, learning_rate=0.1,
    eval_metric="aucpr", random_state=42, verbosity=0,
)
xgb_smote.fit(X_sm, y_sm)
y_prob_smote = xgb_smote.predict_proba(X_test)[:, 1]
print(f"SMOTE XGBoost     AP: {average_precision_score(y_test, y_prob_smote):.4f}")`,
          },
          {
            type: "callout",
            kind: "gotcha",
            title: "Apply SMOTE only on the training set",
            content: "SMOTE synthesizes new samples by interpolating between existing minority examples. If you apply it before splitting (or on the test set), synthetic samples can overlap with real test data, inflating your metrics. Always: split first, then SMOTE only X_train/y_train.",
          },
        ],
      },
      {
        step: 5,
        title: "TensorFlow autoencoder for anomaly detection",
        blocks: [
          {
            type: "text",
            content:
              "A different approach: train an **autoencoder** only on legitimate transactions. It learns to compress and reconstruct normal data. When it sees a fraudulent transaction (which it has never learned to reconstruct), the reconstruction error is high — that high error becomes the anomaly score.",
          },
          {
            type: "code",
            language: "python",
            label: "Train autoencoder on legitimate transactions only",
            code: `import tensorflow as tf
from tensorflow import keras

tf.random.set_seed(42)

# Train autoencoder ONLY on legitimate transactions
X_legit = X_train[y_train == 0]

def build_autoencoder(input_dim: int) -> keras.Model:
    # Encoder
    inputs = keras.Input(shape=(input_dim,))
    x = keras.layers.Dense(32, activation="relu")(inputs)
    x = keras.layers.Dense(16, activation="relu")(x)
    encoded = keras.layers.Dense(8, activation="relu", name="bottleneck")(x)
    # Decoder
    x = keras.layers.Dense(16, activation="relu")(encoded)
    x = keras.layers.Dense(32, activation="relu")(x)
    decoded = keras.layers.Dense(input_dim, activation="linear")(x)
    return keras.Model(inputs, decoded)

ae = build_autoencoder(X_train.shape[1])
ae.compile(optimizer=keras.optimizers.Adam(1e-3), loss="mse")

ae.fit(
    X_legit, X_legit,           # input == target (reconstruction task)
    epochs=50,
    batch_size=256,
    validation_split=0.05,
    callbacks=[keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)],
    verbose=1,
)`,
          },
          {
            type: "code",
            language: "python",
            label: "Use reconstruction error as fraud score",
            code: `# Reconstruction error per sample (MSE across features)
X_test_reconstructed = ae.predict(X_test, verbose=0)
reconstruction_error  = np.mean((X_test - X_test_reconstructed) ** 2, axis=1)

ae_ap = average_precision_score(y_test, reconstruction_error)
print(f"Autoencoder anomaly detection  AP: {ae_ap:.4f}")

# Visualize: fraud transactions should have higher reconstruction error
legit_err = reconstruction_error[y_test == 0]
fraud_err = reconstruction_error[y_test == 1]

plt.figure(figsize=(10, 4))
plt.hist(legit_err, bins=100, alpha=0.6, label="Legitimate", color="#10b981", density=True)
plt.hist(fraud_err, bins=100, alpha=0.6, label="Fraud",      color="#ef4444", density=True)
plt.xlabel("Reconstruction error (MSE)")
plt.ylabel("Density")
plt.title("Autoencoder: fraud transactions have higher reconstruction error")
plt.legend(); plt.tight_layout(); plt.show()`,
          },
          {
            type: "callout",
            kind: "insight",
            title: "When to use an autoencoder vs a classifier",
            content: "Autoencoders are useful when you have very few labeled fraud examples (unsupervised anomaly detection) — they only need the normal class to train. Supervised classifiers (XGBoost, DNN) need labeled fraud examples but are usually more accurate when those labels exist. In production, many fraud systems use both: autoencoder for novel fraud patterns, supervised model for known patterns.",
          },
        ],
      },
      {
        step: 6,
        title: "Extensions",
        blocks: [
          {
            type: "list",
            style: "number",
            items: [
              "**Precision at k** — in production, a fraud team can review N alerts per day. Evaluate \"of the top-100 highest-scored transactions, how many are actually fraud?\" This is the practical business metric.",
              "**Isolation Forest** — `from sklearn.ensemble import IsolationForest`. An unsupervised tree-based anomaly detector. Compare its AP score against the autoencoder.",
              "**TensorFlow supervised DNN** — build a fully supervised binary classifier with class_weight and compare AP against XGBoost. Add focal loss (down-weights easy negatives) to see if it helps.",
              "**Threshold analysis** — plot recall vs false positive rate as you vary the threshold from 0 to 1. For a fraud team reviewing 50 cases/day from 100K daily transactions, what threshold gives you the most fraud with a manageable false positive rate?",
              "**Feature drift monitoring** — in production, fraud patterns change monthly. Implement a simple drift detector: compute the KL-divergence between the training distribution and last week's transaction distribution. Alert when it exceeds a threshold.",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Project 5 — Customer Segmentation
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: "customer-segmentation",
    trackSlug: "classical-ml",
    title: "Customer Segmentation",
    description:
      "Segment customers into meaningful groups using K-Means, DBSCAN, and hierarchical clustering — then use a TensorFlow autoencoder to compress features before clustering. Uses the Online Retail II dataset from Kaggle (500K+ transactions).",
    techStack: ["Python", "scikit-learn", "TensorFlow", "Pandas", "Matplotlib", "Seaborn", "Plotly", "Kaggle API"],
    difficulty: "intermediate",
    estimatedHours: 4,
    sections: [
      {
        step: 1,
        title: "What you're building",
        blocks: [
          {
            type: "text",
            content:
              "An unsupervised customer segmentation pipeline. You'll transform raw transaction data into **RFM features** (Recency, Frequency, Monetary value), cluster customers into distinct behavioral groups, profile each segment, and use a TensorFlow autoencoder to compress high-dimensional features before clustering.",
          },
          {
            type: "diagram",
            chart: `graph LR
    K[Kaggle: Online Retail II] --> T[Transaction aggregation]
    T --> RFM[RFM feature engineering]
    RFM --> N[Normalize features]
    N --> KM[K-Means clustering]
    N --> DB[DBSCAN]
    N --> HC[Hierarchical]
    N --> AE[TF Autoencoder → latent space → K-Means]
    KM --> P[Segment profiling & business insights]
    DB --> P; HC --> P; AE --> P
    style K fill:#20beff,color:#000
    style AE fill:#ff6f00,color:#fff
    style P fill:#10b981,color:#fff`,
            label: "Segmentation pipeline",
          },
          {
            type: "kv",
            items: [
              { key: "Dataset", value: "Online Retail II — 1,067,371 UK online retail transactions (2009–2011), 8 columns" },
              { key: "Approach", value: "Unsupervised clustering on RFM features derived from transactions" },
              { key: "Evaluation", value: "Silhouette score, Davies-Bouldin index, business interpretability" },
              { key: "Kaggle link", value: "kaggle.com/datasets/mashlyn/online-retail-ii-uci" },
            ],
          },
        ],
      },
      {
        step: 2,
        title: "Get the dataset",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Download via Kaggle",
            code: `kaggle datasets download -d mashlyn/online-retail-ii-uci
unzip online-retail-ii-uci.zip`,
          },
          {
            type: "callout",
            kind: "tip",
            title: "Alternative: UCI Machine Learning Repository",
            content: "This dataset is available directly from the UCI repository: `pip install ucimlrepo` then `from ucimlrepo import fetch_ucirepo; data = fetch_ucirepo(id=502)`.",
          },
        ],
      },
      {
        step: 3,
        title: "RFM feature engineering",
        blocks: [
          {
            type: "text",
            content:
              "**RFM** (Recency, Frequency, Monetary) is the standard framework for customer value analysis. It captures three dimensions of behavior in three numbers per customer.",
          },
          {
            type: "kv",
            items: [
              { key: "Recency (R)", value: "Days since the customer's last purchase. Lower = more recent = better." },
              { key: "Frequency (F)", value: "Number of distinct invoices. Higher = more loyal = better." },
              { key: "Monetary (M)", value: "Total spend. Higher = more valuable = better." },
            ],
          },
          {
            type: "code",
            language: "python",
            label: "Load and build RFM table",
            code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import warnings; warnings.filterwarnings("ignore")

# Load both sheets (2009-2010 and 2010-2011)
df09 = pd.read_excel("online_retail_II.xlsx", sheet_name="Year 2009-2010", engine="openpyxl")
df10 = pd.read_excel("online_retail_II.xlsx", sheet_name="Year 2010-2011", engine="openpyxl")
df = pd.concat([df09, df10], ignore_index=True)
print(df.shape)   # (~1M rows)

# Clean: remove cancellations (Invoice starts with C), missing customers, negative prices
df = df[~df["Invoice"].astype(str).str.startswith("C")]
df.dropna(subset=["Customer ID"], inplace=True)
df = df[df["Price"] > 0]
df = df[df["Quantity"] > 0]

df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])
df["Revenue"] = df["Quantity"] * df["Price"]

# Reference date = 1 day after last transaction
ref_date = df["InvoiceDate"].max() + pd.Timedelta(days=1)

rfm = df.groupby("Customer ID").agg(
    Recency   = ("InvoiceDate", lambda x: (ref_date - x.max()).days),
    Frequency = ("Invoice",     "nunique"),
    Monetary  = ("Revenue",     "sum"),
).reset_index()

print(rfm.describe())`,
          },
          {
            type: "code",
            language: "python",
            label: "Log-transform and normalize",
            code: `from sklearn.preprocessing import StandardScaler

# RFM distributions are highly skewed — log-transform before clustering
rfm_log = rfm.copy()
rfm_log["Recency"]   = np.log1p(rfm["Recency"])
rfm_log["Frequency"] = np.log1p(rfm["Frequency"])
rfm_log["Monetary"]  = np.log1p(rfm["Monetary"])

scaler = StandardScaler()
X = scaler.fit_transform(rfm_log[["Recency", "Frequency", "Monetary"]]).astype(np.float32)
print(f"Customers after cleaning: {X.shape[0]}")   # ~4,300`,
          },
        ],
      },
      {
        step: 4,
        title: "K-Means: find optimal k with elbow + silhouette",
        blocks: [
          {
            type: "code",
            language: "python",
            label: "Elbow method + silhouette scores",
            code: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

inertias, silhouettes = [], []
k_range = range(2, 11)

for k in k_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(X)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X, labels))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
ax1.plot(list(k_range), inertias, marker="o", color="#6366f1")
ax1.set_title("Elbow method — look for the \"elbow\"")
ax1.set_xlabel("Number of clusters k"); ax1.set_ylabel("Inertia")
ax2.plot(list(k_range), silhouettes, marker="o", color="#10b981")
ax2.set_title("Silhouette score — higher is better")
ax2.set_xlabel("Number of clusters k"); ax2.set_ylabel("Silhouette")
plt.tight_layout(); plt.show()`,
          },
          {
            type: "code",
            language: "python",
            label: "Fit final K-Means and profile segments",
            code: `# k=4 is typically the elbow for RFM data — adjust based on your plots
BEST_K = 4
km_final = KMeans(n_clusters=BEST_K, random_state=42, n_init=10)
rfm["Segment"] = km_final.fit_predict(X)

# Profile each segment
profile = rfm.groupby("Segment").agg(
    Count     = ("Customer ID", "count"),
    Recency   = ("Recency",     "mean"),
    Frequency = ("Frequency",   "mean"),
    Monetary  = ("Monetary",    "mean"),
).round(1)
profile["PctCustomers"] = (profile["Count"] / profile["Count"].sum() * 100).round(1)
print(profile.sort_values("Monetary", ascending=False))

# Typical segments you'll find:
# Champions    — recent, frequent, high spend   → reward, upsell
# Loyal        — frequent but not recent        → re-engagement campaign
# At-Risk      — used to buy, no recent orders  → win-back offer
# Hibernating  — low on all three               → dormant / remove from marketing`,
          },
        ],
      },
      {
        step: 5,
        title: "TensorFlow autoencoder + latent-space clustering",
        blocks: [
          {
            type: "text",
            content:
              "With only 3 RFM features, K-Means works fine. But with high-dimensional data (100+ features), clustering degrades — the **curse of dimensionality** makes every point look equally far apart. A TensorFlow autoencoder compresses features into a compact latent space before clustering.",
          },
          {
            type: "code",
            language: "python",
            label: "Train an autoencoder on the normalized RFM data",
            code: `import tensorflow as tf
from tensorflow import keras

tf.random.set_seed(42)

# For demonstration, we train on 3 RFM features.
# Replace X with a high-dimensional feature matrix (e.g., product purchase vectors)
# to see the real benefit of dimensionality reduction before clustering.

def build_rfm_autoencoder(input_dim: int, latent_dim: int = 2) -> tuple:
    # Encoder
    encoder_input = keras.Input(shape=(input_dim,))
    x = keras.layers.Dense(64, activation="relu")(encoder_input)
    x = keras.layers.Dense(32, activation="relu")(x)
    latent = keras.layers.Dense(latent_dim, activation="linear", name="latent")(x)
    encoder = keras.Model(encoder_input, latent, name="encoder")

    # Decoder
    decoder_input = keras.Input(shape=(latent_dim,))
    x = keras.layers.Dense(32, activation="relu")(decoder_input)
    x = keras.layers.Dense(64, activation="relu")(x)
    decoded = keras.layers.Dense(input_dim, activation="linear")(x)
    decoder = keras.Model(decoder_input, decoded, name="decoder")

    # Autoencoder (end-to-end)
    ae_input = keras.Input(shape=(input_dim,))
    ae_output = decoder(encoder(ae_input))
    autoencoder = keras.Model(ae_input, ae_output, name="autoencoder")
    return autoencoder, encoder

ae, encoder = build_rfm_autoencoder(input_dim=X.shape[1], latent_dim=2)
ae.compile(optimizer=keras.optimizers.Adam(1e-3), loss="mse")

ae.fit(
    X, X,
    epochs=100,
    batch_size=64,
    validation_split=0.1,
    callbacks=[keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True)],
    verbose=0,
)
print("Autoencoder trained.")`,
          },
          {
            type: "code",
            language: "python",
            label: "Cluster in latent space and visualize",
            code: `# Get 2D latent representations
Z = encoder.predict(X, verbose=0)   # shape: (n_customers, 2)

# Cluster in latent space
km_latent = KMeans(n_clusters=BEST_K, random_state=42, n_init=10)
latent_labels = km_latent.fit_predict(Z)

sil_raw    = silhouette_score(X, km_final.labels_)
sil_latent = silhouette_score(Z, latent_labels)
print(f"Silhouette score — raw RFM:        {sil_raw:.4f}")
print(f"Silhouette score — latent space:   {sil_latent:.4f}")

# Scatter plot of customers in latent space, colored by segment
plt.figure(figsize=(8, 6))
scatter = plt.scatter(Z[:, 0], Z[:, 1], c=latent_labels,
                      cmap="tab10", alpha=0.5, s=10)
plt.colorbar(scatter, label="Segment")
plt.title("Customer segments in autoencoder latent space (2D)")
plt.xlabel("Latent dimension 1")
plt.ylabel("Latent dimension 2")
plt.tight_layout(); plt.show()`,
          },
          {
            type: "callout",
            kind: "insight",
            title: "Extend to product-level features for the real power",
            content: "Replace the 3 RFM features with a customer-product purchase matrix (each column = 1 product, value = times purchased). With hundreds of products, raw K-Means struggles but the autoencoder latent space captures purchase patterns compactly. This is how Spotify, Netflix, and e-commerce platforms do customer segmentation.",
          },
        ],
      },
      {
        step: 6,
        title: "Extensions",
        blocks: [
          {
            type: "list",
            style: "number",
            items: [
              "**Interactive Plotly dashboard** — `pip install plotly`. Build a 3D scatter of RFM values colored by segment. Add dropdown filters for segment. Export as a standalone HTML file for stakeholder demos.",
              "**DBSCAN for outlier detection** — `from sklearn.cluster import DBSCAN`. DBSCAN doesn't require you to specify k, and labels low-density points as noise (-1). These outliers are often your best or worst customers — worth investigating.",
              "**Hierarchical clustering dendrogram** — `from scipy.cluster.hierarchy import dendrogram, linkage`. Plot the dendrogram to see the natural hierarchy in customer behavior. Useful when you're unsure how many segments to use.",
              "**Next-purchase prediction** — attach your segments to a supervised model: given a customer's segment + past behavior, predict whether they'll buy next month. Train an XGBoost or TensorFlow model with the segment ID as a feature.",
              "**Email campaign simulator** — assign a marketing action to each segment (discount, newsletter, VIP invite), apply a simulated conversion rate, and compute projected revenue uplift vs a random campaign baseline.",
            ],
          },
        ],
      },
    ],
  },
];
