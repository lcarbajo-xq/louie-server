import mongoose from 'mongoose'

const { Schema, model } = mongoose

const ScanSchema = new Schema({
  start: { type: Date },

  end: { type: Date },

  last_scan: { type: Date },

  seconds: { type: Number },

  tracks: { type: Number },

  albums: { type: Number },

  artists: { type: Number },

  size: { type: Number },

  mount: { type: String }
})

export const ScanModel = model('ScanModel', ScanSchema)
