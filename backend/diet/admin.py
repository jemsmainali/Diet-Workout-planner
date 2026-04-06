from django.contrib import admin
from .models import Food, DietPlan, DietDetail

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'calories', 'protein', 'carbs', 'fats')
    list_filter = ('category', 'is_vegetarian', 'is_vegan')
    search_fields = ('name',)

class DietDetailInline(admin.TabularInline):
    model = DietDetail
    extra = 1

@admin.register(DietPlan)
class DietPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'meal_type', 'name')
    list_filter = ('meal_type', 'date')
    inlines = [DietDetailInline]
