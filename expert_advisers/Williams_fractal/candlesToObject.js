function candlesToObject(arg) {
  let target = []
  arg.forEach(function (item, i, arg) {
    target[i] = {
      openTime: item[0],
      // openTimeH: timestampToDateHuman(item[0]),
      openPrice: Number(item[1]),
      highPrice: Number(item[2]),
      lowPrice: Number(item[3]),
      closePrice: Number(item[4]),
    }
  })
  return target
}

module.exports = candlesToObject
