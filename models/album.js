import mongoose from 'mongoose'
import { createHash } from 'crypto'
import { writeFileSync } from 'fs'

const { Schema, model } = mongoose

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'ArtistModel'
  },
  label: {
    type: Schema.Types.ObjectId,
    ref: 'LabelModel'
  },
  image: {
    type: [String]
  },
  tags: {
    type: [String]
  },
  bio: {
    type: String
  },
  year: {
    type: Number
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  }
})

AlbumSchema.statics.random = async function (querySize = 10) {
  const size = parseInt(querySize)
  try {
    const results = await this.aggregate([
      { $sample: { size } },
      {
        $lookup: {
          from: 'artistmodels',
          localField: 'artist',
          foreignField: '_id',
          as: 'artist'
        }
      },
      { $unwind: { path: '$artist' } }
    ])
    return results
  } catch (error) {
    console.log(error)
  }
}

AlbumSchema.statics.findOrCreate = async function (album) {
  let albumExists = await this.findOne({ name: album.name })

  if (!albumExists) {
    const hash = await createHash('md5')
      .update(`${album?.artist?.name || ''}-${album.name}`)
      .digest('hex')
    if (album.image && typeof album.image === 'object') {
      writeFileSync(
        `${process.env.CACHE_PATH}/album-art/${hash}.png`,
        album.image
      )
      album.image = `/albums/art/${hash}.png`
    }
    albumExists = await this.create({ ...album, hash })
  }
  return albumExists
}

export const AlbumModel = model('AlbumModel', AlbumSchema)
