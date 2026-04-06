import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input, { Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { getBMIColor, getGoalLabel, getGoalColor } from '../utils/helpers';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: user?.username || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    fitness_goal: user?.fitness_goal || 'maintain',
    activity_level: user?.activity_level || 'moderate',
    gender: user?.gender || 'male',
    bio: user?.bio || '',
  });

  // BMI Calculator state (standalone tool)
  const [bmiForm, setBmiForm] = useState({ weight: '', height: '', age: '', gender: 'male', activity_level: 'moderate', fitness_goal: 'maintain' });
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiLoading, setBmiLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await authAPI.updateProfile({ ...form, weight: parseFloat(form.weight) || null, height: parseFloat(form.height) || null, age: parseInt(form.age) || null });
      updateUser(res.data);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleBMICalc = async (e) => {
    e.preventDefault();
    setBmiLoading(true);
    try {
      const res = await authAPI.calculateBMI(bmiForm);
      setBmiResult(res.data);
    } catch {}
    setBmiLoading(false);
  };

  const bmiColor = getBMIColor(user?.bmi);
  const goalColor = getGoalColor(user?.fitness_goal);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Profile & Settings</h1>

      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.grid}>
        {/* Profile card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={styles.profileTop}>
              <div style={styles.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
              <div>
                <h2 style={styles.name}>{user?.username}</h2>
                <p style={styles.email}>{user?.email}</p>
                <Badge color={user?.fitness_goal === 'fat_loss' ? 'red' : user?.fitness_goal === 'muscle_gain' ? 'blue' : 'green'}>
                  {getGoalLabel(user?.fitness_goal)}
                </Badge>
              </div>
            </div>
            {user?.bio && <p style={styles.bio}>{user.bio}</p>}

            {/* Key metrics */}
            <div style={styles.metricsGrid}>
              {[
                { label: 'BMI', value: user?.bmi, sub: user?.bmi_category, color: bmiColor },
                { label: 'Daily Calories', value: user?.daily_calories, sub: 'kcal target', color: '#38bdf8' },
                { label: 'TDEE', value: user?.tdee, sub: 'kcal maintenance', color: '#6366f1' },
                { label: 'Weight', value: user?.weight ? `${user.weight} kg` : '—', sub: 'Current', color: '#f59e0b' },
                { label: 'Height', value: user?.height ? `${user.height} cm` : '—', sub: 'Stature', color: '#10b981' },
                { label: 'Age', value: user?.age ? `${user.age} yr` : '—', sub: 'Years old', color: '#94a3b8' },
              ].map(({ label, value, sub, color }) => (
                <div key={label} style={styles.metricBox}>
                  <div style={{ color: color, fontSize: 20, fontWeight: 800 }}>{value ?? '—'}</div>
                  <div style={{ color: 'var(--text-dark)', fontSize: 12, fontWeight: 600 }}>{label}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{sub}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* BMI Calculator */}
          <Card>
            <h3 style={styles.cardTitle}>BMI & Calorie Calculator</h3>
            <form onSubmit={handleBMICalc} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input label="Weight (kg)" type="number" placeholder="70" step="0.1"
                  value={bmiForm.weight} onChange={(e) => setBmiForm({ ...bmiForm, weight: e.target.value })} required />
                <Input label="Height (cm)" type="number" placeholder="175"
                  value={bmiForm.height} onChange={(e) => setBmiForm({ ...bmiForm, height: e.target.value })} required />
                <Input label="Age" type="number" placeholder="25"
                  value={bmiForm.age} onChange={(e) => setBmiForm({ ...bmiForm, age: e.target.value })} />
                <Select label="Gender" value={bmiForm.gender} onChange={(e) => setBmiForm({ ...bmiForm, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </div>
              <Select label="Activity Level" value={bmiForm.activity_level} onChange={(e) => setBmiForm({ ...bmiForm, activity_level: e.target.value })}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="very_active">Very Active</option>
                <option value="extra_active">Extra Active</option>
              </Select>
              <Select label="Goal" value={bmiForm.fitness_goal} onChange={(e) => setBmiForm({ ...bmiForm, fitness_goal: e.target.value })}>
                <option value="fat_loss">Fat Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintain">Maintain</option>
              </Select>
              <Button type="submit" loading={bmiLoading}>Calculate</Button>
            </form>

            {bmiResult && (
              <div style={styles.bmiResult}>
                <div style={styles.bmiRow}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: getBMIColor(bmiResult.bmi), fontSize: 36, fontWeight: 800 }}>{bmiResult.bmi}</div>
                    <div style={{ color: 'var(--text-dark)', fontWeight: 600 }}>BMI</div>
                    <div style={{ color: getBMIColor(bmiResult.bmi), fontSize: 13 }}>{bmiResult.category}</div>
                  </div>
                  {bmiResult.daily_calories && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--primary)', fontSize: 36, fontWeight: 800 }}>{bmiResult.daily_calories}</div>
                      <div style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Daily Calories</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>kcal/day target</div>
                    </div>
                  )}
                  {bmiResult.tdee && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#6366f1', fontSize: 36, fontWeight: 800 }}>{bmiResult.tdee}</div>
                      <div style={{ color: 'var(--text-dark)', fontWeight: 600 }}>TDEE</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Maintenance kcal</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Edit Profile */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={styles.cardTitle}>Edit Profile</h3>
            {!editing && <Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button>}
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} disabled={!editing} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Input label="Age" type="number" min={10} max={120} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} disabled={!editing} />
              <Input label="Weight (kg)" type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} disabled={!editing} />
              <Input label="Height (cm)" type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} disabled={!editing} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Select label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} disabled={!editing}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
              <Select label="Activity Level" value={form.activity_level} onChange={(e) => setForm({ ...form, activity_level: e.target.value })} disabled={!editing}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="very_active">Very Active</option>
                <option value="extra_active">Extra Active</option>
              </Select>
            </div>
            <Select label="Fitness Goal" value={form.fitness_goal} onChange={(e) => setForm({ ...form, fitness_goal: e.target.value })} disabled={!editing}>
              <option value="fat_loss">🔥 Fat Loss</option>
              <option value="muscle_gain">💪 Muscle Gain</option>
              <option value="maintain">⚖️ Maintain</option>
            </Select>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} disabled={!editing}
                placeholder="Tell us about your fitness journey…" rows={3}
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: 'var(--text-dark)', fontSize: 14, width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            {editing && (
              <div style={{ display: 'flex', gap: 10 }}>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="submit" loading={saving} style={{ flex: 1, justifyContent: 'center' }}>Save Changes</Button>
              </div>
            )}
          </form>

          {/* Goal description */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #ffffffff', paddingTop: '1.5rem' }}>
            <h4 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, margin: '0 0 10px' }}>YOUR PLAN STRATEGY</h4>
            {user?.fitness_goal === 'fat_loss' && <PlanDesc icon="🔥" title="Fat Loss Protocol" points={['HIIT + Full Body circuits 5-6 days/week','500 kcal daily deficit for ~0.5kg/week loss','High protein to preserve muscle mass','Cardio-focused training sessions']} />}
            {user?.fitness_goal === 'muscle_gain' && <PlanDesc icon="💪" title="Muscle Gain Protocol" points={['Push/Pull/Legs split 6 days/week','300 kcal daily surplus for lean gains','Progressive overload with heavy compounds','4×8 rep ranges for hypertrophy']} />}
            {user?.fitness_goal === 'maintain' && <PlanDesc icon="⚖️" title="Maintenance Protocol" points={['Balanced upper/lower split 5 days/week','Maintenance calorie intake (TDEE)','Mix of strength and cardio work','3×12 rep ranges for general fitness']} />}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PlanDesc({ icon, title, points }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ color: 'var(--text-dark)', fontWeight: 700, marginBottom: 10 }}>{icon} {title}</div>
      {points.map((p) => (
        <div key={p} style={{ color: '#64748b', fontSize: 13, marginBottom: 6, display: 'flex', gap: 8 }}>
          <span style={{ color: '#38bdf8' }}>→</span>{p}
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: { maxWidth: 1400, margin: '0 auto', padding: '2rem 1.5rem' },
  title: { color: 'var(--text-dark)', fontSize: 26, fontWeight: 800, margin: '0 0 1.5rem' },
  success: { background: '#ecfdf5', border: '1px solid #10b981', color: '#047857', borderRadius: 12, padding: '12px 16px', marginBottom: '1.5rem', fontSize: 14 },
  errorBox: { background: '#fef2f2', border: '1px solid #ef4444', color: '#b91c1c', borderRadius: 12, padding: '12px 16px', marginBottom: '1.5rem', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20, alignItems: 'start' },
  profileTop: { display: 'flex', gap: 16, alignItems: 'center', marginBottom: '1.5rem' },
  avatar: { width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 28, flexShrink: 0 },
  name: { color: 'var(--text-dark)', fontSize: 22, fontWeight: 800, margin: '0 0 4px' },
  email: { color: 'var(--text-muted)', fontSize: 14, margin: '0 0 8px' },
  bio: { color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '0.5rem' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
  metricBox: { background: '#f8fafc', borderRadius: 12, padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' },
  cardTitle: { color: 'var(--text-dark)', fontSize: 17, fontWeight: 700, margin: '0 0 16px' },
  bmiResult: { marginTop: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px' },
  bmiRow: { display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 },
};
