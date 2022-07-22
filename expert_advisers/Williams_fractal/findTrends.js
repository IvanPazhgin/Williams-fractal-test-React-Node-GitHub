const timestampToDateHuman = require('./timestampToDateHuman')

function findTrends(arg) {
  let FractalsUp = false // факт наличия фрактала на старшем ТФ
  let FractalsDown = false
  let FractalsUpPrice = 0 // значение цены фрактала
  let FractalsDownPrice = 0
  let FractalUpTime = '' // человеческий вид времи фрактала для проверки работы условий
  let FractalDownTime = ''
  let whatTrend = []
  let numberOfTrend = 0
  let whatTrendFiltered = []
  let j = 0

  for (let i = 4; i < arg.length; i++) {
    // ищем Bearish (медвежий) Fractal. Факртал находится на позиции [i-2]
    if (
      arg[i - 4].highPrice < arg[i - 2].highPrice &&
      arg[i - 3].highPrice < arg[i - 2].highPrice &&
      arg[i - 1].highPrice < arg[i - 2].highPrice &&
      arg[i].highPrice < arg[i - 2].highPrice
    ) {
      FractalsUp = true
      FractalsUpPrice = arg[i - 2].highPrice
      FractalUpTime = arg[i - 2].openTime
    } else {
      // ищем Bullish (бычий) Fractal
      if (
        arg[i - 4].lowPrice > arg[i - 2].lowPrice &&
        arg[i - 3].lowPrice > arg[i - 2].lowPrice &&
        arg[i - 1].lowPrice > arg[i - 2].lowPrice &&
        arg[i].lowPrice > arg[i - 2].lowPrice
      ) {
        FractalsDown = true
        FractalsDownPrice = arg[i - 2].lowPrice
        FractalDownTime = arg[i - 2].openTime
      }
    }
    // определяем тренды
    // PS в реальном времени необходимо сравнивать фрактал с текущей ценой на рынке
    if (FractalsDown) {
      if (arg[i].lowPrice < FractalsDownPrice) {
        whatTrend[numberOfTrend] = {
          trend: 'DownTrend',
          fractalTime: timestampToDateHuman(FractalDownTime),
          // ftactalTimeStamp: FractalDownTime,
          fractalPrice: FractalsDownPrice,
          priceTimeStamp: arg[i].openTime,
          priceTime: timestampToDateHuman(arg[i].openTime),
          price: arg[i].lowPrice, // поле носит чисто ифнормационный характер
        }
        numberOfTrend += 1
        FractalsDown = false
        trendDown = true
        trendUp = false
      }
    }
    if (FractalsUp) {
      if (arg[i].highPrice > FractalsUpPrice) {
        whatTrend[numberOfTrend] = {
          trend: 'UpTrend',
          fractalTime: timestampToDateHuman(FractalUpTime),
          // ftactalTimeStamp: FractalUpTime,
          fractalPrice: FractalsUpPrice,
          priceTimeStamp: arg[i].openTime,
          priceTime: timestampToDateHuman(arg[i].openTime),
          price: arg[i].highPrice, // поле носит чисто ифнормационный характер
        }
        numberOfTrend += 1
        FractalsUp = false
        trendUp = true
        trendDown = false
      }
    }
  }

  console.log('тренды (без фильтрации):')
  console.table(whatTrend)

  // фильтруем массив c трендами: соединяем повторяющиеся тренды
  /*
  whatTrendFiltered[j] = whatTrend[0]
  for (let i = 1; i < whatTrend.length; i++) {
    if (whatTrendFiltered[j].trend == whatTrend[i].trend) continue
    else {
      j++
      whatTrendFiltered[j] = whatTrend[i]
    }
  }  
  console.log('тренды (после фильтрации):')
  console.table(whatTrendFiltered)
  console.log(`общее кол-во трендов = ${whatTrendFiltered.length} шт (вызов по whatTrendFiltered из функции findTrends)`)
  */
  // let startOfTrend = whatTrendFiltered[0].priceTimeStamp

  //return [whatTrendFiltered, startOfTrend]
  //return whatTrendFiltered

  // скорее всего придется передавать массив со сдвигом влево на одну свечу, для проверки условия ниже
  // передаем значения фракталов чтобы начать торговлю на младшем ТФ именно с момента пробития фракталов ценой
  // return [whatTrend, FractalsUpPrice, FractalsDownPrice]

  return whatTrend
}

module.exports = findTrends
