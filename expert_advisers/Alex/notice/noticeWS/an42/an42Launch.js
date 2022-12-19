const { timeFrames, nameStrategy, options } = require('./input_parameters')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const an42Logic = require('./an42Logic')
const allSymbols = require('../symbols')

function an42Launch() {
  // исключил 1m свечи. Свёл все проверки к цене close на старщем ТФ

  //const message1h41Part1 = `\n\n${nameStrategy.notice1h41}. Монет ${symbols4h41Part1.length}` // 1h
  //const message1h41Part2 = `\n${nameStrategy.notice1h41}. Монет ${symbols4h41Part2.length}` // 1h

  // 1h part 1
  /*
  an42Logic(
    symbols4h41Part1,
    timeFrames.timeFrame1h,
    nameStrategy.notice1h41,
    options.takeProfitConst1h,
    options.stopLossConst1h,
    options.shiftTime1h
  )

  // 1h part 2
  an42Logic(
    symbols4h41Part2,
    timeFrames.timeFrame1h,
    nameStrategy.notice1h41,
    options.takeProfitConst1h,
    options.stopLossConst1h,
    options.shiftTime1h
  )
  */

  // формирование сообщений в телеграм
  let message = `💰 Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}\n`

  allSymbols.forEach((symbols) => {
    message += `\n${nameStrategy.notice30m41}. Монет ${symbols.length}`

    an42Logic(
      symbols,
      timeFrames.timeFrame30m,
      nameStrategy.notice30m41,
      options.takeProfitConst30m,
      options.stopLossConst30m,
      options.shiftTime30m
    )
  })

  sendInfoToUser(message)
}

module.exports = an42Launch
