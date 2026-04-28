import { Search, Filter, Users, CheckCircle, MapPin, Map as MapIcon, Activity, Zap, Shield, Loader2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import hyderabadMap from '../assets/hyderabad_map.png';

export default function Directory() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVolunteers();
  }, []);

  async function fetchVolunteers() {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'volunteer')
      .order('full_name');
    
    if (data) setVolunteers(data);
    setLoading(false);
  }

  async function decommissionVolunteer(id: string) {
    if (!confirm('CRITICAL: Are you sure you want to decommission this asset from the registry?')) return;
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setVolunteers(prev => prev.filter(v => v.id !== id));
    }
  }

  const filtered = volunteers.filter(v => 
    v.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    v.skills?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative space-y-10 animate-in fade-in duration-1000 p-4 md:p-0">
      <div className="fixed inset-0 tech-bg pointer-events-none"></div>

      {/* Header Section */}
      <section className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">Personnel <span className="text-primary text-glow-primary">Matrix</span></h2>
          <div className="flex items-center gap-2 mt-2">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">Volunteer Registry // Sector Alpha</p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-80 relative group">
             <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
             <input 
               type="text" 
               placeholder="SEARCH ASSETS..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full premium-glass rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-2xl border-border/50"
             />
          </div>
          <button onClick={fetchVolunteers} className="bg-foreground text-background p-4 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
          </button>
        </div>
      </section>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 z-10">
        {/* Tactical Asset Map - Hidden on small mobile to prioritize list */}
        <div className="hidden md:flex lg:col-span-8 tactical-card rounded-[3rem] overflow-hidden flex-col shadow-2xl border-border/40 group min-h-[500px]">
          <div className="p-8 border-b border-border/50 flex items-center justify-between premium-glass">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <MapIcon size={22} />
               </div>
               <h3 className="text-sm font-black text-foreground italic uppercase tracking-[0.2em]">Personnel Distribution</h3>
            </div>
            <div className="flex gap-2">
               <div className="bg-card/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-border flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--accent)]"></span>
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{volunteers.length} Active Units</span>
               </div>
            </div>
          </div>
          
          <div className="flex-grow relative overflow-hidden bg-muted/20">
             <img 
                alt="Strategic Map" 
                className="w-full h-full object-cover opacity-90 contrast-125 dark:opacity-30 group-hover:scale-105 transition-transform duration-[15s] ease-linear grayscale-[0.2]" 
                src={hyderabadMap} 
             />
             <MapCluster top="30%" left="40%" number="12" label="Sector Alpha" type="busy" />
             <MapCluster top="60%" left="20%" number="05" label="Sector Beta" type="available" />
             <MapCluster top="45%" left="75%" number="28" label="Sector Gamma" type="available" isPulse={true} />
          </div>
        </div>

        {/* Personnel List */}
        <div className="lg:col-span-4 tactical-card p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border-border/30 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-foreground italic uppercase tracking-[0.2em]">Live Registry</h3>
            <span className="bg-muted px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-muted-foreground border border-border">{filtered.length} Assets</span>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2 space-y-4 no-scrollbar">
            {filtered.map((vol, idx) => (
               <div key={vol.id} className="premium-glass p-5 rounded-[2rem] border border-border/50 hover:border-primary/40 transition-all duration-300 group animate-in slide-in-from-right-10 relative overflow-hidden" style={{animationDelay: `${idx*0.05}s`}}>
                  <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-4">
                        <div className="relative">
                           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-black text-xl italic border border-primary/10 shadow-inner">
                              {vol.full_name?.charAt(0) || 'V'}
                           </div>
                           <span className={clsx(
                             "absolute -bottom-1 -right-1 w-4 h-4 border-2 border-card rounded-full shadow-lg",
                             vol.is_available ? 'bg-accent shadow-[0_0_8px_var(--accent)]' : 'bg-secondary shadow-[0_0_8px_var(--secondary)]'
                           )}></span>
                        </div>
                        <div>
                           <h4 className="font-black text-foreground uppercase tracking-tight text-xs group-hover:text-primary transition-colors">{vol.full_name}</h4>
                           <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5 mt-1.5">
                             <MapPin size={10} className="text-primary" /> {vol.location || 'Sector Unknown'}
                           </p>
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <span className={clsx(
                          "font-black text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-muted border border-border",
                          vol.is_available ? 'text-accent' : 'text-secondary'
                        )}>
                          {vol.is_available ? 'READY' : 'BUSY'}
                        </span>
                        <button 
                          onClick={() => decommissionVolunteer(vol.id)}
                          className="p-2 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Decommission Asset"
                        >
                           <Trash2 size={12} />
                        </button>
                     </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {vol.skills?.slice(0, 2).map((s: string) => (
                      <span key={s} className="bg-muted text-muted-foreground text-[7px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg border border-border/50">
                        {s}
                      </span>
                    )) || <span className="text-[7px] font-bold text-muted-foreground italic">No specialized skills</span>}
                    {vol.skills?.length > 2 && (
                      <span className="text-[7px] font-black text-muted-foreground bg-muted px-2 py-1 rounded-lg border border-border/50">+{vol.skills.length - 2}</span>
                    )}
                  </div>
               </div>
            ))}
            {filtered.length === 0 && (
               <div className="py-20 text-center opacity-20 italic">
                  <Users size={48} className="mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No matching personnel found</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Statistics */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        <StatCard title="Total Registry" value={String(volunteers.length)} icon={Users} color="text-primary" bg="bg-primary/10" />
        <StatCard title="Field Ready" value={String(volunteers.filter(v => v.is_available).length)} icon={CheckCircle} color="text-accent" bg="bg-accent/10" />
        <StatCard title="Command Sectors" value="4" icon={MapIcon} color="text-secondary" bg="bg-secondary/10" />
      </div>
    </div>
  );
}

function MapCluster({ top, left, number, label, type, isPulse = false }: any) {
  const isBusy = type === 'busy';
  const colorClass = isBusy ? 'bg-secondary text-secondary-foreground shadow-[0_0_15px_var(--secondary)]' : 'bg-accent text-accent-foreground shadow-[0_0_15px_var(--accent)]';
  
  return (
    <div className={`absolute flex flex-col items-center group cursor-pointer`} style={{ top, left }}>
      <div className={clsx(
        colorClass,
        "w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-white/20 font-black transition-all group-hover:scale-125 relative z-20",
        isPulse && "ring-4 ring-accent/20"
      )}>
        {number}
        {isPulse && <div className="absolute inset-0 bg-accent rounded-2xl animate-ping opacity-25"></div>}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-all premium-glass px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl mt-4 border border-border/50 whitespace-nowrap z-30">
        {label}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="tactical-card p-8 rounded-[2.5rem] flex items-center gap-6 group hover:border-primary/40 transition-all shadow-2xl">
      <div className={clsx(
        "w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all group-hover:scale-110 border border-border/50 shadow-inner",
        bg, color
      )}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">{title}</p>
        <h4 className="text-3xl font-black text-foreground italic tracking-tighter leading-none">{value}</h4>
      </div>
    </div>
  );
}
