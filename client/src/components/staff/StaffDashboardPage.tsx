import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, BookOpen, Plus, ExternalLink, CalendarDays, Trash2 } from 'lucide-react'
import { useGroups } from '../groups/group-context'
import { useAuth } from './auth-context'

export const StaffDashboardPage: React.FC = () => {
  const { groups, createGroup, deleteGroup } = useGroups()
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const myGroups = useMemo(
    () => groups.filter((g) => g.teacherId === user?.id),
    [groups, user?.id],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createGroup(name)
    setName('')
  }

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (window.confirm(`Are you sure you want to delete the group "${groupName}"?\nAll topics and feedback will also be permanently deleted.`)) {
      try {
        setIsDeleting(groupId)
        await deleteGroup(groupId)
      } catch (error) {
        alert('Failed to delete the group. Please try again.')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <header>
        <div className="mb-2 inline-block rounded-md border-l-4 border-amber-500 bg-stone-800/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            My Groups
          </span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-stone-100 md:text-2xl">
          Manage your groups
        </h1>
        <p className="mt-1 text-sm text-stone-400">
          Create groups and share the Group ID with students so they can join.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-stone-700 bg-stone-900 p-4"
        style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--cf-accent)' }}
      >
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-stone-500">
          <Plus className="h-3.5 w-3.5 text-amber-500" />
          New group
        </div>
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-stone-500" htmlFor="group-name">
          Group Name
        </label>
        <div className="mb-3 flex items-center gap-2 rounded-md border border-stone-700 bg-stone-800 px-3 py-2 focus-within:border-amber-500/50">
          <BookOpen className="h-3.5 w-3.5 text-stone-500" />
          <input
            id="group-name"
            className="min-w-0 flex-1 bg-transparent text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none"
            placeholder="e.g. Computer Science 101"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-50"
        >
          Create Group
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {myGroups.length === 0 ? (
          <p className="col-span-full py-6 text-center text-sm text-stone-500">
            No groups created yet. Make one above.
          </p>
        ) : (
          myGroups.map((group) => (
            <div
              key={group.id}
              className="flex flex-col justify-between rounded-lg border border-stone-700 bg-stone-900 p-4 shadow-sm relative group"
              style={{ borderTopWidth: '3px', borderTopColor: '#78716c' }}
            >
              <button
                onClick={() => handleDeleteGroup(group.id, group.name)}
                disabled={isDeleting === group.id}
                className="absolute top-3 right-3 p-1.5 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 disabled:opacity-50"
                title="Delete Group"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div>
                <h3 className="font-semibold text-stone-100">{group.name}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-400">
                  <span className="rounded bg-stone-800 px-1.5 py-0.5 font-mono text-stone-300">
                    ID: {group.id}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-stone-500">
                  <CalendarDays className="h-3 w-3" />
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Link
                to={`/teacher/group/${group.id}`}
                className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-stone-600 bg-stone-800 px-3 py-2 text-xs font-medium text-stone-200 transition hover:border-amber-500/50 hover:text-amber-400"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open Group
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
