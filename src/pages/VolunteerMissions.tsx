import { Navigation2, Clock, Package, Map as MapIcon, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function VolunteerMissions() {
  const missions = [
    {
      id: 'DISPATCH-892',
      destination: 'Community Center - East',
      distance: '1.2 km',
      eta: '5 mins',
      cargo: '12x Thermal Blankets, 4x Med-Kits',
      status: 'Active'
    }
  ];

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">Active <span className="text-primary">Duty</span></h2>
          <p className="text-muted-foreground text-[10px] font-bold mt-1 uppercase tracking-widest">Live Deployments</p>
        </div>
        <div className="bg-card border border-border px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
          Zone Alpha
        </div>
      </div>

      <div className="space-y-6">
        {missions.map(mission => (
          <div key={mission.id} className="clean-card p-6 space-y-6 relative group overflow-hidden">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="font-bold text-xl text-foreground tracking-tight italic uppercase">{mission.destination}</h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">{mission.id}</p>
               </div>
               <div className="text-right">
                  <div className="flex items-center gap-1.5 text-primary font-black text-lg italic tracking-tighter">
                     <Navigation2 size={16} fill="currentColor" strokeWidth={0} />
                     {mission.distance}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-muted-foreground text-[10px] font-bold uppercase tracking-tight">
                     <Clock size={12} />
                     {mission.eta}
                  </div>
               </div>
            </div>

            <div className="bg-muted p-4 rounded-xl border border-border flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Package size={20} />
               </div>
               <div>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Payload Manifest</p>
                  <p className="text-xs text-foreground font-bold leading-relaxed">{mission.cargo}</p>
               </div>
            </div>

            <button 
              onClick={() => window.open('https://www.google.com/maps', '_blank')}
              className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 italic tracking-widest uppercase"
            >
              <MapIcon size={18} />
              Start Navigation
            </button>
          </div>
        ))}

        {/* Route Progress Log */}
        <div className="pt-4">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              <ChevronRight size={14} className="text-primary" />
              Telemetry Log
           </h4>
           <div className="space-y-8 border-l-2 border-border ml-2 pl-6 relative">
              <div className="relative">
                 <div className="absolute -left-[31px] top-1 w-3 h-3 bg-primary rounded-full border-2 border-card shadow-sm"></div>
                 <p className="text-xs font-black text-foreground italic uppercase tracking-tight">Dispatch Initialized</p>
                 <p className="text-[9px] text-muted-foreground font-bold mt-0.5">CODE: LOG_SIGNAL_14:02_PST</p>
              </div>
              <div className="relative opacity-40">
                 <div className="absolute -left-[31px] top-1 w-3 h-3 bg-muted-foreground rounded-full border-2 border-card"></div>
                 <p className="text-xs font-black text-muted-foreground italic uppercase tracking-tight">En Route to Zone</p>
                 <p className="text-[9px] text-muted-foreground font-bold mt-0.5">PENDING_GEOLOCATION...</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
