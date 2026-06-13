# Task Manager Application - Development Guide

## Project Overview
Full-stack task management application with Node.js backend, React frontend, and Python service.

## Technology Stack
- Frontend: React 18 + TypeScript + Material-UI
- Backend: Express.js + MongoDB + JWT Auth
- Python: Task processing and analytics
- Database: MongoDB

## Development Workflow

### Getting Started
1. Install dependencies in backend, frontend, and python-service
2. Set up environment variables (.env files)
3. Configure MongoDB connection
4. Run development servers

### Running the Application
- Development: `npm run dev` (runs both backend and frontend)
- Backend only: `npm run dev:backend`
- Frontend only: `npm run dev:frontend`

### Folder Structure
- `backend/`: Express server, routes, controllers, models
- `frontend/`: React components, pages, services
- `python-service/`: Task processor, utilities
- `.github/`: Configuration files

## Key Features to Implement
1. User authentication (JWT)
2. Task CRUD operations
3. Task status tracking
4. User dashboard
5. Responsive UI
6. API security
