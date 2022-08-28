export function addTasks(task) {
    return fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(task)
    })
}

export function updateTask(task) {
    return fetch(`http://localhost:3000/tasks/` + task.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(task)
    });
}

export function deleteTask(taskId) {
    return fetch(`http://localhost:3000/tasks/` + taskId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    })
}