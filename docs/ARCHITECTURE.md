# Architecture

## Service boundaries

Django is the browser-facing application. Its JSON endpoints use Django sessions
for identity, SQLite for users and cars, and HTTP requests to the downstream
services. React uses relative `/djangoapp/...` URLs, not cloud-specific addresses.

Express uses Mongoose to read dealerships and reviews from MongoDB. The supplied
JSON data are seeded on startup using upserts. Flask uses NLTK VADER and returns
one of three sentiment labels. Its lexicon is installed in the container image.

## Reading reviews

1. The browser loads `/dealer/<id>/` and requests the matching Django APIs.
2. Django fetches the dealer and its reviews from Express.
3. Each review text is sent to the sentiment service.
4. Django returns enriched JSON; React renders review cards and sentiment icons.

## Writing a review

The React form requests car options from Django and sends a JSON payload to
`/djangoapp/add_review`. Django rejects unauthenticated requests, derives the
reviewer identity from the session, determines sentiment, and forwards the record
to Express for persistence. The browser returns to the dealer page.

The browser includes a CSRF token on review submissions. The inherited Django
configuration does not enforce CSRF middleware globally; this remains an explicit
security limitation rather than a claim of comprehensive CSRF protection.

## Data ownership

| Store | Entities | Lifetime |
| --- | --- | --- |
| SQLite | Users, sessions, car makes, car models | Local Compose named volume |
| MongoDB | Dealerships, reviews | Local Compose named volume |
| Flask | VADER lexicon | Image asset; no customer database |

A Kubernetes container filesystem is not durable storage. The example manifest
is a single-replica demonstration and does not promise persistence across pod
replacement. Production adoption should use managed storage and an application
database suited to multiple replicas.

## Asset serving

`frontend/build/index.html` is a Django template. Its `/static/js/...` and
`/static/css/...` URLs must map to files collected from `frontend/build/static`,
not from the parent `frontend/build` directory. WhiteNoise serves the collection
through Gunicorn. `STORAGES` uses compressed static serving; the React toolchain
already hashes its generated asset filenames.

## Failure behaviour and limitations

Downstream failures can return HTTP 503. The existing calls use finite timeouts;
review enrichment is sequential and does not cache sentiments. A sleeping
serverless service can therefore delay review loading. A minimum Code Engine
instance avoids scale-to-zero cold starts but consumes resources. Timeouts,
backoff, caching, batch processing, and costs must be considered together.

The service split demonstrates integration, not a claim that microservices are
necessary for a small dealership application.
