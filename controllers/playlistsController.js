import mongoose from 'mongoose'
import { parseNewPlaylist } from '../helpers/dbHelpers.js'
import {
  getPlaylistsFromSpotify,
  getTracksFromPlaylist,
  getUserData
} from '../helpers/spotify.js'
import { PlaylistModel } from '../models/playlist.js'

async function getRandomPlaylists(req, res) {
  try {
    const playlists = await PlaylistModel.random(req.query.total)

    res.status(200).json({
      playlists,
      total: playlists.length,
      ok: true
    })
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err,
      endpoint: 'random playlists'
    })
  }
}

async function setPlaylistFromSpotifyToDatabase(req, res) {
  const { items } = await getPlaylistsFromSpotify()
  try {
    const playlistsMapped = await Promise.all(
      items.map(async (item) => {
        const parsePlaylist = await parseNewPlaylist(item)
        const playlistonDB = await PlaylistModel.findOrCreate(parsePlaylist)
        return playlistonDB
      })
    )
    res.status(200).json({ ok: true, playlists: playlistsMapped })
  } catch (error) {
    res.status(400).json({ ok: false, error })
  }
}

async function getPlaylistsFromDB(req, res) {
  const skip = req.query.skip ? parseInt(req.query.skip) : 0
  const limit = req.query.limit ? parseInt(req.query.limit) : 20
  const sort = req.query.sort || 'createdAt'

  try {
    const playlistOnDB = await PlaylistModel.find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
    res.status(200).json({
      playlists: playlistOnDB,
      total: playlistOnDB.length,
      query: {
        skip,
        limit,
        sort
      }
    })
  } catch (err) {
    res.status(404).json({
      ok: false,
      error: err,
      query: {
        skip,
        limit
      }
    })
  }
}

async function getPlaylistFromId(req, res) {
  const id = mongoose.Types.ObjectId(req.params.id)
  const playlist = await PlaylistModel.findById(id)
  const user = await getUserData(playlist.author.id)
  const tracks = await getTracksFromPlaylist(playlist.spotify_id)

  const tracksMapped = tracks.tracks.items.map((item) => {
    const { track } = item
    return {
      _id: track.id,
      artist: track.artists[0].name,
      album: {
        image: track.album?.images[0]?.url || '',
        name: [track.album.name]
      },
      name: track.name,
      duration: track.duration_ms
    }
  })
  try {
    res.status(200).json({
      playlist,
      authorImages: user.images,
      tracks: tracksMapped,
      total: tracks.tracks.total
    })
  } catch (error) {}
}

export {
  setPlaylistFromSpotifyToDatabase,
  getRandomPlaylists,
  getPlaylistsFromDB,
  getPlaylistFromId
}
