const { sendInfoToUser } = require('../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')
const alex38Notice2h = require('./alex38Notice2h/alex38Notice2h')
const alex38Notice2hHard = require('./alex38Notice2hHard/alex38Notice2hHard')
const alex38Notice4hHard = require('./alex38Notice4hHard/alex38Notice4hHard')

function alexNoticeMain() {
  const nameStrategy382h = 'Стратегия №3.8: Без теневая 2h'
  const nameStrategy38hard2h = 'Стратегия №3.8: Без теневая HARD 2h'
  const nameStrategy38hard4h = 'Стратегия №3.8: Без теневая HARD 4h'
  //const timeFrame = '2h'

  const symbols38 = [
    'UNFIUSDT',
    'PEOPLEUSDT',
    'BELUSDT',
    'BLZUSDT',
    'SANDUSDT',
    'BANDUSDT',
    'STORJUSDT',
    'ETCUSDT',
    'ATOMUSDT',
    'LINAUSDT',
    'APEUSDT',
    '1INCHUSDT',
    'ALPHAUSDT',
    'API3USDT',
    'DGBUSDT',
    'XRPUSDT',
  ]

  const symbols38hard2h = ['HOTUSDT', 'ENJUSDT', 'SUSHIUSDT', 'FLOWUSDT']

  const symbols38hard4h = [
    'UNFIUSDT',
    'PEOPLEUSDT',
    'BANDUSDT',
    'XRPUSDT',
    'DGBUSDT',
  ]

  sendInfoToUser(
    `Приложение запущено в ${timestampToDateHuman(
      new Date().getTime()
    )}\n\n${nameStrategy382h}\nНа ${symbols38.length} монетах: ${JSON.stringify(
      symbols38
    )}\n\n${nameStrategy38hard2h}\nНа ${
      symbols38hard2h.length
    } монетах:\n${JSON.stringify(
      symbols38hard2h
    )}\n\n${nameStrategy38hard4h}\nНа ${
      symbols38hard4h.length
    } монетах:\n${JSON.stringify(symbols38hard4h)}`
  )

  alex38Notice2h(symbols38) // запускаем 3.8 на 2h
  alex38Notice2hHard(symbols38hard2h) // запускаем 3.8 HARD на 2h
  alex38Notice4hHard(symbols38hard4h) // запускаем 3.8 HARD на 4h
} // function alexNoticeMain()

module.exports = alexNoticeMain
