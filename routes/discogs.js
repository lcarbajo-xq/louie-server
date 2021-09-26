const { Router } = require('express')
const {
  getRequestToken,
  getAccessToken,
  getLabelInfo
} = require('../controllers/discogsAuthController')
const router = Router()

router.get('/discogs/authorize', getRequestToken)

router.get('/discogs/callback', getAccessToken)

router.get('/discogs/label/:id', getLabelInfo)

module.exports = router
