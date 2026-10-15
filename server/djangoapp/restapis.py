import os
from urllib.parse import quote

import requests
from dotenv import load_dotenv

load_dotenv()


def _configured_url(primary_name, legacy_name, default):
    value = os.getenv(primary_name) or os.getenv(legacy_name) or default
    if 'your ' in value.lower() or 'localhost' not in value and '://' not in value:
        return default
    return value.rstrip('/')


backend_url = _configured_url('BACKEND_URL', 'backend_url', 'http://localhost:3030')
sentiment_analyzer_url = _configured_url(
    'SENTIMENT_ANALYZER_URL',
    'sentiment_analyzer_url',
    'http://localhost:5000',
)


def get_request(endpoint, **kwargs):
    response = requests.get(f'{backend_url}{endpoint}', timeout=10, **kwargs)
    response.raise_for_status()
    return response.json()


def analyze_review_sentiments(text):
    cleaned = quote(text, safe='')
    response = requests.get(f'{sentiment_analyzer_url}/analyze/{cleaned}', timeout=10)
    response.raise_for_status()
    payload = response.json()
    return payload['sentiment']


def post_review(data_dict):
    response = requests.post(f'{backend_url}/insert_review', json=data_dict, timeout=10)
    response.raise_for_status()
    return response.json()
