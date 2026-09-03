"use client";
import React, { useState, useRef, useEffect, useCallback, useId, Children } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { claimUnmute, onUnmuteClaimed } from "../hooks/useVideoMuteSync";

// ── Intersection Observer hook ────────────────────────────────────────────
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

// ── Fullscreen Video Modal ──────────────────────────────────────────────
function FullscreenVideoModal({ videoId, onClose, onOpen }: { videoId: string; onClose: () => void; onOpen?: () => void }) {
  useEffect(() => {
    onOpen?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1&vq=hd1080`}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          title="Fullscreen Video"
        />
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors"
      >
        <X size={24} />
      </button>
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────────
function VideoBlock16x9({ index, videoId }: { index: number; videoId?: string }) {
  const uid = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [containerRef, inView] = useInView(0.4);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    if (inView && !isMounted) setIsMounted(true);
  }, [inView, isMounted]);

  const sendCmd = useCallback((func: string, args?: unknown[]) => {
    const msg: Record<string, unknown> = { event: "command", func };
    if (args) msg.args = args;
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(msg), "*");
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (inView) {
      sendCmd("playVideo");
      setIsPlaying(true);
    } else {
      sendCmd("pauseVideo");
      setIsPlaying(false);
    }
  }, [inView, isMounted, sendCmd]);

  useEffect(() => {
    return onUnmuteClaimed((owner) => {
      if (owner !== uid && !isMuted) {
        sendCmd("mute");
        setIsMuted(true);
      }
    });
  }, [uid, isMuted, sendCmd]);

  const togglePlay = () => {
    const next = !isPlaying;
    sendCmd(next ? "playVideo" : "pauseVideo");
    setIsPlaying(next);
  };

  const toggleMute = () => {
    if (isMuted) {
      claimUnmute(uid);
      sendCmd("unMute");
      setIsMuted(false);
    } else {
      sendCmd("mute");
      setIsMuted(true);
    }
  };

  const replayVideo = () => {
    sendCmd("seekTo", [0, true]);
    if (!isPlaying) {
      setIsPlaying(true);
      sendCmd("playVideo");
    }
  };

  return (
    <>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06, duration: 0.6 }}
        className="relative aspect-video rounded-2xl bg-[#0e1a14] border border-white/5 flex items-center justify-center group hover:border-[#c6ff2e]/20 transition-all overflow-hidden"
      >
        {videoId ? (
          <>
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              {isMounted && (
                <iframe
                  ref={iframeRef}
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&mute=1&playsinline=1&fs=0&disablekb=1&vq=hd1080`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={`Video ${index}`}
                  loading="lazy"
                />
              )}
            </div>
            {/* Replay – bottom-left on mobile, center on desktop */}
            <div className="absolute bottom-3 left-3 md:inset-0 md:bottom-auto md:left-auto md:flex md:items-center md:justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 pointer-events-none md:w-full md:h-full">
              <button
                onClick={(e) => { e.stopPropagation(); replayVideo(); }}
                className="p-1.5 md:p-4 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors pointer-events-auto shadow-xl flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 md:w-7 md:h-7" />
              </button>
            </div>
            {/* Bottom controls – always visible on mobile, hover on desktop */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="p-2 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="p-2 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsFull(true); }}
                className="p-2 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </>
        ) : (
          <span className="text-[#7a8c7f]/40 font-heading font-bold text-sm uppercase tracking-widest group-hover:text-[#7a8c7f]/70 transition-colors">
            16:9 — {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </motion.div>
      {isFull && videoId && <FullscreenVideoModal videoId={videoId} onClose={() => { sendCmd("mute"); setIsMuted(true); setIsFull(false); }} onOpen={() => { claimUnmute("__fullscreen__"); sendCmd("mute"); setIsMuted(true); sendCmd("pauseVideo"); setIsPlaying(false); }} />}
    </>
  );
}

function VideoBlock9x16({ index, videoId }: { index: number; videoId?: string }) {
  const uid = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [containerRef, inView] = useInView(0.3);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    if (inView && !isMounted) setIsMounted(true);
  }, [inView, isMounted]);

  const sendCmd = useCallback((func: string, args?: unknown[]) => {
    const msg: Record<string, unknown> = { event: "command", func };
    if (args) msg.args = args;
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(msg), "*");
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (inView) {
      sendCmd("playVideo");
      setIsPlaying(true);
    } else {
      sendCmd("pauseVideo");
      setIsPlaying(false);
    }
  }, [inView, isMounted, sendCmd]);

  useEffect(() => {
    return onUnmuteClaimed((owner) => {
      if (owner !== uid && !isMuted) {
        sendCmd("mute");
        setIsMuted(true);
      }
    });
  }, [uid, isMuted, sendCmd]);

  const togglePlay = () => {
    const next = !isPlaying;
    sendCmd(next ? "playVideo" : "pauseVideo");
    setIsPlaying(next);
  };

  const toggleMute = () => {
    if (isMuted) {
      claimUnmute(uid);
      sendCmd("unMute");
      setIsMuted(false);
    } else {
      sendCmd("mute");
      setIsMuted(true);
    }
  };

  const replayVideo = () => {
    sendCmd("seekTo", [0, true]);
    if (!isPlaying) {
      setIsPlaying(true);
      sendCmd("playVideo");
    }
  };

  return (
    <>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06, duration: 0.6 }}
        className="relative aspect-[9/16] rounded-2xl bg-[#0e1a14] border border-white/5 flex items-center justify-center group hover:border-[#c6ff2e]/20 transition-all flex-shrink-0 w-[180px] md:w-[220px] h-auto overflow-hidden"
      >
        {videoId ? (
          <>
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              {isMounted && (
                <iframe
                  ref={iframeRef}
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&mute=1&playsinline=1&fs=0&disablekb=1&vq=hd1080`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={`Video 9:16 ${index}`}
                  loading="lazy"
                />
              )}
            </div>
            {/* Replay – bottom-left on mobile, center on desktop */}
            <div className="absolute bottom-2 left-2 md:inset-0 md:bottom-auto md:left-auto md:flex md:items-center md:justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 pointer-events-none md:w-full md:h-full">
              <button
                onClick={(e) => { e.stopPropagation(); replayVideo(); }}
                className="p-1 md:p-2.5 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors pointer-events-auto shadow-xl flex items-center justify-center"
              >
                <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
            {/* Bottom controls */}
            <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="p-1.5 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="p-1.5 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors"
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsFull(true); }}
                className="p-1.5 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors"
              >
                <Maximize2 size={12} />
              </button>
            </div>
          </>
        ) : (
          <span className="text-[#7a8c7f]/40 font-heading font-bold text-xs uppercase tracking-widest writing-mode-vertical group-hover:text-[#7a8c7f]/70 transition-colors">
            9:16 — {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </motion.div>
      {isFull && videoId && <FullscreenVideoModal videoId={videoId} onClose={() => { sendCmd("mute"); setIsMuted(true); setIsFull(false); }} onOpen={() => { claimUnmute("__fullscreen__"); sendCmd("mute"); setIsMuted(true); sendCmd("pauseVideo"); setIsPlaying(false); }} />}
    </>
  );
}

function PhotoBlock({ index, imageUrl }: { index: number; imageUrl?: string }) {
  const [isFull, setIsFull] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      className="relative aspect-[4/5] rounded-2xl bg-[#0e1a14] border border-white/5 flex items-center justify-center group hover:border-[#c6ff2e]/20 transition-all flex-shrink-0 w-[220px] md:w-[280px]"
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={`Photo ${index}`}
            className="w-full h-full object-cover rounded-2xl"
            loading="lazy"
            decoding="async"
          />
          <button
            onClick={(e) => { e.stopPropagation(); setIsFull(true); }}
            className="absolute top-2 right-2 p-2 rounded-full bg-[#080f0c]/60 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md"
          >
            <Maximize2 size={16} />
          </button>

          {isFull && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setIsFull(false)}>
              <img
                src={imageUrl}
                alt={`Photo ${index} Fullscreen`}
                className="max-w-full max-h-full object-contain rounded-lg"
                loading="lazy"
                decoding="async"
              />
              <button
                onClick={(e) => { e.stopPropagation(); setIsFull(false); }}
                className="absolute top-6 right-6 p-3 rounded-full bg-[#080f0c]/80 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          )}
        </>
      ) : (
        <span className="text-[#7a8c7f]/40 font-heading font-bold text-xs uppercase tracking-widest group-hover:text-[#7a8c7f]/70 transition-colors">
          PHOTO — {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </motion.div>
  );
}

function PhotoBlock16x9({ index, imageUrl }: { index: number; imageUrl?: string }) {
  const [isFull, setIsFull] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      className="relative aspect-[16/9] rounded-2xl bg-[#0e1a14] border border-white/5 flex items-center justify-center group hover:border-[#c6ff2e]/20 transition-all flex-shrink-0 w-full"
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={`Photo ${index}`}
            className="w-full h-full object-cover rounded-2xl"
            loading="lazy"
            decoding="async"
          />
          <button
            onClick={(e) => { e.stopPropagation(); setIsFull(true); }}
            className="absolute top-2 right-2 p-2 rounded-full bg-[#080f0c]/60 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md"
          >
            <Maximize2 size={16} />
          </button>

          {isFull && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setIsFull(false)}>
              <img
                src={imageUrl}
                alt={`Photo ${index} Fullscreen`}
                className="max-w-full max-h-full object-contain rounded-lg"
                loading="lazy"
                decoding="async"
              />
              <button
                onClick={(e) => { e.stopPropagation(); setIsFull(false); }}
                className="absolute top-6 right-6 p-3 rounded-full bg-[#080f0c]/80 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          )}
        </>
      ) : (
        <span className="text-[#7a8c7f]/40 font-heading font-bold text-xs uppercase tracking-widest group-hover:text-[#7a8c7f]/70 transition-colors">
          PHOTO — {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </motion.div>
  );
}

function TagCard({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ duration: 0.4 }}
      className="group px-6 py-5 rounded-xl border border-white/5 bg-[#0e1a14] hover:border-[#c6ff2e]/25 hover:bg-[#111c16] transition-all text-center cursor-default"
    >
      <span className="font-heading font-semibold text-sm md:text-base text-[#f0f4f0]/80 group-hover:text-[#c6ff2e] transition-colors">
        {label}
      </span>
    </motion.div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-3 mb-5"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-[#c6ff2e]/30 to-transparent max-w-[40px]" />
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#c6ff2e]">{label}</span>
    </motion.div>
  );
}

function SubSectionHeading({ text }: { text: string }) {
  return (
    <motion.h3
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight text-[#f0f4f0] mb-10"
    >
      {text}
    </motion.h3>
  );
}

// ── HScrollCarousel with dot indicators ───────────────────────────────
function HScrollCarousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const childCount = Children.count(children);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) { setActiveIndex(0); return; }
      const progress = scrollLeft / maxScroll;
      const idx = Math.round(progress * (childCount - 1));
      setActiveIndex(Math.min(idx, childCount - 1));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [childCount]);

  const scrollToIndex = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const target = (idx / (childCount - 1)) * maxScroll;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth * 0.8, behavior: "smooth" });
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth * 0.8, behavior: "smooth" });
    }
  };

  // Show a max of 7 dots; collapse middle ones if many items
  const maxDots = Math.min(childCount, 7);
  const dotIndices: number[] = [];
  if (childCount <= 7) {
    for (let i = 0; i < childCount; i++) dotIndices.push(i);
  } else {
    const step = (childCount - 1) / (maxDots - 1);
    for (let i = 0; i < maxDots; i++) dotIndices.push(Math.round(i * step));
  }

  return (
    <div className="relative group w-full">
      {/* Scroll Left Button - Hidden on mobile, visible on PC */}
      <button
        onClick={scrollLeftBtn}
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md shadow-lg border border-white/10"
        aria-label="Scroll Left"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-6 md:px-12 lg:px-24 pb-6 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {/* Scroll Right Button - Hidden on mobile, visible on PC */}
      <button
        onClick={scrollRightBtn}
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md shadow-lg border border-white/10"
        aria-label="Scroll Right"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot indicators */}
      {childCount > 1 && (
        <div className="flex justify-center gap-2 pt-4 pb-2">
          {dotIndices.map((dotIdx, i) => {
            // Find closest actual index
            const isActive = dotIdx === dotIndices.reduce((prev, curr) =>
              Math.abs(curr - activeIndex) < Math.abs(prev - activeIndex) ? curr : prev
            ) && i === dotIndices.indexOf(dotIndices.reduce((prev, curr) =>
              Math.abs(curr - activeIndex) < Math.abs(prev - activeIndex) ? curr : prev
            ));
            return (
              <button
                key={i}
                onClick={() => scrollToIndex(dotIdx)}
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-6 h-2 bg-[#c6ff2e]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────

function AdSetPhotoBlock({ index, imageUrl }: { index: number; imageUrl?: string }) {
  const [isFull, setIsFull] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 10) * 0.05, duration: 0.6 }}
      className="relative aspect-[3/4] rounded-2xl bg-[#0e1a14] border border-white/5 flex items-center justify-center group hover:border-[#c6ff2e]/20 transition-all overflow-hidden flex-shrink-0 w-[220px] md:w-[280px] snap-start"
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={`Ad Set ${index}`}
            className="w-full h-full object-cover rounded-2xl"
            loading="lazy"
            decoding="async"
          />
          <button
            onClick={(e) => { e.stopPropagation(); setIsFull(true); }}
            className="absolute top-2 right-2 p-2 rounded-full bg-[#080f0c]/60 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md"
          >
            <Maximize2 size={16} />
          </button>

          {isFull && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4" onClick={() => setIsFull(false)}>
              <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={`Ad Set ${index} Fullscreen`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  loading="lazy"
                  decoding="async"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setIsFull(false); }}
                  className="absolute top-6 right-6 p-3 rounded-full bg-[#080f0c]/80 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <span className="text-[#7a8c7f]/40 font-heading font-bold text-xs uppercase tracking-widest writing-mode-vertical group-hover:text-[#7a8c7f]/70 transition-colors">
          AD SET {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </motion.div>
  );
}


export function ContentProductionSection() {
  const adSetUrls = [
    "https://lh3.googleusercontent.com/d/1yVgcghdfi4OOqP8gPNnpH9QumUmNd8XK",
    "https://lh3.googleusercontent.com/d/1cELr_o0BFt_9xQaZyIfd4OiM35p4Ye_B",
    "https://lh3.googleusercontent.com/d/1SDv1pFrN3Vx0HS5v0Ar-JQko4wAgrPWn",
    "https://lh3.googleusercontent.com/d/18CF2bHeRl0nUSMrB5bE5W94Jl6b4_Kyq",
    "https://lh3.googleusercontent.com/d/1dA8hGulcwmFzHkm_jcqjxUOw_-gxGFo0",
    "https://lh3.googleusercontent.com/d/17n33Dkz2KWQwuMW76Q1SqkfPwMmqG4ie",
    "https://lh3.googleusercontent.com/d/1FZ0ODwVos6S-Bg5ELlZ63YuNQIWoDqBE",
    "https://lh3.googleusercontent.com/d/1LrVoWaGplk4fjoKnYvnFZ4GliLLMhJZM",
    "https://lh3.googleusercontent.com/d/1OZ3K-zal3uzlY_fAmoLaEdOWt0-kd3t9",
    "https://lh3.googleusercontent.com/d/1hmeVcEJOHFxdxUzznlnIHYmVl5GX54T6",
    "https://lh3.googleusercontent.com/d/1gNCHuytYFSUhqHrQ7bY0crXh6wq48H0b",
    "https://lh3.googleusercontent.com/d/1H3l6BuwBd1IdXg9CgDDibRR4D1uLZkk6",
    "https://lh3.googleusercontent.com/d/13WdVWp885R8BdFhoJHyg7TFK3CjrqN1I",
    "https://lh3.googleusercontent.com/d/1bdXQSbrVZYKDrKaEWXyiwXlDSLPYT6LT",
    "https://lh3.googleusercontent.com/d/1q460FkdgKFWHxYqELdsgED_Ws-AsearN",
    "https://lh3.googleusercontent.com/d/1XUfPJaHvgoQuszX3iaE9kpzaS-WRyjwH",
    "https://lh3.googleusercontent.com/d/1ENLqKrRjpqnEswl1qFYGixnWxFt3XvEz",
    "https://lh3.googleusercontent.com/d/1S5mTc4tqObr8LakcXA8Un1x6I5nyt-Zo",
    "https://lh3.googleusercontent.com/d/1X7nXSCqlfEYyiZDEX_B05P3mthSYGoyz",
    "https://lh3.googleusercontent.com/d/13KXBGkJY0JijFYZf8EMagTepPaGSxb4O",
    "https://lh3.googleusercontent.com/d/10YgvdvuWbNUHYEMYNAaXpMTbzYLhlpG4",
    "https://lh3.googleusercontent.com/d/1bt0aofxTP8tQ-lUHAAtkiMKqRiU15QJn",
    "https://lh3.googleusercontent.com/d/1qIddgkyOz_s202yTOR7oFT6itc7sp0EL",
    "https://lh3.googleusercontent.com/d/1CxLwcV-x3ibCGh__N1K5juv8vEoeoE4D",
    "https://lh3.googleusercontent.com/d/1xWrvIWjYxz6bmRnfsfKwTtBceHwO7zuk",
    "https://lh3.googleusercontent.com/d/17URqXMy5W-z1w-EXL2V1orltF7-fH9_Z",
    "https://lh3.googleusercontent.com/d/11Ie5f11gwqqjnEWyAgD7P9UAvAjiGJQw",
    "https://lh3.googleusercontent.com/d/18svTjSgnRvoqH2C0_7CjRB_8oJKZX64M",
    "https://lh3.googleusercontent.com/d/1gOPsTLSNDzLgkml0n4rV9RPWR9bYmoga",
    "https://lh3.googleusercontent.com/d/1oVCF7PdvJQS2b18CaWXkmMTULnTTYZGi",
    "https://lh3.googleusercontent.com/d/1g_rIDr1fJufHDgJ1WdURWpj5q-0A6-xx",
    "https://lh3.googleusercontent.com/d/1OCC6Tc7bGMXqTU7JuUL8XeadyilnUDrj",
    "https://lh3.googleusercontent.com/d/1m96_UCVPBovNbqJ3GL3egwAmfhxTbK16",
    "https://lh3.googleusercontent.com/d/1t0cPjWLUMIzOBfItw6mNfdmRXzEbF9p-",
    "https://lh3.googleusercontent.com/d/18Yoz6wFMs4fW6uxXeiQ5XGt1DuCU2eOq",
    "https://lh3.googleusercontent.com/d/1hL6_0BsSsiyWAMobFHTxhdgJOWBrxg_u",
    "https://lh3.googleusercontent.com/d/1JKHamA1n4Ys9KX7CAW_IQoH33AP1rJQQ",
    "https://lh3.googleusercontent.com/d/1EzW6YwMxMFuycUPyUyeqGUZJcaeIW8tG",
    "https://lh3.googleusercontent.com/d/1VnYHXuM6PRZKj79ePOy0oUq_Nb7Zo9P_",
    "https://lh3.googleusercontent.com/d/1RrLA5ITTYAHsAPOukd34d1hEfDjkOuq1",
    "https://lh3.googleusercontent.com/d/1uV3foan7j46t-ZuMWityAp5xlAKKvkyP",
    "https://lh3.googleusercontent.com/d/1wRvmJNCDz0DY1rv0uDpwkdkWq7Eslcsh",
    "https://lh3.googleusercontent.com/d/16doOfPXJ2W-6nFxwyIhtK_ZRA8OtlDIe",
    "https://lh3.googleusercontent.com/d/1QgKkrYdGeyB--fhgkqkTeqRoBJvyXmiU",
    "https://lh3.googleusercontent.com/d/1ZG7K7zycmnMGRviwbM4rbLeTIvq_xzh8",
    "https://lh3.googleusercontent.com/d/1ka5u8Vk-_zt7dLgll768RVBI40KO-q9S",
    "https://lh3.googleusercontent.com/d/1NSGVa6Ec3LZq8bkZuGdL2qqNWBDs5FDY",
    "https://lh3.googleusercontent.com/d/1svDnZjLtXQuLQ1Ic8I4XS6wDd2kRUwuX",
    "https://lh3.googleusercontent.com/d/1sxWmwk64Aoh0xkiAqLkb1hPcuoJ-yFeO",
    "https://lh3.googleusercontent.com/d/1JrpD3ssatYPk_D7vAtTi7rVeFFhsPjjW",
    "https://lh3.googleusercontent.com/d/1VdfhOBTKUiyn9gZP1s8N_K_466snf8QL",
    "https://lh3.googleusercontent.com/d/1679KhOfbbCkJo09YnARFy2tVu4bHOwg5",
    "https://lh3.googleusercontent.com/d/10I0gYAZA5rM3w0fde3mAikByD2Rt1ANK",
    "https://lh3.googleusercontent.com/d/1HYIVf_b79baFNnVeEw6HIzWkXR-JwOEj",
    "https://lh3.googleusercontent.com/d/1uu_DnTxl4Jd52ms-gnTbKlYF0XZ70ngw",
    "https://lh3.googleusercontent.com/d/1XrarG0Sbk58aDnJMEwgS3eykETNDJsk-",
    "https://lh3.googleusercontent.com/d/1c0R5wrvpwfCHz7C-LeeznSumIn-FKII-",
    "https://lh3.googleusercontent.com/d/1xWeES5r7ZAm1E5-5KtTRX7Ucd9JQZZYo",
    "https://lh3.googleusercontent.com/d/1-vRuFIv8Ao9gQE5RoBYpQ_jfp7JxA-7s",
    "https://lh3.googleusercontent.com/d/1-6EMucI6nbv7fQrUKpjxfnoflr015A_1",
    "https://lh3.googleusercontent.com/d/16ixXClzRQTJ1iJhQQaAwN8XJnN2xNBNT",
    "https://lh3.googleusercontent.com/d/1DeyZmBFHxZvY4tpDzgRYGzOisZKA0a3M",
    "https://lh3.googleusercontent.com/d/14JLZBrrojGm8IoVYBO3NJRn1f9DjX3HO",
    "https://lh3.googleusercontent.com/d/1i30Xroi0LTTPq9grr7C24aPG7M_VDAus",
    "https://lh3.googleusercontent.com/d/1xpb7z4JZMDR47oq2I62E6H7U0alJphE0",
    "https://lh3.googleusercontent.com/d/1bpmjOLGhZ3twieXQZYYhJ9X7INj9l6XG",
    "https://lh3.googleusercontent.com/d/1EilNJKM2DuwTBgItqKhmm1_-zrW9a7lX",
    "https://lh3.googleusercontent.com/d/1GwXrBmMMatdOfQaezKsWqjiLxTjLpdPY",
    "https://lh3.googleusercontent.com/d/1fjitEILNaZjUUbDqKSFdfv8yL_MKDCeo",
    "https://lh3.googleusercontent.com/d/1zvG8M0Wzs2OXqLmF50Zhqfz5OYb0g8d3",
    "https://lh3.googleusercontent.com/d/1GAeKMkpir7kElhL0wKvAt1iGqoGavLL5",
    "https://lh3.googleusercontent.com/d/1BetgL7GgCIsH_eY9P2A-jKXW3GNkWQXD",
    "https://lh3.googleusercontent.com/d/1pe7m74EJKkOEUTu951WcVR4X46-lbPXR",
    "https://lh3.googleusercontent.com/d/1RfRM47wYQ8PXxwQhHdozYzgwPnYwI44O",
    "https://lh3.googleusercontent.com/d/1LmZazSWNzLDFqiJntmmkDDOIEsF7lLIy",
    "https://lh3.googleusercontent.com/d/1AcFFhAMNnqSa7y-ZjTLhId4IxAkn72c9",
    "https://lh3.googleusercontent.com/d/1cLDJdmM9ycb_X9HdPpnVqOUuCn-SoLe2",
    "https://lh3.googleusercontent.com/d/1oZpCXEt9hh-lsNfe_dZ6W94V0TB0DssZ",
    "https://lh3.googleusercontent.com/d/1c-U5Q91HnB6Jr0mPvtZt8rDiYhBlxukJ",
    "https://lh3.googleusercontent.com/d/1tt2d268ScYA2Ptp8oXoDlgNCIHCIrXZJ",
    "https://lh3.googleusercontent.com/d/1W4fuY-C0szSXo8Es0w43tAGGjuQEqXvO",
    "https://lh3.googleusercontent.com/d/1qfQB3AWNBTBwN7gx1lSFQyDOmOqCL3-h",
    "https://lh3.googleusercontent.com/d/1WehPEo1mTpyD1pXtS5zWtnifwHht7mfk",
    "https://lh3.googleusercontent.com/d/1H7Oct2wKdwZuvblOD706oLx-A1hKfJja",
    "https://lh3.googleusercontent.com/d/19DlBHYNNDSaDzVvpZ9DEpEEcIYvRrpA_",
    "https://lh3.googleusercontent.com/d/1DOT26kBZw1aWRC-cbaOxwJIDc5itUFpz",
    "https://lh3.googleusercontent.com/d/1ltxhNO_8A3kdCp3tJsph0bgoHwT7J-aX",
    "https://lh3.googleusercontent.com/d/1RWEmDzNFIwnbieKbbierzIvOYxtNg2Ms",
    "https://lh3.googleusercontent.com/d/12dVUfANSLF9puqlAcDfJldgxyIG7QGZL",
    "https://lh3.googleusercontent.com/d/14hdenAHuTDQ-VE7vVzYX874rqV9-EbRY",
    "https://lh3.googleusercontent.com/d/1ThLlXPpwq_6Fyli_VCz6wgUg76SLESyw",
    "https://lh3.googleusercontent.com/d/1r_wqVGA97sLeNo_QMOhTHK36uUiCczpt",
    "https://lh3.googleusercontent.com/d/1o-7fD8alSKlohNIuqklC_Mh1bcLR0LVw",
    "https://lh3.googleusercontent.com/d/1eqUDyAgAa4OHO65_7uJngU4Of3pkrgFH",
  ];
  const video169Tags = ["Cinematic Brand Films", "Office Walkthroughs", "TVCs / Digital Commercials", "Vision Films", "Launch Films"];
  const perfAdsSubTags = ["Meta", "Google", "YouTube"];
  const video916Tags = ["CGI", "Long Form", "Short Form", "3D Product Renders"];
    const photoUrls = [
    "https://lh3.googleusercontent.com/d/1azwhfivMn9gawE12ATOFuq7kydzbRYrZ",
    "https://lh3.googleusercontent.com/d/1CxLwcV-x3ibCGh__N1K5juv8vEoeoE4D",
    "https://lh3.googleusercontent.com/d/1bdXQSbrVZYKDrKaEWXyiwXlDSLPYT6LT",
    "https://lh3.googleusercontent.com/d/1LoBuGRkmJk5ubQ_8E3kNSK--K20nu5fQ",
    "https://lh3.googleusercontent.com/d/1c0R5wrvpwfCHz7C-LeeznSumIn-FKII-",
    "https://lh3.googleusercontent.com/d/1B7n2q_l2B2h6bU4p2n1K2_9F5U0U3u4Y",
    "https://lh3.googleusercontent.com/d/1t0cPjWLUMIzOBfItw6mNfdmRXzEbF9p-",
    "https://lh3.googleusercontent.com/d/1hmeVcEJOHFxdxUzznlnIHYmVl5GX54T6",
    "https://lh3.googleusercontent.com/d/11Ie5f11gwqqjnEWyAgD7P9UAvAjiGJQw",
    "https://lh3.googleusercontent.com/d/12FkodWCts_F576PzaVFyGvmDif_iHbHH",
    "https://lh3.googleusercontent.com/d/1__N3S6tPyv0nRprtfmczDQUb4f_dQ2rR",
    "https://lh3.googleusercontent.com/d/1RtST8wZD8VDu8558V4CNZgJImBGbBto4",
    "https://lh3.googleusercontent.com/d/1DeyZmBFHxZvY4tpDzgRYGzOisZKA0a3M",
    "https://lh3.googleusercontent.com/d/1CVDlKCs5LGbhVeXDnmEUF5UjfojS0O1J",
    "https://lh3.googleusercontent.com/d/16NxyrB762wFiQxwkxHCSJMx7Cpa4G5zV",
    "https://lh3.googleusercontent.com/d/12S_Jnru7vbwShRRb35PQQrt3uIDUVa5p",
    "https://lh3.googleusercontent.com/d/1eZc0ogSWP_HJI_l-nV4nTF1BtEc1Sp8n",
    "https://lh3.googleusercontent.com/d/1679KhOfbbCkJo09YnARFy2tVu4bHOwg5",
    "https://lh3.googleusercontent.com/d/1rGVygeBoFE40PU9ruM457-wbo336gRTn",
    "https://lh3.googleusercontent.com/d/1EOwt9P8eB2DnnMwSC_yDR1iU_GK6A1FS",
    "https://lh3.googleusercontent.com/d/1mxYTaSgfZ6cbhCIF_SD8kLknCPc_ECCH",
    "https://lh3.googleusercontent.com/d/1iG91rJ5BR8mng1kZcN51j85DSrQFXTQ_",
    "https://lh3.googleusercontent.com/d/1JKHamA1n4Ys9KX7CAW_IQoH33AP1rJQQ",
    "https://lh3.googleusercontent.com/d/1W-lijHwbK-u0wqlRpcsX1YjxQaqyo_0L",
    "https://lh3.googleusercontent.com/d/1xCKUjr1vCFBn62xd7AmFDefvyj6GBSHy",
    "https://lh3.googleusercontent.com/d/1lwIhSTT8GeDNLcvjH5hd91LtOgenFeqd",
    "https://lh3.googleusercontent.com/d/1qkH-uNsEddC5vYv7YihxdRXQBmzwyWCR",
    "https://lh3.googleusercontent.com/d/13qwJGFMBpW8RNhw3mM9PHTGB5EFyoPpN",
    "https://lh3.googleusercontent.com/d/1xP7iMv6c-8_4yR8wU7sYk8b3H1Qv8n2z",
    "https://lh3.googleusercontent.com/d/17ofijIo91N5uy6TT_YA8Ln2GobPahbsf",
    "https://lh3.googleusercontent.com/d/1nlYfAezg0TR1rY07xwGzxTeYHTkS0MtI",
    "https://lh3.googleusercontent.com/d/1U4Vbovw_qpTQeX9pe2FzXSBfa8WBUH7M",
    "https://lh3.googleusercontent.com/d/1yG9ac_GL_Y4pMNs1eGLv-b19GQcqJDG1",
    "https://lh3.googleusercontent.com/d/1T2lwBttxgIPYXgl9SKpm-sJTQ1sQ-HWf",
    "https://lh3.googleusercontent.com/d/1anhqL-miAbYaQIRE8sv4ZvtMjtCtj2Nr",
    "https://lh3.googleusercontent.com/d/1kYgd4k8-XywocDJq6v5c_RKod5QAj_u3",
    "https://lh3.googleusercontent.com/d/1pOt6QaxP8bzDC0Rmlr347Vtcdp0evz04",
    "https://lh3.googleusercontent.com/d/1q-XqWcqpPyRGxlytAPQvvl701wPb2e4x",
    "https://lh3.googleusercontent.com/d/1wxyv9MtdwgdbZ9ByY1JevZyIXolCKImI",
    "https://lh3.googleusercontent.com/d/19K6pzTpUvQeKPiSthcq4C7MwdWOY-bPX",
    "https://lh3.googleusercontent.com/d/1vlKTGc0Tx_DfCnqIZgUHRoxn6y-hb46i",
    "https://lh3.googleusercontent.com/d/1AQBY6i8aV4dfuVItZTARcMLhoiCMDXom",
    "https://lh3.googleusercontent.com/d/1Ta5aGWvYDDPIVkPeS1ZF7T7_p8uiqngz",
    "https://lh3.googleusercontent.com/d/1WHuzUzRQaRuku5vTtYVUlFHlODceB-My",
    "https://lh3.googleusercontent.com/d/169pQwATKewDPFK93i2aWy7lwOKYK_PyV",
    "https://lh3.googleusercontent.com/d/1BcHU1_QGWpc4CqSYwWKYAa2uaMfG9d_8",
    "https://lh3.googleusercontent.com/d/1p5H4g6F2rZ87sB1q0h0_vBOMQIfs1722",
    "https://lh3.googleusercontent.com/d/158-vnKHfKcNXp6ynne4Ikio7qB6C0rdi",
    "https://lh3.googleusercontent.com/d/1FZ0ODwVos6S-Bg5ELlZ63YuNQIWoDqBE",
    "https://lh3.googleusercontent.com/d/10ofgAmj-_aVwZUkKtm-4zD8mCPS65dGj",
    "https://lh3.googleusercontent.com/d/17yv7z-t3nS5Jz8tL9P4x_lR7c8j9q7kR",
    "https://lh3.googleusercontent.com/d/1FTjlgEaU_dEnldjZqkAyooPS7ldjERwD",
    "https://lh3.googleusercontent.com/d/1H2kxQqV19tfF68BlD4sftP76TIb7Rm7Q",
    "https://lh3.googleusercontent.com/d/1LmZazSWNzLDFqiJntmmkDDOIEsF7lLIy",
    "https://lh3.googleusercontent.com/d/1h7_NqRkmGz1F34aBbmuwqlllC8ZMQ6Q-",
    "https://lh3.googleusercontent.com/d/1NXvQHy0TWe48EYiaJP_LG6b_MHfZY_y4",
    "https://lh3.googleusercontent.com/d/129XwT1W3LL5kfik4DAGL9xGOxbWakAM3",
    "https://lh3.googleusercontent.com/d/1nqX33l5q35aWR5MnPJQ2vlSkODn1n64M",
    "https://lh3.googleusercontent.com/d/1seX8XBTDBs2UpUGFTf7bkIF4CeRrbMhH",
    "https://lh3.googleusercontent.com/d/1RWEmDzNFIwnbieKbbierzIvOYxtNg2Ms",
    "https://lh3.googleusercontent.com/d/1ldtST3GvmtfEOU1npxGg57oTBSIdgniO",
    "https://lh3.googleusercontent.com/d/1nwaAheLWT6huXrakTeuwba6VLX3CYWLr",
    "https://lh3.googleusercontent.com/d/1ZlIjEWMxnG17yrP3yo9998rZozrasAHn",
    "https://lh3.googleusercontent.com/d/1hIiiE3N6iAKNKXmtGM4dk13jKENlgc2u",
    "https://lh3.googleusercontent.com/d/1QiUH2tQw49sEzbq16vF2ohVlDgxa3ztR",
    "https://lh3.googleusercontent.com/d/1gSgo5SXWjDnpTFZSWI4c-WgfPzqzF3uu",
    "https://lh3.googleusercontent.com/d/1Gm6fFQD5QiUzoYMXfyuiBwo-OGGsyf1K",
    "https://lh3.googleusercontent.com/d/1Jnkbomy7vHmDva0OuB0t3P4kW6SkLkit",
    "https://lh3.googleusercontent.com/d/1jF_mUXc39ntzNsVWXJSBjcjQYz4eHRuc",
    "https://lh3.googleusercontent.com/d/1wttYz5yaNrho_VHKZIVdpxvafUkT_uxM",
    "https://lh3.googleusercontent.com/d/1pciB1fEkUiYgBe51tA0gYW8Dz-4hamkh",
    "https://lh3.googleusercontent.com/d/1Z_aIRoa8eQaiJjeCh9tUu13uMBtpjqS2",
    "https://lh3.googleusercontent.com/d/1m08r5HgDvtUjj2tjdKXN7OksYJ-jtIMZ",
    "https://lh3.googleusercontent.com/d/1fV9BT5PmoxM6Qz_PUMe_fpXB8AaiTc87",
    "https://lh3.googleusercontent.com/d/1BV_s9vqnkYt6N-EcqqbFefQwSAZxiG6K",
    "https://lh3.googleusercontent.com/d/1DOT26kBZw1aWRC-cbaOxwJIDc5itUFpz",
    "https://lh3.googleusercontent.com/d/1Hm269_Cg_az_TK4-zhUJ4Rt8msvX6s9B",
    "https://lh3.googleusercontent.com/d/1Gj1NKEFsQoPEjizSy-E-kJhdxhppr0WM",
    "https://lh3.googleusercontent.com/d/1tt2d268ScYA2Ptp8oXoDlgNCIHCIrXZJ",
    "https://lh3.googleusercontent.com/d/1ilLRaw75hHL-9K66wCmsIpM7qup8kuFl",
    "https://lh3.googleusercontent.com/d/1GAeKMkpir7kElhL0wKvAt1iGqoGavLL5",
    "https://lh3.googleusercontent.com/d/1aRHBXjVamaMAkTZU3OxGC4RwlVMOhman",
    "https://lh3.googleusercontent.com/d/1g_rIDr1fJufHDgJ1WdURWpj5q-0A6-xx",
    "https://lh3.googleusercontent.com/d/1R1fm3dTbLvAhro1n3A9hJ0EP1ACTkkHj",
    "https://lh3.googleusercontent.com/d/1T2SrzELf76DlpwnKTgHeuZMnClOfEfuT",
    "https://lh3.googleusercontent.com/d/1xPVPjUNK16GCJZmWxFodwWuBmLBmYOLW",
    "https://lh3.googleusercontent.com/d/1Pb8uEO5zRuQyvGaBvatlbxySTdg1Ogi-",
    "https://lh3.googleusercontent.com/d/1Qc6KFE2aBDtbrMiIOrO069YlRB80QewQ",
    "https://lh3.googleusercontent.com/d/1R6gRudIeWF67_gFZK7_CP9dqSQlSR4l0",
    "https://lh3.googleusercontent.com/d/1R4HSO7nQULObjKni-ypBrc89fg1MCMmH",
    "https://lh3.googleusercontent.com/d/1ph-_8wRm6rSiagKLGGNIwBLAfDpr-45l",
    "https://lh3.googleusercontent.com/d/1-vRuFIv8Ao9gQE5RoBYpQ_jfp7JxA-7s",
    "https://lh3.googleusercontent.com/d/1RDM2a4cb_n2sJcb52szehWhvjLGzXqiH",
    "https://lh3.googleusercontent.com/d/1qfQB3AWNBTBwN7gx1lSFQyDOmOqCL3-h",
    "https://lh3.googleusercontent.com/d/1G7ZJgG1t8X9hQ7GgTqR7RzN3H3x7k7J",
    "https://lh3.googleusercontent.com/d/1FchdNn41ntOeaoOCFEx5PPQmVFkwqh_A",
    "https://lh3.googleusercontent.com/d/1H3l6BuwBd1IdXg9CgDDibRR4D1uLZkk6",
    "https://lh3.googleusercontent.com/d/1hHt8cc3UH4o5Fo7Usp5_Cyy4leVuO5Gk",
    "https://lh3.googleusercontent.com/d/1Mi3A8umhfG4BopibuETvPbXj7A5oO-Pn",
    "https://lh3.googleusercontent.com/d/1I_xQy9K7W9d1w1vH_rK0Z2m7U7xX5x5M",
    "https://lh3.googleusercontent.com/d/1sR7A7vX1yF1k7D1zXyD8jZzU7G3z3Zq2",
    "https://lh3.googleusercontent.com/d/1dpafRwFDBMnAO9eVRai4BjhoaEmCuDaJ",
    "https://lh3.googleusercontent.com/d/1MDjHH_kZsY89c69ptlPl2KK9IxJDnh6N",
    "https://lh3.googleusercontent.com/d/12ILpN8_GaxStZe-_VHeIG6JKcAcCy1J_",
    "https://lh3.googleusercontent.com/d/1yk1vDOiY-IraP9W68p_ulRmWKcvfNyh6",
    "https://lh3.googleusercontent.com/d/1xnG_zR-gO3LNWh-NPsES_JFXFHt_rogv",
    "https://lh3.googleusercontent.com/d/1nrYpWLqOBnQo1fET_2XK9IYzaGgfT-fo",
    "https://lh3.googleusercontent.com/d/1fHxlQ9O8V-sMSFdM8vTd2GZD1Js-_pY6",
    "https://lh3.googleusercontent.com/d/1EX6xtaO8hPhoIIfmmATllWxjajFT-BK4",
    "https://lh3.googleusercontent.com/d/1ENLqKrRjpqnEswl1qFYGixnWxFt3XvEz",
    "https://lh3.googleusercontent.com/d/15hKbJAyzy46WjGA04zhkZyvGGtKCZ9Ia",
    "https://lh3.googleusercontent.com/d/16RioDw05Y2mLj0TdkpbPu6AK9SFFBtav",
    "https://lh3.googleusercontent.com/d/1OHlQzlT0xYLh0LOC2NP_VPAUbeXrTWY9",
    "https://lh3.googleusercontent.com/d/1M-8_ZJ7qQW7U2K2vB0K2R0Y4cQ8vM3C",
    "https://lh3.googleusercontent.com/d/1D5Yp6gQ9C2m1Q7F8N6F5N4qX7G9L7Z1T",
    "https://lh3.googleusercontent.com/d/1wiOOFcXddpoKPG9BcbGidyLp_LC4KAEX",
    "https://lh3.googleusercontent.com/d/1gNCHuytYFSUhqHrQ7bY0crXh6wq48H0b",
    "https://lh3.googleusercontent.com/d/1b54tQlRlpZUl6XhVDRJuexZOlgp9Llnw",
    "https://lh3.googleusercontent.com/d/1jRR8Wpm-Vf0eF-O0GUzZxkDzxVqipJWo",
    "https://lh3.googleusercontent.com/d/1NjehlnDARHTmPlnZ1g7qLJUuRGlwaq8u",
  ];


  return (
    <section id="content-production" className="relative py-28 md:py-36 bg-[#080f0c] border-t border-white/5 overflow-hidden">
      
      {/* Ambient */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-[#c6ff2e]/3 blur-[150px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#c6ff2e] mb-4 block">Production</span>
          <h2 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tight text-[#f0f4f0] leading-none">
            Content<br /><span className="text-[#c6ff2e]">Production</span>
          </h2>
        </motion.div>

        {/* ── VIDEOGRAPHY ── */}
        <div className="mb-24 flex flex-col gap-12">
          <SubSectionHeading text="Videography" />

          {/* 16:9 Tags */}
          <div>
            <SectionLabel label="Video" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              {video169Tags.map((t, i) => <TagCard key={i} label={t} />)}
            </div>
            <div className="flex gap-3 flex-wrap mt-3">
              <span className="text-xs text-[#7a8c7f] uppercase tracking-widest font-bold self-center">Performance Ads →</span>
              {perfAdsSubTags.map((t, i) => (
                <span key={i} className="text-xs px-4 py-2 rounded-full border border-[#c6ff2e]/15 text-[#c6ff2e]/80 font-bold tracking-wider uppercase">{t}</span>
              ))}
            </div>
            {/* video blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
              {[
                "1nlFas7KoNU",
                "CDJ0cgyLBBE",
                "EKXqvlhc15g",
                "zBsehMDlSHc",
                "U6DPulBqhpM",
                "R6-nD6mQmz8",
                "kDBICwiOmu0",
                "GhKGV3uL7zI",
                "Frc6R0AsnJ8"
              ].map((id, i) => <VideoBlock16x9 key={i} index={i} videoId={id} />)}
            </div>
          </div>

          {/* 9:16 Tags + Carousel */}
          <div>
            <SectionLabel label="Video" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {video916Tags.map((t, i) => <TagCard key={i} label={t} />)}
            </div>
          </div>
        </div>
      </div>

      <HScrollCarousel>
        {[
          "raM2CBBIb1U",
          "6q2I-jCkeK0",
          "1paTpxjepg8",
          "BvJAeijODgQ",
          "z-qD099V5uk",
          "eiIAgxN9GSc",
          "cnOOpuZXRb4",
          "CHO3Okr1QN8",
          "HLeB4KTpd54",
          "duuKhhpyx-s",
          "edcRenTlMUU",
          "KRDCWH203bQ",
          "DMFj5Jqsk5A",
          "ouzaMC64xXE",
          "nnXTkPCJA48",
          "oQKbw9mJZWU",
          "v4XTCiX-LKg",
          "ZOCbbdVjEJg",
          "ObMVYil5qpU",
          "u40j6dH7VK8",
          "K0aVlEFYwXc",
          "GWx2rV4-u2o",
          "pgBQGTb7y84"
        ].map((id, i) => <VideoBlock9x16 key={i} index={i} videoId={id} />)}
      </HScrollCarousel>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-24">

        {/* ── Real People, AI Avatar ── */}
        <div className="mt-24 mb-24 flex flex-col gap-10">
          <SubSectionHeading text="Real People, AI Avatar." />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#f0f4f0]/70 text-base md:text-lg leading-relaxed max-w-3xl -mt-4"
          >
            Featured Hyper-realistic AI version of{" "}
            <span className="text-[#c6ff2e] font-semibold">Mrs.&nbsp;Indrani DasGupta Paul</span>{" "}
            as the face for{" "}
            <span className="text-[#c6ff2e] font-semibold">Flurys Coffee</span>{" "}
            in Wes Anderson Style setup and story concept. Highlighting both Mrs.&nbsp;Indrani and Flurys Coffee seamlessly.
          </motion.p>

          {/* Real Indrani Photos */}
          <div className="mb-12">
            <SectionLabel label="Real Indrani" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
              <PhotoBlock16x9 index={0} imageUrl="https://lh3.googleusercontent.com/d/1lwtFyejDZqx_jKuc9gRJl2NhyMJn-lZ3" />
              <PhotoBlock16x9 index={1} imageUrl="https://lh3.googleusercontent.com/d/1snerFaYTc91y9RtJV1qAINQHMbRl5cPe" />
              <PhotoBlock16x9 index={2} imageUrl="https://lh3.googleusercontent.com/d/1vJjoXkCYx11mWOngZUXsFfmuoghV7Py2" />
              <PhotoBlock16x9 index={3} imageUrl="https://lh3.googleusercontent.com/d/1TlZOX9CdGZDfmbOietpa5W3NTMIk_yv9" />
            </div>
          </div>

          {/* All 3 videos in a single row */}
          <div>
            <SectionLabel label="AI Avatar Videos" />
            <div className="flex flex-col md:flex-row gap-5 mt-6">
              <VideoBlock9x16 index={0} videoId="ZqHXCbRurD8" />
              <div className="flex-1 min-w-0">
                <VideoBlock16x9 index={1} videoId="1nlFas7KoNU" />
              </div>
              <VideoBlock9x16 index={2} videoId="8LVCvK4GMUE" />
            </div>
          </div>
        </div>

        {/* AI Avatar Photos label */}
        <div className="mb-6">
          <SectionLabel label="AI Avatar Photos" />
        </div>
      </div>

      {/* AI Avatar Photo Carousel */}
      <HScrollCarousel>
        {[
          "https://lh3.googleusercontent.com/d/1xh61G_bDJPaUgOf5xY0VV0_oiqipm1b-",
          "https://lh3.googleusercontent.com/d/1jtkB6dLirf05hdovY49S5x_JMC6Z68yk",
          "https://lh3.googleusercontent.com/d/1DRrnpRDoxonWw_xTb_z_qrsD2KDWLtN_",
          "https://lh3.googleusercontent.com/d/1FWpnAw5Urxlf8EuN8_kDwLLGldlySOJK",
          "https://lh3.googleusercontent.com/d/1k6zT5O7RlceVsGrmD5KWEK5nhea3wEex",
          "https://lh3.googleusercontent.com/d/1jqY1G3GkciyJFEH_fUZliNEjQFgZQ1ze",
          "https://lh3.googleusercontent.com/d/1CU0fvc3eLzJlRks4Kx3dri4bP-Fz-UH9",
        ].map((url, i) => (
          <PhotoBlock key={i} index={i} imageUrl={url} />
        ))}
      </HScrollCarousel>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-24">

        {/* ── Hyper Real AI ── */}
        <div className="mt-24 mb-24 flex flex-col gap-10">
          <SubSectionHeading text="Hyper Real AI Models" />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#f0f4f0]/70 text-base md:text-lg leading-relaxed max-w-3xl -mt-4"
          >
            Real regional models turned into their <span className="text-[#c6ff2e] font-semibold">Hyper Real AI versions</span> with 100% product realism and consistency.
          </motion.p>
          
          <div>
            <SectionLabel label="Hyper Real AI Videos" />
            <div className="flex flex-wrap gap-5 mt-6">
              <VideoBlock9x16 index={0} videoId="DMFj5Jqsk5A" />
              <VideoBlock9x16 index={1} videoId="ouzaMC64xXE" />
              <VideoBlock9x16 index={2} videoId="nnXTkPCJA48" />
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="mb-10 mt-10">
          <SubSectionHeading text="Photography" />
          <SectionLabel label="Photoshoots & Visuals" />
        </div>
      </div>

      {/* Photo Carousel */}
      <HScrollCarousel>
        {photoUrls.map((url, i) => (
          <PhotoBlock key={i} index={i} imageUrl={url} />
        ))}
      </HScrollCarousel>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="mb-10 mt-20">
          <SubSectionHeading text="AD Sets" />
          <SectionLabel label="Campaigns & Sets" />
        </div>
      </div>

      <HScrollCarousel>
        {adSetUrls.map((url, i) => (
          <AdSetPhotoBlock key={i} index={i} imageUrl={url} />
        ))}
      </HScrollCarousel>


    </section>
  );
}
