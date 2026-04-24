import { CheckCircle, Edit, Shield, Zap, Loader2, MapPin, Clock, Activity, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Requests() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', location: '', description: '' });

  useEffect(() => {
    fetchNeeds();
  }, []);

  async function fetchNeeds() {
    setLoading(true);
    const { data, error } = await supabase
      .from('needs')
      .select('*')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });
    
    if (!error) setNeeds(data || []);
    setLoading(false);
  }

  async function handleVerify(id: string) {
    const { error } = await supabase
      .from('needs')
      .update({ status: 'verified' })
      .eq('id', id);
    
    if (!error) fetchNeeds();
  }

  async function handleCancel(id: string) {
    const { error } = await supabase
      .from('needs')
      .update({ status: 'cancelled' })
      .eq('id', id);
    
    if (!error) {
      setConfirmingDeleteId(null);
      fetchNeeds();
    }
  }

  async function handleSaveEdit(id: string) {
    const { error } = await supabase
      .from('needs')
      .update(editForm)
      .eq('id', id);
    
    if (!error) {
      setEditingId(null);
      fetchNeeds();
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-xs">Accessing Neural Database...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-10 animate-in fade-in duration-1000">
      <div className="fixed inset-0 tech-bg pointer-events-none"></div>

      {/* Header Section */}
      <section className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">Intelligence <span className="text-primary text-glow-primary">Triage</span></h2>
          <div className="flex items-center gap-2 mt-2">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">Processing Field Reports // Queue Active</p>
          </div>
        </div>
        <button onClick={fetchNeeds} className="flex items-center gap-3 bg-foreground text-background px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-primary hover:text-white transition-all italic active:scale-95">
          <Zap size={16} />
          Refresh Intake
        </button>
      </section>

      <section className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {needs.map((need, idx) => (
            <div key={need.id} className="tactical-card rounded-[2.5rem] flex flex-col group hover:border-primary/40 transition-all duration-500 shadow-2xl animate-in slide-in-from-bottom-10" style={{animationDelay: `${idx*0.1}s`}}>
              {/* Image Header */}
              <div className="relative aspect-video overflow-hidden border-b border-border/50">
                {need.image_url ? (
                  <img src={need.image_url} className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-110 transition-transform duration-1000" alt="Field Report" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground opacity-20">
                    <Activity size={48} />
                  </div>
                )}
                <div className="absolute top-6 left-6 flex gap-2">
                   <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                      ID: {need.id.slice(0, 5)}
                   </div>
                   <button 
                     onClick={() => setConfirmingDeleteId(need.id)}
                     className="px-3 py-1 bg-red-600/80 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-red-500/30 hover:bg-red-500 transition-colors flex items-center gap-1 ml-auto"
                   >
                      <Trash2 size={10} /> CANCEL
                   </button>
                   {need.status === 'verified' && (
                     <div className="px-3 py-1 bg-accent/80 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-1">
                        <CheckCircle size={10} /> VERIFIED
                     </div>
                   )}
                </div>
                
                {/* Decommission Confirmation Overlay */}
                {confirmingDeleteId === need.id && (
                  <div className="absolute inset-0 z-50 bg-red-600/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                     <AlertTriangle size={48} className="text-white mb-4 animate-bounce" />
                     <h4 className="text-white font-black uppercase tracking-[0.2em] mb-2">Confirm Decommission</h4>
                     <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-8">This action will permanently remove this intel from the tactical grid.</p>
                     <div className="flex flex-col w-full gap-3">
                        <button 
                          onClick={() => handleCancel(need.id)}
                          className="w-full bg-white text-red-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
                        >
                           Decommission Intel
                        </button>
                        <button 
                          onClick={() => setConfirmingDeleteId(null)}
                          className="w-full bg-transparent border border-white/30 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                        >
                           Abort Cancellation
                        </button>
                     </div>
                  </div>
                )}

                {/* AI Label Overlay */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-lg">
                   <Zap size={10} className="text-primary" />
                   <span className="text-[8px] font-black text-white uppercase tracking-widest">AI Analyzed</span>
                </div>
              </div>

              <div className="p-8 space-y-6 flex-1 flex flex-col">
                {editingId === need.id ? (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Title Override</label>
                       <input 
                         className="w-full premium-glass rounded-xl px-4 py-3 text-[11px] font-black uppercase text-foreground outline-none border border-primary/30"
                         value={editForm.title}
                         onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Location Context</label>
                       <input 
                         className="w-full premium-glass rounded-xl px-4 py-3 text-[11px] font-black uppercase text-foreground outline-none border border-primary/30"
                         value={editForm.location}
                         onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Intelligence Notes</label>
                       <textarea 
                         className="w-full premium-glass rounded-xl px-4 py-3 text-[11px] font-medium text-foreground outline-none border border-primary/30 min-h-[100px]"
                         value={editForm.description}
                         onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                       />
                    </div>
                    <div className="flex gap-2 pt-2">
                       <button 
                         onClick={() => handleSaveEdit(need.id)}
                         className="flex-1 bg-primary text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                       >
                         Apply Override
                       </button>
                       <button 
                         onClick={() => setEditingId(null)}
                         className="px-6 py-3 border border-border rounded-xl text-[10px] font-black uppercase text-muted-foreground"
                       >
                         Abort
                       </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`w-2 h-2 rounded-full ${need.priority === 'critical' ? 'bg-destructive animate-pulse' : 'bg-secondary'}`}></span>
                           <h3 className="text-xl font-black text-foreground italic tracking-tighter uppercase leading-none">{need.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-xs font-medium leading-relaxed opacity-70 line-clamp-3">{need.description}</p>
                      </div>

                      <div className="space-y-2.5 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground">
                           <MapPin size={14} className="text-primary" />
                           {need.location || 'SECTOR UNKNOWN'}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                           <Clock size={14} className="text-primary" />
                           {new Date(need.created_at).toLocaleTimeString()} // {new Date(need.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 mt-auto">
                      <button 
                        onClick={() => {
                          setEditingId(need.id);
                          setEditForm({ title: need.title, location: need.location, description: need.description });
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-muted border border-border text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                      >
                        <Edit size={14} /> Edit Intel
                      </button>
                      <button 
                        onClick={() => handleVerify(need.id)}
                        disabled={need.status === 'verified'}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                          need.status === 'verified' 
                          ? 'bg-accent/10 text-accent border border-accent/20' 
                          : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95'
                        }`}
                      >
                        {need.status === 'verified' ? <><CheckCircle size={14} /> Verified</> : <><Shield size={14} /> Verify Intel</>}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {needs.length === 0 && (
            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6 opacity-20">
               <Activity size={80} className="text-primary animate-pulse" />
               <div>
                  <p className="text-xl font-black uppercase tracking-[0.4em]">Intelligence Queue Empty</p>
                  <p className="text-xs font-bold uppercase tracking-widest mt-2">Awaiting Field Responder Transmission...</p>
               </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
