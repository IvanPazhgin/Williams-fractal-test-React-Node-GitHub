const binanceSPOTClient = require('../common/binanceSPOTClient')
const calculateAmount = require('../common/calculateAmount')

async function submittingEnterOrderSPOT(api_option, symbol, side, price) {
  const client = binanceSPOTClient(api_option)

  // Calculate amount
  const [amountForDeal, quantity, lastPrice] = await calculateAmount(
    api_option,
    symbol,
    side
  )

  // if (quantity > 0) {
  try {
    // подготовка ордера
    const orderRequest = {
      symbol: symbol,
      timeInForce: 'GTC',
      //quantity: amountForDeal, // не учитывает плечо
      // quantity: quantity / 10,
      quantity: +(400 / price / 10).toFixed(4),
      // quantity: 400 / price / 10,
      side: side,
      // type: 'MARKET',
      type: 'LIMIT',
      price: price,
      /**
       * ACK = confirmation of order acceptance (no placement/fill information) -> OrderResponseACK
       * RESULT = fill state -> OrderResponseResult
       * FULL = fill state + detail on fills and other detail -> OrderResponseFull
       */
      newOrderRespType: 'FULL',
    }
    console.log(`${api_option.name}: Submitting ${side} order: `, orderRequest)

    // отправка ордера - найти другой ордер, который воззвращает цену
    const orderResult = await client.submitNewOrder(orderRequest)
    // orderResult.lastPrice = lastPrice
    // orderResult.name = api_option.name
    console.log(`${api_option.name}: ${side} Order Result:`, orderResult)
    return orderResult
  } catch (e) {
    console.error('Error: request failed: ', e)
  }
  // } else {
  //   const message = `Недостаточно средств для входа в сделку. Куплено: ${quantity} монет`
  //   console.log(message)
  //   return {
  //     symbol: symbol,
  //     origQty: 0,
  //   }
  // }
}

module.exports = submittingEnterOrderSPOT
