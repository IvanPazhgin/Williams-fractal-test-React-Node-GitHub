const optionsOfTrade = {
  entryAmountPercent: 50, // trigger trade with 50%
  multiplier: 1, // плечо
}

const apiOptionsIvan = {
  name: 'ivan',
  api_key: '2MqDbjP8Y8dmTd8BzZeXRenyucmuSvZk5C18OJM4AqjYRcv2uUEUo5BJO83EqaPP',
  api_secret:
    'FfWpiqyy3E1Ok3dwBjTWtI1PHS2yqHyelTDmdqdRqWZSs4egnlnmmnFk4H0us3v3',
}

const apiOptionsAlex = { name: 'Alex' }

const response = {
  orderId: 3331521586,
  symbol: 'BELUSDT',
  status: 'NEW',
  clientOrderId: 'x-15PC4ZJyUKl-74Vw4CCYR2g5Y1qC0keGu',
  price: 0,
  avgPrice: '0.00000',
  origQty: 13,
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
  updateTime: 1665379098303,
  name: 'ivan',
}

module.exports = { optionsOfTrade, apiOptionsIvan, apiOptionsAlex, response }
