const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const {
  symbols2h384,
  //symbols15m384,
  timeFrames,
  nameStrategy,
} = require('./symbols')

function alexNoticeMain384() {
  // запускаем 3.8.4 на 2h
  const alex384Notice2h = require('./al384Not2h')
  alex384Notice2h()

  // запускаем 3.8.4 на 15m
  //const alex384Notice15m = require('./al384Not15m')
  //alex384Notice15m()

  // формирование сообщений в телеграм
  const message0 = `Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}`

  const message1 = `\n\n${nameStrategy.notice2h384}\nНа ${
    symbols2h384.length
  } монетах: ${JSON.stringify(
    symbols2h384
  )}\nПоиск сигнала и перенос TPSL на ТФ: ${
    timeFrames.timeFrame2h
  }\nПоиск точки входа и выхода на ТФ: ${timeFrames.timeFrame1m}`

  /*
  const message2 = `\n\n${nameStrategy.notice15m384}\nНа ${
    symbols15m384.length
  } монетах: ${JSON.stringify(
    symbols15m384
  )}\nПоиск сигнала и перенос TPSL на ТФ: ${
    timeFrames.timeFrame15m
  }\nПоиск точки входа и выхода на ТФ: ${timeFrames.timeFrame1m}`
  */

  // sendInfoToUser(message0 + message1 + message2)
  sendInfoToUser(message0 + message1)
} // function alexNoticeMain384()

module.exports = alexNoticeMain384
