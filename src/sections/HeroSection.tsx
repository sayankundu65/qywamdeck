"use client";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#080f0c]">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#c6ff2e]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#c6ff2e]/4 blur-[100px] pointer-events-none" />
      
      {/* Venn diagram SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <svg width="700" height="400" viewBox="0 0 700 400" fill="none">
          <circle cx="270" cy="200" r="160" stroke="#c6ff2e" strokeWidth="1" />
          <circle cx="430" cy="200" r="160" stroke="#c6ff2e" strokeWidth="1" />
          <text x="150" y="205" fill="#c6ff2e" fontSize="14" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="700" letterSpacing="4" textAnchor="middle">REALITY</text>
          <text x="550" y="205" fill="#c6ff2e" fontSize="14" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="700" letterSpacing="4" textAnchor="middle">AI</text>
          <polygon points="350,185 344,195 356,195" fill="#c6ff2e" opacity="0.8" />
        </svg>
      </div>

      {/* Horizontal rule lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6ff2e]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6ff2e]/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-[0_0_20px_rgba(198,255,46,0.05)]"
        >
          <img src="/logo-mark-white.png" alt="QYWAM Logomark" className="h-5 w-auto object-contain" />
          <div className="h-3.5 w-px bg-white/20" />
          <img src="/wordmark-white.png" alt="QYWAM" className="h-3 w-auto object-contain" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="font-heading text-[clamp(3.5rem,10vw,8rem)] font-black leading-none uppercase tracking-tighter mb-10"
        >
          <span className="block text-[#c6ff2e] drop-shadow-lg" style={{ textShadow: "0 0 60px rgba(198,255,46,0.3)" }}>
            &lt;The Overlap&gt;
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-32 h-px bg-[#c6ff2e]/40 mb-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-2xl font-light text-[#f0f4f0]/70 max-w-3xl leading-relaxed"
        >
           The space between what exists and what's possible. 
        </motion.p>

      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] text-[#7a8c7f] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-12 bg-gradient-to-b from-[#c6ff2e]/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
