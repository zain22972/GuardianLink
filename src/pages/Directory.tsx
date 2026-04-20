import { Search, Filter, Users, CheckCircle, MapPin, Map as MapIcon, Activity } from 'lucide-react';
import clsx from 'clsx';

export default function Directory() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">HQ <span className="text-primary">Directory</span></h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">Volunteer Personnel Matrix</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-64 relative">
             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Search skills..." 
               className="w-full bg-card border border-border rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
             />
          </div>
          <button className="bg-card p-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map Cluster Feed */}
        <div className="lg:col-span-8 clean-card overflow-hidden flex flex-col relative min-h-[450px]">
          <div className="p-6 pb-4 flex justify-between items-center absolute top-0 w-full z-10">
            <h3 className="text-sm font-black text-foreground italic uppercase tracking-wider">Live Cluster Feed</h3>
            <div className="bg-card/80 backdrop-blur-md px-3 py-1 rounded-lg border border-border flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Active</span>
            </div>
          </div>
          
          <div className="flex-grow relative bg-muted/20">
            <img 
              alt="Map" 
              className="w-full h-full object-cover opacity-60 contrast-125 dark:opacity-30" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF__DHyBwP3cbsmU3IXZTagHyf2Jq5D8v1ssdsed0J2FIc9HgGMJDOpT4fXmUviZFni-mB2baiERwnspy0XPkuoCGYo7KJoUY-x7iBoAPmUoIxnEqop_TgJnJ-eY4mECRSwWeaFGJIrsLy0Jp4XlKMKmAiFPGpAI4YSa2L2-q3ljbEywNkgwmxS1gTvuFNPLY2Tr-8FmIzzQar9S0IBp4qT_Md0Etn5pn5IgXY_xXAy1dfGE0v7quYHaMg5Jqgz7d52zA_tZyDP2tY" 
            />
            <MapCluster top="30%" left="40%" number="12" label="Sector Alpha" type="busy" />
            <MapCluster top="60%" left="20%" number="5" label="Sector Beta" type="available" />
            <MapCluster top="45%" left="75%" number="28" label="Sector Gamma" type="available" isPulse={true} />
          </div>
        </div>

        {/* Responder List */}
        <div className="lg:col-span-4 clean-card p-6 flex flex-col h-[450px] lg:h-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-foreground italic uppercase tracking-wider">Available</h3>
            <span className="bg-muted text-muted-foreground text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">42 Online</span>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-1 space-y-4 no-scrollbar">
            <VolunteerCard 
              name="Sarah Jenkins"
              status="Available"
              location="Sector Gamma"
              roles={['Medic', 'Driver']}
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuDinuOnrPtlpBMJl8U9ziwCJsfkLFEuWT50JFCGjhZyU4Bdb_DVodKZ2_KT0StDDiE7bs3Up7Fi04kjtof2SpNDQsJWi4H_Cy566c1Lpw8l0rqoOc5zazxA1XWuBS2wvJUieAlUnPZt9ZNQYs71ngPzbefN9ey3GrP1RU1H0MQFQG5_-co4lJhgq6th8f0g0IEXY8IDqKGV_AIQaP0IseoYjx3t-ysgJX5XjYIvpLoa_hewVxSerzUpa8BzHwlUCk9HE6RZxLMojhTj"
            />
            <VolunteerCard 
              name="Sarah Chen"
              status="On Call"
              location="Medical Hub 4"
              roles={['Triage', 'ICU']}
              img="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070"
              initials="SC"
            />
            <VolunteerCard 
              name="James Wilson"
              status="Active"
              location="Zone B-12"
              roles={['Logistics', 'Heavy Lift']}
              img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070"
              initials="JW"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Active" value="142" icon={Users} color="text-primary" bg="bg-primary/10" />
        <StatCard title="Available" value="87" icon={CheckCircle} color="text-accent" bg="bg-accent/10" />
        <StatCard title="Sectors" value="4" icon={MapIcon} color="text-secondary" bg="bg-secondary/10" />
      </div>

    </div>
  );
}

function MapCluster({ top, left, number, label, type, isPulse = false }) {
  const isBusy = type === 'busy';
  const colorClass = isBusy ? 'bg-secondary text-secondary-foreground' : 'bg-accent text-accent-foreground';
  
  return (
    <div className={`absolute flex flex-col items-center group cursor-pointer`} style={{ top, left }}>
      <div className={clsx(
        colorClass,
        "w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 border-card font-black transition-transform group-hover:scale-110 relative",
        isPulse && "ring-4 ring-accent/20"
      )}>
        {number}
        {isPulse && <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-25"></div>}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-all bg-card px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest shadow-md mt-2 border border-border whitespace-nowrap z-20">
        {label}
      </div>
    </div>
  );
}

function VolunteerCard({ name, status, location, roles, img, initials }) {
  const isAvailable = status === 'Available';

  return (
    <div className={clsx(
      "p-4 rounded-2xl border border-border transition-all group hover:border-primary/20",
      !isAvailable && 'opacity-60'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {img ? (
              <img alt={name} src={img} className="w-10 h-10 rounded-xl object-cover border border-border p-0.5" />
            ) : (
               <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground font-black border border-border">{initials}</div>
            )}
            <span className={clsx(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-card rounded-full",
              isAvailable ? 'bg-accent' : 'bg-secondary'
            )}></span>
          </div>
          <div>
            <h4 className="font-bold text-foreground uppercase tracking-tight text-xs leading-none">{name}</h4>
            <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1 mt-1">
              <MapPin size={8} className="text-primary" /> {location}
            </p>
          </div>
        </div>
        <span className={clsx(
          "font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted border border-border",
          isAvailable ? 'text-accent' : 'text-secondary'
        )}>
          {status}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1.5 ">
        {roles.map(r => (
          <span key={r} className="bg-muted text-muted-foreground text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-border">
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="clean-card p-6 flex items-center gap-5 group hover:border-primary/20 transition-colors">
      <div className={clsx(
        "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
        bg, color
      )}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest mb-0.5">{title}</p>
        <h4 className="text-2xl font-black text-foreground italic tracking-tighter">{value}</h4>
      </div>
    </div>
  );
}
