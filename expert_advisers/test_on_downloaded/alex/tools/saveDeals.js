const fs = require('fs')

function saveDeals(deals, options) {
  const { pathDirForDeals } = require('../../paths')
  const fileName =
    options.nameStrategy +
    '_' +
    options.symbol +
    '_' +
    options.year +
    '_' +
    options.interval +
    '_' +
    options.comment +
    '.json'
  const outPutName = pathDirForDeals + fileName

  // pretty-print JSON object to string
  const data = JSON.stringify(deals, null, 2)

  // write file to disk
  fs.writeFile(outPutName, data, 'utf8', (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`)
    } else {
      console.log(`${fileName} is written successfully!`)
    }
  })
}

module.exports = saveDeals
