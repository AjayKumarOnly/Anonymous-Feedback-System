import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from './auth-context'

export const StaffLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Enter both email and password.')
      return
    }
    try {
      setIsSubmitting(true)
      await login('teacher', { email, name: email.split('@')[0] })
      navigate('/teacher/dashboard', { replace: true })
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-8">
      <div className="text-center">
        <div className="mb-3 inline-block rounded-md border-l-4 border-amber-500 bg-stone-800/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Teacher only
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-100">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-stone-400">
          Create topics and read anonymous student feedback.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-stone-700 bg-stone-900 p-5 shadow-xl"
        style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--cf-accent)' }}
      >
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500" htmlFor="email">
          Email
        </label>
        <div className="mb-4 flex items-center gap-2 rounded-md border border-stone-700 bg-stone-800 px-3 py-2.5 focus-within:border-amber-500/60 focus-within:ring-1 focus-within:ring-amber-500/30">
          <Mail className="h-4 w-4 text-stone-500" />
          <input
            id="email"
            type="email"
            className="min-w-0 flex-1 bg-transparent text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none"
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500" htmlFor="password">
          Password
        </label>
        <div className="mb-4 flex items-center gap-2 rounded-md border border-stone-700 bg-stone-800 px-3 py-2.5 focus-within:border-amber-500/60 focus-within:ring-1 focus-within:ring-amber-500/30">
          <LockKeyhole className="h-4 w-4 text-stone-500" />
          <input
            id="password"
            type="password"
            className="min-w-0 flex-1 bg-transparent text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-amber-500 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}
