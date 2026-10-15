::page{title="Add Dynamic Pages"}

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CC0100EN-SkillsNetwork/images/IDSN-logo.png" width="200">

##

**Estimated time:** 1 hour
In this lab, you will create a user-friendly and aesthetic front-end pages to present these services to end users.

Prerequisites

- Sentiment Analyzer service deployed on Code Engine should be accessible. 
- Backend service with Express-MongoDB should be running on one of the terminals. Refer to [Lab: Implement API endpoints using Express-Mongo](https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m3/BackendServices_Mongo.md.html) if required.

::page{title="Environment Setup"}

If your lab environment has been reset and you want to continue what you have done previously, you can `g&#8203;it clone` or pull the latest code from your GitHub repository.

- Open a New Terminal, and run `g&#8203;it clone` or pull the latest code from your GitHub repository.

- Run the command given below to set up the Django environment:

```bash
cd /home/project/xrwvm-fullstack_developer_capstone/server

pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate
```

- Install the required packages by running the command given below.

```bash
python3 -m pip install -U -r requirements.txt
```

- Run the command given below to perform model migration.

```bash
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```

::page{title="Add and Set Up REACT Component for Dealers Page"}

- Open `frontend/src/App.js` and import and add the `Dealers` component in the top along with other components. This component has already been created for you and uses a table element to list the dealers. Feel free to change the look and feel.

```js
import Dealers from './components/Dealers/Dealers';
```

- Add the route for `/dealers` to render the Dealers component.

```js
      <Route path="/dealers" element={<Dealers/>} />
```

- Open `server/djangoproj/urls.py` and add the routes for `Dealers` and `Dealer` in it.

```python
    path('dealers/', TemplateView.as_view(template_name="index.html")),
```
- Open a new terminal and build the front end as before.

```bash
cd /home/project/xrwvm-fullstack_developer_capstone/server/frontend
npm install
npm run build
```

- Go back to the terminal where you set up the Python environment and see if the server is running without errors. The server should have restarted when you built the front end. If not, restart it.

- Test the `get_dealers` route (backed by the `get_dealerships` view) in the lab by launching the application with the development server on port `8000`, as done earlier. You should see a list of dealers in table format.

::startApplication{port="8000" display="external" name="Django Application" route="/"}

<details><summary> If the page doesn't open, select here to open the URL manually. </summary>

Select the Skills Network button on the right, it will open the "Skills Network Toolbox". Then select `OTHER` then `Launch Application`. From there you should be able to enter the port as `8000` and launch the development server.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CD0321EN-SkillsNetwork/labs/module_1_static_pages/images/Launch_Application.png" style="width:80%; margin:.5cm; border: solid 1px grey">
</details>

<details>
	<summary> <strong>Click here if the dealer's list is not visible </strong> </summary>

- Append a \"/\" to the end of the `get_dealers` route in the `urls.py` file located in the `djangoapp` directory. The code should look like this:

    ```python
    path(route='get_dealers/', view=views.get_dealerships, name='get_dealers'),
    ```

- Ensure you have started the Mongo server and updated the backend URL in the `.env` file.

    - If you updated the backend URL in the `.env` file after starting the Django server, make sure to stop and restart the server.

- Ensure to uncomment the `import requests` line at the top of `djangoapp/restapis.py`.

</details>

#### Assessment:
 
For both **Option 1: AI-Graded Submission and Evaluation:** and For **Option 2: Peer-Graded Submission and Evaluation:**

**Ensure the URL endpoint in the address bar is visible in every screenshot.**

- Take a screenshot of the same along with the URL shown in the sample below and save it as `get_dealers.png` or `get_dealers.jpeg`.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m4/images/get_dealers.png" style="display: block;margin-left: 1cm;margin-right: auto;width: 90%;margin-bottom: 1cm;">

- Log in with one of the valid credentials through the login panel on top of the homepage and take a screenshot of the dealer details rendered, along with the option to post a review. Save the screenshot as `get_dealers_loggedin.png` or `get_dealers_loggedin.jpeg`.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m4/images/loggedin_get_dealers.png" style="display: block;margin-left: 1cm;margin-right: auto;width: 90%;margin-bottom: 1cm;">

- Select the dropdown for state and choose any one to display the dealership for just that state. Take a screenshot and save it as `dealersbystate.png` or `dealersbystate.jpeg`.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m4/images/dealers_by_state.png" style="display: block;margin-left: 1cm;margin-right: auto;width: 90%;margin-bottom: 1cm;">

::page{title="Add REACT Component Dealer Showing Reviews"}

- Open `frontend/src/App.js` and import and add the route to the Dealer REACT component to the rest of the routes. This will render a dealer-specific REACT page along with the reviews when you click the link on the table of dealers.

>This page also has a link to post reviews for the users who are logged in. You will add the Post Review page in the next task.

```js
import Dealer from "./components/Dealers/Dealer"
```
```js
	<Route path="/dealer/:id" element={<Dealer/>} />
```

- Build the front end again in the same terminal where you built it earlier.

- Open `server/djangoproj/urls.py` and add the path for showing the dealer page by including the code given below.

```python
path('dealer/<int:dealer_id>',TemplateView.as_view(template_name="index.html")),

```
- Refresh the application go to the `View Reviews` page and click any dealer\'s name link to see its reviews.

#### Assessment:
 
For both **Option 1: AI-Graded Submission and Evaluation:** and For **Option 2: Peer-Graded Submission and Evaluation:**

Take a screenshot of the same along with the URL in the sample below and save it as `dealer_id_reviews.png` or `dealer_id_reviews.jpeg`. Ensure the URL endpoint in the address bar is visible in the screenshot.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m4/images/dealer_detail.png" style="margin-left: 1cm;margin-right: auto;width: 80%;margin-bottom: 1cm;">

::page{title="Create a Dealer Details or Reviews Page"}

An authenticated user should be able to select this link and add a review for the dealer. You will add a review submission page.

- Open and view `frontend/src/components/Dealers/PostReview.jsx`. Make any changes to the look and feel as you wish.

- Import `PostReview` component and add `postreview/<dealer id>` route to `frontend/src/App.js`.

```js
import PostReview from "./components/Dealers/PostReview"
```
```js
      <Route path="/postreview/:id" element={<PostReview/>} />
```

- Go to the terminal where you built the front end and run the build again.

- Open `server/djangoproj/urls.py` and add the path to the post review page by including the code given below.

```py
    path('postreview/<int:dealer_id>',TemplateView.as_view(template_name="index.html")),

```

- Log in with one of the registered usernames and passwords. You should see the `Post Review` link. Test the link by adding a review to a dealership.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m4/images/dealer_Detail_loggedin.png" style="margin-left: 1cm;margin-right: auto;width: 50%;margin-bottom: 1cm;">

<details> 
	<summary><strong>Click here if the CarMake dropdown is not working</strong></summary>

Start by deleting the `db.sqlite3` file from the server directory, and also remove the `__pycache__` folder from the `djangoapp` directory. These steps are necessary to ensure a clean state for migrations. 

Next, execute the following migration commands again:
```
python3 manage.py makemigrations
python3 manage.py migrate --run-syncdb
```
Then, restart the Django server.
</details>

#### Assessment:
 
For both **Option 1: AI-Graded Submission and Evaluation:** and For **Option 2: Peer-Graded Submission and Evaluation:**
**Ensure the URL endpoint in the address bar is visible in every screenshot.**

- Enter the details of the review and take a screenshot of the same before submitting it. Save it as `dealership_review_submission.jpeg` and `dealership_review_submission.png`.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m4/images/Add_review.png" style="margin-left: 1cm;margin-right: auto;width: 50%;margin-bottom: 1cm;">

- If the operation is successful, you will see the updated page with your review along with the sentiment.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m4/images/updated%20review.png" style="margin-left: 1cm;margin-right: auto;width: 50%;margin-bottom: 1cm;">

- Take a screenshot of the Dealer details page along with the review you posted and save it as `added_review.png` or `added_review.jpeg`.

::page{title="Summary"}

Congratulations on completing the **Lab: Add Dynamic Pages!** In this lab, you have created a dealer list, dealer details, and a provision for adding reviews. At this point, you have completed the main app development work. 

Ensure you push your changes to your GitHub repository.

## Author(s)

<h4>Lavanya</h4>

### Other Contributor(s)

Yan Luo
Upkar Lidder
Priya

<!--
## Changelog

| Date | Version | Changed by | Change Description |
|------|--------|--------|---------|
| 2023-11-28 | 1.0 | Lavanya | Created new instructions for Capstone project |
| 2023-12-06 | 1.1 | K Sundararajan | Minor correction for screenshot rendering |
| 2024-01-18 | 1.2 | K Sundararajan | Peer assignment screenshot name changed based on Beta testing |
| 2024-08-07 | 1.3 | Rajashree Patil | Added a solution note for dealers list issue |
| 2024-09-20 | 1.4 | Rajashree Patil | Added another solution note for dealers list issue |
| 2025-05-15 | 1.5 | Nikesh Kumar | Added another solution note for dealers list issue |
|2025-11-17 | 1.6| Rajashree Patil | Assessment instruction update for MARK and PR |
|2025-12-08 | 1.6| Bhavika | ID reviewed |
|2025-12-10 | 7.0 |Nikesh Kumar | added instructions for launch button |
|2026-08-21 | 7.1 | Sameep | Spelling and instruction errors corrected |
-->
## <h3 align="center"> © Copyright IBM Corporation. All rights reserved. <h3/>

