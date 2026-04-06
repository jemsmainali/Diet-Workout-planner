"""
Core business logic for intelligent plan generation.
Generates workout and diet plans based on user's fitness goal.
"""
from workouts.models import Exercise, WorkoutPlan, WorkoutDetail
from diet.models import Food, DietPlan, DietDetail
import datetime


# ─── WORKOUT PLAN LOGIC ──────────────────────────────────────────────────────

WORKOUT_TEMPLATES = {
    'fat_loss': {
        'monday':    {'name': 'HIIT + Full Body', 'groups': ['cardio', 'full_body', 'abs']},
        'tuesday':   {'name': 'Upper Body Cardio', 'groups': ['chest', 'back', 'cardio']},
        'wednesday': {'name': 'Core & Cardio', 'groups': ['abs', 'cardio']},
        'thursday':  {'name': 'Lower Body HIIT', 'groups': ['legs', 'glutes', 'cardio']},
        'friday':    {'name': 'Full Body Circuit', 'groups': ['full_body', 'abs']},
        'saturday':  {'name': 'Active Recovery', 'groups': ['cardio']},
    },
    'muscle_gain': {
        'monday':    {'name': 'Push Day (Chest/Shoulders/Triceps)', 'groups': ['chest', 'shoulders', 'triceps']},
        'tuesday':   {'name': 'Pull Day (Back/Biceps)', 'groups': ['back', 'biceps']},
        'wednesday': {'name': 'Leg Day', 'groups': ['legs', 'glutes']},
        'thursday':  {'name': 'Push Day 2', 'groups': ['chest', 'shoulders', 'triceps']},
        'friday':    {'name': 'Pull Day 2', 'groups': ['back', 'biceps']},
        'saturday':  {'name': 'Leg Day 2 + Core', 'groups': ['legs', 'abs']},
    },
    'maintain': {
        'monday':    {'name': 'Upper Body', 'groups': ['chest', 'back', 'shoulders']},
        'tuesday':   {'name': 'Lower Body', 'groups': ['legs', 'glutes']},
        'wednesday': {'name': 'Cardio + Core', 'groups': ['cardio', 'abs']},
        'thursday':  {'name': 'Arms + Shoulders', 'groups': ['biceps', 'triceps', 'shoulders']},
        'friday':    {'name': 'Full Body', 'groups': ['full_body']},
        'saturday':  {'name': 'Cardio', 'groups': ['cardio']},
    }
}

SET_REP_CONFIG = {
    'fat_loss':    {'sets': 3, 'reps': 15, 'rest_seconds': 45},
    'muscle_gain': {'sets': 4, 'reps': 8,  'rest_seconds': 90},
    'maintain':    {'sets': 3, 'reps': 12, 'rest_seconds': 60},
}


def generate_workout_plan(user):
    """
    Generate a full weekly workout plan for a user based on their fitness goal.
    Deletes existing active plans and creates fresh ones.
    """
    goal = user.fitness_goal
    template = WORKOUT_TEMPLATES.get(goal, WORKOUT_TEMPLATES['maintain'])
    config = SET_REP_CONFIG.get(goal, SET_REP_CONFIG['maintain'])

    # Remove old auto-generated plans
    WorkoutPlan.objects.filter(user=user, is_active=True).update(is_active=False)

    created_plans = []
    for day, day_config in template.items():
        plan = WorkoutPlan.objects.create(
            user=user,
            name=day_config['name'],
            day=day,
            notes=f"Auto-generated plan for {goal.replace('_', ' ')} goal.",
        )

        exercises_added = set()
        for muscle_group in day_config['groups']:
            exercises = Exercise.objects.filter(muscle_group=muscle_group).exclude(id__in=exercises_added)[:2]
            for i, exercise in enumerate(exercises):
                WorkoutDetail.objects.create(
                    plan=plan,
                    exercise=exercise,
                    sets=config['sets'],
                    reps=config['reps'] if not exercise.is_cardio else 1,
                    rest_seconds=config['rest_seconds'],
                    order=len(exercises_added) + i,
                )
                exercises_added.add(exercise.id)

        created_plans.append(plan)
    return created_plans


# ─── DIET PLAN LOGIC ─────────────────────────────────────────────────────────

MEAL_TEMPLATES = {
    'fat_loss': {
        'breakfast': [('protein', 150), ('vegetable', 100), ('fruit', 80)],
        'lunch':     [('protein', 200), ('vegetable', 200), ('grain', 80)],
        'dinner':    [('protein', 200), ('vegetable', 200)],
        'snack':     [('fruit', 100), ('protein', 50)],
    },
    'muscle_gain': {
        'breakfast': [('grain', 150), ('protein', 200), ('dairy', 200), ('fruit', 100)],
        'lunch':     [('grain', 200), ('protein', 250), ('vegetable', 150), ('fat', 20)],
        'dinner':    [('protein', 250), ('grain', 150), ('vegetable', 150)],
        'snack':     [('protein', 100), ('dairy', 200), ('grain', 50)],
    },
    'maintain': {
        'breakfast': [('grain', 100), ('protein', 150), ('fruit', 100)],
        'lunch':     [('grain', 150), ('protein', 200), ('vegetable', 150)],
        'dinner':    [('protein', 180), ('vegetable', 200), ('grain', 100)],
        'snack':     [('fruit', 100)],
    },
}


def generate_diet_plan(user, date=None):
    """Generate a full day's meal plan based on user's fitness goal and calorie needs."""
    if date is None:
        date = datetime.date.today()

    goal = user.fitness_goal
    template = MEAL_TEMPLATES.get(goal, MEAL_TEMPLATES['maintain'])

    # Remove existing plans for this date
    DietPlan.objects.filter(user=user, date=date).delete()

    created_plans = []
    for meal_type, food_specs in template.items():
        plan = DietPlan.objects.create(
            user=user, date=date, meal_type=meal_type,
            name=f"{meal_type.title()} - {goal.replace('_', ' ').title()}",
        )
        for category, quantity_g in food_specs:
            food = Food.objects.filter(category=category).order_by('?').first()
            if food:
                DietDetail.objects.create(plan=plan, food=food, quantity_g=quantity_g)
        created_plans.append(plan)
    return created_plans
