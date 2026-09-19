import { useState } from 'react'

export default function TaskForm({ initialData = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'pending',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate || new Date().toISOString().split('T')[0],
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label htmlFor="task-title" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Task Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Implement user authentication"
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
            errors.title
              ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="task-description" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          id="task-description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details, objectives, or acceptance criteria..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-colors"
        />
      </div>

      {/* Status & Priority Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status */}
        <div>
          <label htmlFor="task-status" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Status
          </label>
          <select
            id="task-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-colors"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="task-priority" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Priority
          </label>
          <select
            id="task-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-colors"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="task-duedate" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Due Date <span className="text-rose-500">*</span>
        </label>
        <input
          id="task-duedate"
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
            errors.dueDate
              ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
          }`}
        />
        {errors.dueDate && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{errors.dueDate}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
