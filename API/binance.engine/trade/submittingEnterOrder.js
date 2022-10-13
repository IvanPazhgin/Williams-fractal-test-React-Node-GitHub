const binanceUSDMClient = require('../common/binanceUSDMClient')
const calculateAmount = require('../common/calculateAmount')

async function submittingEnterOrder(api_option, symbol, side) {
  const client = binanceUSDMClient(api_option)

  // Calculate amount
  const [amountForDeal, quantity] = await calculateAmount(
    api_option,
    symbol,
    side
  )

  if (quantity > 0) {
    try {
      // подготовка ордера
      const orderRequest = {
        symbol: symbol,
        //quantity: amountForDeal, // не учитывает плечо
        quantity: quantity,
        side: side,
        type: 'MARKET',
        /**
         * ACK = confirmation of order acceptance (no placement/fill information) -> OrderResponseACK
         * RESULT = fill state -> OrderResponseResult
         * FULL = fill state + detail on fills and other detail -> OrderResponseFull
         */
        newOrderRespType: 'FULL',
      }
      console.log(
        `${api_option.name}: Submitting ${side} order: `,
        orderRequest
      )

      // отправка ордера
      const orderResult = await client.submitNewOrder(orderRequest)
      // orderResult.name = api_option.name
      console.log(`${api_option.name}: ${side} Order Result:`, orderResult)
      return orderResult
    } catch (e) {
      console.error('Error: request failed: ', e)
    }
  } else {
    const message = `Недостаточно средств для входа в сделку. Куплено: ${quantity} монет`
    console.log(message)
    return {
      symbol: symbol,
      origQty: 0,
    }
  }
}

module.exports = submittingEnterOrder
