from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum
from .models import Food, DietPlan, DietDetail
from .serializers import FoodSerializer, DietPlanSerializer, DietPlanCreateSerializer, DietDetailSerializer
import datetime


class FoodListView(generics.ListAPIView):
    """GET /api/diet/foods/ - Browse food database."""
    serializer_class = FoodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Food.objects.all()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        if category:
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(name__icontains=search)
        return qs


class DietPlanListView(generics.ListAPIView):
    """GET /api/diet/ - List user's diet plans."""
    serializer_class = DietPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = DietPlan.objects.filter(user=self.request.user)
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(date=date)
        return qs


class DietPlanCreateView(generics.CreateAPIView):
    """POST /api/diet/add/ - Create a new diet plan."""
    serializer_class = DietPlanCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DietPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/diet/<id>/"""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return DietPlanCreateSerializer
        return DietPlanSerializer

    def get_queryset(self):
        return DietPlan.objects.filter(user=self.request.user)


class DailyCalorieSummaryView(APIView):
    """GET /api/diet/summary/?date=YYYY-MM-DD - Daily calorie breakdown."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_str = request.query_params.get('date', str(datetime.date.today()))
        plans = DietPlan.objects.filter(user=request.user, date=date_str)
        summary = {'date': date_str, 'meals': [], 'daily_total': {'calories': 0, 'protein': 0, 'carbs': 0, 'fats': 0}}
        for plan in plans:
            nutrients = plan.total_nutrients()
            summary['meals'].append({
                'id': plan.id, 'meal_type': plan.meal_type,
                'name': plan.name, 'nutrients': nutrients
            })
            for key in ['calories', 'protein', 'carbs', 'fats']:
                summary['daily_total'][key] = round(summary['daily_total'][key] + nutrients.get(key, 0), 1)
        
        # Add goal comparison
        user_goal = request.user.calculate_daily_calories()
        if user_goal:
            summary['calorie_goal'] = user_goal
            summary['remaining'] = round(user_goal - summary['daily_total']['calories'], 1)
        return Response(summary)
