const {
  sendInfo382ToUser,
} = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const {
  symbols2h3825,
  //symbols15m38,
  timeFrames,
  nameStrategy,
} = require('./symbols')

function alexNoticeMain3825() {
  // запускаем 3.8.2.5 на 2h
  const al3825Not2h = require('./al3825Not2h')
  al3825Not2h()

  // запускаем 3.8.2.5 на 15m
  //const alex38Notice15m = require('./alex38Notice15m')
  //alex38Notice15m()

  // формирование сообщений в телеграм
  const message0 = `Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}`

  const message1 = `\n\n${nameStrategy.notice2h3825}\nНа ${
    symbols2h3825.length
  } монетах: ${JSON.stringify(
    symbols2h3825
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

module.exports = alexNoticeMain3825
