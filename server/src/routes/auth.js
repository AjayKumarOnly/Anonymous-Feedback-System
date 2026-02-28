const express = require('express')
const router = express.Router()
const db = require('../db')

// Teacher Login / Register
router.post('/login/teacher', async (req, res) => {
    const { email, name } = req.body

    if (!email) {
        return res.status(400).json({ error: 'Email is required' })
    }

    const teacherName = name || Math.random().toString(36).slice(2, 8).toUpperCase()

    try {
        // Basic implementation: if teacher doesn't exist by some derived ID, create them.
        // For simplicity, we use the email prefix as ID or generate one.
        const id = `T-${email.split('@')[0].toUpperCase()}`

        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id])

        if (rows.length === 0) {
            await db.execute(
                'INSERT INTO users (id, name, role) VALUES (?, ?, ?)',
                [id, teacherName, 'teacher']
            )
        }

        res.json({ id, name: teacherName, role: 'teacher' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Student Login / Register
router.post('/login/student', async (req, res) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({ error: 'Name is required' })
    }

    try {
        // Find existing student by name to maintain persistence
        const [existing] = await db.execute('SELECT * FROM users WHERE name = ? AND role = ?', [name, 'student'])

        let id;
        if (existing.length > 0) {
            id = existing[0].id
        } else {
            id = `S-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
            await db.execute(
                'INSERT INTO users (id, name, role) VALUES (?, ?, ?)',
                [id, name, 'student']
            )
        }

        res.json({ id, name, role: 'student', groups: [] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
