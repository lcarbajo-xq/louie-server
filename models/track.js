import mongoose from 'mongoose'

const { Schema, model } = mongoose

const TrackSchema = new Schema({
  name: {
    type: String
  },
  artists: {
    type: [Schema.Types.ObjectId],
    ref: 'ArtistModel'
  },
  artist: {
    type: String
  },
  // playlist: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'PlaylistModel'
  // },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'AlbumModel'
  },
  genre: {
    type: Schema.Types.ObjectId,
    ref: 'GenreModel'
  },
  path: { type: String },
  plays: { type: Number },
  duration: { type: Number },
  liked: { type: Boolean },
  last_pl: { type: Date },
  year: { type: Number },
  number: { type: Number },
  lossles: { type: Boolean },
  updatedAt: { type: Date },
  createdAt: { type: Date }
})

TrackSchema.static('findOrCreate', async function (track) {
  let trackExists = await this.findOne({ name: track.name, album: track.album })

  if (!trackExists) {
    trackExists = await this.create(track)
  }

  // return trackExists
})

export const TrackModel = model('TrackModel', TrackSchema)
