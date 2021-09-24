const axios = require('axios')

const { LASTFM_API_KEY } = process.env

async function getArtistData(artist) {
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
    artist.name
  )}&api_key=${LASTFM_API_KEY}&format=json`
  try {
    if (LASTFM_API_KEY) {
      const { data } = await axios.get(url)

      if (data.artist) {
        return {
          tags: data.artist.tags.tag.map((tag) => tag.name),
          bio: data.artist.bio.summary.replace(/(&nbsp;|<([^>]+)>)/gi, ''),
          similar: data.artist.similar.artist.map((a) => a.name)
        }
      }
    }
  } catch (err) {
    console.log('[lastFM error]:', err)
  }
}

module.exports = { getArtistData }
