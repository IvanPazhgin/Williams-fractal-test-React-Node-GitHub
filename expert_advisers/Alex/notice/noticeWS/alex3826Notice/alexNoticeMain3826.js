const {
  sendInfo382ToUser,
} = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const { nameStrategy } = require('./input_parameters3826')
//const alex3826Notice2h = require('./alex3826Notice2h')
const alex3826Notice2h = require('./alex3826Logic2h')
const allSymbols = require('../symbols')

function alexNoticeMain3826() {
  // запускаем 3.8.2.6 на 2h
  let message = `💰 Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}\n`

  allSymbols.forEach((symbols) => {
    message += `\n${nameStrategy.notice2h382}. Монет ${symbols.length}`

    alex3826Notice2h(symbols)
  })

  sendInfo382ToUser(message)
} // function alexNoticeMain()

module.exports = alexNoticeMain3826
