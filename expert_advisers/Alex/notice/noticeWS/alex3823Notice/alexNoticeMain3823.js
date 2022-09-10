const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const { symbols30m3823, timeFrames, nameStrategy } = require('./symbols')

function alexNoticeMain3823() {
  // запускаем 3.8.2.3 на 30m
  const al3823Not30m = require('./al3823Not30m')
  al3823Not30m()

  // запускаем 3.8.2.2 на 15m
  //const alex38Notice15m = require('./alex38Notice15m')
  //alex38Notice15m()

  // формирование сообщений в телеграм
  const message0 = `Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}`

  const message1 = `\n\n${nameStrategy.notice30m3823}\nНа ${
    symbols30m3823.length
  } монетах: ${JSON.stringify(
    symbols30m3823
  )}\nПоиск сигнала и перенос TPSL на ТФ: ${
    timeFrames.timeFrame30m
  }\nПоиск точки входа и выхода на ТФ: ${timeFrames.timeFrame1m}`

  /*
  const message2 = `\n\n${nameStrategy.notice15m382}\nНа ${
    symbols15m38.length
  } монетах: ${JSON.stringify(
    symbols15m38
  )}\nПоиск сигнала и перенос TPSL на ТФ: ${
    timeFrames.timeFrame15m
  }\nПоиск точки входа и выхода на ТФ: ${timeFrames.timeFrame1m}`
  */

  //sendInfoToUser(message0 + message1 + message2)
  sendInfoToUser(message0 + message1)
} // function alexNoticeMain()

module.exports = alexNoticeMain3823
