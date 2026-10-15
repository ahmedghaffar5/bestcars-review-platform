::page{title="Build CarModel and CarMake Django Models"}

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CC0100EN-SkillsNetwork/images/IDSN-logo.png" width="200/">

##

**Estimated time:** 90 minutes

A dealership typically manages cars from one or more makers or manufacturers, and customers should be allowed to review the cars they purchased from a dealer.

In this lab, you will create the `CarModel` and `CarMake` models in the Django app.

- A `car model` includes basic information, such as its make, year, type, and dealer ID.

- A `car make` includes basic information, such as name and description.

::page{title="Environment Setup"}

If your lab workspace has not been reset, you can skip this section. Else continue from what you have done previously with the following:

- `git clone` or pull from your created GitHub repository

- Run the command given below to set up the Django environment

```bash
cd /home/project/xrwvm-fullstack_developer_capstone/server
pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate

```

- Install the required packages by running the command given below

```bash
python3 -m pip install -U -r requirements.txt 
```

- Run the command given below to perform model migrations

```bash
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```

::page{title="Steps to Build CarModel and CarMake Models"}

In this section, you need to create two new models in `server/djangoapp/models.py`:

1. A `CarMake` model to save some data about a car\'s make.
2. A `CarModel` model to save some data about a car\'s model.

- Create a car make Django model `class CarMake(models.Model)`:
    - Name
    - Description
    - Any other fields you would like to include in a car make
    - A `__str__` method to print a car make object

<details><summary>Click here for a sample</summary>

```
class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    # Other fields as needed

    def __str__(self):
        return self.name  # Return the name as the string representation

```
</details>

- Create a car model Django model `class CarModel(models.Model)`
    - Many-to-one relationship to `CarMake` model (One car make can have many car models, using a ForeignKey field)
    - Dealer ID (IntegerField) refers to a dealer created in Cloudant database
    - Name
    - Type (CharField with a choices argument to provide limited choices such as Sedan, SUV, and Wagon)
    - Year (IntegerField)
    - Any other fields you would like to include in a car model
    - A `__str__` method to print the car make and car model object

<details><summary>Click here for a sample</summary>

```
class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)  # Many-to-One relationship
    name = models.CharField(max_length=100)
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        # Add more choices as required
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default='SUV')
    year = models.IntegerField(default=2023,
        validators=[
            MaxValueValidator(2023),
            MinValueValidator(2015)
        ])
    # Other fields as needed

    def __str__(self):
        return self.name  # Return the name as the string representation
```
</details>

- You need to register the `CarMake` and `CarModel` on the admin site so you can conveniently manage their content, such as perform CRUD operations. Refer to the Lab: <a href="https://cocl.us/TzAvw" target="_blank">Django Admin Site</a> for more details.

<details><summary>Click here for sample code</summary>

```
from django.contrib import admin
from .models import CarMake, CarModel

# Registering models with their respective admins
admin.site.register(CarMake)
admin.site.register(CarModel)
```
</details>

- Run migrations for the models

```bash
python3 manage.py makemigrations
python3 manage.py migrate --run-syncdb
```

>Note: The `--run-syncdb` allows creating tables for apps without migrations.


Refer to the Lab: Django ORM for more details:

<a href="https://cocl.us/8Z1B5" target="_blank">CRUD on Django Model Objects</a>

::page{title="Steps to Register the CarMake and CarModel Models with the Admin Site"}

- First, you must have superuser access on the admin site (if not created before).

- Next, use `root` as the user name and `root` as the password for your reviewer to log in to your app.

- Open a new terminal and build your client by running the commands given below

```bash
cd /home/project/xrwvm-fullstack_developer_capstone/server/frontend
npm install
npm run build
```

- Start the server from the terminal where Django application was running if it is not already running.

```
python3 manage.py runserver
```

- Select the button below to launch the admin page to login with the root credentials.

::startApplication{port="8000" display="external" name="Django Admin" route="/admin"}

<details><summary>Click here if you get an error</summary>
If you get an error as shown below, it means that your URL has been changed. Copy the new application URL and make necessary changes in `server/djangoproj/settings.py`.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m3/images/forbidden.png">
</details>

<details><summary> If the page doesn't open, select here to open the URL manually. </summary>

Select the Skills Network button on the right, it will open the "Skills Network Toolbox". Then select `OTHER` then `Launch Application`. From there you should be able to enter the port as `8000` and launch the development server.

Once the application is running on port 8000, append /admin to the URL to view the Django Admin page.
<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CD0321EN-SkillsNetwork/labs/module_1_static_pages/images/Launch_Application.png" style="width:80%; margin:.5cm; border: solid 1px grey">
</details>


#### Assessment:
 
**For Option 1:** AI-Graded Submission and Evaluation and **For Option 2:** Peer-Graded Submission and Evaluation

- After you log in to the admin site, take a screenshot and name it as `admin_login.jpeg` or `admin_login.png`.

- In addition, you may want to log out as the admin user. You will be redirected to the admin login page again. Take a screenshot and name it `admin_logout.jpeg` or `admin_logout.png`.

- Open `djangoapp/views.py`, import CarMake and CarModel in it after the other import statements in the beginning of the file, and add a method to get the list of cars by including the code below:

```python
from .models import CarMake, CarModel
```

```py
def get_cars(request):
    count = CarMake.objects.filter().count()
    print(count)
    if(count == 0):
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({"CarModel": car_model.name, "CarMake": car_model.car_make.name})
    return JsonResponse({"CarModels":cars})
```

- Open `server/djangoapp/urls.py` and add the path for `get_cars` in it.

```python
    path(route='get_cars', view=views.get_cars, name ='getcars'),
```

- Open `server/djangoapp/populate.py` and paste the code given below to populate data in your database. The data is populated when the first call is made to `get_cars`, if the CarModel is empty. If you wish to add data manually, skip this step.

```python
from .models import CarMake, CarModel

def initiate():
    car_make_data = [
        {"name":"NISSAN", "description":"Great cars. Japanese technology"},
        {"name":"Mercedes", "description":"Great cars. German technology"},
        {"name":"Audi", "description":"Great cars. German technology"},
        {"name":"Kia", "description":"Great cars. Korean technology"},
        {"name":"Toyota", "description":"Great cars. Japanese technology"},
    ]

    car_make_instances = []
    for data in car_make_data:
            car_make_instances.append(CarMake.objects.create(name=data['name'], description=data['description']))


    # Create CarModel instances with the corresponding CarMake instances
    car_model_data = [
      {"name":"Pathfinder", "type":"SUV", "year": 2023, "car_make":car_make_instances[0]},
      {"name":"Qashqai", "type":"SUV", "year": 2023, "car_make":car_make_instances[0]},
      {"name":"XTRAIL", "type":"SUV", "year": 2023, "car_make":car_make_instances[0]},
      {"name":"A-Class", "type":"SUV", "year": 2023, "car_make":car_make_instances[1]},
      {"name":"C-Class", "type":"SUV", "year": 2023, "car_make":car_make_instances[1]},
      {"name":"E-Class", "type":"SUV", "year": 2023, "car_make":car_make_instances[1]},
      {"name":"A4", "type":"SUV", "year": 2023, "car_make":car_make_instances[2]},
      {"name":"A5", "type":"SUV", "year": 2023, "car_make":car_make_instances[2]},
      {"name":"A6", "type":"SUV", "year": 2023, "car_make":car_make_instances[2]},
      {"name":"Sorrento", "type":"SUV", "year": 2023, "car_make":car_make_instances[3]},
      {"name":"Carnival", "type":"SUV", "year": 2023, "car_make":car_make_instances[3]},
      {"name":"Cerato", "type":"Sedan", "year": 2023, "car_make":car_make_instances[3]},
      {"name":"Corolla", "type":"Sedan", "year": 2023, "car_make":car_make_instances[4]},
      {"name":"Camry", "type":"Sedan", "year": 2023, "car_make":car_make_instances[4]},
      {"name":"Kluger", "type":"SUV", "year": 2023, "car_make":car_make_instances[4]},
        # Add more CarModel instances as needed
    ]

    for data in car_model_data:
            CarModel.objects.create(name=data['name'], car_make=data['car_make'], type=data['type'], year=data['year'])
```

- Alternatively, if you wish to add the Car makes and models manually, you can go to the admin page and add them whenever it is required. Note that you will only be allowed to choose from one of the makes and models in these tables to post a review in the later part of the project.

::startApplication{port="8000" display="external" name="Django Admin" route="/admin"}

<details><summary> If the page doesn't open, select here to open the URL manually. </summary>

Select the Skills Network button on the right, it will open the "Skills Network Toolbox". Then select `OTHER` then `Launch Application`. From there you should be able to enter the port as `8000` and launch the development server.

Once the application is running on port 8000, append /admin to the URL to view the Django Admin page.
<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CD0321EN-SkillsNetwork/labs/module_1_static_pages/images/Launch_Application.png" style="width:80%; margin:.5cm; border: solid 1px grey">
</details>

- Select the `Get Cars` button below to check the list of cars added.

>If you chose to populate, it will show five CarMakes and fifteen Car Models, three under each make. Else it will show what you added.

::startApplication{port="8000" display="external" name="Get Cars" route="/djangoapp/get_cars"}

<details><summary> If the page doesn't open, select here to open the URL manually. </summary>

Select the Skills Network button on the right, it will open the "Skills Network Toolbox". Then select `OTHER` then `Launch Application`. From there you should be able to enter the port as `8000` and launch the development server.

Once the application is running on port 8000, append /djangoapp/get_cars to the URL to view the cars data from the database.
<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CD0321EN-SkillsNetwork/labs/module_1_static_pages/images/Launch_Application.png" style="width:80%; margin:.5cm; border: solid 1px grey">
</details>

#### Assessment:
 
**For Option 1: AI-Graded Submission and Evaluation:** Run the below command in a new terminal. Copy and paste the terminal output along with the command and save it in a text file named `getallcarmakes` for the final project submission and evaluation.

```
curl -X GET "<Django-URL>/djangoapp/get_cars"
```

> Note: Replace the Django URL with your actual URL before running the command.


**For Option 2: Peer-Graded Submission and Evaluation:** 
- Take a screenshot of the car and model and name it `cars.jpeg` or `cars.png`.

- Select the `Django Admin` button below and take a screenshot of the car models and save it as `car models.png` or `car models.jpeg`.

::startApplication{port="8000" display="external" name="Django Admin" route="/admin"}

::page{title="Commit your Updated Project to GitHub"}

Commit all updates to the GitHub repository to can save your work.

If you need to refresh your memory on how to commit and push your code to GitHub in the Theia lab environment, refer to the lab [Working with git in the lab environment](https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMDeveloperSkillsNetwork-CD0101EN-SkillsNetwork/labs/GitHubLabs/Github_commit.md.html)

::page{title="Summary"}

Congratulations on completing the **Lab: Build CarModel and CarMake Django Models!** In this lab, you have created the `CarModel` and `CarMake` models in your Django app.

## Author(s)

[Lavanya](https://www.linkedin.com/in/lavanya-sunderarajan-199a445/)

### Other Contributor(s)

Upkar Lidder
Yan Luo
Priya

<!--
## Changelog

| Date | Version | Changed by | Change Description |
|------|--------|--------|---------|
| 2023-11-21 | 1.0 | Lavanya T S | Initial version for v2 |
| 2023-11-28 | 2.0 | Kunal Merchant| QC-Reviewed and saved not published |
| 2024-01-19 | 3.0 | K Sundararajan | Typo error correction as per Beta testing  |
|2025-11-14 | 4.0 | Rajashree Patil | Assessment instruction update for MARK and PR |
|2025-12-08 | 5.0 | Bhavika | ID reviewed |
|2025-12-10 | 6.0 |Nikesh Kumar | added instructions for launch button |
-->
<h3 align="center"> &#169; Copyright IBM Corporation. All rights reserved. <h3/>