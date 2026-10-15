# IBM Cloud handoff

This document is preparation only. No IBM Cloud resource, registry image, Code Engine application, Kubernetes workload, or GitHub fork has been created from this workspace.

1. Create the user's GitHub fork and push this project.
2. Build and push the Flask image from `server/djangoapp/microservices` to IBM Container Registry, then create the Code Engine application on port 5000.
3. Set `SENTIMENT_ANALYZER_URL` to the real Code Engine URL and verify `/analyze/Fantastic%20services`.
4. Build and push the Django image from `server` using the user's namespace. Replace `your-name-space` in `server/deployment.yaml`.
5. Apply the Kubernetes manifest, port-forward port 8000, and collect only real deployment evidence.
6. Run GitHub Actions and save the actual `CICD` output.

Do not submit placeholder URLs, screenshots, registry names, or terminal output.
