const {
  symbols4h41Part1,
  symbols4h41Part2,
  timeFrames,
  nameStrategy,
  options,
} = require('./input_parameters')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const an43Logic1h = require('./an43Logic1h')
const an43Logic30m = require('./an43Logic30m')

async function an43Launch() {
  /*
  // подключаем библиотеки для теста DEMA
  const demaCalc = require('../../../../indicators/dema')
  const getCandles = require('../../../../../API/binance.engine/usdm/getCandles.3param')
  const candlesToObject = require('../../../../common.func/candlesToObject')

  // подготавливаем данные для индикатора dema
  const demaPeriod = 9
  const candlesForDema = candlesToObject(
    await getCandles('BTCUSDT', '1h', demaPeriod)
  )
  const indicators = demaCalc(candlesForDema, demaPeriod)
  console.log('indicators: ', indicators)

  return
  */

  // запуск основного приложения
  // 1h
  an43Logic1h(
    symbols4h41Part1, // часть 1
    timeFrames.timeFrame1h,
    nameStrategy.notice1h41,
    options.takeProfitConst1h,
    options.stopLossConst1h,
    options.shiftTime1h
  )

  an43Logic1h(
    symbols4h41Part2, // часть 2
    timeFrames.timeFrame1h,
    nameStrategy.notice1h41,
    options.takeProfitConst1h,
    options.stopLossConst1h,
    options.shiftTime1h
  )

  // 30m
  an43Logic30m(
    symbols4h41Part1, // часть 1
    timeFrames.timeFrame30m,
    nameStrategy.notice30m41,
    options.takeProfitConst30m,
    options.stopLossConst30m,
    options.shiftTime30m
  )

  an43Logic30m(
    symbols4h41Part2, // часть 1
    timeFrames.timeFrame30m,
    nameStrategy.notice30m41,
    options.takeProfitConst30m,
    options.stopLossConst30m,
    options.shiftTime30m
  )

  // формирование сообщений в телеграм
  const message0 = `--== Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )} ==--`

  // 1h
  const message1hPart1 = `\n\n${nameStrategy.notice1h41} на ${symbols4h41Part1.length} монетах`
  const message1hPart2 = `\n${nameStrategy.notice1h41} на ${symbols4h41Part2.length} монетах`

  // 30m
  const message30mPart1 = `\n\n${nameStrategy.notice30m41} на ${symbols4h41Part1.length} монетах`
  const message30mPart2 = `\n${nameStrategy.notice30m41} на ${symbols4h41Part2.length} монетах`

  sendInfoToUser(
    message0 +
      message1hPart1 +
      message1hPart2 +
      message30mPart1 +
      message30mPart2
  )
}

module.exports = an43Launch
