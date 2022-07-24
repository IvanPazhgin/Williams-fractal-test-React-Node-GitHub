const timestampToDateHuman = require('../Williams_fractal/timestampToDateHuman')

// const takeProfitConst = 0.021 // вынести в config
const stopLossConst = 0.02

/*
меняем условия поиска точка входа :
- длина тела второй зеленой свечи должна быть больше длины тела 1й зеленой свечи
- убираем вторую красную свечу (4я)
- фактор разницы объемов между свечами не имеет значение
- первая красная свеча: тень верхняя меньше чем тень нижняя
- у второй зеленой свечки должна быть нижняя тень

SL: после закрытия 2й свечи (т.е. на 3й) меняем SL на точку входа
TP: задает пользователь. Ориентир - 3%. Убираем условие по изменению TP
*/

function tradeAlex2(
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
  //let allDeals = [] // все сделки
  let numberOfPosition = 0 // номер сделки
  let amountOfPosition = 0 // для расчета объема входа в сделку

  let depositTemp = Number(deposit)

  let profit = 0
  let percent = 0

  let shadowTopLength = 0 // длина верхней тени
  let shadowBottomLength = 0 // длина нижней тени
  let length1GreenBar = 0 // длина тела первой зеленой свечи
  let length2GreenBar = 0 // длина тела второй зеленой свечи

  let indexOfPostion = 0 // сохраняем № свечки точки входа для дальнейшего изменения SL

  // let diffVolume = 0

  // let volumeRed = 0 // для проверки условия разницы объема между свечками
  // let volumeGreen = 0 // для проверки условия разницы объема между свечками

  // первая стратегия
  for (let i = 3; i < array.length; i++) {
    // поиск условия для входа в short
    if (!inShortPosition) {
      // расчет теней на первой красной свечи для дальнейшего сравнения
      shadowTopLength = array[i - 1].highPrice - array[i - 1].closePrice
      shadowBottomLength = array[i - 1].openPrice - array[i - 1].lowPrice

      // расчет длины тела 1й и 2й зеленой свечи
      length1GreenBar = array[i - 3].closePrice - array[i - 3].openPrice
      length2GreenBar = array[i - 2].closePrice - array[i - 2].openPrice
      if (
        array[i - 3].openPrice < array[i - 3].closePrice && // первая - зелена
        array[i - 2].openPrice < array[i - 2].closePrice && // вторая - зеленая
        length2GreenBar > length1GreenBar && // длина тела второй зеленой свечи больше длины тела 1й зеленой свечи
        array[i - 2].lowPrice < array[i - 2].openPrice && // у второй зеленой свечки должна быть нижняя тень
        array[i - 1].openPrice > array[i - 1].closePrice && // третья - красная (по факту первая красная)
        shadowTopLength < shadowBottomLength && // верхняя тень меньше нижней тени
        // array[i - 1].volume > array[i - 2].volume && // объем на красной больше объема на зеленой
        array[i].highPrice >= array[i - 1].openPrice // условие входа в short
      ) {
        // diffVolume = (array[i - 2].volume / array[i - 3].volume - 1) * 100
        // if (diffVolume >= Number(diffVolumeUser)) { // если разница volume > пользовательского параметра

        // входим в шорт
        positionDown = array[i - 1].openPrice // входим в сделку на уровне цены открытия предыдущей свечи
        takeProfit = positionDown * (1 - takeProfitConst)
        stopLoss = positionDown * (1 + stopLossConst)
        positionTime = array[i].openTime
        inShortPosition = true
        indexOfPostion = i

        // до входа в сделку считаем объем сделки
        amountOfPosition = +(
          (depositTemp / positionDown) *
          partOfDeposit *
          multiplier
        ).toFixed(8)

        // проверки значений volume в console.log
        volumeRed = array[i - 2].volume
        volumeGreen = array[i - 3].volume
        // console.log(`найдено условие для входа в short`)
        // console.log(`volume Green Candle = ${volumeGreen}`)
        // console.log(`volume Red Candle = ${volumeRed}`)
        // console.log(`разница diffVolume = ${+diffVolume.toFixed(2)}%`)
        // } // if (diffVolume >= Number(diffVolumeUser))
      } // отработали условия входа в сделку
    } // if (!inShortPosition)

    if (inShortPosition) {
      // условия выхода из сделки
      if (array[i].lowPrice <= takeProfit) {
        profit = (positionDown - takeProfit) * amountOfPosition
        percent = +((profit / depositTemp) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки
        depositTemp += profit

        deals[numberOfPosition] = {
          //deal = {
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
          // diffVolume: +diffVolume.toFixed(2), // для проверки движка
          // volumeGreen: volumeGreen, // для проверки движка
          // volumeRed: volumeRed, // для проверки движка
          takeProfit: takeProfit, // для проверки движка
          stopLoss: +stopLoss.toFixed(8), // для проверки движка
        }
        // allDeals = allDeals.concat(deals)
        numberOfPosition += 1
        positionDown = 0
        positionTime = 0
        takeProfit = 0
        stopLoss = 0
        // volumeGreen = 0 // потом удалить
        // volumeRed = 0 // потом удалить
        inShortPosition = false
        amountOfPosition = 0
        profit = 0
        percent = 0
      } // отработка выхода из сделки по TP
      // далее, если цена пробила SL
      else if (array[i].highPrice >= stopLoss) {
        profit = (positionDown - stopLoss) * amountOfPosition
        percent = +((profit / depositTemp) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки
        depositTemp += profit

        deals[numberOfPosition] = {
          // deal = {
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
          // diffVolume: +diffVolume.toFixed(2), // для проверки движка
          // volumeGreen: volumeGreen, // для проверки движка
          // volumeRed: volumeRed, // для проверки движка
          takeProfit: takeProfit, // для проверки движка
          stopLoss: +stopLoss.toFixed(8), // для проверки движка
        }
        //allDeals = allDeals.concat(deals)
        numberOfPosition += 1
        positionDown = 0
        positionTime = 0
        takeProfit = 0
        stopLoss = 0
        // volumeGreen = 0 // потом удалить
        // volumeRed = 0 // потом удалить
        inShortPosition = false
        amountOfPosition = 0
        profit = 0
        percent = 0
      } // отработка выхода из сделки по SL

      // условие изменения SL
      if (i == indexOfPostion + 3) {
        stopLoss = positionDown
      }

      // условие изменения TP
      /*
      if (
        array[i].closePrice > array[i].lowPrice && //если появилась зеленая свеча
        array[i].closePrice > positionDown // если рынок пошел против позиции и мы вариативно находимся в убытке, то ...
      ) {
        takeProfit = positionDown
      }
      
      // условие изменения SL
      if (array[i].closePrice < positionDown) {
        stopLoss = positionDown
      }
      */
    } // if (inShortPosition)
  } // for (let i = 4; i < array.length; i++)
  return deals
}

module.exports = tradeAlex2

/*


*/
