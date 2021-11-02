import { AlbumModel } from '../models/album'
import { ArtistModel } from '../models/artist'
import { TrackModel } from '../models/track'

async function getItemsFromDB(req, res) {
  const results = {
    albums: [],
    artists: [],
    tracks: []
  }
  try {
    results.tracks = await TrackModel.find({
      $or: [
        {
          name: {
            $regex: req.query,
            $options: 'i'
          }
        },
        {
          artist: {
            $regex: req.query,
            $options: 'i'
          }
        }
      ]
    }).populate('album genre artists')
    results.albums = await AlbumModel.find({
      name: {
        $regex: req.query,
        $options: 'i'
      }
    }).populate('artist')

    results.artists = await ArtistModel.find({
      name: {
        $regex: req.query,
        $options: 'i'
      }
    })
    res.status(200).json({
      results,
      total: {
        artists: results.artists.length,
        albums: results.albums.length,
        tracks: results.tracks.length
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
