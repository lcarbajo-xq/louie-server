import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { dbConnection } from './db/config.js'

import artists from './routes/artists.js'
import discogs from './routes/discogs.js'
import albums from './routes/albums.js'
import tracks from './routes/tracks.js'
import { watch } from './common/library.js'
dotenv.config()

// Initialize

const app = express()

// Midddlewares

app.use(cors())
// DB Connection

dbConnection()

// Routes

app.use(artists)
app.use(discogs)
app.use(albums)
app.use(tracks)

app.listen(process.env.PORT || '3000')

watch()

console.log(`Server Running on port ${process.env.PORT}`)
