from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'Python service is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/analytics/tasks', methods=['GET'])
def get_task_analytics():
    """
    Calculate task analytics from the backend.
    This demonstrates the Python service integrating with the backend.
    """
    try:
        headers = {
            'Authorization': request.headers.get('Authorization', '')
        }
        
        response = requests.get(f'{BACKEND_URL}/api/tasks', headers=headers)
        tasks = response.json()
        
        if not isinstance(tasks, list):
            return jsonify({'error': 'Invalid response from backend'}), 500
        
        analytics = {
            'total_tasks': len(tasks),
            'tasks_by_status': {},
            'tasks_by_priority': {},
            'completion_percentage': 0
        }
        
        for task in tasks:
            status = task.get('status', 'unknown')
            priority = task.get('priority', 'unknown')
            
            analytics['tasks_by_status'][status] = analytics['tasks_by_status'].get(status, 0) + 1
            analytics['tasks_by_priority'][priority] = analytics['tasks_by_priority'].get(priority, 0) + 1
        
        if analytics['total_tasks'] > 0:
            completed = analytics['tasks_by_status'].get('completed', 0)
            analytics['completion_percentage'] = round((completed / analytics['total_tasks']) * 100, 2)
        
        return jsonify(analytics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process/task', methods=['POST'])
def process_task():
    """
    Process a task (e.g., calculate time estimates, generate summaries, etc.)
    """
    try:
        data = request.json
        task = data.get('task', {})
        
        # Example processing
        processed_task = {
            'original': task,
            'processed_at': datetime.now().isoformat(),
            'word_count': len(task.get('description', '').split()),
            'estimated_hours': calculate_estimate(task.get('priority', 'medium')),
        }
        
        return jsonify(processed_task)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def calculate_estimate(priority):
    """Calculate estimated hours based on priority"""
    estimates = {
        'low': 1,
        'medium': 2,
        'high': 4
    }
    return estimates.get(priority, 2)

if __name__ == '__main__':
    app.run(debug=True, port=8000)
