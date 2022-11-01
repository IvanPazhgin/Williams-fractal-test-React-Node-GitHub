const timeFrames = {
  timeFrame4h: '4h',
  //timeFrame4h: '5m', // для тестов
  timeFrame2h: '2h',
  timeFrame1h: '1h',
  // timeFrame1h: '5m', // для тестов
  timeFrame30m: '30m',
  timeFrame15m: '15m',
  timeFrame5m: '5m',
  timeFrame1m: '1m',
}

// 01.11.2022
const name = 'Test_4.3'

const nameStrategy = {
  notice4h41: `${name} на ${timeFrames.timeFrame4h}`,
  notice1h41: `${name} на ${timeFrames.timeFrame1h}`,
  notice30m41: `${name} на ${timeFrames.timeFrame30m}`,
  notice5m41: `${name} на ${timeFrames.timeFrame5m}`,
}

const options = {
  // 4h
  // takeProfitConst4h: 0.03,
  // stopLossConst4h: 0.02,
  // shiftTime4h: 1000 * 60 * 60 * 4, // сдвиг на одну 4h свечу

  // 1h
  takeProfitConst1h: 0.015,
  stopLossConst1h: 0.015,
  shiftTime1h: 1000 * 60 * 60, // сдвиг на одну 1h свечу

  // 30m
  takeProfitConst30m: 0.015,
  stopLossConst30m: 0.015,
  shiftTime30m: 1000 * 60 * 30, // сдвиг на одну 30m свечу
}

// разделил 100 монет по 50
const symbols4h41Part1 = [
  //'BTCUSDT',
  'ATAUSDT',
  'ETHUSDT',
  'BNBUSDT',
  '1INCHUSDT',
  '1000SHIBUSDT',
  'ALICEUSDT',
  'ADAUSDT',
  'ATOMUSDT',
  'AVAXUSDT',
  'AXSUSDT',
  'APEUSDT',
  'ALGOUSDT',
  'ANKRUSDT',
  'AAVEUSDT',
  'ARUSDT',
  'AUDIOUSDT',
  'BAKEUSDT',
  'BALUSDT',
  'BELUSDT',
  'BNXUSDT',
  'BLZUSDT',
  'CHZUSDT',
  'CHRUSDT',
  'CRVUSDT',
  'COMPUSDT',
  'CVXUSDT',
  'CTSIUSDT',
  'CTKUSDT',
  'COTIUSDT',
  'C98USDT',
  'DASHUSDT',
  'DYDXUSDT',
  'DOTUSDT',
  'DOGEUSDT',
  'DGBUSDT',
  'DUSKUSDT',
  'ENJUSDT',
  'ETCUSDT',
  'EOSUSDT',
  'JASMYUSDT',
  'LRCUSDT',
  'LINKUSDT',
  'FILUSDT',
  //'FLMUSDT',
  'FTMUSDT',
  'FTTUSDT',
  'FLOWUSDT',
  'ICPUSDT',
  'IOTAUSDT',
  'IOSTUSDT',
  'ICXUSDT',
  'LINAUSDT',
]

const symbols4h41Part2 = [
  'QTUMUSDT',
  'HNTUSDT',
  'HBARUSDT',
  'KAVAUSDT',
  'KNCUSDT',
  'KSMUSDT',
  'KLAYUSDT',
  'GALUSDT',
  'GALAUSDT',
  'GTCUSDT',
  'GMTUSDT',
  'NEARUSDT',
  'NEOUSDT',
  'NKNUSDT',
  'MATICUSDT',
  'MANAUSDT',
  'MASKUSDT',
  'MTLUSDT',
  'THETAUSDT',
  'TRBUSDT',
  'TRXUSDT',
  'OGNUSDT',
  'OPUSDT',
  'OMGUSDT',
  'OCEANUSDT',
  'SANDUSDT',
  'SRMUSDT',
  'SKLUSDT',
  'STGUSDT',
  'SUSHIUSDT',
  'SOLUSDT',
  'SNXUSDT',
  'STMXUSDT',
  'STORJUSDT',
  'PEOPLEUSDT',
  'REEFUSDT',
  'RUNEUSDT',
  'RLCUSDT',
  'RVNUSDT',
  'RSRUSDT',
  'ROSEUSDT',
  'ZRXUSDT',
  'ZECUSDT',
  'VETUSDT',
  'XEMUSDT',
  'XRPUSDT',
  'XLMUSDT',
  'XTZUSDT',
  'YFIUSDT',
  'UNIUSDT',
  'UNFIUSDT',
  'WAVESUSDT',
  'FOOTBALLUSDT',
]

module.exports = {
  timeFrames,
  nameStrategy,
  options,
  symbols4h41Part1,
  symbols4h41Part2,
}
