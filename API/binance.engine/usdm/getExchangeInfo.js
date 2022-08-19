const { USDMClient } = require('binance')

//const config = require('config')
//const API_KEY = config.get('API_KEY') || ''
//const API_SECRET = config.get('API_SECRET') || ''

const client = new USDMClient({
  // api_key: API_KEY,
  // api_secret: API_SECRET,
})

async function getExchangeInfo() {
  try {
    const exchangeInfo = await client.getExchangeInfo()
    console.log('получили результат работы функции getExchangeInfo')
    // console.log('getExchangeInfo result: ', exchangeInfo)
    // !!!! добавить функцию foreach для объекта !!!! чтобы отфильтровать например ETH

    //console.log(`тип exchangeInfo = ${typeof exchangeInfo}, длина = ${exchangeInfo.lenght}`)
    return exchangeInfo
  } catch (err) {
    console.error('get Account Trade List error: ', err)
  }
}

/*
async function getExchangeInfo3(symbols) {
  'https://api.binance.com/api/v3/exchangeInfo?symbols=["BTCUSDT","BNBBTC"]'
}
*/

module.exports = getExchangeInfo
