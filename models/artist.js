const { createHash } = require('crypto')
const { Schema, model } = require('mongoose')

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
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
  similar: {
    type: [String]
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

ArtistSchema.static('findOrCreate', async function (artist) {
  const hash = createHash('md5')
    .update(artist.name.toLowerCase().replace(/ /g, '_').trim())
    .digest('hex')
  let artistExist = await this.findOne({ hash })
  if (!artistExist) {
    artistExist = await this.create({ ...artist, hash })
    console.log('Dont Exist')
  }
  return artist
})

ArtistSchema.static('random', async function (size = 5) {
  return this.aggregate([{ $sample: { size } }])
})

module.exports = model('ArtistModel', ArtistSchema)
