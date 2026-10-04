"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { ReelData } from "../ReelCard/ReelCard";
import { useReelsAnalytics } from "@/app/hooks/useReelsAnalytics";
import styles from "./ReelViewer.module.css";

interface ReelViewerProps {
  reels: ReelData[];
  initialIndex: number;
  onClose: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 1.25, 1.5, 2];
const SEEK_SECONDS = 10;
const DOUBLE_TAP_MS = 300;
const LONG_PRESS_MS = 500;

function getEmbedUrl(reel: ReelData): string | null {
  const url = reel.embedUrl;
  if (!url) return null;

  if (reel.embedType === "INSTAGRAM") {
    const cleanUrl = url.split("?")[0];
    return cleanUrl.endsWith("/") ? `${cleanUrl}embed` : `${cleanUrl}/embed`;
  }

  if (reel.embedType === "TIKTOK") {
    const match = url.match(/video\/(\d+)/);
    if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }

  if (reel.embedType === "YOUTUBE_SHORTS") {
    const match = url.match(/(?:shorts\/|v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match)
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=0`;
  }

  return url;
}

export default function ReelViewer({
  reels,
  initialIndex,
  onClose,
}: ReelViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [seekIndicator, setSeekIndicator] = useState<{
    side: "left" | "right";
    seconds: number;
  } | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const viewedReelsRef = useRef<Set<number>>(new Set([initialIndex]));
  const lastTapTimeRef = useRef(0);
  const singleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seekIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const savedRateRef = useRef(1);
  const longPressEndedRef = useRef(false);

  const { trackReelView, trackReelSwipe, trackViewerClose } =
    useReelsAnalytics();

  const currentReel = reels[currentIndex];
  const hasNext = currentIndex < reels.length - 1;
  const hasPrev = currentIndex > 0;
  const isNativeVideo = !!currentReel.videoUrl;

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      if (seekIndicatorTimerRef.current)
        clearTimeout(seekIndicatorTimerRef.current);
    };
  }, []);

  // Register view + analytics on reel change
  useEffect(() => {
    fetch(`/api/reels/${currentReel.id}/view`, { method: "POST" }).catch(
      () => {}
    );

    if (viewedReelsRef.current.size > 1 || currentIndex !== initialIndex) {
      trackReelView(currentReel, "viewer_navigation");
    }

    viewedReelsRef.current.add(currentIndex);
    setProgress(0);
    setIsPlaying(true);
    setPlaybackRate(1);
  }, [currentReel, currentIndex, initialIndex, trackReelView]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // Progress bar scrubbing
  const scrubToPosition = useCallback((clientX: number) => {
    if (
      !videoRef.current ||
      !progressBarRef.current ||
      isNaN(videoRef.current.duration)
    )
      return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pct * videoRef.current.duration;
    setProgress(pct * 100);
  }, []);

  // Document-level mouse listeners for progress bar scrubbing
  useEffect(() => {
    if (!isScrubbing) return;
    const onMove = (e: MouseEvent) => scrubToPosition(e.clientX);
    const onUp = () => setIsScrubbing(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isScrubbing, scrubToPosition]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && !isScrubbing) {
      const pct =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isNaN(pct) ? 0 : pct);
    }
  }, [isScrubbing]);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const seekBy = useCallback((seconds: number) => {
    if (!videoRef.current || isNaN(videoRef.current.duration)) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + seconds
      )
    );
    if (seekIndicatorTimerRef.current)
      clearTimeout(seekIndicatorTimerRef.current);
    setSeekIndicator({
      side: seconds > 0 ? "right" : "left",
      seconds: Math.abs(seconds),
    });
    seekIndicatorTimerRef.current = setTimeout(
      () => setSeekIndicator(null),
      800
    );
  }, []);

  // Single tap = play/pause, double tap = seek ±10s
  const handleVideoTap = useCallback(
    (e: React.MouseEvent<HTMLVideoElement>) => {
      if (longPressEndedRef.current) return;

      const now = Date.now();
      if (now - lastTapTimeRef.current < DOUBLE_TAP_MS) {
        if (singleTapTimerRef.current) {
          clearTimeout(singleTapTimerRef.current);
          singleTapTimerRef.current = null;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const isLeftHalf = e.clientX - rect.left < rect.width / 2;
        seekBy(isLeftHalf ? -SEEK_SECONDS : SEEK_SECONDS);
        lastTapTimeRef.current = 0;
      } else {
        lastTapTimeRef.current = now;
        singleTapTimerRef.current = setTimeout(() => {
          togglePlayPause();
          singleTapTimerRef.current = null;
        }, DOUBLE_TAP_MS);
      }
    },
    [togglePlayPause, seekBy]
  );

  const handleScrubMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsScrubbing(true);
      scrubToPosition(e.clientX);
    },
    [scrubToPosition]
  );

  const handleProgressTouch = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      scrubToPosition(e.touches[0].clientX);
    },
    [scrubToPosition]
  );

  // Cycle playback speed
  const cycleSpeed = useCallback(() => {
    const idx = SPEED_OPTIONS.indexOf(playbackRate);
    setPlaybackRate(SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length]);
  }, [playbackRate]);

  // Long press = temporary 2x
  const handleLongPressStart = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      if (videoRef.current) {
        savedRateRef.current = videoRef.current.playbackRate;
        videoRef.current.playbackRate = 2;
        setIsLongPress(true);
      }
    }, LONG_PRESS_MS);
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (isLongPress && videoRef.current) {
      videoRef.current.playbackRate = savedRateRef.current;
      setPlaybackRate(savedRateRef.current);
      setIsLongPress(false);
      longPressEndedRef.current = true;
      setTimeout(() => {
        longPressEndedRef.current = false;
      }, 100);
    }
  }, [isLongPress]);

  const handleLongPressMove = useCallback(() => {
    if (longPressTimerRef.current && !isLongPress) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, [isLongPress]);

  const handleClose = useCallback(() => {
    trackViewerClose(currentReel, viewedReelsRef.current.size);
    onClose();
  }, [currentReel, onClose, trackViewerClose]);

  // Keyboard: Esc, Up/Down nav, Left/Right seek
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowUp" && hasPrev) setCurrentIndex((i) => i - 1);
      if (e.key === "ArrowDown" && hasNext) setCurrentIndex((i) => i + 1);
      if (e.key === "ArrowLeft" && isNativeVideo) seekBy(-5);
      if (e.key === "ArrowRight" && isNativeVideo) seekBy(5);
    },
    [handleClose, hasPrev, hasNext, isNativeVideo, seekBy]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
    handleLongPressMove();
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && hasNext) {
      trackReelSwipe("up", reels[currentIndex], reels[currentIndex + 1]);
      setCurrentIndex((i) => i + 1);
    }
    if (distance < -minSwipeDistance && hasPrev) {
      trackReelSwipe("down", reels[currentIndex], reels[currentIndex - 1]);
      setCurrentIndex((i) => i - 1);
    }
  };

  const goNext = () => {
    if (hasNext) {
      trackReelSwipe("up", reels[currentIndex], reels[currentIndex + 1]);
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (hasPrev) {
      trackReelSwipe("down", reels[currentIndex], reels[currentIndex - 1]);
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        ref={containerRef}
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <img
              src="/assets/images/logo-racing-mobil.webp"
              alt="King Brake"
              className={styles.logoImg}
            />
          </div>
          <div className={styles.headerActions}>
            {isNativeVideo && (
              <button
                className={styles.speedButton}
                onClick={cycleSpeed}
                aria-label={`Velocidad ${playbackRate}x`}
              >
                {playbackRate}x
              </button>
            )}
            <button
              className={styles.muteButton}
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>
        </header>

        {/* Video */}
        <div className={styles.videoContainer}>
          {currentReel.videoUrl ? (
            <>
              <video
                key={currentReel.id}
                ref={videoRef}
                src={currentReel.videoUrl}
                className={styles.video}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                poster={currentReel.thumbnailUrl}
                onClick={handleVideoTap}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onPointerDown={handleLongPressStart}
                onPointerUp={handleLongPressEnd}
                onPointerLeave={handleLongPressEnd}
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* Play/Pause overlay */}
              {!isPlaying && (
                <div className={styles.playOverlay} onClick={togglePlayPause}>
                  <Play size={48} fill="white" />
                </div>
              )}

              {/* Seek indicator (double-tap feedback) */}
              {seekIndicator && (
                <div
                  key={`${seekIndicator.side}-${Date.now()}`}
                  className={`${styles.seekIndicator} ${
                    seekIndicator.side === "left"
                      ? styles.seekLeft
                      : styles.seekRight
                  }`}
                >
                  <div className={styles.seekIconWrapper}>
                    {seekIndicator.side === "left" ? (
                      <RotateCcw size={28} />
                    ) : (
                      <RotateCw size={28} />
                    )}
                    <span>{seekIndicator.seconds}s</span>
                  </div>
                </div>
              )}

              {/* Long press 2x indicator */}
              {isLongPress && (
                <div className={styles.longPressIndicator}>2x ▸▸</div>
              )}

              {/* Interactive progress bar */}
              <div
                ref={progressBarRef}
                className={`${styles.progressBar} ${
                  isScrubbing ? styles.progressScrubbing : ""
                }`}
                onMouseDown={handleScrubMouseDown}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setIsScrubbing(true);
                  handleProgressTouch(e);
                }}
                onTouchMove={(e) => {
                  e.stopPropagation();
                  handleProgressTouch(e);
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  setIsScrubbing(false);
                }}
                role="slider"
                aria-label="Progreso del video"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
                <div
                  className={styles.progressThumb}
                  style={{ left: `${progress}%` }}
                />
              </div>
            </>
          ) : getEmbedUrl(currentReel) ? (
            <iframe
              key={currentReel.id}
              src={getEmbedUrl(currentReel)!}
              className={styles.iframe}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <img
              src={currentReel.thumbnailUrl}
              alt={currentReel.title}
              className={styles.video}
            />
          )}
        </div>

        {/* Info */}
        <div className={styles.reelInfo}>
          <h2 className={styles.reelTitle}>{currentReel.title}</h2>
          {currentReel.description && (
            <p className={styles.reelDescription}>{currentReel.description}</p>
          )}
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <button
            className={`${styles.navButton} ${
              !hasPrev ? styles.navDisabled : ""
            }`}
            onClick={goPrev}
            disabled={!hasPrev}
            aria-label="Video anterior"
          >
            <ChevronUp size={28} />
          </button>
          <button
            className={`${styles.navButton} ${
              !hasNext ? styles.navDisabled : ""
            }`}
            onClick={goNext}
            disabled={!hasNext}
            aria-label="Siguiente video"
          >
            <ChevronDown size={28} />
          </button>
        </div>

        {/* Dots */}
        <div className={styles.dots}>
          {reels.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentIndex ? styles.dotActive : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir al video ${index + 1}`}
            />
          ))}
        </div>

        {/* Swipe hint */}
        {hasNext && (
          <div className={styles.swipeHint}>
            <ChevronUp size={16} />
            <span>Desliza para ver más</span>
          </div>
        )}
      </div>
    </div>
  );
}
