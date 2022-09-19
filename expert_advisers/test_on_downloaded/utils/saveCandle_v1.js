const fs = require('fs')
const getCandles = require('../../../API/binance.engine/usdm/getCandles.5param')
const candlesToObject = require('../../common.func/candlesToObject')
const diffCandle = require('../../common.func/diffCandle')
const { pathDirForCandles } = require('../common.files/paths')

// инструция https://attacomsian.com/blog/nodejs-read-write-json-files
async function saveCandleToJSONoneInterval() {
  const year1 = '2021'
  const year2 = '2022'
  // параметры для скачивания свечей
  const symbol = 'AVAXUSDT'
  const interval = '1h'
  const dateStart = year1 + '-01-01T00:00:00.000'
  const dateFinish = year2 + '-01-01T00:00:00.000'
  const limit = 1000
  const market = 'usdm'
  //const market = 'spot'

  // подготовка имени файла
  const fileName =
    symbol + '_' + year1 + '_' + market + '_' + interval + '.json'
  const outPutName = pathDirForCandles + fileName

  // запрашиваем свечки на бирже
  const arrayOf1kPeriod = diffCandle(dateStart, dateFinish, interval)
  const n = arrayOf1kPeriod.length

  let candlesFull = [] // полный массив всех свечек за весь период

  try {
    for (let i = 0; i < n; i++) {
      console.log(`ждем свечи за период ${i + 1} из ${n}`)
      const candles = await getCandles(
        symbol,
        interval,
        arrayOf1kPeriod[i].dateFirst,
        arrayOf1kPeriod[i].dateSecond,
        limit
      )
      candlesFull = candlesFull.concat(candles)
    }
  } catch (err) {
    console.error('get Account Trade List error: ', err)
  }

  const objectCandles = candlesToObject(candlesFull)
  // console.log(`получили ${objectCandles.length} свечей`)

  // convert JSON object to a string
  // const data = JSON.stringify(objectCandles)

  // pretty-print JSON object to string
  const data = JSON.stringify(objectCandles, null, 2)

  // write file to disk
  fs.writeFile(outPutName, data, 'utf8', (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`)
    } else {
      console.log(`${fileName} is written successfully!`)
    }
  })
}

module.exports = saveCandleToJSONoneInterval
