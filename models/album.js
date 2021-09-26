const { createHash } = require('crypto')
const { Schema, model } = require('mongoose')

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

AlbumSchema.statics.findOrCreate = async function (album) {
  let albumExists = await this.findOne({ name: album.name })

  if (!albumExists) {
    const hash = await createHash('md5')
      .update(`${album?.artist?.name || ''}-${album.name}`)
      .digest('hex')
    albumExists = await this.create({ ...album, hash })
    console.log('Dont Exist')
  }
  return albumExists
}

module.exports = model('AlbumModel', AlbumSchema)
