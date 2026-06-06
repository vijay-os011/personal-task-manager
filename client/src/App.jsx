import { useEffect, useMemo, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { TaskForm } from './components/TaskForm.jsx';
import { TaskList } from './components/TaskList.jsx';
import { TaskToolbar } from './components/TaskToolbar.jsx';
import { createTask as createTaskRequest, deleteTask as deleteTaskRequest, getTasks, reorderTasks, updateTask as updateTaskRequest } from './lib/api.js';

export function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const counts = useMemo(
    () => ({
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length
    }),
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesStatus =
        status === 'all' || (status === 'active' && !task.completed) || (status === 'completed' && task.completed);
      const matchesSearch = !needle || task.title.toLowerCase().includes(needle);

      return matchesStatus && matchesSearch;
    });
  }, [tasks, status, searchTerm]);

  const canReorder = status === 'all' && searchTerm.trim() === '';

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setIsLoading(true);
    setError('');

    try {
      const data = await getTasks();
      setTasks(data.tasks);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function createTask(payload) {
    setIsSaving(true);
    setError('');

    try {
      const data = await createTaskRequest(payload);
      setTasks((currentTasks) => [data.task, ...currentTasks]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function updateTask(id, payload) {
    setError('');

    try {
      const data = await updateTaskRequest(id, payload);
      setTasks((currentTasks) => currentTasks.map((task) => (task.id === id ? data.task : task)));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteTask(id) {
    setError('');

    try {
      await deleteTaskRequest(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function reorderTask(activeId, overId) {
    if (!overId || activeId === overId || !canReorder) {
      return;
    }

    const oldIndex = tasks.findIndex((task) => task.id === activeId);
    const newIndex = tasks.findIndex((task) => task.id === overId);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const previousTasks = tasks;
    const nextTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(nextTasks);
    setError('');

    try {
      const data = await reorderTasks(nextTasks.map((task) => task.id));
      setTasks(data.tasks);
    } catch (requestError) {
      setTasks(previousTasks);
      setError(requestError.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="app-header">
          <div>
            <p>Personal Task Manager</p>
            <h1>Keep today honest.</h1>
          </div>
          <div className="count-strip" aria-label="Task counts">
            <span>
              <strong>{counts.active}</strong> active
            </span>
            <span>
              <strong>{counts.completed}</strong> completed
            </span>
          </div>
        </header>

        <TaskForm onCreate={createTask} isSaving={isSaving} />
        <TaskToolbar status={status} searchTerm={searchTerm} onStatusChange={setStatus} onSearchChange={setSearchTerm} />

        {error ? <div className="notice error">{error}</div> : null}
        {isLoading ? <div className="notice">Loading tasks...</div> : null}

        {!isLoading && visibleTasks.length === 0 ? (
          <section className="empty-state">
            <h2>No tasks found</h2>
            <p>Add a task or adjust the current filters.</p>
          </section>
        ) : null}

        <TaskList
          tasks={visibleTasks}
          canReorder={canReorder}
          onReorder={reorderTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </section>
    </main>
  );
}
