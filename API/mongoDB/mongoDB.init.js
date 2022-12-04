const { MongoClient } = require('mongodb')

require('dotenv').config({ path: __dirname + '/./../../config/.env' })
const mongoUri = process.env.mongoUri

const mongoClient = new MongoClient(mongoUri)

module.exports = mongoClient
