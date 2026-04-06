from django.urls import path
from .views import GenerateWorkoutPlanView, GenerateDietPlanView

urlpatterns = [
    path('generate/workout/', GenerateWorkoutPlanView.as_view(), name='generate-workout'),
    path('generate/diet/', GenerateDietPlanView.as_view(), name='generate-diet'),
]
