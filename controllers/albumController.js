const axios = require('axios')
const { getAlbumData } = require('../helpers/lastfm')
// const { getArtistImageFromSpotify } = require('../helpers/spotify')
const AlbumModel = require('../models/album')

const { LASTFM_API_KEY } = process.env

async function setTopAlbums(req, res) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=osees&api_key=${LASTFM_API_KEY}&format=json`
  console.log(url)
  const response = await axios.get(url)
  const { topalbums } = response.data

  const albumsMapped = await Promise.all(
    topalbums.album.map(async (album) => {
      const { name } = album
      //   if (name) {
      //     image = await getArtistImageFromSpotify(name, 'album')
      //   }
      const albumData = name !== '(null)' && (await getAlbumData(album))
      const albumModeled = {
        name,
        hash: albumData?.hash || '',
        image: albumData?.image || [],
        // artist: albumData?.artist,
        tags: albumData?.tags || [],
        bio: albumData?.bio || '',
        tracks: albumData?.tracks || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        listeners: albumData?.listeners
      }
      await AlbumModel.findOrCreate(albumModeled)
      return albumModeled
    })
  )
  res.status(200).json(albumsMapped)
}

module.exports = { setTopAlbums }
