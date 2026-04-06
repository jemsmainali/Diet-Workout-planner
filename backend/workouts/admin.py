from django.contrib import admin
from .models import Exercise, WorkoutPlan, WorkoutDetail

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'muscle_group', 'difficulty', 'is_cardio')
    list_filter = ('muscle_group', 'difficulty', 'is_cardio')
    search_fields = ('name',)

class WorkoutDetailInline(admin.TabularInline):
    model = WorkoutDetail
    extra = 1

@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'day', 'is_active', 'created_at')
    list_filter = ('day', 'is_active')
    inlines = [WorkoutDetailInline]
