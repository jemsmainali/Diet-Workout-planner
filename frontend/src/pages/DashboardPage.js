import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ArrowRight, Beef, Dumbbell, Flame, HeartPulse, Trophy, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { progressAPI, workoutAPI, dietAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ComingSoonModal from '../components/ui/ComingSoonModal';
import { WeightChart } from '../components/charts/ProgressChart';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [todaySummary, setTodaySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const athleteX = useTransform(mouseX, [0, 1], [-22, 22]);
  const athleteY = useTransform(mouseY, [0, 1], [-16, 16]);

  useEffect(() => {
    if (!localStorage.getItem('seen-powerlifting-announcement')) {
      setShowComingSoonModal(true);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rep, wo, diet] = await Promise.allSettled([
          progressAPI.weeklyReport(),
          workoutAPI.getPlans(),
          dietAPI.getDailySummary(new Date().toISOString().split('T')[0]),
        ]);
        if (rep.status === 'fulfilled') setReport(rep.value.data);
        if (wo.status === 'fulfilled') setWorkoutCount(wo.value.data.count || 0);
        if (diet.status === 'fulfilled') setTodaySummary(diet.value.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleCloseComingSoonModal = () => {
    localStorage.setItem('seen-powerlifting-announcement', 'true');
    setShowComingSoonModal(false);
  };

  const comingSoonModal = showComingSoonModal ? (
    <ComingSoonModal onClose={handleCloseComingSoonModal} />
  ) : null;

  const totals = todaySummary?.daily_total || {};
  const stats = useMemo(() => ([
    { title: 'Training Blocks', value: workoutCount, unit: '', icon: Dumbbell, color: '#ff1f3d', progress: Math.min(92, workoutCount * 14 || 36) },
    { title: 'Fuel Burn', value: Math.round(totals.calories || 0), unit: 'kcal', icon: Flame, color: '#fb923c', progress: Math.min(100, ((totals.calories || 0) / (user?.daily_calories || 2200)) * 100) },
    { title: 'Body Weight', value: report?.current_weight || user?.weight || 0, unit: 'kg', icon: HeartPulse, color: '#22c55e', progress: 68 },
  ]), [report?.current_weight, totals.calories, user?.daily_calories, user?.weight, workoutCount]);

  if (loading) {
    return (
      <>
        {comingSoonModal}
        <div style={{ display: 'grid', placeItems: 'center', height: '70vh' }}>
          <LoadingSpinner text="Loading your command center..." />
        </div>
      </>
    );
  }

  return (
    <div className="premium-dashboard min-h-screen">
      {comingSoonModal}
      <motion.section
        className="dashboard-hero reveal-on-scroll"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          mouseX.set((event.clientX - rect.left) / rect.width);
          mouseY.set((event.clientY - rect.top) / rect.height);
        }}
      >
        <div className="athlete-orb" style={{ width: 250, height: 250, background: 'rgba(255,31,61,0.38)', right: '12%', top: '8%' }} />
        <div className="hero-copy">
          <p className="page-kicker">Workout Wild & Free inspired</p>
          <h1 className="font-display neon-text">Forge your strongest week, {user?.username || 'Athlete'}.</h1>
          <p>
            Premium training, nutrition, and progress intelligence in one dark-mode fitness OS built for relentless consistency.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/workouts')}>
              Start training <ArrowRight size={18} />
            </button>
            <button className="btn-outline" onClick={() => navigate('/diet')}>Tune nutrition</button>
          </div>
        </div>

        <motion.div className="athlete-stage" style={{ x: athleteX, y: athleteY }}>
          <div className="athlete-card premium-panel">
            <img src="/images/3d_dumbbell.png" alt="Premium dumbbell" />
            <div>
              <span>Readiness</span>
              <strong>94%</strong>
            </div>
          </div>
          <div className="athlete-silhouette">
            <span className="font-display">WILD</span>
          </div>
          <div className="floating-metric premium-panel">
            <Trophy size={18} />
            <span>{report?.entries_count || 0} check-ins</span>
          </div>
        </motion.div>
      </motion.section>

      <section className="stat-tilt-grid reveal-on-scroll">
        {stats.map((stat, index) => (
          <Tilt key={stat.title} glareEnable glareMaxOpacity={0.18} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02}>
            <motion.div className="premium-stat-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <div className="stat-icon" style={{ color: stat.color }}><stat.icon size={24} /></div>
              <div>
                <span>{stat.title}</span>
                <strong><AnimatedNumber value={stat.value} /> {stat.unit}</strong>
              </div>
              <ProgressRing value={stat.progress} color={stat.color} />
            </motion.div>
          </Tilt>
        ))}
      </section>

      <section className="dashboard-grid reveal-on-scroll">
        <div className="premium-panel dashboard-card-xl">
          <div className="section-heading">
            <div>
              <p className="page-kicker">Performance graph</p>
              <h2 className="heading-lg">Transformation Velocity</h2>
            </div>
            <span className="live-pill"><Zap size={14} /> Live</span>
          </div>
          {report?.data_points?.length > 1 ? <WeightChart data={report.data_points} /> : <EmptyState text="Log progress twice to unlock trend charts." />}
        </div>

        <div className="premium-panel daily-card">
          <p className="page-kicker">Daily intensity</p>
          <h2 className="heading-lg">{Math.round(totals.calories || 0)} kcal</h2>
          <p className="text-muted">Consumed today against your target.</p>
          <div className="macro-stack">
            <MacroBar label="Protein" value={totals.protein || 0} max={180} icon={Beef} />
            <MacroBar label="Carbs" value={totals.carbs || 0} max={260} icon={Zap} />
            <MacroBar label="Fats" value={totals.fats || 0} max={90} icon={Flame} />
          </div>
          <button className="btn-primary" onClick={() => navigate('/diet')}>View Diet</button>
        </div>
      </section>

      <section className="premium-panel workout-strip reveal-on-scroll">
        <div className="section-heading">
          <div>
            <p className="page-kicker">Today’s plan</p>
            <h2 className="heading-lg">Move Like You Mean It</h2>
          </div>
          <button className="btn-outline" onClick={() => navigate('/workouts')}>Open Workouts</button>
        </div>
        <div className="workout-row-grid">
          <WorkoutRow title="Full Body Stretching" type="Mobility" time="45 mins" imgSrc="/images/3d_yoga.png" />
          <WorkoutRow title="High Intensity Interval" type="CrossFit" time="30 mins" imgSrc="/images/3d_dumbbell.png" />
        </div>
      </section>
    </div>
  );
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const numeric = Number(value) || 0;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / 900);
      setDisplay(Math.round(numeric * progress * 10) / 10);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display}</>;
}

function ProgressRing({ value, color }) {
  const safeValue = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="progress-ring" style={{ background: `conic-gradient(${color} ${safeValue * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}>
      <span>{Math.round(safeValue)}%</span>
    </div>
  );
}

function MacroBar({ label, value, max, icon: Icon }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="macro-bar">
      <div><Icon size={16} /><span>{label}</span><strong>{Math.round(value)}g</strong></div>
      <i><b style={{ width: `${pct}%` }} /></i>
    </div>
  );
}

function WorkoutRow({ title, type, time, imgSrc }) {
  return (
    <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.01}>
      <div className="premium-workout-row">
        <img src={imgSrc} alt={title} />
        <div>
          <strong>{title}</strong>
          <span>{type} • {time}</span>
        </div>
        <ArrowRight size={18} />
      </div>
    </Tilt>
  );
}

function EmptyState({ text }) {
  return <div className="empty-premium">{text}</div>;
}
