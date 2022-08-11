const { sendInfoToUser } = require('./telegram.bot')

function closeShort(lastCandle, symbolObj) {
  // for (let i = 4; i < array.length; i++) {
  if (symbolObj.inPosition) {
    // условия выхода из сделки по TP
    if (lastCandle.closePrice <= symbolObj.takeProfit) {
      symbolObj.closeShort = lastCandle.closePrice
      symbolObj.closeTime = lastCandle.startTime

      symbolObj.profit =
        (symbolObj.openShort - lastCandle.closePrice) *
        symbolObj.amountOfPosition

      symbolObj.percent = +(
        (symbolObj.profit / symbolObj.deposit) *
        100
      ).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

      //depositTemp += profit
      // dateChangeTP = dateChangeTP == 0 ? (dateChangeTP = '') : timestampToDateHuman(dateChangeTP)
      symbolObj.inPosition = false

      console.log(`Close SHORT with takeProfit: ${symbolObj.closeShort}`)
      sendInfoToUser(`Close SHORT with takeProfit: ${symbolObj.closeShort}`)
      sendInfoToUser(JSON.stringify(symbolObj))

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
    else if (lastCandle.closePrice >= symbolObj.stopLoss) {
      symbolObj.closeShort = lastCandle.closePrice
      symbolObj.closeTime = lastCandle.startTime

      symbolObj.profit =
        (symbolObj.openShort - lastCandle.closePrice) *
        symbolObj.amountOfPosition

      symbolObj.percent = +(
        (symbolObj.profit / symbolObj.deposit) *
        100
      ).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

      symbolObj.inPosition = false

      console.log(`Close SHORT with stopLoss: ${symbolObj.closeShort}`)
      sendInfoToUser(`Close SHORT with stopLoss: ${symbolObj.closeShort}`)
      sendInfoToUser(JSON.stringify(symbolObj))

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
