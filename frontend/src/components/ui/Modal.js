import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, width = 520 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(10px)' },
  modal: { background: 'rgba(14,14,18,0.96)', border: '1px solid var(--glass-border)', borderRadius: 24, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: 'var(--shadow-lg)', backdropFilter: 'blur(22px)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 1.5rem 0' },
  title: { color: 'var(--text-dark)', fontSize: 28, fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: '0.04em', fontWeight: 400, margin: 0 },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer', padding: 4 },
  body: { padding: '1.25rem 1.5rem 1.5rem' },
};
