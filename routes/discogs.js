import Router from 'express'
import {
  getRequestToken,
  getAccessToken,
  getLabelById,
  getLabelReleases
} from '../controllers/discogsAuthController.js'
const router = Router()

router.get('/discogs/authorize', getRequestToken)

router.get('/discogs/callback', getAccessToken)

router.get('/discogs/label/:id', getLabelById)

router.get('/discogs/label/:id/releases', getLabelReleases)

export default router
