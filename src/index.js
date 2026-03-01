const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const groupRoutes = require('./routes/groups')
const topicRoutes = require('./routes/topics')
const feedbackRoutes = require('./routes/feedback')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/topics', topicRoutes)
app.use('/api/feedback', feedbackRoutes)

// 1. Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// 2. Handle any requests that don't match the API routes
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
