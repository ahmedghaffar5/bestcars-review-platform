# Local setup

## Prerequisites

- Python 3.12 with the packages in `server/requirements.txt`
- Node.js 18 or newer
- Docker Desktop with its engine running for the official MongoDB integration

## Windows PowerShell

```powershell
Set-Location .\server
python -m pip install -r requirements.txt
python manage.py migrate
Set-Location .\database
npm install
docker compose up --build
```

In another terminal:

```powershell
Set-Location .\server
python manage.py runserver 8000
```

The Code Engine-compatible Flask service can be run locally with:

```powershell
Set-Location .\server\djangoapp\microservices
python app.py
```

## Linux/bash

```bash
cd server
python3 -m pip install -r requirements.txt
python3 manage.py migrate
cd database
npm install
docker compose up --build
```

In another terminal, run `python3 manage.py runserver 8000`. Run the Flask service with `python3 app.py` from `server/djangoapp/microservices`.

Set `BACKEND_URL` and `SENTIMENT_ANALYZER_URL` when the services are not on their local defaults. The legacy lowercase names in `server/djangoapp/.env` are still accepted for course compatibility.
