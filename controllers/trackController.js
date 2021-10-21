import axios from 'axios'
import { parseNewAlbum } from '../helpers/dbHelpers.js'

import { TrackModel } from '../models/track.js'

const { LASTFM_API_KEY } = process.env

// async function randomAlbums(req, res) {
//   return await AlbumModel.random(req.query.total)
// }

// async function setTopAlbums(req, res) {
//   const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(
//     'Tame Impala'
//   )}&api_key=${LASTFM_API_KEY}&format=json`
//   try {
//     const response = await axios.get(url)
//     const { topalbums } = response.data

//     const albumsMapped = await Promise.all(
//       topalbums.album.map(async (album) => {
//         const albumModeled = await parseNewAlbum(album)
//         if (albumModeled) {
//           return await AlbumModel.findOrCreate(albumModeled)
//         }
//       })
//     )
//     res.status(200).json({
//       albums: albumsMapped,
//       total: albumsMapped.length,
//       ok: true
//     })
//   } catch (err) {
//     res.status(500).json(err + ' . ')
//   }
// }

async function getTracksfromDB(req, res) {
  const skip = req.query.skip ? parseInt(req.query.skip) : 0
  const limit = req.query.limit ? parseInt(req.query.limit) : 20
  const sort = req.query.sort || 'hash'

  const tracksDB = await TrackModel.find()
    .populate('album')
    .sort(sort)
    .skip(skip)
    .limit(limit)
  try {
    res.status(200).json({
      tracks: tracksDB,
      total: tracksDB.length,
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

// async function getAlbumsFromArtist(req, res) {
//   const { artistId } = req.params
//   const { skip = 20, limit = 20, sort = '-created-at' } = req.query

//   const query = { artist: artistId }

//   try {
//     const albums = await AlbumModel.find(query)
//       .populate('artist')
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)

//     res.status(200).json({
//       albums,
//       total: await AlbumModel.countDocuments(query),
//       query: {
//         ...query,
//         skip,
//         limit
//       }
//     })
//   } catch (err) {
//     res.status(404).json({
//       err,
//       query: {
//         ...query,
//         skip,
//         limit
//       }
//     })
//   }
// }

export { getTracksfromDB }
