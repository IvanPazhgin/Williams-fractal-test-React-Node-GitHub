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
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const AlexNotice384Class15m = require('./alNot384Class15m')
const { symbols15m384, timeFrames, nameStrategy } = require('./symbols') // для удобного выноса общих переменных // для удобного выноса общих переменных

async function alex384Notice15m() {
  const timeFrames2 = [timeFrames.timeFrame15m, timeFrames.timeFrame1m]

  let lastCandle // последняя свечка

  // получаем от пользователя список инструментов
  // const { SymbolObjNotice } = require('../../../../../models/symbolNotice') // for Export вначале файла
  // let symbolObj4 = new SymbolObjNotice('btc', nameStrategy) // одна монета по принципу класса

  let symbolObj = []

  symbols15m384.forEach(function (item, i, arg) {
    symbolObj[i] = new AlexNotice384Class15m(item, nameStrategy.notice15m384)
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

  // родительская функция, которая вызывает весь скрипт ниже по отдельности
  // для начала получаем новые свечки:
  await getLastCandle4s(
    symbols15m384,
    timeFrames2,
    async ({
      symbol: symbol,
      interval: interval,
      startTime: startTime,
      endTime: endTime,
      open: open,
      close: close,
      low: low,
      high: high,
      volume: volume,
      final: final,
    }) => {
      // сохраняем новую завершенную свечку
      lastCandle = {
        symbol: symbol,
        interval: interval,
        startTime: startTime,
        endTime: endTime,
        open: open,
        close: close,
        low: low,
        high: high,
        volume: volume,
        final: final,
      }
      //console.table(lastCandle)

      // если !inPosidion -> ищем вход; иначе проверяем условие выхода или проверяем условия переноса TP и SL
      symbolObj.forEach(async (item) => {
        if (item.symbol.includes(lastCandle.symbol)) {
          // (1) если в сделке:
          if (item.inPosition) {
            if (!final) {
              // 1.1 для начала каждую секунду проверяем условие выхода из сделки по TP и SL
              item.closeShortPosition(lastCandle, timeFrames.timeFrame1m)

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
              // 1.2 затем проверяем условие изменения TP и SL
              item.changeTPSL(lastCandle, timeFrames.timeFrame15m)
            }
            // end of: if (symbolObj.inPosition)
          } else {
            // if (!symbolObj.inPosition)
            // (2) если не в сделке:
            // 2.1 ждем цену на рынке для входа по сигналу
            if (!final) {
              item.canShortPosition(lastCandle, timeFrames.timeFrame1m)
            } else {
              //if (final) {
              // если не вошли в сделку, то для начала очищаем все параметры
              if (
                item.canShort &&
                lastCandle.interval == timeFrames.timeFrame15m
              ) {
                // если до финальной свечки не вошли в сделку, то отменяем сигнал
                sendInfoToUser(
                  `${item.whitchSignal}\n\nМонета: ${
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

              // 2.2 на финальной свечке запускаем поиск сигнала на вход
              await item.prepairData(lastCandle, timeFrames.timeFrame15m)
            } // //if (final)
          } // end of: if (symbolObj.inPosition)
        } else {
          //console.log(`${item.symbol}: не пришла свечка из web socket`)
        } // if (item.symbol.includes(lastCandle.symbol))
      }) // symbolObj.forEach(async (item) =>
    } // callback
  ) // await getLastCandle4s()
}

module.exports = alex384Notice15m
