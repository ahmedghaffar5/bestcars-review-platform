# Local setup

Run commands from the repository root unless a step changes directory.
Use a new local checkout or a separate branch; do not replace a live lab deployment.

## Tools

- Python 3.12 for the Django application; Python 3.10+ for the setup helper.
- Node.js 22 and its npm distribution.
- Docker with Compose v2.
- Free ports 8000, 3030, and 5000.

## Setup, both PowerShell and bash

```text
python scripts/init_env.py
cd server/frontend
npm ci --include=dev --no-audit --no-fund
npm run build
cd ../..
docker compose --env-file .env -p bestcars-portfolio -f server/docker-compose.local.yml up --build -d
```

On Linux use `python3` where appropriate. Review `.env` locally, not in a public
issue or screenshot. The helper refuses to replace existing settings.

The frontend production command compiles the pinned Tailwind 3.4 stylesheet,
synchronizes it into `server/frontend/static/css/` for Django-served previews,
and then builds the React bundle. During UI work, run
`npm run css:watch` from `server/frontend`; restart/rebuild the Django preview
after changes so its static-file collection sees the generated stylesheet.

The Compose stack uses internal URLs `http://api:3030` and
`http://sentiment:5000`. It does not use IBM proxy URLs. Published demo ports bind
to `127.0.0.1`; MongoDB is not published to the host. Existing lab containers that
already use these ports must be stopped deliberately, without deleting volumes.

Open `http://localhost:8000/` and register through the UI. Create an admin:

```text
docker compose --env-file .env -p bestcars-portfolio -f server/docker-compose.local.yml exec django python manage.py createsuperuser
```

## Status, logs, checks

```text
docker compose --env-file .env -p bestcars-portfolio -f server/docker-compose.local.yml ps
docker compose --env-file .env -p bestcars-portfolio -f server/docker-compose.local.yml logs --tail=50
python scripts/smoke_http.py --base http://localhost:8000 --integration
```

To stop without deleting the named volumes:

```text
docker compose --env-file .env -p bestcars-portfolio -f server/docker-compose.local.yml down
```

Do not add `--volumes` unless intentionally discarding local database contents.

## Application-only development

Start the Compose backend and sentiment services first:

```text
docker compose --env-file .env -p bestcars-portfolio -f server/docker-compose.local.yml up --build -d api sentiment
```

Create and activate a Python virtual environment, install
`server/requirements.txt`, build React as above, then run:

```text
cd server
python manage.py migrate
python manage.py runserver 8000
```

Virtual environment activation is `.venv\Scripts\Activate.ps1` in PowerShell or
`source .venv/bin/activate` in bash. The root `.env` is loaded before Django
settings are read; shell environment variables take precedence.

## Blank React pages

Do not copy files into a live pod as a permanent fix. Confirm the build exists,
rebuild the image, and run `scripts/smoke_http.py` against it. That check verifies
actual script and stylesheet responses, not just HTTP 200 for the HTML shell.

## npm or network failures

Run `npm ci` outside the Python Docker build. Keep `package-lock.json` and do not
use `npm audit fix --force` as an automatic response to warnings. If npm fails,
stop: an incomplete install is not a usable frontend bundle.

## Known boundaries

Package versions are not fully locked for the Python environment, and inherited
frontend dependencies still need a separate security review. See `SECURITY.md`.
