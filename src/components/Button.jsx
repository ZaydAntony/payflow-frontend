export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-mango disabled:cursor-not-allowed disabled:opacity-60";
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };
  const variants = {
    primary:
      "bg-mango text-ink hover:bg-mango-deep active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(255,159,28,0.6)]",
    dark: "bg-ink text-parchment hover:bg-ink-soft active:scale-[0.98]",
    outline:
      "border border-ink/15 text-text hover:border-ink/40 active:scale-[0.98]",
    ghost: "text-text-soft hover:text-text",
    danger: "bg-coral/10 text-coral hover:bg-coral/20 active:scale-[0.98]",
  };

  return (
    <Component
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Component>
  );
}
