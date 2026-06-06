const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }

  return data;
}

export function getTasks() {
  return requestJson('/api/tasks');
}

export function createTask(payload) {
  return requestJson('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateTask(id, payload) {
  return requestJson(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteTask(id) {
  return requestJson(`/api/tasks/${id}`, { method: 'DELETE' });
}

export function reorderTasks(orderedIds) {
  return requestJson('/api/tasks/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ orderedIds })
  });
}
