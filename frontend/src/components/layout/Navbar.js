import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Dumbbell, Gauge, LogOut, Salad, User, Zap } from 'lucide-react';
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

  return (
    <aside className="premium-sidebar">
      <Link to="/dashboard" className="premium-brand">
        <span className="brand-mark"><Zap size={22} fill="currentColor" /></span>
        <span>
          <span className="font-display brand-word">GYMFIED</span>
          <small>Wild training OS</small>
        </span>
      </Link>

      <nav className="premium-nav-links">
        {NAV_LINKS.map(({ to, label, Icon }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <Link key={to} to={to} className={`premium-nav-link ${isActive ? 'active' : ''}`}>
              {isActive && <motion.span layoutId="activeNav" className="active-nav-glow" />}
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="premium-user-card">
        <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
        <div>
          <strong>{user?.username || 'Athlete'}</strong>
          <span>Premium member</span>
        </div>
      </div>

      <button onClick={logout} className="premium-signout">
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
}
