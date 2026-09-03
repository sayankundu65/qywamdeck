"use client";
import { motion } from "framer-motion";

const branches = [
  { title: "Cinematic Story-Telling", icon: "🎬", desc: "Hollywood-grade narrative for brand films" },
  { title: "Cost Effective", icon: "💡", desc: "No production setup. No crew. No overhead." },
  { title: "Ultra Realistic", icon: "✦", desc: "AI outputs indistinguishable from reality" },
  { title: "Photography", icon: "📸", desc: "Hyper-detailed product & lifestyle stills" },
  { title: "Synchronous", icon: "⚡", desc: "The Overlap — reality & AI in harmony" },
  { title: "Versatile", icon: "◆", desc: "Adaptable formats for any platform" },
  { title: "Commercial Ads", icon: "📺", desc: "TVCs, digital ads, performance creatives" },
  { title: "Time-Efficient", icon: "⏱", desc: "High-velocity delivery at scale" },
  { title: "Creators Partnership", icon: "🤝", desc: "Influencers, Celebs & Youtubers" },
  { title: "Ready-To-Go Campaigns", icon: "🚀", desc: "Fully packaged ad campaigns, instantly" },
];

function FeatureCard({ item, index }: { item: typeof branches[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ delay: (index % 5) * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative flex flex-col gap-4 p-7 rounded-2xl border border-white/5 bg-[#0e1a14] hover:border-[#c6ff2e]/25 hover:bg-[#111c16] transition-all duration-300 cursor-default overflow-hidden"
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-[#c6ff2e]/30 rounded-tr-2xl" />
      </div>

      <span className="text-2xl leading-none">{item.icon}</span>
      <div>
        <h3 className="font-heading font-bold text-lg text-[#f0f4f0] group-hover:text-[#c6ff2e] transition-colors duration-300 leading-tight mb-1">
          {item.title}
        </h3>
        <p className="text-sm text-[#7a8c7f] leading-relaxed">
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export function WhatYouGetSection() {
  return (
    <section id="what-you-get" className="relative py-28 md:py-36 px-6 md:px-12 lg:px-24 bg-[#080f0c] border-t border-white/5">

      {/* Background glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#c6ff2e]/3 blur-[150px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto flex flex-col gap-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#c6ff2e] mb-4 block">What You Get</span>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#f0f4f0] leading-none">
              Associating<br />With <span className="text-[#c6ff2e]">QYWAM</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-[#7a8c7f] text-base leading-relaxed">
              We help brands unlock the creative potential of AI. From breakthrough concepts to production-grade execution, we solve real marketing challenges through intelligent creativity, creating campaigns, content, and experiences designed to perform, scale, and stand apart.
            </p>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {branches.map((item, i) => (
            <FeatureCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* Bottom badge strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center"
        >
          <div className="flex items-center gap-3 px-7 py-4 rounded-2xl border border-[#c6ff2e]/15 bg-[#c6ff2e]/5">
            <div className="w-2 h-2 rounded-full bg-[#c6ff2e] animate-pulse" />
            <span className="font-heading font-bold text-sm md:text-base text-[#c6ff2e] tracking-wider uppercase">
              PRODUCTION WITHOUT PRODUCTION
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
