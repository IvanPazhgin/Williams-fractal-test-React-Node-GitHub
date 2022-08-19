const getCandles = require('../../API/binance.engine/usdm/getCandles.5param')
const candlesToObject = require('./candlesToObject')
// const diffCandle = require("../../common.func/diffCandle")
const config = require('config')
const limitSeniorTrend = config.get('limitSeniorTrend') || 1000

// получаем текущую свечку "старшего ТФ", разворачиваем ее на 1m, чтобы внутри текущей свечки не пропустить момент выхода из сделки по TP/SL
// !!! если 1d/1m, то необходимы доработки (см. комментарии внутри кода)
async function candlesInside(currentCandle, symbol, timeFrame) {
  const diffTime =
    (currentCandle.closeTime - currentCandle.openTime) / 1000 / 60 // кол-во минутных свечек внутри currentCandle
  // let candlesInsideFull = []
  if (diffTime < 1000) {
    try {
      const candlesInside = await getCandles(
        symbol,
        timeFrame,
        currentCandle.openTime,
        currentCandle.closeTime,
        limitSeniorTrend
      )
      // candlesInsideFull = candlesInsideFull.concat(candlesInside) // пригодится для случая 1d/1m, т.к. в 1000 1m свечей входит до 16 часов
      //const objectCandlesInside = candlesToObject(candlesInsideFull)
      const objectCandlesInside = candlesToObject(candlesInside)
      // console.log(`кол-во 1m свечей = ${objectCandlesInside.length}`)
      return objectCandlesInside
    } catch (err) {
      console.error('get Account Trade List error: ', err)
    }
  } else {
    console.log(
      `кол-во 1m свечек внутри currentCandle более 1000. Разработай функцию diffCandle`
    )
    // смотри пример функции ниже, из которого надо удалить let dateFirst = Date.parse(date1)
    // const arrayOf1kPeriod = diffCandle(currentCandle.openTime, currentCandle.closeTime, timeFrame)
    // так же пригодится часть из файла mainAlex
  }
}

module.exports = candlesInside
