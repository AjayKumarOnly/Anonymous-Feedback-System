import React, { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    CalendarDays,
    CheckCircle2,
    Clipboard,
    Inbox,
    ListPlus,
    MessageCircle,
    MessageSquare,
    Tag,
    TextQuote,
    ChevronLeft,
    Trash2
} from 'lucide-react'
import { useTopics } from '../topics/topic-context'
import { useGroups } from '../groups/group-context'

export const StaffGroupPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>()
    const { getGroupById } = useGroups()
    const group = groupId ? getGroupById(groupId) : undefined

    const { topics, addTopic, deleteTopic, feedback, toggleReviewed } = useTopics()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const groupTopics = useMemo(
        () => topics.filter((t) => t.groupId === groupId),
        [topics, groupId],
    )

    const selectedTopic = useMemo(
        () => (selectedTopicId ? groupTopics.find((t) => t.id === selectedTopicId) : null),
        [groupTopics, selectedTopicId],
    )

    const feedbackForSelectedTopic = useMemo(
        () => (selectedTopicId ? feedback.filter((f) => f.topicId === selectedTopicId) : []),
        [feedback, selectedTopicId],
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !groupId) return
        addTopic({ title, description, groupId })
        setTitle('')
        setDescription('')
    }

    const handleCopyLink = (topicId: string) => {
        const url = `${window.location.origin}/feedback/${topicId}`
        navigator.clipboard?.writeText(url).catch(() => { })
    }

    const handleDeleteTopic = async (topicId: string, topicTitle: string) => {
        if (window.confirm(`Are you sure you want to delete the topic "${topicTitle}"?\nAll associated feedback will also be permanently deleted.`)) {
            try {
                setIsDeleting(topicId)
                await deleteTopic(topicId)
                if (selectedTopicId === topicId) {
                    setSelectedTopicId(null)
                }
            } catch (error) {
                alert('Failed to delete the topic. Please try again.')
            } finally {
                setIsDeleting(null)
            }
        }
    }

    if (!group) {
        return <div className="text-center p-8">Group not found</div>
    }

    return (
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-8">
            <header>
                <Link to="/teacher/dashboard" className="mb-4 inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200">
                    <ChevronLeft className="h-3.5 w-3.5" /> Back to Dashboard
                </Link>
                <div className="mb-2 flex items-center gap-2">
                    <div className="inline-block rounded-md border-l-4 border-amber-500 bg-stone-800/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                        <span className="inline-flex items-center gap-1.5">
                            <Inbox className="h-3.5 w-3.5" />
                            Group Topics
                        </span>
                    </div>
                    <span className="rounded bg-stone-800 px-2 py-1 font-mono text-xs text-stone-300">ID: {group.id}</span>
                </div>
                <h1 className="text-xl font-semibold tracking-tight text-stone-100 md:text-2xl">
                    {group.name}
                </h1>
                <p className="mt-1 text-sm text-stone-400">
                    Create topics for this group. Only students who joined this group will see them.
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="rounded-lg border border-stone-700 bg-stone-900 p-4"
                style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--cf-accent)' }}
            >
                <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-stone-500">
                    <ListPlus className="h-3.5 w-3.5 text-amber-500" />
                    New topic
                </div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500" htmlFor="topic-title">
                    Title
                </label>
                <div className="mb-3 flex items-center gap-2 rounded-md border border-stone-700 bg-stone-800 px-3 py-2 focus-within:border-amber-500/50">
                    <Tag className="h-3.5 w-3.5 text-stone-500" />
                    <input
                        id="topic-title"
                        className="min-w-0 flex-1 bg-transparent text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none"
                        placeholder="e.g. Feedback on Lab 3"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500" htmlFor="topic-desc">
                    Description (optional)
                </label>
                <div className="mb-3 flex items-start gap-2 rounded-md border border-stone-700 bg-stone-800 px-3 py-2 focus-within:border-amber-500/50">
                    <TextQuote className="mt-1.5 h-3.5 w-3.5 text-stone-500" />
                    <textarea
                        id="topic-desc"
                        className="min-h-[72px] min-w-0 flex-1 resize-y bg-transparent text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none"
                        placeholder="Short context for students"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!title.trim()}
                    className="rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-50"
                >
                    Save topic
                </button>
            </form>

            <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
                <div
                    className="rounded-lg border border-stone-700 bg-stone-900 p-4"
                    style={{ borderLeftWidth: '4px', borderLeftColor: '#78716c' }}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                            Group topics
                        </span>
                        <span className="text-[10px] text-stone-500">{groupTopics.length} topic{groupTopics.length === 1 ? '' : 's'}</span>
                    </div>
                    {groupTopics.length === 0 ? (
                        <p className="py-6 text-center text-xs text-stone-500">No topics yet. Add one above.</p>
                    ) : (
                        <ul className="space-y-2">
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
                                                <p className="mt-1 text-[11px] text-stone-400">{topic.description}</p>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedTopicId(selectedTopicId === topic.id ? null : topic.id)}
                                                className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-medium transition ${selectedTopicId === topic.id
                                                    ? 'border-amber-500/60 bg-amber-500/20 text-amber-400'
                                                    : 'border-stone-600 bg-stone-800 text-stone-400 hover:border-stone-500 hover:text-stone-300'
                                                    }`}
                                            >
                                                <MessageSquare className="h-3 w-3" />
                                                Feedback
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyLink(topic.id)}
                                                className="inline-flex items-center gap-1 rounded border border-stone-600 bg-stone-800 px-2 py-1 text-[10px] font-medium text-stone-400 transition hover:border-stone-500 hover:text-stone-300"
                                            >
                                                <Clipboard className="h-3 w-3" />
                                                Copy link
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTopic(topic.id, topic.title)}
                                                disabled={isDeleting === topic.id}
                                                className="inline-flex items-center gap-1 rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div
                    className="rounded-lg border border-stone-700 bg-stone-900 p-4"
                    style={{ borderLeftWidth: '4px', borderLeftColor: '#78716c' }}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                            <span className="inline-flex items-center gap-1.5">
                                <MessageCircle className="h-3.5 w-3.5 text-amber-500" />
                                Student feedback
                            </span>
                        </span>
                        {selectedTopicId ? (
                            <button
                                type="button"
                                onClick={() => setSelectedTopicId(null)}
                                className="text-[10px] font-medium text-stone-500 hover:text-amber-400"
                            >
                                Clear selection
                            </button>
                        ) : (
                            <span className="text-[10px] text-stone-500">{feedback.length} total</span>
                        )}
                    </div>

                    {!selectedTopicId ? (
                        <p className="py-8 text-center text-xs text-stone-500">
                            Click &quot;Feedback&quot; on a topic to load only that topic&apos;s responses.
                        </p>
                    ) : selectedTopic && feedbackForSelectedTopic.length === 0 ? (
                        <p className="py-8 text-center text-xs text-stone-500">
                            No feedback yet for &quot;{selectedTopic.title}&quot;. Share the link with students.
                        </p>
                    ) : selectedTopic ? (
                        <div>
                            <div className="mb-3 rounded-md border border-stone-700 bg-stone-800 px-3 py-2">
                                <span className="text-sm font-medium text-stone-100">{selectedTopic.title}</span>
                                <span className="ml-2 text-[10px] text-stone-500">
                                    {feedbackForSelectedTopic.length} response{feedbackForSelectedTopic.length === 1 ? '' : 's'}
                                </span>
                            </div>
                            <ul className="space-y-2">
                                {feedbackForSelectedTopic.map((item) => (
                                    <li key={item.id} className="rounded-md border border-stone-700 bg-stone-800 p-2.5">
                                        <p className="text-xs text-stone-200">{item.message}</p>
                                        <div className="mt-2 flex items-center justify-between text-[10px] text-stone-500">
                                            <span>{new Date(item.createdAt).toLocaleString()}</span>
                                            <button
                                                type="button"
                                                onClick={() => toggleReviewed(item.id)}
                                                className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-medium ${item.reviewed
                                                    ? 'border-green-500/50 bg-green-500/20 text-green-400'
                                                    : 'border-stone-600 text-stone-400 hover:border-stone-500'
                                                    }`}
                                            >
                                                <CheckCircle2 className="h-3 w-3" />
                                                {item.reviewed ? 'Reviewed' : 'Mark reviewed'}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    )
}
