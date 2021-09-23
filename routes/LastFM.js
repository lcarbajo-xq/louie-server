const { Router } = require('express')
const { getArtists } = require('../controllers/artistsController')

const router = Router()

router.get('/artists', getArtists)

module.exports = router
