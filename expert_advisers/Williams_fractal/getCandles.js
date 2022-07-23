const { USDMClient } = require('binance')
const config = require('config')

const API_KEY = config.get('API_KEY') || ''
const API_SECRET = config.get('API_SECRET') || ''

const client = new USDMClient({
  api_key: API_KEY,
  api_secret: API_SECRET,
})

async function getCandles(symbol, interval, startTime, endTime, limit) {
  const candles = await client.getKlines({
    symbol: symbol,
    interval: interval,
    startTime: startTime,
    endTime: endTime,
    limit: limit,
  })
  return candles
}

module.exports = getCandles
