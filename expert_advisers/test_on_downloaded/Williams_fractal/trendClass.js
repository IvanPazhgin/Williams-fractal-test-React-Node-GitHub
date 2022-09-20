class Trend {
  constructor() {
    this.trendName = ''
    this.resetUpTrend()
    this.resetDownTrend()
  }
  resetUpTrend() {
    // информация по фракталу
    this.fractalUpTime = ''
    this.fractalUpPrice = 0

    // цена, которая пробила фрактал
    this.isUpTrend = false
    this.upPriceTime = ''
    this.upPriceTimeH = ''
    this.upPrice = 0
  }

  resetDownTrend() {
    this.fractalDownTime = ''
    this.fractalDownPrice = 0

    this.isDownTrend = false
    this.downPriceTime = ''
    this.downPriceTimeH = ''
    this.downPrice = 0
  }
}

module.exports = Trend
