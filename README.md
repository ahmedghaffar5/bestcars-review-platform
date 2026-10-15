# fullstack_developer_capstone

Best Cars is a Django, React, Express/MongoDB, and Flask/NLTK dealership review
portal based on the IBM Full Stack Application Development Capstone starter.

## Local architecture

| Service | Local URL | Responsibility |
| --- | --- | --- |
| Django/Gunicorn + React | http://localhost:8000 | UI, sessions, SQLite car data, proxy APIs |
| Express/MongoDB | http://localhost:3030 | Dealer and review data |
| Flask/NLTK VADER | http://localhost:5000 | Review sentiment |

The application uses server-side Django sessions for authentication. Review writes
use the authenticated Django user identity and CSRF protection. Environment-specific
URLs and secrets belong in a local `.env`; copy [.env.example](.env.example) as a
starting point and never commit the real file.

## Local verification

Read [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md) for Windows PowerShell and Linux
commands. The original Mongo/API stack is in
[server/database/docker-compose.yml](server/database/docker-compose.yml). The
full local service topology is in
[server/docker-compose.local.yml](server/docker-compose.local.yml).

Required application routes include `/`, `/about/`, `/contact/`, `/dealers/`,
`/dealer/<id>/`, `/postreview/<id>/`, `/login/`, `/register/`, and the Django
API routes under `/djangoapp/`.

## IBM submission handoff

Local evidence is tracked honestly in
[docs/OPTION1_EVIDENCE_CHECKLIST.md](docs/OPTION1_EVIDENCE_CHECKLIST.md).
GitHub-hosted workflow evidence and IBM Cloud Code Engine, Registry, Kubernetes,
and deployed URL evidence are intentionally pending. See
[docs/IBM_CLOUD_HANDOFF.md](docs/IBM_CLOUD_HANDOFF.md) for future-only commands.

No GitHub push, registry push, IBM Cloud deployment, or final submission is
performed by this local workflow.
