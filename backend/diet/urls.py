from django.urls import path
from .views import FoodListView, DietPlanListView, DietPlanCreateView, DietPlanDetailView, DailyCalorieSummaryView

urlpatterns = [
    path('', DietPlanListView.as_view(), name='diet-list'),
    path('add/', DietPlanCreateView.as_view(), name='diet-create'),
    path('<int:pk>/', DietPlanDetailView.as_view(), name='diet-detail'),
    path('foods/', FoodListView.as_view(), name='food-list'),
    path('summary/', DailyCalorieSummaryView.as_view(), name='diet-summary'),
]
