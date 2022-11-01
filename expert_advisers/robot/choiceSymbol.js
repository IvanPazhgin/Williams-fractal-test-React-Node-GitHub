// условия для 4.1.2 по выбору монеты, в которую будем заходить
// класс - это абстракция, который может быть отдельным инстансом для каждой функции

class choiceSymbol {
  constructor() {
    // code
    this.reset412()
    this.reset414()
  }

  // стратегия 4.1.2
  reset412() {
    this.inDeal412 = false // фиксируем что мы вышли из сделки
  }

  enterToDeal412() {
    this.inDeal412 = true // фиксируем что мы в сделке
  }

  // стратегия 4.1.4
  reset414() {
    this.symbolsToEnterTheDeal = [] // монеты для входа в сделку
  }

  symbolAdd(symbol, openShort, bodyLength5g) {
    const temp = {
      symbol: symbol,
      openShort: openShort,
      bodyLength5g: bodyLength5g,
    }
    this.symbolsToEnterTheDeal.push(temp)
  }

  symbolSelection() {
    this.symbolsToEnterTheDeal.sort((a, b) => a.bodyLength5g - b.bodyLength5g)
    const symbolToShort =
      this.symbolsToEnterTheDeal[this.symbolsToEnterTheDeal.length - 1].symbol
    console.log(`\n--= Trade 4.1.4 ==-- список для входа в шорт`)
    console.table(this.symbolsToEnterTheDeal)
    const message = `Шортим ${symbolToShort}`
    return symbolToShort
  }
}

module.exports = choiceSymbol
