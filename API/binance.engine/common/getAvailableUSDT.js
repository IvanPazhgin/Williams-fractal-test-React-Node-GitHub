const binanceUSDMClient = require('./binanceUSDMClient')

async function getAvailableBalance(api_option, entryAmountPercent) {
  const client = binanceUSDMClient(api_option)
  try {
    const balance = await client.getBalance()
    // console.log('balance', balance)

    const usdtBal = balance.find((assetBal) => assetBal.asset === 'USDT')
    //console.log('USDT balance object: ', usdtBal)

    const usdtAvailable = Number(usdtBal?.availableBalance) // баланс доступных средств для торговли
    const usdtFullBalance = Number(usdtBal?.balance) // берём в расчет весь баланс кошелька

    if (!usdtBal || !usdtAvailable || !usdtFullBalance) {
      return console.error('Error: funds to trade from USDT')
    }

    const amountValueMin = usdtAvailable * (entryAmountPercent / 100)

    const amountValueMax = usdtFullBalance * (entryAmountPercent / 100)

    if (amountValueMax > usdtAvailable) {
      const message = `\n${api_option.name}: Executing trade with ${entryAmountPercent}% of ${usdtFullBalance} USDT => ${amountValueMax} USDT`
      console.log(message)
      return amountValueMax
    } else {
      const message = `\n${api_option.name}: Executing trade with ${entryAmountPercent}% of ${usdtAvailable} USDT => ${amountValueMin} USDT`
      console.log(message)
      return amountValueMin
    }
  } catch (e) {
    console.error('Error: request failed: ', e)
  }
}

module.exports = getAvailableBalance
