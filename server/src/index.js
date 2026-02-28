const express = require('express')
const cors = require('cors')
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

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
