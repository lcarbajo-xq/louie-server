import Router from 'express'
import { getTracksfromDB } from '../controllers/trackController.js'

const router = Router()

router.get('/tracks/', getTracksfromDB)

// router.get('/albums/set', setTopAlbums)

// router.get('/albums/artist/:artistId', getAlbumsFromArtist)

// router.get('/artists/:id', getArtistById)

// router.get('/artists/:id/similar', getSimilarArtistsLastFM)

export default router
