const { sendInfoToUser } = require('../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')
const {
  symbols38,
  symbols38hard2h,
  symbols38hard4h,
  timeFrames,
} = require('./symbols')

function alexNoticeMain() {
  const nameStrategy382h = 'Стратегия №3.8.2: Без теневая 2h'
  const alex38Notice2h = require('./alex38Notice2h/alex38Notice2h')
  alex38Notice2h() // запускаем 3.8 на 2h

  const nameStrategy38hard2h = 'Стратегия №3.8: Без теневая HARD 2h'
  const alex38Notice2hHard = require('./alex38Notice2hHard/alex38Notice2hHard')
  //alex38Notice2hHard(symbols38hard2h) // запускаем 3.8 HARD на 2h

  const nameStrategy38hard4h = 'Стратегия №3.8: Без теневая HARD 4h'
  const alex38Notice4hHard = require('./alex38Notice4hHard/alex38Notice4hHard')
  //alex38Notice4hHard(symbols38hard4h) // запускаем 3.8 HARD на 4h

  sendInfoToUser(
    `Приложение запущено в ${timestampToDateHuman(
      new Date().getTime()
    )}\n\n${nameStrategy382h}\nНа ${symbols38.length} монетах: ${JSON.stringify(
      symbols38
    )}\nПоиск сигнала на ТФ: ${
      timeFrames.timeFrame2h
    }\nПоиск точки входа и выхода на ТФ: ${
      timeFrames.timeFrame1m
    }\n\n${nameStrategy38hard2h}\nНа ${
      symbols38hard2h.length
    } монетах:\n${JSON.stringify(
      symbols38hard2h
    )}\n\n${nameStrategy38hard4h}\nНа ${
      symbols38hard4h.length
    } монетах:\n${JSON.stringify(symbols38hard4h)}`
  )
} // function alexNoticeMain()

module.exports = alexNoticeMain
