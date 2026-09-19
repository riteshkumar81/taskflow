export default function FormField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
  rightElement,
  extraLabelAction,
}) {
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {extraLabelAction}
        </div>
      )}
      <div className="relative">
        <input
          id={id}
          name={name || id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
            rightElement ? 'pr-11' : ''
          } ${
            error
              ? 'border-rose-400 focus:ring-rose-400/20 bg-rose-50/20'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 bg-white'
          }`}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
