const { USDMClient } = require('binance')

const client = new USDMClient({})

async function getPricePrecision(symbol: string) {
  try {
    const exchangeInfo = await client.getExchangeInfo()
    /*
    const pricePrecision =
      exchangeInfo.symbols.find((element) => element.symbol === symbol)
        .pricePrecision - 1 //or pricePrecision or quantityPrecision
    */

    let pricePrecision: number = 0
    let quantityPrecision: number = 0
    exchangeInfo.symbols.forEach((element) => {
      if (element.symbol == symbol) {
        pricePrecision = element.pricePrecision
        quantityPrecision = element.quantityPrecision
      }
    })

    console.log(
      `[${symbol}]: pricePrecision = ${pricePrecision}, quantityPrecision = ${quantityPrecision}`
    )
    return [pricePrecision, quantityPrecision]
  } catch (err) {
    console.error('get Account Trade List error: ', err)
  }
}

module.exports = getPricePrecision
