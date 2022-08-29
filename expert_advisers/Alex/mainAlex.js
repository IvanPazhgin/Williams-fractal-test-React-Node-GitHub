const config = require('config')
const candlesToObject = require('../common.func/candlesToObject')
const diffCandle = require('../common.func/diffCandle')
const getCandles = require('../../API/binance.engine/usdm/getCandles.5param')
const timestampToDateHuman = require('../common.func/timestampToDateHuman')
// const alex37testMain = require('./alex37test/alex37testMain')
// const tradeAlex1 = require('./tradeAlex1.3')
// const tradeAlex2 = require('./tradeAlex2')
// const tradeAlex33 = require('./tradeAlex3.3')
// const tradeAlex34 = require('./tradeAlex3.4')
const tradeAlex35 = require('./tradeAlex3.5') // тестер стратегии 3.5
// const alex37testMainMod = require('./alex37testMod/alex37testMainMod')
// const alex37testMain2 = require('../../backup/Alex/AlexTest/alex37test/alex37testMain2')
const alex37test3 = require('./test/alex37test/alex37test3')
// const alex38test = require('./alex38test/alex38test')
const alex39test = require('./test/alex39test/alex39test')
const alex38test2 = require('./test/alex38test/alex38test2')
const alex38test10g = require('./test/alex38test/alex38test10g')
const alex38test2h = require('./test/alex38test/alex38test2h')
// const tradeAlex4 = require('./tradeAlex4')
// const bookTickerFunc = require('./bookOfSymbol')

const limitSeniorTrend = config.get('limitSeniorTrend') || 1000

async function startAlex(
  symbol,
  timeFrame,
  dateStart,
  dateFinish,
  deposit,
  partOfDeposit,
  multiplier,
  diffVolumeUser,
  takeProfit,
  stopLoss,
  diffShadow35big, // стратегия 3.5
  diffShadow35small, // стратегия 3.5
  delta // стратегия 3.7
) {
  // const bookOfSymbol = bookTickerFunc()
  const startProgramAt = timestampToDateHuman(new Date().getTime()) // для расчета времени работы приложения

  const arrayOf1kPeriod = diffCandle(dateStart, dateFinish, timeFrame)
  let candlesSeniorFull = []

  try {
    for (let i = 0; i < arrayOf1kPeriod.length; i++) {
      const candlesSenior = await getCandles(
        symbol,
        timeFrame,
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
    /*
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
    */

    // name: без теневая 3.7
    /*
    const [deals37, statistics37] = alex37testMain(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit,
      stopLoss,
      diffShadow35big,
      diffShadow35small,
      delta
    )
    */

    // name: без теневая 3.7 mod
    //const [deals37, statistics37] = await alex37testMainMod(
    //const [deals37, statistics37] = await alex37testMain2(
    // !!!! const [deals37, statistics37] = await alex37test3(
    //const [deals37, statistics37] = alex38test10g(
    const [deals37, statistics37] = alex38test2h(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit,
      stopLoss,
      diffShadow35big,
      diffShadow35small,
      delta,
      symbol
    )

    const [deals38, statistics38] = alex38test2(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit,
      stopLoss,
      diffShadow35big,
      diffShadow35small,
      delta,
      symbol
    )

    const [deals39, statistics39] = await alex39test(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit,
      stopLoss,
      symbol
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
      /*
      deals35,
      statistics35,
      */
      deals37,
      statistics37,
      deals38,
      statistics38,
      deals39,
      statistics39,
      // deals4,
      // statistics4,
      startProgramAt,
    }
  } catch (err) {
    console.error('get Account Trade List error: ', err)
  }
}

module.exports = startAlex
