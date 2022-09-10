const elasticClient = require('./elastic.init')

async function elasticTest() {
  // сохраняем одну свечку
  const response = await elasticClient.index({
    index: 'candles',
    //document type: '_doc',
    id: '1',
    //refresh: true,
    body: {
      symbol: 'BELIUSDT',
      interval: '1m', // для обычного запроса и web socket (добавить в lastcandle) будут разные источиники. Можно передавать флаг в качестве источника для универсальности
      exchange: 'binance',
      typeCandle: 'usdm',
      typePrice: 'lastPrice',
      candle: {
        startTime: 'Ned Stark',
        endTime: 'Winter is coming.',
        open: 'Ned Stark',
        close: 'Winter is coming.',
        high: 'Winter is coming.',
        low: 'Winter is coming.',
        volume: 'Winter is coming.',
      },
    },
  })
  await elasticClient.indices.refresh({ index: 'candles' })
  console.log(`отправили свечи в elastic search`)
  console.log(response)

  ////////////////////////
  // отправляем конкретный запрос
  const response2 = await elasticClient.get({
    index: 'candles',
    id: '1',
  })
  console.log(`получили свечи из elastic search`)
  console.log(response2)
  //console.log(response2._source)

  ////////////////////////
  /*
  // поиск (не работает)
  const result = await elasticClient.search({
    index: 'candles',
    query: {
      match: { quote: 'usdm' },
    },
  })
  console.log(result.hits)
  */
}

module.exports = elasticTest
