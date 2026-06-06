import { useEffect, useState } from 'react';
import { CalendarDays, Check, Circle, Pencil, Trash2, X } from 'lucide-react';
import { formatDate, isOverdue } from '../lib/tasks.js';

export function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate || ''
  });

  useEffect(() => {
    setDraft({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate || ''
    });
  }, [task]);

  async function saveEdit(event) {
    event.preventDefault();
    await onUpdate(task.id, draft);
    setIsEditing(false);
  }

  async function deleteTask() {
    if (window.confirm(`Delete "${task.title}"?`)) {
      await onDelete(task.id);
    }
  }

  return (
    <article className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue(task) ? 'overdue' : ''}`}>
      <button
        className="icon-button status-button"
        type="button"
        onClick={() => onUpdate(task.id, { completed: !task.completed })}
        aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed ? <Check size={19} /> : <Circle size={19} />}
      </button>

      {isEditing ? (
        <form className="edit-form" onSubmit={saveEdit}>
          <input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            required
          />
          <textarea
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            rows="2"
          />
          <input
            type="date"
            value={draft.dueDate}
            onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
            onInput={(event) => setDraft({ ...draft, dueDate: event.target.value })}
          />
          <div className="task-actions">
            <button className="secondary-button" type="button" onClick={() => setIsEditing(false)}>
              <X size={16} aria-hidden="true" />
              Cancel
            </button>
            <button className="primary-button compact" type="submit">
              <Check size={16} aria-hidden="true" />
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="task-content">
          <div className="task-header">
            <h2>{task.title}</h2>
            <div className="task-actions">
              <button className="icon-button" type="button" onClick={() => setIsEditing(true)} aria-label={`Edit ${task.title}`} title="Edit task">
                <Pencil size={17} />
              </button>
              <button className="icon-button danger" type="button" onClick={deleteTask} aria-label={`Delete ${task.title}`} title="Delete task">
                <Trash2 size={17} />
              </button>
            </div>
          </div>
          {task.description ? <p>{task.description}</p> : null}
          <div className="task-meta">
            <CalendarDays size={15} aria-hidden="true" />
            <span>{formatDate(task.dueDate)}</span>
            {isOverdue(task) ? <strong>Overdue</strong> : null}
          </div>
        </div>
      )}
    </article>
  );
}
