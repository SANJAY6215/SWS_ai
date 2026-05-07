import React from 'react';
import { 
  LayoutDashboard, 
  Files, 
  Clock, 
  HelpCircle,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Files, label: 'Documents' },
    { icon: Clock, label: 'History' },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Help Center' },
  ];

  return (
    <aside className="w-72 border-r border-slate-200/60 bg-white h-screen sticky top-0 flex flex-col z-20">
      <div className="p-8 flex-1">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
            <Zap className="text-white w-6 h-6 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">SWS AI</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Enterprise</span>
          </div>
        </div>

        <nav className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Main Menu</p>
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                activeTab === item.label
                  ? 'sidebar-item-active' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${activeTab === item.label ? 'text-white' : ''}`} />
              <span className="font-semibold text-sm">{item.label}</span>
              {activeTab === item.label && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8 space-y-2 border-t border-slate-100 bg-slate-50/50">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Support</p>
        {bottomItems.map((item, idx) => (
          <button
            key={idx}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all duration-300 group"
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
