"use client";
import { SectionWrapper, SectionHeader, FadeIn } from "@/components/SectionWrapper";

export function Section11FinalCTA() {
  const steps = [
    "ANSWER THE ONBOARDING QUESTIONS",
    "TRACK EVERYTHING",
    "REAL-TIME FEEDBACK",
    "TRANSPARENT MANAGEMENT",
    "NO DEPENDENCY ON CALLS OR FOLLOW-UPS",
    "FASTER ITERATIONS"
  ];

  return (
    <SectionWrapper className="bg-gradient-to-b from-background to-[#081f14] min-h-screen flex flex-col justify-center border-b-0 py-32">
      <SectionHeader title="AUTOMATION" subtitle="NO REAL-TIME PRODUCTION SETUP. NO CREW." />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
        <FadeIn>
          <div className="bg-card text-background p-10 md:p-14 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
             <h3 className="font-heading text-4xl md:text-5xl font-black uppercase mb-12 flex flex-col gap-4">
               <span>360 CONTENT</span>
               <span className="text-secondary/50">ARSENAL</span>
               <span className="text-accent underline decoration-4 underline-offset-[12px] bg-background/90 w-max px-4 -ml-4 mt-8 py-2 rounded-lg">AI</span>
             </h3>
             <ul className="space-y-6">
               {steps.map((st, i) => (
                 <li key={i} className="flex gap-4 items-center uppercase font-bold tracking-widest text-sm md:text-base border-b border-background/10 pb-4 last:border-0">
                    <span className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center font-black">
                      {i + 1}
                    </span>
                    {st}
                 </li>
               ))}
             </ul>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <div className="h-full flex flex-col justify-center items-center lg:items-end text-center lg:text-right space-y-12">
            <h2 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none tracking-tighter">
              LET US <br/>
              TAKE YOU <br/>
              <span className="text-accent italic selection:bg-foreground selection:text-background">#TowardsQywam</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
              <button className="px-8 py-5 md:px-12 md:py-6 bg-accent text-background font-heading font-black text-xl md:text-2xl uppercase tracking-widest rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(198,255,46,0.4)] transition-all will-change-transform">
                START YOUR CAMPAIGN
              </button>
              <button className="px-8 py-5 md:px-12 md:py-6 bg-transparent border-2 border-foreground text-foreground font-heading font-black text-xl md:text-2xl uppercase tracking-widest rounded-full hover:bg-foreground hover:text-background transition-all">
                BOOK A CALL
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
      
      <div className="mt-auto border-t border-foreground/10 pt-12 flex flex-col md:flex-row justify-between items-center text-secondary font-body font-bold tracking-widest uppercase text-sm gap-4">
        <span>© {new Date().getFullYear()} QYWAM. ALL RIGHTS RESERVED.</span>
        <span>Developer + Design Blueprint</span>
      </div>
    </SectionWrapper>
  );
}
