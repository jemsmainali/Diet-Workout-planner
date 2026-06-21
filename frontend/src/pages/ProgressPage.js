import React, { useState, useEffect, useCallback } from 'react';
import { progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { WeightChart, BodyFatChart } from '../components/charts/ProgressChart';
import { formatDate, getBMIColor } from '../utils/helpers';
import { Activity, Flame, LineChart, Scale } from 'lucide-react';

export default function ProgressPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '', body_fat: '', chest: '', waist: '',
    hips: '', bicep: '', energy_level: 7, sleep_hours: '', notes: '',
  });
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [entriesRes, reportRes] = await Promise.all([
        progressAPI.getAll(),
        progressAPI.weeklyReport(),
      ]);
      setEntries(entriesRes.data.results || []);
      setReport(reportRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await progressAPI.add({ ...form, weight: parseFloat(form.weight), body_fat: form.body_fat ? parseFloat(form.body_fat) : null });
      setShowModal(false);
      setForm({ date: new Date().toISOString().split('T')[0], weight: '', body_fat: '', chest: '', waist: '', hips: '', bicep: '', energy_level: 7, sleep_hours: '', notes: '' });
      await fetchData();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Could not save entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    await progressAPI.delete(id);
    await fetchData();
  };

  if (loading) return <div style={styles.page}><LoadingSpinner /></div>;

  const chartData = [...entries].reverse();
  const latest = entries[0];
  const bmiColor = getBMIColor(latest?.bmi);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Progress Tracker</h1>
          <p style={styles.sub}>Track your body transformation over time</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Log Progress</Button>
      </div>

      <div style={styles.placeholderStats}>
        {[
          { label: 'Current Weight', value: latest?.weight ? `${latest.weight} kg` : '—', sub: 'Latest log', icon: <Scale size={24} />, color: '#f59e0b' },
          { label: 'BMI', value: latest?.bmi || user?.bmi || '—', sub: latest?.bmi ? 'Current' : 'No data yet', icon: <Activity size={24} />, color: bmiColor },
          { label: 'Streak', value: report?.entries_count ? `${report.entries_count}` : '—', sub: 'Check-ins', icon: <Flame size={24} />, color: 'var(--primary)' },
        ].map(({ label, value, sub, icon, color }) => (
          <div key={label} style={styles.metricBox}>
            <div style={{ color, marginBottom: 8 }}>{icon}</div>
            <div style={{ color, fontSize: 20, fontWeight: 800 }}>{value}</div>
            <div style={{ color: 'var(--text-dark)', fontSize: 12, fontWeight: 600 }}>{label}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {chartData.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: '1.5rem' }}>
          <Card>
            <h3 style={styles.chartTitle}>Weight Over Time (kg)</h3>
            <WeightChart data={chartData} />
          </Card>
          <Card>
            <h3 style={styles.chartTitle}>Body Fat %</h3>
            <BodyFatChart data={chartData} />
          </Card>
        </div>
      )}

      {/* Entry history */}
      <h2 style={styles.sectionTitle}>History</h2>
      {!entries.length ? (
        <EmptyState
          icon={<LineChart size={64} />}
          title="No progress logged yet."
          action={<Button onClick={() => setShowModal(true)}>Log Your First Entry</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map((entry) => (
            <div key={entry.id} style={styles.entryRow}>
              <div style={styles.entryDate}>
                <div style={{ color: 'var(--text-dark)', fontWeight: 700, fontSize: 15 }}>{formatDate(entry.date)}</div>
                {entry.bmi && <div style={{ color: getBMIColor(entry.bmi), fontSize: 12, fontWeight: 600 }}>BMI {entry.bmi}</div>}
              </div>
              <div style={styles.entryStats}>
                <Stat label="Weight" value={`${entry.weight} kg`} />
                {entry.body_fat && <Stat label="Body Fat" value={`${entry.body_fat}%`} />}
                {entry.chest && <Stat label="Chest" value={`${entry.chest} cm`} />}
                {entry.waist && <Stat label="Waist" value={`${entry.waist} cm`} />}
                {entry.bicep && <Stat label="Bicep" value={`${entry.bicep} cm`} />}
                <Stat label="Energy" value={`${entry.energy_level}/10`} />
                {entry.sleep_hours && <Stat label="Sleep" value={`${entry.sleep_hours}h`} />}
              </div>
              {entry.notes && <div style={{ color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic', flex: 1 }}>{entry.notes}</div>}
              <button onClick={() => handleDelete(entry.id)} style={styles.deleteBtn}>✕</button>
            </div>
          ))}
        </div>
      )}

      <Card style={{ marginTop: '1.5rem', minHeight: 220 }}>
        <h3 style={styles.chartTitle}>Progress Chart</h3>
        <div style={styles.emptyChart}>
          {chartData.length > 1 ? 'Chart data loaded above.' : 'Your chart will appear here after two progress entries.'}
        </div>
      </Card>

      {/* Log Progress Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Progress Entry" width={560}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && <div style={{ background: '#7f1d1d', color: '#fca5a5', borderRadius: 10, padding: '10px 14px', fontSize: 14 }}>{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <Input label="Weight (kg) *" type="number" step="0.1" min={20} placeholder="70.5" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Body Fat %" type="number" step="0.1" min={1} max={60} placeholder="15.0" value={form.body_fat} onChange={(e) => setForm({ ...form, body_fat: e.target.value })} />
            <Input label="Sleep Hours" type="number" step="0.5" min={0} max={24} placeholder="7.5" value={form.sleep_hours} onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })} />
          </div>
          <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0', fontWeight: 600 }}>Measurements (cm) — optional</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {['chest', 'waist', 'hips', 'bicep'].map((field) => (
              <Input key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} type="number" step="0.1" placeholder="—"
                value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            ))}
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>Energy Level: {form.energy_level}/10</label>
            <input type="range" min={1} max={10} value={form.energy_level}
              onChange={(e) => setForm({ ...form, energy_level: parseInt(e.target.value) })}
              style={{ width: '100%', accentColor: '#38bdf8', marginTop: 8 }} />
          </div>
          <Input label="Notes" placeholder="How are you feeling? Any observations…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <Button type="submit" loading={saving}>Save Entry</Button>
        </form>
      </Modal>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 60 }}>
      <div style={{ color: 'var(--primary)', fontSize: 15, fontWeight: 700 }}>{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{label}</div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 1400, margin: '0 auto', padding: '0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 },
  title: { color: 'var(--text-dark)', fontSize: 46, fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: '0.04em', fontWeight: 400, margin: '0 0 4px' },
  sub: { color: 'var(--text-muted)', fontSize: 15, margin: 0 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: '1.5rem' },
  statBox: { background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 18, padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', boxShadow: 'var(--shadow-sm)', backdropFilter: 'blur(18px)' },
  placeholderStats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: '1.5rem' },
  metricBox: { background: 'rgba(255,255,255,0.055)', borderRadius: 16, padding: '12px', textAlign: 'center', border: '1px solid var(--glass-border)' },
  chartTitle: { color: 'var(--text-dark)', fontSize: 15, fontWeight: 700, margin: '0 0 16px' },
  sectionTitle: { color: 'var(--text-dark)', fontSize: 18, fontWeight: 700, margin: '0 0 1rem' },
  emptyChart: { minHeight: 150, display: 'grid', placeItems: 'center', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: 18, background: 'rgba(255,255,255,0.035)' },
  entryRow: { background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', boxShadow: 'var(--shadow-sm)', backdropFilter: 'blur(18px)' },
  entryDate: { minWidth: 110 },
  entryStats: { display: 'flex', gap: 20, flexWrap: 'wrap', flex: 1 },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16, padding: 4 },
};
