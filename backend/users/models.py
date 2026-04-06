"""
Custom User model extending Django's AbstractUser.
Adds fitness-specific fields: age, weight, height, fitness_goal.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class CustomUser(AbstractUser):
    """Extended user model with fitness profile fields."""

    FITNESS_GOALS = [
        ('fat_loss', 'Fat Loss'),
        ('muscle_gain', 'Muscle Gain'),
        ('maintain', 'Maintain Weight'),
    ]

    ACTIVITY_LEVELS = [
        ('sedentary', 'Sedentary (little/no exercise)'),
        ('light', 'Lightly Active (1-3 days/week)'),
        ('moderate', 'Moderately Active (3-5 days/week)'),
        ('very_active', 'Very Active (6-7 days/week)'),
        ('extra_active', 'Extra Active (twice/day)'),
    ]

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(10), MaxValueValidator(120)]
    )
    weight = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(20), MaxValueValidator(500)],
        help_text="Weight in kg"
    )
    height = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(50), MaxValueValidator(300)],
        help_text="Height in cm"
    )
    fitness_goal = models.CharField(
        max_length=20, choices=FITNESS_GOALS,
        default='maintain'
    )
    activity_level = models.CharField(
        max_length=20, choices=ACTIVITY_LEVELS,
        default='moderate'
    )
    gender = models.CharField(
        max_length=10, choices=GENDER_CHOICES,
        default='male'
    )
    profile_picture = models.ImageField(
        upload_to='profiles/', null=True, blank=True
    )
    bio = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users_customuser'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['fitness_goal']),
        ]

    def __str__(self):
        return f"{self.username} ({self.email})"

    @property
    def bmi(self):
        """Calculate Body Mass Index."""
        if self.weight and self.height:
            height_m = self.height / 100
            return round(self.weight / (height_m ** 2), 2)
        return None

    @property
    def bmi_category(self):
        """Return BMI category string."""
        bmi = self.bmi
        if bmi is None:
            return "Unknown"
        if bmi < 18.5:
            return "Underweight"
        elif bmi < 25:
            return "Normal weight"
        elif bmi < 30:
            return "Overweight"
        else:
            return "Obese"

    def calculate_bmr(self):
        """
        Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation.
        Men:   BMR = 10*weight + 6.25*height - 5*age + 5
        Women: BMR = 10*weight + 6.25*height - 5*age - 161
        """
        if not all([self.weight, self.height, self.age]):
            return None
        if self.gender == 'male':
            return 10 * self.weight + 6.25 * self.height - 5 * self.age + 5
        else:
            return 10 * self.weight + 6.25 * self.height - 5 * self.age - 161

    def calculate_tdee(self):
        """Calculate Total Daily Energy Expenditure based on activity level."""
        bmr = self.calculate_bmr()
        if bmr is None:
            return None
        multipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'very_active': 1.725,
            'extra_active': 1.9,
        }
        return round(bmr * multipliers.get(self.activity_level, 1.55), 0)

    def calculate_daily_calories(self):
        """Adjust calories based on fitness goal."""
        tdee = self.calculate_tdee()
        if tdee is None:
            return None
        goal_adjustments = {
            'fat_loss': -500,       # 500 cal deficit for ~0.5kg/week loss
            'muscle_gain': +300,    # 300 cal surplus for lean gains
            'maintain': 0,
        }
        return int(tdee + goal_adjustments.get(self.fitness_goal, 0))
