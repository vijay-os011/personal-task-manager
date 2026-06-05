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

export function getNextPosition(tasks) {
  if (tasks.length === 0) {
    return 0;
  }

  const positions = tasks.map((task) => (Number.isFinite(task.position) ? task.position : fallbackPosition(task)));

  return Math.min(...positions) - 1;
}

export function buildTask(payload, position = 0) {
  const title = cleanString(payload.title);

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

export function reorderTasks(tasks, orderedIds) {
  if (!Array.isArray(orderedIds) || orderedIds.length !== tasks.length) {
    return { error: 'orderedIds must include every task id exactly once.' };
  }

  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const uniqueIds = new Set(orderedIds);

  if (uniqueIds.size !== tasks.length || orderedIds.some((id) => !taskById.has(id))) {
    return { error: 'orderedIds must include every task id exactly once.' };
  }

  const now = new Date().toISOString();
  const reorderedTasks = orderedIds.map((id, index) => ({
    ...taskById.get(id),
    position: index,
    updatedAt: now
  }));

  return { tasks: reorderedTasks };
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
