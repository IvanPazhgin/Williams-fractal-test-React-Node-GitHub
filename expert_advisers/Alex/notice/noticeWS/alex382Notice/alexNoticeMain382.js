const {
  sendInfo382ToUser,
} = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const {
  symbols2h38,
  //symbols15m38,
  timeFrames,
  nameStrategy,
} = require('./symbols')

function alexNoticeMain382() {
  // запускаем 3.8.2 на 2h
  const alex38Notice2h = require('./alex38Notice2h')
  alex38Notice2h()

  // запускаем 3.8.2 на 15m
  //const alex38Notice15m = require('./alex38Notice15m')
  //alex38Notice15m()

  // формирование сообщений в телеграм
  const message0 = `Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}`

  const message1 = `\n\n${nameStrategy.notice2h382}\nНа ${
    symbols2h38.length
  } монетах: ${JSON.stringify(
    symbols2h38
  )}\nПоиск сигнала и перенос TPSL на ТФ: ${
    timeFrames.timeFrame2h
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

  //sendInfo382ToUser(message0 + message1 + message2)
  sendInfo382ToUser(message0 + message1)
} // function alexNoticeMain()

module.exports = alexNoticeMain382
