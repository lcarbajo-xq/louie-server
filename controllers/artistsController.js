import axios from 'axios'
import { ArtistModel } from '../models/artist.js'

import { seacrhSimilarArtistsLastFM } from '../helpers/lastfm.js'
import { parseNewArtist } from '../helpers/dbHelpers.js'
import { AlbumModel } from '../models/album.js'

const { LASTFM_API_KEY } = process.env

async function randomArtists(req, res) {
  return await ArtistModel.random(req.query.total)
}

async function getArtistsFromDB(req, res) {
  const skip = req.query.skip ? parseInt(req.query.skip) : 0
  const limit = req.query.limit ? parseInt(req.query.limit) : 20
  const sort = req.query.sort || 'hash'

  const artists = await ArtistModel.find().sort(sort).skip(skip).limit(limit)

  try {
    res.status(200).json({
      artists,
      total: artists.length,
      query: {
        skip,
        limit
      }
    })
  } catch (err) {
    res.status(404).json({
      error: err,
      query: {
        skip,
        limit
      }
    })
  }
}

async function setTopArtists(req, res) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=spain&api_key=${LASTFM_API_KEY}&format=json`
  const response = await axios.get(url)
  const { topartists } = response.data

  const artistMapped = await Promise.all(
    topartists.artist.map(async (artist) => {
      const parsedArtist = await parseNewArtist(artist)
      await ArtistModel.findOrCreate(parsedArtist)
      return parsedArtist
    })
  )
  res.status(200).json(artistMapped)
}

async function getArtistById(req, res) {
  const { id } = req.params
  const artist = await ArtistModel.findById(id)
  const albums = await AlbumModel.find({ artist: id })
  artist.albums = albums
  res.status(200).json({ artist, albums, totalAlbums: albums.length })
}

async function getSimilarArtistsLastFM(req, res) {
  console.log('hola')
  const { id } = req.params
  const similarArtists = await seacrhSimilarArtistsLastFM(id)
  res.status(200).json(similarArtists)
}

export {
  getArtistsFromDB,
  setTopArtists,
  randomArtists,
  getArtistById,
  getSimilarArtistsLastFM
}
