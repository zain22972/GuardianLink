import { Megaphone, History, PenTool, Users, AlertTriangle, Send, Activity, Target } from 'lucide-react';
import clsx from 'clsx';

export default function Broadcast() {
  const history = [
    { id: 'ALR-42', time: '1h ago', content: 'Storm surge expected in 30 mins. Move to high ground immediately.', reach: '142 units', status: 'Delivered' },
    { id: 'ALR-41', time: '4h ago', content: 'Medical resupply at Zone Delta is now active.', reach: '88 units', status: 'Delivered' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">HQ <span className="text-primary">Broadcast</span></h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">FCM Command Center</p>
        </div>
      </section>

      <section className="clean-card p-8 md:p-10 relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <PenTool size={14} className="text-primary" /> Composition
            </label>
            <textarea 
              rows={4} 
              placeholder="Enter critical instructions..." 
              className="w-full bg-muted border border-border rounded-2xl p-6 text-lg font-bold tracking-tight focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 italic"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <Target size={14} className="text-primary" /> Target Audience
              </label>
              <div className="flex flex-wrap gap-2">
                 <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm italic">All Units</button>
                 <button className="bg-card text-foreground hover:bg-muted px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all italic border border-border">Sectors</button>
                 <button className="bg-card text-foreground hover:bg-muted px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all italic border border-border">Medics</button>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <AlertTriangle size={14} className="text-primary" /> Alert Level
              </label>
              <div className="flex gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 bg-primary/10 p-3 rounded-xl border border-primary/20 cursor-pointer hover:bg-primary/20 transition-all">
                   <input type="radio" name="level" className="hidden" defaultChecked />
                   <div className="w-3 h-3 rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                   </div>
                   <span className="text-[9px] font-black text-primary uppercase tracking-widest">Critical</span>
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 bg-secondary/10 p-3 rounded-xl border border-secondary/20 cursor-pointer hover:bg-secondary/20 transition-all">
                   <input type="radio" name="level" className="hidden" />
                   <div className="w-3 h-3 rounded-full border-2 border-secondary flex items-center justify-center"></div>
                   <span className="text-[9px] font-black text-secondary uppercase tracking-widest">High</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button className="w-full bg-primary text-primary-foreground font-black py-5 rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-4 italic tracking-widest uppercase">
              <Megaphone size={24} />
              Initiate Broadcast
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
           <History size={20} className="text-primary" />
           <h3 className="text-sm font-black text-foreground uppercase tracking-wider italic">Transmission Logs</h3>
        </div>
        
        <div className="space-y-4">
          {history.map(item => (
            <div key={item.id} className="clean-card p-6 flex flex-col md:flex-row justify-between gap-6 group hover:border-primary/20 transition-all">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                     <span className="text-[9px] font-black text-foreground bg-muted px-2 py-0.5 rounded border border-border tracking-widest">{item.id}</span>
                     <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{item.time}</span>
                  </div>
                  <p className="text-base text-foreground font-bold tracking-tight italic leading-relaxed">"{item.content}"</p>
               </div>
               <div className="flex items-end md:items-center gap-8 shrink-0">
                  <div className="text-right">
                     <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Reach</p>
                     <p className="text-base font-black text-foreground italic tracking-tight">{item.reach}</p>
                  </div>
                  <div className="bg-accent/10 border border-accent/20 text-accent px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest italic">
                     {item.status}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
