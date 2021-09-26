const { Router } = require('express')
const {
  getRequestToken,
  getAccessToken,
  getLabelById,
  getLabelReleases
} = require('../controllers/discogsAuthController')
const router = Router()

router.get('/discogs/authorize', getRequestToken)

router.get('/discogs/callback', getAccessToken)

router.get('/discogs/label/:id', getLabelById)

router.get('/discogs/label/:id/releases', getLabelReleases)

module.exports = router
