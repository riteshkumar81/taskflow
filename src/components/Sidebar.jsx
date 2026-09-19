export default function Sidebar({
  activeFilter = 'all',
  onSelectFilter,
  stats = { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 },
  isMobileOpen = false,
  onCloseMobile,
  onCreateTaskClick,
}) {
  const navItems = [
    {
      id: 'all',
      label: 'All Tasks',
      count: stats.total,
      badgeColor: 'bg-slate-100 text-slate-700',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      id: 'pending',
      label: 'Pending',
      count: stats.pending,
      badgeColor: 'bg-amber-100 text-amber-700',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      count: stats.inProgress,
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: 'completed',
      label: 'Completed',
      count: stats.completed,
      badgeColor: 'bg-emerald-100 text-emerald-700',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'overdue',
      label: 'Overdue',
      count: stats.overdue,
      badgeColor: stats.overdue > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ]

  const content = (
    <div className="flex flex-col h-full">
      {/* Quick Action */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile()
            onCreateTaskClick()
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Task</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Views & Status
        </p>
        {navItems.map((item) => {
          const isActive = activeFilter === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectFilter(item.id)
                if (onCloseMobile) onCloseMobile()
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-indigo-100 text-indigo-700' : item.badgeColor
                }`}
              >
                {item.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Workspace Status Card Footer */}
      <div className="p-4 border-t border-slate-200/80">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
          <div className="mt-0.5 relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-800">Workspace Active</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Mock storage in sync with browser</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-slate-200/80 shrink-0 min-h-[calc(100vh-61px)]">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-10 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">
                  TF
                </div>
                <span>TaskFlow</span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close menu"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{content}</div>
          </div>
        </div>
      )}
    </>
  )
}
