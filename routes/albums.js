import Router from 'express'
import {
  setTopAlbums,
  getAlbumsFromArtist,
  getAlbumsFromDB,
  getAlbumArt,
  getRandomAlbums,
  getAlbumById
} from '../controllers/albumController.js'

const router = Router()

router.get('/albums/', getAlbumsFromDB)

router.get('/albums/random', getRandomAlbums)

router.get('/albums/:id', getAlbumById)

router.get('/albums/set', setTopAlbums)

router.get('/albums/artist/:artistId', getAlbumsFromArtist)

router.get('/albums/art/:id', getAlbumArt)

// router.get('/artists/:id', getArtistById)

// router.get('/artists/:id/similar', getSimilarArtistsLastFM)

export default router
