import joblib
import pandas as pd

model = joblib.load("model/xgboost_model.pkl")
encoder = joblib.load("model/label_encoder.pkl")


def predict(metrics: dict):
    """
    Run model prediction on video analytics metrics.
    metrics: dict with video_duration, time_watched, skip_count, pause_count
    Returns one of: "high", "medium", "low"
    """
    input_df = pd.DataFrame([metrics]).reindex(columns=model.feature_names_in_)
    encoded_prediction = model.predict(input_df)[0]
    return encoder.inverse_transform([encoded_prediction])[0]
