const { sendInfoToUser } = require('../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')
const { symbols2h38, timeFrames, nameStrategy } = require('./symbols')

function alexNoticeMain() {
  // запускаем 3.8 на 2h
  const alex38Notice2h = require('./alex38Notice2h/alex38Notice2h')
  alex38Notice2h()

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

  const message2 = '\n\nВторая стратегия...'

  sendInfoToUser(message0 + message1 + message2)
} // function alexNoticeMain()

module.exports = alexNoticeMain
