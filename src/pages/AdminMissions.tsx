import { useState, useEffect } from 'react';
import { Shield, MapPin, Clock, CheckCircle2, Navigation2, Activity, Loader2, Download, ExternalLink, Zap, Phone } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import clsx from 'clsx';
import { supabase } from '../lib/supabase';

// Fix for Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const redMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function AdminMissions() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  async function fetchMissions() {
    setLoading(true);
    try {
      // 1. Fetch raw missions
      const { data: missionData, error: mErr } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'pending')
        .order('assigned_at', { ascending: false });

      if (mErr) throw mErr;
      if (!missionData || missionData.length === 0) {
        setMissions([]);
        return;
      }

      // 2. Fetch all related data in parallel for merging
      const [needsRes, profilesRes, volunteersRes] = await Promise.all([
        supabase.from('needs').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('volunteers').select('*')
      ]);

      // 3. Manual Join & Deduplication (Singular Intelligence)
      const missionMap = new Map();
      missionData.forEach(mission => {
        if (!missionMap.has(mission.need_id)) {
          missionMap.set(mission.need_id, {
            ...mission,
            needs: needsRes.data?.find(n => n.id === mission.need_id),
            profiles: profilesRes.data?.find(p => p.id === mission.volunteer_id),
            volunteers: volunteersRes.data?.find(v => v.id === mission.volunteer_id)
          });
        }
      });

      setMissions(Array.from(missionMap.values()));
    } catch (err) {
      console.error('Error fetching missions:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleResolve = async (mission: any) => {
    setResolvingId(mission.id);
    try {
      // 1. Mark Mission as Completed
      await supabase.from('missions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', mission.id);

      // 2. Mark Need as Resolved
      await supabase.from('needs')
        .update({ status: 'resolved' })
        .eq('id', mission.need_id);

      // 3. Mark Volunteer as Available
      await supabase.from('profiles')
        .update({ is_available: true, status: 'available' })
        .eq('id', mission.volunteer_id);

      // Also fallback volunteers table
      await supabase.from('volunteers')
        .update({ is_available: true, status: 'available' })
        .eq('id', mission.volunteer_id);

      // Success animation and refresh
      setTimeout(() => {
        setMissions(prev => prev.filter(m => m.id !== mission.id));
        setResolvingId(null);
      }, 800);

    } catch (err) {
      console.error('Resolve error:', err);
      setResolvingId(null);
    }
  };

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Mission ID,Title,Volunteer,Status,Assigned At\n"
      + missions.map(m => `${m.id},${m.needs?.title},${m.profiles?.full_name},${m.status},${m.assigned_at}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GuardianLink_Missions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Scanning Active Frequencies...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-10 animate-in fade-in duration-1000 pb-20">
      <div className="fixed inset-0 tech-bg pointer-events-none"></div>

      {/* Header Section */}
      <section className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 px-4">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">Mission <span className="text-red-600 text-glow-red">Intelligence</span></h2>
          <div className="flex items-center gap-2 mt-2">
             <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
             <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em]">End-to-End Tracking // Active</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={exportLogs} className="flex items-center gap-3 bg-card border border-white/10 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all italic shadow-xl">
            <Download size={14} />
            Export Tactical Logs
          </button>
          <button onClick={fetchMissions} className="flex items-center gap-3 bg-red-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-500 transition-all italic">
            <Zap size={16} />
            Refresh Matrix
          </button>
        </div>
      </section>

      {/* Tactical Radar Map */}
      <section className="relative z-10 px-4">
         <div className="tactical-card rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl h-[400px] relative">
            <MapContainer center={[17.3850, 78.4867]} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
               <TileLayer
                 url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
               />
               {missions.map(m => (
                 m.needs?.latitude && (
                   <Marker key={m.id} position={[m.needs.latitude, m.needs.longitude]} icon={redMarker}>
                      <Popup>
                         <div className="p-2 space-y-2">
                            <p className="font-black text-xs uppercase italic">{m.needs.title}</p>
                             <p className="text-[10px] font-bold text-red-600 uppercase">Assigned: {m.profiles?.full_name || m.volunteers?.name || 'SIM_UNIT'}</p>
                         </div>
                      </Popup>
                   </Marker>
                 )
               ))}
            </MapContainer>
            
            {/* Map Overlay HUD */}
            <div className="absolute top-6 left-6 z-[400] flex flex-col gap-3">
               <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Tactical Radar</span>
               </div>
            </div>
         </div>
      </section>

      {/* Missions Grid */}
      <section className="relative z-10 px-4">
         <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Active Deployments // Objective Feed</h3>
            <div className="h-px flex-1 bg-border/30"></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {missions.length === 0 ? (
               <div className="col-span-full tactical-card p-24 text-center space-y-6 opacity-30 border-dashed">
                  <Shield size={60} className="mx-auto" />
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] italic">All Sectors Operational // No Active Missions</p>
               </div>
            ) : (
               missions.map(m => (
                  <div key={m.id} className="premium-glass p-8 rounded-[2.5rem] border-white/5 hover:border-red-500/40 transition-all duration-700 shadow-2xl flex flex-col gap-8 group">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                              <Shield size={14} className="text-red-600" />
                              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">MISSION_REF: {m.id.slice(0,8)}</p>
                           </div>
                           <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none group-hover:text-red-600 transition-colors">{m.needs?.title}</h4>
                        </div>
                        <div className="bg-red-600/10 border border-red-500/20 px-3 py-1 rounded-full text-[9px] font-black text-red-500 uppercase tracking-widest">
                           {m.needs?.priority || 'Priority'}
                        </div>
                     </div>

                     <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-3">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Objective Intel</p>
                        <p className="text-xs text-white/80 font-medium leading-relaxed italic line-clamp-2">"{m.needs?.description}"</p>
                     </div>

                     <div className="flex items-center gap-4 py-4 border-y border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-black italic text-xl shadow-lg">
                           {(m.profiles?.full_name || m.volunteers?.name || 'U').charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <p className="text-[10px] font-black text-white uppercase tracking-wider truncate">{m.profiles?.full_name || m.volunteers?.name || 'SIM_UNIT'}</p>
                           <div className="flex items-center gap-2 mt-1">
                              <Activity size={10} className="text-red-500" />
                              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">                               <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Active</p>
                               {(m.profiles?.phone || m.volunteers?.phone) && (
                                 <a 
                                   href={`tel:${m.profiles?.phone || m.volunteers?.phone}`}
                                   className="flex items-center gap-1.5 text-red-500 hover:text-white transition-colors"
                                 >
                                    <Phone size={10} fill="currentColor" className="opacity-40" />
                                    <p className="text-[9px] font-black tracking-widest">{m.profiles?.phone || m.volunteers?.phone}</p>
                                 </a>
                               )}
</p>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Assigned At</p>
                           <div className="flex items-center gap-2 text-white font-black text-[10px] italic">
                              <Clock size={12} className="text-red-500" />
                              {new Date(m.assigned_at).toLocaleTimeString()}
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Current Sector</p>
                           <div className="flex items-center gap-2 text-white font-black text-[10px] italic">
                              <MapPin size={12} className="text-red-600" />
                              {m.needs?.location?.split(',')[0] || 'Unknown'}
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4 pt-4 mt-auto">
                        <button 
                           onClick={() => window.open(`https://www.google.com/maps?q=${m.needs?.latitude},${m.needs?.longitude}`, '_blank')}
                           className="flex-1 bg-white/5 border border-white/10 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 italic"
                        >
                           <ExternalLink size={14} />
                           Nav
                        </button>
                        <button 
                           onClick={() => handleResolve(m)}
                           disabled={resolvingId === m.id}
                           className="flex-[2] bg-white text-black font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 italic active:scale-95"
                        >
                           {resolvingId === m.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                           Resolve Objective
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>
      </section>
    </div>
  );
}
