import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultDataPath = path.join(currentDirectory, '..', 'data', 'tasks.json');

export function createTaskStore(filePath = process.env.TASKS_FILE || defaultDataPath) {
  async function ensureFile() {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, '[]', 'utf8');
    }
  }

  async function readTasks() {
    await ensureFile();
    const contents = await fs.readFile(filePath, 'utf8');
    const tasks = JSON.parse(contents || '[]');

    return Array.isArray(tasks) ? tasks : [];
  }

  async function writeTasks(tasks) {
    await ensureFile();
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf8');
  }

  return {
    async list() {
      return readTasks();
    },
    async save(tasks) {
      await writeTasks(tasks);
      return tasks;
    }
  };
}
