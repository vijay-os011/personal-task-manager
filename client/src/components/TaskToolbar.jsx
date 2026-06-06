import { Search } from 'lucide-react';
import { filters } from '../lib/tasks.js';

export function TaskToolbar({ status, searchTerm, onStatusChange, onSearchChange }) {
  return (
    <section className="toolbar" aria-label="Task filters">
      <div className="search-box">
        <Search size={18} aria-hidden="true" />
        <input value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search by title" />
      </div>

      <div className="segmented-control">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={status === filter ? 'active' : ''}
            onClick={() => onStatusChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}
