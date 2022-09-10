const getCandles = require('../../../../../API/binance.engine/usdm/getCandles.3param')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const candlesToObject = require('../../../../common.func/candlesToObject')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')

class alNot3824Class2h {
  constructor(symbol, nameStrategy) {
    this.symbol = symbol
    this.nameStrategy = nameStrategy
    this.reset()
  }

  reset() {
    this.canShort = false
    this.inPosition = false
    this.deposit = 1000
    this.whitchSignal = ''
    this.openShort = 0
    this.positionTime = 0
    this.sygnalTime = 0
    this.amountOfPosition = 0
    this.takeProfit = 0
    this.stopLoss = 0
    this.changedTP = false
    this.changedSL = false
    this.closeShort = 0
    this.closeTime = 0
    this.profit = 0
    this.percent = 0
    this.shortCandleColorIsGreen = false

    this.diffShadowBigUser = 0.3 // Из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625
    this.takeProfitConst = 0.02
    this.stopLossConst = 0.02

    this.partOfDeposit = 0.25 // доля депозита на одну сделку
    this.multiplier = 10 // плечо

    this.shiftTime = 1000 * 60 * 60 * 2 // сдвиг на одну 2h свечу
    // this.signalSendingTime = new Date().getTime() // время отправки сигнала
    return this
  }
  // подготовка данных для поиска сигнала
  async prepairData(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      const limitOfCandle = 4 // кол-во свечей для поиска сигнала
      let candles = await getCandles(this.symbol, interval, limitOfCandle) // получаем первые n свечей

      let candlesObject = candlesToObject(candles) // преобрзауем массив свечей в объект

      // заменяем последнюю свечку по примеру кода Толи
      if (
        candlesObject
          .map(({ startTime }) => startTime)
          .includes(lastCandle.startTime)
      ) {
        // console.log('время последних свечей совпадает')
        const delLastCandle = candlesObject.pop() // для начала удаляем незавршенную свечку
        // console.log('убираем последнюю свечку')
        // console.table(delLastCandle)
      } else {
        console.log(`${this.symbol} время последних свечей НЕ совпадает`)
      }

      // далее добавляем последнюю свечку из WS
      candlesObject = candlesObject.concat(lastCandle)

      // запускаем функции по поиску сигналов, в которых проверяем условиям на вход. Если входим, то inPosition = true
      // поиск сигнала исходя по приоритету стратегий
      /*
      if (!this.inPosition || !this.canShort) {
        this = findSygnal37(candlesObject, this)
      }
      */

      if (!this.inPosition && !this.canShort) {
        this.findSygnal(candlesObject)
      }
      /*
      if (!this.inPosition && !this.canShort) {
        this = findSygnal39(candlesObject, this)
      }
      */
      return this // возвращаем состояние сделки и параметры входа
    }
  }
  // поиск сигнала
  findSygnal(array) {
    // для сигнала №1
    let lengthUpShadow = 0 // длина верхней тени на красной свечи
    let lengthDownShadow = 0 // длина нижней тени на красной свечи
    let diffShadow = 0 // отношение верхней тени к нижней тени на красной свечи
    let candleBodyLength = 0 // вычисление длины тела свечи
    let shadow1g = 0 // процент изменения верхней тени 1й зеленой свечи
    let shadow2g = 0 // процент изменения верхней тени 2й зеленой свечи

    // проверка условий на вход
    // если входим, то inPosition = true
    for (let i = 3; i < array.length; i++) {
      if (!this.inPosition) {
        // сигнал №1
        if (
          array[i - 2].close > array[i - 2].open && // 1 свеча зелёная
          array[i - 1].close > array[i - 1].open && // 2 свеча зелёная
          array[i].open > array[i].close && // 3 свеча красная
          array[i].volume > array[i - 1].volume && // объем 3й красной больше объема 2й зеленой
          array[i].close > array[i - 1].open // цена закрытия 3й красной выше цены открытия 2й зеленой
        ) {
          // расчет соотношения верхней тени к нижней тени на 3й красной свече
          lengthUpShadow = array[i].high - array[i].open
          lengthDownShadow = array[i].close - array[i].low
          diffShadow = lengthUpShadow / lengthDownShadow

          candleBodyLength = (array[i].open / array[i].close - 1) * 1000 // расчет тела 3й красной свечи, 1000 - это просто коэффициент для удобства

          // дополнительные условия от 28.08.2022
          shadow1g = array[i - 2].high / array[i - 2].close - 1 // процент роста верхней тени 1й зеленой свечи
          shadow2g = array[i - 1].high / array[i - 1].close - 1 // процент роста верхней тени 2й зеленой свечи
          if (
            diffShadow < this.diffShadowBigUser && // расчетный diff < пользовательского значения
            candleBodyLength > 0.8 && // взято из таблицы
            // дополнительные условия от 28.08.2022
            //array[i].low > array[i - 2].open && // лой 3й красной большое цены открытия 1й зеленой
            shadow1g > shadow2g // % тени 1й зеленой больше % тени второй зеленой
          ) {
            this.canShort = true
            this.whitchSignal = this.nameStrategy + ': сигнал №1'
            this.openShort = array[i].high
            this.openShortCommon(array[i].startTime)
          } // второй блок if (расчетный)
        } // первый блок if на поиск конфигурации свечей

        // сигнал №2
        /*
        if (
          array[i - 3].close > array[i - 3].open && // 1 свеча зелёная
          array[i - 2].close > array[i - 2].open && // 2 свеча зелёная
          array[i - 1].volume > array[i - 2].volume && // объем 3й красной больше объёма 2й зеленой
          array[i - 1].open > array[i - 1].close && // 3 свеча красная
          array[i - 1].close > array[i - 2].open && // цена закрытия 3й красной выше цены открытия 2й зеленой
          array[i].open > array[i].close && // 4 свеча красная
          // дополнительные условия от 28.08.2022
          array[i].low > array[i - 3].low // лой последней красной выше лоя первой зеленой
        ) {
          // расчет соотношения верхней тени к нижней тени на 4й красной свече
          lengthUpShadow = array[i].high - array[i].open
          lengthDownShadow = array[i].close - array[i].low
          diffShadow = lengthUpShadow / lengthDownShadow

          candleBodyLength = (array[i].open / array[i].close - 1) * 1000 // расчет тела 4й красной свечи, 1000 - это просто коэффициент для удобства

          if (
            diffShadow < this.diffShadowBigUser && // расчетный diff < пользовательского значения
            candleBodyLength > 0.8 // взято из таблицы
          ) {
            this.canShort = true
            this.whitchSignal = this.nameStrategy + ': сигнал №2'
            this.openShort = array[i].high
            this.openShortCommon(array[i].startTime)
          } // второй блок if (расчетный)
        } // первый блок if на поиск конфигурации свечей
        */

        // отправляем сообщение в tg о найденном сигнале
        if (this.canShort) {
          console.log(
            `${this.symbol}: Нашли сигнал для Open SHORT: ${this.whitchSignal}`
          )

          sendInfoToUser(
            `---=== НОВЫЙ СИГНАЛ ===---\n${this.whitchSignal}\n\nМонета: ${
              this.symbol
            }\nЦена для входа в SHORT: ${
              this.openShort
            }\n\nВремя сигнальной свечи: ${timestampToDateHuman(
              array[i].startTime
            )}\nВремя сигнала: ${timestampToDateHuman(
              this.sygnalTime
            )}\nВремя отправки сообщения: ${timestampToDateHuman(
              new Date().getTime()
            )}\n\nКол-во монет: ${this.amountOfPosition}\nВзяли ${
              this.partOfDeposit * 100
            }% c плечом ${this.multiplier}x от депозита = ${
              this.deposit
            } USDT\n\nПоставь:\nTake Profit: ${this.takeProfit} (${
              this.takeProfitConst * 100
            }%)\nStop Loss: ${this.stopLoss} (${
              this.stopLossConst * 100
            }%)\n\nЖдем цену на рынке для входа в SHORT...`
          )
          //sendInfoToUser(JSON.stringify(this))
        } else {
          console.log(
            `${this.symbol}: Сигнала на вход не было. Ждем следующую свечу (${this.nameStrategy})`
          )
          // sendInfoToUser(`Сигнала на вход не было. \nЖдем следующую свечу`)
        } // if (canShort)
      } // if (!inShortPosition)
    } // for (let i = 4; i < array.length; i++)
    return this
  }
  // функция openShortCommon с общими полями для входа в сделку
  openShortCommon(arrayOpenTime) {
    this.sygnalTime = arrayOpenTime + this.shiftTime

    // вычисляем уровень take profit
    this.takeProfit = +(this.openShort * (1 - this.takeProfitConst)).toFixed(5)

    // вычисляем уровень Stop Loss
    this.stopLoss = +(this.openShort * (1 + this.stopLossConst)).toFixed(5)

    // считаем объем сделки
    this.amountOfPosition = +(
      (this.deposit / this.openShort) *
      this.partOfDeposit *
      this.multiplier
    ).toFixed(8)
  }
  ///////////////////////////////////////////
  //// поиск точки входа в шорт
  canShortPosition(lastCandle, interval) {
    if (this.canShort) {
      if (lastCandle.interval == interval) {
        if (lastCandle.high > this.openShort) {
          this.canShort = false
          this.inPosition = true
          //this.positionTime = lastCandle.startTime
          this.positionTime = new Date().getTime()

          sendInfoToUser(
            `${this.whitchSignal}\n\nМонета: ${
              this.symbol
            }\n\n--== Вошли в SHORT ==--\nпо цене: ${
              this.openShort
            } USDT \n\nВремя сигнала: ${timestampToDateHuman(
              this.sygnalTime
            )}\nВремя входа: ${timestampToDateHuman(
              this.positionTime
            )}\n\nЖдем цену на рынке для выхода из сделки...`
          )
        }
      }
    }
    return this
  }
  ///////////////////////
  //// закрытие шорт позиции по Take Profit или Stop Loss
  closeShortPosition(lastCandle, interval) {
    if (this.inPosition) {
      // условия выхода из сделки по TP
      if (lastCandle.interval == interval) {
        if (lastCandle.low <= this.takeProfit) {
          //this.closeShort = lastCandle.low
          this.closeShort = this.takeProfit
          //this.closeTime = lastCandle.startTime
          this.closeTime = new Date().getTime()

          this.profit = +(
            (this.openShort - this.closeShort) *
            this.amountOfPosition
          ).toFixed(2)

          this.percent = +((this.profit / this.deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

          this.inPosition = false

          // console.log(`Close SHORT with takeProfit: ${this.closeShort}`)
          sendInfoToUser(
            `${this.whitchSignal}\n${timestampToDateHuman(
              this.closeTime
            )}\n\nМонета: ${
              this.symbol
            }\n\n--== Close SHORT ==--\nwith Take Profit: ${
              this.closeShort
            }\nПрибыль = ${this.profit} USDT (${this.percent}% от депозита)`
          )
        } // условия выхода из сделки по TP
        // условия выхода из сделки по SL
        else if (lastCandle.high >= this.stopLoss) {
          //this.closeShort = lastCandle.high
          this.closeShort = this.stopLoss
          //this.closeTime = lastCandle.startTime
          this.closeTime = new Date().getTime()

          this.profit = +(
            (this.openShort - this.closeShort) *
            this.amountOfPosition
          ).toFixed(2)

          this.percent = +((this.profit / this.deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

          this.inPosition = false

          //console.log(`Close SHORT with stopLoss: ${this.closeShort}`)
          sendInfoToUser(
            `${this.whitchSignal}\n${timestampToDateHuman(
              this.closeTime
            )}\n\nМонета: ${
              this.symbol
            }\n\n--== Close SHORT ==--\nwith Stop Loss: ${
              this.closeShort
            }\nУбыток = ${this.profit} USDT (${this.percent}% от депозита)`
          )
        } // отработка выхода из сделки по SL
      } // if (lastCandle.interval == interval)
    } // if (this.inPosition)

    return this
  }
  ///////////////////////////
  //// общие функции для условия переноса Take Profit или Stop Loss
  changeTPSLCommon(lastCandle) {
    // отправка сообщения для контроля расчета времени сдвига
    /*
    sendInfoToUser(
      `${
        this.whitchSignal
      }\nПроверка расчета времени переноса TP и SL\nМонета: ${
        this.symbol
      }:\n\nВремя появления сигнала:\n${timestampToDateHuman(
        this.sygnalTime
      )}\n\nВремя свечи для изменения TP и SL:\n${timestampToDateHuman(
        this.sygnalTime + this.shiftTime * 2
      )}\n\nВремя входа в позицию:\n${timestampToDateHuman(this.positionTime)}`
    )
    */

    // моделирование условия if (i >= indexOfPostion + 2)
    //if (lastCandle.startTime >= this.sygnalTime + this.shiftTime) {
    // изменение TP: если мы в просадке
    if (this.openShort < lastCandle.close) {
      if (!this.changedTP) {
        this.takeProfit = this.openShort
        // dateChangeTP = array[i].startTime
        this.changedTP = true
        sendInfoToUser(
          `${this.whitchSignal}\nМонета: ${
            this.symbol
          }\n\nВремя появления сигнала:\n${timestampToDateHuman(
            this.sygnalTime
          )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
            this.positionTime
          )}\n\n--== Мы в вариативной просадке ==--\nМеняем take profit на точку входа: ${
            this.takeProfit
          }`
        )
      }
    } else {
      if (!this.changedSL) {
        // изменение SL: если мы в прибыли
        this.stopLoss = this.openShort
        // dateChangeSL = array[i].startTime
        this.changedSL = true
        sendInfoToUser(
          `${this.whitchSignal}\nМонета: ${
            this.symbol
          }\n\nВремя появления сигнала:\n${timestampToDateHuman(
            this.sygnalTime
          )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
            this.positionTime
          )}\n\n--= Мы в вариативной прибыли ==--\nМеняем stop loss на точку входа: ${
            this.stopLoss
          }`
        )
      }
    }
    //} // if (lastCandle.startTime >= this.startTime + shiftTime)
  }
  //// условия переноса Take Profit или Stop Loss
  changeTPSL(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      // перенос TP SL: если свеча открытия - зеленая, то стоп или тейк переносится после её закрытия.
      if (
        lastCandle.startTime == this.sygnalTime &&
        lastCandle.close > lastCandle.open
      ) {
        this.shortCandleColorIsGreen = true
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }
      // если свеча открытия - красная, то стоп или тейк переносится после закрытия второй свечи
      else if (
        lastCandle.startTime == this.sygnalTime + this.shiftTime &&
        !this.shortCandleColorIsGreen
      ) {
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }
    }
    return this
  }
  ////
}

module.exports = alNot3824Class2h
