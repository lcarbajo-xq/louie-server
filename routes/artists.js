import Router from 'express'
import {
  getSimilarArtistsLastFM,
  getArtistById,
  getArtistsFromDB,
  setTopArtists,
  getRandomArtists
} from '../controllers/artistsController.js'

const router = Router()

router.get('/artists', getArtistsFromDB)

router.get('/artists/random', getRandomArtists)

router.get('/artists/set', setTopArtists)

router.get('/artists/:id', getArtistById)

router.get('/artists/:id/similar', getSimilarArtistsLastFM)

export default router
