
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, History, Package, Settings, LogOut, Menu, X, Star, Heart, TreePine } from 'lucide-react';
import { ThemeType } from '../types';

interface SidebarProps {
  onLogout: () => void;
  theme: ThemeType;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, theme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getThemeAccent = () => {
    switch (theme) {
      case ThemeType.AHLY: return { text: "text-red-500", border: "border-red-600", bg: "bg-red-600/10", icon: <Heart size={16} fill="currentColor" /> };
      case ThemeType.RAMADAN: return { text: "text-emerald-400", border: "border-emerald-500", bg: "bg-emerald-600/10", icon: <Star size={16} fill="currentColor" /> };
      case ThemeType.CHRISTMAS: return { text: "text-green-500", border: "border-green-600", bg: "bg-green-600/10", icon: <TreePine size={16} /> };
      default: return { text: "text-blue-500", border: "border-blue-600", bg: "bg-blue-600/10", icon: null };
    }
  };

  const accent = getThemeAccent();
  const activeLinkClass = `${accent.bg} ${accent.text} border-r-4 ${accent.border} font-bold`;
  const baseLink = "flex items-center gap-3 px-6 py-4 transition-all hover:bg-white/5 text-gray-400";

  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "الإحصائيات" },
    { to: "/devices", icon: <Gamepad2 size={20} />, label: "الأجهزة" },
    { to: "/history", icon: <History size={20} />, label: "السجل" },
    { to: "/inventory", icon: <Package size={20} />, label: "المخزون" },
    { to: "/settings", icon: <Settings size={20} />, label: "الإعدادات" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col h-screen sticky top-0 bg-black border-l border-gray-800">
        <div className="p-8 text-center border-b border-gray-800">
          <h1 className={`text-2xl font-black flex items-center justify-center gap-2 ${accent.text}`}>
            {accent.icon}
            مركز الألعاب
          </h1>
          <p className="text-[10px] mt-2 text-gray-500 uppercase tracking-widest font-bold">PlayStation System</p>
        </div>

        <nav className="flex-1 mt-6">
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              className={({ isActive }) => `${baseLink} ${isActive ? activeLinkClass : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 sticky top-0 z-50 bg-black border-b border-gray-800">
        <h1 className={`font-black flex items-center gap-2 ${accent.text}`}>
          {accent.icon}
          مركز الألعاب
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] z-40 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={closeMobileMenu}>
          <div className="w-full bg-black border-b border-gray-800 shadow-2xl animate-in slide-in-from-top duration-200" onClick={e => e.stopPropagation()}>
            <nav className="flex flex-col py-2">
              {navItems.map((item) => (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `${baseLink} ${isActive ? activeLinkClass : ""}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button 
                onClick={() => { onLogout(); closeMobileMenu(); }}
                className={`${baseLink} text-red-500`}
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
