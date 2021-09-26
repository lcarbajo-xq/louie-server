const { Router } = require('express')
const {
  setTopAlbums,
  getAlbumsFromArtist
} = require('../controllers/albumController')

const router = Router()

router.get('/albums/set', setTopAlbums)

router.get('/albums/artist/:artistId', getAlbumsFromArtist)

// router.get('/artists/:id', getArtistById)

// router.get('/artists/:id/similar', getSimilarArtistsLastFM)

module.exports = router
