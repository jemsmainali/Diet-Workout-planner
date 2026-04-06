"""
Diet models: Food database, DietPlan, and DietDetail.
"""
from django.db import models
from django.conf import settings


class Food(models.Model):
    """Nutritional food database."""
    CATEGORIES = [
        ('protein', 'Protein'), ('carbs', 'Carbohydrates'), ('fat', 'Healthy Fats'),
        ('vegetable', 'Vegetables'), ('fruit', 'Fruits'), ('dairy', 'Dairy'),
        ('grain', 'Grains'), ('snack', 'Snacks'), ('beverage', 'Beverages'),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORIES, default='protein')
    calories = models.FloatField(help_text="Calories per 100g")
    protein = models.FloatField(help_text="Protein grams per 100g")
    carbs = models.FloatField(help_text="Carbohydrate grams per 100g")
    fats = models.FloatField(help_text="Fat grams per 100g")
    fiber = models.FloatField(default=0, help_text="Fiber grams per 100g")
    sugar = models.FloatField(default=0)
    sodium = models.FloatField(default=0, help_text="Sodium mg per 100g")
    serving_size = models.FloatField(default=100, help_text="Typical serving in grams")
    serving_unit = models.CharField(max_length=50, default='g')
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'name']
        indexes = [models.Index(fields=['category']), models.Index(fields=['name'])]

    def __str__(self):
        return f"{self.name} ({self.calories} kcal/100g)"

    def get_nutrients_for_quantity(self, quantity_g):
        """Return scaled nutrients for a given quantity in grams."""
        factor = quantity_g / 100
        return {
            'calories': round(self.calories * factor, 1),
            'protein': round(self.protein * factor, 1),
            'carbs': round(self.carbs * factor, 1),
            'fats': round(self.fats * factor, 1),
            'fiber': round(self.fiber * factor, 1),
        }


class DietPlan(models.Model):
    """A user's daily diet plan."""
    MEAL_TYPES = [
        ('breakfast', 'Breakfast'), ('lunch', 'Lunch'),
        ('dinner', 'Dinner'), ('snack', 'Snack'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diet_plans')
    date = models.DateField()
    meal_type = models.CharField(max_length=15, choices=MEAL_TYPES, default='lunch')
    name = models.CharField(max_length=200, default='My Meal')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', 'meal_type']
        indexes = [models.Index(fields=['user', 'date'])]

    def __str__(self):
        return f"{self.user.username} - {self.date} {self.get_meal_type_display()}"

    def total_nutrients(self):
        """Aggregate nutritional totals across all food items."""
        totals = {'calories': 0, 'protein': 0, 'carbs': 0, 'fats': 0, 'fiber': 0}
        for detail in self.details.all():
            nutrients = detail.food.get_nutrients_for_quantity(detail.quantity_g)
            for key in totals:
                totals[key] += nutrients.get(key, 0)
        return {k: round(v, 1) for k, v in totals.items()}


class DietDetail(models.Model):
    """Individual food entry within a diet plan."""
    plan = models.ForeignKey(DietPlan, on_delete=models.CASCADE, related_name='details')
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity_g = models.FloatField(default=100, help_text="Quantity in grams")
    notes = models.CharField(max_length=200, blank=True, default='')

    class Meta:
        indexes = [models.Index(fields=['plan'])]

    def __str__(self):
        return f"{self.food.name}: {self.quantity_g}g"

    @property
    def nutrients(self):
        return self.food.get_nutrients_for_quantity(self.quantity_g)
