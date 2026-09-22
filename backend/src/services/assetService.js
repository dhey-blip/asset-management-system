const { sql, getPool } = require('../config/db')

async function getAllAssets() {
  const pool = await getPool()
  const result = await pool
    .request()
    .query('SELECT * FROM dbo.Assets ORDER BY CreatedAt DESC')

  return result.recordset
}

async function findByAssetCode(assetCode) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('assetCode', sql.NVarChar, assetCode)
    .query('SELECT Id FROM dbo.Assets WHERE AssetCode = @assetCode')

  return result.recordset[0]
}

async function createAsset(asset) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('assetCode', sql.NVarChar, asset.assetCode)
    .input('assetName', sql.NVarChar, asset.assetName)
    .input('category', sql.NVarChar, asset.category || null)
    .input('brand', sql.NVarChar, asset.brand || null)
    .input('status', sql.NVarChar, asset.status || 'Available')
    .input('assignedTo', sql.NVarChar, asset.assignedTo || null)
    .input('purchaseDate', sql.Date, asset.purchaseDate || null)
    .query(`
      INSERT INTO dbo.Assets (AssetCode, AssetName, Category, Brand, Status, AssignedTo, PurchaseDate)
      OUTPUT INSERTED.*
      VALUES (@assetCode, @assetName, @category, @brand, @status, @assignedTo, @purchaseDate)
    `)

  return result.recordset[0]
}

module.exports = { getAllAssets, findByAssetCode, createAsset }