const express = require('express')
const router = express.Router()
const db = require('../db')

// Submit Feedback
router.post('/', async (req, res) => {
    const { topicId, message } = req.body

    if (!topicId || !message) {
        return res.status(400).json({ error: 'topicId and message are required' })
    }

    try {
        const id = `F-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

        await db.execute(
            'INSERT INTO feedback (id, topic_id, message) VALUES (?, ?, ?)',
            [id, topicId, message]
        )

        res.status(201).json({ id, topicId, message, reviewed: false })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Get Feedback by Topic ID
router.get('/topic/:topicId', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM feedback WHERE topic_id = ? ORDER BY created_at DESC',
            [req.params.topicId]
        )
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Toggle Reviewed Status
router.patch('/:id/review', async (req, res) => {
    try {
        // Get current status
        const [current] = await db.execute('SELECT reviewed FROM feedback WHERE id = ?', [req.params.id])

        if (current.length === 0) {
            return res.status(404).json({ error: 'Feedback not found' })
        }

        const newStatus = !current[0].reviewed

        await db.execute('UPDATE feedback SET reviewed = ? WHERE id = ?', [newStatus, req.params.id])

        res.json({ id: req.params.id, reviewed: newStatus })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
