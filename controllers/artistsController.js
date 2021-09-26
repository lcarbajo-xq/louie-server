const axios = require('axios')
const ArtistModel = require('../models/artist')

const { getArtistImageFromSpotify } = require('../helpers/spotify')

const {
  getArtistData,
  seacrhSimilarArtistsLastFM
} = require('../helpers/lastfm')

const { LASTFM_API_KEY } = process.env

async function randomArtists(req, res) {
  return await ArtistModel.random(req.query.total)
}

async function getArtistsFromDB(req, res) {
  const skip = req.query.skip || 0
  const limit = req.query.limit || 20

  res.status(200).json({
    artists: await ArtistModel.find()
      .sort(req.query.sort || '-created_at')
      .skip(skip)
      .limit(limit),
    total: await ArtistModel.countDocuments(),
    query: {
      skip,
      limit
    }
  })
}

async function setTopArtists(req, res) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=spain&api_key=${LASTFM_API_KEY}&format=json`
  const response = await axios.get(url)
  const { topartists } = response.data

  const artistMapped = await Promise.all(
    topartists.artist.map(async (artist) => {
      let image = []
      const { name } = artist
      if (name) {
        image = await getArtistImageFromSpotify(name, 'artist')
      }
      const artistData = await getArtistData(artist)
      const artistModeled = {
        name,
        hash: artistData.hash || '',
        image,
        tags: artistData?.tags || [],
        similar: artistData?.similar || [],
        bio: artistData?.bio || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await ArtistModel.findOrCreate(artistModeled)
      return artistModeled
    })
  )
  res.status(200).json(artistMapped)
}

async function getArtistById(req, res) {
  const { id } = req.params
  const artist = await ArtistModel.findById(id)
  res.status(200).json(artist)
}

async function getSimilarArtistsLastFM(req, res) {
  console.log('hola')
  const { id } = req.params
  const similarArtists = await seacrhSimilarArtistsLastFM(id)
  res.status(200).json(similarArtists)
}

module.exports = {
  getArtistsFromDB,
  setTopArtists,
  randomArtists,
  getArtistById,
  getSimilarArtistsLastFM
}
