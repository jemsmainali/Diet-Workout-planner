from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Exercise, WorkoutPlan, WorkoutDetail
from .serializers import ExerciseSerializer, WorkoutPlanSerializer, WorkoutPlanCreateSerializer, WorkoutDetailSerializer


class ExerciseListView(generics.ListAPIView):
    """GET /api/workouts/exercises/ - Browse exercise library."""
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Exercise.objects.all()
        muscle_group = self.request.query_params.get('muscle_group')
        difficulty = self.request.query_params.get('difficulty')
        if muscle_group:
            qs = qs.filter(muscle_group=muscle_group)
        if difficulty:
            qs = qs.filter(difficulty=difficulty)
        return qs


class WorkoutPlanListView(generics.ListAPIView):
    """GET /api/workouts/ - List user's workout plans."""
    serializer_class = WorkoutPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkoutPlan.objects.filter(user=self.request.user, is_active=True)


class WorkoutPlanCreateView(generics.CreateAPIView):
    """POST /api/workouts/create/ - Create a new workout plan."""
    serializer_class = WorkoutPlanCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WorkoutPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/workouts/<id>/ - Manage specific workout plan."""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return WorkoutPlanCreateSerializer
        return WorkoutPlanSerializer

    def get_queryset(self):
        return WorkoutPlan.objects.filter(user=self.request.user)


class WorkoutDetailView(generics.CreateAPIView):
    """POST /api/workouts/detail/add/ - Add exercise to a plan."""
    serializer_class = WorkoutDetailSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        plan = serializer.validated_data['plan']
        if plan.user != self.request.user:
            raise PermissionError("Not your plan.")
        serializer.save()
