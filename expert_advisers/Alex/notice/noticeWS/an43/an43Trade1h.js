// 4.3 для 1h

// 1. красная свеча
// 2. Зеленая свеча
// 3. красная свеча
// Dema должна проходить ниже закрытия 3й красной свечи.
// Vol 3й красной свечи < vol 2й зеленой свечи.

// Вход на середине верхней тени красной свечи

// тейк +1.5% стоп лосс -1.5%
// Стоп лосс или тейк переносится в б.у. сразу после закрытия свечи открытия.

const getCandles = require('../../../../../API/binance.engine/usdm/getCandles.3param')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const candlesToObject = require('../../../../common.func/candlesToObject')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const demaCalc = require('../../../../indicators/dema')

class An43Trade1h {
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
    // индикаторы
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
  } // async prepair5Candles(interval)

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
      // console.log(`${this.symbol} время последних свечей НЕ совпадает`)
      // const delFirstCandle = this.candlesForFractal.shift() // удаляем первую свечку
      //console.log(`кол-во свечей после удаления первой = ${this.candlesForFractal.length}`) // закомментировать
      // выводим проверки
      //console.table(this.candlesForFractal)
      //console.table(lastCandle)
    }

    // далее добавляем последнюю свечку из WS
    // this.candlesForFractal = this.candlesForFractal.concat(lastCandle)
    //console.table(this.candlesForFractal)
    //console.log(`итого кол-во свечей = ${this.candlesForFractal.length}`) // закомментировать

    return this
  } //prepairDataforFindFractal(lastCandle)

  findSygnal(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      // высчитывем dema
      const demaPeriod = 9
      const temp = demaCalc(this.candlesForFractal, demaPeriod)
      this.dema = temp.dema

      // подготавливаем данные для поиска сигнала
      // this.prepairDataforFindFractal(lastCandle)
      // console.log(`${this.symbol} ищем сигнал, свечи для поиска сигнала:`)
      // console.table(this.candlesForFractal)
      // console.table(this.candlesForFractal[-1])

      // ищем сигнал
      if (
        this.candlesForFractal[6].open > this.candlesForFractal[6].close && // 1я свеча КРАСНАЯ
        this.candlesForFractal[7].close > this.candlesForFractal[7].open && // 2я свеча ЗЕЛЕНАЯ
        this.candlesForFractal[8].open > this.candlesForFractal[8].close && // 3я свеча КРАСНАЯ
        this.dema < this.candlesForFractal[8].close && // цена закрытия которой выше dema
        this.candlesForFractal[7].volume > this.candlesForFractal[8].volume // объем 2й зеленой > объема 3й красной
      ) {
        // if (!this.sygnalSent) {
        this.whitchSignal = this.nameStrategy + ': сигнал'
        this.openShortCommon()
        // }
      }
      return this
    }
  } // findSygnal(lastCandle, interval)

  // функция openShortCommon с общими полями для входа в сделку
  openShortCommon() {
    // this.sygnalSent = true
    this.canShort = true
    //this.openShort = this.candlesForFractal[3].open
    this.middleShadow =
      (this.candlesForFractal[8].open + this.candlesForFractal[8].high) / 2 // середина верхней тени
    this.openShort = this.middleShadow
    this.sygnalTime = this.candlesForFractal[8].startTime + this.shiftTime

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

    const message = `---=== НОВЫЙ СИГНАЛ ===---\n${
      this.whitchSignal
    }\nМонета: ${this.symbol}\n\nЦена для входа в SHORT: ${
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
    sendInfoToUser(message)
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

          const message = `${this.whitchSignal}\n\nМонета: ${
            this.symbol
          }\n\n--== Вошли в SHORT ==--\nпо цене: ${
            this.openShort
          } USDT \n\nВремя сигнала: ${timestampToDateHuman(
            this.sygnalTime
          )}\nВремя входа: ${timestampToDateHuman(
            this.positionTime
          )}\n\nЖдем цену на рынке для выхода из сделки...`
          sendInfoToUser(message)
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
          const message = `${this.whitchSignal}\n${timestampToDateHuman(
            this.closeTime
          )}\n\nМонета: ${
            this.symbol
          }\n\n--== Close SHORT ==--\nwith Take Profit: ${
            this.closeShort
          }\nПрибыль = ${this.profit} USDT (${this.percent}% от депозита)`
          sendInfoToUser(message)
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
          const message = `${this.whitchSignal}\n${timestampToDateHuman(
            this.closeTime
          )}\n\nМонета: ${
            this.symbol
          }\n\n--== Close SHORT ==--\nwith Stop Loss: ${
            this.closeShort
          }\nУбыток = ${this.profit} USDT (${this.percent}% от депозита)`
          sendInfoToUser(message)
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
        this.takeProfit = this.openShort * (1 - 0.001)
        // dateChangeTP = array[i].startTime
        this.changedTP = true
        const message = `${this.whitchSignal}\nМонета: ${
          this.symbol
        }\n\nВремя появления сигнала:\n${timestampToDateHuman(
          this.sygnalTime
        )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
          this.positionTime
        )}\n\n--== Мы в вариативной просадке ==--\nМеняем TAKE PROFIT на (точку входа - 0.1%): ${
          this.takeProfit
        }`
        sendInfoToUser(message)
      }
    } else {
      if (!this.changedSL) {
        // изменение SL: если мы в прибыли
        this.stopLoss = this.openShort * (1 - 0.001)
        // dateChangeSL = array[i].startTime
        this.changedSL = true
        const message = `${this.whitchSignal}\nМонета: ${
          this.symbol
        }\n\nВремя появления сигнала:\n${timestampToDateHuman(
          this.sygnalTime
        )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
          this.positionTime
        )}\n\n--= Мы в вариативной прибыли ==--\nМеняем STOP LOSS на (точку входа - 0.1%): ${
          this.stopLoss
        }`
        sendInfoToUser(message)
      }
    }
    //} // if (lastCandle.startTime >= this.startTime + shiftTime)
    return this
  }
  //// условия переноса Take Profit или Stop Loss
  changeTPSL(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      // Стоп лосс или тейк переносится в б.у. сразу после закрытия свечи открытия
      if (lastCandle.startTime == this.sygnalTime) {
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }
    }
    return this
  }
}
module.exports = An43Trade1h
