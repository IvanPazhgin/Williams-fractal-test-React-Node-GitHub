/*
// 01.09.2022 для alex38Notice2h
const symbols38 = [
  'UNFIUSDT',
  'PEOPLEUSDT',
  'BELUSDT',
  'BLZUSDT',
  'SANDUSDT',
  'BANDUSDT',
  'STORJUSDT',
  'ETCUSDT',
  'ATOMUSDT',
  'LINAUSDT',
  'APEUSDT',
  '1INCHUSDT',
  'ALPHAUSDT',
  'API3USDT',
  'DGBUSDT',
  'XRPUSDT',
]
*/

const timeFrames = {
  timeFrame2h: '2h',
  timeFrame15m: '15m',
  timeFrame1m: '1m',
}

const nameStrategy = {
  notice2h382: `Стратегия №3.8.2: Без теневая на ${timeFrames.timeFrame2h}`,
  notice15m382: `Стратегия №3.8.2: Без теневая на ${timeFrames.timeFrame15m}`,
}

// 03.09.2022 для alex38Notice2h (внесли дополнительные условия)
const symbols2h38 = [
  //'1000SHIBUSDT',
  '1INCHUSDT',
  'AAVEUSDT',
  'ADAUSDT',
  'ALGOUSDT',
  'ALPHAUSDT',
  'ANCUSDT',
  'APEUSDT',
  'API3USDT',
  'ARPAUSDT',
  'ATOMUSDT',
  'AVAXUSDT',
  'BANDUSDT',
  'BELUSDT',
  'BLZUSDT',
  'BNBUSDT',
  'C98USDT',
  'CELOUSDT',
  'COMPUSDT',
  'CRVUSDT',
  'CTKUSDT',
  'DARUSDT',
  'DASHUSDT',
  'DGBUSDT',
  'DOTUSDT',
  'EGLDUSDT',
  'ENJUSDT',
  //'ENSUSDT',
  'EOSUSDT',
  'ETCUSDT',
  'ETHUSDT',
  'FILUSDT',
  //'FTMUSDT',
  'GALUSDT',
  'GMTUSDT',
  'HBARUSDT',
  'HNTUSDT',
  'HOTUSDT',
  'KAVAUSDT',
  'LINAUSDT',
  'LINKUSDT',
  'MANAUSDT',
  'PEOPLEUSDT',
  'RSRUSDT',
  'RVNUSDT',
  'SANDUSDT',
  'SNXUSDT',
  //'SOLUSDT',
  'STORJUSDT',
  'THETAUSDT',
  'TRBUSDT',
  'TRXUSDT',
  'UNFIUSDT',
  'UNIUSDT',
  'VETUSDT',
  'WAVESUSDT',
  'XMRUSDT',
  'XRPUSDT',
  //'XTZUSDT',
]

// 01.09.2022 для alex38Notice2hHard
const symbols38hard2h = ['HOTUSDT', 'ENJUSDT', 'SUSHIUSDT', 'FLOWUSDT']

// 01.09.2022 для alex38Notice4hHard
const symbols38hard4h = [
  'UNFIUSDT',
  'PEOPLEUSDT',
  'BANDUSDT',
  'XRPUSDT',
  'DGBUSDT',
]

module.exports = {
  symbols2h38,
  symbols38hard2h,
  symbols38hard4h,
  timeFrames,
  nameStrategy,
}
