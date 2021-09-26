const axios = require('axios')

const { LASTFM_API_KEY } = process.env

async function getAlbumData({ name, artist }) {
  const url = `http://ws.audioscrobbler.com/2.0/?method=album.getInfo&artist=${encodeURIComponent(
    artist.name
  )}&album=${encodeURIComponent(
    name
    // .replace(/'/g, '')
  )}&api_key=${LASTFM_API_KEY}&format=json`
  try {
    if (LASTFM_API_KEY) {
      const { data } = await axios.get(url)

      if (data.album) {
        // const albumArtist = await getArtistData(artist)
        return {
          tracks: data.album.tracks,
          image: data.album.image.map((i) => i['#text']),
          tags: data.album.tags?.tag?.name
            ? data.album.tags?.tag?.name
            : data.album.tags?.tag?.map((tag) => tag.name) || [],
          bio:
            data.album.wiki?.content?.replace(/(&nbsp;|<([^>]+)>)/gi, '') ||
            'Add album bio',
          listeners: data.album?.listeners || 0
        }
      }
    }
  } catch (err) {
    console.log('[ALBUM error]: ALBUM' + err + ' - ' + url)
  }
}

async function getArtistData({ name }) {
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
    name
  )}&api_key=${LASTFM_API_KEY}&format=json`
  try {
    if (LASTFM_API_KEY) {
      const { data } = await axios.get(url)

      if (data.artist) {
        return {
          name: data.artist.name,
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

async function seacrhSimilarArtistsLastFM(id) {
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&mbid=${encodeURIComponent(
    id
  )}&api_key=${LASTFM_API_KEY}&format=json`
  const { data } = await axios.get(url)
  return data
}

module.exports = { getArtistData, getAlbumData, seacrhSimilarArtistsLastFM }
