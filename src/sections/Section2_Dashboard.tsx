"use client";
import { SectionWrapper, SectionHeader, FadeIn } from "@/components/SectionWrapper";
import { Activity, LayoutDashboard, RefreshCcw, Smartphone, Zap } from "lucide-react";

export function Section2Dashboard() {
  const benefits = [
    { text: "NO GATEKEEPING ON WHAT'S HAPPENING", icon: <Activity className="w-6 h-6 text-background" /> },
    { text: "REAL-TIME FEEDBACK", icon: <RefreshCcw className="w-6 h-6 text-background" /> },
    { text: "TRANSPARENT MANAGEMENT", icon: <LayoutDashboard className="w-6 h-6 text-background" /> },
    { text: "NO DEPENDENCY ON CALLS", icon: <Smartphone className="w-6 h-6 text-background" /> },
    { text: "FASTER ITERATIONS", icon: <Zap className="w-6 h-6 text-background" /> }
  ];

  return (
    <SectionWrapper>
      <SectionHeader title="What will you get associating with QYWAM?" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <FadeIn>
          <div className="prose prose-invert">
            <h3 className="font-heading text-2xl md:text-4xl leading-tight mb-8">
              A SINGLE DASHBOARD THAT GIVES YOU <span className="text-accent">VISIBILITY</span>, <span className="text-accent">CONTROL</span>, AND <span className="text-accent">REAL-TIME INFLUENCE</span> OVER THE WORK.
            </h3>
            <div className="bg-foreground/5 p-8 border-l-4 border-accent rounded-r-2xl my-8">
              <h4 className="font-heading font-bold text-xl mb-4 text-accent">AUTOMATION FLOW</h4>
              <ol className="space-y-3 text-lg text-secondary">
                <li>1. ANSWER THE ONBOARDING QUESTIONS</li>
                <li>2. TRACK EVERYTHING</li>
                <li>3. LET US TAKE YOU <span className="text-foreground font-bold italic">#TowardsQywam</span></li>
              </ol>
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <div className="grid gap-4">
            {benefits.map((b, i) => (
              <div 
                key={i}
                className="flex items-center gap-6 p-6 rounded-2xl bg-card transition-transform hover:scale-[1.02]"
              >
                <div className="p-3 bg-accent rounded-xl">
                  {b.icon}
                </div>
                <h4 className="font-heading text-background font-bold text-lg md:text-xl uppercase tracking-wide">
                  {b.text}
                </h4>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
