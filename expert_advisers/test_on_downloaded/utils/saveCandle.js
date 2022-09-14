const fs = require('fs')
const getCandles = require('../../../API/binance.engine/usdm/getCandles.5param')
const candlesToObject = require('../../common.func/candlesToObject')
const diffCandle = require('../../common.func/diffCandle')
const { intervalArray } = require('../alex/misc/intervals')
const { pathDirForCandles } = require('../paths')

// инструция https://attacomsian.com/blog/nodejs-read-write-json-files
async function saveCandleToJSON() {
  // переменные параметры
  const year1 = '2021'
  const year2 = '2022'
  const symbol = 'ETHUSDT'

  // постоянные параметры для скачивания свечей
  const dateStart = year1 + '-01-01T00:00:00.000'
  const dateFinish = year2 + '-01-01T00:00:00.000'
  const limit = 1000
  const market = 'usdm'
  //const market = 'spot'

  // в цикле загружаем свечи по всем интервалам
  intervalArray.forEach(async (interval) => {
    // подготовка имени файла
    //const pathDir = require('./settings')
    const fileName =
      symbol + '_' + year1 + '_' + market + '_' + interval + '.json'
    // const outPutName = pathDir + fileName
    const outPutName = pathDirForCandles + fileName

    // расчет количества периодов для каждого интервала
    const arrayOf1kPeriod = diffCandle(dateStart, dateFinish, interval)
    const n = arrayOf1kPeriod.length

    let candlesFull = [] // полный массив всех свечек за весь период

    // запрашиваем свечки на бирже
    try {
      for (let i = 0; i < n; i++) {
        console.log(`${interval}: ждем свечи за период ${i + 1} из ${n}`)
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
    console.log(
      `Интервал: ${interval}: получили ${objectCandles.length} свечей`
    )

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
  })
}

module.exports = saveCandleToJSON
