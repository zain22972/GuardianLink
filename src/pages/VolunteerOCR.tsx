import { Camera, RefreshCw, CheckCircle, Zap, Shield } from 'lucide-react';
import { useState } from 'react';

export default function VolunteerOCR() {
  const [captured, setCaptured] = useState(false);

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-700">
      <div className="text-center">
        <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">Mission <span className="text-primary">Request</span></h2>
        <p className="text-muted-foreground text-[10px] mt-1 font-bold uppercase tracking-widest">Assessment Digitization</p>
      </div>

      <div className="relative aspect-[3/4] clean-card rounded-3xl overflow-hidden shadow-lg flex flex-col items-center justify-center group">
        {!captured ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(234,67,53,0)_0%,rgba(234,67,53,0)_48%,var(--primary)_50%,rgba(234,67,53,0)_52%,rgba(234,67,53,0)_100%)] bg-[length:100%_200%] animate-[scan_2.5s_linear_infinite] opacity-20 pointer-events-none"></div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500">
               <Camera size={28} strokeWidth={2} />
            </div>
            <p className="text-muted-foreground mt-4 font-black text-[9px] uppercase tracking-widest italic">Align Scanner Matrix</p>
          </>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
             <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4 border border-accent/20">
                <CheckCircle size={32} strokeWidth={2.5} />
             </div>
             <p className="font-black text-lg text-foreground italic tracking-tight uppercase">Data Secured</p>
             <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest mt-1">Processing Gemini Engine...</p>
          </div>
        )}

        <div className="absolute bottom-8 flex gap-4">
           <button 
             onClick={() => setCaptured(!captured)}
             className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground active:scale-95 transition-all shadow-sm group-hover:border-primary/40"
           >
              {captured ? <RefreshCw size={24} /> : <div className="w-10 h-10 rounded-lg bg-primary shadow-lg shadow-primary/20"></div>}
           </button>
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
