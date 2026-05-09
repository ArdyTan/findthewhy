export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center font-sans font-medium tracking-tight transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream'

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-base',
  }

  const variants = {
    primary: 'bg-terracotta text-cream hover:bg-terracotta-dark',
    secondary: 'bg-navy text-cream hover:bg-navy-light',
    ghost: 'bg-transparent text-ink border border-ink/20 hover:border-ink hover:bg-ink/5',
    link: 'bg-transparent text-ink underline-offset-4 hover:underline px-0 py-0',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
