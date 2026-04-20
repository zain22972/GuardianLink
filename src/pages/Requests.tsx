import { Brain, CheckCircle, FilePlus, Edit, ShieldCheck, Zap, Layers, Filter } from 'lucide-react';
import clsx from 'clsx';

export default function Requests() {
  const requests = [
    {
      id: 'REQ-901',
      time: '5m ago',
      location: 'Sector Alpha',
      status: 'pending',
      summary: '3 families need blankets, 5L water per household.',
      confidence: '88%',
    },
    {
      id: 'REQ-882',
      time: '12m ago',
      location: 'Sector Gamma',
      status: 'verified',
      summary: 'Urgent medical kit request for elderly resident.',
      confidence: '96%',
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Need <span className="text-primary">Assessments</span></h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">OCR Verification & Data Intake</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-card border border-border px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-all shadow-sm flex items-center justify-center gap-2">
             <Filter size={14} />
             Filter
          </button>
          <button className="flex-1 md:flex-none bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 italic">
             <Brain size={16} />
             Sync Gemini
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div key={req.id} className="clean-card p-6 flex flex-col group hover:border-primary/20 transition-all">
             <div className="flex justify-between items-start mb-6">
                <span className={clsx(
                  "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border",
                  req.status === 'pending' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-accent/10 text-accent border-accent/20'
                )}>
                  {req.status}
                </span>
                <span className="text-muted-foreground text-[8px] font-bold uppercase tracking-wider">{req.time}</span>
             </div>
             
             <div className="flex-1 mb-6">
                <h3 className="text-lg font-black text-foreground italic uppercase tracking-tight mb-1 leading-none">{req.id} • <span className="text-primary">{req.location}</span></h3>
                <p className="text-muted-foreground text-xs font-medium leading-relaxed line-clamp-3 mb-4 italic">{req.summary}</p>
                <div className="flex items-center gap-3 bg-muted p-3 rounded-xl border border-border">
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Brain size={14} />
                   </div>
                   <div>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-0.5">Gemini Confidence</p>
                      <p className="text-xs font-black text-foreground italic">{req.confidence}</p>
                   </div>
                </div>
             </div>

             <div className="flex gap-3 pt-4 border-t border-border">
                <button className="flex-1 bg-muted hover:bg-border text-foreground py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all italic flex items-center justify-center gap-2 border border-border">
                   <Edit size={12} />
                   Edit
                </button>
                <button className={clsx(
                  "flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md hover:opacity-90 transition-all italic flex items-center justify-center gap-2",
                  req.status === 'pending' ? 'bg-primary text-primary-foreground shadow-primary/10' : 'bg-accent text-primary-foreground shadow-accent/10'
                )}>
                  {req.status === 'pending' ? <CheckCircle size={12} /> : <ShieldCheck size={12} />}
                  {req.status === 'pending' ? 'Verify' : 'Verified'}
                </button>
             </div>
          </div>
        ))}
        
        {/* Upload Card */}
        <div className="border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all border border-border mb-4">
               <FilePlus size={20} />
            </div>
            <p className="text-xs font-black text-foreground uppercase tracking-widest mb-1">Upload Form</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest max-w-[120px]">Tactical Scanner Bypass</p>
        </div>
      </div>
    </div>
  );
}
