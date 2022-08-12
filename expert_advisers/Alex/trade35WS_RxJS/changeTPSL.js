const { sendInfoToUser } = require('./telegram.bot')

function changeTPSL(lastCandle, symbolObj) {
  // проверка SL и TP на предмет сдвига: если любая следующая свеча - зеленая
  if (lastCandle.closePrice > lastCandle.openPrice) {
    // изменение TP: если мы в просадке
    if (symbolObj.openShort < lastCandle.closePrice) {
      symbolObj.takeProfit = symbolObj.openShort
      // dateChangeTP = array[i].openTime
      // console.log(`изменили take profit: ${symbolObj.takeProfit}`)
      sendInfoToUser(
        `${symbolObj.symbol}: Мы в просадке.\nМеняем take profit на точку входа: ${symbolObj.takeProfit}`
      )
    } else {
      // изменение SL: если мы в прибыли
      symbolObj.stopLoss = symbolObj.openShort
      // dateChangeSL = array[i].openTime
      // console.log(`изменили stop loss: ${symbolObj.stopLoss}`)
      sendInfoToUser(
        `${symbolObj.symbol}: Мы в прибыли.\nМеняем stop loss на точку входа: ${symbolObj.stopLoss}`
      )
    }
  }
  return symbolObj
}
module.exports = changeTPSL
