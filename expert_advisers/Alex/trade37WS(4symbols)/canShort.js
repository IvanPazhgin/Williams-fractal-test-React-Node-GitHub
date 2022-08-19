const { sendInfoToUser } = require('../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')

function canShort(lastCandle, symbolObj) {
  if (symbolObj.canShort) {
    if (lastCandle.highPrice > symbolObj.openShort) {
      symbolObj.canShort = false
      symbolObj.inPosition = true
      symbolObj.positionTime = lastCandle.openTime

      sendInfoToUser(
        `Стратегия №3: Без теневая RC 7\n${symbolObj.whitchSignal}\n\nМонета: ${
          symbolObj.symbol
        }\n\n--== Вошли в SHORT ==--\nпо цене: ${
          symbolObj.openShort
        } USDT \n\nВремя входа: ${timestampToDateHuman(
          lastCandle.openTime
        )}\n\nЖдем цену на рынке для выхода из сделки...`
      )
    }
  }
  return symbolObj
}

module.exports = canShort
