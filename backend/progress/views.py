from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Progress
from .serializers import ProgressSerializer


class ProgressListView(generics.ListAPIView):
    """GET /api/progress/ - User's progress history."""
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Progress.objects.filter(user=self.request.user)


class ProgressAddView(generics.CreateAPIView):
    """POST /api/progress/add/ - Log new progress entry."""
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProgressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/progress/<id>/"""
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Progress.objects.filter(user=self.request.user)


class WeeklyReportView(APIView):
    """GET /api/progress/weekly-report/ - Weekly progress summary."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entries = list(Progress.objects.filter(user=request.user).order_by('-date')[:30])[::-1]
        if not entries:
            return Response({'message': 'No progress data yet.'})

        weights = [e.weight for e in entries]
        first, last = entries[0], entries[-1]
        weight_change = round(last.weight - first.weight, 2)

        return Response({
            'entries_count': len(entries),
            'start_weight': first.weight,
            'current_weight': last.weight,
            'weight_change': weight_change,
            'weight_change_direction': 'loss' if weight_change < 0 else 'gain',
            'avg_weight': round(sum(weights) / len(weights), 2),
            'min_weight': min(weights),
            'max_weight': max(weights),
            'current_bmi': last.bmi,
            'data_points': [{'date': str(e.date), 'weight': e.weight, 'body_fat': e.body_fat} for e in entries],
        })
