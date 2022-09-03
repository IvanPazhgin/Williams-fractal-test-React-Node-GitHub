// name: без теневая
// VERSION 3.11.3
// входим на середине верхней тени красной
/*
2 зеленых 1 красная.  VOl 1 зленой больше 2 зеленой. Верхняя тень 2 зеленой меньше верхней тени 1 зеленой. Верхняя тень красной меньше верхней тени 2 зеленой. Вход на середине верхней тени красной
*/
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')

function alex311test3(
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
  const nameStrategy = 'Стратегия №3.11.3: Без теневая 4h'

  // для сигналов
  let canShort = false // есть ли сигнал для входа в шорт или нет
  let whitchSignal = '' // вносим в таблицу  номер сигнала
  // let condition = '' // условие входа в сделку (дополнительная информация в таблицу сделок)

  // для сигнала №1
  let shadow1g = 0 // процент изменения верхней тени 1й зеленой свечи
  let shadow2g = 0 // процент изменения верхней тени 2й зеленой свечи
  let shadow3r = 0 // процент изменения верхней тени 3й зеленой свечи
  let middleOfShadow = 0 // середина верхней тени красной

  let shadowDown2g = 0 // процент изменения нижней тени 2й зеленой свечи
  let shadowDown3r = 0 // процент изменения нижней тени 3й зеленой свечи

  let body1g = 0 // процент всей 1й зеленой свечи
  let body2g = 0 // процент всей 2й зеленой свечи

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

  for (let i = 3; i < array.length; i++) {
    if (!inShortPosition) {
      // if (!inShortPosition)
      // сигнал № 1: вариант №3 от 01.09.2022

      if (
        array[i - 3].closePrice > array[i - 3].openPrice && // 1 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 2 свеча зелёная
        array[i - 1].openPrice > array[i - 1].closePrice && // 3 свеча красная
        array[i - 3].volume < array[i - 2].volume && // объем 2й зеленой больше объема 1й зеленой
        array[i - 1].lowPrice > array[i - 2].openPrice // лой 3й красной большей цены открытия 2й зеленой
      ) {
        shadow1g = array[i - 3].highPrice / array[i - 3].closePrice - 1 // процент роста верхней тени 1й зеленой свечи
        shadow2g = array[i - 2].highPrice / array[i - 2].closePrice - 1 // процент роста верхней тени 2й зеленой свечи
        shadow3r = array[i - 1].highPrice / array[i - 1].openPrice - 1 // процент роста верхней тени 3й красной свечи

        shadowDown2g = array[i - 2].openPrice / array[i - 2].lowPrice - 1 // процент роста нижней тени 2й зеленой свечи
        shadowDown3r = array[i - 1].closePrice / array[i - 1].lowPrice - 1 // процент роста нижней тени 3й красной свечи

        body1g = array[i - 3].highPrice / array[i - 3].lowPrice // % изменения цены на 1й зеленой свече
        body2g = array[i - 2].highPrice / array[i - 2].lowPrice // % изменения цены на 2й зеленой свече
        if (
          shadow1g > shadow2g && // % тени 1й зеленой больше тени 2й зеленой
          shadow2g > shadow3r && // в общем: верхние тени идут на убывание
          shadowDown2g > shadowDown3r && // нижние тени идут на убывание
          body1g < body2g
        ) {
          canShort = true
          whitchSignal = 'сигнал №1'
          //middleOfShadow = (array[i - 1].highPrice + array[i - 1].openPrice) / 2
          middleOfShadow = array[i - 1].highPrice
        }
      }

      // входим в шорт
      if (canShort) {
        switch (whitchSignal) {
          case 'сигнал №1':
            if (array[i].highPrice >= middleOfShadow) {
              positionDown = middleOfShadow // вход по цене открытия красной [i-1]
              openShortCommon() // функция openShortCommon для входа в сделку с общими полями
            } else {
              // отменяем сигнал
              canShort = false
              whitchSignal = ''
            }
            break
          case 'сигнал №2':
            if (array[i].highPrice >= array[i - 1].highPrice) {
              positionDown = array[i - 1].highPrice // вход по цене закрытия красной [i-1]
              openShortCommon() // функция openShortCommon для входа в сделку с общими полями
            } else {
              // отменяем сигнал
              canShort = false
              whitchSignal = ''
            }
            break
          default:
        } // switch (whitchSignal)
      } // if (canShort)

      // функция openShortCommon для входа в сделку с общими полями
      function openShortCommon() {
        canShort = false
        inShortPosition = true
        positionTime = array[i].openTime
        indexOfPostion = i

        middleOfShadow = 0

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
        if (i >= indexOfPostion + 2) {
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
}

module.exports = alex311test3
