import { MOOD_OPTIONS } from '@/lib/mood'
import { cn } from '@/lib/utils'

export function MoodScale({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {MOOD_OPTIONS.map((item) => {
        const isActive = Number(value) === item.score

        return (
          <button
            type="button"
            key={item.score}
            onClick={() => onChange(item.score)}
            className={cn(
              'rounded-2xl border bg-white p-3 text-center transition hover:bg-zinc-50',
              isActive ? 'border-zinc-950 ring-2 ring-zinc-950' : 'border-zinc-200'
            )}
          >
            <div className="text-3xl">{item.emoji}</div>
            <div className="mt-1 text-xs text-zinc-500">{item.score}/5</div>
          </button>
        )
      })}
    </div>
  )
}
