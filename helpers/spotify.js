import axios from 'axios'

async function getAccessToken() {
  try {
    const expr = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    const basic = Buffer.from(expr).toString('base64')
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
    const { data } = await axios({
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basic}`
      }
    })
    return data.access_token
  } catch (err) {
    console.log(err)
  }
}

async function getArtistImageFromSpotify(query, type) {
  const accessToken = await getAccessToken()
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=${type}`
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return data.artists.items[0].images.map((image) => image.url) || []
}

async function getPlaylistsFromSpotify() {
  try {
    const accessToken = await getAccessToken()
    const url = 'https://api.spotify.com/v1/me/playlists'
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return data
  } catch (err) {
    console.log(err)
  }
}

async function getUserData(id) {
  try {
    const accessToken = await getAccessToken()
    const url = `https://api.spotify.com/v1/users/${id}`
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return data
  } catch (err) {
    console.log(err)
  }
}

async function getTracksFromPlaylist(id) {
  try {
    const accessToken = await getAccessToken()
    const url = `https://api.spotify.com/v1/playlists/${id}`
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return data
  } catch (err) {
    console.log(err)
  }
}

export {
  getArtistImageFromSpotify,
  getTracksFromPlaylist,
  getPlaylistsFromSpotify,
  getUserData
}
