const axios = require('axios')

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env

const basic = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString('base64')

async function getAccessToken() {
  const { data } = await axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      grant_type: 'client_credentials'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`
    }
  })
  return data.access_token
}

async function getArtistImageFromSpotify(query) {
  const accessToken = await getAccessToken()
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=artist`
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return data.artists.items[0].images || []
}

module.exports = { getArtistImageFromSpotify }
