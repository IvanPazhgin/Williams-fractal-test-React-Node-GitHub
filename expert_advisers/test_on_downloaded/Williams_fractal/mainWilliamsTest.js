const { intervalObject } = require('../common.files/intervals')
const input_parameters = require('./input_parameters')
const findTrends = require('./findTrends')
const deals = require('./deals')
//const deals = require('./deals_new')

function startWilliamsTest() {
  const trends2h = findTrends(
    input_parameters,
    intervalObject.timeFrame2h,
    intervalObject.timeFrame5m
  )

  const deals_2h_5min = deals(trends2h.trends, trends2h.candlesJunior)
  console.log(`приложение завершило работу (ОК)`)
}

module.exports = startWilliamsTest
