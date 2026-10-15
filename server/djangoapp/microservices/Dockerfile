FROM python:3.12-slim-bookworm

WORKDIR /python-docker

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt \
    && python -c "import nltk; nltk.download('vader_lexicon', download_dir='nltk_data')"
COPY app.py .

EXPOSE 5000

CMD ["python3", "app.py"]
