# Frontend Setup

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Development

```bash
npm start
```

The app will open at `http://localhost:3000`

## Build

```bash
npm run build
```

## Features

- User authentication (register/login)
- Task creation, editing, and deletion
- Task status and priority management
- Responsive Material-UI design
- Protected routes with JWT authentication

## Components

- **LoginPage**: User login form
- **RegisterPage**: User registration form
- **DashboardPage**: Main task management interface
- **PrivateRoute**: Route protection component
