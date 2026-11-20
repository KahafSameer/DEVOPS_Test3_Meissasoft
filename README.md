# DEVOPS Test 3: Todo App with a DevSecOps CI Pipeline

A full-stack todo app built for DevOps practice: a **NestJS + PostgreSQL** API (`backend/`) and a **Next.js** frontend (`frontend/`). The repo also has a GitHub Actions pipeline that runs security scans on every pull request.

## Tech Stack

- **Backend:** NestJS, TypeORM, PostgreSQL (`pg`), `@nestjs/config`
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Axios
- **CI/Security:** GitHub Actions, CodeQL, Gitleaks, Trivy

## API (`backend/src/todos`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/todos` | List todos |
| `GET` | `/todos/:id` | Get a todo |
| `POST` | `/todos` | Create a todo |
| `PATCH` | `/todos/:id` | Update a todo |
| `DELETE` | `/todos/:id` | Delete a todo |

`Todo` fields: `id`, `title`, `description` (nullable), `isCompleted`, `createdAt`.

## Prerequisites

- Node.js and npm
- PostgreSQL

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string |
| `PORT` | `backend/.env` | API port (default `3000`) |
| `NEXT_PUBLIC_API_BASE_URL` | `frontend/.env.local` | Base URL of the API |

```env
# backend/.env
DATABASE_URL=your_postgres_connection_string_here
PORT=3000

# frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

`.env` files are git-ignored; never commit real values.

## Installation & Usage

```bash
git clone https://github.com/KahafSameer/DEVOPS_Test3_Meissasoft.git
cd DEVOPS_Test3_Meissasoft

# Backend
cd backend
npm install
npm run start:dev        # nest start --watch

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

If both run on the same machine, give them different ports: either set the backend's `PORT`, or start the frontend with `npm run dev -- -p 3001`.

| Backend scripts | Frontend scripts |
|---|---|
| `npm run start`, `npm run start:dev`, `npm run build` | `npm run dev`, `npm run build`, `npm run start`, `npm run lint` |

## CI Pipeline (`.github/workflows/ci.yml`)

Runs on pull requests to `dev` and `main`:

1. **CodeQL:** static code analysis
2. **Gitleaks:** secret scanning
3. **Trivy:** filesystem vulnerability scan
4. Install backend and frontend dependencies
