import { useState, useMemo, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import TaskList from '../components/TaskList'
import Modal from '../components/Modal'
import TaskForm from '../components/TaskForm'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getStats,
  isTaskOverdue,
} from '../services/api'

export default function Dashboard({ user, onLogout }) {
 const [tasks, setTasks] = useState([])
  useEffect(() => {
  const loadTasks = async () => {
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (error) {
      console.error("Failed to load tasks:", error)
    }
  }

  loadTasks()
}, [])
 


  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'pending' | 'in_progress' | 'completed' | 'overdue'
  const [priorityFilter, setPriorityFilter] = useState('all') // 'all' | 'low' | 'medium' | 'high'
  const [sortBy, setSortBy] = useState('dueDate_asc') // 'dueDate_asc' | 'dueDate_desc' | 'title_asc' | 'priority_desc'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Calculate live statistics
  const stats = useMemo(() => getStats(tasks), [tasks])

  // Filter & Sort Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim()
          const matchesTitle = task.title.toLowerCase().includes(query)
          const matchesDesc = (task.description || '').toLowerCase().includes(query)
          if (!matchesTitle && !matchesDesc) return false
        }

        // Status filter
        if (statusFilter === 'overdue') {
          if (!isTaskOverdue(task)) return false
        } else if (statusFilter !== 'all') {
          if (task.status !== statusFilter) return false
        }

        // Priority filter
        if (priorityFilter !== 'all') {
          if (task.priority !== priorityFilter) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate_asc') {
          return new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
        }
        if (sortBy === 'dueDate_desc') {
          return new Date(b.dueDate || 0) - new Date(a.dueDate || 0)
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title)
        }
        if (sortBy === 'priority_desc') {
          const priorityWeights = { high: 3, medium: 2, low: 1 }
          return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0)
        }
        return 0
      })
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy])

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all' || priorityFilter !== 'all'

  // Task actions
  const handleOpenCreateModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

 const handleSaveTask = async (taskData) => {
  try {
    if (editingTask) {
      const updated = await updateTask(
        editingTask._id || editingTask.id,
        taskData
      )

      setTasks((current) =>
        current.map((task) =>
          (task._id || task.id) === (updated._id || updated.id)
            ? updated
            : task
        )
      )
    } else {
      const created = await createTask(taskData)
      setTasks((current) => [created, ...current])
    }

    setIsModalOpen(false)
    setEditingTask(null)
  } catch (error) {
    console.error("Failed to save task:", error)
  }
}

const handleDeleteTask = async (task) => {
  try {
    const taskId =
      typeof task === "object"
        ? task._id || task.id
        : task

    if (!taskId) {
      console.error("Cannot delete task: missing task ID")
      return
    }

    await deleteTask(taskId)

    setTasks((currentTasks) =>
      currentTasks.filter(
        (currentTask) =>
          (currentTask._id || currentTask.id) !== taskId
      )
    )
  } catch (error) {
    console.error("Failed to delete task:", error)
  }
}

  const handleToggleComplete = (id) => {
    toggleTaskCompletion(id)
    setTasks(getTasks())
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('dueDate_asc')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        user={user}
        onLogout={onLogout}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeFilter={statusFilter}
          onSelectFilter={(filterId) => setStatusFilter(filterId)}
          stats={stats}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onCreateTaskClick={handleOpenCreateModal}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Header section with Greeting & Quick Add */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Task Overview
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Monitor team tasks, track deadlines, and maintain workflow velocity.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Task</span>
            </button>
          </div>

          {/* Statistics Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
            <StatsCard
              title="Total Tasks"
              count={stats.total}
              type="total"
              isActive={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            />
            <StatsCard
              title="Pending"
              count={stats.pending}
              type="pending"
              isActive={statusFilter === 'pending'}
              onClick={() => setStatusFilter('pending')}
            />
            <StatsCard
              title="In Progress"
              count={stats.inProgress}
              type="in_progress"
              isActive={statusFilter === 'in_progress'}
              onClick={() => setStatusFilter('in_progress')}
            />
            <StatsCard
              title="Completed"
              count={stats.completed}
              type="completed"
              isActive={statusFilter === 'completed'}
              onClick={() => setStatusFilter('completed')}
            />
            <StatsCard
              title="Overdue"
              count={stats.overdue}
              type="overdue"
              isActive={statusFilter === 'overdue'}
              onClick={() => setStatusFilter('overdue')}
            />
          </div>

          {/* Controls Bar: Search, Status, Priority, Sort */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
              {/* Search Bar */}
              <div className="lg:col-span-5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks by title or description..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="lg:col-span-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="lg:col-span-2">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              {/* Sort by Due Date */}
              <div className="lg:col-span-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                >
                  <option value="dueDate_asc">Sort: Due Date (Earliest)</option>
                  <option value="dueDate_desc">Sort: Due Date (Latest)</option>
                  <option value="priority_desc">Sort: Priority (Highest)</option>
                  <option value="title_asc">Sort: Title (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Active Filters Pill Row */}
            {hasActiveFilters && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-600">Filters:</span>
                  {searchQuery && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                      Search: &ldquo;{searchQuery}&rdquo;
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1 capitalize">
                      Status: {statusFilter.replace('_', ' ')}
                    </span>
                  )}
                  {priorityFilter !== 'all' && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1 capitalize">
                      Priority: {priorityFilter}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>

          {/* Task List Count Summary */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Tasks ({filteredTasks.length})
            </h2>
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onCreateTaskClick={handleOpenCreateModal}
            hasFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>

      {/* Create / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          initialData={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
