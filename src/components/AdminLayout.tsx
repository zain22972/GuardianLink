import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Handshake, Users, Box, LogOut, Sun, Moon } from 'lucide-react';
import logo from '../assets/logo.png';
import clsx from 'clsx';

export default function AdminLayout({ children, setRole, isDark, toggleTheme }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Matcher', path: '/admin/matcher', icon: Handshake },
    { name: 'Directory', path: '/admin/directory', icon: Users },
    { name: 'Inventory', path: '/admin/inventory', icon: Box },
  ];

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-border flex flex-col h-full z-20 relative shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
             <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-lg font-black text-foreground tracking-tight uppercase">Guardian<span className="text-primary">Link</span></h1>
            <p className="text-[9px] font-bold text-muted-foreground tracking-[0.2em] uppercase leading-none mt-0.5">Admin Sector</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border">
          <button 
            onClick={() => setRole(null)}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        <header className="sticky top-0 w-full h-16 bg-card border-b border-border px-8 flex items-center justify-between z-10 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full border border-border">
                 <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">System: <span className="text-foreground">Optimal</span></span>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-muted border border-border text-foreground hover:bg-border transition-all shadow-sm"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="h-8 w-px bg-border"></div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                   <p className="text-xs font-bold text-foreground">Dispatcher HQ</p>
                   <p className="text-[10px] font-medium text-muted-foreground">ID: GL-992-TX</p>
                </div>
                <div className="w-9 h-9 rounded-full overflow-hidden border border-border shadow-sm">
                   <img 
                     className="w-full h-full object-cover" 
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUi7whUWZTE2m-6VoDp1R9BaSuZM600eumk8GoSAetI_WF8BLmQwThYxDPjIp5oj-aC4e01SHVQfU14hBpc1rSrVfbaIe_jOTr5ob1DL9TPDTDEq4_mA3UwmglpRZHUrVliCxksX_pNO3-xHIbLckE84LH5DGuxHE_i8TU3dZgxSR92eODp0s4W_RQ03hDspV1EJ8I_f2xoHsuPLwHkui9g4EpYLrKF09FqmoNATPsqSNdzX_dV4mGWagyVKJo9_tQTUOEsdAXRnum" 
                     alt="User" 
                   />
                </div>
              </div>
           </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}
