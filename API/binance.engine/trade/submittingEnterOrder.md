### текущий ордер состоит из 5 параметров:

const orderRequest = {
symbol: symbol,
//quantity: amountForDeal, // не учитывает плечо
quantity: quantity,
side: side,
type: 'MARKET',
newOrderRespType: 'FULL',
}

### где newOrderRespType:

ACK = confirmation of order acceptance (no placement/fill information) -> OrderResponseACK
RESULT = fill state -> OrderResponseResult
FULL = fill state + detail on fills and other detail -> OrderResponseFull

### в библиотеке binance указаны все поля:

node_modules\binance\lib\types\futures.d.ts

export interface NewFuturesOrderParams<numberType = number> {
symbol: string;
side: OrderSide;
positionSide?: PositionSide;
type: FuturesOrderType;
timeInForce?: OrderTimeInForce;
quantity?: numberType;
reduceOnly?: BooleanString;
price?: numberType;
newClientOrderId?: string;
stopPrice?: numberType;
closePosition?: BooleanString;
activationPrice?: numberType;
callbackRate?: numberType;
workingType?: WorkingType;
priceProtect?: BooleanStringCapitalised;
newOrderRespType?: OrderResponseType;
}

### сравнить поля с мануалом New Order (TRADE)

https://binance-docs.github.io/apidocs/futures/en/#new-order-trade

### Time in force (timeInForce):

GTC - Good Till Cancel
IOC - Immediate or Cancel
FOK - Fill or Kill
GTX - Good Till Crossing (Post Only)
