//const interval = require('rxjs')
//import { interval } from 'rxjs'
//const { Observable } = require('rxjs')

/*
// import { Observable } from 'rxjs'
// 2 варианта решения:
// 1. прикрутить babel
// 2. прописать type: module и игнорировать node_modules в packege.json
*/
// подключен к торговому роботу

const getLastCandle4s = require('../../../../../API/binance.engine/web.socket.usdm/getLastCandle4s')
const {
  sendInfo382ToUser,
} = require('../../../../../API/telegram/telegram.bot')
const { apiOptions } = require('../../../../../config/api_options')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const alexTrade3826Class = require('./alexTrade3826Class')
const { timeFrames, nameStrategy } = require('./input_parameters3826')

async function alex3826Logic2h(symbols2h38) {
  const timeFrames2 = [timeFrames.timeFrame2h]

  let lastCandle // последняя свечка

  // получаем от пользователя список инструментов
  // const { SymbolObjNotice } = require('../../../../../models/symbolNotice') // for Export вначале файла
  // let symbolObj4 = new SymbolObjNotice('btc', nameStrategy) // одна монета по принципу класса

  let symbolObj = []

  symbols2h38.forEach(function (item, i, arg) {
    symbolObj[i] = new alexTrade3826Class(item, nameStrategy.notice2h382)
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
    symbols2h38,
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
              apiOptions.forEach((traderAPI) => {
                item.closeShortPosition(
                  lastCandle,
                  timeFrames.timeFrame2h,
                  traderAPI
                )
              })

              // если вышли из сделки, то обнуляем состояние сделки:
              if (!item.inPosition) {
                // можно считать что сделка закрыта
                //item.reset()
                // console.log(`${item.symbol}: Закрыли short. Очистили параметры сделки`)
              } // обнуляем состояние сделки до первоначального состояния
            } else {
              // if(final)
              // 1.2 затем проверяем условие изменения TP и SL
              item.changeTPSL(lastCandle, timeFrames.timeFrame2h)
            }
            // end of: if (symbolObj.inPosition)
          } else {
            // if (!symbolObj.inPosition)
            // (2) если не в сделке:
            // 2.1 ждем цену на рынке для входа по сигналу
            if (!final) {
              apiOptions.forEach((traderAPI) => {
                item.canShortPosition(
                  lastCandle,
                  timeFrames.timeFrame2h,
                  traderAPI
                )
              })
            } else {
              //if (final) {
              // если не вошли в сделку, то очищаем все параметры
              if (
                item.canShort &&
                lastCandle.interval == timeFrames.timeFrame2h
              ) {
                // если до финальной свечки не вошли в сделку, то отменяем сигнал
                const message = `${item.whitchSignal}\n\nМонета: ${
                  item.symbol
                }\n\n--== ОТМЕНА сигнала ==--\nСигнал был: ${timestampToDateHuman(
                  item.sygnalTime
                )}\nУДАЛИ ордер на бирже\n\nЖдем следющего сигнала...`
                sendInfo382ToUser(message)
                item.reset()
                //console.log(`${item.symbol}: Отменили сигнал. Очистили параметры сделки`)
              } // обнуляем состояние сигнала

              // 2.2 на финальной свечке запускаем поиск сигнала на вход
              await item.prepairData(lastCandle, timeFrames.timeFrame2h)
            } // //if (final)
          } // end of: if (symbolObj.inPosition)
        } else {
          //console.log(`${item.symbol}: не пришла свечка из web socket`)
        } // if (item.symbol.includes(lastCandle.symbol))
      }) // symbolObj.forEach(async (item) =>
    } // callback
  ) // await getLastCandle4s()
}

module.exports = alex3826Logic2h
