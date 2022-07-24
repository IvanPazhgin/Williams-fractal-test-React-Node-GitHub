const timestampToDateHuman = require('../Williams_fractal/timestampToDateHuman')

// const takeProfitConst = 0.021 // вынести в config
const stopLossConst = 0.02

// name: три красных
/* VERSION 1.3 
Изменения:
после выполнения условий - открываем сделку в течение 5 следующих свечей
*/

function tradeAlex1(
  array,
  deposit,
  partOfDeposit,
  multiplier,
  diffVolumeUser,
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

  let profit = 0 // прибыль за 1 сделку в USD
  let percent = 0 // прибыль за 1 сделку в %

  let diffVolume = 0 // разница в объеме между красной и зеленой свечами

  let volumeRed = 0 // для проверки условия разницы объема между свечками
  let volumeGreen = 0 // для проверки условия разницы объема между свечками

  let indexOfPostion = 0 // запоминаем id входа в шорт, чтобы через N свечей поставить SL и TP
  let searchEntryPoint = 0 // для отслеживания последующих 5 свечей после торгового сигнала на вход в сделку
  let priceOf5Candle = 0 // запоминаем цену пятой свечи для входа по этому уровню в течение последующих 5 свечей
  let canShort = false // есть ли сигнал для входа в шорт или нет

  // первая стратегия
  for (let i = 5; i < array.length; i++) {
    // поиск условия для входа в short
    if (!inShortPosition) {
      if (
        array[i - 5].openPrice < array[i - 5].closePrice && // первая - зеленая
        array[i - 4].openPrice < array[i - 4].closePrice && // вторая - зеленая
        array[i - 3].openPrice > array[i - 3].closePrice && // третья - красная (по факту первая красная)
        array[i - 3].volume > array[i - 4].volume && // объем на красной больше объема на зеленой
        // решить вопрос пропорции volume
        array[i - 2].closePrice < array[i - 2].openPrice && // четвертая - красная (по факту вторая красная)
        array[i - 1].closePrice < array[i - 1].openPrice // пятая свеча красная
        /////////// !!! конец условия
      ) {
        // сформировался сигнал
        canShort = true
        searchEntryPoint = i //  далее в течение еще 5 следующих свечей открываем short
        priceOf5Candle = array[i - 1].OpenPrice // запоминаем цену 5й свечи для входа в short
        volumeRed = array[i - 3].volume
        volumeGreen = array[i - 4].volume
        //diffVolume = (array[i - 3].volume / array[i - 4].volume - 1) * 100
        diffVolume = (volumeRed / volumeGreen - 1) * 100
      } // сохранили важные данные для дальнейших проверок

      // условие входа в short
      if (
        canShort &&
        i - searchEntryPoint < 5 && // проверяем следующие условия в течение дальнейших 5 свечей
        diffVolume >= Number(diffVolumeUser) && // разница в объемах больше заданного трейдером значения,
        // т.е. отсекаем те варианты, когда разница объема двух свечей меньше настроек трейдера.
        // иными словами: если разница volume > пользовательского параметра, то входим в шорт
        array[i].highPrice >= priceOf5Candle
      ) {
        positionDown = priceOf5Candle // входим в сделку на уровне цены пятой свечи из первого if
        takeProfit = positionDown * (1 - takeProfitConst)
        stopLoss = positionDown * (1 + stopLossConst)
        positionTime = array[i].openTime
        inShortPosition = true
        canShort = false
        indexOfPostion = i

        // до входа в сделку считаем объем сделки
        amountOfPosition = +(
          (depositTemp / positionDown) *
          partOfDeposit *
          multiplier
        ).toFixed(8)
      } // отработали условия входа в сделку
      else {
      }
    } // if (!inShortPosition)

    if (inShortPosition) {
      // условие изменения SL и TP: ставим только что то одно
      if (i == indexOfPostion + 4) {
        // после закрытия 3й свечки
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

      /*
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
      */
    } // if (inShortPosition)
  } // for (let i = 4; i < array.length; i++)
  return deals
}

module.exports = tradeAlex1
