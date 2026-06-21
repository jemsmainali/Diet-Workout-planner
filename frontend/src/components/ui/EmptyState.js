import React from 'react';

export default function EmptyState({ icon, title, action }) {
  return (
    <div style={styles.wrap}>
      {icon && <div style={styles.icon}>{icon}</div>}
      <p style={styles.title}>{title}</p>
      {action && <div style={styles.action}>{action}</div>}
    </div>
  );
}

const styles = {
  wrap: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'var(--bg-card)',
    border: '1px solid var(--glass-border)',
    borderRadius: 24,
    boxShadow: 'var(--shadow-sm)',
    backdropFilter: 'blur(18px)',
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    color: 'var(--primary)',
    marginBottom: 12,
  },
  title: {
    color: 'var(--text-muted)',
    fontSize: 16,
    margin: 0,
  },
  action: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 16,
  },
};
