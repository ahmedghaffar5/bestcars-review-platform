# Security notes

Best Cars is an educational portfolio demonstration. Do not treat the current
code as a hardened public production service.

## Existing controls

Django stores hashed passwords and server-side sessions. Authenticated review
requests use the server's account identity. Deployment configuration accepts
secrets and service locations through environment variables. The local portfolio
Compose stack binds published ports to localhost and keeps MongoDB internal.

## Known limitations

- The inherited settings omit global `CsrfViewMiddleware`; login/registration
  retain exemptions. A frontend CSRF header alone is not server-side protection.
- Password validation is not called by the custom registration view.
- Logout supports GET for the starter contract.
- The Express insertion endpoint has no service-to-service authentication.
- Several dependencies are unpinned or inherited from the older frontend stack;
  a passing build is not a vulnerability audit.
- SQLite in the Kubernetes example is ephemeral without additional storage.

Address these before exposing a long-lived public service. Use demo data only,
private demo credentials, and HTTPS where authentication is exposed.

## Handling secrets

Never commit `.env`, cookie jars, kubeconfig, database files, cloud keys, personal
access tokens, evidence transcripts, or archives containing them. Removing a file
in a new commit does not remove it from Git history. Rotate any REAL secret that
was exposed; do not rewrite shared history casually.

## Reporting

Do not post credentials or exploit details in a public issue. Use GitHub's private
vulnerability reporting feature if the maintainer enables it, or an agreed private
contact channel. No private reporting channel is claimed to exist automatically.
