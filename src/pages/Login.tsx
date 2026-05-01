import { Shield, User, Sun, Moon, Zap, ArrowRight, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface LoginProps {
  setRole: (role: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Login({ setRole, isDark, toggleTheme }: LoginProps) {
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Tactical Verification: Sample Credentials
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        setRole('admin');
      } else {
        setError('CRITICAL: Access Denied. Invalid Protocol Credentials.');
        setLoading(false);
      }
    }, 1200);
  };

  const handleInstantAccess = (selectedRole: string) => {
    if (selectedRole === 'admin') {
      setShowAdminLogin(true);
      return;
    }
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Back to Landing Link */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all group"
      >
        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
          <ArrowLeft size={14} />
        </div>
        Back to Home
      </button>
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

        {/* Tactical Access Selection */}
        <div className="clean-card p-2 space-y-2 relative overflow-hidden min-h-[280px] flex flex-col justify-center">
          {!showAdminLogin ? (
            <>
              <button 
                onClick={() => handleInstantAccess('admin')}
                className="w-full group flex items-center justify-between p-6 rounded-[calc(var(--radius)-4px)] hover:bg-primary/5 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all border border-border group-hover:border-primary/20 shadow-sm">
                    <Lock size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-lg text-foreground tracking-tight uppercase italic">Admin Command</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Secure Infrastructure Access</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                onClick={() => handleInstantAccess('volunteer')}
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

              <div className="pt-4 mt-2 border-t border-border/50 mx-6 text-center">
                <p className="text-[8px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                  Admin Credentials: <span className="text-primary opacity-80 normal-case">admin</span> / <span className="text-primary opacity-80 normal-case">admin</span>
                </p>
              </div>
            </>
          ) : (
            <form onSubmit={handleAdminLogin} className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={() => setShowAdminLogin(false)} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">← Back to Selection</button>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                     <span className="text-[9px] font-black uppercase tracking-widest text-red-600">Secure Link Active</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Command Identity</label>
                     <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        className="w-full bg-muted border border-border rounded-xl px-5 py-4 text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:opacity-30"
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Access Protocol</label>
                     <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-muted border border-border rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:opacity-30"
                        required
                     />
                  </div>
               </div>

               <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl text-center">
                  <p className="text-[9px] font-black text-primary tracking-widest opacity-70">Admin Protocol: <span className="normal-case">admin / admin</span></p>
               </div>

               {error && (
                 <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-xl text-center">
                    <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">{error}</p>
                 </div>
               )}

               <button 
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-3 italic tracking-[0.2em] uppercase"
               >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                  Execute Authorization
               </button>

               <p className="text-center text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-50 pt-2">
                 Neural Bridge v4.2 // Encrypted Node
               </p>
            </form>
          )}
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
