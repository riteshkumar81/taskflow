import TaskCard from './TaskCard'

export default function TaskList({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onCreateTaskClick,
  hasFilters,
  onResetFilters,
}) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center my-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          {hasFilters ? 'No tasks matching your criteria' : 'No tasks created yet'}
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          {hasFilters
            ? 'Try adjusting or clearing your search term and filters to see more tasks.'
            : 'Get started by creating your first task to track work and boost productivity.'}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        ) : (
          <button
            type="button"
            onClick={onCreateTaskClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Task
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
      {tasks.map((task) => (
        <TaskCard
    key={task._id || task.id}
    task={task}
    onEdit={onEditTask}
    onDelete={() => onDeleteTask(task)}
    onToggleComplete={onToggleComplete}
       />
      ))}
    </div>
  )
}
