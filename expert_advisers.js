function testOfNewFuctiouns() {
  const alex37tradeMain = require('./expert_advisers/Alex/trade37WS(1symbol)/alex37tradeMain')
  //const tradeAlex3bot = require('./expert_advisers/Alex/trade35trade(fail)/alex35.botMain')
  // !!!! const alex35tradeBotWSrjxs = require('./expert_advisers/Alex/trade35WS_RxJS/alex35tradeMain')
  //const alex35tradeBotWSrjxs = require('./expert_advisers/Alex/trade35WS_RxJS/alex351TradeMain')
  // const testWSPublic = require('./binance_Engine/webSocket/examples/ws-public.ts')
  // const testWSClose = require('./binance_Engine/binance_WebSocket/examples/ws-close.ts')
  // const testWSUserData = require('./binance_Engine/binance_WebSocket/examples/ws-userdata.ts')
  // const tgBotExpress = require('./expert_advisers/Alex/trade35WS_RxJS/tg.Bot.Express')
  const {
    tgBotExample,
  } = require('./expert_advisers/Alex/trade35WS_RxJS/telegram.bot')
  //const rxjsexample2 = require('./binance_Engine/tests_Ivan/rxjsExample2')
  // const rxjsExampleObservable = require('./binance_Engine/tests_Ivan/rxjsExample2')

  // тесты с получением сигналов на основе стратегии Alex 3.5
  // tradeAlex3bot() // первая попытка разработки слишком сложного торгового робота
  // !!!! alex35tradeBotWSrjxs() // вторая попытка (пока без стрима)
  alex37tradeMain()
  // rxjsexample2() // примеры rxjs
  //rxjsExampleObservable()

  // тесты с web socket
  // testWSPublic() // работает
  // testWSClose() // пока не работает
  // testWSUserData() // пока не работает

  // тесты telegram bot's
  // tgBotExpress() // не работает
  tgBotExample()
}

module.exports = testOfNewFuctiouns
