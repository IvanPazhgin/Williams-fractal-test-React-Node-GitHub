const { MainClient } = require('binance')

function binanceSPOTClient(api_option) {
  const key = process.env.APIKEY || api_option.api_key
  const secret = process.env.APISECRET || api_option.api_secret

  const client = new MainClient({
    api_key: key,
    api_secret: secret,
    beautifyResponses: true,
  })

  return client
}

module.exports = binanceSPOTClient
