const input_parameters = require('../input_parameters')
//const { intervalObject } = require('../../common.files/intervals')

// подготавливаем настройки для сохранения сделок в файлы
// !! сделать через класс
class OptionsForStatistics {
  constructor(options) {
    this.symbol = input_parameters.symbol
    this.year = input_parameters.year
    this.interval = options
    this.nameStrategy = input_parameters.nameStrategy
    this.market = input_parameters.market
    this.comment = 'statistics'
  }
}

const optionsForStatistics_2h_5m = new OptionsForStatistics('2h_5m')

const optionsForStatistics = {
  optionsForStatistics_2h_5m: optionsForStatistics_2h_5m,
}

module.exports = optionsForStatistics
