import json
import logging
import os
from datetime import datetime

import requests
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import CarModel
from .populate import seed_default_data
from .restapis import analyze_review_sentiments

logger = logging.getLogger(__name__)
BACKEND_URL = os.getenv('BACKEND_URL') or os.getenv('backend_url') or 'http://localhost:3030'
if 'your ' in BACKEND_URL.lower() or '://' not in BACKEND_URL:
    BACKEND_URL = 'http://localhost:3030'
BACKEND_URL = BACKEND_URL.rstrip('/')


def _request_payload(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return None


@csrf_exempt
def login_user(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

    payload = _request_payload(request)
    if not isinstance(payload, dict):
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON body'}, status=400)
    username = payload.get('userName') or payload.get('username')
    password = payload.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'userName': username, 'status': 'Authenticated'}, status=200)
    return JsonResponse({'userName': username or '', 'status': 'Unauthenticated'}, status=401)


@csrf_exempt
def register_user(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

    payload = _request_payload(request)
    if not isinstance(payload, dict):
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON body'}, status=400)
    username = payload.get('userName') or payload.get('username')
    password = payload.get('password')
    first_name = payload.get('firstName') or payload.get('first_name') or ''
    last_name = payload.get('lastName') or payload.get('last_name') or ''
    email = payload.get('email') or f'{username}@example.com'

    if not username or not password:
        return JsonResponse({'status': 'error', 'message': 'Username and password are required'}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'status': 'exists', 'message': 'User already exists'}, status=409)

    User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
    return JsonResponse({
        'userName': username,
        'status': 'Registered',
        'firstName': first_name,
        'lastName': last_name,
    }, status=201)


@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({'userName': ''}, status=200)


def _safe_json_request(url, method='GET', payload=None, headers=None):
    if headers is None:
        headers = {}
    if method == 'GET':
        response = requests.get(url, timeout=10)
    elif method == 'POST':
        response = requests.post(
            url,
            data=json.dumps(payload) if payload is not None else None,
            headers=headers,
            timeout=10,
        )
    else:
        response = requests.request(
            method,
            url,
            data=json.dumps(payload) if payload is not None else None,
            headers=headers,
            timeout=10,
        )
    try:
        return response.json(), response.status_code
    except ValueError:
        return {'error': response.text}, response.status_code


def get_dealers(request):
    data, status = _safe_json_request(f'{BACKEND_URL}/fetchDealers')
    if status != 200:
        return JsonResponse({'status': 500, 'dealers': []})
    return JsonResponse({'status': 200, 'dealers': data}, safe=False)


def get_dealers_by_state(request, state):
    if state.lower() == 'all':
        return get_dealers(request)
    data, status = _safe_json_request(f'{BACKEND_URL}/fetchDealers/{state}')
    if status != 200:
        return JsonResponse({'status': 500, 'dealers': []})
    return JsonResponse({'status': 200, 'dealers': data}, safe=False)


def get_dealer_details(request, dealer_id):
    data, status = _safe_json_request(f'{BACKEND_URL}/fetchDealer/{dealer_id}')
    if status != 200:
        return JsonResponse({'status': 404, 'dealer': []})
    dealer = data if isinstance(data, list) else [data]
    return JsonResponse({'status': 200, 'dealer': dealer}, safe=False)


def get_dealer_reviews(request, dealer_id):
    data, status = _safe_json_request(f'{BACKEND_URL}/fetchReviews/dealer/{dealer_id}')
    if status != 200:
        return JsonResponse({'status': 404, 'reviews': []})
    reviews = data if isinstance(data, list) else []
    for review in reviews:
        try:
            review['sentiment'] = analyze_review_sentiments(review.get('review', ''))
        except requests.RequestException:
            logger.warning('Sentiment service unavailable for review %s', review.get('id'))
            review['sentiment'] = review.get('sentiment', 'neutral')
    return JsonResponse({'status': 200, 'reviews': reviews}, safe=False)


def get_cars(request):
    seed_default_data()
    cars = []
    for model in CarModel.objects.select_related('car_make').all():
        cars.append({'CarMake': model.car_make.name, 'CarModel': model.name, 'year': model.year})
    return JsonResponse({'CarModels': cars}, safe=False)


@csrf_exempt
def add_review(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 403, 'message': 'Authentication required'}, status=403)
    payload = _request_payload(request)
    if not isinstance(payload, dict):
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON body'}, status=400)
    payload['time'] = datetime.utcnow().isoformat()
    payload['user_id'] = request.user.id
    payload['name'] = (
        request.user.first_name + ' ' + request.user.last_name
        if request.user.first_name or request.user.last_name
        else request.user.username
    )
    try:
        payload['sentiment'] = analyze_review_sentiments(
            payload.get('review', '')
        )
    except requests.RequestException:
        logger.warning('Sentiment service unavailable while adding review')
        payload['sentiment'] = 'neutral'
    response, status = _safe_json_request(
        f'{BACKEND_URL}/insert_review',
        method='POST',
        payload=payload,
        headers={'Content-Type': 'application/json'}
    )
    if status == 200:
        return JsonResponse({'status': 200, 'result': response}, safe=False)
    return JsonResponse({'status': 500, 'message': response}, status=500)
