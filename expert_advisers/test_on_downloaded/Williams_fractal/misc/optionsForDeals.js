const input_parameters = require('../input_parameters')
//const { intervalObject } = require('../../common.files/intervals')

// подготавливаем настройки для сохранения сделок в файлы
// !! сделать через класс
class OptionsForDeals {
  constructor(options) {
    this.symbol = input_parameters.symbol
    this.year = input_parameters.year
    this.interval = options
    this.nameStrategy = input_parameters.nameStrategy
    this.market = input_parameters.market
    this.comment = 'deals'
  }
}

const optionsForDeals_2h_5m = new OptionsForDeals('2h_5m')

const optionsForDeals = {
  optionsForDeals_2h_5m: optionsForDeals_2h_5m,
}

module.exports = optionsForDeals
