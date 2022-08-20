const { sendInfoToUser } = require('../../../API/telegram/telegram.bot')

function changeTPSL(lastCandle, symbolObj) {
  const shiftTime = 1000 * 60 * 60 * 2 // сдвиг на одну 2h свечу

  function changeTPSLCommon() {
    // моделирование условия if (i >= indexOfPostion + 2)
    if (lastCandle.openTime >= symbolObj.openTime + shiftTime * 2) {
      // изменение TP: если мы в просадке
      if (symbolObj.openShort < lastCandle.closePrice) {
        if (!symbolObj.changedTP) {
          symbolObj.takeProfit = symbolObj.openShort
          // dateChangeTP = array[i].openTime
          symbolObj.changedTP = true
          sendInfoToUser(
            `${symbolObj.symbol}: Мы в вариативной просадке.\nМеняем take profit на точку входа: ${symbolObj.takeProfit}`
          )
        }
      } else {
        if (!symbolObj.changedSL) {
          // изменение SL: если мы в прибыли
          symbolObj.stopLoss = symbolObj.openShort
          // dateChangeSL = array[i].openTime
          symbolObj.changedSL = true
          sendInfoToUser(
            `${symbolObj.symbol}: Мы в вариативной прибыли.\nМеняем stop loss на точку входа: ${symbolObj.stopLoss}`
          )
        }
      }
    } // if (lastCandle.openTime >= symbolObj.openTime + shiftTime)
  }

  if (lastCandle.openTime == symbolObj.openTime + shiftTime) {
    if (
      // ДОБАВИТЬ УСЛОВИЕ: если свеча, на которой зашли, зеленая. И далее:
      lastCandle.closePrice > lastCandle.openPrice // если текущая свеча зеленая
    ) {
      if (!symbolObj.changedSL) {
        symbolObj.stopLoss = symbolObj.openShort
        //dateChangeSL = array[i].openTime
        symbolObj.changedSL = true
        sendInfoToUser(
          `${symbolObj.symbol}: Мы в вариативной прибыли.\nМеняем stop loss на точку входа: ${symbolObj.stopLoss}`
        )
      } // if (!changedTP)
    } // если свеча зеленая, на которой зашли, т.е. closePrice[i] > OpenShort
  } // if (i == indexOfPostion + 1)

  changeTPSLCommon() // проверка общих условий по переносу TP и SL

  return symbolObj
}
module.exports = changeTPSL
