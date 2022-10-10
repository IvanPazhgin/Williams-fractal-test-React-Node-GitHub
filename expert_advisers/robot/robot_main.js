const getLastCandle4s = require('../../API/binance.engine/web.socket.usdm/getLastCandle4s')
const Alex414Class1h = require('./advisers/alex414Class1h')
const { nameAlex } = require('./input_parameters')

async function robotMain(
  symbols, // array
  timeFrameSenior, // array
  nameStrategy,
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
      takeProfitConst,
      stopLossConst,
      shiftTime
    )
  })

  // для стратегии Алекса
  symbolObj.forEach(async (item) => {
    await item.Alex4prepair5Candles(timeFrameSenior)
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
            // стратегия Алекса 4
            if (nameStrategy == nameAlex && !item.canShort) {
              if (!item.fractalOfBearish.isFractal) {
                item.alex4FindUnconfirmedFractal(lastCandle, timeFrameSenior) // ищем фрактал
              }
              if (!item.brokenFractal && item.fractalOfBearish.isFractal) {
                item.alex4FindBrokenFractal(lastCandle)
              }
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
            if (!item.canShort) {
              item.Alex4FindSygnal(lastCandle, timeFrameSenior)
            }

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

module.exports = robotMain
