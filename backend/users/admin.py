from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'fitness_goal', 'weight', 'bmi', 'is_staff')
    list_filter = ('fitness_goal', 'activity_level', 'gender')
    fieldsets = UserAdmin.fieldsets + (
        ('Fitness Profile', {'fields': ('age', 'weight', 'height', 'fitness_goal', 'activity_level', 'gender', 'bio')}),
    )
