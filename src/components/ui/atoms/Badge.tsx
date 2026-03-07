export type BadgeVariant = 'slate' | 'amber' | 'violet' | 'green'

export interface BadgeProps {
  children: React.ReactNode
  variant: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  slate: 'bg-slate-100 text-slate-700',
  amber: 'bg-amber-100 text-amber-700',
  violet: 'bg-violet-100 text-violet-700',
  green: 'bg-green-100 text-green-700',
}

export default function Badge({ children, variant, className = '' }: BadgeProps) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
