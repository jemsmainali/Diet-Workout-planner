import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ArrowRight, Flame, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <motion.div className="auth-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <p className="page-kicker">Premium fitness SaaS</p>
        <h1 className="font-display neon-text">Train wild. Eat precise. Track everything.</h1>
        <p>GYMFIED turns your intelligent training planner into a cinematic command center for workouts, diet, and body progress.</p>
        <div className="auth-proof">
          <span><Flame size={16} /> Adaptive plans</span>
          <span><ShieldCheck size={16} /> Private data</span>
          <span><Zap size={16} /> Fast rituals</span>
        </div>
      </motion.div>

      <Tilt glareEnable glareMaxOpacity={0.18} tiltMaxAngleX={7} tiltMaxAngleY={7}>
        <motion.div className="auth-card premium-panel" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12 }}>
          <div className="auth-logo"><Zap size={24} fill="currentColor" /></div>
          <h2 className="font-display">Member Login</h2>
          <p>Enter the arena and keep your streak alive.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input label="Email address" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            {error && <div className="auth-error">{error}</div>}
            <Button type="submit" loading={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
            </Button>
          </form>

          <p className="auth-link">
            New here? <Link to="/register">Create your account</Link>
          </p>
        </motion.div>
      </Tilt>
    </AuthShell>
  );
}

function AuthShell({ children }) {
  return (
    <main className="auth-shell">
      <div className="athlete-orb" style={{ width: 320, height: 320, background: 'rgba(255,31,61,0.28)', left: '8%', top: '10%' }} />
      <div className="athlete-orb" style={{ width: 240, height: 240, background: 'rgba(255,255,255,0.1)', right: '12%', bottom: '8%' }} />
      {children}
    </main>
  );
}
