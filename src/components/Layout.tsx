import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import logo from '../assets/logo.png';

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard', fillIcon: true },
    { name: 'Requests', path: '/requests', icon: 'fact_check', fillIcon: true },
    { name: 'Matcher', path: '/matcher', icon: 'handshake', fillIcon: false },
    { name: 'Directory', path: '/directory', icon: 'contact_phone', fillIcon: true },
    { name: 'Inventory', path: '/inventory', icon: 'inventory_2', fillIcon: true },
    { name: 'Missions', path: '/missions', icon: 'explore', fillIcon: true },
    { name: 'Broadcast', path: '/broadcast', icon: 'campaign', fillIcon: true },
  ];

  return (
    <div className="font-body min-h-screen bg-surface pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 glass-header">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-3">
              <img src={logo} alt="GuardianLink Logo" className="w-12 h-12 object-contain" />
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-['Inter']">
                GuardianLink
              </h1>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden xl:flex gap-4 items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={clsx(
                    "transition-colors active:scale-95 duration-200 px-3 py-2 rounded-lg text-xs flex items-center gap-2",
                    isActive 
                      ? "text-red-700 dark:text-red-400 font-bold bg-slate-100 dark:bg-slate-800" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]" style={item.fillIcon && isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div>
            <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-surface">
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUi7whUWZTE2m-6VoDp1R9BaSuZM600eumk8GoSAetI_WF8BLmQwThYxDPjIp5oj-aC4e01SHVQfU14hBpc1rSrVfbaIe_jOTr5ob1DL9TPDTDEq4_mA3UwmglpRZHUrVliCxksX_pNO3-xHIbLckE84LH5DGuxHE_i8TU3dZgxSR92eODp0s4W_RQ03hDspV1EJ8I_f2xoHsuPLwHkui9g4EpYLrKF09FqmoNATPsqSNdzX_dV4mGWagyVKJo9_tQTUOEsdAXRnum"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary-fixed rounded-full border-2 border-surface"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <div className="pt-16">
        {children}
      </div>

      {/* BottomNavBar (Mobile & Small Desktop) */}
      <nav className="xl:hidden fixed bottom-0 w-full z-50 rounded-t-[2rem] bg-white/95 backdrop-blur-xl border-t border-outline-variant/10 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
        <div className="flex overflow-x-auto no-scrollbar items-center px-4 pt-3 pb-8 w-full gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  "flex flex-col items-center justify-center px-6 py-2 transition-all active:scale-90 duration-150 ease-out group shrink-0 min-w-[90px]",
                  isActive 
                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-2xl" 
                    : "text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                )}
              >
                <span className="material-symbols-outlined mb-1 text-xl transition-colors group-hover:text-red-500" style={(item.fillIcon || isActive) ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <span className={clsx("font-['Inter'] text-[10px] whitespace-nowrap uppercase tracking-widest", isActive ? "font-bold" : "font-medium")}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
