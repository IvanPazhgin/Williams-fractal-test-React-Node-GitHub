const getLastCandleSPOT4s = require('../../API/binance.engine/web.socket.spot/getLastCandle4s')

// ведётся посчет прибыли при прямой последовательности сделки.
// Поставить эксперимент с обратной последовательностью или вариант Short с учетом комиссии за шорт
async function arbitration() {
  // SPOT
  const symbols = ['BTCUSDT', 'ETHUSDT', 'ETHBTC']
  const timeFrame = '1m'
  const deposit = 1000
  const feeConst = 0.1 / 100
  let feeResult = 0

  let profit = 0 // профит с одной сделки
  let sumProfit = 0 // общая сумма прибыли

  let btcPrice = 0 // цена BTC
  let ethPrice = 0 // цена ETH
  let ethBtcPrice = 0 // цена ETH/BTC

  const startProgramAt = new Date().getTime() // для расчета времени работы приложения
  let nowTime = 0 // текущее время
  let diffTime = 0 // продолжительность работы приложения

  await getLastCandleSPOT4s(
    symbols,
    timeFrame,
    async ({
      symbol: symbol,
      startTime: openTime,
      open: openPrice,
      close: closePrice,
      low: lowPrice,
      high: highPrice,
      volume: volume,
      final: final,
    }) => {
      // сохраняем новую свечку
      lastCandle = {
        symbol: symbol,
        openTime: openTime,
        openPrice: openPrice,
        closePrice: closePrice,
        lowPrice: lowPrice,
        highPrice: highPrice,
        volume: volume,
        final: final,
      }
      //console.table(lastCandle)
      if (lastCandle.symbol == 'BTCUSDT') {
        btcPrice = lastCandle.closePrice
        //console.log(`BTC = ${btcPrice}`)
      }
      if (lastCandle.symbol == 'ETHUSDT') {
        ethPrice = lastCandle.closePrice
        //console.log(`ETH = ${ethPrice}`)
      }
      if (lastCandle.symbol == 'ETHBTC') {
        ethBtcPrice = lastCandle.closePrice
        //console.log(`ETHBTC = ${ethBtcPrice}`)
      }

      feeResult = (feeConst * deposit) / (btcPrice + ethPrice + ethBtcPrice)
      profit = deposit - (deposit / btcPrice / ethBtcPrice) * ethPrice
      if (profit > 0) {
        sumProfit += profit
        nowTime = new Date().getTime()
        diffTime = nowTime - startProgramAt

        const message1 = `profit = ${profit} USD, summ Profit = ${+sumProfit.toFixed(
          2
        )} USD, прошло ${diffTime / 1000} секунд (${+(
          diffTime /
          1000 /
          60
        ).toFixed(2)} минут). `
        const message2 = `fee = ${feeResult} USD`
        console.log(message1 + message2)
      }
    }
  )
}

module.exports = arbitration

/*
вариант схемы:
1. цена цифрового рубля за фиат на p2p
2. на спотовом рынке продажем ЦР в BTC...
*/
