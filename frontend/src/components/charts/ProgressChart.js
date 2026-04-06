import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, Legend,
} from 'recharts';
import { formatDate } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 6px' }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color, margin: '2px 0', fontSize: 14, fontWeight: 600 }}>
          {entry.name}: {entry.value}{entry.dataKey === 'weight' ? ' kg' : entry.dataKey === 'body_fat' ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

export function WeightChart({ data }) {
  const chartData = data.map((d) => ({ ...d, date: formatDate(d.date) }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="weight" name="Weight" stroke="#38bdf8" strokeWidth={2.5} fill="url(#weightGrad)" dot={{ fill: '#38bdf8', r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BodyFatChart({ data }) {
  const filtered = data.filter((d) => d.body_fat);
  const chartData = filtered.map((d) => ({ ...d, date: formatDate(d.date) }));
  if (!chartData.length) return <div style={{ color: '#64748b', textAlign: 'center', padding: '3rem' }}>No body fat data logged yet.</div>;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} unit="%" />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="body_fat" name="Body Fat" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CalorieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="calories" name="Calories" stroke="#6366f1" strokeWidth={2} fill="url(#calGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MacroDonut({ protein, carbs, fats }) {
  const total = protein * 4 + carbs * 4 + fats * 9 || 1;
  const pPct = Math.round((protein * 4 / total) * 100);
  const cPct = Math.round((carbs * 4 / total) * 100);
  const fPct = 100 - pPct - cPct;
  const macros = [
    { label: 'Protein', value: protein, pct: pPct, color: '#38bdf8', cals: protein * 4 },
    { label: 'Carbs', value: carbs, pct: cPct, color: '#6366f1', cals: carbs * 4 },
    { label: 'Fats', value: fats, pct: fPct, color: '#f59e0b', cals: fats * 9 },
  ];
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {macros.map(({ label, value, pct, color, cals }) => (
        <div key={label} style={{ flex: 1, minWidth: 90, background: 'var(--primary-light)', border: '1px solid var(--primary)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}g</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
          <div style={{ fontSize: 11, color, marginTop: 4 }}>{pct}% · {cals} kcal</div>
          <div style={{ marginTop: 8, height: 4, background: '#fff', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
