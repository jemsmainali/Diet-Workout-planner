import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}><img src="/images/gym_logo.jfif" alt="GYMFIED" style={styles.brandIcon} /></div>
          <h1 style={styles.title}>GYMFIED</h1>
          <p style={styles.sub}>Your intelligent gym & diet companion</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <Button type="submit" loading={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p style={styles.registerLink}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)', borderRadius: 24, padding: '2.5rem', width: '100%', maxWidth: 420 },
  header: { textAlign: 'center', marginBottom: '2rem' },
  logo: { fontSize: 52, marginBottom: 12 },
  title: { color: 'var(--text-dark)', fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' },
  sub: { color: 'var(--text-muted)', fontSize: 15, margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: '1.5rem' },
  error: { background: '#fee2e2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 10, padding: '10px 14px', fontSize: 14 },
  features: { borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: 8 },
  featureItem: { color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 },
  registerLink: { textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, margin: 0 },
};
