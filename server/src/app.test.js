import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from './app.js';

function createMemoryStore(initialTasks = []) {
  let tasks = [...initialTasks];

  return {
    async list() {
      return tasks;
    },
    async save(nextTasks) {
      tasks = [...nextTasks];
      return tasks;
    }
  };
}

describe('task API', () => {
  let app;

  beforeEach(() => {
    app = createApp(createMemoryStore());
  });

  it('creates tasks, validates title, and returns newest tasks first', async () => {
    await request(app).post('/api/tasks').send({ title: 'First task' }).expect(201);
    await new Promise((resolve) => setTimeout(resolve, 5));
    await request(app).post('/api/tasks').send({ title: 'Second task' }).expect(201);

    const emptyTitleResponse = await request(app).post('/api/tasks').send({ title: '   ' }).expect(400);
    expect(emptyTitleResponse.body.error).toBe('Title is required.');

    const listResponse = await request(app).get('/api/tasks').expect(200);
    expect(listResponse.body.tasks).toHaveLength(2);
    expect(listResponse.body.tasks[0].title).toBe('Second task');
    expect(listResponse.body.tasks[1].title).toBe('First task');
    expect(listResponse.body.tasks[0].position).toBeLessThan(listResponse.body.tasks[1].position);
  });

  it('updates, filters, and deletes a task', async () => {
    const createResponse = await request(app).post('/api/tasks').send({ title: 'Pay bills' }).expect(201);
    const taskId = createResponse.body.task.id;

    const updateResponse = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Pay electricity bill', completed: true })
      .expect(200);

    expect(updateResponse.body.task.title).toBe('Pay electricity bill');
    expect(updateResponse.body.task.completed).toBe(true);

    const completedResponse = await request(app).get('/api/tasks?status=completed').expect(200);
    const activeResponse = await request(app).get('/api/tasks?status=active').expect(200);

    expect(completedResponse.body.tasks).toHaveLength(1);
    expect(activeResponse.body.tasks).toHaveLength(0);

    await request(app).delete(`/api/tasks/${taskId}`).expect(204);
    const finalResponse = await request(app).get('/api/tasks').expect(200);

    expect(finalResponse.body.tasks).toHaveLength(0);
  });

  it('persists task reordering', async () => {
    const firstResponse = await request(app).post('/api/tasks').send({ title: 'First task' }).expect(201);
    const secondResponse = await request(app).post('/api/tasks').send({ title: 'Second task' }).expect(201);
    const thirdResponse = await request(app).post('/api/tasks').send({ title: 'Third task' }).expect(201);

    const orderedIds = [firstResponse.body.task.id, thirdResponse.body.task.id, secondResponse.body.task.id];

    const reorderResponse = await request(app).patch('/api/tasks/reorder').send({ orderedIds }).expect(200);
    expect(reorderResponse.body.tasks.map((task) => task.title)).toEqual(['First task', 'Third task', 'Second task']);

    const listResponse = await request(app).get('/api/tasks').expect(200);
    expect(listResponse.body.tasks.map((task) => task.title)).toEqual(['First task', 'Third task', 'Second task']);
  });
});
