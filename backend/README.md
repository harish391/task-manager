# Backend Configuration

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRY=7d
NODE_ENV=development
PYTHON_SERVICE_URL=http://localhost:8000
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with configuration above

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Run tests:
   ```bash
   npm test
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Authentication (to be implemented)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks (to be implemented)
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
