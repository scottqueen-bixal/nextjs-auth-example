# Next.js Authentication & User Management System

A complete full-stack authentication and user management system built with Next.js 15, Node.js, and PostgreSQL. This project demonstrates modern authentication patterns including session management, password hashing, JWT tokens, and secure microservice architecture.

## Features

### Authentication & Security
- **Session-Based Authentication** - Secure server-side session management
- **Password Hashing** - Bcrypt-style password hashing with salt
- **JWT Token Support** - JSON Web Token generation and verification
- **API Key Authentication** - Secure API key validation middleware
- **Session Encryption** - Encrypted session data for client-side storage
- **CSRF Protection** - Cross-site request forgery protection
- **HTTPS Enforcement** - Secure cookies and headers in production

### User Management
- **User Registration** - New user creation with validation
- **User Login/Logout** - Complete authentication flow
- **Session Verification** - Real-time session validation
- **Password Security** - Secure password storage and verification
- **Multi-Device Sessions** - Support for multiple active sessions
- **User Profile Management** - Full CRUD operations for user data

### Frontend (Next.js)
- **App Router** - Modern Next.js 15 App Router architecture
- **Server Actions** - Server-side form handling and actions
- **Middleware** - Route protection and authentication middleware
- **TypeScript** - Full TypeScript support for type safety
- **Tailwind CSS** - Modern utility-first CSS framework
- **Server Components** - Optimized server-side rendering

### Backend (Node.js API)
- **RESTful API** - Clean REST API design
- **Microservice Architecture** - Standalone authentication service
- **PostgreSQL Database** - Robust relational database with ACID compliance
- **Database Migrations** - Version-controlled schema management
- **API Documentation** - Comprehensive JSDoc documentation
- **Docker Support** - Full containerization with Docker Compose

## Architecture

This project follows a microservice architecture pattern with clear separation of concerns:

- **Frontend Service** (Next.js) - User interface and client-side logic
- **API Service** (Node.js) - Authentication and user management microservice
- **Database Service** (PostgreSQL) - Data persistence and session storage
- **Container Orchestration** (Docker Compose) - Service coordination and deployment

## Project Structure

```
nextjs-auth-example/
├── .gitmodules              # Git submodule configuration
├── README.md               # This file
├── docker-compose.yml      # Docker orchestration for all services
├── ENV_VARIABLES.md        # Environment variables documentation
├── REQUIREMENTS.md         # Technical requirements and acceptance criteria
├── test-login.sh          # Authentication testing script
├── api/                    # Node.js Authentication API (git submodule)
│   ├── src/               # API source code
│   │   ├── app.js         # Main Express application
│   │   ├── utils.js       # Password hashing and encryption utilities
│   │   ├── middleware/    # Authentication middleware
│   │   ├── models/        # User and Session models
│   │   ├── routes/        # API routes (auth, users)
│   │   └── db/           # Database migrations and seeds
│   ├── docker-compose.yml # API's own docker-compose (not used in this setup)
│   ├── Dockerfile         # API container definition
│   └── package.json       # API dependencies
└── frontend/              # Next.js Frontend Application
    ├── src/              # Frontend source code
    │   ├── app/          # Next.js App Router
    │   │   ├── (auth)/   # Authentication pages (login, signup)
    │   │   ├── (routes)/ # Protected routes
    │   │   ├── dashboard/ # Dashboard pages
    │   │   ├── actions/  # Server Actions
    │   │   ├── api/      # API routes
    │   │   └── lib/      # Utility functions and session management
    │   ├── components/   # React components
    │   └── middleware.ts # Route protection middleware
    ├── public/           # Static assets
    ├── Dockerfile        # Frontend container definition (development)
    └── package.json      # Frontend dependencies
```

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Git** with submodule support
- **Node.js** (optional, for local development)

## Quick Start

### Agentic Start

Recommended model: `Claude Sonnet 4`

> Follow the Quick Start guide to get the application running with Docker. Be sure to set up the environment variables as described in `ENV_VARIABLES.md`.

1. **Clone the repository with submodules**:
   ```bash
   git clone --recursive <repository-url>
   cd nextjs-auth-example
   ```

   If you already cloned without submodules:
   ```bash
   git submodule update --init --recursive
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Wait for services to be ready** (about 30-60 seconds for first startup):
   ```bash
   # Check service status
   docker-compose ps

   # Watch logs
   docker-compose logs -f
   ```

4. **Access the applications**:
   - **Frontend**: http://localhost:3000 (Next.js authentication UI)
   - **API**: http://localhost:8000 (Authentication API endpoints)
   - **Database**: localhost:5432 (PostgreSQL with user and session data)

5. **Test the authentication flow**:
   ```bash
   # Run the authentication test script
   ./test-login.sh

   # Or test manually:
   # 1. Visit http://localhost:3000
   # 2. Click "Sign Up" to create a new account
   # 3. Login with your credentials
   # 4. Access the protected dashboard
   ```

## Authentication Flow

### User Registration
1. User visits `/signup` page
2. Fills out registration form (first name, last name, email, password)
3. Frontend sends request to API `/users` endpoint
4. API validates input and hashes password
5. User record created in PostgreSQL database
6. User redirected to login page

### User Login
1. User visits `/login` page
2. Enters email and password
3. Frontend sends request to API `/user-auth` endpoint
4. API verifies credentials against database
5. API creates encrypted session and JWT token
6. Session stored in database with expiration
7. Encrypted session set as HTTP-only cookie
8. User redirected to dashboard

### Session Verification
1. User accesses protected route
2. Next.js middleware checks for session cookie
3. Frontend calls API `/user-auth/verify-session` endpoint
4. API decrypts session and validates against database
5. If valid, user data returned; if invalid, user redirected to login
6. Session automatically renewed on activity

### User Logout
1. User clicks logout button
2. Frontend calls API `/user-auth/logout` endpoint
3. API invalidates session in database
4. Session cookie cleared from browser
5. User redirected to login page

## Services Overview

### Database Service (PostgreSQL)
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Database**: nodeapi
- **Schema**: Users table with authentication fields, Sessions table for session management
- **Features**:
  - User data storage with hashed passwords
  - Session persistence with automatic cleanup
  - Database migrations and seeding
  - Health checks and automatic restart

### API Service (Node.js Authentication Microservice)
- **Built from**: `./api/Dockerfile`
- **Port**: 8000
- **Environment**: Development mode with hot reload
- **Features**:
  - RESTful authentication endpoints
  - Session-based authentication with encryption
  - JWT token generation and verification
  - API key authentication middleware
  - Password hashing with salt
  - CORS configuration for frontend integration
  - Comprehensive error handling and logging

### Frontend Service (Next.js)
- **Built from**: `./frontend/Dockerfile`
- **Port**: 3000
- **Environment**: Development mode with hot reload
- **Features**:
  - Modern Next.js 15 App Router architecture
  - Server-side rendering with Server Components
  - Authentication pages (login, signup)
  - Protected routes with middleware
  - Server Actions for form handling
  - TypeScript support
  - Tailwind CSS for styling
  - Session management with HTTP-only cookies

## Development Workflow

### Starting Development

```bash
# Start all services in detached mode
docker-compose up -d

# Or start with logs visible
docker-compose up

# Start specific services
docker-compose up -d db api    # Database and API only
docker-compose up -d frontend  # Frontend only
```

### Viewing Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f db
```

### Development Commands

```bash
# Check service status
docker-compose ps

# Restart a service
docker-compose restart frontend

# Rebuild a service
docker-compose build frontend
docker-compose up -d frontend

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

### Authentication Testing

```bash
# Test complete authentication flow
./test-login.sh

# Or test individual endpoints:

# 1. Create a new user
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-12345-change-in-production" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'

# 2. Login user
curl -X POST http://localhost:8000/user-auth \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-12345-change-in-production" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'

# 3. Verify session (use session from login response)
curl -X POST http://localhost:8000/user-auth/verify-session \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-12345-change-in-production" \
  -d '{
    "session": "encrypted-session-data"
  }'

# 4. Logout user
curl -X POST http://localhost:8000/user-auth/logout \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-12345-change-in-production" \
  -d '{
    "session": "encrypted-session-data"
  }'
```

### Database Operations

```bash
# Run database migrations
docker-compose exec api npm run migrate

# Seed the database with sample data
docker-compose exec api npm run seed

# Reset database (migrate + seed)
docker-compose exec api npm run db:reset

# Access PostgreSQL directly
docker-compose exec db psql -U postgres -d nodeapi

# Check database tables
docker-compose exec db psql -U postgres -d nodeapi -c "\dt"

# View users table
docker-compose exec db psql -U postgres -d nodeapi -c "SELECT id, email, first_name, last_name, created_at FROM users;"

# View active sessions
docker-compose exec db psql -U postgres -d nodeapi -c "SELECT id, user_id, expires_at, created_at FROM sessions WHERE expires_at > NOW();"
```

### Code Changes and Hot Reload

- **Frontend**: Changes to files in `./frontend/src/` will trigger hot reload
- **API**: Changes to files in `./api/src/` will trigger nodemon restart
- **Database**: Schema changes require running migrations

## Environment Variables

The application uses environment variables for configuration. See `ENV_VARIABLES.md` for complete documentation.

### Core Configuration
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

# Authentication Configuration
API_KEY=dev-api-key-12345-change-in-production
JWT_SECRET=your-jwt-secret-key-change-in-production
SESSION_SECRET=your-session-secret-key-change-in-production

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
API_URL=http://api:8000
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Security Configuration

For production deployment, ensure you:
1. Change all default passwords and secrets
2. Use strong, randomly generated API keys and secrets
3. Configure proper CORS origins
4. Enable HTTPS
5. Use environment-specific database credentials

## System Features

### Authentication System
- **Secure Password Storage** - Passwords hashed with salt using Node.js crypto
- **Session Management** - Database-backed sessions with automatic expiration
- **JWT Token Support** - Stateless authentication for API clients
- **Session Encryption** - Client-side session data encrypted for security
- **Multi-Device Support** - Users can have multiple active sessions
- **Automatic Cleanup** - Expired sessions automatically removed from database

### Security Features
- **API Key Authentication** - All API endpoints protected with API keys
- **CSRF Protection** - Cross-site request forgery protection
- **HTTP-Only Cookies** - Session cookies inaccessible to JavaScript
- **Secure Headers** - Security headers configured for production
- **Input Validation** - Comprehensive input validation and sanitization
- **Rate Limiting** - Protection against brute force attacks

### Frontend Features
- **Modern UI** - Clean, responsive design with Tailwind CSS
- **TypeScript** - Full type safety throughout the application
- **Server Components** - Optimized server-side rendering
- **Route Protection** - Middleware-based route protection
- **Form Handling** - Server Actions for secure form processing
- **Error Handling** - Comprehensive error handling with user feedback

### API Features
- **RESTful Design** - Clean, intuitive API endpoints
- **Microservice Architecture** - Standalone authentication service
- **Database Migrations** - Version-controlled database schema
- **Comprehensive Logging** - Detailed logging for debugging and monitoring
- **Health Checks** - Service health monitoring endpoints
- **API Documentation** - Auto-generated JSDoc documentation

### Development Features
- **Hot Reload** - Automatic reload on code changes
- **Docker Support** - Full containerization for consistent development
- **Database Seeding** - Sample data for development and testing
- **Environment Configuration** - Flexible environment variable setup
- **Git Submodules** - Modular architecture with git submodules

## Troubleshooting

### Common Issues

1. **Authentication failures**:
   ```bash
   # Check API key configuration
   docker-compose exec api printenv | grep API_KEY

   # Verify JWT and session secrets
   docker-compose exec api printenv | grep -E "(JWT_SECRET|SESSION_SECRET)"

   # Check database connectivity
   docker-compose exec api npm run migrate
   ```

2. **Session not persisting**:
   ```bash
   # Check session table in database
   docker-compose exec db psql -U postgres -d nodeapi -c "SELECT * FROM sessions;"

   # Check cookie settings in browser developer tools
   # Verify CORS configuration
   docker-compose exec api printenv | grep ALLOWED_ORIGINS
   ```

3. **Frontend not connecting to API**:
   ```bash
   # Check API URL configuration
   docker-compose exec frontend printenv | grep API_URL

   # Verify API service is running
   curl -H "X-API-Key: dev-api-key-12345-change-in-production" http://localhost:8000/health
   ```

4. **Database connection errors**:
   ```bash
   # Check if database is healthy
   docker-compose exec db pg_isready -U postgres

   # View database logs
   docker-compose logs db

   # Restart database service
   docker-compose restart db
   ```

5. **Port conflicts**:
   ```bash
   # Check if ports are in use
   lsof -i :3000  # Frontend
   lsof -i :8000  # API
   lsof -i :5432  # Database

   # Stop conflicting services or change ports in docker-compose.yml
   ```

6. **Frontend build errors**:
   ```bash
   # Clear Next.js cache
   docker-compose exec frontend rm -rf .next

   # Rebuild frontend
   docker-compose build frontend --no-cache
   ```

7. **API startup issues**:
   ```bash
   # Check API logs
   docker-compose logs api

   # Restart API service
   docker-compose restart api
   ```

8. **Submodule issues**:
   ```bash
   # Update submodules
   git submodule update --remote

   # Reset submodules
   git submodule foreach --recursive git reset --hard
   ```

### Debug Commands

```bash
# Access container shell
docker-compose exec api sh
docker-compose exec frontend sh
docker-compose exec db sh

# Check container resources
docker-compose top

# View detailed container info
docker-compose ps --services
docker inspect <container_name>

# Check Docker networks
docker network ls
docker network inspect nextjs-auth-example_default
```

### Performance Tips

1. **Use .dockerignore**: Exclude unnecessary files from build context
2. **Volume mounting**: Development files are mounted for hot reload
3. **Health checks**: Database waits for PostgreSQL to be ready
4. **Dependency caching**: Node modules are cached in separate volumes

## Production Deployment

### Environment Setup

1. **Create production environment file**:
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Set secure secrets**:
   ```bash
   # Generate secure API key (32+ characters)
   API_KEY=$(openssl rand -base64 32)

   # Generate secure JWT secret (64+ characters)
   JWT_SECRET=$(openssl rand -base64 64)

   # Generate secure session secret (64+ characters)
   SESSION_SECRET=$(openssl rand -base64 64)
   ```

3. **Configure database**:
   ```bash
   # Use production database credentials
   DB_HOST=your-production-db-host
   DB_NAME=your-production-db-name
   DB_USER=your-production-db-user
   DB_PASSWORD=your-secure-db-password
   DB_SSL=true
   ```

4. **Set CORS origins**:
   ```bash
   ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   ```

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Run health checks
curl https://yourdomain.com/health
```

### Database Migration in Production

```bash
# Run migrations on production database
docker-compose -f docker-compose.prod.yml exec api npm run migrate

# Do NOT run seeds in production
# Seeds are for development data only
```

### Security Checklist

- [ ] Change all default passwords and secrets
- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Enable database SSL connections
- [ ] Set up proper firewall rules
- [ ] Use strong, randomly generated secrets
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates

### Monitoring

```bash
# Health check endpoint
curl https://yourdomain.com/api/health

# Monitor application logs
docker-compose -f docker-compose.prod.yml logs -f

# Monitor database
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -d nodeapi -c "SELECT COUNT(*) FROM sessions WHERE expires_at > NOW();"
```

## Development Setup (Alternative)

If you prefer to run services locally instead of Docker:

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Local Development

1. **Start PostgreSQL** (locally or via Docker):
   ```bash
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine
   ```

2. **Setup API**:
   ```bash
   cd api
   npm install
   cp .env.example .env  # Configure database connection
   npm run migrate
   npm run seed
   npm run serve
   ```

3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local  # Configure API connection
   npm run dev
   ```

## Testing

### Automated Testing

```bash
# Run authentication flow test
./test-login.sh

# Test API endpoints
npm test  # If tests are available

# Load testing
# Use tools like Apache Bench or Artillery for load testing
```

### Manual Testing

1. **User Registration Flow**:
   - Navigate to http://localhost:3000/signup
   - Fill out the registration form
   - Verify email validation
   - Check user created in database

2. **Authentication Flow**:
   - Navigate to http://localhost:3000/login
   - Login with valid credentials
   - Verify redirect to dashboard
   - Check session created in database

3. **Session Management**:
   - Access protected routes
   - Verify session validation
   - Test session expiration
   - Test logout functionality

4. **API Testing**:
   - Use Postman or curl to test API endpoints
   - Verify authentication required
   - Test error responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the authentication flow
5. Update documentation if needed
6. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use proper error handling
- Add JSDoc comments for API endpoints
- Test authentication flows thoroughly
- Update environment variable documentation
- Follow security best practices

## Additional Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [JWT.io](https://jwt.io/) - JWT token debugger
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the technical requirements in `REQUIREMENTS.md`
- Check environment variable documentation in `ENV_VARIABLES.md`
- Open an issue on the project repository
