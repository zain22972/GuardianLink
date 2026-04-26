import { Users, AlertTriangle, CheckCircle, BarChart3, Map as MapIcon, Shield, Activity, Search, Loader2, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const SAMPLES = [
  { id: 's1', lat: 17.4483, lng: 78.3915, title: 'HITECH CITY SECTOR', type: 'unit' },
  { id: 's2', lat: 17.3616, lng: 78.4747, title: 'CHARMINAR RELAY', type: 'need' },
  { id: 's3', lat: 17.4126, lng: 78.4483, title: 'BANJARA HILLS AREA', type: 'unit' },
  { id: 's4', lat: 17.4399, lng: 78.4983, title: 'SECUNDERABAD POINT', type: 'need' },
];

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    
    (window as any).L = L;
    let heatLayer: any = null;

    import('leaflet.heat').then(() => {
      heatLayer = (L as any).heatLayer(points, {
        radius: 35,
        blur: 25,
        maxZoom: 12,
        max: 1.0,
        gradient: { 0.3: 'green', 0.5: 'yellow', 0.7: 'orange', 0.9: 'red', 1.0: 'darkred' }
      }).addTo(map);
    }).catch(err => console.error("Failed to load leaflet.heat", err));

    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points]);
  return null;
}

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: 'Field Assets', value: '0', change: 'ACTIVE', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Target Intel', value: '0', change: 'UNVERIFIED', icon: AlertTriangle, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Ops Complete', value: '0', change: 'SUCCESS', icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Comm Relay', value: 'SYNC', change: 'STABLE', icon: Activity, color: 'text-foreground', bg: 'bg-muted' },
  ]);
  const [recentNeeds, setRecentNeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapPoints, setHeatmapPoints] = useState<[number, number, number][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch available field assets (profiles + volunteers fallback)
        let { count: volCount } = await supabase.from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'volunteer')
          .eq('is_available', true);

        if (!volCount) {
          const { count: fallbackCount } = await supabase.from('volunteers')
            .select('*', { count: 'exact', head: true })
            .eq('is_available', true);
          volCount = fallbackCount;
        }

        // 2. Fetch Verified Intel (Waiting for Dispatch)
        const { count: intelCount } = await supabase.from('needs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'verified');

        // 3. Fetch Active Missions (Assigned)
        const { count: activeCount } = await supabase.from('needs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'assigned');

        // 4. Fetch Resolved Operations
        const { count: resolvedCount } = await supabase.from('needs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'resolved');

        const { data: needs } = await supabase.from('needs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        // 5. Fetch all needs for heatmap
        const { data: allNeeds } = await supabase.from('needs')
          .select('latitude, longitude, priority')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .neq('status', 'resolved');

        if (allNeeds) {
           const points: [number, number, number][] = allNeeds.map((n: any) => {
              const intensity = n.priority === 'critical' ? 1.0 : n.priority === 'high' ? 0.8 : n.priority === 'medium' ? 0.5 : 0.25;
              return [n.latitude, n.longitude, intensity];
           });
           setHeatmapPoints(points);
        }

        setStats([
          { label: 'Field Assets', value: String(volCount || 0), change: 'READY', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Target Intel', value: String(intelCount || 0), change: 'TRIAGE', icon: AlertTriangle, color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Active Ops', value: String(activeCount || 0), change: 'TRACKING', icon: Activity, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Ops Complete', value: String(resolvedCount || 0), change: 'DEBRIEF', icon: CheckCircle, color: 'text-foreground', bg: 'bg-muted' },
        ]);
        setRecentNeeds(needs || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative space-y-10 animate-in fade-in duration-1000 pb-20">
      <div className="fixed inset-0 tech-bg pointer-events-none"></div>

      {/* Header Section */}
      <section className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">Command <span className="text-primary text-glow-primary">Center</span></h2>
          <div className="flex items-center gap-2 mt-2">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">Neural Bridge // Global Relay Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
             <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
             <input 
               type="text" 
               placeholder="SEARCH SECTOR ALPHA..." 
               className="w-full premium-glass rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-2xl border-border/50"
             />
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-red-500/20 hover:bg-red-500 transition-all italic active:scale-95"
          >
             {loading ? <Loader2 size={16} className="animate-spin" /> : 'Re-Sync'}
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 z-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="tactical-card p-8 rounded-[2.5rem] group hover:border-primary/40 transition-all duration-500 shadow-2xl border-border/30">
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-xl border border-border/50`}>
                  <Icon size={28} />
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className="text-[8px] font-black px-3 py-1 rounded-full bg-muted border border-border tracking-[0.2em]">
                     {stat.change}
                   </span>
                   <div className="w-12 h-1 bg-muted rounded-full overflow-hidden mt-1">
                      <div className={`h-full ${stat.color.replace('text-', 'bg-')} w-2/3 animate-pulse`}></div>
                   </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-2 opacity-60">{stat.label}</p>
                <p className="text-4xl font-black text-foreground tracking-tighter italic leading-none">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Strategic Grid */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 z-10">
        {/* Tactical Map */}
        <div className="lg:col-span-8 tactical-card rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border-border/40 group">
          <div className="p-8 border-b border-border/50 flex items-center justify-between premium-glass">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <MapIcon size={22} />
               </div>
               <div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] italic">Tactical Overlay // Alpha</h3>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Satellite Relay Active</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button 
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${showHeatmap ? 'bg-primary text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-muted text-muted-foreground hover:text-foreground border border-border/50'}`}
               >
                  <Layers size={14} />
                  {showHeatmap ? 'Heatmap: ON' : 'Heatmap: OFF'}
               </button>
               <div className="flex gap-2 ml-2">
                  {[1,2,3].map(i => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i===1?'bg-primary shadow-[0_0_10px_var(--primary)]':i===2?'bg-secondary':'bg-accent'} animate-pulse`} style={{animationDelay: `${i*0.2}s`}}></div>
                  ))}
               </div>
            </div>
          </div>
          <div className="relative flex-1 min-h-[500px] overflow-hidden">
             <MapContainer center={[17.3850, 78.4867]} zoom={12} style={{ height: '100%', width: '100%' }} className="z-0">
               <TileLayer
                 url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
               />
               {showHeatmap ? (
                 <HeatmapLayer points={heatmapPoints.length > 0 ? heatmapPoints : SAMPLES.map(s => [s.lat, s.lng, s.type === 'need' ? 1.0 : 0.5])} />
               ) : (
                 SAMPLES.map(sample => (
                   <Marker 
                      key={sample.id} 
                      position={[sample.lat, sample.lng]} 
                      icon={sample.type === 'unit' ? blueIcon : redIcon}
                   >
                      <Popup className="premium-popup">
                         <div className="p-2 space-y-1 text-black font-bold">
                            <p className="font-black text-[10px] uppercase italic tracking-wider">{sample.title}</p>
                            <p className={`text-[8px] font-bold uppercase ${sample.type === 'unit' ? 'text-blue-600' : 'text-red-600'}`}>
                              {sample.type === 'unit' ? 'Asset: Operational' : 'Objective: Verified'}
                            </p>
                         </div>
                      </Popup>
                   </Marker>
                 ))
               )}
             </MapContainer>
             
             {/* Map Data Overlay */}
             <div className="absolute top-8 right-8 p-4 premium-glass rounded-2xl border border-white/10 text-[9px] font-black text-white uppercase tracking-widest space-y-2 z-[400]">
                <div className="flex justify-between gap-8"><span>LAT:</span> <span className="text-primary">17.3850° N</span></div>
                <div className="flex justify-between gap-8"><span>LNG:</span> <span className="text-primary">78.4867° E</span></div>
                <div className="flex justify-between gap-8"><span>ALT:</span> <span className="text-primary">542M</span></div>
             </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="tactical-card p-8 rounded-[2.5rem] shadow-2xl border-border/30 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] italic">Live Intel</h3>
                    <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black border border-primary/20 animate-pulse">LIVE</div>
                 </div>
                 <BarChart3 size={18} className="text-muted-foreground opacity-40" />
              </div>
              <div className="space-y-4 flex-1">
                 {recentNeeds.map((need, idx) => (
                    <div key={need.id} className="p-5 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer group animate-in slide-in-from-right duration-500" style={{animationDelay: `${idx*0.1}s`}}>
                       <div className="flex gap-5 items-start">
                          <div className={`p-2.5 rounded-xl ${need.priority === 'critical' ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'} border border-current/20`}>
                             <AlertTriangle size={18} />
                          </div>
                          <div className="flex-1">
                             <p className="text-xs font-black text-foreground uppercase italic mb-1 tracking-tight group-hover:text-primary transition-colors">{need.title}</p>
                             <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60 truncate max-w-[180px]">{need.location || 'SECTOR UNKNOWN'}</p>
                             <div className="mt-3 flex gap-3">
                                <span className="text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-foreground text-background">{need.category || 'GENERAL'}</span>
                                <span className="text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{new Date(need.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
                 {recentNeeds.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20 italic">
                       <Activity size={48} className="mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Scanning Frequencies...</p>
                    </div>
                 )}
              </div>
              <button className="w-full mt-6 py-3 border border-border rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:bg-muted transition-all">
                 View All Assets
              </button>
           </div>

           <div className="tactical-card p-10 rounded-[3rem] shadow-2xl border-border/40 premium-glass group hover:border-primary/50 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 translate-x-10 -translate-y-10 scale-150">
                 <Shield size={200} className="text-primary" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] border border-white/20 animate-pulse">
                       <Shield size={22} />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">System Integrity</h3>
                       <p className="text-[8px] text-primary font-black uppercase tracking-widest mt-1">CORE: ACTIVE</p>
                    </div>
                 </div>
                 <p className="text-[11px] text-white/70 font-medium leading-relaxed mb-8 uppercase tracking-wider italic">
                    Neural relay synchronization is at optimal levels. Satellite link stability is currently peaking across all sectors.
                 </p>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Link Stability</span>
                       <span className="text-[11px] font-black text-primary italic">94%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                       <div className="h-full bg-gradient-to-r from-red-600 to-red-400 w-[94%] shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
