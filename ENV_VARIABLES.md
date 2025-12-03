## Overview
This document explains all environment variables used in the application and where they should be configured.

## Root `.env`
Location: project root (`.env`). Consumed by both Docker Compose stacks and local scripts.

| Variable | Default | Purpose |
| --- | --- | --- |
| `AUTH_FRONTEND_URL` | `http://localhost:3001` | Public URL for the auth UI; used by the main app when constructing login redirects. |
| `FRONTEND_URL` | `http://localhost:3000` | Public URL for the main Next.js app; used by auth flows when returning users after login. |
| `DB_NAME` | `nodejs_app` | Shared Postgres database name. |
| `DB_USER` | `postgres` | Database username. |
| `DB_PASSWORD` | `postgres` | Database password (use strong secret in production). |
| `NODE_ENV` | `production` | Default runtime mode for container builds. |
| `API_KEY` | `dev-api-key-12345-change-in-production` | Shared secret between auth frontend and API. Must match on both services. |
| `JWT_SECRET` | `your-jwt-secret-key-change-in-production` | Secret for signing JWT tokens in auth API. |
| `SESSION_SECRET` | `your-session-secret-key-change-in-production` | Secret used for session encryption in auth API. |

> These values propagate into Docker services via `docker-compose.yml` (`auth` stack) and must be present before `docker compose up`.

## Docker Compose exports
Location: `docker-compose.yml`, `auth/docker-compose.yml`

Additional variables injected when running the Docker stacks:

| Variable | Defined In | Purpose |
| --- | --- | --- |
| `API_URL` | `auth/docker-compose.yml` → auth frontend | Points the auth UI to the API (`http://api:8000` inside the network). Override for external deployments. |
| `NEXT_PUBLIC_API_URL` | `auth/docker-compose.yml` → auth frontend | Same endpoint exposed to client code when needed. |
| `FRONTEND_PORT`/`API_PORT`/`DOCS_PORT` | commented in `.env` | Optional overrides for published container ports. |
| `ALLOWED_ORIGINS` | `.env` (optional) | Comma-delimited list of origins allowed by API CORS middleware. Defaults to `http://localhost:3000` and `127.0.0.1`. |

## Auth API environment
Location: values injected via `auth/docker-compose.yml` or manual `.env` when running locally inside `auth/api/`.

Key variables in use (`auth/api/src`):

| Variable | Usage |
| --- | --- |
| `PORT` | Express listen port (`auth/api/src/app.js`). |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Database connection config (`auth/api/src/config/database.js`, `knexfile.js`). |
| `API_KEY` | Header validation in `auth/api/src/middleware/auth.js`. Must match frontend. |
| `JWT_SECRET` | JWT signing in `auth/api/src/routes/user-auth.js`. |
| `SESSION_SECRET` | Session encryption helpers in `auth/api/src/utils.js`. |
| `ALLOWED_ORIGINS` | Optional CSV list for CORS origins (`auth/api/src/app.js`). |

When running the API standalone (e.g., `npm run dev` inside `auth/api`), create a `.env` mirroring the root variables above or export them in your shell.

## Auth frontend environment
Location: values injected via `auth/docker-compose.yml` or shell when running `auth/frontend` locally.

| Variable | Usage |
| --- | --- |
| `API_URL` | Server actions fetch the auth API (`auth/frontend/src/app/actions/login.ts`, `signup.ts`, `lib/session.ts`). |
| `API_KEY` | Passed in API requests for authentication headers. |
| `NEXT_PUBLIC_API_URL` | Optional public endpoint for client components (unused by default but available in Next if needed). |
| `FRONTEND_URL` | Used to build absolute redirect URLs back to the main app (`auth/frontend/src/app/lib/redirects.ts`). |

When developing the auth frontend without Docker, provide these variables with `.env.local` in `auth/frontend/` or export them before running `npm run dev`.


## Usage in Code

### Frontend (Next.js)
- **API_URL**: Used in server actions for API calls (login, signup, session management)
- **API_KEY**: Used in API requests to authenticate with backend
- **NEXT_PUBLIC_API_URL**: Used for client-side API calls (if any)

### Backend (Express API)
- **API_KEY**: Used in middleware to validate incoming requests
- **JWT_SECRET**: Used for JWT token generation and verification
- **SESSION_SECRET**: Used for session encryption/decryption
- **DB_***: Database connection configuration
- **ALLOWED_ORIGINS**: CORS configuration

## Security Notes

1. **Never commit .env files** - they contain sensitive information
2. **Use different secrets for production** - change all secret keys for production
3. **API_KEY must match** between frontend and backend
4. **Use strong secrets** for JWT and session encryption

## Docker Networking

- **From host machine**: Use `http://localhost:8000` for API calls
- **Between containers**: Use `http://api:8000` for API calls
- **Frontend server actions**: Use `http://api:8000` (container-to-container)
- **Client-side calls**: Use `http://localhost:8000` (browser-to-host)
