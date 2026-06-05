import crypto from 'node:crypto';

function cleanString(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function normaliseDueDate(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : value;
}

function fallbackPosition(task) {
  return -new Date(task.createdAt).getTime();
}

export function sortByPosition(tasks) {
  return [...tasks].sort((a, b) => {
    const firstPosition = Number.isFinite(a.position) ? a.position : fallbackPosition(a);
    const secondPosition = Number.isFinite(b.position) ? b.position : fallbackPosition(b);

    return firstPosition - secondPosition;
  });
}

export function filterByStatus(tasks, status = 'all') {
  if (status === 'active') {
    return tasks.filter((task) => !task.completed);
  }

  if (status === 'completed') {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

export function buildTask(payload, position = 0) {
  const title = cleanString(payload.title);

  // Added title validation check
  if (!title) {
    return { error: 'Title is required.' };
  }

  const now = new Date().toISOString();

  return {
    task: {
      id: crypto.randomUUID(),
      title,
      description: cleanString(payload.description),
      dueDate: normaliseDueDate(payload.dueDate),
      completed: false,
      position,
      createdAt: now,
      updatedAt: now
    }
  };
}

export function applyTaskUpdate(task, payload) {
  const nextTask = { ...task };

  if (Object.hasOwn(payload, 'title')) {
    const title = cleanString(payload.title);

    if (!title) {
      return { error: 'Title is required.' };
    }

    nextTask.title = title;
  }

  if (Object.hasOwn(payload, 'description')) {
    nextTask.description = cleanString(payload.description);
  }

  if (Object.hasOwn(payload, 'dueDate')) {
    nextTask.dueDate = normaliseDueDate(payload.dueDate);
  }

  if (Object.hasOwn(payload, 'completed')) {
    nextTask.completed = Boolean(payload.completed);
  }

  nextTask.updatedAt = new Date().toISOString();

  return { task: nextTask };
}
