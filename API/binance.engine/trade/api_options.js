const optionsOfTrade = {
  entryAmountPercent: 33, // trigger trade with 33%
  multiplier: 10, // плечо
}

const apiOptionsIvan = {
  name: 'Ivan',
  api_key: '2MqDbjP8Y8dmTd8BzZeXRenyucmuSvZk5C18OJM4AqjYRcv2uUEUo5BJO83EqaPP',
  api_secret:
    'FfWpiqyy3E1Ok3dwBjTWtI1PHS2yqHyelTDmdqdRqWZSs4egnlnmmnFk4H0us3v3',
}

const apiOptionsAlex = { name: 'Alex' }

const response = {
  orderId: 3046860969,
  symbol: 'CHRUSDT',
  status: 'NEW',
  clientOrderId: 'x-15PC4ZJyMkh4psYPUXlf-3r_DlsEtGRF2',
  price: 0,
  avgPrice: '0.0000',
  origQty: 540,
  executedQty: 0,
  cumQty: '0',
  cumQuote: '0',
  timeInForce: 'GTC',
  type: 'MARKET',
  reduceOnly: false,
  closePosition: false,
  side: 'BUY',
  positionSide: 'BOTH',
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'MARKET',
  updateTime: 1665564682635,
  name: 'Ivan',
}

module.exports = { optionsOfTrade, apiOptionsIvan, apiOptionsAlex, response }
