"""
Workout models: Exercise library, WorkoutPlan, and WorkoutDetail.
"""
from django.db import models
from django.conf import settings


class Exercise(models.Model):
    """Exercise library with muscle group categorization."""
    MUSCLE_GROUPS = [
        ('chest', 'Chest'), ('back', 'Back'), ('shoulders', 'Shoulders'),
        ('biceps', 'Biceps'), ('triceps', 'Triceps'), ('legs', 'Legs'),
        ('glutes', 'Glutes'), ('abs', 'Abs/Core'), ('cardio', 'Cardio'),
        ('full_body', 'Full Body'),
    ]
    DIFFICULTY = [
        ('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')
    ]

    name = models.CharField(max_length=200)
    muscle_group = models.CharField(max_length=20, choices=MUSCLE_GROUPS)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=15, choices=DIFFICULTY, default='intermediate')
    equipment = models.CharField(max_length=200, blank=True, default='')
    video_url = models.URLField(blank=True, null=True)
    calories_per_rep = models.FloatField(default=0.5, help_text="Approx calories per rep")
    is_cardio = models.BooleanField(default=False)
    duration_minutes = models.IntegerField(null=True, blank=True, help_text="For cardio exercises")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['muscle_group', 'name']
        indexes = [models.Index(fields=['muscle_group'])]

    def __str__(self):
        return f"{self.name} ({self.get_muscle_group_display()})"


class WorkoutPlan(models.Model):
    """A user's workout plan for a specific day."""
    DAY_CHOICES = [
        ('monday', 'Monday'), ('tuesday', 'Tuesday'), ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'), ('friday', 'Friday'), ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workout_plans')
    name = models.CharField(max_length=200, default='My Workout Plan')
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    notes = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['day']
        indexes = [models.Index(fields=['user', 'day'])]

    def __str__(self):
        return f"{self.user.username} - {self.name} ({self.day})"

    def total_estimated_calories(self):
        """Sum estimated calories burned across all exercises."""
        total = 0
        for detail in self.details.all():
            if detail.exercise.is_cardio and detail.exercise.duration_minutes:
                total += detail.exercise.duration_minutes * 8  # ~8 cal/min cardio
            else:
                total += detail.exercise.calories_per_rep * detail.sets * detail.reps
        return round(total, 1)


class WorkoutDetail(models.Model):
    """Individual exercise entry within a workout plan."""
    plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name='details')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.PositiveIntegerField(default=3)
    reps = models.PositiveIntegerField(default=10)
    weight_kg = models.FloatField(null=True, blank=True, help_text="Weight used in kg")
    rest_seconds = models.PositiveIntegerField(default=60, help_text="Rest between sets")
    notes = models.CharField(max_length=500, blank=True, default='')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        indexes = [models.Index(fields=['plan'])]

    def __str__(self):
        return f"{self.exercise.name}: {self.sets}x{self.reps}"
