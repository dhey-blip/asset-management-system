const jwt = require('jsonwebtoken')
const { findUserByUsername, verifyPassword } = require('../services/authService')

async function login(req, res) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      })
    }

    const user = await findUserByUsername(username)

     if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      })
    }

    const passwordMatches = await verifyPassword(password, user.PasswordHash)

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      })
    }

    const token = jwt.sign(
      { userId: user.Id, username: user.Username, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.Id,
          username: user.Username,
          role: user.Role,
        },
      },
    })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

module.exports = { login }