# Course compatibility notes

- The IBM course references describe a few route and naming variations, including `/insert_review` vs `/insertReview`, `/fetchReviews/dealer/:id` vs singular wording, and the Windows-safe `CICD` naming convention. This project keeps the working route names required by the labs while preserving the broader architecture described in the starter.
- Local development is kept in this repository, and IBM Cloud deployment tasks remain intentionally pending until the user explicitly chooses to create the fork and deploy the completed app to IBM resources.
- The app uses Django for authentication and page serving, Express + MongoDB for dealership data, and Flask + NLTK for sentiment scoring. All are configured to run locally on the expected ports (8000, 3030, and 5000).
