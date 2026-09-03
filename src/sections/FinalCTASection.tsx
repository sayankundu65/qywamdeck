"use client";
import { motion } from "framer-motion";

export function FinalCTASection() {
  return (
    <section id="final-cta" className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24 bg-[#080f0c] border-t border-white/5 overflow-hidden">
      
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-[#c6ff2e]/6 blur-[160px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6ff2e]/20 to-transparent" />

      <div className="max-w-[1300px] mx-auto flex flex-col items-center text-center gap-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-2.5 border border-[#c6ff2e]/20 bg-[#c6ff2e]/5 px-5 py-2 rounded-full">
            <img src="/logo-mark-white.png" alt="QYWAM Logomark" className="h-4 w-auto object-contain" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#c6ff2e]/90">
              QYWAM
            </span>
          </div>
          <h2 className="font-heading text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-none tracking-tighter text-[#f0f4f0]">
            Let Us Take You
          </h2>
          <h2 className="font-heading text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-none tracking-tighter text-[#c6ff2e]" style={{ textShadow: "0 0 80px rgba(198,255,46,0.25)" }}>
            #TowardsQywam
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <a href="https://wa.me/918287156273" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-12 py-5 bg-[#c6ff2e] text-[#080f0c] font-heading font-black text-base md:text-lg tracking-widest uppercase rounded-full hover:bg-[#d4ff50] hover:scale-105 hover:shadow-[0_0_60px_rgba(198,255,46,0.4)] active:scale-95 transition-all duration-300">
            Connect With Us
          </a>
        </motion.div>

        {/* Footer line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between w-full mt-24 pt-8 border-t border-white/5 text-[#7a8c7f]/50 text-xs font-bold tracking-widest uppercase gap-6"
        >
          <div className="flex items-center gap-3">
            <img src="/logo-mark-white.png" alt="QYWAM Logomark" className="h-5 w-auto object-contain opacity-75" />
            <img src="/wordmark-white.png" alt="QYWAM" className="h-3 w-auto object-contain opacity-75" />
          </div>
          <div className="flex items-center gap-8">
            <span>Reality</span>
            <div className="h-px w-10 bg-current" />
            <span>The Overlap</span>
            <div className="h-px w-10 bg-current" />
            <span>Ai</span>
            <div className="h-px w-10 bg-current hidden md:block" />
            <span className="hidden md:block">2026</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
