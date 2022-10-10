// const timestampToDateHuman = require('./timestampToDateHuman') // временно для проверки свечей

function candlesToObject(arg) {
  let target = []
  arg.forEach(function (item, i, arg) {
    target[i] = {
      startTime: item[0],
      //startTimeHuman: timestampToDateHuman(item[0]),
      open: Number(item[1]),
      high: Number(item[2]),
      low: Number(item[3]),
      close: Number(item[4]),
      volume: Number(item[5]),
      endTime: item[6],
    }
  })
  return target
}

module.exports = candlesToObject
