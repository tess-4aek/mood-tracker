import { Card, CardContent } from '@/components/ui/card'
import { formatHumanDate } from '@/lib/dates'
import { getMoodByScore } from '@/lib/mood'

export function MoodCard({ entry, onClick }) {
  const mood = getMoodByScore(entry.moodScore)
  const preview = entry.note?.trim() || 'Без заметки'

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <Card className="transition hover:bg-zinc-50 active:scale-[0.99]">
        <CardContent className="flex gap-4 p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-3xl">
            {mood.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{mood.score}/5 — {mood.label}</p>
              <p className="shrink-0 text-xs text-zinc-500">{formatHumanDate(entry.date)}</p>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{preview}</p>
          </div>
        </CardContent>
      </Card>
    </button>
  )
}
