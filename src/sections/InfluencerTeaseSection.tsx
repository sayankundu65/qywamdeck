"use client";
import React, { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2, X } from "lucide-react";
import { claimUnmute, onUnmuteClaimed } from "../hooks/useVideoMuteSync";

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

const modelCapabilities = [
  "Face consistency model training", "Skin tone precision", "Fashion style bank",
  "Expression library", "Hairstyle variations", "Script tone training",
  "Conversational personality system", "Platform-specific communication style",
  "International location simulation", "Luxury environments", "Studio-style campaigns",
  "Seasonal content", "Product placement visuals", "Reel-style transitions",
  "Lip-sync videos", "Trend participation",
];

const brandAdvantages = [
  "No celebrity fees", "No travel cost", "No shoot logistics",
  "No retake costs", "No controversies", "No scheduling issues",
  "No contract disputes", "Brand-safe messaging", "Same influencer",
  "Different languages", "Different regions", "Same brand consistency",
];

function VideoBlock9x16Compact({ index, videoId }: { index: number; videoId?: string }) {
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
      <div
        ref={containerRef}
        className="relative aspect-[9/16] bg-[#111c16] border border-white/5 rounded-xl flex items-center justify-center hover:border-[#c6ff2e]/20 transition-all overflow-hidden group"
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
            <div className="absolute bottom-1.5 left-1.5 md:inset-0 md:bottom-auto md:left-auto md:flex md:items-center md:justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 pointer-events-none md:w-full md:h-full">
              <button
                onClick={(e) => { e.stopPropagation(); replayVideo(); }}
                className="p-1 md:p-1.5 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md transition-colors pointer-events-auto flex items-center justify-center"
              >
                <RotateCcw className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
              </button>
            </div>
            {/* Bottom controls – always visible on mobile */}
            <div className="absolute bottom-1 right-1 flex flex-col gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="p-1 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md"
              >
                {isPlaying ? <Pause size={10} /> : <Play size={10} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="p-1 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md"
              >
                {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsFull(true); }}
                className="p-1 rounded-full bg-[#080f0c]/60 text-white hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md"
              >
                <Maximize2 size={10} />
              </button>
            </div>
          </>
        ) : (
          <span className="text-[8px] text-[#7a8c7f]/40 font-bold uppercase tracking-widest group-hover:text-[#7a8c7f]/70 transition-colors">REEL</span>
        )}
      </div>
      {isFull && videoId && <FullscreenVideoModal videoId={videoId} onClose={() => { sendCmd("mute"); setIsMuted(true); setIsFull(false); }} onOpen={() => { claimUnmute("__fullscreen__"); sendCmd("mute"); setIsMuted(true); sendCmd("pauseVideo"); setIsPlaying(false); }} />}
    </>
  );
}

function ProfilePhotoItem({ imageUrl, index }: { imageUrl: string, index: number }) {
  const [isFull, setIsFull] = useState(false);
  return (
    <div className="relative aspect-[3/4] bg-[#111c16] border border-white/5 rounded-xl flex items-center justify-center overflow-hidden group">
      <img
        src={imageUrl}
        alt={`Photo ${index}`}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        loading="lazy"
        decoding="async"
      />
      <button
        onClick={(e) => { e.stopPropagation(); setIsFull(true); }}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-[#080f0c]/60 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md"
      >
        <Maximize2 size={14} />
      </button>

      {isFull && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4" onClick={() => setIsFull(false)}>
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
    </div>
  );
}

function ProfileCard({
  name, dob, age, city, height, zodiac, videoIds = [], photoUrls = []
}: {
  name: string; dob: string; age: string; city: string; height: string; zodiac: string; side?: "left" | "right"; videoIds?: string[]; photoUrls?: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col lg:flex-row gap-8 rounded-3xl border border-white/5 bg-[#0e1a14] p-8 md:p-10 overflow-hidden relative"
    >
      {/* Accent corner */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-[#c6ff2e] rounded-tr-3xl" />
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0 w-full lg:w-52 aspect-[3/4] lg:aspect-auto lg:h-64 bg-[#111c16] border border-white/8 rounded-2xl flex items-center justify-center overflow-hidden">
        {photoUrls.length > 0 ? (
          <img
            src={photoUrls[0]}
            alt={`${name} avatar`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="font-heading font-black text-[#7a8c7f]/30 text-lg uppercase">{name}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 justify-between gap-8">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#c6ff2e] uppercase mb-2 block">AI Influencer Profile</span>
          <h3 className="font-heading text-4xl md:text-5xl font-black uppercase text-[#f0f4f0] tracking-tight leading-none mb-6">
            {name}
          </h3>
          <div className="flex flex-wrap gap-3">
            {[dob, age, city, height, zodiac].map((stat, i) => (
              <span key={i} className="text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/8 text-[#7a8c7f] bg-white/3">{stat}</span>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#7a8c7f] uppercase">Content Grid</span>

          {/* Reels Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {videoIds.length > 0 ? (
              videoIds.map((id, i) => (
                <VideoBlock9x16Compact key={i} index={i} videoId={id} />
              ))
            ) : (
              [0, 1, 2, 3].map(i => <VideoBlock9x16Compact key={i} index={i} />)
            )}
          </div>

          {/* Photos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photoUrls.length > 0 ? (
              photoUrls.map((url, i) => (
                <ProfilePhotoItem key={i} index={i} imageUrl={url} />
              ))
            ) : (
              [0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className="aspect-[3/4] bg-[#111c16] border border-white/5 rounded-xl flex items-center justify-center hover:border-[#c6ff2e]/20 transition-colors group">
                  <span className="text-[7px] text-[#7a8c7f]/40 font-bold uppercase tracking-widest group-hover:text-[#7a8c7f]/70">PHOTO</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ListCard({ label, variant = "dim" }: { label: string; variant?: "accent" | "dim" }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border transition-colors group cursor-default ${variant === "accent"
        ? "border-[#c6ff2e]/10 bg-[#c6ff2e]/4 hover:border-[#c6ff2e]/30 hover:bg-[#c6ff2e]/8"
        : "border-white/5 bg-[#0e1a14] hover:border-white/10 hover:bg-[#111c16]"
      }`}>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${variant === "accent" ? "bg-[#c6ff2e]" : "bg-[#7a8c7f]"}`} />
      <span className={`text-sm font-medium leading-snug ${variant === "accent" ? "text-[#c6ff2e]/90" : "text-[#f0f4f0]/70"}`}>
        {label}
      </span>
    </div>
  );
}

export function InfluencerTeaseSection() {
  return (
    <section id="influencer-tease" className="relative py-28 md:py-36 px-6 md:px-12 lg:px-24 bg-[#080f0c] border-t border-white/5 overflow-hidden">

      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#c6ff2e]/4 blur-[150px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto flex flex-col gap-20">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#c6ff2e] mb-4 block">AI Influencers</span>
          <h2 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tight text-[#f0f4f0] leading-none">
            QYWAM's<br /><span className="text-[#c6ff2e]">Influencer Tease</span>
          </h2>
        </motion.div>

        {/* Profile Cards */}
        <ProfileCard
          name="AIRA"
          dob="January 01, 1998"
          age="28 yrs"
          city="Mumbai"
          height="5'8&quot;"
          zodiac="Capricorn"
          videoIds={[
            "DdVYL-J7OMk",
            "LYvR21TJ8s8",
            "inp2v1UM7T4",
            "SZSEHmd3tZU",
            "H0R7KJeW5aU",
            "PH4JRov_KZk",
            "tvWCB82BKGk"
          ]}
          photoUrls={[
            "https://lh3.googleusercontent.com/d/1QnV6o2HkPPl_BUhxEvoIRLU0_ztAKQZB",
            "https://lh3.googleusercontent.com/d/1dGr5DCcMiELZeP1zjO0nQ1kxpRqZtWW9",
            "https://lh3.googleusercontent.com/d/1_5907zw-j1sPYHqPYEgO2ViORtKDNj_x",
            "https://lh3.googleusercontent.com/d/1PadOd02v6zXwDG5wwTfw7YIJjFklz5Lj",
            "https://lh3.googleusercontent.com/d/1tPM04EGODgTq5pEnD_Sv0bc4I-Py2wT7",
            "https://lh3.googleusercontent.com/d/1j007rKSn2J4ffLfQr48svwPIDLGdHTM1",
            "https://lh3.googleusercontent.com/d/1gb6RpOMLCiD0zzSEk3m6VIqg0k1OLE6q",
            "https://lh3.googleusercontent.com/d/1Wgh0Tt2yHys9hvfTrTWsp9UegVpt6vOn",
            "https://lh3.googleusercontent.com/d/1_W4fs9np16rJFxZPSQ6GCR-2w62MNQbH",
            "https://lh3.googleusercontent.com/d/18iZ3PuZ8bUzQHnhp14vmLBzpc7REemsa",
            "https://lh3.googleusercontent.com/d/1VAK1BhbwKKlSwnJB7zoQWl-l0D-eQeA0",
            "https://lh3.googleusercontent.com/d/1nwF0J96eQnfM4gxgF_0_rF-VnXx-fFLd",
            "https://lh3.googleusercontent.com/d/1bL4-IvK9qRmuCQnffviqY9HqDw0KRwCG",
            "https://lh3.googleusercontent.com/d/1IBFq_UJACM7Gxie7ghgtV5YPOJdslQbi",
            "https://lh3.googleusercontent.com/d/1NNWJMPTuXxCH1GDhtunUsm3ssiyodXPO",
            "https://lh3.googleusercontent.com/d/1jslj4eUjTibPAi1RldMp0PwmSeOz5gHb",
            "https://lh3.googleusercontent.com/d/1cHUJsbyu4iu_8E6brElQrymLXmBOkbX2",
            "https://lh3.googleusercontent.com/d/1gLEqofyNxBA2gl2OPLEt9or4rPI60qW_",
            "https://lh3.googleusercontent.com/d/1BbhAQ8F4_UxCO9W4Vb8tg5k1aNBhAzq8",
            "https://lh3.googleusercontent.com/d/18vDQnkXFm7JK7iDmHJ2NplFhEPH4nJHT",
            "https://lh3.googleusercontent.com/d/1Vk5dCatq9nI3_9Gr0TLwt4jwKo19YkFE",
            "https://lh3.googleusercontent.com/d/1OyDLyB927lT67MmUU9pIAh7F6Hok_UkH",
            "https://lh3.googleusercontent.com/d/1sgLsnsOqUNkiURZ3gcfhoWywHMTkXcgv",
            "https://lh3.googleusercontent.com/d/1cD7btDWOdfzo5iaEOxc4GYiMgmxQDTx6",
            "https://lh3.googleusercontent.com/d/1nWF6HaYRE66DXXvGifmrceQlqpOWEQHq",
            "https://lh3.googleusercontent.com/d/1KX5-_WqSFdWCFhJBRs5dGvVdtJWY-7A-",
            "https://lh3.googleusercontent.com/d/1tOakCFktZbg5OnAloHLmUZqoBP4-_Fl_"
          ]}
        />
        <ProfileCard
          name="DHAIRYA"
          dob="November 07, 1999"
          age="26 yrs"
          city="Delhi"
          height="6'0&quot;"
          zodiac="Scorpio"
          videoIds={[
            "7gZJ2MXNcK4",
            "eE5ekfo9o8c",
            "Q497Y04of4k",
            "RZUNg3ClvPc",
            "to_ArTiVyx8",
            "UoFRkvSYMb8"
          ]}
          photoUrls={[
            "https://lh3.googleusercontent.com/d/1SpXAegjV1W3hmDLmY2hHD4Qi_xMcby_m",
            "https://lh3.googleusercontent.com/d/1Aw-ghqjSQWYNJsXLFzB91ojzCcZC8RRW",
            "https://lh3.googleusercontent.com/d/1NHphjXS6tOfh-6ZGrg1I1DiuguI9N1bj",
            "https://lh3.googleusercontent.com/d/10V6eM6tqHIFkBDq7rc0EfQ1XuioBzDkV",
            "https://lh3.googleusercontent.com/d/1qd5d3SpAlcYQxVSsRnZwMsQAt8J8SSNz",
            "https://lh3.googleusercontent.com/d/1Z-TrOzEVkOhMCke6cqjRMm0tFtpJBHem",
            "https://lh3.googleusercontent.com/d/1UAxsVnZRG7LcxfBVxBP7M59iiG18H9YI",
            "https://lh3.googleusercontent.com/d/1cH4sbUp8w4YG3aVyXaRuvLKdIJnKAW_w",
            "https://lh3.googleusercontent.com/d/16pukQmoilkjvP_JkGG69ge2LOCsnaJ_s",
            "https://lh3.googleusercontent.com/d/1bnFbnXTqFKxl3aFUGNu0AXPz8WcLg425",
            "https://lh3.googleusercontent.com/d/1_BxS7ktyHhCUF7lOOjmowcHvk62CMH0U",
            "https://lh3.googleusercontent.com/d/1sCGQUx-QoeCkDEpR2WwZi_Cl__Pv-_Q4",
            "https://lh3.googleusercontent.com/d/1HouApKiMaJ_E834HA7-LdhXZqfnhJ3QW",
            "https://lh3.googleusercontent.com/d/16Ff2D_Q84rDvgoeA2ueNsW14powi0f_T",
            "https://lh3.googleusercontent.com/d/1prq8H8Pav_O8Y5lF6cm_WwxxSz21D3FS",
            "https://lh3.googleusercontent.com/d/1ZXb9cs5f215lC1aHLJLQBTzM331hE0aE",
            "https://lh3.googleusercontent.com/d/1YOyiKMMOBl3MHqqoNEnCe2Egyp4Lw7iy",
            "https://lh3.googleusercontent.com/d/1SpXAegjV1W3hmDLmY2hHD4Qi_xMcby_m",
            "https://lh3.googleusercontent.com/d/1uxrJYPtZAI77q1KeNmmSoCRFZZP1RZOS",
            "https://lh3.googleusercontent.com/d/135m3fYDBG66GxGpdVY71Av5ms7fD9zpO",
            "https://lh3.googleusercontent.com/d/1eko1z3xJCQylq5hCH17UV7G6I50Qbmrn",
            "https://lh3.googleusercontent.com/d/1LWBur7ACN51cf2mBO1Ouvc5X8Ak1pcCb",
            "https://lh3.googleusercontent.com/d/1ATiPE8j-cUcbPCh-iRA1VIcL6BNVTx5W",
            "https://lh3.googleusercontent.com/d/1yyyoRol3YkFDLIdTjGHxR73vYqAhJg98",
            "https://lh3.googleusercontent.com/d/1mf4YM1NIvRn7RljxkcNygzib2Aw2RE-s",
            "https://lh3.googleusercontent.com/d/1nSbMdvufEL2a4K4VzSeRkB9-VrjzvMbU",
            "https://lh3.googleusercontent.com/d/1WkFJ3LelZuyaVlpPAF946kTbtqYpnktp",
            "https://lh3.googleusercontent.com/d/1W5i_nGZfxHa5jgbBpgYE2220IiaggWV2"
          ]}
        />

        {/* Capabilities vs Advantages — side-by-side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-3xl border border-white/5 bg-[#0e1a14] p-8 md:p-12"
        >
          <div>
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-[#c6ff2e] mb-6">Model & Creative Capabilities</h4>
            <div className="flex flex-col gap-2">
              {modelCapabilities.map((cap, i) => <ListCard key={i} label={cap} variant="accent" />)}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-[#c6ff2e] mb-6">Brand Advantages — No Drama / Cost Efficiency</h4>
            <div className="flex flex-col gap-2">
              {brandAdvantages.map((adv, i) => <ListCard key={i} label={adv} variant="accent" />)}
            </div>
          </div>
        </motion.div>

        {/* 100+ Real Creators */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-10"
        >
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#c6ff2e] mb-4 block">Real Creators</span>
            <h3 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight text-[#f0f4f0] leading-tight">
              100+ Real Creators<br />With an Overlap Mindset
            </h3>
          </div>
        </motion.div>

        {/* Custom Brand AI Creators */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full rounded-3xl bg-[#c6ff2e] p-12 md:p-16 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group cursor-crosshair"
        >
          <div className="absolute inset-0 bg-[#d4ff50] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
          <span className="relative z-10 text-xs font-bold tracking-[0.3em] uppercase text-[#080f0c]/60">On Demand</span>
          <h3 className="relative z-10 font-heading text-4xl md:text-6xl font-black uppercase text-[#080f0c] tracking-tight leading-tight">
            Custom Brand AI Creators
          </h3>
        </motion.div>

      </div>
    </section>
  );
}
