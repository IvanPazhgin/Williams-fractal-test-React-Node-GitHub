// name: без теневая
// VERSION 3.8 на основе 3.7:
// входим по цене highPrice
// const candlesInside = require('../../../common.func/candlesInside')
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')

function alex38test22(
  array,
  depositTemp,
  partOfDeposit,
  multiplier,
  takeProfitUser, // = 0.04
  stopLossUser, // = 0.02
  diffShadowBigUser,
  diffShadowSmallUser,
  delta,
  symbol
) {
  const nameStrategy = 'Стратегия №3.8.2.2: Без теневая'
  // для сигналов
  let canShort = false // есть ли сигнал для входа в шорт или нет
  let whitchSignal = '' // вносим в таблицу  номер сигнала
  // let condition = '' // условие входа в сделку (дополнительная информация в таблицу сделок)

  // для сигнала №1
  let lengthUpShadow = 0 // длина верхней тени на красной свечи
  let lengthDownShadow = 0 // длина нижней тени на красной свечи
  let diffShadow = 0 // отношение верхней тени к нижней тени на красной свечи
  let candleBodyLength = 0 // вычисление длины тела свечи
  let shadow1g = 0 // процент изменения верхней тени 1й зеленой свечи
  let shadow2g = 0 // процент изменения верхней тени 2й зеленой свечи

  // для сделки
  let inShortPosition = false
  let deals = [] // сделка
  let numberOfPosition = 0 // номер сделки
  let positionDown = 0 // цена входа в шорт
  let positionTime = 0 // дата и время входа в позицию
  let amountOfPosition = 0 // для расчета объема входа в сделку
  let indexOfPostion = 0 // индекс точки входа для сдвига SL и TP
  let profit = 0
  let percent = 0
  // let deposit2 = 0
  let deposit = Number(depositTemp)

  let takeProfit = 0
  let stopLoss = 0
  let dateChangeTP = 0 // дата изменения TP
  let dateChangeSL = 0 // дата изменения SL
  let changedTP = false // TP и SL могут быть изменены только 1 раз
  let changedSL = false // TP и SL могут быть изменены только 1 раз

  // let arrayInside
  let pricePrecision = 5 // цена: количество знаков после запятой

  for (let i = 4; i < array.length; i++) {
    if (!inShortPosition) {
      // if (!inShortPosition)
      // findSygnal() // перенести сюда для бота с сигналами в телеграм

      // сигнал № 1: вариант №1 от 26.08.2022 в 20:00
      /*
      if (
        array[i - 3].closePrice > array[i - 3].openPrice && // 1 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 2 свеча зелёная
        array[i - 1].openPrice > array[i - 1].closePrice && // 3 свеча красная
        array[i - 1].volume > array[i - 2].volume // объем 3й красной больше объема 2й зеленой
      ) {
        lengthUpShadow = array[i - 1].highPrice - array[i - 1].openPrice
        lengthDownShadow = array[i - 1].closePrice - array[i - 1].lowPrice
        diffShadow = lengthUpShadow / lengthDownShadow

        // расчет тела свечи, 1000 - это просто коэффициент для удобства
        candleBodyLength =
          (array[i - 1].openPrice / array[i - 1].closePrice - 1) * 1000

        if (
          diffShadow < Number(diffShadowBigUser) && // расчетный diff < пользовательского значения (оставил для автотестов)
          candleBodyLength > 0.8 // взято из таблицы
        ) {
          canShort = true
          whitchSignal = 'сигнал №1'
        }
      }
      */

      // сигнал № 1: вариант №2 от 28.08.2022

      lengthUpShadow = array[i - 1].highPrice - array[i - 1].openPrice
      lengthDownShadow = array[i - 1].closePrice - array[i - 1].lowPrice
      diffShadow = lengthUpShadow / lengthDownShadow

      // расчет тела свечи, 1000 - это просто коэффициент для удобства
      candleBodyLength =
        (array[i - 1].openPrice / array[i - 1].closePrice - 1) * 1000
      if (
        array[i - 3].closePrice > array[i - 3].openPrice && // 1 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 2 свеча зелёная
        array[i - 1].openPrice > array[i - 1].closePrice && // 3 свеча красная
        //array[i - 1].volume > array[i - 2].volume && // объем 3й красной больше объема 2й зеленой
        //diffShadow < 0.3
        //diffShadow < Number(diffShadowBigUser) && // расчетный diff < пользовательского значения (оставил для автотестов)
        // array[i - 1].highPrice / array[i - 1].lowPrice - 1 < 0.04 // отношение хая к лою менее 5%
        candleBodyLength > 0.8 // взято из таблицы
      ) {
        // дополнительные условия от 28.08.2022
        shadow1g = array[i - 3].highPrice / array[i - 3].closePrice - 1 // процент роста верхней тени 1й зеленой свечи
        shadow2g = array[i - 2].highPrice / array[i - 2].closePrice - 1 // процент роста верхней тени 2й зеленой свечи
        if (
          // дополнительные условия от 28.08.2022
          //array[i - 1].lowPrice > array[i - 3].openPrice && // лой 3й красной большое цены открытия 1й зеленой
          shadow1g > shadow2g // % тени 1й зеленой больше % тени второй зеленой
        ) {
          canShort = true
          whitchSignal = 'сигнал №1'
          // condition = '2g 1r k~0.3'
        }
      }

      // сигнал № 2: вариант №2 от 28.08.2022
      if (
        array[i - 4].closePrice > array[i - 4].openPrice && // 1 свеча зелёная
        array[i - 3].closePrice > array[i - 3].openPrice && // 2 свеча зелёная
        //array[i - 2].volume > array[i - 3].volume && // объем 3й красной больше объёма 2й зеленой
        array[i - 2].openPrice > array[i - 2].closePrice && // 3 свеча красная
        array[i - 1].openPrice > array[i - 1].closePrice // 4 свеча красная
        // array[i - 1].highPrice / array[i - 1].lowPrice - 1 < 0.04 &&

        // дополнительные условия от 28.08.2022 (в оповещениях это имеется)
        //array[i - 1].lowPrice > array[i - 4].lowPrice // лой последней красной выше лоя первой зеленой
      ) {
        lengthUpShadow = array[i - 1].highPrice - array[i - 1].openPrice
        lengthDownShadow = array[i - 1].closePrice - array[i - 1].lowPrice
        diffShadow = lengthUpShadow / lengthDownShadow

        // расчет тела свечи, 1000 - это просто коэффициент для удобства
        candleBodyLength =
          (array[i - 1].openPrice / array[i - 1].closePrice - 1) * 1000

        if (
          //diffShadow < Number(diffShadowBigUser) &&
          candleBodyLength > 0.8 // взято из таблицы
        ) {
          canShort = true
          whitchSignal = 'сигнал №2'
        }
      }

      // сигнал № 3
      /*
      if (
        array[i - 5].closePrice > array[i - 5].openPrice && // 1 свеча зелёная
        array[i - 4].closePrice > array[i - 4].openPrice && // 2 свеча зелёная
        array[i - 3].volume > array[i - 4].volume && // объем 3й красной больше объёма 2й зеленой
        array[i - 3].openPrice > array[i - 3].closePrice && // 3 свеча красная
        array[i - 2].openPrice > array[i - 2].closePrice && // 4 свеча красная
        array[i - 1].openPrice > array[i - 1].closePrice && // 5 свеча красная
        // array[i - 1].highPrice / array[i - 1].lowPrice - 1 < 0.04 &&
        diffShadow < Number(diffShadowBigUser)
      ) {
        canShort = true
        whitchSignal = 'сигнал №3'
      }
      */

      // входим в шорт
      if (canShort) {
        if (array[i].highPrice >= array[i - 1].highPrice) {
          positionDown = array[i - 1].highPrice // вход по цене открытия красной [i-1]
          openShortCommon() // функция openShortCommon для входа в сделку с общими полями
        } else {
          // отменяем сигнал
          canShort = false
          whitchSignal = ''
        }
      }

      // функция openShortCommon для входа в сделку с общими полями
      function openShortCommon() {
        canShort = false
        inShortPosition = true
        positionTime = array[i].openTime
        indexOfPostion = i

        takeProfit = positionDown * (1 - takeProfitUser / 100)
        stopLoss = positionDown * (1 + stopLossUser / 100)

        // считаем объем сделки
        amountOfPosition = +(
          (deposit / positionDown) *
          partOfDeposit *
          multiplier
        ).toFixed(8)
      }
      // end of: if (!inShortPosition)
    } //else {
    if (inShortPosition) {
      // в приложении с сигналами:
      // closeShort() // 1. сначала проверяем условие выхода
      // changeTPSL() // 2. по финальной свече меняем SL и TP

      function changeTPSLCommon() {
        if (i >= indexOfPostion + 1) {
          // изменение TP: если мы в просадке
          if (positionDown < array[i].closePrice) {
            if (!changedTP) {
              takeProfit = positionDown
              dateChangeTP = array[i].openTime
              changedTP = true
            }
          } else {
            if (!changedSL) {
              // изменение SL: если мы в прибыли
              stopLoss = positionDown
              dateChangeSL = array[i].openTime
              changedSL = true
            }
          }
        } // if (i >= (indexOfPostion + 2))
      }

      changeTPSLCommon() // проверка общих условий по переносу TP и SL

      // выход из сделки
      // условия выхода из сделки по TP
      if (array[i].lowPrice <= takeProfit) {
        profit = (positionDown - takeProfit) * amountOfPosition
        percent = +((profit / deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки
        // depositTemp += profit
        //deposit2 = +(deposit + profit).toFixed(2)
        dateChangeTP =
          dateChangeTP == 0
            ? (dateChangeTP = '')
            : timestampToDateHuman(dateChangeTP)

        deals[numberOfPosition] = {
          openPosition: 'Sell',
          openPrice: +positionDown.toFixed(pricePrecision),
          openTime: timestampToDateHuman(positionTime),
          amountOfPosition: amountOfPosition,
          closePosition: 'Buy',
          closePrice: +takeProfit.toFixed(pricePrecision),
          closeTime: timestampToDateHuman(array[i].openTime),
          profit: +profit.toFixed(2),
          percent: percent,
          //deposit2: deposit2,
          takeProfit: +takeProfit.toFixed(pricePrecision), // для проверки движка
          stopLoss: +stopLoss.toFixed(pricePrecision), // для проверки движка
          dateChangeTP: dateChangeTP, // запоминаем время переноса TP
          //dateChangeSL: timestampToDateHuman(dateChangeSL), // запоминаем время переноса SL
          //diffShadow: diffShadow,
          whitchSignal: whitchSignal,
          //condition: condition,
        }
        clearPostion()
      } // условия выхода из сделки по TP
      // условия выхода из сделки по SL
      else if (array[i].highPrice >= stopLoss) {
        profit = (positionDown - stopLoss) * amountOfPosition
        percent = +((profit / deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки
        // depositTemp += profit
        //deposit2 = +(deposit + profit).toFixed(2)
        dateChangeSL =
          dateChangeSL == 0
            ? (dateChangeSL = '')
            : timestampToDateHuman(dateChangeSL)

        deals[numberOfPosition] = {
          openPosition: 'Sell',
          openPrice: +positionDown.toFixed(pricePrecision),
          openTime: timestampToDateHuman(positionTime),
          amountOfPosition: amountOfPosition,
          closePosition: 'Buy',
          closePrice: +stopLoss.toFixed(pricePrecision),
          closeTime: timestampToDateHuman(array[i].openTime),
          profit: +profit.toFixed(2),
          percent: percent,
          //deposit2: deposit2,
          takeProfit: +takeProfit.toFixed(pricePrecision), // для проверки движка
          stopLoss: +stopLoss.toFixed(pricePrecision), // для проверки движка
          //dateChangeTP: timestampToDateHuman(dateChangeTP), // запоминаем время переноса TP
          dateChangeSL: dateChangeSL, // запоминаем время переноса SL
          // diffShadow: diffShadow,
          whitchSignal: whitchSignal,
          //condition: condition,
        }
        clearPostion()
      } // отработка выхода из сделки по SL

      function clearPostion() {
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
        dateChangeSL = 0

        // проверка условий выхода из сделки
        changedTP = false // TP и SL могут быть изменены только 1 раз
        changedSL = false // TP и SL могут быть изменены только 1 раз
      }
    } // end of: if (inShortPosition)
  } // for (let i = 4; i < array.length; i++)

  // сбор статистики:
  let globalProfit = 0
  let countOfPositive = 0
  let countOfNegative = 0
  let countOfZero = 0
  deals.forEach(function (item) {
    globalProfit += item.profit
    if (item.profit > 0) {
      countOfPositive++
    } else if (item.profit < 0) {
      countOfNegative++
    } else countOfZero++
  })

  let roi = (globalProfit / deposit) * 100

  const statistics = {
    nameStrategy: nameStrategy,
    depositAtStart: Number(deposit),
    depositAtEnd: Number(deposit) + globalProfit,
    globalProfit: +globalProfit.toFixed(2),
    roi: +roi.toFixed(2),
    allDealsCount: deals.length,
    countOfPositive: countOfPositive,
    countOfNegative: countOfNegative,
    countOfZero: countOfZero,
  }

  return [deals, statistics]
} // function alex38test2

module.exports = alex38test22
