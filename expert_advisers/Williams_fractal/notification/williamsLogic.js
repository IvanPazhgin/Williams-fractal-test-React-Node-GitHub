//const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
//const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const williamsClass = require('./williamsClass')
const getLastCandle4s = require('../../../API/binance.engine/web.socket.usdm/getLastCandle4s')
const { symbolsWilliams, nameStrategy } = require('./input_parameters')

async function williamsLogic(intervalSenior, intervalJunior) {
  const timeFrames2 = [intervalSenior, intervalJunior]
  let lastCandle // последняя свечка
  let symbolObj = [] // массив для хранения состояний сделок по каждой монете

  symbolsWilliams.forEach(function (item, i, arg) {
    symbolObj[i] = new williamsClass(item, nameStrategy.williams)
  })
  //console.log('монеты для старта')
  //console.table(symbolObj)

  // ищем текущие последние фракталы
  symbolObj.forEach(function (symbol) {
    //symbol.reset()
    symbol.firstStart(intervalSenior, intervalJunior)
  })

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
    symbolsWilliams,
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
          // новая схема реализации логики
          if (!final) {
            // (2) определяем тренды на пересечении фрактала (1) и ценой intervalJunior
            item.findTrendOnline(lastCandle, intervalJunior)

            // (4) ищем точки входа на пересечении фрактала (3) и ценой intervalJunior
            if (
              item.deal.fractalOfBullish.isFractal ||
              item.deal.fractalOfBearish.isFractal
            ) {
              item.findDeal(lastCandle, intervalJunior)
            }
          } // if (!final)

          if (final) {
            // (1) ищем фракталы на intervalSenior
            item.findFractalOnline(lastCandle, intervalSenior)

            // (3) если есть тренд, то ищем фракталы внутри трендов
            if (item.trend.isDownTrend || item.trend.isUpTrend) {
              item.findFractalJunior(lastCandle, intervalJunior)
            }
          } // if (final)

          // старая схема реализации логики
          // (1) если в сделке:
          /*

          if (item.inPosition) {
            // 1.1 для начала каждую секунду проверяем условие выхода из сделки по TP и SL
            if (!final) {
              item.closeShortPosition(lastCandle, intervalJunior)

              // если вышли из сделки, то обнуляем состояние сделки:
              if (!item.inPosition) {
                // можно считать что сделка закрыта
                item.reset()
                // console.log(`${item.symbol}: Закрыли short. Очистили параметры сделки`)
              } // обнуляем состояние сделки до первоначального состояния
            } // if (!final)

            // 1.2 затем проверяем условие изменения TP и SL
            if (final) {
              item.changeTPSL(lastCandle, intervalSenior)
            }
          } // if (item.inPosition)
          */

          // (2) если не в сделке:
          if (!item.inPosition) {
            // 2.1 ждем цену на рынке для входа по сигналу
            if (!final) {
              //item.findTrendOnline(lastCandle, intervalJunior) // перенес в новую схему
              // ищем точку входа
              // if (item.trend.isUpTrend)
              // if (item.trend.isDownTrend)
            }

            if (final) {
              // если не вошли в сделку, то для начала очищаем все параметры
              /*
              if (
                item.canShort &&
                lastCandle.interval == intervalSenior
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
              */
              // 2.2 на финальной свечке запускаем поиск сигнала на вход
              //await item.prepairData(lastCandle, intervalSenior)
              //item.findFractalOnline(lastCandle, intervalSenior) // перенес в новую схему
            } // if (final)
          } // if (item.inPosition)
        } // if (item.symbol.includes(lastCandle.symbol))
      }) // symbolObj.forEach(async (item) =>
    } // callback
  ) // await getLastCandle4s()
}

module.exports = williamsLogic
