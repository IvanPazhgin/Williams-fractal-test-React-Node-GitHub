const input_parameters = require('../input_parameters')

function optionsForTest2(interval) {
  class OptionsTemplate {
    constructor(interval) {
      this.symbol = input_parameters.symbol
      this.nameStrategy = `${input_parameters.nameStrategy} на ${interval}`
      this.cdiffShadowBigUser = 0.62 // из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625
      this.takeProfitConst = 0.04
      this.stopLossConst = 0.02
      this.delta = 1.012 // вход на 1.2% выше хая сигнальной свечи
    }
  }
  return new OptionsTemplate(interval)
}

module.exports = optionsForTest2
