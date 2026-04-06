from rest_framework import serializers
from .models import Progress


class ProgressSerializer(serializers.ModelSerializer):
    bmi = serializers.ReadOnlyField()

    class Meta:
        model = Progress
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
