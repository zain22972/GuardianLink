import { Users, AlertTriangle, CheckCircle, BarChart3, Map as MapIcon, Shield, Activity, Search } from 'lucide-react';
import hyderabadMap from '../assets/hyderabad_map.png';

export default function Dashboard() {
  const stats = [
    { label: 'Active Volunteers', value: '184', change: '+12', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Urgent Needs', value: '42', change: '-5', icon: AlertTriangle, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Resolved Cases', value: '1,208', change: '+84', icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'System Load', value: '24%', change: 'Normal', icon: Activity, color: 'text-foreground', bg: 'bg-muted' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Strategic <span className="text-primary">Overview</span></h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Coordination Matrix</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Search Sector..." 
               className="w-full bg-card border border-border rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
             />
          </div>
          <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
             Refresh
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="clean-card p-6 group hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 shadow-sm border border-border/50`}>
                  <Icon size={24} />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-muted border border-border`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-foreground tracking-tighter italic">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Map Area */}
        <div className="lg:col-span-2 clean-card overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
               <MapIcon size={20} className="text-primary" />
               <h3 className="text-sm font-black text-foreground uppercase tracking-wider italic">Sector Alpha Tactical Map</h3>
            </div>
            <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-primary"></div>
               <div className="w-2 h-2 rounded-full bg-secondary"></div>
               <div className="w-2 h-2 rounded-full bg-accent"></div>
            </div>
          </div>
          <div className="relative flex-1 min-h-[400px]">
             <img 
               src={hyderabadMap} 
               alt="Tactical Map" 
               className="absolute inset-0 w-full h-full object-cover opacity-80 contrast-125 dark:opacity-40" 
             />
             {/* Map Indicators */}
             <div className="absolute top-1/3 left-1/4 group cursor-pointer">
                <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/40 p-1 border-2 border-white ring-4 ring-primary/20">
                   <div className="w-full h-full bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-card border border-border px-3 py-1.5 rounded-lg text-[9px] font-black text-foreground shadow-xl transition-all whitespace-nowrap">
                   UNIT-04 • ACTIVE
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Alerts / Reports */}
        <div className="space-y-6">
           <div className="clean-card p-6 flex-1">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-black text-foreground uppercase tracking-wider italic">Critical Alerts</h3>
                 <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
              </div>
              <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-2xl bg-muted border border-border hover:border-primary/50 transition-colors cursor-pointer group">
                       <div className="flex gap-4 items-start">
                          <AlertTriangle size={18} className="text-secondary shrink-0 mt-0.5" />
                          <div>
                             <p className="text-xs font-black text-foreground uppercase italic mb-1">Zone {i * 4} • Intrusion</p>
                             <p className="text-[10px] text-muted-foreground font-medium leading-tight">Gemini detected unusual movement at coordinates 17.3850, 78.4867.</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="clean-card p-6 bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-none">
              <div className="flex items-center gap-3 mb-4">
                 <Shield size={20} />
                 <h3 className="text-sm font-black uppercase tracking-wider italic">Guardian Shield</h3>
              </div>
              <p className="text-[10px] font-medium opacity-90 leading-relaxed mb-4 uppercase tracking-tighter italic">
                 System relay is synchronized with the tactical relay.
              </p>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white w-3/4 rounded-full shadow-[0_0_10px_white]"></div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
