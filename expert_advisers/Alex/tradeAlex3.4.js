const timestampToDateHuman = require('../Williams_fractal/timestampToDateHuman')

// const takeProfitConst = 0.021 // вынести в config
//const stopLossConst = 0.03

// name: без теневая
// VERSION 3.4
// добавили второе условие для входа. Открываем short если срабатывает хотя бы один из сигналов

function tradeAlex3(
  array,
  deposit,
  partOfDeposit,
  multiplier,
  takeProfitConst,
  stopLossConst
) {
  // const takeProfitConst = 3 // жесткий TP = 4% для 2h, 3% для 15m
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

  let control3 = [] // для проверочных данных

  let canShort = false // есть ли сигнал для входа в шорт или нет

  // для первого сигнала
  let bodyOf1RedCandle = 0 // тело красной свечи
  let bodyOf2GreenCandle = 0 // тело 2й зеленой свечи
  let bodyOf3GreenCandle = 0 // тело 1й зеленой свечи

  let conditionSL = 4 // кол-во свечей, в течение которых мы можем изменить SL
  let diffSL = 0 // для расчета разницы lowPrice и точки входа => меняем SL

  let dateChangeTPSL = new Date().getTime() // для фиксации даты изменения TP и SL

  for (let i = 3; i < array.length; i++) {
    // поиск условия для входа в short
    if (!inShortPosition) {
      // расчет тела свечей
      bodyOf3GreenCandle = array[i - 3].closePrice - array[i - 3].openPrice // 1 свеча зелёная
      bodyOf2GreenCandle = array[i - 2].closePrice - array[i - 2].openPrice // 2 свеча зелёная
      bodyOf1RedCandle = array[i - 1].openPrice - array[i - 1].closePrice // 3 свеча красная
      if (
        // условие для первого сигнала
        array[i - 3].closePrice > array[i - 3].openPrice && // 1 свеча зелёная
        array[i - 2].closePrice > array[i - 2].openPrice && // 2 свеча зелёная
        array[i - 1].openPrice > array[i - 1].closePrice && // 3 свеча красная
        array[i - 1].openPrice == array[i - 1].highPrice && // у которой сверху нет тени
        bodyOf1RedCandle < bodyOf2GreenCandle && // тело красной свечи меньше тела зеленой свечи
        bodyOf2GreenCandle > bodyOf3GreenCandle && // тело 2й зеленой больше тела 1й зеленой
        array[i - 2].volume > array[i - 3].volume // vol 2й зеленой > vol 1й зеленой
      ) {
        canShort = true
      } // первый сигнал: конец условия
      else {
        // условие для второго сигнала
        if (
          array[i - 2].openPrice > array[i - 2].closePrice && // 1 свеча красная
          array[i - 1].openPrice > array[i - 1].closePrice && // 2 свеча красная
          array[i - 1].openPrice == array[i - 1].highPrice && // у которой сверху нет тени
          array[i - 2].openPrice / array[i - 2].closePrice - 1 < 0.04 && // тело свечи менее 4%
          array[i - 1].openPrice / array[i - 1].closePrice - 1 < 0.04 // тело свечи менее 4%
        ) {
          canShort = true
        }
      } // второй сигнал: конец условия

      if (canShort) {
        // входим в шорт
        positionDown = array[i - 1].closePrice // Открытие сделки на 4 свече по цене закрытия 3 свечи
        takeProfit = positionDown * (1 - takeProfitConst / 100)
        stopLoss = positionDown * (1 + stopLossConst / 100)
        positionTime = array[i].openTime
        inShortPosition = true
        canShort = false
        indexOfPostion = i
        conditionSL = 4 // кол-во свечей, в течение которых мы можем изменить SL

        // считаем объем сделки
        amountOfPosition = +(
          (depositTemp / positionDown) *
          partOfDeposit *
          multiplier
        ).toFixed(8)
      } // отработали условия входа в сделку
    } // if (!inShortPosition)

    if (inShortPosition) {
      // на открытии 4й свече (точка входа) мы двигаем SL и TP

      // условие изменения TP
      // 1. если свеча без теневая
      // 2. если после нее следующая зеленая (на которой мы зашли в short), тогда переносим TP = точка входа (проверка 1 раз)

      if (
        i == indexOfPostion + 1 &&
        array[indexOfPostion].closePrice > array[indexOfPostion].openPrice
      ) {
        takeProfit = positionDown
        dateChangeTPSL = array[i].openTime // запоминаем время переноса TP
      }

      // условие изменения SL
      // если лой 4й свечи (точка входа) и всех последующих трех ниже точки входа на 1.5%, тогда SL = точки входа
      if (conditionSL > 0 && i > indexOfPostion) {
        diffSL = (positionDown / array[i].lowPrice - 1) * 100
        if (diffSL > 1.5) {
          stopLoss = positionDown
          dateChangeTPSL = array[i].openTime // запоминаем время переноса SL
          conditionSL = 0
        }
        conditionSL--
      }

      // второй вариант изменения TP:
      // на 4й свече (железно): если мы сидим в минусе, то takeProfit = positionDown
      if (i == indexOfPostion + 3 && positionDown < array[i].closePrice) {
        takeProfit = positionDown
        dateChangeTPSL = array[i].openTime // запоминаем время переноса TP
      }

      // второй вариант изменения SL
      // на 4й свече (железно): если мы сидим в плюсе, то stopLoss = positionDown
      if (i == indexOfPostion + 3 && positionDown > array[i].closePrice) {
        stopLoss = positionDown
        dateChangeTPSL = array[i].openTime // запоминаем время переноса TP
      }

      // условия выхода из сделки
      if (array[i].lowPrice <= takeProfit && i > indexOfPostion) {
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
          takeProfit: +takeProfit.toFixed(8), // для проверки движка
          stopLoss: +stopLoss.toFixed(8), // для проверки движка
          dateChangeTPSL: timestampToDateHuman(dateChangeTPSL), // запоминаем время переноса TP или SL
          diffSL: +diffSL.toFixed(2),
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
      else if (array[i].highPrice >= stopLoss && i > indexOfPostion) {
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
          takeProfit: +takeProfit.toFixed(8), // для проверки движка
          stopLoss: +stopLoss.toFixed(8), // для проверки движка
          dateChangeTPSL: timestampToDateHuman(dateChangeTPSL), // запоминаем время переноса TP или SL
          diffSL: +diffSL.toFixed(2),
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
