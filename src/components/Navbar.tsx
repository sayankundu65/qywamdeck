"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "hero",              label: "The Overlap" },
  { id: "what-you-get",     label: "What You Get" },
  { id: "content-production", label: "Content Production" },
  { id: "meme-marketing",   label: "Meme Marketing" },
  { id: "influencer-tease", label: "Influencers" },
  { id: "design-strategy",  label: "Design & Strategy" },
  { id: "final-cta",        label: "Contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  /* ── scroll spy ── */
  useEffect(() => {
    const handleScroll = () => {
      let current = "hero";
      sections.forEach(({ id }) => {
        const el = id === "hero" ? document.querySelector("section") : document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            current = id;
          }
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* ────────────────────────────────────────────────────────
          DESKTOP — fixed left sidebar
      ──────────────────────────────────────────────────────── */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 flex-col items-center justify-between py-8 px-5 w-[72px]">

        {/* Logo */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => scrollTo("hero")}
          className="flex items-center justify-center hover:opacity-75 transition-opacity"
          aria-label="Back to top"
        >
          <img src="/logo-mark-white.png" alt="QYWAM" width={46} height={46} className="object-contain" />
        </motion.button>

        {/* Dot navigation — centered vertically */}
        <div className="flex flex-col items-center gap-5">
          {sections.map(({ id, label }, i) => {
            const isActive = activeSection === id;
            return (
              <div key={id} className="relative flex items-center">
                {/* Tooltip label — appears to the right of dot */}
                <AnimatePresence>
                  {hoveredDot === id && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-6 whitespace-nowrap text-[11px] font-bold tracking-widest uppercase text-[#c6ff2e] pointer-events-none"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  onClick={() => scrollTo(id)}
                  onMouseEnter={() => setHoveredDot(id)}
                  onMouseLeave={() => setHoveredDot(null)}
                  aria-label={label}
                  className="relative flex items-center justify-center w-6 h-6 group"
                >
                  {/* Outer ring for active */}
                  {isActive && (
                    <motion.span
                      layoutId="activeRing"
                      className="absolute w-6 h-6 rounded-full border border-[#c6ff2e]/50"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {/* Dot */}
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-2.5 h-2.5 bg-[#c6ff2e]"
                        : "w-1.5 h-1.5 bg-[#3a4a3e] group-hover:bg-[#7a8c7f]"
                    }`}
                  />
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Bottom spacer so dots sit centered */}
        <div className="w-4 h-4" />
      </nav>

      {/* ────────────────────────────────────────────────────────
          MOBILE — fixed top bar (unchanged)
      ──────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#080f0c]/90 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex items-center justify-between"
      >
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-3 hover:opacity-75 transition-opacity"
          aria-label="Back to top"
        >
          <img src="/logo-mark-white.png" alt="QYWAM Logomark" width={36} height={36} className="object-contain" />
          <img src="/wordmark-white.png" alt="QYWAM" className="h-[18px] w-auto object-contain" />
        </button>

        {/* Hamburger */}
        <button
          className="flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Menu"
        >
          <motion.div animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}  className="w-6 h-px bg-[#c6ff2e]" />
          <motion.div animate={{ opacity: mobileOpen ? 0 : 1 }}                          className="w-6 h-px bg-[#c6ff2e]" />
          <motion.div animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }} className="w-6 h-px bg-[#c6ff2e]" />
        </button>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[#080f0c]/95 backdrop-blur-xl border-b border-white/5 flex flex-col px-8 py-8 gap-5"
          >
            <div className="pb-4 mb-1 border-b border-white/10 flex items-center gap-3">
              <img src="/logo-mark-white.png" alt="QYWAM Logomark" width={28} height={28} className="object-contain" />
              <img src="/wordmark-white.png" alt="QYWAM" className="h-3.5 w-auto object-contain" />
            </div>
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-left text-sm font-bold tracking-[0.2em] uppercase transition-colors ${
                  activeSection === id ? "text-[#c6ff2e]" : "text-[#f0f4f0] hover:text-[#c6ff2e]"
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
