::page{title="Add Continuous Integration and Continuous Deployment"}

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-CC0100EN-SkillsNetwork/images/IDSN-logo.png" width="200/">

##

**Estimated time:** 60 minutes

Your team is growing! Management has decided to hire front-end and back-end engineers to ensure features on the roadmap are developed in time for future releases. However, this means that multiple engineers will need to work in parallel on the repository. You are tasked with ensuring the code being pushed to the main branch meets the team coding style and is free of syntax errors.

In this lab, you will add linting to your repository that automatically checks for such errors whenever a developer creates a pull request or merges a branch with the default main branch. Before you dive into the lab, here is a primer on GitHub Actions.

# GitHub actions
GitHub actions provide an event-driven way to automate tasks in your project. There are several kinds of events that you\'ve come across, such as:
- **push**: Runs tasks when someone pushes to a repository branch
- **pull_request**: Runs tasks when someone creates a pull request (PR). You can also start tasks when certain activities happen, such as:
  - PR opened
  - PR closed
  - PR reopened
- **create**: Run tasks when someone creates a branch or a tag
- **delete**: Run tasks when someone deletes a branch or a tag
- **manually**: Jobs are kicked off manually

## GitHub action components
In this lab, you can leverage one or more GitHub action components listed below:
- **Workflows**: A collection of jobs you can add to your repository.
- **Events**: An activity that launches a workflow.
- **Jobs**: A sequence of one or more steps. Jobs are run in parallel by default.
- **Steps**: Individual tasks that can run in a job. A step may be an action or a command.
- **Actions**: The smallest block of a workflow.

## GitHub workflow
Review the GitHub workflow template below.

```
name: 'Lint Code'

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]

jobs:
  lint_python:
    name: Lint Python Files
    runs-on: ubuntu-latest

    steps:

    - name: Checkout Repository
      uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: 3.12

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install flake8

    - name: Print working directory
      run: pwd

    - name: Run Linter
      run: |
        pwd
        # This command finds all Python files recursively and runs flake8 on them
        find . -name "*.py" -exec flake8 {} +
        echo "Linted all the python files successfully"

  lint_js:
      name: Lint JavaScript Files
      runs-on: ubuntu-latest

      steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install JSHint
        run: npm install jshint --global

      - name: Run Linter
        run: |
          # This command finds all JavaScript files recursively and runs JSHint on them
          find ./server/database -name "*.js" -exec jshint {} +
          echo "Linted all the js files successfully"
```

1. The first line names the workflow.
2. The next line defines when this workflow will run. The workflow should run when developers push a change to the main branch or create a PR. These two ways are captured as below:
   - Run the below command on push to the main branch (main or master):
      ```
      push:
        branches: [master, main]
      ```
   - Run the below command when PR is created on main branches (main or master):
      ```
      pull_request:
        branches: [master, main]
      ```
3. Next, define all the jobs. There are two jobs in this workflow:
   - lint_python: Linting Python unction
   - lint_js: Linting Javascript function

## GitHub jobs
Let\'s look at GitHub jobs:
1. lint_python
   - Set up the Python runtime for the action to run using the `actions/setup-python@v4` action
   - Install all dependencies using `pip install flake8`
   - Run the linting command `flake8 *.py` in all files in server directory recursively
   - Print a message saying the linting was completed successfully

2. lint_js
   - Set up the `Node.js` runtime for the action to run using the `actions/setup-node@v3`action
   - Install all JSHint linter `n&#8203;pm install jshint`.
   - Run the linting command on all the `.js` files in the database directory recursively
   - Print a message saying the linting was completed successfully

::page{title="Enable GitHub Actions"}

1. To enable GitHub action, log into GitHub and open your forked repo. Next, go to the `Actions` tab and select `Set up a workflow yourself`.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m2/images/setup_workflow.png" style="margin-bottom:20px;margin-top:10x;border:solid grey 1px">

2. Paste the lint code given above inside `main.yml` and select **Commit changes**.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m2/images/edit_workflow.png" style="margin-bottom:20px;margin-top:10x;border:solid grey 1px">

3. Open the `Actions` tab again, and you will see that the committed changes has automatically started the lint workflow.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m2/images/workflow_WIP.png" style="margin-bottom:20px;margin-top:10x;border:solid grey 1px">

4. Select the workflow run to see the individual jobs and the logs for each job. When the workflow successfully completes, you will see the green tick indicating it went well. A red cross would mean there were errors found in the code while linting.

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0321EN-Coursera/labs/v2/m2/images/workflow_success.png" style="margin-bottom:20px;margin-top:10x;border:solid grey 1px"> <br>

5. Review the hints given below to resolve usual Linting errors you could come across.

<details>

<summary> Click here </summary>

### Flake-8 Lint (Python) Linting errors:

##### 1. If you receive one or more errors as listed below:
```
E117 over-indented
E128 continuation line under-indented for visual indent

```

##### Resolution:
Verify that all code maintains appropriate indentation—neither under-indented nor over-indented.

> Note: Use a text editor to ensure accurate implementation.

##### 2. Error: 
```
E501 line too long (xxx > 79 characters)
```

##### Resolution:
Split the code into multiple lines, ensuring that each line has a maximum of 79 characters or less.

##### 3. Error:
```
F401 'xxx' imported but unused
```

##### Resolution:
Verify whether the mentioned entity or variable ('xxx') is utilized in subsequent code segments. Remove the line containing it if the entity/variable is unused.

##### 4. Error:
```
W292 no newline at end of file
```

##### Resolution:
Insert a new line after the final code in the file and position the cursor at the far-left vertical pane (without any rightward indentation).

##### 5. Error:
```
 E302 expected 2 blank lines, found 1
```

##### Resolution:
Ensure there are exactly two empty lines (not more, not less) between each pair of adjacent functions.

eg: 
```
....... "1st function ends"..

def "Next_function"():
```

##### 6. Error:
```
E231 missing whitespace after ':'
```

##### Resolution:
Make sure to leave a space after the semicolon in all dictionary key-value pairs.

For eg. If the existing code is  `"a":"b"` , please change it to `"a": "b"`

##### 7. Error:
```
E275 missing whitespace after keyword
```

##### Resolution:
Ensure there is one white space after every keyword.

For instance, if your existing code is `if("condition"):`, please change it to `if ("condition"):` as demonstrated.

##### 8. Error:
	
```
E722 do not use bare 'except'
```

##### Resolution:

Use `except Exception:` instead of `except` as a best practice for catching exceptions and handling them comprehensively.

For instance, if the existing code is:
```
except:
	print("Error")
```

You can change this to:
```
except Exception as e:
	print(f"Error: {e}")
```

<br> <br>

### JS Hint (Javascript) Linting errors:

##### 1.  If you receive one or more errors as listed below:
```
'const' is available in ES6 (use 'esversion: 6') or Mozilla JS extensions (use moz).

'arrow function syntax (=>)' is only available in ES6 (use 'esversion: 6').

'async functions' is only available in ES8 (use 'esversion: 8').

'let' is available in ES6 (use 'esversion: 6') or Mozilla JS extensions (use moz).

'template literal syntax' is only available in ES6 (use 'esversion: 6').
```

##### Resolution:
Add the line below at the start of the file(s) where this error is reported:

```
/*jshint esversion: 8 */
```
<br>

##### 2. Error:
```
['xxxxxx'] is better written in dot notation.
```

- Resolution:
This issue arises when Dictionary/JSON key-value pairs are formatted as `key[value]`. To resolve it, switch the format to `key.value`.

For example, if you have the existing code as: `keyA['valA']`, update it to `keyA.valA`.

</details>

::page{title="Assessment"}

 
<h4>For Option 1: AI-Graded Submission and Evaluation:</h4>  Follow the steps given below

1. Start by installing the GitHub CLI (`gh`) using the commands given below:

```bash
sudo apt update
```
```bash
sudo apt install gh
```

2. Authenticate GitHub CLI using command `gh auth login`

Run the below command in your terminal:

```shell
gh auth login
```

When prompted, select the options given below:
1. What account do you want to log into?
   Select **GitHub.com**

2. What is your preferred protocol for Git operations?
   Select **HTTPS**

3. Authenticate Git with your GitHub credentials?
   Type **Y**

4. How would you like to authenticate GitHub CLI?
   Select **Paste an authentication token**

   > If you haven\'t already you can generate a Personal Access Token (PAT) by following the instructions given in the [Hands-on Lab: Generate GitHub personal access token](https://author-ide.skills.network/render?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZF9pbnN0cnVjdGlvbnNfdXJsIjoiaHR0cHM6Ly9jZi1jb3Vyc2VzLWRhdGEuczMudXMuY2xvdWQtb2JqZWN0LXN0b3JhZ2UuYXBwZG9tYWluLmNsb3VkL0lCTS1DRDAxMzFFTi1Ta2lsbHNOZXR3b3JrL2xhYnMvY3JlYXRlLXBlcnNvbmFsLXRva2VuL2luc3RydWN0aW9ucy5tZCIsInRvb2xfdHlwZSI6Imluc3RydWN0aW9uYWwtbGFiIiwiYWRtaW4iOmZhbHNlLCJpYXQiOjE2OTMyMDM0NzZ9.trhrHYxgdMIc-UW_NwcM9WeUOGzIfaIJMAcENksvrHg) and be sure to include these scopes: `repo`, `read:org` and `workflow`

5. Paste your authentication token
   Paste your PAT into the terminal
   > Note: If you see an `error validating token: missing required scope` error after entering your PAT, generate a new token and be sure to include these scopes: `repo`, `read:org` and `workflow`

Once done, you should see messages confirming:

* Git protocol configured
* Logged in with your GitHub username

3. Next, clone your GitHub repository and move into the project\'s root directory in the terminal.

<details>
<summary>Click here for a hint.</summary>

Use the following commands to clone the repository and change directories:

```shell
git clone <your-github-repository-link>
cd xrwvm-fullstack_developer_capstone
```

</details>

4. To get the list of workflow runs for your GitHub repository run the following command from your project directory in the terminal:

```bash
gh run list
```
 When prompted:

```
? Which should be the base repository (used for e.g. querying issues) for this directory?
```
Select the repository with your github username.

After the list of workflow runs is displayed, pick the top most `run-id` from the output and view its details using command below:

```bash
gh run view <run-id> --verbose
```
> Replace `<run-id>` with the ID shown in the list.

This will give you detailed information about that workflow run.

> Note: Ensure you are inside the correct repository directory and have successfully authenticated using ```gh auth login``` before running these commands.

Your output should appear similar to the image below:

<img src="https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/G1_HxXYxT79YydNxuLhIJg/image%20-19-%20-1-.png">

5. Copy and paste the terminal output that shows your GitHub Actions workflow running successfully and save it in a text file named `CI/CD` for the final project submission and evaluation. The output should clearly display the steps executed in the workflow.

#### For Option 2: Peer-Graded Submission and Evaluation
Take a screenshot of the action workflow succeeding and save it as `CI/CD.png` or `CI/CD.jpeg`.

::page{title="Summary"}

Congratulations on completing the **Lab: Add Continuous Integration and Continuous Deployment!**
	
In this lab, you added a linting service to your application. As a result, all new code will automatically get checked for syntax errors, and this will ensure all developers are following the team coding guidelines.

## Author(s)
<h4> Upkar Lidder <h4/>
<h4> Lavanya T S <h4/>

### Other Contributor(s)
Yan Luo

Priya
<!--
## Changelog
| Date | Version | Changed by | Change Description |
|------|--------|--------|---------|
| 2023-11-22 | 1.0 | Lavanya | Initial version created |
|2023-11-28|2.0| Pornima | QA pass with edits|
|2023-11-28|3.0| Pornima | Made further QA review-based corrections & changed changelog year to 2023 |
|2024-01-04|4.0| Sundararajan | Linting errors and resolutions added in instructions |
|2024-01-18|5.0| Sundararajan | Updates based on Beta testing comments |
|2025-11-17 | 6.0 | Rajashree Patil | Assessment instruction update for MARK and PR |
|2025-12-09 | 6.0 | Bhavika | ID reviewed |
|2026-08-21 | 6.1 | Sameep | Instructions corrected |
-->
## <h3 align="center"> © Copyright IBM Corporation. All rights reserved. <h3/>
