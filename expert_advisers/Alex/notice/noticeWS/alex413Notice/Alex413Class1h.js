/*
создаем класс

1. берем сохраненные свечи
2. добавляем НЕ финальную свечку
3. ищем фрактал
*/
//////////////////////////////

const getCandles = require('../../../../../API/binance.engine/usdm/getCandles.3param')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const candlesToObject = require('../../../../common.func/candlesToObject')
const fractal_Bearish413 = require('./fractal_Bearish413')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const demaCalc = require('../../../../indicators/dema')

/*
в начале запуска приложения:
1. запрашиваем 4 свечи в файле Class и храним их
2. получаем нефинальную последнюю свечю и отправляем ее в файл Class

в call back: 
1. когда получили финальную свечку, запрашиваем 4 свечи в файле Class и храним их
2. получаем нефинальную последнюю свечю и отправляем ее в файл Class

пункты 1 и 2 прописать отдельными функциями в файле Class
*/

class Alex413Class1h {
  constructor(symbol, nameStrategy, takeProfitConst, stopLossConst, shiftTime) {
    this.symbol = symbol
    this.nameStrategy = nameStrategy

    this.takeProfitConst = takeProfitConst
    this.stopLossConst = stopLossConst
    this.shiftTime = shiftTime // сдвиг на одну свечу любого ТФ

    this.partOfDeposit = 0.25 // доля депозита на одну сделку
    this.multiplier = 10 // плечо

    this.candlesForFractal = [] // свечи для поиска фрактала

    this.reset()
  }

  reset() {
    // для сигнала
    this.fractalBodyLength = 0 // длина тела фрактальной свечи
    this.fractalShadowLength = 0 // длина верхней тени фрактальной свечи
    this.fractalBearish = {}
    this.bodyLength1g = 0 // длина тела 1й зеленой свечи
    this.bodyLength2g = 0 // длина тела 2й зеленой свечи

    // индикаторы
    //this.ema = 0
    this.dema = 0

    // для сделки
    this.sygnalSent = false
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

    this.middleShadow = 0

    return this
  }

  // подготовка данных для поиска фрактала
  async prepair5Candles(interval) {
    const limitOfCandle = 9 // кол-во свечей для поиска фрактала
    const candles = await getCandles(this.symbol, interval, limitOfCandle) // получаем первые n свечей
    this.candlesForFractal = candlesToObject(candles) // преобрзауем массив свечей в объект
    //console.table(this.candlesForFractal)
    return this
  } // async prepair5Candles(interval

  prepairDataforFindFractal(lastCandle) {
    // заменяем последнюю свечку по примеру кода Толи
    if (
      this.candlesForFractal
        .map(({ startTime }) => startTime)
        .includes(lastCandle.startTime)
    ) {
      //console.log('время последних свечей совпадает') // закомментировать
      const delLastCandle = this.candlesForFractal.pop() // для начала удаляем незавршенную свечку
      //console.log('убираем последнюю свечку')
      //console.table(delLastCandle)
      //console.log(`кол-во свечей после удаления последней = ${this.candlesForFractal.length}`)
    } else {
      console.log(`${this.symbol} время последних свечей НЕ совпадает`)
      const delFirstCandle = this.candlesForFractal.shift() // удаляем первую свечку
      //console.log(`кол-во свечей после удаления первой = ${this.candlesForFractal.length}`) // закомментировать

      // выводим проверки
      //console.table(this.candlesForFractal)
      //console.table(lastCandle)
    }

    // далее добавляем последнюю свечку из WS
    this.candlesForFractal = this.candlesForFractal.concat(lastCandle)
    //console.table(this.candlesForFractal)
    //console.log(`итого кол-во свечей = ${this.candlesForFractal.length}`) // закомментировать

    return this
  } //prepairDataforFindFractal(lastCandle

  findSygnal(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      // подготавливаем данные для поиска фрактала
      this.prepairDataforFindFractal(lastCandle)

      // высчитывем dema
      const demaPeriod = 9
      const temp = demaCalc(this.candlesForFractal, demaPeriod)
      this.dema = temp.dema

      // ищем фрактал
      this.fractalBearish = fractal_Bearish413(this.candlesForFractal)

      // готовим данные по свече фрактала
      this.fractalBodyLength =
        this.candlesForFractal[6].close / this.candlesForFractal[6].open - 1
      this.fractalShadowLength =
        this.candlesForFractal[6].high / this.candlesForFractal[6].close - 1

      // вычисляем длину зеленых свечей
      this.bodyLength1g =
        this.candlesForFractal[4].close / this.candlesForFractal[4].open - 1
      this.bodyLength2g =
        this.candlesForFractal[5].close / this.candlesForFractal[5].open - 1

      // ищем сигнал №1
      if (
        // три первых свечи - ЗЕЛЕНЫЕ
        this.candlesForFractal[4].close > this.candlesForFractal[4].open && // первая свеча ЗЕЛЕНАЯ
        this.candlesForFractal[5].close > this.candlesForFractal[5].open && // вторая свеча ЗЕЛЕНАЯ
        this.candlesForFractal[6].close > this.candlesForFractal[6].open && // свеча фрактала ЗЕЛЕНАЯ
        // объемы растут (каждая зелёная больше объёмом)
        this.candlesForFractal[4].volume < this.candlesForFractal[5].volume &&
        this.candlesForFractal[5].volume < this.candlesForFractal[6].volume &&
        // тело каждой след-й зеленой больше предыдущей
        this.bodyLength1g < this.bodyLength2g &&
        this.bodyLength2g < this.fractalBodyLength &&
        // если нашли фрактал
        this.fractalBearish.isFractal &&
        this.fractalBodyLength > this.fractalShadowLength && // если тело фрактала больше тени фрактала
        this.candlesForFractal[7].open > this.candlesForFractal[7].close && // и после него КРАСНАЯ свеча
        this.dema < this.candlesForFractal[7].close // цена закрытия которой выше dema
      ) {
        if (!this.sygnalSent) {
          this.whitchSignal = this.nameStrategy + ': сигнал №1'
          this.openShortCommon()
        }

        // console.table(this.fractalBearish)
      }

      // ищем сигнал №2
      if (
        // свеча до фрактала - красная
        this.candlesForFractal[5].open > this.candlesForFractal[5].close && // вторая свеча КРАСНАЯ
        this.candlesForFractal[6].close > this.candlesForFractal[6].open && // свеча фрактала ЗЕЛЕНАЯ
        // если нашли фрактал
        this.fractalBearish.isFractal &&
        this.fractalBodyLength > this.fractalShadowLength && // если тело фрактала больше тени фрактала
        this.candlesForFractal[7].open > this.candlesForFractal[7].close && // и после него КРАСНАЯ свеча
        this.dema < this.candlesForFractal[7].close // цена закрытия которой выше dema
      ) {
        if (!this.sygnalSent) {
          this.whitchSignal = this.nameStrategy + ': сигнал №2'
          this.openShortCommon()
        }

        // console.table(this.fractalBearish)
      }
      //console.table(this.fractalBearish)
      return this
    }
  } // findSygnal(lastCandle, interval)

  // функция openShortCommon с общими полями для входа в сделку
  openShortCommon() {
    this.sygnalSent = true
    this.canShort = true
    //this.openShort = this.candlesForFractal[3].open
    this.middleShadow =
      (this.candlesForFractal[7].open + this.candlesForFractal[7].high) / 2 // середина верхней тени
    this.openShort = this.middleShadow
    this.sygnalTime = this.candlesForFractal[8].startTime

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

    sendInfoToUser(
      `---=== НОВЫЙ СИГНАЛ ===---\n${this.whitchSignal}\nМонета: ${
        this.symbol
      }\n\nНЕ подтвержденный ${this.fractalBearish.nameFracralRus}\nДата: ${
        this.fractalBearish.timeHuman
      }\nHigh: ${this.fractalBearish.high}\n\nЦена для входа в SHORT: ${
        this.openShort
      }\nDEMA: ${this.dema}\n\nКол-во монет: ${this.amountOfPosition}\nВзяли ${
        this.partOfDeposit * 100
      }% c плечом ${this.multiplier}x от депозита = ${
        this.deposit
      } USDT\n\nПоставь:\nTake Profit: ${this.takeProfit} (${
        this.takeProfitConst * 100
      }%)\nStop Loss: ${this.stopLoss} (${
        this.stopLossConst * 100
      }%)\n\nЖдем цену на рынке для входа в SHORT...`
    )
    return this
  } // openShortCommon(arrayOpenTime

  canShortPosition(lastCandle, interval) {
    if (this.canShort) {
      if (lastCandle.interval == interval) {
        //if (lastCandle.high > this.openShort) {
        if (lastCandle.close > this.openShort) {
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
  } // canShortPosition(lastCandle, interval)

  ///////////////////////
  //// закрытие шорт позиции по Take Profit или Stop Loss
  closeShortPosition(lastCandle, interval) {
    if (this.inPosition) {
      // условия выхода из сделки по TP
      if (lastCandle.interval == interval) {
        //if (lastCandle.low <= this.takeProfit) {
        if (lastCandle.close <= this.takeProfit) {
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
  } // closeShortPosition(lastCandle, interval)

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
    return this
  }
  //// условия переноса Take Profit или Stop Loss
  changeTPSL(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      // 1. Если тело свечи открытия выше цены точки входа тогда тейк переносится на точку входа
      if (lastCandle.startTime == this.sygnalTime) {
        if (lastCandle.close > lastCandle.open) {
          // проверяем на зеленой свече
          this.changeTPSL2(lastCandle.close)
        } else {
          // свеча оказалась красной
          this.changeTPSL2(lastCandle.open)
        }
      }

      // 2. перенос TP SL: после закрытия второй свечи. (последняя свеча фрактала - первая, на которой зашли)
      if (interval == '30m') {
        this.shiftTime = 1000 * 60 * 30 // сдвиг на одну 30m свечу
      }

      if (lastCandle.startTime == this.sygnalTime + this.shiftTime) {
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }
    }
    return this
  }

  changeTPSL2(price) {
    if (this.openShort < price) {
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
    }
  }
}
module.exports = Alex413Class1h
