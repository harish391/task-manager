def calculate_task_complexity(title, description):
    """
    Calculate task complexity based on title and description.
    Returns a complexity score from 1-10.
    """
    complexity = 1
    
    keywords = {
        'complex': 3,
        'difficult': 2,
        'urgent': 1,
        'integrate': 2,
        'refactor': 2,
        'optimize': 1,
        'bug': 2,
        'fix': 1,
        'design': 3,
    }
    
    full_text = (title + ' ' + description).lower()
    
    for keyword, score in keywords.items():
        if keyword in full_text:
            complexity += score
    
    return min(complexity, 10)


def generate_task_summary(task):
    """Generate an AI-like summary for a task"""
    return {
        'title': task.get('title', '').upper(),
        'length': len(task.get('description', '')),
        'priority_level': task.get('priority', 'medium').upper(),
        'complexity': calculate_task_complexity(
            task.get('title', ''),
            task.get('description', '')
        )
    }
