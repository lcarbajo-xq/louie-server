import mongoose from 'mongoose'

const { Schema, model } = mongoose

const PlaylistSchema = new Schema({
  name: {
    type: String
  },
  images: {
    type: [String]
  },
  url: {
    type: String
  },
  description: {
    type: String
  },
  collaborative: {
    type: Boolean
  },
  private: {
    type: Boolean
  },
  tracks_url: {
    type: String
  },
  author: {
    id: { type: String },
    name: { type: String }
  },
  spotify_id: {
    type: String
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
})

PlaylistSchema.static('findOrCreate', async function (playlist) {
  let playlistExists = await this.findOne({ name: playlist.name })

  if (!playlistExists) {
    // if (album.image && typeof album.image === 'object') {
    //   writeFileSync(
    //     `${process.env.CACHE_PATH}/album-art/${hash}.png`,
    //     album.image
    //   )
    //   album.image = `/albums/art/${hash}.png`
    // }
    playlistExists = await this.create(playlist)
  }
  return playlistExists
})

PlaylistSchema.static('random', async function (querySize = 20) {
  const size = parseInt(querySize)
  try {
    const results = await this.aggregate([{ $sample: { size } }])
    return results
  } catch (err) {
    console.log(err)
  }
})

export const PlaylistModel = model('PlaylistModel', PlaylistSchema)
