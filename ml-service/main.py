from datetime import datetime
import json
import os
import pickle

import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")
USER_DATASET_PATH = os.path.join(DATASETS_DIR, "user_data.csv")

MODEL_FILES = {
    "fraud": os.path.join(BASE_DIR, "fraud_model.pkl"),
    "price": os.path.join(BASE_DIR, "price_model.pkl"),
    "risk": os.path.join(BASE_DIR, "risk_model.pkl"),
    "claim": os.path.join(BASE_DIR, "claim_model.pkl"),
}

ENCODER_FILES = {
    "fraud": os.path.join(BASE_DIR, "fraud_encoders.json"),
    "price": os.path.join(BASE_DIR, "price_encoders.json"),
    "risk": os.path.join(BASE_DIR, "risk_encoders.json"),
    "claim": os.path.join(BASE_DIR, "claim_encoders.json"),
}

DATASET_FILES = {
    "risk": os.path.join(DATASETS_DIR, "risk_data.csv"),
    "price": os.path.join(DATASETS_DIR, "insurance_data.csv"),
    "fraud": os.path.join(DATASETS_DIR, "fraud_data.csv"),
    "claim": os.path.join(DATASETS_DIR, "claims_data.csv"),
}

models = {}


def infer_read_csv(path):
    return pd.read_csv(path, sep=None, engine="python")


def load_dataset(key):
    path = DATASET_FILES.get(key)
    if not path or not os.path.exists(path):
        return pd.DataFrame()
    return infer_read_csv(path)


def load_models():
    for key, path in MODEL_FILES.items():
        if os.path.exists(path):
            with open(path, "rb") as file_obj:
                models[key] = pickle.load(file_obj)
            print(f"Loaded {key} model")


def load_encoder_classes(model_type):
    path = ENCODER_FILES.get(model_type)
    if not path or not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as file_obj:
        return json.load(file_obj)


def default_for_classes(classes):
    if not classes:
        return None
    return classes[0]


def ensure_model_columns(df, model_type):
    encoder_dict = load_encoder_classes(model_type)
    for col, classes in encoder_dict.items():
        if col not in df.columns:
            df[col] = default_for_classes(classes)
    return df


def encode_input_data(data, model_type):
    df = pd.DataFrame([data]) if isinstance(data, dict) else pd.DataFrame(data)
    df = ensure_model_columns(df, model_type)
    encoder_dict = load_encoder_classes(model_type)

    for col, classes in encoder_dict.items():
        if col not in df.columns:
            continue

        le = LabelEncoder()
        le.classes_ = np.array(classes)
        series = df[col].fillna(default_for_classes(classes)).astype(str)
        safe_values = [value if value in classes else classes[0] for value in series]
        df[col] = le.transform(safe_values)

    numeric_df = df.apply(pd.to_numeric, errors="ignore")
    return numeric_df


def round_float(value, digits=2):
    return float(round(float(value), digits))


def read_user_dataset():
    if not os.path.exists(USER_DATASET_PATH):
        return pd.DataFrame()
    return pd.read_csv(USER_DATASET_PATH)


def append_user_record(record):
    os.makedirs(DATASETS_DIR, exist_ok=True)
    new_df = pd.DataFrame([record])

    if os.path.exists(USER_DATASET_PATH):
        existing_df = pd.read_csv(USER_DATASET_PATH)
        for col in existing_df.columns:
            if col not in new_df.columns:
                new_df[col] = np.nan
        for col in new_df.columns:
            if col not in existing_df.columns:
                existing_df[col] = np.nan
        merged = pd.concat([existing_df, new_df[existing_df.columns]], ignore_index=True)
    else:
        merged = new_df

    if "worker_id" in merged.columns and record.get("worker_id"):
        merged = merged.drop_duplicates(subset=["worker_id"], keep="last")

    merged.to_csv(USER_DATASET_PATH, index=False)
    return merged


def prediction_to_scalar(response_value):
    if isinstance(response_value, list) and response_value:
        return response_value[0]
    return response_value


def predict_single(model_type, payload):
    if model_type not in models:
        raise ValueError(f"Model {model_type} not loaded")

    df = encode_input_data(payload, model_type)
    prediction = models[model_type].predict(df)
    response = {
        model_type: prediction.tolist(),
        "timestamp": datetime.now().isoformat(),
    }

    if hasattr(models[model_type], "predict_proba"):
        response["probability"] = models[model_type].predict_proba(df).tolist()
    else:
        response["probability"] = None

    return response


def build_risk_graph():
    df = load_dataset("risk")
    if df.empty:
        return []

    grouped = (
        df.groupby("gig_type", as_index=False)
        .agg(risk=("target", "mean"), traffic=("traffic_violations", "mean"))
        .sort_values("risk", ascending=False)
        .head(6)
    )
    return [
        {
            "name": row["gig_type"],
            "risk": round_float(row["risk"], 3),
            "traffic": round_float(row["traffic"], 1),
        }
        for _, row in grouped.iterrows()
    ]


def build_price_graph():
    df = load_dataset("price")
    if df.empty:
        return []

    grouped = (
        df.groupby("gig_platform", as_index=False)
        .agg(price=("target", "mean"), riskScore=("location_risk_score", "mean"))
        .sort_values("price", ascending=False)
    )
    return [
        {
            "name": row["gig_platform"],
            "price": round_float(row["price"], 2),
            "riskScore": round_float(row["riskScore"] / 10, 3),
        }
        for _, row in grouped.iterrows()
    ]


def build_fraud_graph():
    df = load_dataset("fraud")
    if df.empty:
        return []

    df["band"] = pd.cut(
        df["num_claims_past_year"],
        bins=[-1, 0, 1, 2, 3, 10],
        labels=["0", "1", "2", "3", "4+"],
    )
    grouped = (
        df.groupby("band", as_index=False)
        .agg(fraud=("target", "sum"), confidence=("target", "mean"))
        .fillna(0)
    )
    return [
        {
            "name": f"{row['band']} claims",
            "fraud": int(row["fraud"]),
            "confidence": round_float(row["confidence"], 3),
        }
        for _, row in grouped.iterrows()
    ]


def build_claim_graph():
    df = load_dataset("claim")
    if df.empty:
        return []

    counts = df["target"].value_counts().to_dict()
    approved = int(counts.get(1, 0))
    rejected = int(counts.get(0, 0))
    return [
        {"name": "Likely Approved", "value": approved},
        {"name": "Likely Rejected", "value": rejected},
    ]


def build_dataset_summary():
    risk_df = load_dataset("risk")
    price_df = load_dataset("price")
    fraud_df = load_dataset("fraud")
    claim_df = load_dataset("claim")
    workers_df = read_user_dataset()

    return {
        "datasets": {
            "riskRecords": int(len(risk_df.index)),
            "priceRecords": int(len(price_df.index)),
            "fraudRecords": int(len(fraud_df.index)),
            "claimRecords": int(len(claim_df.index)),
            "storedWorkers": int(len(workers_df.index)),
        },
        "graphs": {
            "risk": build_risk_graph(),
            "price": build_price_graph(),
            "fraud": build_fraud_graph(),
            "claim": build_claim_graph(),
        },
        "workers": workers_df.tail(10).fillna("").to_dict("records") if not workers_df.empty else [],
        "timestamp": datetime.now().isoformat(),
    }


def build_worker_insights(worker_record):
    risk_payload = {
        "age": int(worker_record.get("age", 30)),
        "gig_type": worker_record.get("gig_type", "Delivery"),
        "monthly_income": int(worker_record.get("monthly_income", 30000)),
        "work_hours_per_week": int(worker_record.get("work_hours_per_week", 48)),
        "night_shift_ratio": float(worker_record.get("night_shift_ratio", 0.3)),
        "vehicle_age_years": int(worker_record.get("vehicle_age_years", 4)),
        "traffic_violations": int(worker_record.get("traffic_violations", 0)),
        "health_score": float(worker_record.get("health_score", 72)),
        "city_tier": int(worker_record.get("city_tier", 1)),
        "coverage_gap_days": int(worker_record.get("coverage_gap_days", 0)),
    }
    price_payload = {
        "age": int(worker_record.get("age", 30)),
        "gig_platform": worker_record.get("gig_platform", "Zepto"),
        "monthly_income": int(worker_record.get("monthly_income", 30000)),
        "work_hours_per_week": int(worker_record.get("work_hours_per_week", 48)),
        "years_experience": int(worker_record.get("years_experience", 2)),
        "health_condition": worker_record.get("health_condition", "Fair"),
        "coverage_type": worker_record.get("coverage_type", "Accident Only"),
        "location_risk_score": float(worker_record.get("location_risk_score", 5.0)),
        "num_dependents": int(worker_record.get("num_dependents", 0)),
        "past_accidents": int(worker_record.get("past_accidents", 0)),
        "city_tier": int(worker_record.get("city_tier", 1)),
    }

    insights = {
        "predictedRisk": None,
        "estimatedWeeklyPrice": None,
    }

    try:
        insights["predictedRisk"] = round_float(prediction_to_scalar(predict_single("risk", risk_payload)["risk"]), 4)
    except Exception:
        pass

    try:
        price_prediction = prediction_to_scalar(predict_single("price", price_payload)["price"])
        insights["estimatedWeeklyPrice"] = round_float(float(price_prediction) / 52, 2)
    except Exception:
        pass

    return insights


@app.route("/predict/<model_type>", methods=["POST"])
def predict(model_type):
    try:
        if model_type not in models:
            return jsonify({"error": f"Model {model_type} not loaded"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        return jsonify(predict_single(model_type, data))
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/batch-predict/<model_type>", methods=["POST"])
def batch_predict(model_type):
    try:
        if model_type not in models:
            return jsonify({"error": f"Model {model_type} not loaded"}), 404

        data = request.get_json()
        if not data or not isinstance(data, list):
            return jsonify({"error": "Expected list of records"}), 400

        df = encode_input_data(data, model_type)
        predictions = models[model_type].predict(df)
        response = {
            "predictions": predictions.tolist(),
            "count": len(predictions),
            "timestamp": datetime.now().isoformat(),
        }

        if hasattr(models[model_type], "predict_proba"):
            response["probabilities"] = models[model_type].predict_proba(df).tolist()

        return jsonify(response)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/store-worker", methods=["POST"])
def store_worker_data():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        worker_id = data.get("worker_id") or f"W{int(datetime.now().timestamp())}"
        record = {**data, "worker_id": worker_id, "timestamp": data.get("timestamp", datetime.now().isoformat())}
        merged = append_user_record(record)

        return jsonify(
            {
                "status": "success",
                "worker_id": worker_id,
                "message": "Worker data stored successfully",
                "total_workers": int(len(merged.index)),
            }
        ), 201
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/workers", methods=["GET"])
def get_workers():
    try:
        df = read_user_dataset()
        return jsonify(df.fillna("").to_dict("records") if not df.empty else [])
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/workers/<worker_id>", methods=["GET"])
def get_worker(worker_id):
    try:
        df = read_user_dataset()
        if df.empty or "worker_id" not in df.columns:
            return jsonify({"error": "Worker not found"}), 404

        worker_df = df[df["worker_id"] == worker_id]
        if worker_df.empty:
            return jsonify({"error": "Worker not found"}), 404

        record = worker_df.iloc[-1].replace({np.nan: None}).to_dict()
        return jsonify(record)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/workers/<worker_id>/insights", methods=["GET"])
def get_worker_insights(worker_id):
    try:
        df = read_user_dataset()
        if df.empty or "worker_id" not in df.columns:
            return jsonify({"error": "Worker not found"}), 404

        worker_df = df[df["worker_id"] == worker_id]
        if worker_df.empty:
            return jsonify({"error": "Worker not found"}), 404

        record = worker_df.iloc[-1].replace({np.nan: None}).to_dict()
        insights = build_worker_insights(record)
        return jsonify({"worker": record, "insights": insights, "timestamp": datetime.now().isoformat()})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/analytics", methods=["GET"])
def analytics():
    try:
        return jsonify(build_dataset_summary())
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "healthy",
            "models_loaded": sorted(list(models.keys())),
            "datasets_available": {key: os.path.exists(path) for key, path in DATASET_FILES.items()},
            "timestamp": datetime.now().isoformat(),
        }
    )


load_models()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
