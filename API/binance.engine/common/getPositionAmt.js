const binanceUSDMClient = require('../common/binanceUSDMClient')

async function getPositionAmount(api_option) {
  const client = binanceUSDMClient(api_option)

  const accountInformation = await client.getAccountInformation()
  //console.log('getAccountInformation: ', JSON.stringify(accountInformation, null, 2))
  //console.log('getAccountInformation: ', accountInformation)
  //console.log(`кол-во в accountInformation = ${accountInformation.length}`)

  // считаем кол-во открытых позиций
  let countOfPosition = 0
  accountInformation.positions.forEach((element) => {
    if (element.positionAmt != 0) {
      countOfPosition++
    }
  })
  // console.log(`кол-во открытых позиций = ${countOfPosition}`)

  return { accountInformation, countOfPosition }
}

module.exports = getPositionAmount
