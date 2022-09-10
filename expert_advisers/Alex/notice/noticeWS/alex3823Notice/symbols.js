const timeFrames = {
  // timeFrame2h: '2h',
  timeFrame30m: '30m',
  // timeFrame15m: '15m',
  timeFrame1m: '1m',
}

const nameStrategy = {
  // notice2h3823: `Стратегия №3.8.2.3: Без теневая на ${timeFrames.timeFrame2h}`,
  // notice15m3823: `Стратегия №3.8.2.3: Без теневая на ${timeFrames.timeFrame15m}`,
  notice30m3823: `Стратегия №3.8.2.3: Без теневая на ${timeFrames.timeFrame30m}`,
}

// 10.09.2022
const symbols30m3823 = [
  'UNFIUSDT',
  'MANAUSDT',
  'BLZUSDT',
  'EGLDUSDT',
  'AVAXUSDT',
  'BELUSDT',
  'APEUSDT',
  'ETCUSDT',
  'STORJUSDT',
  'BANDUSDT',
]

module.exports = {
  symbols30m3823,
  timeFrames,
  nameStrategy,
}
