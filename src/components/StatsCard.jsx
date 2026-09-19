export default function StatsCard({
  title,
  count,
  type = 'total',
  isActive = false,
  onClick,
}) {
  const configs = {
    total: {
      accent: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      activeRing: 'ring-2 ring-indigo-500 border-indigo-500',
      badge: 'bg-indigo-500 text-white',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    pending: {
      accent: 'text-amber-600 bg-amber-50 border-amber-100',
      activeRing: 'ring-2 ring-amber-500 border-amber-500',
      badge: 'bg-amber-500 text-white',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    in_progress: {
      accent: 'text-blue-600 bg-blue-50 border-blue-100',
      activeRing: 'ring-2 ring-blue-500 border-blue-500',
      badge: 'bg-blue-500 text-white',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    completed: {
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500',
      badge: 'bg-emerald-500 text-white',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    overdue: {
      accent: 'text-rose-600 bg-rose-50 border-rose-100',
      activeRing: 'ring-2 ring-rose-500 border-rose-500',
      badge: 'bg-rose-500 text-white',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  }

  const current = configs[type] || configs.total

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left w-full p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer ${
        isActive ? current.activeRing : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2 rounded-xl border ${current.accent}`}>
          {current.icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {count}
        </p>
        <span className="text-xs text-slate-400 font-medium">Click to filter</span>
      </div>
    </button>
  )
}
