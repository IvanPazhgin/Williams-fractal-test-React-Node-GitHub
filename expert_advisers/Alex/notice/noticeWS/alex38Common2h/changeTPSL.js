const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman') // для отправки сообщения о контроле расчета времени сдвига TP и SL

function changeTPSL(lastCandle, symbolObj) {
  const shiftTime = 1000 * 60 * 60 * 2 // сдвиг на одну 2h свечу

  function changeTPSLCommon() {
    // моделирование условия if (i >= indexOfPostion + 2)
    if (lastCandle.openTime >= symbolObj.sygnalTime + shiftTime * 2) {
      // изменение TP: если мы в просадке
      if (symbolObj.openShort < lastCandle.closePrice) {
        if (!symbolObj.changedTP) {
          symbolObj.takeProfit = symbolObj.openShort
          // dateChangeTP = array[i].openTime
          symbolObj.changedTP = true
          sendInfoToUser(
            `${
              symbolObj.symbol
            }\n\nВремя появления сигнала:\n${timestampToDateHuman(
              symbolObj.sygnalTime
            )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
              symbolObj.positionTime
            )}\n\n--== Мы в вариативной просадке ==--\nМеняем take profit на точку входа: ${
              symbolObj.takeProfit
            }`
          )
        }
      } else {
        if (!symbolObj.changedSL) {
          // изменение SL: если мы в прибыли
          symbolObj.stopLoss = symbolObj.openShort
          // dateChangeSL = array[i].openTime
          symbolObj.changedSL = true
          sendInfoToUser(
            `${
              symbolObj.symbol
            }\n\nВремя появления сигнала:\n${timestampToDateHuman(
              symbolObj.sygnalTime
            )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
              symbolObj.positionTime
            )}\n\n--= Мы в вариативной прибыли ==--\nМеняем stop loss на точку входа: ${
              symbolObj.stopLoss
            }`
          )
        }
      }
    } // if (lastCandle.openTime >= symbolObj.openTime + shiftTime)

    // отправка сообщения для контроля расчета времени сдвига
    /*
    sendInfoToUser(
      `Проверка расчета времени переноса TP и SL\n${
        symbolObj.symbol
      }:\n\nВремя появления сигнала:\n${timestampToDateHuman(
        symbolObj.sygnalTime
      )}\n\nВремя свечи для изменения TP и SL:\n${timestampToDateHuman(
        symbolObj.sygnalTime + shiftTime * 2
      )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
        symbolObj.positionTime
      )}`
    )
    */
  }

  /*
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
  */

  /*
  Условия для переноса TP и SL:
  Если:
  1. свеча открытия - зеленая, [i]
  2. следующая свеча - зеленая, [i+1]
  тогда:
  1. не ждём закрытия третьей свечи [i+2] 
  2. и переносим SL или TP в Б.У.
  Иначе: переносим SL или TP в Б.У. после закрытия 3й свечи [i+2]

  Альтернативный вариант реализации кода ниже - это запрашивать на бирже 2 последних свечи. Я подумал, что код ниже будет выполняться быстрее, чем запрос на биржу. Поэтому:
  */
  if (lastCandle.openTime <= symbolObj.sygnalTime + shiftTime * 2) {
    const candleColor = lastCandle.closePrice - lastCandle.openPrice // цвет текущей свечи - зеленый
    // проверка условия: если (свеча входа в шорт оказалась зеленая) и (текущая свеча тоже зеленая), то переносим TP и SL
    if (symbolObj.shortCandleColorIsGreen && candleColor > 0) {
      // временно консолим проверки
      sendInfoToUser(
        `Проверка расчета времени переноса TP и SL\n${symbolObj.nameStrategy}\n\nМонета: ${symbolObj.symbol}\n--== Вторая свеча - ЗЕЛЕНАЯ ==--`
      )
      changeTPSLCommon() // проверка общих условий по переносу TP и SL
    }

    // если (свеча [i] входа в шорт оказалась зеленая), то сохраняем эту информацию для проверки условия выше на следующей свече [i+1]
    if (!symbolObj.shortCandleColorIsGreen && candleColor > 0) {
      symbolObj.shortCandleColorIsGreen = true
      // временно консолим проверки
      sendInfoToUser(
        `Проверка расчета времени переноса TP и SL\n${symbolObj.nameStrategy}\n\nМонета: ${symbolObj.symbol}\n--== Свеча входа в шорт - ЗЕЛЕНАЯ ==--`
      )
    }
  } else {
    // после закрытий 3й свечи [i+2] переносим TP и SL
    changeTPSLCommon() // проверка общих условий по переносу TP и SL
  }

  return symbolObj
}
module.exports = changeTPSL
