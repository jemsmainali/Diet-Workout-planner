import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ChevronLeft, Dumbbell, Gauge, LogOut, Salad, User, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', Icon: Gauge },
  { to: '/workouts', label: 'Workouts', Icon: Dumbbell },
  { to: '/diet', label: 'Diet', Icon: Salad },
  { to: '/progress', label: 'Progress', Icon: Activity },
  { to: '/profile', label: 'Profile', Icon: User },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');

  const toggleSidebar = () => {
    setIsCollapsed((current) => {
      const next = !current;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  return (
    <aside className={`premium-sidebar relative transition-all duration-300 ${isCollapsed ? 'w-20 collapsed' : 'w-60'}`}>
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-5 z-10 grid h-7 w-7 place-items-center rounded-full bg-surface-alt border border-white/10 text-white shadow-lg transition-colors hover:text-red-300"
      >
        <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      <Link to="/dashboard" className={`premium-brand ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <span className="brand-mark"><Zap size={22} fill="currentColor" /></span>
        {!isCollapsed && (
          <span>
            <span className="font-display brand-word">GYMFIED</span>
            <small>Wild training OS</small>
          </span>
        )}
      </Link>

      <nav className="premium-nav-links">
        {NAV_LINKS.map(({ to, label, Icon }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <Link key={to} to={to} className={`premium-nav-link ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}>
              {isActive && <motion.span layoutId="activeNav" className="active-nav-glow" />}
              <Icon size={20} />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`premium-user-card ${isCollapsed ? 'collapsed-user-card' : ''}`}>
        <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
        {!isCollapsed && (
          <div>
            <strong>{user?.username || 'Athlete'}</strong>
            <span>Premium member</span>
          </div>
        )}
      </div>

      <button onClick={logout} className={`premium-signout ${isCollapsed ? 'px-0' : ''}`} aria-label="Sign out">
        <LogOut size={18} />
        {!isCollapsed && <span>Sign Out</span>}
      </button>
    </aside>
  );
}
