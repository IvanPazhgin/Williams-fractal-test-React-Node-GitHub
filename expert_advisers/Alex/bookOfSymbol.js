// функция bookTicker не работает, т.к. не могу найти описание работы этой функции

const { USDMClient } = require('binance')
const config = require('config')

const API_KEY = config.get('API_KEY') || ''
const API_SECRET = config.get('API_SECRET') || ''

const client = new USDMClient({
  api_key: API_KEY,
  api_secret: API_SECRET,
})

async function bookTickerFunc() {
  //const bookOfSymbol = await client.bookTicker() // bookTicker is not a function
  //const bookOfSymbol = await client.getSymbolOrderBookTicker()
  const bookOfSymbol = await client.getOrderBook()
  console.log(`кол-во контрактов = ${bookOfSymbol.length}`)
  return bookOfSymbol
}
// перебрать функций https://github.com/tiagosiebler/binance/blob/HEAD/src/usdm-client.ts

// и еще посмотреть https://www.npmjs.com/package/binance

module.exports = bookTickerFunc

// на https://www.npmjs.com/package/binance написано:
// wsClient.subscribeSpotSymbolBookTicker(market);
// wsClient.subscribeSpotAllBookTickers();
// const ws1 = wsClient.subscribeSpotSymbolBookTicker(market);
// const ws2 = wsClient.subscribeSpotAllBookTickers();

/*
const { WebsocketClient } = require('binance')
const config = require('config')

const API_KEY = config.get('API_KEY') || ''
const API_SECRET = config.get('API_SECRET') || ''

// optionally override the logger
const logger = {
  ...DefaultLogger,
  silly: (...params) => {},
};

const wsClient = new WebsocketClient({
  api_key: key,
  api_secret: secret,
  beautify: true,
  // Disable ping/pong ws heartbeat mechanism (not recommended)
  // disableHeartbeat: true
}, logger)
*/
