const { sendInfoToUser } = require('../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')

// function findSygnal(array, symbolObjFirstState) {
function findSygnal37(array, symbolObj) {
  // для сигнала №1
  let lengthUpShadow = 0 // длина верхней тени на красной свечи
  let lengthDownShadow = 0 // длина нижней тени на красной свечи
  let diffShadow = 0 // отношение верхней тени к нижней тени на красной свечи

  const diffShadowBigUser = 0.007 // Саша так натестировал
  const takeProfitConst = 0.04
  const stopLossConst = 0.02
  const partOfDeposit = 0.25 // доля депозита на одну сделку
  const multiplier = 10 // плечо

  // проверка условий на вход
  // если входим, то inPosition = true
  for (let i = 3; i < array.length; i++) {
    if (!symbolObj.inPosition) {
      // сигнал №1
      lengthUpShadow = array[i].highPrice - array[i].openPrice
      lengthDownShadow = array[i].closePrice - array[i].lowPrice
      diffShadow = lengthUpShadow / lengthDownShadow

      if (
        array[i - 2].closePrice > array[i - 2].openPrice && // 1 свеча зелёная
        array[i - 1].closePrice > array[i - 1].openPrice && // 2 свеча зелёная
        array[i].openPrice > array[i].closePrice && // 3 свеча красная
        array[i].volume > array[i - 1].volume && // объем 3й красной больше объема 2й зеленой
        array[i - 1].openPrice > array[i].closePrice && // цена открытия 2й зеленой выше цены закрытий 3й красной
        diffShadow < diffShadowBigUser // расчетный diff < пользовательского значения
      ) {
        symbolObj.canShort = true
        symbolObj.whitchSignal = 'Стратегия 3.7: сигнал №1'
        symbolObj.openShort = array[i].closePrice
        openShortCommon()
      }

      // входим в шорт - убрать в главную функцию
      if (symbolObj.canShort) {
        console.log(
          `${symbolObj.symbol}: Open SHORT по сигналу: ${symbolObj.whitchSignal}`
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
          })%\n\nЖдем цену на рынке для входа в SHORT...`
        )
        //sendInfoToUser(JSON.stringify(symbolObj))
      } else {
        console.log(
          `${symbolObj.symbol}: Сигнала на вход не было. Ждем следующую свечу`
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

module.exports = findSygnal37
