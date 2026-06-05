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

export function buildTask(payload, position = 0) {
  const title = cleanString(payload.title);
  const now = new Date().toISOString();

  // Basic version: missing validation that title is required
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
