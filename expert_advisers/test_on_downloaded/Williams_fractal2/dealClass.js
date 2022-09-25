class dealClass {
  constructor() {
    this.deposit = 1000

    this.depositReal = 1000 // накопленный результат

    this.reset()
  }

  reset() {
    //this.canShort = false

    //this.takeProfit = 0
    this.stopLoss = 0

    // для входа в сделку
    this.inPosition = false // вошли в сделку
    this.position = ''
    this.openPosition = 0
    this.openTime = ''
    this.openTimeHuman = ''
    this.amountOfPosition = 0

    // для выхода из сделки
    this.outPosition = false // закрыли сделку
    this.closePosition = 0
    this.closeTime = ''
    this.closeTimeHuman = ''
    this.profit = 0
    this.percent = 0

    // накопленный результат
    this.profitReal = 0
    this.percentReal = 0
    this.amountReal = 0

    // информация о фракталах
    this.lowFbull = 0 // fractal_Bullish.low
    this.lowFbullTime = '' // для проверок
    this.islowFbull = false

    this.highFBear = 0 // fractal_Bearish.high
    this.ishighFBear = false
  }
} // class dealClass

module.exports = dealClass
