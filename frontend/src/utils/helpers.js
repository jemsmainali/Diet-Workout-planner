export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getBMIColor = (bmi) => {
  if (!bmi) return '#6b7280';
  if (bmi < 18.5) return '#3b82f6';
  if (bmi < 25) return '#10b981';
  if (bmi < 30) return '#f59e0b';
  return '#ef4444';
};

export const getGoalColor = (goal) => {
  const colors = { fat_loss: '#ef4444', muscle_gain: '#3b82f6', maintain: '#10b981' };
  return colors[goal] || '#6b7280';
};

export const getGoalLabel = (goal) => {
  const labels = { fat_loss: 'Fat Loss', muscle_gain: 'Muscle Gain', maintain: 'Maintain' };
  return labels[goal] || goal;
};

export const getMacroPercentages = (protein, carbs, fats) => {
  const pCal = protein * 4;
  const cCal = carbs * 4;
  const fCal = fats * 9;
  const total = pCal + cCal + fCal || 1;
  return {
    protein: Math.round((pCal / total) * 100),
    carbs: Math.round((cCal / total) * 100),
    fats: Math.round((fCal / total) * 100),
  };
};

export const getWeekDays = () => ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export const getDayLabel = (day) => capitalize(day);
