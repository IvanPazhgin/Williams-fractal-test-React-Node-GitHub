const timeFrames = {
  timeFrame4h: '4h',
  //timeFrame4h: '5m', // для тестов
  timeFrame2h: '2h',
  timeFrame1h: '1h',
  timeFrame30m: '30m',
  timeFrame15m: '15m',
  timeFrame5m: '5m',
  timeFrame1m: '1m',
}

const name = 'Test_4.1.2'

// 19.09.2022
const nameStrategy = {
  notice4h41: `${name} на ${timeFrames.timeFrame4h}`,
  notice1h41: `${name} на ${timeFrames.timeFrame1h}`,
  notice30m41: `${name} на ${timeFrames.timeFrame30m}`,
  notice5m41: `${name} на ${timeFrames.timeFrame5m}`,
}

const options = {
  // 4h
  takeProfitConst4h: 0.03,
  stopLossConst4h: 0.02,
  shiftTime4h: 1000 * 60 * 60 * 4, // сдвиг на одну 4h свечу

  // 1h
  takeProfitConst1h: 0.015,
  stopLossConst1h: 0.01,
  shiftTime1h: 1000 * 60 * 60, // сдвиг на одну 1h свечу

  // 30m
  takeProfitConst30m: 0.015,
  stopLossConst30m: 0.01,
  shiftTime30m: 1000 * 60 * 30, // сдвиг на одну 30m свечу
}

//const symbols4h41 = ['UNFIUSDT', 'XRPUSDT', 'BLZUSDT']

const symbols4h41 = [
  'BTCUSDT',
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
  'AAVEUSDT',
  'BAKEUSDT',
  'BNXUSDT',
  'BLZUSDT',
  'CHZUSDT',
  'CHRUSDT',
  'CRVUSDT',
  'COMPUSDT',
  //'CVXUSDT',
  'CTKUSDT',
  //'COTIUSDT',
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
  'LINKUSDT',
  'FILUSDT',
  'FLMUSDT',
  'FTMUSDT',
  'ICPUSDT',
  'HNTUSDT',
  'KAVAUSDT',
  'KNCUSDT',
  'KSMUSDT',
  'GALUSDT',
  'GALAUSDT',
  'GTCUSDT',
  //'NEARUSDT',
  'NEOUSDT',
  'NKNUSDT',
  'MATICUSDT',
  'MANAUSDT',
  'MASKUSDT',
  'THETAUSDT',
  'TRBUSDT',
  'TRXUSDT',
  'OPUSDT',
  'OMGUSDT',
  'OCEANUSDT',
  'SANDUSDT',
  'SUSHIUSDT',
  'SOLUSDT',
  'SNXUSDT',
  'STMXUSDT',
  'STORJUSDT',
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
]

module.exports = {
  symbols4h41,
  timeFrames,
  nameStrategy,
  options,
}
