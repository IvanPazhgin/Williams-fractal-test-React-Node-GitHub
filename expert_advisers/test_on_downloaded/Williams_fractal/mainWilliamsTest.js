const { intervalObject } = require('../common.files/intervals')
const input_parameters = require('./input_parameters')
const findTrends = require('./findTrends')
const deals = require('./deals')
const statistics = require('./statistics')
//const deals = require('./deals_new')
const optionsForDeals = require('./misc/optionsForDeals')
const optionsForTrends = require('./misc/optionsForTrends')
const optionsForStatistics = require('./misc/optionsForStatistics')

function startWilliamsTest() {
  // поиск трендов на старших ТФ
  const trends_2h_5m = findTrends(
    input_parameters,
    intervalObject.timeFrame2h,
    intervalObject.timeFrame5m,
    optionsForTrends.optionsForTrends_2h_5m
  )

  // поиск сделок
  const deals_2h_5m = deals(
    trends_2h_5m.trends,
    trends_2h_5m.candlesJunior,
    optionsForDeals.optionsForDeals_2h_5m
  )

  // сбор статистики
  const statistics_2h_5m = statistics(
    deals_2h_5m,
    optionsForStatistics.optionsForStatistics_2h_5m
  )
  console.log(`приложение завершило работу (ОК)`)
}

module.exports = startWilliamsTest
