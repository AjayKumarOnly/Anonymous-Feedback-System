import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, UserPlus, Users, ExternalLink } from 'lucide-react'
import { useGroups } from '../groups/group-context'
import { useAuth } from '../staff/auth-context'

export const StudentDashboardPage: React.FC = () => {
    const { groups, joinGroup } = useGroups()
    const { user } = useAuth()
    const [groupIdToJoin, setGroupIdToJoin] = useState('')
    const [error, setError] = useState<string | null>(null)

    const myGroups = groups

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const id = groupIdToJoin.trim()
        if (!id) return
        try {
            await joinGroup(id)
            setGroupIdToJoin('')
        } catch (err: any) {
            setError(err.message || 'Group not found. Check the ID and try again.')
        }
    }

    return (
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-8">
            <header>
                <div className="mb-2 flex items-center gap-2">
                    <div className="inline-block rounded-md border-l-4 border-emerald-500 bg-stone-800/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                        <span className="inline-flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            Student Dashboard
                        </span>
                    </div>
                </div>
                <h1 className="text-xl font-semibold tracking-tight text-stone-100 md:text-2xl">
                    Welcome, {user?.name}
                </h1>
                <p className="mt-1 text-sm text-stone-400">
                    Join groups to see available feedback topics.
                </p>
            </header>

            <form
                onSubmit={handleJoin}
                className="rounded-lg border border-stone-700 bg-stone-900 p-4"
                style={{ borderLeftWidth: '4px', borderLeftColor: '#10b981' }}
            >
                <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-stone-500">
                    <UserPlus className="h-3.5 w-3.5 text-emerald-500" />
                    Join a group
                </div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500" htmlFor="group-id">
                    Group ID
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 rounded-md border border-stone-700 bg-stone-800 px-3 py-2 focus-within:border-emerald-500/50 flex-1">
                        <BookOpen className="h-3.5 w-3.5 text-stone-500" />
                        <input
                            id="group-id"
                            className="min-w-0 flex-1 bg-transparent text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none uppercase"
                            placeholder="e.g. G-A1B2C3"
                            value={groupIdToJoin}
                            onChange={(e) => setGroupIdToJoin(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!groupIdToJoin.trim()}
                        className="rounded-md bg-emerald-500 px-6 py-2 text-sm font-semibold text-stone-950 transition hover:bg-emerald-400 disabled:opacity-50 whitespace-nowrap"
                    >
                        Join Group
                    </button>
                </div>
                {error && (
                    <div className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        {error}
                    </div>
                )}
            </form>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myGroups.length === 0 ? (
                    <p className="col-span-full py-6 text-center text-sm text-stone-500">
                        You haven't joined any groups yet. Enter a Group ID to join.
                    </p>
                ) : (
                    myGroups.map((group) => (
                        <div
                            key={group.id}
                            className="flex flex-col justify-between rounded-lg border border-stone-700 bg-stone-900 p-4 shadow-sm"
                            style={{ borderTopWidth: '3px', borderTopColor: '#78716c' }}
                        >
                            <div>
                                <h3 className="font-semibold text-stone-100">{group.name}</h3>
                                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-400">
                                    <span className="rounded bg-stone-800 px-1.5 py-0.5 font-mono text-stone-300">
                                        ID: {group.id}
                                    </span>
                                </div>
                            </div>
                            <Link
                                to={`/student/group/${group.id}`}
                                className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-stone-600 bg-stone-800 px-3 py-2 text-xs font-medium text-stone-200 transition hover:border-emerald-500/50 hover:text-emerald-400"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                View Topics
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}
