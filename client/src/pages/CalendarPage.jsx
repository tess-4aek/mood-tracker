import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getMoodEntriesByMonth } from '@/api/moods'
import { Button } from '@/components/ui/button'
import { Page } from '@/components/layout/Page'
import { buildMonthGrid, getMonthTitle, shiftMonth, toMonthStringLocal } from '@/lib/dates'
import { getMoodByScore } from '@/lib/mood'
import { cn } from '@/lib/utils'

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function CalendarPage() {
  const navigate = useNavigate()
  const [month, setMonth] = useState(toMonthStringLocal())
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const entriesByDate = useMemo(() => {
    return entries.reduce((acc, entry) => {
      acc[entry.date] = entry
      return acc
    }, {})
  }, [entries])

  const cells = useMemo(() => buildMonthGrid(month), [month])

  async function loadMonth() {
    setIsLoading(true)
    setError('')

    try {
      const data = await getMoodEntriesByMonth(month)
      setEntries(data.entries)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleDayClick(dateString) {
    if (entriesByDate[dateString]) {
      navigate(`/mood/${dateString}`)
    } else {
      navigate(`/mood/new?date=${dateString}`)
    }
  }

  useEffect(() => {
    loadMonth()
  }, [month])

  return (
    <Page>
      <header className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="Назад">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Календарь</h1>
          <p className="mt-1 text-sm text-zinc-500">Выбери день, чтобы открыть или создать запись.</p>
        </div>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Button variant="ghost" size="icon" onClick={() => setMonth((value) => shiftMonth(value, -1))}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold capitalize">{getMonthTitle(month)}</h2>
          <Button variant="ghost" size="icon" onClick={() => setMonth((value) => shiftMonth(value, 1))}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {isLoading && <p className="mb-3 text-sm text-zinc-500">Загружаю месяц...</p>}

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500">
          {WEEK_DAYS.map((day) => <div key={day} className="py-2">{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell) => {
            const entry = entriesByDate[cell.dateString]
            const mood = entry ? getMoodByScore(entry.moodScore) : null

            return (
              <button
                key={cell.dateString}
                type="button"
                onClick={() => handleDayClick(cell.dateString)}
                className={cn(
                  'aspect-square rounded-xl border text-sm transition hover:bg-zinc-50',
                  cell.isCurrentMonth ? 'border-zinc-200 bg-white text-zinc-950' : 'border-transparent bg-zinc-50 text-zinc-300',
                  cell.isToday && 'border-zinc-950'
                )}
              >
                <div className="text-xs">{cell.day}</div>
                <div className="mt-1 text-xl leading-none">{mood?.emoji || ''}</div>
              </button>
            )
          })}
        </div>
      </section>
    </Page>
  )
}
