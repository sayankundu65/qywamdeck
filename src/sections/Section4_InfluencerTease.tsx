"use client";
import { SectionWrapper, SectionHeader, FadeIn } from "@/components/SectionWrapper";

export function Section4InfluencerTease() {
  const creators = [
    { name: "AIRA", details: ["JANUARY 01 1998", "28yrs", "MUMBAI", "5'8\"", "CAPRICORN"], content: ["REELS", "PHOTOSHOOT"] },
    { name: "DHAIRYA", details: ["NOVEMBER 07 1999", "26yrs", "DELHI", "6'0\"", "SCORPIO"], content: ["REELS", "PHOTOSHOOT"] }
  ];

  return (
    <SectionWrapper>
      <SectionHeader title="QYWAM'S INFLUENCER TEASE" subtitle="Meme Marketing / Influencer Network" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {creators.map((c, i) => (
          <FadeIn key={i} delay={i * 0.2}>
            <div className="bg-card text-background p-10 md:p-14 rounded-[2rem] hover:-translate-y-2 transition-transform duration-500 will-change-transform group">
              <h3 className="font-heading text-5xl md:text-7xl font-black uppercase mb-8 group-hover:text-accent group-hover:drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] transition-colors">
                {c.name}
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {c.details.map((d, j) => (
                  <span key={j} className="bg-background/20 px-4 py-2 rounded-full font-bold text-sm tracking-wider">
                    {d}
                  </span>
                ))}
              </div>
              <h4 className="font-heading font-bold text-xl uppercase mb-4 border-b border-background/20 pb-2">Content</h4>
              <div className="flex gap-4">
                {c.content.map((cat, j) => (
                  <span key={j} className="text-secondary font-bold tracking-widest text-sm underline decoration-accent underline-offset-4">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}
