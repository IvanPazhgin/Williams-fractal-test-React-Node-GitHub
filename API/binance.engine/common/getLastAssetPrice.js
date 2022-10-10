const binanceUSDMClient = require('./binanceUSDMClient')

async function getLastAssetPrice(api_option, symbol) {
  const client = binanceUSDMClient(api_option)
  try {
    const symbolTicker = await client.getSymbolPriceTicker({
      symbol: symbol,
    })
    console.log('Symbol Price Ticker:', symbolTicker)
    const lastPrice = symbolTicker?.price
    //console.log('lastPrice', lastPrice)
    if (!lastPrice) {
      return console.error('Error: no price returned')
    } else return lastPrice
  } catch (e) {
    console.error('Error: request failed: ', e)
  }
}

module.exports = getLastAssetPrice
