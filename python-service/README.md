# Python Task Processing Service

A Flask-based service for task analytics and processing.

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file:

```
BACKEND_URL=http://localhost:5000
FLASK_ENV=development
FLASK_DEBUG=True
```

## Running the Service

```bash
python app.py
```

The service will run on `http://localhost:8000`

## Endpoints

### Health Check
- `GET /health` - Check if service is running

### Analytics
- `GET /analytics/tasks` - Get task analytics (requires auth token)

### Task Processing
- `POST /process/task` - Process a task

## Usage Example

```bash
# Get task analytics
curl -H "Authorization: Bearer <token>" http://localhost:8000/analytics/tasks

# Process a task
curl -X POST http://localhost:8000/process/task \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "title": "Sample Task",
      "description": "This is a sample task",
      "priority": "high"
    }
  }'
```

## Features

- Task analytics and reporting
- Task processing and estimation
- Integration with backend API
- CORS enabled for frontend communication
