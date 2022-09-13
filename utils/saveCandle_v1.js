const fs = require('fs')
const getCandles = require('../API/binance.engine/usdm/getCandles.5param')
const candlesToObject = require('../expert_advisers/common.func/candlesToObject')
const diffCandle = require('../expert_advisers/common.func/diffCandle')

// инструция https://attacomsian.com/blog/nodejs-read-write-json-files
async function saveCandleToJSON() {
  const year = '2022'
  // параметры для скачивания свечей
  const symbol = 'AVAXUSDT'
  const interval = '4h'
  const intervalArray = ['4h', '2h', '1h', '30m', '15m', '1m'] // прописать запрос свечей в цикле
  const dateStart = year + '-01-01T00:00:00.000'
  const dateFinish = year + '-10-01T00:00:00.000'
  const limit = 1000

  // подготовка имени файла
  // const pathDir = './downloaded_candles/' // перенёс папку из dropBox, убрал из .gitignore
  const pathDir = require('./settings')
  const fileName = symbol + '_' + year + '_usdm_' + interval + '.json'
  const outPutName = pathDir + fileName

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
      console.log(`File is written successfully!`)
    }
  })
}

module.exports = saveCandleToJSON
