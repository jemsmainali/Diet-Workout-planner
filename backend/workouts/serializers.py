from rest_framework import serializers
from .models import Exercise, WorkoutPlan, WorkoutDetail


class ExerciseSerializer(serializers.ModelSerializer):
    muscle_group_display = serializers.CharField(source='get_muscle_group_display', read_only=True)

    class Meta:
        model = Exercise
        fields = '__all__'


class WorkoutDetailSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    muscle_group = serializers.CharField(source='exercise.muscle_group', read_only=True)
    exercise_detail = ExerciseSerializer(source='exercise', read_only=True)

    class Meta:
        model = WorkoutDetail
        fields = '__all__'


class WorkoutPlanSerializer(serializers.ModelSerializer):
    details = WorkoutDetailSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    total_calories = serializers.SerializerMethodField()
    day_display = serializers.CharField(source='get_day_display', read_only=True)

    class Meta:
        model = WorkoutPlan
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

    def get_total_calories(self, obj):
        return obj.total_estimated_calories()


class WorkoutPlanCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating workout plans with nested details."""
    details = WorkoutDetailSerializer(many=True, required=False)

    class Meta:
        model = WorkoutPlan
        fields = ('name', 'day', 'notes', 'details')

    def create(self, validated_data):
        details_data = validated_data.pop('details', [])
        plan = WorkoutPlan.objects.create(**validated_data)
        for i, detail_data in enumerate(details_data):
            detail_data['order'] = i
            WorkoutDetail.objects.create(plan=plan, **detail_data)
        return plan
