import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CalendarDays, Inbox, MessageSquare, ChevronLeft } from 'lucide-react'
import { useTopics } from '../topics/topic-context'
import { useGroups } from '../groups/group-context'
import { useAuth } from '../staff/auth-context'

export const StudentGroupPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>()
    const { getGroupById } = useGroups()
    const group = groupId ? getGroupById(groupId) : undefined

    const { topics } = useTopics()
    const { user } = useAuth()

    const [submittedTopics, setSubmittedTopics] = React.useState<string[]>([])

    React.useEffect(() => {
        if (user?.name) {
            const key = `cipherfeedback_submitted_topics_${user.name}`
            setSubmittedTopics(JSON.parse(localStorage.getItem(key) || '[]'))
        }
    }, [user?.name])

    const groupTopics = useMemo(
        () => topics.filter((t) => t.groupId === groupId && !submittedTopics.includes(t.id)),
        [topics, groupId, submittedTopics],
    )

    if (!group) {
        return <div className="text-center p-8">Group not found</div>
    }

    return (
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-8">
            <header>
                <Link to="/student/dashboard" className="mb-4 inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200">
                    <ChevronLeft className="h-3.5 w-3.5" /> Back to Dashboard
                </Link>
                <div className="mb-2 flex items-center gap-2">
                    <div className="inline-block rounded-md border-l-4 border-emerald-500 bg-stone-800/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                        <span className="inline-flex items-center gap-1.5">
                            <Inbox className="h-3.5 w-3.5" />
                            Group Topics
                        </span>
                    </div>
                </div>
                <h1 className="text-xl font-semibold tracking-tight text-stone-100 md:text-2xl">
                    {group.name}
                </h1>
                <p className="mt-1 text-sm text-stone-400">
                    Select a topic below to submit anonymous feedback.
                </p>
            </header>

            <div
                className="rounded-lg border border-stone-700 bg-stone-900 p-4"
                style={{ borderLeftWidth: '4px', borderLeftColor: '#10b981' }}
            >
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                        Available Feedback Topics
                    </span>
                    <span className="text-[10px] text-stone-500">{groupTopics.length} topic{groupTopics.length === 1 ? '' : 's'}</span>
                </div>
                {groupTopics.length === 0 ? (
                    <p className="py-6 text-center text-xs text-stone-500">No topics available yet for this group.</p>
                ) : (
                    <ul className="space-y-3">
                        {groupTopics.map((topic) => (
                            <li
                                key={topic.id}
                                className="rounded-md border border-stone-700 bg-stone-800 p-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <span className="block text-sm font-medium text-stone-100">{topic.title}</span>
                                        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-stone-500">
                                            <CalendarDays className="h-3 w-3" />
                                            {new Date(topic.createdAt).toLocaleDateString()}
                                        </span>
                                        {topic.description && (
                                            <p className="mt-2 text-xs text-stone-400">{topic.description}</p>
                                        )}
                                    </div>
                                    <div className="flex shrink-0 ml-4">
                                        <Link
                                            to={`/student/feedback/${topic.id}`}
                                            className="inline-flex items-center gap-1.5 rounded bg-emerald-500/20 border border-emerald-500/50 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/30"
                                        >
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            Give Feedback
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
}
