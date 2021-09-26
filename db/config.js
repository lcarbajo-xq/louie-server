const mongoose = require('mongoose')

const dbConnection = async () => {
  console.log('[DEBUG] Establishing connection with DB')
  try {
    await mongoose.connect(process.env.DB_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('DB Connected')
  } catch (error) {
    throw new Error('Error while initializing the DB: ' + error)
  }
}

module.exports = { dbConnection }
