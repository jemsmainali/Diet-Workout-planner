import React, { useState, useEffect, useCallback } from 'react';
import { dietAPI, plansAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input, { Select } from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { MacroDonut } from '../components/charts/ProgressChart';
import { formatDate } from '../utils/helpers';
import { SunIcon, MoonIcon, FireIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/solid';

const MEAL_COLORS = { breakfast: 'yellow', lunch: 'blue', dinner: 'purple', snack: 'green' };
const MEAL_ICONS = { 
  breakfast: <SunIcon style={{ width: 24, height: 24, color: '#f59e0b' }} />, 
  lunch: <FireIcon style={{ width: 24, height: 24, color: '#ef4444' }} />, 
  dinner: <MoonIcon style={{ width: 24, height: 24, color: '#6366f1' }} />, 
  snack: <HeartIcon style={{ width: 24, height: 24, color: '#10b981' }} /> 
};

export default function DietPage() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [summary, setSummary] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const [newMeal, setNewMeal] = useState({ date: today, meal_type: 'lunch', name: '', details: [] });
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, foodRes] = await Promise.all([
        dietAPI.getDailySummary(selectedDate),
        dietAPI.getFoods({ search: foodSearch }),
      ]);
      setSummary(sumRes.data);
      setFoods(foodRes.data.results || []);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, foodSearch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenMsg('');
    try {
      const res = await plansAPI.generateDiet(selectedDate);
      setGenMsg(`✅ ${res.data.message}`);
      await fetchData();
    } catch (e) {
      setGenMsg('⚠️ ' + (e.response?.data?.error || 'Generation failed.'));
    } finally {
      setGenerating(false);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!newMeal.name) return;
    try {
      const payload = {
        ...newMeal,
        date: selectedDate,
        details: selectedFood ? [{ food: selectedFood.id, quantity_g: quantity }] : [],
      };
      await dietAPI.addPlan(payload);
      setShowAddModal(false);
      setSelectedFood(null);
      setQuantity(100);
      setNewMeal({ date: selectedDate, meal_type: 'lunch', name: '', details: [] });
      await fetchData();
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert(`Error logging meal: ${msg}`);
    }
  };

  const handleDeleteMeal = async (id) => {
    if (!window.confirm('Remove this meal?')) return;
    await dietAPI.deletePlan(id);
    await fetchData();
  };

  const totals = summary?.daily_total || {};
  const goal = user?.daily_calories;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Diet Tracker</h1>
          <p style={styles.sub}>Log meals and track your nutrition</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
            style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, padding: '8px 14px', color: 'var(--text-dark)', fontSize: 14 }} />
          <Button variant="secondary" onClick={() => setShowAddModal(true)}>+ Add Meal</Button>
          <Button onClick={handleGenerate} loading={generating}><SparklesIcon style={{ width: 18, height: 18, marginRight: 4 }} /> Auto-Plan</Button>
        </div>
      </div>

      {genMsg && (
        <div style={{ background: genMsg.startsWith('✅') ? '#064e3b' : '#78350f', border: `1px solid ${genMsg.startsWith('✅') ? '#065f46' : '#92400e'}`, borderRadius: 12, padding: '12px 16px', color: genMsg.startsWith('✅') ? '#6ee7b7' : '#fcd34d', marginBottom: '1.5rem' }}>
          {genMsg}
        </div>
      )}

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Daily summary card */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <div style={styles.summaryTop}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 4 }}>Calories — {formatDate(selectedDate)}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ color: 'var(--primary)', fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{totals.calories || 0}</span>
                  {goal && <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>/ {goal} kcal</span>}
                </div>
                {goal && (
                  <div style={{ marginTop: 8 }}>
                    <div style={styles.calBar}>
                      <div style={{ ...styles.calFill, width: `${Math.min(100, ((totals.calories || 0) / goal) * 100)}%`, background: (totals.calories || 0) > goal ? '#ef4444' : '#38bdf8' }} />
                    </div>
                    <div style={{ color: (summary?.remaining || 0) >= 0 ? '#10b981' : '#ef4444', fontSize: 13, marginTop: 4 }}>
                      {(summary?.remaining || 0) >= 0 ? `${summary?.remaining} kcal remaining` : `${Math.abs(summary?.remaining)} kcal over target`}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ minWidth: 260 }}>
                <MacroDonut protein={totals.protein || 0} carbs={totals.carbs || 0} fats={totals.fats || 0} />
              </div>
            </div>
          </Card>

          {/* Meals list */}
          {!summary?.meals?.length ? (
            <div style={styles.empty}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <HeartIcon style={{ width: 64, height: 64, color: 'var(--primary-light)' }} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 16, marginTop: 12 }}>No meals logged for this day.</p>
              <Button onClick={() => setShowAddModal(true)} style={{ marginTop: 16 }}>+ Add Your First Meal</Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                const mealsOfType = summary.meals.filter((m) => m.meal_type === mealType);
                if (!mealsOfType.length) return null;
                return (
                  <div key={mealType}>
                    <div style={styles.mealTypeHeader}>
                      <div>{MEAL_ICONS[mealType]}</div>
                      <h3 style={styles.mealTypeTitle}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                      <Badge color={MEAL_COLORS[mealType]}>
                        {mealsOfType.reduce((s, m) => s + (m.nutrients?.calories || 0), 0)} kcal
                      </Badge>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
                      {mealsOfType.map((meal) => (
                        <MealCard key={meal.id} meal={meal} onDelete={handleDeleteMeal} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add Meal Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Log a Meal" width={580}>
        <form onSubmit={handleAddMeal} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Meal Name" placeholder="e.g. Chicken & Rice" value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} required />
            <Select label="Meal Type" value={newMeal.meal_type} onChange={(e) => setNewMeal({ ...newMeal, meal_type: e.target.value })}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </Select>
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Search Food</label>
            <input placeholder="e.g. chicken, rice, apple…" value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 14px', color: 'var(--text-dark)', fontSize: 14, width: '100%', boxSizing: 'border-box' }} />
            {foods.length > 0 && (
              <div style={styles.foodDropdown}>
                {foods.slice(0, 8).map((food) => (
                  <div key={food.id} onClick={() => { setSelectedFood(food); setFoodSearch(food.name); }}
                    style={{ ...styles.foodItem, background: selectedFood?.id === food.id ? 'var(--primary-light)' : 'transparent' }}>
                    <span style={{ color: 'var(--text-dark)', fontSize: 14 }}>{food.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{food.calories} kcal/100g · P:{food.protein}g C:{food.carbs}g F:{food.fats}g</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedFood && (
            <div style={styles.selectedFood}>
              <div style={{ color: '#38bdf8', fontWeight: 600, marginBottom: 6 }}>✓ {selectedFood.name}</div>
              <Input label="Quantity (grams)" type="number" min={1} max={2000} value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))} />
              <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
                ≈ {Math.round(selectedFood.calories * quantity / 100)} kcal ·
                P: {(selectedFood.protein * quantity / 100).toFixed(1)}g ·
                C: {(selectedFood.carbs * quantity / 100).toFixed(1)}g ·
                F: {(selectedFood.fats * quantity / 100).toFixed(1)}g
              </div>
            </div>
          )}

          <Button type="submit">Log Meal</Button>
        </form>
      </Modal>
    </div>
  );
}

export function MealCard({ meal, onDelete }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '14px 16px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: 15 }}>{meal.name}</span>
        <button onClick={() => onDelete(meal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}>✕</button>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { label: 'Cal', value: meal.nutrients?.calories, unit: '' },
          { label: 'Protein', value: meal.nutrients?.protein, unit: 'g' },
          { label: 'Carbs', value: meal.nutrients?.carbs, unit: 'g' },
          { label: 'Fats', value: meal.nutrients?.fats, unit: 'g' },
        ].map(({ label, value, unit }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ color: '#38bdf8', fontSize: 16, fontWeight: 700 }}>{value || 0}{unit}</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 },
  title: { color: 'var(--text-dark)', fontSize: 26, fontWeight: 800, margin: '0 0 4px' },
  sub: { color: 'var(--text-muted)', fontSize: 15, margin: 0 },
  summaryTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 },
  calBar: { height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginTop: 6 },
  calFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
  empty: { textAlign: 'center', padding: '4rem 2rem' },
  mealTypeHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  mealTypeTitle: { color: 'var(--text-dark)', fontSize: 16, fontWeight: 700, margin: 0, flex: 1 },
  foodDropdown: { marginTop: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', maxHeight: 220, overflowY: 'auto' },
  foodItem: { padding: '10px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2, borderBottom: '1px solid #f8fafc' },
  selectedFood: { background: 'var(--primary-light)', border: '1px solid var(--primary)', borderRadius: 12, padding: '14px' },
};
