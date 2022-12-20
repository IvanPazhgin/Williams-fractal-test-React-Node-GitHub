const binanceUSDMClient = require('../common/binanceUSDMClient')
const getLastAssetPrice = require('../common/getLastAssetPrice')

async function submittingCloseOrder(api_option, symbol, side, buyOrderResult) {
  const client = binanceUSDMClient(api_option)
  // Process bought fills and submit sell amount
  // const quantity = buyOrderResult.origQty
  const quantity = buyOrderResult
  try {
    const orderRequest = {
      symbol: symbol,
      quantity: quantity,
      side: side,
      type: 'MARKET',
      newOrderRespType: 'FULL',
    }
    console.log(`${api_option.name}: Submitting ${side} order: `, orderRequest)

    // отправка ордера - найти другой ордер, который воззвращает цену
    const orderResult = await client.submitNewOrder(orderRequest)
    orderResult.lastPrice = await getLastAssetPrice(api_option, symbol)
    console.log(`${api_option.name}: ${side} Order Result:`, orderResult)
    return orderResult
  } catch (e) {
    console.error('Error: request failed: ', e)
  }
}

module.exports = submittingCloseOrder
