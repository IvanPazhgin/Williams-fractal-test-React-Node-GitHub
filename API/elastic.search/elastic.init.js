const { Client } = require('@elastic/elasticsearch')
const elasticClient = new Client({
  node: 'http://80.249.150.229:9200',
  auth: {
    username: 'elastic',
    password: 'Aru11nsgLKcYPYKgaWoS',
  },
})

module.exports = elasticClient
