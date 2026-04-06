import React from 'react';

export default function LoadingSpinner({ size = 40, text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '3rem' }}>
      <div style={{
        width: size, height: size, border: `3px solid #1e293b`,
        borderTop: `3px solid #38bdf8`, borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {text && <span style={{ color: '#64748b', fontSize: 14 }}>{text}</span>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingSpinner size={50} text="Loading GYMFIED..." />
    </div>
  );
}
