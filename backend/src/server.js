require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Asset Management API is running',
    data: { version: '1.0.0' },
  })
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})