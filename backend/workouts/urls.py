from django.urls import path
from .views import (
    ExerciseListView, WorkoutPlanListView, WorkoutPlanCreateView,
    WorkoutPlanDetailView, WorkoutDetailView
)

urlpatterns = [
    path('', WorkoutPlanListView.as_view(), name='workout-list'),
    path('create/', WorkoutPlanCreateView.as_view(), name='workout-create'),
    path('<int:pk>/', WorkoutPlanDetailView.as_view(), name='workout-detail'),
    path('exercises/', ExerciseListView.as_view(), name='exercise-list'),
    path('detail/add/', WorkoutDetailView.as_view(), name='workout-detail-add'),
]
