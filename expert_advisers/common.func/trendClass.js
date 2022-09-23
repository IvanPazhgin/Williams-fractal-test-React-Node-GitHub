// для стратегии: фракталы Билла Вильямса
class Trend {
  constructor() {
    this.trendName = ''
    this.resetUpTrend()
    this.resetDownTrend()
  }
  resetUpTrend() {
    this.idUptrend = 0
    // информация по фракталу
    this.fractalUpTime = ''
    this.fractalUpPrice = 0

    // цена, которая пробила фрактал
    this.isUpTrend = false
    this.upPriceTime = ''
    this.upPriceTimeHuman = ''
    this.upPrice = 0
  }

  resetDownTrend() {
    this.idDownTrend = 0
    this.fractalDownTime = ''
    this.fractalDownPrice = 0

    this.isDownTrend = false
    this.downPriceTime = ''
    this.downPriceTimeHuman = ''
    this.downPrice = 0
  }
}

module.exports = Trend
