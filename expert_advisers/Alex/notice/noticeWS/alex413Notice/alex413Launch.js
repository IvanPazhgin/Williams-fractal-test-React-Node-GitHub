const {
  symbols4h41,
  timeFrames,
  nameStrategy,
  options,
} = require('./input_parameters413')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const alex413Main4h = require('./alex413Main4h')
const alex413Main1h = require('./alex413Main1h')
const demaCalc = require('../../../../indicators/dema')
const getCandles = require('../../../../../API/binance.engine/usdm/getCandles.3param')
const candlesToObject = require('../../../../common.func/candlesToObject')

async function alex413Launch() {
  /*
  // подготавливаем данные для индикатора dema
  const demaPeriod = 9
  const candlesForDema = candlesToObject(
    await getCandles('BTCUSDT', '2h', demaPeriod)
  )
  const indicators = demaCalc(candlesForDema, demaPeriod)
  console.log('indicators: ', indicators)

  return
  */

  // запуск основного приложения
  // 4h
  alex413Main4h(
    timeFrames.timeFrame4h,
    nameStrategy.notice4h41,
    options.takeProfitConst4h,
    options.stopLossConst4h,
    options.shiftTime4h
  )

  // 1h
  alex413Main1h(
    timeFrames.timeFrame1h,
    nameStrategy.notice1h41,
    options.takeProfitConst1h,
    options.stopLossConst1h,
    options.shiftTime1h
  )

  // 30m
  alex413Main1h(
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

  // 4h
  const message4h41 = `\n\n${nameStrategy.notice4h41}\nНа ${symbols4h41.length} монетах\nПоиск сигнала и перенос TPSL на ТФ: ${timeFrames.timeFrame4h}\nПоиск точки входа и выхода на ТФ: ${timeFrames.timeFrame1m}`

  // 1h
  const message1h41 = `\n\n${nameStrategy.notice1h41}\nНа ${symbols4h41.length} монетах\nПоиск сигнала и перенос TPSL на ТФ: ${timeFrames.timeFrame1h}\nПоиск точки входа и выхода на ТФ: ${timeFrames.timeFrame1m}`

  // 30m
  const message30m41 = `\n\n${nameStrategy.notice30m41}\nНа ${symbols4h41.length} монетах\nПоиск сигнала и перенос TPSL на ТФ: ${timeFrames.timeFrame30m}\nПоиск точки входа и выхода на ТФ: ${timeFrames.timeFrame1m}`

  sendInfoToUser(message0 + message4h41 + message1h41 + message30m41)
}

module.exports = alex413Launch
