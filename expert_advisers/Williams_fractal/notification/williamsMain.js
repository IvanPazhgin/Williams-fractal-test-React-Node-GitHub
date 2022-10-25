const { sendInfoToUserWilliams } = require('../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const {
  symbolsWilliams,
  timeFrames,
  nameStrategy,
} = require('./input_parameters')

function williamsMain() {
  // запускаем на 15m / 1m
  //const intervalSenior = timeFrames.timeFrame15m
  //const intervalJunior = timeFrames.timeFrame1m

  // запускаем на 1h / 5m
  // const intervalSenior = timeFrames.timeFrame1h
  // const intervalJunior = timeFrames.timeFrame5m

  // запускаем на 4h / 15m
  const intervalSenior = timeFrames.timeFrame4h
  const intervalJunior = timeFrames.timeFrame15m

  const nameStrategy4h15m =
    nameStrategy.williams + intervalSenior + '_' + intervalJunior

  const williamsLogic = require('./williamsLogic')
  williamsLogic(intervalSenior, intervalJunior, nameStrategy4h15m)

  // формирование сообщений в телеграм
  const message0 = `Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}`

  const message1 = `\n\n---=== ${nameStrategy4h15m} ===---\nНа ${
    symbolsWilliams.length
  } монетах: ${JSON.stringify(
    symbolsWilliams
  )}\nПоиск трендов на: ${intervalSenior}\nПоиск точки входа и выхода на: ${intervalJunior}`

  //sendInfoToUserWilliams(message0 + message1 + message2)
  sendInfoToUserWilliams(message0 + message1)
} // function williamsMain()

module.exports = williamsMain
