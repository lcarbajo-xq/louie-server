const { Schema, model } = require('mongoose')

const LabelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: [String]
  },
  contact: {
    type: Object
  },
  wiki: {
    type: String
  },
  sublabels: {
    type: Schema.Types.ObjectId,
    ref: 'LabelModel'
  },
  releases: {
    type: ['AlbumModel'],
    ref: 'AlbumModel'
  }
})

module.exports = model(LabelSchema, 'LabelModel')
