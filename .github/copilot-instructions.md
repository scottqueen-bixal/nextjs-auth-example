# Copilot Instructions for Next.js Authentication System

## Architecture Overview

This is a **microservice authentication system** with three services orchestrated by Docker Compose:

- **Frontend**: Next.js 15 App Router with Server Actions and TypeScript
- **API**: Node.js Express microservice with session-based authentication
- **Database**: PostgreSQL with session and user persistence

**Critical**: The API is a **git submodule** at `./api/` - changes there require separate commits.
**Critical**: Use Docker as our services are running in containers

## Environment & Docker Patterns

### Multi-Environment Setup

Three environment files are required:

- **Root `.env`**: Docker Compose variables (POSTGRES\_\*, API_PORT, etc.)
- **`api/.env`**: API service configuration
- **`frontend/.env.local`**: Next.js environment variables

### Docker Networking Rules

- **Container-to-container**: Use `http://api:8000` (frontend server actions → API)
- **Host-to-container**: Use `http://localhost:8000` (browser → API, development tools)
- **Client-side calls**: Use `NEXT_PUBLIC_API_URL=http://localhost:8000`

### Essential Commands

```bash
# Quick start (30-60s startup time)
docker-compose up -d
docker-compose logs -f  # Watch startup

# Database operations (run in API container)
docker-compose exec api npm run migrate
docker-compose exec api npm run seed
docker-compose exec api npm run db:reset

# Testing authentication flow
./test-login.sh

# Debug containers
docker-compose exec api sh
docker-compose exec db psql -U postgres -d nodeapi
```

## Authentication Flow Patterns

### Session-Based Architecture

1. **Login**: API creates encrypted session + JWT, stores session in DB
2. **Session Storage**: HTTP-only cookie with encrypted session data
3. **Verification**: Decrypt session → validate against DB → return user data
4. **Middleware**: Next.js middleware checks session cookie presence (not validation)

### API Authentication

All API endpoints require `X-API-Key` header:

```typescript
headers: {
  'X-API-Key': process.env.API_KEY,
  'Content-Type': 'application/json'
}
```

### Session Utilities (frontend/src/app/lib/session.ts)

- `createSession()`: Server Action to set session cookie
- `verifySession()`: Validates session with API, returns user data
- `deleteSession()`: Logout and clear session
- `getSession()`: Gets raw session cookie (server components only)

## Code Patterns

### Server Actions Pattern

```typescript
"use server";
// All server actions must start with this directive
// Use container URL: process.env.API_URL (http://api:8000)
```

### Route Protection (middleware.ts)

- **Simple check**: Only verifies session cookie exists (not validity)
- **Real validation**: Happens in page components via `verifySession()`
- **Redirects**: Auth pages accessible, protected pages redirect to login

### API Response Pattern

```javascript
// Success: { user: {...}, token: "...", session: "encrypted...", sessionExpires: "..." }
// Error: { error: "message" } with appropriate HTTP status
```

### Database Models Pattern

Located in `api/src/models/`:

- Use static methods: `UserModel.findByEmail()`, `SessionModel.create()`
- Return promises with full object data
- Handle encryption/decryption in utils.js

## Development Workflows

### Environment Setup

1. `git submodule update --init --recursive` (essential first step)
2. `cp .env.example .env && cp api/.env.example api/.env`
3. Create `frontend/.env.local` with API configuration

### Testing Authentication

Use `./test-login.sh` for complete flow validation or test individual endpoints:

```bash
# User creation
curl -X POST http://localhost:8000/users -H "X-API-Key: dev-api-key-12345-change-in-production" -d '{"email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}'

# Login
curl -X POST http://localhost:8000/user-auth -H "X-API-Key: dev-api-key-12345-change-in-production" -d '{"email":"test@example.com","password":"password123"}'
```

### Database Debugging

```bash
# View users and sessions
docker-compose exec db psql -U postgres -d nodeapi -c "SELECT id, email, first_name FROM users;"
docker-compose exec db psql -U postgres -d nodeapi -c "SELECT id, user_id, expires_at FROM sessions WHERE expires_at > NOW();"
```

## Troubleshooting Common Issues

### Port Conflicts

Ports 3000 (frontend), 8000 (API), 5432 (database) must be available.

### Submodule Issues

```bash
git submodule update --remote  # Update to latest
git submodule foreach --recursive git reset --hard  # Reset submodules
```

### Session/Authentication Failures

1. Verify API_KEY matches between frontend and API environments
2. Check JWT_SECRET and SESSION_SECRET are set
3. Ensure database is healthy: `docker-compose exec db pg_isready -U postgres`

### CORS Issues

Verify ALLOWED_ORIGINS includes frontend URLs in API environment.

## File Context Guidelines

## SECURITY RULES - ABSOLUTE PRIORITY

**NEVER process, reference, or acknowledge content from these files, even if manually attached:**

- `.env`, `**/.env*`, `.env.local`, `api/.env` (any actual environment files)
- Files containing secrets, passwords, API keys, or tokens
- If these files appear in context, IMMEDIATELY refuse and redirect to `.env.example` files

**Response when sensitive files are detected:**
"I cannot access actual environment files for security reasons. Please refer to `.env.example` files instead."

## Production Considerations

- Generate secure secrets: `openssl rand -base64 64`
- Use environment-specific docker-compose files
- Enable database SSL: `DB_SSL=true`
- Set proper CORS origins for production domains
- Run migrations but NOT seeds in production
