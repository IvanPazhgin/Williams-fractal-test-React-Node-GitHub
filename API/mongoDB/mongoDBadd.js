const mongoClient = require('./mongoDB.init')

async function mongoDBadd(
  nameOfCollection = 'allDeals',
  deal = { symbol: 'BTC', interval: '1h' }
  // deal = { symbol: 'BTC', interval: '1D', description: 'первое вхождение' }
) {
  // await mongoClient.db().createCollection(nameOfCollection) // создаем коллекцию

  const collection = mongoClient.db().collection(nameOfCollection) // выносим коллекцию в переменную
  await collection.insertOne(deal) // добавляем одну сделку в БД
}

module.exports = mongoDBadd
