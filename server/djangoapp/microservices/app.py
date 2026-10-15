import os

import nltk
from flask import Flask, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer

app = Flask("Sentiment Analyzer")
nltk.data.path.insert(0, os.path.join(os.path.dirname(__file__), 'nltk_data'))
sia = SentimentIntensityAnalyzer()


@app.get('/')
def home():
    return "Welcome to the Sentiment Analyzer. \
    Use /analyze/text to get the sentiment"


@app.get('/analyze/<path:input_txt>')
def analyze_sentiment(input_txt):

    scores = sia.polarity_scores(input_txt)
    compound = scores['compound']
    if compound >= 0.05:
        res = "positive"
    elif compound <= -0.05:
        res = "negative"
    else:
        res = "neutral"
    return jsonify({"sentiment": res})


if __name__ == "__main__":
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', '5000')),
        debug=False,
    )
