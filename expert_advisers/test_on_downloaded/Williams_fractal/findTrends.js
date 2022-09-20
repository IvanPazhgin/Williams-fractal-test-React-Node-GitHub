const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const readCandleFromJSON = require('../utils/readCandle')
const findTrends2Stage = require('./findTrends2Stage')
const Trend = require('./trendClass')

function findTrends(input_parameters, intervalSenior, intervalJunior) {
  // определяем шаблоны фракталов
  let fractal_Bearish = {
    isFractal: false,
    high: 0,
    time: '',
  }
  let fractal_Bullish = {
    isFractal: false,
    low: 0,
    time: '',
  }

  let trend = new Trend()
  let trend2 = {} // сокращенная версия тренда
  let trends = [] // все тренды
  let temp = {} // для возврата свечи младшего ТФ

  // загружаем свечки из файлов
  const candlesSenior = readCandleFromJSON(input_parameters, intervalSenior)
  const candlesJunior = readCandleFromJSON(input_parameters, intervalJunior)

  for (let i = 4; i < candlesSenior.length; i++) {
    // ищем Bearish (медвежий) Fractal. Факртал находится на позиции [i-2]
    if (
      candlesSenior[i - 4].high < candlesSenior[i - 2].high &&
      candlesSenior[i - 3].high < candlesSenior[i - 2].high &&
      candlesSenior[i - 1].high < candlesSenior[i - 2].high &&
      candlesSenior[i].high < candlesSenior[i - 2].high
    ) {
      fractal_Bearish = {
        nameFracral: 'Bearish',
        nameFracralRus: 'Медвежий фрактал',
        isFractal: true,
        high: candlesSenior[i - 2].high,
        time: candlesSenior[i - 2].startTime,
        // проверочная ифнормация
        timeHuman: timestampToDateHuman(candlesSenior[i - 2].startTime),
      }
    }

    // ищем Bullish (бычий) Fractal
    if (
      candlesSenior[i - 4].low > candlesSenior[i - 2].low &&
      candlesSenior[i - 3].low > candlesSenior[i - 2].low &&
      candlesSenior[i - 1].low > candlesSenior[i - 2].low &&
      candlesSenior[i].low > candlesSenior[i - 2].low
    ) {
      fractal_Bullish = {
        nameFracral: 'Bullish',
        nameFracralRus: 'Бычий фрактал',
        isFractal: true,
        low: candlesSenior[i - 2].low,
        time: candlesSenior[i - 2].startTime,
        // проверочная ифнормация
        timeHuman: timestampToDateHuman(candlesSenior[i - 2].startTime),
      }
    }

    // определяем тренды
    // PS в реальном времени необходимо сравнивать фрактал с текущей ценой на рынке
    if (fractal_Bullish.isFractal && !trend.isDownTrend) {
      if (candlesSenior[i].low < fractal_Bullish.low) {
        // новая версия и слишком сложная в реализации
        trend.isDownTrend = true
        // информация по фракталу
        trend.fractalDownTime = fractal_Bullish.timeHuman
        trend.fractalsDownPrice = fractal_Bullish.low

        // поиск точки пересечения фрактала ценой младшего ТФ для определения точного времени начала тренда
        temp = findTrends2Stage(
          candlesJunior,
          candlesSenior[i],
          fractal_Bullish
        )
        // информация по цене младшего ТФ
        trend.downPriceTime = temp.startTime
        trend.downPriceTimeH = timestampToDateHuman(temp.startTime)
        trend.downPrice = temp.low
      }
    } // if (fractal_Bullish.isFractal && !trend.isDownTrend)

    if (fractal_Bearish.isFractal && !trend.isUpTrend) {
      if (candlesSenior[i].high > fractal_Bearish.high) {
        trend.isUpTrend = true
        // информация по фракталу
        trend.fractalUpTime = fractal_Bearish.timeHuman
        trend.fractalUpPrice = fractal_Bearish.high
        // информация по цене старшего ТФ
        trend.upPriceTime = candlesSenior[i].startTime
        trend.upPriceTimeH = timestampToDateHuman(candlesSenior[i].startTime)
        trend.upPrice = candlesSenior[i].high

        // поиск точки пересечения фрактала ценой младшего ТФ для определения точного времени начала тренда
        temp = findTrends2Stage(
          candlesJunior,
          candlesSenior[i],
          fractal_Bearish
        )
        // информация по цене младшего ТФ
        trend.upPriceTime = temp.startTime
        trend.upPriceTimeH = timestampToDateHuman(temp.startTime)
        trend.upPrice = temp.high
      }
    } // if (fractal_Bearish.isFractal && !trend.isUpTrend)

    // сохраняем список трендов
    if (trend.isUpTrend && trend.isDownTrend) {
      if (trend.downPriceTime < trend.upPriceTime) {
        trend2 = {
          trendName: 'DownTrend',
          // информация для проверки
          fractalStartTime: trend.fractalDownTime,
          fractalStartPrice: trend.fractalsDownPrice,
          fractalEndTime: trend.fractalUpTime,
          fractalEndPrice: trend.fractalUpPrice,

          // информация для работы
          trendStartTime: trend.downPriceTime,
          trendStartTimeH: trend.downPriceTimeH,
          trendStartPrice: trend.downPrice,

          trendEndTime: trend.upPriceTime,
          trendEndTimeH: trend.upPriceTimeH,
          trendEndPrice: trend.upPrice,
        }
        trend.resetDownTrend()
        //fractal_Bearish.isFractal = false
      } else {
        trend2 = {
          trendName: 'UpTrend',
          // информация для проверки
          fractalStartTime: trend.fractalUpTime,
          fractalStartPrice: trend.fractalUpPrice,
          fractalEndTime: trend.fractalDownTime,
          fractalEndPrice: trend.fractalsDownPrice,

          // информация для работы
          trendStartTime: trend.upPriceTime,
          trendStartTimeH: trend.upPriceTimeH,
          trendStartPrice: trend.upPrice,

          trendEndTime: trend.downPriceTime,
          trendEndTimeH: trend.downPriceTimeH,
          trendEndPrice: trend.downPrice,
        }
        trend.resetUpTrend()
        //fractal_Bullish.isFractal = false
      }
      trends = trends.concat(trend2)
      //fractal_Bearish.isFractal = false
      //fractal_Bullish.isFractal = false
    }
  } // for (let i = 4; i < candlesSenior.length; i++)
  console.log(trends)
  // return trends
}

module.exports = findTrends
