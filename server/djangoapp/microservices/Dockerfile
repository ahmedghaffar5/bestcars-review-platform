FROM python:3.9.18-slim-bookworm

WORKDIR /python-docker

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .

EXPOSE 5000

CMD ["python3", "app.py"]
