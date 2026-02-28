import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../staff/auth-context'

export interface Group {
    id: string
    name: string
    teacherId: string
    createdAt: string
}

interface GroupContextValue {
    groups: Group[]
    createGroup: (name: string) => Promise<void>
    joinGroup: (groupId: string) => Promise<void>
    deleteGroup: (groupId: string) => Promise<void>
    getGroupById: (id: string) => Group | undefined
}

const GroupContext = createContext<GroupContextValue | undefined>(undefined)

export const GroupProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [groups, setGroups] = useState<Group[]>([])
    const { user } = useAuth()

    const fetchGroups = async () => {
        if (!user) return
        try {
            const endpoint = user.role === 'teacher'
                ? `http://localhost:5000/api/groups/teacher/${user.id}`
                : `http://localhost:5000/api/groups/student/${user.id}`

            const res = await fetch(endpoint)
            if (res.ok) {
                const data = await res.json()
                setGroups(data)
            }
        } catch (error) {
            console.error('Failed to fetch groups:', error)
        }
    }

    useEffect(() => {
        fetchGroups()
    }, [user])

    const createGroup = async (name: string) => {
        if (!user || user.role !== 'teacher') return
        try {
            const res = await fetch('http://localhost:5000/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), teacherId: user.id }),
            })
            if (res.ok) {
                const newGroup: Group = await res.json()
                setGroups((prev) => [newGroup, ...prev])
            }
        } catch (error) {
            console.error('Failed to create group:', error)
        }
    }

    const joinGroup = async (groupId: string) => {
        if (!user || user.role !== 'student') return
        try {
            const res = await fetch('http://localhost:5000/api/groups/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: user.id, groupId }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to join group')
            }

            const data = await res.json()
            if (data.success && data.group) {
                setGroups((prev) => {
                    // Prevent duplicates
                    if (prev.some(g => g.id === data.group.id)) return prev
                    return [data.group, ...prev]
                })
            }
        } catch (error) {
            console.error('Failed to join group:', error)
            throw error // Rethrow to show message in UI
        }
    }

    const getGroupById = (id: string) => {
        return groups.find((g) => g.id === id)
    }

    const deleteGroup = async (groupId: string) => {
        if (!user || user.role !== 'teacher') return
        try {
            const res = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to delete group')
            }

            setGroups((prev) => prev.filter(g => g.id !== groupId))
        } catch (error) {
            console.error('Failed to delete group:', error)
            throw error
        }
    }

    const value = useMemo(
        () => ({
            groups,
            createGroup,
            joinGroup,
            deleteGroup,
            getGroupById,
        }),
        [groups, user],
    )

    return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
}

export const useGroups = () => {
    const ctx = useContext(GroupContext)
    if (!ctx) {
        throw new Error('useGroups must be used within GroupProvider')
    }
    return ctx
}
