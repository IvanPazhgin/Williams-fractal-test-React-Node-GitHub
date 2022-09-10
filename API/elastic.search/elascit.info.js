const elasticClient = require('./elastic.init')

async function elasticInfo() {
  const response = await elasticClient.info()
  console.log(response)
}

module.exports = elasticInfo
