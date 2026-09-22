const { getAllAssets, findByAssetCode, createAsset } = require('../services/assetService')

const VALID_STATUSES = ['Available', 'Assigned', 'Maintenance']

async function listAssets(req, res) {
  try {
    const assets = await getAllAssets()
    res.status(200).json({
      success: true,
      message: 'Assets retrieved successfully',
      data: assets,
    })
  } catch (err) {
    console.error('List assets error:', err.message)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

async function createNewAsset(req, res) {
  try {
    const { assetCode, assetName, category, brand, status, assignedTo, purchaseDate } = req.body

    if (!assetCode || !assetName) {
      return res.status(400).json({
        success: false,
        message: 'Asset code and asset name are required',
      })
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      })
    }

    const existing = await findByAssetCode(assetCode)
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Asset code "${assetCode}" is already in use`,
      })
    }

    const newAsset = await createAsset({
      assetCode,
      assetName,
      category,
      brand,
      status,
      assignedTo,
      purchaseDate,
    })

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: newAsset,
    })
  } catch (err) {
    console.error('Create asset error:', err.message)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

module.exports = { listAssets, createNewAsset }