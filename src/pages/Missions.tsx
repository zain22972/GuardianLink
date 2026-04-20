import hyderabadMap from '../assets/hyderabad_map.png';
import { MapPin, Clock, Download, Activity, Target, ShieldCheck, Zap } from 'lucide-react';
import clsx from 'clsx';

export default function Missions() {
  const activeMissions = [
    { id: 'MSN-72', volunteer: 'Sarah J.', status: 'En Route', eta: '4m', objective: '3rd Ave Dropoff', progress: 65, lat: '40%', lng: '35%' },
    { id: 'MSN-75', volunteer: 'Marcus R.', status: 'On Site', eta: '--', objective: 'Assessment', progress: 90, lat: '55%', lng: '60%' },
    { id: 'MSN-78', volunteer: 'David L.', status: 'Returning', eta: '12m', objective: 'Resupply', progress: 20, lat: '25%', lng: '70%' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row animate-in fade-in duration-700 overflow-hidden">
      {/* Side Panel */}
      <section className="w-full md:w-80 lg:w-96 bg-card border-r border-border flex flex-col h-1/2 md:h-full z-20 shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">Live <span className="text-primary">Missions</span></h2>
          <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest mt-1">Tactical Command View</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {activeMissions.map(mission => (
            <div key={mission.id} className="clean-card p-5 group hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-tight leading-none mb-1 text-sm">{mission.volunteer}</h4>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{mission.id}</p>
                </div>
                <span className={clsx(
                  "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border",
                  mission.status === 'On Site' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-primary/10 text-primary border-primary/20'
                )}>
                  {mission.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Target size={12} className="text-primary" /> {mission.objective}
                  </span>
                  <span className="text-primary italic">ETA {mission.eta}</span>
                </div>
                
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden border border-border">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${mission.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-muted/30 border-t border-border">
           <button className="w-full bg-card hover:bg-muted text-foreground font-black py-3 rounded-xl border border-border transition-all flex items-center justify-center gap-2 italic tracking-widest uppercase text-[10px]">
              <Download size={14} />
              Export Logs
           </button>
        </div>
      </section>

      {/* Map View */}
      <section className="flex-1 relative bg-muted/10">
        <img 
          alt="Hyderabad Tactical Map" 
          className="w-full h-full object-cover opacity-80 contrast-125 dark:opacity-30"
          src={hyderabadMap} 
        />
        
        {/* Map Assets */}
        {activeMissions.map(mission => (
          <div key={mission.id} className="absolute flex flex-col items-center group cursor-pointer" style={{ top: mission.lat, left: mission.lng }}>
             <div className="relative">
                <div className="w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-card p-0.5">
                   <div className="w-full h-full bg-white rounded-full animate-pulse"></div>
                </div>
             </div>
             <div className="opacity-0 group-hover:opacity-100 transition-all bg-card border border-border px-3 py-1 rounded-lg text-[9px] font-black shadow-lg mt-2 whitespace-nowrap z-50 pointer-events-none uppercase tracking-widest italic">
                {mission.volunteer} • {mission.objective}
             </div>
          </div>
        ))}

        {/* Legend Overlay */}
        <div className="absolute bottom-6 right-6 clean-card p-5 shadow-lg flex flex-col gap-4 max-w-xs">
           <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-3">Map Legend</h3>
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-primary rounded-full border border-card shadow-sm"></div>
                 <span className="text-[9px] font-bold text-foreground uppercase tracking-widest italic">Volunteer Activity</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-accent rounded-full border border-card shadow-sm"></div>
                 <span className="text-[9px] font-bold text-foreground uppercase tracking-widest italic">Depot / Safe Zone</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
