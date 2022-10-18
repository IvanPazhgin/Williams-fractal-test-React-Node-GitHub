const submittingCloseOrder = require('./submittingCloseOrder')
const submittingEnterOrder = require('./submittingEnterOrder')

async function openDeal(api_option, symbol, side) {
  // вход в сделку
  const enterOrderResult = await submittingEnterOrder(api_option, symbol, side)
  //console.log('enterOrderResult:', enterOrderResult)
}

function closeDeal(api_option, symbol, side) {
  // найти функцию, которая находит кол-во монет на балансе
  // выход из сделки
  const { response } = require('../../../config/api_options')
  const closeOrderResult = submittingCloseOrder(
    api_option,
    symbol,
    side,
    //enterOrderResult,
    response
  )
}

module.exports = { openDeal, closeDeal }
