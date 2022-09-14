const input_parameters = require('../input_parameters')
const { intervalObject } = require('./intervals')

// подготавливаем настройки для сохранения статистики в файлы
const optionsForSaveStat4h = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame4h,
  nameStrategy: input_parameters.nameStrategy,
  market: input_parameters.market,
  comment: 'statistics',
}

const optionsForSaveStat2h = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame2h,
  nameStrategy: input_parameters.nameStrategy,
  market: input_parameters.market,
  comment: 'statistics',
}

const optionsForSaveStat1h = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame1h,
  nameStrategy: input_parameters.nameStrategy,
  market: input_parameters.market,
  comment: 'statistics',
}

const optionsForSaveStat30m = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame30m,
  nameStrategy: input_parameters.nameStrategy,
  market: input_parameters.market,
  comment: 'statistics',
}

const optionsForSaveStat15m = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame15m,
  nameStrategy: input_parameters.nameStrategy,
  market: input_parameters.market,
  comment: 'statistics',
}

const optionsForSaveStat5m = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: intervalObject.timeFrame5m,
  nameStrategy: input_parameters.nameStrategy,
  market: input_parameters.market,
  comment: 'statistics',
}

const optionsForSaveStatAll = {
  symbol: input_parameters.symbol,
  year: input_parameters.year,
  interval: 'all',
  nameStrategy: input_parameters.nameStrategy,
  market: input_parameters.market,
  comment: 'statistics',
}

const optionsForSaveStat = {
  optionsForSaveStat4h: optionsForSaveStat4h,
  optionsForSaveStat2h: optionsForSaveStat2h,
  optionsForSaveStat1h: optionsForSaveStat1h,
  optionsForSaveStat30m: optionsForSaveStat30m,
  optionsForSaveStat15m: optionsForSaveStat15m,
  optionsForSaveStat5m: optionsForSaveStat5m,
  optionsForSaveStatAll: optionsForSaveStatAll,
}

module.exports = optionsForSaveStat
