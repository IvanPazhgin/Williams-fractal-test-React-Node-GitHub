const timestampToDateHuman = require('../../common.func/timestampToDateHuman')

function trade(array, trend, index, deposit, partOfDeposit, multiplier) {
  let FractalsUp = false // факт наличия фрактала на младшем ТФ
  let FractalsDown = false
  let FractalsUpPrice = 0 // значение цены фрактала
  let FractalsDownPrice = 0
  let FractalUpTime = 0 // время фрактала для проверки работы условий
  let FractalDownTime = 0
  let stopLoss = 0
  let inLongPosition = false
  let inShortPosition = false
  let numberOfPosition = 0
  let positionUp = 0
  let positionDown = 0
  let positionTime = 0
  let lastFractal = 0 // для закрытия сделок в конце тренда
  let deals = [] // сделки внутри тренда
  let dealsReal = [] // сделки с учетом: депозита, % использования депозита и плеча
  let amountOfPosition = 0 // для расчета объема входа в сделку
  let depositTemp = Number(deposit)
  let profit = 0 // прибыль или убыток внутри каждой сделки
  let varMaxProfit = 0 // расчет максимально возможной потенциальной прибыли в каждой сделке
  let timeOfVMP = 0 // время наступленмя varMaxProfit

  console.log(`передаваемое значение тренда = ${trend}`)
  // console.log('тип трендовой переменной: ' + typeof(trend))
  // console.log('переданный массив')
  // console.log(array)

  // в цикле ищем фракталы внутри тренда на младщем ТФ и запускаем сделки
  for (let i = 4; i < array.length; i++) {
    if (
      array[i - 4].lowPrice > array[i - 2].lowPrice &&
      array[i - 3].lowPrice > array[i - 2].lowPrice &&
      array[i - 1].lowPrice > array[i - 2].lowPrice &&
      array[i].lowPrice > array[i - 2].lowPrice
    ) {
      FractalsDown = true
      FractalsDownPrice = array[i - 2].lowPrice
      // console.log(`фрактал снизу =  ${FractalsDownPrice}, дата ${timestampToDateHuman(FractalDownTime)}`)
    } else if (
      array[i - 4].highPrice < array[i - 2].highPrice &&
      array[i - 3].highPrice < array[i - 2].highPrice &&
      array[i - 1].highPrice < array[i - 2].highPrice &&
      array[i].highPrice < array[i - 2].highPrice
    ) {
      FractalsUp = true
      FractalsUpPrice = array[i - 2].highPrice
    }

    if (trend == 'UpTrend') {
      // console.log('ищем вход внутри UpTrend')
      if (FractalsUp) {
        // console.log(`есть фрактал: ${FractalsUpPrice}`)
        if (!inLongPosition) {
          if (array[i].highPrice > FractalsUpPrice) {
            stopLoss = FractalsDownPrice
            lastFractal = FractalsDownPrice
            // FractalsUp = false
            // FractalsUpPrice = 0
            // positionUp = Number(array[i][2])
            positionUp = FractalsUpPrice // вход в позицию по цене фрактала
            inLongPosition = true
            positionTime = array[i].openTime
            varMaxProfit = FractalsUpPrice // фиксируем на уровне входа в сделку
            timeOfVMP = array[i].openTime
            // console.log('зашли в позицию')
          }
        } else if (inLongPosition) {
          if (FractalsDownPrice > stopLoss) {
            stopLoss = FractalsDownPrice
            lastFractal = FractalsDownPrice
          }
          if (varMaxProfit < array[i].highPrice) {
            varMaxProfit = array[i].highPrice
            timeOfVMP = array[i].openTime
          }
          if (array[i].lowPrice < stopLoss) {
            deals[numberOfPosition] = {
              openPosition: 'Buy',
              openPrice: positionUp,
              openTime: timestampToDateHuman(positionTime),
              //openTimestamp: positionTime,
              closePosition: 'Sell',
              // closePrice: Number(array[i][3]), // неправильно
              closePrice: stopLoss, // выходим по цене Stop Loss
              closeTime: timestampToDateHuman(array[i].openTime),
              //profit: +(array[i].lowPrice - positionUp).toFixed(2), // неправильно
              profit: +(stopLoss - positionUp).toFixed(2),
              //percent: +(((array[i].lowPrice - positionUp) / positionUp) * 100).toFixed(2), // неправильно
              percent: +(((stopLoss - positionUp) / positionUp) * 100).toFixed(
                2
              ),
              // stopLoss: stopLoss, // избыточная информация
              varMaxProfit: +(varMaxProfit - positionUp).toFixed(2),
              procentVMP: +((varMaxProfit / positionUp - 1) * 100).toFixed(2),
              timeOfVMP: timestampToDateHuman(timeOfVMP),
            }
            // формируем инфу по сделке на реальном депо:
            amountOfPosition = +(
              (depositTemp / positionUp) *
              partOfDeposit *
              multiplier
            ).toFixed(8)
            profit = (stopLoss - positionUp) * amountOfPosition
            depositTemp += profit
            // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
            dealsReal[numberOfPosition] = {
              openPosition: 'Buy',
              openPrice: positionUp,
              openTime: timestampToDateHuman(positionTime),
              amountOfPosition: amountOfPosition,
              closePosition: 'Sell',
              closePrice: stopLoss, // выходим по цене Stop Loss
              closeTime: timestampToDateHuman(array[i].openTime),
              profit: +profit.toFixed(2),
              percent: +((profit / positionUp) * 100).toFixed(2),
              deposit: +depositTemp.toFixed(2),
            }

            inLongPosition = false
            stopLoss = 0
            numberOfPosition += 1
            positionUp = 0
            positionTime = 0
            // console.log('вышли из позиции')
            FractalsUp = false
            FractalsUpPrice = 0
          } else if (i == array.length - 1) {
            // если тренд закончен, но сделка еще не закрыта
            if (array[i].lowPrice >= lastFractal) {
              // если текущая цена еще выше последнего нижнего фрактала
              deals[numberOfPosition] = {
                openPosition: 'Buy',
                openPrice: positionUp,
                openTime: timestampToDateHuman(positionTime),
                //openTimestamp: positionTime,
                closePosition: 'Sell',
                closePrice: array[i].lowPrice,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +(array[i].lowPrice - positionUp).toFixed(2),
                percent: +(
                  ((array[i].lowPrice - positionUp) / positionUp) *
                  100
                ).toFixed(2),
                lastPrice: array[i].lowPrice,
                varMaxProfit: +(varMaxProfit - positionUp).toFixed(2),
                procentVMP: +((varMaxProfit / positionUp - 1) * 100).toFixed(2),
                timeOfVMP: timestampToDateHuman(timeOfVMP),
              }

              // формируем инфу по сделке на реальном депо:
              amountOfPosition = +(
                (depositTemp / positionUp) *
                partOfDeposit *
                multiplier
              ).toFixed(8)
              profit = (array[i].lowPrice - positionUp) * amountOfPosition
              depositTemp += profit
              // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
              dealsReal[numberOfPosition] = {
                openPosition: 'Buy',
                openPrice: positionUp,
                openTime: timestampToDateHuman(positionTime),
                amountOfPosition: amountOfPosition,
                closePosition: 'Sell',
                closePrice: array[i].lowPrice,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +profit.toFixed(2),
                percent: +((profit / positionUp) * 100).toFixed(2),
                deposit: +depositTemp.toFixed(2),
                lastPrice: array[i].lowPrice,
              }
            } else {
              // если текущая цена ниже последнего нижнего фрактала, то закрываем по цене фрактала

              // продумать как на боевом роботе будут закрываться позиции после окончания тренда, т.к. ниже позиция закрывается по последнему фракталу
              deals[numberOfPosition] = {
                openPosition: 'Buy',
                openPrice: positionUp,
                openTime: timestampToDateHuman(positionTime),
                //openTimestamp: positionTime,
                closePosition: 'Sell',
                closePrice: lastFractal,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: lastFractal - positionUp,
                percent: +(
                  ((lastFractal - positionUp) / positionUp) *
                  100
                ).toFixed(2),
                lf: lastFractal,
                varMaxProfit: +(varMaxProfit - positionUp).toFixed(2),
                procentVMP: +((varMaxProfit / positionUp - 1) * 100).toFixed(2),
                timeOfVMP: timestampToDateHuman(timeOfVMP),
              }

              // формируем инфу по сделке на реальном депо:
              amountOfPosition = +(
                (depositTemp / positionUp) *
                partOfDeposit *
                multiplier
              ).toFixed(2)
              profit = (lastFractal - positionUp) * amountOfPosition
              depositTemp += profit
              // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
              dealsReal[numberOfPosition] = {
                openPosition: 'Buy',
                openPrice: positionUp,
                openTime: timestampToDateHuman(positionTime),
                amountOfPosition: amountOfPosition,
                closePosition: 'Sell',
                closePrice: lastFractal,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +profit.toFixed(2),
                percent: +((profit / positionUp) * 100).toFixed(2),
                deposit: +depositTemp.toFixed(2),
                lf: lastFractal,
              }
            }
            lastFractal = 0
          }
        }
      }
    } else if (trend == 'DownTrend') {
      if (FractalsDown) {
        if (!inShortPosition) {
          //stopLoss = FractalsUpPrice
          //lastFractal = FractalsUpPrice
          if (array[i].lowPrice < FractalsDownPrice) {
            stopLoss = FractalsUpPrice
            lastFractal = FractalsUpPrice
            // FractalsUp = false
            // FractalsUpPrice = 0
            inShortPosition = true
            //positionDown = Number(array[i][3])
            positionDown = FractalsDownPrice // открываем short по цене фрактала
            positionTime = array[i].openTime
            varMaxProfit = FractalsDownPrice // фиксируем на уровне входа в сделку
            timeOfVMP = array[i].openTime
            // console.log('зашли в позицию')
          }
        } else if (inShortPosition) {
          if (FractalsUpPrice < stopLoss) {
            stopLoss = FractalsUpPrice
            lastFractal = FractalsUpPrice
          }
          if (varMaxProfit > array[i].lowPrice) {
            varMaxProfit = array[i].lowPrice
            timeOfVMP = array[i].openTime
          }
          //if (stopLoss > 0)
          if (array[i].highPrice > stopLoss) {
            if (stopLoss > 0) {
              // бывают ситуации, когда в начале нового тренда верхний фрактал еще не сформировался
              deals[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                //openTimestamp: positionTime,
                closePosition: 'Buy',
                // closePrice: Number(array[i][2]),
                closePrice: stopLoss, // выходим по цене Stol Loss
                closeTime: timestampToDateHuman(array[i].openTime),
                // profit: +(positionDown - array[i].highPrice).toFixed(2), // неправильно
                profit: +(positionDown - stopLoss).toFixed(2),
                // percent: +(((positionDown - array[i].highPrice) / positionDown) * 100).toFixed(2), // неправильно
                percent: +(
                  ((positionDown - stopLoss) / positionDown) *
                  100
                ).toFixed(2),
                // stopLoss: stopLoss, // избыточная информация
                varMaxProfit: +(positionDown - varMaxProfit).toFixed(2),
                procentVMP: +((positionDown / varMaxProfit - 1) * 100).toFixed(
                  2
                ),
                timeOfVMP: timestampToDateHuman(timeOfVMP),
              }
              // формируем инфу по сделке на реальном депо:

              amountOfPosition = +(
                (depositTemp / positionDown) *
                partOfDeposit *
                multiplier
              ).toFixed(8)
              profit = (positionDown - stopLoss) * amountOfPosition
              depositTemp += profit
              // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
              dealsReal[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                amountOfPosition: amountOfPosition,
                closePosition: 'Buy',
                closePrice: stopLoss, // выходим по цене Stop Loss
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +profit.toFixed(2),
                percent: +((profit / positionDown) * 100).toFixed(2),
                deposit: +depositTemp.toFixed(2),
              }

              inShortPosition = false
              stopLoss = 0
              numberOfPosition += 1
              positionDown = 0
              // console.log('вышли из позиции')
              FractalsDown = false
              FractalsDownPrice = 0
              positionTime = 0
            }
          } else if (i == array.length - 1) {
            // если тренд закончен, но сделка еще не закрыта
            if (array[i].highPrice <= lastFractal) {
              // если текущая цена еще ниже последнего верхнего фрактала
              deals[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                //openTimestamp: positionTime,
                closePosition: 'Buy',
                closePrice: array[i].highPrice,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +(positionDown - array[i].highPrice).toFixed(2),
                percent: +(
                  ((positionDown - array[i].highPrice) / positionDown) *
                  100
                ).toFixed(2),
                lastPrice: array[i].highPrice,
                varMaxProfit: +(positionDown - varMaxProfit).toFixed(2),
                procentVMP: +((positionDown / varMaxProfit - 1) * 100).toFixed(
                  2
                ),
                timeOfVMP: timestampToDateHuman(timeOfVMP),
              }

              // формируем инфу по сделке на реальном депо:
              amountOfPosition = +(
                (depositTemp / positionDown) *
                partOfDeposit *
                multiplier
              ).toFixed(8)
              profit = (positionDown - array[i].highPrice) * amountOfPosition
              depositTemp += profit
              // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
              dealsReal[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                amountOfPosition: amountOfPosition,
                closePosition: 'Buy',
                closePrice: array[i].highPrice,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +profit.toFixed(2),
                percent: +((profit / positionDown) * 100).toFixed(2),
                deposit: +depositTemp.toFixed(2),
                lastPrice: array[i].highPrice,
              }
            } else {
              deals[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                //openTimestamp: positionTime,
                closePosition: 'Buy',
                closePrice: lastFractal,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: positionDown - lastFractal,
                percent: +(
                  ((positionDown - lastFractal) / positionDown) *
                  100
                ).toFixed(2),
                lf: lastFractal,
                varMaxProfit: +(positionDown - varMaxProfit).toFixed(2),
                procentVMP: +((positionDown / varMaxProfit - 1) * 100).toFixed(
                  2
                ),
                timeOfVMP: timestampToDateHuman(timeOfVMP),
              }
              // формируем инфу по сделке на реальном депо:
              amountOfPosition = +(
                (depositTemp / positionDown) *
                partOfDeposit *
                multiplier
              ).toFixed(8)
              profit = (positionDown - lastFractal) * amountOfPosition
              depositTemp += profit
              // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
              dealsReal[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                amountOfPosition: amountOfPosition,
                closePosition: 'Buy',
                closePrice: lastFractal,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +profit.toFixed(2),
                percent: +((profit / positionDown) * 100).toFixed(2),
                deposit: +depositTemp.toFixed(2),
                lf: lastFractal,
              }
            }
            lastFractal = 0
          }
        }
      }
    }
  }

  // console.log('сделки внутри функции trade:')
  // console.table(deals)
  // console.log(`кол-во сделок внутри тренда = ${deals.length} штук (внутри функции trade)`)

  console.log('РЕАЛЬНЫЕ сделки внутри функции trade:')
  console.table(dealsReal)
  console.log(
    `кол-во сделок внутри тренда = ${dealsReal.length} штук (внутри функции trade)`
  )

  // подсчет прибыли внутри тренда по dealsClass
  /*
  let summProfit = 0
  deals.forEach(function (item) {
    if (typeof item.profit == 'number') summProfit += item.profit
  })
  console.log(`прибыль внутри тренда = ${+summProfit.toFixed(2)} USD (функция считает по полю profit)`)
  */
  let summProfit = 0
  if (dealsReal.length == 1) {
    summProfit = dealsReal[0].deposit - Number(deposit)
  } else if (dealsReal.length > 1) {
    summProfit = dealsReal[dealsReal.length - 1].deposit - Number(deposit)
    console.log(
      `прибыль внутри тренда = ${+summProfit.toFixed(
        2
      )} USD (функция считает по разнице между депозитом в начале тренда и в конце тренда)`
    )
  }

  // для статистики внутри трендов
  let statInTredn = []
  let jj = 0

  statInTredn[jj] = {
    indexOfTrend: index,
    trendIs: trend,
    startTrend: timestampToDateHuman(array[0].openTime),
    endTrend: timestampToDateHuman(array[array.length - 1].openTime),
    profitInTrend: +summProfit.toFixed(2),
  }
  jj++

  return {
    deals: deals,
    statInTredn: statInTredn,
    dealsReal: dealsReal,
    depositTemp: +depositTemp.toFixed(2),
  }
}

module.exports = trade
