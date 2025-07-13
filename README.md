# Songs Pocket Book

# Table of Contents

- [Stack](#stack)
- [Installation](#installation)
- [Features](#features)
- [API](#api)
- [Pages](#pages)
- [Formatting](#Formatting)
- [Git](#Git)
- [TODO](#todo)

## Stack

- [Node.js](https://nodejs.org/)
- [express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Installation

### Prerequisites

- install [Node.js](https://nodejs.org/) v22.14.0 or higher
- install and setup [gsutil tool](#google-cloud)
- clone the repository
- install dependencies by running `npm install` in root, `/projects/api/` and `/projects/client/` folders
- create `.env` file in `/projects/api/` folder according to example from `/projects/api/.env.example`

### API

- run `npm run start` in `/projects/api/` folder for production
- run `npm run start:dev` or `npm run start:debug` for development
- by default API server exposes on `http://localhost:8080`

### Client

- run `npm run build` in `/projects/client/` folder for building script file once
- run `npm run build:dev` for building script file in watch mode
- run `npm run start:dev` to start development server for client
- development server exposes on `http://localhost:3000`
- for production, you can use [nginx](https://www.nginx.com/) to serve static files from `/projects/client/public`
  folder or Docker (see below)

### Database

Project uses **MongoDB** as database. You can use it on your host machine, Docker or use one from cloud.

### Google Cloud

- install [gsutil](https://cloud.google.com/sdk/docs/quickstart)
- initialize google cloud `gcloud init`
- (optional) set project `gcloud config set project [project_id]`
- authenticate with gcloud `gcloud auth application-default login`
- now you can run `npm run secrets:fetch [env_name]` to fetch secrets from bucket
- run `npm run secrets:upload [env_name]` to upload secrets to bucket
- run `npm run setup [env_name]` to set up fetched files from bucket

`[env_name]` could be `dev`- dev environment, `docker` for run locally in docker or `live`- for build

### Docker

- create `.env` file in the root according to example from `.env.example` or get it from GCP Cloud Storage
- to set up database you can create folder `initdb` inside `/assets` folder and put there `.js` files to run needed
  migrations. (`npm run setup [env_name]` does it automatically)
- run `docker-compose up` in the root to start the project in Docker in production mode
- run `docker-compose -f docker-compose.dev.yml up --build` to start the project in Docker in development mode

## Features

- authorisation
  - create account
  - email account verification
  - resend verification message
  - password recovery
  - login/logout
  - sessions via JWT tokens
  - change email/password
  - account deletion
- categories manipulations
  - create categories
  - rename own category
  - delete empty category
- songs manipulations
  - create song
  - edit own song
    - name
    - text
    - categories
  - delete own song

## API

- /auth
  - POST /auth/signup
  - POST /auth/login
  - GET /auth/refresh
  - GET /auth/logout
  - GET /auth/activate/:id
- /cabinet
  - POST /cabinet/email
  - POST /cabinet/password
  - GET /cabinet/validation
  - DELETE /cabinet
- /category
  - GET /category
  - GET /category/:id
  - POST /category
  - PUT /category/:id
  - DELETE /category/:id
- /song
  - GET /song
  - GET /song/:id
  - POST /song
  - PUT /song/:id
  - DELETE /song/:id

## Pages

- index `/`
- text `/lit, /pan`
- auth `/auth`
- cabinet `/cabinet`
- categories `/category`
- category `/category/:id`
- new_category `/category/add`
- song `/song/:id`
- new_song `/song/add`
- edit_song `/song/:id/edit`
- 404

## Formatting

Project uses [Prettier](https://prettier.io/) v3 for code formatting. You can run `npm run format` from the root of the project.
Project uses [ESLint](https://eslint.org/) v9 for code analyzing. You can run `npm run check-quality` from the root of the project.

## Git

- Prod branch is `master`.
- Project uses [husky](https://typicode.github.io/husky) for pre-commit hooks.

## TODO

- implement pagination
- Abort Controller ???
- add `service-worker.js` ???
- add minify css tool
