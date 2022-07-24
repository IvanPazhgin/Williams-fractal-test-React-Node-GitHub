const timestampToDateHuman = require('../Williams_fractal/timestampToDateHuman')

const takeProfitConst = 0.021 // вынести в config
const stopLossConst = 0.02

// name: три красных
// VERSION 1.1
function tradeAlex1(array, deposit, partOfDeposit, multiplier, diffVolumeUser) {
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

  let diffVolume = 0

  let volumeRed = 0 // для проверки условия разницы объема между свечками
  let volumeGreen = 0 // для проверки условия разницы объема между свечками

  // первая стратегия
  for (let i = 4; i < array.length; i++) {
    // поиск условия для входа в short
    if (!inShortPosition) {
      if (
        array[i - 4].openPrice < array[i - 4].closePrice && // первая - зелена
        array[i - 3].openPrice < array[i - 3].closePrice && // вторая - зеленая
        array[i - 2].openPrice > array[i - 2].closePrice && // третья - красная (по факту первая красная)
        array[i - 2].volume > array[i - 3].volume && // объем на красной больше объема на зеленой
        // решить вопрос пропорции volume
        array[i - 1].closePrice < array[i - 1].openPrice && // четвертая - красная (по факту вторая красная) -- УБРАТЬ на 2й стратегии
        // пятая свеча красная
        array[i].highPrice >= array[i - 1].openPrice // условие входа в short
      ) {
        diffVolume = (array[i - 2].volume / array[i - 3].volume - 1) * 100
        if (diffVolume >= Number(diffVolumeUser)) {
          // если разница volume > пользовательского параметра
          // входим в шорт
          positionDown = array[i - 1].openPrice // входим в сделку на уровне цены открытия предыдущей свечи
          takeProfit = positionDown * (1 - takeProfitConst)
          stopLoss = positionDown * (1 + stopLossConst)
          positionTime = array[i].openTime
          inShortPosition = true

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
        }
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
          diffVolume: +diffVolume.toFixed(2), // для проверки движка
          volumeGreen: volumeGreen, // для проверки движка
          volumeRed: volumeRed, // для проверки движка
          takeProfit: takeProfit, // для проверки движка
          stopLoss: +stopLoss.toFixed(8), // для проверки движка
        }
        // allDeals = allDeals.concat(deals)
        numberOfPosition += 1
        positionDown = 0
        positionTime = 0
        takeProfit = 0
        stopLoss = 0
        volumeGreen = 0 // потом удалить
        volumeRed = 0 // потом удалить
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
          diffVolume: +diffVolume.toFixed(2), // для проверки движка
          volumeGreen: volumeGreen, // для проверки движка
          volumeRed: volumeRed, // для проверки движка
          takeProfit: takeProfit, // для проверки движка
          stopLoss: +stopLoss.toFixed(8), // для проверки движка
        }
        //allDeals = allDeals.concat(deals)
        numberOfPosition += 1
        positionDown = 0
        positionTime = 0
        takeProfit = 0
        stopLoss = 0
        volumeGreen = 0 // потом удалить
        volumeRed = 0 // потом удалить
        inShortPosition = false
        amountOfPosition = 0
        profit = 0
        percent = 0
      } // отработка выхода из сделки по SL

      // условие изменения TP
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
    } // if (inShortPosition)
  } // for (let i = 4; i < array.length; i++)
  return deals
}

module.exports = tradeAlex1

/*


*/
