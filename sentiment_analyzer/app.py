from flask import Flask, jsonify
from flask_cors import CORS
from textblob import TextBlob

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return "Sentiment Analyzer is running"


@app.route('/analyze/<text>')
def analyze(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.1:
        sentiment = "positive"
    elif polarity < -0.1:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return jsonify({"sentiment": sentiment})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
