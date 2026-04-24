import { Camera, RefreshCw, CheckCircle, Zap, Shield, Loader2, AlertTriangle } from 'lucide-react';
import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function VolunteerOCR() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 1. Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('field-reports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('field-reports')
        .getPublicUrl(uploadData.path);

      // 3. Call Python Backend with Timeout
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8002';
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for cold starts

      try {
        const response = await fetch(`${backendUrl}/extract`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: publicUrl }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `Server error (${response.status})`);
        }

        const extractedData = await response.json();
        setResult(extractedData);
      } catch (fetchErr: any) {
        if (fetchErr.name === 'AbortError') {
          throw new Error('Backend took too long to respond. The server is likely waking up — please try again in 30 seconds.');
        }
        throw new Error(`Connection failed: Check if ${backendUrl} is correct and live.`);
      }
    } catch (err: any) {
      console.error('OCR Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-700">
      <div className="text-center">
        <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">Mission <span className="text-primary">Request</span></h2>
        <p className="text-muted-foreground text-[10px] mt-1 font-bold uppercase tracking-widest">Assessment Digitization</p>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        ref={cameraInputRef}
        onChange={handleFileSelect}
      />

      <div className="relative aspect-[3/4] clean-card rounded-3xl overflow-hidden shadow-lg flex flex-col items-center justify-center group">
        {!result ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(234,67,53,0)_0%,rgba(234,67,53,0)_48%,var(--primary)_50%,rgba(234,67,53,0)_52%,rgba(234,67,53,0)_100%)] bg-[length:100%_200%] animate-[scan_2.5s_linear_infinite] opacity-20 pointer-events-none"></div>
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-black text-[9px] uppercase tracking-widest italic text-center">
                  Analyzing via Gemini v3.1...<br/>
                  <span className="text-[7px] text-primary/50 block mt-1 lowercase opacity-50">
                    Connecting to: {import.meta.env.VITE_BACKEND_URL || 'http://localhost:8002'}
                  </span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500 mb-6">
                   <Camera size={28} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest italic mb-2">Sensor Array Offline</h3>
                <p className="text-muted-foreground font-bold text-[9px] uppercase tracking-widest leading-relaxed">Select input source to initialize field assessment scan.</p>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 w-full h-full flex flex-col justify-center bg-primary/5 animate-in zoom-in duration-500">
             <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6">
                <CheckCircle size={24} />
             </div>
             <div className="space-y-4">
                <div>
                   <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Extracted Need</p>
                   <h3 className="text-xl font-black italic tracking-tighter uppercase leading-tight">{result.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Category</p>
                     <div className="px-2 py-1 rounded bg-muted text-[10px] font-black uppercase tracking-widest w-fit">{result.category}</div>
                   </div>
                   <div>
                     <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Priority</p>
                     <div className="px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest w-fit">{result.priority}</div>
                   </div>
                </div>
                <div>
                   <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Location</p>
                   <p className="text-[11px] font-bold text-foreground leading-snug">{result.location}</p>
                </div>
             </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-x-0 bottom-32 mx-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
            <AlertTriangle className="text-red-500 flex-shrink-0" size={16} />
            <p className="text-[10px] text-red-500 font-bold leading-tight">{error}</p>
          </div>
        )}

        <div className="absolute bottom-8 w-full px-6 flex flex-col gap-3">
           {result ? (
              <button 
                onClick={() => setResult(null)}
                className="w-full h-14 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
              >
                 <RefreshCw size={18} /> New Session
              </button>
           ) : (
              <>
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-3"
                >
                   <Camera size={18} /> Capture Live
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-muted border border-border text-foreground font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                   <RefreshCw size={18} className="rotate-45" /> Upload Intel
                </button>
              </>
           )}
        </div>
      </div>

      <div className="bg-card p-5 rounded-2xl border border-border flex items-start gap-4 shadow-sm">
         <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
            <Shield size={20} />
         </div>
         <div>
            <h4 className="font-black text-[9px] text-foreground uppercase tracking-widest mb-0.5 italic">Protocol Alpha-7</h4>
            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">Ensure high-contrast handwriting. Avoid glare for 99.8% extraction accuracy.</p>
         </div>
      </div>
    </div>
  );
}
