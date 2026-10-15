# Quality, verification, and trade-offs

## Historical baseline

The reviewed GitHub baseline was commit
`1e1bc97b0432e3da80a128ad04cf8194a9952795`.
It contains five Django test methods and a four-job workflow for Python lint,
JavaScript lint, React build, and Django tests. The review-enrichment unit test
mocks its downstream dependencies.

The project owner demonstrated registration, login, admin, dealer filtering,
review submission, and live sentiment integration in IBM Skills Network. During
that demonstration React static files were copied into a pod to resolve a blank
page. That manual action was not represented in the old image source.

## Portfolio update

This update changes the source static-file mapping and adds an image/HTTP smoke
check so the earlier runtime workaround is not the deployment procedure. It
also uses a host-built React artifact instead of npm inside the Django image.

The proposed update must pass its OWN workflow after it is pushed. The previous
green run is not proof that these new changes pass. There are no fabricated
coverage percentages, performance benchmarks, uptime claims, or production users.

## Checks in the updated workflow

| Check | What it verifies | What it does not verify |
| --- | --- | --- |
| Flake8 / JSHint | Selected Python and backend JavaScript source | Runtime integration |
| Django tests | The inherited unit-test scenarios | All browser interactions or CSRF enforcement |
| Strict React build | Compilation and build-time warnings | Complete UI correctness |
| Image smoke | Container startup, HTML, generated JS/CSS | External Mongo/Flask availability |
| Manual/live smoke | Configured live API routes | Load, security, or recovery guarantees |

The image check does not push to any cloud registry. It starts a disposable local
CI container and removes that container at the end of the job.

## Release checklist

- Clean checkout: build React, build the image, start the stack.
- All workflow jobs pass for the candidate commit.
- `scripts/smoke_http.py --integration` passes against the intended stack.
- Register, log in, submit a review, verify identity and sentiment, and log out.
- Test the admin using a private account.
- Restart the LOCAL stack without deleting volumes and verify records persist.
- Review the public diff for secrets, evidence archives, and copied course notes.
- Do not use the temporary lab proxy as a permanent live-demo link.

## Roadmap, not implemented claims

1. Enforce CSRF middleware consistently; update login/registration and tests.
2. Validate passwords, emails, vehicle combinations, and review fields fully.
3. Add authenticated integration/browser tests and service error contract tests.
4. Review inherited npm advisories; migrate from Create React App deliberately.
5. Pin and maintain tested Python dependency versions and image digests.
6. Add pagination, sentiment caching, rate limiting, and timeout/backoff policies.
7. Replace SQLite for multi-replica hosting and add durable storage/backup tests.
8. Protect Express writes with service-level authentication/network policy.
