/**
 * API client for the YANKA backend.
 * Set NEXT_PUBLIC_API_URL in .env.local (e.g. http://localhost:4000).
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(
  path: string,
  options?: Omit<RequestInit, "body"> & { body?: unknown }
): Promise<T> {
  const { body, ...rest } = options ?? {};
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...rest.headers,
    },
    ...(body !== undefined && {
      body: JSON.stringify(body) as BodyInit,
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  /** Health check */
  health: () => request<{ ok: boolean; message: string }>("/api/health"),

  /** Get data from backend */
  getData: () =>
    request<{ data: Record<string, unknown>; message: string }>("/api/data"),

  /** Send data to backend */
  sendData: (data: Record<string, unknown>) =>
    request<{ ok: boolean; received: Record<string, unknown> }>("/api/data", {
      method: "POST",
      body: data,
    }),

  /** Video analytics: get ML prediction from backend */
  getVideoPrediction: (metrics: {
    video_topic?: string;
    video_duration: number;
    time_watched: number;
    skip_count: number;
    pause_count: number;
  }) =>
    request<{ ok: boolean; prediction: number | string }>(
      "/api/video-analytics/predict",
      { method: "POST", body: { video_topic: "general", ...metrics } }
    ),
};
