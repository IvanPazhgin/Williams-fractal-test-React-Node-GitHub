const { optionsOfTrade } = require('../../../config/api_options')
const binanceUSDMClient = require('./binanceUSDMClient')

async function getAvailableBalance(api_option) {
  const client = binanceUSDMClient(api_option)
  try {
    const balance = await client.getBalance()
    // console.log('balance', balance)

    const usdtBal = balance.find((assetBal) => assetBal.asset === 'USDT')
    //console.log('USDT balance object: ', usdtBal)

    const usdtAvailable = usdtBal?.availableBalance

    if (!usdtBal || !usdtAvailable) {
      return console.error('Error: funds to trade from USDT')
    }

    const amountValue =
      Number(usdtAvailable) * (optionsOfTrade.entryAmountPercent / 100)
    console.log(
      `\nExecuting trade with ${optionsOfTrade.entryAmountPercent}% of ${usdtAvailable} USDT => ${amountValue} USDT`
    )

    return amountValue
  } catch (e) {
    console.error('Error: request failed: ', e)
  }
}

module.exports = getAvailableBalance
