<p align="center">
  <img src="https://res.cloudinary.com/dxs3wvxxw/image/upload/v1749649632/logo_opfhiq.png" alt="Logo do Task Manager"/>
</p>

# Task Manager

## Table of Contents

- [Project Overview](#project-overview)
  - [Stack](#stack)
- [Setup](#setup)
  - [Cloning the Repo](#cloning-the-repo)
  - [Env](#ENV)
- [Running the Application](#running-the-application)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [What's next?](#whats-next)
- [Conclusion](#conclusion)

## Project Overview

This is a code challenge provided by tekna.rocks. The main goal of the application is to register and authenticate an user, thus letting the user create tasks and organize them. The user can create, read, edit and delete a task. The app was build to be a fullstack monorepo controlled by docker, so we have a backend, a frontend and a database that all run with some simple commands.

### Stack

- Backend
  - [NodeJS](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [Prisma](https://www.prisma.io/)
  - [Typescript](https://www.typescriptlang.org/)
- Frontend
  - [Angular](https://v17.angular.io/start)
  - [Angular Material](https://material.angular.dev/)
  - [SCSS](https://sass-lang.com/)
  - [Typescript](https://www.typescriptlang.org/)
- DB
  - [PostgreSQL](https://www.postgresql.org/)
- Infra
  - [Docker](https://www.docker.com/)
  - [Git](https://git-scm.com/)

## Setup

To complete the following actions, you must have **git** and **docker** installed in your computer, preferable in the last stable versions. You can download and install those applications in the links below:

- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/products/docker-desktop/)

### Cloning the repo

First, you have to clone the repo to your computer in order to change the code. However, before cloning the repo, it is important to **fork** it, in other words, create a copy of the repo to your github. To fork a repo, just scroll up in this page and click in the button with said function and wait until the proccess is done. After that, you can click in **clone or download** and copy the repo URL.

Now open the Git Bash. To perfom the cloning, you have to type the following lines and provide the URL that you copied in the last part:

```git
git clone <repo-url>
```

### ENV

In order to install the project, you have to create an `.env file` in the root folder of the project (the same folder that includes the `docker-compose.yml` file). The .env file has to follow the same pattern as the one provide as .env.example in the same folder. For the sake of commodity, this is the structure of an .env file that you must follow. The connection for the db has to follow this exact order, and the host name should be _db_.

```bash
# db connection
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=taskmanager_db

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public"

# jwt config
JWT_SECRET=a_secure_random_string_for_jwt_secret
```

> ### Database Hostname
>
> When configuring the `DATABASE_URL` in your `.env` file, it is crucial that the hostname specified in the connection string is `db`. This refers to the name of the database service as defined in the `docker-compose.yml` file, allowing the backend container to correctly resolve and connect to the database container within the Docker network.
>
> Example: `DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public"`

## Running the Application

To run the application, after creating an .env file, use the following command, with the terminal accessing the folder of the project:

```bash
docker-compose up --build
```

If you want to continue to use the terminal instance, you can run it in the detached version:

```bash
docker-compose up --build -d
```

This code will read the docker-compose.yml file and the respective dockerfiles, create a DB image, a backend build and a frontend build. You can access the frontend of the application in (`http://localhost:4200`). If you want to test the API routes, you can direct your requests to (`http://localhost:4000`).

## Scripts

There is a script in the `/backend/src/scripts/` folder that can be executed. It'll clean all the tasks of a specific user.

- 1. Change the user email in the script (var userEmailToClean).

- 2. Find the name of your backend container using `docker ps`. It usually looks like `yourprojectname-backend-1`.

```bash
docker ps
```

- 3. After it, run the following command to execute the script in the container:

```bash
docker exec -it <nome_do_container_backend> ts-node src/scripts/cleanUserTasks.ts
```

## Architecture

The app is created to be a fullstack monorepo, it uses node + express + prisma for the backend and angular for the frontend. There is a root project folder with configurations for Prettier, Husky, an .env.example file and the docker-compose file that controls the build of the two projects: backend and frontend.

The backend folder strucuture is as follow:

- **prisma**<br />
  This folder was generated by prisma when the app first run, it creates the tables in the DB and runs a seed migration to populate a test user. You can access this test user or register one for yourself.
- **controllers/middlewares/routes**<br />
  The basic structure of an express app, these are the functions that connects with the REST flow and with the frontend, the middleware is for authentication.
- **scripts**<br />
  To run directed in the terminal and manipulate data within an specific scope.

The frontend folder strucuture is as follow:

- **core**<br />
  This folder keeps the helper functions, the auth-guards for the router and the interceptors for the requests to the API.
- **shared**<br />
  Components and interfaces that will be shared among the whole application.
- **services**<br />
  The functions that control the communication with the API.
- **tasks/auth**<br />
  The components and pages of the application, the auth pages are for login/register, and the task page is for the CRUD operations.

## What's Next?

When it comes time to upgrade this MVP to a next version, there's some technical debt created during development that would be good to address.

### Backend

- Add more user information during registration.
- Decouple controllers for better modularity.
- Integrate a logging system (Morgan).
- Implement database and backend validation using `@@unique(title, userId)`, create uniqueness to emails in the register as well.
- Transition from numeric IDs to UUIDs for enhanced uniqueness and security.
- Create a documentation for the API routes (Swagger).

### Frontend

- Implement frontend validations (integrating with the Zod schema from the backend).
- Display input errors during user registration and login.
- Enhance the authentication store (change RxJS Behavior Subject to an actual flux lib, like NgRx or Akita).

### General

- Add pagination, sorting, and filtering capabilities.
- Improve overall type safety across the application.
- Implement comprehensive unit tests.

## Conclusion

The web app was created to be a fullstack application that can process the basic CRUD operations for an user that has its one email and password. I learnt a lot coding this project, primarily about docker containerization, the configs of an nginx build in an angular app, how to run and operate a postgres database and it was the first time that I developed something with Angular, it was a pleasant surprise to see the frontend working.

Overall, this was a nice project that, even with the lack of some features (mostly tests), should work seamlessly. I hope you'll like it. =)
