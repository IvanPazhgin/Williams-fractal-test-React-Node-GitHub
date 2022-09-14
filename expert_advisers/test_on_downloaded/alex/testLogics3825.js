const readCandleFromJSON = require('../utils/readCandle')
const { intervalObject } = require('./misc/intervals')
const optionsForTest = require('./misc/optionsForTest')
const optionsForSaveDeals = require('./misc/optionsForSave')
const optionsForStat = require('./misc/optionsForStat')
const saveDeals = require('./tools/saveDeals')
const statistics = require('./tools/statistics')
const TestClass3825 = require('./testClass3825')
// const input_parameters = require('./input_parameters')

function testLogics3825(input_parameters) {
  let deal // переменная для запуска стартегий

  // загружаем свечки из файлов
  const candles4h = readCandleFromJSON(
    input_parameters,
    intervalObject.timeFrame4h
  )
  const candles2h = readCandleFromJSON(
    input_parameters,
    intervalObject.timeFrame2h
  )
  const candles1h = readCandleFromJSON(
    input_parameters,
    intervalObject.timeFrame1h
  )
  const candles30m = readCandleFromJSON(
    input_parameters,
    intervalObject.timeFrame30m
  )
  const candles15m = readCandleFromJSON(
    input_parameters,
    intervalObject.timeFrame15m
  )
  const candles1m = readCandleFromJSON(
    input_parameters,
    intervalObject.timeFrame1m
  )

  // тест через Class (тот же самый результат и через Class в optionsForTest.js)
  // const optionsForTest2 = require('./misc/optionsForTest2')
  // console.log(optionsForTest2(intervalObject.timeFrame4h))
  // deal = new TestClass3825(optionsForTest2(intervalObject.timeFrame4h))

  // запускаем тест стратегии 4h
  deal = new TestClass3825(optionsForTest.options4h) // придумать как передать symbol в optionsForTest
  let deals4h = deal.findSygnal(candles4h, candles1m)
  console.log(`кол-во сделок 4h = ${deals4h.length} штук`)

  // запускаем тест стратегии 2h
  deal = new TestClass3825(optionsForTest.options2h) // придумать как передать symbol в optionsForTest
  let deals2h = deal.findSygnal(candles2h, candles1m)
  console.log(`кол-во сделок 2h = ${deals2h.length} штук`)

  // запускаем тест стратегии 1h
  deal = new TestClass3825(optionsForTest.options1h) // придумать как передать symbol в optionsForTest
  let deals1h = deal.findSygnal(candles1h, candles1m)
  console.log(`кол-во сделок 1h = ${deals1h.length} штук`)

  // запускаем тест стратегии 30m
  deal = new TestClass3825(optionsForTest.options30m) // придумать как передать symbol в optionsForTest
  let deals30m = deal.findSygnal(candles30m, candles1m)
  console.log(`кол-во сделок 30m = ${deals30m.length} штук`)

  // запускаем тест стратегии 15m
  deal = new TestClass3825(optionsForTest.options15m) // придумать как передать symbol в optionsForTest
  let deals15m = deal.findSygnal(candles15m, candles1m)
  console.log(`кол-во сделок 15m = ${deals15m.length} штук`)

  // сохраняем сделки в файл
  saveDeals(deals4h, optionsForSaveDeals.optionsForSave4h)
  saveDeals(deals2h, optionsForSaveDeals.optionsForSave2h)
  saveDeals(deals1h, optionsForSaveDeals.optionsForSave1h)
  saveDeals(deals30m, optionsForSaveDeals.optionsForSave30m)
  saveDeals(deals15m, optionsForSaveDeals.optionsForSave15m)

  ///////////////////////////////////
  // считаем общую прибыль по всем ТФ
  let totalSumm4h = statistics(deals4h, intervalObject.timeFrame4h)
  let totalSumm2h = statistics(deals2h, intervalObject.timeFrame2h)
  let totalSumm1h = statistics(deals1h, intervalObject.timeFrame1h)
  let totalSumm30m = statistics(deals30m, intervalObject.timeFrame30m)
  let totalSumm15m = statistics(deals15m, intervalObject.timeFrame15m)

  let totalSumm = []
  totalSumm = totalSumm
    .concat(totalSumm4h)
    .concat(totalSumm2h)
    .concat(totalSumm1h)
    .concat(totalSumm30m)
    .concat(totalSumm15m)

  // сохраняем статистику в файл
  // saveDeals(totalSumm4h, optionsForStat.optionsForSaveStat4h)
  // saveDeals(totalSumm2h, optionsForStat.optionsForSaveStat2h)
  // saveDeals(totalSumm1h, optionsForStat.optionsForSaveStat1h)
  // saveDeals(totalSumm30m, optionsForStat.optionsForSaveStat30m)
  // saveDeals(totalSumm15m, optionsForStat.optionsForSaveStat15m)
  saveDeals(totalSumm, optionsForStat.optionsForSaveStatAll)

  console.log(`программа завершена (ОК)`)
}

module.exports = testLogics3825
