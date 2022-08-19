const { USDMClient } = require('binance')
const config = require('config')

const API_KEY = config.get('API_KEY') || ''
const API_SECRET = config.get('API_SECRET') || ''

const client = new USDMClient({
  api_key: API_KEY,
  api_secret: API_SECRET,
})

async function getCandles(symbol, timeFrame, limitOfCandle) {
  // const TimeFrame = '2h'
  // const limitOfCandle = 5

  try {
    const candles = await client.getKlines({
      symbol: symbol,
      interval: timeFrame,
      limit: limitOfCandle,
    })
    return candles
  } catch (err) {
    console.error('getAccountTradeList error: ', err)
  }
}

module.exports = getCandles
