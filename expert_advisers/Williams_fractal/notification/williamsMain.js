const { sendInfoToUserWilliams } = require('../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const { symbolsWilliams, timeFrames, nameStrategy } = require('./symbols')

function williamsMain() {
  // запускаем на 2h
  const williamsLogic = require('./williamsLogic')
  williamsLogic()

  // запускаем 3.8.2.5 на 15m
  //const alex38Notice15m = require('./alex38Notice15m')
  //alex38Notice15m()

  // формирование сообщений в телеграм
  const message0 = `Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}`

  const message1 = `\n\n---=== ${nameStrategy.williams} ===---\nНа ${
    symbolsWilliams.length
  } монетах: ${JSON.stringify(
    symbolsWilliams
  )}\nПоиск сигнала и перенос TPSL на ТФ: ${
    timeFrames.timeFrame2h
  }\nПоиск точки входа и выхода на ТФ: ${timeFrames.timeFrame5m}`

  /*
  const message2 = `\n\n${nameStrategy.notice15m382}\nНа ${
    symbols15m38.length
  } монетах: ${JSON.stringify(
    symbols15m38
  )}\nПоиск сигнала и перенос TPSL на ТФ: ${
    timeFrames.timeFrame15m
  }\nПоиск точки входа и выхода на ТФ: ${timeFrames.timeFrame1m}`
  */

  //sendInfoToUserWilliams(message0 + message1 + message2)
  sendInfoToUserWilliams(message0 + message1)
} // function williamsMain()

module.exports = williamsMain
