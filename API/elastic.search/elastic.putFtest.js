const elasticClient = require('./elastic.init')

/*
async function elasticPutFromTest(symbol, interval, candles) {
  // let response = new elasticClient()
  for (let i = 0; i < candles.lenght; i++) {
    await elasticClient.index({
      index: 'candles',
      //document type: '_doc',
      //refresh: true,
      document: {
        symbol: symbol,
        interval: interval, // для обычного запроса и web socket (добавить в lastcandle) будут разные источиники. Можно передавать флаг в качестве источника для универсальности
        exchange: 'binance',
        typeCandle: 'usdm',
        typePrice: 'lastPrice',
        candle: {
          startTime: candles.openTime,
          endTime: candles.closeTime,
          open: candles.openPrice,
          close: candles.closePrice,
          high: candles.highPrice,
          low: candles.lowPrice,
          volume: candles.volume,
        },
      },
    })
  }

  await elasticClient.indices.refresh({ index: 'candles' })

  console.log(`отправили свечи в elastic search`)
  //console.log(response)
}
*/

// желаемая структура в БД
/*
async function prepairData() {
  await elasticClient.indices.create({
    index: 'candles',
    body: {
      mappings: {
        dynamic: 'strict',
        properties: {
          symbol: { type: 'text' },
          interval: { type: 'text' },
          exchange: { type: 'text' },
          typeCandle: { type: 'text' },
          typePrice: { type: 'text' },
          candle: {
            startTime: { type: 'integer' },
            endTime: { type: 'integer' },
            open: { type: 'float' },
            close: { type: 'float' },
            high: { type: 'float' },
            low: { type: 'float' },
            volume: { type: 'float' },
          },
        },
      },
    },
  })
}
*/

// структура данных под пример из видео
async function prepairData() {
  await elasticClient.indices.create({
    index: 'candles',
    body: {
      mappings: {
        dynamic: 'strict',
        properties: {
          openTime: { type: 'integer' },
          closeTime: { type: 'integer' },
          openPrice: { type: 'float' },
          closePrice: { type: 'float' },
          highPrice: { type: 'float' },
          lowPrice: { type: 'float' },
          volume: { type: 'float' },
        },
      },
    },
  })
}

async function index(symbol, interval, candles) {
  console.log(`index: длина массива = ${candles.length}`)
  const result = await elasticClient.helpers.bulk({
    // ConfigurationError: bulk helper: the datasource is required (Ошибка конфигурации: массовый помощник: требуется источник данных)
    // https://youtu.be/Jk4_4k1N3yw?t=2233
    candles,
    onDocument(doc) {
      return {
        index: { _index: 'candles' },
      }
    },
  })
  console.log(result)
}

async function elasticPutFromTest(symbol, interval, candles) {
  console.log(`elasticPutFromTest: длина массива = ${candles.length}`)
  prepairData()
    .then(index(symbol, interval, candles))
    .catch((err) => {
      console.log(err)
      process.exit(1)
    })
}

module.exports = elasticPutFromTest
