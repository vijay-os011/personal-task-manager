import { TaskItem } from './TaskItem.jsx';

export function TaskList({ tasks, canReorder, onReorder, onUpdate, onDelete }) {
  return (
    <section className="task-list" aria-label="Tasks">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
