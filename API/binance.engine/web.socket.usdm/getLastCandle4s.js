const { WebsocketClient, isWsFormattedKline } = require('binance')

// оформить в singletone - binanceWsClient в отдельный файл
// далее мы можем получить к ней доступ из любого файла
// чтобы остановить скрипт - binanceWsClient.close

async function getLastCandle4s(symbols, timeFrames, callback) {
  // ;(async () => {
  const binanceWsClient = new WebsocketClient({
    // api_key: key,
    // api_secret: secret,
    beautify: true,
  })

  binanceWsClient.on('formattedMessage', (data) => {
    //  use a supplied type guard
    if (isWsFormattedKline(data)) {
      //console.log('kline received: ', data.kline)
      //if (data.kline.final) {
      //console.table(data.kline)
      return callback(data.kline)
      //}

      /*
        if (data.kline.final) {
          console.log('найдена закрытая свеча: ', data.kline)
          // binanceWsClient.close(wsKey, false)
          // return data.kline
        }
        */

      return
    }

    // console.log('log formattedMessage: ', data)
  })

  binanceWsClient.on('open', (data) => {
    console.log('connection opened open:', data.wsKey, data.ws.target.url)
  })

  // response to command sent via WS stream (e.g LIST_SUBSCRIPTIONS)
  binanceWsClient.on('reply', (data) => {
    console.log('log reply: ', JSON.stringify(data, null, 2))
  })
  binanceWsClient.on('reconnecting', (data) => {
    console.log('ws automatically reconnecting.... ', data?.wsKey)
  })
  binanceWsClient.on('reconnected', (data) => {
    console.log('ws has reconnected ', data?.wsKey)
  })

  //binanceWsClient.subscribeKlines(symbolObj.symbol, timeFrame, 'usdm')
  symbols.forEach(function (symbol, i, arg) {
    //binanceWsClient.subscribeKlines(item, timeFrame, 'usdm')
    timeFrames.forEach(function (timeFrame, i, arg) {
      binanceWsClient.subscribeKlines(symbol, timeFrame, 'usdm')
    })
  })
  //})()
}

module.exports = getLastCandle4s
