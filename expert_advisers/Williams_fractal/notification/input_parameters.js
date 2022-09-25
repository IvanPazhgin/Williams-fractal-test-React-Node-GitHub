const timeFrames = {
  timeFrame4h: '4h',
  timeFrame2h: '2h',
  //timeFrame2h: '15m', // для тестов
  timeFrame1h: '1h',
  timeFrame30m: '30m',
  timeFrame15m: '15m',
  timeFrame5m: '5m',
  timeFrame1m: '1m',
}

const nameStrategy = {
  // williams: `Стратегия Билла Вильямса на ${timeFrames.timeFrame2h}`,
  williams: `Стратегия Билла Вильямса на `,
}

const symbolsWilliams = ['BTCUSDT', 'ETHUSDT']

module.exports = {
  symbolsWilliams,
  timeFrames,
  nameStrategy,
}
