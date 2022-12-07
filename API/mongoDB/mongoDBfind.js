const mongoClient = require('./mongoDB.init')

async function mongoDBfind(
  nameOfCollection = 'Williams'
  // toFind = { symbol: 'BTC' }
) {
  const collection = mongoClient.db().collection(nameOfCollection) // выносим коллекцию в переменную

  // const oneDeal = await collection.findOne(toFind) // получаем информацию
  // console.log('oneDeal', oneDeal)

  const allDeals = await collection.find({}).toArray()
  // console.log('allDeals', allDeals)
  return allDeals
}

module.exports = mongoDBfind
