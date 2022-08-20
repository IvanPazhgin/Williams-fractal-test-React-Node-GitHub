//const interval = require('rxjs')
//import { interval } from 'rxjs'
//const { Observable } = require('rxjs')

/*
// import { Observable } from 'rxjs'
// 2 варианта решения:
// 1. прикрутить babel
// 2. прописать type: module и игнорировать node_modules в packege.json
*/

const getLastCandle4s = require('../../../API/binance.engine/alex/getLastCandle4s')
const notInPosition = require('./NotInPosition')
const { sendInfoToUser } = require('../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const closeShort = require('./closeShort')
const changeTPSL = require('./changeTPSL')
const canShort = require('./canShort')

async function alex38notification8s() {
  // получаем от пользователя список инструментов
  /*
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
*/
  const symbols3 = [
    'UNFIUSDT',
    'PEOPLEUSDT',
    'BELUSDT',
    'BLZUSDT',
    'ROSEUSDT',
    'GMTUSDT',
    'SANDUSDT',
    'BANDUSDT',
  ]

  let symbolObj3 = []

  const nameStrategy = 'Стратегия №3: Без теневая RC 8'

  symbols3.forEach(function (item, i, arg) {
    // создаем массив состояний по сделке
    symbolObj3[i] = {
      symbol: item,
      canShort: false,
      inPosition: false,
      deposit: 1000,
      whitchSignal: '',
      openShort: 0,
      positionTime: 0,
      sygnalTime: 0,
      amountOfPosition: 0,
      takeProfit: 0,
      stopLoss: 0,
      changedTP: false,
      changedSL: false,
      closeShort: 0,
      closeTime: 0,
      profit: 0,
      percent: 0,
      nameStrategy: nameStrategy,
    }
  })

  // console.log('монеты для старта')
  // console.table(symbolObj3)

  // создать родительскую функцию, которая будет вызывать весь скрипт ниже по отдельности

  const timeFrame = '2h'

  let lastCandle // последняя свечка
  let i = 0 // для поиска последней свечи по массиву symbols3

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
    )}\nИнструменты: ${JSON.stringify(
      symbols3
    )}\nТайм Фрэйм: ${timeFrame}\n${nameStrategy}\nЖдем завершенную свечку ${timeFrame}...`
  )

  // получаем новые свечки; если !inPosidion -> ищем вход, иначе меняем TP и SL, проверяем условие выхода
  await getLastCandle4s(
    symbols3,
    timeFrame,
    async ({
      symbol: symbol,
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
        symbol: symbol,
        openTime: openTime,
        //openTimeH: timestampToDateHuman(openTime),
        openPrice: openPrice,
        closePrice: closePrice,
        lowPrice: lowPrice,
        highPrice: highPrice,
        volume: volume,
        final: final,
      }
      // console.log(`lastCandle.sybmol = ${lastCandle.symbol}, тип = ${typeof lastCandle.symbol}`)

      // let qq = new Date().getTime()
      // console.log(`время получения новой свечи: ${timestampToDateHuman(qq)}`)

      // console.log('новая свечка из WS')
      // console.table(lastCandle)

      i = 0
      do {
        //if (symbolObj3[i]) {
        if (symbolObj3[i].symbol.includes(lastCandle.symbol)) {
          //console.log(`i = ${i}`)
          //console.log(`symbolObj3[i].symbol = ${symbolObj3[i].symbol}, тип = ${typeof symbolObj3[i].symbol}`)
          if (symbolObj3[i].inPosition) {
            // проверяем условия выхода из сделки:
            // новая свеча:
            // 1. выходит из сделки по TP и SL
            // или
            // 2. проверяет условия изменения TP и SL
            if (!final) {
              // 1. для начала проверяем условие выхода из сделки по SL и TP
              console.log(
                `--== проверяем условие выхода из сделки по SL и TP ==--`
              )
              console.log(`текущее состояние сделки (до изменений TP и SL):`)
              console.table(symbolObj3[i])

              symbolObj3[i] = closeShort(lastCandle, symbolObj3[i])

              console.log(
                'получили изменения в состоянии сделки после closeShort()'
              )
              console.table(symbolObj3[i])

              // можно считать что сделка закрыта, поэтому обнуляем состояние сделки:
              if (!symbolObj3[i].inPosition) {
                symbolObj3[i] = {
                  symbol: symbolObj3[i].symbol,
                  canShort: false,
                  inPosition: false,
                  deposit: 1000,
                  whitchSignal: '',
                  openShort: 0,
                  positionTime: 0,
                  sygnalTime: 0,
                  amountOfPosition: 0,
                  takeProfit: 0,
                  stopLoss: 0,
                  changedTP: false,
                  changedSL: false,
                  closeShort: 0,
                  closeTime: 0,
                  profit: 0,
                  percent: 0,
                  nameStrategy: nameStrategy,
                }
              } // обнуляем состояние сделки до первоначального состояния
            } else {
              // if(final)
              // 2. затем проверяем условие изменения SL и TP
              console.log(`проверяем условие изменения SL и TP`)
              symbolObj3[i] = changeTPSL(lastCandle, symbolObj3[i])

              console.log(
                'получили изменения в состоянии сделки после changeTPSL()'
              )
              console.table(symbolObj3[i])

              // const timeOfLastCandle = lastCandle.openTime
              // const timeOfLastCandle = new Date(lastCandle.openTime)
              // sendInfoToUser(`получили новую свечку ${timeFrame} через WS, время свечи: ${timeOfLastCandle}`)
            }
            // end of: if (symbolObj.inPosition)
          } else {
            // if (!symbolObj.inPosition)
            // 1. ждем цену на рынке для входа по сигналу
            if (!final) {
              symbolObj3[i] = canShort(lastCandle, symbolObj3[i])
            } else {
              // 2. ждем финальную свечку для поиска точки входа
              //if (final) {
              // console.log('------===== пришла новая свечка ===== ------')

              // если не вошли в сделку, то очищаем все параметры
              if (symbolObj3[i].canShort) {
                // если до финальной свечке не вошли в сделку, то отменяем сигнал
                sendInfoToUser(
                  `${nameStrategy}\n${symbolObj3[i].whitchSignal}\n\nМонета: ${
                    symbolObj3[i].symbol
                  }\n\n--== ОТМЕНА сигнала ==--\nСигнал был: ${timestampToDateHuman(
                    symbolObj3[i].sygnalTime
                  )}\nУДАЛИ ордер на бирже\n\nЖдем следющего сигнала...`
                )

                symbolObj3[i] = {
                  symbol: symbolObj3[i].symbol,
                  canShort: false,
                  inPosition: false,
                  deposit: 1000,
                  whitchSignal: '',
                  openShort: 0,
                  positionTime: 0,
                  sygnalTime: 0,
                  amountOfPosition: 0,
                  takeProfit: 0,
                  stopLoss: 0,
                  changedTP: false,
                  changedSL: false,
                  closeShort: 0,
                  closeTime: 0,
                  profit: 0,
                  percent: 0,
                  nameStrategy: nameStrategy,
                }
              } // обнуляем состояние сигнала
              // можно вывести consol.log

              console.log(`начальное состояние сделки:`)
              console.table(symbolObj3[i])

              // ищем сигнал для входа
              // !! вызвать функцию (передать ей новый массив), где будет приниматься решение входить или нет
              // sendInfoToUser(`Прилетела новая свеча.\nЗапускаем поиск сигнала...`)
              //const temp = await notInPosition(lastCandle, symbolObj, timeFrame)
              symbolObj3[i] = await notInPosition(
                lastCandle,
                symbolObj3[i],
                timeFrame
              )

              //console.log('получили изменения в состоянии сделки после notInPosition()')
              // console.table(temp)
              //console.table(symbolObj3[i]) // убрал из-за вывода undefined в consol.log()
            } // //if (final)
          } // end of: if (symbolObj.inPosition)
        } else {
          //console.log(`${item.symbol}: не пришла свечка из web socket`)
        } // если lastCandle содержит текущую монету в цикле if (symbolObj3[i])
        i++
        //} // if (symbolObj3[i])
      } while (i < symbolObj3.length)
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

module.exports = alex38notification8s
