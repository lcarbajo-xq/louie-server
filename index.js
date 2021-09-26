const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { dbConnection } = require('./db/config')

const artists = require('./routes/artists')
const discogs = require('./routes/discogs')
const albums = require('./routes/albums')

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

app.listen(process.env.PORT || '3000')

console.log(`Server Running on port ${process.env.PORT}`)
