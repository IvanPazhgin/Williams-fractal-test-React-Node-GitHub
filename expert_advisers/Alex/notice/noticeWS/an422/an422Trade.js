const submittingCloseOrder = require('../../../../../API/binance.engine/trade/submittingCloseOrder')
const submittingEnterOrder = require('../../../../../API/binance.engine/trade/submittingEnterOrder')
const getCandles = require('../../../../../API/binance.engine/usdm/getCandles.5param')
const { sendInfoToUser } = require('../../../../../API/telegram/telegram.bot')
const candlesToObject = require('../../../../common.func/candlesToObject')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')
const mongoDBadd = require('../../../../../API/mongoDB/mongoDBadd')
const { nameStr, entryAmountPercent } = require('./input_parameters')
const mongoDBfind = require('../../../../../API/mongoDB/mongoDBfind')
const updateCountPosition = require('../../../../../API/mongoDB/updPos')
const { apiOptions422 } = require('../../../../../config/api_options')

/*
в начале запуска приложения:
1. запрашиваем 4 свечи в файле Class и храним их
2. получаем нефинальную последнюю свечю и отправляем ее в файл Class

в call back: 
1. когда получили финальную свечку, запрашиваем 4 свечи в файле Class и храним их
2. получаем нефинальную последнюю свечю и отправляем ее в файл Class

пункты 1 и 2 прописать отдельными функциями в файле Class
*/

// 12.12.2022
// версия 4.2.2: 3 зеленых, 30 m

class An422Trade {
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

    this.candles = [] // свечи для поиска фрактала

    this.reset()
  }

  reset() {
    // для сигнала
    this.bodyLength3 = 0 // длина тела 3й зеленой свечи
    this.highShadow3 = 0 // длина верхней тени 3й зеленой свечи
    this.lowShadow3 = 0 // нижняя тень 3й зеленой свечи
    this.bodyLength1g = 0 // длина тела 1й зеленой свечи
    this.bodyLength2g = 0 // длина тела 2й зеленой свечи

    // для сделки
    // this.sygnalSent = false
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
    // this.openCandleIsGreen = false // свеча, на которой вошли в сделку, оказалась зеленой

    // для торговли
    this.enterOrderResult = {} // результат входа в сделку
    this.closeOrderResult = {} // результат выхода из сделки

    // для запроса свечек на бирже
    this.startTimeForNewRequest = 0
    this.endTimeForNewRequest = 0

    return this
  }

  // подготовка данных для поиска фрактала
  async prepair5Candles(interval) {
    const limitOfCandle = 4 // кол-во свечей для поиска сигнала
    const candles2 = await getCandles(
      this.symbol,
      interval,
      this.startTimeForNewRequest,
      this.endTimeForNewRequest,
      limitOfCandle
    ) // получаем первые n свечей
    this.candles = candlesToObject(candles2) // преобрзауем массив свечей в объект
    //console.table(this.candles)
    //console.log(`alex412: prepair5Candles(): прилетело ${this.candles.length} свечей`) // удалить
    return this
  } // async prepair5Candles(interval

  prepairDataforFindFractal(lastCandle) {
    // заменяем последнюю свечку по примеру кода Толи
    if (
      this.candles
        .map(({ startTime }) => startTime)
        .includes(lastCandle.startTime)
    ) {
      //console.log('время последних свечей совпадает') // закомментировать
      const delLastCandle = this.candles.pop() // для начала удаляем незавршенную свечку
      //console.log('убираем последнюю свечку')
      //console.table(delLastCandle)
      //console.log(`кол-во свечей после удаления последней = ${this.candles.length}`)
    } else {
      //console.log(`${this.symbol} время последних свечей НЕ совпадает`)
      const delFirstCandle = this.candles.shift() // удаляем первую свечку
      //console.log(`кол-во свечей после удаления первой = ${this.candles.length}`) // закомментировать

      // выводим проверки
      //console.table(this.candles)
      //console.table(lastCandle)
    }

    // далее добавляем последнюю свечку из WS
    this.candles = this.candles.concat(lastCandle)
    //console.table(this.candles)
    //console.log(`итого кол-во свечей = ${this.candles.length}`) // закомментировать

    return this
  } //prepairDataforFindFractal(lastCandle

  findTrueTimeInCandle(lastCandle) {
    // const shiftTimeForTest = 1000 * 60 * 5 // 5 мин
    if (!lastCandle.final) {
      this.endTimeForNewRequest = lastCandle.startTime - this.shiftTime
    } else this.endTimeForNewRequest = lastCandle.startTime
    this.startTimeForNewRequest = this.endTimeForNewRequest - 3 * this.shiftTime // берем 4 свечки
  }

  findSygnal(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      // для сигнала № 1 и 2
      this.bodyLength3 =
        this.candles.at(-1).close / this.candles.at(-1).open - 1
      this.highShadow3 =
        this.candles.at(-1).high / this.candles.at(-1).close - 1

      this.bodyLength2g = this.candles.at(-2).high / this.candles.at(-2).low - 1
      this.findSygnal1()
      this.findSygnal2()

      // для сигнала № 3
      // this.bodyLength3 = this.candles.at(-2).close / this.candles.at(-2).open - 1
      // this.highShadow3 = this.candles.at(-2).high / this.candles.at(-2).close - 1

      // this.bodyLength2g = this.candles.at(-3).high / this.candles.at(-3).low - 1
      // this.findSygnal3()

      return this
    }
  } // findSygnal(lastCandle, interval)

  // -- Сигнал №1 --
  // три первых свечи - ЗЕЛЕНЫЕ
  // если 3я зеленая (close - open) > 5%, то:

  // если верхняя тень длинная - то входим на середине верхней тени
  // если короткая - на цене закрытия

  // пояснение:
  // длиная тень - это если отношение тела к свечи менее 5 по значению (см. excel), то входим на середине верхней тени,
  // иначе входим по цене закрытия
  findSygnal1() {
    if (
      // три первых свечи - ЗЕЛЕНЫЕ
      this.candles.at(-3).close > this.candles.at(-3).open && // первая свеча ЗЕЛЕНАЯ
      this.candles.at(-2).close > this.candles.at(-2).open && // вторая свеча ЗЕЛЕНАЯ
      this.candles.at(-1).close > this.candles.at(-1).open && // третья свеча ЗЕЛЕНАЯ
      this.bodyLength3 >= 5 / 100 && // тело 3й свечи > 5%
      this.bodyLength2g < this.bodyLength3 / 2 // вся ДЛИНА 2й зеленой более чем в 2 раза меньше ТЕЛА 3й
    ) {
      if (this.bodyLength3 / this.highShadow3 < 5) {
        // если верхняя тень длинная - то входим на середине верхней тени. 5 - вернхняя тень длинная. 50 - верхняя тень короткая.
        this.middleShadow =
          (this.candles.at(-1).close + this.candles.at(-1).high) / 2
      } else {
        // если короткая - на цене закрытия
        this.middleShadow = this.candles.at(-1).close
      }
      this.whitchSignal = this.nameStrategy + ': 3d green > 5%'
      this.openShortCommon()
    }
    return this
  }

  //   -- Сигнал №2 --
  // 1.2% < (тело 3й свечи) < 5%
  // на 3й зеленой:
  // если (верхняя тень < нижней тени), то входим по цене закрытия зеленой свечи
  findSygnal2() {
    this.lowShadow3 = this.candles.at(-1).open / this.candles.at(-1).low - 1
    if (
      // три первых свечи - ЗЕЛЕНЫЕ
      this.candles.at(-3).close > this.candles.at(-3).open && // первая свеча ЗЕЛЕНАЯ
      this.candles.at(-2).close > this.candles.at(-2).open && // вторая свеча ЗЕЛЕНАЯ
      this.candles.at(-1).close > this.candles.at(-1).open && // третья свеча ЗЕЛЕНАЯ
      this.bodyLength3 >= 1.2 / 100 && // тело 3й свечи < 5%
      this.bodyLength3 < 5 / 100 && // тело 3й свечи < 5%
      this.bodyLength2g < this.bodyLength3 / 2 && // вся ДЛИНА 2й зеленой более чем в 2 раза меньше ТЕЛА 3й
      this.highShadow3 < this.lowShadow3 // верхняя тень < нижней тени
    ) {
      this.middleShadow = this.candles.at(-1).close
      // this.middleShadow = this.candles.at(-1).close * (1 - 0.001) // на 0.1% ниже
      this.whitchSignal = this.nameStrategy + ': 1.2% < 3d green < 5%'
      this.openShortCommon()
    }
    return this
  }

  //   -- Сигнал №3 --
  // 1.2% < (тело 3й свечи) < 5%
  // на 3й зеленой:
  // верхняя тень > нижней
  findSygnal3() {
    this.lowShadow3 = this.candles.at(-2).open / this.candles.at(-2).low - 1
    if (
      // три первых свечи - ЗЕЛЕНЫЕ
      this.candles.at(-4).close > this.candles.at(-4).open && // первая свеча ЗЕЛЕНАЯ
      this.candles.at(-3).close > this.candles.at(-3).open && // вторая свеча ЗЕЛЕНАЯ
      this.candles.at(-2).close > this.candles.at(-2).open && // третья свеча ЗЕЛЕНАЯ
      this.candles.at(-1).close < this.candles.at(-1).open && // четвертая свеча КРАСНАЯ
      this.bodyLength3 >= 1.2 / 100 && // тело 3й свечи < 5%
      this.bodyLength3 < 5 / 100 && // тело 3й свечи < 5%
      this.bodyLength2g < this.bodyLength3 / 2 && // вся ДЛИНА 2й зеленой более чем в 2 раза меньше ТЕЛА 3й
      this.highShadow3 > this.lowShadow3 // верхняя тень > нижней
    ) {
      this.middleShadow = this.candles.at(-1).open // входим после красной по цене ее открытия
      this.whitchSignal = this.nameStrategy + ': 3 green, 1 red'
      this.openShortCommon()
    }
    return this
  }

  // функция openShortCommon с общими полями для входа в сделку
  openShortCommon() {
    // this.sygnalSent = true
    this.canShort = true
    this.openShort = this.middleShadow
    this.sygnalTime = this.candles.at(-1).startTime // ВАЖНО УЧИТЫВАТЬ НА КОЛ-ВО СВЕЧЕЙ В ЗАПРОСЕ С БИРЖИ

    if (this.bodyLength3 >= 1.2 / 100 && this.bodyLength3 < 2 / 100) {
      this.takeProfitConst = 0.01
      this.stopLossConst = 0.01
    } else if (this.bodyLength3 >= 2 / 100 && this.bodyLength3 < 3 / 100) {
      this.takeProfitConst = 0.02
      this.stopLossConst = 0.02
    } else if (this.bodyLength3 >= 3 / 100) {
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

    const message42small = `❗ НОВЫЙ СИГНАЛ ❗\n${
      this.whitchSignal
    }\n🪙 монета: ${this.symbol}\n\nSHORT по: ${
      this.openShort
    }\n\nTake Profit: ${this.takeProfit} (${
      this.takeProfitConst * 100
    }%)\nStop Loss: ${this.stopLoss} (${this.stopLossConst * 100}%)`

    sendInfoToUser(message42small)
    return this
  } // openShortCommon()

  canShortPosition(lastCandle, interval, apiOptions = {}) {
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

          const messageShort = `${this.whitchSignal}\n\n🪙Монета: ${
            this.symbol
          }\n\n⬇ Вошли в SHORT\nпо цене: ${
            this.openShort
          } USDT\nТекущая close цена: ${
            lastCandle.close
          } USD\n\nВремя сигнала: ${timestampToDateHuman(
            this.sygnalTime
          )}\nВремя входа: ${timestampToDateHuman(this.positionTime)}`
          console.log(messageShort)

          // this.openDeal(apiOptions) // вход в сделку
          this.beforeOpenDeal() // вход в сделку
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
  closeShortPosition(lastCandle, interval, apiOptions = {}) {
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

          // this.closeDeal(apiOptions)
          this.beforeCloseDeal()
          this.saveToMongoDB(interval)

          const message42small = `${this.whitchSignal}\n🪙 Монета: ${this.symbol}\n\n✅ Close SHORT\nwith Take Profit: ${this.closeShort}\n\nПрибыль = ${this.profit} USDT (${this.percent}% от депозита)`
          sendInfoToUser(message42small) // отправка сообщения
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

          // this.closeDeal(apiOptions)
          this.beforeCloseDeal()
          this.saveToMongoDB(interval)

          const message42small = `${this.whitchSignal}\n🪙 Монета: ${this.symbol}\n\n❌ Close SHORT\nwith Stop Loss: ${this.closeShort}\n\nУбыток = ${this.profit} USDT (${this.percent}% от депозита)`
          sendInfoToUser(message42small) // отправка сообщения
        } // отработка выхода из сделки по SL
      } // if (lastCandle.interval == interval)
    } // if (this.inPosition)

    return this
  } // closeShortPosition(lastCandle, interval)

  async beforeOpenDeal() {
    // запрашиваем в БД кол-во открытых сделок по данной стратегии
    const usersInfo = await mongoDBfind('users')

    apiOptions422.forEach((traderAPI) => {
      this.openDeal(traderAPI, usersInfo)
    })
  }

  // вход в сделку
  async openDeal(apiOptions, usersInfo) {
    const inPosidion = usersInfo[0][apiOptions.name][nameStr].countOfPosition
    if (inPosidion === 0) {
      this.enterOrderResult = await submittingEnterOrder(
        apiOptions,
        this.symbol,
        'SELL',
        entryAmountPercent
      )
      if (this.enterOrderResult?.origQty > 0) {
        const summEnterToDeal =
          this.enterOrderResult.origQty * this.enterOrderResult.lastPrice
        const message = `${this.whitchSignal}\n\nМонета: ${this.symbol}\n--== ${apiOptions.name} шортанул ${this.enterOrderResult.origQty} монет ==--\nпо цене: ${this.enterOrderResult.lastPrice}\nЗадействовано: ${summEnterToDeal} USD`
        sendInfoToUser(message)

        // фиксируем что мы в сделке
        const currentPosition = usersInfo[0][apiOptions.name]
        currentPosition[nameStr].countOfPosition = 1
        currentPosition[nameStr].amountInPosition =
          this.enterOrderResult?.origQty

        const newValues = {
          $set: {
            [apiOptions.name]: currentPosition,
          },
        }
        updateCountPosition('users', newValues)
      } else {
        // console.log(`недостаточно средств для входа в сделку. Куплено: ${this.enterOrderResult.origQty} монет`)
      }
    }
    return this
  }

  async beforeCloseDeal() {
    // запрашиваем в БД кол-во открытых сделок по данной стратегии
    const usersInfo = await mongoDBfind('users')

    apiOptions422.forEach((traderAPI) => {
      this.closeDeal(traderAPI, usersInfo)
    })
  }

  // выход из сделки
  async closeDeal(apiOptions, usersInfo) {
    const inPosidion = usersInfo[0][apiOptions.name][nameStr].countOfPosition
    const amountInPosition =
      usersInfo[0][apiOptions.name][nameStr].amountInPosition
    if (amountInPosition > 0 && inPosidion === 1) {
      this.closeOrderResult = await submittingCloseOrder(
        apiOptions,
        this.symbol,
        'BUY',
        // this.enterOrderResult
        amountInPosition
      )
    }

    if (this.closeOrderResult?.origQty > 0) {
      // временный расчет прибыли. По хорошему: надо сохранять фактические цены входа и выхода
      const profit = +(
        (this.enterOrderResult.lastPrice - this.closeOrderResult.lastPrice) *
        this.closeOrderResult.origQty
      ) // / optionsOfTrade.multiplier
        .toFixed(2)

      const message = `${this.whitchSignal}\n\nМонета: ${this.symbol}\n--== ${apiOptions.name} откупил ${this.closeOrderResult.origQty} монет ==--\nпо цене: ${this.closeOrderResult.lastPrice}\nИтог: ${profit} USD`
      sendInfoToUser(message)

      // фиксируем что мы вышли из сделки
      const currentPosition = usersInfo[0][apiOptions.name]
      currentPosition[nameStr].countOfPosition = 0
      currentPosition[nameStr].amountInPosition = 0

      const newValues = {
        $set: {
          [apiOptions.name]: currentPosition,
        },
      }
      updateCountPosition('users', newValues)
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
      strategy: nameStr,
      sygnal: this.whitchSignal,
      description: this.whitchSignal,

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

    mongoDBadd(nameStr, deal)
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
module.exports = An422Trade
