// Sidebar.jsx
import { useState } from "react";
import { 
  LayoutDashboard, Dumbbell, Salad, 
  LineChart, User, Settings,
  PanelLeftClose, PanelLeftOpen 
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Dumbbell,        label: "Workouts" },
  { icon: Salad,           label: "Diet" },
  { icon: LineChart,       label: "Progress" },
  { icon: User,            label: "Profile" },
  { icon: Settings,        label: "Settings" },
];

export default function Sidebar() {
  const [mini, setMini] = useState(false);

  return (
    <aside className={`
      flex flex-col h-screen bg-[#111114] border-r border-[#1c1c20]
      transition-all duration-300 ease-in-out overflow-hidden
      ${mini ? "w-[60px] px-2" : "w-[220px] px-3"}
    `}>

      {/* Logo */}
      <div className="flex items-center gap-3 py-5 mb-4">
        <div className="w-9 h-9 min-w-[36px] bg-red-600 rounded-xl flex items-center
                        justify-center font-black text-base shadow-[0_4px_16px_rgba(220,38,38,.4)]">
          ⚡
        </div>
        {!mini && (
          <div className="overflow-hidden">
            <p className="text-sm font-black tracking-widest text-white">GYMFIED</p>
            <p className="text-[9px] text-neutral-600 tracking-[3px]">WILD TRAINING OS</p>
          </div>
        )}
        <button
          onClick={() => setMini(!mini)}
          className="ml-auto p-1.5 rounded-lg border border-[#1e1e22]
                     text-neutral-600 hover:text-neutral-300 hover:bg-[#1a1a1e]
                     transition-all"
        >
          {mini ? <PanelLeftOpen size={15}/> : <PanelLeftClose size={15}/>}
        </button>
      </div>

      {/* Nav */}
      {!mini && (
        <p className="text-[9px] font-bold tracking-widest text-neutral-700 px-2 mb-2 uppercase">
          Main
        </p>
      )}

      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button key={label} className={`
            flex items-center gap-3 px-2.5 py-2.5 rounded-xl border transition-all
            ${active
              ? "bg-[#1c1016] border-[#2a1518] text-red-500"
              : "border-transparent text-neutral-600 hover:bg-[#1a1a1e] hover:text-neutral-300"
            }
            ${mini ? "justify-center" : ""}
          `}>
            <Icon size={18} className="shrink-0"/>
            {!mini && <span className="text-[13px] font-medium">{label}</span>}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="mt-auto mb-2 bg-[#161619] border border-[#1e1e22] 
                      rounded-xl p-2.5 flex items-center gap-2 overflow-hidden">
        <div className="w-8 h-8 min-w-[32px] rounded-full bg-gradient-to-br
                        from-red-600 to-orange-500 flex items-center justify-center
                        text-xs font-bold text-white">
          J
        </div>
        {!mini && (
          <div>
            <p className="text-xs font-bold text-neutral-300">jhon</p>
            <p className="text-[10px] font-semibold text-red-500 tracking-wider">PREMIUM</p>
          </div>
        )}
      </div>
    </aside>
  );
}