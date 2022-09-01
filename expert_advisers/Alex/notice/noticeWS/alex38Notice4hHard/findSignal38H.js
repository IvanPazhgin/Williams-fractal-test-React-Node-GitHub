const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')

function findSygnal38H(array, symbolObj) {
  // для сигнала №1
  let lengthUpShadow = 0 // длина верхней тени на красной свечи
  let lengthDownShadow = 0 // длина нижней тени на красной свечи
  let diffShadow = 0 // отношение верхней тени к нижней тени на красной свечи
  let candleBodyLength = 0 // вычисление длины тела свечи
  let shadow1g = 0 // процент изменения верхней тени 1й зеленой свечи
  let shadow2g = 0 // процент изменения верхней тени 2й зеленой свечи

  const diffShadowBigUser = 0.62 // Из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625
  const takeProfitConst = 0.03
  const stopLossConst = 0.03

  const partOfDeposit = 0.25 // доля депозита на одну сделку
  const multiplier = 10 // плечо

  const shiftTime = 1000 * 60 * 60 * 4 // сдвиг на одну 4h свечу
  const signalSendingTime = new Date().getTime() // время отправки сигнала

  // проверка условий на вход
  // если входим, то inPosition = true
  for (let i = 3; i < array.length; i++) {
    if (!symbolObj.inPosition) {
      // сигнал №1
      if (
        array[i - 2].closePrice > array[i - 2].openPrice && // 1 свеча зелёная
        array[i - 1].closePrice > array[i - 1].openPrice && // 2 свеча зелёная
        array[i].openPrice > array[i].closePrice && // 3 свеча красная
        array[i].volume > array[i - 1].volume // объем 3й красной больше объема 2й зеленой
      ) {
        // расчет соотношения верхней тени к нижней тени на 3й красной свече
        lengthUpShadow = array[i].highPrice - array[i].openPrice
        lengthDownShadow = array[i].closePrice - array[i].lowPrice
        diffShadow = lengthUpShadow / lengthDownShadow

        candleBodyLength = (array[i].openPrice / array[i].closePrice - 1) * 1000 // расчет тела 3й красной свечи, 1000 - это просто коэффициент для удобства

        // дополнительные условия от 28.08.2022
        shadow1g = array[i - 2].highPrice / array[i - 2].closePrice - 1 // процент роста верхней тени 1й зеленой свечи
        shadow2g = array[i - 1].highPrice / array[i - 1].closePrice - 1 // процент роста верхней тени 2й зеленой свечи
        if (
          diffShadow < diffShadowBigUser && // расчетный diff < пользовательского значения
          candleBodyLength > 0.8 && // взято из таблицы
          // дополнительные условия от 28.08.2022
          array[i].lowPrice > array[i - 2].openPrice && // лой 3й красной большое цены открытия 1й зеленой
          shadow1g > shadow2g // % тени 1й зеленой больше % тени второй зеленой
        ) {
          symbolObj.canShort = true
          symbolObj.whitchSignal = 'Стратегия 3.8 HARD 4h: сигнал №1'
          symbolObj.openShort = array[i].highPrice
          openShortCommon(array[i].openTime)
        } // второй блок if (расчетный)
      } // первый блок if на поиск конфигурации свечей

      // сигнал №2
      if (
        array[i - 3].closePrice > array[i - 3].openPrice && // 1 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 2 свеча зелёная
        array[i - 1].volume > array[i - 2].volume && // объем 3й красной больше объёма 2й зеленой
        array[i - 1].openPrice > array[i - 1].closePrice && // 3 свеча красная
        array[i].openPrice > array[i].closePrice && // 4 свеча красная
        // дополнительные условия от 28.08.2022
        array[i].lowPrice > array[i - 3].lowPrice // лой последней красной выше лоя первой зеленой
      ) {
        // расчет соотношения верхней тени к нижней тени на 4й красной свече
        lengthUpShadow = array[i].highPrice - array[i].openPrice
        lengthDownShadow = array[i].closePrice - array[i].lowPrice
        diffShadow = lengthUpShadow / lengthDownShadow

        candleBodyLength = (array[i].openPrice / array[i].closePrice - 1) * 1000 // расчет тела 4й красной свечи, 1000 - это просто коэффициент для удобства

        if (
          diffShadow < diffShadowBigUser && // расчетный diff < пользовательского значения
          candleBodyLength > 0.8 // взято из таблицы
        ) {
          symbolObj.canShort = true
          symbolObj.whitchSignal = 'Стратегия 3.8 HARD 4h: сигнал №2'
          symbolObj.openShort = array[i].highPrice
          openShortCommon(array[i].openTime)
        } // второй блок if (расчетный)
      } // первый блок if на поиск конфигурации свечей

      // отправляем сообщение в tg о найденном сигнале
      if (symbolObj.canShort) {
        console.log(
          `${symbolObj.symbol}: Нашли сигнал для Open SHORT: ${symbolObj.whitchSignal} (стратегия 3.8 HARD 4h)`
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
          )}\nВремя отправки сообщения: ${timestampToDateHuman(
            signalSendingTime
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
          `${symbolObj.symbol}: Сигнала на вход не было. Ждем следующую свечу (стратегия 3.8 HARD 4h)`
        )
        // sendInfoToUser(`Сигнала на вход не было. \nЖдем следующую свечу`)
      } // if (canShort)
    } // if (!inShortPosition)
  } // for (let i = 4; i < array.length; i++)

  // функция openShortCommon для входа в сделку с общими полями
  function openShortCommon(arrayOpenTime) {
    // symbolObj.sygnalTime = new Date().getTime()
    symbolObj.sygnalTime = arrayOpenTime + shiftTime

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

module.exports = findSygnal38H
