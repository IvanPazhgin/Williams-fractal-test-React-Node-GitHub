const input_parameters = require('../input_parameters')
const { intervalObject } = require('./intervals')

/*
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

const options4h = new OptionsTemplate(intervalObject.timeFrame4h)
const options2h = new OptionsTemplate(intervalObject.timeFrame2h)
const options1h = new OptionsTemplate(intervalObject.timeFrame1h)
const options30m = new OptionsTemplate(intervalObject.timeFrame30m)
const options15m = new OptionsTemplate(intervalObject.timeFrame15m)
*/

// запилить через класс, который описан выше
const options4h = {
  symbol: input_parameters.symbol,
  nameStrategy: `${input_parameters.nameStrategy} на ${intervalObject.timeFrame4h}`,

  diffShadowBigUser: 0.62, // из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625
  takeProfitConst: 0.04,
  stopLossConst: 0.02,
  delta: 1.012, // вход на 1.2% выше хая сигнальной свечи
}

const options2h = {
  symbol: input_parameters.symbol,
  nameStrategy: `${input_parameters.nameStrategy} на ${intervalObject.timeFrame2h}`,

  diffShadowBigUser: 0.62, // из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625
  takeProfitConst: 0.04,
  stopLossConst: 0.02,
  delta: 1.012, // вход на 1.2% выше хая сигнальной свечи
}

const options1h = {
  symbol: input_parameters.symbol,
  nameStrategy: `${input_parameters.nameStrategy} на ${intervalObject.timeFrame1h}`,

  diffShadowBigUser: 0.62, // из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625
  takeProfitConst: 0.04,
  stopLossConst: 0.02,
  delta: 1.012, // вход на 1.2% выше хая сигнальной свечи
}

const options30m = {
  symbol: input_parameters.symbol,
  nameStrategy: `${input_parameters.nameStrategy} на ${intervalObject.timeFrame30m}`,

  diffShadowBigUser: 0.62, // из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625
  takeProfitConst: 0.04,
  stopLossConst: 0.02,
  delta: 1.012, // вход на 1.2% выше хая сигнальной свечи
}

const options15m = {
  symbol: input_parameters.symbol,
  nameStrategy: `${input_parameters.nameStrategy} на ${intervalObject.timeFrame15m}`,

  diffShadowBigUser: 0.62, // из примеров Алекса получилось: 0.62. ПРОТЕСТИРОВАТЬ в диапозоне: 0.139 - 0.625
  takeProfitConst: 0.04,
  stopLossConst: 0.02,
  delta: 1.012, // вход на 1.2% выше хая сигнальной свечи
}

const optionsForTest = {
  options4h: options4h,
  options2h: options2h,
  options1h: options1h,
  options30m: options30m,
  options15m: options15m,
}

/*
console.log(`тип options4h = ${typeof options4h}`)
console.log(options4h)
console.log(optionsForTest)
*/

module.exports = optionsForTest
