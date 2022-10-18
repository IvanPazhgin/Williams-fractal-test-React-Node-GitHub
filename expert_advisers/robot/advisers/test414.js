const getCandles = require('../../../API/binance.engine/usdm/getCandles.5param')
const candlesToObject = require('../../common.func/candlesToObject')

function inboxData() {
  const date1 = Date.parse('2022-10-14T11:00:00.000')
  const sybmol1 = {
    sybmol: 'YFIUSDT',
    timeframe: '1h',
    startTime: date1,
    endTime: date1 + 1000 * 60 * 60 * 4,
    //startTimeHuman: new Date(date1),
  }
  //return sybmol1 // 1 зелёная и 2 красных
  //console.log(sybmol1)

  const date2 = Date.parse('2022-10-16T18:00:00.000')
  const sybmol2 = {
    sybmol: 'SKLUSDT',
    timeframe: '1h',
    startTime: date2,
    endTime: date2 + 1000 * 60 * 60 * 4,
    //startTimeHuman: new Date(date1),
  }
  //return sybmol2 // новая структура

  const date3 = Date.parse('2022-10-11T10:00:00.000')
  const sybmol3 = {
    sybmol: 'FOOTBALLUSDT',
    timeframe: '30m',
    startTime: date3,
    endTime: date3 + 1000 * 60 * 30 * 4,
    //startTimeHuman: new Date(date1),
  }
  //return sybmol3 // 3 зеленых и 1 красная

  const date4 = Date.parse('2022-10-17T22:00:00.000')
  const sybmol4 = {
    sybmol: 'DYDXUSDT',
    timeframe: '1h',
    startTime: date4,
    endTime: date4 + 1000 * 60 * 60 * 4,
    //startTimeHuman: new Date(date1),
  }
  //return sybmol4 // 1 зелёная и 2 красных

  const date5 = Date.parse('2022-10-15T00:00:00.000')
  const sybmol5 = {
    sybmol: 'STGUSDT',
    timeframe: '1h',
    startTime: date5,
    endTime: date5 + 1000 * 60 * 60 * 4,
    //startTimeHuman: new Date(date1),
  }
  return sybmol5 // 1 зелёная и 2 красных
}

async function prepairData(data) {
  const limitOfCandle = 5
  const temp = await getCandles(
    data.sybmol,
    data.timeframe,
    data.startTime,
    data.endTime,
    limitOfCandle
  )
  const candles = candlesToObject(temp)
  //console.table(candles)
  return candles
}

function findSygnal(candles) {
  // ищем сигнал №1: 3 зелёных, 1 красная
  // вычисляем длину зеленых свечей
  let bodyLength1g = candles[0].close / candles[0].open - 1
  let bodyLength2g = candles[1].close / candles[1].open - 1
  // готовим данные по свече фрактала
  let fractalBodyLength = candles[2].close / candles[2].open - 1

  // середина верхней тени 4й красной свечи
  let middleShadow = (candles[3].open + candles[3].high) / 2

  if (
    // три первых свечи - ЗЕЛЕНЫЕ
    candles[0].close > candles[0].open && // 1я свеча ЗЕЛЕНАЯ
    candles[1].close > candles[1].open && // 2я свеча ЗЕЛЕНАЯ
    candles[2].close > candles[2].open && // 3я свеча фрактала ЗЕЛЕНАЯ
    // объемы растут (каждая зелёная больше объёмом)
    candles[0].volume < candles[1].volume &&
    candles[1].volume < candles[2].volume &&
    // тело каждой след-й зеленой больше предыдущей
    bodyLength1g < bodyLength2g &&
    bodyLength2g < fractalBodyLength &&
    // далее
    candles[3].open > candles[3].close && // 4я свеча КРАСНАЯ
    candles[4].close > candles[4].open && // 5 свеча зелёная
    candles[4].close >= middleShadow // и закрылась выше либо на середине тени 4й свечи
  ) {
    console.log('3 зеленых и 1 красная')
  } else {
    console.log(`сигнал №1 отсутствует: 3 зеленых и 1 красная`)
  }

  // ищем сигнал №2: 1 зелёная 2 красных
  // середина верхней тени 3й красной свечи
  middleShadow = (candles[2].open + candles[2].high) / 2
  // длина тела 5й зеленой свечи
  let bodyLength5g = candles[4].close / candles[4].open - 1

  // верхняя тень 5й зеленой свечи
  let upperShadow5g = candles[4].high / candles[4].close - 1

  if (
    candles[0].open > candles[0].close && // первая свеча - красная
    candles[1].close > candles[1].open && // вторая свеча - зеленая
    candles[2].open > candles[2].close && // свеча фрактала КРАСНАЯ
    candles[3].open > candles[3].close && // 4я свеча КРАСНАЯ
    candles[4].close > candles[4].open && // 5я свеча зеленая
    candles[4].close >= middleShadow && // и закрылась выше либо на середине тени 3й свечи
    //candles[4].high >= candles[2].high && // и хай 5-ой должен быть выше хая 3 красной
    upperShadow5g < bodyLength5g
  ) {
    console.log('1 зелёная и 2 красных')
  } else {
    console.log(`сигнал №2 отсутствует: 1 зелёная и 2 красных`)
  }
}

async function test414() {
  const data1 = inboxData()
  const candles = await prepairData(data1)
  console.table(data1)
  console.table(candles)
  findSygnal(candles)
}

module.exports = test414
