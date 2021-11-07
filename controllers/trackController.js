import mime from 'mime'

import { TrackModel } from '../models/track.js'
import { createReadStream, statSync } from 'fs'
import mongoose from 'mongoose'

// import { fileURLToPath } from 'url'

// const { LASTFM_API_KEY } = process.env

async function getRandomTracks(req, res) {
  try {
    const tracks = await TrackModel.random(req.query.total)

    res.status(200).json({
      tracks,
      total: tracks.length,
      ok: true
    })
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err,
      endpoint: 'random tracks'
    })
  }
}

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
  const sort = req.query.sort || 'name'

  try {
    const tracksDB = await TrackModel.find()
      .populate('album')
      .sort(sort)
      .skip(skip)
      .limit(limit)
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
    console.log('ERROR EN TRACKMODEL')
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

async function playTrackById(req, res) {
  const id = mongoose.Types.ObjectId(req.params.id)
  const track = await TrackModel.findById(id)
  if (!track) {
    throw new Error('Failed to load track metadata')
  }

  if (track.path.toString().endsWith('.flac') && req.query.transcode) {
    // track.path = await transcode(track as any, {output: { type: "mp3" }
    // });
  }

  const stat = statSync(track.path)

  const total = stat.size

  if (req.headers.range) {
    const range = req.headers.range
    const parts = range.replace(/bytes=/, '').split('-')
    const partialstart = parseInt(parts[0], 10)
    const partialend = parseInt(parts[1], 10)

    const start = partialstart
    const end = partialend || total - 1
    const chunksize = end - start + 1

    res.status = 206
    res.headers = {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': mime.getType(track.path) || 'audio/mp3'
    }

    return createReadStream(track.path, { start, end }).pipe(res)
  } else {
    res.status(200)
    res.headers = {
      'Content-Type': mime.getType(track.path) || 'audio/mp3',
      'Accept-Ranges': 'bytes',
      'Content-Length': stat.size
    }

    return createReadStream(track.path).pipe(res)
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

export { getTracksfromDB, getRandomTracks, playTrackById }
