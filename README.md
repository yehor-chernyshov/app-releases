# Deployments

[![CodeQL](https://github.com/yehor-chernyshov/deployments/workflows/CodeQL/badge.svg)](https://github.com/yehor-chernyshov/deployments/actions?query=workflow%3ACodeQL "Code quality workflow status")

**Deployments** is an [ExpressJS](https://expressjs.com) + [MongoDB](https://www.mongodb.com) based app, contains api endpoints and view, which could be used for getting actual information about deployed versions of your applications.

### Overview 
POST request to deployment api -> save to MongoDB -> webhook to external apps (for example Slack)

## Motivation
For having possibility add more visibility and automatics in deyploments process of different apps inside of company for developers, managers, qa and etc. 

## Screenshots
Login
![Login](/screenshots/login.png)
Deployments
![Deployments](/screenshots/deployments.png)
Slack notification
![Slack notification](/screenshots/slack.png)

## API Reference
 [Swagger](https://swagger.io) API reference could be checked in all not production environments under `/api-docs` url.

## How to start app?
- copy `.env.dist` to `.env` file and updated values
- start directly 
```bash 
npm install
npm start
```
- start with Docker
```bash 
docker-compose up -d 
```

## How to use?
- for adding nde deployment: send request to API
- for getting web-based view: visit main page and use one from `API_READ_TOKENS` in form 
- for activating Slack integration: fill in `SLACK_URL` env var in `.env` file with [url](https://api.slack.com/messaging/webhooks#getting_started)
- for sending request to api could be used: 
    - `scripts/release.sh`
    - [Heroku webhooks](https://devcenter.heroku.com/articles/app-webhooks). Please use heroku deployments api endpoint with `env` get param in url

## Deployment

Right now it is possible to deploy this application with: 
- **Docker** (change MongoDB passwords and add volume)
- **Heroku** (could be used [free Heroku account](https://www.heroku.com/free) for hosting and [free account for MongoDB](https://docs.atlas.mongodb.com/tutorial/deploy-free-tier-cluster/))

## Development
- add new webhook - check as example `src/webhooks` and register in `src/webhooks/index.js` file
- add new deployment endpoing - check `routes/deployments.js`


## [Contributing](CONTTIBUTING.md)

## [Code of conduct](CODE_OF_CONDUCT.md)

## [License](LICENSE)