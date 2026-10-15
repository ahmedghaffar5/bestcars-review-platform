# Local setup

These commands are for the existing Windows checkout. Run PowerShell commands
from the repository root:

```powershell
python --version
node --version
npm --version
docker version
docker compose version
python -m pip install -r .\server\requirements.txt
```

## MongoDB and Express

```powershell
Push-Location .\server\database
docker compose config
docker compose up --build -d
docker compose ps
Pop-Location
curl.exe -i http://localhost:3030/fetchDealers
curl.exe -i http://localhost:3030/fetchDealers/Kansas
curl.exe -i http://localhost:3030/fetchDealer/3
curl.exe -i http://localhost:3030/fetchReviews/dealer/29
```

The Compose file uses the named `database_mongo_data` volume. Do not use
`docker compose down -v` when testing persistence.

## Flask sentiment service

```powershell
Push-Location .\server\djangoapp\microservices
docker build -t bestcars-sentiment:local .
docker run --rm -p 5000:5000 bestcars-sentiment:local
Pop-Location
curl.exe http://localhost:5000/analyze/Fantastic%20services
curl.exe http://localhost:5000/analyze/Terrible%20service
curl.exe http://localhost:5000/analyze/The%20car%20is%20blue
```

The image downloads the VADER lexicon during the image build, so runtime does not
depend on an internet download.

## Django and React development checks

```powershell
Push-Location .\server
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py migrate
python manage.py test
python manage.py runserver 8000
Pop-Location

Push-Location .\server\frontend
npm ci
$env:CI = 'true'
npm run build
Remove-Item Env:CI -ErrorAction SilentlyContinue
Pop-Location
```

Use `/djangoapp/csrf` before a browser or cURL review POST when a CSRF cookie is
needed. Login and registration retain their IBM-compatible JSON contracts; logout
supports the required GET route and ends the server session.

## Full local Compose topology

To run Django with service-DNS URLs (`api:3030` and `sentiment:5000`):

```powershell
Push-Location .\server
docker compose -f docker-compose.local.yml config
docker compose -f docker-compose.local.yml up --build -d
docker compose -f docker-compose.local.yml ps
Pop-Location
```

Stop only this stack with `docker compose -f .\server\docker-compose.local.yml
down`; omit `-v` to preserve Mongo and SQLite data.

If Docker reports `containerd-overlayfs/metadata_v2.db: read-only file system`
during a build, stop and resolve Docker Desktop storage/engine health before
retrying. Do not use `docker system prune`, reset Docker Desktop, or delete
volumes as a workaround for this project.

Linux uses the same commands with `/` paths and `curl` instead of `curl.exe`.
