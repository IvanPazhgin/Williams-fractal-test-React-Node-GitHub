const timeFrames = {
  timeFrame4h: '4h',
  //timeFrame4h: '5m', // для тестов
  timeFrame2h: '2h',
  timeFrame1h: '1h',
  //timeFrame1h: '5m', // для тестов
  timeFrame30m: '30m',
  //timeFrame30m: '5m', // для тестов
  timeFrame15m: '15m',
  timeFrame5m: '5m',
  timeFrame1m: '1m',
}

const nameAlex = 'Test_4.1.4.2'
const nameStrategy = {
  //notice4h: `${nameAlex} на ${timeFrames.timeFrame4h}`,
  notice1h: `${nameAlex} на ${timeFrames.timeFrame1h}`,
  notice30m: `${nameAlex} на ${timeFrames.timeFrame30m}`,
  notice5m: `${nameAlex} на ${timeFrames.timeFrame5m}`,
}

const options = {
  // 4h
  //takeProfitConst4h: 0.03,
  //stopLossConst4h: 0.02,
  //shiftTime4h: 1000 * 60 * 60 * 4, // сдвиг на одну 4h свечу

  // 1h
  takeProfitFloating1h: 0.015,
  takeProfitConst1h: 0.015,
  stopLossConst1h: 0.015,
  shiftTime1h: 1000 * 60 * 60, // сдвиг на одну 1h свечу

  // 30m
  takeProfitFloating30m: 0.008,
  takeProfitConst30m: 0.01,
  stopLossConst30m: 0.01,
  shiftTime30m: 1000 * 60 * 30, // сдвиг на одну 30m свечу
}

// набор монет (100 < .. < 200) для мониторинга через web socket двух ТФ
/*
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
  'FLMUSDT',
  'FTMUSDT',
  'FTTUSDT',
  'FLOWUSDT',
  'ICPUSDT',
  'IOTAUSDT',
  'IOSTUSDT',
  'ICXUSDT',
  'LINAUSDT',
  'QTUMUSDT',
  'HNTUSDT',
  // разделить
  'HBARUSDT',
  'KAVAUSDT',
  'KNCUSDT',
  'KSMUSDT',
  'KLAYUSDT',
  'GALUSDT',
  'GALAUSDT',
  'GTCUSDT',
  'GMTUSDT',
  //'NEARUSDT',
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
*/

// для тестов
//const symbolsPart1 = ['UNFIUSDT', 'XRPUSDT', 'BLZUSDT']

// разделил 106 монет по 50
const symbolsPart1 = [
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

const symbolsPart2 = [
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
  //symbols4h41,
  timeFrames,
  nameStrategy,
  nameAlex,
  options,
  symbolsPart1,
  symbolsPart2,
}
