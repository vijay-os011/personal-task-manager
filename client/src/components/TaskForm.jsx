import { Plus } from 'lucide-react';

export function TaskForm({ onCreate, isSaving }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    await onCreate({
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate')
    });
    form.reset();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field-group primary-field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" placeholder="Plan tomorrow's review" required />
      </div>

      <div className="field-group">
        <label htmlFor="dueDate">Due date</label>
        <input id="dueDate" name="dueDate" type="date" />
      </div>

      <div className="field-group description-field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" placeholder="Optional details" rows="3" />
      </div>

      <button className="primary-button" type="submit" disabled={isSaving}>
        <Plus size={18} aria-hidden="true" />
        {isSaving ? 'Adding' : 'Add task'}
      </button>
    </form>
  );
}
