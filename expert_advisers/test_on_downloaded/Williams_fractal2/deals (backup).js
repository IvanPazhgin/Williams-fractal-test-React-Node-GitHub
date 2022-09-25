const dealClass = require('./dealClass')
const { input_parameters } = require('./input_parameters')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const saveDeals = require('../utils/saveDeals')

function deals(trends, candlesJunior, optionsForSave) {
  let deal = new dealClass() // параметры по каждой сделке
  let deal2 = {}
  let deals = [] // массив всеъ сделок

  trends.forEach(function (trend, i, arg) {
    if (trend.trendName == 'DownTrend') {
      deal.reset()

      for (let j = trend.idStartTrend; j <= trend.idEndTrend; j++) {
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

            // накопленный результат
            deal.amountReal =
              (deal.depositReal / deal.openPosition) *
              input_parameters.partOfDeposit *
              input_parameters.multiplier
          }
        } // if (!deal.inPosition)

        // если в сделке
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

            // накопленный результат
            deal.profitReal =
              (deal.openPosition - deal.stopLoss) * deal.amountReal
            deal.percentReal = (deal.profitReal / deal.openPosition) * 100
            deal.depositReal += deal.profitReal
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
            closeTime: deal.closeTime, // для сортировки и сбора статистики
            profit: +deal.profit.toFixed(2),
            percent: +deal.percent.toFixed(2),
            // данные с привязкой к накоплению результата
            depositReal: deal.depositReal,
            amountReal: +deal.amountReal.toFixed(8),
            profitReal: +deal.profitReal.toFixed(2),
            percentReal: +deal.percentReal.toFixed(2),
          }
          deals = deals.concat(deal2)
          deal.reset()
        }
      } // for (let j = trend.idStartTrend; j < trend.idEndTrend; j++)
    } // if (trend.trendName = 'DownTrend')

    if (trend.trendName == 'UpTrend') {
      deal.reset()
      for (let j = trend.idStartTrend; j <= trend.idEndTrend; j++) {
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

            // накопленный результат
            deal.amountReal =
              (deal.depositReal / deal.openPosition) *
              input_parameters.partOfDeposit *
              input_parameters.multiplier
          }
        } // if (!deal.inPosition)

        // если в сделке
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

            // накопленный результат
            deal.profitReal =
              (deal.openPosition - deal.stopLoss) * deal.amountReal
            deal.percentReal = (deal.profitReal / deal.openPosition) * 100
            deal.depositReal += deal.profitReal
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
            closeTime: deal.closeTime, // для сортировки и сбора статистики
            profit: +deal.profit.toFixed(2),
            percent: +deal.percent.toFixed(2),
            // данные с привязкой к накоплению результата
            depositReal: deal.depositReal,
            amountReal: +deal.amountReal.toFixed(8),
            profitReal: +deal.profitReal.toFixed(2),
            percentReal: +deal.percentReal.toFixed(2),
          }
          deals = deals.concat(deal2)
          deal.reset()
        }
      } // for (let j = trend.idStartTrend; j < trend.idEndTrend; j++)
    } // if (trend.trendName == 'UpTrend')
  }) // trends.forEach(function (trend, i, arg)

  // сортировка массива со сделками - важная функция
  deals.sort((a, b) => a.closeTime - b.closeTime)

  //saveDeals(deals, optionsForSave)
  return deals
} // function deals(trends, candlesJunior)

module.exports = deals
