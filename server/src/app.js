import cors from 'cors';
import express from 'express';
import { applyTaskUpdate, buildTask, filterByStatus, sortByPosition } from './tasks.js';
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

  app.get('/api/tasks', async (req, res, next) => {
    try {
      const tasks = await store.list();
      const filteredTasks = filterByStatus(tasks, req.query.status);

      res.json({ tasks: sortByPosition(filteredTasks) });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/tasks', async (req, res, next) => {
    try {
      const tasks = await store.list();
      const result = buildTask(req.body, tasks.length);

      // Added title validation error response
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      await store.save([...tasks, result.task]);

      return res.status(201).json({ task: result.task }); // changed to 201 Created
    } catch (error) {
      return next(error);
    }
  });

  app.put('/api/tasks/:id', async (req, res, next) => {
    try {
      const tasks = await store.list();
      const taskIndex = tasks.findIndex((task) => task.id === req.params.id);

      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found.' });
      }

      const result = applyTaskUpdate(tasks[taskIndex], req.body);

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      const nextTasks = [...tasks];
      nextTasks[taskIndex] = result.task;
      await store.save(nextTasks);

      return res.json({ task: result.task });
    } catch (error) {
      return next(error);
    }
  });

  app.delete('/api/tasks/:id', async (req, res, next) => {
    try {
      const tasks = await store.list();
      const nextTasks = tasks.filter((task) => task.id !== req.params.id);

      if (nextTasks.length === tasks.length) {
        return res.status(404).json({ error: 'Task not found.' });
      }

      await store.save(nextTasks);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  });

  return app;
}
