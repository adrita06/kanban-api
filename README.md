# Kanban API

A RESTful Kanban Board API built with **NestJS**, **Prisma ORM**, and **PostgreSQL**.

This project provides user authentication and complete board, column, and task management functionality for a Kanban application.

---

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt

### Boards
- Create Board
- Get All User Boards
- Get Single Board (including columns and tasks)
- Soft Delete Board

### Columns
- Create Column
- Update Column
- Delete Column

### Tasks
- Create Task
- Update Task
- Soft Delete Task
- Move Task between columns
- Reorder Tasks

---

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- class-validator
- Swagger

---

## Project Structure

```
src
├── auth
├── boards
├── columns
├── tasks
├── users
├── prisma
└── main.ts
```

---

## Database Schema

The project consists of the following entities:

- User
- Board
- Column
- Task
- TaskLabel

Relationships:

```
User
 └── Boards
       └── Columns
              └── Tasks
                     └── Labels
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Go to the project

```bash
cd kanban-api
```

Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kanban_db?schema=public"

JWT_SECRET="your-secret-key"

JWT_EXPIRES_IN="1d"
```

---

## Database Setup

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

(Optional)

Open Prisma Studio

```bash
npx prisma studio
```

---

## Running the Application

Development

```bash
npm run start:dev
```

Production

```bash
npm run build
npm run start:prod
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |

---

### Boards

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/boards` | Create board |
| GET | `/boards` | Get all boards |
| GET | `/boards/:id` | Get board with columns and tasks |
| DELETE | `/boards/:id` | Soft delete board |

---

### Columns

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/boards/:id/columns` | Create column |
| PATCH | `/columns/:id` | Update column |
| DELETE | `/columns/:id` | Delete column |

---

### Tasks

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/columns/:id/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Soft delete task |
| PATCH | `/tasks/:id/position` | Move and reorder task |

---

## Authentication

All endpoints except registration and login require a JWT access token.

Example:

```
Authorization: Bearer <your_jwt_token>
```

---

## Soft Delete

Boards and Tasks use soft delete by storing a timestamp in the `deletedAt` field instead of permanently removing records.

---

## Swagger

Swagger documentation is available at:

```
http://localhost:3000/api
```

---

## Author

**Adrita Ahsan**