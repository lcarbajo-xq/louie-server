import { AlbumModel } from '../models/album.js'
import { ArtistModel } from '../models/artist.js'
import { PlaylistModel } from '../models/playlist.js'
import { TrackModel } from '../models/track.js'

async function getItemsFromDB(req, res) {
  const searchResults = {
    albums: [],
    artists: [],
    tracks: [],
    playlists: []
  }
  try {
    searchResults.tracks = await TrackModel.find({
      $or: [
        {
          name: {
            $regex: req.query.search,
            $options: 'i'
          }
        },
        {
          artist: {
            $regex: req.query.search,
            $options: 'i'
          }
        }
      ]
    }).populate('album genre artists')
    searchResults.albums = await AlbumModel.find({
      name: {
        $regex: req.query.search,
        $options: 'i'
      }
    }).populate('artist')

    searchResults.artists = await ArtistModel.find({
      name: {
        $regex: req.query.search,
        $options: 'i'
      }
    })

    searchResults.playlists = await PlaylistModel.find({
      name: {
        $regex: req.query.search,
        $options: 'i'
      }
    })

    res.status(200).json({
      results: searchResults,
      total: {
        artists: searchResults.artists.length,
        albums: searchResults.albums.length,
        playlists: searchResults.playlists.length,
        tracks: searchResults.tracks.length
      },
      ok: true,
      query: req.query
    })
  } catch (err) {
    console.log('ERROR EN SEARCH')
    res.status(404).json({
      ok: false,
      error: err,
      query: req.query
    })
  }
}

export { getItemsFromDB }
