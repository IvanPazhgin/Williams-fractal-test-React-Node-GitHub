const fs = require('fs')

function readCandleFromJSON(symbol, year, interval) {
  const pathDir = require('./settings')
  const fileName = symbol + '_' + year + '_usdm_' + interval + '.json'
  const inPutName = pathDir + fileName

  let databases = []
  try {
    const data = fs.readFileSync(inPutName, 'utf8')

    databases = JSON.parse(data) // parse JSON string to JSON object
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`)
  }

  return databases
}

module.exports = readCandleFromJSON
