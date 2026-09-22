const express = require('express')
const { listAssets, createNewAsset } = require('../controllers/assetController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(requireAuth)

router.get('/', listAssets)
router.post('/', createNewAsset)

module.exports = router