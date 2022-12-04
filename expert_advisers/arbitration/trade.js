// const submittingCloseOrderSPOT = require('../../API/binance.engine/tradeSPOT/submittingCloseOrder')
const binanceSPOTClient = require('../../API/binance.engine/common/binanceSPOTClient')
const submittingEnterOrderSPOT = require('../../API/binance.engine/tradeSPOT/submittingEnterOrder')
// const { apiOptionsIvan } = require('../../config/api_options')

class ArbitrationTrade {
  constructor() {
    this.reset()
  }

  reset() {
    this.inUSDT = true
    this.inBTC = false
    this.inETH = false
    this.resultBTC = {}
    this.resultETHBTC = {}
    this.resultETH = {}
  }

  // полностью прописать функционал как у двух функций ниже
  async buyBTC(apiOptions, price) {
    this.resultBTC = await submittingEnterOrderSPOT(
      apiOptions,
      'BTCUSDT',
      'BUY',
      price
    )
    this.inUSDT = false
    this.inBTC = true
    return this
  }

  async buyETHBTC(apiOptions, symbol, side, ethBtcPrice) {
    const client = binanceSPOTClient(apiOptions)

    if (this.resultBTC?.origQty > 0) {
      const quantityETH = +(this.resultBTC?.origQty / ethBtcPrice).toFixed(4)

      const orderRequest = this.prepareRequest(
        symbol,
        quantityETH,
        side,
        ethBtcPrice
      )
      console.log(
        `${apiOptions.name}: Submitting ${symbol} ${side} order: `,
        orderRequest
      )

      try {
        this.resultETHBTC = await client.submitNewOrder(orderRequest)
        console.log(
          `${apiOptions.name}: ${symbol} ${side} Order Result:`,
          this.resultETHBTC
        )
        this.inBTC = false
        this.inETH = true
      } catch (error) {
        console.error('Error: request failed: ', error)
      }
      return this
    }

    // this.resultETHBTC = await submittingEnterOrderSPOT(
    //   apiOptionsIvan,
    //   'ETHBTC',
    //   'BUY',
    //   price
    // )
  }

  async sellETH(apiOptions, symbol, side, ethPrice) {
    const client = binanceSPOTClient(apiOptions)

    if (this.resultETHBTC?.origQty > 0) {
      const orderRequest = this.prepareRequest(
        symbol,
        this.resultETHBTC.origQty,
        side,
        ethPrice
      )
      console.log(
        `${apiOptions.name}: Submitting ${symbol} ${side} order: `,
        orderRequest
      )

      try {
        this.resultETH = await client.submitNewOrder(orderRequest)
        console.log(
          `${apiOptions.name}: ${symbol} ${side} Order Result:`,
          this.resultETH
        )
      } catch (error) {
        console.error('Error: request failed: ', error)
      }
      this.inETH = false
      this.inUSDT = true
      return this
    }

    // this.resultETH = await submittingEnterOrderSPOT(
    //   apiOptionsIvan,
    //   'ETHBTC',
    //   'BUY',
    //   price
    // )
    // return this
  }

  prepareRequest(symbol, quantity, side, price) {
    return {
      symbol: symbol,
      timeInForce: 'GTC',
      quantity: quantity,
      side: side,
      type: 'LIMIT',
      price: price,
      newOrderRespType: 'FULL',
    }
  }
}

module.exports = ArbitrationTrade
