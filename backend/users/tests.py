from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser


class UserRegistrationTest(APITestCase):
    def test_register_user(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'SecurePass123!',
            'password2': 'SecurePass123!',
            'fitness_goal': 'fat_loss',
        }
        response = self.client.post('/api/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('user', response.data)

    def test_register_password_mismatch(self):
        data = {
            'username': 'testuser2',
            'email': 'test2@example.com',
            'password': 'SecurePass123!',
            'password2': 'DifferentPass!',
        }
        response = self.client.post('/api/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user(self):
        user = CustomUser.objects.create_user(
            username='logintest', email='login@test.com', password='TestPass123!'
        )
        data = {'email': 'login@test.com', 'password': 'TestPass123!'}
        response = self.client.post('/api/login/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


class BMITest(APITestCase):
    def test_bmi_calculation(self):
        data = {'weight': 70, 'height': 175, 'age': 25, 'gender': 'male'}
        response = self.client.post('/api/bmi/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('bmi', response.data)
        # BMI = 70 / (1.75^2) = 22.86
        self.assertAlmostEqual(response.data['bmi'], 22.86, places=1)

    def test_bmi_user_model(self):
        user = CustomUser(weight=80, height=180)
        expected_bmi = round(80 / (1.80 ** 2), 2)
        self.assertEqual(user.bmi, expected_bmi)
