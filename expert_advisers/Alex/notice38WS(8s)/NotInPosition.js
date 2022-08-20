const candlesToObject = require('../../common.func/candlesToObject')
const findSygnal = require('./findSignal')
const getCandles = require('../../../API/binance.engine/usdm/getCandles.3param')
// const timestampToDateHuman = require('../../common.func/timestampToDateHuman') // временно для проверки свечей

async function notInPosition(lastCandle, symbolObj, timeFrame) {
  // console.log('новая свечка из WS (передана в notInPosition)')
  // console.table(lastCandle)

  const limitOfCandle = 3 // кол-во свечей для поиска сигнала
  let candles = await getCandles(symbolObj.symbol, timeFrame, limitOfCandle) // получаем первые 5 свечей

  // let qq = new Date().getTime()
  // console.log(`время получения 5 свечей: ${timestampToDateHuman(qq)}`)

  let candlesObject = candlesToObject(candles)
  // console.table(candlesObject)

  // заменяем последнюю свечку по примеру кода Толи
  if (
    candlesObject.map(({ openTime }) => openTime).includes(lastCandle.openTime)
  ) {
    // console.log('время последних свечей совпадает')
    const delLastCandle = candlesObject.pop() // удаляем незавршенную свечку
    // console.log('убираем последнюю свечку')
    // console.table(delLastCandle)
  } else {
    console.log('время последних свечей НЕ совпадает')
  }

  // далее добавляем последнюю свечку из WS
  /*
  candlesObject.push({
    openTime,
    openPrice,
    closePrice,
    lowPrice,
    highPrice,
    volume,
  })
  */

  candlesObject = candlesObject.concat(lastCandle)
  //let q1q = new Date().getTime()
  //console.log(`время добавления свечи в массив: ${timestampToDateHuman(q1q)}`)
  console.log('+1 замененная свеча в массиве:')
  console.table(candlesObject)

  // поиск сигнала
  // запускаем функцию по поиску сигнала
  // проверка условий на вход
  // если входим, то inPosition = true
  symbolObj = findSygnal(candlesObject, symbolObj)
  return symbolObj

  // return candlesObject
  // по факту надо возвращать состояние сделки и параметры входа
}

module.exports = notInPosition
