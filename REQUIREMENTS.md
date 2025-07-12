# Acceptance Criteria for Session Management, User Entitlements, and Analytics Reporting

## Feature: Session Management, User Entitlements, and Analytics Reporting
### Description
Implement a secure session management system, user entitlements, and analytics reporting for user actions using Next.js with App Router, PostgreSQL, Server-Side Rendering (SSR) components, and Docker.

### Acceptance Criteria

#### 1. User Login (Session Management)
- **Given** a user with valid credentials (email, password),
- **When** they submit the login form via an SSR component,
- **Then** the system:
  - Verifies credentials against the PostgreSQL `users` table (bcrypt-hashed passwords).
  - Creates a JWT stored in an HTTP-only, secure cookie.
  - Stores session details (session_id, user_id, created_at, expires_at) in the PostgreSQL `sessions` table.
  - Redirects to the protected `/dashboard` route (SSR-rendered).
- **And** returns a 401 error for invalid credentials.

#### 2. Session Tracking
- **Given** an authenticated user,
- **When** accessing protected routes (e.g., `/dashboard`),
- **Then** the system:
  - Validates JWT via Next.js middleware.
  - Checks session validity in PostgreSQL `sessions` table.
  - Renders protected SSR components if valid.
- **And** redirects to login with an expired session message if invalid.

#### 3. Session State Maintenance
- **Given** an active session,
- **When** navigating the app,
- **Then** the system:
  - Persists user state (user_id, role) in JWT payload.
  - Refreshes JWT before expiration (30-minute sliding window) via API route.
  - Updates `last_active` in `sessions` table.
  - Re-issues JWT in HTTP-only cookie.

#### 4. User Logout
- **Given** an authenticated user,
- **When** clicking logout,
- **Then** the system:
  - Deletes session from `sessions` table.
  - Clears JWT cookie.
  - Redirects to login page (SSR-rendered).
- **And** blocks protected route access until new login.

#### 5. Secure Session Lifecycle
- **Given** session operations,
- **When** processing login, validation, or logout,
- **Then** the system:
  - Uses HTTPS (enforced in Docker).
  - Sets JWT cookies with HTTP-only, Secure, SameSite=Strict.
  - Enforces 30-minute session expiration with cleanup in `sessions` table.
  - Protects against CSRF with tokens in SSR forms.
  - Logs session events (login, logout) in `session_logs` table.

#### 6. User Entitlements
- **Given** an authenticated user,
- **When** accessing features/routes,
- **Then** the system:
  - Retrieves user role and permissions from `users` table.
  - Restricts access to SSR components based on entitlements (e.g., admin vs. user).
  - Displays role-specific content in SSR-rendered pages.
- **And** returns 403 error for unauthorized access.

#### 7. Analytics Reporting for User Actions
- **Given** user interactions,
- **When** actions occur (e.g., login, logout, page views, feature usage),
- **Then** the system:
  - Logs actions in PostgreSQL `user_actions` table (action_id, user_id, action_type, timestamp, metadata).
  - Provides an SSR-rendered `/analytics` route (admin-only) displaying aggregated action data (e.g., login frequency, feature usage).
  - Ensures analytics queries are optimized with indexes on `user_actions` (user_id, action_type).

#### 8. Database Integration
- **Given** session, entitlement, and analytics operations,
- **When** interacting with the database,
- **Then** the system:
  - Uses PostgreSQL tables:
    - `users` (id, email, hashed_password, role, permissions).
    - `sessions` (session_id, user_id, jwt_token, created_at, last_active, expires_at).
    - `session_logs` (log_id, session_id, user_id, event_type, timestamp).
    - `user_actions` (action_id, user_id, action_type, timestamp, metadata).
  - Connects via connection pool (e.g., Prisma) in Next.js API routes.
  - Uses parameterized queries to prevent SQL injection.

#### 9. SSR Components
- **Given** protected routes and analytics pages,
- **When** accessed,
- **Then** the system:
  - Renders login, dashboard, and analytics pages server-side using Next.js App Router.
  - Fetches user data, entitlements, and analytics from PostgreSQL during SSR.
  - Hydrates client-side for interactive elements (e.g., logout button, analytics filters).
- **And** ensures SSR components respect entitlements (e.g., admin-only analytics).

#### 10. Docker Deployment
- **Given** the application,
- **When** deployed,
- **Then** the system:
  - Uses a `Dockerfile` for Next.js with production settings.
  - Configures `docker-compose.yml` for:
    - Next.js container (port 3000).
    - PostgreSQL container (port 5432, persistent volume).
    - Environment variables (JWT secret, DB URL).
  - Ensures secure DB connection and HTTPS in production.
  - Supports scaling and restart policies.

#### 11. Error Handling
- **Given** operation failures,
- **When** errors occur (e.g., invalid JWT, DB failure),
- **Then** the system:
  - Returns 401 (unauthorized) or 500 (server error) with user-friendly messages.
  - Logs errors in `session_logs` or `user_actions` tables.
  - Avoids exposing sensitive details in SSR responses.

#### 12. Performance
- **Given** session, entitlement, and analytics operations,
- **When** under load,
- **Then** the system:
  - Responds within 200ms (excluding network latency).
  - Handles 100 concurrent users without degradation.
  - Uses indexes on `users` (email), `sessions` (user_id, expires_at), and `user_actions` (user_id, timestamp).

#### 13. Testing and Validation
- **Given** the system,
- **When** deployed in Docker,
- **Then** the system:
  - Passes unit tests for session, entitlement, and analytics logic (Jest).
  - Passes integration tests for SSR, API routes, and PostgreSQL.
  - Passes security tests for XSS, CSRF, and SQL injection (OWASP ZAP).
  - Functions correctly with `docker-compose up`.

### Notes
- Store sensitive data (JWT secret, DB credentials) in environment variables.
- Follow OWASP best practices for security.
- Use Next.js App Router for routing/middleware.
- Initialize PostgreSQL schema with migrations (e.g., Prisma).