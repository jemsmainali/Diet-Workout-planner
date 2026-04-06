import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI, workoutAPI, dietAPI, plansAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { WeightChart } from '../components/charts/ProgressChart';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [todaySummary, setTodaySummary] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <LoadingSpinner text="Loading your dashboard…" />
    </div>
  );

  return (
    <div>
      {/* Hero Header */}
      <div className="flex-row-between items-center" style={{ marginBottom: 32 }}>
        <div>
          <div className="text-muted" style={{ marginBottom: 4 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <h1 className="heading-xl">Have a nice day, {user?.username}!</h1>
        </div>
      </div>

      <div style={styles.gridContainer}>
        {/* LEFT COLUMN */}
        <div className="flex-col gap-4">
          
          {/* Activity Cards */}
          <section>
            <h2 className="heading-lg" style={{ marginBottom: 16 }}>Activity Summary</h2>
            <div style={styles.activityGrid}>
               <ActivityCard title="Workouts" color="var(--color-purple)" lightBg="var(--color-purple-light)" value={workoutCount} />
               <ActivityCard title="Calories" color="var(--color-mint)" lightBg="var(--color-mint-light)" value={todaySummary?.daily_total?.calories || 0} unit="kcal" />
               <ActivityCard title="Weight" color="var(--primary)" lightBg="var(--primary-light)" value={report?.current_weight || user?.weight || '--'} unit="kg" />
            </div>
          </section>

          {/* Today's Workouts List */}
          <section style={{ marginTop: 24 }}>
            <h2 className="heading-lg" style={{ marginBottom: 16 }}>Today's Plan</h2>
            <div className="card">
              <div className="flex-col gap-3">
                <WorkoutRow title="Full Body Stretching" type="Yoga" time="45 mins" instructor="Zaina Riddle" imgSrc="/images/3d_yoga.png" />
                <WorkoutRow title="High Intensity Interval" type="CrossFit" time="30 mins" instructor="Lilian Hanson" imgSrc="/images/3d_dumbbell.png" />
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-col gap-4">

          {/* Statistics Chart */}
          {report?.data_points?.length > 1 && (
             <section className="card">
                <div className="flex-row-between" style={{ marginBottom: 16 }}>
                  <h2 className="heading-lg">Progress</h2>
                  <div className="pill mint">Weekly</div>
                </div>
                <div style={{ height: 250 }}>
                   <WeightChart data={report.data_points} />
                </div>
             </section>
          )}

          {/* Calorie Stats */}
          {todaySummary && (
            <section className="card">
               <h2 className="heading-lg" style={{ marginBottom: 16 }}>Daily Intensity</h2>
               <div className="flex-row-between items-center bg-gray-50 rounded-lg" style={{ padding: '16px', background: '#f8fafc', borderRadius: 16 }}>
                  <div>
                    <div className="text-xs text-muted">Consumed Today</div>
                    <div className="heading-xl" style={{ color: 'var(--primary)' }}>
                      {todaySummary.daily_total?.calories || 0} <span className="text-muted heading-sm">kcal</span>
                    </div>
                  </div>
                  <div>
                     <button className="btn-primary" onClick={() => navigate('/diet')}>View Diet</button>
                  </div>
               </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

// Subcomponents for the dashboard
function ActivityCard({ title, value, unit, color, lightBg }) {
  return (
    <div className="card flex-col items-center justify-center gap-2" style={{ marginBottom: 0, padding: 24, paddingBottom: 32 }}>
       <div className="pill" style={{ background: color, color: 'white', marginBottom: 16 }}>{title}</div>
       <div style={{ width: 80, height: 80, borderRadius: '50%', border: `8px solid ${lightBg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -8, left: -8, right: -8, bottom: -8, borderRadius: '50%', border: `8px solid ${color}`, borderTopColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)' }}></div>
          <div className="flex-col items-center">
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1 }}>{value}</span>
            {unit && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{unit}</span>}
          </div>
       </div>
    </div>
  );
}

function WorkoutRow({ title, type, time, instructor, imgSrc }) {
  return (
    <div className="flex-row-between items-center" style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
         <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
           <img src={imgSrc} alt={title} className="animated-3d" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         </div>
         <div>
            <div className="heading-md">{title}</div>
            <div className="text-muted text-xs">Instructor: {instructor}</div>
         </div>
      </div>
      <div className="flex-col gap-1 items-end">
         <span className="pill primary">{type}</span>
         <span className="text-xs text-muted">⏱ {time}</span>
      </div>
    </div>
  );
}

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
    gap: 32,
    '@media(max-width: 1024px)': {
       gridTemplateColumns: '1fr',
    }
  },
  activityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  }
};
