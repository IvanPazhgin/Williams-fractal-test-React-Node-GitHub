const {
  sendInfo382ToUser,
} = require('../../../../../API/telegram/telegram.bot')

function closeShort(lastCandle, symbolObj) {
  // for (let i = 4; i < array.length; i++) {
  if (symbolObj.inPosition) {
    // условия выхода из сделки по TP
    if (lastCandle.lowPrice <= symbolObj.takeProfit) {
      symbolObj.closeShort = lastCandle.lowPrice
      symbolObj.closeTime = lastCandle.openTime

      symbolObj.profit = +(
        (symbolObj.openShort - lastCandle.lowPrice) *
        symbolObj.amountOfPosition
      ).toFixed(2)

      symbolObj.percent = +(
        (symbolObj.profit / symbolObj.deposit) *
        100
      ).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

      //depositTemp += profit
      // dateChangeTP = dateChangeTP == 0 ? (dateChangeTP = '') : timestampToDateHuman(dateChangeTP)
      symbolObj.inPosition = false

      // console.log(`Close SHORT with takeProfit: ${symbolObj.closeShort}`)
      sendInfo382ToUser(
        `Стратегия №3: Без теневая RC 7\n${symbolObj.whitchSignal}\n\nМонета: ${symbolObj.symbol}\n\n--== Close SHORT ==--\nwith takeProfit: ${symbolObj.closeShort}\nПрибыль = ${symbolObj.profit} USDT (${symbolObj.percent}%)`
      )
      // sendInfo382ToUser(JSON.stringify(symbolObj))

      /*
      deals[numberOfPosition] = {
        openPosition: 'Sell',
        openPrice: +positionDown.toFixed(8),
        openTime: timestampToDateHuman(positionTime),
        amountOfPosition: amountOfPosition,
        closePosition: 'Buy',
        closePrice: +takeProfit.toFixed(8),
        closeTime: timestampToDateHuman(array[i].openTime),
        profit: +profit.toFixed(2),
        percent: percent,
        deposit: +depositTemp.toFixed(2),
        takeProfit: +takeProfit.toFixed(8), // для проверки движка
        stopLoss: +stopLoss.toFixed(8), // для проверки движка
        dateChangeTP: dateChangeTP, // запоминаем время переноса TP
        //dateChangeSL: timestampToDateHuman(dateChangeSL), // запоминаем время переноса SL
        diffShadow: diffShadow,
        whitchSignal: whitchSignal,
      }

      numberOfPosition += 1
      positionDown = 0
      positionTime = 0
      takeProfit = 0
      stopLoss = 0
      inShortPosition = false
      amountOfPosition = 0
      profit = 0
      percent = 0
      //indexOfPostion = 0
      dateChangeTP = 0
      */
    } // условия выхода из сделки по TP
    // условия выхода из сделки по SL
    else if (lastCandle.highPrice >= symbolObj.stopLoss) {
      symbolObj.closeShort = lastCandle.highPrice
      symbolObj.closeTime = lastCandle.openTime

      symbolObj.profit = +(
        (symbolObj.openShort - lastCandle.highPrice) *
        symbolObj.amountOfPosition
      ).toFixed(2)

      symbolObj.percent = +(
        (symbolObj.profit / symbolObj.deposit) *
        100
      ).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

      symbolObj.inPosition = false

      //console.log(`Close SHORT with stopLoss: ${symbolObj.closeShort}`)
      sendInfo382ToUser(
        `${symbolObj.symbol}:\n${symbolObj.whitchSignal}\n\n--== Close SHORT ==--\nwith stopLoss: ${symbolObj.closeShort}\nУбыток = ${symbolObj.profit} USDT (${symbolObj.percent}%)`
      )
      //sendInfo382ToUser(JSON.stringify(symbolObj))

      /*
      depositTemp += profit
      dateChangeSL =
        dateChangeSL == 0
          ? (dateChangeSL = '')
          : timestampToDateHuman(dateChangeSL)

      deals[numberOfPosition] = {
        openPosition: 'Sell',
        openPrice: +positionDown.toFixed(8),
        openTime: timestampToDateHuman(positionTime),
        amountOfPosition: amountOfPosition,
        closePosition: 'Buy',
        closePrice: +stopLoss.toFixed(8),
        closeTime: timestampToDateHuman(array[i].openTime),
        profit: +profit.toFixed(2),
        percent: percent,
        deposit: +depositTemp.toFixed(2),
        takeProfit: +takeProfit.toFixed(8), // для проверки движка
        stopLoss: +stopLoss.toFixed(8), // для проверки движка
        //dateChangeTP: timestampToDateHuman(dateChangeTP), // запоминаем время переноса TP
        dateChangeSL: dateChangeSL, // запоминаем время переноса SL
        diffShadow: diffShadow,
        whitchSignal: whitchSignal,
      }
      numberOfPosition += 1
      positionDown = 0
      positionTime = 0
      takeProfit = 0
      stopLoss = 0
      inShortPosition = false
      amountOfPosition = 0
      profit = 0
      percent = 0
      // indexOfPostion = 0
      dateChangeSL = 0
      */
    } // отработка выхода из сделки по SL
  } // if (symbolObj.inPosition)
  //} // for (let i = 4; i < array.length; i++)
  return symbolObj
}

module.exports = closeShort
