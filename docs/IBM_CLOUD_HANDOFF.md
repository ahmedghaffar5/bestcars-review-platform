# IBM Cloud handoff

Preparation only. No GitHub push, IBM Cloud resource, registry image, Code Engine
application, Kubernetes workload, or public deployment URL has been created here.

## 1. GitHub publication and CI

1. Review the working tree, confirm `.env`, SQLite files, `node_modules`, build
   output, and `submission_option1/` remain ignored, then create the local
   commit only when authorized.
2. Push the verified local repository to the approved GitHub fork and record the
   real hosted Actions run as `submission_option1/CICD`. Do not use local
   terminal output as a substitute for GitHub Actions evidence.
3. Open the workflow run and resolve any hosted-only failure before using its
   output for Option 1 task 23.

## 2. Flask sentiment service in IBM Container Registry and Code Engine

1. In the IBM lab, log in to the IBM Cloud CLI and Container Registry, select
   the target region, and set the namespace:

   ```bash
   ibmcloud login
   ibmcloud cr region-set us-south
   ibmcloud cr login
   export SN_ICR_NAMESPACE=<your-real-namespace>
   ```

2. Build and push `server/djangoapp/microservices` to the real ICR namespace:

   ```bash
   cd server/djangoapp/microservices
   docker build -t us.icr.io/$SN_ICR_NAMESPACE/senti_analyzer .
   docker push us.icr.io/$SN_ICR_NAMESPACE/senti_analyzer
   ibmcloud ce application create --name sentianalyzer \
     --image us.icr.io/$SN_ICR_NAMESPACE/senti_analyzer \
     --registry-secret icr-secret --port 5000
   ```

3. If the application already exists, update it with
   `ibmcloud ce application update --name sentianalyzer --image
   us.icr.io/$SN_ICR_NAMESPACE/senti_analyzer --registry-secret icr-secret
   --port 5000` instead of creating a duplicate.
4. Record the actual Code Engine URL:

   ```bash
   ibmcloud ce application get --name sentianalyzer
   curl "https://<real-code-engine-host>/analyze/Fantastic%20services"
   ```

5. Set Django's `SENTIMENT_ANALYZER_URL` to it and save only the real response as
   `submission_option1/analyzereview`.

## 3. Express/MongoDB service

1. Start the IBM-provided MongoDB/Express lab service using the original lab
   instructions and its real MongoDB connection string.
2. Verify the six required API responses and record the real API host. Do not
   replace the Express service with a mock or local-only response.
3. Use that host as the `backend-url` value in the Kubernetes secret below.

## 4. Django Kubernetes deployment

1. Create the required Kubernetes secret named `dealership-runtime` with the
   real backend URL, sentiment URL, and Django secret. Replace only
   `your-name-space` in `server/deployment.yaml` with the real namespace and
   use the actual image:

   ```bash
   kubectl create secret generic dealership-runtime \
     --from-literal=backend-url="https://<real-express-host>" \
     --from-literal=sentiment-analyzer-url="https://<real-code-engine-host>" \
     --from-literal=django-secret-key="<generate-a-new-random-secret>"
   ```

2. Apply the manifest, wait for
   `kubectl rollout status deployment.apps/dealership`, port-forward
   `deployment.apps/dealership 8000:8000`, and collect the real deployment URL
   and screenshots for tasks 24-28:

   ```bash
   kubectl apply -f server/deployment.yaml
   kubectl rollout status deployment.apps/dealership
   kubectl port-forward deployment.apps/dealership 8000:8000
   ```

3. Confirm the deployed app can reach both the Express API and Code Engine
   sentiment service. Capture the actual deployment URL as
   `submission_option1/deploymentURL`, then capture tasks 25-28 with the address
   bar visible.

## 5. Evidence and safety rules

- Keep cloud credentials, generated secrets, kubeconfig files, and `.env` files
  outside Git.
- Submit only real hosted workflow output, Code Engine responses, Kubernetes
  rollout output, deployment URLs, and screenshots.
- Never submit placeholder URLs, example screenshots, local-only responses as
  cloud evidence, or credentials.
- Cloud data and deployment state are outside this local workflow.

Never submit placeholder URLs, example screenshots, local-only responses as cloud
evidence, or credentials. Cloud data and deployment state are outside this local
workflow.
