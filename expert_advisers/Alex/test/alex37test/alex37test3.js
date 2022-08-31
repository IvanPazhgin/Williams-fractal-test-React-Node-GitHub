// name: без теневая
// VERSION 3.7
// рекомендуемая монета BLZUSDT
// отмена сигнала: если на текущей не входим, значит на следующей финальной свечке отменяем сигнал
// отменил выход по минуткам
// const candlesInside = require('../../common.func/candlesInside')
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')

async function alex37test3(
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
  // для сигналов
  let canShort = false // есть ли сигнал для входа в шорт или нет
  let whitchSignal = '' // вносим в таблицу  номер сигнала

  // для сигнала №1
  let lengthUpShadow = 0 // длина верхней тени на красной свечи
  let lengthDownShadow = 0 // длина нижней тени на красной свечи
  let diffShadow = 0 // отношение верхней тени к нижней тени на красной свечи

  // для сигнала №4
  // let coefficient = 0 // коэффициент корректировки точки входа относительно уровня сигнальной свечи

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
  let deposit2 = 0
  let deposit = Number(depositTemp)

  let takeProfit = 0
  let stopLoss = 0
  let dateChangeTP = 0 // дата изменения TP
  let dateChangeSL = 0 // дата изменения SL
  let changedTP = false // TP и SL могут быть изменены только 1 раз
  let changedSL = false // TP и SL могут быть изменены только 1 раз

  //let arrayInside
  let pricePrecision = 5 // цена: количество знаков после запятой

  for (let i = 3; i < array.length; i++) {
    if (!inShortPosition) {
      // if (!inShortPosition)
      // findSygnal() // перенести сюда для бота с сигналами в телеграм

      // сигнал №1
      lengthUpShadow = array[i - 1].highPrice - array[i - 1].openPrice
      lengthDownShadow = array[i - 1].closePrice - array[i - 1].lowPrice
      diffShadow = lengthUpShadow / lengthDownShadow
      if (
        array[i - 3].closePrice > array[i - 3].openPrice && // 1 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 2 свеча зелёная
        array[i - 1].openPrice > array[i - 1].closePrice && // 3 свеча красная
        array[i - 1].volume > array[i - 2].volume && // объем 3й красной больше объема 2й зеленой
        array[i - 2].openPrice > array[i - 1].closePrice && // цена открытия 2й зеленой выше цены закрытия 3й красной
        //diffShadow < 0.3
        diffShadow < Number(diffShadowBigUser) // расчетный diff < пользовательского значения (оставил для автотестов)
      ) {
        // проверить 1 зеленую свечку (см. скрин в телеге)
        // 1 green candle
        // console.log(`\narray[i - 3].closePrice= ${array[i - 3].closePrice}, time: ${timestampToDateHuman(array[i - 3].openTime)}`)
        // console.log(`array[i - 3].openPrice = ${array[i - 3].openPrice}, time: ${timestampToDateHuman(array[i - 3].openTime)}`)
        // 2 green candle
        // console.log(`array[i - 2].closePrice= ${array[i - 2].closePrice}, time: ${timestampToDateHuman(array[i - 2].openTime)}`)
        // console.log(`array[i - 2].openPrice = ${array[i - 2].openPrice}, time: ${timestampToDateHuman(array[i - 2].openTime)}`)
        // 3 red candle
        // console.log(`array[i - 1].closePrice= ${array[i - 1].closePrice}, time: ${timestampToDateHuman(array[i - 1].openTime)}`)
        // console.log(`array[i - 1].openPrice = ${array[i - 1].openPrice}, time: ${timestampToDateHuman(array[i - 1].openTime)}`)
        // проверка: конец

        canShort = true
        whitchSignal = 'сигнал №1'
      }

      // сигнал №2 пока убираем

      // сигнал №3

      if (
        array[i - 3].closePrice > array[i - 3].openPrice && // 1 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 2 свеча зелёная
        array[i - 1].openPrice > array[i - 1].closePrice && // 3 свеча красная
        array[i - 1].openPrice == array[i - 1].highPrice // и у красной свечи нет тени
        //diffShadow < 0.4 // отношение теней составляет 0.05%
      ) {
        canShort = true
        whitchSignal = 'сигнал №3'
      }

      // сигнал №4
      // на красной верхняя тень сильно меньше нижней тени. Низкий коэффициент. Задает пользователь

      if (
        array[i - 1].openPrice > array[i - 1].closePrice && // 1 свеча красная
        //diffShadow < 0.3
        diffShadow < Number(diffShadowSmallUser) // расчетный diff < пользовательского значения
      ) {
        canShort = true
        whitchSignal = 'сигнал №4'
      }

      // входим в шорт
      if (canShort) {
        switch (whitchSignal) {
          case 'сигнал №1':
            // входим ниже array[i - 1].openPrice на дельту: coefficient = array[i].openPrice * (1 - delta / 100)
            if (
              array[i].highPrice >
              array[i - 1].closePrice * (1 - delta / 100)
            ) {
              //console.log('вход по сигналу №1')
              //console.log(`точка входа по цене сигнальной свечи, ее time: ${timestampToDateHuman(array[i - 1].openTime)}`) // !! проверка
              positionDown = array[i - 1].closePrice * (1 - delta / 100) // вход по цене открытия красной [i-1]
              openShortCommon() // функция openShortCommon для входа в сделку с общими полями
            } else {
              // отменяем сигнал
              canShort = false
              whitchSignal = ''
            }
            break
          case 'сигнал №3':
            //console.log('вход по сигналу №3')
            positionDown = array[i - 1].closePrice // вход по цене закрытия красной [i-1]
            openShortCommon() // функция openShortCommon для входа в сделку с общими полями
            break
          case 'сигнал №4':
            // проверка: если на текущей свече цена была выше array[i-1].closePrice (продумать отмену сигнала на след. свече для оповещений)

            // входим ниже array[i - 1].openPrice на дельту: coefficient = array[i].openPrice * (1 - delta / 100)
            if (
              array[i].highPrice >
              array[i - 1].closePrice * (1 - delta / 100) // в первой версии был вход по цене ОТКРЫТИЯ
            ) {
              // !!!  в реальном роботе проверить if (close price now < open price сигнальной свечи), то добавляем условие ниже. Главное, чтобы это условие и условие выше не мешали друг другу
              //console.log('вход по сигналу №4')
              //console.log(`array[i].highPrice = ${array[i].highPrice}, время: ${timestampToDateHuman(array[i].openTime)}`)
              //console.log(`array[i - 1].closePrice = ${array[i - 1].closePrice}, время: ${timestampToDateHuman(array[i - 1].openTime)}`)
              positionDown = array[i - 1].closePrice * (1 - delta / 100) // вход по цене открытия красной [i-1]. // в первой версии был вход по цене ОТКРЫТИЯ
              openShortCommon() // функция openShortCommon для входа в сделку с общими полями
            } else {
              // отменяем сигнал
              canShort = false
              whitchSignal = ''
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

      // Провека условий для изменения SL и TP
      switch (whitchSignal) {
        case 'сигнал №1':
          //console.log('сигнал №1: меняем TP и SL')
          changeTPSLCommon()
          break
        case 'сигнал №3':
          //console.log('сигнал №3: меняем TP и SL')
          changeTPSLCommon()
          break
        case 'сигнал №4':
          //console.log('сигнал №4: меняем TP и SL')
          //changeTPSLCommon()
          // первая проверка TP: если свеча зеленая, на которой зашли, т.е. closePrice[i] > OpenShort, тогда меняем TP в БУ
          if (i == indexOfPostion + 1) {
            if (
              array[indexOfPostion].closePrice >
                array[indexOfPostion].openPrice && // если свеча зеленая, на которой зашли
              array[indexOfPostion].closePrice > positionDown // closePrice[i] > OpenShort
            ) {
              if (!changedTP) {
                takeProfit = positionDown
                dateChangeTP = array[i].openTime
                changedTP = true
              } // if (!changedTP)
            } // если свеча зеленая, на которой зашли, т.е. closePrice[i] > OpenShort
          } // if (i == indexOfPostion + 1)
          changeTPSLCommon() // вторая проверка
          break

        default:
        // console.log('TP и SL не изменялись')
        // можно отправить сообщение в telegram bot для тестов на первое время
      } // end of: switch (whitchSignal): Провека условий для изменения SL и TP

      //arrayInside = await candlesInside(array[i], symbol, '1m')
      // console.log(`i = ${i} из ${array.length}, время = ${timestampToDateHuman(array[i].openTime)}`)
      //for (let j = 0; j < arrayInside.length; j++) {
      // условия выхода из сделки по TP
      if (array[i].lowPrice <= takeProfit) {
        profit = (positionDown - takeProfit) * amountOfPosition
        percent = +((profit / deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки
        // depositTemp += profit
        deposit2 = +(deposit + profit).toFixed(2)
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
          deposit2: deposit2,
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
        deposit2 = +(deposit + profit).toFixed(2)
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
          deposit2: deposit2,
          takeProfit: +takeProfit.toFixed(pricePrecision), // для проверки движка
          stopLoss: +stopLoss.toFixed(pricePrecision), // для проверки движка
          //dateChangeTP: timestampToDateHuman(dateChangeTP), // запоминаем время переноса TP
          dateChangeSL: dateChangeSL, // запоминаем время переноса SL
          // diffShadow: diffShadow,
          whitchSignal: whitchSignal,
        }
        clearPostion()
      } // отработка выхода из сделки по SL
      //}

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
} // function alex37test3

module.exports = alex37test3
