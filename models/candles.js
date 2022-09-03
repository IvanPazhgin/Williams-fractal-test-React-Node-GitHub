class Candles {
  constructor(candle) {
    this.startTime = candle[0]
    this.open = Number(candle[1])
    this.high = Number(candle[2])
    this.low = Number(candle[3])
    this.close = Number(candle[4])
    this.volume = Number(candle[5])
    this.endTime = candle[6]
  }

  /*
  constructor(startTime) {
    this.startTime = startTime
    this.endTime = endTime
    this.open = open
    this.close = close
    this.low = low
    this.high = high
    this.volume = volume
  }
  */

  toObject(arg) {
    let target = []
    arg.forEach(function (item, i, arg) {
      target[i] = {
        startTime: this.item[0],
        //openTimeH: timestampToDateHuman(item[0]),
        open: Number(this.item[1]),
        high: Number(this.item[2]),
        low: Number(this.item[3]),
        close: Number(this.item[4]),
        volume: Number(this.item[5]),
        endTime: this.item[6],
      }
    })
    return target
  }
}

module.exports = Candles
