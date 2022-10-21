const { Client } = require('@elastic/elasticsearch')
require('dotenv').config({ path: __dirname + '/./../../config/.env' })
const elasticClient = new Client({
  node: process.env.nodeES,
  auth: {
    username: process.env.elasticLogin,
    password: process.env.elasticPswd,
  },
})

module.exports = elasticClient
