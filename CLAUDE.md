# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack Todo Management Application with Node.js/Express backend and React frontend. Uses a monorepo structure with in-memory storage (arrays) instead of a persistent database.

## Common Commands

### Initial Setup
```bash
npm install                    # Install root dependencies (concurrently)
npm run install-all           # Install both server and client dependencies
```

### Development
```bash
npm run dev                   # Run both server and client concurrently (recommended)
npm run server-dev            # Run backend only with nodemon auto-reload
npm run client                # Run frontend only
```

### Production
```bash
npm start                     # Run both server and client in production mode
npm run server                # Run backend only (no auto-reload)
```

### Server-specific (from server/ directory)
```bash
npm start                     # Start server with node
npm run dev                   # Start server with nodemon (auto-reload)
```

### Client-specific (from client/ directory)
```bash
npm start                     # Start React dev server
npm run build                 # Build production bundle
npm test                      # Run tests (if any)
```

## Architecture

### Backend (server/)

**In-Memory Database** ([server/utils/database.js](server/utils/database.js)):
- Uses plain arrays for storage: `database.users[]` and `database.todos[]`
- Uses Set for token invalidation: `database.invalidatedTokens`
- Three helper modules: `userDB`, `todoDB`, `tokenDB`
- **IMPORTANT**: All data is lost on server restart

**Models** (server/models/):
- User model: Class with methods for password hashing and profile updates
- Todo model: Class with update method and timestamps
- Both use uuid for ID generation

**Authentication** ([server/middleware/auth.js](server/middleware/auth.js)):
- JWT-based authentication with Bearer tokens
- Middleware checks token validity and invalidation status
- Token expiration: 24 hours
- Logout invalidates tokens by adding them to `database.invalidatedTokens`

**API Routes** (server/routes/):
- `/api/auth/*` - Registration, login, logout
- `/api/todos/*` - CRUD operations with filtering (status, priority)
- `/api/users/profile` - User profile management
- All todo and user routes require authentication

**Server Configuration** ([server/server.js](server/server.js)):
- Default port: 3000 (configurable via PORT env var)
- CORS enabled for all origins
- Request logging middleware included

### Frontend (client/)

**API Service** ([client/src/services/api.js](client/src/services/api.js)):
- Centralized Axios instance with interceptors
- Automatically adds `Authorization: Bearer <token>` header from localStorage
- Auto-redirects to login on 401 responses
- Uses proxy configuration to avoid CORS (proxies to `http://localhost:3000`)

**Authentication Context** ([client/src/context/AuthContext.js](client/src/context/AuthContext.js)):
- Global authentication state management
- Stores user data and token in localStorage
- Provides login/logout/register functions to all components

**Routing** ([client/src/App.js](client/src/App.js)):
- Uses React Router v6
- PrivateRoute component protects authenticated routes
- Main routes: `/login`, `/register`, `/dashboard`, `/profile`

**Components**:
- Pages: Login, Register, Dashboard, Profile
- Components: TodoItem, TodoForm, Navbar, PrivateRoute
- Bootstrap 5 for styling

### Key Data Flow

1. **Authentication**: User logs in → JWT token stored in localStorage → Token sent with every API request via Axios interceptor
2. **Todo Operations**: Dashboard fetches todos → Displays in TodoItem components → CRUD operations via TodoForm → Updates reflected in Dashboard
3. **Token Invalidation**: Logout → Token added to server's `invalidatedTokens` Set → Subsequent requests with that token are rejected

## Important Notes

- **Data Persistence**: All data is stored in memory. Server restart clears all users and todos.
- **Environment Variables**: JWT_SECRET defaults to a development key if not set
- **Port Configuration**: Backend runs on 3000, frontend on 3001 (React default)
- **API Proxying**: Client package.json has `"proxy": "http://localhost:3000"` to handle API requests
- **Variable Naming**: All variables use camelCase convention
- **Code Comments**: All files include detailed comments explaining functionality

## OpenAPI Specification

The API follows the OpenAPI specification defined in [openapi.yaml](openapi.yaml). Reference this file for complete API endpoint documentation, request/response schemas, and validation rules.
