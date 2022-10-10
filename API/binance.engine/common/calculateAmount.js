const { optionsOfTrade } = require('../trade/api_options')
const getAvailableBalance = require('./getAvailableUSDT')
const getLastAssetPrice = require('./getLastAssetPrice')
const getPricePrecision = require('./getPricePrecision')

async function calculateAmount(api_option, symbol, side) {
  const amountOfUSDT = await getAvailableBalance(api_option)
  const lastPrice = await getLastAssetPrice(api_option, symbol)

  const [assetDecimalPlaces, quantityPrecision] = await getPricePrecision(
    symbol
  )

  const amountForDeal = +(amountOfUSDT / Number(lastPrice)).toFixed(
    assetDecimalPlaces
  )

  const quantity =
    +amountForDeal.toFixed(quantityPrecision) * optionsOfTrade.multiplier

  console.log(
    `Last [${symbol}] price: ${lastPrice} => will ${side} ${amountForDeal} ${symbol} (${quantity} ${symbol} c ${optionsOfTrade.multiplier}x плечом)`
  )
  return [amountForDeal, quantity]
}

module.exports = calculateAmount
