import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { createMoodEntry, deleteMoodEntry, getMoodByDate, updateMoodEntry } from '@/api/moods'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MoodScale } from '@/components/mood/MoodScale'
import { Page } from '@/components/layout/Page'
import { formatHumanDate, toDateStringLocal } from '@/lib/dates'

export function MoodFormPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const isNew = !params.date

  const targetDate = useMemo(() => {
    return params.date || searchParams.get('date') || toDateStringLocal()
  }, [params.date, searchParams])

  const [entry, setEntry] = useState(null)
  const [moodScore, setMoodScore] = useState(3)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)

  async function loadEntry() {
    setIsLoading(true)
    setError('')

    try {
      const data = await getMoodByDate(targetDate)
      setEntry(data.entry)
      setMoodScore(data.entry.moodScore)
      setNote(data.entry.note || '')
    } catch (err) {
      if (isNew) return
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave(event) {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    const payload = {
      date: targetDate,
      moodScore,
      note
    }

    try {
      if (entry) {
        await updateMoodEntry(entry._id, payload)
      } else {
        const data = await createMoodEntry(payload)
        setEntry(data.entry)
      }

      navigate(`/mood/${targetDate}`)
    } catch (err) {
      if (err.message.includes('уже существует')) {
        navigate(`/mood/${targetDate}`)
      } else {
        setError(err.message)
      }
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!entry) return

    const confirmed = window.confirm('Удалить запись за этот день? Это действие нельзя отменить.')
    if (!confirmed) return

    try {
      await deleteMoodEntry(entry._id)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (!isNew) {
      loadEntry()
    }
  }, [targetDate, isNew])

  return (
    <Page>
      <header className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Назад">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{entry ? 'Запись дня' : 'Новая запись'}</h1>
          <p className="mt-1 text-sm text-zinc-500">{formatHumanDate(targetDate)}</p>
        </div>
      </header>

      {isLoading ? (
        <p className="text-sm text-zinc-500">Загружаю запись...</p>
      ) : error && !entry && !isNew ? (
        <Card>
          <CardContent className="space-y-4 p-5">
            <p className="text-sm text-red-600">{error}</p>
            <Button onClick={() => navigate(`/mood/new?date=${targetDate}`)}>Создать запись за этот день</Button>
          </CardContent>
        </Card>
      ) : (
        <form className="space-y-5" onSubmit={handleSave}>
          <Card>
            <CardContent className="space-y-5 p-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Настроение</label>
                <MoodScale value={moodScore} onChange={setMoodScore} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Заметка</label>
                <Textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={5000}
                  placeholder="Что повлияло на настроение? Что получилось за день?"
                />
                <p className="text-right text-xs text-zinc-400">{note.length}/5000</p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button className="w-full" disabled={isSaving}>
                {isSaving ? 'Сохраняю...' : entry ? 'Сохранить изменения' : 'Сохранить запись'}
              </Button>
            </CardContent>
          </Card>

          {entry && (
            <Button type="button" variant="destructive" className="w-full" onClick={handleDelete}>
              <Trash2 className="h-5 w-5" />
              Удалить запись
            </Button>
          )}
        </form>
      )}
    </Page>
  )
}
