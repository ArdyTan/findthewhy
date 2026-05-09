export function Card({ children, className = '' }) {
  return (
    <div className={`bg-cream border border-rule p-8 ${className}`}>{children}</div>
  )
}

export function Divider({ className = '' }) {
  return <hr className={`border-0 h-px bg-terracotta ${className}`} />
}

export function Label({ children, className = '' }) {
  return (
    <label className={`block text-xs font-medium uppercase tracking-widest text-muted mb-2 ${className}`}>
      {children}
    </label>
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full bg-transparent border-0 border-b border-ink/30 py-2 px-0 font-sans text-ink placeholder:text-muted focus:outline-none focus:border-b-2 focus:border-terracotta transition-colors ${className}`}
      {...props}
    />
  )
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full bg-transparent border border-ink/20 p-3 font-sans text-ink placeholder:text-muted focus:outline-none focus:border-terracotta resize-y min-h-[80px] ${className}`}
      {...props}
    />
  )
}

export function Tag({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 bg-ink/5 px-3 py-1 text-sm text-ink">
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-muted hover:text-terracotta text-base leading-none"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  )
}

export function Eyebrow({ children }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta mb-3">
      {children}
    </p>
  )
}
