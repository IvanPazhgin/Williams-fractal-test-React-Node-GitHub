const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const readCandleFromJSON = require('../utils/readCandle')
const findTrends2Stage = require('../../common.func/findTrends2Stage')
const Trend = require('../../common.func/trendClass')
const saveDeals = require('../utils/saveDeals')

function findTrends(
  input_parameters,
  intervalSenior,
  intervalJunior,
  optionsForSave
) {
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
        /*
        // новая версия и слишком сложная в реализации
        trend.isDownTrend = true
        // информация по фракталу
        trend.fractalDownTime = fractal_Bullish.timeHuman
        trend.fractalsDownPrice = fractal_Bullish.low
        */

        // поиск точки пересечения фрактала ценой младшего ТФ для определения точного времени начала тренда
        temp = findTrends2Stage(
          candlesJunior,
          candlesSenior[i],
          fractal_Bullish
        )
        if (temp.id != 0) {
          trend.isDownTrend = true
          // информация по фракталу
          trend.fractalDownTime = fractal_Bullish.timeHuman
          trend.fractalsDownPrice = fractal_Bullish.low

          // информация по цене младшего ТФ
          trend.idDownTrend = temp.id
          trend.downPriceTime = temp.candlesJunior.startTime
          trend.downPriceTimeHuman = timestampToDateHuman(
            temp.candlesJunior.startTime
          )
          trend.downPrice = temp.candlesJunior.low
        }
        /*
        // информация по цене младшего ТФ
        trend.idDownTrend = temp.id
        trend.downPriceTime = temp.candlesJunior.startTime
        trend.downPriceTimeHuman = timestampToDateHuman(
          temp.candlesJunior.startTime
        )
        trend.downPrice = temp.candlesJunior.low
        */
      }
    } // if (fractal_Bullish.isFractal && !trend.isDownTrend)

    if (fractal_Bearish.isFractal && !trend.isUpTrend) {
      if (candlesSenior[i].high > fractal_Bearish.high) {
        /*
        trend.isUpTrend = true
        // информация по фракталу
        trend.fractalUpTime = fractal_Bearish.timeHuman
        trend.fractalUpPrice = fractal_Bearish.high
        */
        // поиск точки пересечения фрактала ценой младшего ТФ для определения точного времени начала тренда
        temp = findTrends2Stage(
          candlesJunior,
          candlesSenior[i],
          fractal_Bearish
        )
        if (temp.id != 0) {
          trend.isUpTrend = true
          // информация по фракталу
          trend.fractalUpTime = fractal_Bearish.timeHuman
          trend.fractalUpPrice = fractal_Bearish.high

          // информация по цене младшего ТФ
          trend.idUptrend = temp.id
          trend.upPriceTime = temp.candlesJunior.startTime
          trend.upPriceTimeHuman = timestampToDateHuman(
            temp.candlesJunior.startTime
          )
          trend.upPrice = temp.candlesJunior.high
        }
        /*
        // информация по цене младшего ТФ
        trend.idUptrend = temp.id
        trend.upPriceTime = temp.candlesJunior.startTime
        trend.upPriceTimeHuman = timestampToDateHuman(
          temp.candlesJunior.startTime
        )
        trend.upPrice = temp.candlesJunior.high
        */
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
          idStartTrend: trend.idDownTrend,
          trendStartTime: trend.downPriceTime,
          trendStartTimeH: trend.downPriceTimeHuman,
          trendStartPrice: trend.downPrice,

          idEndTrend: trend.idUptrend,
          trendEndTime: trend.upPriceTime,
          trendEndTimeH: trend.upPriceTimeHuman,
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
          idStartTrend: trend.idUptrend,
          trendStartTime: trend.upPriceTime,
          trendStartTimeH: trend.upPriceTimeHuman,
          trendStartPrice: trend.upPrice,

          idEndTrend: trend.idDownTrend,
          trendEndTime: trend.downPriceTime,
          trendEndTimeH: trend.downPriceTimeHuman,
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
  //console.log(trends)
  saveDeals(trends, optionsForSave)
  return { trends, candlesJunior }
}

module.exports = findTrends
