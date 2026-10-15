# API reference

These are the source-level contracts of the application, not a guarantee of a
currently available public URL. Browser traffic should use Django, not the
Express service directly.

## Django, port 8000

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/djangoapp/register` | Create a user and establish a session |
| POST | `/djangoapp/login` | Authenticate a username and password |
| GET / POST | `/djangoapp/logout` | Clear the Django session |
| GET | `/djangoapp/session` | Return the current authentication state |
| GET | `/djangoapp/csrf` | Set a CSRF cookie |
| GET | `/djangoapp/get_dealers` | List dealerships |
| GET | `/djangoapp/get_dealers/Kansas` | Filter dealerships by state |
| GET | `/djangoapp/dealer/29` | Get one dealership |
| GET | `/djangoapp/reviews/dealer/29` | Get reviews enriched with sentiment |
| GET | `/djangoapp/get_cars` | Get car makes/models/years |
| POST | `/djangoapp/add_review` | Submit a review as the authenticated user |

Registration body:

```json
{
  "userName": "demo-customer",
  "firstName": "Demo",
  "lastName": "Customer",
  "email": "demo@example.com",
  "password": "choose-a-private-password"
}
```

Review body:

```json
{
  "dealership": 29,
  "review": "Helpful staff and a smooth buying experience.",
  "purchase": false,
  "purchase_date": "",
  "car_make": "Audi",
  "car_model": "A6",
  "car_year": 2023
}
```

Identity fields are derived by Django, not accepted as authoritative client
identity. These JSON blocks are examples, not captured test results. Session
cookies are required for review submission. Do not publish cookie jars.

## Express, port 3030

`GET /health`, `GET /fetchDealers`, `GET /fetchDealers/:state`,
`GET /fetchDealer/:id`, `GET /fetchReviews`,
`GET /fetchReviews/dealer/:id`, `POST /insert_review`.

Express is an internal data service. Its review-write endpoint does not itself
implement Django session authentication. Do not expose it directly as a trusted
public write API.

## Flask, port 5000

`GET /analyze/<text>` returns a sentiment label:

```json
{"sentiment": "positive"}
```

URL-encode review text. VADER is rule/lexicon based; sentiment is an automated
signal, not a guarantee of correctness or a moderation decision.
