import json
import logging
import os
from datetime import datetime, timezone

import requests
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

from .models import CarModel
from .populate import seed_default_data
from .restapis import analyze_review_sentiments

logger = logging.getLogger(__name__)
BACKEND_URL = (
    os.getenv('BACKEND_URL')
    or os.getenv('backend_url')
    or 'http://localhost:3030'
).rstrip('/')


def _request_payload(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return None


def _json_error(message, status):
    return JsonResponse({'status': 'error', 'message': message}, status=status)


@csrf_exempt
def login_user(request):
    if request.method != 'POST':
        return _json_error('Method not allowed', 405)
    payload = _request_payload(request)
    if not isinstance(payload, dict):
        return _json_error('Invalid JSON body', 400)
    username = payload.get('userName') or payload.get('username')
    password = payload.get('password')
    if not username or not password:
        return _json_error('Username and password are required', 400)
    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse(
            {'userName': username, 'status': 'Unauthenticated'},
            status=401,
        )
    login(request, user)
    return JsonResponse(
        {'userName': user.username, 'status': 'Authenticated'},
        status=200,
    )


@csrf_exempt
def register_user(request):
    if request.method != 'POST':
        return _json_error('Method not allowed', 405)
    payload = _request_payload(request)
    if not isinstance(payload, dict):
        return _json_error('Invalid JSON body', 400)
    username = (payload.get('userName') or payload.get('username') or '').strip()
    password = payload.get('password') or ''
    first_name = (payload.get('firstName') or '').strip()
    last_name = (payload.get('lastName') or '').strip()
    email = (payload.get('email') or '').strip()
    if not all([username, password, first_name, last_name, email]):
        return _json_error('All registration fields are required', 400)
    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {'status': 'exists', 'message': 'User already exists'},
            status=409,
        )
    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name,
        email=email,
    )
    login(request, user)
    return JsonResponse(
        {
            'userName': user.username,
            'status': 'Registered',
            'firstName': user.first_name,
            'lastName': user.last_name,
        },
        status=201,
    )


def logout_user(request):
    if request.method not in {'GET', 'POST'}:
        return _json_error('Method not allowed', 405)
    logout(request)
    return JsonResponse({'userName': ''}, status=200)


@ensure_csrf_cookie
def session_status(request):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False, 'userName': ''})
    return JsonResponse(
        {
            'authenticated': True,
            'userName': request.user.username,
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
        }
    )


@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


def _safe_json_request(url, method='GET', payload=None):
    try:
        if method == 'POST':
            response = requests.post(url, json=payload, timeout=10)
        else:
            response = requests.get(url, timeout=10)
    except requests.RequestException as error:
        logger.warning('Upstream request failed for %s: %s', url, error)
        return None, 503
    try:
        body = response.json()
    except ValueError:
        body = {'error': 'Upstream returned invalid JSON'}
    return body, response.status_code


def get_dealers(request):
    data, status = _safe_json_request(f'{BACKEND_URL}/fetchDealers')
    if status != 200:
        return JsonResponse(
            {'status': status, 'dealers': [], 'message': 'Dealer service unavailable'},
            status=503 if status == 503 else status,
        )
    return JsonResponse({'status': 200, 'dealers': data})


def get_dealers_by_state(request, state):
    if state.lower() == 'all':
        return get_dealers(request)
    data, status = _safe_json_request(
        f'{BACKEND_URL}/fetchDealers/{requests.utils.quote(state, safe="")}'
    )
    if status != 200:
        return JsonResponse(
            {'status': status, 'dealers': [], 'message': 'Dealer service unavailable'},
            status=503 if status == 503 else status,
        )
    return JsonResponse({'status': 200, 'dealers': data})


def get_dealer_details(request, dealer_id):
    data, status = _safe_json_request(f'{BACKEND_URL}/fetchDealer/{dealer_id}')
    if status != 200:
        return JsonResponse(
            {'status': status, 'dealer': [], 'message': 'Dealer not found'},
            status=404 if status == 404 else 503,
        )
    return JsonResponse({'status': 200, 'dealer': data})


def get_dealer_reviews(request, dealer_id):
    data, status = _safe_json_request(
        f'{BACKEND_URL}/fetchReviews/dealer/{dealer_id}'
    )
    if status != 200:
        return JsonResponse(
            {'status': status, 'reviews': [], 'message': 'Review service unavailable'},
            status=404 if status == 404 else 503,
        )
    reviews = data if isinstance(data, list) else []
    try:
        for review in reviews:
            review['sentiment'] = analyze_review_sentiments(
                review.get('review', '')
            )
    except requests.RequestException:
        logger.warning('Sentiment service unavailable for dealer %s', dealer_id)
        return JsonResponse(
            {'status': 503, 'reviews': [], 'message': 'Sentiment service unavailable'},
            status=503,
        )
    return JsonResponse({'status': 200, 'reviews': reviews})


def get_cars(request):
    seed_default_data()
    cars = [
        {
            'CarMake': model.car_make.name,
            'CarModel': model.name,
            'year': model.year,
        }
        for model in CarModel.objects.select_related('car_make').all()
    ]
    return JsonResponse({'CarModels': cars})


def add_review(request):
    if request.method != 'POST':
        return _json_error('Method not allowed', 405)
    if not request.user.is_authenticated:
        return JsonResponse(
            {'status': 403, 'message': 'Authentication required'},
            status=403,
        )
    payload = _request_payload(request)
    if not isinstance(payload, dict):
        return _json_error('Invalid JSON body', 400)
    if not str(payload.get('review', '')).strip() or not payload.get('dealership'):
        return _json_error('Dealer and review text are required', 400)
    payload['time'] = datetime.now(timezone.utc).isoformat()
    payload['user_id'] = request.user.id
    payload['name'] = (
        f'{request.user.first_name} {request.user.last_name}'.strip()
        or request.user.username
    )
    try:
        payload['sentiment'] = analyze_review_sentiments(payload['review'])
        response, status = _safe_json_request(
            f'{BACKEND_URL}/insert_review',
            method='POST',
            payload=payload,
        )
    except requests.RequestException:
        logger.warning('Sentiment service unavailable while adding review')
        return JsonResponse(
            {'status': 503, 'message': 'Sentiment service unavailable'},
            status=503,
        )
    if status not in {200, 201}:
        return JsonResponse(
            {'status': status, 'message': response},
            status=503 if status == 503 else status,
        )
    return JsonResponse({'status': 200, 'result': response})
