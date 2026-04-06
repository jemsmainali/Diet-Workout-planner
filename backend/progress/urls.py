from django.urls import path
from .views import ProgressListView, ProgressAddView, ProgressDetailView, WeeklyReportView

urlpatterns = [
    path('', ProgressListView.as_view(), name='progress-list'),
    path('add/', ProgressAddView.as_view(), name='progress-add'),
    path('<int:pk>/', ProgressDetailView.as_view(), name='progress-detail'),
    path('weekly-report/', WeeklyReportView.as_view(), name='weekly-report'),
]
