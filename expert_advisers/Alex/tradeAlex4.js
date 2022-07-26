// будет работать на: 1h
// тестируем на: crvusdt
// смотри пример: 2022.07.06 в 00:00

const timestampToDateHuman = require('../Williams_fractal/timestampToDateHuman')

function tradeAlex4(
  array,
  deposit,
  partOfDeposit,
  multiplier,
  takeProfitConst,
  stopLossConst
) {
  let inShortPosition = false

  let shadowLength1Green = 0 // длина верхней тени 1й зеленой свечи
  let shadowLength2Green = 0 // длина верхней тени 2й зеленой свечи
  let diffShadow = 0 // разница теней между 1 и 2 зеленой
  let middle2Green = 0 // середина тела 2й зеленой свечи
  let middle3Red = 0 // середина тела 3й красной свечи
  let positionDown = 0

  let indexOfPostion = 0 // сохраняем № свечки точки входа для дальнейшего изменения SL
  let dateChangeTP = 0 // дата изменения TP
  let dateChangeSL = 0 // дата изменения SL

  let deals = [] // сделки
  let depositTemp = Number(deposit)

  let profit = 0
  let percent = 0
  let numberOfPosition = 0 // номер сделки
  let amountOfPosition = 0 // для расчета объема входа в сделку

  for (let i = 3; i < array.length; i++) {
    if (!inShortPosition) {
      // подготовка условий для входа
      shadowLength1Green = array[i - 3].highPrice - array[i - 3].closePrice
      shadowLength2Green = array[i - 2].highPrice - array[i - 2].closePrice
      diffShadow = shadowLength2Green / shadowLength1Green
      middle2Green = (array[i - 2].closePrice + array[i - 2].openPrice) / 2

      // проверка общих условий для входа
      if (
        array[i - 3].openPrice < array[i - 3].closePrice && // 1я свеча - зеленая
        array[i - 2].openPrice < array[i - 2].closePrice && // 2я свеча - зеленая
        diffShadow > 0.3 && // если тень 2й зеленой меньше на 30%  1й зеленой и более
        shadowLength2Green > 0 && // у 2й зеленой есть хоть какая-нибудь минимальная тень
        array[i - 1].closePrice < array[i - 1].openPrice && // 3я свеча - красная
        middle2Green < array[i - 1].closePrice // цена закрытия 3й красной свечи > половины тела 2й зеленой свечи
      ) {
        // если vol 3 > vol 2, то вход на середине тела 3й красной свечи
        if (array[i - 3].volume > array[i - 2].volume) {
          middle3Red = (array[i - 1].closePrice + array[i - 1].openPrice) / 2 // середина тела 3й красной свечи
          positionDown = middle3Red
          takeProfit = positionDown * (1 - takeProfitConst / 100)
          stopLoss = positionDown * (1 + stopLossConst / 100)
          positionTime = array[i].openTime
          inShortPosition = true
          indexOfPostion = i

          // считаем объем сделки
          amountOfPosition = +(
            (depositTemp / positionDown) *
            partOfDeposit *
            multiplier
          ).toFixed(8)
        } // если vol 3 > vol 2, то вход на середине тела 3й красной свечи
        // иначе цена входа = close 3й свечи
        else {
          positionDown = array[i - 1].closePrice
          takeProfit = positionDown * (1 - takeProfitConst / 100)
          stopLoss = positionDown * (1 + stopLossConst / 100)
          positionTime = array[i].openTime
          inShortPosition = true
          indexOfPostion = i

          // считаем объем сделки
          amountOfPosition = +(
            (depositTemp / positionDown) *
            partOfDeposit *
            multiplier
          ).toFixed(8)
        } // иначе цена входа = close 3й свечи
      } // проверка общих условий для входа
      // tp, sl
    } // if (!inShortPosition)

    if (inShortPosition) {
      // изменение TP
      if (i == indexOfPostion + 5 && positionDown < array[i].closePrice) {
        takeProfit = positionDown
        dateChangeTP = array[i].openTime
      }

      // изменение SL
      if (i == indexOfPostion + 5 && positionDown > array[i].closePrice) {
        stopLoss = positionDown
        dateChangeSL = array[i].openTime
      }

      // условия выхода из сделки по TP
      if (array[i].lowPrice <= takeProfit) {
        profit = (positionDown - takeProfit) * amountOfPosition
        percent = +((profit / depositTemp) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки
        depositTemp += profit
        dateChangeTP =
          dateChangeTP == 0
            ? (dateChangeTP = '')
            : timestampToDateHuman(dateChangeTP)

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
        dateChangeTP = 0
      } // условия выхода из сделки по TP
      // условия выхода из сделки по SL
      else if (array[i].highPrice >= stopLoss) {
        profit = (positionDown - stopLoss) * amountOfPosition
        percent = +((profit / depositTemp) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки
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
        dateChangeSL = 0
      } // отработка выхода из сделки по SL
    } // if (inShortPosition)
  } // for (let i = 3; i < array.length; i++)

  // сбор статистики:
  let depositAtEnd = deals[deals.length - 1].deposit
  let globalProfit = depositAtEnd - deposit
  let roi = (globalProfit / deposit) * 100

  let countOfPositive = 0
  let countOfNegative = 0
  let countOfZero = 0
  deals.forEach(function (item) {
    if (item.profit > 0) {
      countOfPositive++
    } else if (item.profit < 0) {
      countOfNegative++
    } else countOfZero++
  })

  const statistics = {
    depositAtStart: Number(deposit),
    depositAtEnd: depositAtEnd,
    globalProfit: +globalProfit.toFixed(2),
    roi: +roi.toFixed(2),
    allDealsCount: deals.length,
    countOfPositive: countOfPositive,
    countOfNegative: countOfNegative,
    countOfZero: countOfZero,
  }

  return [deals, statistics]
}

module.exports = tradeAlex4

/*

условия для входа:
1. 1я свеча - зеленая
2. 2я свеча - зеленая
3. верхняя тень 2й зеленой свечи должна быть на 30% меньше верхней тени 1й зеленой свечи (сравниваем длину теней)
4. если у второй зеленой свечи нет верхней тени, то не входим в сделку. Иными словами: тень должна быть как минимум маленькая.
5. 3я свеча - красная
х 6. цена close 3 красной свечи должно быть на 10% выше цены открытия 2 зеленой свечи
6. цена close 3 красной свечи > половины тела 2й зеленой свечи

тогда вход:
если vol 3 > vol 2, то вход на середине тела 3 красной свечи

иначе вход:
вход на 4й свече, цена входа - close 3й свечи
ставим TP 4% и SL 3%


изменение TP и SL:
на 5й свече (в момент ее открытия):
если мы сидим в плюсе, то переносим SL
если мы сидим в минусе, то переносим TP
*/
