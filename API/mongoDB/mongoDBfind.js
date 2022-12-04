const mongoClient = require('./mongoDB.init')

async function mongoDBfind(
  nameOfCollection = 'deals412',
  toFind = { symbol: 'BTC' }
) {
  const collection = mongoClient.db().collection(nameOfCollection) // выносим коллекцию в переменную
  const deal = await collection.findOne(toFind) // получаем информацию
  console.log('deal', deal)
}

module.exports = mongoDBfind
