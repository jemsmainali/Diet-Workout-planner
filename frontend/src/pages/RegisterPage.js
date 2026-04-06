import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';

const STEPS = ['Account', 'Body Metrics', 'Fitness Goal'];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
    age: '', weight: '', height: '', gender: 'male',
    fitness_goal: 'maintain', activity_level: 'moderate',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 2) { setStep(step + 1); return; }
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Registration failed.');
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>💪</div>
          <h1 style={styles.title}>Join GYMFIED</h1>
          <p style={styles.sub}>Build your personalized fitness journey</p>
        </div>

        {/* Step indicator */}
        <div style={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s} style={styles.stepWrap}>
              <div style={{ ...styles.stepDot, ...(i <= step ? styles.stepDotActive : {}) }}>{i + 1}</div>
              <span style={{ ...styles.stepLabel, color: i <= step ? 'var(--primary)' : 'var(--text-muted)' }}>{s}</span>
            </div>
          ))}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {step === 0 && (
            <>
              <Input label="Username" placeholder="johnfitness" value={form.username} onChange={update('username')} required />
              <Input label="Email" type="email" placeholder="john@email.com" value={form.email} onChange={update('email')} required />
              <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={update('password')} required />
              <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.password2} onChange={update('password2')} required />
            </>
          )}
          {step === 1 && (
            <>
              <div style={styles.row}>
                <Input label="Age" type="number" placeholder="25" min={10} max={120} value={form.age} onChange={update('age')} />
                <Select label="Gender" value={form.gender} onChange={update('gender')}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div style={styles.row}>
                <Input label="Weight (kg)" type="number" placeholder="70" min={20} max={500} step="0.1" value={form.weight} onChange={update('weight')} />
                <Input label="Height (cm)" type="number" placeholder="175" min={50} max={300} value={form.height} onChange={update('height')} />
              </div>
              <Select label="Activity Level" value={form.activity_level} onChange={update('activity_level')}>
                <option value="sedentary">Sedentary (little/no exercise)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="very_active">Very Active (6-7 days/week)</option>
                <option value="extra_active">Extra Active (twice/day)</option>
              </Select>
            </>
          )}
          {step === 2 && (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 }}>What's your primary fitness goal?</p>
              {[
                { value: 'fat_loss', label: '🔥 Fat Loss', desc: 'HIIT + Full body circuits, calorie deficit' },
                { value: 'muscle_gain', label: '💪 Muscle Gain', desc: 'Push/Pull/Legs split, calorie surplus' },
                { value: 'maintain', label: '⚖️ Maintain', desc: 'Balanced training, maintenance calories' },
              ].map(({ value, label, desc }) => (
                <label key={value} style={{ ...styles.goalOption, ...(form.fitness_goal === value ? styles.goalActive : {}) }}>
                  <input type="radio" name="goal" value={value} checked={form.fitness_goal === value} onChange={update('fitness_goal')} style={{ display: 'none' }} />
                  <div>
                    <div style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: 16 }}>{label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{desc}</div>
                  </div>
                  {form.fitness_goal === value && <span style={{ color: 'var(--primary)', fontSize: 18 }}>✓</span>}
                </label>
              ))}
            </>
          )}

          <div style={styles.btnRow}>
            {step > 0 && (
              <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>← Back</Button>
            )}
            <Button type="submit" loading={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {step < 2 ? 'Continue →' : (loading ? 'Creating account…' : 'Create Account 🚀')}
            </Button>
          </div>
        </form>

        <p style={styles.loginLink}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)', borderRadius: 24, padding: '2.5rem', width: '100%', maxWidth: 480 },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { color: 'var(--text-dark)', fontSize: 26, fontWeight: 800, margin: '0 0 4px' },
  sub: { color: 'var(--text-muted)', fontSize: 14, margin: 0 },
  steps: { display: 'flex', justifyContent: 'center', gap: 24, marginBottom: '1.5rem' },
  stepWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  stepDot: { width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  stepDotActive: { background: 'var(--primary-light)', color: 'var(--primary)' },
  stepLabel: { fontSize: 13, fontWeight: 500 },
  error: { background: '#fee2e2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 10, padding: '10px 14px', fontSize: 14, marginBottom: 12 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  goalOption: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s' },
  goalActive: { border: '1px solid var(--primary)', background: 'var(--primary-light)' },
  btnRow: { display: 'flex', gap: 10, marginTop: 6 },
  loginLink: { textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, margin: '1.5rem 0 0' },
};
