{
symbol: 'MASKUSDT',
initialMargin: '0',
maintMargin: '0',
unrealizedProfit: '0.00000000',
positionInitialMargin: '0',
openOrderInitialMargin: '0',
leverage: '10', // плечо (current initial leverage)
isolated: true, // изолированная (if the position is isolated)
entryPrice: 0,
maxNotional: '100000',
positionSide: 'BOTH',
positionAmt: 0,
notional: 0,
isolatedWallet: 0,
updateTime: 1665731437113,
bidNotional: '0',
askNotional: '0'
},

{
symbol: 'APEUSDT',
initialMargin: '13.73100000',
maintMargin: '1.37310000',
unrealizedProfit: '-5.97000000',
positionInitialMargin: '13.73100000',
openOrderInitialMargin: '0',
leverage: '10',
isolated: true,
entryPrice: 4.378,
maxNotional: '250000',
positionSide: 'BOTH',
positionAmt: -30,
notional: -137.31,
isolatedWallet: 13.15510562,
updateTime: 1665734403111,
bidNotional: '0',
askNotional: '0'
},

1. считаю кол-во сделок по полю positionAmt
2. если сумма открытых сделок > 0 (или > 4) , то не входим

console.log('getAccountInformation: ', await client.getAccountInformation())

### Account Information V2 (USER_DATA)

https://binance-docs.github.io/apidocs/futures/en/#account-information-v2-user_data

### из библиотеки binance:

getAccountInformation(): Promise<FuturesAccountInformation> {
return this.getPrivate('fapi/v2/account');
}
