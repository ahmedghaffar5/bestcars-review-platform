FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV APP=/app

WORKDIR $APP

COPY requirements.txt $APP/
RUN pip install --no-cache-dir -r requirements.txt
COPY . $APP/

EXPOSE 8000

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "djangoproj.wsgi"]
