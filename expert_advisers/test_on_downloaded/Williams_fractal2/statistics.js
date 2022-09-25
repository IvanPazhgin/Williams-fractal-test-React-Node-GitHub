const saveDeals = require('../utils/saveDeals')
const { input_parameters } = require('./input_parameters')

function statistics(deals, optionsForSave) {
  // Добавить расчет прибыли по месяцам
  let summ = {
    interval: optionsForSave.interval,
    summProfitAll: 0, // сумма прибыли всех сделок
    summProfitReal: 0, // сумма прибыли всех сделок по депозиту с памятью
    summProfitShort: 0, // сумма прибыли только short сделок
    summProfitLong: 0, // сумма прибыли только long сделок
    countAllDeals: deals.length,
    countOfPositive: 0, // кол-во положительных сделок
    countOfNegative: 0, // кол-во отрицательных сделок
    //subsequenceOfNegative: 0, // кол-во последовательных подряд отрицательных сделок
  }

  let marginCall = '' // Дата слива депозита

  deals.forEach(function (deal, i, arg) {
    // сумма прибыли всех сделок с реальным депозитом
    summ.summProfitReal += deal.profitReal
    if (deal.depositReal < 50) {
      marginCall = deal.closeTimeHuman
    }
    // сумма прибыли всех сделок
    summ.summProfitAll += deal.profit
    if (summ.summProfitAll < -1000) {
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
  summ.negativeDealChain = countMax
  summ.depositReal = deals[deals.length - 1].depositReal
  summ.partOfDeposit = input_parameters.partOfDeposit
  summ.multiplier = input_parameters.multiplier
  summ.marginCall = marginCall

  //console.table(summ)
  //console.log(arrayNegativeDeals)
  //saveDeals(arrayNegativeDeals, optionsForSave)
  //statisticsPerMonth(deals)
  return { summ, arrayNegativeDeals }
}

// copy function

function statisticsPerMonth2(deals) {
  let month = 0
  let summ = 0
  let monthStat = {
    month: '',
    result: 0,
  }
  let yearStat = []
  deals.forEach(function (deal, i, arg) {
    month = new Date(deal.closeTime).getMonth()

    /*
    switch (month) {
      case 0:
        monthStat.month = 'Январь'
        monthStat.result += deal.profit
        break
      case 1:
        if (yearStat.length == 0) {
          //yearStat = yearStat.concat(monthStat)
          yearStat.push(monthStat)
        }
        monthStat.month = 'Февраль'
        monthStat.result += deal.profit
        break
      case 2:
        if (yearStat.length == 1) {
          yearStat = yearStat.concat(monthStat)
        }
        monthStat.month = 'Март'
        monthStat.result += deal.profit
        break
      case 3:
        if (yearStat.length == 2) {
          yearStat = yearStat.concat(monthStat)
        }
        monthStat.month = 'Апрель'
        monthStat.result += deal.profit
        break
      case 4:
        if (yearStat.length == 3) {
          yearStat = yearStat.concat(monthStat)
        }
        monthStat.month = 'Май'
        monthStat.result += deal.profit
        break
      case 5:
        if (yearStat.length == 4) {
          yearStat = yearStat.concat(monthStat)
        }
        monthStat.month = 'Июнь'
        monthStat.result += deal.profit
        break
      case 6:
        if (yearStat.length == 5) {
          yearStat = yearStat.concat(monthStat)
        }
        monthStat.month = 'Июль'
        monthStat.result += deal.profit
        break
      case 7:
        if (yearStat.length == 6) {
          yearStat = yearStat.concat(monthStat)
        }
        monthStat.month = 'Август'
        monthStat.result += deal.profit
        break
      case 8:
        if (yearStat.length == 7) {
          yearStat = yearStat.concat(monthStat)
        }
        monthStat.month = 'Сентябрь'
        monthStat.result += deal.profit
        break
      case 9:
        if (yearStat.length == 8) {
          yearStat = yearStat.concat(monthStat)
        }
        monthStat.month = 'Октярь'
        monthStat.result += deal.profit
        break
      case 10:
        if (yearStat.length == 9) {
          yearStat = yearStat.concat(monthStat)
        }
        monthStat.month = 'Ноябрь'
        monthStat.result += deal.profit
        break
      case 11:
        if (yearStat.length == 10) {
          yearStat = yearStat.concat(monthStat)
        }
        monthStat.month = 'Декабрь'
        monthStat.result += deal.profit
        break
      default:
      //yearStat = yearStat.concat(monthStat)
    }
    */

    if (month == 0) {
      summ += deal.profit
    }
    monthStat.month = 'Январь'
    monthStat.result = summ
    yearStat.push(monthStat)

    //monthStat.month = new Date(deal.closeTime).getMonth() + 1
    //console.log(`month = ${month}`)
  })
  console.table(yearStat)
  return yearStat
  //const month = bbb.getMonth()
}

module.exports = statistics
