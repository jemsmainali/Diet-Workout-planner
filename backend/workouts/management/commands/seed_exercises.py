from django.core.management.base import BaseCommand
from workouts.models import Exercise
from diet.models import Food

EXERCISES = [
    {'name': 'Bench Press', 'muscle_group': 'chest', 'difficulty': 'intermediate', 'equipment': 'Barbell, Bench', 'description': 'Classic compound chest exercise.', 'calories_per_rep': 0.8},
    {'name': 'Push-Up', 'muscle_group': 'chest', 'difficulty': 'beginner', 'equipment': 'None', 'description': 'Bodyweight chest exercise.', 'calories_per_rep': 0.5},
    {'name': 'Dumbbell Flyes', 'muscle_group': 'chest', 'difficulty': 'intermediate', 'equipment': 'Dumbbells', 'description': 'Isolation exercise for chest.', 'calories_per_rep': 0.6},
    {'name': 'Incline Bench Press', 'muscle_group': 'chest', 'difficulty': 'intermediate', 'equipment': 'Barbell', 'description': 'Targets upper chest.', 'calories_per_rep': 0.8},
    {'name': 'Deadlift', 'muscle_group': 'back', 'difficulty': 'advanced', 'equipment': 'Barbell', 'description': 'King of all exercises.', 'calories_per_rep': 1.2},
    {'name': 'Pull-Up', 'muscle_group': 'back', 'difficulty': 'intermediate', 'equipment': 'Pull-up bar', 'description': 'Upper back compound.', 'calories_per_rep': 0.7},
    {'name': 'Bent-Over Row', 'muscle_group': 'back', 'difficulty': 'intermediate', 'equipment': 'Barbell', 'description': 'Builds back thickness.', 'calories_per_rep': 0.8},
    {'name': 'Lat Pulldown', 'muscle_group': 'back', 'difficulty': 'beginner', 'equipment': 'Cable machine', 'description': 'Back width builder.', 'calories_per_rep': 0.6},
    {'name': 'Overhead Press', 'muscle_group': 'shoulders', 'difficulty': 'intermediate', 'equipment': 'Barbell', 'description': 'Compound shoulder press.', 'calories_per_rep': 0.7},
    {'name': 'Lateral Raises', 'muscle_group': 'shoulders', 'difficulty': 'beginner', 'equipment': 'Dumbbells', 'description': 'Lateral deltoid.', 'calories_per_rep': 0.4},
    {'name': 'Arnold Press', 'muscle_group': 'shoulders', 'difficulty': 'intermediate', 'equipment': 'Dumbbells', 'description': 'Full shoulder development.', 'calories_per_rep': 0.6},
    {'name': 'Barbell Curl', 'muscle_group': 'biceps', 'difficulty': 'beginner', 'equipment': 'Barbell', 'description': 'Classic bicep builder.', 'calories_per_rep': 0.4},
    {'name': 'Hammer Curl', 'muscle_group': 'biceps', 'difficulty': 'beginner', 'equipment': 'Dumbbells', 'description': 'Brachialis and biceps.', 'calories_per_rep': 0.4},
    {'name': 'Tricep Dips', 'muscle_group': 'triceps', 'difficulty': 'beginner', 'equipment': 'Parallel bars', 'description': 'Compound tricep movement.', 'calories_per_rep': 0.6},
    {'name': 'Skull Crushers', 'muscle_group': 'triceps', 'difficulty': 'intermediate', 'equipment': 'EZ Bar', 'description': 'Lying tricep extension.', 'calories_per_rep': 0.5},
    {'name': 'Tricep Pushdown', 'muscle_group': 'triceps', 'difficulty': 'beginner', 'equipment': 'Cable machine', 'description': 'Cable tricep isolation.', 'calories_per_rep': 0.4},
    {'name': 'Squat', 'muscle_group': 'legs', 'difficulty': 'intermediate', 'equipment': 'Barbell', 'description': 'King of leg exercises.', 'calories_per_rep': 1.0},
    {'name': 'Leg Press', 'muscle_group': 'legs', 'difficulty': 'beginner', 'equipment': 'Leg press machine', 'description': 'Machine quad press.', 'calories_per_rep': 0.8},
    {'name': 'Lunges', 'muscle_group': 'legs', 'difficulty': 'beginner', 'equipment': 'Dumbbells', 'description': 'Unilateral leg exercise.', 'calories_per_rep': 0.6},
    {'name': 'Romanian Deadlift', 'muscle_group': 'legs', 'difficulty': 'intermediate', 'equipment': 'Barbell', 'description': 'Hamstring-focused.', 'calories_per_rep': 0.9},
    {'name': 'Hip Thrust', 'muscle_group': 'glutes', 'difficulty': 'beginner', 'equipment': 'Barbell, Bench', 'description': 'Best glute exercise.', 'calories_per_rep': 0.7},
    {'name': 'Glute Bridge', 'muscle_group': 'glutes', 'difficulty': 'beginner', 'equipment': 'None', 'description': 'Bodyweight glute activation.', 'calories_per_rep': 0.4},
    {'name': 'Plank', 'muscle_group': 'abs', 'difficulty': 'beginner', 'equipment': 'None', 'description': 'Core stability.', 'calories_per_rep': 0.3},
    {'name': 'Crunches', 'muscle_group': 'abs', 'difficulty': 'beginner', 'equipment': 'None', 'description': 'Classic ab exercise.', 'calories_per_rep': 0.3},
    {'name': 'Leg Raises', 'muscle_group': 'abs', 'difficulty': 'intermediate', 'equipment': 'None', 'description': 'Lower ab focused.', 'calories_per_rep': 0.4},
    {'name': 'Russian Twist', 'muscle_group': 'abs', 'difficulty': 'beginner', 'equipment': 'Weight plate', 'description': 'Rotational core.', 'calories_per_rep': 0.4},
    {'name': 'Treadmill Run', 'muscle_group': 'cardio', 'difficulty': 'beginner', 'equipment': 'Treadmill', 'description': 'Steady-state cardio.', 'is_cardio': True, 'duration_minutes': 30, 'calories_per_rep': 0},
    {'name': 'Jump Rope', 'muscle_group': 'cardio', 'difficulty': 'beginner', 'equipment': 'Jump rope', 'description': 'High-intensity cardio.', 'is_cardio': True, 'duration_minutes': 15, 'calories_per_rep': 0},
    {'name': 'Burpees', 'muscle_group': 'cardio', 'difficulty': 'intermediate', 'equipment': 'None', 'description': 'Full body HIIT.', 'calories_per_rep': 1.0},
    {'name': 'Mountain Climbers', 'muscle_group': 'cardio', 'difficulty': 'beginner', 'equipment': 'None', 'description': 'Core and cardio.', 'calories_per_rep': 0.5},
    {'name': 'Kettlebell Swing', 'muscle_group': 'full_body', 'difficulty': 'intermediate', 'equipment': 'Kettlebell', 'description': 'Full body power.', 'calories_per_rep': 0.8},
    {'name': 'Thrusters', 'muscle_group': 'full_body', 'difficulty': 'intermediate', 'equipment': 'Barbell', 'description': 'Squat to press.', 'calories_per_rep': 1.0},
]

FOODS = [
    {'name': 'Chicken Breast', 'category': 'protein', 'calories': 165, 'protein': 31, 'carbs': 0, 'fats': 3.6, 'fiber': 0},
    {'name': 'Salmon', 'category': 'protein', 'calories': 208, 'protein': 20, 'carbs': 0, 'fats': 13, 'fiber': 0},
    {'name': 'Eggs', 'category': 'protein', 'calories': 155, 'protein': 13, 'carbs': 1.1, 'fats': 11, 'fiber': 0},
    {'name': 'Tuna (canned)', 'category': 'protein', 'calories': 132, 'protein': 29, 'carbs': 0, 'fats': 1, 'fiber': 0},
    {'name': 'Turkey Breast', 'category': 'protein', 'calories': 135, 'protein': 30, 'carbs': 0, 'fats': 1, 'fiber': 0},
    {'name': 'Whey Protein', 'category': 'protein', 'calories': 370, 'protein': 80, 'carbs': 8, 'fats': 5, 'fiber': 0},
    {'name': 'Tofu', 'category': 'protein', 'calories': 76, 'protein': 8, 'carbs': 2, 'fats': 4.8, 'fiber': 0.3, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Lentils', 'category': 'protein', 'calories': 116, 'protein': 9, 'carbs': 20, 'fats': 0.4, 'fiber': 7.9, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Brown Rice', 'category': 'grain', 'calories': 112, 'protein': 2.3, 'carbs': 23, 'fats': 0.9, 'fiber': 1.8, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Oatmeal', 'category': 'grain', 'calories': 71, 'protein': 2.5, 'carbs': 12, 'fats': 1.4, 'fiber': 1.7, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Sweet Potato', 'category': 'carbs', 'calories': 86, 'protein': 1.6, 'carbs': 20, 'fats': 0.1, 'fiber': 3, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Whole Wheat Bread', 'category': 'grain', 'calories': 247, 'protein': 13, 'carbs': 41, 'fats': 4.2, 'fiber': 7, 'is_vegetarian': True},
    {'name': 'Quinoa', 'category': 'grain', 'calories': 120, 'protein': 4.4, 'carbs': 21, 'fats': 1.9, 'fiber': 2.8, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Broccoli', 'category': 'vegetable', 'calories': 35, 'protein': 2.8, 'carbs': 7, 'fats': 0.4, 'fiber': 2.6, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Spinach', 'category': 'vegetable', 'calories': 23, 'protein': 2.9, 'carbs': 3.6, 'fats': 0.4, 'fiber': 2.2, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Mixed Salad', 'category': 'vegetable', 'calories': 15, 'protein': 1.5, 'carbs': 2.9, 'fats': 0.2, 'fiber': 1.8, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Bell Peppers', 'category': 'vegetable', 'calories': 31, 'protein': 1, 'carbs': 7, 'fats': 0.3, 'fiber': 2.1, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Banana', 'category': 'fruit', 'calories': 89, 'protein': 1.1, 'carbs': 23, 'fats': 0.3, 'fiber': 2.6, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Apple', 'category': 'fruit', 'calories': 52, 'protein': 0.3, 'carbs': 14, 'fats': 0.2, 'fiber': 2.4, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Blueberries', 'category': 'fruit', 'calories': 57, 'protein': 0.7, 'carbs': 14, 'fats': 0.3, 'fiber': 2.4, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Orange', 'category': 'fruit', 'calories': 47, 'protein': 0.9, 'carbs': 12, 'fats': 0.1, 'fiber': 2.4, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Greek Yogurt', 'category': 'dairy', 'calories': 97, 'protein': 9, 'carbs': 3.6, 'fats': 5, 'fiber': 0, 'is_vegetarian': True},
    {'name': 'Cottage Cheese', 'category': 'dairy', 'calories': 98, 'protein': 11, 'carbs': 3.4, 'fats': 4.5, 'fiber': 0, 'is_vegetarian': True},
    {'name': 'Milk (whole)', 'category': 'dairy', 'calories': 61, 'protein': 3.2, 'carbs': 4.8, 'fats': 3.3, 'fiber': 0, 'is_vegetarian': True},
    {'name': 'Avocado', 'category': 'fat', 'calories': 160, 'protein': 2, 'carbs': 9, 'fats': 15, 'fiber': 7, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Almonds', 'category': 'fat', 'calories': 579, 'protein': 21, 'carbs': 22, 'fats': 50, 'fiber': 12.5, 'is_vegetarian': True, 'is_vegan': True},
    {'name': 'Olive Oil', 'category': 'fat', 'calories': 884, 'protein': 0, 'carbs': 0, 'fats': 100, 'fiber': 0, 'is_vegetarian': True, 'is_vegan': True},
]


class Command(BaseCommand):
    help = 'Seed exercise and food database'

    def handle(self, *args, **kwargs):
        ex_created = sum(1 for d in EXERCISES if not Exercise.objects.get_or_create(name=d['name'], defaults=d)[0].pk or Exercise.objects.get_or_create(name=d['name'], defaults=d)[1])
        food_created = 0
        for data in FOODS:
            _, created = Food.objects.get_or_create(name=data['name'], defaults=data)
            if created:
                food_created += 1
        self.stdout.write(self.style.SUCCESS(f'Seeded exercises and {food_created} foods!'))
