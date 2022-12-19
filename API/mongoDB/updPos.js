const mongoClient = require('./mongoDB.init')

async function updateCountPosition(
  nameOfCollection = 'users',
  newValues
  // apiOptions,
) {
  const collection = mongoClient.db().collection(nameOfCollection)
  const users = await collection.find({}).toArray()
  // const myquery = users[0][apiOptions.name].countOfPosition
  // console.log('myquery', myquery)

  // console.log('users', users[0])
  // console.log('newValues', newValues)
  await collection.updateOne(users[0], newValues)
}
module.exports = updateCountPosition
