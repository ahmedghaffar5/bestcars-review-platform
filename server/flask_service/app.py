from flask import Flask, jsonify
import nltk
from nltk.tokenize import word_tokenize

app = Flask(__name__)

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

POSITIVE_WORDS = {
    'good', 'great', 'excellent', 'love', 'amazing', 'friendly',
    'helpful', 'smooth', 'fast', 'clean', 'happy', 'satisfied',
}
NEGATIVE_WORDS = {
    'bad', 'poor', 'dirty', 'slow', 'terrible', 'awful', 'rude',
    'broken', 'late', 'unsafe', 'hate',
}


@app.get('/health')
def health():
    return jsonify({'status': 'ok'})


@app.get('/analyze/<path:text>')
def analyze_text(text):
    try:
        tokens = [
            token.lower() for token in word_tokenize(text.replace('%20', ' '))
        ]
    except LookupError:
        nltk.download('punkt_tab', quiet=True)
        tokens = [
            token.lower() for token in word_tokenize(text.replace('%20', ' '))
        ]

    score = 0
    for token in tokens:
        if token in POSITIVE_WORDS:
            score += 1
        if token in NEGATIVE_WORDS:
            score -= 1

    if score > 0:
        sentiment = 'positive'
    elif score < 0:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    return jsonify({'sentiment': sentiment, 'score': score})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
