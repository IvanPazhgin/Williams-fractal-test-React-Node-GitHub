const elasticClient = require('./elastic.init')

async function elasticGet() {
  const response = await elasticClient.get({
    index: 'candles',
  })
  console.log(`получили свечи из elastic search`)
  console.log(response)
}

module.exports = elasticGet
