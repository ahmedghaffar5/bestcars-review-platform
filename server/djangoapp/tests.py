from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase

from .models import CarMake, CarModel


class AuthenticationTests(TestCase):
    def test_register_creates_hashed_user_and_session(self):
        response = self.client.post(
            '/djangoapp/register',
            data={
                'userName': 'alice',
                'password': 'A-strong-password-123',
                'firstName': 'Alice',
                'lastName': 'Tester',
                'email': 'alice@example.com',
            },
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 201)
        user = User.objects.get(username='alice')
        self.assertTrue(user.check_password('A-strong-password-123'))
        self.assertEqual(self.client.get('/djangoapp/session').json()['userName'], 'alice')

    def test_duplicate_and_invalid_login_are_rejected(self):
        User.objects.create_user(username='alice', password='Password-123')
        duplicate = self.client.post(
            '/djangoapp/register',
            data={
                'userName': 'alice',
                'password': 'Password-123',
                'firstName': 'A',
                'lastName': 'B',
                'email': 'a@example.com',
            },
            content_type='application/json',
        )
        invalid = self.client.post(
            '/djangoapp/login',
            data={'userName': 'alice', 'password': 'wrong'},
            content_type='application/json',
        )
        self.assertEqual(duplicate.status_code, 409)
        self.assertEqual(invalid.status_code, 401)


class DomainTests(TestCase):
    def test_get_cars_seeds_five_makes_and_fifteen_models(self):
        response = self.client.get('/djangoapp/get_cars')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(CarMake.objects.count(), 5)
        self.assertEqual(CarModel.objects.count(), 15)
        self.assertEqual(len(response.json()['CarModels']), 15)

    def test_anonymous_user_cannot_add_review(self):
        response = self.client.post(
            '/djangoapp/add_review',
            data='{"dealership": 3, "review": "Great", "car_make": "Audi"}',
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 403)

    @patch('djangoapp.views.analyze_review_sentiments', return_value='positive')
    @patch(
        'djangoapp.views._safe_json_request',
        return_value=(
            [{'id': 1, 'review': 'Great service', 'name': 'Tester'}],
            200,
        ),
    )
    def test_reviews_are_enriched_with_sentiment(self, _request, _sentiment):
        response = self.client.get('/djangoapp/reviews/dealer/3')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['reviews'][0]['sentiment'], 'positive')
