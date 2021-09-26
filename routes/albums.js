const { Router } = require('express')
const { setTopAlbums } = require('../controllers/albumController')

const router = Router()

router.get('/albums', setTopAlbums)

// router.get('/artists/:id', getArtistById)

// router.get('/artists/:id/similar', getSimilarArtistsLastFM)

module.exports = router
