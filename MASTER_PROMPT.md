# MASTER EXECUTION PROMPT: IBM Full Stack Application Development Capstone
## Best Cars Dealership Review Portal | Local-first VS Code | ONE project folder | Option 1 ONLY

You are an autonomous senior full-stack engineer, Python/Django engineer, React engineer, Node/Express/MongoDB engineer, QA engineer, and DevOps engineer. Your job is to **actually IMPLEMENT, integrate, run, debug, test, and document** the complete IBM Full Stack Application Development Capstone Project in the currently opened VS Code workspace. Do not merely suggest a plan, produce isolated snippets, or stop after scaffolding. Work methodically until all locally achievable requirements below are fulfilled, and report actual verification results.

## A. NON-NEGOTIABLE PROJECT CONTRACT

1. **ONE cohesive repository, ONE top-level VS Code project folder:** Build a single complete "Best Cars" national US car-dealership review portal. Multiple services and directories inside this repository are intended; multiple unrelated projects are not. Do not create an alternative app in a second folder.
2. **Local development first, cloud later:** Finish the source code, local integration, local testing, Docker resources, CI workflow, Kubernetes manifests, documentation, and all locally collectible evidence now. The user will create/use their own GitHub fork and IBM Skills Network cloud lab later. Do NOT require IBM Cloud access to finish the local coding phase. Do NOT say cloud deployments, GitHub Actions runs, public GitHub links, or production screenshots are complete when they are not.
3. **Submission option fixed forever: OPTION 1 - AI-GRADED SUBMISSION AND EVALUATION.** Prepare only its specified final evidence, plus genuine prerequisite testing evidence. Never replace a required Option 1 cURL/terminal output or GitHub file URL with an Option 2 screenshot.
4. **Use the official IBM starter project**, not a replacement framework or unrelated template: https://github.com/ibm-developer-skills-network/xrwvm-fullstack_developer_capstone . If an IBM starter checkout already exists in the open workspace, inspect and enhance it in place. If the current workspace is genuinely empty, clone the official starter into THIS directory (not into a nested second project). If reference materials already make the folder nonempty, first identify the IBM checkout and use safe repository initialization; never overwrite reference documents or user files. Preserve git history when available.
5. **Do not fork, push, commit secrets, deploy, authenticate to external systems, spend money, or create cloud resources without the user's explicit separate instruction.** You may make local source changes, run installations, tests, and containers where available. Make sensible implementation decisions autonomously, and ask only if blocked by necessary permissions or a destructive operation.
6. **Exact rubric compatibility outranks aesthetics or architectural preferences.** Do not rename required files, URLs, API fields, components, ports, or evaluation labels. Modernize implementation safely without altering the required external behavior.
7. **No fabricated outcomes or evidence.** An example, sample, generated placeholder, mocked service response, or unexecuted command is not a passed test. Distinguish COMPLETED+VERIFIED, IMPLEMENTED+UNVERIFIED, and PENDING EXTERNAL STEP.
8. Read any `ibm_course_reference/` files available in the workspace before modifying code. They comprise the supplied course overview/transcripts, eight lab instructions, and official Option 1 rubric. This master prompt is self-contained on key acceptance requirements, but original labs are authoritative for detailed implementation. Avoid committing copied course-reference material to a public repo by default.

## B. PRIORITY WHEN SOURCE MATERIALS DISAGREE

1. Highest priority for deliverable names/formats/points: supplied **Final Submission > Option 1: AI-Graded Submission and Evaluation** rubric (28 tasks, 50 points).
2. Next for app behavior, architecture, and exact paths: supplied eight hands-on labs and use-case overview.
3. Next: actual files in the current IBM starter repository and their existing working contracts.
4. Last: optional enhancements, aesthetic choices, or illustrative code snippets. Some samples contain typos, outdated package pins, unsafe shortcuts, route-name differences, or incomplete snippets. Correct bugs while keeping the required tested behavior. Record any reconciliations in `docs/COURSE_COMPATIBILITY_NOTES.md`.
5. Specific discrepancies to handle intentionally: `/insert_review` in the Express lab versus `/insertReview` in a high-level architecture paragraph (make `/insert_review` work, optionally provide an alias); `/fetchReviews/dealer/:id` in the lab versus occasional singular wording; `CICD` in the final rubric versus `CI/CD` in a lab (use Windows-safe file basename `CICD`); and `logoutuser` without the accidental comma shown once in a lab. Do NOT switch the Flask/NLTK sentiment analyzer for IBM Watson or another unrelated service.

## C. REQUIRED APPLICATION AND STACK

Build **Best Cars Dealership**: a central dealership/review portal for a nationwide US car dealership. Provide a functional user journey for anonymous visitors, authenticated customers, and Django admins.

Maintain these technologies and their architectural roles:
- Django + Python + SQLite: main site, user and session authentication, Django admin, car-make/model database, API proxy views, and serving built React/static pages.
- React + React Router + HTML/CSS/Bootstrap: registration/login and dynamic dealer/review UI, integrated within Django as required by the starter. Keep standalone HTML static pages at IBM's paths.
- Node.js + Express + Mongoose + MongoDB: dealership and review REST endpoints using actual MongoDB, including Docker Compose for Express and MongoDB (port 3030).
- Flask + NLTK: real sentiment-analyzer microservice on port 5000. Run it locally in phase 1, deploy that SAME service to IBM Cloud Code Engine in phase 2.
- Docker, Docker Compose, GitHub Actions (Flake8 for Python and JSHint for JS), Gunicorn, Kubernetes, IBM Container Registry and Code Engine: implement local-ready artifacts, cloud deployment performed later.
- Django on port 8000; Express API on port 3030; Flask sentiment analyzer on port 5000. Keep ports configurable where useful but ensure those defaults work.

**User journeys**
- Anonymous visitors: view Home, About Us, Contact Us, dealer table, all states by default, state-filtered results, dealer details, and review cards; may navigate to Login and Register. They MUST NOT see a functional Write/Post Review control, and cannot submit reviews via API without authenticating.
- Registered users: sign up with username, first name, last name, email and password; are immediately signed in; can log in and log out with Django sessions; see their username; can select a dealer and submit a review. Show post-review buttons only when authenticated.
- Admin: use the Django admin to manage CarMake and CarModel (create, view, update, delete); a lab-only test superuser `root`/`root` is requested by the course, but never hardcode, auto-publish, or use that insecure combination in production. Provide instructions to create it interactively ONLY in the controlled grading lab.
- Review submission fields: `user_id` and reviewer `name` sourced from the Django authenticated user; `dealership` dealer identifier; text `review`; time `time` (set to the current timestamp); boolean `purchase`; optional `purchase_date`; `car_make`, `car_model`, and `car_year` selected from appropriate Django-provided values. Validate and save real data, return to dealer details after submission, and show the new review FIRST (newest timestamp descending), along with sentiment positive/neutral/negative.

## D. EXACT FILES, STRUCTURE AND COMPATIBILITY

Use the upstream starter as the actual base; do not invent a second architecture. At minimum, retain/create the following paths (use original files and casing where they already exist):

```
xrwvm-fullstack_developer_capstone/
  README.md
  .gitignore
  .github/workflows/main.yml
  server/
    manage.py
    requirements.txt
    Dockerfile
    entrypoint.sh
    deployment.yaml
    djangoproj/settings.py
    djangoproj/urls.py
    djangoapp/models.py
    djangoapp/admin.py
    djangoapp/views.py
    djangoapp/urls.py
    djangoapp/restapis.py
    djangoapp/populate.py
    djangoapp/microservices/   # existing Flask/NLTK files and Dockerfile
    database/app.js
    database/docker-compose.yml
    database/data/dealerships.json
    database/data/reviews.json
    frontend/static/Home.html
    frontend/static/About.html
    frontend/static/Contact.html
    frontend/src/App.js
    frontend/src/components/Register/Register.jsx
    frontend/src/components/Dealers/   # existing Dealers, Dealer, PostReview components
  docs/
    LOCAL_SETUP.md
    IBM_CLOUD_HANDOFF.md
    OPTION1_EVIDENCE_CHECKLIST.md
    TEST_RESULTS.md
    COURSE_COMPATIBILITY_NOTES.md
  scripts/                # optional reproducible helper commands
  submission_option1/     # private/local REAL evidence only; ignore from Git
```

Match actual starter filenames and avoid unnecessary refactors. Do not move the four GitHub-graded files:
- root `README.md` must contain the exact project name `fullstack_developer_capstone`.
- `server/frontend/static/About.html`
- `server/frontend/static/Contact.html`
- `server/frontend/src/components/Register/Register.jsx`

If the environment is Windows, provide working **PowerShell** commands plus Linux/bash equivalents for later IBM lab. Avoid relying on bash-only tooling for Windows local development. Use `curl.exe` rather than PowerShell's `curl` alias where applicable.

## E. IMPLEMENTATION TASKS BY COURSE LAB

### Lab 1: Static pages, Django startup
- Inspect the original skeleton and dependencies. Configure Django templates and static directories for the starter's `frontend/static` and production React build. Fix conflicting static paths cleanly.
- Implement a polished Home page with navigation including View Dealerships, About Us, Contact Us, Login/Register when logged out, username/Logout when logged in.
- Keep Home at `/`, About Us at `/about/`, and Contact Us at `/contact/`; support course-required navigation and Django routes. Use Bootstrap and local static assets.
- `About.html`: functioning CSS/Bootstrap links; Best Cars background, mission/values, realistic *fictional* team member names, roles, descriptions and contact emails, plausible team portraits with legal attribution or locally bundled assets. Do not publish unrelated real people's images as fictitious staff or use broken image URLs.
- `Contact.html`: active Contact Us navigation, complete fictional contact information, email/phone/website, attractive sensible imagery, responsive design.
- Confirm `python manage.py check`, migrations and Django development server work; retain real console output for Option 1 Task 2.

### Lab 2: User management
- Use Django's built-in auth and session management, not a disconnected JWT-only auth service.
- Implement `POST /djangoapp/login` accepting JSON `{"userName":"...","password":"..."}`; preserve expected status and `userName` JSON fields and proper session creation. Handle invalid credentials gracefully.
- Implement `GET /djangoapp/logout` for the exact lab contract and clear the session; also support secure modern logout behavior if possible without breaking the grader.
- Implement `POST /djangoapp/register` accepting `userName`, `password`, `firstName`, `lastName`, `email`; validate, create the user, log the user in immediately, return compatible JSON; handle duplicate usernames. Store password through Django password hashing, never plaintext.
- Add React UI routing for `/login/` and `/register/`. The `Register.jsx` at the exact graded path must visibly contain all FIVE labeled inputs plus Register button. Existing login panel or route should work.
- Ensure CSRF/session/cookie handling is coherent in browser and in documented cURL tests. Do not simply disable security across production. For compatibility with the supplied cURL example, document any restricted development-only behavior clearly and safely; preserve grading endpoints and method semantics.
- Provide repeatable local procedures to create a test customer and the lab-only admin account without committing private DB/credentials.

### Lab 3a: Express + MongoDB in Docker
- Inspect existing Mongoose dealer/review schemas and supplied data (`server/database/data/dealerships.json`, `reviews.json`). Do not substitute hardcoded fake API arrays or delete source datasets.
- Initialize and seed MongoDB reproducibly/idempotently. Prefer starter-provided initialization behavior when functional.
- Implement and TEST real endpoints at Express port 3030:
  `GET /fetchReviews`
  `GET /fetchReviews/dealer/:id`
  `GET /fetchDealers`
  `GET /fetchDealers/:state` (case-aware, Kansas must work)
  `GET /fetchDealer/:id`
  `POST /insert_review` (accept valid full review payload, persist it)
- Use appropriate success/error response formats and JSON. Keep compatibility with the actual starter callers, including field names and ID types.
- Dockerize Express and MongoDB with `server/database/docker-compose.yml` and its app Dockerfile, and document `docker compose up --build` (plus legacy lab `docker-compose` if relevant). Confirm endpoints with actual cURL requests.

### Lab 3b: CarMake/CarModel Django models and admin
- In `server/djangoapp/models.py`, implement `CarMake` (name, description, readable `__str__`) and `CarModel` (ForeignKey CarMake, name, type choices such as Sedan/SUV/Wagon, year, dealer ID if required by actual starter/specification, readable `__str__`, realistic validation).
- Register both models with Django Admin so their content can be managed. Create valid migrations that work from a CLEAN checkout.
- Implement `/djangoapp/get_cars` returning the expected `CarModels` JSON with `CarModel` and `CarMake` fields. Seed the lab's five makes and fifteen example models idempotently (Nissan, Mercedes, Audi, Kia, Toyota; example models in course files); avoid duplicates and do not rely on a manually copied SQLite file.
- Verify both API and admin forms. Support lab-only `root` user creation and login/logout proof without committing `root/root` credentials to a public repository.

### Lab 3c: Django proxy APIs + Flask NLTK sentiment
- Build robust Django HTTP proxy in `djangoapp/restapis.py` using `requests`, env-configured backend service base URL and sentiment analyzer base URL, request timeouts, correct URL escaping, failure handling, and JSON shapes compatible with starter components.
- Implement/test Django app endpoints (preserve existing slash variants where necessary):
  `GET /djangoapp/get_dealers` (all)
  `GET /djangoapp/get_dealers/<state>`
  `GET /djangoapp/dealer/<int:dealer_id>`
  `GET /djangoapp/reviews/dealer/<int:dealer_id>` (each review enriched with sentiment)
  `POST /djangoapp/add_review` (authenticated only)
  `GET /djangoapp/get_cars`
- Keep separate FRONTEND routes `/dealer/:id` and `/postreview/:id`; do not accidentally shadow API routes under `/djangoapp/`.
- Inspect/preserve starter Flask service `server/djangoapp/microservices/sentiment_analyzer.py` and Dockerfile; use NLTK sentiment. Expose `GET /analyze/:text` returning e.g. `{"sentiment":"positive"}`; `/analyze/Fantastic%20services` MUST return positive. Test negative/neutral as well.
- During VS Code phase point Django at the locally RUNNING Flask URL (port 5000). After deployment switch to REAL IBM Code Engine URL by environment variable/configuration, not by editing hardcoded source. No dummy cloud URL or mocked sentiment result in final code.
- Server must derive `user_id` and reviewer identity from the authenticated Django request, not trust client-submitted identity; reject unauthenticated review posts. Preserve purchase/car fields.

### Lab 4: Dynamic React pages
- Integrate the starter's React components and Django routes:
  `/dealers` -> Dealers list/table
  `/dealer/:id` -> Dealer details + reviews
  `/postreview/:id` -> Submit review form (authenticated only)
  `/login`, `/register` -> Login and registration
- Show all dealerships by default and support Show All or any US state in a dropdown with Kansas verified; clicking a dealer name opens details; reviews rendered as Bootstrap cards with review content, reviewer, vehicle/purchase fields and sentiment. Work for an anonymous visitor.
- On authenticated views show the correct username and a visible Write a Review/Review Dealer action per dealer; never show it for anonymous users.
- PostReview form: valid review text, purchase checkbox, optional purchase date, dependent car make/model (and year) dropdowns using Django car data. Validate fields, call Django API, redirect to dealer detail, and display the NEW review FIRST with its sentiment.
- Implement loading/error/empty states, accessible form labels and keyboard navigation, mobile layout, and no broken images. Keep rubric-visible labels/features easy to identify, even with nicer styling.

### Lab 5a: GitHub Actions CI/CD lint workflow
- Create `.github/workflows/main.yml` matching the lab's "Lint Code" behavior, triggered on `push` and `pull_request` to `main` and `master`.
- Python job: Python 3.12, Flake8 over project Python source (excluding virtualenv/build/vendor directories, as configured).
- JavaScript job: Node.js environment, JSHint over `server/database/**/*.js`; configure compatible ES version or equivalent so modern valid syntax does not spuriously fail. Optionally add React lint/tests without replacing the TWO required jobs.
- Fix all reported lint violations rather than swallowing errors with `|| true` or by disabling the checks wholesale. Run equivalent local lints now. The GitHub Actions hosted RUN and `CICD` evidence remain PENDING until the user pushes to GitHub.

### Lab 5b: Docker, IBM registry and Kubernetes
- Produce a working Django/Gunicorn `server/Dockerfile` based on a Python 3.12 runtime, `server/entrypoint.sh` for migrations/static collection/startup, `.dockerignore`, environment configuration, static file serving plan, and `server/deployment.yaml` targeting image `us.icr.io/<actual-namespace>/dealership:latest` after later substitution.
- Ensure React assets are built/copied before Django image build; build and run the Django container LOCALLY now wherever tooling is available.
- Create valid Kubernetes deployment resource(s) exposing Django container port 8000, with settings/secrets injected safely. If appropriate include an internal Service, but preserve `kubectl port-forward deployment.apps/dealership 8000:8000` used by the lab. Do not hardcode a made-up IBM registry namespace, Code Engine URL, or user credentials.
- Do not mark registry push, Kubernetes rollout, external URL, or deployed screenshots complete before IBM Cloud lab execution.

## F. REQUIRED LOCAL TEST MATRIX (EXECUTE, NOT JUST DOCUMENT)

Before reporting local completion, run or genuinely attempt and record:
1. Python package install, Django `check`, migrations from a clean DB, and Django server startup; no syntax/import errors.
2. Frontend `npm install` / `npm ci` as appropriate and `npm run build`; built site served by Django.
3. Express/Mongo containers start; data seeded; cURL returns valid dealer/review JSON, including Kansas and a known ID (3 where present; reviews for 29 or another seeded dealer with data).
4. Local Flask starts and real NLTK classification verifies `Fantastic services` positive, plus negative and neutral test cases.
5. Django proxy calls reach the live Express service and local sentiment microservice. Verify failures are handled when service is unavailable.
6. Register -> automatically authenticated -> login/logout -> subsequent anonymous state; bad credentials/duplicate username rejected; admin models manageable.
7. Anonymous user can browse and is forbidden from POSTing a review; authenticated user posts a review, it appears at the top of the correct dealer's page with sentiment.
8. State dropdown filters correctly; all states returns all dealers; dealer links navigate to populated detail page.
9. Flake8, JSHint, Django unit/integration tests, and any frontend tests pass. Add meaningful automated tests when absent (especially auth, proxy APIs, permissions, reviews, sentiment).
10. Build Docker images and exercise `docker compose`/Django container if Docker Desktop is available. If unavailable, write exact reproducible commands and mark unverified, not passed.
11. Verify there is no accidental `.env`, API token, secret key, private SQLite user database, `node_modules`, Python virtualenv, or test-account credentials ready to be committed.
12. Review screens at desktop/mobile widths if a browser automation or preview capability is available. If screenshots are not obtainable, flag evidence as pending and write capture instructions; NEVER fake screenshots.

For each test, include command, result, observed output excerpt, and status (PASS/FAIL/BLOCKED) in `docs/TEST_RESULTS.md`. Fix failures and re-run tests. Document any environment constraints honestly.

## G. ALL 28 FINAL RUBRIC TASKS: OPTION 1 ONLY (50 POINTS)

Produce `docs/OPTION1_EVIDENCE_CHECKLIST.md` containing exactly these tasks, evidence location and status (LOCAL-READY, VERIFIED, or PENDING-GITHUB / PENDING-IBM-LAB). Do NOT fabricate terminal output, GitHub links or cloud screenshots. The final evaluation expects these exact evidence item names:

**Module 1 / Static Pages (7 points)**
- Task 01, 1 point: PUBLIC GitHub URL to root `README.md` containing `fullstack_developer_capstone`. PENDING-GITHUB until fork/push.
- Task 02, 1 point: text file `django_server` containing GENUINE terminal output showing a working Django development server. Capture locally if actually run.
- Task 03, 3 points: PUBLIC GitHub URL to `server/frontend/static/About.html`, with CSS links, meaningful realistic team imagery, names/roles/details/emails. PENDING-GITHUB until pushed.
- Task 04, 2 points: PUBLIC GitHub URL to `server/frontend/static/Contact.html` with required contact details and active Contact navigation. PENDING-GITHUB until pushed.

**Module 2 / Authentication (5 points)**
- Task 05, 2 points: `loginuser` file with actual POST login cURL COMMAND + returned RESPONSE; use a disposable account. When testing persistent session, save local cookie jar and reuse on logout; never publish private passwords in repository.
- Task 06, 2 points: `logoutuser` file with actual GET logout cURL COMMAND + returned RESPONSE using same authenticated cookie session where applicable.
- Task 07, 1 point: PUBLIC GitHub URL to `server/frontend/src/components/Register/Register.jsx` showing five inputs and Register action. PENDING-GITHUB until pushed.

**Module 3 / Backend + Django Models + Sentiment (17 points)**
- Task 08, 2 points: `getdealerreviews` actual cURL command+response for `/fetchReviews/dealer/<id>` where reviews exist.
- Task 09, 2 points: `getalldealers` actual cURL command+response for `/fetchDealers`.
- Task 10, 2 points: `getdealerbyid` actual cURL command+response for `/fetchDealer/<id>`.
- Task 11, 2 points: `getdealersbyState` actual cURL command+response for `/fetchDealers/Kansas` (preserve capital S in basename).
- Task 12, 2 points: REAL browser screenshot `admin_login.png` of Django admin with `root` user logged in. Do not create it synthetically.
- Task 13, 1 point: REAL browser screenshot `admin_logout.png` showing root has logged out from the admin page.
- Tasks 14 & 15, 4 points COMBINED: `getallcarmakes` actual cURL command+response for `/djangoapp/get_cars` with real seeded make/model records. One output covers both tasks.
- Task 16, 2 points: `analyzereview` actual cURL command+response for `GET <REAL-CODE-ENGINE-URL>/analyze/Fantastic%20services` showing positive. PENDING-IBM-LAB; a locally tested Flask response is only preliminary proof.

**Module 4 / Dynamic Pages (9 points)**
- Task 17, 1 point: REAL screenshot `get_dealers.png` of dealer listing while LOGGED OUT, address-bar endpoint visible.
- Task 18, 2 points: REAL screenshot `get_dealers_loggedin.png` while LOGGED IN, username and Write/Review Dealer option clearly visible, address bar visible.
- Task 19, 2 points: REAL screenshot `dealersbystate.png` after filtering by a state, with address bar visible.
- Task 20, 1 point: REAL screenshot `dealer_id_reviews.png` of selected dealer details and actual reviews, with address bar visible.
- Task 21, 1 point: REAL screenshot `dealership_review_submission.png` of the completed Post Review form BEFORE submitting, with address bar visible.
- Task 22, 2 points: REAL screenshot `added_review.png` AFTER submitting that SAME review, with details and sentiment visible; address bar visible.

**Module 5 / CI + Deployment (12 points)**
- Task 23, 3 points: `CICD` (not `CI/CD`) containing REAL GitHub CLI output showing successful workflow execution AND executed steps (`gh run list`, `gh run view <run-id> --verbose`, plus logs if needed). PENDING-GITHUB.
- Task 24, 1 point: `deploymentURL` text file containing actual Django application's IBM lab deployment URL. PENDING-IBM-LAB.
- Task 25, 2 points: REAL screenshot `deployed_landingpage.png` of the IBM Kubernetes deployment landing/login page, browser address bar visible and base URL matching Task 24.
- Task 26, 2 points: REAL screenshot `deployed_loggedin.png` of same deployed app logged in with username visible and URL matching Task 24.
- Task 27, 2 points: REAL screenshot `deployed_dealer_detail.png` of same deployed app's dealer detail/reviews page, URL matching Task 24.
- Task 28, 2 points: REAL screenshot `deployed_add_review.png` of posted review on same deployed app with sentiment and URL matching Task 24.

Evidence arithmetic: 4 PUBLIC source-file URLs + 10 command/terminal outputs + 12 genuine screenshots + 1 deployed URL = 27 DISTINCT task-specific evidence items covering 28 tasks. Keep the overall public fork URL ready as additionally requested by the submission overview. Maintain the five separate Coursera module checklist assessments too (38 points in the course's separate rubric); do not claim they are automatically submitted through source code.

**Evidence rules**
- Preserve the exact spelling, casing and extension for each rubric filename. Use `.png` consistently for the 12 screenshots.
- Every cURL evidence file contains BOTH the complete executed command and its truthful terminal output. Do not silently substitute a sample JSON response.
- For authentic screenshot tasks, show the actual browser URL and relevant visible application content. No cropping away the address bar; keep input and resulting review consistent.
- Store actual evidence locally in `submission_option1/`, but ignore this folder in Git to protect secrets/session details; keep a non-secret checklist in `docs/OPTION1_EVIDENCE_CHECKLIST.md` tracked in Git.
- If a file's proof requires GitHub or IBM Cloud, mark pending until available. Do NOT create empty files pretending to be complete.
- Option 1 is the ONLY final submission path. Do not produce Option 2 peer-grading artifacts as replacements.

## H. IBM CLOUD HANDOFF DOCUMENT: PREPARE NOW, EXECUTE LATER

Create `docs/IBM_CLOUD_HANDOFF.md` with safe, chronological, copy-paste-ready commands that users can run in IBM Skills Network lab AFTER GitHub is set up. Include precise locations, prerequisites and placeholder explanations:

1. Later create a fork with EXACT repo name `xrwvm-fullstack_developer_capstone` from the official IBM upstream. Explain how to point the existing local checkout's Git `origin` to the user's fork (preserving an `upstream` remote where helpful); check branches, commit and push changes. Do not push for the user now. Explain public GitHub URLs for README/About/Contact/Register.
2. In IBM Cloud IDE terminal, clone the fork into `/home/project` (or `git pull` if present). If Code Engine CLI is a SEPARATE workspace, clone the same fork there too. Labs may reset; treat GitHub as source of truth.
3. Install dependencies, start Docker Desktop/daemon as provided; from `server/database` run the Express/Mongo compose services and confirm port 3030. Find the lab's externally routable Backend launch URL and set Django's backend URL environment value WITHOUT accidental double slashes.
4. In the lab's **Code Engine CLI** create/start the Code Engine project per lab, obtain real `${SN_ICR_NAMESPACE}` and registry credentials/secret `icr-secret`. Go to `server/djangoapp/microservices`; build/push `us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer`; deploy with `ibmcloud ce application create --name sentianalyzer --image us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer --registry-secret icr-secret --port 5000` (adapt if already created). Copy real Code Engine URL to Django sentiment config, test `/analyze/Fantastic%20services`, capture actual `analyzereview` command/output.
5. Back in IDE/build environment, build React (`npm install`/`npm run build`), run Django migrations, set ALLOWED_HOSTS/CSRF origins from actual lab URL, test Django site. Collect actual source, terminal, and browser evidence.
6. Build Django Docker image from `server/`, tag and push `us.icr.io/${SN_ICR_NAMESPACE}/dealership:latest` to IBM Container Registry, replace Kubernetes deployment's image placeholder with that REAL tag, run `kubectl apply -f server/deployment.yaml` from correct directory or `kubectl apply -f deployment.yaml` while in server; inspect pods and logs; use `kubectl port-forward deployment.apps/dealership 8000:8000` and Skills Network's Launch Application (port 8000). The externally visible launched URL is `deploymentURL`; it must be the SAME base URL visible in screenshots 25-28.
7. Explicitly instruct creation/verification of an appropriate admin demo account and test-user account in the running Django/Kubernetes deployment, without committing credentials or relying on a locally tracked `db.sqlite3`; explain SQLite persistence caveats for restartable containers.
8. Explain how to verify GitHub Actions status after pushing (`gh auth login`, `gh run list`, `gh run view <run-id> --verbose`), capture real `CICD` evidence including steps, and fix failing jobs.
9. Collect remaining screenshot files and outputs exactly per Option 1 checklist, confirm URL consistency and genuine results, then submit to Option 1 AI grader in Coursera. The rubric says the URL need not remain accessible later, but must have been real and must match screenshot addresses.
10. Mark environment-specific variables like namespace, registry secret, launch URL, backend URL and Code Engine URL as placeholders until the user supplies them; NEVER pretend they were issued or verified.

## I. QUALITY, SECURITY AND HONESTY STANDARDS

- Keep the UI premium, clean, professional, Bootstrap-compatible and responsive, but never prioritize styling over functional rubric acceptance. Keep headings, feature labels, forms, dealer tables and reviews obvious to graders.
- Use semantic HTML, labels, keyboard accessibility, readable contrast, working navigation, skeleton/loading/error states and graceful empty data.
- Preserve starter compatibility for Django routes, React build, SQLite migrations, database seeds and JSON payload fields.
- Set Django `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, CSRF trusted origins, backend URL, sentiment URL, Mongo connection string through secure env configuration. Commit only `.env.example`; ignore real `.env` and test credential files. Avoid wildcard host origins in deployed settings.
- Do not commit `.env`, virtualenv directories, node_modules, NLTK caches, private db.sqlite3/user data, sensitive logs, or evidence with passwords/session cookies. Do not introduce blanket CSRF exemptions for production just to make a local test pass; if an instructional endpoint genuinely requires an exception, isolate and document it for the course's controlled environment.
- Persist review data in MongoDB, not browser localStorage. Do not use hard-coded demo dealer data in the React UI. Use seeded source data via real backend services.
- Do not silently replace SQLite with PostgreSQL, React with Next.js, Django with Flask, NLTK with Watson, or GitHub Actions with another CI system. Extras are allowed only when they do not harm IBM rubric compatibility.
- On Windows, provide PowerShell steps and `curl.exe`; in cloud, provide Linux commands. If `docker compose` is unavailable, note dependencies honestly.
- If you find bug-prone official sample code (e.g., broad `except`, missing HTTP timeouts, insecure auth, stale year validator, bad Docker ENV setting, missing slash handling), implement a correct robust variant without breaking assessed endpoints.

## J. DEVELOPMENT EXECUTION STRATEGY (DO THIS IN THE WORKSPACE)

1. Audit and inventory actual repository: list folders, discover existing components, package manifests, datasets, tests, TODOs and state. Read course reference materials if mounted. Make a concise status plan and requirements-to-file mapping, then immediately IMPLEMENT.
2. Implement in coherent modules but inside ONE repo: static pages -> auth -> Mongo/Express -> Django car models -> Flask sentiment/proxy -> React dynamic UI -> Docker -> GitHub Actions -> Kubernetes artifacts.
3. After each module, run focused tests and fix failures rather than leaving code inconsistent. Use actual seed datasets and env examples.
4. Build full end-to-end local setup. Aim for simple reproducible startup (document separate terminals or add non-disruptive helper scripts); do NOT require IBM Cloud to run locally.
5. Create/upgrade README with literal exact project name `fullstack_developer_capstone`, project description, technology/architecture, all local setup/test commands, routes and APIs, demo workflows, cloud handoff and source acknowledgments. Keep README publicly safe.
6. Write `docs/LOCAL_SETUP.md`, `docs/IBM_CLOUD_HANDOFF.md`, `docs/OPTION1_EVIDENCE_CHECKLIST.md`, `docs/TEST_RESULTS.md`, `docs/COURSE_COMPATIBILITY_NOTES.md`; add optional useful scripts/tests. Ensure clear Windows VS Code instructions.
7. When local implementation is complete, perform final full test pass, inspect files and routes against ALL 28 rubric tasks, and produce a final report formatted as:
   - Repo/folder location and summary of files added/modified.
   - Features and modules genuinely working locally.
   - Commands executed and actual results; tests passed/failed/blocked.
   - Exactly which Option 1 evidence items are complete, and which remain for GitHub/IBM Cloud.
   - Exact next steps for the user: create fork/push -> clone in lab -> Code Engine -> Kubernetes -> capture evidence -> submit.
8. IMPORTANT: Do not claim GitHub or cloud tasks were completed if user has not yet supplied access, URLs, credentials or authorized deployment. Stop ONLY when all accessible local tasks are finished, tested to the extent possible, and remaining external tasks are explicitly documented. If unable to execute a local test due to a missing tool, record blocker and next command; continue other local work.

**START IMPLEMENTING NOW. The deliverable is the complete working LOCAL CODEBASE, not an outline or another prompt. Respect OPTION 1 ONLY, ONE PROJECT FOLDER, IBM STARTER COMPATIBILITY, and HONEST EVIDENCE STATUS throughout.**
