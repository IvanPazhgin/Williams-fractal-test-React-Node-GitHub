const {
  sendInfo382ToUser,
} = require('../../../../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')

// function findSygnal(array, symbolObjFirstState) {
function findSygnal(array, symbolObj) {
  // для сигналов (общее)
  // let canShort = false // есть ли сигнал для входа в шорт или нет
  // let whitchSignal = '' // вносим в таблицу  номер сигнала

  // для сигнала №1
  let lengthUpShadow = 0 // длина верхней тени на красной свечи
  let lengthDownShadow = 0 // длина нижней тени на красной свечи
  let diffShadow = 0 // отношение верхней тени к нижней тени на красной свечи
  let candleBodyLength = 0 // вычисление длины тела свечи

  let diffShadowBigUser = 0.62 // Из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625

  // для сигнала №4
  let diffShadowSmallUser = 0.3 // Из примеров Алекса получилось: 0.11. ПРОТЕСТИРОВАТЬ на всём диапозоне

  // для сделки
  const stopLossConst = 0.02
  const takeProfitConst = 0.02
  // let amountOfPosition = 0 // для расчета объема входа в сделку
  // let deposit = 0
  // let inShortPosition = false
  //let symbolObj = {}
  const partOfDeposit = 0.25 // доля депозита на одну сделку
  const multiplier = 10 // плечо
  const highPriceLowPrice = 0.04 // отношение хая к лою менее 5%

  // проверка условий на вход
  // если входим, то inPosition = true
  for (let i = 2; i < array.length; i++) {
    if (!symbolObj.inPosition) {
      // сигнал №1
      lengthUpShadow = array[i].highPrice - array[i].openPrice
      lengthDownShadow = array[i].closePrice - array[i].lowPrice
      diffShadow = lengthUpShadow / lengthDownShadow

      // расчет тела свечи, 1000 - это просто коэффициент для удобства
      candleBodyLength = (array[i].openPrice / array[i].closePrice - 1) * 1000

      if (
        array[i - 2].closePrice > array[i - 2].openPrice && // 1 свеча зелёная
        array[i - 1].closePrice > array[i - 1].openPrice && // 2 свеча зелёная
        array[i].openPrice > array[i].closePrice && // 3 свеча красная
        diffShadow < Number(diffShadowBigUser) && // расчетный diff < пользовательского значения
        array[i].highPrice / array[i].lowPrice - 1 < highPriceLowPrice && // отношение хая к лою менее 5%
        candleBodyLength > 0.8 // взято из таблицы
      ) {
        symbolObj.canShort = true
        symbolObj.whitchSignal = 'сигнал №1'
        symbolObj.openShort = array[i].highPrice
        openShortCommon()
      }

      // сигнал №2
      if (
        array[i - 1].openPrice > array[i - 1].closePrice && // 1 свеча красная
        array[i].openPrice > array[i].closePrice && // 2 свеча красная
        diffShadow < Number(diffShadowBigUser) && // расчетный diff < пользовательского значения
        array[i].highPrice / array[i].lowPrice - 1 < highPriceLowPrice && // отношение хая к лою менее 5%
        candleBodyLength > 0.8 // взято из таблицы
      ) {
        symbolObj.canShort = true
        symbolObj.whitchSignal = 'сигнал №2'
        symbolObj.openShort = array[i].highPrice
        openShortCommon()
      }

      // входим в шорт - убрать в главную функцию
      if (symbolObj.canShort) {
        /*
        switch (symbolObj.whitchSignal) {
          case 'сигнал №1':
            // входим ниже array[i - 1].openPrice на дельту: coefficient = array[i].openPrice * (1 - delta / 100)
            //console.log('вход по сигналу №1')
            //console.log(`точка входа по цене сигнальной свечи, ее time: ${timestampToDateHuman(array[i - 1].openTime)}`) // !! проверка
            symbolObj.openShort = array[i].openPrice // вход по цене открытия красной [i-1]
            openShortCommon(array[i].openTime) // функция openShortCommon для входа в сделку с общими полями
            break
          case 'сигнал №3':
            //console.log('вход по сигналу №3')
            symbolObj.openShort = array[i].closePrice // вход по цене закрытия красной [i-1]
            openShortCommon(array[i].openTime) // функция openShortCommon для входа в сделку с общими полями
            break
          case 'сигнал №4':
            // проверка: если на текущей свече цена была выше array[i-1].closePrice (продумать отмену сигнала на след. свече для оповещений)

            // входим ниже array[i - 1].openPrice на дельту: coefficient = array[i].openPrice * (1 - delta / 100)

            // !!!  в реальном роботе проверить if (close price now < open price сигнальной свечи), то добавляем условие ниже. Главное, чтобы это условие и условие выше не мешали друг другу
            //console.log('вход по сигналу №4')
            //console.log(`array[i].highPrice = ${array[i].highPrice}, время: ${timestampToDateHuman(array[i].openTime)}`)
            //console.log(`array[i - 1].closePrice = ${array[i - 1].closePrice}, время: ${timestampToDateHuman(array[i - 1].openTime)}`)
            symbolObj.openShort = array[i].openPrice // вход по цене открытия красной [i-1]
            openShortCommon(array[i].openTime) // функция openShortCommon для входа в сделку с общими полями
            break

          default:
          // console.log('сигнала не было')
          // можно отправить сообщение в telegram bot для тестов на первое время
        } // switch (whitchSignal)
        */

        console.log(`Open SHORT по сигналу: ${symbolObj.whitchSignal}`)
        console.log('получили изменения в состоянии сделки внутри findSignal()')
        console.table(symbolObj)

        sendInfo382ToUser(
          `---=== НОВЫЙ СИГНАЛ ===---\n${symbolObj.nameStrategy}\nСработал: ${
            symbolObj.whitchSignal
          }\n\nМонета: ${symbolObj.symbol}\nЦена для входа в SHORT: ${
            symbolObj.openShort
          }\n\nВремя сигнальной свечи: ${timestampToDateHuman(
            array[i].openTime
          )}\nВремя сигнала: ${timestampToDateHuman(
            symbolObj.sygnalTime
          )}\n\nКол-во монет: ${symbolObj.amountOfPosition}\nВзяли ${
            partOfDeposit * 100
          }% c плечом ${multiplier}x от депозита = ${
            symbolObj.deposit
          } USDT\n\nПоставь:\nTake Profit: ${symbolObj.takeProfit} (${
            takeProfitConst * 100
          }%)\nStop Loss: ${symbolObj.stopLoss} (${
            stopLossConst * 100
          })%\n\nЖдем цену на рынке для входа в SHORT...`
        )
        //sendInfo382ToUser(JSON.stringify(symbolObj))
      } else {
        console.log(`Сигнала на вход не было. Ждем следующую свечу`)
        // sendInfo382ToUser(`Сигнала на вход не было. \nЖдем следующую свечу`)
      } // if (canShort)
    } // if (!inShortPosition)
  } // for (let i = 4; i < array.length; i++)

  // функция openShortCommon для входа в сделку с общими полями
  function openShortCommon() {
    symbolObj.sygnalTime = new Date().getTime()

    // вычисляем уровень take profit
    symbolObj.takeProfit = +(
      symbolObj.openShort *
      (1 - takeProfitConst)
    ).toFixed(5)

    // вычисляем уровень Stop Loss
    symbolObj.stopLoss = +(symbolObj.openShort * (1 + stopLossConst)).toFixed(5)

    // считаем объем сделки
    symbolObj.amountOfPosition = +(
      (symbolObj.deposit / symbolObj.openShort) *
      partOfDeposit *
      multiplier
    ).toFixed(8)
  }

  /*
  // для вызова внутри Switch
  function openShortCommon(OpenTime) {
    // правильнее будет -> в главном модуле: вставить после входа в сделку
    symbolObj.canShort = false
    symbolObj.inPosition = true
    symbolObj.positionTime = OpenTime
    //console.log(`входим time: ${timestampToDateHuman(array[i].openTime)}`) // !! проверка
    //symbolObj.indexOfPostion = i

    symbolObj.takeProfit = +(
      symbolObj.openShort *
      (1 - takeProfitConst)
    ).toFixed(5)
    symbolObj.stopLoss = +(symbolObj.openShort * (1 + stopLossConst)).toFixed(5)

    // считаем объем сделки
    symbolObj.amountOfPosition = +(
      (symbolObj.deposit / symbolObj.openShort) *
      partOfDeposit *
      multiplier
    ).toFixed(8)
  }
  */

  return symbolObj
}

module.exports = findSygnal
