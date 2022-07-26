// для стратегии: фракталы Билла Вильямса
function findTrends2Stage(candlesJunior, candleSenior, fractal) {
  // фиксируем начало и конец свечки, которая пересекла фрактал
  const startTimeSenior = candleSenior.startTime
  const endTimeSenior = candleSenior.endTime + 1

  for (let i = 0; i < candlesJunior.length; i++) {
    if (
      candlesJunior[i].startTime >= startTimeSenior &&
      candlesJunior[i].startTime <= endTimeSenior
    ) {
      if (fractal.nameFracral == 'Bullish') {
        if (candlesJunior[i].low < fractal.low) {
          return {
            candlesJunior: candlesJunior[i],
            id: i,
          }
        } else return { id: 0 }
      } //if (fractal.nameFracral == 'Bullish')

      if (fractal.nameFracral == 'Bearish') {
        if (candlesJunior[i].high > fractal.high) {
          return {
            candlesJunior: candlesJunior[i],
            id: i,
          }
        } else return { id: 0 }
      } //if (fractal.nameFracral == 'Bullish')
    }
  } // for (let i = 0; i < candlesJunior.length; i++)
}

module.exports = findTrends2Stage
