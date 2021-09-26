const { Router } = require('express')
const {
  getSimilarArtistsLastFM,
  getArtistById,
  getArtistsFromDB,
  setTopArtists
} = require('../controllers/artistsController')

const router = Router()

router.get('/artists', getArtistsFromDB)

router.get('/artists/set', setTopArtists)

router.get('/artists/:id', getArtistById)

router.get('/artists/:id/similar', getSimilarArtistsLastFM)

module.exports = router
