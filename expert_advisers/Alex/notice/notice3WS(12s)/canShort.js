const { sendInfoToUser } = require('../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')

function canShort(lastCandle, symbolObj) {
  if (symbolObj.canShort) {
    if (lastCandle.highPrice > symbolObj.openShort) {
      symbolObj.canShort = false
      symbolObj.inPosition = true
      //symbolObj.positionTime = lastCandle.openTime
      symbolObj.positionTime = new Date().getTime()

      sendInfoToUser(
        `${symbolObj.nameStrategy}\n${symbolObj.whitchSignal}\n\nМонета: ${
          symbolObj.symbol
        }\n\n--== Вошли в SHORT ==--\nпо цене: ${
          symbolObj.openShort
        } USDT \n\nВремя сигнала: ${timestampToDateHuman(
          symbolObj.sygnalTime
        )}\nВремя входа: ${timestampToDateHuman(
          symbolObj.positionTime
        )}\n\nЖдем цену на рынке для выхода из сделки...`
      )
    }
  }
  return symbolObj
}

module.exports = canShort
