const axios = require('axios')
const { getArtistImageFromSpotify } = require('../helpers/getArtistImage')

async function getArtists(req, res) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=france&api_key=ea8ac249b3297be3fd9835fbdab301cf&format=json`
  const response = await axios.get(url)
  const { topartists } = response.data

  const artistMapped = await Promise.all(
    topartists.artist.map(async (artist) => {
      const { name } = artist
      if (name) {
        artist.image = await getArtistImageFromSpotify(name)
      }
      return artist
    })
  )
  res.status(200).json(artistMapped)
}

module.exports = { getArtists }
