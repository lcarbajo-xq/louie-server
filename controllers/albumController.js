import axios from 'axios'
import { parseNewAlbum } from '../helpers/dbHelpers.js'
import { existsSync, readFileSync } from 'fs'
import { AlbumModel } from '../models/album.js'

const { LASTFM_API_KEY } = process.env

async function getRandomAlbums(req, res) {
  try {
    const albums = await AlbumModel.random(req.query.total)

    res.status(200).json({
      albums,
      total: albums.length,
      ok: true
    })
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err,
      endpoint: 'random albums'
    })
  }
}

async function getAlbumArt(req, res) {
  const id = req.params.id
  const image = existsSync(`${process.env.CACHE_PATH}/album-art/${id}`)
    ? readFileSync(`${process.env.CACHE_PATH}/album-art/${id}`)
    : readFileSync('./assets/placeholder.png')
  res.type('image/png').send(image)
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
  const skip = req.query.skip ? parseInt(req.query.skip) : 0
  const limit = req.query.limit ? parseInt(req.query.limit) : 20
  const sort = req.query.sort || 'hash'

  const albumsonDB = await AlbumModel.find()
    .populate('artist')
    .sort(sort)
    .skip(skip)
    .limit(limit)
  try {
    res.status(200).json({
      albums: albumsonDB,
      total: albumsonDB.length,
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

async function getAlbumById(req, res) {
  const { id } = req.params
  const album = await AlbumModel.findById(id).populate('artist')
  // const albums = await AlbumModel.find({ artist: id })
  // artist.albums = albums
  res.status(200).json({ album })
}

async function getAlbumsFromArtist(req, res) {
  const { artistId } = req.params
  const { skip = 20, limit = 20, sort = '-created-at' } = req.query

  const query = { artist: artistId }

  try {
    const albums = await AlbumModel.find(query)
      .populate('artist')
      .sort(sort)
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      albums,
      total: albums.length,
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

export {
  setTopAlbums,
  getAlbumsFromDB,
  getAlbumsFromArtist,
  getRandomAlbums,
  getAlbumArt,
  getAlbumById
}
