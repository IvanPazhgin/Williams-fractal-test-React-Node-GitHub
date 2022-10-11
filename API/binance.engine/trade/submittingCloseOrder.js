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
    console.log(`${api_option.name}: Submitting ${side} order: `, orderRequest)

    // отправка ордера
    const orderResult = await client.submitNewOrder(orderRequest)
    console.log(`${api_option.name}: ${side} Order Result:`, orderResult)
    return orderResult
  } catch (e) {
    console.error('Error: request failed: ', e)
  }
}

module.exports = submittingCloseOrder
