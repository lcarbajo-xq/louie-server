const express = require('express')
const cors = require('cors')
const via = require('@wellenline/via')
require('dotenv').config()

const hello = require('./routes/Hello')
const lastfm = require('./routes/LastFM')

// Initialize

const app = express()

// // Midddlewares

app.use(cors())

// Routes

app.use(hello)
app.use(lastfm)

app.listen(process.env.PORT === undefined && '3000')

console.log(`Server Running on port ${process.env.PORT}`)
