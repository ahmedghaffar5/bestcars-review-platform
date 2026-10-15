# Option 1 evidence checklist

Option 1 is the only submission path used here. Local command evidence is stored privately in ignored `submission_option1/` when captured; no external URL or screenshot is fabricated.

| Task | Evidence | Status |
| --- | --- | --- |
| 01 | Public GitHub README URL | PENDING-GITHUB |
| 02 | `submission_option1/django_server` | LOCAL-READY |
| 03 | Public GitHub `server/frontend/static/About.html` URL | PENDING-GITHUB |
| 04 | Public GitHub `server/frontend/static/Contact.html` URL | PENDING-GITHUB |
| 05 | `submission_option1/loginuser` | LOCAL-READY |
| 06 | `submission_option1/logoutuser` | LOCAL-READY |
| 07 | Public GitHub `Register.jsx` URL | PENDING-GITHUB |
| 08 | `submission_option1/getdealerreviews` | LOCAL-READY |
| 09 | `submission_option1/getalldealers` | LOCAL-READY |
| 10 | `submission_option1/getdealerbyid` | LOCAL-READY |
| 11 | `submission_option1/getdealersbyState` | LOCAL-READY |
| 12 | Real `admin_login.png` browser screenshot | PENDING-LOCAL-EVIDENCE |
| 13 | Real `admin_logout.png` browser screenshot | PENDING-LOCAL-EVIDENCE |
| 14 | `submission_option1/getallcarmakes` | LOCAL-READY |
| 15 | Same `getallcarmakes` output | LOCAL-READY |
| 16 | Real Code Engine `analyzereview` output | PENDING-IBM-LAB |
| 17 | Real logged-out dealer-list screenshot | PENDING-LOCAL-EVIDENCE |
| 18 | Real logged-in dealer-list screenshot | PENDING-LOCAL-EVIDENCE |
| 19 | Real state-filter screenshot | PENDING-LOCAL-EVIDENCE |
| 20 | Real dealer-detail/reviews screenshot | PENDING-LOCAL-EVIDENCE |
| 21 | Real pre-submit review-form screenshot | PENDING-LOCAL-EVIDENCE |
| 22 | Real post-submit review screenshot | PENDING-LOCAL-EVIDENCE |
| 23 | GitHub Actions `CICD` output | PENDING-GITHUB |
| 24 | IBM Kubernetes `deploymentURL` | PENDING-IBM-LAB |
| 25 | Deployed landing-page screenshot | PENDING-IBM-LAB |
| 26 | Deployed logged-in screenshot | PENDING-IBM-LAB |
| 27 | Deployed dealer-detail screenshot | PENDING-IBM-LAB |
| 28 | Deployed posted-review screenshot | PENDING-IBM-LAB |

Docker Compose configuration is prepared and parses successfully, but the Docker daemon is unavailable in this environment. Official Docker-based MongoDB evidence remains BLOCKED; the audit separately verified Mongoose persistence against a real local MongoDB daemon and did not treat the in-memory fallback as evidence.
