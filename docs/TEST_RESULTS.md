# Local test results

This document records observed local checks. It does not claim hosted GitHub or
IBM Cloud execution.

| Check | Result |
| --- | --- |
| Python 3.12.10, Node 24.18.0, npm 12.0.2 | PASS |
| Docker Desktop 4.95.0 / Engine 29.8.2 / Compose v5.6.0 | PASS at baseline |
| `python manage.py check` | PASS; no issues after configuration repair |
| `python manage.py makemigrations --check --dry-run` | PASS; no changes detected |
| `python manage.py test` | PASS; 5 tests ran and passed |
| `CI=true npm run build` | PASS; strict React production build completed |
| `node --check server/database/app.js` | PASS |
| Python `py_compile` for changed services | PASS |
| Express/Mongo Compose build and health check | PASS; Mongo healthy and API healthy |
| Express `/fetchDealers`, `/fetchDealers/Kansas`, `/fetchDealer/3`, `/fetchReviews/dealer/29` | PASS; real responses returned |
| Flask image and positive/negative/neutral requests | PASS; real container responses returned |
| JSHint | PASS when invoked with expanded Windows file paths |
| Fresh Django image build | UNVERIFIED — DEFERRED TO IBM CLOUD; the last attempted build reached dependency installation, then BuildKit failed with `containerd-overlayfs/metadata_v2.db: read-only file system` and pip `Errno 30` |
| Full Django/API/sentiment Compose integration | UNVERIFIED — DEFERRED TO IBM CLOUD; this handoff phase intentionally performs no Docker build, Compose start, container restart, or retry |
| Hosted GitHub Actions | PENDING-GITHUB |
| IBM Code Engine/Registry/Kubernetes | PENDING-IBM-CLOUD |

The earlier claim that zero Django tests passed is obsolete: the repository now
contains five deterministic tests covering registration, duplicate/invalid login,
car seeding, anonymous review denial, and sentiment enrichment.

The last read-only Docker inspection showed that `docker version`, `docker ps -a`,
`docker volume ls`, and `docker system df` were readable. Mongo remained healthy
at that earlier checkpoint and the named `database_mongo_data` volume was
preserved. This handoff phase does not claim current container health and does
not run Docker commands.

Private cURL evidence remains under ignored `submission_option1/`. No cloud URL,
cloud response, or hosted workflow output is fabricated.

## Static handoff audit

- `server/Dockerfile` uses a React build stage and a Python 3.12 runtime,
  exposes port 8000, and starts Gunicorn through `entrypoint.sh`.
- `.env.example` contains placeholders and local defaults only; `.env` and
  SQLite files are ignored.
- `.github/workflows/main.yml` contains separate Python lint, JavaScript lint,
  strict React build, and Django validation jobs.
- `server/deployment.yaml` preserves the `dealership` Deployment name and reads
  runtime values from the `dealership-runtime` Kubernetes Secret. The ICR
  namespace and cloud values remain intentional placeholders.
- `git diff --check` and the tracked-file secret/generated-file audit must be
  run before publication; no commit or push is performed by this handoff.
