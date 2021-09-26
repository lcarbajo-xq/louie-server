const axios = require('axios')
const { parseNewAlbum } = require('../helpers/dbHelpers')

const AlbumModel = require('../models/album')

const { LASTFM_API_KEY } = process.env

async function randomAlbums(req, res) {
  return await AlbumModel.random(req.query.total)
}

async function setTopAlbums(req, res) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(
    'Tame Impala'
  )}&api_key=${LASTFM_API_KEY}&format=json`
  try {
    const response = await axios.get(url)
    const { topalbums } = response.data

    const albumsMapped = await Promise.all(
      topalbums.album.map(async (album) => {
        const albumModeled = await parseNewAlbum(album)
        if (albumModeled) {
          return await AlbumModel.findOrCreate(albumModeled)
        }
      })
    )
    res.status(200).json({
      albums: albumsMapped,
      total: albumsMapped.length,
      ok: true
    })
  } catch (err) {
    res.status(500).json(err + ' . ')
  }
}

async function getAlbumsFromDB(req, res) {
  const { skip = 0, limit = 20, sort = '-created-at' } = req.query
  try {
    res.status(200).json({
      artists: await AlbumModel.find().sort(sort).skip(skip).limit(limit),
      total: await AlbumModel.countDocuments(),
      query: {
        skip,
        limit
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

async function getAlbumsFromArtist(req, res) {
  const { artistId } = req.params
  const { skip = 0, limit = 20, sort = '-created-at' } = req.query

  const query = { artist: artistId }

  try {
    const albums = await AlbumModel.find(query)
      .populate('artist')
      .sort(sort)
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      albums,
      total: await AlbumModel.countDocuments(query),
      query: {
        ...query,
        skip,
        limit
      }
    })
  } catch (err) {
    res.status(404).json({
      err,
      query: {
        ...query,
        skip,
        limit
      }
    })
  }
}

module.exports = {
  setTopAlbums,
  getAlbumsFromDB,
  getAlbumsFromArtist,
  randomAlbums
}
