import React from 'react';

const COLORS = {
  blue: { bg: 'var(--primary-light)', text: 'var(--primary)' },
  green: { bg: 'var(--color-mint-light)', text: 'var(--color-mint)' },
  red: { bg: '#fee2e2', text: '#ef4444' },
  yellow: { bg: 'var(--color-orange-light)', text: 'var(--color-orange)' },
  purple: { bg: 'var(--color-purple-light)', text: 'var(--color-purple)' },
  gray: { bg: '#f1f5f9', text: 'var(--text-muted)' },
};

export default function Badge({ children, color = 'blue', style = {} }) {
  const c = COLORS[color] || COLORS.gray;
  return (
    <span style={{ background: c.bg, color: c.text, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, ...style }}>
      {children}
    </span>
  );
}
