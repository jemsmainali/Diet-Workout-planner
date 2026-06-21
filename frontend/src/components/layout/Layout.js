import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import '../../App.css';

gsap.registerPlugin(ScrollTrigger);

export default function Layout({ children }) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-on-scroll').forEach((element) => {
        gsap.fromTo(element, { y: 36, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%' },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <motion.main
        className="main-content"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {children}
      </motion.main>
    </div>
  );
}
