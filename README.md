# App

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## 📖 About

This project is a **GymPass-like API** developed during the **Node.js course from Rocketseat**. It's a REST API that implements a gym check-in system with authentication, geolocation validation, and business rules enforcement, following **SOLID principles** and **Clean Architecture**.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd 03-api-solid
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the environment variables needed:
```bash
# Database
DATABASE_URL="postgresql://docker:docker@localhost:5433/apisolid?schema=public"

# JWT
JWT_SECRET="your-jwt-secret-here"
```

4. Start the PostgreSQL database with Docker:
```bash
docker compose up -d
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3333`

## 🧪 Running Tests

```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests in watch mode
npm run test:watch:e2e

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **TypeScript** - Programming language
- **Fastify** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Vitest** - Testing framework
- **Docker** - Containerization
- **Zod** - Schema validation
- **bcryptjs** - Password hashing
- **JWT** - Authentication

## 📋 Functional Requirements (FRs)

- [x] It must be possible to register;
- [x] It must be possible to authenticate;
- [x] It must be possible to retrieve the profile of a logged-in user;
- [x] It must be possible to retrieve the number of check-ins performed by the logged-in user;
- [x] It must be possible for the user to view their check-in history;
- [x] It must be possible for the user to search for nearby gyms;
- [x] It must be possible for the user to search for gyms by name;
- [x] It must be possible for the user to check in at a gym;
- [ ] It must be possible to validate a user's check-in;
- [x] It must be possible to register a gym;

## ⚙️ Business Rules (BRs)

- [x] A user must not be able to register with a duplicate email address;
- [x] A user must not be able to perform more than one check-in on the same day;
- [x] A user must not be able to check in unless they are within 100 meters of the gym;
- [ ] A check-in can only be validated within 20 minutes after it is created;
- [ ] A check-in can only be validated by administrators;
- [ ] A gym can only be registered by administrators;

## 🛠 Non-Functional Requirements (NFRs)

- [x] The user's password must be encrypted;
- [x] The application data must be persisted in a PostgreSQL database;
- [x] All data lists must be paginated with 20 items per page;
- [ ] The user must be identified via a JWT (JSON Web Token);
