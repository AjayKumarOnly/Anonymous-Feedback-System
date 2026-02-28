const express = require('express')
const router = express.Router()
const db = require('../db')

// Create Group (Teacher)
router.post('/', async (req, res) => {
    const { name, teacherId } = req.body

    if (!name || !teacherId) {
        return res.status(400).json({ error: 'Name and teacherId required' })
    }

    try {
        const id = `G-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

        await db.execute(
            'INSERT INTO groups (id, name, teacher_id) VALUES (?, ?, ?)',
            [id, name, teacherId]
        )

        res.status(201).json({ id, name, teacherId, createdAt: new Date().toISOString() })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Get Teacher's Groups
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, name, teacher_id as teacherId, created_at as createdAt FROM groups WHERE teacher_id = ? ORDER BY created_at DESC',
            [req.params.teacherId]
        )
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Student Joins Group
router.post('/join', async (req, res) => {
    const { studentId, groupId } = req.body

    if (!studentId || !groupId) {
        return res.status(400).json({ error: 'studentId and groupId required' })
    }

    try {
        // Check if group exists
        const [groups] = await db.execute(
            'SELECT id, name, teacher_id as teacherId, created_at as createdAt FROM groups WHERE id = ?',
            [groupId]
        )
        if (groups.length === 0) {
            return res.status(404).json({ error: 'Group not found' })
        }

        await db.execute(
            'INSERT IGNORE INTO group_members (student_id, group_id) VALUES (?, ?)',
            [studentId, groupId]
        )

        res.status(200).json({ success: true, group: groups[0] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Get Student's Joined Groups
router.get('/student/:studentId', async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT g.id, g.name, g.teacher_id as teacherId, g.created_at as createdAt FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.student_id = ?
      ORDER BY gm.joined_at DESC
    `, [req.params.studentId])

        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Delete Group
router.delete('/:id', async (req, res) => {
    try {
        const groupId = req.params.id

        // Manual cascade delete just to be absolutely certain
        await db.execute('DELETE FROM group_members WHERE group_id = ?', [groupId])

        // Find all topics for this group to delete their feedback
        const [topics] = await db.execute('SELECT id FROM topics WHERE group_id = ?', [groupId])
        for (const topic of topics) {
            await db.execute('DELETE FROM feedback WHERE topic_id = ?', [topic.id])
        }

        // Delete the topics themselves
        await db.execute('DELETE FROM topics WHERE group_id = ?', [groupId])

        // Finally delete the group
        const [result] = await db.execute('DELETE FROM groups WHERE id = ?', [groupId])

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Group not found' })
        }

        res.json({ success: true, message: 'Group deleted successfully' })
    } catch (error) {
        console.error('Error deleting group:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
