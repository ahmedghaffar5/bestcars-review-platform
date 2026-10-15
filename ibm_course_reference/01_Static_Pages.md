::page{title="Add Static Pages"}

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CC0100EN-SkillsNetwork/images/IDSN-logo.png" width="200/">

##

**Estimated time:** 1 hour

Congratulations on your new role as the Full Stack Application Developer at `Best Cars` dealership.

As part of the project, your first task is to run and test its main Django application. You are given a skeleton of the Django application as a starting point.

Then, you need to complete the following steps to add additional static pages.

>The lab environment doesn\'t store your changes. If you are going to leave your workspace in between, it is highly recommended that you push any changes you make to git.

<details><summary> Click here for the procedure to push your changes into Git repo </summary>

```
git config --global user.email "yourgithub@email.com"
```

```
git config --global user.name "name"
```

```
git add .
```

```
git commit -m"Adding temporary changes to Github"
```

```
git push
```

</details>

::page{title="Fork and Clone the Repository"}

- Open [link](https://github.com/ibm-developer-skills-network/xrwvm-fullstack_developer_capstone.git) and create a fork of the repository that includes essential starter code required for this project. Ensure you keep the same repository name when you fork it

- Go to your forked repository and open the `README.md` and add the project name in the file as `fullstack_developer_capstone`. Ensure you use this exact name as this is required for the AI-graded submission

- Copy the git clone URL of the skeleton repository that you forked into your account by selecting copy icon

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m1/images/clone_copy_fullstack.png" style="margin:.5cm;border: solid 1px grey">

> **Note:** **Ensure you copy your repository by checking the URL in the address bar.**

- Select **New terminal**

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CD0321EN-SkillsNetwork/labs/module_1_static_pages/images/new-terminal.png" style="margin:.5cm; border: solid 1px grey">

- Clone the URL you copied in step 3.
```
git clone <your_repo_name>
```

#### Assessment:
 
**For Option 1: AI-Graded Submission and Evaluation:** Copy and paste the the public Github URL of  the `README.md` and save it in a text file for the Final Project Submission and Evaluation.
 
**For Option 2: Peer-Graded Submission and Evaluation:** Copy and paste the the public Github URL and save it in a text file for Peer Assignment.

::page{title="Run the Django App on Development Server"}

- Observe the folder structure of the Django app skeleton structure. You will see `server` folder with three sub-folders:
  - `djangoapp`: Contains the django application
  - `djangoproj`: Contains the project configuration
  - `frontend`: HTML and CSS and React front end

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m1/images/folder_struct.png" style="margin:.5cm; border: solid 1px grey;width:75%">

Next, let\'s setup the Python runtime in Theia and test the app.

- Change to the `server` directory in the terminal

```
cd xrwvm-fullstack_developer_capstone/server
```

- Set up virtual environment for your Django application to run in

```bash
pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate
```
- Install the necessary Python packages in your virtual environment. The package names have already been provided in `requirements.txt`.

```
python3 -m pip install -U -r requirements.txt
```

- In `server/djangoproj/settings.py`, under `TEMPLATES`, you will find `DIRS` as an empty list. Add the `os.path.join(BASE_DIR,'frontend/static')` to the list for the Django application to recognize the front-end static files. It should be set up as below.

```python
        'DIRS': [
            os.path.join(BASE_DIR,'frontend/static')
        ],

```

- In the same file, `server/djangoproj/settings.py`, add the directory for the Django application to look for static files at the bottom of the file

```
STATICFILES_DIRS = [
    os.path.join(BASE_DIR,'frontend/static')
]

```

- Perform migrations to create necessary tables
```
python3 manage.py makemigrations
```

- Run migration to activate models for the app

```
python3 manage.py migrate
```

- Start the local development server
```
python3 manage.py runserver
```

Great! You should have the Django app running now.

#### Assessment:

**For Option 1: AI-Graded Submission and Evaluation:** Copy and paste the terminal output and save it in a text file named `django_server` for the final project submission and evaluation

**For Option 2: Peer-Graded Submission and Evaluation:** Please take a screenshot of the console or terminal output to show that your app is running successfully, and store it as `django_server.png` or `django_server.jpeg` for peer review.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m1/images/server_running.png" style="margin:.5cm;width:80%">

- Select the `Django Application` button below to open the application. You will see the static homepage that is rendered. Copy the URL from the browser.

>The links in the page will not work as yet.

::startApplication{port="8000" display="external" name="Django Application" route="/"}

<details><summary> If the page doesn't open, select here to open the URL manually. </summary>

Select the Skills Network button on the right, it will open the "Skills Network Toolbox". Then select `OTHER` then `Launch Application`. From there you should be able to enter the port as `8000` and launch the development server.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CD0321EN-SkillsNetwork/labs/module_1_static_pages/images/Launch_Application.png" style="width:80%; margin:.5cm; border: solid 1px grey">

</details>

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m1/images/homepage.png" style="width:80%; margin:.5cm; border: solid 1px grey">

- On the file editor, open the `server/djangoproj/settings.py` in the editor and set the `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` to reflect your Django app\'s root URL.

>Please do not included the `/` at the end.

```
ALLOWED_HOSTS=['localhost','<your application URL here>']
CSRF_TRUSTED_ORIGINS=['<your application URL here>']
```

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m2/images/settingspy.png" style="width:90%;margin:.5cm">

::page{title="Add 'About Us' Page"}

- Open `server/frontend/static/About.html` in the editor.

- You have been provided with the stylesheet `style.css` in the same folder. In the `<head>` tag inside `About.html` link the stylesheet for use in the HTML file.

```html
  <link rel="stylesheet" href="/static/style.css">
  <link rel="stylesheet" href="/static/bootstrap.min.css">
```

- Paste the following content in the `<div>` tag named `about-header`.

```html
  <h1>About Us</h1>
  Welcome to Best Cars dealership, home to the best cars in North America. We deal in selling domestic and imported cars at reasonable prices.
```
>You can add additional information that might be relevant to this page.

- Change the image `person.png` to an actual person\'s image and change all the text in `About.html` to look more realistic. Change the styling as per your preference.

- Go to `djangoproj/urls.py` and add the following to the `urlpatterns`.

```python
    path('about/', TemplateView.as_view(template_name="About.html")),
```

- The Django server automatically restarts.  Select button below and check if the changes are reflected.

::startApplication{port="8000" display="external" name="Dealership Application" route="/about"}

<details><summary> If the page doesn't open, select here to open the URL manually. </summary>

Select the Skills Network button on the right, it will open the "Skills Network Toolbox". Then select `OTHER` then `Launch Application`. From there you should be able to enter the port as `8000` and launch the development server.

Once the application is running on port 8000, append /about to the URL to view the About page.
<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CD0321EN-SkillsNetwork/labs/module_1_static_pages/images/Launch_Application.png" style="width:80%; margin:.5cm; border: solid 1px grey">
</details>

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m1/images/aboutus.png" style="margin:.5cm; border: solid 1px grey">

- Finally, push the changes you made into your GitHub repository.

#### Assessment:

**For Option 1: AI-Graded Submission and Evaluation:** Copy and paste the the public Github URL of  the `About.html` and save it in a text file for the Final Project Submission and Evaluation.

**For Option 2: Peer-Graded Submission and Evaluation:** Take a screenshot of the page and store it as `about_us.png` or `about_us.jpeg` for peer review. Ensure that the URL in the address bar is visible in the screenshot.

::page{title="Add 'Contact Us' Page"}

- Under `server/frontend/static` folder, add a new file named `Contact.html`

- Add the style sheets link

- Add the header navigation bar, with `Contact Us` as the active link

- Write the contact information content in the file. You can be creative and make up your information. Use css to style it.

- Add the `contact` path to `djangoproj/urls.py`.

```
    path('contact/', TemplateView.as_view(template_name="Contact.html")),
```

- The Django server automatically restarts.  Select the button below and check if the `contact` page renders

::startApplication{port="8000" display="external" name="Dealership Application" route="/contact"}

<details><summary> If the page doesn't open, select here to open the URL manually. </summary>

Select the Skills Network button on the right, it will open the "Skills Network Toolbox". Then select `OTHER` then `Launch Application`. From there you should be able to enter the port as `8000` and launch the development server.

Once the application is running on port 8000, append /contact to the URL to view the Contact page.
<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CD0321EN-SkillsNetwork/labs/module_1_static_pages/images/Launch_Application.png" style="width:80%; margin:.5cm; border: solid 1px grey">
</details>

- Lastly, push the changes you made into your GitHub repository.

#### Assessment:

**For Option 1: AI-Graded Submission and Evaluation:** Copy and paste the the public Github URL of  the `Contact.html` and save it in a text file for the Final Project Submission and Evaluation.

**For Option 2: Peer-Graded Submission and Evaluation:** Take a screenshot of the page and store it as `contact_us.png` or `contact_us.jpeg` for peer review. Ensure that the URL in the address bar is visible in the screenshot.

![](https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m1/images/contactus.png)

::page{title="Summary"}

Congratulations on completing the **Lab: Add Static Pages!**

In this lab, you prepared your GitHub repository and cloned an app skeleton to start building the dealer review app. As a warm-up task, you have created several static pages and tested the app. Save the changes you made into your GitHub repository.

Now, you are ready to start some actual design and development work.

## Author(s)

<h4> Lavanya <h4/>

<!--
## Changelog
| Date | Version | Changed by | Change Description |
|------|--------|--------|---------|
|2023-11-09| 1.0 | Lavanya | Initial version |
|2023-11-28| 2.0| Pornima | QA pass with edits |
|2023-11-28| 3.0| K Sundararajan | Minor grammar corrections made, based on QA review |
|2025-12-08| 3.0|Bhavika | ID review |
|2025-12-08| 4.0|Nikesh Kumar | add instruction for launch button |
|2026-08-21| 4.1|Sameep| Spell Correction|
-->

## <h3 align="center"> © Copyright IBM Corporation. All rights reserved. <h3/>
