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

function getAccessDataFromDiscogs() {
  return accessDataFromDiscogs
}

async function getLabelInfo(req, res) {
  const accessData = getAccessDataFromDiscogs()
  const labelID = req.params.id
  const db = new Discogs(accessData).database()
  db.getLabel(labelID, function (err, data) {
    if (!err) {
      res.status(200).json(data)
    } else {
      console.log(err)
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
  getLabelInfo,
  getAccessDataFromDiscogs
}
