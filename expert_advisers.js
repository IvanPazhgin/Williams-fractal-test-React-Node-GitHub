function testOfNewFuctiouns() {
  // !!!!! const alex37tradeMain = require('./expert_advisers/Alex/trade37WS(1symbol)/alex37tradeMain')
  const alex37tradeMain4s = require('./expert_advisers/Alex/trade37WS(4symbols)/alex37tradeMain4s')
  const { tgBotExample } = require('./API/telegram/telegram.bot')
  //const tradeAlex3bot = require('./expert_advisers/Alex/trade35trade(fail)/alex35.botMain')
  // !!!! const alex35tradeBotWSrjxs = require('./expert_advisers/Alex/trade35WS_RxJS/alex35tradeMain')
  //const alex35tradeBotWSrjxs = require('./expert_advisers/Alex/trade35WS_RxJS/alex351TradeMain')
  // const testWSPublic = require('./binance_Engine/webSocket/examples/ws-public.ts')
  // const testWSClose = require('./binance_Engine/binance_WebSocket/examples/ws-close.ts')
  // const testWSUserData = require('./binance_Engine/binance_WebSocket/examples/ws-userdata.ts')
  // const tgBotExpress = require('./expert_advisers/Alex/trade35WS_RxJS/tg.Bot.Express')
  // !!!! const {tgBotExample} = require('./expert_advisers/Alex/trade35WS_RxJS/telegram.bot')
  //const rxjsexample2 = require('./binance_Engine/tests_Ivan/rxjsExample2')
  // const rxjsExampleObservable = require('./binance_Engine/tests_Ivan/rxjsExample2')

  // тесты с получением сигналов на основе стратегии Alex 3.5
  // tradeAlex3bot() // первая попытка разработки слишком сложного торгового робота
  // !!!! alex35tradeBotWSrjxs() // вторая попытка (пока без стрима)
  // !!!! alex37tradeMain() // стратегия 3.7 оповещения на одной монете
  alex37tradeMain4s() // стратегия 3.7 оповещения на четырех монетах
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
