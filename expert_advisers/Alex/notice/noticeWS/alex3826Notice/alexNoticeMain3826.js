const {
  sendInfo382ToUser,
} = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const {
  symbols2h38Part1,
  symbols2h38Part2,
  //timeFrames,
  nameStrategy,
} = require('./input_parameters3826')

function alexNoticeMain3826() {
  // запускаем 3.8.2.6 на 2h
  const alex3826Notice2h = require('./alex3826Notice2h')
  alex3826Notice2h(symbols2h38Part1)
  alex3826Notice2h(symbols2h38Part2)

  // формирование сообщений в телеграм
  const message0 = `Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}`

  const message1 = `\n\n${nameStrategy.notice2h382} на ${symbols2h38Part1.length} монетах`
  const message2 = `\n${nameStrategy.notice2h382} на ${symbols2h38Part2.length} монетах`

  sendInfo382ToUser(message0 + message1 + message2)
} // function alexNoticeMain()

module.exports = alexNoticeMain3826
