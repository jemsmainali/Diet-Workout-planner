import React from 'react';

export default function Card({ children, style = {}, className = '' }) {
  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--glass-border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', ...style }} className={className}>
      {children}
    </div>
  );
}

export function StatCard({ icon, label, value, sub, color = 'var(--primary)' }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)', backdropFilter: 'blur(18px)' }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ color: 'var(--text-dark)', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{value ?? '—'}</div>
        {sub && <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}
