import React from "react";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight, Shield, Zap, Info } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-background min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-black italic">G</div>
          <span className="font-black italic text-xl tracking-tighter uppercase">Guardian<span className="text-primary">Link</span></span>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/zain22972/GuardianLink" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest"
          >
            <Globe size={20} />
            GitHub
          </a>
          <button 
            onClick={() => navigate("/login")}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero with Scroll Animation */}
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center">
              <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                Tactical <span className="text-primary">Response</span> <br />
                <span className="text-5xl md:text-[6rem]">Suite</span>
              </h1>
              <p className="mt-8 max-w-2xl text-muted-foreground text-sm md:text-lg font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                GuardianLink bridges the gap between chaotic disaster zones and rapid relief. 
                Experience real-time resource matching, AI-driven field assessments, and 
                a unified command center designed for the high-stakes of saving lives.
              </p>
              <div className="mt-20 flex gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <button 
                  onClick={() => navigate("/login")}
                  className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:translate-y-[-2px] transition-all active:scale-95 flex items-center gap-3 italic mb-10"
                >
                  Get Started <ArrowRight size={20} />
                </button>
              </div>
            </div>
          }
        >
          <img
            src="/src/assets/minimalist_dashboard.png"
            alt="GuardianLink Tactical Interface"
            className="mx-auto rounded-2xl object-contain h-full w-full"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      {/* Features Grid */}
      <section className="px-8 py-24 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="text-primary" />}
            title="Real-time Matching"
            description="Our Gemini-powered engine connects volunteer skillsets to critical incident needs in seconds."
          />
          <FeatureCard 
            icon={<Shield className="text-secondary" />}
            title="Tactical Command"
            description="Centralized oversight for admin teams to broadcast alerts and manage multi-zone deployments."
          />
          <FeatureCard 
            icon={<Globe className="text-accent" />}
            title="Field Ready"
            description="Optimized mobile interface for responders featuring OCR assessment and tactical manifests."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 gradient-primary rounded-md"></div>
            <span className="font-bold text-sm tracking-tight">© 2026 GuardianLink Strategic.</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Security</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="https://github.com/zain22972/GuardianLink" target="_blank" className="hover:text-primary transition-colors">Open Source</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="clean-card p-8 group hover:border-primary/50 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold italic uppercase tracking-tight mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
