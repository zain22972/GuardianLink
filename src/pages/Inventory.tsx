import { Activity, Box, Archive, FileText, Zap, ShieldCheck, Search } from 'lucide-react';
import clsx from 'clsx';

export default function Inventory() {
  const supplies = [
    { name: 'Thermal Blankets', warehouse: 450, field: 120, total: 2000, unit: 'Units' },
    { name: 'Potable Water', warehouse: 1200, field: 800, total: 5000, unit: 'Liters' },
    { name: 'First Aid Kits', warehouse: 85, field: 42, total: 200, unit: 'Kits' },
    { name: 'Heavy Duty Tarps', warehouse: 12, field: 48, total: 100, unit: 'Units', low: true }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Asset <span className="text-primary">Inventory</span></h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">Resource Manifest & Logistics</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-card border border-border px-6 py-3 rounded-xl flex items-center gap-4 shadow-sm">
              <div className="text-right">
                 <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest leading-none mb-1">Fleet Health</p>
                 <p className="text-lg font-black text-accent italic uppercase tracking-tight leading-none">Optimal</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                 <ShieldCheck size={20} />
              </div>
           </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Resource List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div className="flex items-center gap-3">
                <Archive size={20} className="text-primary" />
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider italic">Critical Supplies</h3>
             </div>
             <div className="relative w-full md:w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filter items..." 
                  className="w-full bg-card border border-border rounded-lg py-2 pl-9 pr-3 text-[11px] font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
             </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {supplies.map(s => (
              <InventoryCard key={s.name} item={s} />
            ))}
          </div>
        </div>

        {/* Global Logistics Sidebar */}
        <div className="lg:col-span-5">
           <div className="clean-card p-8 sticky top-32 space-y-8 overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-xl font-black text-foreground italic uppercase tracking-tighter mb-1">Logistics <span className="text-primary">Summary</span></h3>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Real-time distribution analytics</p>
             </div>
             
             <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      <span className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-primary"></div>
                         Field Distribution
                      </span>
                      <span className="text-primary font-black">32%</span>
                   </div>
                   <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '32%' }}></div>
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      <span className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-accent"></div>
                         Warehouse Surplus
                      </span>
                      <span className="text-accent font-black">68%</span>
                   </div>
                   <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border">
                      <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: '68%' }}></div>
                   </div>
                </div>
             </div>

             <div className="pt-8 border-t border-border relative z-10">
                <button className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all italic tracking-widest uppercase text-xs flex items-center justify-center gap-3">
                  <FileText size={18} />
                  Tactical Manifest
                </button>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}

function InventoryCard({ item }) {
  const percentage = (item.warehouse + item.field) / item.total * 100;

  return (
    <div className="clean-card p-6 group hover:border-primary/20 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="font-black text-xl text-foreground italic uppercase tracking-tight leading-none mb-1">{item.name}</h4>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.unit} Matrix</p>
        </div>
        {item.low && (
           <div className="bg-primary/10 text-primary text-[9px] font-black px-3 py-1 rounded-lg border border-primary/20 animate-pulse uppercase tracking-widest">
              Critical
           </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="bg-muted p-4 rounded-xl border border-border">
            <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5">Stored Depot</p>
            <p className="text-xl font-black text-foreground italic tracking-tighter leading-none">{item.warehouse}</p>
         </div>
         <div className="bg-muted p-4 rounded-xl border border-border">
            <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5">Deployed Field</p>
            <p className="text-xl font-black text-primary italic tracking-tighter leading-none">{item.field}</p>
         </div>
      </div>

      <div className="space-y-2">
         <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground">
            <span>Quota Capacity</span>
            <span>{Math.round(percentage)}%</span>
         </div>
         <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border">
            <div 
              className={clsx(
                "h-full rounded-full transition-all duration-1000",
                item.low ? 'bg-primary' : 'bg-accent'
              )} 
              style={{ width: `${percentage}%` }}
            ></div>
         </div>
      </div>
    </div>
  );
}
