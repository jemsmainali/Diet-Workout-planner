import React from 'react';

export default function Input({ label, error, style = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>{label}</label>}
      <input
        style={{
          background: '#fff',
          border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
          borderRadius: 10,
          padding: '10px 14px',
          color: 'var(--text-dark)',
          fontSize: 15,
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ color: '#ef4444', fontSize: 12 }}>{error}</span>}
    </div>
  );
}

export function Select({ label, error, children, style = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>{label}</label>}
      <select
        style={{
          background: '#fff',
          border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
          borderRadius: 10,
          padding: '10px 14px',
          color: 'var(--text-dark)',
          fontSize: 15,
          outline: 'none',
          width: '100%',
          ...style,
        }}
        {...props}
      >
        {children}
      </select>
      {error && <span style={{ color: '#ef4444', fontSize: 12 }}>{error}</span>}
    </div>
  );
}
