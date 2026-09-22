const bcrypt = require('bcryptjs')
const { sql, getPool } = require('../config/db')

async function findUserByUsername(username) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('username', sql.NVarChar, username)
    .query('SELECT Id, Username, PasswordHash, Role FROM dbo.Users WHERE Username = @username')

  return result.recordset[0]
}

async function verifyPassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash)
}

module.exports = { findUserByUsername, verifyPassword }