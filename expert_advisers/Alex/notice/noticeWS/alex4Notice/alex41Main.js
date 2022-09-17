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
const Alex41Class = require('./Alex41Class')
const { symbols4h41, timeFrames, nameStrategy } = require('./symbols')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')

async function alex41Main() {
  // формирование сообщений в телеграм
  const message0 = `Приложение запущено в ${timestampToDateHuman(
    new Date().getTime()
  )}`

  const message1 = `\n\n${nameStrategy.notice4h41}\nНа ${symbols4h41.length} монетах\nПоиск сигнала и перенос TPSL на ТФ: ${timeFrames.timeFrame4h}\nПоиск точки входа и выхода на ТФ: ${timeFrames.timeFrame1m}`

  sendInfoToUser(message0 + message1)

  // основное приложение
  const timeFrames2 = [timeFrames.timeFrame4h, timeFrames.timeFrame1m]

  let lastCandle // последняя свечка

  let symbolObj = []

  symbols4h41.forEach(function (item, i, arg) {
    symbolObj[i] = new Alex41Class(item, nameStrategy.notice4h41)
  })
  //console.log('монеты для старта')
  //console.table(symbolObj)

  // ищем первый фрактал
  // для начала запрашиваем 4 первых свечи
  symbolObj.forEach(async (item) => {
    await item.prepair5Candles(timeFrames.timeFrame4h)
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
              } // обнуляем состояние сделки до первоначального состояния
            } // if (!final)
            if (final) {
              // 1.2 затем проверяем условие изменения TP и SL
              item.changeTPSL(lastCandle, timeFrames.timeFrame4h)
            } // if (final)
          } // end of: if (symbolObj.inPosition)
          if (!item.inPosition) {
            // (2) если не в сделке:
            // 2.1 ждем цену на рынке для входа по сигналу
            if (!final) {
              item.findSygnal(lastCandle, timeFrames.timeFrame4h)
              item.canShortPosition(lastCandle, timeFrames.timeFrame1m)
            } // if (!final)
            if (final) {
              // если не вошли в сделку, то для начала очищаем все параметры

              if (
                item.canShort &&
                lastCandle.interval == timeFrames.timeFrame4h
              ) {
                // если до финальной свечки не вошли в сделку, то отменяем сигнал
                sendInfoToUser(
                  `${item.nameStrategy}\n\nМонета: ${
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
              await item.prepair5Candles(timeFrames.timeFrame4h)
              //await item.prepairData(lastCandle, timeFrames.timeFrame2h)
            } // if (final)
          } // end of: if (!symbolObj.inPosition)
        } // if (item.symbol.includes(lastCandle.symbol))
      }) // symbolObj.forEach(async (item) =>
    } // callback
  ) // await getLastCandle4s()
}
module.exports = alex41Main
