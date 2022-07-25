const { isWsFormattedMarkPriceUpdateArray } = require('binance')
const timestampToDateHuman = require('../Williams_fractal/timestampToDateHuman')

// const takeProfitConst = 0.021 // вынести в config
const stopLossConst = 0.02

// name: без теневая
// VERSION 3.0

function tradeAlex3(
  array,
  deposit,
  partOfDeposit,
  multiplier,
  takeProfitConst
) {
  let positionDown = 0 // цена входа в шорт
  let positionTime = 0 // дата и время входа в позицию

  let takeProfit = 0
  let stopLoss = 0

  let inShortPosition = false

  let deals = [] // сделка
  let numberOfPosition = 0 // номер сделки
  let amountOfPosition = 0 // для расчета объема входа в сделку

  let depositTemp = Number(deposit)

  let profit = 0
  let percent = 0

  let indexOfPostion = 0 // сохраняем № свечки точки входа для дальнейшего изменения SL

  let control = [] // для проверочных данных

  for (let i = 2; i < array.length; i++) {
    // поиск условия для входа в short
    if (!inShortPosition) {
      if (
        // array[i - 2].highPrice < array[i - 1].highPrice && // цена тени зеленой свечи меньше цены тени красной свечи (Это условие ограничивает)
        array[i - 1].openPrice > array[i - 1].closePrice && // берем одну красную свечку
        array[i - 1].openPrice == array[i - 1].highPrice // у которой сверху нет тени
      ) {
        // входим в шорт
        positionDown = array[i - 1].closePrice // входим в сделку на уровне цены закрытия предыдущей свечи
        takeProfit = positionDown * (1 - takeProfitConst / 100)
        stopLoss = positionDown * (1 + stopLossConst)
        positionTime = array[i].openTime
        inShortPosition = true
        indexOfPostion = i

        // считаем объем сделки
        amountOfPosition = +(
          (depositTemp / positionDown) *
          partOfDeposit *
          multiplier
        ).toFixed(8)
      } // отработали условия входа в сделку
    } // if (!inShortPosition)

    if (inShortPosition) {
      // условие изменения SL и TP: ставим только что то одно
      if (i == indexOfPostion + 5) {
        // проверяем на 5й свечке после входа
        // после закрытия 4й свечки
        if (positionDown < array[i].closePrice) {
          takeProfit = positionDown // если сидим в минусе, то переносим TP
        } else {
          stopLoss = positionDown /// если в плюcе, то переносим SL
        }
      }

      // условия выхода из сделки
      if (array[i].lowPrice <= takeProfit) {
        profit = (positionDown - takeProfit) * amountOfPosition
        percent = +((profit / depositTemp) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки
        depositTemp += profit

        deals[numberOfPosition] = {
          openPosition: 'Sell',
          openPrice: positionDown,
          openTime: timestampToDateHuman(positionTime),
          amountOfPosition: amountOfPosition,
          closePosition: 'Buy',
          closePrice: +takeProfit.toFixed(8),
          closeTime: timestampToDateHuman(array[i].openTime),
          profit: +profit.toFixed(2),
          percent: percent,
          deposit: +depositTemp.toFixed(2),
          takeProfit: takeProfit, // для проверки движка
          stopLoss: +stopLoss.toFixed(8), // для проверки движка
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
        indexOfPostion = 0
      } // отработка выхода из сделки по TP
      // далее, если цена пробила SL
      else if (array[i].highPrice >= stopLoss) {
        profit = (positionDown - stopLoss) * amountOfPosition
        percent = +((profit / depositTemp) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки
        depositTemp += profit

        deals[numberOfPosition] = {
          openPosition: 'Sell',
          openPrice: positionDown,
          openTime: timestampToDateHuman(positionTime),
          amountOfPosition: amountOfPosition,
          closePosition: 'Buy',
          closePrice: +stopLoss.toFixed(8),
          closeTime: timestampToDateHuman(array[i].openTime),
          profit: +profit.toFixed(2),
          percent: percent,
          deposit: +depositTemp.toFixed(2),
          takeProfit: takeProfit, // для проверки движка
          stopLoss: +stopLoss.toFixed(8), // для проверки движка
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
        indexOfPostion = 0
      } // отработка выхода из сделки по SL
    } // if (inShortPosition)
  } // for (let i = 4; i < array.length; i++)
  return deals
}

module.exports = tradeAlex3
