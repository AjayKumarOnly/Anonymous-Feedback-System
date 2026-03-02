import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Send, Shield, ChevronLeft } from 'lucide-react'
import { useTopics } from '../topics/topic-context'
import { useAuth } from '../staff/auth-context'

export const StudentFeedbackPage: React.FC = () => {
  const { topics, addFeedback } = useTopics()
  const { user } = useAuth()
  const params = useParams<{ topicId?: string }>()
  const directTopicId = params.topicId

  const [topicId, setTopicId] = useState<string>('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const directTopic = useMemo(
    () => topics.find((t) => t.id === directTopicId),
    [topics, directTopicId],
  )

  useEffect(() => {
    if (directTopic) setTopicId(directTopic.id)
  }, [directTopic])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topicId || !message.trim()) return
    try {
      setIsSubmitting(true)
      setStatus('idle')
      addFeedback({ topicId, message })

      if (user?.name && directTopic) {
        const submittedTopicsKey = `cipherfeedback_submitted_topics_${user.name}`

        const submittedTopics: string[] = JSON.parse(localStorage.getItem(submittedTopicsKey) || '[]')
        if (!submittedTopics.includes(topicId)) {
          submittedTopics.push(topicId)
          localStorage.setItem(submittedTopicsKey, JSON.stringify(submittedTopics))
        }
      }

      await new Promise((r) => setTimeout(r, 500))
      setStatus('success')
      setMessage('')
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!directTopic) {
    return (
      <div className="text-center p-8 flex flex-col items-center">
        <p className="text-stone-400 mb-4">Topic not found.</p>
        <Link to="/" className="text-emerald-500 hover:text-emerald-400">Go Home</Link>
      </div>
    )
  }

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <header className="relative text-center">
        {user?.role === 'student' && (
          <Link
            to={`/student/group/${directTopic.groupId}`}
            className="absolute left-0 top-1 text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Back
          </Link>
        )}
        <div className="mb-3 inline-block rounded-md border-l-4 border-emerald-500 bg-stone-800/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          <span className="inline-flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Anonymous Form
          </span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-stone-100">
          Share feedback
        </h1>
        <p className="mt-2 text-sm text-stone-400">
          Your response is for this topic only. No name or ID is collected.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-stone-700 bg-stone-900 p-5 shadow-sm"
        style={{ borderLeftWidth: '4px', borderLeftColor: '#10b981' }}
      >
        <div className="mb-4 rounded-md border border-stone-700 bg-stone-800 px-3 py-2.5">
          <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">Topic</div>
          <div className="mt-1 text-sm font-medium text-stone-100">{directTopic.title}</div>
          {directTopic.description && (
            <div className="mt-0.5 text-xs text-stone-400 whitespace-pre-wrap">{directTopic.description}</div>
          )}
        </div>

        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500" htmlFor="message">
          Your feedback
        </label>
        <textarea
          id="message"
          className="mb-4 min-h-[120px] w-full resize-y rounded-md border border-stone-700 bg-stone-800 px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 shrink"
          placeholder="Write your thoughts here…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <p className="mb-4 text-[11px] text-stone-500">
          Only the topic and your message are stored. Your identity is hidden.
        </p>

        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className="w-full rounded-md bg-emerald-500 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-emerald-400 disabled:opacity-50"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Sending…' : 'Send feedback'}
          </span>
        </button>

        {status === 'success' && (
          <div className="mt-4 rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2 text-xs text-green-300">
            Thanks. Your feedback was submitted anonymously.
          </div>
        )}
        {status === 'error' && (
          <div className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            Something went wrong. Please try again.
          </div>
        )}
      </form>
    </section>
  )
}
