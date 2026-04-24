import { Navigation2, Clock, Package, Map as MapIcon, ChevronRight, Loader2, Shield, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import clsx from 'clsx';

export default function VolunteerMissions() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const volunteerId = user?.id || 'd3886561-8935-4228-9721-66795f543661'; // Fallback to a test volunteer

      const { data, error } = await supabase.from('missions')
        .select('*, needs(*)')
        .eq('volunteer_id', volunteerId)
        .in('status', ['pending', 'in_progress'])
        .order('assigned_at', { ascending: false });

      if (data) {
        setMissions(data);
      }
      setLoading(false);
    };

    fetchMissions();
  }, []);

  async function handleComplete(missionId: string, needId: string, volunteerId: string) {
    if (!confirm('Tactical Report: Confirm objective resolution? Personnel will be returned to the active deployment pool.')) return;
    
    setLoading(true);
    try {
      // 1. Update Mission Status
      await supabase.from('missions').update({ status: 'completed' }).eq('id', missionId);
      
      // 2. Update Need Status
      await supabase.from('needs').update({ status: 'resolved' }).eq('id', needId);
      
      // 3. Restore Asset Availability (In both tables for redundancy)
      await supabase.from('profiles').update({ is_available: true, status: 'available' }).eq('id', volunteerId);
      await supabase.from('volunteers').update({ is_available: true, status: 'available' }).eq('id', volunteerId);
      
      // 4. Refresh Grid
      window.location.reload(); 
    } catch (error) {
      console.error('Resolution Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">Active <span className="text-primary">Duty</span></h2>
          <p className="text-muted-foreground text-[10px] font-bold mt-1 uppercase tracking-widest">Live Deployments</p>
        </div>
        <div className="bg-card border border-border px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
          {missions.length} ASSIGNED
        </div>
      </div>

      <div className="space-y-6">
        {missions.map(mission => (
          <div key={mission.id} className="clean-card p-6 space-y-6 relative group overflow-hidden">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="font-bold text-xl text-foreground tracking-tight italic uppercase">{mission.needs?.title || 'Unknown Objective'}</h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">MISSION_ID: {mission.id.slice(0, 8)}</p>
               </div>
               <div className="text-right">
                  <div className="flex items-center gap-1.5 text-primary font-black text-lg italic tracking-tighter">
                     <Navigation2 size={16} fill="currentColor" strokeWidth={0} />
                     {mission.needs?.location ? 'ACTIVE' : 'N/A'}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-muted-foreground text-[10px] font-bold uppercase tracking-tight">
                     <Clock size={12} />
                     {new Date(mission.assigned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
               </div>
            </div>

            <div className="bg-muted p-4 rounded-xl border border-border flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Package size={20} />
               </div>
               <div>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Objective Manifest</p>
                  <p className="text-xs text-foreground font-bold leading-relaxed">{mission.needs?.description || 'No additional intel provided.'}</p>
               </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => window.open(`https://www.google.com/maps?q=${mission.needs?.latitude},${mission.needs?.longitude}`, '_blank')}
                className="flex-1 bg-muted text-foreground border border-border font-black py-4 rounded-2xl shadow-lg hover:bg-foreground hover:text-background active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 italic tracking-widest uppercase"
              >
                <MapIcon size={18} />
                Map
              </button>
              <button 
                onClick={() => handleComplete(mission.id, mission.need_id, mission.volunteer_id)}
                className="flex-[2] bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 italic tracking-widest uppercase"
              >
                <CheckCircle2 size={18} />
                Resolve Objective
              </button>
            </div>
          </div>
        ))}

        {missions.length === 0 && (
          <div className="clean-card p-12 text-center border-dashed border-2 flex flex-col items-center gap-4 opacity-50">
             <Shield className="w-12 h-12 text-muted-foreground" />
             <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Waiting for Tactical Dispatch...</p>
          </div>
        )}

        {/* Route Progress Log */}
        {missions.length > 0 && (
          <div className="pt-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <ChevronRight size={14} className="text-primary" />
                Telemetry Log
             </h4>
             <div className="space-y-8 border-l-2 border-border ml-2 pl-6 relative">
                <div className="relative">
                   <div className="absolute -left-[31px] top-1 w-3 h-3 bg-primary rounded-full border-2 border-card shadow-sm"></div>
                   <p className="text-xs font-black text-foreground italic uppercase tracking-tight">Mission Assigned</p>
                   <p className="text-[9px] text-muted-foreground font-bold mt-0.5">CODE: LOG_SIGNAL_SYNCED</p>
                </div>
                <div className="relative opacity-40">
                   <div className="absolute -left-[31px] top-1 w-3 h-3 bg-muted-foreground rounded-full border-2 border-card"></div>
                   <p className="text-xs font-black text-muted-foreground italic uppercase tracking-tight">En Route to Zone</p>
                   <p className="text-[9px] text-muted-foreground font-bold mt-0.5">PENDING_GEOLOCATION...</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
