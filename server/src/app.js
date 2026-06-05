import cors from 'cors';
import express from 'express';
import { buildTask } from './tasks.js';
import { createTaskStore } from './store.js';

export function createApp(store = createTaskStore()) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://127.0.0.1:5173');
  });

  app.get('/api/health', (req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/tasks', async (req, res) => {
    const tasks = await store.list();
    const result = buildTask(req.body, tasks.length);
    await store.save([...tasks, result.task]);
    return res.json({ task: result.task }); // returning status 200 instead of 201, and missing error checking
  });

  return app;
}
