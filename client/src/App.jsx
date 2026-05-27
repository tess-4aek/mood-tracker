import { Navigate, Route, Routes } from 'react-router-dom'
import { CalendarPage } from '@/pages/CalendarPage'
import { LoginPage } from '@/pages/LoginPage'
import { MoodFormPage } from '@/pages/MoodFormPage'
import { MoodListPage } from '@/pages/MoodListPage'
import { useAuth } from '@/context/AuthContext'

function Protected({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 text-sm text-zinc-500">
        Проверяю сессию...
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicOnly({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 text-sm text-zinc-500">
        Проверяю сессию...
      </main>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/" element={<Protected><MoodListPage /></Protected>} />
      <Route path="/calendar" element={<Protected><CalendarPage /></Protected>} />
      <Route path="/mood/new" element={<Protected><MoodFormPage /></Protected>} />
      <Route path="/mood/:date" element={<Protected><MoodFormPage /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
