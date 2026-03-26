FROM python:3.11-slim

WORKDIR /app

COPY yanka/Webapp/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY yanka/Webapp/backend/ .

RUN mkdir -p /app/assets/video
COPY yanka/Webapp/frontend/public/video/test.mp4 /app/assets/video/test.mp4

ENV VIDEO_PATH_OVERRIDE=/app/assets/video/test.mp4

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
