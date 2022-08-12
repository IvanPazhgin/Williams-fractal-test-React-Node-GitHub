const config = require('config')
const candlesToObject = require('../Alex/candlesToObject')
const diffCandle = require('../Williams_fractal/diffCandle')
const getCandles = require('../Williams_fractal/getCandles')
const timestampToDateHuman = require('../Williams_fractal/timestampToDateHuman')
const alex37testMain = require('./alex37test/alex37testMain')
const tradeAlex1 = require('./tradeAlex1.3')
const tradeAlex2 = require('./tradeAlex2')
const tradeAlex33 = require('./tradeAlex3.3')
const tradeAlex34 = require('./tradeAlex3.4')
const tradeAlex35 = require('./tradeAlex3.5')
const tradeAlex4 = require('./tradeAlex4')
// const bookTickerFunc = require('./bookOfSymbol')

const limitSeniorTrend = config.get('limitSeniorTrend') || 1000

async function startAlex(
  symbol,
  TimeFrame,
  dateStart,
  dateFinish,
  deposit,
  partOfDeposit,
  multiplier,
  diffVolumeUser,
  takeProfit,
  stopLoss,
  diffShadow35big, // стратегия 3.5
  diffShadow35small // стратегия 3.5
) {
  // const bookOfSymbol = bookTickerFunc()
  const startProgramAt = timestampToDateHuman(new Date().getTime()) // для расчета времени работы приложения

  const arrayOf1kPeriod = diffCandle(dateStart, dateFinish, TimeFrame)
  let candlesSeniorFull = []

  try {
    for (let i = 0; i < arrayOf1kPeriod.length; i++) {
      const candlesSenior = await getCandles(
        symbol,
        TimeFrame,
        arrayOf1kPeriod[i].dateFirst,
        arrayOf1kPeriod[i].dateSecond,
        limitSeniorTrend
      )
      candlesSeniorFull = candlesSeniorFull.concat(candlesSenior)
    }

    const objectSenior = candlesToObject(candlesSeniorFull)

    /*
    // name: три красных
    const deals1 = tradeAlex1(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      diffVolumeUser,
      takeProfit
    )

    // name: требуются доработки
    const deals2 = tradeAlex2(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit
    )

    // name: без теневая 3.3
    const [deals33, statistics33] = tradeAlex33(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit,
      stopLoss
    )

    // name: без теневая 3.4
    const [deals34, statistics34] = tradeAlex34(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit,
      stopLoss
    )
    */

    // name: без теневая 3.5
    const [deals35, statistics35] = tradeAlex35(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit,
      stopLoss,
      diffShadow35big,
      diffShadow35small
    )

    // name: без теневая 3.7
    const [deals37, statistics37] = alex37testMain(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit,
      stopLoss,
      diffShadow35big,
      diffShadow35small
    )

    /*
    // name: часовик 4.0
    const [deals4, statistics4] = tradeAlex4(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit,
      stopLoss
    )
    */

    console.log(`программа завершена (ОК)`)

    return {
      /*
      deals1,
      deals2,
      deals33,
      statistics33,
      deals34,
      statistics34,
      */
      deals35,
      statistics35,
      deals37,
      statistics37,
      // deals4,
      // statistics4,
      startProgramAt,
    }
  } catch (err) {
    console.error('get Account Trade List error: ', err)
  }
}

module.exports = startAlex
