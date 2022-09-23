const fractal_Bullish_for_Test = require('../../indicators/fractal_Bullish4W_T')
const fractal_Bearish_for_Test = require('../../indicators/fractal_Bearish4W_T')
const dealClass = require('./dealClass')
const input_parameters = require('./input_parameters')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')

function deals(trends, candlesJunior) {
  let fractal_Bullish = {}
  let fractal_Bearish = {}
  let deal = new dealClass() // параметры по каждой сделке
  let deal2 = {}
  let deals = [] // массив всеъ сделок

  trends.forEach(function (trend, i, arg) {
    //for (let i = item.trendStartTime; i < item.trendEndTime; )
    if (trend.trendName == 'DownTrend') {
      deal.reset()
      /*
      console.log(
        `\nначало тренда: ${timestampToDateHuman(
          candlesJunior[trend.idStartTrend].startTime
        )}\nконец тренда: ${timestampToDateHuman(
          candlesJunior[trend.idEndTrend].startTime
        )}`
      )
      console.log(
        `кол-во свечей внутри тренда = ${trend.idEndTrend - trend.idStartTrend}`
      )
      console.log(
        `время на 4 свечи назад: ${timestampToDateHuman(
          candlesJunior[trend.idStartTrend - 4].startTime
        )}`
      )
      return
      */

      for (let j = trend.idStartTrend; j <= trend.idEndTrend; j++) {
        // поиск фрактала
        /*
        fractal_Bullish = fractal_Bullish_for_Test(
          candlesJunior,
          trend.idStartTrend - 1,
          trend.idEndTrend - 1
          // минус 1 для того чтобы сдвинуть поиск фрактала на одну свечу назад. Тогда на текущей свечке мы можем анализировать пробой фрактала
        )
        // предварительно перезаписываем лой нового фрактала, если он есть
        if (fractal_Bullish.isFractal) {
          deal.lowFbull = fractal_Bullish.low // обнулять в классе после сохранения сделки (при выходе из сделки)
          deal.islowFbull = true
        }
        */

        /*
        console.log(`\nfractal_Bullish:`)
        console.table(fractal_Bullish)
        console.log(`deal.lowFbull = ${deal.lowFbull}`)
        continue
        */

        /*
        fractal_Bearish = fractal_Bearish_for_Test(
          candlesJunior,
          trend.idStartTrend - 1,
          trend.idEndTrend - 1
          // минус 1 для того чтобы сдвинуть поиск фрактала на одну свечу назад. Тогда на текущей свечке мы можем анализировать пробой фрактала
        )
        // предварительно перезаписываем хай нового фрактала, если он есть
        if (fractal_Bearish.isFractal) {
          deal.highFBear = fractal_Bearish.high
          deal.ishighFBear = true
        }*/

        // старый код поиска фрактала
        if (
          candlesJunior[j - 4].low > candlesJunior[j - 2].low &&
          candlesJunior[j - 3].low > candlesJunior[j - 2].low &&
          candlesJunior[j - 1].low > candlesJunior[j - 2].low &&
          candlesJunior[j].low > candlesJunior[j - 2].low
        ) {
          deal.lowFbull = candlesJunior[j - 2].low
          deal.lowFbullTime = timestampToDateHuman(
            candlesJunior[j - 2].startTime
          )
          deal.islowFbull = true
        }

        if (
          candlesJunior[j - 4].high < candlesJunior[j - 2].high &&
          candlesJunior[j - 3].high < candlesJunior[j - 2].high &&
          candlesJunior[j - 1].high < candlesJunior[j - 2].high &&
          candlesJunior[j].high < candlesJunior[j - 2].high
        ) {
          deal.highFBear = candlesJunior[j - 2].high
          deal.ishighFBear = true
        }

        // если есть фрактал, то ищем точку пересечения
        //if (deal.islowFbull) {
        // если не в сделке
        if (!deal.inPosition && deal.islowFbull) {
          if (candlesJunior[j].low < deal.lowFbull) {
            // входим в сделку
            deal.inPosition = true
            deal.position = 'SHORT'
            deal.openPosition = deal.lowFbull
            //deal.openPosition = candlesJunior[j].low // проверка
            deal.openTime = candlesJunior[j].startTime
            deal.openTimeHuman = timestampToDateHuman(
              candlesJunior[j].startTime
            )
            deal.amountOfPosition =
              (deal.deposit / deal.openPosition) *
              input_parameters.partOfDeposit *
              input_parameters.multiplier
            deal.stopLoss = deal.highFBear
          } // а ниже повтор кода, но не правильно

          // если фрактал есть
          /*
          //if (fractal_Bullish.isFractal) {
          if (deal.canShort) {
            if (candlesJunior[i].low < fractal_Bullish.low) {
              // входим в сделку
              // оформить сохранение параметров через класс
            }
          }
          */
        } // if (!deal.inPosition)

        // если в сделке
        //else if (deal.inPosition && deal.ishighFBear) {
        else if (deal.inPosition) {
          if (deal.highFBear < deal.stopLoss) {
            deal.stopLoss = deal.highFBear
          }
          if (candlesJunior[j].high > deal.stopLoss && deal.stopLoss > 0) {
            // close deal
            deal.outPosition = true
            deal.closePosition = deal.stopLoss
            //deal.closePosition = candlesJunior[j].high // проверка
            deal.closeTime = candlesJunior[j].startTime
            deal.closeTimeHuman = timestampToDateHuman(
              candlesJunior[j].startTime
            )
            deal.profit =
              (deal.openPosition - deal.stopLoss) * deal.amountOfPosition
            deal.percent = (deal.profit / deal.openPosition) * 100
          }
        } // if (deal.inPosition)

        // если сделка закрыта, до отправляем ее в общий массив
        if (deal.outPosition) {
          //console.log(deal)
          deal2 = {
            position: deal.position,
            openTimeHuman: deal.openTimeHuman,
            openPosition: deal.openPosition,
            //openTime: deal.openTime,
            amountOfPosition: +deal.amountOfPosition.toFixed(8),
            closeTimeHuman: deal.closeTimeHuman,
            closePosition: deal.closePosition,
            //closeTime: deal.closeTime,
            profit: +deal.profit.toFixed(2),
            percent: +deal.percent.toFixed(2),
          }
          //console.table(deal2)
          deals = deals.concat(deal2)
          //deals.push(deal)
          deal.reset()
        }
        //}
      } // for (let j = trend.idStartTrend; j < trend.idEndTrend; j++)
    } // if (trend.trendName = 'DownTrend')

    if (trend.trendName == 'UpTrend') {
      deal.reset()
      for (let j = trend.idStartTrend; j <= trend.idEndTrend; j++) {
        // поиск фрактала
        // код нового способа удален

        // старый код поиска фрактала
        if (
          candlesJunior[j - 4].low > candlesJunior[j - 2].low &&
          candlesJunior[j - 3].low > candlesJunior[j - 2].low &&
          candlesJunior[j - 1].low > candlesJunior[j - 2].low &&
          candlesJunior[j].low > candlesJunior[j - 2].low
        ) {
          deal.lowFbull = candlesJunior[j - 2].low
          deal.lowFbullTime = timestampToDateHuman(
            candlesJunior[j - 2].startTime
          )
          deal.islowFbull = true
        }

        if (
          candlesJunior[j - 4].high < candlesJunior[j - 2].high &&
          candlesJunior[j - 3].high < candlesJunior[j - 2].high &&
          candlesJunior[j - 1].high < candlesJunior[j - 2].high &&
          candlesJunior[j].high < candlesJunior[j - 2].high
        ) {
          deal.highFBear = candlesJunior[j - 2].high
          deal.ishighFBear = true
        }

        // если есть фрактал, то ищем точку пересечения
        //if (deal.islowFbull) {
        // если не в сделке
        if (!deal.inPosition && deal.ishighFBear) {
          if (candlesJunior[j].high > deal.highFBear) {
            // входим в сделку
            deal.inPosition = true
            deal.position = 'LONG'
            deal.openPosition = deal.highFBear
            //deal.openPosition = candlesJunior[j].low // проверка
            deal.openTime = candlesJunior[j].startTime
            deal.openTimeHuman = timestampToDateHuman(
              candlesJunior[j].startTime
            )
            deal.amountOfPosition =
              (deal.deposit / deal.openPosition) *
              input_parameters.partOfDeposit *
              input_parameters.multiplier
            deal.stopLoss = deal.lowFbull
          } // а ниже повтор кода, но не правильно

          // если фрактал есть
          /*
          //if (fractal_Bullish.isFractal) {
          if (deal.canShort) {
            if (candlesJunior[i].low < fractal_Bullish.low) {
              // входим в сделку
              // оформить сохранение параметров через класс
            }
          }
          */
        } // if (!deal.inPosition)

        // если в сделке
        //else if (deal.inPosition && deal.ishighFBear) {
        else if (deal.inPosition) {
          if (deal.lowFbull > deal.stopLoss) {
            deal.stopLoss = deal.lowFbull
          }
          if (candlesJunior[j].low < deal.stopLoss) {
            // close deal
            deal.outPosition = true
            deal.closePosition = deal.stopLoss
            //deal.closePosition = candlesJunior[j].high // проверка
            deal.closeTime = candlesJunior[j].startTime
            deal.closeTimeHuman = timestampToDateHuman(
              candlesJunior[j].startTime
            )
            deal.profit =
              (deal.stopLoss - deal.openPosition) * deal.amountOfPosition
            deal.percent = (deal.profit / deal.openPosition) * 100
          }
        } // if (deal.inPosition)

        // если сделка закрыта, до отправляем ее в общий массив
        if (deal.outPosition) {
          //console.log(deal)
          deal2 = {
            position: deal.position,
            openTimeHuman: deal.openTimeHuman,
            openPosition: deal.openPosition,
            //openTime: deal.openTime,
            amountOfPosition: +deal.amountOfPosition.toFixed(8),
            closeTimeHuman: deal.closeTimeHuman,
            closePosition: deal.closePosition,
            //closeTime: deal.closeTime,
            profit: +deal.profit.toFixed(2),
            percent: +deal.percent.toFixed(2),
          }
          //console.table(deal2)
          deals = deals.concat(deal2)
          //deals.push(deal)
          deal.reset()
        }
        //}
      } // for (let j = trend.idStartTrend; j < trend.idEndTrend; j++)
    } // if (trend.trendName == 'UpTrend')
  }) // trends.forEach(function (trend, i, arg)

  console.log('\nвсе сделки:')
  console.log(deals)
  console.log(`кол-во сделок: ${deals.length}`)

  // перенести в модуль statistics
  // Добавить расчет прибыли по месяцам, кол-во положительных и отрицательных сделок, кол-во последовательных подряд отрицательных сделок
  let summProfit = 0 // сумма прибыли всех сделок
  let summProfitShort = 0 // сумма прибыли только short сделок
  let summProfitLong = 0 // сумма прибыли только long сделок

  deals.forEach(function (deal, i, arg) {
    summProfit += deal.profit
    if (deal.position == 'SHORT') {
      summProfitShort += deal.profit
    }
    if (deal.position == 'LONG') {
      summProfitLong += deal.profit
    }
  })
  console.log(`summProfit = ${+summProfit.toFixed(2)} USD`)
  console.log(`summProfitShort = ${+summProfitShort.toFixed(2)} USD`)
  console.log(`summProfitLong = ${+summProfitLong.toFixed(2)} USD`)

  // return deals

  // for (let i = 0; i < candlesJunior.length; i++) {} // for (let i = 0; i < candlesJunior.length; i++)
} // function deals(trends, candlesJunior)

module.exports = deals
