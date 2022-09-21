const getCandles = require('../../../API/binance.engine/usdm/getCandles.3param')
const { sendInfoToUserWilliams } = require('../../../API/telegram/telegram.bot')
const candlesToObject = require('../../common.func/candlesToObject')
const findTrends2Stage = require('../../common.func/findTrends2Stage')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const Trend = require('../../common.func/trendClass')

class williamsClass {
  constructor(symbol, nameStrategy) {
    this.symbol = symbol
    this.nameStrategy = nameStrategy

    //this.depositStart = 1000
    //this.depositEnd = 0

    this.candlesForFractal = [] // свечи для поиска фрактала

    this.trend = new Trend() // для хранения информации о трендах
    //this.trendChange = false // факт смены тренда

    // медвежий фрактал
    this.fractalOfBearish = {
      isFractal: false,
      high: 0,
      time: '',
    }

    // бычий фрактал
    this.fractalOfBullish = {
      isFractal: false,
      low: 0,
      time: '',
    }

    this.reset()
  }

  reset() {
    //this.trend.resetUpTrend()
    //this.trend.resetDownTrend()

    this.inPosition = false

    return this
  }

  // загрузка последних n свечей с биржи
  async getCandlesFunc(interval, limitOfCandle) {
    const candles = await getCandles(this.symbol, interval, limitOfCandle) // получаем первые n свечей
    // this.candlesForFractal = candlesToObject(candles) // преобрзауем массив свечей в объект
    //return this.candlesForFractal
    return candlesToObject(candles) // преобрзауем массив свечей в объект
  }

  // подготовка данных для поиска фракталов
  async prepairData(lastCandle, intervalSenior) {
    const limitOfCandle = 5 // кол-во свечей для поиска сигнала
    //if (lastCandle.interval == intervalSenior) {
    this.candlesForFractal = await this.getCandlesFunc(
      intervalSenior,
      limitOfCandle
    )

    // заменяем последнюю свечку по примеру кода Толи
    if (
      this.candlesForFractal
        .map(({ startTime }) => startTime)
        .includes(lastCandle.startTime)
    ) {
      //console.log('время последних свечей совпадает')
      const delLastCandle = this.candlesForFractal.pop() // для начала удаляем незавршенную свечку
      // console.log('убираем последнюю свечку')
      // console.table(delLastCandle)
    } else {
      console.log(`${this.symbol} время последних свечей НЕ совпадает`)
    }

    // далее добавляем последнюю свечку из WS
    this.candlesForFractal = this.candlesForFractal.concat(lastCandle)
    return this // возвращаем массив свечей
    //} // if (lastCandle.interval == intervalSenior)
  }

  // поиск фракталов
  async findFractalOnline(lastCandle, intervalSenior) {
    if (lastCandle.interval == intervalSenior) {
      // подготовка данных для поиска фракталов
      await this.prepairData(lastCandle, intervalSenior)

      // ищем Bearish (медвежий) Fractal. Факртал находится на позиции [i-2]
      if (
        this.candlesForFractal[0].high < this.candlesForFractal[2].high &&
        this.candlesForFractal[1].high < this.candlesForFractal[2].high &&
        this.candlesForFractal[3].high < this.candlesForFractal[2].high &&
        this.candlesForFractal[4].high < this.candlesForFractal[2].high
      ) {
        this.fractalOfBearish = {
          nameFracral: 'Bearish',
          nameFracralRus: 'Медвежий фрактал',
          isFractal: true,
          high: this.candlesForFractal[2].high,
          time: this.candlesForFractal[2].startTime,
          // проверочная ифнормация
          timeHuman: timestampToDateHuman(this.candlesForFractal[2].startTime),
        }
      }

      // ищем Bullish (бычий) Fractal
      if (
        this.candlesForFractal[0].low > this.candlesForFractal[2].low &&
        this.candlesForFractal[1].low > this.candlesForFractal[2].low &&
        this.candlesForFractal[3].low > this.candlesForFractal[2].low &&
        this.candlesForFractal[4].low > this.candlesForFractal[2].low
      ) {
        this.fractalOfBullish = {
          nameFracral: 'Bullish',
          nameFracralRus: 'Бычий фрактал',
          isFractal: true,
          low: this.candlesForFractal[2].low,
          time: this.candlesForFractal[2].startTime,
          // проверочная ифнормация
          timeHuman: timestampToDateHuman(this.candlesForFractal[2].startTime),
        }
      }

      this.sendMessageAboutFractalToConsole('find Fractal Online')
      return this
    }
  } // findFractalOnline()

  // поиск тренда online (свечи !final): поиск пересечения фракталов НЕ_финальными свечами
  findTrendOnline(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      if (this.fractalOfBullish.isFractal && !this.trend.isDownTrend) {
        if (lastCandle.low < this.fractalOfBullish.low) {
          this.trend.isDownTrend = true
          this.trend.trendName = 'DownTrend'
          //this.trend.isUpTrend = false
          this.trend.resetUpTrend()
          // информация по фракталу
          this.trend.fractalDownTime = this.fractalOfBullish.timeHuman
          this.trend.fractalsDownPrice = this.fractalOfBullish.low
          // информация по тренду
          this.trend.downPriceTime = lastCandle.startTime
          //this.trend.downPriceTimeHuman = timestampToDateHuman(lastCandle.startTime)
          this.trend.downPriceTimeHuman = timestampToDateHuman(
            new Date().getTime()
          )
          this.trend.downPrice = lastCandle.low

          this.sendMessageAboutDownTrendToConsole()
        } // if (this.candlesForFractal[i].low < this.fractalOfBullish.low)
      } // if (this.fractalOfBullish.isFractal && !this.trend.isDownTrend)

      if (this.fractalOfBearish.isFractal && !this.trend.isUpTrend) {
        if (lastCandle.high > this.fractalOfBearish.high) {
          this.trend.isUpTrend = true
          this.trend.trendName = 'UpTrend'
          //this.trend.isDownTrend = false
          this.trend.resetDownTrend()
          // информация по фракталу
          this.trend.fractalUpTime = this.fractalOfBearish.timeHuman
          this.trend.fractalUpPrice = this.fractalOfBearish.high
          // информация по тренду
          this.trend.upPriceTime = lastCandle.startTime
          //this.trend.upPriceTimeHuman = timestampToDateHuman(lastCandle.startTime)
          this.trend.upPriceTimeHuman = timestampToDateHuman(
            new Date().getTime()
          )
          this.trend.upPrice = lastCandle.high

          this.sendMessageAboutUpTrendToConsole()
        } //if (this.candlesForFractal[i].high > this.fractalOfBearish.high)
      } // if (this.fractalOfBearish.isFractal && !this.trend.isUpTrend)
    }
    return this
  }

  // поиск сигнала (ПОКА ПУСТАЯ ФУНКЦИЯ)
  findSygnal() {
    // будет работать на младшем ТФ. Ищем точку пересечения фрактала ценой.
    return this
  }

  // --== при запуске приложения ==--
  // 1. готовим свечи и ищем фракталы
  async firstStart(intervalSenior, intervalJunior) {
    const limitOfCandleForStart = 50 // для поиска фрактала при первом запуске приложения
    this.candlesForFractal = await this.getCandlesFunc(
      intervalSenior,
      limitOfCandleForStart
    )

    for (let i = this.candlesForFractal.length - 2; i >= 0; i--) {
      // ищем Bearish (медвежий) Fractal. Факртал находится на позиции [i-2]
      if (
        !this.fractalOfBearish.isFractal &&
        this.candlesForFractal[i].high < this.candlesForFractal[i - 2].high &&
        this.candlesForFractal[i - 1].high <
          this.candlesForFractal[i - 2].high &&
        this.candlesForFractal[i - 3].high <
          this.candlesForFractal[i - 2].high &&
        this.candlesForFractal[i - 4].high < this.candlesForFractal[i - 2].high
      ) {
        this.fractalOfBearish = {
          nameFracral: 'Bearish',
          nameFracralRus: 'Медвежий фрактал',
          isFractal: true,
          high: this.candlesForFractal[i - 2].high,
          time: this.candlesForFractal[i - 2].startTime,
          // проверочная ифнормация
          timeHuman: timestampToDateHuman(
            this.candlesForFractal[i - 2].startTime
          ),
        }
      }

      // ищем Bullish (бычий) Fractal
      if (
        !this.fractalOfBullish.isFractal &&
        this.candlesForFractal[i].low > this.candlesForFractal[i - 2].low &&
        this.candlesForFractal[i - 1].low > this.candlesForFractal[i - 2].low &&
        this.candlesForFractal[i - 3].low > this.candlesForFractal[i - 2].low &&
        this.candlesForFractal[i - 4].low > this.candlesForFractal[i - 2].low
      ) {
        this.fractalOfBullish = {
          nameFracral: 'Bullish',
          nameFracralRus: 'Бычий фрактал',
          isFractal: true,
          low: this.candlesForFractal[i - 2].low,
          time: this.candlesForFractal[i - 2].startTime,
          // проверочная ифнормация
          timeHuman: timestampToDateHuman(
            this.candlesForFractal[i - 2].startTime
          ),
        }
      }

      if (this.fractalOfBearish.isFractal && this.fractalOfBullish.isFractal) {
        break
      }
    } // for (let i = this.candlesForFractal.length - 1; i >= 0; i--)

    this.sendMessageAboutFractalToConsole('first Start')

    this.findTrendStart(intervalJunior)
    return this
  } // async firstStart(interval)

  // 2. поиск тренда
  async findTrendStart(intervalJunior) {
    let temp = {} // для возврата свечи младшего ТФ
    const candlesJunior = await this.getCandlesFunc(intervalJunior, 240)

    for (let i = 0; i < this.candlesForFractal.length - 1; i++) {
      if (this.candlesForFractal[i].startTime > this.fractalOfBullish.time) {
        if (this.fractalOfBullish.isFractal && !this.trend.isDownTrend) {
          if (this.candlesForFractal[i].low < this.fractalOfBullish.low) {
            this.trend.isDownTrend = true
            this.trend.trendName = 'DownTrend'
            // информация по фракталу
            this.trend.fractalDownTime = this.fractalOfBullish.timeHuman
            this.trend.fractalsDownPrice = this.fractalOfBullish.low

            // поиск точки пересечения фрактала ценой младшего ТФ для определения точного времени начала тренда
            temp = findTrends2Stage(
              candlesJunior,
              this.candlesForFractal[i],
              this.fractalOfBullish
            )
            // информация по цене младшего ТФ
            this.trend.downPriceTime = temp.startTime
            this.trend.downPriceTimeHuman = timestampToDateHuman(temp.startTime)
            this.trend.downPrice = temp.low

            this.sendMessageAboutDownTrendToConsole()
            break
          } // if (this.candlesForFractal[i].low < this.fractalOfBullish.low)
        } // if (this.fractalOfBullish.isFractal && !this.trend.isDownTrend)
      } // if (this.candlesForFractal.startTime > this.fractalOfBullish.time)

      if (this.candlesForFractal[i].startTime > this.fractalOfBearish.time) {
        if (this.fractalOfBearish.isFractal && !this.trend.isUpTrend) {
          if (this.candlesForFractal[i].high > this.fractalOfBearish.high) {
            this.trend.isUpTrend = true
            this.trend.trendName = 'UpTrend'
            // информация по фракталу
            this.trend.fractalUpTime = this.fractalOfBearish.timeHuman
            this.trend.fractalUpPrice = this.fractalOfBearish.high

            // поиск точки пересечения фрактала ценой младшего ТФ для определения точного времени начала тренда
            temp = findTrends2Stage(
              candlesJunior,
              this.candlesForFractal[i],
              this.fractalOfBearish
            )
            // информация по цене младшего ТФ
            this.trend.upPriceTime = temp.startTime
            this.trend.upPriceTimeHuman = timestampToDateHuman(temp.startTime)
            this.trend.upPrice = temp.high

            this.sendMessageAboutUpTrendToConsole()
            break
          } //if (this.candlesForFractal[i].high > this.fractalOfBearish.high)
        } // if (this.fractalOfBearish.isFractal && !this.trend.isUpTrend)
      } // if (this.candlesForFractal.startTime > this.fractalOfBearish.time)
    } // for (let i = this.candlesForFractal.length - 1; i >= 0; i--)
    return this
  }

  // --== дополнительные функции ==--
  // отправка сообщений в консоль о найденном НИСХОДЯЩЕМ тренде
  sendMessageAboutDownTrendToConsole() {
    const text = `--- ${this.nameStrategy} ---\n--== ${this.symbol}==--\nТекущий тренд = ${this.trend.trendName}\nДата фрактала: ${this.trend.fractalDownTime}\nУровень фрактала: ${this.trend.fractalsDownPrice} USD\nДата пробития фрактала: ${this.trend.downPriceTimeHuman}\nЦена пробития: ${this.trend.downPrice} USD`

    console.log('\n' + text)
    sendInfoToUserWilliams(text)
  }

  // отправка сообщений в консоль о найденном ВОСХОДЯЩЕМ тренде
  sendMessageAboutUpTrendToConsole() {
    const text = `--- ${this.nameStrategy} ---\n--== ${this.symbol}==--\nТекущий тренд = ${this.trend.trendName}\nДата фрактала: ${this.trend.fractalUpTime}\nУровень фрактала: ${this.trend.fractalUpPrice} USD\nДата пробития фрактала: ${this.trend.upPriceTimeHuman}\nЦена пробития: ${this.trend.upPrice} USD`

    console.log('\n' + text)
    sendInfoToUserWilliams(text)
  }

  // отправка сообщений в консоль о найденных фракталах
  sendMessageAboutFractalToConsole(nameFunc) {
    console.log(
      `\n${new Date()}\n${this.symbol}: ПОИСК ФРАКТАЛОВ (${nameFunc})`
    )

    // медвежий фрактал
    if (this.fractalOfBearish.isFractal) {
      console.table(this.fractalOfBearish)

      const textBearish = `--== ${this.symbol}==--\n-- ${this.fractalOfBearish.nameFracralRus} --\nHigh = ${this.fractalOfBearish.high} USD\ntime: ${this.fractalOfBearish.timeHuman}`
      sendInfoToUserWilliams(textBearish)
    }

    // бычий фрактал
    if (this.fractalOfBullish.isFractal) {
      console.table(this.fractalOfBullish)

      const textBullish = `--== ${this.symbol}==--\n-- ${this.fractalOfBullish.nameFracralRus} --\nLow = ${this.fractalOfBullish.low} USD\ntime: ${this.fractalOfBullish.timeHuman}`
      sendInfoToUserWilliams(textBullish)
    }

    // вопрос: как быть с двухфрактальными свечами?
    if (this.fractalOfBearish.time == this.fractalOfBullish.time) {
      console.log(`${this.symbol}: Двухфрактальная свеча (${nameFunc})`)

      const text = `--== ${this.symbol}==--\n-- Двухфрактальная свеча --\nHigh = ${this.fractalOfBearish.high} USD\nLow = ${this.fractalOfBullish.low} USD\ntime: ${this.fractalOfBearish.timeHuman}`
      sendInfoToUserWilliams(text)
    }
  }
} // class williamsClass

module.exports = williamsClass
