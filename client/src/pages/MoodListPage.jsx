import { useEffect, useState } from 'react'
import { CalendarDays, LogOut, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getMoodByDate, getMoodEntries } from '@/api/moods'
import { Button } from '@/components/ui/button'
import { MoodCard } from '@/components/mood/MoodCard'
import { Page } from '@/components/layout/Page'
import { useAuth } from '@/context/AuthContext'
import { toDateStringLocal } from '@/lib/dates'

export function MoodListPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadEntries() {
    setIsLoading(true)
    setError('')

    try {
      const data = await getMoodEntries()
      setEntries(data.entries)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function openToday() {
    const today = toDateStringLocal()

    try {
      await getMoodByDate(today)
      navigate(`/mood/${today}`)
    } catch (error) {
      navigate(`/mood/new?date=${today}`)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [])

  return (
    <Page>
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Мои записи</h1>
          <p className="mt-1 text-sm text-zinc-500">{user?.email}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} aria-label="Выйти">
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      {isLoading && <p className="text-sm text-zinc-500">Загружаю записи...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && entries.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <div className="text-5xl">😐</div>
          <h2 className="mt-4 font-semibold">Записей пока нет</h2>
          <p className="mt-2 text-sm text-zinc-500">Добавь первую запись за сегодня.</p>
          <Button className="mt-4" onClick={openToday}>Добавить запись</Button>
        </div>
      )}

      <div className="space-y-3 pb-28">
        {entries.map((entry) => (
          <MoodCard
            key={entry._id}
            entry={entry}
            onClick={() => navigate(`/mood/${entry.date}`)}
          />
        ))}
      </div>

      <div className="safe-bottom fixed inset-x-0 bottom-0 mx-auto max-w-2xl border-t border-zinc-200 bg-white/90 p-4 backdrop-blur">
        <div className="flex gap-3">
          <Button className="flex-1" onClick={openToday}>
            <Plus className="h-5 w-5" />
            Добавить запись
          </Button>
          <Button variant="secondary" size="icon" onClick={() => navigate('/calendar')} aria-label="Календарь">
            <CalendarDays className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Page>
  )
}
