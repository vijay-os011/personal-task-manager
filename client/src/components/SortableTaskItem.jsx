import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { TaskItem } from './TaskItem.jsx';

export function SortableTaskItem({ task, onUpdate, onDelete, isDragEnabled }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: !isDragEnabled
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`sortable-task ${isDragging ? 'dragging' : ''}`}
      data-task-id={task.id}
    >
      <button
        ref={setActivatorNodeRef}
        className="icon-button drag-handle"
        type="button"
        aria-label={`Reorder ${task.title}`}
        title="Reorder task"
        disabled={!isDragEnabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={17} aria-hidden="true" />
      </button>
      <TaskItem task={task} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  );
}
