const binanceUSDMClient = require('../common/binanceUSDMClient')

async function submittingCloseOrder(api_option, symbol, side, buyOrderResult) {
  const client = binanceUSDMClient(api_option)
  // Process bought fills and submit sell amount
  const quantity = buyOrderResult.origQty
  try {
    const orderRequest = {
      symbol: symbol,
      quantity: quantity,
      side: side,
      type: 'MARKET',
      newOrderRespType: 'FULL',
    }
    console.log(`Submitting ${side} order: `, orderRequest)
    const orderResult = await client.submitNewOrder(orderRequest)
    console.log(side + ' Order Result:', orderResult)
    return orderResult
  } catch (e) {
    console.error('Error: request failed: ', e)
  }
}

module.exports = submittingCloseOrder
