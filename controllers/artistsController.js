const axios = require('axios')
const { getArtistData } = require('../helpers/lastfm')
const { getArtistImageFromSpotify } = require('../helpers/spotify')

const { LASTFM_API_KEY } = process.env

async function getArtists(req, res) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=france&api_key=${LASTFM_API_KEY}&format=json`
  const response = await axios.get(url)
  const { topartists } = response.data

  const artistMapped = await Promise.all(
    topartists.artist.map(async (artist) => {
      let image = []
      const { name } = artist
      if (name) {
        image = await getArtistImageFromSpotify(name)
      }
      const artistData = await getArtistData(artist)
      return {
        name,
        // hash: artist.mbid,
        image,
        tags: artistData?.tags || [],
        similar: artistData?.similar || [],
        bio: artistData?.bio || '',
        created_at: new Date(),
        updated_at: new Date()
      }
    })
  )
  res.status(200).json(artistMapped)
}

module.exports = { getArtists }
