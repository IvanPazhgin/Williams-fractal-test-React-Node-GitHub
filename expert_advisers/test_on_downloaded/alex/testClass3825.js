const timestampToDateHuman = require('../../common.func/timestampToDateHuman')

class TestClass3825 {
  constructor(options) {
    this.symbol = options.symbol
    this.nameStrategy = options.nameStrategy

    this.diffShadowBigUser = options.diffShadowBigUser // Из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625
    this.takeProfitConst = options.takeProfitConst
    this.stopLossConst = options.stopLossConst
    this.delta = options.delta // вход на XX% выше хая сигнальной свечи

    this.partOfDeposit = 0.25 // доля депозита на одну сделку
    this.multiplier = 10 // плечо

    this.reset()
  }

  reset() {
    // для сделки
    this.canShort = false
    this.inPosition = false
    this.deposit = 1000
    this.whitchSignal = ''
    this.sygnalTime = 0

    this.openShort = 0
    this.positionTime = 0
    this.indexOfPositionTime = 0 // timestamp точки входа на 1m

    this.closeShort = 0
    this.closeTime = 0
    this.profit = 0
    this.percent = 0

    this.amountOfPosition = 0
    this.takeProfit = 0
    this.stopLoss = 0

    this.changedTP = false
    this.changedSL = false
    this.dateChangeTP = 0
    this.dateChangeSL = 0

    // для сигналов
    this.lengthUpShadow = 0 // длина верхней тени на красной свечи
    this.lengthDownShadow = 0 // длина нижней тени на красной свечи
    this.diffShadow = 0 // отношение верхней тени к нижней тени на красной свечи
    this.candleBodyLength = 0 // вычисление длины тела свечи
    this.shadow1g = 0 // процент изменения верхней тени 1й зеленой свечи
    this.shadow2g = 0 // процент изменения верхней тени 2й зеленой свечи

    return this
  }

  // поиск сигнала
  findSygnal(array, array1m) {
    // arraySenior
    let deals = [] // сделка
    for (let i = 4; i < array.length; i++) {
      // ищем точку входа
      if (!this.inPosition) {
        // сигнал №1
        if (
          array[i - 3].close > array[i - 3].open && // 1 свеча зелёная
          array[i - 2].close > array[i - 2].open && // 2 свеча зелёная
          array[i - 1].open > array[i - 1].close // 3 свеча красная
          //array[i - 1].volume > array[i - 2].volume // объем 3й красной больше объема 2й зеленой
          // array[i - 1].close > array[i - 2].open // цена закрытия 3й красной выше цены открытия 2й зеленой
        ) {
          // расчет соотношения верхней тени к нижней тени на 3й красной свече
          this.lengthUpShadow = array[i - 1].high - array[i - 1].open
          this.lengthDownShadow = array[i - 1].close - array[i - 1].low
          this.diffShadow = this.lengthUpShadow / this.lengthDownShadow

          // расчет тела 3й красной свечи, 1000 - это просто коэффициент для удобства
          this.candleBodyLength =
            (array[i - 1].open / array[i - 1].close - 1) * 1000

          this.shadow1g = array[i - 3].high / array[i - 3].close - 1 // процент роста верхней тени 1й зеленой свечи
          this.shadow2g = array[i - 2].high / array[i - 2].close - 1 // процент роста верхней тени 2й зеленой свечи
          if (
            this.diffShadow < this.diffShadowBigUser && // расчетный diff < пользовательского значения
            this.candleBodyLength > 0.8 && // взято из таблицы
            this.shadow1g > this.shadow2g // % тени 1й зеленой больше % тени второй зеленой
          ) {
            this.canShort = true
            this.whitchSignal = this.nameStrategy + ': сигнал №1'
            this.openShort = array[i - 1].high * this.delta
            this.sygnalTime = array[i].startTime
            //this.openShortCommon(array[i - 1].startTime, array[i-1].endTime)
            this.canShortPosition(array[i].startTime, array[i].endTime, array1m)
          } // блок проверок условий 2го уровня
        } // блок проверок условий 1го уровня

        // сигнал №2
        if (
          array[i - 4].close > array[i - 4].open && // 1 свеча зелёная
          array[i - 3].close > array[i - 3].open && // 2 свеча зелёная
          array[i - 2].open > array[i - 2].close && // 3 свеча красная
          array[i - 1].open > array[i - 1].close // 4 свеча красная
          //array[i - 2].volume > array[i - 3].volume // объем 3й красной больше объёма 2й зеленой
          //array[i - 2].close > array[i - 3].open && // цена закрытия 3й красной выше цены открытия 2й зеленой
          //array[i - 1].low > array[i - 4].low // лой последней красной выше лоя первой зеленой
        ) {
          // расчет соотношения верхней тени к нижней тени на 4й красной свече
          this.lengthUpShadow = array[i - 1].high - array[i - 1].open
          this.lengthDownShadow = array[i - 1].close - array[i - 1].low
          this.diffShadow = this.lengthUpShadow / this.lengthDownShadow

          // расчет тела 3й красной свечи, 1000 - это просто коэффициент для удобства
          this.candleBodyLength =
            (array[i - 1].open / array[i - 1].close - 1) * 1000

          if (
            this.diffShadow < this.diffShadowBigUser && // расчетный diff < пользовательского значения
            this.candleBodyLength > 0.8 // взято из таблицы
          ) {
            this.canShort = true
            this.whitchSignal = this.nameStrategy + ': сигнал №2'
            this.openShort = array[i - 1].high * this.delta
            this.sygnalTime = array[i].startTime
            //this.openShortCommon(array[i - 1].startTime, array[i-1].endTime)
            this.canShortPosition(array[i].startTime, array[i].endTime, array1m)
          } // блок проверок условий 2го уровня
        } // блок проверок условий 1го уровня

        // отправляем сообщение в tg о найденном сигнале
        /*
        if (this.canShort) {
          console.log(
            `${this.symbol}: Нашли сигнал для Open SHORT: ${this.whitchSignal}`
          )
        } // if (canShort)
        */
      } // if (!inShortPosition)

      // ищем точку выхода
      if (this.inPosition) {
        // сперва переносим TP SL на 2h
        if (this.openShort < array[i].close) {
          // изменение TP: если мы в просадке
          if (!this.changedTP) {
            this.takeProfit = this.openShort
            this.changedTP = true
            this.dateChangeTP = array[i].startTime
          }
        } else {
          // изменение SL: если мы в прибыли
          if (!this.changedSL) {
            this.stopLoss = this.openShort
            this.dateChangeSL = array[i].startTime
            this.changedSL = true
          }
        } // перенос TP SL на 2h

        // далее ищем точку выхода на 1m
        this.closeShortPosition(array1m)
        deals = deals.concat(this.saveDeal())
        this.reset()
      } // if (this.inPosition)
    } // for (let i = 4; i < array.length; i++)
    // return this
    //console.table(deals)
    return deals
  }

  //// поиск точки входа в шорт на 1m
  canShortPosition(arrayStartTime, arrayEndTime, array1m) {
    if (this.canShort) {
      // const array1mStartTime = array1m.find((idInArray1m) => idInArray1m.startTime == arrayStartTime).startTime
      // const array1mEndTime = array1m.find((idInArray1m) => idInArray1m.startTime === arrayEndTime + 1).startTime

      // находим id необходимых 1m свечек для поиска точного места входа в сделку
      let id1mStartTime = 0
      let id1mEndTime = 0
      for (let i = 0; i < array1m.length; i++) {
        if (array1m[i].startTime == arrayStartTime) {
          id1mStartTime = i
        }
        if (array1m[i].startTime == arrayEndTime + 1) {
          id1mEndTime = i
          break
        }
      }

      // поиск точки входа в шорт на 1m
      for (let j = id1mStartTime; j < id1mEndTime; j++) {
        if (array1m[j].high > this.openShort) {
          this.canShort = false
          this.inPosition = true
          this.positionTime = array1m[j].startTime
          this.indexOfPositionTime = j // сохраняем index of timestamp точки входа для дальнейшего поиска точки выхода. Начать поиск с [j + 1]

          // перенёс сюда функционл из openShortCommon(arrayOpenTime) {}
          // вычисляем уровень take profit
          this.takeProfit = +(
            this.openShort *
            (1 - this.takeProfitConst)
          ).toFixed(5)

          // вычисляем уровень Stop Loss
          this.stopLoss = +(this.openShort * (1 + this.stopLossConst)).toFixed(
            5
          )

          // считаем объем сделки
          this.amountOfPosition = +(
            (this.deposit / this.openShort) *
            this.partOfDeposit *
            this.multiplier
          ).toFixed(8)

          break
        }
      }
    } // if (this.canShort)
    // this.reset() // удалить
    return this
  } // canShortPosition(arrayStartTime, arrayEndTime)

  // функция openShortCommon с общими полями для входа в сделку
  // openShortCommon(arrayOpenTime) {}

  //// закрытие шорт позиции по Take Profit или Stop Loss на 1m
  closeShortPosition(array1m) {
    for (let j = this.indexOfPositionTime + 1; j < array1m.length; j++) {
      // условия выхода из сделки по TP
      if (array1m[j].low <= this.takeProfit) {
        this.closeShort = this.takeProfit
        this.closeTime = array1m[j].startTime

        this.profit = +(
          (this.openShort - this.closeShort) *
          this.amountOfPosition
        ).toFixed(2)

        this.percent = +((this.profit / this.deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

        // сохранить
        return this

        this.reset()
        break
      } // условия выхода из сделки по TP
      // условия выхода из сделки по SL
      else if (array1m[j].high >= this.stopLoss) {
        this.closeShort = this.stopLoss
        this.closeTime = array1m[j].startTime

        this.profit = +(
          (this.openShort - this.closeShort) *
          this.amountOfPosition
        ).toFixed(2)

        this.percent = +((this.profit / this.deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

        return this

        this.reset()
        break
      } // условия выхода из сделки по SL
    } // for (let j = this.indexOfPositionTime; j < array1m.length; j++)
  }

  saveDeal() {
    this.dateChangeTP =
      this.dateChangeTP == 0
        ? (this.dateChangeTP = '')
        : timestampToDateHuman(this.dateChangeTP)

    this.dateChangeSL =
      this.dateChangeSL == 0
        ? (this.dateChangeSL = '')
        : timestampToDateHuman(this.dateChangeSL)

    const deal = {
      // константы
      takeProfitConst: this.takeProfitConst,
      stopLossConst: this.stopLossConst,
      delta: this.delta,
      // вход в сделку
      sygnalTime: timestampToDateHuman(this.sygnalTime),
      openShort: this.openShort,
      positionTime: timestampToDateHuman(this.positionTime),
      takeProfit: this.takeProfit,
      stopLoss: this.stopLoss,
      // перенос TP SL
      dateChangeTP: this.dateChangeTP,
      dateChangeSL: this.dateChangeSL,
      // выход из сделки
      closeShort: this.closeShort,
      closeTime: timestampToDateHuman(this.closeTime),
      profit: this.profit,
      percent: this.percent,
    }
    return deal
  }
}

module.exports = TestClass3825
