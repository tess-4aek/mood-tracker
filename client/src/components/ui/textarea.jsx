import * as React from 'react'
import { cn } from '@/lib/utils'

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-36 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }
