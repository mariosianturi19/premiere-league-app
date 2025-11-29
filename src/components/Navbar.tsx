import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, LayoutGrid, Info } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  // Komponen Item Navigasi untuk Desktop (Top Bar)
  const DesktopNavItem = (path: string, icon: React.ReactNode, label: string) => {
    const isActive = location.pathname === path;
    return (
      <Link 
        to={path} 
        className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 group overflow-hidden
        ${isActive 
          ? "text-pl-primary bg-pl-cyan shadow-[0_0_15px_rgba(0,255,133,0.4)]" 
          : "text-pl-gray hover:text-white hover:bg-white/5"}`}
      >
        <span className="relative z-10 flex items-center gap-2">{icon} {label}</span>
        {/* Efek Kilau saat aktif */}
        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />}
      </Link>
    );
  };

  // Komponen Item Navigasi untuk Mobile (Bottom Bar)
  const MobileNavItem = (path: string, icon: React.ReactNode, label: string) => {
    const isActive = location.pathname === path;
    return (
      <Link 
        to={path} 
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300
        ${isActive ? "text-pl-cyan" : "text-pl-gray hover:text-white"}`}
      >
        <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? "bg-white/10 shadow-[0_0_10px_rgba(0,255,133,0.2)] -translate-y-1" : ""}`}>
          {icon}
        </div>
        <span className="text-[9px] font-bold tracking-wider uppercase">{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* ==========================
          1. TOP NAVBAR (Desktop)
         ========================== */}
      <nav className="fixed top-0 w-full bg-[#2c0030]/90 backdrop-blur-xl border-b border-white/5 z-50 h-16 md:h-20 flex items-center shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full px-4 md:px-6">
          
          {/* Logo Brand (Tampil di Mobile & Desktop) */}
          <Link to="/" className="flex items-center gap-3 group mx-auto md:mx-0">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/1200px-Premier_League_Logo.svg.png" 
              alt="Premier League Logo" 
              className="w-10 h-10 md:w-14 md:h-14 object-contain group-hover:rotate-12 transition-transform duration-500" 
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tighter text-white leading-none group-hover:text-pl-cyan transition-colors">PREMIER<span className="text-pl-cyan">LEAGUE</span></span>
              <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-pl-gray uppercase text-center md:text-left">Information</span>
            </div>
          </Link>

          {/* Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-2 p-1.5 bg-pl-dark/50 rounded-full border border-white/5 backdrop-blur-md">
            {DesktopNavItem('/', <LayoutGrid size={18} />, 'Dashboard')}
            {DesktopNavItem('/teams', <Users size={18} />, 'Clubs')}
            {DesktopNavItem('/matches', <Calendar size={18} />, 'Fixtures')}
            {DesktopNavItem('/about', <Info size={18} />, 'Creator')}
          </div>
        </div>
      </nav>

      {/* ==========================
          2. BOTTOM NAVBAR (Mobile)
         ========================== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[4.5rem] bg-[#240026]/95 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
        <div className="flex justify-around items-center h-full px-2">
          {MobileNavItem('/', <LayoutGrid size={20} strokeWidth={2.5} />, 'Home')}
          {MobileNavItem('/teams', <Users size={20} strokeWidth={2.5} />, 'Clubs')}
          {MobileNavItem('/matches', <Calendar size={20} strokeWidth={2.5} />, 'Match')}
          {MobileNavItem('/about', <Info size={20} strokeWidth={2.5} />, 'About')}
        </div>
        
        {/* Hiasan Garis Atas (Gradient Line) */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pl-cyan/50 to-transparent"></div>
      </nav>
    </>
  );
}