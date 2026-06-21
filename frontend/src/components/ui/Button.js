import React from 'react';

const variants = {
  primary: { background: 'var(--primary-gradient)', color: '#fff', border: '1px solid rgba(255, 91, 112, 0.55)', boxShadow: 'var(--shadow-primary)' },
  secondary: { background: 'rgba(255,255,255,0.08)', color: 'var(--text-dark)', border: '1px solid var(--glass-border)' },
  danger: { background: 'rgba(239,68,68,0.14)', color: '#fecaca', border: '1px solid rgba(239,68,68,0.35)' },
  success: { background: 'rgba(34,197,94,0.14)', color: '#86efac', border: '1px solid rgba(34,197,94,0.35)' },
  ghost: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' },
};

export default function Button({ children, variant = 'primary', size = 'md', loading = false, style = {}, ...props }) {
  const sizes = { sm: '7px 14px', md: '10px 20px', lg: '14px 28px' };
  return (
    <button
      style={{
        ...variants[variant],
        padding: sizes[size],
        borderRadius: 999,
        fontSize: size === 'sm' ? 13 : 15,
        fontWeight: 600,
        cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
        opacity: props.disabled || loading ? 0.6 : 1,
        transition: 'all 0.2s',
        letterSpacing: '0.01em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? '⏳' : children}
    </button>
  );
}
