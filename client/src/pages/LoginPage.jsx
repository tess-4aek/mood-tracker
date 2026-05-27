import { useState } from 'react'
import { requestOtp, verifyOtp } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'

export function LoginPage() {
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('email')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleRequestOtp(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const data = await requestOtp(email)
      setMessage(data.message)
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const data = await verifyOtp(email, otp)
      setUser(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Календарь настроения</CardTitle>
          <CardDescription>Вход по email-коду. Пароль не нужен.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={step === 'email' ? handleRequestOtp : handleVerifyOtp}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                disabled={step === 'otp'}
              />
            </div>

            {step === 'otp' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">OTP-код</label>
                <Input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
            )}

            {message && <p className="text-sm text-zinc-600">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Подождите...' : step === 'email' ? 'Получить код' : 'Войти'}
            </Button>

            {step === 'otp' && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                  setMessage('')
                  setError('')
                }}
              >
                Изменить email
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
