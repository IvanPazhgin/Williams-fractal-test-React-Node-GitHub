/*
создаем класс

1. берем сохраненные свечи
2. добавляем НЕ финальную свечку
3. ищем фрактал
*/
//////////////////////////////

const getPositionAmount = require('../../../../../API/binance.engine/common/getPositionAmt')
// const { optionsOfTrade } = require('../../../../../API/binance.engine/trade/api_options')
const submittingCloseOrder = require('../../../../../API/binance.engine/trade/submittingCloseOrder')
const submittingEnterOrder = require('../../../../../API/binance.engine/trade/submittingEnterOrder')
const getCandles = require('../../../../../API/binance.engine/usdm/getCandles.3param')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const candlesToObject = require('../../../../common.func/candlesToObject')
// const fractal_Bearish = require('../../../../common.func/fractal_Bearish')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
// const choiceSymbol = require('../../../../robot/choiceSymbol')
const mongoDBadd = require('../../../../../API/mongoDB/mongoDBadd')
const { name } = require('./input_parameters')

/*
в начале запуска приложения:
1. запрашиваем 4 свечи в файле Class и храним их
2. получаем нефинальную последнюю свечю и отправляем ее в файл Class

в call back: 
1. когда получили финальную свечку, запрашиваем 4 свечи в файле Class и храним их
2. получаем нефинальную последнюю свечю и отправляем ее в файл Class

пункты 1 и 2 прописать отдельными функциями в файле Class
*/

/*
27.10.2022
Страта 4.2 
3 зеленых 30 m

(х) 1я свеча - красная
Ищем три зеленых подряд. 
vol 1й зел < vol 2й зел.    
Vol 3й зел. в 2 раза больше vol 2й зеленой

длина тела 3й зеленой большев 2 раза тела 2й зеленой. Тело - это расстояние между открытием и закрытием свечи.

SL=-1% Тейк +1%

вход по цене закрытия 3й зеленой


если профит достиг +0.6%, то переносим SL в БУ

если свеча открытия зеленая то перенос после закрытия свечи открытия. 
Если свеча открытия красная то перенос после закрытия 3 свечи (первой свечой в данном случае считается свеча открытия)
*/

class An42Trade {
  constructor(symbol, nameStrategy, takeProfitConst, stopLossConst, shiftTime) {
    this.symbol = symbol
    this.nameStrategy = nameStrategy
    this.position = 'SHORT'

    this.takeProfitConst = takeProfitConst
    this.stopLossConst = stopLossConst
    this.shiftTime = shiftTime // сдвиг на одну свечу любого ТФ

    this.partOfDeposit = 0.25 // доля депозита на одну сделку
    this.multiplier = 10 // плечо

    this.fractalLength = 5 // отношение между high и low фрактальной свечи должно быть меньше 5%

    this.candlesForFractal = [] // свечи для поиска фрактала

    // статистика
    this.countAllDeals = 0
    this.countOfPositive = 0 // кол-во положительных сделок
    this.countOfNegative = 0 // кол-во отрицательных сделок
    this.countOfZero = 0 // кол-во нулевых сделок

    //this.inOneDeal = new choiceSymbol()

    this.reset()
  }

  reset() {
    // для сигнала
    this.fractalBodyLength = 0 // длина тела фрактальной свечи
    this.fractalShadowLength = 0 // длина верхней тени фрактальной свечи
    this.fractalBearish = {}
    this.bodyLength1g = 0 // длина тела 1й зеленой свечи
    this.bodyLength2g = 0 // длина тела 2й зеленой свечи
    this.upperShadowRed = 0 // верхняя тень красной свечи
    this.lowerShadowRed = 0 // верхняя тень красной свечи
    this.diffShadowRed = 0 // отношение теней на красной свечи
    this.fractalLengthCalc = 0 // для расчета отношения между high и low на фрактальной свече

    // для сделки
    this.sygnalSent = false
    this.aboutBrokenFractal = false
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
    this.fractalHigh = 0 // хай фрактала для отмены сигнала

    // для TP SL
    this.openCandleIsGreen = false // свеча, на которой вошли в сделку, оказалась зеленой

    // для торговли
    this.enterOrderResult = {} // результат входа в сделку
    this.closeOrderResult = {} // результат выхода из сделки

    return this
  }

  // подготовка данных для поиска фрактала
  async prepair5Candles(interval) {
    const limitOfCandle = 3 // кол-во свечей для поиска фрактала
    const candles = await getCandles(this.symbol, interval, limitOfCandle) // получаем первые n свечей
    this.candlesForFractal = candlesToObject(candles) // преобрзауем массив свечей в объект
    //console.table(this.candlesForFractal)
    //console.log(`alex412: prepair5Candles(): прилетело ${this.candlesForFractal.length} свечей`) // удалить
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
      //console.log(`${this.symbol} время последних свечей НЕ совпадает`)
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
      // this.prepairDataforFindFractal(lastCandle)
      // console.log(`${this.symbol} ищем сигнал, свечи для поиска сигнала:`)
      // console.table(this.candlesForFractal)

      // ищем фрактал
      // this.fractalBearish = fractal_Bearish(this.candlesForFractal)

      // готовим данные по свече фрактала
      this.fractalBodyLength =
        this.candlesForFractal[2].close / this.candlesForFractal[2].open - 1
      // this.fractalShadowLength = this.candlesForFractal[2].high / this.candlesForFractal[2].close - 1

      // расчет отношения между high и low на фрактальной свече
      // this.fractalLengthCalc = (this.candlesForFractal[2].high / this.candlesForFractal[2].low - 1) * 100

      // вычисляем длину зеленых свечей (сигнал №1)
      // this.bodyLength1g = this.candlesForFractal[0].close / this.candlesForFractal[0].open - 1
      // this.bodyLength2g = this.candlesForFractal[1].close / this.candlesForFractal[1].open - 1
      this.bodyLength2g =
        this.candlesForFractal[1].high / this.candlesForFractal[1].low - 1

      // вычисляем тени на 4й красной свече
      // this.upperShadowRed = this.candlesForFractal[3].high / this.candlesForFractal[3].open - 1
      // this.lowerShadowRed = this.candlesForFractal[3].close / this.candlesForFractal[3].low - 1
      // this.diffShadowRed = this.lowerShadowRed / this.upperShadowRed - 1

      // this.findSygnal1() // ищем сигнал №1: 3 зеленых и красная
      // this.findSygnal2() // ищем сигнал №2: свеча фрактала ЗЕЛЕНАЯ
      // this.findSygnal3() // ищем сигнал №3: свеча фрактала КРАСНАЯ
      this.findSygnal4() // три первых свечи - ЗЕЛЕНЫЕ

      return this
    }
  } // findSygnal(lastCandle, interval)

  // ищем сигнал №1: 3 зеленых и красная
  findSygnal1() {
    if (
      // 03.10.2022: отношение между high и low фрактальной свечи должно быть меньше 5%
      this.fractalLengthCalc < this.fractalLength &&
      // три первых свечи - ЗЕЛЕНЫЕ
      this.candlesForFractal[0].close > this.candlesForFractal[0].open && // первая свеча ЗЕЛЕНАЯ
      this.candlesForFractal[1].close > this.candlesForFractal[1].open && // вторая свеча ЗЕЛЕНАЯ
      this.candlesForFractal[2].close > this.candlesForFractal[2].open && // свеча фрактала ЗЕЛЕНАЯ
      // объемы растут (каждая зелёная больше объёмом)
      this.candlesForFractal[0].volume < this.candlesForFractal[1].volume &&
      this.candlesForFractal[1].volume < this.candlesForFractal[2].volume &&
      // тело каждой след-й зеленой больше предыдущей
      this.bodyLength1g < this.bodyLength2g &&
      this.bodyLength2g < this.fractalBodyLength &&
      // если нашли фрактал
      this.fractalBearish.isFractal &&
      this.fractalBodyLength > this.fractalShadowLength && // если тело фрактала больше тени фрактала
      this.candlesForFractal[3].open > this.candlesForFractal[3].close && // и после него КРАСНАЯ свеча
      this.upperShadowRed >= this.lowerShadowRed // у которого верхняя тень равна либо больше по длине нижней тени
    ) {
      if (!this.sygnalSent) {
        this.whitchSignal = this.nameStrategy + ': 3 зеленых'
        this.middleShadow =
          (this.candlesForFractal[3].open + this.candlesForFractal[3].high) / 2 // середина верхней тени красной свечи
        this.openShortCommon()
      }
    }

    return this
  }

  // ищем сигнал №2: свеча фрактала ЗЕЛЕНАЯ
  findSygnal2() {
    if (
      // 03.10.2022: отношение между high и low фрактальной свечи должно быть меньше 5%
      this.fractalLengthCalc < this.fractalLength &&
      // 30.09.2022: убираем зеленый фрактал на 30m, оставляем на 1h
      interval == '1h' &&
      // свеча до фрактала - красная
      this.candlesForFractal[1].open > this.candlesForFractal[1].close && // вторая свеча КРАСНАЯ
      this.candlesForFractal[2].close > this.candlesForFractal[2].open && // свеча фрактала ЗЕЛЕНАЯ
      // если нашли фрактал
      this.fractalBearish.isFractal &&
      this.fractalBodyLength > this.fractalShadowLength && // если тело фрактала больше тени фрактала
      this.candlesForFractal[3].open > this.candlesForFractal[3].close && // и после него КРАСНАЯ свеча
      (this.upperShadowRed >= this.lowerShadowRed || this.diffShadowRed < 0.6) // у которого верхняя тень равна либо больше по длине нижней тени
    ) {
      if (!this.sygnalSent) {
        this.whitchSignal = this.nameStrategy + ': свеча фрактала ЗЕЛЕНАЯ'
        this.middleShadow =
          (this.candlesForFractal[3].open + this.candlesForFractal[3].high) / 2 // середина верхней тени красной свечи
        this.openShortCommon()
      }
    }

    return this
  }

  // ищем сигнал №3: свеча фрактала КРАСНАЯ
  findSygnal3() {
    if (
      // 03.10.2022: отношение между high и low фрактальной свечи должно быть меньше 5%
      this.fractalLengthCalc < this.fractalLength &&
      // вариант №1
      ((this.candlesForFractal[0].open > this.candlesForFractal[0].close && // первая свеча - красная
        this.candlesForFractal[1].close >
          this.candlesForFractal[1].open) /*&& // вторая свеча - зеленая
      this.candlesForFractal[1].volume > this.candlesForFractal[3].volume*/ || // vol 2й зеленой > vol 4й красной
        // вариант №2: свеча до фрактала - красная
        this.candlesForFractal[1].open > this.candlesForFractal[1].close) && // вторая свеча КРАСНАЯ
      this.candlesForFractal[2].open > this.candlesForFractal[2].close && // свеча фрактала КРАСНАЯ
      // если нашли фрактал
      this.fractalBearish.isFractal &&
      //this.fractalBodyLength > this.fractalShadowLength && // если тело фрактала больше тени фрактала
      this.candlesForFractal[3].open > this.candlesForFractal[3].close // и после него КРАСНАЯ свеча
      //(this.upperShadowRed >= this.lowerShadowRed || this.diffShadowRed < 0.6) // у которого верхняя тень равна либо больше по длине нижней тени
    ) {
      if (!this.sygnalSent) {
        this.whitchSignal = this.nameStrategy + ': свеча фрактала КРАСНАЯ'
        this.middleShadow =
          (this.candlesForFractal[2].open + this.candlesForFractal[2].high) / 2 // середина верхней тени фрактала
        this.openShortCommon()
      }
    }
    return this
  }

  // три первых свечи - ЗЕЛЕНЫЕ
  findSygnal4() {
    if (
      // три первых свечи - ЗЕЛЕНЫЕ
      this.candlesForFractal[0].close > this.candlesForFractal[0].open && // первая свеча ЗЕЛЕНАЯ
      this.candlesForFractal[1].close > this.candlesForFractal[1].open && // вторая свеча ЗЕЛЕНАЯ
      this.candlesForFractal[2].close > this.candlesForFractal[2].open && // свеча фрактала ЗЕЛЕНАЯ
      // объемы растут (каждая зелёная больше объёмом)
      // this.candlesForFractal[0].volume < this.candlesForFractal[1].volume &&
      // this.candlesForFractal[1].volume < this.candlesForFractal[2].volume / 2 &&
      this.fractalBodyLength > 1.2 / 100 && // тело 3 свечи > 1,2%
      this.bodyLength2g < this.fractalBodyLength / 2 // вся ДЛИНА 2й зеленой более чем в 2 раза меньше ТЕЛА 3й
    ) {
      if (!this.sygnalSent) {
        this.whitchSignal = this.nameStrategy + ': 3 зеленых'
        this.middleShadow = this.candlesForFractal[2].close
        // this.middleShadow =
        //   (this.candlesForFractal[3].open + this.candlesForFractal[3].high) / 2 // середина верхней тени красной свечи
        this.openShortCommon()
      }
    }

    return this
  }

  // функция openShortCommon с общими полями для входа в сделку
  openShortCommon() {
    // this.fractalHigh = this.fractalBearish.high
    this.sygnalSent = true
    this.canShort = true
    //this.openShort = this.candlesForFractal[3].open
    //this.middleShadow = (this.candlesForFractal[3].open + this.candlesForFractal[3].high) / 2 // середина верхней тени
    this.openShort = this.middleShadow
    this.sygnalTime = this.candlesForFractal[2].startTime // ВАЖНО УЧИТЫВАТЬ НА КОЛ-ВО СВЕЧЕЙ В ЗАПРОСЕ С БИРЖИ

    if (
      this.fractalBodyLength >= 1.2 / 100 &&
      this.fractalBodyLength < 2 / 100
    ) {
      this.takeProfitConst = 0.01
      this.stopLossConst = 0.01
    } else if (
      this.fractalBodyLength >= 2 / 100 &&
      this.fractalBodyLength < 3 / 100
    ) {
      this.takeProfitConst = 0.02
      this.stopLossConst = 0.02
    } else if (this.fractalBodyLength >= 3 / 100) {
      this.takeProfitConst = 0.03
      this.stopLossConst = 0.02
    }

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

    /*
    const message = `---=== НОВЫЙ СИГНАЛ ===---\n${
      this.whitchSignal
    }\nМонета: ${this.symbol}\n\nНЕ подтвержденный ${
      this.fractalBearish.nameFracralRus
    }\nДата: ${this.fractalBearish.timeH}\nHigh: ${
      this.fractalBearish.high
    }\n\nЦена для входа в SHORT: ${this.openShort}\n\nКол-во монет: ${
      this.amountOfPosition
    }\nВзяли ${this.partOfDeposit * 100}% c плечом ${
      this.multiplier
    }x от депозита = ${this.deposit} USDT\n\nПоставь:\nTake Profit: ${
      this.takeProfit
    } (${this.takeProfitConst * 100}%)\nStop Loss: ${this.stopLoss} (${
      this.stopLossConst * 100
    }%)\n\nЖдем цену на рынке для входа в SHORT...`
    */

    const message42small = `❗ НОВЫЙ СИГНАЛ ❗\n${
      this.whitchSignal
    }\n🪙 монета: ${this.symbol}\n\nЦена для входа в SHORT: ${
      this.openShort
    }\n\nTake Profit: ${this.takeProfit} (${
      this.takeProfitConst * 100
    }%)\nStop Loss: ${this.stopLoss} (${this.stopLossConst * 100}%)`

    sendInfoToUser(message42small)
    return this
  } // openShortCommon()

  canShortPosition(lastCandle, interval, apiOptions) {
    if (this.canShort) {
      if (lastCandle.interval == interval) {
        if (lastCandle.close > this.openShort) {
          this.canShort = false
          this.inPosition = true
          this.position = 'SHORT'
          //this.positionTime = lastCandle.startTime
          this.positionTime = new Date().getTime()

          const message = `${this.whitchSignal}\n\nМонета: ${
            this.symbol
          }\n\n--== Вошли в ${this.position} ==--\nпо цене: ${
            this.openShort
          } USDT\nТекущая close цена: ${
            lastCandle.close
          } USD\n\nВремя сигнала: ${timestampToDateHuman(
            this.sygnalTime
          )}\nВремя входа: ${timestampToDateHuman(
            this.positionTime
          )}\n\nЖдем цену на рынке для выхода из сделки...`
          // sendInfoToUser(message)

          //if (!this.inOneDeal.inDeal412) {
          // this.openDeal(apiOptions) // вход в сделку
          //}
        }
      }
    }
    return this
  } // canShortPosition(lastCandle, interval)

  findBrokenFractal(lastCandle) {
    if (this.canShort) {
      if (lastCandle.close > this.fractalHigh) {
        const message = `${this.whitchSignal}\n\nМонета: ${
          this.symbol
        }\n\n--== Сломали фрактал ==--\nТекущая цена: ${
          lastCandle.close
        } USDT \nУровень фрактала: ${
          this.fractalHigh
        } USDT\n--== ОТМЕНА сигнала ==--\nВремя сигнала: ${timestampToDateHuman(
          this.sygnalTime
        )}`
        //sendInfoToUser(message)
        this.reset()
      }
    }

    if (this.inPosition && !this.aboutBrokenFractal) {
      if (lastCandle.close > this.fractalHigh) {
        const message = `${this.whitchSignal}\n\nМонета: ${this.symbol}\n\n--== Сломали фрактал ==--\nТекущая цена: ${lastCandle.close} USDT \nУровень фрактала: ${this.fractalHigh} USDT\n\n--== Переноси Take Profit в БУ ==--\nTake Profit = ${this.openShort}`
        //sendInfoToUser(message)
        this.aboutBrokenFractal = true
        this.changeTPSLCommon(lastCandle)
      }
    }
    return this
  }

  ///////////////////////
  //// закрытие шорт позиции по Take Profit или Stop Loss
  closeShortPosition(lastCandle, interval, apiOptions) {
    if (this.inPosition) {
      // условия выхода из сделки по TP
      if (lastCandle.interval == interval) {
        //if (lastCandle.low <= this.takeProfit) {
        if (lastCandle.close <= this.takeProfit) {
          //this.closeShort = lastCandle.low
          this.closeShort = this.takeProfit
          this.closeTime = new Date().getTime()

          this.profit = +(
            (this.openShort - this.closeShort) *
            this.amountOfPosition
          ).toFixed(2)

          this.percent = +((this.profit / this.deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

          this.inPosition = false

          // статистика
          this.countAllDeals++
          if (this.profit > 0) {
            this.countOfPositive++
          } else {
            this.countOfZero++
          }

          // отправка сообщения
          // console.log(`Close SHORT with takeProfit: ${this.closeShort}`)
          const message1 = `${this.whitchSignal}\n${timestampToDateHuman(
            this.closeTime
          )}\n\n🪙 Монета: ${this.symbol}\nТекущая close цена: ${
            lastCandle.close
          } USD\n\n✅ Close SHORT\nwith Take Profit: ${
            this.closeShort
          }\nПрибыль = ${this.profit} USDT (${this.percent}% от депозита)`

          // const message2 = `\n\nСтатистика по ${this.symbol}:\nВсего сделок: ${this.countAllDeals}, среди которых:\nПоложительных: ${this.countOfPositive}\nОтрицательных: ${this.countOfNegative}\nНулевых: ${this.countOfZero}`

          // sendInfoToUser(message1 + message2)
          sendInfoToUser(message1)

          this.saveToMongoDB(interval)
          // this.closeDeal(apiOptions)
        } // условия выхода из сделки по TP

        // условия выхода из сделки по SL
        else if (lastCandle.close >= this.stopLoss) {
          //this.closeShort = lastCandle.high
          this.closeShort = this.stopLoss
          this.closeTime = new Date().getTime()

          this.profit = +(
            (this.openShort - this.closeShort) *
            this.amountOfPosition
          ).toFixed(2)

          this.percent = +((this.profit / this.deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

          this.inPosition = false

          // статистика
          this.countAllDeals++
          if (this.profit < 0) {
            this.countOfNegative++
          } else {
            this.countOfZero++
          }

          // отправка сообщения
          //console.log(`Close SHORT with stopLoss: ${this.closeShort}`)
          const message1 = `${this.whitchSignal}\n${timestampToDateHuman(
            this.closeTime
          )}\n\n🪙 Монета: ${this.symbol}\nТекущая close цена: ${
            lastCandle.close
          } USD\n\n❌ Close SHORT\nwith Stop Loss: ${
            this.closeShort
          }\nУбыток = ${this.profit} USDT (${this.percent}% от депозита)`

          // const message2 = `\n\nСтатистика по ${this.symbol}:\nВсего сделок: ${this.countAllDeals}, среди которых:\nПоложительных: ${this.countOfPositive}\nОтрицательных: ${this.countOfNegative}\nНулевых: ${this.countOfZero}`

          // sendInfoToUser(message1 + message2)
          sendInfoToUser(message1)

          this.saveToMongoDB(interval)
          // this.closeDeal(apiOptions)
        } // отработка выхода из сделки по SL
      } // if (lastCandle.interval == interval)
    } // if (this.inPosition)

    return this
  } // closeShortPosition(lastCandle, interval)

  // вход в сделку
  async openDeal(apiOptions) {
    const result = await getPositionAmount(apiOptions)
    if (result?.countOfPosition < apiOptions.countOfPosition) {
      this.enterOrderResult = await submittingEnterOrder(
        apiOptions,
        this.symbol,
        'SELL'
      )
      if (this.enterOrderResult?.origQty > 0) {
        const summEnterToDeal =
          this.enterOrderResult.origQty * this.enterOrderResult.lastPrice
        const message = `${this.whitchSignal}\n\nМонета: ${this.symbol}\n--== Шортанул ${this.enterOrderResult.origQty} монет ==--\nпо цене: ${this.enterOrderResult.lastPrice}\nЗадействовано: ${summEnterToDeal} USD`
        sendInfoToUser(message)
        //this.inOneDeal.enterToDeal412() // фиксируем что мы в сделке
      } else {
        // console.log(`недостаточно средств для входа в сделку. Куплено: ${this.enterOrderResult.origQty} монет`)
      }
    }
    return this
  }

  // выход из сделки
  async closeDeal(apiOptions) {
    if (this.enterOrderResult?.origQty > 0) {
      this.closeOrderResult = await submittingCloseOrder(
        apiOptions,
        this.symbol,
        'BUY',
        this.enterOrderResult
      )
    }

    if (this.closeOrderResult?.origQty > 0) {
      // временный расчет прибыли. По хорошему: надо сохранять фактические цены входа и выхода
      const profit = +(
        (this.enterOrderResult.lastPrice - this.closeOrderResult.lastPrice) *
        this.closeOrderResult.origQty
      ) // / optionsOfTrade.multiplier
        .toFixed(2)

      const message = `${this.whitchSignal}\n\nМонета: ${this.symbol}\n--== Откупил ${this.closeOrderResult.origQty} монет ==--\nпо цене: ${this.closeOrderResult.lastPrice}\nИтог: ${profit} USD`
      sendInfoToUser(message)

      //const checking = `enterOrderResult.lastPrice = ${this.enterOrderResult.lastPrice} USD\nenterOrderResult.origQty = ${this.enterOrderResult.origQty} шт\ncloseOrderResult.lastPrice = ${this.closeOrderResult.lastPrice} USD\ncloseOrderResult.origQty = ${this.closeOrderResult.origQty} шт\nmultiplier = ${optionsOfTrade.multiplier}x`
      //console.log(checking)

      //console.log('enterOrderResult после сделки: ', this.enterOrderResult)
      //this.inOneDeal.reset412() // фиксируем что мы вышли из сделки
      this.reset() // если вышли из сделки, то обнуляем состояние сделки
    }
    return this
  }

  // сохраняем в БД
  saveToMongoDB(interval) {
    // const deal = new Deal({
    const deal = {
      symbol: this.symbol,
      interval: interval,
      strategy: name,
      sygnal: this.whitchSignal,
      description: 'тело 3 свечи > 1,2%',

      sidePosition: this.position, // Long, Short
      deposit: this.deposit,

      openDealTime: this.positionTime,
      openDealTimeHuman: timestampToDateHuman(this.positionTime),
      openDealPrice: this.openShort,
      takeProfit: this.takeProfit,
      stopLoss: +this.stopLoss.toFixed(8),

      closeDealTime: this.closeTime,
      closeDealTimeHuman: timestampToDateHuman(this.closeTime),
      closeDealPrice: +this.closeShort.toFixed(8),
      profit: this.profit,
      percent: this.percent,
    }

    mongoDBadd('deals42', deal)
    mongoDBadd('allDeals', deal)
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
        //sendInfoToUser(message)
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
        //sendInfoToUser(message)
        //this.inOneDeal.reset412() // фиксируем что мы можем заходить в следующую сделку
      }
    }
    //} // if (lastCandle.startTime >= this.startTime + shiftTime)
    return this
  }
  //// условия переноса Take Profit или Stop Loss
  changeTPSL(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      /*
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
      */

      // 06.12.2022  Sl TP передвигаем после закрытия свечи открытия
      if (lastCandle.startTime == this.sygnalTime) {
        // перенос стопа или тейка после закрытия свечи открытия
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }

      // 27.10.2022
      // (1) Если свеча открытия зеленая, тогда перенос после закрытия свечи входа в позицию
      /*
      if (
        lastCandle.startTime == this.sygnalTime &&
        lastCandle.close > lastCandle.open
      ) {
        // перенос стопа или тейка после закрытия свечи открытия
        this.openCandleIsGreen = true
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }

      // (2) иначе перенос TPSL после закрытия 3й свечи
      if (
        lastCandle.startTime == this.sygnalTime + this.shiftTime * 2 &&
        !this.openCandleIsGreen
      ) {
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }
      */
      // 03.10.2022
      // (1) Если свеча открытия зеленая и следующая свеча зеленая, то TP переносится БУ
      /*
      if (
        lastCandle.startTime == this.sygnalTime &&
        lastCandle.close > lastCandle.open
      ) {
        this.openCandleIsGreen = true
      }
      if (
        lastCandle.startTime == this.sygnalTime + this.shiftTime &&
        lastCandle.close > lastCandle.open && // следующая свеча зеленая
        this.openCandleIsGreen // свеча открытия зеленая
      ) {
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }

      // (2) В остальных случая стоп тейк переносится в БУ после 5й свечи
      if (lastCandle.startTime == this.sygnalTime + this.shiftTime * 4) {
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }
      */
    }
    return this
  }

  changeTPSLOnMarket(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      // при достижении профита 0.6% стоп переносим в б.у.
      if (lastCandle.close < this.openShort * (1 - 0.006)) {
        if (!this.changedSL) {
          // изменение SL: если мы в прибыли
          this.stopLoss = this.openShort * (1 - 0.001)
          this.changedSL = true
          /*
          sendInfoToUser(
            `${this.whitchSignal}\nМонета: ${
              this.symbol
            }\n\nВремя появления сигнала:\n${timestampToDateHuman(
              this.sygnalTime
            )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
              this.positionTime
            )}\n\n--= Мы в вариативной прибыли > 0.8% ==--\nМеняем Stop Loss на (точку входа - 0.1%): ${
              this.stopLoss
            }`
          )
          */
          //this.inOneDeal.reset412() // фиксируем что мы можем заходить в следующую сделку
        } // if (!this.changedSL)
      } // if (lastCandle.close < this.openShort * (1-0.008))

      // Если от точки входа -0.5% тейк переносится в БУ
      if (lastCandle.close > this.openShort * (1 + 0.005)) {
        if (!this.changedTP) {
          // this.takeProfit = this.openShort * (1 - 0.001)
          // this.changedTP = true
          /*
          sendInfoToUser(
            `${this.whitchSignal}\nМонета: ${
              this.symbol
            }\n\nВремя появления сигнала:\n${timestampToDateHuman(
              this.sygnalTime
            )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
              this.positionTime
            )}\n\n--== Мы в вариативной просадке -0.5% ==--\nМеняем Take Profit на (точку входа - 0.1%): ${
              this.takeProfit
            }`
          )
          */
        } // if (!this.changedTP)
      } // if (lastCandle.close > this.openShort * (1 + 0.005))
    } // if (lastCandle.interval == interval)
    return this
  } // changeTPSLOnMarket()

  /*
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
  */
}
module.exports = An42Trade
