//const interval = require('rxjs')
//import { interval } from 'rxjs'
//const { Observable } = require('rxjs')

/*
// import { Observable } from 'rxjs'
// 2 варианта решения:
// 1. прикрутить babel
// 2. прописать type: module и игнорировать node_modules в packege.json
*/

const getLastCandle4s = require('../../../../API/binance.engine/alex/getLastCandle4s')
const notInPosition = require('./NotInPosition')
const { sendInfoToUser } = require('../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../common.func/timestampToDateHuman')
const closeShort = require('./closeShort')
const changeTPSL = require('./changeTPSL')
const canShort = require('./canShort')

async function alex3notice12s() {
  const nameStrategy = 'Стратегия №3: Без теневая'
  const timeFrame = '2h'

  let lastCandle // последняя свечка
  let i = 0 // для поиска последней свечи по массиву symbols3

  // получаем от пользователя список инструментов
  const symbols3 = [
    'UNFIUSDT',
    'PEOPLEUSDT',
    'BELUSDT',
    'BLZUSDT',
    //'ROSEUSDT',
    'GMTUSDT',
    'SANDUSDT',
    'BANDUSDT',
    //'NKNUSDT',
    'DYDXUSDT',
    'STORJUSDT',
    'STMXUSDT',
    //'ANKRUSDT',
    'AUDIOUSDT',
    'OGNUSDT',
    'ETCUSDT',
  ]

  let symbolObj3 = []

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

  sendInfoToUser(
    `Приложение запущено в ${timestampToDateHuman(new Date().getTime())}\nНа ${
      symbols3.length
    } инструментах: ${JSON.stringify(
      symbols3
    )}\nТайм Фрэйм: ${timeFrame}\n${nameStrategy}\nЖдем завершенную свечку ${timeFrame}...`
  )

  // родительская функция, которая вызывает весь скрипт ниже по отдельности

  // получаем новые свечки:
  // если !inPosidion -> ищем вход; иначе проверяем условие выхода или проверяем условия переноса TP и SL
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
        openPrice: openPrice,
        closePrice: closePrice,
        lowPrice: lowPrice,
        highPrice: highPrice,
        volume: volume,
        final: final,
      }

      i = 0
      do {
        if (symbolObj3[i].symbol.includes(lastCandle.symbol)) {
          // проверяем условия выхода из сделки:
          if (symbolObj3[i].inPosition) {
            // новая свеча:
            // 1. выходит из сделки по TP и SL
            // или
            // 2. проверяет условия изменения TP и SL
            if (!final) {
              // 1. для начала каждую секунду проверяем условие выхода из сделки по TP и SL
              symbolObj3[i] = closeShort(lastCandle, symbolObj3[i])

              // если вышли из сделки, то обнуляем состояние сделки:
              if (!symbolObj3[i].inPosition) {
                // можно считать что сделка закрыта
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
                console.log(
                  `${symbolObj3[i].symbol}: Закрыли short. Очистили параметры сделки`
                )
              } // обнуляем состояние сделки до первоначального состояния
            } else {
              // if(final)
              // 2. затем проверяем условие изменения SL и TP
              // console.log(`проверяем условие изменения SL и TP`)
              symbolObj3[i] = changeTPSL(lastCandle, symbolObj3[i])
            }
            // end of: if (symbolObj.inPosition)
          } else {
            // if (!symbolObj.inPosition)
            // 1. ждем цену на рынке для входа по сигналу
            if (!final) {
              symbolObj3[i] = canShort(lastCandle, symbolObj3[i])
            } else {
              //if (final) {
              // если не вошли в сделку, то для начала очищаем все параметры
              if (symbolObj3[i].canShort) {
                // если до финальной свечке не вошли в сделку, то отменяем сигнал
                sendInfoToUser(
                  `${symbolObj3[i].nameStrategy}\n${
                    symbolObj3[i].whitchSignal
                  }\n\nМонета: ${
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
                console.log(
                  `${symbolObj3[i].symbol}: Отменили сигнал. Очистили параметры сделки`
                )
              } // обнуляем состояние сигнала

              // 2. на финальной свечке запускаем поиск сигнала на вход
              // ищем сигнал для входа
              symbolObj3[i] = await notInPosition(
                lastCandle,
                symbolObj3[i],
                timeFrame
              )
            } // //if (final)
          } // end of: if (symbolObj.inPosition)
        } else {
          //console.log(`${item.symbol}: не пришла свечка из web socket`)
        } // если lastCandle содержит текущую монету в цикле if (symbolObj3[i])
        i++
        //} // if (symbolObj3[i].symbol.includes(lastCandle.symbol))
      } while (i < symbolObj3.length)
    } // callback
  ) // await getLastCandle4s()
}

module.exports = alex3notice12s
