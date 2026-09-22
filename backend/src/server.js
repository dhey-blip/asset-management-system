require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { getPool } = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const assetRoutes = require('./routes/assetRoutes')

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

app.get('/api/health/db', async (req, res) => {
  try {
    const pool = await getPool()
    const result = await pool.request().query('SELECT DB_NAME() AS databaseName')

    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      data: { database: result.recordset[0].databaseName },
    })
  } catch (err) {
    console.error('Database error:', err.message)
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/assets', assetRoutes)

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

  getPool()
    .then(() => console.log(`Connected to SQL Server database: ${process.env.DB_NAME}`))
    .catch((err) => console.error('Could not connect to SQL Server:', err.message))
})