import { getArtistData, getAlbumData } from './lastfm.js'
import { getArtistImageFromSpotify } from './spotify.js'
import { ArtistModel } from '../models/artist.js'

async function parseNewArtist(artist) {
  let image = []
  const { name } = artist
  if (name) {
    image = await getArtistImageFromSpotify(name, 'artist')
  }
  const artistData = await getArtistData(artist)
  return {
    name,
    image,
    tags: artistData?.tags || [],
    similar: artistData?.similar || [],
    bio: artistData?.bio || '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

async function parseNewAlbum(album) {
  const { name, artist } = album
  if (name !== '(null)') {
    const albumData = await getAlbumData(album)

    const artistExist = await ArtistModel.findOrCreate(
      await parseNewArtist(artist)
    )
    return {
      name,
      artist: artistExist._id,
      image: albumData?.image,
      tags: albumData?.tags || [],
      bio: albumData?.bio || '',
      tracks: albumData?.tracks || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      listeners: albumData?.listeners
    }
  }
}

export { parseNewArtist, parseNewAlbum }