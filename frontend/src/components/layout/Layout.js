import React from 'react';
import Navbar from './Navbar';
import '../../App.css';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
