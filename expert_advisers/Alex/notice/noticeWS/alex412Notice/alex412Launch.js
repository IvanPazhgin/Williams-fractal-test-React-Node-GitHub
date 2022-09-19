const {
  symbols4h41,
  timeFrames,
  nameStrategy,
  constTPSL,
} = require('./symbols412')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const alex412Main4h = require('./alex412Main4h')
const alex412Main1h = require('./alex412Main1h')

function alex412Launch() {
  // запуск основного приложения
  alex412Main4h(timeFrames.timeFrame4h, nameStrategy.notice4h41)
  alex412Main1h(
    timeFrames.timeFrame1h,
    nameStrategy.notice1h41,
    constTPSL.takeProfitConst1h,
    constTPSL.stopLossConst1h
  )
  alex412Main1h(
    timeFrames.timeFrame30m,
    nameStrategy.notice30m41,
    constTPSL.takeProfitConst30m,
    constTPSL.stopLossConst30m
  )

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

module.exports = alex412Launch
