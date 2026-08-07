"use client";
import React, { useState, useRef, useEffect, Children } from "react";
import { motion } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

const designSections = [
  {
    tag: "Branding",
    title: "Branding",
    items: [
      "Booth & Event Branding",
      "Branded Environmental Graphics (EGD)",
      "Workplace Branding",
      "Brand Identity Design",
      "In-Store Installations",
      "Internal Brand Training",
    ],
    photoCount: 6,
    images: [
      "https://lh3.googleusercontent.com/d/1TmhbUbg8oFazqLOx5r0_BV0ub2YclnsX",
      "https://lh3.googleusercontent.com/d/1nCAM8l2OOtkdrqkvfE09JD8FaLPiPY67",
      "https://lh3.googleusercontent.com/d/1iT8G5PBcAXVSgsbl_OqrZRD0vBoqVQi7",
      "https://lh3.googleusercontent.com/d/1G_MDO9ZgBTSvkjhhFFE7JWub_oJP3ejj",
      "https://lh3.googleusercontent.com/d/1NeUebPC0gbkIc91NLeUIhy-gZF44m5t1",
      "https://lh3.googleusercontent.com/d/1JkTPzNPA2Xs9Xy_dBqSfOojI41ZFuw6p",
      "https://lh3.googleusercontent.com/d/1U9J6K7DR_zuIA97DKflPqpa29Xc8Bbv7",
      "https://lh3.googleusercontent.com/d/1ZeTEmikxnlt_iyUeHQxV5JPKh-r8R6Of"
    ],
  },

  {
    tag: "Experiential",
    title: "Offline & Experiential",
    items: [
      "DOOH (linked with OOH)",
      "Pop-Up Store Design",
      "Retail Branding",
      "Print Creatives",
      "Brand Activations",
      "Transit Branding",
    ],
    photoCount: 6,
    images: [
      "https://lh3.googleusercontent.com/d/1t2dzkOYFCFJVWfJGhcyLPGbi_KPrcsMl",
      "https://lh3.googleusercontent.com/d/1GkAIJeHQGxk8Hl4ftFvy1sIM9dTrc8az",
      "https://lh3.googleusercontent.com/d/1yA4BiGaIrDGHCTB5iz_nWQss6B66DmUe",
      "https://lh3.googleusercontent.com/d/1O_BNW1vxheB0Dk91n9ovIcAWAvPf1I1T",
      "https://lh3.googleusercontent.com/d/1j80rdAqfrNF8jI1vdKRNJHwb7ggZjkVh",
      "https://lh3.googleusercontent.com/d/1wz70XvkcrWfgxYEsGcDM9BX-Fnhr4vAx",
      "https://lh3.googleusercontent.com/d/14ygQBhMJgl1SfCV216_5A_J15pklq3ld",
      "https://lh3.googleusercontent.com/d/1e9PnjrNhEXAIhg4VglWjpyQRorObvoI_",
      "https://lh3.googleusercontent.com/d/1Bb__1QsMQ5mySOWgyCXC09ge3yh5exHt",
      "https://lh3.googleusercontent.com/d/16kEHSU0rtTtgztd4jCQ_qHvDUmO9ZBGw",
      "https://lh3.googleusercontent.com/d/1AP5oo4PEIgcdiboRUEfdQ4-9NAqTF89_",
      "https://lh3.googleusercontent.com/d/1Xx3-KBbVdsud64eV7EiZVMCbvjAo63ob",
      "https://lh3.googleusercontent.com/d/14GE5-AtwV_UCIHx40Wgxoivsxgrz6Nbk",
      "https://lh3.googleusercontent.com/d/1XEcNZL-RqiX7706pgzr9wEuEvnyD88yX",
      "https://lh3.googleusercontent.com/d/1YTk15Ydo3hdN3cVE_4y9BMQNxbTgq5ET",
      "https://lh3.googleusercontent.com/d/12mvRnJhmk77OabhB2aggFvl8NXzKSfB1",
      "https://lh3.googleusercontent.com/d/1NrUi-E_b5-VT5qRvVA0xymp2HgWHKoFI",
      "https://lh3.googleusercontent.com/d/1PmCfdhdjQ9CRuBLwboXaVtIvA2FPgu_l",
      "https://lh3.googleusercontent.com/d/1Db-cbd7Hp02xm6vdMmNy1Ri7K4RotmDz",
      "https://lh3.googleusercontent.com/d/1i7UQqDVIUw1VScrUVuYNeSBjgp_TjiO2",
    ],
  },
];

function ItemCard({ label, index }: { label: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group px-6 py-5 rounded-xl border border-white/5 bg-[#0e1a14] hover:border-[#c6ff2e]/25 hover:bg-[#111c16] transition-all cursor-default text-center"
    >
      <span className="font-heading font-semibold text-sm text-[#f0f4f0]/80 group-hover:text-[#c6ff2e] transition-colors">
        {label}
      </span>
    </motion.div>
  );
}

function DesignPhotoBlock({ index, imageUrl, className }: { index: number; imageUrl?: string; className?: string }) {
  const [isFull, setIsFull] = useState(false);
  return (
    <div className={`relative rounded-2xl bg-[#0e1a14] border border-white/5 flex items-center justify-center group hover:border-[#c6ff2e]/20 transition-all overflow-hidden ${className || "aspect-[4/3] flex-shrink-0 w-[260px] md:w-[380px]"}`}>
      {imageUrl ? (
        <>
          <img src={imageUrl} alt={`Design ${index + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          <button
            onClick={(e) => { e.stopPropagation(); setIsFull(true); }}
            className="absolute top-2 right-2 p-2 rounded-full bg-[#080f0c]/60 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-[#c6ff2e] hover:text-black backdrop-blur-md"
          >
            <Maximize2 size={16} />
          </button>
          {isFull && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4" onClick={() => setIsFull(false)}>
              <img src={imageUrl} alt={`Design ${index + 1} Fullscreen`} className="max-w-full max-h-full object-contain rounded-lg" loading="lazy" decoding="async" />
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
        <span className="text-[#7a8c7f]/30 font-heading text-xs uppercase tracking-widest group-hover:text-[#7a8c7f]/60 transition-colors">
          DESIGN {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

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

  const maxDots = Math.min(childCount, 7);
  const dotIndices: number[] = [];
  if (childCount <= 7) {
    for (let i = 0; i < childCount; i++) dotIndices.push(i);
  } else {
    const step = (childCount - 1) / (maxDots - 1);
    for (let i = 0; i < maxDots; i++) dotIndices.push(Math.round(i * step));
  }

  return (
    <div className="mt-16 relative group w-full">
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
        className="flex gap-5 overflow-x-auto px-6 md:px-24 pb-6 snap-x snap-mandatory scroll-smooth"
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

      {childCount > 1 && (
        <div className="flex justify-center gap-2 pt-4 pb-2">
          {dotIndices.map((dotIdx, i) => {
            const closest = dotIndices.reduce((prev, curr) =>
              Math.abs(curr - activeIndex) < Math.abs(prev - activeIndex) ? curr : prev
            );
            const isActive = dotIdx === closest && i === dotIndices.indexOf(closest);
            return (
              <button
                key={i}
                onClick={() => scrollToIndex(dotIdx)}
                className={`rounded-full transition-all duration-300 ${
                  isActive ? "w-6 h-2 bg-[#c6ff2e]" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DesignStrategySection() {
  const designPhotoUrls = [
    "https://lh3.googleusercontent.com/d/1O_BNW1vxheB0Dk91n9ovIcAWAvPf1I1T",
    "https://lh3.googleusercontent.com/d/1EdBX-iNkXMU0Qea9bDNoEw29hYgwtwKg",
    "https://lh3.googleusercontent.com/d/1Yzm8bRXY-ag2oIqgzTofgf66ZLAhSAEj",
    "https://lh3.googleusercontent.com/d/15v7neYO5cEGNFvOBsJix6cLZpahuNTIa",
    "https://lh3.googleusercontent.com/d/1xs1b_WQQugxDGUEqHnjWDtKePvydFfqN",
    "https://lh3.googleusercontent.com/d/1AY3JiEQh7akvlBzSdYHTZ2soPxpH_wz1",
    "https://lh3.googleusercontent.com/d/1WRKoEy1vkmKsvClZb9jFOaXHZ2cm5a9s",
    "https://lh3.googleusercontent.com/d/1KIkKtcne-w6ft06Y2P8wUUDVb3xBGdyl",
    "https://lh3.googleusercontent.com/d/1j80rdAqfrNF8jI1vdKRNJHwb7ggZjkVh",
    "https://lh3.googleusercontent.com/d/1TmhbUbg8oFazqLOx5r0_BV0ub2YclnsX",
    "https://lh3.googleusercontent.com/d/1nCAM8l2OOtkdrqkvfE09JD8FaLPiPY67",
    "https://lh3.googleusercontent.com/d/1NeUebPC0gbkIc91NLeUIhy-gZF44m5t1",
    "https://lh3.googleusercontent.com/d/1JkTPzNPA2Xs9Xy_dBqSfOojI41ZFuw6p",
    "https://lh3.googleusercontent.com/d/1iT8G5PBcAXVSgsbl_OqrZRD0vBoqVQi7",
    "https://lh3.googleusercontent.com/d/1G_MDO9ZgBTSvkjhhFFE7JWub_oJP3ejj",
    "https://lh3.googleusercontent.com/d/1U9J6K7DR_zuIA97DKflPqpa29Xc8Bbv7",
    "https://lh3.googleusercontent.com/d/1ZeTEmikxnlt_iyUeHQxV5JPKh-r8R6Of",
    "https://lh3.googleusercontent.com/d/1wz70XvkcrWfgxYEsGcDM9BX-Fnhr4vAx",
    "https://lh3.googleusercontent.com/d/14ygQBhMJgl1SfCV216_5A_J15pklq3ld",
    "https://lh3.googleusercontent.com/d/1e9PnjrNhEXAIhg4VglWjpyQRorObvoI_",
    "https://lh3.googleusercontent.com/d/1Bb__1QsMQ5mySOWgyCXC09ge3yh5exHt",
    "https://lh3.googleusercontent.com/d/16kEHSU0rtTtgztd4jCQ_qHvDUmO9ZBGw",
    "https://lh3.googleusercontent.com/d/1AP5oo4PEIgcdiboRUEfdQ4-9NAqTF89_",
    "https://lh3.googleusercontent.com/d/1Xx3-KBbVdsud64eV7EiZVMCbvjAo63ob",
    "https://lh3.googleusercontent.com/d/14GE5-AtwV_UCIHx40Wgxoivsxgrz6Nbk",
    "https://lh3.googleusercontent.com/d/1XEcNZL-RqiX7706pgzr9wEuEvnyD88yX",
    "https://lh3.googleusercontent.com/d/1YTk15Ydo3hdN3cVE_4y9BMQNxbTgq5ET",
    "https://lh3.googleusercontent.com/d/12mvRnJhmk77OabhB2aggFvl8NXzKSfB1",
    "https://lh3.googleusercontent.com/d/1NrUi-E_b5-VT5qRvVA0xymp2HgWHKoFI",
    "https://lh3.googleusercontent.com/d/1PmCfdhdjQ9CRuBLwboXaVtIvA2FPgu_l",
    "https://lh3.googleusercontent.com/d/1t2dzkOYFCFJVWfJGhcyLPGbi_KPrcsMl",
    "https://lh3.googleusercontent.com/d/1GkAIJeHQGxk8Hl4ftFvy1sIM9dTrc8az",
    "https://lh3.googleusercontent.com/d/1yA4BiGaIrDGHCTB5iz_nWQss6B66DmUe",
    "https://lh3.googleusercontent.com/d/1Db-cbd7Hp02xm6vdMmNy1Ri7K4RotmDz"
  ];

  return (
    <section id="design-strategy" className="relative py-28 md:py-36 bg-[#0a1510] border-t border-white/5 overflow-hidden">

      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#c6ff2e]/3 blur-[150px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#c6ff2e] mb-4 block">Extensions</span>
          <h2 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tight text-[#f0f4f0] leading-none">
            Design &<br /><span className="text-[#c6ff2e]">Strategy</span>
          </h2>
        </motion.div>

      </div>

      {/* Sub-sections */}
      <div className="flex flex-col gap-28">
        {designSections.map((sec, secIdx) => (
          <div key={secIdx}>
            <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-24 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#c6ff2e] mb-3 block">{sec.tag}</span>
                <h3 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight text-[#f0f4f0] leading-tight">
                  {sec.title}
                </h3>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {sec.items.map((item, i) => <ItemCard key={i} label={item} index={i} />)}
              </div>
            </div>
            {"displayMode" in sec && sec.displayMode === "grid" && sec.images ? (
              <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-24 mb-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {sec.images.map((url, i) => (
                    <DesignPhotoBlock key={i} index={i} imageUrl={url} className="w-full aspect-[3/4]" />
                  ))}
                </div>
              </div>
            ) : "images" in sec && sec.images ? (
              <div className="-mt-4">
                <HScrollCarousel>
                  {sec.images.map((url, i) => (
                    <DesignPhotoBlock key={i} index={i} imageUrl={url} />
                  ))}
                </HScrollCarousel>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
