const getLastCandle4s = require('../../../API/binance.engine/web.socket.usdm/getLastCandle4s')
const Alex414Class1h = require('./alex414Class1h')
const { nameAlex } = require('../input_parameters')

async function alex414Logic1h(
  symbols, // array
  timeFrameSenior, // array
  nameStrategy,
  takeProfitFloating,
  takeProfitConst,
  stopLossConst,
  shiftTime
) {
  const timeFrames = [timeFrameSenior]

  let lastCandle // последняя свечка

  let symbolObj = []

  symbols.forEach(function (item, i, arg) {
    symbolObj[i] = new Alex414Class1h(
      item,
      nameStrategy,
      takeProfitFloating,
      takeProfitConst,
      stopLossConst,
      shiftTime
    )
  })

  // для стратегии Алекса 4.1.4
  // (0) подготовка свечек для поиска фрактала
  symbolObj.forEach(async (item) => {
    //await item.Alex4prepair5Candles(timeFrameSenior)
  })

  await getLastCandle4s(
    symbols,
    timeFrames,
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
          if (!final) {
            // стратегия Алекса 4.1.4
            if (nameStrategy.includes(nameAlex) && !item.canShort) {
              // (1) ищем фрактал
              if (!item.fractalBearish.isFractal && !item.searchFractal) {
                item.alex4FindUnconfirmedFractal(lastCandle, timeFrameSenior)
              }
              // (2) ждем когда рынок сломает неподтвержденный фрактал
              if (!item.brokenFractal && item.fractalBearish.isFractal) {
                item.alex4FindBrokenFractal(lastCandle)
              }
            }

            // (4) отправляем ордер на биржу
            if (item.canShort) {
              const symbolToShort = item.inOneDeal.symbolSelection()
              if (symbolToShort == item.symbol) {
                item.alex4CanShortPosition(lastCandle, timeFrameSenior)
              }
            }

            if (item.inPosition) {
              item.alex4ChangeTPSLOnMarket(lastCandle, timeFrameSenior)
              item.alex4CloseShortPosition(lastCandle, timeFrameSenior)
            }

            // стратегия Билла Вильямса
            // (2) определяем тренды на пересечении фрактала (1) и ценой intervalJunior
            // item.findTrendOnline(lastCandle, intervalJunior)

            // (4) ищем точки входа на пересечении фрактала (3) и ценой intervalJunior
            /*
            if (
              item.deal.fractalOfBullish.isFractal ||
              item.deal.fractalOfBearish.isFractal
            ) {
              item.findDeal(lastCandle, intervalJunior)
            }
            */
          } // if (!final)

          if (final) {
            if (nameStrategy.includes(nameAlex)) {
              // (3) ищем сигнал
              if (!item.canShort && item.brokenFractal) {
                // await item.alex4FindSygnal(lastCandle, timeFrameSenior) // рабочий вариант №1
                item.alex4FindSygnal(lastCandle, timeFrameSenior)
              }

              // прописать условие по сбросу флагов
              if (!item.canShort) {
                // item.reset() // рабочий вариант №1
                // item.searchFractal = false // удалить
                // item.brokenFractal = false // удалить
              }

              if (item.inPosition) {
                item.alex4ChangeTPSL(lastCandle, timeFrameSenior)
              }
            } // if (nameStrategy.includes(nameAlex))

            // стратегия Билла Вильямса
            // (1) ищем фракталы на intervalSenior
            //item.findFractalOnline(lastCandle, intervalSenior)

            // (3) если есть тренд, то ищем фракталы внутри трендов
            /*
            if (item.trend.isDownTrend || item.trend.isUpTrend) {
              item.findFractalJunior(lastCandle, intervalJunior)
            }
            */
          } // if (final)
        } // if (item.symbol.includes(lastCandle.symbol))
      }) // symbolObj.forEach(async (item) =>
    } // callback
  ) // await getLastCandle4s()
}

module.exports = alex414Logic1h
