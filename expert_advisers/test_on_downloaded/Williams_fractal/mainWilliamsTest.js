const { intervalObject } = require('../common.files/intervals')
const input_parameters = require('./input_parameters')
const findTrends = require('./findTrends')

function startWilliamsTest() {
  const trends2h = findTrends(
    input_parameters,
    intervalObject.timeFrame2h,
    intervalObject.timeFrame5m
  )
  console.log(`приложение завершило работу (ОК)`)
}

module.exports = startWilliamsTest
