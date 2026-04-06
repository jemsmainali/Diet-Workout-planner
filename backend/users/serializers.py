"""
User serializers for registration, profile, and JWT token customization.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Handles new user registration with password confirmation."""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2',
                  'age', 'weight', 'height', 'fitness_goal',
                  'activity_level', 'gender')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Read/write user profile with computed BMI and calorie fields."""
    bmi = serializers.ReadOnlyField()
    bmi_category = serializers.ReadOnlyField()
    daily_calories = serializers.SerializerMethodField()
    tdee = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'age', 'weight', 'height',
                  'fitness_goal', 'activity_level', 'gender', 'bio',
                  'profile_picture', 'bmi', 'bmi_category', 'daily_calories',
                  'tdee', 'created_at')
        read_only_fields = ('id', 'email', 'created_at')

    def get_daily_calories(self, obj):
        return obj.calculate_daily_calories()

    def get_tdee(self, obj):
        return obj.calculate_tdee()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Extend JWT token with user data payload."""
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['fitness_goal'] = user.fitness_goal
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserProfileSerializer(self.user).data
        return data
