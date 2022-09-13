const input_parameters = require('../input_parameters')
const { intervalObject } = require('./intervals')

// подготавливаем настройки для сохранения сделок в файлы
// !! сделать через класс

const optionsForSave4h = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame4h,
  nameStrategy: input_parameters.nameStrategy,
  comment: 'deals',
}

const optionsForSave2h = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame2h,
  nameStrategy: input_parameters.nameStrategy,
  comment: 'deals',
}

const optionsForSave1h = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame1h,
  nameStrategy: input_parameters.nameStrategy,
  comment: 'deals',
}

const optionsForSave30m = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame30m,
  nameStrategy: input_parameters.nameStrategy,
  comment: 'deals',
}

const optionsForSave15m = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame15m,
  nameStrategy: input_parameters.nameStrategy,
  comment: 'deals',
}

const optionsForSaveDeals = {
  optionsForSave4h: optionsForSave4h,
  optionsForSave2h: optionsForSave2h,
  optionsForSave1h: optionsForSave1h,
  optionsForSave30m: optionsForSave30m,
  optionsForSave15m: optionsForSave15m,
}

module.exports = optionsForSaveDeals
