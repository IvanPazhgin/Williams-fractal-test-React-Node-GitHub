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
  console.log(`кол-во свечей = ${candles.length}`)

  // let date = 0

  let summVolume = 0 // накапливаем сумму объемов
  let countCandles = 0 // считаем кол-во свечей
  let averageVolume = 0

  let volumeOfDotLow = 0 // объем на лое
  let volumeOfDotSpring = 0 // объем на Spring
  let volumeOfDotJJ = 0 // объем на JJ

  for (let i = 0; i < candles.length; i++) {
    summVolume += candles[i].volume
    countCandles++

    if (candles[i].startTime == 1632139200000) {
      volumeOfDotLow = candles[i].volume
      console.log(`позиция volumeOfDotLow = ${i}`)
    }

    if (candles[i].startTime == 1632182400000) {
      volumeOfDotSpring = candles[i].volume
      console.log(`позиция volumeOfDotSpring = ${i}`)
    }

    if (candles[i].startTime == 1632258000000) {
      volumeOfDotJJ = candles[i].volume
      console.log(`позиция volumeOfDotJJ = ${i}`)
    }

    /*
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
    */
  }
  //console.log(`date in ${input_parameters.year} = ${date}`)
  averageVolume = summVolume / countCandles
  console.log(
    `\nsummVolume = ${summVolume}, countCandles = ${countCandles}, averageVolume = ${averageVolume}`
  )

  if (volumeOfDotLow > averageVolume) {
    console.log(
      `\nvol of low > average Volume в ${volumeOfDotLow / averageVolume} раз`
    )
  } else console.log(`vol of low < average Volume`)

  if (volumeOfDotSpring > averageVolume) {
    console.log(
      `vol of Spring > average Volume в ${
        volumeOfDotSpring / averageVolume
      } раз`
    )
  } else console.log(`vol of Spring < average Volume`)

  if (volumeOfDotJJ > averageVolume) {
    console.log(
      `volume Of DotJJ > average Volume в ${volumeOfDotJJ / averageVolume} раз`
    )
  } else console.log(`volume Of DotJJ < average Volume`)
}

module.exports = findCandle
