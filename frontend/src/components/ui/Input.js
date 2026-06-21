import React, { useState } from 'react';

export default function Input({ label, error, style = {}, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>}
      <input
        {...props}
        style={{
          background: 'var(--surface-alt, #1b1b21)',
          border: `1px solid ${error ? '#ef4444' : focused ? 'var(--primary)' : 'var(--glass-border)'}`,
          borderRadius: 14,
          padding: '12px 14px',
          color: 'var(--text-dark)',
          fontSize: 15,
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(255, 31, 61, 0.18)' : 'none',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          ...style,
        }}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
      />
      {error && <span style={{ color: '#ef4444', fontSize: 12 }}>{error}</span>}
    </div>
  );
}

export function Select({ label, error, children, style = {}, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>}
      <select
        {...props}
        style={{
          background: 'var(--surface-alt, #1b1b21)',
          border: `1px solid ${error ? '#ef4444' : focused ? 'var(--primary)' : 'var(--glass-border)'}`,
          borderRadius: 14,
          padding: '12px 14px',
          color: 'var(--text-dark)',
          fontSize: 15,
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(255, 31, 61, 0.18)' : 'none',
          width: '100%',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          ...style,
        }}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
      >
        {children}
      </select>
      {error && <span style={{ color: '#ef4444', fontSize: 12 }}>{error}</span>}
    </div>
  );
}
