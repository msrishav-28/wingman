import { cn } from '@/lib/utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-mono text-neon-blue tracking-widest mb-2 uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-none bg-black/50 border-b border-white/20 text-white font-mono transition-all',
            'focus:outline-none focus:border-neon-purple focus:bg-neon-purple/5 focus:shadow-[0_10px_20px_-10px_rgba(123,97,255,0.2)]',
            error ? 'border-status-danger text-status-danger' : 'hover:border-white/40',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs font-mono text-status-danger">> ERROR: {error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
