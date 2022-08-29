const candlesToObject = require('../../../common.func/candlesToObject')
const getCandles = require('../../../../API/binance.engine/usdm/getCandles.3param')
const findSygnal37 = require('./findSignal37')
const findSygnal38 = require('./findSignal38')
const findSygnal39 = require('./findSignal39')
// const timestampToDateHuman = require('../../common.func/timestampToDateHuman') // временно для проверки свечей

async function notInPosition(lastCandle, symbolObj, timeFrame) {
  const limitOfCandle = 4 // кол-во свечей для поиска сигнала
  let candles = await getCandles(symbolObj.symbol, timeFrame, limitOfCandle) // получаем первые n свечей

  let candlesObject = candlesToObject(candles) // преобрзауем массив свечей в объект

  // заменяем последнюю свечку по примеру кода Толи
  if (
    candlesObject.map(({ openTime }) => openTime).includes(lastCandle.openTime)
  ) {
    // console.log('время последних свечей совпадает')
    const delLastCandle = candlesObject.pop() // для начала удаляем незавршенную свечку
    // console.log('убираем последнюю свечку')
    // console.table(delLastCandle)
  } else {
    console.log('время последних свечей НЕ совпадает')
  }

  // далее добавляем последнюю свечку из WS
  candlesObject = candlesObject.concat(lastCandle)

  // запускаем функции по поиску сигналов, в которых проверяем условиям на вход. Если входим, то inPosition = true
  // поиск сигнала исходя по приоритету стратегий
  /*
  if (!symbolObj.inPosition || !symbolObj.canShort) {
    symbolObj = findSygnal37(candlesObject, symbolObj)
  }
  */

  if (!symbolObj.inPosition && !symbolObj.canShort) {
    symbolObj = findSygnal38(candlesObject, symbolObj)
  }

  if (!symbolObj.inPosition && !symbolObj.canShort) {
    symbolObj = findSygnal39(candlesObject, symbolObj)
  }

  return symbolObj // возвращаем состояние сделки и параметры входа
}

module.exports = notInPosition
