const express = require('express')
const {
  listAssets,
  createNewAsset,
  getOneAsset,
  updateExistingAsset,
  deleteExistingAsset,
} = require('../controllers/assetController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(requireAuth)

router.get('/', listAssets)
router.post('/', createNewAsset)
router.get('/:id', getOneAsset)
router.put('/:id', updateExistingAsset)
router.delete('/:id', deleteExistingAsset)

module.exports = router