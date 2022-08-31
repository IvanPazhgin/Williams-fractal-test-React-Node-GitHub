const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://80.249.150.229:9200',
  auth: {
    username: 'elastic',
    password: 'Aru11nsgLKcYPYKgaWoS',
  },
})

async function elasticPut() {
  const response = await client.info()
  console.log(response)
}

module.exports = elasticPut
