const { sendInfoToUser } = require('./telegram.bot')
const timestampToDateHuman = require('./timestampToDateHuman')

// function findSygnal(array, symbolObjFirstState) {
function findSygnal(array, symbolObj) {
  // для сигналов (общее)
  let canShort = false // есть ли сигнал для входа в шорт или нет
  let whitchSignal = '' // вносим в таблицу  номер сигнала

  // для сигнала №1
  let lengthUpShadow = 0 // длина верхней тени на красной свечи
  let lengthDownShadow = 0 // длина нижней тени на красной свечи
  let diffShadow = 0 // отношение верхней тени к нижней тени на красной свечи
  let diffShadowBigUser = 0.3 // Из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625

  // для сигнала №2
  let lengthOfRed = 0 // Длина тела красной свечи
  let lengthOfGreen = 0 // Длина тела зеленойсвечи

  // для сигнала №3
  let diffShadowSmallUser = 0.3 // Из примеров Алекса получилось: 0.11. ПРОТЕСТИРОВАТЬ на всём диапозоне

  // для сделки
  const stopLossConst = 0.02
  const takeProfitConst = 0.04
  // let amountOfPosition = 0 // для расчета объема входа в сделку
  // let deposit = 0
  // let inShortPosition = false
  //let symbolObj = {}
  const partOfDeposit = 0.25 // доля депозита на одну сделку
  const multiplier = 10 // плечо

  // проверка условий на вход
  // если входим, то inPosition = true
  for (let i = 3; i < array.length; i++) {
    if (!symbolObj.inPosition) {
      // сигнал №1
      lengthUpShadow = array[i].highPrice - array[i].openPrice
      lengthDownShadow = array[i].closePrice - array[i].lowPrice
      diffShadow = lengthUpShadow / lengthDownShadow
      if (
        array[i - 3].closePrice > array[i - 3].openPrice && // 1 свеча зеленая
        array[i - 2].closePrice > array[i - 2].openPrice && // 2 свеча зелёная
        array[i - 1].closePrice > array[i - 1].openPrice && // 3 свеча зелёная
        array[i].openPrice > array[i].closePrice && // 4 свеча красная
        diffShadow < Number(diffShadowBigUser) // расчетный diff < пользовательского значения
      ) {
        symbolObj.canShort = true
        symbolObj.whitchSignal = 'сигнал №1'
      }

      // сигнал №2
      lengthOfGreen = array[i - 1].closePrice - array[i - 1].openPrice
      lengthOfRed = array[i].openPrice - array[i].closePrice
      if (
        array[i - 1].closePrice > array[i - 1].openPrice && // 3 свеча зелёная
        array[i].openPrice > array[i].closePrice && // 4 свеча красная
        diffShadow < Number(diffShadowBigUser) && // расчетный diff < пользовательского значения
        lengthOfRed < lengthOfGreen // тело красной меньше тела зеленой
      ) {
        symbolObj.canShort = true
        symbolObj.whitchSignal = 'сигнал №2'
      }

      // сигнал №3
      // на красной верхняя тень сильно меньше нижней тени. Низкий коэффициент. Задает пользователь
      if (
        array[i].openPrice > array[i].closePrice && // 4 свеча красная
        diffShadow < Number(diffShadowSmallUser) // расчетный diff < пользовательского значения
      ) {
        symbolObj.canShort = true
        symbolObj.whitchSignal = 'сигнал №3'
      }

      // входим в шорт - убрать в главную функцию
      if (symbolObj.canShort) {
        symbolObj.openShort = array[i].closePrice // запоминаем точку входа по цене закрытия красной [i] свечи
        // остальное -> в главном модуле: вставить после входа в сделку
        symbolObj.canShort = false // !!!!
        symbolObj.inPosition = true // !!!!
        symbolObj.positionTime = array[i].openTime // !!!!
        symbolObj.takeProfit = symbolObj.openShort * (1 - takeProfitConst)
        symbolObj.stopLoss = symbolObj.openShort * (1 + stopLossConst)
        // symbolObj.symbol = symbolObjFirstState.symbol

        // symbolObj.whitchSignal = whitchSignal

        // считаем объем сделки
        symbolObj.amountOfPosition = +(
          (symbolObj.deposit / symbolObj.openShort) *
          //(symbolObjFirstState.deposit / symbolObj.openShort) *
          partOfDeposit *
          multiplier
        ).toFixed(8)

        //console.log(`Open SHORT по сигналу: ${symbolObj.whitchSignal}`)
        sendInfoToUser(
          `--== НОВЫЙ СИГНАЛ ==--\nСтратегия №3: Без теневая RC 5\nСработал: ${
            symbolObj.whitchSignal
          }\n\nМонета: ${symbolObj.symbol}\nOpen SHORT: ${
            symbolObj.openShort
          }\nВремя сигнала: ${timestampToDateHuman(
            symbolObj.positionTime
          )}\nКол-во монет: ${symbolObj.amountOfPosition}\nВзяли ${
            partOfDeposit * 100
          }% c плечом ${multiplier}x от депозита = ${
            symbolObj.deposit
          } USDT\n\nПоставь:\nTake Profit: ${
            symbolObj.takeProfit
          }\nStop Loss: ${symbolObj.stopLoss}`
        )
        //sendInfoToUser(JSON.stringify(symbolObj))
      } else {
        console.log(`Сигнала на вход не было. Ждем следующую свечу`)
        sendInfoToUser(`Сигнала на вход не было. \nЖдем следующую свечу`)
      } // if (canShort)
    } // if (!inShortPosition)
  } // for (let i = 4; i < array.length; i++)

  return symbolObj
}

module.exports = findSygnal
