import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Box, LogOut, Zap, Brain, Settings, Shield, Activity, Navigation2 } from 'lucide-react';
import clsx from 'clsx';

export default function AdminLayout({ children, setRole, isDark, toggleTheme }: any) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Brain, label: 'Requests', path: '/admin/requests' },
    { icon: Zap, label: 'Matcher', path: '/admin/matcher' },
    { icon: Navigation2, label: 'Missions', path: '/admin/missions' },
    { icon: Users, label: 'Directory', path: '/admin/directory' },
    { icon: Box, label: 'Inventory', path: '/admin/inventory' },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans selection:bg-primary/30">
      {/* Dynamic Background Overlay */}
      <div className="fixed inset-0 tech-bg pointer-events-none opacity-50"></div>

      {/* Sidebar */}
      <aside className="w-80 bg-card/40 backdrop-blur-3xl border-r border-border/50 flex flex-col relative z-50">
        <div className="p-10">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_var(--primary)] group-hover:scale-110 transition-transform duration-500">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-foreground leading-none italic uppercase">Guardian<span className="text-primary text-glow-primary">Link</span></h1>
              <p className="text-[8px] font-black tracking-[0.4em] text-muted-foreground uppercase mt-1 opacity-60">Strategic Command</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={clsx(
                  'w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all duration-300 group relative overflow-hidden',
                  isActive 
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-[1.02]' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-8 bg-white rounded-full -translate-x-1"></div>
                )}
                <Icon size={20} className={clsx('transition-transform duration-500 group-hover:scale-110', isActive ? 'text-white' : (item.label === 'Dashboard' ? 'text-red-500' : 'opacity-60'))} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-8 space-y-4">
           {/* Logout Section */}
          <div className="premium-glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group cursor-pointer" onClick={() => setRole(null)}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center font-black italic text-primary">AD</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-black text-foreground uppercase tracking-wider truncate leading-none">Admin Prime</p>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1.5 opacity-50">Master Terminal</p>
              </div>
              <LogOut size={16} className="text-muted-foreground group-hover:text-destructive transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-24 px-10 flex items-center justify-between relative z-40 bg-background/20 backdrop-blur-md border-b border-border/30">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">Grid Status: Operational</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-8 w-px bg-border/50 mx-2"></div>
            <button 
               onClick={toggleTheme}
               className="relative w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center group hover:bg-foreground hover:text-background transition-all"
            >
              <Activity size={18} className="opacity-60 group-hover:opacity-100" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative z-30">
          <div className="p-12 max-w-[1600px] mx-auto pb-24">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
