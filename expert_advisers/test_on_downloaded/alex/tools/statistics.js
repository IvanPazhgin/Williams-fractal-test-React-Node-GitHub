class TotalSumm {
  constructor(interval) {
    this.interval = interval
    this.totalSumm = 0
    this.countOfPositive = 0
    this.countOfNegative = 0
    this.countOfZero = 0
  }
}

function summ(deals, SumObj) {
  deals.forEach((deal) => {
    SumObj.totalSumm += deal.profit
    if (deal.profit > 0) {
      SumObj.countOfPositive++
    } else if (deal.profit < 0) {
      SumObj.countOfNegative++
    } else SumObj.countOfZero++
  })
  return SumObj
}

function statistics(deals, interval) {
  let totalSumm = new TotalSumm(interval)
  //let totalSumm2h = new TotalSumm()
  //let totalSumm1h = new TotalSumm()
  //let totalSumm30m = new TotalSumm()
  //let totalSumm15m = new TotalSumm()

  return summ(deals, totalSumm)
  //return {totalSumm4h, totalSumm2h, totalSumm1h, totalSumm30m, totalSumm15m}
}

/*
function statistics() {
  // 4h
  let totalSumm4h = {
    totalSumm: 0,
    countOfPositive: 0,
    countOfNegative: 0,
    countOfZero: 0,
  }
  deals4h.forEach((deal) => {
    totalSumm4h.totalSumm += deal.profit
    if (deal.profit > 0) {
      totalSumm4h.countOfPositive++
    } else if (deal.profit < 0) {
      totalSumm4h.countOfNegative++
    } else totalSumm4h.countOfZero++
  })

  // 2h
  let totalSumm2h = {
    totalSumm: 0,
    countOfPositive: 0,
    countOfNegative: 0,
    countOfZero: 0,
  }
  deals2h.forEach((deal) => {
    totalSumm2h.totalSumm += deal.profit
    if (deal.profit > 0) {
      totalSumm2h.countOfPositive++
    } else if (deal.profit < 0) {
      totalSumm2h.countOfNegative++
    } else totalSumm2h.countOfZero++
  })
  // 1h
  let totalSumm1h = {
    totalSumm: 0,
    countOfPositive: 0,
    countOfNegative: 0,
    countOfZero: 0,
  }
  deals1h.forEach((deal) => {
    totalSumm1h.totalSumm += deal.profit
    if (deal.profit > 0) {
      totalSumm1h.countOfPositive++
    } else if (deal.profit < 0) {
      totalSumm1h.countOfNegative++
    } else totalSumm1h.countOfZero++
  })
  // 30m
  let totalSumm30m = {
    totalSumm: 0,
    countOfPositive: 0,
    countOfNegative: 0,
    countOfZero: 0,
  }
  deals30m.forEach((deal) => {
    totalSumm30m.totalSumm += deal.profit
    if (deal.profit > 0) {
      totalSumm30m.countOfPositive++
    } else if (deal.profit < 0) {
      totalSumm30m.countOfNegative++
    } else totalSumm30m.countOfZero++
  })
  // 15m
  let totalSumm15m = {
    totalSumm: 0,
    countOfPositive: 0,
    countOfNegative: 0,
    countOfZero: 0,
  }
  deals15m.forEach((deal) => {
    totalSumm15m.totalSumm += deal.profit
    if (deal.profit > 0) {
      totalSumm15m.countOfPositive++
    } else if (deal.profit < 0) {
      totalSumm15m.countOfNegative++
    } else totalSumm15m.countOfZero++
  })
}
*/

module.exports = statistics
