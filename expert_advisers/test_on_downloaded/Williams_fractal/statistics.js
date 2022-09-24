const saveDeals = require('../utils/saveDeals')

function statistics(deals, optionsForSave) {
  // Добавить расчет прибыли по месяцам
  let summ = {
    summProfit: 0, // сумма прибыли всех сделок
    summProfitShort: 0, // сумма прибыли только short сделок
    summProfitLong: 0, // сумма прибыли только long сделок
    countOfPositive: 0, // кол-во положительных сделок
    countOfNegative: 0, // кол-во отрицательных сделок
    subsequenceOfNegative: 0, // кол-во последовательных подряд отрицательных сделок
  }

  let marginCall = '' // Дата слива депозита

  deals.forEach(function (deal, i, arg) {
    // сумма прибыли всех сделок
    summ.summProfit += deal.profit
    if (summ.summProfit < -1000) {
      marginCall = deal.closeTimeHuman
    }
    // сумма прибыли только short сделок
    if (deal.position == 'SHORT') {
      summ.summProfitShort += deal.profit
    }
    // сумма прибыли только long сделок
    if (deal.position == 'LONG') {
      summ.summProfitLong += deal.profit
    }
    // кол-во положительных сделок
    if (deal.profit > 0) {
      summ.countOfPositive++
    }
    // кол-во отрицательных сделок
    if (deal.profit < 0) {
      summ.countOfNegative++
    }
  })

  // вычисление кол-во подряд последовательных отрицательных сделок
  let count = 0
  let countMax = 0
  let negativeDeal = {}
  let arrayNegativeDeals = []
  //let temp = deals[0].profit
  for (let i = 1; i < deals.length; i++) {
    if (deals[i].profit < 0 && deals[i - 1].profit < 0) {
      count++
      negativeDeal = {
        count: count,
        closeTimeHuman: deals[i - 1].closeTimeHuman,
        profit: deals[i - 1].profit,
        percent: deals[i - 1].percent,
      }
      arrayNegativeDeals = arrayNegativeDeals.concat(negativeDeal)
    } else {
      if (count > countMax) {
        countMax = count
      }
      count = 0
    }
  }
  summ.negativeDeal = countMax

  console.table(summ)
  //console.log(arrayNegativeDeals)
  //console.log(`countMax = ${countMax}`)
  console.log(`marginCall = ${marginCall}`)
  saveDeals(arrayNegativeDeals, optionsForSave)
  return { summ, arrayNegativeDeals }
}

module.exports = statistics
