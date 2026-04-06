from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .logic import generate_workout_plan, generate_diet_plan
from workouts.serializers import WorkoutPlanSerializer
from diet.serializers import DietPlanSerializer
import datetime


class GenerateWorkoutPlanView(APIView):
    """POST /api/plans/generate/workout/ - AI-generate weekly workout plan."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not all([user.weight, user.height, user.age]):
            return Response(
                {'error': 'Please complete your profile (weight, height, age) first.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        plans = generate_workout_plan(user)
        serializer = WorkoutPlanSerializer(plans, many=True)
        return Response({
            'message': f'Generated {len(plans)}-day workout plan for {user.fitness_goal.replace("_", " ")} goal!',
            'plans': serializer.data
        }, status=status.HTTP_201_CREATED)


class GenerateDietPlanView(APIView):
    """POST /api/plans/generate/diet/ - AI-generate daily meal plan."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        date_str = request.data.get('date', str(datetime.date.today()))
        try:
            date = datetime.date.fromisoformat(date_str)
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        plans = generate_diet_plan(user, date)
        serializer = DietPlanSerializer(plans, many=True)
        daily_cal = user.calculate_daily_calories()
        return Response({
            'message': f'Generated meal plan for {date_str}!',
            'calorie_target': daily_cal,
            'plans': serializer.data
        }, status=status.HTTP_201_CREATED)
