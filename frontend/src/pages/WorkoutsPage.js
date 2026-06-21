import React, { useState, useEffect, useCallback } from 'react';
import { workoutAPI, plansAPI } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input, { Select } from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import PlaceholderImage from '../components/ui/PlaceholderImage';
import { capitalize, getWeekDays } from '../utils/helpers';
import { Dumbbell, PlusCircle } from 'lucide-react';

const DAY_ORDER = getWeekDays();
const MUSCLE_COLORS = { chest:'blue', back:'purple', shoulders:'green', biceps:'yellow', triceps:'red', legs:'blue', glutes:'purple', abs:'green', cardio:'red', full_body:'yellow' };

export default function WorkoutsPage() {
  const [plans, setPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', day: 'monday', notes: '' });
  const [genMsg, setGenMsg] = useState('');
  const [activeDay, setActiveDay] = useState('monday');

  const fetchPlans = useCallback(async () => {
    try {
      const [plansRes, exRes] = await Promise.all([
        workoutAPI.getPlans(),
        workoutAPI.getExercises(),
      ]);
      setPlans(plansRes.data.results || []);
      setExercises(exRes.data.results || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenMsg('');
    try {
      const res = await plansAPI.generateWorkout();
      setGenMsg(`✅ ${res.data.message}`);
      await fetchPlans();
    } catch (e) {
      setGenMsg('⚠️ ' + (e.response?.data?.error || 'Could not generate. Complete your profile first.'));
    } finally {
      setGenerating(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await workoutAPI.createPlan(newPlan);
      setShowAddModal(false);
      setNewPlan({ name: '', day: 'monday', notes: '' });
      await fetchPlans();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    await workoutAPI.deletePlan(id);
    await fetchPlans();
  };

  const plansForDay = plans.filter((p) => p.day === activeDay);

  if (loading) return <div style={styles.page}><LoadingSpinner /></div>;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Workout Plans</h1>
          <p style={styles.sub}>Your weekly training schedule</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={() => setShowAddModal(true)}>+ Add Plan</Button>
          <Button onClick={handleGenerate} loading={generating}>✨ Auto-Generate</Button>
        </div>
      </div>

      {genMsg && (
        <div style={{ background: genMsg.startsWith('✅') ? '#064e3b' : '#78350f', border: `1px solid ${genMsg.startsWith('✅') ? '#065f46' : '#92400e'}`, borderRadius: 12, padding: '12px 16px', color: genMsg.startsWith('✅') ? '#6ee7b7' : '#fcd34d', marginBottom: '1.5rem' }}>
          {genMsg}
        </div>
      )}

      {/* Day tabs */}
      <div style={styles.dayTabs}>
        {DAY_ORDER.map((day) => {
          const count = plans.filter((p) => p.day === day).length;
          return (
            <button key={day} onClick={() => setActiveDay(day)} style={{ ...styles.dayTab, ...(activeDay === day ? styles.dayTabActive : {}) }}>
              <span>{capitalize(day.slice(0, 3))}</span>
              {count > 0 && <span style={styles.dayBadge}>{count}</span>}
              {day === 'sunday' && count === 0 && <span style={styles.restBadge}>Rest</span>}
            </button>
          );
        })}
      </div>

      {/* Plans for selected day */}
      {plansForDay.length === 0 ? (
        <EmptyState
          icon={<Dumbbell size={64} />}
          title={`No workout planned for ${capitalize(activeDay)}. Add a plan or auto-generate your weekly schedule.`}
          action={<Button variant="secondary" onClick={() => setShowAddModal(true)}>+ Add Plan</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={styles.plansGrid}>
          {plansForDay.map((plan) => (
            <Card key={plan.id} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={styles.planHeader}>
                <div>
                  <h3 style={styles.planName}>{plan.name}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
                    ~{plan.total_calories} kcal · {plan.details?.length || 0} exercises
                  </div>
                </div>
                <button onClick={() => handleDelete(plan.id)} style={styles.deleteBtn}>🗑</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan.details?.map((d) => (
                  <div key={d.id} style={styles.exerciseRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Badge color={MUSCLE_COLORS[d.muscle_group] || 'gray'}>{capitalize(d.muscle_group)}</Badge>
                      <span style={{ color: 'var(--text-dark)', fontWeight: 500, fontSize: 14 }}>{d.exercise_name}</span>
                    </div>
                    <span style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {d.exercise_detail?.is_cardio ? `${d.exercise_detail?.duration_minutes || 30} min` : `${d.sets}×${d.reps}`}
                    </span>
                  </div>
                ))}
              </div>

              {plan.notes && <p style={{ color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic', margin: 0 }}>{plan.notes}</p>}
            </Card>
          ))}
          <Card style={styles.addExerciseCard}>
            <div style={styles.addExerciseIcon}><PlusCircle size={28} /></div>
            <h3 style={styles.planName}>Add Exercise</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '6px 0 14px' }}>
              Build out this training day with another focused movement.
            </p>
            <Button variant="secondary" onClick={() => setShowAddModal(true)}>+ Add Plan</Button>
          </Card>
        </div>
      )}

      {/* Exercise Library */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={styles.sectionTitle}>Exercise Library</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {exercises.slice(0, 12).map((ex) => (
            <div key={ex.id} style={styles.exCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <PlaceholderImage
                    alt={`${ex.name} placeholder`}
                    className="w-12 h-12 rounded bg-surface-alt"
                    dataSlot={`exercise-${ex.muscle_group || 'library'}`}
                    fallbackIcon={<Dumbbell size={20} />}
                  />
                  <div style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                </div>
                <Badge color={MUSCLE_COLORS[ex.muscle_group] || 'gray'}>{capitalize(ex.muscle_group)}</Badge>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>{ex.description}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Badge color={ex.difficulty === 'beginner' ? 'green' : ex.difficulty === 'intermediate' ? 'yellow' : 'red'}>{capitalize(ex.difficulty)}</Badge>
                {ex.equipment && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{ex.equipment}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Plan Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Workout Plan">
        <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Plan Name" placeholder="e.g. Push Day" value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })} required />
          <Select label="Day of the Week" value={newPlan.day} onChange={(e) => setNewPlan({ ...newPlan, day: e.target.value })}>
            {DAY_ORDER.map((d) => <option key={d} value={d}>{capitalize(d)}</option>)}
          </Select>
          <Input label="Notes (optional)" placeholder="Any specific notes…" value={newPlan.notes} onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })} />
          <Button type="submit">Create Plan</Button>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  page: { maxWidth: 1400, margin: '0 auto', padding: '0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 },
  title: { color: 'var(--text-dark)', fontSize: 46, fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: '0.04em', fontWeight: 400, margin: '0 0 4px' },
  sub: { color: 'var(--text-muted)', fontSize: 15, margin: 0 },
  dayTabs: { display: 'flex', gap: 8, marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: 4 },
  dayTab: { padding: '10px 16px', borderRadius: 999, border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', transition: 'all 0.15s' },
  dayTabActive: { background: 'var(--primary-light)', color: '#fff', border: '1px solid rgba(255,31,61,0.5)', boxShadow: 'var(--shadow-primary)' },
  dayBadge: { background: 'var(--primary)', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 11, fontWeight: 700 },
  restBadge: { background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', borderRadius: 10, padding: '1px 6px', fontSize: 11, fontWeight: 700 },
  plansGrid: {},
  addExerciseCard: { minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
  addExerciseIcon: { width: 52, height: 52, borderRadius: 16, background: 'var(--primary-light)', color: 'var(--primary)', display: 'grid', placeItems: 'center', marginBottom: 12 },
  planHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  planName: { color: 'var(--text-dark)', fontSize: 16, fontWeight: 700, margin: 0 },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.5, color: '#ef4444' },
  exerciseRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.055)', border: '1px solid var(--glass-border)', borderRadius: 14, padding: '10px 12px' },
  sectionTitle: { color: 'var(--text-dark)', fontSize: 18, fontWeight: 700, margin: '0 0 1rem' },
  exCard: { background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 18, padding: '14px 16px', boxShadow: 'var(--shadow-sm)', backdropFilter: 'blur(18px)' },
};
