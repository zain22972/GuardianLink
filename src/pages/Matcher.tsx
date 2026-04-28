import { useState, useEffect } from 'react';
import { Shield, MapPin, Clock, Filter, Send, User, Zap, Activity, Loader2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { supabase } from '../lib/supabase';

export default function Matcher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [needsQueue, setNeedsQueue] = useState<any[]>([]);
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Fetch all verified needs for the queue
      const { data: queueData } = await supabase
        .from('needs')
        .select('*')
        .eq('status', 'verified')
        .order('created_at', { ascending: false });

      setNeedsQueue(queueData || []);
      if (queueData && queueData.length > 0 && !selectedNeedId) {
        setSelectedNeedId(queueData[0].id);
      }

      // 2. Fetch available volunteers (Check profiles first, then volunteers table as fallback)
      let { data: volunteerData } = await supabase
        .from('profiles')
        .select('*, phone')
        .eq('role', 'volunteer')
        .eq('is_available', true);

      if (!volunteerData || volunteerData.length === 0) {
        // Fallback to legacy volunteers table for dummy assets
        const { data: legacyData } = await supabase
          .from('volunteers')
          .select('*')
          .eq('is_available', true);
        
        volunteerData = legacyData?.map(v => ({
          id: v.id,
          full_name: v.name,
          skills: v.skills,
          location: 'Remote Deploy',
          is_available: v.is_available,
          phone: v.phone
        })) || [];
      }

      setVolunteers(volunteerData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const selectedNeed = needsQueue.find(n => n.id === selectedNeedId);

  const handleDispatch = async (volunteerId: string) => {
    if (!selectedNeed) return;
    const dispatchedNeedId = selectedNeed.id;
    setDispatchingId(volunteerId);
    
    try {
      // 1. Update Request Status (Critical Path)
      const { error: needErr } = await supabase.from('needs')
        .update({ status: 'assigned', assigned_to: volunteerId })
        .eq('id', dispatchedNeedId);

      if (needErr) throw needErr;

      // 2. Attempt to create Mission record (Non-blocking)
      await supabase.from('missions').insert({
        need_id: dispatchedNeedId,
        volunteer_id: volunteerId,
        status: 'pending'
      });

      // 3. Update Asset Availability in both potential tables
      await supabase.from('profiles').update({ is_available: false }).eq('id', volunteerId);
      await supabase.from('volunteers').update({ is_available: false }).eq('id', volunteerId);

      // 4. INSTANT OPTIMISTIC UPDATE
      setDispatchingId(volunteerId + '_success');
      
      // Calculate next selection before filtering
      const remainingNeeds = needsQueue.filter(n => n.id !== dispatchedNeedId);
      const nextNeed = remainingNeeds[0] || null;

      // Update state immediately
      setVolunteers(prev => prev.filter(v => v.id !== volunteerId));
      setNeedsQueue(remainingNeeds);
      setSelectedNeedId(nextNeed?.id || null);

      // Reset success state and REDIRECT to Missions
      setTimeout(() => {
        setDispatchingId(null);
        navigate('/admin/missions');
      }, 1200);

    } catch (error) {
      console.error('Dispatch error:', error);
      setDispatchingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Synchronizing Tactical Grid...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-10 animate-in fade-in duration-1000 pb-20">
      <div className="fixed inset-0 tech-bg pointer-events-none"></div>

      {/* Header Section */}
      <section className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 px-4">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">Strategic <span className="text-red-600 text-glow-red">Deployment</span></h2>
          <div className="flex items-center gap-2 mt-2">
             <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
             <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em]">Neural Matcher v4.2 // Active</p>
          </div>
        </div>
        <button onClick={fetchData} className="flex items-center gap-3 bg-red-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-500 transition-all italic active:scale-95">
          <Zap size={16} />
          Sync Tactical Grid
        </button>
      </section>

      {/* Intel Queue (Horizontal Scroll) */}
      <section className="relative z-10 px-4">
         <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Intel Queue // Verified Requests</h3>
            <div className="h-px flex-1 bg-border/30"></div>
         </div>
         <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {needsQueue.map((n) => (
               <button 
                 key={n.id}
                 onClick={() => setSelectedNeedId(n.id)}
                 className={clsx(
                   "flex-shrink-0 w-72 p-6 rounded-[2rem] border transition-all text-left group",
                   selectedNeedId === n.id 
                    ? "bg-red-600/10 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.15)]" 
                    : "bg-card/40 border-border/50 hover:bg-card/60 backdrop-blur-md"
                 )}
               >
                  <p className={clsx("text-[9px] font-black uppercase tracking-widest mb-2", selectedNeedId === n.id ? "text-red-500" : "text-muted-foreground")}>
                    {n.category || 'General'} Intel
                  </p>
                  <p className="text-[13px] font-black text-foreground uppercase italic tracking-tight leading-tight line-clamp-1">{n.title}</p>
                  <div className="flex items-center gap-2 mt-4 opacity-70">
                     <MapPin size={12} className={selectedNeedId === n.id ? "text-red-500" : "text-primary"} />
                     <span className="text-[9px] font-bold uppercase tracking-widest">{n.location || 'Unknown Sector'}</span>
                  </div>
               </button>
            ))}
            {needsQueue.length === 0 && (
               <div className="p-10 w-full text-center border-2 border-dashed border-border/30 rounded-[2rem] opacity-30">
                  <Activity size={32} className="mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic">Scanning frequencies for verified intel...</p>
               </div>
            )}
         </div>
      </section>

      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 z-10 px-4">
        {/* Left Column: Targeted Intel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="tactical-card p-10 rounded-[2.5rem] shadow-2xl border-red-500/10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Shield size={120} />
             </div>
             <div className="flex justify-between items-start mb-10">
                <div>
                   <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1">Target Intel</p>
                   <h3 className="font-black text-3xl text-white tracking-tighter uppercase italic leading-none">Sector <span className="text-red-600">{selectedNeed?.location?.split(',')[0] || 'Alpha'}</span></h3>
                </div>
                {selectedNeed && (
                  <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                    {selectedNeed.priority || 'Critical'}
                  </div>
                )}
             </div>
             
             {selectedNeed ? (
               <div className="space-y-8">
                 <div>
                    <p className="text-white text-xl font-black uppercase italic tracking-tight leading-tight">{selectedNeed.title}</p>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed mt-4 opacity-90">{selectedNeed.description}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div className="space-y-1.5">
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Capture Time</p>
                       <div className="flex items-center gap-2 text-white font-black text-[11px] italic">
                          <Clock size={14} className="text-red-500" />
                          {Math.floor((Date.now() - new Date(selectedNeed.created_at).getTime()) / 60000)}M AGO
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Tactical Class</p>
                       <div className="flex items-center gap-2 text-white font-black text-[11px] italic">
                          <Shield size={14} className="text-red-500" />
                          {selectedNeed.category?.toUpperCase() || 'GENERAL'}
                       </div>
                    </div>
                 </div>
               </div>
             ) : (
               <div className="py-20 text-center space-y-6">
                  <div className="relative inline-block">
                    <Activity size={50} className="text-muted-foreground opacity-20" />
                    <div className="absolute inset-0 bg-red-600/5 blur-2xl rounded-full"></div>
                  </div>
                  <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.4em] italic">Awaiting Active Selection...</p>
               </div>
             )}
          </div>

          {selectedNeed?.image_url && (
            <div className="tactical-card rounded-[3rem] aspect-square relative overflow-hidden group shadow-2xl border-white/5">
               <img 
                 alt="Field Intelligence" 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[30s] ease-linear grayscale-[0.2] contrast-125" 
                 src={selectedNeed.image_url} 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                     <p className="text-[10px] text-white font-black uppercase tracking-[0.4em]">Live Feed // Neural Vision Active</p>
                  </div>
                  <p className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Field Evidence</p>
               </div>
               {/* Scanline Effect Overlay */}
               <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
            </div>
          )}
        </div>

        {/* Right Column: Strategic Resources */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600 border border-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                   <Zap size={24} />
                </div>
                <div>
                   <h3 className="text-base font-black text-white uppercase tracking-[0.3em] italic">Available Field Assets</h3>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Personnel Cluster Matrix v2.0</p>
                </div>
             </div>
             <div className="flex items-center gap-3 px-6 py-3 bg-card/60 backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{volunteers.length} Active Assets</span>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {volunteers.length === 0 ? (
              <div className="tactical-card p-24 flex flex-col items-center justify-center text-center gap-8 rounded-[3rem] border-dashed border-white/5">
                <div className="relative">
                   <Activity size={80} className="text-red-500/10 animate-pulse" />
                   <div className="absolute inset-0 bg-red-500/5 blur-[50px] rounded-full"></div>
                </div>
                <div>
                   <p className="text-white text-base font-black uppercase tracking-[0.4em] italic mb-3">No Field Assets Detected</p>
                   <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest max-w-sm mx-auto opacity-70 leading-loose">Verify personnel availability status or expand deployment search radius across active sectors.</p>
                </div>
              </div>
            ) : (
              volunteers.map((vol, idx) => {
                const isSuccess = dispatchingId === vol.id + '_success';
                const isDispatching = dispatchingId === vol.id;
                
                return (
                  <div key={vol.id} className={clsx(
                    "premium-glass p-6 rounded-[2.5rem] flex flex-col lg:flex-row items-center gap-8 group transition-all duration-700 border-white/5 relative overflow-hidden",
                    isSuccess ? "border-green-500/50 bg-green-500/5" : "hover:border-red-500/40 shadow-2xl"
                  )}>
                    <div className="relative">
                       <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-white/10 p-1.5 bg-card/80 shadow-xl group-hover:border-red-500/50 transition-all duration-700">
                          <div className={clsx(
                            "w-full h-full flex items-center justify-center text-white font-black text-3xl uppercase italic shadow-inner transition-colors",
                            isSuccess ? "bg-green-600" : "bg-gradient-to-br from-red-600 to-red-900"
                          )}>
                            {vol.full_name?.charAt(0) || 'V'}
                          </div>
                       </div>
                       <div className={clsx(
                         "absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-white border-4 border-[#0a0a0a] shadow-lg transition-colors",
                         isSuccess ? "bg-green-600" : "bg-red-600"
                       )}>
                          <Activity size={12} />
                       </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left space-y-3">
                       <div>
                          <div className="flex items-center justify-center lg:justify-start gap-3">
                             <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none group-hover:text-red-500 transition-colors">{vol.full_name}</h3>
                             <div className={clsx(
                               "px-2 py-0.5 rounded-md border text-[7px] font-black uppercase tracking-widest transition-colors",
                               isSuccess ? "bg-green-500/20 border-green-500 text-green-500" : "bg-white/5 border-white/10 text-muted-foreground"
                             )}>
                                {isSuccess ? 'Deployed' : 'Ready'}
                             </div>
                          </div>
                          <p className="text-[10px] text-red-500/70 font-black uppercase tracking-[0.2em] mt-2 italic">{vol.skills?.slice(0, 3).join(' // ') || 'STRATEGIC OPERATIONS'}</p>
                       </div>
                       <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-1">
                          {vol.phone && (
                            <a 
                              href={`tel:${vol.phone}`}
                              className="flex items-center gap-2 text-white font-black text-[9px] uppercase tracking-tighter px-4 py-1.5 bg-red-600/20 rounded-xl border border-red-500/30 shadow-lg hover:bg-red-600 transition-all group/phone"
                            >
                               <Phone size={12} className="text-white opacity-60 group-hover/phone:opacity-100 transition-opacity" />
                               {vol.phone}
                            </a>
                          )}
                          <div className="flex items-center gap-2 text-white font-black text-[9px] uppercase tracking-tighter px-4 py-1.5 bg-white/5 rounded-xl border border-white/10 shadow-lg">
                             <Clock size={12} className="text-red-500" />
                             ETA: {idx * 3 + 6} MINS
                          </div>
                          <div className="flex items-center gap-2 text-white font-black text-[9px] uppercase tracking-tighter px-4 py-1.5 bg-white/5 rounded-xl border border-white/10 shadow-lg">
                             <MapPin size={12} className="text-red-500" />
                             {(idx * 0.8 + 0.4).toFixed(1)} KM
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-8 w-full lg:w-auto">
                       <div className="text-center lg:text-right min-w-[80px]">
                          <div className={clsx(
                            "text-5xl font-black tracking-tighter italic leading-none transition-all duration-700",
                            isSuccess ? "text-green-500 scale-110" : "text-red-600 group-hover:scale-110"
                          )}>
                            {99 - idx * 2}%
                          </div>
                          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-2">Match</p>
                       </div>
                       <button 
                         onClick={() => handleDispatch(vol.id)}
                         disabled={!selectedNeed || isDispatching || isSuccess}
                         className={clsx(
                           "w-full lg:w-auto font-black px-10 py-4 rounded-[1.5rem] shadow-2xl transition-all duration-700 flex items-center justify-center gap-3 italic tracking-[0.2em] text-[11px] uppercase active:scale-95",
                           isSuccess 
                            ? "bg-green-600 text-white shadow-green-500/20" 
                            : "bg-white text-black hover:bg-red-600 hover:text-white disabled:opacity-20"
                         )}
                       >
                          {isDispatching ? <Loader2 size={16} className="animate-spin" /> : (isSuccess ? <Shield size={16} /> : <Send size={16} />)}
                          {isSuccess ? 'Assigned' : 'Dispatch'}
                       </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
