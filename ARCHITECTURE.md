# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│                    (React Frontend - Port 3000)                  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP/HTTPS
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              API Gateway / Express Server (Port 5000)            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Routes                                                   │   │
│  │  ├── /api/auth (Authentication)                         │   │
│  │  │   ├── POST /register                                 │   │
│  │  │   ├── POST /login                                    │   │
│  │  │   └── GET /me (Protected)                            │   │
│  │  │                                                       │   │
│  │  └── /api/tasks (Task Management) - Protected           │   │
│  │      ├── GET / (All tasks)                              │   │
│  │      ├── POST / (Create)                                │   │
│  │      ├── GET /:id (Read)                                │   │
│  │      ├── PUT /:id (Update)                              │   │
│  │      └── DELETE /:id (Delete)                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Middleware                                              │   │
│  │  ├── CORS                                               │   │
│  │  ├── Body Parser                                        │   │
│  │  └── Authentication (JWT)                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────┬────────────────────────────────────────────────────────┘
        │
        ├─────────────────────────────────────────┬─────────────────┐
        │                                         │                 │
        ▼                                         ▼                 ▼
   MongoDB                            Python Service          External APIs
   (Port 27017)                      (Port 8000)
   - Users Collection                - /health
   - Tasks Collection                - /analytics/tasks
   - Authentication                  - /process/task

```

## Technology Stack

### Frontend

- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Material-UI (MUI)**: Pre-built component library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API calls
- **Context API**: State management

### Backend

- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT (jsonwebtoken)**: Authentication token
- **bcryptjs**: Password hashing
- **TypeScript**: Type-safe backend code
- **CORS**: Cross-Origin Resource Sharing

### Python Service

- **Flask**: Lightweight web framework
- **Flask-CORS**: CORS support
- **Requests**: HTTP library for backend integration
- **Gunicorn**: WSGI server for production

### DevOps

- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nodemon/ts-node-dev**: Development auto-reload

## Data Models

### User Model

```typescript
{
  _id: ObjectId,
  email: string (unique, lowercase),
  password: string (hashed with bcrypt),
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```typescript
{
  _id: ObjectId,
  title: string (required),
  description: string,
  status: "todo" | "in-progress" | "completed",
  priority: "low" | "medium" | "high",
  userId: ObjectId (references User),
  dueDate?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Flow

### Authentication Flow

```
1. User enters email/password
   ↓
2. Frontend sends POST /api/auth/register or /api/auth/login
   ↓
3. Backend validates credentials
4. Backend generates JWT token
5. Backend returns token to frontend
   ↓
6. Frontend stores token in localStorage
7. Frontend includes token in Authorization header for subsequent requests
```

### Task Management Flow

```
1. User creates/updates task
   ↓
2. Frontend sends request with JWT token
   ↓
3. Backend middleware verifies JWT token
4. Backend validates user ownership of task
5. Backend performs CRUD operation
6. Backend returns updated task
   ↓
7. Frontend updates UI
```

### Python Service Integration

```
1. Frontend/Backend can call Python service for analytics
   ↓
2. Python service can fetch data from Backend
   ↓
3. Python service processes data (calculations, summaries)
   ↓
4. Returns processed data back to requester
```

## Security Measures

### Authentication

- ✅ JWT tokens with expiration
- ✅ Secure password hashing (bcrypt)
- ✅ Protected routes with middleware
- ✅ Token stored in localStorage (frontend)

### Data Protection

- ✅ User can only access their own tasks
- ✅ Input validation on backend
- ✅ Error messages don't reveal sensitive info
- ✅ Unique email constraint

### Network Security

- ✅ CORS configured
- ✅ HTTPS ready (with proper setup)
- ✅ Environment variables for secrets

## Deployment Architecture

### Docker Compose Setup

```
docker-compose up
├── MongoDB Container
├── Backend Container
├── Frontend Container
└── Python Service Container
```

### Production Deployment

- Frontend: Static hosting (AWS S3, Netlify, Vercel)
- Backend: Container orchestration (Kubernetes, ECS)
- Database: Managed MongoDB (Atlas)
- Python Service: Serverless (AWS Lambda) or Container

## Scalability Considerations

### Current Implementation

- Single MongoDB instance
- Single backend instance
- Single Python service

### Future Improvements

- Database replication
- Load balancing with nginx/HAProxy
- Caching layer (Redis)
- Message queue (RabbitMQ, Bull)
- Microservices architecture
- CDN for frontend assets

## Performance Optimization

### Frontend

- Code splitting with React.lazy()
- Lazy loading of components
- Image optimization
- Production build with minification

### Backend

- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching strategies
- Connection pooling

### Python Service

- Result caching
- Async processing with Celery
- Rate limiting

## Monitoring & Logging

### Recommended Tools

- **Logging**: Winston (Node.js), Python logging
- **Monitoring**: New Relic, Datadog
- **Error Tracking**: Sentry
- **Performance**: APM tools
- **Databases**: MongoDB Atlas monitoring

## Disaster Recovery

### Backup Strategy

- Daily MongoDB backups
- Version control for code
- Environment variable backup (secured)

### Recovery Plan

- Database restore procedures
- Rollback strategies for deployments
- Health checks and monitoring alerts
