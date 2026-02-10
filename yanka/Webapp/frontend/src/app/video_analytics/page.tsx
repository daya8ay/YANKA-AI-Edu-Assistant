"use client";

import React, { useRef, useState, useEffect } from "react";
import DashboardNavBar from "../../components/DashboardNavBar";
import Footer from "@/components/Footer";
import styles from "./video_analytics.module.css";

interface AnalyticsEvent {
  type: string;
  timestamp: number;
  videoTime: number;
  value?: any;
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
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [replayCount, setReplayCount] = useState(0);
  const [lastDetectedTime, setLastDetectedTime] = useState(0);

  // Track analytics event
  const trackEvent = (type: string, value?: any) => {
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

    setIsPlaying(false);
    setPauseCount((prev) => prev + 1);
    setPauseStartTime(Date.now());
    trackEvent("pause");
    videoRef.current.pause();
  };

  // Handle time update
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      const interval = setInterval(() => {
        if (videoRef.current) {
          const newTime = videoRef.current.currentTime;
          // Detect replay if video was completed and time jumps back to near start
          // Only detect once per replay by checking if we haven't already detected this jump
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
          setTotalWatchTime((prev) => prev + 0.1);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isCompleted, lastDetectedTime, duration]);

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
      setIsCompleted(false); // Reset completion status
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
    setIsPlaying(false);
    setIsCompleted(true);
    if (sessionStartTime) {
      const totalSessionTime = Date.now() - sessionStartTime;
      setCompletionTime(totalSessionTime);
      trackEvent("video_completed", { totalSessionTime });
    }
    console.log("Video ended - isCompleted set to true");
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

  // Send analytics to backend (placeholder - implement your API call here)
  const sendAnalyticsToBackend = async () => {
    const summary = getAnalyticsSummary();
    const analyticsData = {
      events: analytics,
      summary,
      metrics: {
        playCount,
        pauseCount,
        seekCount,
        speedChangeCount,
        replayCount,
        totalWatchTime: Math.floor(totalWatchTime),
        currentTime: Math.floor(currentTime),
        duration: Math.floor(duration),
        playbackRate,
        volume,
      },
    };

    console.log("Sending analytics to backend:", analyticsData);
    
    // TODO: Replace with your actual backend API endpoint
    // try {
    //   const response = await fetch("http://localhost:8000/api/video-analytics", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(analyticsData),
    //   });
    //   if (response.ok) {
    //     console.log("Analytics sent successfully");
    //   }
    // } catch (error) {
    //   console.error("Error sending analytics:", error);
    // }
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
                <source src="/video/intro.mp4" type="video/mp4" />
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
                onClick={sendAnalyticsToBackend}
                className={styles.sendButton}
              >
                Send Analytics to Backend
              </button>

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
    </>
  );
};

export default VideoAnalytics;