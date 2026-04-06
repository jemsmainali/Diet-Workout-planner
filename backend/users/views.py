"""
User authentication and profile views.
"""
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer
)


class RegisterView(generics.CreateAPIView):
    """POST /api/register - Create new user account."""
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Auto-generate tokens on registration
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Registration successful!',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class CustomLoginView(TokenObtainPairView):
    """POST /api/login - Authenticate and receive JWT tokens."""
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """POST /api/logout - Blacklist refresh token."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    """GET/PUT /api/profile - View and update user profile."""
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class BMICalculatorView(APIView):
    """GET /api/bmi - Calculate BMI for given weight/height."""
    permission_classes = [AllowAny]

    def post(self, request):
        weight = request.data.get('weight')  # kg
        height = request.data.get('height')  # cm
        age = request.data.get('age')
        gender = request.data.get('gender', 'male')
        activity_level = request.data.get('activity_level', 'moderate')
        fitness_goal = request.data.get('fitness_goal', 'maintain')

        if not weight or not height:
            return Response({'error': 'Weight and height required.'}, status=400)

        try:
            weight, height = float(weight), float(height)
            height_m = height / 100
            bmi = round(weight / (height_m ** 2), 2)

            if bmi < 18.5:
                category = "Underweight"
            elif bmi < 25:
                category = "Normal weight"
            elif bmi < 30:
                category = "Overweight"
            else:
                category = "Obese"

            # Calculate BMR if age provided
            result = {'bmi': bmi, 'category': category}
            if age:
                age = int(age)
                if gender == 'male':
                    bmr = 10 * weight + 6.25 * height - 5 * age + 5
                else:
                    bmr = 10 * weight + 6.25 * height - 5 * age - 161

                multipliers = {
                    'sedentary': 1.2, 'light': 1.375,
                    'moderate': 1.55, 'very_active': 1.725, 'extra_active': 1.9
                }
                tdee = round(bmr * multipliers.get(activity_level, 1.55), 0)
                adjustments = {'fat_loss': -500, 'muscle_gain': 300, 'maintain': 0}
                daily_cal = int(tdee + adjustments.get(fitness_goal, 0))
                result.update({'bmr': round(bmr, 0), 'tdee': tdee, 'daily_calories': daily_cal})

            return Response(result)
        except (ValueError, ZeroDivisionError) as e:
            return Response({'error': str(e)}, status=400)
