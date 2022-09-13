const fs = require('fs')
const { pathDirForCandles } = require('../paths')

function readCandleFromJSON(input_parameters, interval) {
  const fileName =
    input_parameters.symbol +
    '_' +
    input_parameters.year +
    '_usdm_' +
    interval +
    '.json'
  const inPutName = pathDirForCandles + fileName

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
