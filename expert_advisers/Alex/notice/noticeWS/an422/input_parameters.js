const timeFrames = {
  timeFrame4h: '4h',
  //timeFrame4h: '5m', // для тестов
  timeFrame2h: '2h',
  timeFrame1h: '1h',
  timeFrame30m: '30m',
  // timeFrame30m: '5m', // для тестов
  timeFrame15m: '15m',
  timeFrame5m: '5m',
  timeFrame1m: '1m',
}

const nameStr = 'test_4.2.2'

const nameStrategy = {
  notice4h41: `${nameStr} на ${timeFrames.timeFrame4h}`,
  notice1h41: `${nameStr} на ${timeFrames.timeFrame1h}`,
  notice30m41: `${nameStr} на ${timeFrames.timeFrame30m}`,
  notice5m41: `${nameStr} на ${timeFrames.timeFrame5m}`,
}

const options = {
  // 4h
  takeProfitConst4h: 0.03,
  stopLossConst4h: 0.02,
  shiftTime4h: 1000 * 60 * 60 * 4, // сдвиг на одну 4h свечу

  // 1h
  takeProfitConst1h: 0.01,
  stopLossConst1h: 0.01,
  shiftTime1h: 1000 * 60 * 60, // сдвиг на одну 1h свечу

  // 30m
  takeProfitConst30m: 0.03,
  stopLossConst30m: 0.02,
  shiftTime30m: 1000 * 60 * 30, // сдвиг на одну 30m свечу
}

module.exports = {
  timeFrames,
  nameStr,
  nameStrategy,
  options,
}
