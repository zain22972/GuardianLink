import { Send, ShieldAlert, Zap, Map as MapIcon, Loader2, Bot } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import clsx from 'clsx';

export default function VolunteerChat() {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome',
      content: "Hi there! I'm EVA. I'm here to keep an eye on things and make sure you stay safe out there in the field. Remember, I've always got your back. How can I help you with your mission today? 😊✨",
      sender_id: 'eva-bot',
      created_at: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user || { id: 'tactical-guest', email: 'field@guardianlink.ai' });
    };
    setupChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getEVAResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('protocol')) {
      return "Safety first! Our current field protocols emphasize 3-point contact and continuous radio check-ins. You're doing a great job out there! 🛡️";
    }
    if (q.includes('depot')) {
      return "Scanning local sectors... I've located 3 active supply depots within your 5km radius. They have fresh water and medical kits ready for you! 📍";
    }
    if (q.includes('status')) {
      return "All systems are green! Your mission telemetry is syncing perfectly with Command. Stay hydrated, you're making a real difference today! ⚡";
    }
    return "I'm not quite sure about that one, but remember that EVA is always here to support you! Botting is help, and I'm your best field companion! 🌟";
  };

  const handleSend = async (customQuery?: string) => {
    const messageContent = customQuery || input;
    if (!messageContent.trim() || !user) return;

    const userMessage = {
      id: Date.now().toString(),
      content: messageContent,
      sender_id: user.id,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Tactical Uplink to Gemini Backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8002';
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageContent })
      });

      const data = await response.json();

      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || getEVAResponse(messageContent),
        sender_id: 'eva-bot',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('EVA Uplink Error:', error);
      // Fallback to Simulated Neural Logic
      setTimeout(() => {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          content: getEVAResponse(messageContent),
          sender_id: 'eva-bot',
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { label: 'Protocols', icon: ShieldAlert, color: 'text-primary' },
    { label: 'Depots', icon: MapIcon, color: 'text-secondary' },
    { label: 'Status', icon: Zap, color: 'text-accent' }
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col py-4 animate-in fade-in duration-700">
      <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pb-6 px-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isBot = msg.sender_id === 'eva-bot';
            const isMe = msg.sender_id === user?.id;

            return (
              <div key={msg.id || idx} className={clsx("flex flex-col", isMe ? 'items-end' : 'items-start')}>
                {!isMe && (
                  <div className="flex items-center gap-2 mb-2 ml-2">
                    <div className="w-5 h-5 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
                      <Bot size={12} className="text-secondary" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary">EVA Assistant</span>
                  </div>
                )}
                <div className={clsx(
                  "max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed relative shadow-sm",
                  isBot
                    ? 'bg-card text-foreground rounded-bl-none border border-border border-l-4 border-l-secondary'
                    : 'bg-primary text-primary-foreground rounded-br-none shadow-primary/20'
                )}>
                  {msg.content}
                </div>
                <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-2 px-2">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="space-y-4 pt-6 border-t border-white/5 mt-auto bg-background/50 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {suggestions.map(s => (
            <button
              key={s.label}
              onClick={() => handleSend(s.label)}
              className="bg-card hover:bg-muted text-foreground px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-border whitespace-nowrap flex items-center gap-2 transition-all active:scale-95 shadow-xl"
            >
              <s.icon size={14} className={s.icon === ShieldAlert ? 'text-primary' : s.icon === MapIcon ? 'text-secondary' : 'text-accent'} />
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
          <input
            type="text"
            placeholder="Talk to EVA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="relative w-full bg-card/80 backdrop-blur-md border border-border rounded-[1.5rem] py-5 pl-8 pr-16 text-sm font-medium tracking-tight focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 shadow-2xl"
          />
          <button
            onClick={() => handleSend()}
            className="absolute right-3 top-3 bottom-3 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-xl shadow-primary/30"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
