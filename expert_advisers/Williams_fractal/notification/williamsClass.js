const getCandles = require('../../../API/binance.engine/usdm/getCandles.3param')
const { sendInfoToUserWilliams } = require('../../../API/telegram/telegram.bot')
const candlesToObject = require('../../common.func/candlesToObject')
const dealClass = require('../../common.func/dealClass')
const findTrends2Stage = require('../../common.func/findTrends2Stage')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const Trend = require('../../common.func/trendClass')

class williamsClass {
  constructor(symbol, nameStrategy) {
    this.symbol = symbol
    this.nameStrategy = nameStrategy

    //this.depositStart = 1000
    //this.depositEnd = this.depositStart
    this.partOfDeposit = 0.25 // доля депозита на одну сделку
    this.multiplier = 10 // плечо

    this.candlesForFractal = [] // свечи для поиска фрактала
    this.candlesForFractalJunior = [] // свечи для поиска фрактала на intervalJunior

    this.trend = new Trend() // для хранения информации о трендах
    //this.trendChange = false // факт смены тренда
    this.deal = new dealClass() // для хранения информации о сделках

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

  // --== (1) поиск трендов ==--
  // 1. подготовка данных для поиска фракталов
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

  // 2. поиск фракталов
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

      this.sendMessageAboutFractalToConsole('(1) find Fractal Online')
      return this
    }
  } // findFractalOnline()

  // 3. поиск тренда online (свечи !final): поиск пересечения фракталов НЕ_финальными свечами
  findTrendOnline(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      if (this.fractalOfBullish.isFractal && !this.trend.isDownTrend) {
        //if (lastCandle.low < this.fractalOfBullish.low) {
        if (lastCandle.close < this.fractalOfBullish.low) {
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
        //if (lastCandle.high > this.fractalOfBearish.high) {
        if (lastCandle.close > this.fractalOfBearish.high) {
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

  // --== (2) торговля ==--
  // 1. подготовка данных для поиска фракталов
  async prepairDataJunior(lastCandle, intervalJunior) {
    const limitOfCandle = 5 // кол-во свечей для поиска сигнала
    //if (lastCandle.interval == intervalJunior) {
    this.candlesForFractalJunior = await this.getCandlesFunc(
      intervalJunior,
      limitOfCandle
    )

    // заменяем последнюю свечку по примеру кода Толи
    if (
      this.candlesForFractalJunior
        .map(({ startTime }) => startTime)
        .includes(lastCandle.startTime)
    ) {
      //console.log('время последних свечей совпадает')
      const delLastCandle = this.candlesForFractalJunior.pop() // для начала удаляем незавршенную свечку
      // console.log('убираем последнюю свечку')
      // console.table(delLastCandle)
    } else {
      console.log(`${this.symbol} время последних свечей НЕ совпадает`)
    }

    // далее добавляем последнюю свечку из WS
    this.candlesForFractalJunior =
      this.candlesForFractalJunior.concat(lastCandle)
    return this // возвращаем массив свечей
    //} // if (lastCandle.interval == intervalJunior)
  }

  // 2. поиск фракталов (ЗАКОНЧИЛ ЗДЕСЬ)
  async findFractalJunior(lastCandle, intervalJunior) {
    if (lastCandle.interval == intervalJunior) {
      // подготовка данных для поиска фракталов
      await this.prepairDataJunior(lastCandle, intervalJunior)

      // ищем Bearish (медвежий) Fractal. Факртал находится на позиции [i-2]
      if (
        this.candlesForFractalJunior[0].high <
          this.candlesForFractalJunior[2].high &&
        this.candlesForFractalJunior[1].high <
          this.candlesForFractalJunior[2].high &&
        this.candlesForFractalJunior[3].high <
          this.candlesForFractalJunior[2].high &&
        this.candlesForFractalJunior[4].high <
          this.candlesForFractalJunior[2].high
      ) {
        this.deal.fractalOfBearish.high = candlesForFractalJunior[j - 2].high
        this.deal.fractalOfBearish.isFractal = true
        this.deal.fractalOfBearish.timeHuman = timestampToDateHuman(
          candlesForFractalJunior[j - 2].startTime
        )

        /*
        this.fractalOfBearish = {
          nameFracral: 'Bearish',
          nameFracralRus: 'Медвежий фрактал',
          isFractal: true,
          high: this.candlesForFractal[2].high,
          time: this.candlesForFractal[2].startTime,
          // проверочная ифнормация
          timeHuman: timestampToDateHuman(this.candlesForFractal[2].startTime),
        }
        */
      }

      // ищем Bullish (бычий) Fractal
      if (
        this.candlesForFractalJunior[0].low >
          this.candlesForFractalJunior[2].low &&
        this.candlesForFractalJunior[1].low >
          this.candlesForFractalJunior[2].low &&
        this.candlesForFractalJunior[3].low >
          this.candlesForFractalJunior[2].low &&
        this.candlesForFractalJunior[4].low >
          this.candlesForFractalJunior[2].low
      ) {
        this.deal.fractalOfBullish.low = candlesForFractalJunior[j - 2].low
        this.deal.fractalOfBullish.isFractal = true
        this.deal.fractalOfBullish.timeHuman = timestampToDateHuman(
          candlesForFractalJunior[j - 2].startTime
        )
        /*
        this.fractalOfBullish = {
          nameFracral: 'Bullish',
          nameFracralRus: 'Бычий фрактал',
          isFractal: true,
          low: this.candlesForFractal[2].low,
          time: this.candlesForFractal[2].startTime,
          // проверочная ифнормация
          timeHuman: timestampToDateHuman(this.candlesForFractal[2].startTime),
        }
        */
      }

      this.sendMessageAboutFractalToConsole('(3) find Fractal Junior')
      return this
    }
  } // findFractalJunior()

  // 3. Поиск сделок (ПОКА ПУСТАЯ ФУНКЦИЯ)
  findDeal(lastCandle, intervalJunior) {
    // будет работать на младшем ТФ. Ищем точку пересечения фрактала ценой.
    if (lastCandle.interval == intervalJunior) {
      // если тренд вниз
      if (this.trend.trendName == 'DownTrend') {
        if (!this.deal.inPosition && this.deal.fractalOfBullish.isFractal) {
          if (lastCandle.low < this.deal.fractalOfBullish.low) {
            // входим в сделку
            this.deal.position = 'SHORT'
            this.deal.openPosition = this.deal.fractalOfBullish.low
            this.deal.stopLoss = this.deal.fractalOfBearish.high
            this.enterDeal(lastCandle)
          } // if (lastCandle.clsoe < this.deal.fractalOfBullish.low)
        } //  if (!this.deal.inPosition && this.deal.fractalOfBullish.isFractal)

        // если в сделке
        else if (this.deal.inPosition) {
          if (this.deal.fractalOfBearish.high < this.deal.stopLoss) {
            this.deal.stopLoss = this.deal.fractalOfBearish.high
          }
          if (lastCandle.high > this.deal.stopLoss && this.deal.stopLoss > 0) {
            // закрываем сделку
            this.deal.closePosition = this.deal.stopLoss
            this.deal.profitReal =
              (this.deal.openPosition - this.deal.stopLoss) *
              this.deal.amountReal
            this.closeDeal(lastCandle)
          }
        } // if (this.deal.inPosition)

        // если сделка закрыта, до отправляем ее в общий массив
        if (this.deal.outPosition) {
          // отправка сборного сообщения в TG
          this.deal.reset()
        }
      } // if (this.trend.trendName == 'DownTrend'

      // если тренд вверх
      if (this.trend.trendName == 'UpTrend') {
        // если не в сделке
        if (!this.deal.inPosition && this.deal.fractalOfBearish.isFractal) {
          if (lastCandle.high > this.deal.fractalOfBearish.high) {
            // входим в сделку
            this.deal.position = 'LONG'
            this.deal.openPosition = this.deal.fractalOfBearish.high
            this.deal.stopLoss = this.deal.fractalOfBullish.low
            this.enterDeal(lastCandle)
          } // if (lastCandle.high > this.deal.fractalOfBearish.high)
        } // if (!this.deal.inPosition && this.deal.fractalOfBearish.isFractal)

        // если в сделке
        else if (this.deal.inPosition) {
          if (this.deal.fractalOfBullish.low > this.deal.stopLoss) {
            this.deal.stopLoss = this.deal.fractalOfBullish.low
          }
          if (lastCandle.low < this.deal.stopLoss) {
            // закрываем сделку
            this.deal.closePosition = this.deal.stopLoss
            this.deal.profitReal =
              (this.deal.stopLoss - this.deal.openPosition) *
              this.deal.amountReal
            this.closeDeal(lastCandle)
          }
        } // if (this.deal.inPosition)

        // если сделка закрыта, до отправляем ее в общий массив
        if (this.deal.outPosition) {
          // отправка сборного сообщения в TG
          this.deal.reset()
        }
      } // if (this.trend.trendName == 'DownTrend'

      return this
    } // if (lastCandle.interval == intervalJunior)
  }

  // --== дополнительные функции к (2) ==--
  enterDeal(candleJunior) {
    this.deal.inPosition = true
    this.deal.openTime = candleJunior.startTime
    this.deal.openTimeHuman = timestampToDateHuman(candleJunior.startTime)

    this.deal.amountReal =
      (this.deal.depositReal / this.deal.openPosition) *
      this.partOfDeposit *
      this.multiplier

    // ОТПРАВИТЬ СООБЩЕНИЕ В телеграм
    const text = `-- вход в сделку ==--\n${this.symbol}\nOPEN ${this.deal.position} по ${this.deal.openPosition} USD\nStop Loss: ${this.deal.stopLoss}`
    sendInfoToUserWilliams(text)

    return this
  }

  closeDeal(candleJunior) {
    this.deal.outPosition = true
    this.deal.closeTime = candleJunior.startTime
    this.deal.closeTimeHuman = timestampToDateHuman(candleJunior.startTime)
    this.deal.percentReal =
      (this.deal.profitReal / this.deal.openPosition) * 100
    this.deal.depositReal += this.deal.profitReal

    // ОТПРАВИТЬ СООБЩЕНИЕ В телеграм
    const text = `-- выход из сделки ==--\n${this.symbol}\nCLOSE ${this.deal.position} по ${this.deal.closePosition} USD\nРезультат: ${this.deal.profitReal} USD (${this.deal.percentReal}%)\nДепозит: ${this.deal.depositReal} USD`
    sendInfoToUserWilliams(text)

    return this
  }

  // --== (0) при запуске приложения ==--
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

    this.sendMessageAboutFractalToConsole('(0) first Start')

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
            // поиск точки пересечения фрактала ценой младшего ТФ для определения точного времени начала тренда
            temp = findTrends2Stage(
              candlesJunior,
              this.candlesForFractal[i],
              this.fractalOfBullish
            )
            if (temp.id != 0) {
              this.trend.isDownTrend = true
              this.trend.trendName = 'DownTrend'
              // информация по фракталу
              this.trend.fractalDownTime = this.fractalOfBullish.timeHuman
              this.trend.fractalsDownPrice = this.fractalOfBullish.low

              // информация по цене младшего ТФ
              this.trend.downPriceTime = temp.candlesJunior.startTime
              this.trend.downPriceTimeHuman = timestampToDateHuman(
                temp.candlesJunior.startTime
              )
              this.trend.downPrice = temp.candlesJunior.low

              this.sendMessageAboutDownTrendToConsole()
              break
            } // if (temp.id != 0)
          } // if (this.candlesForFractal[i].low < this.fractalOfBullish.low)
        } // if (this.fractalOfBullish.isFractal && !this.trend.isDownTrend)
      } // if (this.candlesForFractal.startTime > this.fractalOfBullish.time)

      if (this.candlesForFractal[i].startTime > this.fractalOfBearish.time) {
        if (this.fractalOfBearish.isFractal && !this.trend.isUpTrend) {
          if (this.candlesForFractal[i].high > this.fractalOfBearish.high) {
            // поиск точки пересечения фрактала ценой младшего ТФ для определения точного времени начала тренда
            temp = findTrends2Stage(
              candlesJunior,
              this.candlesForFractal[i],
              this.fractalOfBearish
            )
            if (temp.id != 0) {
              this.trend.isUpTrend = true
              this.trend.trendName = 'UpTrend'
              // информация по фракталу
              this.trend.fractalUpTime = this.fractalOfBearish.timeHuman
              this.trend.fractalUpPrice = this.fractalOfBearish.high

              // информация по цене младшего ТФ
              this.trend.upPriceTime = temp.candlesJunior.startTime
              this.trend.upPriceTimeHuman = timestampToDateHuman(
                temp.candlesJunior.startTime
              )
              this.trend.upPrice = temp.candlesJunior.high

              this.sendMessageAboutUpTrendToConsole()
              break
            } // if (temp.id != 0)
          } //if (this.candlesForFractal[i].high > this.fractalOfBearish.high)
        } // if (this.fractalOfBearish.isFractal && !this.trend.isUpTrend)
      } // if (this.candlesForFractal.startTime > this.fractalOfBearish.time)
    } // for (let i = this.candlesForFractal.length - 1; i >= 0; i--)
    return this
  }

  // --== дополнительные функции к (1) ==--
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

    // медвежий фрактал intervalSenior
    if (this.fractalOfBearish.isFractal) {
      console.table(this.fractalOfBearish)

      const textBearishSenior = `--== ${this.symbol}==--\n-- ${this.fractalOfBearish.nameFracralRus} --\nHigh = ${this.fractalOfBearish.high} USD\ntime: ${this.fractalOfBearish.timeHuman}\nИсточник: ${nameFunc}`
      sendInfoToUserWilliams(textBearishSenior)
    }

    // медвежий фрактал intervalJunior
    if (this.deal.fractalOfBearish.isFractal) {
      //console.table(this.fractalOfBearish)

      const textBearishJunior = `--== ${this.symbol}==--\n-- ${this.deal.fractalOfBearish.nameFracralRus} --\Long = ${this.deal.fractalOfBearish.high} USD\ntime: ${this.deal.fractalOfBearish.timeHuman}\nИсточник: ${nameFunc}`
      sendInfoToUserWilliams(textBearishJunior)
    }

    // бычий фрактал intervalSenior
    if (this.fractalOfBullish.isFractal) {
      console.table(this.fractalOfBullish)

      const textBullishSenior = `--== ${this.symbol}==--\n-- ${this.fractalOfBullish.nameFracralRus} --\nLow = ${this.fractalOfBullish.low} USD\ntime: ${this.fractalOfBullish.timeHuman}\nИсточник: ${nameFunc}`
      sendInfoToUserWilliams(textBullishSenior)
    }

    // бычий фрактал intervalJunior
    if (this.deal.fractalOfBullish.isFractal) {
      //console.table(this.fractalOfBullish)

      const textBullishJunior = `--== ${this.symbol}==--\n-- ${this.deal.fractalOfBullish.nameFracralRus} --\nSHORT = ${this.deal.fractalOfBullish.low} USD\ntime: ${this.deal.fractalOfBullish.timeHuman}\nИсточник: ${nameFunc}`
      sendInfoToUserWilliams(textBullishJunior)
    }

    // вопрос: как быть с двухфрактальными свечами?
    if (this.fractalOfBearish.time == this.fractalOfBullish.time) {
      console.log(`${this.symbol}: Двухфрактальная свеча (${nameFunc})`)

      const text = `--== ${this.symbol}==--\n-- Двухфрактальная свеча --\nHigh = ${this.fractalOfBearish.high} USD\nLow = ${this.fractalOfBullish.low} USD\ntime: ${this.fractalOfBearish.timeHuman}\nИсточник: ${nameFunc}`
      sendInfoToUserWilliams(text)
    }
  }
} // class williamsClass

module.exports = williamsClass
