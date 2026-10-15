import os

import nltk
from flask import Flask, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer

try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('vader_lexicon', quiet=True)

app = Flask("Sentiment Analyzer")

sia = SentimentIntensityAnalyzer()


@app.get('/')
def home():
    return "Welcome to the Sentiment Analyzer. \
    Use /analyze/text to get the sentiment"


@app.get('/analyze/<path:input_txt>')
def analyze_sentiment(input_txt):

    scores = sia.polarity_scores(input_txt)
    print(scores)
    pos = float(scores['pos'])
    neg = float(scores['neg'])
    neu = float(scores['neu'])
    res = "positive"
    print("pos neg nue ", pos, neg, neu)
    if (neg > pos and neg > neu):
        res = "negative"
    elif (neu > neg and neu > pos):
        res = "neutral"
    return jsonify({"sentiment": res})


if __name__ == "__main__":
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', '5000')),
        debug=False,
    )
