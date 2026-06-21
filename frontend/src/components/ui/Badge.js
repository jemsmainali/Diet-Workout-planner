import React from 'react';

const COLORS = {
  blue: { bg: 'var(--primary-light)', text: '#ff5d72' },
  green: { bg: 'var(--color-mint-light)', text: 'var(--color-mint)' },
  red: { bg: '#fee2e2', text: '#ef4444' },
  yellow: { bg: 'var(--color-orange-light)', text: 'var(--color-orange)' },
  purple: { bg: 'var(--color-purple-light)', text: 'var(--color-purple)' },
  gray: { bg: 'rgba(255,255,255,0.08)', text: 'var(--text-muted)' },
};

export default function Badge({ children, color = 'blue', style = {} }) {
  const c = COLORS[color] || COLORS.gray;
  return (
    <span style={{ background: c.bg, color: c.text, padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.08)', ...style }}>
      {children}
    </span>
  );
}
