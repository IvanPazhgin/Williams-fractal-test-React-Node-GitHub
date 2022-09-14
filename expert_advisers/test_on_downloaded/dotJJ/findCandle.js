// const input_parameters = require('../alex/input_parameters')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const readCandleFromJSON = require('../utils/readCandle')

function findCandle() {
  // загружаем свечки из файлов
  const input_parameters = {
    symbol: 'AVAXUSDT',
    year: '2021',
    market: 'spot',
  }
  const candles = readCandleFromJSON(input_parameters, '1h')

  let date = 0

  for (let i = 0; i < candles.length; i++) {
    if (
      //candles[i].open == 3.6034
      //candles[i].open == 64.57
      //candles[i].high == 64.96
      //candles[i].low == 64.17
      candles[i].close == 64.67
    ) {
      date = timestampToDateHuman(candles[i].startTime)
      break
    }
  }
  console.log(`date in ${input_parameters.year} = ${date}`)
}

module.exports = findCandle
