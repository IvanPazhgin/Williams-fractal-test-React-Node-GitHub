//const interval = require('rxjs')
//import { interval } from 'rxjs'
//const { Observable } = require('rxjs')

/*
// import { Observable } from 'rxjs'
// 2 варианта решения:
// 1. прикрутить babel
// 2. прописать type: module и игнорировать node_modules в packege.json
*/

const getLastCandle4s = require('../../../../../API/binance.engine/web.socket.usdm/getLastCandle4s')
const notInPosition = require('./NotInPosition')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
//const closeShort = require('../alex38Common2h/closeShort')
const changeTPSL = require('../alex38Common2h/changeTPSL')
const canShort = require('../alex38Common2h/canShort')
// const { SymbolObjNotice } = require('../../../../../models/symbolNotice') // for Export вначале файла
const SymbolObjNotice = require('../../../../../models/symbolNotice')
//const symbols3 = require('../../../../../models/symbolsClass') // для удобного выноса общих переменных

async function alex38Notice2h(symbols3) {
  const nameStrategy = 'Стратегия №3.8: Без теневая 2h'
  const timeFrames = ['5m', '1m']

  let lastCandle // последняя свечка
  let i = 0 // для поиска последней свечи по массиву symbols3

  // получаем от пользователя список инструментов
  // const symbols3 = ['UNFIUSDT', 'PEOPLEUSDT', 'BELUSDT', 'BLZUSDT', 'SANDUSDT']
  // let symbolObj4 = new SymbolObjNotice('btc', nameStrategy) // одна монета по принципу класса

  let symbolObj3 = []

  symbols3.forEach(function (item, i, arg) {
    symbolObj3[i] = new SymbolObjNotice(item, nameStrategy)
  })

  // console.log('монеты для старта')
  // console.table(symbolObj3)

  // эксперимент с обнулением состояний каждой монеты
  //symbolObj3[0].reset('btc', nameStrategy)
  //console.table(symbolObj3[0])
  //return

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

  // родительская функция, которая вызывает весь скрипт ниже по отдельности

  // получаем новые свечки:
  // если !inPosidion -> ищем вход; иначе проверяем условие выхода или проверяем условия переноса TP и SL
  await getLastCandle4s(
    symbols3,
    timeFrames,
    async ({
      symbol: symbol,
      interval: interval,
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
        interval: interval,
        openTime: openTime,
        openPrice: openPrice,
        closePrice: closePrice,
        lowPrice: lowPrice,
        highPrice: highPrice,
        volume: volume,
        final: final,
      }
      console.table(lastCandle)

      symbolObj3.forEach(async (item) => {
        //do {
        if (item.symbol.includes(lastCandle.symbol)) {
          // проверяем условия выхода из сделки:
          if (item.inPosition) {
            // новая свеча:
            // 1. выходит из сделки по TP и SL
            // или
            // 2. проверяет условия изменения TP и SL
            if (!final) {
              // 1. для начала каждую секунду проверяем условие выхода из сделки по TP и SL
              item.closeShortPosition(lastCandle, timeFrames[1])

              // если вышли из сделки, то обнуляем состояние сделки:
              if (!item.inPosition) {
                // можно считать что сделка закрыта
                item.reset()
                console.log(
                  `${item.symbol}: Закрыли short. Очистили параметры сделки`
                )
              } // обнуляем состояние сделки до первоначального состояния
            } else {
              // if(final)
              // 2. затем проверяем условие изменения SL и TP
              // console.log(`проверяем условие изменения SL и TP`)
              item.changeTPSL(lastCandle)
            }
            // end of: if (symbolObj.inPosition)
          } else {
            // if (!symbolObj.inPosition)
            // 1. ждем цену на рынке для входа по сигналу
            if (!final) {
              item.canShortPosition(lastCandle)
            } else {
              //if (final) {
              // если не вошли в сделку, то для начала очищаем все параметры
              if (item.canShort) {
                // если до финальной свечке не вошли в сделку, то отменяем сигнал
                sendInfoToUser(
                  `${item.nameStrategy}\n${item.whitchSignal}\n\nМонета: ${
                    item.symbol
                  }\n\n--== ОТМЕНА сигнала ==--\nСигнал был: ${timestampToDateHuman(
                    item.sygnalTime
                  )}\nУДАЛИ ордер на бирже\n\nЖдем следющего сигнала...`
                )
                item.reset()
                console.log(
                  `${item.symbol}: Отменили сигнал. Очистили параметры сделки`
                )
              } // обнуляем состояние сигнала

              // 2. на финальной свечке запускаем поиск сигнала на вход
              // ищем сигнал для входа
              await item.prepairData(lastCandle, timeFrames[0])
            } // //if (final)
          } // end of: if (symbolObj.inPosition)
        } else {
          //console.log(`${item.symbol}: не пришла свечка из web socket`)
        } // если lastCandle содержит текущую монету в цикле if (symbolObj3[i])
        //} // if (symbolObj3[i].symbol.includes(lastCandle.symbol))
        //} while (i < symbolObj3.length)
      })
    } // callback
  ) // await getLastCandle4s()
}

module.exports = alex38Notice2h
