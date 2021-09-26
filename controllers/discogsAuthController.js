// const url = 'https://api.discogs.com'
const Discogs = require('disconnect').Client

const { DISCOGS_CONSUMER_KEY, DISCOGS_CONSUMER_SECRET } = process.env

let requestDataFromDiscogs = {}
let accessDataFromDiscogs = {
  method: 'oauth',
  level: 2,
  consumerKey: 'YYRgJKMBIgILJRngCCjy',
  consumerSecret: 'TMejiEqDvBlyXrfHZKkGmPiogQbZojjZ',
  token: 'EnpnKwabUCSqsRbLBOSwobhYyUQjWOhRgaLZWsTK',
  tokenSecret: 'lHmxfEXtYGXrXBrFJwRTPOVVPnUaAeDjWrRdfsaJ'
}
const db = new Discogs(accessDataFromDiscogs).database()

function getAccessDataFromDiscogs() {
  return accessDataFromDiscogs
}

async function getLabelById(req, res) {
  const { id: labelID } = req.params
  db.getLabel(labelID, function (err, data) {
    if (!err) {
      res.status(200).json({
        label: data,
        ok: true
      })
    } else {
      res.status(404).json({ err, ok: false })
    }
  })
}

async function getLabelReleases(req, res) {
  const { page = 0, items = 25 } = req.query
  const { id: labelId } = req.params
  db.getLabelReleases(labelId, { page, per_page: items }, function (err, data) {
    if (!err) {
      res.status(200).json({
        query: 'Releases for Label: ' + labelId,
        releases: data,
        ok: true
      })
    } else {
      res.status(404).json({ err, ok: false })
    }
  })
}

async function getRequestToken(req, res) {
  const oAuth = new Discogs().oauth()
  try {
    oAuth.getRequestToken(
      DISCOGS_CONSUMER_KEY,
      DISCOGS_CONSUMER_SECRET,
      'http://localhost:5000/discogs/callback',

      function (err, requestData) {
        if (err) console.log(err)
        else {
          requestDataFromDiscogs = requestData
          res.redirect(requestDataFromDiscogs.authorizeUrl)
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}

async function getAccessToken(req, res) {
  const oAuth = new Discogs(requestDataFromDiscogs).oauth()
  oAuth.getAccessToken(req.query.oauth_verifier, function (err, accessData) {
    if (err) console.log(err)
    else {
      accessDataFromDiscogs = accessData
      console.log(accessData)
      res.redirect('/')
    }
  })
}

module.exports = {
  getRequestToken,
  getAccessToken,
  getLabelById,
  getLabelReleases,
  getAccessDataFromDiscogs
}
