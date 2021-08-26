<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/adi.sreyaj/compito">
    <img src="assets/compito-full-logo.png" alt="Logo" width="333" height="100">
  </a>

  <h3 align="center">Compito - Tasks Done Right ✔️</h3>

  <p align="center">
    A simple and user friendly project management application without support for multiple Orgs and RBAC
    <br />
    <br />
    <a href="https://compito.adi.so">View Demo</a>
    ·
    <a href="https://github.com/adisreyaj/compito/issues">Report Bug</a>
    ·
    <a href="https://github.com/adisreyaj/compito/issues">Request Feature</a>
  </p>

  <p align="center">
   <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
   <img src="https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white">
   <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
   <img src="https://img.shields.io/badge/auth0-%23eb5424.svg?style=for-the-badge&logo=auth0&logoColor=white">
   <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white">
   <img src="https://img.shields.io/badge/prisma-%231a202c.svg?style=for-the-badge&logo=prisma&logoColor=white">
   <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
  </p>
</p>

![Compito Project Management](/assets/compito.jpg 'Compito Project Management')

Compito is a simple and easy to use project management application with support for Multiple orgs. Each org can have multiple projects in it. Users can be then given access to the org or the project by assigning them different roles.

Each project can have multiple boards to manages different parts of the project. Making it easy to maintain.

### Home Page

The home page gives you an overview of the tasks, and projects the user has access to. The user can see tasks that were recently created and the high priority tasks as well.

There are quick links to get to projects and boards from the home page.

![Compito Project Management](/assets/compito.gif 'Compito Home Page')

### Boards Page

With a simple Kanban board, you can easily track your tasks and assign it to different users within the project.
You can create new tasks with ease. Cards can be dragged and dropped as you progress.

![Compito Project Board](/assets/board.jpg 'Compito Board')

### Orgs Page

User can be part of multiple orgs. User can view all the orgs he/she is part of. The user can only access the data of an org. When the user logs in, If they are part of multiple orgs, they will be asked to select an org to log in to.

![Compito Project Orgs](/assets/orgs.jpg 'Compito Ors page')

### Users Page

List the members in the org/project based on the role. Admin users can invite new users to the org. The list of pending user invites are also shown in the users page.

![Compito Project Users](/assets/users.jpg 'Compito Users Page')

### Projects Page

Shows the list of projects in the org the user have access to. Clicking on the project would take you to the detail page where the boards, and members within the project can be seen.
Users with admin access will be able to update the project details and add/remove members to/from the project.

![Compito Project Projects](/assets/projects.jpg 'Compito Projects Page')

### Role Hierarchy

Users are assigned Admin role when they signup to the application.
While inviting other users to the org, a role can be specified. The role will be deciding the level of access that particular user have.

![Role hierarchy](/assets/compito-roles.jpg 'Role hierarchy')

## Built With

![Tech Stack](/assets/stack.png 'Technologies used')

- [Angular](https://angular.io/)
- [Tailwind](https://tailwindcss.com/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Nx](https://nx.dev/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/adisreyaj/compito.git
   ```
1. Install NPM packages
   ```sh
   npm install
   ```
1. Run the docker-compose script to initialize the local db
   ```sh
   sudo docker-compose up -d
   ```
1. Configure the environment variables

   ```
   DATABASE_URL=postgresql://<username>:<password>@localhost/compito
   ADMIN_PASS=<admin_pass>

   AUTH0_AUDIENCE=<audience>
   AUTH0_ISSUER_URL=https://<your_domain>.us.auth0.com/
   AUTH0_DB=<database_name>
   AUTH0_DOMAIN=<your_domain>.us.auth0.com
   AUTH0_CLIENT_ID=<machine_to_machine_client_id>
   AUTH0_CLIENT_SECRET=<machine_to_machine_client_id>
   # for dev env
   AUTH0_MANAGEMENT_TOKEN=<managment_api_token>

   # secret used to encode the session token in Auth Action
   SESSION_TOKEN_SECRET=<action_secret>
   ```

1. Run the UI
   ```sh
   npm start
   ```
1. Run the API server
   ```sh
   npm start api
   ```

## Roadmap

See the [open issues](https://github.com/adisreyaj/compito/issues) for a list of proposed features (and known issues).

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Show your support

Please ⭐️ this repository if this project helped you!
