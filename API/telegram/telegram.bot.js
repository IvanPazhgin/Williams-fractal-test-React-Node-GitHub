/*
код взят со страниц:
https://github.com/yagop/node-telegram-bot-api
https://www.npmjs.com/package/node-telegram-bot-api

name: Traders bot
username: traderapibot
*/

// !!! сделать импорт в отдельный файл строк с 11 по 19
// !! вынес 3 строчки в глобальную область
const TelegramBot = require('node-telegram-bot-api')

// replace the value below with the Telegram token you receive from @BotFather
const token = '5548940647:AAF40e8GY0ahkV5bQq3vowu5HwhemcqpKME'

// Create a bot that uses 'polling' to fetch new updates
// const bot = new TelegramBot(token, { polling: true })
const bot = new TelegramBot(token, { polling: true })

function tgBotExample() {
  // Matches "/echo [whatever]"
  bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content of the message

    const chatId = msg.chat.id
    const resp = match[1] // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp)
  })

  /*
  // Listen for any kind of message. There are different kinds of messages.
  bot.on('message', (msg) => {
    const chatId = msg.chat.id

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message')
  })
  */

  // мои эксперименты
  // более короткая запись функкции выше:
  bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, `Ваш telegram id: ${msg.chat.id}`)
  })

  // bot.sendMessage(tgid, text)
}

function sendInfoToUser(text) {
  const tgid = [
    { name: 'Ivan', id: 591611622 },
    { name: 'Alex', id: 1589257165 },
    { name: 'Maks', id: 237283171 },
  ]
  tgid.forEach(function (item) {
    //bot.sendMessage(item.id, 'локальный запуск')
    bot.sendMessage(item.id, text)
  })

  // const tgidIvan = 591611622
  // const tgidAlex = 1589257165
  // bot.sendMessage(tgidIvan, text)
  // bot.sendMessage(tgid, text)

  // test #1
  //tgBotExample.call(this)
  //this.bot.sendMessage(tgid, text)
  // test #2
  // const bot2 = tgBotExample
  // bot2.sendMessage(tgid, text)
}

function sendInfoToUserWilliams(text) {
  const tgid = [
    { name: 'Ivan', id: 591611622 },
    //{ name: 'Alex', id: 1589257165 },
    //{ name: 'Maks', id: 237283171 },
  ]
  tgid.forEach(function (item) {
    //bot.sendMessage(item.id, 'локальный запуск')
    bot.sendMessage(item.id, text)
  })
}

function sendInfo382ToUser(text) {
  const tgid = [
    { name: 'Ivan', id: 591611622 },
    { name: 'Alex', id: 1589257165 },
    { name: 'Maks', id: 237283171 },
  ]
  tgid.forEach(function (item) {
    //bot.sendMessage(item.id, 'локальный запуск')
    bot.sendMessage(item.id, text)
  })
}

function sendSymbolObjToUser(symbolObj) {
  const tgidIvan = 591611622
  const tgidAlex = 1589257165
  bot.sendMessage(tgidIvan, symbolObj)
}

module.exports = {
  tgBotExample,
  sendInfoToUser,
  sendInfoToUserWilliams,
  sendInfo382ToUser,
  sendSymbolObjToUser,
}

// module.exports = tgBotExample
