from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import CustomUser
from .models import Exercise, WorkoutPlan


class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='gymuser', email='gym@test.com', password='Pass123!'
        )
        self.client.force_authenticate(user=self.user)
        self.exercise = Exercise.objects.create(
            name='Test Push-Up', muscle_group='chest', difficulty='beginner'
        )

    def test_list_exercises(self):
        response = self.client.get('/api/workouts/exercises/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_workout_plan(self):
        data = {'name': 'Monday Push', 'day': 'monday', 'notes': 'Test plan'}
        response = self.client.post('/api/workouts/create/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_workout_plans(self):
        WorkoutPlan.objects.create(user=self.user, name='Test Plan', day='tuesday')
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
