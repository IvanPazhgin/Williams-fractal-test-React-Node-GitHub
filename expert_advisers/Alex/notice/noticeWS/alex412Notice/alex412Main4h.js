/*
в начале запуска приложения:
1. запрашиваем 4 свечи в файле Class и храним их
2. получаем нефинальную последнюю свечю и отправляем ее в файл Class

в call back: 
1. когда получили финальную свечку, запрашиваем 4 свечи в файле Class и храним их
2. получаем нефинальную последнюю свечю и отправляем ее в файл Class

пункты 1 и 2 прописать отдельными функциями в файле Class
*/

const getLastCandle4s = require('../../../../../API/binance.engine/web.socket.usdm/getLastCandle4s')
const Alex412Class4h = require('./Alex412Class4h')
const { symbols4h41, timeFrames } = require('./input_parameters412')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')

// общий шаблон
async function alex412Main4h(
  timeFrameSenior,
  nameStrategy,
  takeProfitConst,
  stopLossConst,
  shiftTime
) {
  const timeFrames2 = [timeFrameSenior, timeFrames.timeFrame1m]

  let lastCandle // последняя свечка

  let symbolObj = []

  symbols4h41.forEach(function (item, i, arg) {
    symbolObj[i] = new Alex412Class4h(
      item,
      nameStrategy,
      takeProfitConst,
      stopLossConst,
      shiftTime
    )
  })
  //console.log('монеты для старта')
  //console.table(symbolObj)

  // ищем первый фрактал
  // для начала запрашиваем 4 первых свечи
  symbolObj.forEach(async (item) => {
    await item.prepair5Candles(timeFrameSenior)
    //console.log('\nполучили первые свечи для поиска фрактала')
    //console.table(symbolObj)
  })

  await getLastCandle4s(
    symbols4h41,
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
                //await item.prepair5Candles(timeFrameSenior)
              } // обнуляем состояние сделки до первоначального состояния
            } // if (!final)
            if (final) {
              // 1.2 затем проверяем условие изменения TP и SL
              item.changeTPSL(lastCandle, timeFrameSenior)
            } // if (final)
          } // end of: if (symbolObj.inPosition)
          if (!item.inPosition) {
            // (2) если не в сделке:
            // 2.1 ждем цену на рынке для входа по сигналу
            if (!final) {
              item.findSygnal(lastCandle, timeFrameSenior)
              item.canShortPosition(lastCandle, timeFrames.timeFrame1m)
            } // if (!final)
            if (final) {
              // если не вошли в сделку, то для начала очищаем все параметры

              if (item.canShort && lastCandle.interval == timeFrameSenior) {
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
              await item.prepair5Candles(timeFrameSenior)
              //await item.prepairData(lastCandle, timeFrames.timeFrame2h)
            } // if (final)
          } // end of: if (!symbolObj.inPosition)
        } // if (item.symbol.includes(lastCandle.symbol))
      }) // symbolObj.forEach(async (item) =>
    } // callback
  ) // await getLastCandle4s()
}
module.exports = alex412Main4h
