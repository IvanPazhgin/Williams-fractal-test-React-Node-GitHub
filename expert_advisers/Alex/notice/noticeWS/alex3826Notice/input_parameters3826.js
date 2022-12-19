const timeFrames = {
  timeFrame2h: '2h',
  timeFrame15m: '15m',
  timeFrame1m: '1m',
}

const nameStr = '3.8.2.6'
const entryAmountPercent = 25 // 25% депозита будет использовано в одной сделке

const nameStrategy = {
  notice2h382: `3.8.2.6: Без теневая на ${timeFrames.timeFrame2h}`,
  //notice15m382: `Стратегия №3.8.2: Без теневая на ${timeFrames.timeFrame15m}`,
}

module.exports = {
  timeFrames,
  nameStrategy,
  nameStr,
  entryAmountPercent,
}
