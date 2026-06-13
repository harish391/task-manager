# Getting Started Guide

## 🎯 First Time Setup

### Prerequisites Check

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Python version (should be 3.10+)
python --version
```

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Verify everything installed correctly
npm run build
```

### Step 2: Setup Environment Variables

#### Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRY=7d
NODE_ENV=development
PYTHON_SERVICE_URL=http://localhost:8000
```

#### Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:5000/api
```

#### Python Service

```bash
cd python-service
cp .env.example .env
```

Edit `python-service/.env`:

```
BACKEND_URL=http://localhost:5000
FLASK_ENV=development
FLASK_DEBUG=True
```

### Step 3: Database Setup

#### Option A: Use Docker (Recommended)

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=password mongo:6.0

# Update backend/.env
# MONGODB_URI=mongodb://root:password@localhost:27017/task-manager?authSource=admin
```

#### Option B: Local MongoDB

- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Follow installation instructions for your OS
- Verify it's running: `mongod`

### Step 4: Start Development Servers

#### Terminal 1: Backend

```bash
npm run dev:backend
# Server runs at http://localhost:5000
```

#### Terminal 2: Frontend

```bash
npm run dev:frontend
# App runs at http://localhost:3000
```

#### Terminal 3: Python Service

```bash
cd python-service
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
# Service runs at http://localhost:8000
```

### Step 5: Test the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account
3. Create a task
4. Try editing and deleting tasks

## 🧪 Running Tests

```bash
# Run all tests
npm run test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend
```

## 📚 Project Overview

### Backend (Node.js + Express)

- **REST API** for task management
- **MongoDB** for data persistence
- **JWT** for authentication
- **TypeScript** for type safety

### Frontend (React)

- **React 18** with TypeScript
- **Material-UI** for components
- **React Router** for navigation
- **Axios** for API calls

### Python Service

- **Flask** API server
- **Task Analytics** processing
- **Integration** with backend

## 🔍 Common Commands

```bash
# Build all services
npm run build

# Format code (all services)
npm run format

# Run both frontend and backend
npm run dev

# Just backend
npm run dev:backend

# Just frontend
npm run dev:frontend

# Lint code
npm run lint
```

## 🐛 Debugging

### Backend Debugging

- Add breakpoints in VS Code
- Run with debugger: `npm run dev:backend`
- Check logs in terminal

### Frontend Debugging

- Use React Developer Tools browser extension
- Open DevTools: F12
- Check Network tab for API calls

### Python Debugging

- Add `print()` statements for logging
- Use `pdb`: `import pdb; pdb.set_trace()`

## 📖 Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Python Service README](./python-service/README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🆘 Troubleshooting

### Issue: "Cannot find module"

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use

```bash
# Linux/Mac: Find and kill process
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: MongoDB connection error

- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Try connecting with MongoDB Compass

### Issue: Python venv not activating

```bash
# Recreate venv
python -m venv venv
# Activate and reinstall
pip install -r requirements.txt
```

## 🎓 Next Steps

1. Read through the code and understand the structure
2. Look at open issues on GitHub
3. Pick a task and create a PR
4. Ask questions in discussions

## 💡 Tips

- Keep terminal windows organized for each service
- Use VS Code split terminals for easier management
- Install recommended extensions for better DX
- Use `.env.example` as reference for configuration
- Read existing code before writing new code

Happy coding! 🚀
