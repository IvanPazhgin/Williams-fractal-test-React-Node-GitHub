const {
  //symbols4h41,
  timeFrames,
  nameStrategy,
  options,
  symbols4h41Part1,
  symbols4h41Part2,
} = require('./input_parameters412')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')

function alex412LaunchTmod() {
  // исключил 1m свечи. Свёл все проверки к цене close на старщем ТФ
  const alex412Main1h = require('./alex412Main1h_mod2')
  //const message1h41Part1 = `\n\n${nameStrategy.notice1h41}. Монет ${symbols4h41Part1.length}` // 1h
  //const message1h41Part2 = `\n${nameStrategy.notice1h41}. Монет ${symbols4h41Part2.length}` // 1h
  const message30m41Part1 = `\n\n${nameStrategy.notice30m41}. Монет ${symbols4h41Part1.length}` // 30m
  const message30m41Part2 = `\n${nameStrategy.notice30m41}. Монет ${symbols4h41Part2.length}` // 30m

  // 1h part 1
  /*
  alex412Main1h(
    symbols4h41Part1,
    timeFrames.timeFrame1h,
    nameStrategy.notice1h41,
    options.takeProfitConst1h,
    options.stopLossConst1h,
    options.shiftTime1h
  )

  // 1h part 2
  alex412Main1h(
    symbols4h41Part2,
    timeFrames.timeFrame1h,
    nameStrategy.notice1h41,
    options.takeProfitConst1h,
    options.stopLossConst1h,
    options.shiftTime1h
  )
  */

  // 30m part 1
  alex412Main1h(
    symbols4h41Part1,
    timeFrames.timeFrame30m,
    nameStrategy.notice30m41,
    options.takeProfitConst30m,
    options.stopLossConst30m,
    options.shiftTime30m
  )

  // 30m part 2
  alex412Main1h(
    symbols4h41Part2,
    timeFrames.timeFrame30m,
    nameStrategy.notice30m41,
    options.takeProfitConst30m,
    options.stopLossConst30m,
    options.shiftTime30m
  )

  // формирование сообщений в телеграм
  const message0 = `--== Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )} ==--`

  sendInfoToUser(
    message0 + // message1h41Part1 + message1h41Part2 +
      message30m41Part1 +
      message30m41Part2
  )
}

module.exports = alex412LaunchTmod
