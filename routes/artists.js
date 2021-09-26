const { Router } = require('express')
const {
  getSimilarArtistsLastFM,
  getArtistById,
  getArtistsFromDB
} = require('../controllers/artistsController')

const router = Router()

router.get('/artists', getArtistsFromDB)

router.get('/artists/:id', getArtistById)

router.get('/artists/:id/similar', getSimilarArtistsLastFM)

module.exports = router
