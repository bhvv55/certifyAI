
import React from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  HelpCircle, 
  UserCircle, 
  LogOut,
  Fingerprint,
  Heart
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  theme: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, theme }) => {
  const menuItems = [
    { id: 'upload', label: 'Verify New', icon: Upload },
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'history', label: 'Audit Registry', icon: History },
    { id: 'favorites', label: 'Saved Audits', icon: Heart },
    { id: 'reports', label: 'Help Guide', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: UserCircle },
  ];

  const sidebarClasses = {
    light: "bg-white border-slate-100 text-slate-900",
    dark: "bg-slate-900 border-slate-800 text-slate-100",
    night: "bg-[#050505] border-[#1a1a1a] text-[#d4d4d4]",
    reading: "bg-[#f4ecd8] border-[#e2d5b6] text-[#5b4636]"
  };

  return (
    <div className={`w-72 border-r flex flex-col h-screen fixed left-0 top-0 z-50 transition-colors duration-500 ${sidebarClasses[theme as keyof typeof sidebarClasses]}`}>
      <div className="p-8 flex items-center space-x-4 mb-4">
        <div className="p-2.5 bg-black rounded-2xl shadow-lg flex-shrink-0">
          <Fingerprint className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-black tracking-tight leading-none uppercase truncate">certifyAI</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-5 mb-4 text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">Core Modules</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
              currentView === item.id 
                ? 'bg-black text-white shadow-xl' 
                : 'opacity-60 hover:opacity-100 hover:bg-current/5'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-transform ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-current/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl opacity-40 hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
        <div className="mt-6 px-5">
           <p className="text-[9px] font-black opacity-20 uppercase tracking-widest">System v1.0.4</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
