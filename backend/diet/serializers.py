from rest_framework import serializers
from .models import Food, DietPlan, DietDetail


class FoodSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Food
        fields = '__all__'


class DietDetailSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source='food.name', read_only=True)
    food_category = serializers.CharField(source='food.category', read_only=True)
    nutrients = serializers.ReadOnlyField()
    food_detail = FoodSerializer(source='food', read_only=True)

    class Meta:
        model = DietDetail
        fields = '__all__'
        read_only_fields = ('plan',)


class DietPlanSerializer(serializers.ModelSerializer):
    details = DietDetailSerializer(many=True, read_only=True)
    total_nutrients = serializers.SerializerMethodField()
    meal_type_display = serializers.CharField(source='get_meal_type_display', read_only=True)

    class Meta:
        model = DietPlan
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

    def get_total_nutrients(self, obj):
        return obj.total_nutrients()


class DietPlanCreateSerializer(serializers.ModelSerializer):
    details = DietDetailSerializer(many=True, required=False)

    class Meta:
        model = DietPlan
        fields = ('date', 'meal_type', 'name', 'notes', 'details')

    def create(self, validated_data):
        details_data = validated_data.pop('details', [])
        plan = DietPlan.objects.create(**validated_data)
        for detail_data in details_data:
            DietDetail.objects.create(plan=plan, **detail_data)
        return plan
