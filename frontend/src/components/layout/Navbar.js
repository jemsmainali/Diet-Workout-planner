import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, ChartBarIcon, FireIcon, UserIcon 
} from '@heroicons/react/24/outline';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { to: '/workouts', label: 'Workouts', Icon: FireIcon },
  { to: '/progress', label: 'Progress', Icon: ChartBarIcon },
  { to: '/profile', label: 'Profile', Icon: UserIcon },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <Link to="/dashboard" style={styles.brand}>
            <img src="/images/gym_logo.jfif" alt="GYMFIED" style={styles.brandIcon} />
            <span style={styles.brandText}>GYMFIED</span>
          </Link>
          <div style={styles.links}>
            {NAV_LINKS.map(({ to, label, Icon }) => {
              const isActive = location.pathname.startsWith(to);
              return (
                <Link key={to} to={to} style={{ ...styles.link, color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                  <Icon style={{ width: 22, height: 22 }} />
                  <span style={isActive ? styles.linkActiveText : {}}>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div style={styles.right}>
          <div style={styles.userBadge}>
            <span style={styles.userAvatar}>{user?.username?.[0]?.toUpperCase() || 'U'}</span>
            <span style={styles.userName}>{user?.username}</span>
          </div>
          <button onClick={logout} className="btn-outline">Sign Out</button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '0 48px',
    height: 72,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { display: 'flex', alignItems: 'center', gap: 48 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  brandIcon: { width: 38, height: 38, objectFit: 'cover', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  brandText: { fontSize: 24, fontWeight: 700, color: 'var(--text-dark)', letterSpacing: '-0.5px' },
  links: { display: 'flex', alignItems: 'center', gap: 32 },
  link: { display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s', fontSize: 16 },
  linkActiveText: { fontWeight: 700 },
  right: { display: 'flex', alignItems: 'center', gap: 24 },
  userBadge: { display: 'flex', alignItems: 'center', gap: 10 },
  userAvatar: { width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 16 },
  userName: { color: 'var(--text-dark)', fontSize: 15, fontWeight: 600 },
};
