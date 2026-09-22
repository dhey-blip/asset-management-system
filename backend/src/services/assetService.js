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

async function getAssetById(id) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM dbo.Assets WHERE Id = @id')

  return result.recordset[0]
}

async function findByAssetCodeExcludingId(assetCode, id) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('assetCode', sql.NVarChar, assetCode)
    .input('id', sql.Int, id)
    .query('SELECT Id FROM dbo.Assets WHERE AssetCode = @assetCode AND Id != @id')

  return result.recordset[0]
}

async function updateAsset(id, asset) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('assetCode', sql.NVarChar, asset.assetCode)
    .input('assetName', sql.NVarChar, asset.assetName)
    .input('category', sql.NVarChar, asset.category || null)
    .input('brand', sql.NVarChar, asset.brand || null)
    .input('status', sql.NVarChar, asset.status || 'Available')
    .input('assignedTo', sql.NVarChar, asset.assignedTo || null)
    .input('purchaseDate', sql.Date, asset.purchaseDate || null)
    .query(`
      UPDATE dbo.Assets
      SET AssetCode = @assetCode,
          AssetName = @assetName,
          Category = @category,
          Brand = @brand,
          Status = @status,
          AssignedTo = @assignedTo,
          PurchaseDate = @purchaseDate,
          UpdatedAt = SYSUTCDATETIME()
      OUTPUT INSERTED.*
      WHERE Id = @id
    `)

  return result.recordset[0]
}

async function deleteAsset(id) {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query('DELETE FROM dbo.Assets WHERE Id = @id')

  return result.rowsAffected[0] > 0
}

module.exports = {
  getAllAssets,
  findByAssetCode,
  createAsset,
  getAssetById,
  findByAssetCodeExcludingId,
  updateAsset,
  deleteAsset,
}