# Deployment

## Build strategy

Build the React bundle on the host/CI runner, then package it in the Python image:

```bash
cd server/frontend
npm ci --include=dev --no-audit --no-fund
CI=true npm run build
cd ..
docker build -t bestcars:local .
```

This is an intentional two-step build. `.dockerignore` excludes host dependencies,
private configuration, and generated Django static output, but includes the
fresh React bundle. Startup performs migrations and `collectstatic`.

## Local Compose is the default demonstration

See [LOCAL_SETUP.md](LOCAL_SETUP.md). Named volumes preserve the local databases.
Do not run the new stack over an existing MongoDB volume from a different major
version without a migration plan.

## IBM cloud demonstration

The completed lab used Express/MongoDB in the IDE, Flask on Code Engine, and a
Django Deployment in the Code Engine Kubernetes context. That is the historical
setup, not a recommendation to depend on temporary IDE endpoints in production.

Use the actual provisioned project, region, namespace, registry secret, and
Kubernetes context. Do not use another person's namespace or hardcode an expired
Skills Network proxy hostname.

1. Build/push the sentiment image from `server/djangoapp/microservices`.
2. Create or update the Code Engine sentiment application on port 5000.
3. Test its real URL. Scale-to-zero can exceed the existing Django request
   timeout. For a short demo, a minimum scale of one can keep it ready; this may
   incur charges or consume lab quota, so turn it down after the demonstration.
4. Build/push the Django image from `server`, after building React.
5. Configure a reachable Express backend, sentiment URL, allowed hostnames, CSRF
   origins, and a generated Django secret. Keep these values outside Git.
6. Use the configured manifest and the proper Kubernetes context; do not assume
   a new terminal inherits `KUBECONFIG` from an existing terminal.

## Manifest requirements

`server/deployment.yaml` is a template. Replace its image placeholder with an
image you built and pushed. It references `icr-secret` for image pulling and a
`dealership-runtime` Secret with these keys:

```text
backend-url
sentiment-analyzer-url
django-secret-key
django-allowed-hosts
csrf-trusted-origins
```

Store actual values in a private file OUTSIDE the checkout, then create the
Secret from that file using the context/namespace you have verified. Do not put
secret values into the sample manifest. All required keys must exist before
applying it.

```bash
kubectl config current-context
kubectl get namespace
kubectl apply -f server/deployment.yaml
kubectl rollout status deployment/dealership --timeout=240s
kubectl get pods -l run=dealership
kubectl logs deployment/dealership --tail=50
```

The template keeps one replica, explicit CPU/memory, HTTPS cookie settings, and
registry credential references. These are source configuration changes only;
applying the kit does not patch a live deployment or read a runtime Secret.

## Static files and data

Run `python scripts/smoke_http.py --base http://YOUR_HOST` after deployment to
check HTML plus its JavaScript/CSS. No `kubectl cp` or manual pod edit should be
needed. Use HTTPS for browser authentication.

The example SQLite database is inside the pod unless storage is added. A rollout
can lose accounts and sessions. For a durable public demo, supply a storage plan
or move Django to PostgreSQL. MongoDB also needs controlled persistence and
backups. Do not claim high availability from this single-replica manifest.

## Diagnostics

- `ImagePullBackOff` plus HTTP 401: verify namespace-local `imagePullSecrets`.
- HTTP 400: verify `DJANGO_ALLOWED_HOSTS` uses hostnames, not full URLs.
- CSRF errors in admin: verify HTTPS origins and reverse-proxy settings.
- Blank React view: inspect JavaScript/CSS HTTP status and content types.
- Reviews HTTP 503: test both upstream services from the Django container.
- Lost browser proxy after rollout: restart the intended port-forward session.

No automatic cleanup/destruction commands are included. Preserve screenshots,
configuration, and data backups before ending a temporary lab session.
