import Router from 'express'
import {
  getPlaylistFromId,
  getPlaylistsFromDB,
  getRandomPlaylists
} from '../controllers/playlistsController.js'
import { getPlaylistsFromSpotify } from '../helpers/spotify.js'

const router = Router()

router.get('/playlists/set', getPlaylistsFromSpotify)
router.get('/playlists/random', getRandomPlaylists)
router.get('/playlists', getPlaylistsFromDB)
router.get('/playlists/:id', getPlaylistFromId)
export default router
