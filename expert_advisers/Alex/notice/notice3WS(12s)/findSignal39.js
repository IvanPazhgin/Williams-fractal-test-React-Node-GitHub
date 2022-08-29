const { sendInfoToUser } = require('../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')

function findSygnal39(array, symbolObj) {
  // для сигнала №1
  let candleBodyLength = 0 // вычисление длины тела свечи
  let middleOfUpperShadow = 0 // середина верхней тени

  const takeProfitConst = 0.015
  const stopLossConst = 0.015

  const partOfDeposit = 0.25 // доля депозита на одну сделку
  const multiplier = 10 // плечо

  // проверка условий на вход
  // если входим, то inPosition = true
  for (let i = 3; i < array.length; i++) {
    if (!symbolObj.inPosition) {
      // сигнал №1

      // расчет тела свечи, 1000 - это просто коэффициент для удобства
      candleBodyLength = (array[i].openPrice / array[i].closePrice - 1) * 1000

      if (
        array[i - 3].closePrice > array[i - 3].openPrice && // 1 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 2 свеча зелёная
        array[i - 1].closePrice > array[i - 1].openPrice && // 3 свеча зелёная
        array[i].openPrice > array[i].closePrice && // 4 свеча красная
        array[i - 1].volume > array[i - 2].volume && // объем 3й зеленой больше объема 2й зеленой
        array[i].volume > array[i - 1].volume && // объем 4й красной больше объема 3й зеленой
        candleBodyLength > 0.8 && // взято из таблицы
        // дополнительные условия от 28.08.2022
        array[i].lowPrice > array[i - 2].openPrice // лой 4й красной больше цены открытия 2й зеленой
      ) {
        symbolObj.canShort = true
        symbolObj.whitchSignal = 'Стратегия 3.9: сигнал №1'
        //middleOfUpperShadow = (array[i].openPrice + array[i].highPrice) / 2
        //symbolObj.openShort = middleOfUpperShadow
        symbolObj.openShort = array[i].highPrice
        openShortCommon()
      }

      // входим в шорт - убрать в главную функцию
      if (symbolObj.canShort) {
        console.log(
          `${symbolObj.symbol}: Open SHORT по сигналу: ${symbolObj.whitchSignal} (стратегия 3.9)`
        )

        sendInfoToUser(
          `---=== НОВЫЙ СИГНАЛ ===---\n${symbolObj.nameStrategy}\nСработал: ${
            symbolObj.whitchSignal
          }\n\nМонета: ${symbolObj.symbol}\nЦена для входа в SHORT: ${
            symbolObj.openShort
          }\n\nВремя сигнальной свечи: ${timestampToDateHuman(
            array[i].openTime
          )}\nВремя сигнала: ${timestampToDateHuman(
            symbolObj.sygnalTime
          )}\n\nКол-во монет: ${symbolObj.amountOfPosition}\nВзяли ${
            partOfDeposit * 100
          }% c плечом ${multiplier}x от депозита = ${
            symbolObj.deposit
          } USDT\n\nПоставь:\nTake Profit: ${symbolObj.takeProfit} (${
            takeProfitConst * 100
          }%)\nStop Loss: ${symbolObj.stopLoss} (${
            stopLossConst * 100
          }%)\n\nЖдем цену на рынке для входа в SHORT...`
        )
        //sendInfoToUser(JSON.stringify(symbolObj))
      } else {
        console.log(
          `${symbolObj.symbol}: Сигнала на вход не было. Ждем следующую свечу (стратегия 3.9).`
        )
        // sendInfoToUser(`Сигнала на вход не было. \nЖдем следующую свечу`)
      } // if (canShort)
    } // if (!inShortPosition)
  } // for (let i = 4; i < array.length; i++)

  // функция openShortCommon для входа в сделку с общими полями
  function openShortCommon() {
    symbolObj.sygnalTime = new Date().getTime()

    // вычисляем уровень take profit
    symbolObj.takeProfit = +(
      symbolObj.openShort *
      (1 - takeProfitConst)
    ).toFixed(5)

    // вычисляем уровень Stop Loss
    symbolObj.stopLoss = +(symbolObj.openShort * (1 + stopLossConst)).toFixed(5)

    // считаем объем сделки
    symbolObj.amountOfPosition = +(
      (symbolObj.deposit / symbolObj.openShort) *
      partOfDeposit *
      multiplier
    ).toFixed(8)
  }

  return symbolObj
}

module.exports = findSygnal39
