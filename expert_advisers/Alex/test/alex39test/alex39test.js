// name: без теневая
// VERSION 3.9
// входим по цене highPrice
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')

async function alex39test(
  array,
  depositTemp,
  partOfDeposit,
  multiplier,
  takeProfitUser, // = 0.04
  stopLossUser, // = 0.02
  symbol
) {
  // для сигналов
  let canShort = false // есть ли сигнал для входа в шорт или нет
  let whitchSignal = '' // вносим в таблицу  номер сигнала

  // для сигнала №1
  let middleOfUpperShadow = 0 // середина верхней тени
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
  //let deposit2 = 0
  let deposit = Number(depositTemp)

  let takeProfit = 0
  let stopLoss = 0
  let dateChangeTP = 0 // дата изменения TP
  let dateChangeSL = 0 // дата изменения SL
  let changedTP = false // TP и SL могут быть изменены только 1 раз
  let changedSL = false // TP и SL могут быть изменены только 1 раз

  //let arrayInside
  let pricePrecision = 5 // цена: количество знаков после запятой

  //for (let i = 3; i < array.length; i++) {
  for (let i = 4; i < array.length; i++) {
    if (!inShortPosition) {
      // if (!inShortPosition)
      // findSygnal() // перенести сюда для бота с сигналами в телеграм

      // расчет тела свечи, 1000 - это просто коэффициент для удобства
      candleBodyLength =
        (array[i - 1].openPrice / array[i - 1].closePrice - 1) * 1000
      // сигнал № 1: начальная версия
      /*
      if (
        array[i - 3].closePrice > array[i - 3].openPrice && // 1 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 2 свеча зелёная
        array[i - 1].openPrice > array[i - 1].closePrice && // 3 свеча красная
        array[i - 1].volume > array[i - 2].volume && // объем красной больше объема 2й зеленой
        candleBodyLength > 0.8 // взято из таблицы
      ) {
        canShort = true
        whitchSignal = 'сигнал №1'
        middleOfUpperShadow =
          (array[i - 1].openPrice + array[i - 1].highPrice) / 2
        // console.log(`есть сигнал, ${timestampToDateHuman(array[i - 1].openTime)}, middleOfUpperShadow = ${middleOfUpperShadow}`)
      }
      */

      // сигнал № 1: изменения 26.08.2022 в 20:00
      if (
        // array[i - 4].closePrice > array[i - 4].openPrice && // 1 свеча зелёная
        array[i - 3].closePrice > array[i - 3].openPrice && // 2 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 3 свеча зелёная
        array[i - 1].openPrice > array[i - 1].closePrice && // 4 свеча красная
        array[i - 2].volume > array[i - 3].volume && // объем 3й зеленой больше объема 2й зеленой
        array[i - 1].volume > array[i - 2].volume && // объем 4й красной больше объема 3й зеленой
        candleBodyLength > 0.8 && // взято из таблицы
        // дополнительные условия от 28.08.2022
        array[i - 1].lowPrice > array[i - 3].openPrice // лой 4й красной больше цены открытия 2й зеленой
      ) {
        // дополнительные условия от 28.08.2022
        shadow1g = array[i - 3].highPrice / array[i - 3].closePrice - 1 // процент роста верхней тени 2й зеленой свечи
        shadow2g = array[i - 2].highPrice / array[i - 2].closePrice - 1 // процент роста верхней тени 3й зеленой свечи
        if (
          shadow1g > shadow2g // % тени 1й зеленой больше % тени второй зеленой
        ) {
          canShort = true
          whitchSignal = 'сигнал №1'
          //middleOfUpperShadow = (array[i - 1].openPrice + array[i - 1].highPrice) / 2
          // console.log(`есть сигнал, ${timestampToDateHuman(array[i - 1].openTime)}, middleOfUpperShadow = ${middleOfUpperShadow}`)
        }
      }

      // входим в шорт
      if (canShort) {
        switch (whitchSignal) {
          case 'сигнал №1':
            //if (array[i].highPrice >= middleOfUpperShadow) {
            if (array[i].highPrice >= array[i - 1].highPrice) {
              //positionDown = middleOfUpperShadow
              positionDown = array[i - 1].highPrice
              // console.log(`вошли в шорт, ${timestampToDateHuman(array[i].openTime)}, цена = ${positionDown}`)
              openShortCommon() // функция openShortCommon для входа в сделку с общими полями
            } else {
              // отменяем сигнал
              canShort = false
              whitchSignal = ''
              middleOfUpperShadow = 0
            }
            break

          default:
          // console.log('сигнала не было')
          // можно отправить сообщение в telegram bot для тестов на первое время
        } // switch (whitchSignal)
      } // if (canShort)

      // функция openShortCommon для входа в сделку с общими полями
      function openShortCommon() {
        canShort = false
        inShortPosition = true
        positionTime = array[i].openTime
        //console.log(`входим time: ${timestampToDateHuman(array[i].openTime)}`) // !! проверка
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
        //if (i >= indexOfPostion + 2) {
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
        //} // if (i >= (indexOfPostion + 2))
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
} // function alex39test

module.exports = alex39test
