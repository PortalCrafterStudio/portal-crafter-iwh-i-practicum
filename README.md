# Welcome to the Integrating With HubSpot I: Foundations Practicum

This repository is for the Integrating With HubSpot I: Foundations course. This practicum is one of two requirements for receiving your Integrating With HubSpot I: Foundations certification. You must also take the exam and receive a passing grade (at least 75%).

To read the full directions, please go to the [practicum instructions](https://app.hubspot.com/academy/l/tracks/1092124/1093824/5493?language=en).

**Put your HubSpot developer test account custom objects URL link here:** https://app.hubspot.com/contacts/248106732/objects/2-272336767/views/all/list

## My practicum: Plants

The custom object is **Plants** (`2-272336767`) in developer test account `248106732`. It has four custom properties: **Name** (string, required), **Species** (string), **Sunlight** (dropdown) and **Watering frequency (days)** (number), and it is associated with Contacts.

### Run it locally
1. `npm install`
2. Copy `.env.example` to `.env` and set `PRIVATE_APP_ACCESS` to the private app access token. `.env` is gitignored, so the token never goes into the repo.
3. `node index.js`, then open http://localhost:3000

### Routes
- `GET /` reads every Plant record from the CRM API and shows them in a table, with an "Add to this table" link.
- `GET /update-cobj` renders the `updates` form for a new Plant.
- `POST /update-cobj` creates the Plant record in HubSpot, then redirects to the homepage.

`scripts/setup-plants.js` is the one-time script that created the custom object schema, the sample records and their contact associations.

___
## Tips:
- Commit to your repository often. Even if you make small tweaks to your code, it’s best to be committing to your repository frequently.
- The subject of the custom object is up to you. Feel free to get creative!
- Please create a test account and include your private app access token in your repo.
- Ensure you re-merge any working branches into the main branch.
- DO NOT ADD YOUR PRIVATE APP TOKEN TO YOUR REPOSITORY. 

## Pre-requisites:
- Using [Node](https://nodejs.org/en/download) and node packages
- Using [Express](https://expressjs.com/en/starter/installing.html)
- Using [Axios](https://axios-http.com/docs/intro)
- Using [Pug templating system](https://pugjs.org/api/getting-started.html)
- Using the command line
- Using [Git and GitHub](https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners)

## Requirements
- All work must be your own. During the grading process we will check the revision history. Submissions that do not meet this requirement will not be considered.
- You must have at least two new routes in your index.js file and one new pug template for the homepage.
- You must create a developer test account and link to it in your README.md file. Submissions that do not meet this requirement will not be considered.
