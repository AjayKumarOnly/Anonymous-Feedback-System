const express = require('express')
const router = express.Router()
const db = require('../db')

// Create Topic
router.post('/', async (req, res) => {
    const { title, description, groupId } = req.body

    if (!title || !groupId) {
        return res.status(400).json({ error: 'Title and groupId are required' })
    }

    try {
        const id = `T-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

        await db.execute(
            'INSERT INTO topics (id, title, description, group_id) VALUES (?, ?, ?, ?)',
            [id, title, description || null, groupId]
        )

        res.status(201).json({ id, title, description, groupId })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Get Topics by Group ID
router.get('/group/:groupId', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM topics WHERE group_id = ? ORDER BY created_at DESC',
            [req.params.groupId]
        )
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Delete Topic
router.delete('/:id', async (req, res) => {
    try {
        const topicId = req.params.id

        // Delete all feedback associated with this topic
        await db.execute('DELETE FROM feedback WHERE topic_id = ?', [topicId])

        // Delete the topic itself
        const [result] = await db.execute('DELETE FROM topics WHERE id = ?', [topicId])

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Topic not found' })
        }

        res.json({ success: true, message: 'Topic deleted successfully' })
    } catch (error) {
        console.error('Error deleting topic:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
