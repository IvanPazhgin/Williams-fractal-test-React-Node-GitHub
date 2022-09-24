const { input_parameters } = require('../input_parameters')

class OptionsForSave {
  constructor(intervalSenior, intervalJunior, comment) {
    this.symbol = input_parameters.symbol
    this.year = input_parameters.year
    this.interval = intervalSenior + '_' + intervalJunior
    this.nameStrategy = input_parameters.nameStrategy
    this.market = input_parameters.market
    this.comment = comment
  }
}

module.exports = OptionsForSave

/*
let options = {
  intervalSenior,
  intervalJunior,
  comment,
}
*/
