# Next.js Auth Example

This project consists of a Next.js frontend and a Node.js API backend, both containerized with Docker. The API is included as a git submodule and runs alongside a PostgreSQL database.

## Project Structure

```
nextjs-auth-example/
├── .gitmodules              # Git submodule configuration
├── README.md               # This file
├── docker-compose.yml      # Docker orchestration for all services
├── api/                    # Node.js API (git submodule)
│   ├── src/               # API source code
│   ├── docker-compose.yml # API's own docker-compose (not used in this setup)
│   ├── Dockerfile         # API container definition
│   └── package.json       # API dependencies
└── frontend/              # Next.js frontend application
    ├── src/              # Frontend source code
    ├── public/           # Static assets
    ├── Dockerfile        # Frontend container definition (development)
    └── package.json      # Frontend dependencies
```

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Git** with submodule support
- **Node.js** (optional, for local development)

## Quick Start

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
   - **Frontend**: http://localhost:3000
   - **API**: http://localhost:8000
   - **Database**: localhost:5432

## Services Overview

### Database (PostgreSQL)
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Database**: nodeapi
- **User**: postgres
- **Password**: password
- **Volume**: Persistent data storage

### API Service (Node.js)
- **Built from**: `./api/Dockerfile`
- **Port**: 8000
- **Environment**: Development mode
- **Features**:
  - Hot reload with volume mounting
  - Database connection with health checks
  - Automatic restart on failure

### Frontend Service (Next.js)
- **Built from**: `./frontend/Dockerfile`
- **Port**: 3000
- **Environment**: Development mode
- **Features**:
  - Hot reload with `npm run dev`
  - TypeScript support
  - Tailwind CSS configured

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
```

### Code Changes and Hot Reload

- **Frontend**: Changes to files in `./frontend/src/` will trigger hot reload
- **API**: Changes to files in `./api/src/` will trigger nodemon restart
- **Database**: Schema changes require running migrations

## Environment Variables

### Database Configuration
- `POSTGRES_DB=nodeapi`
- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=password`

### API Configuration
- `NODE_ENV=development`
- `PORT=8000`
- `DB_HOST=db` (Docker service name)
- `DB_PORT=5432`
- `DB_NAME=nodeapi`
- `DB_USER=postgres`
- `DB_PASSWORD=password`

### Frontend Configuration
- `NODE_ENV=development`
- `NEXT_PUBLIC_API_URL=http://localhost:8000`

## Project Features

### Frontend (Next.js)
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Development**: Hot reload enabled
- **Build**: Optimized for development

### API (Node.js)
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js
- **Development**: Nodemon for auto-restart
- **Environment**: ES modules support

### Database
- **Type**: PostgreSQL 15
- **Persistence**: Docker volume for data
- **Health Checks**: Automatic readiness verification

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check if ports are in use
   lsof -i :3000  # Frontend
   lsof -i :8000  # API
   lsof -i :5432  # Database

   # Stop conflicting services or change ports in docker-compose.yml
   ```

2. **Database connection errors**:
   ```bash
   # Check if database is healthy
   docker-compose exec db pg_isready -U postgres

   # View database logs
   docker-compose logs db

   # Restart database service
   docker-compose restart db
   ```

3. **Frontend build errors**:
   ```bash
   # Clear Next.js cache
   docker-compose exec frontend rm -rf .next

   # Rebuild frontend
   docker-compose build frontend --no-cache
   ```

4. **API startup issues**:
   ```bash
   # Check API logs
   docker-compose logs api

   # Restart API service
   docker-compose restart api
   ```

5. **Submodule issues**:
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
   npm run dev
   ```

## Contributing

1. Make sure Docker services are running
2. Make changes to code (hot reload will apply)
3. Run tests if available
4. Commit changes to appropriate repository (main repo or submodule)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
