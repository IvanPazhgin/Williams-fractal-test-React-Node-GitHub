const timestampToDateHuman = require('../Williams_fractal/timestampToDateHuman')

// name: без теневая
// VERSION 3.5
// по скриншотам в tg 27.07.2022

function tradeAlex3(
  array,
  deposit,
  partOfDeposit,
  multiplier,
  takeProfitUser,
  stopLossUser,
  diffShadowBigUser,
  diffShadowSmallUser
) {
  // для сделки
  const stopLossConst = 0.02
  const takeProfitConst = 0.04
  let depositTemp = Number(deposit)
  let inShortPosition = false
  let deals = [] // сделка
  let positionDown = 0 // цена входа в шорт
  let positionTime = 0 // дата и время входа в позицию
  let takeProfit = 0
  let stopLoss = 0
  let dateChangeTP = 0 // дата изменения TP
  let dateChangeSL = 0 // дата изменения SL
  let numberOfPosition = 0 // номер сделки
  let amountOfPosition = 0 // для расчета объема входа в сделку
  let profit = 0
  let percent = 0

  // для сигналов
  let canShort = false // есть ли сигнал для входа в шорт или нет
  let whitchSignal = '' // вносим в таблицу  номер сигнала

  // для сигнала №1
  let lengthUpShadow = 0 // длина верхней тени на красной свечи
  let lengthDownShadow = 0 // длина нижней тени на красной свечи
  let diffShadow = 0 // отношение верхней тени к нижней тени на красной свечи

  // для сигнала №2
  let lengthOfRed = 0 // Длина тела красной свечи
  let lengthOfGreen = 0 // Длина тела зеленойсвечи
  let diffLength = 0

  for (let i = 4; i < array.length; i++) {
    if (!inShortPosition) {
      // сигнал №1
      lengthUpShadow = array[i - 1].highPrice - array[i - 1].openPrice
      lengthDownShadow = array[i - 1].closePrice - array[i - 1].lowPrice
      diffShadow = lengthUpShadow / lengthDownShadow
      if (
        array[i - 4].closePrice > array[i - 4].openPrice && // 1 свеча зеленая
        array[i - 3].closePrice > array[i - 3].openPrice && // 2 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 3 свеча зелёная
        array[i - 1].openPrice > array[i - 1].closePrice && // 4 свеча красная
        diffShadow < Number(diffShadowBigUser) // расчетный diff < пользовательского значения
      ) {
        canShort = true
        whitchSignal = 'сигнал №1'
      }

      // сигнал №2
      lengthOfGreen = array[i - 2].closePrice - array[i - 2].openPrice
      lengthOfRed = array[i - 1].openPrice - array[i - 1].closePrice
      if (
        array[i - 2].closePrice > array[i - 2].openPrice && // 3 свеча зелёная
        array[i - 1].openPrice > array[i - 1].closePrice && // 4 свеча красная
        diffShadow < Number(diffShadowBigUser) && // расчетный diff < пользовательского значения
        lengthOfRed < lengthOfGreen // тело красной меньше тела зеленой
      ) {
        canShort = true
        whitchSignal = 'сигнал №2'
      }

      // сигнал №3
      // на красной верхняя тень сильно меньше нижней тени. Низкий коэффициент. Задает пользователь
      if (
        array[i - 1].openPrice > array[i - 1].closePrice && // 4 свеча красная
        diffShadow < Number(diffShadowSmallUser) // расчетный diff < пользовательского значения
      ) {
        canShort = true
        whitchSignal = 'сигнал №3'
      }

      // входим в шорт
      if (canShort) {
        canShort = false
        inShortPosition = true
        positionDown = array[i - 1].closePrice // вход по цене закрытия красной [i-1]
        positionTime = array[i].openTime

        takeProfit = positionDown * (1 - takeProfitConst)
        stopLoss = positionDown * (1 + stopLossConst)

        // считаем объем сделки
        amountOfPosition = +(
          (depositTemp / positionDown) *
          partOfDeposit *
          multiplier
        ).toFixed(8)
      }
    } // if (!inShortPosition)
    else if (inShortPosition) {
      // чтобы TP и SL проверялись переносились как мининмум на следующей свече:
      // вариант №1 решения: между inShortPosition и inShortPosition стоит else
      // вариант №2 решения: i >= indexOfPostion + 1, но тогда тоже самое надо прописывать и для условия выхода из сделки

      // проверка SL и TP на предмет сдвига: если любая следующая свеча - зеленая
      if (array[i].closePrice > array[i].openPrice) {
        // изменение TP: если мы в просадке
        if (positionDown < array[i].closePrice) {
          takeProfit = positionDown
          dateChangeTP = array[i].openTime
        } else {
          // изменение SL: если мы в прибыли

          stopLoss = positionDown
          dateChangeSL = array[i].openTime
        }
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
      } // отработка выхода из сделки по SL
    } // if (inShortPosition)
  } // for (let i = 4; i < array.length; i++)

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
} // function tradeAlex3()

module.exports = tradeAlex3
