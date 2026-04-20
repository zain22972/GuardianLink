import { Shield, MapPin, Clock, Filter, Send, User, Zap, Activity } from 'lucide-react';
import clsx from 'clsx';

export default function Matcher() {
  const matches = [
    {
      name: 'Dr. Aris Thorne',
      specialty: 'Level 1 Trauma Specialist',
      eta: '8 mins',
      distance: '2km away',
      matchRate: '98%',
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbnG2Z2_GkmlIRp2WUbH-LP0YI9SZrPI8rGAwubyRjI6TFfKGM5KTl-Xmbt254pViaCz1UOXbPvOr9bicdiUjQguu3n16RsyNnAh1h5x0HJ5P5K80M0wQl_OA9zQfSiympl3SwqgOVDUUMrZCimm2P2rXoEeR5Vp1D_-vykTVnSuguNd5TcovGV9bsg5qzRDVXWXGtoKPtLkx5eBMYGByPr4z8ZqYG2WGuYdGj09bDCUsWNSSdnuZ8AaFDRt3jFNlXs1P7HbmU_UBG",
      status: 'Critical'
    },
    {
      name: 'Dr. Sarah Jenkins',
      specialty: 'General Surgery',
      eta: '15 mins',
      distance: '4.5km away',
      matchRate: '84%',
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCgMEZl2dcNqHI4gjBH87xebKHURSLi93YVyaQ6exB88Ya5OgNO4PbGFhcwzikN1z_BkIm7ic07DCvS3UiQ5OUjrLYxM7FUi8-qXg2b6WUj-eQ6oZ8H9wV0DMCzhkzsKBiV6KIQQ5p6apuGahrlDdzmX4YwH9EBu6ZbpQdOxI_0MjR3d2BxHeCkM2etpHxy1jgrZYtZ3nr2fnShdUvrJuCkgTLX8zaO9D15cUdzihttNiFYw1ZEkcSJkN6dgBaAJeX3-2DtlW6D-bs",
      status: 'High'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Mission <span className="text-primary">Matcher</span></h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">Resource Coordination Hub</p>
        </div>
        <button className="flex items-center gap-2 bg-card border border-border px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-all shadow-sm">
          <Filter size={16} />
          Refine Search
        </button>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Incident Context */}
        <div className="lg:col-span-4 space-y-6">
          <div className="clean-card p-6 flex flex-col gap-4">
             <div className="flex justify-between items-start">
                <div>
                   <h3 className="font-black text-xl text-foreground tracking-tight uppercase italic leading-none">Incident <span className="text-primary">402-B</span></h3>
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Active Field Operation</p>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary/20">
                   Critical
                </div>
             </div>
             
             <p className="text-foreground text-sm font-semibold leading-relaxed">Mass Casualty Event - Industrial Sector 7G</p>
             
             <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-muted-foreground">
                   <Clock size={16} className="text-primary" />
                   <div className="text-[10px] font-black uppercase tracking-widest">T+ 45mins Elapsed</div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                   <MapPin size={16} className="text-primary" />
                   <div className="text-[10px] font-black uppercase tracking-widest">Sector 7G, Industrial Park</div>
                </div>
             </div>
          </div>

          <div className="clean-card aspect-video relative overflow-hidden group">
             <img 
               alt="Incident Map" 
               className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 dark:opacity-40" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9x0FXN3KnecTDv5l3OH1PtBAu6M-Hf2Cr6oZuAGG_7aUEGvT8EGAJX6PMRcTLPVugjTquv5FgbHCuKA-0IAiCqAPUh63pgqQm6YQIfiHPqup5D6nvdS5rqnHe8EvLTPiZDw_IATWalbB48tasJddhgJRzg2E0CtVtIg_gNsbkhJMvqh6vzr4B1v-CkTkKhpyuTZoCZcg810ATLG9sCD3zcI5cuV6sUo37sVCnYNS8N8XtTe0sRHOV60vg_m-XZH2xTNkfqnc_aBBu" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent p-6 flex flex-col justify-end">
                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Assignment</p>
                <p className="text-lg font-black text-foreground italic tracking-tight uppercase">Alpha-Charlie</p>
             </div>
          </div>
        </div>

        {/* Right Column: AI Matches */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
             <Zap size={20} className="text-primary" />
             <h3 className="text-sm font-black text-foreground uppercase tracking-wider italic">AI Optimized Matches</h3>
          </div>

          <div className="space-y-4">
            {matches.map((match, idx) => (
              <div key={idx} className="clean-card p-6 flex flex-col md:flex-row items-center gap-8 group hover:border-primary/30 transition-all">
                <div className="relative">
                   <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border p-1 bg-muted shadow-sm">
                      <img src={match.image} alt={match.name} className="w-full h-full object-cover rounded-xl" />
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground border-2 border-card shadow-sm">
                      <Activity size={12} />
                   </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-1">
                   <h3 className="text-xl font-black text-foreground italic tracking-tight uppercase leading-none">{match.name}</h3>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{match.specialty}</p>
                   <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-3">
                      <div className="flex items-center gap-2 text-foreground font-bold text-[10px] uppercase tracking-tighter px-3 py-1 bg-muted rounded-full">
                         <Clock size={12} className="text-primary" />
                         ETA: {match.eta}
                      </div>
                      <div className="flex items-center gap-2 text-foreground font-bold text-[10px] uppercase tracking-tighter px-3 py-1 bg-muted rounded-full">
                         <MapPin size={12} className="text-primary" />
                         {match.distance}
                      </div>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                   <div className="text-center md:text-right">
                      <div className="text-4xl font-black text-accent tracking-tighter italic leading-none">{match.matchRate}</div>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Correlation</p>
                   </div>
                   <button className="w-full md:w-auto bg-primary text-primary-foreground font-black px-8 py-3 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 italic tracking-widest text-[11px] uppercase">
                      <Send size={16} />
                      Dispatch
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
