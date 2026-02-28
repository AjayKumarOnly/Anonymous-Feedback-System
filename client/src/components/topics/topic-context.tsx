import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface Topic {
  id: string
  title: string
  groupId: string
  description?: string
  createdAt: string
}

export interface Feedback {
  id: string
  topicId: string
  message: string
  createdAt: string
  reviewed: boolean
}

interface TopicContextValue {
  topics: Topic[]
  addTopic: (data: { title: string; groupId: string; description?: string }) => Promise<void>
  feedback: Feedback[]
  addFeedback: (data: { topicId: string; message: string }) => Promise<void>
  toggleReviewed: (id: string) => Promise<void>
  fetchTopics: (groupId: string) => Promise<void>
  deleteTopic: (topicId: string) => Promise<void>
  fetchFeedback: (topicId: string) => Promise<void>
}

const TopicContext = createContext<TopicContextValue | undefined>(undefined)

const TOPIC_KEY = 'cipherfeedback_topics'
const FEEDBACK_KEY = 'cipherfeedback_feedback'

export const TopicProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])

  const fetchTopics = async (groupId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/topics/group/${groupId}`)
      if (res.ok) {
        const data = await res.json()
        setTopics(data)
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error)
    }
  }

  const fetchFeedback = async (topicId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/topic/${topicId}`)
      if (res.ok) {
        const data = await res.json()
        setFeedback(data) // Note: This sets feedback for the currently viewed topic
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
    }
  }

  const addTopic: TopicContextValue['addTopic'] = async (data) => {
    try {
      const res = await fetch('http://localhost:5000/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const newTopic: Topic = await res.json()
        setTopics((prev) => [newTopic, ...prev])
      }
    } catch (error) {
      console.error('Failed to add topic:', error)
    }
  }

  const deleteTopic: TopicContextValue['deleteTopic'] = async (topicId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/topics/${topicId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete topic')
      }
      setTopics((prev) => prev.filter(t => t.id !== topicId))
    } catch (error) {
      console.error('Failed to delete topic:', error)
      throw error
    }
  }

  const addFeedback: TopicContextValue['addFeedback'] = async (data) => {
    try {
      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const newItem: Feedback = await res.json()
        setFeedback((prev) => [newItem, ...prev])
      }
    } catch (error) {
      console.error('Failed to add feedback:', error)
    }
  }

  const toggleReviewed: TopicContextValue['toggleReviewed'] = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/${id}/review`, {
        method: 'PATCH',
      })
      if (res.ok) {
        const updated = await res.json()
        setFeedback((prev) =>
          prev.map((item) => (item.id === id ? { ...item, reviewed: updated.reviewed } : item))
        )
      }
    } catch (error) {
      console.error('Failed to toggle review:', error)
    }
  }

  const value = useMemo(
    () => ({
      topics,
      addTopic,
      deleteTopic,
      feedback,
      addFeedback,
      toggleReviewed,
      fetchTopics,
      fetchFeedback,
    }),
    [topics, feedback],
  )

  return <TopicContext.Provider value={value}>{children}</TopicContext.Provider>
}

export const useTopics = () => {
  const ctx = useContext(TopicContext)
  if (!ctx) {
    throw new Error('useTopics must be used within TopicProvider')
  }
  return ctx
}

