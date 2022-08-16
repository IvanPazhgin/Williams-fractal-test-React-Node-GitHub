//const interval = require('rxjs')
//import { interval } from 'rxjs'
//const { Observable } = require('rxjs')

/*
// import { Observable } from 'rxjs'
// 2 варианта решения:
// 1. прикрутить babel
// 2. прописать type: module и игнорировать node_modules в packege.json
*/

const getLastCandle = require('../../../API/binance.engine/alex/getLastCandle')
const notInPosition = require('./alex37NotInPosition')
const { sendInfoToUser } = require('../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const closeShort = require('./closeShort')
const changeTPSL = require('./changeTPSL')

async function alex37tradeMain() {
  // получаем от пользователя список инструментов
  const symbols1 = [
    'UNFIUSDT',
    'CRVUSDT',
    'UNIUSDT',
    'QTUMUSDT',
    'FLMUSDT',
    'GALUSDT',
    'TRBUSDT',
    'LPTUSDT',
    'LITUSDT',
    'BELUSDT',
  ]
  const symbols2 = [
    'UNFIUSDT',
    'TRBUSDT',
    'bnbusdt',
    'ethusdt',
    'blzusdt',
    'bandusdt',
  ]
  let symbolObj2 = []

  symbols2.forEach(function (item, i, arg) {
    // создаем массив сделок
    symbolObj2[i] = {
      symbol: item,
      inPosition: false,
      deposit: 1000,
      whitchSignal: '',
      openShort: 0,
      positionTime: 0,
      amountOfPosition: 0,
      takeProfit: 0,
      stopLoss: 0,
      closeShort: 0,
      closeTime: 0,
      profit: 0,
      percent: 0,
    }
  })

  // console.log('монеты для старта')
  // console.table(symbolObj2)

  // создать родительскую функцию, которая будет вызывать весь скрипт ниже по отдельности

  // const symbol = 'BTCUSDT' // тестируй на монете UNFI пусть она первая будет
  let symbolObj = {
    symbol: 'UNFIUSDT',
    canShort: false,
    inPosition: false,
    deposit: 1000,
    whitchSignal: '',
    openShort: 0,
    positionTime: 0,
    amountOfPosition: 0,
    takeProfit: 0,
    stopLoss: 0,
    //indexOfPostion: 0, // индекс точки входа для сдвига SL и TP
    changedTP: false,
    changedSL: false,
    closeShort: 0,
    closeTime: 0,
    profit: 0,
    percent: 0,
  }
  const timeFrame = '5m'

  let lastCandle // последняя свечка

  /*
  если несколько монет, то по каждой монете запоминаем еще и номер стратегии
  symbols = {
    symbol: symbol,
    strategy {
      name: 3.5,
      inPosition: false,
      openPosition: price,
      openTime: time,
      takeProfit: takeProfit,
      stopLoss: stopLoss 
    } 
  }
*/

  // начнем с простого: один инструмент
  sendInfoToUser(
    `Приложение запущено в ${timestampToDateHuman(
      new Date().getTime()
    )}\nИнструмент: ${
      symbolObj.symbol
    }\nТайм Фрэйм: ${timeFrame}\nСтратегия №3: Без теневая RC 7\nЖдем завершенную свечку ${timeFrame}...`
  )

  // получаем новые свечки; если !inPosidion -> ищем вход, иначе меняем TP и SL, проверяем условие выхода
  await getLastCandle(
    symbolObj,
    timeFrame,
    async ({
      startTime: openTime,
      open: openPrice,
      close: closePrice,
      low: lowPrice,
      high: highPrice,
      volume: volume,
      final: final,
    }) => {
      // сохраняем новую завершенную свечку
      lastCandle = {
        openTime: openTime,
        //openTimeH: timestampToDateHuman(openTime),
        openPrice: openPrice,
        closePrice: closePrice,
        lowPrice: lowPrice,
        highPrice: highPrice,
        volume: volume,
        final: final,
      }
      // let qq = new Date().getTime()
      // console.log(`время получения новой свечи: ${timestampToDateHuman(qq)}`)

      // console.log('новая свечка из WS')
      // console.table(lastCandle)

      if (symbolObj.inPosition) {
        // проверяем условия выхода из сделки:
        // новая свеча выходит из сделки или проверяет условия TP и SL, меняет их если надо
        if (!final) {
          // 1. для начала проверяем условие выхода из сделки по SL и TP
          console.log(`--== проверяем условие выхода из сделки по SL и TP ==--`)
          console.log(`текущее состояние сделки:`)
          console.table(symbolObj)

          symbolObj = closeShort(lastCandle, symbolObj)

          console.log('получили изменения в состоянии сделки')
          console.table(symbolObj)

          // можно считать что сделка закрыта, поэтому обнуляем состояние сделки:
          if (!symbolObj.inPosition) {
            symbolObj = {
              symbol: 'UNFIUSDT',
              inPosition: false,
              deposit: 1000,
              whitchSignal: '',
              openShort: 0,
              positionTime: 0,
              amountOfPosition: 0,
              takeProfit: 0,
              stopLoss: 0,
              //indexOfPostion: 0,
              changedTP: false,
              changedSL: false,
              closeShort: 0,
              closeTime: 0,
              profit: 0,
              percent: 0,
            }
          } // обнуляем состояние сделки до первоначального состояния
        } else {
          // if(final) - 2. затем проверяем условие изменения SL и TP
          console.log(`проверяем условие изменения SL и TP`)
          symbolObj = changeTPSL(lastCandle, symbolObj)

          console.log('получили изменения в состоянии сделки')
          console.table(symbolObj)

          // const timeOfLastCandle = lastCandle.openTime
          // const timeOfLastCandle = new Date(lastCandle.openTime)
          // sendInfoToUser(`получили новую свечку ${timeFrame} через WS, время свечи: ${timeOfLastCandle}`)
        }
        // end of: if (symbolObj.inPosition)
      } else {
        // if (!symbolObj.inPosition)
        // ждем финальную свечку
        if (final) {
          console.log('------===== пришла новая свечка ===== ------')
          console.log(`начальное состояние сделки:`)
          console.table(symbolObj)

          // ищем сигнал для входа
          // !! вызвать функцию (передать ей новый массив), где будет приниматься решение входить или нет
          // sendInfoToUser(`Прилетела новая свеча.\nЗапускаем поиск сигнала...`)
          //const temp = await notInPosition(lastCandle, symbolObj, timeFrame)
          symbolObj = await notInPosition(lastCandle, symbolObj, timeFrame)

          console.log('получили изменения в состоянии сделки')
          // console.table(temp)
          console.table(symbolObj)
        }
      } // end of: if (symbolObj.inPosition)
    } // callback
  ) // await getLastCandle()

  // RxJS interval
  /*
  const sub = interval(500).subscribe((data) => {
    if (data.kline.final) {
      temp = data.kline
    }
  })
  sub.unsubscribe()
  */

  // RxJS Observable
  /*
  const stream$ = Observable((observer) => {
    observer.next('First value')
  })

  stream$.subscribe((val) => console.log('val: ', val))
  */
}

module.exports = alex37tradeMain
