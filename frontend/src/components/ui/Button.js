import React from 'react';

const variants = {
  primary: { background: 'var(--primary-gradient)', color: '#fff', border: 'none', boxShadow: 'var(--shadow-primary)' },
  secondary: { background: '#fff', color: 'var(--text-dark)', border: '1px solid #e2e8f0' },
  danger: { background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' },
  success: { background: '#dcfce7', color: '#16a34a', border: 'none' },
  ghost: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid #e2e8f0' },
};

export default function Button({ children, variant = 'primary', size = 'md', loading = false, style = {}, ...props }) {
  const sizes = { sm: '7px 14px', md: '10px 20px', lg: '14px 28px' };
  return (
    <button
      style={{
        ...variants[variant],
        padding: sizes[size],
        borderRadius: 10,
        fontSize: size === 'sm' ? 13 : 15,
        fontWeight: 600,
        cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
        opacity: props.disabled || loading ? 0.6 : 1,
        transition: 'all 0.15s',
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
