const fs = require('fs')

function readCandleFromJSON(symbol, year, interval) {
  const pathDir = require('./settings')
  const fileName = symbol + '_' + year + '_usdm_' + interval + '.json'
  const inPutName = pathDir + fileName

  let databases = []
  fs.readFile(inPutName, 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`)
    } else {
      // parse JSON string to JSON object
      databases = JSON.parse(data)

      // print all databases
      /*
      databases.forEach((db) => {
        console.log(`${db.name}: ${db.type}`)
      })
      */
      // console.table(databases)
    }
  })

  return databases
}

module.exports = readCandleFromJSON
