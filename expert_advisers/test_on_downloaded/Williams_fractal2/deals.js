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
            deal.position = 'SHORT'
            deal.openPosition = deal.lowFbull
            deal.stopLoss = deal.highFBear
            deal = enterDeal(deal, candlesJunior[j])
          }
        } // if (!deal.inPosition)

        // если в сделке
        else if (deal.inPosition) {
          if (deal.highFBear < deal.stopLoss) {
            deal.stopLoss = deal.highFBear
          }
          if (candlesJunior[j].high > deal.stopLoss && deal.stopLoss > 0) {
            // close deal
            deal.closePosition = deal.stopLoss
            deal.profit =
              (deal.openPosition - deal.stopLoss) * deal.amountOfPosition

            // накопленный результат
            deal.profitReal =
              (deal.openPosition - deal.stopLoss) * deal.amountReal

            deal = closeDeal(deal, candlesJunior[j])
          }
        } // if (deal.inPosition)

        // если сделка закрыта, до отправляем ее в общий массив
        if (deal.outPosition) {
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
            deal.position = 'LONG'
            deal.openPosition = deal.highFBear
            deal.stopLoss = deal.lowFbull
            deal = enterDeal(deal, candlesJunior[j])
          }
        } // if (!deal.inPosition)

        // если в сделке
        else if (deal.inPosition) {
          if (deal.lowFbull > deal.stopLoss) {
            deal.stopLoss = deal.lowFbull
          }
          if (candlesJunior[j].low < deal.stopLoss) {
            // close deal
            deal.closePosition = deal.stopLoss

            deal.profit =
              (deal.stopLoss - deal.openPosition) * deal.amountOfPosition

            // накопленный результат
            deal.profitReal =
              (deal.stopLoss - deal.openPosition) * deal.amountReal

            deal = closeDeal(deal, candlesJunior[j])
          }
        } // if (deal.inPosition)

        // если сделка закрыта, до отправляем ее в общий массив
        if (deal.outPosition) {
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

function enterDeal(deal, candleJunior) {
  deal.inPosition = true
  deal.openTime = candleJunior.startTime
  deal.openTimeHuman = timestampToDateHuman(candleJunior.startTime)

  deal.amountOfPosition =
    (deal.deposit / deal.openPosition) *
    input_parameters.partOfDeposit *
    input_parameters.multiplier

  // накопленный результат
  deal.amountReal =
    (deal.depositReal / deal.openPosition) *
    input_parameters.partOfDeposit *
    input_parameters.multiplier

  return deal
}

function closeDeal(deal, candleJunior) {
  deal.outPosition = true
  deal.closeTime = candleJunior.startTime
  deal.closeTimeHuman = timestampToDateHuman(candleJunior.startTime)
  deal.percent = (deal.profit / deal.openPosition) * 100

  // накопленный результат
  deal.percentReal = (deal.profitReal / deal.openPosition) * 100
  deal.depositReal += deal.profitReal

  return deal
}

module.exports = deals
