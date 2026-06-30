import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ArrowLeft, ArrowRight, Check, Dumbbell, Flame, Scale, UserPlus, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';

const STEPS = ['Account', 'Metrics', 'Goal'];

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
      localStorage.removeItem('seen-powerlifting-announcement');
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
    <main className="auth-shell register-shell">
      <motion.div className="auth-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <p className="page-kicker">Build your athlete profile</p>
        <h1 className="font-display neon-text">Your plan starts with clean data.</h1>
        <p>Set the foundation once, then let GYMFIED personalize training volume, calories, and progress tracking around you.</p>
        <div className="auth-proof">
          <span><Dumbbell size={16} /> Workouts</span>
          <span><Flame size={16} /> Nutrition</span>
          <span><Scale size={16} /> Metrics</span>
        </div>
      </motion.div>

      <Tilt glareEnable glareMaxOpacity={0.18} tiltMaxAngleX={6} tiltMaxAngleY={6}>
        <motion.div className="auth-card premium-panel register-card" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="auth-logo"><UserPlus size={24} /></div>
          <h2 className="font-display">Join GYMFIED</h2>
          <p>Step {step + 1} of 3</p>

          <div className="premium-steps">
            {STEPS.map((item, index) => (
              <span key={item} className={index <= step ? 'active' : ''}>{index < step ? <Check size={14} /> : index + 1} {item}</span>
            ))}
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
                <div className="form-row">
                  <Input label="Age" type="number" placeholder="25" min={10} max={120} value={form.age} onChange={update('age')} />
                  <Select label="Gender" value={form.gender} onChange={update('gender')}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
                <div className="form-row">
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
              <div className="goal-options">
                {[
                  { value: 'fat_loss', label: 'Fat Loss', desc: 'HIIT, deficit, high protein', icon: Flame },
                  { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Splits, surplus, overload', icon: Dumbbell },
                  { value: 'maintain', label: 'Maintain', desc: 'Balanced training and calories', icon: Scale },
                ].map(({ value, label, desc, icon: Icon }) => (
                  <label key={value} className={form.fitness_goal === value ? 'goal-option active' : 'goal-option'}>
                    <input type="radio" name="goal" value={value} checked={form.fitness_goal === value} onChange={update('fitness_goal')} />
                    <Icon size={20} />
                    <span><strong>{label}</strong><small>{desc}</small></span>
                    {form.fitness_goal === value && <Check size={18} />}
                  </label>
                ))}
              </div>
            )}

            <div className="auth-button-row">
              {step > 0 && <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Back</Button>}
              <Button type="submit" loading={loading} style={{ flex: 1, justifyContent: 'center' }}>
                {step < 2 ? <>Continue <ArrowRight size={16} /></> : (loading ? 'Creating account...' : <>Create Account <Zap size={16} /></>)}
              </Button>
            </div>
          </form>

          <p className="auth-link">Already a member? <Link to="/login">Sign in</Link></p>
        </motion.div>
      </Tilt>
    </main>
  );
}
