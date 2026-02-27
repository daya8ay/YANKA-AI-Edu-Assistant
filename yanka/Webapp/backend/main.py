import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model.model import predict as model_predict

app = FastAPI(title="YANKA Backend")

frontend_origin = os.environ.get("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for demo (replace with DB later)
store: dict[str, Any] = {}


@app.get("/api/health")
def health():
    return {"ok": True, "message": "Backend is running"}


@app.get("/api/data")
def get_data():
    return {"data": store, "message": "Data from backend"}


@app.post("/api/data", status_code=201)
def post_data(body: dict[str, Any]):
    store.update(body)
    return {"ok": True, "received": body}


class VideoMetrics(BaseModel):
    video_topic: str = "general"
    video_duration: float
    time_watched: float
    skip_count: int
    pause_count: int


@app.post("/api/video-analytics/predict")
def video_analytics_predict(metrics: VideoMetrics):
    """Run ML model on video metrics and return prediction."""
    try:
        payload = {
            "video_topic": metrics.video_topic,
            "video_duration": metrics.video_duration,
            "time_watched": metrics.time_watched,
            "skip_count": metrics.skip_count,
            "pause_count": metrics.pause_count,
        }
        prediction = model_predict(payload)
        return {"ok": True, "prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "4000"))
    print(f"Backend running at http://localhost:{port}")
    print(f"CORS allowed for: {frontend_origin}")
    uvicorn.run(app, host="0.0.0.0", port=port)
