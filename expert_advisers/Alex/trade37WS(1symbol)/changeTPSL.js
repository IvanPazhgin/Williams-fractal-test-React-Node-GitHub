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

  // Провека условий для изменения SL и TP
  switch (symbolObj.whitchSignal) {
    case 'сигнал №1':
      //console.log('сигнал №1: меняем TP и SL')
      changeTPSLCommon()
      break
    case 'сигнал №3':
      //console.log('сигнал №3: меняем TP и SL')
      changeTPSLCommon()
      break
    case 'сигнал №4':
      //console.log('сигнал №4: меняем TP и SL')
      //changeTPSLCommon()
      // первая проверка TP: если свеча зеленая, на которой зашли, т.е. closePrice[i] > OpenShort, тогда меняем TP в БУ
      if (lastCandle.openTime == symbolObj.openTime + shiftTime) {
        if (
          lastCandle.closePrice > lastCandle.openPrice && // если свеча зеленая, на которой зашли
          lastCandle.closePrice > symbolObj.openShort // closePrice[i] > OpenShort
        ) {
          if (!symbolObj.changedTP) {
            symbolObj.takeProfit = symbolObj.openShort
            //dateChangeTP = array[i].openTime
            symbolObj.changedTP = true
            sendInfoToUser(
              `${symbolObj.symbol}: Мы в вариативной просадке.\nМеняем take profit на точку входа: ${symbolObj.takeProfit}`
            )
          } // if (!changedTP)
        } // если свеча зеленая, на которой зашли, т.е. closePrice[i] > OpenShort
      } // if (i == indexOfPostion + 1)
      changeTPSLCommon() // вторая проверка
      break

    default:
    // console.log('TP и SL не изменялись')
    // можно отправить сообщение в telegram bot для тестов на первое время
  } // end of: switch (whitchSignal): Провека условий для изменения SL и TP

  return symbolObj
}
module.exports = changeTPSL
