# Environment Variables Guide

## Overview
This document explains all environment variables used in the application and where they should be configured.

## Root .env file (for docker-compose)
Location: `/Users/scott.queen/Projects/nextjs-auth-example/.env`

```bash
# Application Environment
NODE_ENV=development

# Database Configuration
POSTGRES_DB=nodeapi
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
DB_HOST=db
DB_PORT=5432
DB_NAME=nodeapi
DB_USER=postgres
DB_PASSWORD=password

# API Configuration
API_PORT=8000
API_KEY=dev-api-key-12345-change-in-production
JWT_SECRET=your-jwt-secret-key-change-in-production
SESSION_SECRET=your-session-secret-key-change-in-production

# Frontend Configuration
FRONTEND_PORT=3000
API_URL=http://api:8000
NEXT_PUBLIC_API_URL=http://localhost:8000

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Frontend .env.local
Location: `/Users/scott.queen/Projects/nextjs-auth-example/frontend/.env.local`

```bash
# API Configuration (for server-side calls from Next.js)
API_URL=http://api:8000
API_KEY=dev-api-key-12345-change-in-production

# Public API Configuration (for client-side calls)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here

# Environment
NODE_ENV=development
```

## API .env
Location: `/Users/scott.queen/Projects/nextjs-auth-example/api/.env`

```bash
# Application Configuration
NODE_ENV=development
PORT=8000

# API Security Configuration
API_KEY=dev-api-key-12345-change-in-production
JWT_SECRET=your-jwt-secret-key-change-in-production
SESSION_SECRET=your-session-secret-key-change-in-production

# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=nodeapi
DB_USER=postgres
DB_PASSWORD=password

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Domain Configuration
DOMAIN=localhost
```

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
