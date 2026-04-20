import { Send, ShieldAlert, Zap, Map as MapIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function VolunteerChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'GuardianLink Tactical-AI online. How can I assist your field operations?' }
  ]);

  const suggestions = [
    { label: 'Protocols', icon: ShieldAlert, color: 'text-primary' },
    { label: 'Depots', icon: MapIcon, color: 'text-secondary' },
    { label: 'Status', icon: Zap, color: 'text-accent' }
  ];

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col py-4 animate-in fade-in duration-700">
      <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pb-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={clsx("flex", msg.role === 'ai' ? 'justify-start' : 'justify-end')}>
            <div className={clsx(
              "max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed relative shadow-sm",
              msg.role === 'ai' 
                ? 'bg-card text-foreground rounded-bl-none border border-border border-l-4 border-l-secondary' 
                : 'bg-primary text-primary-foreground rounded-br-none shadow-primary/20'
            )}>
              {msg.text}
              {msg.role === 'ai' && (
                <div className="absolute -left-1.5 top-2 w-1.5 h-1.5 bg-secondary rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t border-border mt-auto">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {suggestions.map(s => (
            <button key={s.label} className="bg-card hover:bg-muted text-foreground px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-border whitespace-nowrap flex items-center gap-2 transition-all active:scale-95 shadow-sm">
              <s.icon size={14} className={s.color} />
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Query Parameters..."
            className="w-full bg-card border border-border rounded-2xl py-4 pl-6 pr-14 text-xs font-bold tracking-tight focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
          />
          <button className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-primary/20">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
