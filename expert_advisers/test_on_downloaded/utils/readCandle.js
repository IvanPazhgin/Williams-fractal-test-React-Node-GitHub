const fs = require('fs')
const { pathDirForCandles } = require('../common.files/paths')

function readCandleFromJSON(input_parameters, interval) {
  const symbolDir =
    pathDirForCandles +
    input_parameters.symbol +
    '_' +
    input_parameters.year +
    '_' +
    input_parameters.market +
    '/'

  const fileName =
    input_parameters.symbol +
    '_' +
    input_parameters.year +
    '_' +
    input_parameters.market +
    '_' +
    interval +
    '.json'
  //const inPutName = pathDirForCandles + fileName
  const inPutName = symbolDir + fileName

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
