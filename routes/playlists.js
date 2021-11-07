import Router from 'express'
import {
  getPlaylistsFromDB,
  getRandomPlaylists
} from '../controllers/playlistsController.js'
import { getPlaylistsFromSpotify } from '../helpers/spotify.js'

const router = Router()

router.get('/playlists/set', getPlaylistsFromSpotify)
router.get('/playlists/random', getRandomPlaylists)
router.get('/playlists', getPlaylistsFromDB)
export default router
