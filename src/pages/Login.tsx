import { useState } from 'react';
import { Shield, User, Sun, Moon, Zap, ArrowRight } from 'lucide-react';

interface LoginProps {
  setRole: (role: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Login({ setRole, isDark, toggleTheme }: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 mb-6 group cursor-default">
            <Shield className="text-white w-10 h-10 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
            Guardian<span className="text-primary">Link</span>
          </h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Tactical Response Suite</p>
        </div>

        {/* Login Card */}
        <div className="clean-card p-2 space-y-2 relative overflow-hidden">
          <button 
            onClick={() => setRole('admin')}
            className="w-full group flex items-center justify-between p-6 rounded-[calc(var(--radius)-4px)] hover:bg-primary/5 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all border border-border group-hover:border-primary/20 shadow-sm">
                <Shield size={24} />
              </div>
              <div className="text-left">
                <p className="font-black text-lg text-foreground tracking-tight uppercase italic">Admin Command</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Full Infrastructure Oversight</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>

          <button 
            onClick={() => setRole('volunteer')}
            className="w-full group flex items-center justify-between p-6 rounded-[calc(var(--radius)-4px)] hover:bg-secondary/5 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary transition-all border border-border group-hover:border-secondary/20 shadow-sm">
                <User size={24} />
              </div>
              <div className="text-left">
                <p className="font-black text-lg text-foreground tracking-tight uppercase italic">Field Responder</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Tactical Mission Interaction</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card hover:bg-muted transition-all text-[9px] font-black uppercase tracking-widest shadow-sm"
          >
            {isDark ? <Sun size={14} className="text-secondary" /> : <Moon size={14} className="text-primary" />}
            Switch to {isDark ? 'Light' : 'Dark'} Mode
          </button>

          <div className="flex items-center gap-2 opacity-50">
            <Zap size={12} className="text-secondary animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Neural Bridge Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
