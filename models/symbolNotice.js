class SymbolObjNotice {
  constructor(symbol, nameStrategy) {
    this.symbol = symbol
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
    this.nameStrategy = nameStrategy
    this.shortCandleColorIsGreen = false
  }

  reset(symbol, nameStrategy) {
    return {
      symbol: this.symbol,
      canShort: false,
      inPosition: false,
      deposit: 10001,
      whitchSignal: '',
      openShort: 0,
      positionTime: 0,
      sygnalTime: 0,
      amountOfPosition: 0,
      takeProfit: 0,
      stopLoss: 0,
      changedTP: true,
      changedSL: false,
      closeShort: 0,
      closeTime: 0,
      profit: 0,
      percent: 0,
      nameStrategy: this.nameStrategy,
      shortCandleColorIsGreen: false,
    }
  }
}

module.exports = SymbolObjNotice
