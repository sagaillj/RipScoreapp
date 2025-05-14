# Architecture Documentation

## Overview

RipScore.app is a professional diving scoring platform built with a modern full-stack architecture. It provides features for meet management, real-time judging, and athlete dashboards for diving competitions. The application uses a client-server architecture with a React frontend and Express backend, with PostgreSQL for data persistence via Drizzle ORM.

## System Architecture

### High-Level Architecture

The application follows a standard web application architecture with clear separation between:

1. **Client**: A React single-page application (SPA) with TypeScript for type safety
2. **Server**: An Express.js server providing API endpoints and serving the static client files
3. **Database**: PostgreSQL database accessed via Drizzle ORM
4. **Shared**: Common code (schemas, types) shared between client and server

### Technology Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui components, React Query, Wouter for routing
- **Backend**: Express.js on Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Language**: TypeScript throughout the entire application
- **Build Tools**: Vite for frontend, esbuild for backend

## Key Components

### Frontend

The frontend is organized as a React SPA with the following structure:

1. **Pages**: Component-based pages matching the routes in the application
   - Home, About, Pricing, Live, Judge, Login, Contact pages
   - Judge-specific pages (like `/judge/:meetId`)

2. **Components**: 
   - `ui/`: Reusable UI components based on shadcn/ui
   - Layout components (PageWrapper)
   - Feature-specific components (organized by feature)

3. **State Management**:
   - React Query for server state
   - Custom hooks for client state (e.g., `useTheme`, `useToast`)

4. **Styling**:
   - Tailwind CSS with custom theme variables
   - CSS variables for theming (dark/light mode support)

### Backend

The backend is built with Express.js and provides:

1. **API Routes**: Defined in `server/routes.ts`
   - RESTful endpoints prefixed with `/api`
   - Authentication endpoints

2. **Database Access**: 
   - `server/storage.ts` implements the storage interface
   - Default implementation is a memory-based storage for development
   - Production uses Drizzle ORM with PostgreSQL

3. **Server Configuration**:
   - Development server with hot module replacement via Vite
   - Production server with static file serving

### Database

The application uses PostgreSQL with Drizzle ORM:

1. **Schema**: Defined in `shared/schema.ts`
   - Current entities: Users
   - Schema includes validation with Zod

2. **Migration**: Managed via Drizzle Kit
   - Commands for pushing schema changes to the database

## Data Flow

### Authentication Flow

1. User submits login credentials via the login form
2. Server authenticates credentials against the database
3. Server issues a session (likely cookie-based, though not fully implemented in the codebase yet)
4. Authenticated requests include session information for authorization

### Judging Flow

1. Judges scan QR code or login to access judging interface
2. Judges submit scores through the interface
3. Scores are sent to the server via API
4. Server stores scores and updates leaderboards
5. Live results page displays updated scores in real-time

## External Dependencies

### Frontend Dependencies

- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: Wouter (lightweight alternative to React Router)
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with class-variance-authority

### Backend Dependencies

- **Database**: Drizzle ORM with PostgreSQL 
- **ORM Extensions**: drizzle-zod for schema validation
- **Session Management**: connect-pg-simple (configured but not fully implemented)
- **Serverless**: @neondatabase/serverless for PostgreSQL connection

## Deployment Strategy

The application is configured to deploy on Replit with the following strategy:

1. **Development**: 
   - Uses Vite dev server with HMR
   - In-memory database for quick prototyping

2. **Production Build**:
   - Frontend: Vite builds static files to `dist/public`
   - Backend: esbuild bundles server code to `dist/index.js`
   - Combined assets served from Express

3. **Database**:
   - Environment variable `DATABASE_URL` for PostgreSQL connection
   - Likely using Neon Database (based on dependency)

4. **Scaling**:
   - Configured for Replit's autoscaling deployment
   - Port configuration for external access

## Future Considerations

1. **Real-time Updates**: The application could benefit from WebSocket implementation for real-time score updates.

2. **Authentication System**: The current authentication system is basic and could be enhanced with:
   - JWT or session-based auth
   - Role-based access control (admin, judge, athlete)
   - OAuth integration for social logins

3. **Database Scaling**: As the application grows, consider:
   - More complex schema with relations between competitions, judges, athletes
   - Caching layer for frequently accessed data
   - Read replicas for high-traffic scenarios