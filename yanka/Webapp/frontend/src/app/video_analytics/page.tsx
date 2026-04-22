"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import DashboardNavBar from "../../components/DashboardNavBar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import styles from "./video_analytics.module.css";

interface AnalyticsEvent {
  type: string;
  timestamp: number;
  videoTime: number;
  value?: string | number | boolean | Record<string, unknown> | null;
}

const VideoAnalytics = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [playCount, setPlayCount] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [seekCount, setSeekCount] = useState(0);
  const [speedChangeCount, setSpeedChangeCount] = useState(0);
  const pauseCountBaselineRef = useRef(0);
  const seekCountBaselineRef = useRef(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [replayCount, setReplayCount] = useState(0);
  const [lastDetectedTime, setLastDetectedTime] = useState(0);
  const watchStartVideoTimeRef = useRef<number | null>(null);
  const [prediction, setPrediction] = useState<number | string | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [lastSentMetrics, setLastSentMetrics] = useState<Record<string, number | string> | null>(null);

  // Confusion popup (end-of-video: no "Maybe later" — nothing left to defer to in-session)
  const [showConfusionModal, setShowConfusionModal] = useState(false);
  const [confusionModalFromEnd, setConfusionModalFromEnd] = useState(false);

  // Trigger guards — prevent each milestone from firing more than once per session
  const midCheckSent  = useRef(false);
  const lateCheckSent = useRef(false);
  const endCheckSent  = useRef(false);

  // "none" | "snoozed" (maybe later — defer, may show again) | "accepted_help" | "dismissed"
  const helpDecision = useRef<"none" | "snoozed" | "dismissed" | "accepted_help">("none");

  // Track analytics event
  const trackEvent = (type: string, value?: string | number | boolean | Record<string, unknown> | null) => {
    if (!videoRef.current) return;

    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      videoTime: videoRef.current.currentTime,
      value,
    };

    setAnalytics((prev) => [...prev, event]);
    console.log("Analytics Event:", event);
  };

  // Handle play
  const handlePlay = () => {
    if (!videoRef.current) return;

    setIsPlaying(true);
    setPlayCount((prev) => prev + 1);
    watchStartVideoTimeRef.current = videoRef.current.currentTime;

    if (pauseStartTime) {
      const pauseDuration = Date.now() - pauseStartTime;
      trackEvent("pause_duration", pauseDuration);
      setPauseStartTime(null);
    }

    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }

    trackEvent("play");
    videoRef.current.play();
    // Note: Replay detection is handled in handleVideoPlay to catch all play events
  };

  // Handle pause
  const handlePause = () => {
    if (!videoRef.current) return;

    if (watchStartVideoTimeRef.current !== null) {
      const watched = videoRef.current.currentTime - watchStartVideoTimeRef.current;
      if (watched > 0) {
        setTotalWatchTime((prev) => prev + watched);
      }
      watchStartVideoTimeRef.current = null;
    }

    setIsPlaying(false);
    setPauseCount((prev) => prev + 1);
    setPauseStartTime(Date.now());
    trackEvent("pause");
    videoRef.current.pause();
  };

  // Handle time update — polls currentTime for UI display and replay detection only
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      const interval = setInterval(() => {
        if (videoRef.current) {
          const newTime = videoRef.current.currentTime;
          // Detect replay if video was completed and time jumps back to near start
          if (isCompleted && newTime < 2 && lastDetectedTime > duration * 0.9 && duration > 0) {
            setReplayCount((prev) => {
              const newCount = prev + 1;
              trackEvent("replay", { replayNumber: newCount, method: "auto_restart" });
              return newCount;
            });
            setIsCompleted(false);
            setLastDetectedTime(newTime);
          } else {
            setLastDetectedTime(newTime);
          }
          setCurrentTime(newTime);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isCompleted, lastDetectedTime, duration]);

  // Send video metrics to backend and get ML prediction.
  // trigger: "manual" = button click; "mid" = 50%; "late" = 75%; "end" = video finished.
  // metricOverrides lets handleEnded pass the final computed watch time before state re-renders.
  const sendAnalyticsToBackend = useCallback(async (
    trigger: "manual" | "mid" | "late" | "end" = "manual",
    metricOverrides?: { time_watched?: number },
  ) => {
    if (trigger === "manual") setPrediction(null);
    setPredictionError(null);
    setPredictionLoading(true);
    const metrics = {
      video_topic: "Yanka platform overview",
      video_duration: Number((duration / 60).toFixed(2)) || 0,
      time_watched: metricOverrides?.time_watched ?? (Number((totalWatchTime / 60).toFixed(2)) || 0),
      skip_count: Math.max(0, seekCount - seekCountBaselineRef.current),
      pause_count: Math.max(0, pauseCount - pauseCountBaselineRef.current),
    };
    setLastSentMetrics(metrics);
    try {
      const result = await api.getVideoPrediction(metrics);
      // Normalize to guard against whitespace or casing differences from the model
      const p = (result.prediction as string).trim().toLowerCase();
      setPrediction(p);

      const qualifies = p === "high" || (p === "medium" && trigger === "end");
      const canShowPopup = helpDecision.current !== "dismissed" && qualifies;

      if (canShowPopup) {
        // Pause directly on the element so pauseCount isn't incremented.
        // Flush the in-progress watch segment first so that time isn't lost.
        if (videoRef.current && !videoRef.current.paused) {
          if (watchStartVideoTimeRef.current !== null) {
            const watched = videoRef.current.currentTime - watchStartVideoTimeRef.current;
            if (watched > 0) setTotalWatchTime((prev) => prev + watched);
            watchStartVideoTimeRef.current = null;
          }
          videoRef.current.pause();
          setIsPlaying(false);
        }
        setConfusionModalFromEnd(trigger === "end");
        setShowConfusionModal(true);
      }
    } catch (err) {
      setPredictionError(err instanceof Error ? err.message : "Failed to get prediction");
    } finally {
      setPredictionLoading(false);
    }
  }, [duration, totalWatchTime, seekCount, pauseCount]);

  // Milestone checks: fire prediction at 50% and 75% of video progress.
  // Compute real-time watch time here to include the in-progress playing segment,
  // which hasn't been flushed to totalWatchTime state yet.
  useEffect(() => {
    if (duration <= 0) return;
    const pct = currentTime / duration;

    const getCurrentWatchTimeMins = () => {
      const inProgressSecs =
        watchStartVideoTimeRef.current !== null && videoRef.current
          ? Math.max(0, videoRef.current.currentTime - watchStartVideoTimeRef.current)
          : 0;
      return Number(((totalWatchTime + inProgressSecs) / 60).toFixed(2)) || 0;
    };

    if (pct >= 0.5 && !midCheckSent.current) {
      midCheckSent.current = true;
      sendAnalyticsToBackend("mid", { time_watched: getCurrentWatchTimeMins() });
    }
    if (pct >= 0.75 && !lateCheckSent.current) {
      lateCheckSent.current = true;
      sendAnalyticsToBackend("late", { time_watched: getCurrentWatchTimeMins() });
    }
  }, [currentTime, duration, totalWatchTime, sendAnalyticsToBackend]);

  // Handle video loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      trackEvent("video_loaded", { duration: videoRef.current.duration });
    }
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;

    const newTime = parseFloat(e.target.value);
    const seekDirection = newTime > currentTime ? "forward" : "backward";
    const seekAmount = Math.abs(newTime - currentTime);

    // Detect replay: if video was completed and user seeks back to near the start
    if (isCompleted && newTime < 2 && seekDirection === "backward") {
      setReplayCount((prev) => {
        const newCount = prev + 1;
        trackEvent("replay", { replayNumber: newCount, method: "seek" });
        return newCount;
      });
      setIsCompleted(false);
      midCheckSent.current  = false;
      lateCheckSent.current = false;
      endCheckSent.current  = false;
      helpDecision.current  = "none";
      pauseCountBaselineRef.current = 0;
      seekCountBaselineRef.current = 0;
    }

    // Flush the current watch segment before jumping, so rewatched sections count
    if (isPlaying && watchStartVideoTimeRef.current !== null) {
      const watched = videoRef.current.currentTime - watchStartVideoTimeRef.current;
      if (watched > 0) {
        setTotalWatchTime((prev) => prev + watched);
      }
      watchStartVideoTimeRef.current = newTime;
    }

    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
    setSeekCount((prev) => prev + 1);
    trackEvent("seek", { direction: seekDirection, amount: seekAmount, to: newTime });
  };

  // Handle playback rate change
  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;

    setPlaybackRate(speed);
    videoRef.current.playbackRate = speed;
    setSpeedChangeCount((prev) => prev + 1);
    trackEvent("playback_speed_change", { speed });
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;

    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    trackEvent("volume_change", { volume: newVolume });
  };

  // Handle video end
  const handleEnded = () => {
    if (endCheckSent.current) return;
    endCheckSent.current = true;

    // Compute the final watch time before the state update lands
    let finalWatchTime = totalWatchTime;
    if (videoRef.current && watchStartVideoTimeRef.current !== null) {
      const watched = videoRef.current.currentTime - watchStartVideoTimeRef.current;
      if (watched > 0) {
        finalWatchTime += watched;
        setTotalWatchTime(finalWatchTime);
      }
      watchStartVideoTimeRef.current = null;
    }

    setIsPlaying(false);
    setIsCompleted(true);
    if (sessionStartTime) {
      const totalSessionTime = Date.now() - sessionStartTime;
      setCompletionTime(totalSessionTime);
      trackEvent("video_completed", { totalSessionTime });
    }
    console.log("Video ended - isCompleted set to true");

    // Auto-send at end with accurate final watch time
    sendAnalyticsToBackend("end", {
      time_watched: Number((finalWatchTime / 60).toFixed(2)) || 0,
    });
  };

  // Handle video play event (catches all play events including automatic restarts)
  const handleVideoPlay = () => {
    if (!videoRef.current) return;
    
    // Detect replay: if video was completed and is now playing
    if (isCompleted) {
      console.log("Replay detected!");
      setReplayCount((prev) => {
        const newCount = prev + 1;
        trackEvent("replay", { replayNumber: newCount, method: "video_play_event" });
        console.log("Replay count updated to:", newCount);
        return newCount;
      });
      setIsCompleted(false);
      // Ensure video starts from beginning
      if (videoRef.current.currentTime > 2) {
        videoRef.current.currentTime = 0;
      }
      watchStartVideoTimeRef.current = videoRef.current.currentTime;

      // Reset all trigger guards and help state so the new session runs fresh
      midCheckSent.current  = false;
      lateCheckSent.current = false;
      endCheckSent.current  = false;
      helpDecision.current  = "none";
      pauseCountBaselineRef.current = 0;
      seekCountBaselineRef.current = 0;
    }
  };

  // Handle buffering
  const handleWaiting = () => {
    trackEvent("buffering_start");
  };

  const handleCanPlay = () => {
    trackEvent("buffering_end");
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get analytics summary
  const getAnalyticsSummary = () => {
    const totalSessionTime = sessionStartTime ? Date.now() - sessionStartTime : 0;
    const completionPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
    const averageWatchTime = playCount > 0 ? totalWatchTime / playCount : 0;

    return {
      totalSessionTime: Math.floor(totalSessionTime / 1000), // in seconds
      completionPercentage: completionPercentage.toFixed(2),
      averageWatchTime: averageWatchTime.toFixed(2),
      isCompleted,
      completionTime: completionTime ? Math.floor(completionTime / 1000) : null,
    };
  };

  const handleModalResponse = (response: string) => {
    if (response === "Maybe later") {
      helpDecision.current = "snoozed";
    } else if (response === "Yes, help me") {
      pauseCountBaselineRef.current = pauseCount;
      seekCountBaselineRef.current = seekCount;
      // Mid-session help: suppress further 50%/75% popups but allow one more at video end if model qualifies.
      helpDecision.current = isCompleted ? "dismissed" : "accepted_help";
    } else {
      helpDecision.current = "dismissed";
    }
    setShowConfusionModal(false);
    setConfusionModalFromEnd(false);

    // Resume playback for dismissals — but not when the student wants help
    if (response !== "Yes, help me" && videoRef.current && !isCompleted) {
      videoRef.current.play();
      setIsPlaying(true);
      watchStartVideoTimeRef.current = videoRef.current.currentTime;
    }
  };

  const summary = getAnalyticsSummary();

  return (
    <>
      <DashboardNavBar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Video Analytics</h1>
          <p className={styles.subtitle}>
            Watch the video below. All interactions are being tracked for analytics.
          </p>

          <div className={styles.videoSection}>
            <div className={styles.videoWrapper}>
              <video
                ref={videoRef}
                className={styles.video}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onPlay={handleVideoPlay}
                onWaiting={handleWaiting}
                onCanPlay={handleCanPlay}
                controls={false}
              >
                <source src="/video/test.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className={styles.controls}>
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  className={styles.playButton}
                >
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>

                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className={styles.seekBar}
                />

                <span className={styles.timeDisplay}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className={styles.speedControls}>
                  <label>Speed:</label>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`${styles.speedButton} ${
                        playbackRate === speed ? styles.active : ""
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <div className={styles.volumeControl}>
                  <label>Volume:</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className={styles.volumeSlider}
                  />
                  <span>{Math.round(volume * 100)}%</span>
                </div>
              </div>
            </div>

            <div className={styles.analyticsPanel}>
              <h2 className={styles.panelTitle}>Live Analytics</h2>

              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <h3>Play Count</h3>
                  <p className={styles.metricValue}>{playCount}</p>
                </div>
                <div className={styles.metricCard}>
                  <h3>Pause Count</h3>
                  <p className={styles.metricValue}>{pauseCount}</p>
                </div>
                <div className={styles.metricCard}>
                  <h3>Seek Count</h3>
                  <p className={styles.metricValue}>{seekCount}</p>
                </div>
                <div className={styles.metricCard}>
                  <h3>Speed Changes</h3>
                  <p className={styles.metricValue}>{speedChangeCount}</p>
                </div>
                <div className={styles.metricCard}>
                  <h3>Watch Time</h3>
                  <p className={styles.metricValue}>{formatTime(totalWatchTime)}</p>
                </div>
                <div className={styles.metricCard}>
                  <h3>Completion</h3>
                  <p className={styles.metricValue}>
                    {summary.completionPercentage}%
                  </p>
                </div>
                <div className={styles.metricCard}>
                  <h3>Replay Count</h3>
                  <p className={styles.metricValue}>{replayCount}</p>
                </div>
              </div>

              <div className={styles.summaryCard}>
                <h3>Session Summary</h3>
                <ul className={styles.summaryList}>
                  <li>
                    <strong>Total Session Time:</strong>{" "}
                    {formatTime(summary.totalSessionTime)}
                  </li>
                  <li>
                    <strong>Video Completed:</strong>{" "}
                    {isCompleted ? "Yes" : "No"}
                  </li>
                  {completionTime && (
                    <li>
                      <strong>Time to Complete:</strong>{" "}
                      {formatTime(completionTime / 1000)}
                    </li>
                  )}
                  <li>
                    <strong>Current Playback Speed:</strong> {playbackRate}x
                  </li>
                  <li>
                    <strong>Current Volume:</strong> {Math.round(volume * 100)}%
                  </li>
                </ul>
              </div>

              <button
                onClick={() => sendAnalyticsToBackend("manual")}
                className={styles.sendButton}
                disabled={predictionLoading}
              >
                {predictionLoading ? "Getting prediction…" : "Send Analytics & Get Prediction"}
              </button>

              {(prediction !== null || predictionError || lastSentMetrics) && (
                <div className={styles.predictionCard}>
                  {lastSentMetrics && (
                    <div className={styles.metricsList}>
                      <h4>Metrics sent</h4>
                      <ul>
                        <li>video_topic: {String(lastSentMetrics.video_topic)}</li>
                        <li>video_duration: {String(lastSentMetrics.video_duration)}m</li>
                        <li>time_watched: {String(lastSentMetrics.time_watched)}m</li>
                        <li>skip_count: {String(lastSentMetrics.skip_count)}</li>
                        <li>pause_count: {String(lastSentMetrics.pause_count)}</li>
                      </ul>
                    </div>
                  )}
                  <h3>User Confusion Prediction</h3>
                  {predictionError ? (
                    <p className={styles.predictionError}>{predictionError}</p>
                  ) : prediction !== null ? (
                    <p className={styles.predictionValue}>{String(prediction)}</p>
                  ) : null}
                </div>
              )}

              <div className={styles.eventsLog}>
                <h3>Event Log (Last 10)</h3>
                <div className={styles.eventsList}>
                  {analytics.slice(-10).reverse().map((event, index) => (
                    <div key={index} className={styles.eventItem}>
                      <span className={styles.eventType}>{event.type}</span>
                      <span className={styles.eventTime}>
                        {formatTime(event.videoTime)}
                      </span>
                      {event.value && (
                        <span className={styles.eventValue}>
                          {JSON.stringify(event.value)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {showConfusionModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="confusionTitle">
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className={styles.modalTitle} id="confusionTitle">
              Looks like you might need a hand
            </h2>
            <p className={styles.modalBody}>
              Our system noticed some patterns that suggest you may be finding this section tricky,
              which is completely okay! Would you like us to provide a deeper explanation or
              additional resources for this topic?
            </p>
            <div className={styles.modalActions}>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
                onClick={() => handleModalResponse("Yes, help me")}
              >
                Yes, help me
              </button>
              {!confusionModalFromEnd && (
                <button
                  className={`${styles.modalBtn} ${styles.modalBtnSecondary}`}
                  onClick={() => handleModalResponse("Maybe later")}
                >
                  Maybe later
                </button>
              )}
              <button
                className={`${styles.modalBtn} ${styles.modalBtnGhost}`}
                onClick={() => handleModalResponse("No thanks")}
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoAnalytics;
