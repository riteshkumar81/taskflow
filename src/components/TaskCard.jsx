import { isTaskOverdue } from '../services/api'

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const overdue = isTaskOverdue(task)
  const isCompleted = task.status === 'completed'

  const priorityStyles = {
    high: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
      dot: 'bg-rose-500',
      label: 'High Priority',
    },
    medium: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      dot: 'bg-amber-500',
      label: 'Medium Priority',
    },
    low: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      label: 'Low Priority',
    },
  }

  const statusStyles = {
    pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      label: 'Pending',
    },
    in_progress: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
      label: 'In Progress',
    },
    completed: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      label: 'Completed',
    },
  }

  const priorityConfig = priorityStyles[task.priority] || priorityStyles.medium
  const statusConfig = statusStyles[task.status] || statusStyles.pending

  // Format Due Date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    try {
      const parts = dateString.split('-')
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2])
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      }
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-md ${
        isCompleted
          ? 'border-slate-200/60 bg-slate-50/40'
          : overdue
          ? 'border-rose-200 bg-white'
          : 'border-slate-200/90'
      }`}
    >
      <div>
        {/* Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg}`}
            >
              {statusConfig.label}
            </span>

            {/* Overdue Badge if applicable */}
            {overdue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-xs animate-pulse">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Overdue
              </span>
            )}
          </div>

          {/* Priority Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${priorityConfig.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`} />
            {priorityConfig.label}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-base font-semibold tracking-tight transition-colors ${
            isCompleted
              ? 'text-slate-400 line-through'
              : 'text-slate-900 group-hover:text-indigo-600'
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p
            className={`mt-2 text-sm leading-relaxed line-clamp-3 ${
              isCompleted ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Section */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Due Date Indicator */}
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            overdue
              ? 'text-rose-600 font-semibold'
              : isCompleted
              ? 'text-slate-400'
              : 'text-slate-500'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Due {formatDate(task.dueDate)}</span>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Mark Completed Toggle */}
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            aria-label={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isCompleted
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{isCompleted ? 'Reopen' : 'Complete'}</span>
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(task)}
            title="Delete task"
            aria-label="Delete task"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
