::page{title="Containerize your application"}

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CC0100EN-SkillsNetwork/images/IDSN-logo.png" width="200/">

##

**Estimated time:** 60 mins

You have made good progress in your assignment thus far! Your Django application is fully functional, and your team is happy. However, your boss has a new request. The company is looking at using containers to manage and deploy the application. Furthermore, the management is interested in using the hybrid cloud strategy, where some applications and services reside on a private cloud and others on a public cloud. To provide a more robust development experience, you are asked to look at Kubernetes to containerize your application. Let\'s deep dive into it.

> **Note**: Before starting the lab, please Select \"Click to expand!\" and follow the steps to check and delete previously persisting sessions to avoid any issues while running the lab.

<details>
<summary> Click to expand!</summary>

- Please run the below command:

```
kubectl get deployments
```

- If you see that the `dealership` deployment already exists, please delete it using:

```
kubectl delete deployment dealership
```

- Run the below command:

```
ibmcloud cr images
```

- If there is any `dealership` image, delete it using the command below:

```
ibmcloud cr image-rm us.icr.io/<your sn labs namespace>/dealership:latest && docker rmi us.icr.io/<your sn labs namespace>/dealership:latest
```

**Enter your SN Labs namespace in place of `<your sn labs namespace>`**

If you do not remember your namesapce, you can get it by using either of the below commands:

> - oc project
> - ibmcloud cr namespaces (please use the one that is of the format `sn-labs-$USERNAME`)

- Sign out of SN Labs and clear your browser cache and cookies.

- Start the lab again and proceed as below.
</details>

::page{title="Environment Setup"}

1. If the lab environment is reset, clone your git repository.

2. Open a new terminal, change to the `server/database` directory, and run the Mongo Express server as done. Refer to the [Lab: Implement API endpoints using Express-Mongo](https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m3/BackendServices_Mongo.md.html) if required.

3. If the sentiment analyzer microservice deployed on Code Engine is unavailable, redeploy it and update the URL wherever required. Rer to the [Lab: Create Django Proxy Services Of Backend APIs](https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m3/DjangoProxy.md.html) if required.

4. Open another new terminal. Change to the `server/frontend` directory. Build front-end by running the below commands.

```bash
npm install
npm run build
```

::page{title="Add Dockerfile"}

1. Create a `Dockerfile` in the `server` directory. The file should have the following steps listed:

- Add a base image
- Add the requirements.txt file
- Install and update Python
- Change the working directory
- Expose port
- Run the command to start the application

Here is an example file to get you started:

```
    FROM python:3.12.0-slim-bookworm

    ENV PYTHONBUFFERED 1
    ENV PYTHONWRITEBYTECODE 1

    ENV APP=/app

    # Change the workdir.
    WORKDIR $APP

    # Install the requirements
    COPY requirements.txt $APP

    RUN pip3 install -r requirements.txt

    # Copy the rest of the files
    COPY . $APP

    EXPOSE 8000

    RUN chmod +x /app/entrypoint.sh

    ENTRYPOINT ["/bin/bash","/app/entrypoint.sh"]

    CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi"]
```

> Note: Ensure that the contents of the Dockerfile are indented as above.

2. Notice that the second-to-last command in the Dockerfile refers to `entrypoint.sh`. Create this file in the `server` directory. This file should containt the content given below:

```
#!/bin/sh

# Make migrations and migrate the database.
echo "Making migrations and migrating the database. "
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput
exec "$@"
```

::page{title="Build and Push Image to Container Registry"}

You must recall how to build your image and push it to the IBM Cloud Image Registry (ICR). You need to do the same here and then refer to this image in your Kubernetes deployment file.

1. Please export your SN Labs namespace and print it on the console as below:

```bash
MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)
echo $MY_NAMESPACE
```

Perform a docker build with the `Dockerfile` in the current directory.
```bash
docker build -t us.icr.io/$MY_NAMESPACE/dealership .
```

Next, push the image to the container registry:

```
docker push us.icr.io/$MY_NAMESPACE/dealership
```

::page{title="Add Deployment Artifacts"}

Create a `deployment.yaml` file in the `server` directory to create the deployment and the service. It should look something like this:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: dealership
  name: dealership
spec:
  replicas: 1
  selector:
    matchLabels:
      run: dealership
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        run: dealership
    spec:
      containers:
      - image: us.icr.io/your-name-space/dealership:latest
        imagePullPolicy: Always
        name: dealership
        ports:
        - containerPort: 8000
          protocol: TCP
      restartPolicy: Always
```

**Enter your SN Labs namespace in place of `your-name-space` in the above file.**

::page{title="Deploy the Application"}

Create the deployment using the following command and your deployment file:

```
kubectl apply -f deployment.yaml
```

Normally, we would add a service to our deployment; however, we will use port-forwarding in this environment to see the running application.

```
kubectl port-forward deployment.apps/dealership 8000:8000
```

> Note: If you see any errors, please wait for some time and run the command again.

Click `Dealership Application` button below or click the `Skills Network` button on the right; it will open the \"Skills Network Toolbox\". Then click `OTHER`, then `Launch Application`. From there, you should be able to enter the port as `8000` and launch to see the running application, log in, view the dealers, review the dealers, and logout.

::startApplication{port="8000" display="external" name="Dealership Application" route="/"}

## Submission

For both **Option 1: AI-Graded Submission and Evaluation** and For **Option 2: Peer-Graded Submission and Evaluation**

1. Copy the deployment URL of the application running in the lab Kubernetes cluster and save it in a text file named `deploymentURL` for submission.

2. Take the following screenshots with the deployed application. Ensure that the address bar is visible in all the screenshots and that the address bar is the same as the URL copied above and submitted.

- Take a screenshot of the homepage with the login screen and save it as `deployed_landingpage.png` or `deployed_landingpage.jpeg`
- Login with a credential you created earlier. This would also be copied into the deployment as it is an SQLite file. Take a screenshot of the homepage while the user is logged in. Make sure the screenshot clearly shows the username of the logged-in user, and save it as `deployed_loggedin.png` or `deployed_loggedin.jpeg`
- Select on any dealer to show the dealer details along with reviews. Take a screenshot and save it as `deployed_dealer_detail.png` or `deployed_dealer_detail.jpeg`
- Add a review for any one of the dealers. Take a screenshot showing the review and the sentiment added to the details page, and save it as `deployed_add_review.png` or `deployed_add_review.jpeg`

## Summary
Congratulations on completing the **Lab:Containerize your Application!** In this lab, you\'ve containerize your applicatins using Dockerfiles.

## Author(s)

[Lavanya T S](https://www.linkedin.com/in/lavanya-sunderarajan-199a445/)

### Other Contributor(s)

Upkar Lidder

Priya
<!--
## Changelog

| Date | Version | Changed by | Change Description |
|------|--------|--------|---------|
| 2023-12-02 | 1.0 | Lavanya T S | Added initial version |
| 2023-12-04| 2.0 | Pornima More | QA pass with edits |
| 2025-11-14 | 3.0 | Rajashree Patil | Assessment instruction update for MARK and PR |
| 2025-12-09 | 4.0 | Bhavika | ID reviewed |
|2025-12-10 | 7.0 |Nikesh Kumar | added instructions for launch button |
-->
## <h3 align="center"> © Copyright IBM Corporation. All rights reserved. <h3/>

