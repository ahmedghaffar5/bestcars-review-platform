# Local test results

These are results from the final local audit. The private cURL response files are under ignored `submission_option1/`.

| Command/check | Result |
| --- | --- |
| `python manage.py check` | PASS: no system-check issues |
| `python manage.py migrate --noinput` | PASS: no migrations pending |
| `python manage.py test` | PASS with no tests discovered (`Ran 0 tests`) |
| `npm run build` in `server/frontend` | PASS: production build generated; CRA emitted existing warnings for BOM/hooks/autoprefixer |
| `python -m py_compile ...` and `node --check database/app.js` | PASS |
| Flake8 over application Python, excluding generated migrations | PASS |
| JSHint over database JavaScript with `server/database/.jshintrc` | PASS |
| Flask `/analyze/Fantastic%20services` | PASS: `{"sentiment":"positive"}` |
| Flask `/analyze/Terrible%20service` | PASS: `{"sentiment":"negative"}` |
| Django register/login/logout/proxy/car/review/permission flow | PASS: 201, 200, 200, 200, 200, 200, 200, 403 observed |
| Express required endpoints against real local MongoDB | PASS: all endpoint requests returned 200 |
| Express review persistence after API restart | PASS: inserted review remained in the same MongoDB data directory |
| `docker compose ... config` | PASS: Compose file parses |
| `docker info`, Docker Compose build, and service status | PASS: Docker Desktop engine available; MongoDB and Express containers running |

The Docker-backed review audit reproduced and fixed the Express/Mongoose validation failure caused by requiring an empty optional `purchase_date`. Both purchase paths were inserted into MongoDB, the API was restarted, and the new reviews remained available in newest-first order. The authenticated Django flow also persisted server-derived reviewer identity and sentiment.
