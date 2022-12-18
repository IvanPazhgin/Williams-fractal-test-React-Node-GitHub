const { timeFrames, nameStrategy, options } = require('./input_parameters')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const an422Logic = require('./an422Logic')
const allSymbols = require('../symbols')

function an422Launch() {
  // исключил 1m свечи. Свёл все проверки к цене close на старщем ТФ
  let message = `💰 Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}\n`

  allSymbols.forEach((symbols) => {
    message += `\n${nameStrategy.notice30m41}. Монет ${symbols.length}`

    an422Logic(
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

module.exports = an422Launch
