# Task Manager Application

A full-stack task management system built with Node.js, React, and Python.

## 🏗️ Architecture

- **Frontend**: React 18 with TypeScript and Material-UI
- **Backend**: Express.js with JWT authentication
- **Database**: MongoDB
- **Python Service**: Task processing and analytics service

## 📁 Project Structure

```
task-manager/
├── backend/                    # Express.js server
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── models/             # Database schemas
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth and custom middleware
│   │   ├── utils/              # Helper functions
│   │   └── index.ts            # Server entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/                   # React TypeScript app
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── context/            # Context providers
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── python-service/             # Flask analytics service
│   ├── app.py
│   ├── utils.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── package.json
```

## 📋 Prerequisites

- **Node.js**: 18+ LTS
- **Python**: 3.10+
- **MongoDB**: 6.0+ (or use Docker)
- **npm** or **yarn**
- **Docker & Docker Compose** (optional, for containerized setup)

## ⚡ Quick Start

### Option 1: Local Development (Recommended for Development)

#### 1. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Install MongoDB locally or update MONGODB_URI in .env
# Then run:
npm run dev
```

Backend will run on `http://localhost:5000`

#### 2. Frontend Setup (in a new terminal)
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Run development server
npm start
```

Frontend will run on `http://localhost:3000`

#### 3. Python Service (in a new terminal)
```bash
cd python-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run service
python app.py
```

Python service will run on `http://localhost:8000`

### Option 2: Docker Compose (Recommended for Production-like Setup)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Python Service: `http://localhost:8000`
- MongoDB: `mongodb://root:password@localhost:27017`

## 🚀 Running from Root

From the project root, you can run all services:

```bash
# Install all dependencies
npm install

# Run both backend and frontend in development mode
npm run dev

# Build all services
npm run build

# Run tests
npm run test
```

## 📚 Features

✅ **User Authentication**
- Register new users
- Login with email/password
- JWT token-based authentication
- Secure password hashing with bcrypt

✅ **Task Management**
- Create, read, update, delete tasks
- Set task priority (low, medium, high)
- Track task status (todo, in-progress, completed)
- Set due dates for tasks

✅ **Dashboard**
- View all tasks
- Edit existing tasks
- Delete tasks
- Task filtering and organization
- Responsive Material-UI design

✅ **Python Service**
- Task analytics and reporting
- Task complexity calculation
- Integration with backend API

✅ **Security**
- JWT authentication
- Protected routes
- Secure API endpoints
- CORS enabled

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create new task (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

### Python Service
- `GET /health` - Health check
- `GET /analytics/tasks` - Get task analytics
- `POST /process/task` - Process task

## 📝 Environment Configuration

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRY=7d
NODE_ENV=development
PYTHON_SERVICE_URL=http://localhost:8000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Python Service (.env)
```
BACKEND_URL=http://localhost:5000
FLASK_ENV=development
FLASK_DEBUG=True
```

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 📖 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Python Service Documentation](./python-service/README.md)

## 🛠️ Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** in the respective service folder

3. **Test** your changes
   ```bash
   npm run test
   ```

4. **Build** to ensure no compilation errors
   ```bash
   npm run build
   ```

5. **Create a pull request**

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in backend/.env
- Verify connection string format

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📦 Technologies Used

- **Frontend**: React 18, TypeScript, Material-UI 5, React Router 6, Axios
- **Backend**: Express.js, Mongoose, JWT, bcryptjs, TypeScript
- **Python**: Flask, Flask-CORS, Requests
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose

## 📄 License

MIT

## 👥 Support

For issues or questions, please open an issue on GitHub or contact the development team.
