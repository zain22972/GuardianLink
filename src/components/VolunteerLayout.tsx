import { Link, useLocation } from 'react-router-dom';
import { Scan, MessageSquare, MapPin, LayoutDashboard, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

export default function VolunteerLayout({ children, setRole, isDark, toggleTheme }) {
  const location = useLocation();

  const navItems = [
    { name: 'Missions', path: '/volunteer/missions', icon: MapPin },
    { name: 'Scanner', path: '/volunteer/ocr', icon: Scan },
    { name: 'Chat', path: '/volunteer/chat', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-screen bg-background font-sans transition-colors duration-300">
      {/* Header */}
      <header className="h-16 px-6 bg-card border-b border-border flex items-center justify-between shadow-sm z-10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
             <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-sm font-black uppercase tracking-wider text-foreground italic">Guardian<span className="text-primary">Link</span></h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-muted border border-border text-foreground hover:bg-border transition-all"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <button 
             onClick={() => setRole(null)}
             className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest border border-destructive/20 hover:bg-destructive hover:text-white transition-all"
          >
             Exit
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 bg-card border border-border rounded-full flex items-center justify-around px-2 shadow-google transition-all">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                isActive ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span className="absolute -bottom-1 text-[8px] font-black tracking-tighter opacity-0">.</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
