function testOfNewFuctiouns() {
  workingFunctions()
  //testWilliams() // тест одновременного запуска оповещений на разных стратегиях
  //testBinanceTrade() // тест торговых функций
  //arbitrationTest() // простейший тест арбитража
  //elasticPut() // тест elastic search: put (реализовано в MainAlex)
  //elasticInfo() // тест elastic search: info (работает)
  //elasticPutTest() // тесты с эластик по видео (работает)
  //testTelegramBot()
  //saveCandle() // сохраняем свечи в JSON для тестера (эмуляция elastic)
  //readCandle() // считываем свечи в JSON для тестера (эмуляция elastic)
  //testOnDonwloadCandles() // тестер на основе закаченных свечек
  //testDotJJ() // тест стратегии Точка JJ
}

function workingFunctions() {
  // стратегия 3.7 оповещения на одной монете
  // const alex37tradeMain = require('./expert_advisers/Alex/trade37WS(1symbol)/alex37tradeMain')
  // alex37tradeMain()

  // стратегия 3.7 оповещения на четырех монетах
  //const alex37tradeMain4s = require('./expert_advisers/Alex/trade37WS(4symbols)/alex37tradeMain4s')
  //alex37tradeMain4s()

  // стратегия 3.8 оповещения на восьми монетах
  // const alex38notice8s = require('./expert_advisers/Alex/notice38WS(8s)/alex38notice8s')
  // alex38notice8s()

  // сообщения в tg
  const { tgBotExample } = require('./API/telegram/telegram.bot')
  tgBotExample()

  // оповещения 3.7-3.9 на 12 монетах (24.08.2022)
  // const alex3notice12s = require('./expert_advisers/Alex/notice/notice3WS(12s)/alex3notice12s')
  // alex3notice12s()

  // оповещения 3.8 стандарт и хард (01.09.2022)
  // const alexNoticeMain = require('./expert_advisers/Alex/notice/noticeWS/alexNoticeMain')
  // alexNoticeMain() // оповещения 3.8 и 3.8 hard 31.08.2022

  // оповещения 3.8.2 (05.09.2022)
  const alexNoticeMain382 = require('./expert_advisers/Alex/notice/noticeWS/alex382Notice/alexNoticeMain382')
  alexNoticeMain382()

  // оповещения 3.8.4 (06.09.2022)
  // const alexNoticeMain384 = require('./expert_advisers/Alex/notice/noticeWS/alex384Notice/alexNotMain384')
  // alexNoticeMain384()

  // оповещения 3.8.2.2 (09.09.2022)
  // const alexNoticeMain3822 = require('./expert_advisers/Alex/notice/noticeWS/alex382Notice2/alexNoticeMain3822')
  // alexNoticeMain3822()

  // оповещения 3.8.2.3 на 30m (10.09.2022)
  // const alexNoticeMain3823 = require('./expert_advisers/Alex/notice/noticeWS/alex3823Notice/alexNoticeMain3823')
  // alexNoticeMain3823()

  // оповещения 3.8.2.4 (10.09.2022)
  // const alexNoticeMain3824 = require('./expert_advisers/Alex/notice/noticeWS/alex382Notice4/alexNoticeMain3824')
  // alexNoticeMain3824()

  // оповещения 3.8.2.5 (11.09.2022)
  const alexNoticeMain3825 = require('./expert_advisers/Alex/notice/noticeWS/alex382Notice5/alexNoticeMain3825')
  alexNoticeMain3825()
}

function testBinanceTrade() {
  // эксперименты с торговыми функциями binance
  // SyntaxError: Cannot use import statement outside a module
  // Толя предложил: ищи видос вебпак+тайпскрипт
  const spotTrade = require(`./binance_Engine/tests_Ivan/spot-trade.ts`)
  spotTrade()
}

function saveCandle() {
  // качаем свечи по всем интервалам
  const saveCandleToJSON = require('./expert_advisers/test_on_downloaded/utils/saveCandle')
  saveCandleToJSON()

  // качаем свечи по каждому интвервалу в отдельности
  //const saveCandleToJSONoneInterval = require('./expert_advisers/test_on_downloaded/utils/saveCandle_v1')
  //saveCandleToJSONoneInterval()
}

function readCandle() {
  const readCandleFromJSON = require('./expert_advisers/test_on_downloaded/utils/readCandle')
  const input_parameters = require('./expert_advisers/test_on_downloaded/alex/input_parameters')
  const data = readCandleFromJSON(input_parameters, input_parameters.interval)
  console.table(data)
}

function testOnDonwloadCandles() {
  const testLogics3825 = require('./expert_advisers/test_on_downloaded/alex/testLogics3825')
  const input_parameters = require('./expert_advisers/test_on_downloaded/alex/input_parameters')
  testLogics3825(input_parameters)
}

function testDotJJ() {
  const findCandle = require('./expert_advisers/test_on_downloaded/dotJJ/findCandle')
  findCandle()
}

async function testWilliams() {
  // проверка - возможно ли одновременный запуск web socket для Alex и для Williams fractal
  const getLastCandle4s = require('./API/binance.engine/web.socket.usdm/getLastCandle4s')
  const symbols = ['ETHUSDT', 'BTCUSDT']
  const timeFrame = '1m'
  let lastCandle

  await getLastCandle4s(
    symbols,
    timeFrame,
    async ({
      symbol: symbol,
      startTime: openTime,
      open: openPrice,
      close: closePrice,
      low: lowPrice,
      high: highPrice,
      volume: volume,
      final: final,
    }) => {
      // сохраняем новую свечку
      lastCandle = {
        symbol: symbol,
        openTime: openTime,
        openPrice: openPrice,
        closePrice: closePrice,
        lowPrice: lowPrice,
        highPrice: highPrice,
        volume: volume,
        final: final,
      }
      if (lastCandle.final) {
        console.table(lastCandle)
        console.log(`test of Williams noteice is END`)
        //process.exit(0) // изучить https://runebook.dev/ru/docs/node/process
      }
      console.log(`test of Williams noteice is processing...`)
    }
  )
}

function arbitrationTest() {
  const arbitration = require('./expert_advisers/arbitration/arbitration')
  arbitration()
}

function elasticPut() {
  const elasticPutFromTest = require('./API/elastic.search/elastic.putFtest')
  elasticPutFromTest().catch((err) => {
    console.log(err)
    process.exit(1)
  })
}

function elasticInfo() {
  const elasticInfo = require('./API/elastic.search/elascit.info')
  elasticInfo().catch((err) => {
    console.log(err)
    process.exit(1)
  })
}

function elasticPutTest() {
  const elasticTest = require('./API/elastic.search/elastic.test')
  elasticTest()
}

function alexTestStrategy() {
  //const tradeAlex3bot = require('./expert_advisers/Alex/trade35trade(fail)/alex35.botMain')
  // тесты с получением сигналов на основе стратегии Alex 3.5
  // tradeAlex3bot() // первая попытка разработки слишком сложного торгового робота
}

function alexTradeStrategy() {
  // !!!! const alex35tradeBotWSrjxs = require('./expert_advisers/Alex/trade35WS_RxJS/alex35tradeMain')
  //const alex35tradeBotWSrjxs = require('./expert_advisers/Alex/trade35WS_RxJS/alex351TradeMain')
  // !!!! alex35tradeBotWSrjxs() // вторая попытка (пока без стрима)
}

function testRxJS() {
  //const rxjsexample2 = require('./binance_Engine/tests_Ivan/rxjsExample2')
  // const rxjsExampleObservable = require('./binance_Engine/tests_Ivan/rxjsExample2')
  // rxjsexample2() // примеры rxjs
  //rxjsExampleObservable()
}

function testWebSocket() {
  // тесты с web socket
  // const testWSPublic = require('./binance_Engine/webSocket/examples/ws-public.ts')
  // const testWSClose = require('./binance_Engine/binance_WebSocket/examples/ws-close.ts')
  // const testWSUserData = require('./binance_Engine/binance_WebSocket/examples/ws-userdata.ts')
  // testWSPublic() // работает
  // testWSClose() // пока не работает
  // testWSUserData() // пока не работает
}

function testTelegramBot() {
  // тесты telegram bot's
  // const tgBotExpress = require('./expert_advisers/Alex/trade35WS_RxJS/tg.Bot.Express')
  // tgBotExpress() // не работает

  // попытка разбить "большой" файл на несколько модулей
  //const startGTbot = require('./API/telegram2/startGTbot')
  //const instance = startGTbot.getInstance()

  const getTGid = require('./API/telegram2/get.tg.id')
  getTGid()

  const sendTGmessage = require('./API/telegram2/sendTGmessage')
  sendTGmessage('проверка связи')
}

module.exports = testOfNewFuctiouns
