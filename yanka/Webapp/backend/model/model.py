import joblib

import numpy as np
import pandas as pd

model = joblib.load("model/random_forest_model.pkl")
encoder = joblib.load("model/one_hot_encoder.pkl")
# Encoder was fitted only on video_topic; model expects encoded topic + 4 numeric cols (26 features)
KNOWN_TOPICS = list(encoder.categories_[0])
TOPIC_FALLBACK = KNOWN_TOPICS[0]

NUMERIC_COLUMNS = ["video_duration", "time_watched", "skip_count", "pause_count"]


def _normalize_metrics(metrics: dict) -> dict:
    """Ensure video_topic is one of the encoder's known categories."""
    out = dict(metrics)
    if out.get("video_topic") not in KNOWN_TOPICS:
        out["video_topic"] = TOPIC_FALLBACK
    return out


def predict(metrics: dict):
    """
    Run model prediction on video analytics metrics.
    metrics: dict with video_topic, video_duration, time_watched, skip_count, pause_count
    """
    metrics = _normalize_metrics(metrics)
    # Encoder expects only the video_topic column (as fitted)
    topic_df = pd.DataFrame([{"video_topic": metrics["video_topic"]}])
    encoded = encoder.transform(topic_df)
    # Model expects [encoded topic columns, then numeric columns]
    numeric = np.array(
        [
            [
                metrics["video_duration"],
                metrics["time_watched"],
                metrics["skip_count"],
                metrics["pause_count"],
            ]
        ],
        dtype=np.float64,
    )
    features = np.hstack([encoded, numeric])
    prediction = model.predict(features)[0]
    return prediction
