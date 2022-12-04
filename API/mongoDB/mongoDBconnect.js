const mongoClient = require('./mongoDB.init')

async function startMongoDB() {
  try {
    await mongoClient.connect()
    console.log('Connected to mongoDB')
  } catch (error) {
    console.error(error)
  }
}

module.exports = startMongoDB
