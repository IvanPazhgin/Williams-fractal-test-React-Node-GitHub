const { symbols4h41, timeFrames, nameStrategy } = require('./symbols')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const alex41Main2 = require('./alex41Main2')

function alex41Launch() {
  // запуск основного приложения
  alex41Main2(timeFrames.timeFrame4h, nameStrategy.notice4h41)
  alex41Main2(timeFrames.timeFrame1h, nameStrategy.notice1h41)
  alex41Main2(timeFrames.timeFrame30m, nameStrategy.notice30m41)

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

module.exports = alex41Launch
